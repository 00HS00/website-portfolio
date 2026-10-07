import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { ChevronDown, PanelRight, Plus } from 'lucide-react';
import { priorityMeta, statusMeta, statusOrder, type Status, type Subtask, type Task } from '@/data/tracker';
import { DueLabel, KittStrip, NewBadge, PriorityPill, Avatar } from './ui';
import { isDueToday, subtaskProgress } from './helpers';
import QuickActions, { type QuickHandlers } from './QuickActions';

interface Props {
  tasks: Task[];
  subtasks: Subtask[];
  isNew: (t: Task) => boolean;
  /** opens the side panel */
  onOpen: (t: Task) => void;
  onMove: (t: Task, status: Status) => void;
  onAdd: (status: Status) => void;
  handlers: QuickHandlers;
}

/** Small icon buttons must not start a drag (their click handlers also stop the card from toggling) */
const stopPointer = (e: React.PointerEvent) => e.stopPropagation();

function CardBody({
  task,
  subtasks,
  isNew,
  expanded,
  onToggle,
  onOpenPanel,
  handlers,
}: {
  task: Task;
  subtasks: Subtask[];
  isNew: boolean;
  expanded: boolean;
  onToggle?: () => void;
  onOpenPanel?: () => void;
  handlers?: QuickHandlers;
}) {
  const { done, total } = subtaskProgress(subtasks);
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-surface p-4 pl-5 text-left text-sm shadow-sm ${
        isDueToday(task) ? 'border-danger/60 pt-5' : 'border-border'
      }`}
    >
      {isDueToday(task) && <KittStrip />}
      <span className={`absolute inset-y-0 left-0 w-1.5 ${priorityMeta[task.priority].stripe}`} />
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className={`font-medium leading-snug ${task.status === 'done' ? 'text-ink-muted line-through' : ''}`}>{task.title}</span>
        <div className="-mr-1.5 -mt-1 flex shrink-0 items-center">
          {isNew && <NewBadge />}
          {onOpenPanel && (
            <button
              type="button"
              onPointerDown={stopPointer}
              onClick={(e) => {
                e.stopPropagation();
                onOpenPanel();
              }}
              title="Open details panel"
              aria-label={`Open details for ${task.title}`}
              className="rounded p-1.5 text-ink-muted transition-colors hover:bg-surface-2 hover:text-gold"
            >
              <PanelRight size={16} />
            </button>
          )}
          {onToggle && (
            <button
              type="button"
              onPointerDown={stopPointer}
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
          )}
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <PriorityPill priority={task.priority} />
        {task.tag && <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-ink-muted">{task.tag}</span>}
      </div>
      {total > 0 && (
        <div className="mb-3 flex items-center gap-2 text-xs text-ink-muted">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <span className="block h-full rounded-full bg-live" style={{ width: `${(done / total) * 100}%` }} />
          </span>
          {done}/{total}
        </div>
      )}
      <div className="flex items-center justify-between gap-2 text-xs">
        <DueLabel task={task} />
        <span className="flex items-center gap-1.5 text-ink-muted" title={`Added by ${task.created_by || 'Unknown'}`}>
          <Avatar name={task.created_by} size={18} />
          {task.created_by || 'Unknown'}
        </span>
      </div>
      {expanded && handlers && (
        <div className="mt-4">
          <QuickActions task={task} subtasks={subtasks} handlers={handlers} />
        </div>
      )}
    </div>
  );
}

function DraggableCard(props: {
  task: Task;
  subtasks: Subtask[];
  isNew: boolean;
  expanded: boolean;
  onToggle: () => void;
  onOpenPanel: () => void;
  handlers: QuickHandlers;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: props.task.id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={props.onToggle}
      className={`cursor-grab touch-none rounded-xl transition-all hover:-translate-y-px hover:shadow-md active:cursor-grabbing ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      <CardBody {...props} />
    </div>
  );
}

function Column({ status, children, count, onAdd }: { status: Status; children: React.ReactNode; count: number; onAdd: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const m = statusMeta[status];
  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-[280px] flex-1 flex-col overflow-hidden rounded-2xl border bg-surface-2/60 transition-colors ${
        isOver ? 'border-gold ring-2 ring-gold/30' : 'border-border'
      }`}
    >
      <div className={`h-1.5 bg-gradient-to-r ${m.bar} to-transparent`} />
      <div className="flex items-center justify-between px-4 pb-1 pt-3">
        <span className="flex items-center gap-2 font-display text-base font-semibold">
          <span className={`h-2.5 w-2.5 rounded-full ${m.dot}`} />
          {m.label}
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}>{count}</span>
        </span>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add task to ${m.label}`}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface hover:text-gold"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex min-h-[120px] flex-1 flex-col gap-3 p-3">
        {children}
        {count === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border py-8 text-xs text-ink-muted">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks, subtasks, isNew, onOpen, onMove, onAdd, handlers }: Props) {
  // small distance so a plain click still opens the dropdown
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [activeId, setActiveId] = useState<string | null>(null);
  // cards start collapsed, expanding one is remembered while you move it between columns
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const active = tasks.find((t) => t.id === activeId) ?? null;

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (!e.over) return;
    const task = tasks.find((t) => t.id === e.active.id);
    const status = e.over.id as Status;
    if (task && task.status !== status) onMove(task, status);
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusOrder.map((status) => {
          const items = tasks.filter((t) => t.status === status);
          return (
            <Column key={status} status={status} count={items.length} onAdd={() => onAdd(status)}>
              {items.map((t) => (
                <DraggableCard
                  key={t.id}
                  task={t}
                  subtasks={subtasks.filter((s) => s.task_id === t.id)}
                  isNew={isNew(t)}
                  expanded={expanded.has(t.id)}
                  onToggle={() => toggle(t.id)}
                  onOpenPanel={() => onOpen(t)}
                  handlers={handlers}
                />
              ))}
            </Column>
          );
        })}
      </div>
      <DragOverlay>
        {active && (
          <div className="rotate-2 cursor-grabbing shadow-2xl">
            <CardBody task={active} subtasks={subtasks.filter((s) => s.task_id === active.id)} isNew={isNew(active)} expanded={false} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
