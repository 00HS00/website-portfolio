import type { Domain } from '@/data/projects';
import { domainMeta } from '@/data/projects';

export default function DomainDot({ domain }: { domain: Domain }) {
  const meta = domainMeta[domain];
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${meta.className}`}
      title={meta.label}
      aria-label={meta.label}
    />
  );
}
