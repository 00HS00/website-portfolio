import { useEffect, useMemo, useState } from 'react';
import { Car, Clock, Download, Eye, LogIn, LogOut, Pencil, Plus, Receipt, Trash2 } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useHours } from '@/hooks/useHours';
import { expenseKindMeta, trackerConfig, type TimeEntry } from '@/data/tracker';
import TrackerShell from '@/components/tracker/TrackerShell';
import { EntryModal, ExpenseModal } from '@/components/tracker/HoursModals';
import { Avatar } from '@/components/tracker/ui';
import { formatDate } from '@/components/tracker/helpers';
import {
  downloadCsv,
  formatClock,
  formatDayHeading,
  formatDuration,
  formatTime,
  localDateKey,
  money,
  startOfWeek,
} from '@/components/tracker/timeHelpers';

const card = 'rounded-2xl border border-border bg-surface shadow-sm';
const sectionTitle = 'font-display text-xl font-semibold';
const owner = trackerConfig.hoursOwner;

function HoursView({ name }: { name: string }) {
  const data = useHours(name, owner);
  // everyone can read the owner's hours, only the owner can log them
  const isOwner = name === owner;
  const [note, setNote] = useState('');
  const [entryModal, setEntryModal] = useState<{ entry: TimeEntry | null } | null>(null);
  const [expenseModal, setExpenseModal] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const entries = data.entries;
  const expenses = data.expenses;
  const open = entries.find((e) => !e.check_out) ?? null;

  // tick every second only while a shift is running
  const running = open !== null;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  // keep the note box in step with the running shift
  const openId = open?.id;
  const openNote = open?.note ?? '';
  useEffect(() => {
    setNote(openNote);
  }, [openId, openNote]);

  const duration = (e: TimeEntry) => (e.check_out ? new Date(e.check_out).getTime() : now) - new Date(e.check_in).getTime();

  const totals = useMemo(() => {
    const today = localDateKey(new Date(now));
    const weekStart = startOfWeek(new Date(now)).getTime();
    const month = new Date(now).getMonth();
    const year = new Date(now).getFullYear();
    let d = 0;
    let w = 0;
    let m = 0;
    for (const e of entries) {
      const start = new Date(e.check_in);
      const ms = (e.check_out ? new Date(e.check_out).getTime() : now) - start.getTime();
      if (localDateKey(start) === today) d += ms;
      if (start.getTime() >= weekStart) w += ms;
      if (start.getMonth() === month && start.getFullYear() === year) m += ms;
    }
    return { d, w, m };
  }, [entries, now]);

  const days = useMemo(() => {
    const map = new Map<string, TimeEntry[]>();
    for (const e of entries) {
      const key = localDateKey(new Date(e.check_in));
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [entries]);

  const expenseTotals = useMemo(() => {
    const sum = (status: string) => expenses.filter((x) => x.status === status).reduce((s, x) => s + x.amount, 0);
    return { pending: sum('pending'), reimbursed: sum('reimbursed') };
  }, [expenses]);

  function exportHours() {
    downloadCsv('woodlogix-hours.csv', [
      ['Person', 'Date', 'Check in', 'Check out', 'Hours', 'Note'],
      ...entries.map((e) => [
        e.person,
        localDateKey(new Date(e.check_in)),
        formatTime(e.check_in),
        e.check_out ? formatTime(e.check_out) : '',
        e.check_out ? (duration(e) / 3600000).toFixed(2) : '',
        e.note,
      ]),
    ]);
  }

  function exportExpenses() {
    downloadCsv('woodlogix-expenses.csv', [
      ['Person', 'Date', 'Type', 'Description', 'Km', 'Amount', 'Status', 'Details'],
      ...expenses.map((x) => [x.person, x.expense_date, expenseKindMeta[x.kind].label, x.description, x.km, x.amount, x.status, x.notes]),
    ]);
  }

  const stat = (text: string, value: string, tone: string, bar: string) => (
    <div className={`${card} relative overflow-hidden px-4 py-3.5`}>
      <span className={`absolute inset-x-0 top-0 h-1 ${bar}`} />
      <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">{text}</div>
      <div className={`mt-0.5 font-display text-3xl font-semibold ${tone}`}>{value}</div>
    </div>
  );

  return (
    <>
      {data.error && (
        <p className="mb-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{data.error}</p>
      )}

      {isOwner ? (
        <div className={`${card} relative mb-8 overflow-hidden p-6`}>
          <div className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-[80px] ${open ? 'bg-live/20' : 'bg-gold/15'}`} />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                <span className={`h-2 w-2 rounded-full ${open ? 'animate-pulse bg-live' : 'bg-ink-muted/60'}`} />
                {open ? 'On the clock' : 'Off the clock'}
              </p>
              {open ? (
                <>
                  <div className="font-mono text-5xl font-medium tabular-nums text-live">{formatClock(duration(open))}</div>
                  <p className="mt-1 text-sm text-ink-muted">Checked in at {formatTime(open.check_in)}</p>
                </>
              ) : (
                <>
                  <div className="font-display text-3xl font-semibold">Ready when you are</div>
                  <p className="mt-1 text-sm text-ink-muted">Check in to start tracking your hours.</p>
                </>
              )}
            </div>

            <div className="w-full max-w-md flex-1 space-y-3">
              <input
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
                placeholder="What are you working on? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                aria-label="What are you working on"
              />
              <div className="flex flex-wrap gap-3">
                {open ? (
                  <button
                    type="button"
                    onClick={() => data.checkOut(open, note)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-danger px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
                  >
                    <LogOut size={17} /> Check out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      void data.checkIn(note);
                      setNote('');
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-live px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
                  >
                    <LogIn size={17} /> Check in
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEntryModal({ entry: null })}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-ink-muted transition-colors hover:border-gold hover:text-gold"
                >
                  <Plus size={16} /> Add missed hours
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-4 text-sm text-ink-muted">
          <Eye size={18} className="shrink-0 text-gold" />
          <span>
            You are viewing <span className="font-medium text-ink">{owner}</span>'s hours and expenses. You can mark expenses as reimbursed.
          </span>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className={sectionTitle}>Hours</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 text-sm text-ink-muted">
            <Avatar name={owner} size={22} /> {owner}
          </span>
          {open && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-live/15 px-3 py-1 text-xs font-medium text-live">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" /> Checked in since {formatTime(open.check_in)}
            </span>
          )}
        </div>
        <button type="button" onClick={exportHours} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-gold">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stat('Today', formatDuration(totals.d), 'text-gold', 'bg-gold')}
        {stat('This week', formatDuration(totals.w), 'text-blue', 'bg-blue')}
        {stat('This month', formatDuration(totals.m), 'text-live', 'bg-live')}
      </div>

      {data.loading ? (
        <p className="py-12 text-center text-ink-muted">Loading...</p>
      ) : days.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-12 text-center text-ink-muted">No hours logged yet.</p>
      ) : (
        <div className="space-y-6">
          {days.map(([key, list]) => (
            <section key={key}>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <h3 className="font-display text-base font-semibold">{formatDayHeading(key)}</h3>
                <span className="text-sm text-ink-muted">{formatDuration(list.reduce((s, e) => s + duration(e), 0))}</span>
              </div>
              <div className="space-y-2">
                {list.map((e) => (
                  <div key={e.id} className={`${card} flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5`}>
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <Clock size={15} className="text-gold" />
                      {formatTime(e.check_in)} <span className="text-ink-muted">to</span>{' '}
                      {e.check_out ? formatTime(e.check_out) : <span className="text-live">now</span>}
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${e.check_out ? 'bg-gold/15 text-gold' : 'bg-live/15 text-live'}`}>
                      {e.check_out ? formatDuration(duration(e)) : `${formatDuration(duration(e))} so far`}
                    </span>
                    <p className="min-w-0 flex-1 text-sm text-ink-muted">{e.note || <span className="opacity-60">No note</span>}</p>
                    {isOwner && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEntryModal({ entry: e })}
                          aria-label="Edit hours"
                          className="rounded p-1.5 text-ink-muted hover:bg-surface-2 hover:text-gold"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => window.confirm('Delete this entry?') && data.deleteEntry(e.id)}
                          aria-label="Delete hours"
                          className="rounded p-1.5 text-ink-muted hover:bg-surface-2 hover:text-danger"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mb-6 mt-16 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={sectionTitle}>Expenses &amp; mileage</h2>
          <p className="text-sm text-ink-muted">Purchases, mileage and other costs to be reimbursed.</p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={exportExpenses} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-gold">
            <Download size={15} /> Export CSV
          </button>
          {isOwner && (
            <button
              type="button"
              onClick={() => setExpenseModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-bg shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus size={18} /> Add expense
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stat('Waiting to be reimbursed', money(expenseTotals.pending), 'text-warn', 'bg-warn')}
        {stat('Reimbursed', money(expenseTotals.reimbursed), 'text-live', 'bg-live')}
        {stat('Km logged', expenses.reduce((s, x) => s + (x.km ?? 0), 0).toFixed(1), 'text-blue', 'bg-blue')}
      </div>

      {expenses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-12 text-center text-ink-muted">No expenses yet.</p>
      ) : (
        <div className="space-y-2">
          {expenses.map((x) => {
            const k = expenseKindMeta[x.kind];
            const paid = x.status === 'reimbursed';
            return (
              <div key={x.id} className={`${card} flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${k.bg} ${k.text}`}>
                  {x.kind === 'mileage' ? <Car size={18} /> : <Receipt size={18} />}
                </span>
                <div className="min-w-0 flex-1 basis-56">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{x.description}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${k.bg} ${k.text}`}>{k.label}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {formatDate(x.expense_date)}
                    {x.km != null && ` · ${x.km} km`}
                    {x.notes && ` · ${x.notes}`}
                  </p>
                </div>
                <div className="font-display text-xl font-semibold">{money(x.amount)}</div>
                <button
                  type="button"
                  onClick={() => data.setExpenseStatus(x.id, paid ? 'pending' : 'reimbursed')}
                  title={paid ? 'Mark as pending' : 'Mark as reimbursed'}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${
                    paid ? 'bg-live/15 text-live' : 'bg-warn/15 text-warn'
                  }`}
                >
                  {paid ? 'Reimbursed' : 'Pending'}
                </button>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => window.confirm('Delete this expense?') && data.deleteExpense(x.id)}
                    aria-label="Delete expense"
                    className="rounded p-1.5 text-ink-muted hover:bg-surface-2 hover:text-danger"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {entryModal && <EntryModal entry={entryModal.entry} onSave={data.saveEntry} onClose={() => setEntryModal(null)} />}
      {expenseModal && <ExpenseModal onSave={data.addExpense} onClose={() => setExpenseModal(false)} />}
    </>
  );
}

export default function Hours() {
  usePageMeta('Hours & Expenses | Woodlogix Work Tracker', 'Hours worked and reimbursements for Woodlogix.');
  return <TrackerShell>{(name) => <HoursView name={name} />}</TrackerShell>;
}
