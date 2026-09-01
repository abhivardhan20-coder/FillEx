import { CheckCircle2, CircleDashed, ExternalLink, KeyRound, ServerCog, ShieldCheck } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProductionIntegrations, openSourceIntegrations, type IntegrationState } from '@/lib/integrations';
import { PageHeading } from '@/components/fillex/page-heading';

const stateStyle: Record<IntegrationState, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  connected: { label: 'Connected', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  'credential-required': { label: 'Credential required', className: 'bg-amber-100 text-amber-900', icon: KeyRound },
  'worker-ready': { label: 'Worker scaffold ready', className: 'bg-sky-100 text-sky-900', icon: ServerCog },
  'active-fallback': { label: 'Fallback active', className: 'bg-violet-100 text-violet-900', icon: ShieldCheck },
};

function IntegrationCard({ integration }: { integration: ReturnType<typeof getProductionIntegrations>[number] }) {
  const style = stateStyle[integration.state]; const Icon = style.icon;
  return <Card size="sm"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>{integration.name}</CardTitle><CardDescription>{integration.role}</CardDescription></div><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${style.className}`}><Icon className="size-3" />{style.label}</span></div></CardHeader><CardContent><p className="text-xs leading-5 text-muted-foreground">{integration.detail}</p>{integration.env && <p className="mt-3 break-words rounded-lg bg-muted px-2.5 py-2 font-mono text-[10px] text-muted-foreground">{integration.env.join(' + ')}</p>}<a href={integration.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-700">Documentation <ExternalLink className="size-3" /></a></CardContent></Card>;
}

export default function IntegrationsPage() {
  const production = getProductionIntegrations();
  const connected = production.filter((item) => item.state === 'connected').length;
  return (
    <div className="space-y-8">
      <PageHeading eyebrow="Integrations" title="Real sources, explicit status" description="Platform credentials stay on the server. User-supplied broker access tokens are encrypted immediately and never saved in browser storage." action={<span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium"><CircleDashed className="size-3.5 text-amber-600" />{connected} of {production.length} credentialed providers connected</span>} />
      <section><div className="mb-4"><h2 className="text-xl font-semibold">Production connectors</h2><p className="mt-1 text-sm text-muted-foreground">Preferred broker, filing, news, and streaming providers.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{production.map((item) => <IntegrationCard key={item.name} integration={item} />)}</div></section>
      <section><div className="mb-4"><h2 className="text-xl font-semibold">Open-source fallback and research layer</h2><p className="mt-1 text-sm text-muted-foreground">Downloaded for this project and kept subordinate to official or licensed sources.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{openSourceIntegrations.map((item) => <IntegrationCard key={item.name} integration={item} />)}</div></section>
      <div className="rounded-xl border border-dashed p-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Source precedence:</strong> broker/live provider → official NSE/BSE/SEBI/company IR → licensed filing/news provider → open-source fallback. The BseIndiaApi GPL-3.0 code stays isolated in its own worker rather than being bundled into the hosted UI.</div>
    </div>
  );
}
