const portfolioDataElement = document.querySelector('#portfolio-data');
let portfolio = JSON.parse(portfolioDataElement.textContent);

const dialog = document.querySelector('#project-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogCategory = document.querySelector('#dialog-category');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('#dialog-description');
const dialogTags = document.querySelector('#dialog-tags');
const dialogLink = document.querySelector('#dialog-link');
const dialogPreview = document.querySelector('#dialog-preview');

const themeToggle = document.querySelector('#theme-toggle');
if (themeToggle) {
  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    themeToggle.title = `Switch to ${nextTheme} theme`;
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#121a15' : '#f5f5f0';
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {}
  };

  setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  themeToggle.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}

const copyEmailButton = document.querySelector('#copy-email');
if (copyEmailButton) {
  const copyFeedback = document.querySelector('#copy-feedback');
  copyEmailButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyEmailButton.dataset.email);
      copyFeedback.textContent = 'Email address copied.';
    } catch {
      copyFeedback.textContent = 'Copy unavailable. Use the email link instead.';
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));

  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-current', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -65% 0px' });
  navLinks.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) sectionObserver.observe(section);
  });
}

const scrollProgressBar = document.querySelector('#scroll-progress-bar');
if (scrollProgressBar) {
  let progressUpdateQueued = false;
  const updateScrollProgress = () => {
    if (progressUpdateQueued) return;
    progressUpdateQueued = true;
    requestAnimationFrame(() => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      scrollProgressBar.style.transform = `scaleX(${progress})`;
      progressUpdateQueued = false;
    });
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();
}

function showProject(index) {
  const project = portfolio.projects[index];
  if (!project) return;

  dialogImage.src = project.image_url || '';
  dialogImage.alt = project.image_alt || project.name;
  dialogCategory.textContent = `${project.category || 'Selected work'}${project.is_concept === false ? '' : ' · CONCEPT'}`;
  dialogTitle.textContent = project.name;
  dialogDescription.textContent = project.description || project.summary || '';
  dialogTags.replaceChildren(...(project.technologies || []).map((tag) => {
    const element = document.createElement('span');
    element.textContent = tag;
    return element;
  }));

  if (project.project_url) {
    dialogLink.href = project.project_url;
    dialogLink.hidden = false;
    dialogPreview.src = project.project_url;
    dialogPreview.title = `${project.name} live preview`;
    dialogPreview.hidden = false;
  } else {
    dialogLink.hidden = true;
    dialogPreview.removeAttribute('src');
    dialogPreview.hidden = true;
  }

  dialog.showModal();
}

document.querySelectorAll('[data-project-index]').forEach((button) => {
  button.addEventListener('click', () => showProject(Number(button.dataset.projectIndex)));
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => dialogPreview.removeAttribute('src'));
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const supabaseUrl = document.body.dataset.supabaseUrl;
const supabaseKey = document.body.dataset.supabaseKey;
const liveState = document.querySelector('#live-state');

if (supabaseUrl && supabaseKey && window.supabase) {
  const client = window.supabase.createClient(supabaseUrl, supabaseKey);
  const tables = ['projects', 'collaborations', 'upcoming', 'achievements'];
  let refreshTimer;

  const channel = client.channel('portfolio-live-updates');
  tables.forEach((table) => {
    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table
    }, () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(async () => {
        try {
          const response = await fetch('/api/portfolio');
          if (!response.ok) throw new Error('Could not refresh portfolio data');
          portfolio = await response.json();
          window.location.reload();
        } catch {
          liveState.lastChild.textContent = 'LIVE · RECONNECTING';
        }
      }, 350);
    });
  });

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      liveState.classList.add('is-live');
      liveState.lastChild.textContent = 'LIVE · SUPABASE CONNECTED';
    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      liveState.lastChild.textContent = 'LIVE · RECONNECTING';
    }
  });
}