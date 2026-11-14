create table if not exists public.projects (
  id text primary key,
  name text not null,
  category text not null default 'Selected work',
  year text not null default '',
  image_url text not null default '',
  image_alt text not null default '',
  summary text not null default '',
  description text not null default '',
  technologies text[] not null default '{}',
  project_url text not null default '',
  is_concept boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.collaborations (
  id text primary key,
  title text not null,
  description text not null default '',
  type text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.upcoming (
  id text primary key,
  title text not null,
  description text not null default '',
  status text not null default 'In exploration',
  sort_order integer not null default 0
);

create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0
);

alter table public.projects enable row level security;
alter table public.collaborations enable row level security;
alter table public.upcoming enable row level security;
alter table public.achievements enable row level security;

create policy "Public can read projects" on public.projects for select to anon, authenticated using (true);
create policy "Public can read collaborations" on public.collaborations for select to anon, authenticated using (true);
create policy "Public can read upcoming projects" on public.upcoming for select to anon, authenticated using (true);
create policy "Public can read achievements" on public.achievements for select to anon, authenticated using (true);

alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.collaborations;
alter publication supabase_realtime add table public.upcoming;
alter publication supabase_realtime add table public.achievements;