import { useEffect, useRef, useState } from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';

interface TimelineItem {
  type: 'work' | 'education';
  period: string;
  title: string;
  org: string;
  desc: string;
}

function TimelineRow({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const tone = index % 2 === 0 ? 'gold' : 'blue';
  const alignRight = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Icon = item.type === 'work' ? Briefcase : GraduationCap;
  const dotTone = tone === 'gold' ? 'bg-gold' : 'bg-blue';
  const iconTone = tone === 'gold' ? 'text-gold bg-gold/10 border-gold/25' : 'text-blue bg-blue/10 border-blue/25';
  const periodTone = tone === 'gold' ? 'text-gold' : 'text-blue';

  return (
    <div ref={ref} className="relative lg:grid lg:grid-cols-2 lg:gap-x-12">
      {/* Node on the center line (desktop) */}
      <div
        className={`absolute left-0 top-1.5 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full ${dotTone} ring-4 ring-bg transition-all duration-500 lg:block ${
          visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        style={{ left: '50%' }}
      />
      {/* Node on the left line (mobile) */}
      <div
        className={`absolute -left-[calc(2rem+4px)] top-1.5 h-2 w-2 rounded-full ${dotTone} transition-all duration-500 lg:hidden ${
          visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      />

      <div className={alignRight ? 'lg:col-start-2' : 'lg:col-start-1'}>
        <div
          className={`mb-10 rounded-2xl border border-border bg-surface p-6 transition-all duration-700 ease-out lg:mb-14 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: visible ? '80ms' : '0ms' }}
        >
          <div className="mb-3 flex items-center gap-3">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${iconTone}`}>
              <Icon size={16} />
            </span>
            <span className={`text-sm font-medium ${periodTone}`}>{item.period}</span>
          </div>
          <h3 className="font-display text-xl font-medium text-ink">{item.title}</h3>
          <p className="mt-0.5 text-base text-ink-muted">{item.org}</p>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">{item.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative border-l border-border pl-8 lg:border-l-0 lg:pl-0">
      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-duotone opacity-40 lg:block" style={{ left: '50%' }} />
      {items.map((item, i) => (
        <TimelineRow key={i} item={item} index={i} />
      ))}
    </div>
  );
}
