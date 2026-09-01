import { IntelligenceWorkspace } from '@/components/fillex/intelligence-workspace';
import { PageHeading } from '@/components/fillex/page-heading';

export default function IntelligencePage() {
  return <div className="space-y-6"><PageHeading eyebrow="Intelligence" title="Explain only what the data supports" description="FillEx starts with a deterministic portfolio-structure check. Market, filing, and news analysis stay unavailable until their real sources are connected." /><IntelligenceWorkspace /></div>;
}
