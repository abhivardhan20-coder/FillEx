'use client';

import { BrainCircuit, CheckCircle2, ExternalLink, Info, LoaderCircle, Newspaper, Search, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type Holding, readStoredHoldings, RISK_PROFILE_STORAGE_KEY } from '@/lib/portfolio';

type RiskProfile = 'conservative' | 'balanced' | 'growth';
const thresholds: Record<RiskProfile, number> = { conservative: 20, balanced: 30, growth: 40 };
const labels: Record<RiskProfile, string> = { conservative: 'Conservative', balanced: 'Balanced', growth: 'Growth' };

type NewsArticle = {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  publishedAt: string | null;
  source: string | null;
  sentiment: number | null;
  entities: Array<{ symbol: string | null; name: string | null }>;
};

type BrokerRiskPosition = {
  securityId: string;
  symbol: string;
  quantity: number;
  averagePrice: number | null;
  investedValue: number | null;
};

export function IntelligenceWorkspace() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('balanced');
  const [ready, setReady] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsSymbol, setNewsSymbol] = useState('');
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState('');
  const [brokerPositions, setBrokerPositions] = useState<BrokerRiskPosition[]>([]);

  /* oxlint-disable react/react-compiler -- hydration must read browser-only storage after mount. */
  useEffect(() => {
    setHoldings(readStoredHoldings());
    const saved = window.localStorage.getItem(RISK_PROFILE_STORAGE_KEY);
    if (saved === 'conservative' || saved === 'balanced' || saved === 'growth') setRiskProfile(saved);
    setReady(true);
    fetch('/api/news', { headers: { Accept: 'application/json' } })
      .then(async (response) => ({ response, payload: await response.json() as { articles?: NewsArticle[]; error?: string } }))
      .then(({ response, payload }) => {
        if (!response.ok) throw new Error(payload.error || 'Verified news could not be loaded.');
        setNews(payload.articles ?? []);
      })
      .catch((reason: unknown) => {
        setNews([]);
        setNewsError(reason instanceof Error ? reason.message : 'Verified news could not be loaded.');
      })
      .finally(() => setNewsLoading(false));
    fetch('/api/portfolio', { headers: { Accept: 'application/json' } })
      .then((response) => response.json() as Promise<{ positions?: BrokerRiskPosition[] }>)
      .then((payload) => setBrokerPositions(payload.positions ?? []))
      .catch(() => setBrokerPositions([]));
  }, []);
  /* oxlint-enable react/react-compiler */
  useEffect(() => { if (ready) window.localStorage.setItem(RISK_PROFILE_STORAGE_KEY, riskProfile); }, [ready, riskProfile]);

  const analysis = useMemo(() => {
    const positions = [
      ...holdings.map((holding) => ({ symbol: holding.symbol, cost: holding.quantity * holding.averagePrice })),
      ...brokerPositions.map((position) => ({ symbol: position.symbol, cost: position.investedValue ?? position.quantity * (position.averagePrice ?? 0) })),
    ];
    const total = positions.reduce((sum, item) => sum + item.cost, 0);
    const largest = total > 0 ? positions.reduce((current, item) => item.cost > current.cost ? item : current, positions[0]) : null;
    const largestWeight = largest && total > 0 ? (largest.cost / total) * 100 : null;
    return { total, largest, largestWeight, concentrationLimit: thresholds[riskProfile] };
  }, [brokerPositions, holdings, riskProfile]);

  async function loadNews(symbols: string) {
    setNewsLoading(true); setNewsError('');
    try {
      const query = symbols.trim() ? `?symbols=${encodeURIComponent(symbols.trim())}` : '';
      const response = await fetch(`/api/news${query}`, { headers: { Accept: 'application/json' } });
      const payload = await response.json() as { articles?: NewsArticle[]; error?: string };
      if (!response.ok) throw new Error(payload.error || 'Verified news could not be loaded.');
      setNews(payload.articles ?? []);
    } catch (reason) {
      setNews([]);
      setNewsError(reason instanceof Error ? reason.message : 'Verified news could not be loaded.');
    } finally { setNewsLoading(false); }
  }

  function searchNews(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadNews(newsSymbol);
  }

  if (!ready) return <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">Loading local workspace…</div>;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Risk context</CardTitle><CardDescription>This setting changes the concentration threshold used in the local, cost-basis-only check.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">{(['conservative', 'balanced', 'growth'] as RiskProfile[]).map((profile) => <button key={profile} type="button" onClick={() => setRiskProfile(profile)} aria-pressed={riskProfile === profile} className={`rounded-xl border p-4 text-left transition-colors ${riskProfile === profile ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500/15' : 'hover:border-violet-300'}`}><span className="block font-semibold">{labels[profile]}</span><span className="mt-1 block text-xs text-muted-foreground">Flag a position above {thresholds[profile]}% of cost basis</span></button>)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between"><div><CardTitle>Verified market news</CardTitle><CardDescription>Live financial coverage supplied by Marketaux. Search an NSE ticker or browse recent India-linked stories.</CardDescription></div><form onSubmit={searchNews} className="flex w-full gap-2 sm:max-w-sm"><Input value={newsSymbol} onChange={(event) => setNewsSymbol(event.target.value)} placeholder="Ticker, e.g. RELIANCE" aria-label="News ticker" autoComplete="off" /><Button type="submit" variant="outline" disabled={newsLoading}><Search /> Search</Button></form></CardHeader>
        <CardContent>
          {newsLoading ? <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />Loading verified news…</div> : newsError ? <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">{newsError}</div> : news.length ? <div className="divide-y">{news.map((article) => <article key={article.id} className="py-4 first:pt-0 last:pb-0"><div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"><span className="rounded-full bg-violet-100 px-2 py-1 text-violet-800">Marketaux</span>{article.publishedAt && <time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</time>}{article.sentiment !== null && <span className={article.sentiment > 0.1 ? 'text-emerald-700' : article.sentiment < -0.1 ? 'text-red-700' : ''}>{article.sentiment > 0.1 ? 'Positive' : article.sentiment < -0.1 ? 'Negative' : 'Neutral'} entity tone</span>}</div><a href={article.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-start gap-1.5 font-semibold leading-6 hover:text-violet-700">{article.title}<ExternalLink className="mt-1 size-3.5 shrink-0" /></a>{article.summary && <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{article.summary}</p>}{article.entities.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{article.entities.filter((entity) => entity.symbol).map((entity) => <span key={`${article.id}-${entity.symbol}`} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">{entity.symbol}</span>)}</div>}</article>)}</div> : <div className="py-12 text-center"><Newspaper className="mx-auto size-6 text-muted-foreground" /><p className="mt-3 font-medium">No verified stories found</p><p className="mt-1 text-xs text-muted-foreground">Try another NSE ticker or clear the search to return to India-linked coverage.</p></div>}
        </CardContent>
      </Card>

      {holdings.length + brokerPositions.length === 0 ? (
        <Card><CardContent className="py-14 text-center"><BrainCircuit className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-3 font-semibold">No portfolio to analyze</h2><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">Connect a broker or add your own holdings on the Portfolio page. FillEx will not generate an intelligence card from placeholder data.</p></CardContent></Card>
      ) : analysis.total <= 0 ? (
        <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><Info className="mt-0.5 size-4 shrink-0" />Add a non-zero average price to at least one holding to calculate cost-basis concentration.</div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader><CardTitle>Explainable risk check</CardTitle><CardDescription>Calculated from broker-reported cost values and any manual holdings you supplied.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border bg-muted/35 p-5">
                <div className="flex items-start gap-3">{analysis.largestWeight! > analysis.concentrationLimit ? <ShieldAlert className="mt-0.5 size-5 text-amber-700" /> : <CheckCircle2 className="mt-0.5 size-5 text-emerald-700" />}<div><h2 className="font-semibold">Largest position: {analysis.largest?.symbol}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{analysis.largestWeight!.toFixed(1)}% of entered cost basis. Your {labels[riskProfile].toLowerCase()} threshold is {analysis.concentrationLimit}%.</p></div></div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${analysis.largestWeight! > analysis.concentrationLimit ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(analysis.largestWeight!, 100)}%` }} /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Positions assessed</p><p className="mt-1 text-2xl font-semibold">{holdings.length + brokerPositions.length}</p></div><div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Evidence coverage</p><p className="mt-1 text-2xl font-semibold">{brokerPositions.length ? holdings.length ? 'Broker + manual' : 'Broker-confirmed' : 'Manual portfolio'}</p></div></div>
            </CardContent>
          </Card>
          <Card className="h-fit"><CardHeader><CardTitle>Coverage status</CardTitle><CardDescription>Only connected sources are included in intelligence.</CardDescription></CardHeader><CardContent><ul className="space-y-3 text-sm"><li className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />Live mark-to-market exposure pending</li><li className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />Official filing evidence pending</li><li className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />Verified Marketaux news connected</li><li className="flex gap-2"><span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${brokerPositions.length ? 'bg-emerald-500' : 'bg-amber-500'}`} />{brokerPositions.length ? 'Broker-confirmed positions connected' : 'Broker positions pending first sync'}</li></ul></CardContent></Card>
        </div>
      )}

      <div className="rounded-xl border border-dashed p-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Method:</strong> position cost uses the broker&apos;s invested value when available, otherwise quantity × average price; concentration = position cost ÷ total assessed cost. This is a transparent portfolio-structure check, not investment advice or a live market signal.</div>
    </div>
  );
}
