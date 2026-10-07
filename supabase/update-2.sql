-- Run this once in the Supabase SQL editor if you already ran tracker.sql and hours.sql earlier.
-- (Fresh setups do not need it, the other two files already include these changes.)

-- 1. Expenses are tracked in kilometres, not miles.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'expenses' and column_name = 'miles'
  ) then
    alter table expenses rename column miles to km;
  end if;
end $$;

-- 2. Remember when each checklist item was added, so the checklist keeps its order.
alter table subtasks add column if not exists created_at timestamptz not null default now();
