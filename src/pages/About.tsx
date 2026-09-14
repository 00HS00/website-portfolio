import { Link } from 'react-router-dom';
import { ArrowRight, Download, MapPin, GraduationCap, Compass, Hammer } from 'lucide-react';
import { site } from '@/data/site';
import SectionTag from '@/components/SectionTag';
import CyclingSkills from '@/components/CyclingSkills';
import Timeline from '@/components/Timeline';
import { usePageMeta } from '@/hooks/usePageMeta';

const factIcons = [MapPin, GraduationCap, Compass, Hammer];

export default function About() {
  usePageMeta(
    'About | Hamza Syed',
    "Business Technologist based in Toronto. How I think, what I've built, and the path that got me here."
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40">
        <div className="pointer-events-none absolute -top-20 right-0 h-[500px] w-[500px] rounded-full bg-blue/[0.16] blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 left-0 h-[380px] w-[380px] rounded-full bg-gold/[0.14] blur-[110px]" />

        {/* Giant decorative duotone rings, signature mark blown up behind the content */}
        <svg
          className="pointer-events-none absolute -right-40 -top-24 hidden opacity-[0.07] lg:block"
          width="620" height="620" viewBox="0 0 620 620" fill="none" aria-hidden="true"
        >
          <circle cx="230" cy="310" r="220" stroke="#C9A15A" strokeWidth="2" />
          <circle cx="390" cy="310" r="220" stroke="#5B8DEF" strokeWidth="2" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-6">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex items-center justify-between gap-4">
                <SectionTag>About</SectionTag>
                {site.resumeUrl && (
                  <a
                    href={site.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-1.5 rounded-md border border-border px-3.5 py-1.5 text-sm text-ink-muted transition-colors duration-200 hover:border-blue/40 hover:text-ink"
                  >
                    <Download size={14} />
                    Resume
                  </a>
                )}
              </div>
              <h1 className="font-display text-5xl font-medium leading-[1.08] text-ink sm:text-6xl lg:text-7xl animate-fade-up text-balance">
                {site.about.headline}
              </h1>
            </div>

            {/* Portrait with the brand rings */}
            <div className="relative mx-auto h-64 w-72 shrink-0 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <div
                className="absolute top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-2 border-gold"
                style={{ left: '-2px' }}
              />
              <div
                className="absolute top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-2 border-blue"
                style={{ right: '-2px' }}
              />
              <img
                src={site.photoUrl}
                alt={site.name}
                className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-bg object-cover object-[50%_18%]"
              />
            </div>
          </div>

          {/* Quick facts */}
          <div className="relative mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {site.about.facts.map((fact, i) => {
              const Icon = factIcons[i % factIcons.length];
              const tone = i % 2 === 0 ? 'gold' : 'blue';
              return (
                <div
                  key={fact.label}
                  className={`rounded-xl border p-4 ${tone === 'gold' ? 'border-gold/20 bg-gold/[0.05]' : 'border-blue/20 bg-blue/[0.05]'}`}
                >
                  <Icon size={16} className={tone === 'gold' ? 'text-gold' : 'text-blue'} />
                  <p className="mt-2.5 text-sm text-ink-muted">{fact.label}</p>
                  <p className="mt-0.5 text-base font-medium text-ink">{fact.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story: interview format */}
      <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-6">
        <div className="space-y-12">
          {site.about.qa.map((item, i) => {
            const tone = i % 2 === 0 ? 'gold' : 'blue';
            return (
              <div key={i} className={`border-l-2 pl-6 ${tone === 'gold' ? 'border-gold/40' : 'border-blue/40'}`}>
                <p className={`font-display text-2xl font-medium sm:text-3xl ${tone === 'gold' ? 'text-gold' : 'text-blue'}`}>
                  {item.q}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-ink-muted">{item.a}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How I work: business + build */}
      <section className="border-y border-border bg-surface py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-6">
          <SectionTag>How I work</SectionTag>
          <h2 className="mb-14 font-display text-3xl font-medium text-ink sm:text-4xl">
            A few rules I actually follow
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                <h3 className="font-display text-xl font-medium text-ink">People</h3>
              </div>
              <CyclingSkills items={site.principles.business} tone="gold" />
            </div>

            <div className="rounded-2xl border border-blue/25 bg-blue/[0.06] p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-blue" />
                <h3 className="font-display text-xl font-medium text-ink">Product</h3>
              </div>
              <CyclingSkills items={site.principles.build} tone="blue" />
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-6 lg:py-28">
        <SectionTag>Experience & education</SectionTag>
        <h2 className="mb-16 font-display text-3xl font-medium text-ink sm:text-4xl">The path so far</h2>

        <Timeline items={[...site.experience]} />
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border bg-surface">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-duotone opacity-[0.08] blur-[110px]" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center lg:px-6">
          <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl text-balance">Want to work together?</h2>
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-duotone px-7 py-3.5 text-base font-medium text-bg transition-opacity duration-200 hover:opacity-90"
          >
            Get in touch
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
