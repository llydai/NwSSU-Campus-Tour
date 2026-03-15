// ══════════════════════════════════════════════
// PAGE LOADER
// File: js/page-loader.js
//
// Fetches each pages/*.html partial and injects
// it into the matching element in index.html.
// Uses fetch() — requires HTTP server (not file://).
//
// If opening via file://, paste each pages/*.html
// content directly into its target element in
// index.html and remove this <script> tag.
// ══════════════════════════════════════════════

const PAGE_PARTIALS = [
  // Page sections  → injected into <section id="page-*">
  { id: 'page-home',        file: 'pages/home.html' },
  { id: 'page-map',         file: 'pages/map.html' },
  { id: 'page-buildings',   file: 'pages/buildings.html' },
  { id: 'page-departments', file: 'pages/departments.html' },
  { id: 'page-offices',     file: 'pages/offices.html' },
  { id: 'page-orgs',        file: 'pages/orgs.html' },
  { id: 'page-freshmen',    file: 'pages/freshmen.html' },
  // Overlay panels → injected into their own wrapper divs
  { id: 'voiceNavPanel',    file: 'pages/voice-nav.html' },
  { id: 'shortcutsPanel',   file: 'pages/shortcuts.html' },
];

// Load all partials in parallel, then boot the app
Promise.all(
  PAGE_PARTIALS.map(({ id, file }) =>
    fetch(file)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load ' + file + ': ' + r.status);
        return r.text();
      })
      .then(html => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
      })
      .catch(err => {
        console.warn('[page-loader]', err.message);
      })
  )
).then(() => {
  if (typeof appBoot === 'function') appBoot();
});
