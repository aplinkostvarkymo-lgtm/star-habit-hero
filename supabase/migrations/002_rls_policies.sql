-- Enable Row Level Security
alter table public.children enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.hero_progress enable row level security;

-- Children policies
create policy "Users can view their own children"
  on public.children for select
  using (auth.uid() = user_id);

create policy "Users can insert their own children"
  on public.children for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own children"
  on public.children for update
  using (auth.uid() = user_id);

create policy "Users can delete their own children"
  on public.children for delete
  using (auth.uid() = user_id);

-- Habits policies
create policy "Users can view habits of their children"
  on public.habits for select
  using (
    exists (
      select 1 from public.children
      where children.id = habits.child_id
      and children.user_id = auth.uid()
    )
  );

create policy "Users can insert habits for their children"
  on public.habits for insert
  with check (
    exists (
      select 1 from public.children
      where children.id = habits.child_id
      and children.user_id = auth.uid()
    )
  );

create policy "Users can update habits of their children"
  on public.habits for update
  using (
    exists (
      select 1 from public.children
      where children.id = habits.child_id
      and children.user_id = auth.uid()
    )
  );

create policy "Users can delete habits of their children"
  on public.habits for delete
  using (
    exists (
      select 1 from public.children
      where children.id = habits.child_id
      and children.user_id = auth.uid()
    )
  );

-- Habit logs policies (allow kids to mark completion without auth)
create policy "Anyone can view habit logs"
  on public.habit_logs for select
  using (true);

create policy "Anyone can insert habit logs"
  on public.habit_logs for insert
  with check (true);

create policy "Anyone can update habit logs"
  on public.habit_logs for update
  using (true);

-- Hero progress policies (allow kids to view without auth)
create policy "Anyone can view hero progress"
  on public.hero_progress for select
  using (true);

create policy "Users can insert hero progress for their children"
  on public.hero_progress for insert
  with check (
    exists (
      select 1 from public.children
      where children.id = hero_progress.child_id
      and children.user_id = auth.uid()
    )
  );

create policy "Anyone can update hero progress"
  on public.hero_progress for update
  using (true);

