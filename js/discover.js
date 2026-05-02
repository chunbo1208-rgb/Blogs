// discover.js - renders the personal homepage writing archive.

const KIND_LABELS = {
  essay: 'Essay',
  note: 'Note',
  poem: 'Poem',
};

const SUBJECT_TO_KIND = {
  ideas: 'essay',
  poem: 'poem',
  math: 'note',
  biology: 'note',
  chemistry: 'note',
  science: 'note',
};

let activeFilter = 'all';

function postKind(post) {
  return post.kind || SUBJECT_TO_KIND[post.subject] || 'note';
}

function postTags(post) {
  if (Array.isArray(post.tags)) return post.tags.filter(Boolean);
  return [post.custom_subject, post.subject, post.language].filter(Boolean);
}

function viewText(count) {
  return `${count} view${count === 1 ? '' : 's'}`;
}

function renderPost(post, views) {
  const kind = postKind(post);
  const tags = postTags(post).slice(0, 3);
  const count = views[post.id] || 0;

  return `
    <a class="writing-entry" href="${post.path}" data-kind="${kind}">
      <span class="entry-kicker">${KIND_LABELS[kind] || 'Note'}</span>
      <span class="entry-main">
        <span class="entry-title">${post.title}</span>
        <span class="entry-summary">${post.description || post.custom_subject || ''}</span>
      </span>
      <span class="entry-meta">
        <span>${post.date}</span>
        <span>${viewText(count)}</span>
        ${tags.map(tag => `<span>${tag}</span>`).join('')}
      </span>
    </a>`;
}

function renderArchive(posts, views) {
  const el = document.getElementById('writing-list');
  if (!el) return;

  const visiblePosts = posts.filter(post => activeFilter === 'all' || postKind(post) === activeFilter);
  if (!visiblePosts.length) {
    el.innerHTML = '<p class="empty-msg">No writing here yet.</p>';
    return;
  }

  el.innerHTML = visiblePosts.map(post => renderPost(post, views)).join('');
}

function bindFilters(posts, views) {
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn === button);
      });
      renderArchive(posts, views);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const posts = window.POSTS || [];
  const views = await getAllViews(posts.map(post => post.id));

  renderArchive(posts, views);
  bindFilters(posts, views);
});
