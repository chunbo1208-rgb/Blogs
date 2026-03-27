/**
 * post-shell.js
 * Drop one line into any post's <head> and get:
 *   - style.css
 *   - KaTeX (CSS + JS, in correct load order)
 *   - footer with ← back (browser history) and ← home
 *
 * Usage:
 *   <script src="../../assets/post-shell.js"></script>   ← depth 2 (posts/math/)
 *   <script src="../assets/post-shell.js"></script>       ← depth 1 (posts/)
 *
 * The script auto-detects depth from its own URL, so ← home always
 * points to the correct index.html regardless of nesting.
 */
(function () {
  const scriptSrc = document.currentScript.src;   // absolute URL of this file
  const pageSrc   = window.location.href;          // absolute URL of the post

  // Blog root = directory that contains assets/
  const blogRoot  = scriptSrc.replace(/assets\/post-shell\.js.*$/, '');

  // Relative path of this page from the blog root (e.g. "posts/math/intro.html")
  const relPage   = decodeURIComponent(pageSrc.replace(blogRoot, ''));
  const depth     = relPage.split('/').length - 1; // directories deep from root

  const toRoot    = '../'.repeat(depth);            // "../" × depth
  const assetsDir = toRoot + 'assets/';

  // ── CSS ────────────────────────────────────────────────────
  function addCSS(href) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  addCSS(assetsDir + 'style.css');
  addCSS('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');

  // ── KaTeX JS — load main first, then auto-render ──────────
  const katexMain = document.createElement('script');
  katexMain.src   = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
  katexMain.defer = true;
  katexMain.onload = function () {
    const ar = document.createElement('script');
    ar.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
    ar.onload = function () {
      renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true  },
          { left: '$',  right: '$',  display: false }
        ]
      });
    };
    document.head.appendChild(ar);
  };
  document.head.appendChild(katexMain);

  // ── Footer ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('footer')) {
      const footer = document.createElement('footer');
      footer.innerHTML =
        '<p>' +
        '<a class="back" href="#" onclick="history.back();return false;">← back</a>' +
        '&nbsp;&nbsp;' +
        '<a class="back" href="' + toRoot + 'index.html">.  ← home</a>' +
        '</p>';
      document.body.appendChild(footer);
    }
  });
}());
