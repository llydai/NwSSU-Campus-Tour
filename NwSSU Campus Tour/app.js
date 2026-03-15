// ══════════════════════════════════════════════
// NWSSU Campus Tour — App Logic
// Corrected MAP_COORDS to match real campus layout
// ══════════════════════════════════════════════

// ─── MAP COORDINATES (SVG viewBox 1000×750) ───
// These match the updated % hotspot positions in index.html
// left% × 10 = x,  top% × 7.5 = y
const MAP_COORDS = {
  gate:           { x:365, y:615 },   // 36.5%, 82%
  cat:            { x:585, y:218 },   // 58.5%, 29%
  ccjs:           { x: 95, y:323 },   //  9.5%, 43%
  coed:           { x: 55, y:368 },   //  5.5%, 49%
  ccis:           { x:245, y:465 },   // 24.5%, 62%
  con:            { x:375, y:473 },   // 37.5%, 63%
  com:            { x:815, y:480 },   // 81.5%, 64%
  cea:            { x:645, y:563 },   // 64.5%, 75%
  president:      { x:635, y:285 },   // 63.5%, 38%
  registrar:      { x:735, y:248 },   // 73.5%, 33%
  cashier:        { x:665, y:360 },   // 66.5%, 48%
  alumni:         { x:265, y:180 },   // 26.5%, 24%
  canteen:        { x:465, y:488 },   // 46.5%, 65%
  sociocultural:  { x:545, y:503 },   // 54.5%, 67%
  studentcouncil: { x:625, y:510 },   // 62.5%, 68%
  library:        { x:625, y:450 },   // 62.5%, 60%
  hotel:          { x:765, y:458 },   // 76.5%, 61%
  sports:         { x:345, y:323 },   // 34.5%, 43%
};

// Road junctions matching the real campus road network
// Main Campus Road runs clockwise around the athletic field
const J = {
  GATE_ENTRY: { x:365, y:615 },   // main gate entry from Rueda Extension
  ROAD_SW:    { x:300, y:500 },   // campus road bottom-left (near CCIS)
  ROAD_S:     { x:490, y:510 },   // campus road south-centre (near canteen cluster)
  ROAD_SE:    { x:650, y:440 },   // campus road east side (by cashier/lib/aux)
  ROAD_E:     { x:760, y:360 },   // right corridor (hotel/com side, along Miagara Rd)
  ROAD_NE:    { x:700, y:230 },   // top-right (CAT/flagpole area, Miagara Rd upper)
  ROAD_N:     { x:420, y:210 },   // top passage (alumni / upper Campus Rd)
  ROAD_NW:    { x:130, y:310 },   // left side (CCJS/COED, along Campus Rd / Umbria St)
  ROAD_FIELD: { x:345, y:323 },   // through/around the sports field
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
  gate:'Main Gate', cat:'CAT Building', ccis:'CCIS Building',
  library:'Library', coed:'COED Building', cea:'CEA Building',
  con:'CON Building', com:'COM Building', president:"Admin / President's Office",
  ccjs:'CCJS Building', registrar:"Registrar's Office", cashier:"Cashier's Office",
  alumni:'Alumni Building', sociocultural:'Socio-Cultural Building',
  studentcouncil:'Student Council Building', hotel:'NWSSU Hotel & Restaurant',
  canteen:'Canteen', sports:'Sports Complex',
};

// ─── STATE ───
let currentPage='home', drawerOpen=false, currentScale=1, activeBuilding=null;
const MAP_MIN=0.5, MAP_MAX=2;

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initSplash(); initNavbar(); initDrawerLinks();
  initGlobalSearch(); populateBuildings();
  populateDepartments(); populateOffices(); populateOrgs();
  initMapTouch(); createDetailScreen(); createLightbox();
});

function initSplash() {
  setTimeout(() => document.getElementById('splash')?.classList.add('gone'), 2500);
}

