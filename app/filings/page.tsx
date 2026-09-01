import { FilingsWorkspace } from '@/components/fillex/filings-workspace';
import { PageHeading } from '@/components/fillex/page-heading';

export default function FilingsPage() {
  return <div className="space-y-6"><PageHeading eyebrow="Filings" title="Evidence before interpretation" description="Use official NSE, BSE, SEBI, company IR, or a licensed filing provider as the source of truth." /><FilingsWorkspace providerConfigured={Boolean(process.env.FINANCIALFILINGS_API_KEY?.trim())} /></div>;
}
