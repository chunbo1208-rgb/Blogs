# Dev Log — Blogs

A personal static blog site. Pure HTML + CSS + JS. Hosted on GitHub Pages.
Inspired by the quiet elegance of Feynman's physics page.

---

## Vision

- A silent, minimal page — no framework, no noise
- Supports Markdown text and LaTeX math rendering
- Auto-deployable via GitHub Actions
- Topics: Self · Math · Physics · CS · Philosophy · Daily entries

---

## Log

### 2026-03-27

**Done:**
- Created `index.html` — landing page with name, tagline, topic tags, post list
- Created `assets/style.css` — serif body, warm #F5F4EF background, max-width 700px, KaTeX display support
- Created `posts/template.html` — copy this for every new post; KaTeX CDN included, LaTeX demo inline

**Structure:**
```
Blogs/
├── index.html
├── posts/
│   └── template.html
├── assets/
│   └── style.css
├── DEV-LOG.md
└── README.md
```

**Next:**
- Add real posts under `posts/`
- Update `index.html` post list as new posts are added
- Push to GitHub Pages

---

---

<!-- Template for new entries:

### YYYY-MM-DD

**Done:**
-

**Next:**
-

**Notes:**

---
-->