function initNavbar() {
  document.querySelectorAll('.nl').forEach(l =>
    l.addEventListener('click', e => { e.preventDefault(); navigateTo(l.dataset.page); })
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

function initDrawerLinks() {
  document.querySelectorAll('.dl').forEach(l =>
    l.addEventListener('click', e => { e.preventDefault(); navigateTo(l.dataset.page); closeDrawer(); })
  );
}

function openDrawer()  { drawerOpen=true;  document.getElementById('drawer')?.classList.add('open'); document.getElementById('drawerBg')?.classList.add('show'); document.getElementById('hamburger')?.classList.add('open'); }
function closeDrawer() { drawerOpen=false; document.getElementById('drawer')?.classList.remove('open'); document.getElementById('drawerBg')?.classList.remove('show'); document.getElementById('hamburger')?.classList.remove('open'); }

function initGlobalSearch() {
  const ds = document.querySelector('.drawer-search-row input');
  if (ds) ds.addEventListener('input', e => doSearch(e.target.value));
}

function doSearch(query) {
  const q = (query||'').trim().toLowerCase();
  const panel = document.getElementById('searchPanel');
  if (!panel) return;
  if (!q) { panel.classList.remove('show'); return; }
  const results = SEARCH_INDEX.filter(i => i.name.toLowerCase().includes(q)||(i.type||'').toLowerCase().includes(q)).slice(0,8);
  if (!results.length) {
    panel.innerHTML = `<div class="sp-head">No results for "${escHtml(query)}"</div>`;
  } else {
    panel.innerHTML = `<div class="sp-head">Results for "${escHtml(query)}"</div>` +
      results.map(r => `<div class="sp-item" onclick="runSearchAction(${SEARCH_INDEX.indexOf(r)})">
        <div class="sp-ico">${r.icon}</div>
        <div><div class="sp-name">${r.name}</div><div class="sp-type">${r.type}</div></div>
      </div>`).join('');
  }
  panel.classList.add('show');
}

function runSearchAction(idx) {
  SEARCH_INDEX[idx]?.action?.();
  document.getElementById('searchPanel')?.classList.remove('show');
}

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nl').forEach(l=>l.classList.remove('active'));
  document.getElementById('page-'+page)?.classList.add('active');
  document.querySelector(`.nl[data-page="${page}"]`)?.classList.add('active');
  currentPage=page;
  window.scrollTo({top:0,behavior:'smooth'});
}

// ══════════════════════════════════════════════
// IMAGE LIGHTBOX
// ══════════════════════════════════════════════

function createLightbox() {
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop" onclick="closeLightbox()"></div>
    <div class="lb-box">
      <button class="lb-close" onclick="closeLightbox()">✕</button>
      <div class="lb-img-wrap">
        <img id="lbImg" src="" alt="" />
      </div>
      <div class="lb-caption" id="lbCaption"></div>
    </div>
  `;
  document.body.appendChild(lb);
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeLightbox(); });
}

function openLightbox(src, caption) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCaption');
  if (!lb || !img) return;
  img.src = src;
  img.alt = caption || '';
  if (cap) cap.textContent = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox')?.classList.remove('open');
  if (!document.getElementById('detailScreen')?.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

// ══════════════════════════════════════════════
// IMAGE HELPER
// ══════════════════════════════════════════════

function buildPhotoHtml(photo, emoji, color, name, context='hero') {
  const sizes = { hero:'ds-photo-hero', card:'ds-photo-card', dept:'ds-photo-dept' };
  const cls   = sizes[context] || 'ds-photo-hero';

  if (photo) {
    return `
      <div class="${cls} has-img" onclick="openLightbox('${escAttr(photo)}','${escAttr(name)}')" title="Click to enlarge">
        <img src="${escAttr(photo)}" alt="${escAttr(name)}" onerror="this.parentElement.classList.remove('has-img');this.parentElement.innerHTML=buildPhotoPlaceholderInner('${escAttr(emoji)}','${escAttr(color)}','${escAttr(name)}');" />
        <div class="photo-zoom-hint">🔍 Click to enlarge</div>
      </div>`;
  } else {
    return `
      <div class="${cls} is-placeholder" style="background:linear-gradient(135deg,${color}44,${color}22)">
        ${buildPhotoPlaceholderInner(emoji, color, name)}
        <div class="photo-no-img-hint">📷 No photo yet</div>
      </div>`;
  }
}

function buildPhotoPlaceholderInner(emoji, color, name) {
  return `
    <div class="ph-inner">
      <span class="ph-emoji">${emoji}</span>
      <span class="ph-label" style="color:${color}">${escHtml(name)}</span>
    </div>`;
}

function buildCardThumb(b) {
  if (b.photo) {
    return `
      <div class="bldg-thumb has-img" onclick="event.stopPropagation();openLightbox('${escAttr(b.photo)}','${escAttr(b.name)}')" title="Click to enlarge photo">
        <img src="${escAttr(b.photo)}" alt="${escAttr(b.name)}" loading="lazy"
          onerror="this.parentElement.classList.remove('has-img');this.parentElement.innerHTML='<span style=font-size:52px>${b.emoji}</span>';this.parentElement.style.background='linear-gradient(135deg,${b.color}40,${b.color}70)';" />
        <div class="thumb-zoom">🔍</div>
      </div>`;
  }
  return `<div class="bldg-thumb" style="background:linear-gradient(135deg,${b.color}40,${b.color}70)"><span style="font-size:52px">${b.emoji}</span></div>`;
}

// ══════════════════════════════════════════════
// FULL-SCREEN DETAIL PANEL
// ══════════════════════════════════════════════

function createDetailScreen() {
  const el = document.createElement('div');
  el.className = 'detail-screen';
  el.id = 'detailScreen';
  el.innerHTML = '<div id="detailScreenInner"></div>';
  document.body.appendChild(el);
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeDetailScreen(); });
}

function openDetailScreen(html) {
  const screen = document.getElementById('detailScreen');
  const inner  = document.getElementById('detailScreenInner');
  if (!screen||!inner) return;
  inner.innerHTML = html;
  screen.classList.add('open');
  screen.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeDetailScreen() {
  document.getElementById('detailScreen')?.classList.remove('open');
  if (!document.getElementById('lightbox')?.classList.contains('open'))
    document.body.style.overflow = '';
}

// ─── BUILDING DETAIL ───
function openBuilding(id) {
  const b = BUILDINGS.find(x => x.id === id);
  if (!b) return;
  const dept = DEPARTMENTS.find(d => d.id === id || d.id === b.dept);

  const officesList  = (b.offices||[]).map(o=>`<li>${escHtml(o)}</li>`).join('');
  const programsList = (b.programs||dept?.programs||[]).map(p=>`<li>${escHtml(p)}</li>`).join('');
  const facultySec   = dept?.faculty?.length   ? `<div class="ds-section"><div class="ds-section-title">👨‍🏫 Faculty</div><ul class="ds-list">${dept.faculty.map(f=>`<li>${escHtml(f)}</li>`).join('')}</ul></div>` : '';
  const officersSec  = dept?.officers?.length  ? `<div class="ds-section"><div class="ds-section-title">⭐ Student Officers</div><ul class="ds-list">${dept.officers.map(o=>`<li>${escHtml(o)}</li>`).join('')}</ul></div>` : '';
  const orgsSec      = dept?.organizations?.length ? `<div class="ds-section"><div class="ds-section-title">🏆 Organizations</div><ul class="ds-list">${dept.organizations.map(o=>`<li>${escHtml(o)}</li>`).join('')}</ul></div>` : '';

  const statsHtml = [
    b.programs?.length  ? `<div class="ds-stat"><span class="ds-stat-val">${b.programs.length}</span><span class="ds-stat-lab">Programs</span></div>` : '',
    b.offices?.length   ? `<div class="ds-stat"><span class="ds-stat-val">${b.offices.length}</span><span class="ds-stat-lab">Offices</span></div>` : '',
    dept?.faculty?.length ? `<div class="ds-stat"><span class="ds-stat-val">${dept.faculty.length}</span><span class="ds-stat-lab">Faculty</span></div>` : '',
  ].join('');

  const photoSrc = b.photo || dept?.photo || '';

  const html = `
    <div class="ds-hero" style="background:${b.color}22">
      <div class="ds-hero-bg" style="background:linear-gradient(160deg,${b.color}55,${b.color}11)"></div>
      <div class="ds-hero-pattern"></div>
      <div class="ds-hero-emoji">${b.emoji}</div>
      <div class="ds-hero-content">
        <button class="ds-back-btn" onclick="closeDetailScreen()">← Back</button>
        <div class="ds-tag">${capitalize(b.type||'facility')} Building</div>
        <h1 class="ds-title">${escHtml(b.name)}</h1>
        <div class="ds-meta">
          <div class="ds-meta-item">📍 ${escHtml(b.location)}</div>
          ${b.hours ? `<div class="ds-meta-item">🕐 ${escHtml(b.hours)}</div>` : ''}
          ${b.abbr ? `<div class="ds-meta-item">🏷️ ${escHtml(b.abbr)}</div>` : ''}
        </div>
        ${statsHtml ? `<div class="ds-stats">${statsHtml}</div>` : ''}
      </div>
    </div>

    <div class="ds-body">
      <div class="ds-photo-row">
        ${buildPhotoHtml(photoSrc, b.emoji, b.color, b.name, 'hero')}
        <div class="ds-photo-note">
          ${photoSrc
            ? `<p>📷 Tap or click the photo to view full-size.</p>`
            : `<p>📷 <strong>No photo uploaded yet.</strong><br>
               To add one: drop the image in an <code>images/</code> folder next to <code>index.html</code>,
               then set <code>photo: 'images/${b.id}.jpg'</code> in <code>data.js</code>.</p>`
          }
        </div>
      </div>

      <p class="ds-desc">${escHtml(b.desc)}</p>

      <div class="ds-sections">
        ${officesList  ? `<div class="ds-section"><div class="ds-section-title">🏢 Offices Inside</div><ul class="ds-list">${officesList}</ul></div>` : ''}
        ${programsList ? `<div class="ds-section"><div class="ds-section-title">📚 Programs Offered</div><ul class="ds-list">${programsList}</ul></div>` : ''}
        ${facultySec}${officersSec}${orgsSec}
      </div>

      <div class="ds-contact-card">
        <div class="ds-contact-icon">${b.emoji}</div>
        <div class="ds-contact-info">
          <h4>${escHtml(b.name)}</h4>
          <p>📍 ${escHtml(b.location)}${b.hours ? ' &nbsp;·&nbsp; 🕐 ' + escHtml(b.hours) : ''}</p>
        </div>
      </div>

      <div class="ds-actions">
        <button class="btn-primary" onclick="closeDetailScreen();selectMapBuilding('${b.id}');navigateTo('map')">🗺️ View on Map</button>
        ${b.dept ? `<button class="btn-ghost" onclick="closeDetailScreen();openDept('${b.dept}')">🎓 Department Details</button>` : ''}
        <button class="btn-ghost" onclick="closeDetailScreen()">← Go Back</button>
      </div>
    </div>
  `;
  openDetailScreen(html);
}

// ─── DEPARTMENT DETAIL ───
function openDept(id) {
  const d = DEPARTMENTS.find(x => x.id === id);
  if (!d) {
    navigateTo('departments');
    setTimeout(() => {
      const card = document.getElementById('dept-'+id);
      if (card) { card.classList.add('open'); card.scrollIntoView({behavior:'smooth',block:'start'}); }
    }, 300);
    return;
  }

  const building = BUILDINGS.find(b => b.id===id || b.dept===id);
  const emoji    = building?.emoji || '🎓';

  const programsList = (d.programs||[]).map(p=>`<li>${escHtml(p)}</li>`).join('');
  const facultyList  = (d.faculty ||[]).map(f=>`<li>${escHtml(f)}</li>`).join('');
  const officersList = (d.officers||[]).map(o=>`<li>${escHtml(o)}</li>`).join('');
  const orgsList     = (d.organizations||[]).map(o=>`<li>${escHtml(o)}</li>`).join('');

  const photoSrc = d.photo || building?.photo || '';
  const tagColor = d.color === '#c8a84b' ? '#c8a84b' : d.color;

  const html = `
    <div class="ds-hero" style="min-height:260px">
      <div class="ds-hero-bg" style="background:linear-gradient(160deg,${d.color}55,${d.color}11)"></div>
      <div class="ds-hero-pattern"></div>
      <div class="ds-hero-emoji">${emoji}</div>
      <div class="ds-hero-content">
        <button class="ds-back-btn" onclick="closeDetailScreen()">← Back</button>
        <div class="ds-tag" style="background:${d.color}22;border-color:${d.color}55;color:${tagColor}">${escHtml(d.abbr)}</div>
        <h1 class="ds-title">${escHtml(d.name)}</h1>
        <div class="ds-meta">
          <div class="ds-meta-item">📚 ${d.programs.length} Program${d.programs.length>1?'s':''}</div>
          <div class="ds-meta-item">👨‍🏫 ${d.faculty.length} Faculty</div>
          <div class="ds-meta-item">🏆 ${d.organizations.length} Org${d.organizations.length>1?'s':''}</div>
        </div>
        <div class="ds-stats">
          <div class="ds-stat"><span class="ds-stat-val">${d.programs.length}</span><span class="ds-stat-lab">Programs</span></div>
          <div class="ds-stat"><span class="ds-stat-val">${d.faculty.length}</span><span class="ds-stat-lab">Faculty</span></div>
          <div class="ds-stat"><span class="ds-stat-val">${d.officers.length}</span><span class="ds-stat-lab">Officers</span></div>
          <div class="ds-stat"><span class="ds-stat-val">${d.organizations.length}</span><span class="ds-stat-lab">Orgs</span></div>
        </div>
      </div>
    </div>

    <div class="ds-body">
      <div class="ds-photo-row">
        ${buildPhotoHtml(photoSrc, emoji, d.color, building?.name||d.name, 'hero')}
        <div class="ds-photo-note">
          ${photoSrc
            ? `<p>📷 Tap or click the photo to view full-size.</p>`
            : `<p>📷 <strong>No photo uploaded yet.</strong><br>
               Drop the image in <code>images/</code> folder and set
               <code>photo: 'images/${d.id}.jpg'</code> in <code>data.js</code>.</p>`
          }
        </div>
      </div>

      ${building?.desc ? `<p class="ds-desc">${escHtml(building.desc)}</p>` : ''}

      <div class="ds-sections">
        ${programsList ? `<div class="ds-section"><div class="ds-section-title">📚 Programs Offered</div><ul class="ds-list">${programsList}</ul></div>` : ''}
        ${facultyList  ? `<div class="ds-section"><div class="ds-section-title">👨‍🏫 Faculty Members</div><ul class="ds-list">${facultyList}</ul></div>` : ''}
        ${officersList ? `<div class="ds-section"><div class="ds-section-title">⭐ Student Officers</div><ul class="ds-list">${officersList}</ul></div>` : ''}
        ${orgsList     ? `<div class="ds-section"><div class="ds-section-title">🏆 Student Organizations</div><ul class="ds-list">${orgsList}</ul></div>` : ''}
      </div>

      ${building ? `
      <div class="ds-contact-card">
        <div class="ds-contact-icon">${building.emoji}</div>
        <div class="ds-contact-info">
          <h4>${escHtml(building.name)}</h4>
          <p>📍 ${escHtml(building.location)}${building.hours?' &nbsp;·&nbsp; 🕐 '+escHtml(building.hours):''}</p>
        </div>
      </div>` : ''}

      <div class="ds-actions">
        ${building ? `<button class="btn-primary" onclick="closeDetailScreen();selectMapBuilding('${building.id}');navigateTo('map')">🗺️ View Building on Map</button>` : ''}
        ${building ? `<button class="btn-ghost" onclick="closeDetailScreen();openBuilding('${building.id}')">🏛️ Building Details</button>` : ''}
        <button class="btn-ghost" onclick="closeDetailScreen()">← Go Back</button>
      </div>
    </div>
  `;
  openDetailScreen(html);
}

// ══════════════════════════════════════════════
// POPULATE PAGES
// ══════════════════════════════════════════════

function populateBuildings() {
  const grid = document.getElementById('buildingsGrid');
  if (!grid) return;
  grid.innerHTML = BUILDINGS.map(b => `
    <div class="bldg-card" data-type="${b.type}" onclick="openBuilding('${b.id}')">
      ${buildCardThumb(b)}
      <div class="bldg-info">
        <h3>${escHtml(b.name)}</h3>
        <p>${escHtml(b.desc.slice(0,90))}…</p>
        <span class="bldg-tag">${capitalize(b.type)} · ${escHtml(b.location)}</span>
      </div>
    </div>`).join('');
}

function populateDepartments() {
  const list = document.getElementById('deptList');
  if (!list) return;
  list.innerHTML = DEPARTMENTS.map(d => {
    const building = BUILDINGS.find(b => b.id === d.id || b.dept === d.id);
    const emoji    = building?.emoji || '🎓';
    const photoSrc = d.photo || building?.photo || '';
    return `
    <div class="dept-card" id="dept-${d.id}" onclick="openDept('${d.id}')">
      <div class="dept-hd">
        <div class="dept-thumb-sm ${photoSrc ? 'has-img' : ''}" style="background:${d.color}33">
          ${photoSrc
            ? `<img src="${escAttr(photoSrc)}" alt="${escAttr(d.name)}" loading="lazy" onerror="this.parentElement.classList.remove('has-img');this.parentElement.innerHTML='<span>${emoji}</span>';" />`
            : `<span>${emoji}</span>`}
        </div>
        <div class="dh-badge" style="background:${d.color}">${escHtml(d.abbr)}</div>
        <div class="dh-text">
          <h3>${escHtml(d.name)}</h3>
          <p>${d.programs.length} programs · ${d.faculty.length} faculty · ${d.organizations.length} org${d.organizations.length>1?'s':''}</p>
        </div>
        <span class="dh-chevron">›</span>
      </div>
    </div>`; }).join('');
}

function populateOffices() {
  const grid = document.getElementById('officesGrid');
  if (!grid) return;
  grid.innerHTML = OFFICES.map((o,i) => `
    <div class="off-card" onclick="showOfficeModal(${i})">
      <div class="off-ico">${o.icon}</div>
      <div class="off-name">${escHtml(o.name)}</div>
      <div class="off-loc">📍 ${escHtml(o.location)}</div>
      <div class="off-hrs">⏰ ${escHtml(o.hours)}</div>
    </div>`).join('');
}

function populateOrgs() {
  const grid = document.getElementById('orgsGrid');
  if (!grid) return;
  grid.innerHTML = ORGANIZATIONS.map((o,i) => `
    <div class="org-card" onclick="showOrgModal(${i})">
      <div class="org-abbr-tag">${escHtml(o.abbr)}</div>
      <div class="org-name-txt">${escHtml(o.name)}</div>
      <div class="org-college-tag">${escHtml(o.college)}</div>
      <div class="org-officers-txt">
        <strong>President:</strong> ${escHtml(o.president)}<br>
        <strong>VP:</strong> ${escHtml(o.vp)}<br>
        <strong>Secretary:</strong> ${escHtml(o.secretary)}
      </div>
    </div>`).join('');
}

function filterBuildings(type, btn) {
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.bldg-card').forEach(card => {
    card.style.display = (type==='all'||card.dataset.type===type) ? '' : 'none';
  });
}

// ══════════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════════
function showOfficeModal(i) {
  const o = OFFICES[i]; if (!o) return;
  document.getElementById('modalContent').innerHTML = `
    <div class="m-banner" style="background:rgba(42,102,36,0.2);font-size:64px">${o.icon}</div>
    <div class="m-title">${escHtml(o.name)}</div>
    <div class="m-sub">📍 ${escHtml(o.location)} · ⏰ ${escHtml(o.hours)}</div>
    <div class="m-desc">${escHtml(o.desc)}</div>`;
  openModal();
}

function showOrgModal(i) {
  const o = ORGANIZATIONS[i]; if (!o) return;
  document.getElementById('modalContent').innerHTML = `
    <div class="m-banner" style="background:rgba(42,102,36,0.2);font-size:64px">👥</div>
    <div class="m-title">${escHtml(o.name)} <span style="font-size:14px;opacity:.4">(${escHtml(o.abbr)})</span></div>
    <div class="m-sub">🏫 ${escHtml(o.college)}</div>
    <div class="m-grid"><div class="m-sec"><h4>👑 Officers</h4><ul>
      <li>President: ${escHtml(o.president)}</li>
      <li>Vice President: ${escHtml(o.vp)}</li>
      <li>Secretary: ${escHtml(o.secretary)}</li>
    </ul></div></div>`;
  openModal();
}

function openModal()  { document.getElementById('modalOverlay')?.classList.add('open'); }
function closeModal() { document.getElementById('modalOverlay')?.classList.remove('open'); }

// ══════════════════════════════════════════════
// MAP
// ══════════════════════════════════════════════
function selectMapBuilding(id) {
  const b = BUILDINGS.find(x => x.id===id);
  if (!b) return;
  document.querySelectorAll('.mw-bldg,.mw-sports').forEach(el=>el.classList.remove('selected'));
  document.getElementById('mb-'+id)?.classList.add('selected');
  activeBuilding = id;
  const inner = document.getElementById('popupInner');
  if (inner) {
    inner.innerHTML = `
      <div class="popup-name">${escHtml(b.name)}</div>
      <div class="popup-loc">📍 ${escHtml(b.location)}</div>
      <div class="popup-desc">${escHtml(b.desc.slice(0,110))}…</div>
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
  document.querySelectorAll('.mw-bldg,.mw-sports').forEach(el=>el.classList.remove('selected'));
}

function setNavTo(id) {
  const toSel = document.getElementById('toLocation');
  if (toSel) toSel.value = id;
  showToast('Destination set: '+(BLDG_LABELS[id]||id));
}

function toggleSidebar() {
  const sb = document.getElementById('mapSidebar');
  if (!sb) return;
  window.innerWidth<768 ? sb.classList.toggle('open') : sb.classList.toggle('collapsed');
}

function filterMapList(val) {
  document.querySelectorAll('.msb-item').forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}

function applyMapScale() {
  const w = document.getElementById('mapWorld');
  if (w) w.style.transform = `scale(${currentScale})`;
}
function mapZoomIn()  { currentScale = Math.min(currentScale+0.18, MAP_MAX); applyMapScale(); }
function mapZoomOut() { currentScale = Math.max(currentScale-0.18, MAP_MIN); applyMapScale(); }
function mapReset()   { currentScale = 1; applyMapScale(); clearRoute(); }

function initMapTouch() {
  const vp = document.getElementById('mapViewport');
  if (!vp) return;
  let startDist=0, startScale=1;
  vp.addEventListener('touchstart', e => { if(e.touches.length===2){ startDist=getTouchDist(e); startScale=currentScale; } }, {passive:true});
  vp.addEventListener('touchmove',  e => { if(e.touches.length===2){ currentScale=Math.max(MAP_MIN,Math.min(MAP_MAX,startScale*(getTouchDist(e)/startDist))); applyMapScale(); } }, {passive:true});
}
function getTouchDist(e) { const dx=e.touches[0].clientX-e.touches[1].clientX, dy=e.touches[0].clientY-e.touches[1].clientY; return Math.sqrt(dx*dx+dy*dy); }

// ══════════════════════════════════════════════
// ROUTING
// ══════════════════════════════════════════════
function simulateNavigation() {
  const fromId = document.getElementById('fromLocation')?.value;
  const toId   = document.getElementById('toLocation')?.value;
  if (!fromId||!toId)        { showToast('Please select both From and To locations.'); return; }
  if (fromId===toId)         { showToast('From and To cannot be the same.'); return; }
  const fromC = MAP_COORDS[fromId], toC = MAP_COORDS[toId];
  if (!fromC||!toC)          { showToast('Coordinates not found.'); return; }
  const pts = buildRoutePath(fromId, toId, fromC, toC);
  const d   = pointsToPath(pts);
  const rp  = document.getElementById('routePath');
  if (!rp) return;
  rp.setAttribute('d', d); rp.style.opacity='1';
  const len = estimateLen(pts);
  rp.style.strokeDasharray=`22 12`; rp.style.strokeDashoffset=len; rp.style.transition='none';
  requestAnimationFrame(() => { rp.style.transition=`stroke-dashoffset ${Math.max(0.8,len/280)}s linear`; rp.style.strokeDashoffset='0'; });
  document.getElementById('clearRouteBtn').style.display='flex';
  const distM=Math.round(len*0.65), mins=Math.max(1,Math.round(distM/75));
  const fl=BLDG_LABELS[fromId]||fromId, tl=BLDG_LABELS[toId]||toId;
  document.getElementById('navResult').innerHTML=`
    <div class="nav-result-box">
      <strong>🧭 Route Found</strong>
      <div style="margin-top:6px;font-size:11px;color:var(--muted)"><strong>From:</strong> ${escHtml(fl)}<br><strong>To:</strong> ${escHtml(tl)}</div>
      <div style="margin-top:8px;font-size:12px;color:var(--text2)">📏 ~${distM}m &nbsp; ⏱️ ~${mins} min walk</div>
      <div class="nav-steps">${buildDirections(fromId,toId)}</div>
    </div>`;
  document.querySelectorAll('.mw-bldg,.mw-sports').forEach(el=>el.classList.remove('selected'));
  document.getElementById('mb-'+fromId)?.classList.add('selected');
  document.getElementById('mb-'+toId)?.classList.add('selected');
  showToast(`${fl} → ${tl}`);
}

function clearRoute() {
  const rp = document.getElementById('routePath');
  if (rp) { rp.style.opacity='0'; rp.setAttribute('d',''); }
  document.getElementById('clearRouteBtn').style.display='none';
  document.getElementById('navResult').innerHTML='';
  document.querySelectorAll('.mw-bldg,.mw-sports').forEach(el=>el.classList.remove('selected'));
}

function buildRoutePath(fromId, toId, fromC, toC) {
  const pts=[fromC], fromJs=BUILDING_JUNCTION[fromId]||[fromC], toJs=BUILDING_JUNCTION[toId]||[toC];
  const fromJ=closest(fromC,fromJs), toJ=closest(toC,toJs);
  if (!eq(fromC,fromJ)) pts.push(fromJ);
  if (!eq(fromJ,toJ)) {
    if (Math.abs(toJ.x-fromJ.x)>=Math.abs(toJ.y-fromJ.y)) pts.push({x:toJ.x,y:fromJ.y});
    else pts.push({x:fromJ.x,y:toJ.y});
    pts.push(toJ);
  }
  if (!eq(toJ,toC)) pts.push(toC);
  return pts;
}
function closest(coord,junctions) { return junctions.reduce((best,j)=>pDist(coord,j)<pDist(coord,best)?j:best); }
function pDist(a,b) { return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2); }
function eq(a,b) { return Math.abs(a.x-b.x)<2&&Math.abs(a.y-b.y)<2; }
function pointsToPath(pts) { if(!pts.length)return''; let d=`M${pts[0].x},${pts[0].y}`; for(let i=1;i<pts.length;i++) d+=` L${pts[i].x},${pts[i].y}`; return d; }
function estimateLen(pts) { let l=0; for(let i=1;i<pts.length;i++) l+=pDist(pts[i-1],pts[i]); return l; }

