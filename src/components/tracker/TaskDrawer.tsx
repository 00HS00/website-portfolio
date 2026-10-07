import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import {
  priorityMeta,
  priorityOrder,
  statusMeta,
  statusOrder,
  trackerConfig,
  type Comment,
  type Priority,
  type Status,
  type Subtask,
  type Task,
} from '@/data/tracker';
import type { TaskDraft } from '@/hooks/useTasks';
import { formatDateTime } from './helpers';

interface Props {
  /** null means creating a new task */
  task: Task | null;
  initialStatus: Status;
  subtasks: Subtask[];
  comments: Comment[];
  onClose: () => void;
  onCreate: (draft: TaskDraft) => Promise<void>;
  onUpdate: (task: Task, patch: TaskDraft) => Promise<void>;
  onDelete: (task: Task) => Promise<void>;
  onAddSubtask: (task: Task, text: string) => Promise<void>;
  onToggleSubtask: (s: Subtask) => Promise<void>;
  onDeleteSubtask: (s: Subtask) => Promise<void>;
  onAddComment: (task: Task, body: string) => Promise<void>;
}

const field =
  'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-gold';
const label = 'mb-1 block text-xs font-medium uppercase tracking-wide text-ink-muted';

export default function TaskDrawer(p: Props) {
  const { task } = p;
  const [form, setForm] = useState({
    title: task?.title ?? '',
    details: task?.details ?? '',
    status: (task?.status ?? p.initialStatus) as Status,
    priority: (task?.priority ?? 'medium') as Priority,
    due_date: task?.due_date ?? '',
    est_hours: task?.est_hours?.toString() ?? '',
    tag: task?.tag ?? '',
  });
  const [subText, setSubText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    if (!form.title.trim()) return;
    setSaving(true);
    const draft: TaskDraft = {
      title: form.title.trim(),
      details: form.details,
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || null,
      est_hours: form.est_hours ? Number(form.est_hours) : null,
      tag: form.tag,
    };
    if (task) await p.onUpdate(task, draft);
    else await p.onCreate(draft);
    setSaving(false);
    p.onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={p.onClose} />
      <aside className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-border bg-surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{task ? 'Task details' : 'New task'}</h2>
          <button type="button" onClick={p.onClose} aria-label="Close" className="rounded p-1 text-ink-muted hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="t-title">Task</label>
            <input id="t-title" className={field} value={form.title} onChange={(e) => set('title', e.target.value)} autoFocus />
          </div>
          <div>
            <label className={label} htmlFor="t-details">Details</label>
            <textarea id="t-details" rows={4} className={field} value={form.details} onChange={(e) => set('details', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="t-status">Status</label>
              <select id="t-status" className={field} value={form.status} onChange={(e) => set('status', e.target.value as Status)}>
                {statusOrder.map((s) => (
                  <option key={s} value={s}>{statusMeta[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="t-priority">Priority</label>
              <select id="t-priority" className={field} value={form.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
                {priorityOrder.map((s) => (
                  <option key={s} value={s}>{priorityMeta[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="t-due">Estimated completion</label>
              <input id="t-due" type="date" className={field} value={form.due_date} onChange={(e) => set('due_date', e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="t-hours">Estimated hours</label>
              <input id="t-hours" type="number" min="0" step="0.5" className={field} value={form.est_hours} onChange={(e) => set('est_hours', e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="t-tag">Category</label>
              <select id="t-tag" className={field} value={form.tag} onChange={(e) => set('tag', e.target.value)}>
                <option value="">None</option>
                {trackerConfig.tags.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {task ? (
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Delete this task? This cannot be undone.')) {
                    await p.onDelete(task);
                    p.onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-sm text-danger hover:opacity-80"
              >
                <Trash2 size={15} /> Delete
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving || !form.title.trim()}
              className="rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-bg disabled:opacity-40"
            >
              {saving ? 'Saving...' : task ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </div>

        {task && (
          <>
            <div className="mt-6 rounded-lg bg-bg p-3 text-xs text-ink-muted">
              Added by <span className="text-ink">{task.created_by || 'Unknown'}</span> on {formatDateTime(task.created_at)}
              <br />
              Last edited by <span className="text-ink">{task.updated_by || 'Unknown'}</span> on {formatDateTime(task.updated_at)}
              {task.completed_at && (
                <>
                  <br />
                  Completed {formatDateTime(task.completed_at)}
                </>
              )}
            </div>

            <h3 className="mb-2 mt-6 font-display text-sm font-semibold">Checklist</h3>
            <ul className="space-y-1.5">
              {p.subtasks.map((s) => (
                <li key={s.id} className="group flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={s.done} onChange={() => p.onToggleSubtask(s)} className="accent-gold" />
                  <span className={s.done ? 'text-ink-muted line-through' : ''}>{s.text}</span>
                  <button
                    type="button"
                    onClick={() => p.onDeleteSubtask(s)}
                    aria-label="Remove item"
                    className="ml-auto text-ink-muted opacity-0 hover:text-danger group-hover:opacity-100 focus:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="mt-2 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!subText.trim()) return;
                await p.onAddSubtask(task, subText.trim());
                setSubText('');
              }}
            >
              <input className={field} placeholder="Add a checklist item" value={subText} onChange={(e) => setSubText(e.target.value)} />
              <button type="submit" className="rounded-lg border border-border px-3 text-sm hover:border-gold">Add</button>
            </form>

            <h3 className="mb-2 mt-6 font-display text-sm font-semibold">Comments</h3>
            <ul className="space-y-3">
              {p.comments.map((c) => (
                <li key={c.id} className="rounded-lg bg-bg p-3 text-sm">
                  <div className="mb-1 text-xs text-ink-muted">
                    <span className="font-medium text-ink">{c.author}</span> · {formatDateTime(c.created_at)}
                  </div>
                  {c.body}
                </li>
              ))}
            </ul>
            <form
              className="mt-2 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!commentText.trim()) return;
                await p.onAddComment(task, commentText.trim());
                setCommentText('');
              }}
            >
              <input className={field} placeholder="Write a comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
              <button type="submit" className="rounded-lg border border-border px-3 text-sm hover:border-gold">Post</button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
