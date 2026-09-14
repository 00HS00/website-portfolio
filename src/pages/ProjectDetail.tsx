import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { getProjectBySlug, projects, domainMeta } from '@/data/projects';
import DomainDot from '@/components/DomainDot';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug ?? '');

  usePageMeta(project ? `${project.title} | Hamza Syed` : 'Hamza Syed', project?.summary);

  if (!project) return <Navigate to="/work" replace />;

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-12 lg:pt-44">
        <div
          className={`pointer-events-none absolute -top-16 right-0 h-[400px] w-[500px] rounded-full opacity-[0.14] blur-[120px] ${domainMeta[project.domain].className}`}
        />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-6">
          <Link to="/work" className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink">
            <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            All projects
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
            <span>{project.year}</span>
            <span>&middot;</span>
            <span>{project.category}</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1.5">
              <DomainDot domain={project.domain} />
              {domainMeta[project.domain].label}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{project.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-md bg-gradient-duotone px-5 py-2.5 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
              >
                Visit live site
                <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-blue/40"
              >
                <Github size={15} />
                View code
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 lg:px-6">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className={`h-1.5 w-full ${domainMeta[project.domain].className}`} />
          <div className="aspect-[16/10] overflow-hidden bg-surface-2">
            <img src={project.cover} alt={project.title} className="h-full w-full object-contain" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-6 lg:py-24">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-sm text-ink-muted">Role</p>
            <p className="text-base leading-relaxed text-ink-muted">{project.role}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm text-ink-muted">Stack</p>
            <div className="flex flex-wrap gap-2">
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
        </div>

        <div className="mt-16 space-y-12">
          <div>
            <h2 className="mb-3 font-display text-2xl font-medium text-ink">The problem</h2>
            <p className="text-base leading-relaxed text-ink-muted">{project.problem}</p>
          </div>
          <div>
            <h2 className="mb-3 font-display text-2xl font-medium text-ink">The approach</h2>
            <p className="text-base leading-relaxed text-ink-muted">{project.approach}</p>
          </div>
          <div>
            <h2 className="mb-3 font-display text-2xl font-medium text-ink">The outcome</h2>
            <p className="text-base leading-relaxed text-ink-muted">{project.outcome}</p>
          </div>
        </div>
      </section>

      {/* Next project */}
      <section className="relative overflow-hidden border-t border-border bg-surface">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[250px] w-[450px] -translate-x-1/2 rounded-full bg-gradient-duotone opacity-[0.07] blur-[100px]" />
        <Link
          to={`/work/${next.slug}`}
          className="group relative mx-auto flex max-w-5xl items-center justify-between px-6 py-14 lg:px-6"
        >
          <div>
            <p className="mb-2 text-sm text-ink-muted">Next project</p>
            <h2 className="font-display text-2xl font-medium text-ink transition-colors duration-200 group-hover:text-blue sm:text-3xl">
              {next.title}
            </h2>
          </div>
          <ArrowUpRight size={24} className="shrink-0 text-ink-muted transition-all duration-200 group-hover:text-blue group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </section>
    </>
  );
}
