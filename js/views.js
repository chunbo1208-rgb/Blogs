// views.js — global view counting via Cloudflare KV API

async function recordView(postId) {
  try {
    const res = await fetch(`/api/views?id=${encodeURIComponent(postId)}`, { method: 'POST' });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.views || 0;
  } catch {
    return 0;
  }
}

async function getAllViews(postIds) {
  if (!postIds || !postIds.length) return {};
  try {
    const ids = postIds.map(encodeURIComponent).join(',');
    const res = await fetch(`/api/views?ids=${ids}`);
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

// Auto-record view and update badge if on a post page (post-meta tag present)
document.addEventListener('DOMContentLoaded', async () => {
  const meta = document.querySelector('post-meta');
  if (meta) {
    const postId = meta.getAttribute('id') || window.location.pathname.split('/').pop().replace('.html', '');
    const count = await recordView(postId);
    const badge = document.getElementById('view-count');
    if (badge) badge.textContent = count + ' view' + (count !== 1 ? 's' : '');
  }
});
