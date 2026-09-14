import type { ReactNode } from 'react';

export default function SectionTag({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-xs text-ink-muted">
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <span className="h-1.5 w-1.5 rounded-full bg-blue" />
      </span>
      {children}
    </p>
  );
}
