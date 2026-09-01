'use client';

import { AppLink as Link } from '@/components/fillex/app-link';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';

import { BrokerMark } from '@/components/fillex/broker-mark';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { brokerProviders } from '@/lib/brokers/providers';
import { cn } from '@/lib/utils';

export function AuthScreen({ mode }: { mode: 'login' | 'signup' }) {
  const signingUp = mode === 'signup';
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setError('');
    if (signingUp && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(
        signingUp ? '/api/auth/signup' : '/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(form),
        },
      );
      const payload = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };
      if (!response.ok || !payload.redirectTo)
        throw new Error(
          payload.error || 'Authentication could not be completed.',
        );
      window.location.assign(payload.redirectTo);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Authentication could not be completed.',
      );
      setSubmitting(false);
    }
  }

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
                ? 'Create your private FillEx workspace, then choose the broker you want to connect.'
                : 'Enter your FillEx account details to access your brokers and portfolio.'}
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              {signingUp && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={(event) =>
                        updateField('name', event.target.value)
                      }
                      autoComplete="name"
                      placeholder="Your full name"
                      minLength={2}
                      maxLength={80}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField('email', event.target.value)
                    }
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    maxLength={254}
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) =>
                      updateField('password', event.target.value)
                    }
                    autoComplete={
                      signingUp ? 'new-password' : 'current-password'
                    }
                    placeholder={
                      signingUp
                        ? 'At least 10 characters'
                        : 'Enter your password'
                    }
                    minLength={10}
                    maxLength={128}
                    required
                    className="h-11 px-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {signingUp && (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Use uppercase, lowercase, a number, and at least 10
                    characters.
                  </p>
                )}
              </div>
              {signingUp && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Confirm password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField('confirmPassword', event.target.value)
                    }
                    autoComplete="new-password"
                    placeholder="Enter the password again"
                    minLength={10}
                    maxLength={128}
                    required
                    className="h-11"
                  />
                </div>
              )}
              {!signingUp && (
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(event) =>
                      updateField('remember', event.target.checked)
                    }
                    className="size-4 rounded border-slate-300 accent-violet-600"
                  />
                  Keep me signed in for 30 days
                </label>
              )}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800"
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 w-full rounded-xl bg-violet-600 text-base shadow-lg shadow-violet-600/20 hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-70',
                )}
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    {signingUp ? 'Creating account…' : 'Signing in…'}
                  </>
                ) : (
                  <>
                    {signingUp ? 'Create FillEx account' : 'Sign in to FillEx'}{' '}
                    <ArrowRight />
                  </>
                )}
              </button>
            </form>

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
                    Passwords are salted and hashed
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    FillEx stores a one-way password hash and protects your
                    session with a secure HTTP-only cookie.
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
