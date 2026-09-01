import Link from 'next/link';
import {
  ArrowRight,
  Check,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { BrokerMark } from '@/components/fillex/broker-mark';
import { buttonVariants } from '@/components/ui/button';
import { brokerProviders } from '@/lib/brokers/providers';
import { cn } from '@/lib/utils';

/* oxlint-disable next/no-html-link-for-pages -- Sites owns the SIWC route and requires top-level navigation. */

export function AuthScreen({ mode }: { mode: 'login' | 'signup' }) {
  const signingUp = mode === 'signup';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7fc] px-5 py-6 text-slate-950 md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(124,58,237,.16),transparent_34%),radial-gradient(circle_at_88%_88%,rgba(79,70,229,.13),transparent_32%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_35px_100px_-35px_rgba(76,29,149,.38)] md:min-h-[calc(100vh-4rem)]">
        <section className="hidden w-[52%] flex-col justify-between bg-[#15162d] p-10 text-white lg:flex xl:p-14">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="FillEx home"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500 text-sm font-black tracking-tight shadow-lg shadow-violet-500/25">
              FX
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight">
                FillEx
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[.18em] text-violet-300">
                Portfolio intelligence
              </span>
            </span>
          </Link>

          <div className="max-w-xl py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-xs font-semibold text-violet-200">
              <Sparkles className="size-3.5" />
              Built for Indian investors
            </div>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-[-.045em] xl:text-6xl">
              Your portfolio.
              <br />
              <span className="text-violet-300">Every signal explained.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
              Connect a broker, bring in your real holdings, and inspect the
              evidence behind every portfolio insight.
            </p>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {[
                'Read-only broker access',
                'Encrypted server-side tokens',
                'No fabricated market data',
                'Sources attached to insights',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-slate-300"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-emerald-400/15">
                    <Check className="size-3 text-emerald-300" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">
              Connect after sign-in
            </p>
            <div className="mt-4 flex items-center gap-3">
              {brokerProviders.map((broker) => (
                <BrokerMark
                  key={broker.id}
                  name={broker.name}
                  logoPath={broker.logoPath}
                  className="size-11 rounded-xl border-white/10 bg-white p-2"
                />
              ))}
              <span className="ml-1 text-xs text-slate-400">
                Groww · Upstox · Angel One · Zerodha
              </span>
            </div>
          </div>
        </section>

        <section className="flex flex-1 flex-col p-6 sm:p-10 lg:p-14">
          <div className="flex items-center justify-between lg:justify-end">
            <Link
              href="/"
              className="flex items-center gap-2.5 lg:hidden"
              aria-label="FillEx home"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-violet-600 text-xs font-black text-white">
                FX
              </span>
              <span className="font-bold">FillEx</span>
            </Link>
            <p className="text-sm text-slate-500">
              {signingUp ? 'Already have an account?' : 'New to FillEx?'}{' '}
              <Link
                href={signingUp ? '/login' : '/signup'}
                className="font-semibold text-violet-700 hover:text-violet-600"
              >
                {signingUp ? 'Sign in' : 'Create account'}
              </Link>
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <ShieldCheck className="size-6" />
            </span>
            <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-violet-600">
              {signingUp ? 'Create your account' : 'Welcome back'}
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-.04em]">
              {signingUp ? 'Start building clarity.' : 'Sign in to FillEx.'}
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {signingUp
                ? 'One secure identity gives you a private FillEx workspace. No separate password to remember.'
                : 'Continue with your secure ChatGPT identity to access your brokers and portfolio.'}
            </p>

            <a
              href="/signin-with-chatgpt?return_to=/brokers"
              target="_top"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-8 h-12 w-full rounded-xl bg-violet-600 text-base shadow-lg shadow-violet-600/20 hover:bg-violet-500',
              )}
            >
              {signingUp
                ? 'Create account with ChatGPT'
                : 'Sign in with ChatGPT'}{' '}
              <ArrowRight />
            </a>

            <div className="my-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              Secure access
              <span className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <div>
                  <p className="text-sm font-semibold">
                    Your broker password never touches FillEx
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Broker connections use supported authorization flows and
                    request portfolio access only.
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to use FillEx for informational portfolio
              analysis—not investment advice.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
