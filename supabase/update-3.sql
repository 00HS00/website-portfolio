-- Run this once in the Supabase SQL editor.
-- Lets a shift on the Hours page point at the tasks that were worked on.
-- Each link stores the task id and its title at the time, so it still reads
-- correctly if the task is renamed or deleted later.

alter table time_entries add column if not exists linked_tasks jsonb not null default '[]'::jsonb;
