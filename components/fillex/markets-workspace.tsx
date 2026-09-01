'use client';

import { AlertTriangle, ArrowDownRight, ArrowUpRight, Database, Search } from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { MarketQuote, MarketSearchResult } from '@/lib/market/yahoo-fallback';
import { cn } from '@/lib/utils';

const money = (value: number | null, currency = 'INR') => value === null ? '—' : new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);

export function MarketsWorkspace() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MarketSearchResult[]>([]);
  const [quote, setQuote] = useState<MarketQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function search(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim().length < 2) { setError('Enter at least two characters.'); return; }
    setLoading(true); setError(''); setQuote(null);
    try {
      const response = await fetch(`/api/market/search?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json() as { results?: MarketSearchResult[]; error?: string };
      if (!response.ok) throw new Error(data.error || 'Search failed.');
      setResults(data.results ?? []); setSearched(true);
    } catch (reason) {
      setResults([]); setSearched(true); setError(reason instanceof Error ? reason.message : 'Search failed.');
    } finally { setLoading(false); }
  }

  async function loadQuote(ticker: string) {
    setQuoteLoading(ticker); setError('');
    try {
      const response = await fetch(`/api/market/quote?ticker=${encodeURIComponent(ticker)}`);
      const data = await response.json() as { quote?: MarketQuote; error?: string };
      if (!response.ok || !data.quote) throw new Error(data.error || 'Quote unavailable.');
      setQuote(data.quote);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Quote unavailable.'); }
    finally { setQuoteLoading(null); }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.95fr)]">
      <Card>
        <CardHeader><CardTitle>Find an Indian security</CardTitle><CardDescription>Company name or NSE/BSE symbol. Results are fetched only when you search.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={search} className="flex gap-2">
            <Input aria-label="Company or symbol" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. company name or ticker" autoComplete="off" />
            <Button type="submit" disabled={loading}>{loading ? 'Searching…' : <><Search /> Search</>}</Button>
          </form>
          {error && <div role="alert" className="mt-4 flex gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{error}</div>}
          <div className="mt-5 space-y-2">
            {results.map((result) => (
              <button key={result.ticker} type="button" onClick={() => loadQuote(result.ticker)} className="flex w-full items-center justify-between rounded-xl border bg-background p-3 text-left transition-colors hover:border-violet-300 hover:bg-violet-50/40">
                <span><span className="block font-semibold">{result.symbol} <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{result.exchange}</span></span><span className="mt-0.5 block text-xs text-muted-foreground">{result.name}</span></span>
                <span className="text-xs font-medium text-violet-700">{quoteLoading === result.ticker ? 'Loading…' : 'View quote'}</span>
              </button>
            ))}
            {searched && !loading && results.length === 0 && !error && <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No matching NSE or BSE securities were returned.</div>}
            {!searched && <div className="rounded-xl border border-dashed p-8 text-center"><Search className="mx-auto size-5 text-muted-foreground" /><p className="mt-2 text-sm font-medium">No search has been run</p><p className="mt-1 text-xs text-muted-foreground">Nothing is preloaded or simulated.</p></div>}
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader><CardTitle>Quote detail</CardTitle><CardDescription>Latest value returned by the fallback provider.</CardDescription></CardHeader>
        <CardContent>
          {quote ? (
            <div>
              <div className="flex items-start justify-between gap-4"><div><p className="text-2xl font-semibold">{quote.symbol}</p><p className="mt-1 text-xs text-muted-foreground">{quote.name} · {quote.exchange}</p></div><span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900">Fallback</span></div>
              <p className="mt-7 text-3xl font-semibold tracking-tight">{money(quote.price, quote.currency)}</p>
              <p className={cn('mt-1 inline-flex items-center gap-1 text-sm font-medium', quote.change === null ? 'text-muted-foreground' : quote.change >= 0 ? 'text-emerald-700' : 'text-red-700')}>
                {quote.change !== null && (quote.change >= 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />)}
                {quote.change === null ? 'Change unavailable' : `${money(quote.change, quote.currency)} (${quote.percentChange?.toFixed(2)}%)`}
              </p>
              <dl className="mt-7 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-muted/60 p-3"><dt className="text-xs text-muted-foreground">Day high</dt><dd className="mt-1 font-medium">{money(quote.dayHigh, quote.currency)}</dd></div><div className="rounded-xl bg-muted/60 p-3"><dt className="text-xs text-muted-foreground">Day low</dt><dd className="mt-1 font-medium">{money(quote.dayLow, quote.currency)}</dd></div></dl>
              <div className="mt-5 flex gap-2 border-t pt-4 text-xs leading-5 text-muted-foreground"><Database className="mt-0.5 size-4 shrink-0" /><p>Source: Yahoo Finance fallback via the 0xramm adapter. Not an exchange-live or source-of-truth feed.{quote.marketTime ? ` Provider timestamp: ${new Date(quote.marketTime).toLocaleString('en-IN')}.` : ''}</p></div>
            </div>
          ) : <div className="rounded-xl border border-dashed p-10 text-center"><Database className="mx-auto size-5 text-muted-foreground" /><p className="mt-2 text-sm font-medium">Select a search result</p><p className="mt-1 text-xs text-muted-foreground">Quote data appears here only after a real provider response.</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
