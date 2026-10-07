import { priorityMeta, statusMeta, type Priority, type Status, type Task } from '@/data/tracker';
import { formatDate, isDueToday, isOverdue } from './helpers';

/** KITT scanner strip across the top edge of a card. The parent must be `relative overflow-hidden`. */
export function KittStrip() {
  return (
    <div className="kitt-strip" aria-hidden="true">
      <div className="kitt-glow" />
    </div>
  );
}

export function StatusPill({ status }: { status: Status }) {
  const m = statusMeta[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export function PriorityPill({ priority }: { priority: Priority }) {
  const m = priorityMeta[priority];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}>{m.label}</span>;
}

export function DueLabel({ task }: { task: Task }) {
  if (!task.due_date) return <span className="text-ink-muted">No date</span>;
  if (isDueToday(task)) return <span className="font-semibold text-danger">Due today</span>;
  return (
    <span className={isOverdue(task) ? 'font-medium text-danger' : 'text-ink-muted'}>
      {formatDate(task.due_date)}
      {isOverdue(task) && ' (overdue)'}
    </span>
  );
}

export function NewBadge() {
  return <span className="rounded bg-blue/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue">New</span>;
}

/** Avatar bubble with the person's first initial */
export function Avatar({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-duotone font-display font-bold text-bg"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      {name.charAt(0) || '?'}
    </span>
  );
}
