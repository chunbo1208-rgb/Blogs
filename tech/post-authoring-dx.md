# Post Authoring DX — Design & Fix

## The Problem

Adding a new post currently requires touching **3 places** with the same data:

### 1. `<post-meta>` in the post HTML
```html
<post-meta
  id="my-post"
  title="My Post"
  author="Chunbo Liu"
  date="2026-03-30"
  subject="math"
  custom_subject="Analysis"
  language="en"
  template="math"
></post-meta>
```

### 2. `posts-data.js` — manually duplicated
```js
{
  "id": "my-post",
  "path": "posts/math/my-post.html",
  "title": "My Post",
  "author": "Chunbo Liu",
  "date": "2026-03-30",
  ...
}
```

### 3. Bottom `<script>` in the same HTML — id duplicated again
```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const badge = document.getElementById('view-count');
    const v = getViews('my-post');   // ← same id, third time
    badge.textContent = v + ' view' + (v !== 1 ? 's' : '');
  });
</script>
```

**All three reference the same data.** Any typo or mismatch breaks things silently.

---

## Why It Happened

- `posts-data.js` was written as a static registry so the homepage could load post metadata without fetching/parsing every HTML file (no server, no build step).
- The bottom `<script>` was added per-post because `views.js` only handled `recordView` automatically — it didn't update the view badge.
- Result: every new post requires 3 manual edits.

---

## The Fix

### Fix 1 — Remove the bottom `<script>` block

`views.js` already reads `<post-meta id="">` on `DOMContentLoaded` to call `recordView`. It just needs 3 extra lines to also find `#view-count` and write the count. Once done, the entire bottom `<script>` block is deleted from every post HTML. Posts need zero boilerplate JS.

### Fix 2 — Auto-generate `posts-data.js`

Add `generate-posts-data.js` at the repo root. It:
1. Recursively scans `posts/**/*.html` (skipping `*.index.html`)
2. Parses `<post-meta>` attributes from each file with a regex
3. Derives the `path` from the file path itself
4. Sorts posts by date descending
5. Writes `posts-data.js`

Set **Cloudflare Pages build command** to `node generate-posts-data.js`. Every push triggers it — `posts-data.js` is always up to date automatically.

---

## Result

To add a new post:
1. Create the HTML file with `<post-meta>` and write the content
2. Push to GitHub
3. Done — homepage, subject pages, Top Reads all update automatically

---

## Files Changed

| File | Change |
|---|---|
| `js/views.js` | Auto-update `#view-count` badge from `<post-meta id>` |
| `generate-posts-data.js` | New — build script, scans posts and writes `posts-data.js` |
| `posts-data.js` | Becomes auto-generated, never edited manually |
| Every post HTML | Bottom `<script>` block removed |

## Status

- [x] Design documented
- [x] `views.js` updated
- [x] `generate-posts-data.js` created
- [x] Bottom `<script>` removed from all post HTML files
- [ ] Cloudflare Pages build command set to `node generate-posts-data.js`
- [ ] Tested on deploy
