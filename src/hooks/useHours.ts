import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Expense, ExpenseKind, ExpenseStatus, TimeEntry } from '@/data/tracker';

export interface ExpenseDraft {
  kind: ExpenseKind;
  description: string;
  amount: number;
  km: number | null;
  expense_date: string;
  notes: string;
}

export function useHours(actor: string, owner: string) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    // only the owner's records are shown, everyone else gets a read-only view of them
    const [t, e] = await Promise.all([
      supabase.from('time_entries').select('*').eq('person', owner).order('check_in', { ascending: false }),
      supabase.from('expenses').select('*').eq('person', owner).order('expense_date', { ascending: false }),
    ]);
    const firstError = t.error ?? e.error;
    if (firstError) {
      setError(`${firstError.message}. If this mentions a missing table or column, run the latest SQL from the supabase folder.`);
    } else {
      setError(null);
      setEntries(t.data as TimeEntry[]);
      setExpenses((e.data as Expense[]).map((x) => ({ ...x, amount: Number(x.amount), km: x.km == null ? null : Number(x.km) })));
    }
    setLoading(false);
  }, [owner]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;
    void load();
    const channel = client
      .channel('hours')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'time_entries' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => void load())
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [load]);

  const run = useCallback(
    async (job: PromiseLike<{ error: { message: string } | null }>) => {
      const { error: err } = await job;
      if (err) setError(err.message);
      else void load();
    },
    [load],
  );

  const checkIn = useCallback(
    (note: string) => {
      if (!supabase) return Promise.resolve();
      return run(supabase.from('time_entries').insert({ person: actor, check_in: new Date().toISOString(), note }));
    },
    [actor, run],
  );

  const checkOut = useCallback(
    (entry: TimeEntry, note: string) => {
      if (!supabase) return Promise.resolve();
      return run(supabase.from('time_entries').update({ check_out: new Date().toISOString(), note }).eq('id', entry.id));
    },
    [run],
  );

  const saveEntry = useCallback(
    (id: string | null, v: { check_in: string; check_out: string | null; note: string }) => {
      if (!supabase) return Promise.resolve();
      return run(
        id
          ? supabase.from('time_entries').update(v).eq('id', id)
          : supabase.from('time_entries').insert({ ...v, person: actor }),
      );
    },
    [actor, run],
  );

  const deleteEntry = useCallback(
    (id: string) => (supabase ? run(supabase.from('time_entries').delete().eq('id', id)) : Promise.resolve()),
    [run],
  );

  const addExpense = useCallback(
    (draft: ExpenseDraft) =>
      supabase ? run(supabase.from('expenses').insert({ ...draft, person: actor })) : Promise.resolve(),
    [actor, run],
  );

  const setExpenseStatus = useCallback(
    (id: string, status: ExpenseStatus) => {
      setExpenses((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
      return supabase ? run(supabase.from('expenses').update({ status }).eq('id', id)) : Promise.resolve();
    },
    [run],
  );

  const deleteExpense = useCallback(
    (id: string) => (supabase ? run(supabase.from('expenses').delete().eq('id', id)) : Promise.resolve()),
    [run],
  );

  return {
    entries,
    expenses,
    loading,
    error,
    checkIn,
    checkOut,
    saveEntry,
    deleteEntry,
    addExpense,
    setExpenseStatus,
    deleteExpense,
  };
}
