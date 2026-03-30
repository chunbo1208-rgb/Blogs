# Global View Counter — Design Idea

## Problem

The current `views.js` uses `localStorage` to track view counts. This is per-browser and per-device — every visitor starts from 0. The "Top Reads" section therefore shows meaningless counts and cannot reflect real popularity.

## Goal

All visitors see the same, real, globally-accumulated view count for each post.

---

## Solution: Cloudflare Pages Functions + KV

Since the blog is a static site hosted on Cloudflare Pages (connected to GitHub), we can use **Cloudflare Pages Functions** as a lightweight backend and **Cloudflare KV** as a key-value store for counts.

No separate server or database is needed. Everything stays within Cloudflare's free tier.

---

## Architecture

```
Visitor's browser
      │
      ├── GET  /api/views?ids=id1,id2,...   → read counts for homepage / subject pages
      └── POST /api/views?id=post-id        → increment count when a post is opened

Cloudflare Pages Function  (functions/api/views.js)
      │
      └── Cloudflare KV namespace  (VIEWS)
              key: post id  →  value: count (integer)
```

---

## Setup Steps (one-time, in Cloudflare Dashboard)

1. Go to **Workers & Pages → KV** → create a new namespace, e.g. `blog-views`
2. Go to your **Pages project → Settings → Functions → KV namespace bindings**
3. Add a binding:
   - Variable name: `VIEWS`
   - KV namespace: select `blog-views`
4. Save — Cloudflare will inject `VIEWS` into every Pages Function automatically

---

## Code Changes

### 1. `functions/api/views.js` (new file)

Handles two operations:

- `GET /api/views?ids=id1,id2,id3` — returns a JSON object `{ id1: count, id2: count, ... }`
- `POST /api/views?id=post-id` — increments the count for that post by 1, returns new count

### 2. `js/views.js` (replace localStorage logic)

- `recordView(postId)` → sends `POST /api/views?id=postId`
- `getAllViews(postIds)` → sends `GET /api/views?ids=...` and returns the counts object
- Both become async functions

### 3. Subject index pages + `discover.js`

- Await `getAllViews()` before rendering post lists
- Top Reads on homepage will now sort by real global counts

---

## Free Tier Limits (Cloudflare)

| Resource | Free allowance |
|---|---|
| Pages Functions requests | 100,000 / day |
| KV reads | 100,000 / day |
| KV writes | 1,000 / day |

More than sufficient for a personal blog.

---

## Deployment

No special build step needed. Push to GitHub → Cloudflare Pages auto-deploys. The `functions/` folder is automatically recognized as Pages Functions.

---

## Status

- [ ] KV namespace created in Cloudflare Dashboard
- [ ] KV binding added to Pages project
- [x] `functions/api/views.js` written
- [x] `js/views.js` updated to async API calls
- [ ] Subject index pages updated
- [x] `discover.js` updated
- [ ] Deployed and tested
