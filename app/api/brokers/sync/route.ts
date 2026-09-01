import { getDatabase } from '@/lib/server/database';
import { getSiteUser } from '@/lib/server/site-user';
import { kickPortfolioWorker } from '@/lib/server/portfolio-worker';

export async function POST(request: Request) {
  const user = await getSiteUser();
  if (!user) return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  const payload = await request.json().catch(() => ({})) as { accountId?: string };
  const database = getDatabase();
  const query = payload.accountId
    ? database.prepare("SELECT id FROM broker_accounts WHERE id = ? AND user_id = ? AND status IN ('CONNECTED', 'SYNC_FAILED', 'RATE_LIMITED')").bind(payload.accountId, user.id)
    : database.prepare("SELECT id FROM broker_accounts WHERE user_id = ? AND status IN ('CONNECTED', 'SYNC_FAILED', 'RATE_LIMITED')").bind(user.id);
  const accounts = await query.all<{ id: string }>();
  if (!accounts.results.length) return Response.json({ error: 'No connected broker account is available to sync.' }, { status: 409 });
  const statements = accounts.results.map((account) => database.prepare("INSERT INTO ingestion_jobs (id, user_id, broker_account_id, job_type, status, priority) VALUES (?, ?, ?, 'PORTFOLIO_SYNC', 'DISCOVERED', 10)").bind(crypto.randomUUID(), user.id, account.id));
  await database.batch(statements);
  kickPortfolioWorker(new URL(request.url).origin, Math.min(statements.length, 5));
  return Response.json({ queued: statements.length, status: 'DISCOVERED' }, { status: 202 });
}
