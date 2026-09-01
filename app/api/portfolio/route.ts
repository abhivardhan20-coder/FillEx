import { getDatabase } from '@/lib/server/database';
import { getSiteUser } from '@/lib/server/site-user';

export async function GET() {
  const user = await getSiteUser();
  if (!user) return Response.json({ authenticated: false, positions: [], accounts: [], jobs: [] });
  try {
    const database = getDatabase();
    const [positions, accounts, jobs] = await Promise.all([
      database.prepare(`
        SELECT p.security_id AS securityId, s.isin, COALESCE(s.company_name, s.nse_symbol, s.bse_symbol, p.security_id) AS name,
          COALESCE(s.nse_symbol, s.bse_symbol, p.security_id) AS symbol, p.quantity,
          p.weighted_average_price AS averagePrice, p.invested_value AS investedValue,
          p.current_value AS currentValue, p.unrealized_pnl AS unrealizedPnl,
          p.last_calculated_at AS lastCalculatedAt,
          GROUP_CONCAT(DISTINCT h.source) AS sources,
          MAX(h.source_timestamp) AS sourceTimestamp
        FROM portfolio_positions p
        INNER JOIN securities s ON s.security_id = p.security_id
        LEFT JOIN broker_accounts a ON a.user_id = p.user_id AND a.status != 'DISCONNECTED'
        LEFT JOIN broker_holdings h ON h.broker_account_id = a.id AND h.security_id = p.security_id
        WHERE p.user_id = ?
        GROUP BY p.security_id
        ORDER BY COALESCE(p.current_value, p.invested_value, 0) DESC
      `).bind(user.id).all(),
      database.prepare(`
        SELECT id, broker, status, last_sync_at AS lastSyncAt
        FROM broker_accounts WHERE user_id = ? ORDER BY created_at
      `).bind(user.id).all(),
      database.prepare(`
        SELECT status, COUNT(*) AS count
        FROM ingestion_jobs WHERE user_id = ? AND job_type = 'PORTFOLIO_SYNC'
        GROUP BY status
      `).bind(user.id).all(),
    ]);
    return Response.json({ authenticated: true, positions: positions.results, accounts: accounts.results, jobs: jobs.results });
  } catch {
    return Response.json({ authenticated: true, positions: [], accounts: [], jobs: [], setupRequired: true });
  }
}
