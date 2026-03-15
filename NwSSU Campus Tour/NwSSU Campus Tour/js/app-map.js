// ══════════════════════════════════════════════
// MAP & ROUTING
// File: js/app-map.js
// ══════════════════════════════════════════════

// ─── MAP COORDINATES (SVG viewBox 1000×750) ───
const MAP_COORDS = {
  gate:           { x: 365, y: 615 },
  cat:            { x: 585, y: 218 },
  ccjs:           { x:  95, y: 323 },
  coed:           { x:  55, y: 368 },
  ccis:           { x: 245, y: 465 },
  con:            { x: 375, y: 473 },
  com:            { x: 815, y: 480 },
  cea:            { x: 645, y: 563 },
  president:      { x: 635, y: 285 },
  registrar:      { x: 735, y: 248 },
  cashier:        { x: 665, y: 360 },
  alumni:         { x: 265, y: 180 },
  canteen:        { x: 465, y: 488 },
  sociocultural:  { x: 545, y: 503 },
  studentcouncil: { x: 625, y: 510 },
  library:        { x: 625, y: 450 },
  hotel:          { x: 765, y: 458 },
  sports:         { x: 345, y: 323 },
};

// ─── ROAD JUNCTIONS ───
const J = {
  GATE_ENTRY: { x: 365, y: 615 },
  ROAD_SW:    { x: 300, y: 500 },
  ROAD_S:     { x: 490, y: 510 },
  ROAD_SE:    { x: 650, y: 440 },
  ROAD_E:     { x: 760, y: 360 },
  ROAD_NE:    { x: 700, y: 230 },
  ROAD_N:     { x: 420, y: 210 },
  ROAD_NW:    { x: 130, y: 310 },
  ROAD_FIELD: { x: 345, y: 323 },
};

const BUILDING_JUNCTION = {
  gate:           [J.GATE_ENTRY],
  cat:            [J.ROAD_NE],
  ccjs:           [J.ROAD_NW],
  coed:           [J.ROAD_NW],
  ccis:           [J.ROAD_SW],
  con:            [J.ROAD_SW, J.ROAD_S],
  com:            [J.ROAD_E],
  cea:            [J.ROAD_SE, J.ROAD_E],
  president:      [J.ROAD_SE],
  registrar:      [J.ROAD_NE, J.ROAD_E],
  cashier:        [J.ROAD_SE],
  alumni:         [J.ROAD_N],
  canteen:        [J.ROAD_S],
  sociocultural:  [J.ROAD_S],
  studentcouncil: [J.ROAD_SE],
  library:        [J.ROAD_SE],
  hotel:          [J.ROAD_E],
  sports:         [J.ROAD_FIELD, J.ROAD_SW],
};

const BLDG_LABELS = {
  gate:           'Main Gate',
  cat:            'CAT Building',
  ccis:           'CCIS Building',
  library:        'Library',
  coed:           'COED Building',
  cea:            'CEA Building',
  con:            'CON Building',
  com:            'COM Building',
  president:      "Admin / President's Office",
  ccjs:           'CCJS Building',
  registrar:      "Registrar's Office",
  cashier:        "Cashier's Office",
  alumni:         'Alumni Building',
  sociocultural:  'Socio-Cultural Building',
  studentcouncil: 'Student Council Building',
  hotel:          'NWSSU Hotel & Restaurant',
  canteen:        'Canteen',
  sports:         'Sports Complex',
};

// ══════════════════════════════════════════════
// ZOOM & TOUCH
// ══════════════════════════════════════════════

function applyMapScale() {
  const w = document.getElementById('mapWorld');
  if (w) w.style.transform = `scale(${currentScale})`;
}

function mapZoomIn()  { currentScale = Math.min(currentScale + 0.18, MAP_MAX); applyMapScale(); }
function mapZoomOut() { currentScale = Math.max(currentScale - 0.18, MAP_MIN); applyMapScale(); }
function mapReset()   { currentScale = 1; applyMapScale(); clearRoute(); }

function initMapTouch() {
  const vp = document.getElementById('mapViewport');
  if (!vp) return;
  let startDist = 0, startScale = 1;

  // Pinch-to-zoom
  vp.addEventListener('touchstart', e => {
    if (e.touches.length === 2) { startDist = getTouchDist(e); startScale = currentScale; }
  }, { passive: true });
  vp.addEventListener('touchmove', e => {
    if (e.touches.length === 2) {
      currentScale = Math.max(MAP_MIN, Math.min(MAP_MAX, startScale * (getTouchDist(e) / startDist)));
      applyMapScale();
    }
  }, { passive: true });

  // Double-tap zoom
  let lastTap = 0;
  vp.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTap < 300 && e.touches.length === 0) {
      e.preventDefault();
      mapZoomIn();
    }
    lastTap = now;
  });

  // Long-press on building to set as destination
  let pressTimer = null;
  vp.addEventListener('touchstart', e => {
    const target = e.target.closest('.mw-bldg');
    if (!target) return;
    pressTimer = setTimeout(() => {
      const id = target.dataset.id;
      if (id) {
        setNavTo(id);
        showToast('📍 Destination set: ' + (BLDG_LABELS[id] || id));
        if ('vibrate' in navigator) navigator.vibrate(60);
      }
    }, 600);
  }, { passive: true });
  vp.addEventListener('touchend',   () => clearTimeout(pressTimer), { passive: true });
  vp.addEventListener('touchmove',  () => clearTimeout(pressTimer), { passive: true });
}

