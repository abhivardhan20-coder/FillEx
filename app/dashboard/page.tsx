import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Cable, FileSearch, Search, ShieldCheck } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const sourceCards = [
  { title: 'Portfolio', description: 'Add holdings manually or import a CSV. Broker sync becomes available after credentials are configured.', href: '/portfolio', action: 'Add holdings', icon: BriefcaseBusiness },
  { title: 'Market data', description: 'Search NSE and BSE through the no-key Yahoo Finance fallback while live-feed providers remain disconnected.', href: '/markets', action: 'Search markets', icon: Search },
  { title: 'Evidence', description: 'Connect filings and news sources before generating evidence-backed intelligence.', href: '/filings', action: 'Review sources', icon: FileSearch },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,.16),transparent_42%),linear-gradient(145deg,#111328,#171a35)] px-6 py-9 text-white shadow-2xl shadow-violet-950/10 md:px-10 md:py-12">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-violet-100"><ShieldCheck className="size-3.5" />Source-first portfolio intelligence</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">Your workspace is clean and ready for real data.</h1>
          <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-slate-300 md:text-base">FillEx does not preload sample holdings, prices, filings, or signals. Connect a source or add your own data to begin.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/integrations" className={cn(buttonVariants({ size: 'lg' }), 'bg-violet-500 hover:bg-violet-400')}><Cable /> Connect data sources <ArrowRight /></Link>
            <Link href="/portfolio" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'border-white/20 bg-white/8 text-white hover:bg-white/15 hover:text-white')}>Add portfolio manually</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="workspace-status-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">Workspace status</p><h2 id="workspace-status-heading" className="mt-1 text-2xl font-semibold tracking-tight">Start with a trusted source</h2></div>
          <span className="hidden rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground sm:inline-flex">No mock data</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {sourceCards.map(({ title, description, href, action, icon: Icon }) => (
            <Card key={title} className="transition-transform hover:-translate-y-0.5">
              <CardHeader><div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700"><Icon className="size-5" /></div><CardTitle>{title}</CardTitle><CardDescription className="min-h-12 leading-5">{description}</CardDescription></CardHeader>
              <CardContent><Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-700 hover:text-violet-900">{action} <ArrowRight className="size-3.5" /></Link></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed bg-card/70 p-6 md:flex md:items-center md:justify-between">
        <div><h2 className="font-semibold">How FillEx treats your data</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Manually entered portfolio data stays in this browser. Market fallback results are labeled by source and are never presented as exchange-live data.</p></div>
        <Link href="/integrations" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-700 md:mt-0">See data policy <ArrowRight className="size-3.5" /></Link>
      </section>
    </div>
  );
}
