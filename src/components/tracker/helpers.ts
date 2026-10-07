import type { Subtask, Task } from '@/data/tracker';

export function formatDate(iso: string | null) {
  if (!iso) return '';
  // date-only strings (due dates) must not shift timezone
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00`) : new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** yyyy-mm-dd for today in the viewer's local time, the same shape as a task's due_date */
export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Due today and still open, this is what lights up the KITT scanner strip */
export function isDueToday(task: Task) {
  return task.due_date === todayKey() && task.status !== 'done';
}

export function isOverdue(task: Task) {
  if (!task.due_date || task.status === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${task.due_date}T00:00:00`) < today;
}

export function subtaskProgress(subs: Subtask[]) {
  const done = subs.filter((s) => s.done).length;
  return { done, total: subs.length };
}
