-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query).

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  details text not null default '',
  status text not null default 'todo',
  priority text not null default 'medium',
  due_date date,
  est_hours numeric,
  tag text not null default '',
  assignee text not null default '',
  created_by text not null default '',
  created_at timestamptz not null default now(),
  updated_by text not null default '',
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  text text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists activity (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete set null,
  task_title text not null default '',
  actor text not null,
  action text not null,
  created_at timestamptz not null default now()
);

-- Open access for the anon key (no login). Do not store confidential info in tasks.
alter table tasks enable row level security;
alter table subtasks enable row level security;
alter table comments enable row level security;
alter table activity enable row level security;

create policy "open tasks" on tasks for all to anon using (true) with check (true);
create policy "open subtasks" on subtasks for all to anon using (true) with check (true);
create policy "open comments" on comments for all to anon using (true) with check (true);
create policy "open activity" on activity for all to anon using (true) with check (true);

-- Live updates
alter publication supabase_realtime add table tasks, subtasks, comments, activity;
