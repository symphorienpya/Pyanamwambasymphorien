begin;

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

grant usage on schema public to anon, authenticated;
grant select on public.projects, public.collaborations, public.upcoming, public.achievements to anon, authenticated;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects" on public.projects for select to anon, authenticated using (true);

drop policy if exists "Public can read collaborations" on public.collaborations;
create policy "Public can read collaborations" on public.collaborations for select to anon, authenticated using (true);

drop policy if exists "Public can read upcoming projects" on public.upcoming;
create policy "Public can read upcoming projects" on public.upcoming for select to anon, authenticated using (true);

drop policy if exists "Public can read achievements" on public.achievements;
create policy "Public can read achievements" on public.achievements for select to anon, authenticated using (true);

do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    execute 'create publication supabase_realtime';
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'projects') then
    alter publication supabase_realtime add table public.projects;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'collaborations') then
    alter publication supabase_realtime add table public.collaborations;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'upcoming') then
    alter publication supabase_realtime add table public.upcoming;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'achievements') then
    alter publication supabase_realtime add table public.achievements;
  end if;
end
$$;

insert into public.projects (
  id, name, category, year, image_url, image_alt, summary, description,
  technologies, project_url, is_concept, sort_order
)
values
  (
    'working-space', 'Working Space', 'Productivity · Web application', '2025',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
    'A bright, collaborative workspace with shared desks',
    'A digital working space designed to bring focused work and collaboration together.',
    'Working Space is a live web application for getting work done in one shared digital space.',
    array['Web application', 'Productivity', 'Live project'], 'https://md-share-1.onrender.com', false, 1
  ),
  (
    'english-assistant', 'MD AI — English Assistant', 'AI · Language learning', '2025',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85',
    'A notebook and pen ready for writing and language practice',
    'An interactive English assistant built to support language practice and learning.',
    'MD AI English Assistant is a live web-based assistant for people practicing English.',
    array['AI assistant', 'English learning', 'Live project'], 'https://mdai-23x6.onrender.com', false, 2
  ),
  (
    'all-in-one-learning', 'MD AI — All-in-One E-Learning', 'Education · E-learning platform', '2025',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85',
    'Students learning and working together around a table',
    'An all-in-one e-learning platform bringing digital learning into one place.',
    'MD AI is a live e-learning platform designed to bring learning resources and study into one online experience.',
    array['E-learning', 'Education', 'Live project'], 'https://mdai-self.vercel.app/', false, 3
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  year = excluded.year,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  summary = excluded.summary,
  description = excluded.description,
  technologies = excluded.technologies,
  project_url = excluded.project_url,
  is_concept = excluded.is_concept,
  sort_order = excluded.sort_order;

insert into public.collaborations (id, title, description, type, sort_order)
values
  ('product-builds', 'Digital product teams', 'Web and mobile experiences shaped with designers, developers, and product-minded collaborators.', 'Product', 1),
  ('agri-community', 'Agriculture & community', 'Useful, accessible digital tools for people and organizations working in agriculture.', 'Community', 2),
  ('visual-storytelling', 'Visual storytelling', 'Brand identities and graphic systems that connect a good idea with its audience.', 'Creative', 3)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  type = excluded.type,
  sort_order = excluded.sort_order;

insert into public.upcoming (id, title, description, status, sort_order)
values
  ('mobile-toolkit', 'A new mobile experience', 'Exploring a focused React Native product concept from first screen to working prototype.', 'In exploration', 1),
  ('agri-dashboard', 'Agriculture, made more visible', 'Thinking through a useful way to bring essential agricultural information into one place.', 'On the horizon', 2)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  status = excluded.status,
  sort_order = excluded.sort_order;

insert into public.achievements (id, title, description, sort_order)
values
  ('end-to-end', 'From first sketch to live interface', 'Bringing visual design and front-end development together in a single workflow.', 1),
  ('agromwinga', 'Working at Agromwinga', 'Building professional experience in a working, agriculture-focused environment.', 2),
  ('multidisciplinary', 'A multidisciplinary practice', 'Web, mobile, and graphic design skills connected by a focus on usable experiences.', 3)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

commit;