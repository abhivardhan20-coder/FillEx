import { PageHeading } from '@/components/fillex/page-heading';
import { PortfolioWorkspace } from '@/components/fillex/portfolio-workspace';

export default function PortfolioPage() {
  return <div className="space-y-6"><PageHeading eyebrow="Portfolio" title="Bring your own holdings" description="Build a private local portfolio now, then replace manual entry with broker sync when you provide credentials." /><PortfolioWorkspace /></div>;
}
