import { IntelligenceWorkspace } from '@/components/fillex/intelligence-workspace';
import { PageHeading } from '@/components/fillex/page-heading';

export default function IntelligencePage() {
  return <div className="space-y-6"><PageHeading eyebrow="Intelligence" title="Explain only what the data supports" description="Combine deterministic portfolio checks with verified Marketaux coverage. Filing and live-market conclusions remain unavailable until their sources are connected." /><IntelligenceWorkspace /></div>;
}
