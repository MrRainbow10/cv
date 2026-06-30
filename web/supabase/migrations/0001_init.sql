-- obisa initial schema
-- Run this in your Supabase project SQL editor.

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  market text not null check (market in ('IN','UK')),
  created_at timestamptz default now(),

  full_name text,
  phone text,
  alt_phone text,
  linkedin_url text,
  address_line text,
  city text,
  postal_code text,
  district text,
  region text,

  notice_period text,
  current_ctc numeric,
  expected_ctc_min numeric,
  expected_ctc_max numeric,
  right_to_work_uk boolean,
  requires_sponsorship boolean,
  willing_to_relocate boolean,
  is_indian_citizen boolean,

  open_to_in_person boolean default true,
  can_start_immediately boolean default true,
  reliable_transport boolean default true,
  needs_accommodations boolean default false,

  gender text,
  category_india text,
  ethnicity_uk text,
  disability text,
  sexual_orientation text,
  additional_info text,

  app_password_encrypted text,
  resume_opt text default 'honest' check (resume_opt in ('off','honest','aggressive')),
  cover_letter_opt text default 'honest' check (cover_letter_opt in ('off','honest','aggressive')),
  auto_approve_resume boolean default true,
  auto_approve_cover boolean default false,
  recruiter_enabled boolean default false,
  recruiter_message text,
  preferred_roles text[] default '{}',

  referral_code text,
  bio text
);

create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  parsed_data jsonb,
  parse_status text default 'pending' check (parse_status in ('pending','done','failed')),
  filename text,
  size_bytes integer,
  created_at timestamptz default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  external_job_id text,
  job_title text,
  company text,
  status text default 'pending' check (status in ('pending','submitted','interviewing','assessment','offer','ghosted','rejected','failed','skipped')),
  match_score integer,
  applied_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tag text,
  from_name text,
  from_addr text,
  subject text,
  body text[],
  received_at timestamptz default now()
);

alter table profiles enable row level security;
alter table resumes enable row level security;
alter table applications enable row level security;
alter table messages enable row level security;

create policy "own profile read" on profiles for select using (auth.uid() = id);
create policy "own profile insert" on profiles for insert with check (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

create policy "own resumes" on resumes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own applications" on applications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own messages" on messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false)
  on conflict (id) do nothing;

create policy "own resume objects" on storage.objects for all
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
