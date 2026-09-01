import { BrokerAdapterError, fetchBrokerPortfolio } from '@/lib/brokers/adapters';
import { normalizeBrokerPortfolio } from '@/lib/brokers/normalize';
import { brokerIds, type BrokerId } from '@/lib/brokers/providers';
import { generateGrowwAccessToken } from '@/lib/brokers/groww-auth';
import { getDatabase } from '@/lib/server/database';
import { decryptBrokerSecret, encryptBrokerSecret } from '@/lib/server/secret-crypto';

type Job = { id: string; userId: string; brokerAccountId: string; attempts: number };
type Account = { id: string; userId: string; broker: string; encryptedAccessToken: string; tokenExpiresAt: string | null; status: string };

function workerAuthorized(request: Request) {
  const secret = process.env.INGESTION_WORKER_SECRET;
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`);
}

async function claimJob() {
  return getDatabase().prepare(`
    UPDATE ingestion_jobs
    SET status = 'FETCHING', attempts = attempts + 1, started_at = datetime('now'), last_error = NULL
    WHERE id = (
      SELECT id FROM ingestion_jobs
      WHERE job_type = 'PORTFOLIO_SYNC' AND (
        status = 'DISCOVERED'
        OR (status = 'RETRY' AND started_at <= datetime('now'))
        OR (status = 'FETCHING' AND started_at <= datetime('now', '-5 minutes'))
      )
      ORDER BY priority ASC, created_at ASC LIMIT 1
    )
    RETURNING id, user_id AS userId, broker_account_id AS brokerAccountId, attempts
  `).first<Job>();
}

async function finishWithError(job: Job, reason: unknown) {
  const database = getDatabase();
  const adapterError = reason instanceof BrokerAdapterError ? reason : null;
  const authFailure = adapterError?.kind === 'AUTH';
  const rateLimited = adapterError?.kind === 'RATE_LIMIT';
  const retry = !authFailure && job.attempts < 3;
  const jobStatus = retry ? 'RETRY' : 'FAILED';
  const accountStatus = authFailure ? 'REAUTH_REQUIRED' : rateLimited ? 'RATE_LIMITED' : 'SYNC_FAILED';
  const safeMessage = authFailure
    ? 'Broker authorization must be renewed.'
    : rateLimited
      ? 'Broker rate limit reached; retry scheduled.'
      : retry
        ? 'Temporary portfolio sync failure; retry scheduled.'
        : 'Portfolio sync failed after retries.';
  await database.batch([
    database.prepare(`
      UPDATE ingestion_jobs SET status = ?, last_error = ?,
        started_at = CASE WHEN ? = 'RETRY' THEN datetime('now', '+2 minutes') ELSE started_at END,
        completed_at = CASE WHEN ? = 'FAILED' THEN datetime('now') ELSE NULL END
      WHERE id = ?
    `).bind(jobStatus, safeMessage, jobStatus, jobStatus, job.id),
    database.prepare('UPDATE broker_accounts SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(accountStatus, job.brokerAccountId),
  ]);
  return { id: job.id, status: jobStatus };
}

async function processJob(job: Job) {
  const database = getDatabase();
  try {
    const account = await database.prepare(`
      SELECT id, user_id AS userId, broker, encrypted_access_token AS encryptedAccessToken,
        token_expires_at AS tokenExpiresAt, status
      FROM broker_accounts WHERE id = ? AND user_id = ?
    `).bind(job.brokerAccountId, job.userId).first<Account>();
    if (!account || account.status === 'DISCONNECTED') throw new BrokerAdapterError('AUTH', 'Broker account is unavailable.');
    if (!brokerIds.includes(account.broker as BrokerId)) throw new BrokerAdapterError('UPSTREAM', 'Broker is unsupported.');

    let accessToken = await decryptBrokerSecret(account.encryptedAccessToken);
    async function renewGrowwToken() {
      const generated = await generateGrowwAccessToken();
      accessToken = generated.accessToken;
      const encryptedAccessToken = await encryptBrokerSecret(accessToken);
      await database.prepare(`
        UPDATE broker_accounts SET encrypted_access_token = ?, token_expires_at = ?, updated_at = datetime('now')
        WHERE id = ?
      `).bind(encryptedAccessToken, generated.expiresAt, account!.id).run();
    }
    if (account.broker === 'groww' && account.tokenExpiresAt && new Date(account.tokenExpiresAt).getTime() <= Date.now() + 60_000) {
      await renewGrowwToken();
    }
    let rawPortfolio;
    try {
      rawPortfolio = await fetchBrokerPortfolio(account.broker as BrokerId, accessToken);
    } catch (reason) {
      if (account.broker !== 'groww' || !(reason instanceof BrokerAdapterError) || reason.kind !== 'AUTH') throw reason;
      await renewGrowwToken();
      rawPortfolio = await fetchBrokerPortfolio(account.broker as BrokerId, accessToken);
    }
    const normalized = normalizeBrokerPortfolio(
      account.broker as BrokerId,
      rawPortfolio,
    );

    const knownResult = await database.prepare('SELECT security_id AS securityId FROM securities').all<{ securityId: string }>();
    const knownSecurityIds = new Set(knownResult.results.map((item) => item.securityId));
    const statements = [database.prepare('DELETE FROM broker_holdings WHERE broker_account_id = ?').bind(account.id)];
    const enqueuedSecurityIds = new Set<string>();

    for (const holding of normalized) {
      const nseSymbol = holding.exchange.toUpperCase() === 'NSE' ? holding.tradingSymbol : null;
      const bseSymbol = holding.exchange.toUpperCase() === 'BSE' ? holding.tradingSymbol : null;
      statements.push(database.prepare(`
        INSERT INTO securities (security_id, isin, company_name, nse_symbol, bse_symbol)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(security_id) DO UPDATE SET
          isin = COALESCE(excluded.isin, securities.isin),
          company_name = COALESCE(excluded.company_name, securities.company_name),
          nse_symbol = COALESCE(excluded.nse_symbol, securities.nse_symbol),
          bse_symbol = COALESCE(excluded.bse_symbol, securities.bse_symbol),
          updated_at = datetime('now')
      `).bind(holding.securityId, holding.isin, holding.companyName, nseSymbol, bseSymbol));
      statements.push(database.prepare(`
        INSERT INTO broker_holdings (
          id, broker_account_id, security_id, isin, trading_symbol, company_name, exchange,
          quantity, average_price, last_price, invested_value, current_value, unrealized_pnl,
          unrealized_pnl_percent, realized_pnl, t1_quantity, pledged_quantity, product_type,
          provider_instrument_id, source, source_timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(), account.id, holding.securityId, holding.isin, holding.tradingSymbol,
        holding.companyName, holding.exchange, holding.quantity, holding.averagePrice, holding.lastPrice,
        holding.investedValue, holding.currentValue, holding.unrealizedPnl, holding.unrealizedPnlPercent,
        holding.realizedPnl, holding.t1Quantity, holding.pledgedQuantity, holding.productType,
        holding.providerInstrumentId, holding.source, holding.sourceTimestamp,
      ));
      if (holding.providerInstrumentId) {
        statements.push(database.prepare(`
          INSERT INTO security_provider_mapping (security_id, provider, provider_instrument_id, provider_symbol, exchange)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(provider, provider_instrument_id) DO UPDATE SET
            security_id = excluded.security_id, provider_symbol = excluded.provider_symbol, exchange = excluded.exchange
        `).bind(holding.securityId, holding.source, holding.providerInstrumentId, holding.tradingSymbol, holding.exchange));
      }
      if (!knownSecurityIds.has(holding.securityId) && !enqueuedSecurityIds.has(holding.securityId)) {
        enqueuedSecurityIds.add(holding.securityId);
        statements.push(database.prepare(`
          INSERT INTO ingestion_jobs (id, user_id, security_id, broker_account_id, job_type, status, priority)
          VALUES (?, ?, ?, ?, 'SECURITY_DISCOVERY', 'DISCOVERED', 50)
        `).bind(crypto.randomUUID(), account.userId, holding.securityId, account.id));
      }
    }

    statements.push(database.prepare('DELETE FROM portfolio_positions WHERE user_id = ?').bind(account.userId));
    statements.push(database.prepare(`
      INSERT INTO portfolio_positions (
        user_id, security_id, quantity, weighted_average_price, invested_value,
        current_value, unrealized_pnl, last_calculated_at
      )
      SELECT ?, h.security_id, SUM(h.quantity),
        CASE WHEN SUM(h.quantity) = 0 THEN NULL ELSE SUM(COALESCE(h.average_price, 0) * h.quantity) / SUM(h.quantity) END,
        SUM(h.invested_value), SUM(h.current_value), SUM(h.unrealized_pnl), datetime('now')
      FROM broker_holdings h
      INNER JOIN broker_accounts a ON a.id = h.broker_account_id
      WHERE a.user_id = ? AND a.status != 'DISCONNECTED'
      GROUP BY h.security_id
    `).bind(account.userId, account.userId));
    statements.push(database.prepare(`UPDATE broker_accounts SET status = 'CONNECTED', last_sync_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`).bind(account.id));
    statements.push(database.prepare(`UPDATE ingestion_jobs SET status = 'COMPLETE', completed_at = datetime('now'), last_error = NULL WHERE id = ?`).bind(job.id));
    await database.batch(statements);
    return { id: job.id, status: 'COMPLETE', holdings: normalized.length, discovered: enqueuedSecurityIds.size };
  } catch (reason) {
    return finishWithError(job, reason);
  }
}

export async function POST(request: Request) {
  if (!workerAuthorized(request)) return Response.json({ error: 'Worker authorization failed.' }, { status: 401 });
  const requested = Number(new URL(request.url).searchParams.get('limit') ?? '1');
  const limit = Math.max(1, Math.min(Number.isFinite(requested) ? requested : 1, 5));
  const processed = [];
  for (let index = 0; index < limit; index += 1) {
    const job = await claimJob();
    if (!job?.brokerAccountId) break;
    processed.push(await processJob(job));
  }
  return Response.json({ processed, remaining: processed.length === limit });
}
