# Blogs

A static personal blog — pure HTML + CSS + JS, no framework, no database, no build step. Deployed on GitHub Pages.

---

## Philosophy

- Zero dependencies. Every file is a standalone HTML page.
- No server-side logic. All dynamic behavior (view counts, filtering, language switching) lives in the browser via `localStorage` and vanilla JS.
- Writing first. Adding a new post = creating one HTML file + one line of metadata.

---

---

## How Posts Work

Each post is a plain HTML file. Its metadata lives in a single custom tag inside `<head>`:

```html
<post-meta
  title="静夜思"
  author="李白"
  date="2026-03-29"
  subject="poem" (note, subject can be multi, for example, here can also be tags like "poems" "中国文学" and so on)
  custom_subject="唐诗"
  language="zh"
  template="poem"
></post-meta>
```

- `subject` maps to a CSS template and a section on the homepage.
- `template` selects the visual style (poem / math / science / default).
- `language` is `zh` or `en` — controls which language filter shows this post.

The post HTML body is free-form. The template CSS does all the visual heavy lifting.

---

## How `index.html` Works

The homepage has four sections, all driven by `posts.json` (a flat list of post metadata) read at runtime by `discover.js`.

### 1. Today's Posts
Filters posts where `date === today`. If none, shows: *"No articles today."*

### 2. Top 10 Most Read
Reads view counts from `localStorage`, sorts descending, shows top 10 entries with: title · author · subject · views · date · language.

### 3. Sections
One card per subject (Math, Biology, Poem, Ideas…). Each card links to that subject's index page (e.g. `posts/math/math.index.html`). The card's visual style matches the subject's template CSS.

### 4. Language Filter
A toggle between 中文 / English. Filters the entire post list in-place — no page reload.

---

## View Counting

No server needed. `views.js` does this:

1. On every post page load, read `views.<post-id>` from `localStorage`, increment by 1, write back.
2. On the homepage, `discover.js` reads all view keys from `localStorage` and merges them into the post list for display.

Caveat: counts are per-browser, not global. Good enough for a personal blog.

---

## How to Add a New Post

1. Create `posts/<subject>/my-post.html`.
2. Add the `<post-meta ...>` tag in `<head>`.
3. Add one line to `posts/posts.json`:

```json
{ "id": "my-post", "path": "posts/subject/my-post.html", "title": "...", "author": "...", "date": "2026-03-29", "subject": "poem", "language": "zh", "template": "poem" }
```

4. Done. The homepage picks it up automatically.

---

## Subject Index Pages

Each subject has its own index (e.g. `math/math.index.html`). It filters `posts.json` by subject and renders its own list with subject-appropriate styling — e.g. the math index uses a more geometric, monospace-heavy aesthetic.

---

## Templates

Templates are CSS files, not JS components. A post opts in via `<post-meta template="poem">` and the base layout links the right stylesheet. Each template controls:

- Background texture / color
- Font family (e.g. 隶书 for classical Chinese, monospace for math)
- Spacing and line height rhythm
- Decorative elements (ink wash, grid, formula borders…)

---

## Deployment

GitHub Pages, served from `main` branch root. No CI needed — push HTML, it's live.

---

## What Is Not Here

| Thing | Why not |
|---|---|
| React / Vue / Svelte | No build step wanted |
| Database | `localStorage` is enough for view counts |
| CMS | Writing HTML directly is fine |
| Comments | Out of scope for now |
| Search | Can add a client-side JSON index later if needed |

# add post
To add a new post: create one .html file in the subject folder, add a <post-meta> tag, and add one line to posts.json. 