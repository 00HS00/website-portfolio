import { Link } from 'react-router-dom';
import { Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site';

const hasEmail = site.email && !site.email.startsWith('[');
const hasLinkedin = site.socials.linkedin.url;

export default function Footer() {
  return (
    <footer className="bg-bg">
      <div className="h-[3px] w-full bg-gradient-duotone" />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-6">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <h3 className="font-display text-2xl font-medium text-ink">{site.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{site.tagline}</p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
            <div>
              <p className="mb-4 text-xs text-ink-muted">Navigate</p>
              <ul className="space-y-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About' },
                  { to: '/work', label: 'Work' },
                  { to: '/contact', label: 'Contact' },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-ink transition-colors hover:text-blue">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs text-ink-muted">Connect</p>
              <ul className="space-y-2">
                {hasLinkedin && (
                  <li>
                    <a
                      href={site.socials.linkedin.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-2 text-sm text-ink transition-colors hover:text-blue"
                    >
                      LinkedIn
                      <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100" />
                    </a>
                  </li>
                )}
                {hasEmail && (
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="group flex items-center gap-2 text-sm text-ink transition-colors hover:text-blue"
                    >
                      Email
                      <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="font-mono text-xs text-ink-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
          <div className="flex items-center gap-4">
            {hasLinkedin && (
              <a
                href={site.socials.linkedin.url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-ink-muted transition-colors hover:text-blue"
              >
                <Linkedin size={18} />
              </a>
            )}
            {hasEmail && (
              <a href={`mailto:${site.email}`} aria-label="Email" className="text-ink-muted transition-colors hover:text-blue">
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
