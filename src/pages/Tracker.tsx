import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, KanbanSquare, LayoutList, Plus, Search } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useTasks } from '@/hooks/useTasks';
import { priorityMeta, priorityOrder, statusMeta, statusOrder, type Priority, type Status, type Task } from '@/data/tracker';
import TrackerShell from '@/components/tracker/TrackerShell';
import TaskTable from '@/components/tracker/TaskTable';
import KanbanBoard from '@/components/tracker/KanbanBoard';
import TaskDrawer from '@/components/tracker/TaskDrawer';
import type { QuickHandlers } from '@/components/tracker/QuickActions';
import { isDueToday, isOverdue, todayKey } from '@/components/tracker/helpers';

type View = 'list' | 'board';

const VISIT_KEY = 'tracker:lastVisit';

function store(key: string, value?: string): string | null {
  try {
    if (value !== undefined) localStorage.setItem(key, value);
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

const select =
  'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-gold';

function TasksView({ name }: { name: string }) {
  const data = useTasks(name);

  // The page stays open all day, so re-check the date and let "due today" roll over at midnight
  const [today, setToday] = useState(todayKey);
  useEffect(() => {
    const id = setInterval(() => setToday(todayKey()), 60_000);
    return () => clearInterval(id);
  }, []);

  // The page always opens on the board, the list is one click away
  const [view, setView] = useState<View>('board');
  const [search, setSearch] = useState('');
  const [fStatus, setFStatus] = useState<'' | Status>('');
  const [fPriority, setFPriority] = useState<'' | Priority>('');
  const [open, setOpen] = useState<{ task: Task | null; status: Status } | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  // /tracker?task=<id> (from a linked task on the hours page) opens that task once tasks have loaded
  const [params, setParams] = useSearchParams();
  const wanted = params.get('task');
  useEffect(() => {
    if (!wanted || data.loading) return;
    if (data.tasks.some((t) => t.id === wanted)) {
      // show the list with the task's dropdown open, clearing filters that could hide it
      setView('list');
      setSearch('');
      setFStatus('');
      setFPriority('');
      setFocusId(wanted);
    }
    setParams({}, { replace: true });
  }, [wanted, data.loading, data.tasks, setParams]);

  // "New" marks tasks someone else added since this browser last visited
  const [lastVisit] = useState(() => store(VISIT_KEY) ?? '');
  useEffect(() => {
    const save = () => store(VISIT_KEY, new Date().toISOString());
    window.addEventListener('pagehide', save);
    return () => {
      save();
      window.removeEventListener('pagehide', save);
    };
  }, []);
  const isNew = useCallback(
    (t: Task) => Boolean(lastVisit) && t.created_by !== name && t.created_at > lastVisit,
    [lastVisit, name],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.tasks.filter(
      (t) =>
        (!fStatus || t.status === fStatus) &&
        (!fPriority || t.priority === fPriority) &&
        (!q || `${t.title} ${t.details} ${t.tag}`.toLowerCase().includes(q)),
    );
  }, [data.tasks, search, fStatus, fPriority]);

  const stats = useMemo(() => {
    const total = data.tasks.length;
    const done = data.tasks.filter((t) => t.status === 'done').length;
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekStr = `${weekEnd.getFullYear()}-${String(weekEnd.getMonth() + 1).padStart(2, '0')}-${String(weekEnd.getDate()).padStart(2, '0')}`;
    return {
      total,
      pct: total ? Math.round((done / total) * 100) : 0,
      inProgress: data.tasks.filter((t) => t.status === 'in_progress').length,
      overdue: data.tasks.filter(isOverdue).length,
      today: data.tasks.filter(isDueToday).length,
      // after today, up to a week out
      week: data.tasks.filter((t) => t.status !== 'done' && t.due_date && t.due_date > today && t.due_date <= weekStr).length,
    };
  }, [data.tasks, today]);

  function exportCsv() {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Task', 'Details', 'Status', 'Priority', 'Due', 'Est hours', 'Category', 'Added by', 'Added', 'Completed'],
      ...data.tasks.map((t) => [
        t.title, t.details, statusMeta[t.status].label, priorityMeta[t.priority].label, t.due_date, t.est_hours,
        t.tag, t.created_by, t.created_at, t.completed_at,
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'woodlogix-tasks.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const stat = (label: string, value: string | number, tone: string, bar: string) => (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface px-4 py-3.5 shadow-sm">
      <span className={`absolute inset-x-0 top-0 h-1 ${bar}`} />
      <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</div>
      <div className={`mt-0.5 font-display text-3xl font-semibold ${tone}`}>{value}</div>
    </div>
  );

  const move = (task: Task, status: Status) => data.updateTask(task, { status });

  // quick edits shared by the board cards and the list rows
  const handlers: QuickHandlers = {
    onStatus: move,
    onPriority: (task, priority) => data.updateTask(task, { priority }),
    onToggleSubtask: data.toggleSubtask,
    onAddSubtask: data.addSubtask,
    onDeleteSubtask: data.deleteSubtask,
  };

  return (
    <>
      {data.error && (
        <p className="mb-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          Something went wrong talking to the database: {data.error}
        </p>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-6">
        {stat('Total', stats.total, 'text-ink', 'bg-ink-muted/40')}
        {stat('Complete', `${stats.pct}%`, 'text-live', 'bg-live')}
        {stat('In progress', stats.inProgress, 'text-gold', 'bg-gold')}
        {stat('Due today', stats.today, stats.today ? 'text-danger' : 'text-ink', stats.today ? 'bg-danger' : 'bg-ink-muted/40')}
        {stat('Due this week', stats.week, 'text-blue', 'bg-blue')}
        {stat('Overdue', stats.overdue, stats.overdue ? 'text-danger' : 'text-ink', stats.overdue ? 'bg-danger' : 'bg-ink-muted/40')}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          {([['board', 'Board', KanbanSquare], ['list', 'List', LayoutList]] as const).map(([v, text, Icon]) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                view === v ? 'bg-surface-2 text-gold shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Icon size={16} /> {text}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            className={`${select} w-52 pl-9`}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tasks"
          />
        </div>
        <select className={select} value={fStatus} onChange={(e) => setFStatus(e.target.value as '' | Status)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {statusOrder.map((s) => <option key={s} value={s}>{statusMeta[s].label}</option>)}
        </select>
        <select className={select} value={fPriority} onChange={(e) => setFPriority(e.target.value as '' | Priority)} aria-label="Filter by priority">
          <option value="">All priorities</option>
          {priorityOrder.map((s) => <option key={s} value={s}>{priorityMeta[s].label}</option>)}
        </select>
        <button type="button" onClick={exportCsv} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-gold">
          <Download size={15} /> Export CSV
        </button>
        <button
          type="button"
          onClick={() => setOpen({ task: null, status: 'todo' })}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-bg shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus size={18} /> New task
        </button>
      </div>

      {data.loading ? (
        <p className="py-16 text-center text-ink-muted">Loading...</p>
      ) : data.tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-16 text-center text-ink-muted">
          No tasks yet. Click New task to add the first one.
        </p>
      ) : view === 'list' ? (
        <TaskTable
          tasks={filtered}
          subtasks={data.subtasks}
          isNew={isNew}
          onOpen={(task) => setOpen({ task, status: task.status })}
          handlers={handlers}
          focusId={focusId}
        />
      ) : (
        <KanbanBoard
          tasks={filtered}
          subtasks={data.subtasks}
          isNew={isNew}
          onOpen={(task) => setOpen({ task, status: task.status })}
          onMove={move}
          onAdd={(status) => setOpen({ task: null, status })}
          handlers={handlers}
        />
      )}

      {open && (
        <TaskDrawer
          // fresh form state whenever a different task opens
          key={open.task?.id ?? `new-${open.status}`}
          task={open.task ? data.tasks.find((t) => t.id === open.task?.id) ?? open.task : null}
          initialStatus={open.status}
          subtasks={open.task ? data.subtasks.filter((s) => s.task_id === open.task?.id) : []}
          comments={open.task ? data.comments.filter((c) => c.task_id === open.task?.id) : []}
          onClose={() => setOpen(null)}
          onCreate={data.addTask}
          onUpdate={(task, patch) => data.updateTask(task, patch)}
          onDelete={data.deleteTask}
          onAddSubtask={data.addSubtask}
          onToggleSubtask={data.toggleSubtask}
          onDeleteSubtask={data.deleteSubtask}
          onAddComment={data.addComment}
        />
      )}
    </>
  );
}

export default function Tracker() {
  usePageMeta('Woodlogix Work Tracker', 'Task tracker for Woodlogix work.');
  return <TrackerShell>{(name) => <TasksView name={name} />}</TrackerShell>;
}
