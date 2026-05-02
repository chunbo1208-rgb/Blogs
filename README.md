# Chunbo Liu

A personal website built from plain HTML, CSS, and JavaScript. The homepage centers
Chunbo first, then presents writing as one clean archive instead of many subject windows.

## Current Stack

- `index.html` is the personal homepage.
- `styles/index.css` controls the homepage design.
- `styles/base.css` controls shared post typography.
- `posts/` contains one standalone HTML file per post.
- `posts-data.js` is generated from each post's `<post-meta>` tag.
- `functions/api/views.js` is the small backend endpoint for view counts.

There is still no framework and no dependency install step.

## Content Model

Each post keeps a short metadata tag inside `<head>`:

```html
<post-meta
  id="on-writing"
  title="On Writing in Silence"
  author="Chunbo Liu"
  date="2026-03-28"
  subject="ideas"
  custom_subject="Reflection"
  language="en"
  template="default"
  kind="essay"
  description="A note on writing with fewer systems in the way."
  tags="writing, reflection, tools"
></post-meta>
```

The homepage now cares mostly about:

- `kind`: `essay`, `note`, or `poem`
- `title`
- `date`
- `description`
- `tags`
- `path`

Older fields such as `subject`, `custom_subject`, and `template` still work so existing
posts do not break.

## Add Or Edit A Post

1. Create or edit a file in `posts/<folder>/<post-name>.html`.
2. Keep the `<post-meta>` tag accurate.
3. Point the post back to `../../index.html`.
4. Regenerate the archive data:

```bash
node generate-posts-data.js
```

5. Preview locally:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Publish

The site is deployed from the root of the `main` branch. After checking the preview:

```bash
git status
git add .
git commit -m "Update personal website"
git push origin main
```

## Direction

The new direction is personal website first, archive second:

- Fewer homepage sections.
- Fewer navigation windows.
- One writing list with simple filters.
- Post files stay standalone and readable.
- Backend stays limited to data that actually needs persistence.
