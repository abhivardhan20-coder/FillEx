'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BrainCircuit, Cable, FileText, LayoutDashboard, Menu, PieChart, Search, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

const navigation = [
  { href: '/dashboard', label: 'Workspace', icon: LayoutDashboard },
  { href: '/portfolio', label: 'Portfolio', icon: PieChart },
  { href: '/markets', label: 'Markets', icon: BarChart3 },
  { href: '/intelligence', label: 'Intelligence', icon: BrainCircuit },
  { href: '/filings', label: 'Filings', icon: FileText },
  { href: '/integrations', label: 'Integrations', icon: Cable },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="FillEx home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20"><span className="text-sm font-black tracking-tight">FX</span></span>
      <span><span className="block text-base font-bold tracking-tight">FillEx</span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Intelligence</span></span>
    </Link>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1" aria-label="Primary navigation">
      {navigation.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', active ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            <Icon className="size-4" />{label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/') return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card/90 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="border-b p-5"><Brand /></div>
        <div className="flex-1 p-3"><NavLinks pathname={pathname} /></div>
        <div className="m-3 rounded-xl border bg-muted/45 p-3">
          <div className="flex items-center gap-2 text-xs font-medium"><span className="size-2 rounded-full bg-amber-500" /> Data sources not configured</div>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Add API credentials when available. No demo data is being shown.</p>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu backdrop" className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 border-r bg-card p-4 shadow-2xl">
            <div className="mb-6 flex items-center justify-between"><Brand /><button type="button" className="rounded-lg p-2 hover:bg-muted" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="size-5" /></button></div>
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/88 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6 lg:px-8">
            <button type="button" className="rounded-lg border bg-card p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="size-4" /></button>
            <div className="lg:hidden"><Brand /></div>
            <Link href="/markets" className="ml-auto hidden min-w-64 items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-violet-300 hover:text-foreground sm:flex"><Search className="size-4" /> Search NSE or BSE<kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[10px]">⌘ K</kbd></Link>
            <Link href="/integrations" className="ml-auto rounded-lg border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted sm:ml-0">Connect sources</Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
