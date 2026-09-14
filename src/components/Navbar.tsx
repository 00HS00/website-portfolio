import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { site } from '@/data/site';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-bg/85 backdrop-blur-xl border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="h-[3px] w-full bg-gradient-duotone" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="12" cy="16" r="8.5" stroke="#C9A15A" strokeWidth="2" />
            <circle cx="20" cy="16" r="8.5" stroke="#5B8DEF" strokeWidth="2" />
            <circle cx="16" cy="16" r="1.6" fill="#EDEFF3" />
          </svg>
          <span className="font-display text-lg font-medium text-ink">{site.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm transition-colors duration-200 ${
                  isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{l.label}</span>
                  <span
                    className={`absolute inset-x-4 -bottom-[1px] h-px bg-gradient-duotone transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <Link
          to="/contact"
          className="hidden rounded-md border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 hover:border-blue/50 hover:text-blue md:block"
        >
          Get in touch
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={17} /> : <Menu size={17} />}
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-border bg-bg/95 backdrop-blur-xl transition-[max-height] duration-300 md:hidden ${
          open ? 'max-h-96' : 'max-h-0 border-t-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-md px-4 py-3 text-base transition-colors ${
                  isActive ? 'bg-surface-2 text-ink' : 'text-ink-muted'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
