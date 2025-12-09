-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Children table
create table public.children (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  age_group text not null check (age_group in ('5-7', '8-10', '11-12')),
  avatar text not null,
  reward_contract_text text not null,
  reward_type text not null check (reward_type in ('screen_time', 'time_together', 'experience')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habits table
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  title text not null,
  icon text not null,
  "order" integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habit logs table
create table public.habit_logs (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  habit_id uuid references public.habits(id) on delete cascade not null,
  date date not null,
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(habit_id, date)
);

-- Hero progress table
create table public.hero_progress (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references public.children(id) on delete cascade not null unique,
  level integer default 1 not null,
  successful_days_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index idx_children_user_id on public.children(user_id);
create index idx_habits_child_id on public.habits(child_id);
create index idx_habit_logs_child_id on public.habit_logs(child_id);
create index idx_habit_logs_date on public.habit_logs(date);
create index idx_hero_progress_child_id on public.hero_progress(child_id);

