'use client';

import Link from 'next/link';
import { ExternalLink, FileSearch, Search, ShieldCheck } from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const officialSources = [
  { name: 'NSE corporate filings', href: 'https://www.nseindia.com/companies-listing/corporate-filings-announcements', scope: 'NSE announcements and disclosures' },
  { name: 'BSE corporate announcements', href: 'https://www.bseindia.com/corporates/ann.html', scope: 'BSE announcements and attachments' },
  { name: 'SEBI filings', href: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11', scope: 'Regulatory filings and public documents' },
];

export function FilingsWorkspace({ providerConfigured }: { providerConfigured: boolean }) {
  const [query, setQuery] = useState('');
  const [requested, setRequested] = useState('');

  function search(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) setRequested(query.trim());
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_360px]">
      <Card>
        <CardHeader><CardTitle>Evidence search</CardTitle><CardDescription>FillEx will not substitute press mentions or generated text for an official filing.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={search} className="flex gap-2"><Input aria-label="Company or symbol" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Company name or symbol" /><Button type="submit"><Search /> Check sources</Button></form>
          {requested ? (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="font-semibold text-amber-950">No filing was loaded for “{requested}”.</p><p className="mt-1 text-sm leading-6 text-amber-900">{providerConfigured ? 'The credential is detected, but the production query contract must be confirmed before automated ingestion is enabled.' : 'Connect FinancialFilings or an official-source ingestion worker to search inside FillEx.'}</p><Link href="/integrations" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 bg-white')}>Review integrations</Link></div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed p-12 text-center"><FileSearch className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-3 font-semibold">No filings loaded</h2><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">Search readiness is real, but results stay empty until an authoritative source is configured.</p></div>
          )}
        </CardContent>
      </Card>

      <Card className="h-fit"><CardHeader><CardTitle>Official source directory</CardTitle><CardDescription>Open the authoritative portals directly.</CardDescription></CardHeader><CardContent className="space-y-3">{officialSources.map((source) => <a key={source.name} href={source.href} target="_blank" rel="noreferrer" className="flex items-start justify-between gap-3 rounded-xl border p-3 transition-colors hover:border-violet-300"><span><span className="block text-sm font-semibold">{source.name}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{source.scope}</span></span><ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" /></a>)}<div className="flex gap-2 border-t pt-4 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" />Official portals remain the authority when a provider and an exchange record disagree.</div></CardContent></Card>
    </div>
  );
}
