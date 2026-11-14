require('dotenv').config();

const express = require('express');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = Number(process.env.PORT) || 3000;
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/pyana.jpeg', (_request, response) => {
  response.sendFile(path.join(__dirname, 'pyana.jpeg'));
});
app.use(express.json());

const fallbackPortfolio = {
  projects: [
    {
      id: 'working-space',
      name: 'Working Space',
      category: 'Productivity · Web application',
      year: '2025',
      image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
      image_alt: 'A bright, collaborative workspace with shared desks',
      summary: 'A digital working space designed to bring focused work and collaboration together.',
      description: 'Working Space is a live web application for getting work done in one shared digital space.',
      technologies: ['Web application', 'Productivity', 'Live project'],
      project_url: 'https://md-share-1.onrender.com',
      is_concept: false
    },
    {
      id: 'english-assistant',
      name: 'MD AI — English Assistant',
      category: 'AI · Language learning',
      year: '2025',
      image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85',
      image_alt: 'A notebook and pen ready for writing and language practice',
      summary: 'An interactive English assistant built to support language practice and learning.',
      description: 'MD AI English Assistant is a live web-based assistant for people practicing English.',
      technologies: ['AI assistant', 'English learning', 'Live project'],
      project_url: 'https://mdai-23x6.onrender.com',
      is_concept: false
    },
    {
      id: 'all-in-one-learning',
      name: 'MD AI — All-in-One E-Learning',
      category: 'Education · E-learning platform',
      year: '2025',
      image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85',
      image_alt: 'Students learning and working together around a table',
      summary: 'An all-in-one e-learning platform bringing digital learning into one place.',
      description: 'MD AI is a live e-learning platform designed to bring learning resources and study into one online experience.',
      technologies: ['E-learning', 'Education', 'Live project'],
      project_url: 'https://mdai-self.vercel.app/',
      is_concept: false
    }
  ],
  collaborations: [
    {
      id: 'product-builds',
      title: 'Digital product teams',
      description: 'Web and mobile experiences shaped with designers, developers, and product-minded collaborators.',
      type: 'Product'
    },
    {
      id: 'agri-community',
      title: 'Agriculture & community',
      description: 'Useful, accessible digital tools for people and organizations working in agriculture.',
      type: 'Community'
    },
    {
      id: 'visual-storytelling',
      title: 'Visual storytelling',
      description: 'Brand identities and graphic systems that connect a good idea with its audience.',
      type: 'Creative'
    }
  ],
  upcoming: [
    {
      id: 'mobile-toolkit',
      title: 'A new mobile experience',
      description: 'Exploring a focused React Native product concept from first screen to working prototype.',
      status: 'In exploration'
    },
    {
      id: 'agri-dashboard',
      title: 'Agriculture, made more visible',
      description: 'Thinking through a useful way to bring essential agricultural information into one place.',
      status: 'On the horizon'
    }
  ],
  achievements: [
    {
      id: 'end-to-end',
      title: 'From first sketch to live interface',
      description: 'Bringing visual design and front-end development together in a single workflow.'
    },
    {
      id: 'agromwinga',
      title: 'Working at Agromwinga',
      description: 'Building professional experience in a working, agriculture-focused environment.'
    },
    {
      id: 'multidisciplinary',
      title: 'A multidisciplinary practice',
      description: 'Web, mobile, and graphic design skills connected by a focus on usable experiences.'
    }
  ]
};

async function getPortfolio() {
  if (!supabase) {
    return { ...fallbackPortfolio, live: false };
  }

  const collections = Object.keys(fallbackPortfolio);
  const results = await Promise.all(collections.map(async (table) => {
    const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
    if (error) {
      console.warn(`Supabase ${table}: ${error.message}`);
      return [table, fallbackPortfolio[table]];
    }
    return [table, data.length ? data : fallbackPortfolio[table]];
  }));

  return { ...Object.fromEntries(results), live: true };
}

app.get('/', async (_request, response, next) => {
  try {
    const portfolio = await getPortfolio();
    response.render('index', {
      portfolio,
      supabaseUrl: supabase ? supabaseUrl : '',
      supabaseAnonKey: supabase ? supabaseAnonKey : ''
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/portfolio', async (_request, response, next) => {
  try {
    response.json(await getPortfolio());
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).send('Something went wrong while loading the portfolio.');
});

app.listen(port, () => {
  console.log(`Symphorien Pyana portfolio running at http://localhost:${port}`);
});