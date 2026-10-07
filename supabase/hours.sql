-- Run this once in the Supabase SQL editor, after tracker.sql.
-- Adds the hours (check in / check out) and expenses (reimbursements) tables.

create table if not exists time_entries (
  id uuid primary key default gen_random_uuid(),
  person text not null,
  check_in timestamptz not null,
  check_out timestamptz,
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  person text not null,
  kind text not null default 'purchase',      -- purchase | mileage | other
  description text not null,
  amount numeric not null default 0,           -- dollars (km * rate for mileage)
  km numeric,
  expense_date date not null default current_date,
  notes text not null default '',
  status text not null default 'pending',      -- pending | reimbursed
  created_at timestamptz not null default now()
);

-- Open access for the anon key, same as the task tables. Do not store confidential info here.
alter table time_entries enable row level security;
alter table expenses enable row level security;

create policy "open time_entries" on time_entries for all to anon using (true) with check (true);
create policy "open expenses" on expenses for all to anon using (true) with check (true);

-- Live updates
alter publication supabase_realtime add table time_entries, expenses;

-- The board now has four stages (Backlog, To do, In progress, Done).
-- Move anything left in the removed Blocked / In review stages into In progress.
update tasks set status = 'in_progress' where status in ('blocked', 'review');

-- Tasks no longer use an assignee. Safe to leave the column in place, so nothing to change there.
