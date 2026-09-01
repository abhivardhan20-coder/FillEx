import { PageHeading } from '@/components/fillex/page-heading';
import { RagWorkspace } from '@/components/fillex/rag-workspace';

export default function RagPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="RAG Lab"
        title="Evidence-grounded portfolio reasoning"
        description="Explore how FillEx can retrieve, rank, and cite portfolio evidence before producing an explanation. This prototype does not call a live model or claim current market facts."
      />
      <RagWorkspace />
    </div>
  );
}
