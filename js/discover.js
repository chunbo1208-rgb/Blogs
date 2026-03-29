// discover.js — populates homepage from window.POSTS (defined in posts-data.js)

let allPosts = [];
let currentLang = localStorage.getItem('chunboblog:lang') || 'all';

const SUBJECT_META = {
  poem:    { label: 'Poem / 诗',  emoji: '🖋',  color: '#FFF0D6', accent: '#B5763A', path: 'posts/poem/poem.index.html' },
  math:    { label: 'Math',       emoji: '∑',   color: '#E8F0F8', accent: '#2A6099', path: 'posts/math/math.index.html' },
  science: { label: 'Science',    emoji: '⚗',   color: '#E8F5EE', accent: '#2A7A4A', path: 'posts/science/science.index.html' },
  biology: { label: 'Biology',    emoji: '🧬',  color: '#FFF0F0', accent: '#994444', path: 'posts/biology/biology.index.html' },
  ideas:   { label: 'Ideas',      emoji: '💡',  color: '#F3ECFF', accent: '#6644AA', path: 'posts/ideas/ideas.index.html' },
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function filterByLang(posts) {
  if (currentLang === 'all') return posts;
  return posts.filter(p => p.language === currentLang);
}

function renderPostEntry(post, views) {
  const v = views[post.id] || 0;
  const meta = SUBJECT_META[post.subject] || {};
  return `
    <a class="post-entry" href="${post.path}">
      <span class="entry-title">${post.title}</span>
      <span class="entry-meta">
        <span class="entry-author">${post.author}</span>
        <span class="dot">·</span>
        <span class="entry-subject" style="color:${meta.accent || '#666'}">${post.custom_subject || post.subject}</span>
        <span class="dot">·</span>
        <span class="entry-views">${v} view${v !== 1 ? 's' : ''}</span>
        <span class="dot">·</span>
        <span class="entry-date">${post.date}</span>
        <span class="dot">·</span>
        <span class="entry-lang">${post.language === 'zh' ? '中文' : 'EN'}</span>
      </span>
    </a>`;
}

function renderTodaySection(posts, views) {
  const el = document.getElementById('today-posts');
  if (!el) return;
  const todayPosts = filterByLang(posts).filter(p => p.date === today());
  if (todayPosts.length === 0) {
    el.innerHTML = '<p class="empty-msg">No articles today.</p>';
    return;
  }
  el.innerHTML = todayPosts.map(p => renderPostEntry(p, views)).join('');
}

function renderTopSection(posts, views) {
  const el = document.getElementById('top-posts');
  if (!el) return;
  const sorted = filterByLang(posts)
    .map(p => ({ ...p, _views: views[p.id] || 0 }))
    .sort((a, b) => b._views - a._views)
    .slice(0, 10);
  if (sorted.length === 0) {
    el.innerHTML = '<p class="empty-msg">No posts yet.</p>';
    return;
  }
  el.innerHTML = sorted.map((p, i) => {
    const meta = SUBJECT_META[p.subject] || {};
    return `
    <a class="post-entry" href="${p.path}">
      <span class="rank">${i + 1}</span>
      <span class="entry-title">${p.title}</span>
      <span class="entry-meta">
        <span class="entry-author">${p.author}</span>
        <span class="dot">·</span>
        <span class="entry-subject" style="color:${meta.accent || '#666'}">${p.custom_subject || p.subject}</span>
        <span class="dot">·</span>
        <span class="entry-views">${p._views} view${p._views !== 1 ? 's' : ''}</span>
        <span class="dot">·</span>
        <span class="entry-date">${p.date}</span>
        <span class="dot">·</span>
        <span class="entry-lang">${p.language === 'zh' ? '中文' : 'EN'}</span>
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
      label: subject, color: '#F0F0F0', accent: '#666',
      emoji: '📄', path: `posts/${subject}/${subject}.index.html`
    };
    const count = posts.filter(p => p.subject === subject).length;
    return `
      <a class="section-card" href="${meta.path}" style="background:${meta.color}; --accent:${meta.accent}">
        <span class="section-emoji">${meta.emoji}</span>
        <span class="section-label">${meta.label}</span>
        <span class="section-count">${count} post${count !== 1 ? 's' : ''}</span>
      </a>`;
  }).join('');
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('chunboblog:lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  const views = getAllViews();
  renderTodaySection(allPosts, views);
  renderTopSection(allPosts, views);
}

document.addEventListener('DOMContentLoaded', () => {
  // Use inline data — no fetch needed (works with file:// protocol)
  allPosts = window.POSTS || [];

  if (allPosts.length === 0) {
    document.getElementById('today-posts').innerHTML =
      '<p class="empty-msg">No posts found. Check posts-data.js.</p>';
    return;
  }

  const views = getAllViews();
  renderTodaySection(allPosts, views);
  renderTopSection(allPosts, views);
  renderSections(allPosts);

  // Language toggle
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
});
