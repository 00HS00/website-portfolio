import { useEffect, useState } from 'react';

export default function CyclingSkills({ items, tone }: { items: readonly string[]; tone: 'gold' | 'blue' }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduced || items.length <= 1) return;
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, 350);
    }, 2400);
    return () => clearInterval(cycle);
  }, [reduced, items.length]);

  const textTone = tone === 'gold' ? 'text-gold' : 'text-blue';
  const dotTone = tone === 'gold' ? 'bg-gold' : 'bg-blue';
  const pillBorder = tone === 'gold' ? 'border-gold/25' : 'border-blue/25';

  if (reduced) {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`rounded-full border ${pillBorder} bg-surface px-4 py-1.5 text-sm text-ink-muted`}>
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex min-h-[64px] items-center overflow-hidden">
        <span
          className={`font-display text-xl font-medium leading-snug transition-all duration-300 sm:text-2xl ${textTone} ${
            visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
        >
          {items[index]}
        </span>
      </div>
      <div className="mt-5 flex gap-1.5">
        {items.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${i === index ? `w-6 ${dotTone}` : 'w-1.5 bg-border'}`}
          />
        ))}
      </div>
    </div>
  );
}
