import { Info } from 'lucide-react';

import { MarketsWorkspace } from '@/components/fillex/markets-workspace';
import { PageHeading } from '@/components/fillex/page-heading';

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Market data" title="Search NSE and BSE" description="Use the no-key fallback for prototype discovery. Connect a licensed broker or market-data provider before relying on prices for trading decisions." />
      <div className="flex gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm leading-5 text-sky-950"><Info className="mt-0.5 size-4 shrink-0" />The fallback may be delayed, incomplete, or temporarily unavailable. FillEx labels every result and does not describe it as a zero-delay live feed.</div>
      <MarketsWorkspace />
    </div>
  );
}
