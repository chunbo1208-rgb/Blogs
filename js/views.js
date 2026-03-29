// views.js — per-browser view counting via localStorage

const VIEWS_PREFIX = 'chunboblog:views:';

function recordView(postId) {
  const key = VIEWS_PREFIX + postId;
  const count = parseInt(localStorage.getItem(key) || '0', 10);
  localStorage.setItem(key, count + 1);
  return count + 1;
}

function getViews(postId) {
  const key = VIEWS_PREFIX + postId;
  return parseInt(localStorage.getItem(key) || '0', 10);
}

function getAllViews() {
  const views = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(VIEWS_PREFIX)) {
      const postId = key.slice(VIEWS_PREFIX.length);
      views[postId] = parseInt(localStorage.getItem(key) || '0', 10);
    }
  }
  return views;
}

// Auto-record view if on a post page (post-meta tag present)
document.addEventListener('DOMContentLoaded', () => {
  const meta = document.querySelector('post-meta');
  if (meta) {
    const postId = meta.getAttribute('id') || window.location.pathname.split('/').pop().replace('.html', '');
    recordView(postId);
  }
});