function buildDirections(fromId, toId) {
  const fc=MAP_COORDS[fromId], tc=MAP_COORDS[toId];
  const dx=tc.x-fc.x, dy=tc.y-fc.y;
  const hDir=dx>0?'east':'west', vDir=dy>0?'south':'north';
  const horiz=Math.abs(dx)>Math.abs(dy);
  const fl=BLDG_LABELS[fromId], tl=BLDG_LABELS[toId];
  let s=`<br>1. Exit ${escHtml(fl)}`;
  if(horiz) { s+=`<br>2. Head ${hDir} along the main road`; if(Math.abs(dy)>60) s+=`<br>3. Turn at the junction heading ${vDir}`; }
  else      { s+=`<br>2. Head ${vDir} along the main road`; if(Math.abs(dx)>60) s+=`<br>3. Turn at the junction heading ${hDir}`; }
  s+=`<br>${Math.abs(dx)>60&&Math.abs(dy)>60?'4':'3'}. ${escHtml(tl)} will be on your ${dx>0?'right':'left'}`;
  return s;
}

// ══════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),3000);
}
function capitalize(s) { return s?s.charAt(0).toUpperCase()+s.slice(1):''; }
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escAttr(s) { return String(s).replace(/'/g,'&#39;').replace(/"/g,'&quot;'); }