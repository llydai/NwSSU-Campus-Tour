// ══════════════════════════════════════════════
// SHORTCUTS PANEL — UI Controller
// File: js/app-shortcuts.js
//
// Responsibilities:
//   - Open / close the shortcuts panel
//   - Tab switching (Keyboard / Quick Nav / Gestures)
//   - Keyboard shortcut listener (Alt+key, Ctrl+K, etc.)
//   - Swipe-page gesture handler (left/right on main)
// ══════════════════════════════════════════════

// ── Page order for swipe cycling ──
const PAGE_ORDER = ['home', 'map', 'buildings', 'departments', 'offices', 'orgs', 'freshmen'];

// ══════════════════════════════════════════════
// PANEL OPEN / CLOSE
// ══════════════════════════════════════════════

function openShortcuts() {
  document.getElementById('scBackdrop')?.classList.add('show');
  document.getElementById('scPanel')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeShortcuts() {
  document.getElementById('scBackdrop')?.classList.remove('show');
  document.getElementById('scPanel')?.classList.remove('open');
  if (!document.getElementById('vnPanel')?.classList.contains('open'))
    document.body.style.overflow = '';
}

// ── Tab switching ──
function switchShortcutTab(tabId, btn) {
  document.querySelectorAll('.sc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sc-tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sc-tab-' + tabId)?.classList.add('active');
}

// ══════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════

function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    // ── Ctrl + K → focus search ──
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const gs = document.getElementById('globalSearch');
      if (gs) { gs.focus(); gs.select(); }
      return;
    }

    // ── Escape → close any open panel / modal ──
    if (e.key === 'Escape') {
      if (document.getElementById('lightbox')?.classList.contains('open'))     { closeLightbox();      return; }
      if (document.getElementById('detailScreen')?.classList.contains('open')) { closeDetailScreen();  return; }
      if (document.getElementById('vnPanel')?.classList.contains('open'))      { closeVoiceNav();      return; }
      if (document.getElementById('scPanel')?.classList.contains('open'))      { closeShortcuts();     return; }
      if (document.getElementById('modalOverlay')?.classList.contains('open')) { closeModal();         return; }
      if (drawerOpen) { closeDrawer(); return; }
      return;
    }

    // ── Map-specific shortcuts (only when on map page, not in input) ──
    if (!inInput && currentPage === 'map') {
      if (e.key === '+' || e.key === '=') { e.preventDefault(); mapZoomIn();  return; }
      if (e.key === '-')                   { e.preventDefault(); mapZoomOut(); return; }
      if (e.key === '0')                   { e.preventDefault(); mapReset();   return; }
      if (e.key === 'ArrowRight')          { e.preventDefault(); cycleMapBuilding(1);  return; }
      if (e.key === 'ArrowLeft')           { e.preventDefault(); cycleMapBuilding(-1); return; }
    }

    // ── Alt + key shortcuts (skip when typing in inputs) ──
    if (!e.altKey || inInput) return;

    switch (e.key.toLowerCase()) {
      case 'h': e.preventDefault(); navigateTo('home');        break;
      case 'm': e.preventDefault(); navigateTo('map');         break;
      case 'b': e.preventDefault(); navigateTo('buildings');   break;
      case 'd': e.preventDefault(); navigateTo('departments'); break;
      case 'o': e.preventDefault(); navigateTo('offices');     break;
      case 'g': e.preventDefault(); navigateTo('orgs');        break;
      case 'f': e.preventDefault(); navigateTo('freshmen');    break;
      case 'v': e.preventDefault();
        document.getElementById('vnPanel')?.classList.contains('open')
          ? closeVoiceNav() : openVoiceNav();
        break;
      case 's': e.preventDefault();
        document.getElementById('scPanel')?.classList.contains('open')
          ? closeShortcuts() : openShortcuts();
        break;
    }
  });
}

// ── Cycle through map buildings with arrow keys ──
const MAP_BUILDING_IDS = [
  'gate','cat','ccjs','coed','ccis','con','com','cea',
  'president','registrar','cashier','alumni','canteen',
  'sociocultural','studentcouncil','library','hotel','sports'
];
let _mapBldgCursor = 0;

function cycleMapBuilding(dir) {
  _mapBldgCursor = (_mapBldgCursor + dir + MAP_BUILDING_IDS.length) % MAP_BUILDING_IDS.length;
  selectMapBuilding(MAP_BUILDING_IDS[_mapBldgCursor]);
  showToast('📍 ' + (BLDG_LABELS[MAP_BUILDING_IDS[_mapBldgCursor]] || MAP_BUILDING_IDS[_mapBldgCursor]));
}

