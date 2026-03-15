// ══════════════════════════════════════════════
// PAGE POPULATION
// File: js/app-populate.js
//
// Responsibilities:
//   - populateBuildings()   — renders #buildingsGrid  from BUILDINGS[]
//   - populateDepartments() — renders #deptList       from DEPARTMENTS[]
//   - populateOffices()     — renders #officesGrid    from OFFICES[]
//   - populateOrgs()        — renders #orgsGrid       from ORGANIZATIONS[]
//   - filterBuildings()     — category filter for building grid
//
// All data lives in js/data.js.
// Card click → openBuilding() / openDept() in js/app-detail.js
// Modal click → showOfficeModal() / showOrgModal() in js/app-ui.js
// ══════════════════════════════════════════════

// ── Buildings Grid ──────────────────────────
function populateBuildings() {
  const grid = document.getElementById('buildingsGrid');
  if (!grid) return;

  grid.innerHTML = BUILDINGS.map(b => `
    <div class="bldg-card" data-type="${b.type}" onclick="openBuilding('${b.id}')">
      ${buildCardThumb(b)}
      <div class="bldg-info">
        <h3>${escHtml(b.name)}</h3>
        <p>${escHtml(b.desc.slice(0, 90))}…</p>
        <span class="bldg-tag">${capitalize(b.type)} · ${escHtml(b.location)}</span>
      </div>
    </div>`
  ).join('');
}

// ── Departments List ─────────────────────────
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
            ? `<img src="${escAttr(photoSrc)}" alt="${escAttr(d.name)}" loading="lazy"
                    onerror="this.parentElement.classList.remove('has-img');this.parentElement.innerHTML='<span>${emoji}</span>';" />`
            : `<span>${emoji}</span>`
          }
        </div>
        <div class="dh-badge" style="background:${d.color}">${escHtml(d.abbr)}</div>
        <div class="dh-text">
          <h3>${escHtml(d.name)}</h3>
          <p>${d.programs.length} programs · ${d.faculty.length} faculty · ${d.organizations.length} org${d.organizations.length > 1 ? 's' : ''}</p>
        </div>
        <span class="dh-chevron">›</span>
      </div>
    </div>`;
  }).join('');
}

// ── Offices Grid ─────────────────────────────
function populateOffices() {
  const grid = document.getElementById('officesGrid');
  if (!grid) return;

  grid.innerHTML = OFFICES.map((o, i) => `
    <div class="off-card" onclick="showOfficeModal(${i})">
      <div class="off-ico">${o.icon}</div>
      <div class="off-name">${escHtml(o.name)}</div>
      <div class="off-loc">📍 ${escHtml(o.location)}</div>
      <div class="off-hrs">⏰ ${escHtml(o.hours)}</div>
    </div>`
  ).join('');
}

// ── Organizations Grid ───────────────────────
function populateOrgs() {
  const grid = document.getElementById('orgsGrid');
  if (!grid) return;

  grid.innerHTML = ORGANIZATIONS.map((o, i) => `
    <div class="org-card" onclick="showOrgModal(${i})">
      <div class="org-abbr-tag">${escHtml(o.abbr)}</div>
      <div class="org-name-txt">${escHtml(o.name)}</div>
      <div class="org-college-tag">${escHtml(o.college)}</div>
      <div class="org-officers-txt">
        <strong>President:</strong> ${escHtml(o.president)}<br>
        <strong>VP:</strong> ${escHtml(o.vp)}<br>
        <strong>Secretary:</strong> ${escHtml(o.secretary)}
      </div>
    </div>`
  ).join('');
}

// ── Buildings Filter ─────────────────────────
// Called by the filter buttons on the Buildings page.
function filterBuildings(type, btn) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.bldg-card').forEach(card => {
    card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
  });
}
