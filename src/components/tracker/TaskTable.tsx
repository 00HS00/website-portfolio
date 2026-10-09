import { useEffect, useState } from 'react';
import { ChevronDown, PanelRight } from 'lucide-react';
import { priorityMeta, statusMeta, statusOrder, type Status, type Subtask, type Task } from '@/data/tracker';
import { DueLabel, KittStrip, NewBadge, PriorityPill, Avatar } from './ui';
import { formatDate, isDueToday, subtaskProgress } from './helpers';
import QuickActions, { type QuickHandlers } from './QuickActions';

interface Props {
  tasks: Task[];
  subtasks: Subtask[];
  isNew: (t: Task) => boolean;
  /** opens the side panel */
  onOpen: (t: Task) => void;
  handlers: QuickHandlers;
  /** task to expand and scroll to */
  focusId?: string | null;
}

const COLS =
  'grid grid-cols-[minmax(220px,2.4fr)_140px_100px_160px_60px_130px_130px_72px] items-center gap-4';

function sortTasks(list: Task[], status: Status) {
  return [...list].sort((a, b) => {
    if (status === 'done') return (b.completed_at ?? '').localeCompare(a.completed_at ?? '');
    const p = priorityMeta[a.priority].rank - priorityMeta[b.priority].rank;
    if (p !== 0) return p;
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return b.created_at.localeCompare(a.created_at);
  });
}

function Row({
  task: t,
  subtasks,
  isNew,
  expanded,
  onToggle,
  onOpen,
  handlers,
}: {
  task: Task;
  subtasks: Subtask[];
  isNew: boolean;
  expanded: boolean;
  onToggle: () => void;
  onOpen: () => void;
  handlers: QuickHandlers;
}) {
  const m = statusMeta[t.status];
  const isDone = t.status === 'done';
  const { done, total } = subtaskProgress(subtasks);
  const dueToday = isDueToday(t);
  return (
    <div
      id={`task-row-${t.id}`}
      className={`relative overflow-hidden rounded-xl border bg-surface shadow-sm transition-all hover:border-gold/50 hover:shadow-md ${
        dueToday ? 'border-danger/60' : expanded ? 'border-gold/40' : 'border-border'
      } ${isDone && !expanded ? 'opacity-80' : ''}`}
    >
      {dueToday && <KittStrip />}
      <span className={`absolute inset-y-0 left-0 w-1.5 ${priorityMeta[t.priority].stripe}`} />

      <div onClick={onToggle} className={`${COLS} cursor-pointer pb-3.5 pl-6 pr-4 ${dueToday ? 'pt-5' : 'pt-3.5'}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`truncate font-medium ${isDone ? 'text-ink-muted line-through' : 'text-ink'}`}>{t.title}</span>
            {isNew && <NewBadge />}
          </div>
          {t.tag && <div className="mt-0.5 text-xs text-ink-muted">{t.tag}</div>}
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={t.status}
            onChange={(e) => handlers.onStatus(t, e.target.value as Status)}
            aria-label={`Status of ${t.title}`}
            className={`w-full cursor-pointer rounded-full border-0 py-1 pl-3 pr-2 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-gold ${m.bg} ${m.text}`}
          >
            {statusOrder.map((s) => (
              <option key={s} value={s} className="bg-surface text-ink">
                {statusMeta[s].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <PriorityPill priority={t.priority} />
        </div>

        <div className="text-sm">
          <DueLabel task={t} />
        </div>

        <div className="text-sm text-ink-muted">{t.est_hours ? `${t.est_hours}h` : ''}</div>

        <div className="text-sm text-ink-muted">
          {isDone ? (
            formatDate(t.completed_at)
          ) : total > 0 ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-14 overflow-hidden rounded-full bg-border">
                <span className="block h-full rounded-full bg-live" style={{ width: `${(done / total) * 100}%` }} />
              </span>
              {done}/{total}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <Avatar name={t.created_by} />
          <span className="min-w-0">
            <span className="block truncate">{t.created_by || 'Unknown'}</span>
            <span className="block text-xs">{formatDate(t.created_at)}</span>
          </span>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            title="Open details panel"
            aria-label={`Open details for ${t.title}`}
            className="rounded p-1.5 text-ink-muted transition-colors hover:bg-surface-2 hover:text-gold"
          >
            <PanelRight size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide quick actions' : 'Show quick actions'}
            className="rounded p-1.5 text-ink-muted transition-colors hover:bg-surface-2 hover:text-gold"
          >
            <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pb-4 pl-6 pr-5">
          <QuickActions task={t} subtasks={subtasks} handlers={handlers} />
        </div>
      )}
    </div>
  );
}

export default function TaskTable({ tasks, subtasks, isNew, onOpen, handlers, focusId }: Props) {
  // rows start collapsed, the dropdown is the default way to interact
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // a task linked from the hours page opens its dropdown and scrolls into view
  useEffect(() => {
    if (!focusId) return;
    setExpanded((prev) => new Set(prev).add(focusId));
    requestAnimationFrame(() =>
      document.getElementById(`task-row-${focusId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    );
  }, [focusId]);
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const groups = statusOrder
    .map((status) => ({ status, items: sortTasks(tasks.filter((t) => t.status === status), status) }))
    .filter((g) => g.items.length > 0);

  if (groups.length === 0) {
    return <p className="rounded-xl border border-dashed border-border py-16 text-center text-ink-muted">No tasks match.</p>;
  }

  return (
    <div className="space-y-10">
      {groups.map(({ status, items }) => {
        const m = statusMeta[status];
        return (
          <section key={status}>
            <h2 className="mb-3 flex items-center gap-3 font-display text-lg font-semibold">
              <span className={`h-3 w-3 rounded-full ${m.dot}`} />
              {m.label}
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}>{items.length}</span>
            </h2>

            <div className="overflow-x-auto pb-1">
              <div className="min-w-[1040px]">
                <div className={`${COLS} px-4 pb-2 pl-6 text-xs font-medium uppercase tracking-wide text-ink-muted`}>
                  <span>Task</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span>Due</span>
                  <span>Est.</span>
                  <span>{status === 'done' ? 'Completed' : 'Progress'}</span>
                  <span>Added by</span>
                  <span />
                </div>

                <div className="space-y-2">
                  {items.map((t) => (
                    <Row
                      key={t.id}
                      task={t}
                      subtasks={subtasks.filter((s) => s.task_id === t.id)}
                      isNew={isNew(t)}
                      expanded={expanded.has(t.id)}
                      onToggle={() => toggle(t.id)}
                      onOpen={() => onOpen(t)}
                      handlers={handlers}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
