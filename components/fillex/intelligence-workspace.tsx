'use client';

import { BrainCircuit, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Holding, readStoredHoldings, RISK_PROFILE_STORAGE_KEY } from '@/lib/portfolio';

type RiskProfile = 'conservative' | 'balanced' | 'growth';
const thresholds: Record<RiskProfile, number> = { conservative: 20, balanced: 30, growth: 40 };
const labels: Record<RiskProfile, string> = { conservative: 'Conservative', balanced: 'Balanced', growth: 'Growth' };

export function IntelligenceWorkspace() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('balanced');
  const [ready, setReady] = useState(false);

  /* oxlint-disable react/react-compiler -- hydration must read browser-only storage after mount. */
  useEffect(() => {
    setHoldings(readStoredHoldings());
    const saved = window.localStorage.getItem(RISK_PROFILE_STORAGE_KEY);
    if (saved === 'conservative' || saved === 'balanced' || saved === 'growth') setRiskProfile(saved);
    setReady(true);
  }, []);
  /* oxlint-enable react/react-compiler */
  useEffect(() => { if (ready) window.localStorage.setItem(RISK_PROFILE_STORAGE_KEY, riskProfile); }, [ready, riskProfile]);

  const analysis = useMemo(() => {
    const positions = holdings.map((holding) => ({ ...holding, cost: holding.quantity * holding.averagePrice }));
    const total = positions.reduce((sum, item) => sum + item.cost, 0);
    const largest = total > 0 ? positions.reduce((current, item) => item.cost > current.cost ? item : current, positions[0]) : null;
    const largestWeight = largest && total > 0 ? (largest.cost / total) * 100 : null;
    return { total, largest, largestWeight, concentrationLimit: thresholds[riskProfile] };
  }, [holdings, riskProfile]);

  if (!ready) return <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">Loading local workspace…</div>;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Risk context</CardTitle><CardDescription>This setting changes the concentration threshold used in the local, cost-basis-only check.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">{(['conservative', 'balanced', 'growth'] as RiskProfile[]).map((profile) => <button key={profile} type="button" onClick={() => setRiskProfile(profile)} aria-pressed={riskProfile === profile} className={`rounded-xl border p-4 text-left transition-colors ${riskProfile === profile ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500/15' : 'hover:border-violet-300'}`}><span className="block font-semibold">{labels[profile]}</span><span className="mt-1 block text-xs text-muted-foreground">Flag a position above {thresholds[profile]}% of cost basis</span></button>)}</div>
        </CardContent>
      </Card>

      {holdings.length === 0 ? (
        <Card><CardContent className="py-14 text-center"><BrainCircuit className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-3 font-semibold">No portfolio to analyze</h2><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">Add your own holdings on the Portfolio page. FillEx will not generate an intelligence card from placeholder data.</p></CardContent></Card>
      ) : analysis.total <= 0 ? (
        <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><Info className="mt-0.5 size-4 shrink-0" />Add a non-zero average price to at least one holding to calculate cost-basis concentration.</div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader><CardTitle>Explainable risk check</CardTitle><CardDescription>Calculated locally from the holdings and average prices you supplied.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border bg-muted/35 p-5">
                <div className="flex items-start gap-3">{analysis.largestWeight! > analysis.concentrationLimit ? <ShieldAlert className="mt-0.5 size-5 text-amber-700" /> : <CheckCircle2 className="mt-0.5 size-5 text-emerald-700" />}<div><h2 className="font-semibold">Largest position: {analysis.largest?.symbol}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{analysis.largestWeight!.toFixed(1)}% of entered cost basis. Your {labels[riskProfile].toLowerCase()} threshold is {analysis.concentrationLimit}%.</p></div></div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${analysis.largestWeight! > analysis.concentrationLimit ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(analysis.largestWeight!, 100)}%` }} /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Positions assessed</p><p className="mt-1 text-2xl font-semibold">{holdings.length}</p></div><div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Evidence coverage</p><p className="mt-1 text-2xl font-semibold">Portfolio only</p></div></div>
            </CardContent>
          </Card>
          <Card className="h-fit"><CardHeader><CardTitle>Not included yet</CardTitle><CardDescription>These require configured external sources.</CardDescription></CardHeader><CardContent><ul className="space-y-3 text-sm"><li className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />Live mark-to-market exposure</li><li className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />Official filing evidence</li><li className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />Verified news context</li><li className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />Broker-confirmed positions</li></ul></CardContent></Card>
        </div>
      )}

      <div className="rounded-xl border border-dashed p-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Method:</strong> position cost = quantity × average price; concentration = position cost ÷ total entered cost. This is a transparent portfolio-structure check, not investment advice or a live market signal.</div>
    </div>
  );
}
