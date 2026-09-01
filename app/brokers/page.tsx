import { BrokerConnectPanel } from '@/components/fillex/broker-connect-panel';
import { PageHeading } from '@/components/fillex/page-heading';
import { brokerReadiness } from '@/lib/brokers/providers';
import { getDatabase } from '@/lib/server/database';
import { getSiteUser } from '@/lib/server/site-user';

export default async function BrokersPage() {
  const user = await getSiteUser();
  let accounts: Array<{ id: string; broker: string; status: string; lastSyncAt: string | null }> = [];
  if (user) {
    try {
      const result = await getDatabase().prepare('SELECT id, broker, status, last_sync_at as lastSyncAt FROM broker_accounts WHERE user_id = ? ORDER BY created_at').bind(user.id).all<typeof accounts[number]>();
      accounts = result.results;
    } catch { accounts = []; }
  }
  return <div className="space-y-6"><PageHeading eyebrow="Broker connection" title="Connect your investment account" description="Securely import holdings and positions from Groww, Upstox, Angel One, or Zerodha. Authentication happens through the broker’s supported flow." /><BrokerConnectPanel providers={brokerReadiness()} authenticated={Boolean(user)} accounts={accounts} /></div>;
}
