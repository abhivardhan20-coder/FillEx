'use client';

import Link from 'next/link';
import { Check, ExternalLink, LockKeyhole, Plus, RefreshCw, Unplug, UserRoundCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { BrokerId, BrokerProvider } from '@/lib/brokers/providers';

/* oxlint-disable next/no-html-link-for-pages -- SIWC sign-in must use a top-level browser navigation. */

const brokerColor: Record<BrokerId, string> = {
  groww: 'bg-emerald-600',
  upstox: 'bg-violet-600',
  angelone: 'bg-blue-600',
  zerodha: 'bg-orange-600',
};

type BrokerAccount = { id: string; broker: string; status: string; lastSyncAt: string | null };

export function BrokerConnectPanel({ providers, authenticated, accounts: initialAccounts }: { providers: Array<BrokerProvider & { configured: boolean; accessTokenConfigured: boolean }>; authenticated: boolean; accounts: BrokerAccount[] }) {
  const [selected, setSelected] = useState<BrokerId | null>(null);
  const [connecting, setConnecting] = useState<BrokerId | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [accounts, setAccounts] = useState(initialAccounts);
  const [growwToken, setGrowwToken] = useState('');

  // oxlint-disable-next-line react/react-compiler -- callback status exists only in the browser URL.
  useEffect(() => { if (new URLSearchParams(window.location.search).get('error') === 'authorization') setError('Broker authorization was not completed. Your existing portfolio data was not changed.'); }, []);

  async function connect(provider: BrokerId) {
    setConnecting(provider); setError('');
    try {
      const response = await fetch(`/api/brokers/connect?provider=${provider}`, { headers: { Accept: 'application/json' } });
      const payload = await response.json() as { authorizationUrl?: string; error?: string };
      if (!response.ok || !payload.authorizationUrl) throw new Error(payload.error || 'Broker authorization could not start.');
      window.location.assign(payload.authorizationUrl);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Broker authorization could not start.'); setConnecting(null); }
  }

  async function connectGroww() {
    setConnecting('groww'); setError('');
    try {
      const response = await fetch('/api/brokers/token-connect', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'groww', accessToken: growwToken || undefined }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Groww connection could not be completed.');
      setGrowwToken('');
      window.location.assign('/portfolio?connection=success&broker=groww');
    } catch (reason) {
      setGrowwToken('');
      setError(reason instanceof Error ? reason.message : 'Groww connection could not be completed.');
      setConnecting(null);
    }
  }

  async function sync(accountId: string) {
    setError(''); setNotice('');
    const response = await fetch('/api/brokers/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accountId }) });
    const payload = await response.json() as { error?: string };
    if (!response.ok) { setError(payload.error || 'Portfolio sync could not be queued.'); return; }
    setNotice('Portfolio refresh queued. You can continue using FillEx.');
  }

  async function disconnect(account: BrokerAccount) {
    if (!window.confirm(`Disconnect ${account.broker}? Future sync will stop, but existing portfolio history will remain.`)) return;
    setError(''); setNotice('');
    const response = await fetch('/api/brokers/disconnect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accountId: account.id }) });
    const payload = await response.json() as { error?: string };
    if (!response.ok) { setError(payload.error || 'Broker could not be disconnected.'); return; }
    setAccounts((current) => current.map((item) => item.id === account.id ? { ...item, status: 'DISCONNECTED' } : item));
    setNotice(`${account.broker} disconnected. Historical portfolio data was preserved.`);
  }

  return (
    <div className="space-y-5">
      {!authenticated ? <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 sm:flex sm:items-center sm:justify-between"><div><p className="font-semibold text-violet-950">Sign in before connecting a broker</p><p className="mt-1 text-sm text-violet-900">Your identity keeps broker accounts and portfolio records separated from every other user.</p></div><a href="/signin-with-chatgpt?return_to=/brokers" target="_top" className={cn(buttonVariants(), 'mt-4 bg-violet-600 hover:bg-violet-500 sm:mt-0')}><UserRoundCheck /> Sign in with ChatGPT</a></div> : <div className="flex items-center gap-2 rounded-xl border bg-card p-3 text-xs font-medium"><UserRoundCheck className="size-4 text-emerald-700" />Signed in. Broker tokens will be encrypted and stored only on the server.</div>}

      {accounts.length > 0 && <section className="rounded-2xl border bg-card p-5"><h2 className="font-semibold">Connected accounts</h2><div className="mt-4 space-y-3">{accounts.map((account) => <div key={account.id} className="flex flex-col gap-3 rounded-xl bg-muted/55 p-3 sm:flex-row sm:items-center"><div className="flex-1"><p className="text-sm font-semibold capitalize">{account.broker}</p><p className="mt-0.5 text-xs text-muted-foreground">{account.status === 'REAUTH_REQUIRED' ? 'Authorization expired — reconnect required' : account.status === 'DISCONNECTED' ? 'Disconnected — historical data preserved' : account.lastSyncAt ? `Last synced ${new Date(account.lastSyncAt).toLocaleString('en-IN')}` : 'Connected — first sync pending'}</p></div><div className="flex gap-2"><Button type="button" variant="outline" size="sm" disabled={account.status === 'DISCONNECTED'} onClick={() => sync(account.id)}><RefreshCw /> Refresh</Button><Button type="button" variant="ghost" size="sm" disabled={account.status === 'DISCONNECTED'} onClick={() => disconnect(account)}><Unplug /> Disconnect</Button></div></div>)}</div></section>}
      <div className="grid gap-4 sm:grid-cols-2">
        {providers.map((provider) => (
          <button key={provider.id} type="button" onClick={() => setSelected(provider.id)} aria-pressed={selected === provider.id} className={cn('rounded-2xl border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-950/5', selected === provider.id && 'border-violet-500 ring-2 ring-violet-500/15')}>
            <div className="flex items-start justify-between gap-4"><span className={cn('flex size-11 items-center justify-center rounded-xl text-xs font-black text-white', brokerColor[provider.id])}>{provider.shortName}</span><span className={cn('rounded-full px-2.5 py-1 text-[10px] font-semibold', provider.configured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900')}>{provider.configured ? 'Ready to authorize' : 'Setup required'}</span></div>
            <h2 className="mt-5 text-lg font-semibold">{provider.name}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{provider.description}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Check className="size-3 text-emerald-700" />Holdings</span><span className="inline-flex items-center gap-1"><Check className="size-3 text-emerald-700" />Positions</span></div>
          </button>
        ))}
      </div>

      {selected && (() => {
        const provider = providers.find((item) => item.id === selected)!;
        if (provider.connectionMode === 'access-token') return <div className="rounded-2xl border bg-card p-5"><div><p className="font-semibold">Connect {provider.name}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{provider.accessTokenConfigured ? 'A Groww access token is configured securely on the server. Connect it to your signed-in FillEx account to begin the first portfolio sync.' : 'Generate an access token in Groww Trading APIs, then submit it here. It is sent once over HTTPS, encrypted on the server, and cleared from this form immediately.'}</p></div><div className="mt-4 flex flex-col gap-2 sm:flex-row">{!provider.accessTokenConfigured && <Input type="password" value={growwToken} onChange={(event) => setGrowwToken(event.target.value)} autoComplete="off" aria-label="Groww access token" placeholder="Paste Groww access token" className="sm:flex-1" />}<Button type="button" disabled={!authenticated || !provider.configured || (!provider.accessTokenConfigured && !growwToken.trim()) || connecting !== null} onClick={connectGroww}>{connecting === 'groww' ? 'Verifying…' : provider.accessTokenConfigured ? 'Connect Groww' : 'Verify and connect'} <LockKeyhole /></Button></div>{!provider.configured && <p className="mt-2 text-xs text-amber-800">Encrypted broker storage must be configured on the server first.</p>}</div>;
        return <div className="rounded-2xl border bg-card p-5 sm:flex sm:items-center sm:justify-between"><div><p className="font-semibold">Connect {provider.name}</p><p className="mt-1 text-sm text-muted-foreground">{provider.configured ? `Continue to ${provider.authLabel}. FillEx never sees your broker password.` : 'The server-side broker app credentials must be configured before authorization can begin.'}</p></div><Button type="button" disabled={!authenticated || !provider.configured || connecting !== null} onClick={() => connect(provider.id)} className="mt-4 sm:mt-0">{connecting === provider.id ? 'Starting…' : 'Continue securely'} {provider.configured ? <ExternalLink /> : <LockKeyhole />}</Button></div>;
      })()}

      {error && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">{error}</p>}
      {notice && <output className="block rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">{notice}</output>}

      <div className="rounded-2xl border border-dashed p-5 text-center"><p className="text-sm font-medium">Prefer not to connect a broker?</p><p className="mt-1 text-xs text-muted-foreground">Manual entry remains available, but broker import is the recommended path.</p><Link href="/portfolio?mode=manual" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}><Plus /> Add manually instead</Link></div>
      <div className="flex gap-2 rounded-xl bg-muted/60 p-3 text-xs leading-5 text-muted-foreground"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-emerald-700" />FillEx requests read-only portfolio access. It cannot buy, sell, modify orders, withdraw funds, or transfer securities.</div>
    </div>
  );
}
