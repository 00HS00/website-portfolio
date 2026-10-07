import { useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { expenseKindMeta, type ExpenseKind, type TimeEntry } from '@/data/tracker';
import type { ExpenseDraft } from '@/hooks/useHours';
import { localDateKey, localTimeInput, money } from './timeHelpers';

const RATE_KEY = 'tracker:kmRate';
const field =
  'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-gold';
const label = 'mb-1 block text-xs font-medium uppercase tracking-wide text-ink-muted';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div role="dialog" aria-label={title} className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-ink-muted hover:text-ink">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Add a missed shift by hand, or fix a saved one. */
export function EntryModal({
  entry,
  onSave,
  onClose,
}: {
  entry: TimeEntry | null;
  onSave: (id: string | null, v: { check_in: string; check_out: string | null; note: string }) => Promise<void>;
  onClose: () => void;
}) {
  const start = entry ? new Date(entry.check_in) : null;
  const end = entry?.check_out ? new Date(entry.check_out) : null;
  const [date, setDate] = useState(start ? localDateKey(start) : localDateKey(new Date()));
  const [from, setFrom] = useState(start ? localTimeInput(start) : '09:00');
  const [to, setTo] = useState(end ? localTimeInput(end) : entry ? '' : '17:00');
  const [note, setNote] = useState(entry?.note ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    const checkIn = new Date(`${date}T${from}`);
    const checkOut = to ? new Date(`${date}T${to}`) : null;
    if (Number.isNaN(checkIn.getTime())) return setError('Pick a date and a start time.');
    if (!checkOut && !entry) return setError('Pick an end time.');
    if (checkOut && checkOut <= checkIn) return setError('The end time has to be after the start time.');
    setSaving(true);
    await onSave(entry?.id ?? null, {
      check_in: checkIn.toISOString(),
      check_out: checkOut ? checkOut.toISOString() : null,
      note,
    });
    onClose();
  }

  return (
    <Modal title={entry ? 'Edit hours' : 'Add hours manually'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className={label} htmlFor="e-date">Date</label>
          <input id="e-date" type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="e-from">Start</label>
            <input id="e-from" type="time" className={field} value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="e-to">End</label>
            <input id="e-to" type="time" className={field} value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="e-note">What did you work on?</label>
          <textarea id="e-note" rows={3} className={field} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="button" onClick={save} disabled={saving} className="w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-bg disabled:opacity-40">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </Modal>
  );
}

/** Log a purchase, mileage or other cost to be reimbursed. */
export function ExpenseModal({
  onSave,
  onClose,
}: {
  onSave: (draft: ExpenseDraft) => Promise<void>;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<ExpenseKind>('purchase');
  const [date, setDate] = useState(localDateKey(new Date()));
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [km, setKm] = useState('');
  // The rate is not known up front, so it is typed here and remembered for next time
  const [rate, setRate] = useState(() => {
    try {
      return localStorage.getItem(RATE_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const mileageTotal = Number(km) > 0 && Number(rate) > 0 ? Math.round(Number(km) * Number(rate) * 100) / 100 : 0;

  async function save() {
    const total = kind === 'mileage' ? mileageTotal : Number(amount);
    if (!description.trim()) return setError('Add a short description.');
    if (kind === 'mileage' && !(Number(km) > 0)) return setError('Enter the kilometres driven.');
    if (kind === 'mileage' && !(Number(rate) > 0)) return setError('Enter the rate per km.');
    if (!(total > 0)) return setError('Enter the amount.');
    if (kind === 'mileage') {
      try {
        localStorage.setItem(RATE_KEY, rate);
      } catch {
        /* the rate just will not be remembered */
      }
    }
    setSaving(true);
    await onSave({
      kind,
      description: description.trim(),
      amount: total,
      km: kind === 'mileage' ? Number(km) : null,
      expense_date: date,
      notes,
    });
    onClose();
  }

  return (
    <Modal title="Add expense" onClose={onClose}>
      <div className="space-y-4">
        <div className="inline-flex w-full rounded-lg border border-border bg-bg p-1">
          {(Object.keys(expenseKindMeta) as ExpenseKind[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={`flex-1 rounded-md py-1.5 text-sm transition-colors ${kind === k ? 'bg-gold font-medium text-bg' : 'text-ink-muted hover:text-ink'}`}
            >
              {expenseKindMeta[k].label}
            </button>
          ))}
        </div>
        <div>
          <label className={label} htmlFor="x-desc">Description</label>
          <input
            id="x-desc"
            className={field}
            placeholder={kind === 'mileage' ? 'Drive to client site' : kind === 'purchase' ? 'Parking, supplies, software' : 'What is this for?'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="x-date">Date</label>
            <input id="x-date" type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {kind === 'mileage' ? (
            <div>
              <label className={label} htmlFor="x-km">Kilometres</label>
              <input id="x-km" type="number" min="0" step="0.1" className={field} value={km} onChange={(e) => setKm(e.target.value)} />
            </div>
          ) : (
            <div>
              <label className={label} htmlFor="x-amount">Amount ($)</label>
              <input id="x-amount" type="number" min="0" step="0.01" className={field} value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          )}
        </div>
        {kind === 'mileage' && (
          <div className="grid grid-cols-2 items-end gap-4">
            <div>
              <label className={label} htmlFor="x-rate">Rate per km ($)</label>
              <input id="x-rate" type="number" min="0" step="0.01" className={field} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <p className="rounded-lg bg-bg px-3 py-2 text-sm text-ink-muted">
              Total <span className="font-semibold text-ink">{money(mileageTotal)}</span>
            </p>
          </div>
        )}
        <div>
          <label className={label} htmlFor="x-notes">Details</label>
          <textarea
            id="x-notes"
            rows={3}
            className={field}
            placeholder="Where, why, receipt number, route"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="button" onClick={save} disabled={saving} className="w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-bg disabled:opacity-40">
          {saving ? 'Saving...' : 'Add expense'}
        </button>
      </div>
    </Modal>
  );
}
