// functions/api/views.js — Cloudflare Pages Function
// GET  /api/views?ids=id1,id2,...  → { id1: count, id2: count, ... }
// POST /api/views?id=post-id       → { id: post-id, views: newCount }

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method === 'GET') {
    const ids = (url.searchParams.get('ids') || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!ids.length) {
      return new Response(JSON.stringify({}), { headers: corsHeaders });
    }
    const entries = await Promise.all(
      ids.map(async id => {
        const val = await env.VIEWS.get(id);
        return [id, val ? parseInt(val, 10) : 0];
      })
    );
    return new Response(JSON.stringify(Object.fromEntries(entries)), { headers: corsHeaders });
  }

  if (request.method === 'POST') {
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'missing id' }), { status: 400, headers: corsHeaders });
    }
    const current = await env.VIEWS.get(id);
    const next = (current ? parseInt(current, 10) : 0) + 1;
    await env.VIEWS.put(id, String(next));
    return new Response(JSON.stringify({ id, views: next }), { headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405, headers: corsHeaders });
}
