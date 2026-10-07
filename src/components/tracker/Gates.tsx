import { useState } from 'react';
import { Lock } from 'lucide-react';
import { trackerConfig } from '@/data/tracker';

const input =
  'w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-ink outline-none focus:border-gold';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative mx-auto mt-32 max-w-md px-6 pb-24">
      <div className="pointer-events-none absolute -top-10 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-[80px]" />
      <div className="relative rounded-2xl border border-border bg-surface p-8 shadow-xl shadow-black/5">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <Lock size={20} />
        </div>
        <h1 className="mb-4 font-display text-2xl font-semibold">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export function PasscodeGate({ onPass }: { onPass: () => void }) {
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  return (
    <Card title="Enter passcode">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (value === trackerConfig.passcode) onPass();
          else setWrong(true);
        }}
      >
        <input type="password" className={input} value={value} onChange={(e) => setValue(e.target.value)} autoFocus aria-label="Passcode" />
        {wrong && <p className="text-sm text-danger">That passcode is not right.</p>}
        <button type="submit" className="w-full rounded-lg bg-gold py-2.5 font-semibold text-bg">Open tracker</button>
      </form>
    </Card>
  );
}

export function NamePrompt({ onSignIn }: { onSignIn: (name: string) => boolean }) {
  const [value, setValue] = useState('');
  const [rejected, setRejected] = useState(false);
  return (
    <Card title="Who is this?">
      <p className="mb-4 text-sm text-ink-muted">
        Enter your name to continue. It is attached to every task, hour and expense you add, so everyone can see who did what.
      </p>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setRejected(!onSignIn(value));
        }}
      >
        <input
          className={input}
          placeholder="Your name"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setRejected(false);
          }}
          autoFocus
          aria-label="Your name"
          aria-invalid={rejected}
        />
        {rejected && <p className="text-sm text-danger">Sorry, this tracker is private. Only approved people can enter.</p>}
        <button type="submit" disabled={!value.trim()} className="w-full rounded-lg bg-gold py-2.5 font-semibold text-bg disabled:opacity-40">
          Continue
        </button>
      </form>
    </Card>
  );
}

export function SetupNotice() {
  return (
    <Card title="Database not connected">
      <p className="text-sm text-ink-muted">
        Add <code className="text-ink">VITE_SUPABASE_URL</code> and <code className="text-ink">VITE_SUPABASE_ANON_KEY</code> to{' '}
        <code className="text-ink">.env.local</code> (and to the Vercel project settings), run the SQL files in{' '}
        <code className="text-ink">supabase/</code> in the Supabase SQL editor, then restart the dev server.
      </p>
    </Card>
  );
}
