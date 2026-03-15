// ══════════════════════════════════════════════
// UI COMPONENTS
// File: js/app-ui.js
//
// Responsibilities:
//   - Image lightbox (full-screen photo viewer)
//   - Generic modal overlay (offices, orgs)
//   - buildPhotoHtml()   — hero / placeholder builder
//   - buildCardThumb()   — building grid thumbnail
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// LIGHTBOX
// ══════════════════════════════════════════════

function createLightbox() {
  const lb = document.createElement('div');
  lb.id        = 'lightbox';
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
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
  // Restore scroll only if detail screen is also closed
  if (!document.getElementById('detailScreen')?.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

// ══════════════════════════════════════════════
// MODAL OVERLAY (Offices / Orgs quick-view)
// ══════════════════════════════════════════════

function openModal()  { document.getElementById('modalOverlay')?.classList.add('open'); }
function closeModal() { document.getElementById('modalOverlay')?.classList.remove('open'); }

function showOfficeModal(i) {
  const o = OFFICES[i];
  if (!o) return;
  document.getElementById('modalContent').innerHTML = `
    <div class="m-banner" style="background:rgba(42,102,36,0.2);font-size:64px">${o.icon}</div>
    <div class="m-title">${escHtml(o.name)}</div>
    <div class="m-sub">📍 ${escHtml(o.location)} · ⏰ ${escHtml(o.hours)}</div>
    <div class="m-desc">${escHtml(o.desc)}</div>`;
  openModal();
}

function showOrgModal(i) {
  const o = ORGANIZATIONS[i];
  if (!o) return;
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

// ══════════════════════════════════════════════
// IMAGE HELPERS
// ══════════════════════════════════════════════

// Builds the hero photo area for detail screens.
// Shows a real <img> if photo is provided, otherwise a styled placeholder.
function buildPhotoHtml(photo, emoji, color, name, context = 'hero') {
  const sizes = { hero: 'ds-photo-hero', card: 'ds-photo-card', dept: 'ds-photo-dept' };
  const cls   = sizes[context] || 'ds-photo-hero';

  if (photo) {
    return `
      <div class="${cls} has-img"
           onclick="openLightbox('${escAttr(photo)}','${escAttr(name)}')"
           title="Click to enlarge">
        <img src="${escAttr(photo)}" alt="${escAttr(name)}"
             onerror="this.parentElement.classList.remove('has-img');
                      this.parentElement.innerHTML=buildPhotoPlaceholderInner('${escAttr(emoji)}','${escAttr(color)}','${escAttr(name)}');" />
        <div class="photo-zoom-hint">🔍 Click to enlarge</div>
      </div>`;
  } else {
    return `
      <div class="${cls} is-placeholder"
           style="background:linear-gradient(135deg,${color}44,${color}22)">
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

// Builds the thumbnail shown on building grid cards.
function buildCardThumb(b) {
  if (b.photo) {
    return `
      <div class="bldg-thumb has-img"
           onclick="event.stopPropagation();openLightbox('${escAttr(b.photo)}','${escAttr(b.name)}')"
           title="Click to enlarge photo">
        <img src="${escAttr(b.photo)}" alt="${escAttr(b.name)}" loading="lazy"
             onerror="this.parentElement.classList.remove('has-img');
                      this.parentElement.innerHTML='<span style=font-size:52px>${b.emoji}</span>';
                      this.parentElement.style.background='linear-gradient(135deg,${b.color}40,${b.color}70)';" />
        <div class="thumb-zoom">🔍</div>
      </div>`;
  }
  return `<div class="bldg-thumb" style="background:linear-gradient(135deg,${b.color}40,${b.color}70)">
            <span style="font-size:52px">${b.emoji}</span>
          </div>`;
}
