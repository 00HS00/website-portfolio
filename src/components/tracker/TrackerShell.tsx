import { useEffect, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Clock, KanbanSquare, LogOut } from 'lucide-react';
import { useIdentity } from '@/hooks/useIdentity';
import { supabaseConfigured } from '@/lib/supabase';
import { trackerConfig } from '@/data/tracker';
import { NamePrompt, PasscodeGate, SetupNotice } from './Gates';

const PASS_KEY = 'tracker:pass';

function readPass() {
  try {
    return localStorage.getItem(PASS_KEY);
  } catch {
    return null;
  }
}

const tabs = [
  { to: '/tracker', label: 'Tasks', icon: KanbanSquare, end: true },
  { to: '/tracker/hours', label: 'Hours & expenses', icon: Clock, end: false },
];

/** Page frame shared by the task board and the hours page: access checks, welcome header and tabs. */
export default function TrackerShell({ children }: { children: (name: string) => ReactNode }) {
  const { name, signIn, signOut } = useIdentity();
  const [unlocked, setUnlocked] = useState(() => !trackerConfig.passcode || readPass() === trackerConfig.passcode);

  // The tracker holds private work data, so keep it out of search results
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  if (!supabaseConfigured) return <SetupNotice />;
  if (!unlocked) {
    return (
      <PasscodeGate
        onPass={() => {
          try {
            localStorage.setItem(PASS_KEY, trackerConfig.passcode);
          } catch {
            /* passcode lasts for this visit only */
          }
          setUnlocked(true);
        }}
      />
    );
  }
  if (!name) return <NamePrompt onSignIn={signIn} />;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-gold/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 top-40 h-72 w-72 rounded-full bg-blue/10 blur-[110px]" />

      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-28">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gold">Woodlogix · Work Tracker</p>
            <h1 className="animate-fade-up font-display text-4xl font-bold sm:text-5xl">
              Welcome, <span className="text-gradient">{name}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-duotone font-display text-sm font-bold text-bg">
              {name.charAt(0)}
            </span>
            <span className="text-sm font-medium">{name}</span>
            <button
              type="button"
              onClick={signOut}
              title="Switch user"
              aria-label="Switch user"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-gold"
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <nav className="mb-8 inline-flex rounded-xl border border-border bg-surface p-1" aria-label="Tracker sections">
          {tabs.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-gold text-bg shadow-sm' : 'text-ink-muted hover:text-ink'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {children(name)}
      </section>
    </div>
  );
}
