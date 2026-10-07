import { useMemo, useState } from 'react';
import { Check, ChevronDown, Link2, Search, X } from 'lucide-react';
import { statusMeta, type LinkedTask, type Status, type TaskRef } from '@/data/tracker';

/** Open work first, finished work last, so today's tasks are near the top */
const rank: Record<Status, number> = { in_progress: 0, todo: 1, backlog: 2, done: 3 };

/** A linked task as a small pill, with its live status when the task still exists. */
export function TaskChip({
  title,
  status,
  onRemove,
}: {
  title: string;
  status?: Status;
  onRemove?: () => void;
}) {
  const m = status ? statusMeta[status] : null;
  const done = status === 'done';
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        done ? 'border-live/40 bg-live/10 text-live' : 'border-border bg-surface-2 text-ink'
      }`}
      title={m ? `${title} (${m.label})` : `${title} (task no longer exists)`}
    >
      {done ? <Check size={12} className="shrink-0" /> : <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${m?.dot ?? 'bg-ink-muted/50'}`} />}
      <span className="truncate">{title}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${title}`}
          className="shrink-0 rounded-full text-ink-muted hover:text-danger"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}

/** Linked tasks for a saved shift, resolved against the live task list. */
export function LinkedTaskChips({ linked, tasks }: { linked: LinkedTask[]; tasks: TaskRef[] }) {
  if (linked.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {linked.map((l) => {
        const live = tasks.find((t) => t.id === l.id);
        return <TaskChip key={l.id} title={live?.title ?? l.title} status={live?.status} />;
      })}
    </div>
  );
}

/** Pick the tasks worked on during a shift. Selected tasks show as removable chips. */
export default function TaskPicker({
  tasks,
  value,
  onChange,
}: {
  tasks: TaskRef[];
  value: LinkedTask[];
  onChange: (next: LinkedTask[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(() => new Set(value.map((v) => v.id)), [value]);
  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => !q || t.title.toLowerCase().includes(q))
      .sort((a, b) => rank[a.status] - rank[b.status]);
  }, [tasks, query]);

  function toggle(t: TaskRef) {
    onChange(selected.has(t.id) ? value.filter((v) => v.id !== t.id) : [...value, { id: t.id, title: t.title }]);
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-ink-muted transition-colors hover:border-gold hover:text-gold"
      >
        <Link2 size={15} />
        {value.length > 0 ? `${value.length} task${value.length === 1 ? '' : 's'} linked` : 'Link tasks'}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((v) => {
            const live = tasks.find((t) => t.id === v.id);
            return (
              <TaskChip
                key={v.id}
                title={live?.title ?? v.title}
                status={live?.status}
                onRemove={() => onChange(value.filter((x) => x.id !== v.id))}
              />
            );
          })}
        </div>
      )}

      {open && (
        <div className="rounded-xl border border-border bg-bg">
          <div className="relative border-b border-border">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              className="w-full bg-transparent py-2.5 pl-9 pr-3 text-sm text-ink outline-none"
              placeholder="Search your tasks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search tasks to link"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto p-1.5">
            {options.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-ink-muted">
                {tasks.length === 0 ? 'No tasks yet. Add some on the Tasks tab.' : 'No tasks match.'}
              </li>
            )}
            {options.map((t) => {
              const on = selected.has(t.id);
              const m = statusMeta[t.status];
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => toggle(t)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2 ${
                      on ? 'bg-gold/10' : ''
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        on ? 'border-gold bg-gold text-bg' : 'border-border'
                      }`}
                    >
                      {on && <Check size={12} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{t.title}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${m.bg} ${m.text}`}>{m.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