function getTouchDist(e) {
  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// ══════════════════════════════════════════════
// MAP LAYER TOGGLE
// ══════════════════════════════════════════════
let currentMapLayer = 'campus';

function setMapLayer(layer, btn) {
  currentMapLayer = layer;
  document.querySelectorAll('.mlt-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const img = document.getElementById('campusMapBg');
  if (!img) return;

  if (layer === 'satellite') {
    // Use alternate map with indicators if available
    img.src = 'images/nwssu_map_with_indicator.png';
    showToast('🛰️ Satellite overlay — showing building indicators');
  } else {
    img.src = 'images/nwssu_map.png';
    showToast('🗺️ Campus map view');
  }
}

// ══════════════════════════════════════════════
// BUILDING SELECTION & POPUP
// ══════════════════════════════════════════════

function selectMapBuilding(id) {
  const b = BUILDINGS.find(x => x.id === id);
  if (!b) return;

  document.querySelectorAll('.mw-bldg,.mw-sports').forEach(el => el.classList.remove('selected'));
  document.getElementById('mb-' + id)?.classList.add('selected');
  activeBuilding = id;

  const inner = document.getElementById('popupInner');
  if (inner) {
    inner.innerHTML = `
      <div class="popup-name">${escHtml(b.name)}</div>
      <div class="popup-loc">📍 ${escHtml(b.location)}</div>
      <div class="popup-desc">${escHtml(b.desc.slice(0, 110))}…</div>
      <div class="popup-actions">
        <button class="btn-primary" onclick="openBuilding('${b.id}')">Details</button>
        <button class="btn-ghost" onclick="setNavTo('${id}')">Navigate Here</button>
      </div>`;
  }

  document.getElementById('bldgPopup')?.classList.add('show');

  const toSel = document.getElementById('toLocation');
  if (toSel) toSel.value = id;
}

function closePopup() {
  document.getElementById('bldgPopup')?.classList.remove('show');
  document.querySelectorAll('.mw-bldg,.mw-sports').forEach(el => el.classList.remove('selected'));
}

function setNavTo(id) {
  const toSel = document.getElementById('toLocation');
  if (toSel) toSel.value = id;
  showToast('Destination set: ' + (BLDG_LABELS[id] || id));
}

// ══════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════

function toggleSidebar() {
  const sb = document.getElementById('mapSidebar');
  if (!sb) return;
  window.innerWidth < 768
    ? sb.classList.toggle('open')
    : sb.classList.toggle('collapsed');
}

function filterMapList(val) {
  document.querySelectorAll('.msb-item').forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}

// ══════════════════════════════════════════════
// ROUTING
// ══════════════════════════════════════════════

function simulateNavigation() {
  const fromId = document.getElementById('fromLocation')?.value;
  const toId   = document.getElementById('toLocation')?.value;

  if (!fromId || !toId)  { showToast('Please select both From and To locations.'); return; }
  if (fromId === toId)   { showToast('From and To cannot be the same.'); return; }

  const fromC = MAP_COORDS[fromId];
  const toC   = MAP_COORDS[toId];
  if (!fromC || !toC)    { showToast('Coordinates not found.'); return; }

  const pts  = buildRoutePath(fromId, toId, fromC, toC);
  const d    = pointsToPath(pts);

  const rp   = document.getElementById('routePath');
  const rpg  = document.getElementById('routePathGlow');
  if (!rp) return;

  // Draw glow shadow
  if (rpg) {
    rpg.setAttribute('d', d);
    rpg.style.opacity = '0.6';
  }

  // Draw animated dashed path
  rp.setAttribute('d', d);
  rp.style.opacity = '1';
  const len = estimateLen(pts);
  rp.style.strokeDasharray  = '22 12';
  rp.style.strokeDashoffset = len;
  rp.style.transition       = 'none';
  requestAnimationFrame(() => {
    rp.style.transition       = `stroke-dashoffset ${Math.max(0.8, len / 280)}s linear`;
    rp.style.strokeDashoffset = '0';
  });

  // Animate travel dot along path
  animateTravelDot(pts, Math.max(0.8, len / 280));

  document.getElementById('clearRouteBtn').style.display = 'flex';

  const distM = Math.round(len * 0.65);
  const mins  = Math.max(1, Math.round(distM / 75));
  const fl    = BLDG_LABELS[fromId] || fromId;
  const tl    = BLDG_LABELS[toId]   || toId;

  document.getElementById('navResult').innerHTML = `
    <div class="nav-result-box">
      <strong>🧭 Route Found</strong>
      <div style="margin-top:6px;font-size:11px;color:var(--muted)">
        <strong>From:</strong> ${escHtml(fl)}<br>
        <strong>To:</strong> ${escHtml(tl)}
      </div>
      <div style="margin-top:8px;font-size:12px;color:var(--text2)">
        📏 ~${distM}m &nbsp; ⏱️ ~${mins} min walk
      </div>
      <div class="nav-steps">${buildDirections(fromId, toId)}</div>
    </div>`;

  document.querySelectorAll('.mw-bldg,.mw-sports').forEach(el => el.classList.remove('selected'));
  document.getElementById('mb-' + fromId)?.classList.add('selected');
  document.getElementById('mb-' + toId)?.classList.add('selected');

  showToast(`${fl} → ${tl}`);

  // Speak route via TTS if available
  if ('speechSynthesis' in window) {
    const msg = `Route found. From ${fl} to ${tl}. Approximately ${distM} meters, about ${mins} minute walk.`;
    const utt = new SpeechSynthesisUtterance(msg);
    utt.lang = 'en-PH';
    utt.rate = 1.0;
    speechSynthesis.cancel();
    speechSynthesis.speak(utt);
  }
}

function clearRoute() {
  const rp  = document.getElementById('routePath');
  const rpg = document.getElementById('routePathGlow');
  if (rp)  { rp.style.opacity  = '0'; rp.setAttribute('d', ''); }
  if (rpg) { rpg.style.opacity = '0'; rpg.setAttribute('d', ''); }
  document.getElementById('clearRouteBtn').style.display = 'none';
  document.getElementById('navResult').innerHTML = '';
  document.querySelectorAll('.mw-bldg,.mw-sports').forEach(el => el.classList.remove('selected'));
  speechSynthesis.cancel?.();
}

// ─── Animate travel dot ───
function animateTravelDot(pts, duration) {
  const dot = document.getElementById('travelDot');
  if (!dot || pts.length < 2) return;

  dot.style.opacity = '1';
  const totalLen = estimateLen(pts);
  const startTime = performance.now();
  const durationMs = duration * 1000;

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / durationMs, 1);
    const targetDist = t * totalLen;

    // Find position along the path
    let accum = 0;
    for (let i = 1; i < pts.length; i++) {
      const segLen = pDist(pts[i-1], pts[i]);
      if (accum + segLen >= targetDist) {
        const frac = (targetDist - accum) / segLen;
        const x = pts[i-1].x + frac * (pts[i].x - pts[i-1].x);
        const y = pts[i-1].y + frac * (pts[i].y - pts[i-1].y);
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
        break;
      }
      accum += segLen;
    }

    if (t < 1) requestAnimationFrame(step);
    else dot.style.opacity = '0';
  }

  requestAnimationFrame(step);
}

