import { useState } from 'react';
import { X } from 'lucide-react';
import {
  priorityMeta,
  priorityOrder,
  statusMeta,
  statusOrder,
  type Priority,
  type Status,
  type Subtask,
  type Task,
} from '@/data/tracker';

export interface QuickHandlers {
  onStatus: (t: Task, status: Status) => void;
  onPriority: (t: Task, priority: Priority) => void;
  onToggleSubtask: (s: Subtask) => void;
  onAddSubtask: (t: Task, text: string) => void;
  onDeleteSubtask: (s: Subtask) => void;
}

const select =
  'w-full rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink outline-none focus:border-gold';

/** The expanded dropdown under a card or row: quick edits without opening the side panel. */
export default function QuickActions({
  task,
  subtasks,
  handlers,
}: {
  task: Task;
  subtasks: Subtask[];
  handlers: QuickHandlers;
}) {
  const [text, setText] = useState('');

  return (
    // clicks and drags in here must not toggle the card or start a board drag
    <div
      className="cursor-default space-y-4 border-t border-border/70 pt-4 text-left"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {task.details && <p className="line-clamp-4 whitespace-pre-line text-sm text-ink-muted">{task.details}</p>}

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-ink-muted">Status</span>
          <select className={select} value={task.status} onChange={(e) => handlers.onStatus(task, e.target.value as Status)}>
            {statusOrder.map((s) => (
              <option key={s} value={s}>{statusMeta[s].label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-ink-muted">Priority</span>
          <select className={select} value={task.priority} onChange={(e) => handlers.onPriority(task, e.target.value as Priority)}>
            {priorityOrder.map((p) => (
              <option key={p} value={p}>{priorityMeta[p].label}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-ink-muted">Checklist</span>
        {subtasks.length > 0 && (
          <ul className="mb-2 space-y-1.5">
            {subtasks.map((s) => (
              <li key={s.id} className="group flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={s.done}
                  onChange={() => handlers.onToggleSubtask(s)}
                  aria-label={s.text}
                  className="h-4 w-4 shrink-0 accent-gold"
                />
                <span className={`min-w-0 flex-1 break-words ${s.done ? 'text-ink-muted line-through' : ''}`}>{s.text}</span>
                <button
                  type="button"
                  onClick={() => handlers.onDeleteSubtask(s)}
                  aria-label={`Remove ${s.text}`}
                  className="shrink-0 text-ink-muted opacity-0 hover:text-danger focus:opacity-100 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            handlers.onAddSubtask(task, text.trim());
            setText('');
          }}
        >
          <input
            className={select}
            placeholder="Add a checklist item and press Enter"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Add a checklist item"
          />
        </form>
      </div>
    </div>
  );
}
