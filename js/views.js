// views.js - global view counting via the /api/views endpoint.

const VIEW_CACHE_PREFIX = 'views.';

function localViewCount(postId) {
  return Number(localStorage.getItem(`${VIEW_CACHE_PREFIX}${postId}`) || 0);
}

function setLocalViewCount(postId, count) {
  localStorage.setItem(`${VIEW_CACHE_PREFIX}${postId}`, String(count));
}

async function recordView(postId) {
  try {
    const res = await fetch(`/api/views?id=${encodeURIComponent(postId)}`, { method: 'POST' });
    if (!res.ok) throw new Error('view api unavailable');
    const data = await res.json();
    return data.views || 0;
  } catch {
    const next = localViewCount(postId) + 1;
    setLocalViewCount(postId, next);
    return next;
  }
}

async function getAllViews(postIds) {
  if (!postIds || !postIds.length) return {};
  try {
    const ids = postIds.map(encodeURIComponent).join(',');
    const res = await fetch(`/api/views?ids=${ids}`);
    if (!res.ok) throw new Error('view api unavailable');
    return await res.json();
  } catch {
    return Object.fromEntries(postIds.map(id => [id, localViewCount(id)]));
  }
}

// Auto-record view and update badge if on a post page (post-meta tag present)
document.addEventListener('DOMContentLoaded', async () => {
  const meta = document.querySelector('post-meta');
  if (meta) {
    const postId = meta.getAttribute('id') || window.location.pathname.split('/').pop().replace('.html', '');
    const count = await recordView(postId);
    const badge = document.getElementById('view-count');
    if (badge) badge.textContent = count + ' view' + (count === 1 ? '' : 's');
  }
});
