import { PageHeading } from '@/components/fillex/page-heading';
import { PortfolioWorkspace } from '@/components/fillex/portfolio-workspace';

export default function PortfolioPage() {
  return <div className="space-y-6"><PageHeading eyebrow="Portfolio" title="Your investments, automatically organized" description="Connect a broker to import holdings and positions. Manual entry remains available as a private fallback." /><PortfolioWorkspace /></div>;
}
