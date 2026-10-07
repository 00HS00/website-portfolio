const pad = (n: number) => String(n).padStart(2, '0');

/** yyyy-mm-dd in the viewer's local time, for date inputs and day grouping */
export function localDateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** hh:mm in the viewer's local time, for time inputs */
export function localTimeInput(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formatDayHeading(key: string) {
  const d = new Date(`${key}T00:00:00`);
  const today = localDateKey(new Date());
  const yesterday = localDateKey(new Date(Date.now() - 86400000));
  const base = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  if (key === today) return `Today, ${base}`;
  if (key === yesterday) return `Yesterday, ${base}`;
  return base;
}

/** 7h 05m style label */
export function formatDuration(ms: number) {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${pad(m)}m` : `${m}m`;
}

/** 01:02:03 clock label for the running timer */
export function formatClock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** Monday 00:00 local of the week containing d */
export function startOfWeek(d: Date) {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  out.setDate(out.getDate() - ((out.getDay() + 6) % 7));
  return out;
}

export function money(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export function downloadCsv(filename: string, rows: unknown[][]) {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const blob = new Blob([rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
