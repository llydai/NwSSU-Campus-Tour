// ══════════════════════════════════════════════
// DETAIL SCREEN
// File: js/app-detail.js
//
// Responsibilities:
//   - createDetailScreen() — creates the full-screen slide-up panel
//   - openDetailScreen()   — injects HTML and opens the panel
//   - closeDetailScreen()  — closes the panel
//   - openBuilding(id)     — builds and opens a building detail view
//   - openDept(id)         — builds and opens a department detail view
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// PANEL LIFECYCLE
// ══════════════════════════════════════════════

function createDetailScreen() {
  const el = document.createElement('div');
  el.className = 'detail-screen';
  el.id        = 'detailScreen';
  el.innerHTML = '<div id="detailScreenInner"></div>';
  document.body.appendChild(el);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetailScreen(); });
}

function openDetailScreen(html) {
  const screen = document.getElementById('detailScreen');
  const inner  = document.getElementById('detailScreenInner');
  if (!screen || !inner) return;
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

// ══════════════════════════════════════════════
// BUILDING DETAIL
// Opens a full-screen detail view for a building.
// Data source: BUILDINGS[] in js/data.js
// ══════════════════════════════════════════════

function openBuilding(id) {
  const b = BUILDINGS.find(x => x.id === id);
  if (!b) return;

  const dept = DEPARTMENTS.find(d => d.id === id || d.id === b.dept);

  const officesList  = (b.offices  || []).map(o => `<li>${escHtml(o)}</li>`).join('');
  const programsList = (b.programs || dept?.programs || []).map(p => `<li>${escHtml(p)}</li>`).join('');

  const facultySec  = dept?.faculty?.length
    ? `<div class="ds-section">
         <div class="ds-section-title">👨‍🏫 Faculty</div>
         <ul class="ds-list">${dept.faculty.map(f => `<li>${escHtml(f)}</li>`).join('')}</ul>
       </div>` : '';

  const officersSec = dept?.officers?.length
    ? `<div class="ds-section">
         <div class="ds-section-title">⭐ Student Officers</div>
         <ul class="ds-list">${dept.officers.map(o => `<li>${escHtml(o)}</li>`).join('')}</ul>
       </div>` : '';

  const orgsSec = dept?.organizations?.length
    ? `<div class="ds-section">
         <div class="ds-section-title">🏆 Organizations</div>
         <ul class="ds-list">${dept.organizations.map(o => `<li>${escHtml(o)}</li>`).join('')}</ul>
       </div>` : '';

  const statsHtml = [
    b.programs?.length    ? `<div class="ds-stat"><span class="ds-stat-val">${b.programs.length}</span><span class="ds-stat-lab">Programs</span></div>` : '',
    b.offices?.length     ? `<div class="ds-stat"><span class="ds-stat-val">${b.offices.length}</span><span class="ds-stat-lab">Offices</span></div>`   : '',
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
        <div class="ds-tag">${capitalize(b.type || 'facility')} Building</div>
        <h1 class="ds-title">${escHtml(b.name)}</h1>
        <div class="ds-meta">
          <div class="ds-meta-item">📍 ${escHtml(b.location)}</div>
          ${b.hours ? `<div class="ds-meta-item">🕐 ${escHtml(b.hours)}</div>` : ''}
          ${b.abbr  ? `<div class="ds-meta-item">🏷️ ${escHtml(b.abbr)}</div>`  : ''}
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
               Drop the image in <code>images/</code> folder and set
               <code>photo: 'images/${b.id}.jpg'</code> in <code>data.js</code>.</p>`
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

// ══════════════════════════════════════════════
// DEPARTMENT DETAIL
// Opens a full-screen detail view for a college/department.
// Data source: DEPARTMENTS[] in js/data.js
// ══════════════════════════════════════════════

function openDept(id) {
  const d = DEPARTMENTS.find(x => x.id === id);

  // If no department entry, fall back to the departments list page
  if (!d) {
    navigateTo('departments');
    setTimeout(() => {
      const card = document.getElementById('dept-' + id);
      if (card) {
        card.classList.add('open');
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
    return;
  }

  const building = BUILDINGS.find(b => b.id === id || b.dept === id);
  const emoji    = building?.emoji || '🎓';

  const programsList = (d.programs     || []).map(p => `<li>${escHtml(p)}</li>`).join('');
  const facultyList  = (d.faculty      || []).map(f => `<li>${escHtml(f)}</li>`).join('');
  const officersList = (d.officers     || []).map(o => `<li>${escHtml(o)}</li>`).join('');
  const orgsList     = (d.organizations|| []).map(o => `<li>${escHtml(o)}</li>`).join('');

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
          <div class="ds-meta-item">📚 ${d.programs.length} Program${d.programs.length > 1 ? 's' : ''}</div>
          <div class="ds-meta-item">👨‍🏫 ${d.faculty.length} Faculty</div>
          <div class="ds-meta-item">🏆 ${d.organizations.length} Org${d.organizations.length > 1 ? 's' : ''}</div>
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
        ${buildPhotoHtml(photoSrc, emoji, d.color, building?.name || d.name, 'hero')}
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
        ${programsList ? `<div class="ds-section"><div class="ds-section-title">📚 Programs Offered</div><ul class="ds-list">${programsList}</ul></div>`       : ''}
        ${facultyList  ? `<div class="ds-section"><div class="ds-section-title">👨‍🏫 Faculty Members</div><ul class="ds-list">${facultyList}</ul></div>`        : ''}
        ${officersList ? `<div class="ds-section"><div class="ds-section-title">⭐ Student Officers</div><ul class="ds-list">${officersList}</ul></div>`         : ''}
        ${orgsList     ? `<div class="ds-section"><div class="ds-section-title">🏆 Student Organizations</div><ul class="ds-list">${orgsList}</ul></div>`        : ''}
      </div>

      ${building ? `
      <div class="ds-contact-card">
        <div class="ds-contact-icon">${building.emoji}</div>
        <div class="ds-contact-info">
          <h4>${escHtml(building.name)}</h4>
          <p>📍 ${escHtml(building.location)}${building.hours ? ' &nbsp;·&nbsp; 🕐 ' + escHtml(building.hours) : ''}</p>
        </div>
      </div>` : ''}

      <div class="ds-actions">
        ${building ? `<button class="btn-primary" onclick="closeDetailScreen();selectMapBuilding('${building.id}');navigateTo('map')">🗺️ View Building on Map</button>` : ''}
        ${building ? `<button class="btn-ghost"   onclick="closeDetailScreen();openBuilding('${building.id}')">🏛️ Building Details</button>` : ''}
        <button class="btn-ghost" onclick="closeDetailScreen()">← Go Back</button>
      </div>

    </div>
  `;

  openDetailScreen(html);
}
