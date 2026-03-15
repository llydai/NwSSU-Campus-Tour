# NWSSU Campus Tour — Multi-File Structure
## Quick reference: which file to open for each task

---

## File Map

```
nwssu/
│
├── index.html              ← Shared shell: navbar, drawer, splash, modals
│                             Edit here for: nav links, brand name, modal HTML
│
├── pages/                  ← One file per page section
│   ├── home.html           ← Home: hero, quick-access, colleges, announcements
│   ├── map.html            ← Map: sidebar, building hotspots, route SVG overlay
│   ├── buildings.html      ← Buildings: filter bar + grid container
│   ├── departments.html    ← Departments: list container
│   ├── offices.html        ← Offices: grid container
│   ├── orgs.html           ← Organizations: grid container
│   └── freshmen.html       ← Freshmen guide: steps, tips, essential places
│
├── css/
│   └── style.css           ← ALL styles (variables, components, pages)
│
├── js/
│   ├── data.js             ← ★ CAMPUS DATA — edit this to update content
│   ├── page-loader.js      ← Fetches pages/*.html and injects into sections
│   ├── app-core.js         ← Boot, navigation, drawer, splash, utilities
│   ├── app-search.js       ← Global search logic
│   ├── app-map.js          ← Map coords, zoom, routing, directions
│   ├── app-ui.js           ← Lightbox, modals, image/photo helpers
│   ├── app-detail.js       ← Full-screen detail panel (buildings & depts)
│   └── app-populate.js     ← Populates grids from data arrays
│
└── images/                 ← Campus photos (referenced in data.js)
```

---

## Common Tasks — Which File to Open

| Task | File |
|------|------|
| Add / edit a campus announcement | `pages/home.html` |
| Add / move a building hotspot on the map | `pages/map.html` → find `id="mb-<name>"` |
| Change route coordinates for navigation | `js/app-map.js` → `MAP_COORDS` |
| Add a new building with details | `js/data.js` → `BUILDINGS[]` |
| Add faculty or programs to a college | `js/data.js` → `DEPARTMENTS[]` |
| Add a new office | `js/data.js` → `OFFICES[]` |
| Add a new student organization | `js/data.js` → `ORGANIZATIONS[]` |
| Change colors, fonts, layout | `css/style.css` |
| Change the navbar links | `index.html` → `.nav-links` and `.drawer-links` |
| Change splash duration | `js/app-core.js` → `initSplash()` |
| Change how building cards are rendered | `js/app-populate.js` → `populateBuildings()` |
| Change the detail panel layout | `js/app-detail.js` → `openBuilding()` / `openDept()` |

---

## How to Add a Building Photo

1. Drop the image into the `images/` folder, e.g. `images/cat.jpg`
2. Open `js/data.js`
3. Find the building entry and set `photo: 'images/cat.jpg'`
4. Save — the photo appears automatically in the card, detail screen, and map popup.

---

## Running the Project

This project uses `fetch()` to load page partials, so it must be served
over HTTP — not opened directly as a `file://` URL.

**Option A — VS Code Live Server** (recommended)
  Right-click `index.html` → Open with Live Server

**Option B — Python**
```bash
cd nwssu
python -m http.server 8080
# then open http://localhost:8080
```

**Option C — Node.js**
```bash
npx serve nwssu
```

### If you can't use a local server
Copy the HTML content from each `pages/*.html` file and paste it
directly inside the matching `<section id="page-*">` in `index.html`.
Then remove the `<script src="js/page-loader.js">` line.

---

## Script Load Order (index.html)

```html
<script src="js/data.js"></script>        <!-- 1. Data arrays -->
<script src="js/page-loader.js"></script> <!-- 2. Injects page partials, then calls appBoot() -->
<script src="js/app-core.js"></script>    <!-- 3. appBoot(), navigateTo(), utilities -->
<script src="js/app-search.js"></script>  <!-- 4. Search -->
<script src="js/app-map.js"></script>     <!-- 5. Map & routing -->
<script src="js/app-ui.js"></script>      <!-- 6. Lightbox, modals, image helpers -->
<script src="js/app-detail.js"></script>  <!-- 7. Detail screen -->
<script src="js/app-populate.js"></script><!-- 8. Grid renderers -->
```

---

## Voice Navigation & Shortcuts — New Files

| File | Purpose |
|------|---------|
| `pages/voice-nav.html`   | Voice nav panel UI (mic button, command chips, settings) |
| `pages/shortcuts.html`   | Shortcuts panel UI (keyboard, quick nav, gesture guide) |
| `css/voice-nav.css`      | All voice nav styles (FABs, panel, rings, waveform) |
| `css/shortcuts.css`      | All shortcuts panel styles (tabs, kbd chips, gesture animations) |
| `js/app-voice.js`        | Voice nav controller — command matching, UI states, STT stub |
| `js/app-shortcuts.js`    | Keyboard listener, swipe gestures, tab switching |

### How to activate real Speech-to-Text
1. Open `js/app-voice.js`
2. In `startVoiceListen()`, replace the `// ── Stub ──` block with `initSpeechRecognition(); vnRecognizer?.start();`
3. Uncomment the `initSpeechRecognition()` function at the bottom of the file

### Adding new voice commands
Open `js/app-voice.js` → `VOICE_COMMANDS` array. Each entry needs:
- `patterns` — array of phrases to match (lowercase)
- `action`   — function to call
- `label`    — confirmation text shown in result box
- `icon`     — emoji shown in result box
