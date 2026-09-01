import { brokerReadiness } from '@/lib/brokers/providers';
import { getDatabase } from '@/lib/server/database';
import { getSiteUser } from '@/lib/server/site-user';

export async function GET() {
  const user = await getSiteUser();
  let accounts: Array<{ id: string; broker: string; status: string; last_sync_at: string | null }> = [];
  if (user) {
    try {
      const result = await getDatabase().prepare('SELECT id, broker, status, last_sync_at FROM broker_accounts WHERE user_id = ? ORDER BY created_at').bind(user.id).all<typeof accounts[number]>();
      accounts = result.results;
    } catch { accounts = []; }
  }
  return Response.json({ authenticated: Boolean(user), providers: brokerReadiness().map(({ requiredEnvironment: _, ...provider }) => provider), accounts }, { headers: { 'Cache-Control': 'no-store' } });
}
