import { BrokerConnectPanel } from '@/components/fillex/broker-connect-panel';
import { PageHeading } from '@/components/fillex/page-heading';
import { brokerReadiness } from '@/lib/brokers/providers';
import { getDatabase } from '@/lib/server/database';
import { getSiteUser } from '@/lib/server/site-user';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BrokersPage() {
  const user = await getSiteUser();
  if (!user) redirect('/login');
  let accounts: Array<{
    id: string;
    broker: string;
    status: string;
    lastSyncAt: string | null;
  }> = [];
  try {
    const result = await getDatabase()
      .prepare(
        'SELECT id, broker, status, last_sync_at as lastSyncAt FROM broker_accounts WHERE user_id = ? ORDER BY created_at',
      )
      .bind(user.id)
      .all<(typeof accounts)[number]>();
    accounts = result.results;
  } catch {
    accounts = [];
  }
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Choose your broker"
        title="Where do you invest?"
        description="Connect one account to import holdings and positions. FillEx requests read-only access and uses each broker’s supported authorization flow."
      />
      <BrokerConnectPanel
        providers={brokerReadiness()}
        authenticated
        accounts={accounts}
      />
    </div>
  );
}
