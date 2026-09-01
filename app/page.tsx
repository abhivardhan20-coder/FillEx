'use client';

import { useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpenText,
  Bot, BrainCircuit, BriefcaseBusiness, ChartNoAxesCombined, Check,
  ChevronDown, ChevronRight, CircleAlert, CircleUserRound, Clock3, Database,
  ExternalLink, FileSearch, Gauge, LayoutDashboard, LockKeyhole, Menu,
  MessageSquareText, Play, Search, ShieldCheck, Sparkles, TrendingUp,
  TriangleAlert, WifiOff, X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { runFillExAnalysis, type AnalysisResult, type RiskProfile } from '@/lib/agent-orchestrator';

const holdings = [
  { symbol: 'INFY', name: 'Infosys', value: '₹32,844', day: '+2.84%', pnl: '+₹2,444', tone: 'up' },
  { symbol: 'TCS', name: 'Tata Consultancy', value: '₹78,420', day: '+1.21%', pnl: '+₹4,120', tone: 'up' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', value: '₹1,17,800', day: '-0.72%', pnl: '-₹1,280', tone: 'down' },
  { symbol: 'DIXON', name: 'Dixon Technologies', value: '₹56,200', day: '-0.42%', pnl: '-₹820', tone: 'down' },
];

const agents = [
  { name: 'Market pulse', icon: Activity, detail: 'Momentum + volume', color: 'violet' },
  { name: 'Filings & news', icon: FileSearch, detail: '6 sources retrieved', color: 'blue' },
  { name: 'Portfolio risk', icon: ShieldCheck, detail: 'Profile adjusted', color: 'green' },
];

const nav = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Portfolio', icon: BriefcaseBusiness },
  { label: 'Markets', icon: ChartNoAxesCombined },
  { label: 'Intelligence', icon: BrainCircuit },
  { label: 'Filings', icon: BookOpenText },
];

export default function Home() {
  const [profile, setProfile] = useState<RiskProfile>('conservative');
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [runCount, setRunCount] = useState(3);

  async function runAnalysis() {
    setRunning(true);
    setComplete(false);
    try {
      const next = await runFillExAnalysis(profile, degraded);
      setResult(next);
      const stored = JSON.parse(window.localStorage.getItem('fillex-analysis-history') ?? '[]') as AnalysisResult[];
      const history = [next, ...stored].slice(0, 10);
      window.localStorage.setItem('fillex-analysis-history', JSON.stringify(history));
      setRunCount(history.length + 3);
      setRunning(false);
      setComplete(true);
    } catch {
      setRunning(false);
    }
  }

  const isConservative = profile === 'conservative';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <Logo />
        <nav className="mt-9 space-y-1" aria-label="Primary navigation">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
          {nav.map((item) => (
            <button key={item.label} className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors ${item.active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'}`}>
              <item.icon className="size-[17px]" /><span>{item.label}</span>
              {item.label === 'Intelligence' && <span className="ml-auto size-1.5 rounded-full bg-violet-400" />}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-violet-200/70 bg-violet-50/70 p-3.5 dark:border-violet-500/15 dark:bg-violet-500/10">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-violet-700 dark:text-violet-300"><Sparkles className="size-3.5" /> AI coverage</div>
          <div className="mb-2 flex items-end justify-between"><span className="text-2xl font-semibold tracking-tight">94%</span><span className="text-[11px] text-muted-foreground">12 / 13 sources</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-950"><div className="h-full w-[94%] rounded-full bg-violet-500" /></div>
        </div>
        <button className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-sidebar-accent">
          <span className="grid size-9 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">AS</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">Abhi Sharma</span><span className="block text-[11px] text-muted-foreground">Demo portfolio</span></span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </aside>

      <div className="lg:pl-[236px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button className="grid size-9 place-items-center rounded-xl border border-border lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button>
          <div className="lg:hidden"><Logo compact /></div>
          <div className="ml-auto hidden w-full max-w-sm items-center gap-2 rounded-xl border border-border bg-muted/45 px-3 py-2 text-sm text-muted-foreground md:flex"><Search className="size-4" /><span>Search stocks, filings, or ask FillEx…</span><kbd className="ml-auto rounded-md border bg-background px-1.5 py-0.5 text-[10px]">⌘ K</kbd></div>
          <button className="relative ml-auto grid size-9 place-items-center rounded-xl border border-border md:ml-1" aria-label="Notifications"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-500 ring-2 ring-background" /></button>
          <button className="hidden items-center gap-2 rounded-xl border border-border px-2.5 py-1.5 text-sm font-medium sm:flex"><CircleUserRound className="size-4 text-muted-foreground" /> Abhi <ChevronDown className="size-3.5 text-muted-foreground" /></button>
        </header>

        {menuOpen && <div className="fixed inset-x-4 top-[72px] z-50 rounded-2xl border bg-card p-2 shadow-xl lg:hidden">{nav.map((item) => <button key={item.label} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-muted"><item.icon className="size-4" />{item.label}</button>)}</div>}

        <main className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgb(16_185_129/12%)]" /> Market open · NSE</div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Good morning, Abhi.</h1>
              <p className="mt-1 text-sm text-muted-foreground">Here’s what matters across your portfolio today.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition ${degraded ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300' : 'border-border bg-card text-muted-foreground'}`}>
                <WifiOff className="size-3.5" /> Degraded demo
                <Switch size="sm" checked={degraded} onCheckedChange={setDegraded} aria-label="Simulate degraded data" />
              </div>
              <div className="flex rounded-xl border border-border bg-card p-1" aria-label="Risk profile">
                <button onClick={() => setProfile('conservative')} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${isConservative ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-muted-foreground'}`}>Conservative</button>
                <button onClick={() => setProfile('growth')} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${!isConservative ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-muted-foreground'}`}>Growth</button>
              </div>
              <Button onClick={runAnalysis} disabled={running} className="h-9 rounded-xl bg-violet-600 px-3.5 text-white hover:bg-violet-500">{running ? <><span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Analyzing</> : <><Play className="size-3.5 fill-current" /> Run analysis</>}</Button>
            </div>
          </section>

          {complete && <div className={`mb-5 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${result?.degraded ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300' : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'}`}>{result?.degraded ? <CircleAlert className="size-4" /> : <Check className="size-4" />} Three agents completed in {result?.latencyMs ?? 0}ms. {result?.degraded ? 'Missing evidence was blocked from the synthesis.' : `Synthesis refreshed for the ${profile} profile.`}</div>}

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(310px,.7fr)]">
            <div className="min-w-0 space-y-4"><PortfolioCard /><IntelligenceCard profile={profile} running={running} result={result} onOpen={() => setTraceOpen(true)} /><HoldingsCard /></div>
            <div className="space-y-4"><AgentCard running={running} result={result} onOpen={() => setTraceOpen(true)} /><RiskCard profile={profile} /><MetricsCard result={result} runCount={runCount} /><SourcesCard degraded={degraded} /></div>
          </section>
        </main>
      </div>
      <TraceDrawer open={traceOpen} onClose={() => setTraceOpen(false)} result={result} profile={profile} degraded={degraded} />
    </div>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5"><span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-slate-950 text-white shadow-[0_6px_20px_rgb(79_70_229/24%)]"><TrendingUp className="size-[19px]" /><span className="absolute -right-1 -top-1 size-3 rounded-full bg-violet-500 blur-[1px]" /></span>{!compact && <span className="text-[19px] font-semibold tracking-[-0.04em]">FillEx</span>}</div>;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[18px] border border-border/80 bg-card shadow-[0_1px_2px_rgb(15_23_42/3%)] ${className}`}>{children}</div>;
}

function PortfolioCard() {
  return (
    <Card className="overflow-hidden p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-medium text-muted-foreground">Total portfolio value</p><div className="mt-2 flex flex-wrap items-end gap-3"><h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-[36px]">₹4,82,420</h2><span className="mb-1 flex items-center text-sm font-semibold text-emerald-600"><ArrowUpRight className="size-4" />₹12,840 · 2.73%</span></div><p className="mt-1 text-xs text-muted-foreground">Today · Updated 8 seconds ago</p></div>
        <div className="flex rounded-lg bg-muted p-0.5 text-[11px] font-medium text-muted-foreground">{['1D','1W','1M','1Y'].map((range) => <button key={range} className={`rounded-md px-2 py-1 ${range === '1D' ? 'bg-background text-foreground shadow-sm' : ''}`}>{range}</button>)}</div>
      </div>
      <div className="relative mt-5 h-[150px] overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-between opacity-60">{[0,1,2,3].map((line) => <div key={line} className="border-t border-dashed border-border" />)}</div>
        <svg viewBox="0 0 800 150" preserveAspectRatio="none" className="relative h-full w-full" aria-label="Portfolio value rising 2.73 percent today"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7c3aed" stopOpacity=".22"/><stop offset="1" stopColor="#7c3aed" stopOpacity="0"/></linearGradient></defs><path d="M0,117 C40,112 61,124 98,105 C136,86 165,96 198,89 C235,82 259,97 298,78 C344,56 373,75 409,63 C449,49 473,72 513,54 C556,35 580,45 623,34 C674,21 718,35 800,12 L800,150 L0,150 Z" fill="url(#area)" /><path d="M0,117 C40,112 61,124 98,105 C136,86 165,96 198,89 C235,82 259,97 298,78 C344,56 373,75 409,63 C449,49 473,72 513,54 C556,35 580,45 623,34 C674,21 718,35 800,12" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" /><circle cx="800" cy="12" r="5" fill="#7c3aed" stroke="white" strokeWidth="3" /></svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground"><span>09:15</span><span>11:00</span><span>13:00</span><span>15:30</span></div>
      </div>
    </Card>
  );
}

function IntelligenceCard({ profile, running, result, onOpen }: { profile: RiskProfile; running: boolean; result: AnalysisResult | null; onOpen: () => void }) {
  const conservative = profile === 'conservative';
  const classification = result?.profile === profile && result.degraded === false ? result.classification : conservative ? 'NEUTRAL' : 'POSITIVE';
  const isDegradedResult = result?.degraded;
  return (
    <Card className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-violet-700 dark:text-violet-300"><span className="grid size-7 place-items-center rounded-lg bg-violet-100 dark:bg-violet-500/15"><Sparkles className="size-4" /></span>FillEx intelligence</div><Badge variant="outline" className={`h-6 ${isDegradedResult ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'}`}>{isDegradedResult ? 'Moderate evidence' : 'Strong evidence'}</Badge></div>
        <div className={`mt-5 transition-opacity ${running ? 'opacity-35' : ''}`}>
          <div className="flex flex-wrap items-center gap-3"><h3 className="text-xl font-semibold tracking-tight">Today’s portfolio stance</h3><Badge className={`h-6 ${classification === 'POSITIVE' ? 'bg-emerald-100 text-emerald-800' : classification === 'CAUTIOUS' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{classification}</Badge></div>
          <p className="mt-3 max-w-3xl text-[15px] leading-6 text-muted-foreground">{result?.profile === profile ? result.summary : conservative ? 'Earnings momentum is supportive, but your 42% IT concentration increases downside sensitivity. Hold exposure steady and watch the next sector move.' : 'Earnings and volume signals support selective growth exposure. INFY leads today, while RELIANCE remains the main drag to monitor.'}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3"><Signal icon={ArrowUpRight} title="INFY" detail="Margins improved" tone="up" /><Signal icon={Activity} title="DIXON" detail="1.8× usual volume" tone="info" /><Signal icon={TriangleAlert} title="RELIANCE" detail="Weak momentum" tone="down" /></div>
          <button onClick={onOpen} className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-600 dark:text-violet-300">Inspect reasoning & sources <ArrowRight className="size-4" /></button>
        </div>
        {running && <div className="absolute inset-0 top-12 grid place-items-center"><div className="flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-xs font-medium shadow-sm"><span className="size-3.5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" /> Synthesizing agent outputs…</div></div>}
      </div>
    </Card>
  );
}

function Signal({ icon: Icon, title, detail, tone }: { icon: typeof Activity; title: string; detail: string; tone: string }) {
  const styles = tone === 'up' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : tone === 'down' ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300';
  return <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3"><span className={`grid size-9 place-items-center rounded-xl ${styles}`}><Icon className="size-4" /></span><span><span className="block text-sm font-semibold">{title}</span><span className="text-xs text-muted-foreground">{detail}</span></span></div>;
}

function HoldingsCard() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6"><div><h3 className="text-sm font-semibold">Your holdings</h3><p className="mt-0.5 text-xs text-muted-foreground">4 of 8 positions</p></div><button className="flex items-center gap-1 text-xs font-semibold text-violet-700 dark:text-violet-300">View portfolio <ArrowRight className="size-3.5" /></button></div>
      <div className="divide-y divide-border/65">{holdings.map((holding) => <div key={holding.symbol} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 transition hover:bg-muted/35 sm:px-6"><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{holding.symbol.slice(0,2)}</span><span className="min-w-0"><span className="block text-sm font-semibold">{holding.symbol}</span><span className="block truncate text-[11px] text-muted-foreground">{holding.name}</span></span></div><div className="hidden text-right sm:block"><span className="block text-sm font-medium tabular-nums">{holding.value}</span><span className="text-[11px] text-muted-foreground">Market value</span></div><div className={`min-w-[78px] text-right ${holding.tone === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}><span className="flex items-center justify-end text-sm font-semibold tabular-nums">{holding.tone === 'up' ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{holding.day}</span><span className="text-[11px] tabular-nums">{holding.pnl}</span></div></div>)}</div>
    </Card>
  );
}

function AgentCard({ running, result, onOpen }: { running: boolean; result: AnalysisResult | null; onOpen: () => void }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-semibold">Agent workspace</h3><p className="mt-0.5 text-xs text-muted-foreground">Parallel analysis pipeline</p></div><span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600"><span className="size-1.5 rounded-full bg-emerald-500" /> Live</span></div>
      <div className="space-y-2.5">{agents.map((agent, index) => {
        const agentResult = result?.agents[index];
        const degradedAgent = agentResult?.state === 'degraded';
        return <button onClick={onOpen} key={agent.name} className="flex w-full items-center gap-3 rounded-xl border border-border/70 p-3 text-left transition hover:border-violet-200 hover:bg-violet-50/30 dark:hover:border-violet-500/20 dark:hover:bg-violet-500/5"><span className={`grid size-9 place-items-center rounded-xl ${agent.color === 'violet' ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' : agent.color === 'blue' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'}`}><agent.icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{agent.name}</span><span className="block truncate text-[11px] text-muted-foreground">{running ? 'Executing in parallel…' : degradedAgent ? 'Source timeout · guarded' : agentResult ? `${agentResult.latencyMs}ms · ${Math.round(agentResult.confidence * 100)}% confidence` : agent.detail}</span></span>{running ? <span className="size-3.5 animate-spin rounded-full border-2 border-muted border-t-violet-500" /> : degradedAgent ? <CircleAlert className="size-4 text-amber-500" /> : <Check className="size-4 text-emerald-500" />}</button>;
      })}</div>
      <button onClick={onOpen} className="mt-3 flex w-full items-center justify-between rounded-xl bg-muted/45 px-3 py-2 text-[11px] hover:bg-muted"><span className="text-muted-foreground">Synthesis layer</span><span className="flex items-center gap-1 font-medium">Structured contract v1 <ChevronRight className="size-3.5" /></span></button>
    </Card>
  );
}

function RiskCard({ profile }: { profile: 'conservative' | 'growth' }) {
  const conservative = profile === 'conservative';
  return (
    <Card className="p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-muted-foreground">Risk concentration</p><h3 className="mt-1 text-2xl font-semibold tracking-tight">42% <span className="text-sm font-normal text-muted-foreground">in IT</span></h3></div><span className={`grid size-9 place-items-center rounded-xl ${conservative ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' : 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300'}`}><Gauge className="size-4" /></span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full transition-all ${conservative ? 'w-[74%] bg-amber-500' : 'w-[58%] bg-violet-500'}`} /></div><div className="mt-2 flex justify-between text-[11px] text-muted-foreground"><span>{conservative ? 'Above preferred range' : 'Within growth range'}</span><span>{conservative ? 'High' : 'Moderate'}</span></div></Card>
  );
}

function MetricsCard({ result, runCount }: { result: AnalysisResult | null; runCount: number }) {
  return (
    <Card className="p-5"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><Bot className="size-4 text-violet-600" /><h3 className="text-sm font-semibold">Last session metrics</h3></div><span className="text-[10px] text-muted-foreground">Run #{runCount}</span></div><div className="grid grid-cols-3 gap-2"><Metric value={`${result?.latencyMs ?? 842}ms`} label="Latency" /><Metric value={`${result?.citationCoverage ?? 100}%`} label="Cited" /><Metric value="3/3" label="Agents" /></div><div className="mt-3 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-[11px] text-blue-800 dark:border-blue-500/15 dark:bg-blue-500/10 dark:text-blue-300"><MessageSquareText className="size-3.5" /> Decisions and outcomes persist locally.</div></Card>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl bg-muted/55 p-2.5 text-center"><span className="block text-sm font-semibold tabular-nums">{value}</span><span className="text-[10px] text-muted-foreground">{label}</span></div>;
}

function SourcesCard({ degraded }: { degraded: boolean }) {
  const sources = [
    { name: 'Upstox V3', role: 'Primary market', status: 'Live', dot: 'bg-emerald-500' },
    { name: 'Angel One', role: 'Market fallback', status: 'Standby', dot: 'bg-blue-500' },
    { name: 'NSE / FinancialFilings', role: 'Evidence', status: degraded ? 'Partial' : 'Synced', dot: degraded ? 'bg-amber-500' : 'bg-emerald-500' },
  ];
  return <Card className="p-5"><div className="mb-3 flex items-center gap-2"><Database className="size-4 text-violet-600" /><h3 className="text-sm font-semibold">Connected data layer</h3></div><div className="space-y-3">{sources.map((source) => <div key={source.name} className="flex items-center gap-2.5 text-xs"><span className={`size-1.5 rounded-full ${source.dot}`} /><span className="min-w-0 flex-1"><span className="font-medium">{source.name}</span><span className="ml-1.5 text-muted-foreground">· {source.role}</span></span><span className="text-[10px] font-medium text-muted-foreground">{source.status}</span></div>)}</div></Card>;
}

function TraceDrawer({ open, onClose, result, profile, degraded }: { open: boolean; onClose: () => void; result: AnalysisResult | null; profile: RiskProfile; degraded: boolean }) {
  if (!open) return null;
  const fallbackAgents = [
    { id: 'market', name: 'Market pulse agent', state: 'complete', latencyMs: 462, signal: 'positive', confidence: .82, summary: 'Broad momentum is positive, led by INFY.', factors: ['INFY momentum +2.84%', 'DIXON volume 1.8× baseline'], evidence: [{ label: 'Normalized LTPC feed', source: 'Upstox Market Data V3 · demo adapter', detail: 'Price, OHLC and volume', observedAt: '8 seconds ago' }] },
    { id: 'research', name: 'Filings & news agent', state: degraded ? 'degraded' : 'complete', latencyMs: 608, signal: degraded ? 'neutral' : 'positive', confidence: degraded ? .51 : .88, summary: degraded ? 'Latest filing unavailable; unsupported claim excluded.' : 'Official results support the margin-improvement thesis.', factors: ['Operating margin improved', 'Guidance stable'], evidence: [{ label: 'Q4 FY26 results', source: 'NSE · simulated official filing', detail: 'Operating margin · page 12', observedAt: 'Filed 28 Aug 2026' }] },
    { id: 'risk', name: 'Portfolio risk agent', state: 'complete', latencyMs: 521, signal: profile === 'conservative' ? 'cautious' : 'neutral', confidence: .91, summary: 'Profile-aware concentration rules applied.', factors: ['IT exposure 42%', `Profile ${profile}`], evidence: [{ label: 'Portfolio snapshot', source: 'FillEx portfolio store', detail: '8 holdings', observedAt: '8 seconds ago' }] },
  ] as AnalysisResult['agents'];
  const shown = result?.agents ?? fallbackAgents;
  return (
    <dialog open className="fixed inset-0 z-[70] h-screen w-screen max-w-none bg-transparent p-0" aria-label="Analysis reasoning and sources">
      <button className="absolute inset-0 cursor-default bg-slate-950/35 backdrop-blur-[2px]" onClick={onClose} aria-label="Close reasoning panel" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[580px] flex-col border-l bg-background shadow-2xl">
        <header className="flex items-start gap-3 border-b px-5 py-5 sm:px-6"><span className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"><BrainCircuit className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-semibold tracking-tight">How FillEx reached this view</h2><Badge variant="outline" className="hidden h-5 text-[10px] sm:inline-flex">{result?.runId ?? 'PREVIEW'}</Badge></div><p className="mt-1 text-xs text-muted-foreground">Structured agent outputs and evidence — not hidden model reasoning.</p></div><button onClick={onClose} className="grid size-8 place-items-center rounded-lg border hover:bg-muted" aria-label="Close"><X className="size-4" /></button></header>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className={`mb-5 rounded-2xl border p-4 ${result?.degraded || degraded ? 'border-amber-200 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/10' : 'border-violet-200 bg-violet-50/60 dark:border-violet-500/20 dark:bg-violet-500/10'}`}>
            <div className="flex items-center gap-2 text-xs font-semibold">{result?.degraded || degraded ? <CircleAlert className="size-4 text-amber-600" /> : <LockKeyhole className="size-4 text-violet-600" />}{result?.degraded || degraded ? 'Degraded-data guard active' : 'Evidence-locked synthesis'}</div>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{result?.degraded || degraded ? 'The filing agent could not verify its newest source. The unsupported claim was removed before synthesis, so the pipeline remained safe and cited.' : 'Every material claim below maps to retrieved evidence. Three agents executed independently in parallel.'}</p>
          </div>
          <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Parallel agent trace</h3><span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock3 className="size-3" /> {result?.latencyMs ?? 842}ms total</span></div>
          <div className="space-y-3">
            {shown.map((agent, index) => <div key={agent.id} className="rounded-2xl border bg-card p-4"><div className="flex items-start gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-lg ${agent.state === 'degraded' ? 'bg-amber-100 text-amber-700' : 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'}`}>{agent.state === 'degraded' ? <TriangleAlert className="size-4" /> : index === 0 ? <Activity className="size-4" /> : index === 1 ? <FileSearch className="size-4" /> : <ShieldCheck className="size-4" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-semibold">{agent.name}</h4><span className="text-[10px] text-muted-foreground">{agent.latencyMs}ms · {Math.round(agent.confidence * 100)}% confidence</span></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{agent.summary}</p><div className="mt-3 flex flex-wrap gap-1.5">{agent.factors.map((factor) => <span key={factor} className="rounded-md bg-muted px-2 py-1 text-[10px]">{factor}</span>)}</div>{agent.evidence.map((evidence) => <div key={evidence.label} className="mt-3 rounded-xl border border-border/70 bg-background p-3"><div className="flex items-center gap-1.5 text-[11px] font-semibold"><ExternalLink className="size-3" />{evidence.label}</div><p className="mt-1 text-[10px] text-muted-foreground">{evidence.source}</p><p className="mt-1 text-[10px] text-muted-foreground">{evidence.detail} · {evidence.observedAt}</p></div>)}</div></div></div>)}
          </div>
          <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/20 dark:bg-violet-500/10"><div className="flex items-center gap-2 text-xs font-semibold text-violet-800 dark:text-violet-300"><Sparkles className="size-4" /> Synthesis contract</div><div className="mt-3 grid grid-cols-2 gap-2 text-[11px]"><TraceField label="Profile" value={profile} /><TraceField label="Classification" value={result?.classification ?? (profile === 'growth' ? 'POSITIVE' : 'NEUTRAL')} /><TraceField label="Citation coverage" value={`${result?.citationCoverage ?? 100}%`} /><TraceField label="Evidence strength" value={result?.evidenceStrength ?? 'Strong'} /></div></div>
        </div>
        <footer className="border-t bg-card px-5 py-4 sm:px-6"><p className="text-[10px] leading-4 text-muted-foreground">Informational analysis only. FillEx does not guarantee outcomes or automatically execute trades.</p></footer>
      </aside>
    </dialog>
  );
}

function TraceField({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-background/75 p-2.5"><span className="block text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span><span className="mt-0.5 block font-semibold capitalize">{value}</span></div>;
}
