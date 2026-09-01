'use client';

import { FileUp, Plus, ShieldCheck, Trash2, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type Holding, parsePortfolioCsv, readStoredHoldings, saveHoldings } from '@/lib/portfolio';

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const number = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 });

function makeId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function PortfolioWorkspace() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [symbol, setSymbol] = useState('');
  const [exchange, setExchange] = useState<'NSE' | 'BSE'>('NSE');
  const [quantity, setQuantity] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  // oxlint-disable-next-line react/react-compiler -- hydration must read browser-only storage after mount.
  useEffect(() => { setHoldings(readStoredHoldings()); setReady(true); }, []);
  useEffect(() => { if (ready) saveHoldings(holdings); }, [holdings, ready]);

  const costBasis = useMemo(() => holdings.reduce((sum, item) => sum + item.quantity * item.averagePrice, 0), [holdings]);

  function addHolding(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setMessage('');
    const cleanSymbol = symbol.trim().toUpperCase();
    const parsedQuantity = Number(quantity); const parsedPrice = Number(averagePrice);
    if (!/^[A-Z0-9&.-]{1,24}$/.test(cleanSymbol)) { setError('Enter a valid NSE or BSE symbol.'); return; }
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) { setError('Quantity must be greater than zero.'); return; }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) { setError('Average price cannot be negative.'); return; }
    setHoldings((current) => [...current, { id: makeId(), symbol: cleanSymbol, exchange, quantity: parsedQuantity, averagePrice: parsedPrice }]);
    setSymbol(''); setQuantity(''); setAveragePrice(''); setMessage(`${cleanSymbol} added to this browser.`);
  }

  async function importCsv(file?: File) {
    if (!file) return;
    setError(''); setMessage('');
    try {
      if (file.size > 1_000_000) throw new Error('Choose a CSV smaller than 1 MB.');
      const parsed = parsePortfolioCsv(await file.text());
      setHoldings((current) => [...current, ...parsed.map((item) => ({ ...item, id: makeId() }))]);
      setMessage(`${parsed.length} holding${parsed.length === 1 ? '' : 's'} imported locally.`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not import the CSV.'); }
    finally { if (fileInput.current) fileInput.current.value = ''; }
  }

  function removeHolding(id: string) { setHoldings((current) => current.filter((item) => item.id !== id)); setMessage('Holding removed from this browser.'); }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm"><CardHeader><CardDescription>Holdings</CardDescription><CardTitle className="text-2xl">{ready ? holdings.length : '—'}</CardTitle></CardHeader></Card>
        <Card size="sm"><CardHeader><CardDescription>Cost basis</CardDescription><CardTitle className="text-2xl">{ready && holdings.length ? currency.format(costBasis) : '—'}</CardTitle></CardHeader></Card>
        <Card size="sm"><CardHeader><CardDescription>Live market value</CardDescription><CardTitle className="text-2xl">—</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Requires a licensed market feed.</p></CardContent></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[370px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader><CardTitle>Add a holding</CardTitle><CardDescription>Stored locally in this browser. Nothing is uploaded.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={addHolding} className="space-y-4">
              <label htmlFor="holding-symbol" className="block text-sm font-medium">Symbol</label><Input id="holding-symbol" className="-mt-2.5" value={symbol} onChange={(event) => setSymbol(event.target.value)} placeholder="NSE/BSE ticker" autoComplete="off" />
              <label htmlFor="holding-exchange" className="block text-sm font-medium">Exchange</label><select id="holding-exchange" value={exchange} onChange={(event) => setExchange(event.target.value as 'NSE' | 'BSE')} className="-mt-2.5 h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"><option value="NSE">NSE</option><option value="BSE">BSE</option></select>
              <div className="grid grid-cols-2 gap-3"><div><label htmlFor="holding-quantity" className="block text-sm font-medium">Quantity</label><Input id="holding-quantity" className="mt-1.5" type="number" min="0" step="any" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="0" /></div><div><label htmlFor="holding-average-price" className="block text-sm font-medium">Avg. price</label><Input id="holding-average-price" className="mt-1.5" type="number" min="0" step="any" value={averagePrice} onChange={(event) => setAveragePrice(event.target.value)} placeholder="₹ 0" /></div></div>
              <Button type="submit" className="w-full"><Plus /> Add holding</Button>
            </form>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            <input ref={fileInput} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => importCsv(event.target.files?.[0])} />
            <Button type="button" variant="outline" className="w-full" onClick={() => fileInput.current?.click()}><FileUp /> Import CSV</Button>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Required columns: symbol, exchange, quantity, averagePrice.</p>
            {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-800">{error}</p>}
            {message && <output className="mt-3 block rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800">{message}</output>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Your holdings</CardTitle><CardDescription>Cost basis uses only the values you entered. No prices are fabricated.</CardDescription></CardHeader>
          <CardContent>
            {ready && holdings.length ? (
              <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b text-xs text-muted-foreground"><th className="pb-3 font-medium">Security</th><th className="pb-3 font-medium">Quantity</th><th className="pb-3 font-medium">Average price</th><th className="pb-3 font-medium">Cost basis</th><th className="pb-3 text-right font-medium">Action</th></tr></thead><tbody>{holdings.map((holding) => <tr key={holding.id} className="border-b last:border-0"><td className="py-4"><span className="font-semibold">{holding.symbol}</span><span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{holding.exchange}</span></td><td className="py-4">{number.format(holding.quantity)}</td><td className="py-4">{currency.format(holding.averagePrice)}</td><td className="py-4 font-medium">{currency.format(holding.quantity * holding.averagePrice)}</td><td className="py-4 text-right"><Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ${holding.symbol}`} onClick={() => removeHolding(holding.id)}><Trash2 /></Button></td></tr>)}</tbody></table></div>
            ) : <div className="rounded-xl border border-dashed p-10 text-center"><WalletCards className="mx-auto size-6 text-muted-foreground" /><p className="mt-3 font-medium">No holdings yet</p><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">Add a holding or import your own CSV. FillEx will never insert a sample portfolio.</p></div>}
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-2 rounded-xl border bg-card p-3 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" />Portfolio entries remain in local browser storage until you remove them or clear this site&apos;s browser data.</div>
    </div>
  );
}
