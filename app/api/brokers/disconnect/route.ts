import { getDatabase } from '@/lib/server/database';
import { getSiteUser } from '@/lib/server/site-user';

export async function POST(request: Request) {
  const user = await getSiteUser();
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  const payload = await request.json().catch(() => ({})) as { accountId?: string };
  if (!payload.accountId) return Response.json({ error: 'Broker account is required.' }, { status: 400 });
  const database = getDatabase();
  const account = await database.prepare('SELECT id FROM broker_accounts WHERE id = ? AND user_id = ?').bind(payload.accountId, user.id).first();
  if (!account) return Response.json({ error: 'Broker account was not found.' }, { status: 404 });
  await database.batch([
    database.prepare("UPDATE broker_accounts SET status = 'DISCONNECTED', encrypted_access_token = '', encrypted_refresh_token = NULL, token_expires_at = NULL, updated_at = datetime('now') WHERE id = ?").bind(payload.accountId),
    database.prepare('DELETE FROM portfolio_positions WHERE user_id = ?').bind(user.id),
    database.prepare(`
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
    `).bind(user.id, user.id),
  ]);
  return Response.json({ status: 'DISCONNECTED', historyPreserved: true });
}
