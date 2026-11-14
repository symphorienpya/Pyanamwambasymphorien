insert into public.projects (
  id,
  name,
  category,
  year,
  image_url,
  image_alt,
  summary,
  description,
  technologies,
  project_url,
  is_concept,
  sort_order
)
values
  (
    'working-space',
    'Working Space',
    'Productivity · Web application',
    '2025',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
    'A bright, collaborative workspace with shared desks',
    'A digital working space designed to bring focused work and collaboration together.',
    'Working Space is a live web application for getting work done in one shared digital space.',
    array['Web application', 'Productivity', 'Live project'],
    'https://md-share-1.onrender.com',
    false,
    1
  ),
  (
    'english-assistant',
    'MD AI — English Assistant',
    'AI · Language learning',
    '2025',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85',
    'A notebook and pen ready for writing and language practice',
    'An interactive English assistant built to support language practice and learning.',
    'MD AI English Assistant is a live web-based assistant for people practicing English.',
    array['AI assistant', 'English learning', 'Live project'],
    'https://mdai-23x6.onrender.com',
    false,
    2
  ),
  (
    'all-in-one-learning',
    'MD AI — All-in-One E-Learning',
    'Education · E-learning platform',
    '2025',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85',
    'Students learning and working together around a table',
    'An all-in-one e-learning platform bringing digital learning into one place.',
    'MD AI is a live e-learning platform designed to bring learning resources and study into one online experience.',
    array['E-learning', 'Education', 'Live project'],
    'https://mdai-self.vercel.app/',
    false,
    3
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