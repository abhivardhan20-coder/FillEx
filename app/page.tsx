import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileCheck2,
  FileText,
  GitCompareArrows,
  Layers3,
  LockKeyhole,
  Radar,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function LandingBrand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="FillEx home"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-black tracking-tight text-white shadow-lg shadow-violet-600/25">
        FX
      </span>
      <span className="text-lg font-bold tracking-tight">FillEx</span>
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f8fc] text-slate-950">
      <header className="relative z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center px-5 md:px-8">
          <LandingBrand />
          <nav
            className="ml-auto hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex"
            aria-label="Landing navigation"
          >
            <a href="#product" className="hover:text-slate-950">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-slate-950">
              How it works
            </a>
            <a href="#sources" className="hover:text-slate-950">
              Sources
            </a>
          </nav>
          <Link
            href="/login"
            className="ml-auto text-sm font-semibold text-slate-700 hover:text-slate-950 md:ml-7"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'ml-3 rounded-xl bg-slate-950 px-4',
            )}
          >
            Create account <ArrowRight />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative isolate px-5 pb-18 pt-16 md:px-8 md:pb-28 md:pt-24">
          <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.95fr_1.05fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
                <Sparkles className="size-3.5" />
                Explainable intelligence for Indian portfolios
              </div>
              <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[.98] tracking-[-.045em] md:text-7xl">
                Know what changed.
                <br />
                <span className="text-violet-600">Know why it matters.</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-slate-600 md:text-lg">
                FillEx connects your holdings with market data and official
                evidence—then shows exactly what the available data can support.
                No mystery scores. No fabricated signals.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-11 rounded-xl bg-violet-600 px-5 text-base hover:bg-violet-500',
                  )}
                >
                  Start with your portfolio <ArrowRight />
                </Link>
                <Link
                  href="/markets"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'h-11 rounded-xl bg-white px-5 text-base',
                  )}
                >
                  Explore NSE &amp; BSE
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  No mock data
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Browser-local portfolio
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Sources labeled
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-violet-300/35 to-indigo-200/10 blur-3xl" />
              <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-3 shadow-[0_40px_100px_-32px_rgba(76,29,149,.35)]">
                <div className="rounded-[1.35rem] bg-[#14162c] p-5 text-white md:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-violet-300">
                        FillEx workspace
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        Evidence readiness
                      </p>
                    </div>
                    <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <ShieldCheck className="size-4 text-violet-300" />
                    </span>
                  </div>
                  <div className="mt-7 grid gap-3">
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.06] p-4">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-violet-400/15">
                        <Database className="size-4 text-violet-300" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">Portfolio</p>
                          <span className="text-[10px] font-semibold text-amber-300">
                            Awaiting holdings
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Manual entry or broker connection
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.06] p-4">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-cyan-400/10">
                        <Sparkles className="size-4 text-cyan-300" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">
                            Market context
                          </p>
                          <span className="text-[10px] font-semibold text-violet-300">
                            Fallback ready
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          NSE and BSE discovery
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.06] p-4">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-400/10">
                        <FileCheck2 className="size-4 text-emerald-300" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">
                            Official evidence
                          </p>
                          <span className="text-[10px] font-semibold text-amber-300">
                            Connect provider
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          NSE, BSE, SEBI and company IR
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 px-2 py-4 text-center text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
                  <span>NSE</span>
                  <span>BSE</span>
                  <span>SEBI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="product"
          className="border-y border-slate-200 bg-white px-5 py-20 md:px-8 md:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-600">
                One decision layer
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.035em] md:text-5xl">
                From scattered inputs to a portfolio view you can explain.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                FillEx brings holdings, market context, and filing evidence into
                one disciplined workflow. When a source is missing, the product
                says so.
              </p>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              <article className="rounded-3xl border border-slate-200 bg-[#fafaff] p-6 md:p-8">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Layers3 className="size-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold">
                  Your portfolio, your inputs
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Enter holdings manually or import a CSV today. Connect a
                  broker later without rebuilding your workflow.
                </p>
                <Link
                  href="/portfolio"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700"
                >
                  Open portfolio <ArrowUpRight className="size-3.5" />
                </Link>
              </article>
              <article className="rounded-3xl border border-slate-200 bg-[#fafaff] p-6 md:p-8">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800">
                  <Radar className="size-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold">
                  Market context, labeled
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Discover NSE and BSE securities through a clearly identified
                  fallback until a licensed live provider is connected.
                </p>
                <Link
                  href="/markets"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700"
                >
                  Search markets <ArrowUpRight className="size-3.5" />
                </Link>
              </article>
              <article className="rounded-3xl border border-slate-200 bg-[#fafaff] p-6 md:p-8">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                  <FileText className="size-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold">
                  Evidence before narrative
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Keep official filings and licensed news upstream of every
                  interpretation, so the reasoning remains inspectable.
                </p>
                <Link
                  href="/filings"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700"
                >
                  Review evidence <ArrowUpRight className="size-3.5" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-600">
                  How it works
                </p>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.035em] md:text-5xl">
                  Three steps. Every conclusion traceable.
                </h2>
                <p className="mt-5 text-base leading-7 text-slate-600">
                  Start small with portfolio structure, then unlock deeper
                  intelligence as real sources come online.
                </p>
              </div>
              <div className="space-y-4">
                <article className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[56px_1fr] md:p-8">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-950 font-mono text-sm font-bold text-white">
                    01
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Database className="size-4 text-violet-600" />
                      <h3 className="text-lg font-semibold">
                        Bring your portfolio
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Add only the holdings you want assessed. Your manually
                      entered data remains in your browser.
                    </p>
                  </div>
                </article>
                <article className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[56px_1fr] md:p-8">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-violet-600 font-mono text-sm font-bold text-white">
                    02
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <ScanSearch className="size-4 text-violet-600" />
                      <h3 className="text-lg font-semibold">
                        Connect trusted context
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Add broker, market, filing, and news credentials
                      server-side. FillEx shows what is connected before it uses
                      it.
                    </p>
                  </div>
                </article>
                <article className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[56px_1fr] md:p-8">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-cyan-600 font-mono text-sm font-bold text-white">
                    03
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="size-4 text-violet-600" />
                      <h3 className="text-lg font-semibold">
                        Inspect the reasoning
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      See the threshold, formula, input coverage, and missing
                      evidence behind each result—not just a recommendation.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="sources" className="px-5 pb-20 md:px-8 md:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#14162c] text-white shadow-2xl shadow-violet-950/20">
            <div className="grid lg:grid-cols-[1.05fr_.95fr]">
              <div className="p-7 md:p-12 lg:p-16">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-200">
                  <ShieldCheck className="size-3.5" />
                  Source hierarchy built in
                </div>
                <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-.035em] md:text-5xl">
                  Honesty is a product feature.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                  FillEx keeps authoritative and fallback sources separate. A
                  missing connection becomes a visible limitation—not an excuse
                  to generate an answer.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <LockKeyhole className="size-4 text-emerald-300" />
                    Server-side credentials
                  </span>
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <GitCompareArrows className="size-4 text-cyan-300" />
                    Visible source precedence
                  </span>
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <FileCheck2 className="size-4 text-violet-300" />
                    Official filing directory
                  </span>
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-300" />
                    No fabricated coverage
                  </span>
                </div>
              </div>
              <div className="border-t border-white/10 bg-white/[.045] p-7 md:p-12 lg:border-l lg:border-t-0 lg:p-16">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-slate-400">
                  Preferred source order
                </p>
                <ol className="mt-7 space-y-5">
                  <li className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-semibold">
                        Broker or licensed live feed
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Upstox, Angel One, Zerodha, Groww, Kun Data
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-semibold">Official evidence</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        NSE, BSE, SEBI and company investor relations
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-semibold">
                        Licensed filing and news providers
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        FinancialFilings, NewsAPI and GNews
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold">
                      4
                    </span>
                    <div>
                      <p className="font-semibold">Open-source fallback</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Clearly labeled for prototype and research use
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white px-5 py-20 md:px-8 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-600">
              Ready when your data is
            </p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-.04em] md:text-6xl">
              Build confidence before you build a position.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Start with a private local portfolio today. Add production
              credentials when you are ready for live context.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-11 rounded-xl bg-violet-600 px-5 text-base hover:bg-violet-500',
                )}
              >
                Open FillEx <ArrowRight />
              </Link>
              <Link
                href="/integrations"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-11 rounded-xl px-5 text-base',
                )}
              >
                View integrations
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#f8f8fc] px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-slate-500 sm:flex-row sm:items-center">
          <LandingBrand />
          <p className="sm:ml-5">
            Explainable portfolio intelligence for Indian markets.
          </p>
          <div className="flex gap-5 sm:ml-auto">
            <Link href="/login" className="hover:text-slate-950">
              Sign in
            </Link>
            <Link href="/integrations" className="hover:text-slate-950">
              Sources
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
