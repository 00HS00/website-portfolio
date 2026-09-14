import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { featuredProjects, domainMeta } from '@/data/projects';
import { site } from '@/data/site';
import SectionTag from '@/components/SectionTag';
import DomainDot from '@/components/DomainDot';
import CyclingSkills from '@/components/CyclingSkills';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
    }
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44">
        <div className="pointer-events-none absolute -top-1/3 right-0 h-[550px] w-[550px] rounded-full bg-blue/[0.16] blur-[130px]" />
        <div className="pointer-events-none absolute top-1/4 left-0 h-[380px] w-[380px] rounded-full bg-gold/[0.14] blur-[120px]" />

        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-6">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_520px]">
            <div className="max-w-2xl">
              {site.availability.open && (
                <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-ink-muted animate-fade-in">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-live animate-pulse" />
                  {site.availability.label}
                </div>
              )}

              <h1 className="font-display text-5xl font-medium leading-[1.05] text-ink sm:text-6xl lg:text-7xl animate-fade-up text-balance">
                {site.name}
              </h1>

              <p
                className="mt-3 text-xl font-medium text-gradient sm:text-2xl animate-fade-up"
                style={{ animationDelay: '0.08s' }}
              >
                {site.title}
              </p>

              <p
                className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted animate-fade-up text-balance"
                style={{ animationDelay: '0.16s' }}
              >
                {site.tagline}
              </p>

              <div
                className="mt-10 flex flex-col items-start gap-4 animate-fade-up sm:flex-row sm:items-center"
                style={{ animationDelay: '0.24s' }}
              >
                <Link
                  to="/work"
                  className="group flex items-center gap-2 rounded-md bg-gradient-duotone px-6 py-3.5 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
                >
                  View my work
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-2 rounded-md border border-border px-6 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-blue/40"
                >
                  More about me
                </Link>
              </div>
            </div>

            {/* Signature mark: the intersection, animated */}
            <div className="hidden justify-self-center animate-fade-in lg:block" style={{ animationDelay: '0.3s' }}>
              <video
                ref={videoRef}
                width={480}
                height={270}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                aria-hidden="true"
                className="pointer-events-none"
              >
                <source src="/logo-animation.webm" type="video/webm" />
                <source src="/logo-animation-fallback.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="border-y border-border bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                <h3 className="font-display text-lg font-medium text-ink">Discover</h3>
              </div>
              <CyclingSkills items={site.skills.business} tone="gold" />
            </div>

            <div className="rounded-2xl border border-blue/25 bg-blue/[0.06] p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-blue" />
                <h3 className="font-display text-lg font-medium text-ink">Deliver</h3>
              </div>
              <CyclingSkills items={site.skills.build} tone="blue" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-6 lg:py-28">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionTag>Selected work</SectionTag>
            <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">Projects that started as a problem</h2>
          </div>
          <Link to="/work" className="group flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink">
            View all projects
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              to={`/work/${project.slug}`}
              className="group block overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-300 hover:border-blue/30"
            >
              <div className={`h-1.5 w-full ${domainMeta[project.domain].className}`} />
              <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                <img
                  src={project.cover}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between text-sm text-ink-muted">
                  <span className="flex items-center gap-2">
                    <DomainDot domain={project.domain} />
                    {project.year}
                  </span>
                  <span>{project.category}</span>
                </div>
                <h3 className="font-display text-2xl font-medium text-ink">{project.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-ink-muted">{project.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded border px-3 py-1 text-sm ${domainMeta[project.domain].tagClassName}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Introduction */}
      <section className="relative overflow-hidden border-t border-border bg-surface">
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-[350px] w-[350px] rounded-full bg-gold/[0.1] blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-6 lg:py-28">
          <div className="grid items-center gap-12 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -inset-3 rounded-xl bg-gradient-duotone opacity-20 blur-xl" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
                  <img
                    src={site.photoUrl}
                    alt={`${site.name}, professional headshot`}
                    loading="lazy"
                    className="h-full w-full object-cover object-[50%_22%]"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <SectionTag>About</SectionTag>
              <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl text-balance">
                {site.about.headline}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted">{site.about.qa[0].a}</p>
              <Link
                to="/about"
                className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-blue transition-colors hover:text-blue/80"
              >
                Read my full story
                <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
