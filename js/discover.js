// discover.js — populates homepage; language toggle changes UI text only, not post list

const I18N = {
  en: {
    sections:  'Sections',
    today:     "Today's Updates",
    top:       'Top Reads',
    noToday:   'No articles today.',
    noPosts:   'No posts yet.',
    views:     v => `${v} view${v !== 1 ? 's' : ''}`,
    dateLocale: 'en-US',
  },
  zh: {
    sections:  '分类',
    today:     '今日更新',
    top:       '最多阅读',
    noToday:   '今日暂无更新。',
    noPosts:   '暂无文章。',
    views:     v => `${v} 次阅读`,
    dateLocale: 'zh-CN',
  },
};

const SUBJECT_META = {
  poem:    { label: { en: 'Poem',    zh: '诗' },  emoji: '🖋',  color: '#FFF0D6', accent: '#B5763A', path: 'posts/poem/poem.index.html' },
  math:    { label: { en: 'Math',    zh: '数学' }, emoji: '∑',   color: '#E8F0F8', accent: '#2A6099', path: 'posts/math/math.index.html' },
  biology: { label: { en: 'Biology', zh: '生物' }, emoji: '🧬',  color: '#FFF0F0', accent: '#994444', path: 'posts/biology/biology.index.html' },
  ideas:   { label: { en: 'Ideas',   zh: '随想' }, emoji: '💡',  color: '#F3ECFF', accent: '#6644AA', path: 'posts/ideas/ideas.index.html' },
  science: { label: { en: 'Science', zh: '科学' }, emoji: '⚗',   color: '#E8F5EE', accent: '#2A7A4A', path: 'posts/science/science.index.html' },
};

let currentLang = localStorage.getItem('chunboblog:lang') || 'en';

function t() { return I18N[currentLang] || I18N.en; }

function today() {
  return new Date().toISOString().slice(0, 10);
}

function renderPostEntry(post, views) {
  const v = views[post.id] || 0;
  const meta = SUBJECT_META[post.subject] || {};
  const subjectLabel = meta.label ? (meta.label[currentLang] || meta.label.en) : post.subject;
  return `
    <a class="post-entry" href="${post.path}">
      <span class="entry-title">${post.title}</span>
      <span class="entry-meta">
        <span class="entry-author">${post.author}</span>
        <span class="dot">·</span>
        <span class="entry-subject" style="color:${meta.accent || '#666'}">${post.custom_subject || subjectLabel}</span>
        <span class="dot">·</span>
        <span class="entry-views">${t().views(v)}</span>
        <span class="dot">·</span>
        <span class="entry-date">${post.date}</span>
      </span>
    </a>`;
}

function renderTodaySection(posts, views) {
  const el = document.getElementById('today-posts');
  if (!el) return;
  const todayPosts = posts.filter(p => p.date === today());
  el.innerHTML = todayPosts.length
    ? todayPosts.map(p => renderPostEntry(p, views)).join('')
    : `<p class="empty-msg">${t().noToday}</p>`;
}

function renderTopSection(posts, views) {
  const el = document.getElementById('top-posts');
  if (!el) return;
  const sorted = posts
    .map(p => ({ ...p, _views: views[p.id] || 0 }))
    .sort((a, b) => b._views - a._views)
    .slice(0, 10);
  if (!sorted.length) {
    el.innerHTML = `<p class="empty-msg">${t().noPosts}</p>`;
    return;
  }
  el.innerHTML = sorted.map((p, i) => {
    const meta = SUBJECT_META[p.subject] || {};
    const subjectLabel = meta.label ? (meta.label[currentLang] || meta.label.en) : p.subject;
    return `
    <a class="post-entry" href="${p.path}">
      <span class="rank">${i + 1}</span>
      <span class="entry-title">${p.title}</span>
      <span class="entry-meta">
        <span class="entry-author">${p.author}</span>
        <span class="dot">·</span>
        <span class="entry-subject" style="color:${meta.accent || '#666'}">${p.custom_subject || subjectLabel}</span>
        <span class="dot">·</span>
        <span class="entry-views">${t().views(p._views)}</span>
        <span class="dot">·</span>
        <span class="entry-date">${p.date}</span>
      </span>
    </a>`;
  }).join('');
}

function renderSections(posts) {
  const el = document.getElementById('sections-grid');
  if (!el) return;
  const subjects = [...new Set(posts.map(p => p.subject))];
  el.innerHTML = subjects.map(subject => {
    const meta = SUBJECT_META[subject] || {
      label: { en: subject, zh: subject }, color: '#F0F0F0', accent: '#666',
      emoji: '📄', path: `posts/${subject}/${subject}.index.html`
    };
    const label = meta.label[currentLang] || meta.label.en;
    const count = posts.filter(p => p.subject === subject).length;
    return `
      <a class="section-card" href="${meta.path}" style="background:${meta.color}; --accent:${meta.accent}">
        <span class="section-emoji">${meta.emoji}</span>
        <span class="section-label">${label}</span>
        <span class="section-count">${count}</span>
      </a>`;
  }).join('');
}

function applyLangUI() {
  const lang = t();
  const html = document.documentElement;
  html.lang = currentLang;

  const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  set('label-sections', lang.sections);
  set('label-today',    lang.today);
  set('label-top',      lang.top);

  // Date display
  const dateEl = document.getElementById('today-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString(lang.dateLocale, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // Active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('chunboblog:lang', lang);
  const posts = window.POSTS || [];
  const views = getAllViews();
  applyLangUI();
  renderTodaySection(posts, views);
  renderTopSection(posts, views);
  renderSections(posts);
}

document.addEventListener('DOMContentLoaded', () => {
  const posts = window.POSTS || [];
  const views = getAllViews();

  applyLangUI();
  renderSections(posts);
  renderTodaySection(posts, views);
  renderTopSection(posts, views);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
});
