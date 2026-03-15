// ══════════════════════════════════════════════
// APP CORE
// File: js/app-core.js
// ══════════════════════════════════════════════

// ─── STATE ───
let currentPage  = 'home';
let drawerOpen   = false;
let currentScale = 1;
let activeBuilding = null;

const MAP_MIN = 0.5;
const MAP_MAX = 2.0;

// ─── BOOT ───
function appBoot() {
  initSplash();
  initNavbar();
  initDrawerLinks();
  initGlobalSearch();
  populateBuildings();
  populateDepartments();
  populateOffices();
  populateOrgs();
  initMapTouch();
  createDetailScreen();
  createLightbox();
  initShortcuts();
  initMapVoicePanel();  // ← new: wire up inline map voice panel
}

// ── Splash ──
function initSplash() {
  setTimeout(() => document.getElementById('splash')?.classList.add('gone'), 2500);
}

// ── Navbar ──
function initNavbar() {
  document.querySelectorAll('.nl').forEach(link =>
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    })
  );

  const burger = document.getElementById('hamburger');
  if (burger) burger.addEventListener('click', () => drawerOpen ? closeDrawer() : openDrawer());

  document.addEventListener('click', e => {
    const panel = document.getElementById('searchPanel');
    if (!panel) return;
    if (!e.target.closest('.nav-search-box') && !e.target.closest('#searchPanel'))
      panel.classList.remove('show');
  });

  const gs = document.getElementById('globalSearch');
  if (gs) gs.addEventListener('input', e => doSearch(e.target.value));
}

// ── Drawer ──
function initDrawerLinks() {
  document.querySelectorAll('.dl').forEach(link =>
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.page);
      closeDrawer();
    })
  );
}

function openDrawer() {
  drawerOpen = true;
  document.getElementById('drawer')?.classList.add('open');
  document.getElementById('drawerBg')?.classList.add('show');
  document.getElementById('hamburger')?.classList.add('open');
}

function closeDrawer() {
  drawerOpen = false;
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('drawerBg')?.classList.remove('show');
  document.getElementById('hamburger')?.classList.remove('open');
}

// ── Navigation ──
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nl').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  document.querySelector(`.nl[data-page="${page}"]`)?.classList.add('active');
  currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Init Map Voice Panel ──
// Injects a "speech not supported" banner if the browser lacks the API
function initMapVoicePanel() {
  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!supported) {
    const listenArea = document.querySelector('.mvp-listen-area');
    if (listenArea) {
      const warn = document.createElement('div');
      warn.className = 'mvp-no-speech-warn';
      warn.innerHTML = `⚠️ <span>Your browser doesn't support the Web Speech API. Use command chips below to navigate, or open in Chrome/Edge for full voice support.</span>`;
      listenArea.parentNode.insertBefore(warn, listenArea);
    }
  }
}

// ── Utilities ──
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(s) {
  return String(s)
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
}