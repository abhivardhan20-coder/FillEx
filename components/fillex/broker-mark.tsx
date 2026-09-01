import Image from 'next/image';

import { cn } from '@/lib/utils';

export function BrokerMark({
  name,
  logoPath,
  className,
}: {
  name: string;
  logoPath: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm',
        className,
      )}
    >
      {/* Official broker-owned favicon/brand mark, stored locally to avoid third-party tracking. */}
      <Image
        src={logoPath}
        alt={`${name} logo`}
        width={96}
        height={96}
        className="size-full object-contain"
      />
    </span>
  );
}
