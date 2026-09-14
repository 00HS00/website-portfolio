import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projects, categories, domainMeta, statusMeta, type Status } from '@/data/projects';
import SectionTag from '@/components/SectionTag';
import { usePageMeta } from '@/hooks/usePageMeta';

const filters = ['All', ...categories];

export default function Work() {
  usePageMeta(
    'Work | Hamza Syed',
    'Case studies from Clinder to a butcher shop ordering platform: real problems, real builds.'
  );

  const [active, setActive] = useState('All');

  const visible = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  const inProgress = visible.filter((p) => p.status === 'in-progress');
  const delivered = visible.filter((p) => p.status === 'delivered');

  const renderGroup = (status: Status, items: typeof projects) => {
    if (items.length === 0) return null;
    const meta = statusMeta[status];
    return (
      <div className="mb-16 last:mb-0">
        <div className="mb-6 flex items-center gap-2.5">
          <span className={`h-2 w-2 rounded-full ${meta.dotClassName}`} />
          <h2 className="font-display text-xl font-medium text-ink">{meta.label}</h2>
          <span className="text-sm text-ink-muted">({items.length})</span>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((project) => (
            <Link
              key={project.slug}
              to={`/work/${project.slug}`}
              className="group block overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-300 hover:border-blue/30"
            >
              <div className={`h-1.5 w-full ${domainMeta[project.domain].className}`} />
              <div className="aspect-[16/11] overflow-hidden bg-surface-2">
                <img
                  src={project.cover}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44">
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[400px] w-[550px] rounded-full bg-gold/[0.14] blur-[120px]" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[350px] w-[350px] rounded-full bg-blue/[0.14] blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-6">
          <SectionTag>Work</SectionTag>
          <h1 className="font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl lg:text-6xl animate-fade-up text-balance">
            Projects built to remove a specific friction.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted animate-fade-up" style={{ animationDelay: '0.08s' }}>
            Each one started as a real, tedious problem, not an exercise. Some lean more business, some more technical; the dot on each card shows which.
          </p>
        </div>
      </section>

      {/* Filter + Gallery */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-6 lg:pb-28">
        <div className="mb-10 flex flex-wrap gap-2.5">
          {filters.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`rounded-md border px-4 py-2 text-sm transition-colors duration-200 ${
                active === cat
                  ? 'border-blue bg-blue text-bg'
                  : 'border-border bg-surface text-ink-muted hover:border-blue/30 hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-muted">No projects in this category yet.</p>
        ) : (
          <div>
            {renderGroup('in-progress', inProgress)}
            {renderGroup('delivered', delivered)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border bg-surface">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-duotone opacity-[0.08] blur-[110px]" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center lg:px-6">
          <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl text-balance">
            Have a project in mind?
          </h2>
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-duotone px-7 py-3.5 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
          >
            Start a conversation
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink">
            <ArrowLeft size={16} />
            Back home
          </Link>
        </div>
      </section>
    </>
  );
}
