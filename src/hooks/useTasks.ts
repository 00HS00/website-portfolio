import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Comment, Subtask, Task } from '@/data/tracker';

export type TaskDraft = Partial<
  Pick<Task, 'title' | 'details' | 'status' | 'priority' | 'due_date' | 'est_hours' | 'tag'>
>;

export function useTasks(actor: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const [t, s, c] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('subtasks').select('*'),
      supabase.from('comments').select('*').order('created_at', { ascending: true }),
    ]);
    const firstError = t.error ?? s.error ?? c.error;
    if (firstError) {
      setError(firstError.message);
    } else {
      setError(null);
      setTasks(t.data as Task[]);
      // oldest first so ticking an item never reshuffles the checklist
      setSubtasks((s.data as Subtask[]).sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? '')));
      setComments(c.data as Comment[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;
    void load();
    const channel = client
      .channel('tracker')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subtasks' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => void load())
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [load]);

  const addTask = useCallback(
    async (draft: TaskDraft) => {
      if (!supabase) return;
      const status = draft.status ?? 'todo';
      const { error: err } = await supabase.from('tasks').insert({
        ...draft,
        status,
        created_by: actor,
        updated_by: actor,
        completed_at: status === 'done' ? new Date().toISOString() : null,
      });
      if (err) return setError(err.message);
      void load();
    },
    [actor, load],
  );

  const updateTask = useCallback(
    async (task: Task, patch: TaskDraft) => {
      if (!supabase) return;
      const extra: Partial<Task> = {};
      if (patch.status && patch.status !== task.status) {
        extra.completed_at = patch.status === 'done' ? new Date().toISOString() : null;
      }
      // optimistic update so drag and drop and dropdowns feel instant
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...patch, ...extra } : t)));
      const { error: err } = await supabase
        .from('tasks')
        .update({ ...patch, ...extra, updated_by: actor, updated_at: new Date().toISOString() })
        .eq('id', task.id);
      if (err) setError(err.message);
      void load();
    },
    [actor, load],
  );

  const deleteTask = useCallback(
    async (task: Task) => {
      if (!supabase) return;
      const { error: err } = await supabase.from('tasks').delete().eq('id', task.id);
      if (err) return setError(err.message);
      void load();
    },
    [load],
  );

  const addSubtask = useCallback(
    async (task: Task, text: string) => {
      if (!supabase) return;
      await supabase.from('subtasks').insert({ task_id: task.id, text });
      void load();
    },
    [load],
  );

  const toggleSubtask = useCallback(
    async (sub: Subtask) => {
      if (!supabase) return;
      setSubtasks((prev) => prev.map((s) => (s.id === sub.id ? { ...s, done: !s.done } : s)));
      await supabase.from('subtasks').update({ done: !sub.done }).eq('id', sub.id);
      void load();
    },
    [load],
  );

  const deleteSubtask = useCallback(
    async (sub: Subtask) => {
      if (!supabase) return;
      await supabase.from('subtasks').delete().eq('id', sub.id);
      void load();
    },
    [load],
  );

  const addComment = useCallback(
    async (task: Task, body: string) => {
      if (!supabase) return;
      await supabase.from('comments').insert({ task_id: task.id, author: actor, body });
      void load();
    },
    [actor, load],
  );

  return {
    tasks,
    subtasks,
    comments,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
  };
}
