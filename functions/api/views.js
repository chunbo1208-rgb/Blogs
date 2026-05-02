// functions/api/views.js - Cloudflare Pages Function
// GET  /api/views?ids=id1,id2,...  -> { id1: count, id2: count, ... }
// POST /api/views?id=post-id       -> { id: post-id, views: newCount }

const ID_PATTERN = /^[\p{L}\p{N}._&-]{1,120}$/u;

function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

function cleanIds(value) {
  return value
    .split(',')
    .map(id => id.trim())
    .filter(id => ID_PATTERN.test(id))
    .slice(0, 100);
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return json(null, { status: 204 });
  }

  if (!env.VIEWS) {
    return json({ error: 'views store is not configured' }, { status: 503 });
  }

  if (request.method === 'GET') {
    const ids = cleanIds(url.searchParams.get('ids') || '');
    if (!ids.length) {
      return json({});
    }
    const entries = await Promise.all(
      ids.map(async id => {
        const val = await env.VIEWS.get(id);
        return [id, val ? parseInt(val, 10) : 0];
      })
    );
    return json(Object.fromEntries(entries));
  }

  if (request.method === 'POST') {
    const id = url.searchParams.get('id');
    if (!id || !ID_PATTERN.test(id)) {
      return json({ error: 'invalid id' }, { status: 400 });
    }
    const current = await env.VIEWS.get(id);
    const next = (current ? parseInt(current, 10) : 0) + 1;
    await env.VIEWS.put(id, String(next));
    return json({ id, views: next });
  }

  return json({ error: 'method not allowed' }, { status: 405 });
}
