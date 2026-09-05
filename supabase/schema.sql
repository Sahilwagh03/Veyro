-- ==========================================================
-- Veyro: Profiles Table, Credit Automation & RPC Functions
-- Run this in your Supabase project's SQL Editor (one-time setup)
-- ==========================================================

-- 1. Create a profiles table linked to Supabase Auth users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  credits integer default 30 not null check (credits >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Users can view their own profile and credits
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" 
on public.profiles for select 
using (auth.uid() = id);

-- Users can update their own profile (or managed via service role)
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
on public.profiles for update 
using (auth.uid() = id);

-- Users can insert their own profile
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" 
on public.profiles for insert 
with check (auth.uid() = id);


-- 3. Trigger: Automatically grant 30 free starter credits on user sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone, credits)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    30
  )
  on conflict (id) do update
  set
    full_name = coalesce(excluded.full_name, profiles.full_name),
    phone = coalesce(excluded.phone, profiles.phone);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Atomic function to safely increment or decrement credits (prevents race conditions)
create or replace function public.increment_credits(user_id uuid, amount integer)
returns integer as $$
declare
  updated_credits integer;
begin
  -- Ensure profile exists before updating
  insert into public.profiles (id, email, credits)
  values (user_id, '', 30)
  on conflict (id) do nothing;

  update public.profiles
  set 
    credits = greatest(0, credits + amount),
    updated_at = now()
  where id = user_id
  returning credits into updated_credits;

  return coalesce(updated_credits, 0);
end;
$$ language plpgsql security definer;

