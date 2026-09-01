import { getDatabase } from '@/lib/server/database';
import { encryptBrokerSecret } from '@/lib/server/secret-crypto';
import { getSiteUser } from '@/lib/server/site-user';
import { kickPortfolioWorker } from '@/lib/server/portfolio-worker';
import { generateGrowwAccessToken } from '@/lib/brokers/groww-auth';

function nextGrowwExpiry() {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setUTCHours(0, 30, 0, 0);
  if (expiry <= now) expiry.setUTCDate(expiry.getUTCDate() + 1);
  return expiry.toISOString();
}

export async function POST(request: Request) {
  const user = await getSiteUser();
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  if (!process.env.BROKER_TOKEN_ENCRYPTION_KEY) return Response.json({ error: 'Secure broker storage is not configured.' }, { status: 503 });
  const payload = await request.json().catch(() => ({})) as { provider?: string; accessToken?: string };
  let accessToken = payload.accessToken?.trim() || process.env.GROWW_ACCESS_TOKEN?.trim();
  let tokenExpiresAt: string | null = null;
  if (!accessToken && process.env.GROWW_API_KEY && process.env.GROWW_API_SECRET) {
    try {
      const generated = await generateGrowwAccessToken();
      accessToken = generated.accessToken;
      tokenExpiresAt = generated.expiresAt;
    } catch {
      return Response.json({ error: 'Groww access could not be authorized. Confirm today’s approval in Groww Trading APIs.' }, { status: 401 });
    }
  }
  if (payload.provider !== 'groww' || !accessToken || accessToken.length > 10_000) {
    return Response.json({ error: 'Enter a valid Groww access token.' }, { status: 400 });
  }

  const verification = await fetch('https://api.groww.in/v1/holdings/user', {
    headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}`, 'X-API-VERSION': '1.0' },
    cache: 'no-store',
  }).catch(() => null);
  if (!verification?.ok) {
    const status = verification?.status === 429 ? 429 : 401;
    return Response.json({ error: status === 429 ? 'Groww is rate limiting requests. Try again shortly.' : 'Groww did not accept this access token.' }, { status });
  }

  const database = getDatabase();
  const encryptedAccessToken = await encryptBrokerSecret(accessToken);
  const existing = await database.prepare("SELECT id FROM broker_accounts WHERE user_id = ? AND broker = 'groww' ORDER BY created_at LIMIT 1").bind(user.id).first<{ id: string }>();
  const accountId = existing?.id ?? crypto.randomUUID();
  const statements = [database.prepare(`
    INSERT INTO users (id, email) VALUES (?, ?)
    ON CONFLICT(id) DO UPDATE SET email = COALESCE(excluded.email, users.email), updated_at = datetime('now')
  `).bind(user.id, user.email)];
  if (existing) {
    statements.push(database.prepare(`
      UPDATE broker_accounts SET encrypted_access_token = ?, encrypted_refresh_token = NULL,
        token_expires_at = ?, status = 'CONNECTED', updated_at = datetime('now') WHERE id = ?
    `).bind(encryptedAccessToken, tokenExpiresAt ?? nextGrowwExpiry(), accountId));
  } else {
    statements.push(database.prepare(`
      INSERT INTO broker_accounts (id, user_id, broker, encrypted_access_token, token_expires_at)
      VALUES (?, ?, 'groww', ?, ?)
    `).bind(accountId, user.id, encryptedAccessToken, tokenExpiresAt ?? nextGrowwExpiry()));
  }
  statements.push(database.prepare(`
    INSERT INTO ingestion_jobs (id, user_id, broker_account_id, job_type, status, priority)
    VALUES (?, ?, ?, 'PORTFOLIO_SYNC', 'DISCOVERED', 10)
  `).bind(crypto.randomUUID(), user.id, accountId));
  await database.batch(statements);
  kickPortfolioWorker(new URL(request.url).origin);
  return Response.json({ connected: true, accountId, syncStatus: 'DISCOVERED' }, { status: 201 });
}
