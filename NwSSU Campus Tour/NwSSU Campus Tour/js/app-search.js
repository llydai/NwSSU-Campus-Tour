// ══════════════════════════════════════════════
// SEARCH
// File: js/app-search.js
//
// Responsibilities:
//   - Wire drawer search input
//   - doSearch() — filter SEARCH_INDEX and render results
//   - runSearchAction() — execute the item's action
//
// SEARCH_INDEX is defined in js/data.js
// ══════════════════════════════════════════════

function initGlobalSearch() {
  const drawerInput = document.querySelector('.drawer-search-row input');
  if (drawerInput) drawerInput.addEventListener('input', e => doSearch(e.target.value));
}

function doSearch(query) {
  const q     = (query || '').trim().toLowerCase();
  const panel = document.getElementById('searchPanel');
  if (!panel) return;

  if (!q) {
    panel.classList.remove('show');
    return;
  }

  const results = SEARCH_INDEX
    .filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.type || '').toLowerCase().includes(q)
    )
    .slice(0, 8);

  if (!results.length) {
    panel.innerHTML = `<div class="sp-head">No results for "${escHtml(query)}"</div>`;
  } else {
    panel.innerHTML =
      `<div class="sp-head">Results for "${escHtml(query)}"</div>` +
      results.map(r =>
        `<div class="sp-item" onclick="runSearchAction(${SEARCH_INDEX.indexOf(r)})">
          <div class="sp-ico">${r.icon}</div>
          <div>
            <div class="sp-name">${r.name}</div>
            <div class="sp-type">${r.type}</div>
          </div>
        </div>`
      ).join('');
  }

  panel.classList.add('show');
}

function runSearchAction(idx) {
  SEARCH_INDEX[idx]?.action?.();
  document.getElementById('searchPanel')?.classList.remove('show');
}