// ─── Routing Helpers ───

function buildRoutePath(fromId, toId, fromC, toC) {
  const pts    = [fromC];
  const fromJs = BUILDING_JUNCTION[fromId] || [fromC];
  const toJs   = BUILDING_JUNCTION[toId]   || [toC];
  const fromJ  = closest(fromC, fromJs);
  const toJ    = closest(toC, toJs);

  if (!eq(fromC, fromJ)) pts.push(fromJ);

  if (!eq(fromJ, toJ)) {
    if (Math.abs(toJ.x - fromJ.x) >= Math.abs(toJ.y - fromJ.y))
      pts.push({ x: toJ.x, y: fromJ.y });
    else
      pts.push({ x: fromJ.x, y: toJ.y });
    pts.push(toJ);
  }

  if (!eq(toJ, toC)) pts.push(toC);
  return pts;
}

function closest(coord, junctions) {
  return junctions.reduce((best, j) => pDist(coord, j) < pDist(coord, best) ? j : best);
}

function pDist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function eq(a, b) {
  return Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2;
}

function pointsToPath(pts) {
  if (!pts.length) return '';
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) d += ` L${pts[i].x},${pts[i].y}`;
  return d;
}

function estimateLen(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += pDist(pts[i - 1], pts[i]);
  return l;
}

function buildDirections(fromId, toId) {
  const fc   = MAP_COORDS[fromId];
  const tc   = MAP_COORDS[toId];
  const dx   = tc.x - fc.x;
  const dy   = tc.y - fc.y;
  const hDir = dx > 0 ? 'east' : 'west';
  const vDir = dy > 0 ? 'south' : 'north';
  const horiz = Math.abs(dx) > Math.abs(dy);
  const fl   = BLDG_LABELS[fromId];
  const tl   = BLDG_LABELS[toId];

  let s = `<br>1. Exit ${escHtml(fl)}`;
  if (horiz) {
    s += `<br>2. Head ${hDir} along the main road`;
    if (Math.abs(dy) > 60) s += `<br>3. Turn at the junction heading ${vDir}`;
  } else {
    s += `<br>2. Head ${vDir} along the main road`;
    if (Math.abs(dx) > 60) s += `<br>3. Turn at the junction heading ${hDir}`;
  }
  s += `<br>${Math.abs(dx) > 60 && Math.abs(dy) > 60 ? '4' : '3'}. ${escHtml(tl)} will be on your ${dx > 0 ? 'right' : 'left'}`;
  return s;
}