// ══════════════════════════════════════════════
// SWIPE GESTURES (left / right to change page)
// ══════════════════════════════════════════════

function initSwipeGestures() {
  let startX = 0, startY = 0, startTime = 0;
  const MIN_DIST  = 60;   // px
  const MAX_VERT  = 80;   // px — ignore mostly-vertical swipes
  const MAX_TIME  = 350;  // ms

  document.addEventListener('touchstart', e => {
    // Don't intercept if touch starts inside map viewport or a panel
    if (e.target.closest('#mapViewport,#vnPanel,#scPanel,.detail-screen,.modal-box')) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!startX) return;
    const dx   = e.changedTouches[0].clientX - startX;
    const dy   = e.changedTouches[0].clientY - startY;
    const dt   = Date.now() - startTime;
    startX = startY = 0;

    if (Math.abs(dx) < MIN_DIST) return;
    if (Math.abs(dy) > MAX_VERT) return;
    if (dt > MAX_TIME) return;

    // Any overlay open? Ignore swipes.
    if (
      document.getElementById('vnPanel')?.classList.contains('open') ||
      document.getElementById('scPanel')?.classList.contains('open') ||
      document.getElementById('detailScreen')?.classList.contains('open') ||
      document.getElementById('modalOverlay')?.classList.contains('open') ||
      drawerOpen
    ) return;

    const prevPage = currentPage;
    const idx = PAGE_ORDER.indexOf(currentPage);
    if (dx < 0 && idx < PAGE_ORDER.length - 1) {
      navigateTo(PAGE_ORDER[idx + 1]);
      applySlideClass('slide-in-left');
    }
    if (dx > 0 && idx > 0) {
      navigateTo(PAGE_ORDER[idx - 1]);
      applySlideClass('slide-in-right');
    }
  }, { passive: true });
}

// ══════════════════════════════════════════════
// BOOT HOOK
// Called from appBoot() in app-core.js
// ══════════════════════════════════════════════
function initShortcuts() {
  buildPageDots();
  triggerFabHint();
  initKeyboardShortcuts();
  initSwipeGestures();
}

// ══════════════════════════════════════════════
// PAGE INDICATOR DOTS
// Renders a dot strip at bottom showing position
// in the PAGE_ORDER sequence. Active dot expands.
// ══════════════════════════════════════════════

function buildPageDots() {
  const container = document.getElementById('pageDots');
  if (!container) return;
  container.innerHTML = PAGE_ORDER.map((p, i) =>
    `<div class="page-dot ${p === currentPage ? 'active' : ''}" data-page="${p}"></div>`
  ).join('');
}

function updatePageDots() {
  document.querySelectorAll('.page-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.page === currentPage);
  });
  // Briefly show dots then fade
  const pd = document.getElementById('pageDots');
  if (!pd) return;
  pd.classList.remove('hidden');
  clearTimeout(window._dotHideTimer);
  window._dotHideTimer = setTimeout(() => pd.classList.add('hidden'), 2200);
}

// ══════════════════════════════════════════════
// FAB FIRST-LOAD HINT
// Pulses the mic and shortcuts FABs once after
// splash to draw attention to them.
// ══════════════════════════════════════════════

function triggerFabHint() {
  setTimeout(() => {
    const mic = document.getElementById('fabMic');
    const sc  = document.getElementById('fabShortcuts');
    mic?.classList.add('hint-pulse');
    setTimeout(() => sc?.classList.add('hint-pulse'), 500);
    setTimeout(() => {
      mic?.classList.remove('hint-pulse');
      sc?.classList.remove('hint-pulse');
    }, 5000);
  }, 3200); // after splash is gone
}

// ══════════════════════════════════════════════
// PATCH navigateTo to update dots on page change
// This wraps the original navigateTo from app-core.js
// ══════════════════════════════════════════════

(function patchNavigateTo() {
  const _orig = window.navigateTo;
  window.navigateTo = function(page) {
    _orig(page);
    updatePageDots();
  };
})();

// ── Slide animation helper ──
function applySlideClass(cls) {
  const el = document.getElementById('page-' + currentPage);
  if (!el) return;
  el.classList.remove('slide-in-left', 'slide-in-right');
  // Force reflow so animation re-triggers
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 400);
}
