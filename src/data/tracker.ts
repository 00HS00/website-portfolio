export type Status = 'backlog' | 'todo' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  details: string;
  status: Status;
  priority: Priority;
  due_date: string | null;
  est_hours: number | null;
  tag: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Subtask {
  id: string;
  task_id: string;
  text: string;
  done: boolean;
  /** added by supabase/update-2.sql, so it may be missing on an older database */
  created_at?: string;
}

export interface Comment {
  id: string;
  task_id: string;
  author: string;
  body: string;
  created_at: string;
}

/** A task attached to a shift. The title is a snapshot so history survives a deleted task. */
export interface LinkedTask {
  id: string;
  title: string;
}

export interface TimeEntry {
  id: string;
  person: string;
  check_in: string;
  check_out: string | null;
  note: string;
  /** added by supabase/update-3.sql, so it may be missing on an older database */
  linked_tasks?: LinkedTask[] | null;
  created_at: string;
}

export type TaskRef = Pick<Task, 'id' | 'title' | 'status'>

export type ExpenseKind = 'purchase' | 'mileage' | 'other';
export type ExpenseStatus = 'pending' | 'reimbursed';

export interface Expense {
  id: string;
  person: string;
  kind: ExpenseKind;
  description: string;
  amount: number;
  km: number | null;
  expense_date: string;
  notes: string;
  status: ExpenseStatus;
  created_at: string;
}

export const statusOrder: Status[] = ['backlog', 'todo', 'in_progress', 'done'];

/** accent is a Tailwind color token used for column tops, dots and pills */
export const statusMeta: Record<Status, { label: string; dot: string; text: string; bg: string; bar: string }> = {
  backlog: { label: 'Backlog', dot: 'bg-ink-muted', text: 'text-ink-muted', bg: 'bg-ink-muted/15', bar: 'from-ink-muted/60' },
  todo: { label: 'To do', dot: 'bg-blue', text: 'text-blue', bg: 'bg-blue/15', bar: 'from-blue' },
  in_progress: { label: 'In progress', dot: 'bg-gold', text: 'text-gold', bg: 'bg-gold/15', bar: 'from-gold' },
  done: { label: 'Done', dot: 'bg-live', text: 'text-live', bg: 'bg-live/15', bar: 'from-live' },
};

export const priorityOrder: Priority[] = ['urgent', 'high', 'medium', 'low'];

export const priorityMeta: Record<Priority, { label: string; text: string; bg: string; stripe: string; rank: number }> = {
  urgent: { label: 'Urgent', text: 'text-danger', bg: 'bg-danger/15', stripe: 'bg-danger', rank: 0 },
  high: { label: 'High', text: 'text-warn', bg: 'bg-warn/15', stripe: 'bg-warn', rank: 1 },
  medium: { label: 'Medium', text: 'text-gold', bg: 'bg-gold/15', stripe: 'bg-gold', rank: 2 },
  low: { label: 'Low', text: 'text-ink-muted', bg: 'bg-ink-muted/15', stripe: 'bg-ink-muted/50', rank: 3 },
};

export const expenseKindMeta: Record<ExpenseKind, { label: string; text: string; bg: string }> = {
  purchase: { label: 'Purchase', text: 'text-blue', bg: 'bg-blue/15' },
  mileage: { label: 'Mileage', text: 'text-gold', bg: 'bg-gold/15' },
  other: { label: 'Other', text: 'text-ink-muted', bg: 'bg-ink-muted/15' },
};

/** Edit these to change the pickers and rules on the tracker. */
export const trackerConfig = {
  /** Only these people can enter. Matching ignores case and extra spaces. */
  allowedNames: ['Hamza', 'Omer'],
  tags: ['Development', 'Bug fix', 'Design', 'Meeting', 'Research', 'Admin', 'Other'],
  /** Whose hours and expenses the Hours page tracks. Everyone else gets a read-only view. */
  hoursOwner: 'Hamza',
  /** Optional shared passcode on top of the name check. Empty string disables it. */
  passcode: '',
};
