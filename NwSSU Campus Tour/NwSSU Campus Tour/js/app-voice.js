// ══════════════════════════════════════════════
// VOICE NAVIGATION — Map-Integrated + Real Speech API
// File: js/app-voice.js
//
// ► Voice panel is embedded on the MAP page
// ► Uses real Web Speech API (SpeechRecognition)
// ► Falls back gracefully if not supported
// ► openVoiceNav() / closeVoiceNav() kept for
//   backwards-compat (floating FAB + shortcuts panel)
// ══════════════════════════════════════════════

// ─── STATE ───
let vnListening      = false;
let mvpListening     = false;
let mapVoiceOpen     = false;
let vnAutoRead       = true;
let mvpAutoRead      = true;
let vnLang           = 'en-PH';
let mvpLang          = 'en-PH';
let vnRecognizer     = null;
let mvpRecognizer    = null;
const SPEECH_SUPPORTED = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

// ── Command map ──
const VOICE_COMMANDS = [
  // ── Page navigation ──
  { patterns: ['go home','home page','main page','homepage'],
    action: () => navigateTo('home'), label: 'Going to Home', icon: '🏠' },
  { patterns: ['open map','show map','campus map','go to map','open campus map'],
    action: () => navigateTo('map'), label: 'Opening Campus Map', icon: '🗺️' },
  { patterns: ['buildings','show buildings','open buildings'],
    action: () => navigateTo('buildings'), label: 'Opening Buildings', icon: '🏛️' },
  { patterns: ['departments','colleges','show departments','open departments'],
    action: () => navigateTo('departments'), label: 'Opening Departments', icon: '🎓' },
  { patterns: ['offices','show offices','open offices'],
    action: () => navigateTo('offices'), label: 'Opening Offices', icon: '🏢' },
  { patterns: ['organizations','orgs','student orgs','open organizations'],
    action: () => navigateTo('orgs'), label: 'Opening Organizations', icon: '👥' },
  { patterns: ['freshmen','freshmen guide','new student','freshman'],
    action: () => navigateTo('freshmen'), label: 'Opening Freshmen Guide', icon: '📚' },

  // ── Map navigation (navigate TO building) ──
  { patterns: ['library','go to library','navigate to library','where is library','find library'],
    action: () => { selectMapBuilding('library'); navigateTo('map'); }, label: 'Navigating to Library', icon: '📚' },
  { patterns: ['registrar','go to registrar','navigate to registrar','where is registrar','find registrar'],
    action: () => { selectMapBuilding('registrar'); navigateTo('map'); }, label: 'Navigating to Registrar', icon: '📋' },
  { patterns: ['cashier','go to cashier','navigate to cashier','where is cashier','find cashier'],
    action: () => { selectMapBuilding('cashier'); navigateTo('map'); }, label: 'Navigating to Cashier', icon: '💳' },
  { patterns: ['canteen','go to canteen','navigate to canteen','where to eat','find canteen','cafeteria'],
    action: () => { selectMapBuilding('canteen'); navigateTo('map'); }, label: 'Navigating to Canteen', icon: '🍽️' },
  { patterns: ['president','admin','admin building','administration','navigate to president','navigate to admin'],
    action: () => { selectMapBuilding('president'); navigateTo('map'); }, label: "Navigating to Admin Building", icon: '🏛️' },
  { patterns: ['hotel','nwssu hotel','navigate to hotel'],
    action: () => { selectMapBuilding('hotel'); navigateTo('map'); }, label: 'Navigating to Hotel', icon: '🏨' },
  { patterns: ['sports','sports complex','gym','court','navigate to sports'],
    action: () => { selectMapBuilding('sports'); navigateTo('map'); }, label: 'Navigating to Sports Complex', icon: '⚽' },
  { patterns: ['alumni','alumni building','navigate to alumni'],
    action: () => { selectMapBuilding('alumni'); navigateTo('map'); }, label: 'Navigating to Alumni Building', icon: '🎓' },
  { patterns: ['gate','main gate','entrance','navigate to gate'],
    action: () => { selectMapBuilding('gate'); navigateTo('map'); }, label: 'Navigating to Main Gate', icon: '🚪' },
  { patterns: ['cat','agriculture','college of agriculture','navigate to cat'],
    action: () => { selectMapBuilding('cat'); navigateTo('map'); }, label: 'Navigating to CAT Building', icon: '🌾' },
  { patterns: ['ccis','computing','computer science','information systems','navigate to ccis'],
    action: () => { selectMapBuilding('ccis'); navigateTo('map'); }, label: 'Navigating to CCIS Building', icon: '💻' },
  { patterns: ['ccjs','criminal justice','criminology','navigate to ccjs'],
    action: () => { selectMapBuilding('ccjs'); navigateTo('map'); }, label: 'Navigating to CCJS Building', icon: '⚖️' },
  { patterns: ['coed','education','college of education','navigate to coed'],
    action: () => { selectMapBuilding('coed'); navigateTo('map'); }, label: 'Navigating to COED Building', icon: '📖' },
  { patterns: ['con','nursing','college of nursing','navigate to con','navigate to nursing'],
    action: () => { selectMapBuilding('con'); navigateTo('map'); }, label: 'Navigating to CON Building', icon: '🏥' },
  { patterns: ['com','management','college of management','business','navigate to com'],
    action: () => { selectMapBuilding('com'); navigateTo('map'); }, label: 'Navigating to COM Building', icon: '💼' },
  { patterns: ['cea','engineering','architecture','college of engineering','navigate to cea'],
    action: () => { selectMapBuilding('cea'); navigateTo('map'); }, label: 'Navigating to CEA Building', icon: '🏗️' },
  { patterns: ['sociocultural','socio cultural','rsu','navigate to sociocultural'],
    action: () => { selectMapBuilding('sociocultural'); navigateTo('map'); }, label: 'Navigating to Socio-Cultural Building', icon: '🎭' },
  { patterns: ['student council','navigate to student council'],
    action: () => { selectMapBuilding('studentcouncil'); navigateTo('map'); }, label: 'Navigating to Student Council', icon: '🏛️' },

  // ── Building detail ──
  { patterns: ['tell me about ccis','about ccis','open ccis','ccis details'],
    action: () => openBuilding('ccis'), label: 'Opening CCIS details', icon: '💻' },
  { patterns: ['tell me about cat','about cat','open cat','cat details'],
    action: () => openBuilding('cat'), label: 'Opening CAT details', icon: '🌾' },
  { patterns: ['tell me about ccjs','about ccjs','open ccjs'],
    action: () => openBuilding('ccjs'), label: 'Opening CCJS details', icon: '⚖️' },
  { patterns: ['tell me about coed','about coed','open coed'],
    action: () => openBuilding('coed'), label: 'Opening COED details', icon: '📖' },
  { patterns: ['tell me about nursing','about nursing','about con','show nursing'],
    action: () => openBuilding('con'), label: 'Opening CON details', icon: '🏥' },
  { patterns: ['tell me about hotel','about hotel','open hotel'],
    action: () => openBuilding('hotel'), label: 'Opening Hotel details', icon: '🏨' },

  // ── Zoom map ──
  { patterns: ['zoom in','zoom closer','closer'],
    action: () => mapZoomIn(), label: 'Zooming in', icon: '🔍' },
  { patterns: ['zoom out','zoom back','farther'],
    action: () => mapZoomOut(), label: 'Zooming out', icon: '🔭' },
  { patterns: ['reset map','reset view','reset zoom'],
    action: () => mapReset(), label: 'Resetting map view', icon: '⊙' },

  // ── Close / system ──
  { patterns: ['close voice','close mic','stop listening','cancel','stop'],
    action: () => closeMapVoice(), label: 'Closing Voice Navigation', icon: '✕' },
  { patterns: ['shortcuts','open shortcuts','quick actions'],
    action: () => { closeMapVoice(); openShortcuts(); }, label: 'Opening Shortcuts', icon: '⚡' },
];

// ══════════════════════════════════════════════
// MAP VOICE PANEL — Primary voice interface
// ══════════════════════════════════════════════

function toggleMapVoice() {
  mapVoiceOpen ? closeMapVoice() : openMapVoice();
}

function openMapVoice() {
  mapVoiceOpen = true;
  const panel = document.getElementById('mapVoicePanel');
  const btn   = document.getElementById('mapVoiceBtn');
  if (panel) panel.classList.add('open');
  if (btn)   btn.classList.add('active');
  setMvpStatus('Tap the mic to start', '');
}

function closeMapVoice() {
  mapVoiceOpen = false;
  stopMapVoiceListen();
  const panel = document.getElementById('mapVoicePanel');
  const btn   = document.getElementById('mapVoiceBtn');
  if (panel) panel.classList.remove('open');
  if (btn)   btn.classList.remove('active');
}

// ── Mic toggle ──
function toggleMapVoiceListen() {
  mvpListening ? stopMapVoiceListen() : startMapVoiceListen();
}

function startMapVoiceListen() {
  mvpListening = true;
  setMvpStatus('🔴 Listening…', 'listening');
  setMvpMicState(true);

  if (SPEECH_SUPPORTED) {
    // Real speech recognition
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    mvpRecognizer = new SR();
    mvpRecognizer.lang = mvpLang;
    mvpRecognizer.continuous = false;
    mvpRecognizer.interimResults = true;
    mvpRecognizer.maxAlternatives = 3;

    mvpRecognizer.onstart = () => {
      setMvpStatus('🔴 Listening… speak now', 'listening');
    };

    mvpRecognizer.onresult = (e) => {
      const results = Array.from(e.results);
      const interim = results.map(r => r[0].transcript).join('');
      showMvpTranscript(interim);

      if (e.results[e.results.length - 1].isFinal) {
        const final = results[results.length - 1][0].transcript;
        stopMapVoiceListen();
        processMapVoiceCommand(final);
      }
    };

    mvpRecognizer.onerror = (e) => {
      stopMapVoiceListen();
      let msg = 'Microphone error. ';
      if (e.error === 'not-allowed') msg = 'Microphone access denied. Please allow microphone in browser settings.';
      else if (e.error === 'no-speech') msg = 'No speech detected. Please try again.';
      else if (e.error === 'network') msg = 'Network error during recognition.';
      showMvpResult(null, msg);
    };

    mvpRecognizer.onend = () => {
      if (mvpListening) stopMapVoiceListen();
    };

    try {
      mvpRecognizer.start();
    } catch(err) {
      stopMapVoiceListen();
      showMvpResult(null, 'Could not start microphone: ' + err.message);
    }

  } else {
    // Fallback: no speech API
    window._mvpFallbackTimer = setTimeout(() => {
      if (mvpListening) {
        stopMapVoiceListen();
        showMvpResult(null, 'Speech recognition is not supported in this browser. Try Chrome or Edge, or tap a command chip below.');
      }
    }, 2500);
  }
}

function stopMapVoiceListen() {
  mvpListening = false;
  clearTimeout(window._mvpFallbackTimer);
  if (mvpRecognizer) {
    try { mvpRecognizer.stop(); } catch(e) {}
    mvpRecognizer = null;
  }
  setMvpMicState(false);
  setMvpStatus('Tap to speak', '');
}

// ── Command chips (simulate) ──
function runMapVoiceCommand(text) {
  showMvpTranscript(text);
  setMvpStatus('⏳ Processing…', 'processing');
  setTimeout(() => processMapVoiceCommand(text), 400);
}

// ── Process spoken/simulated text ──
function processMapVoiceCommand(text) {
  const match = matchVoiceCommand(text);
  if (match) {
    showMvpResult(match);
    match.action();
    if (mvpAutoRead && 'speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(match.label);
      utt.lang = mvpLang;
      utt.rate = 1.0;
      utt.pitch = 1.0;
      speechSynthesis.cancel();
      speechSynthesis.speak(utt);
    }
  } else {
    showMvpResult(null, `I didn't understand "${text}". Try tapping a command chip, or say "navigate to [building]".`);
  }
}

// ─── UI State Helpers ───

function setMvpMicState(on) {
  const btn   = document.getElementById('mvpMicBtn');
  const rings = document.getElementById('mvpRings');
  const icon  = document.getElementById('mvpIcon');
  if (!btn) return;

  if (on) {
    btn.classList.add('listening');
    btn.innerHTML = `<div class="vn-wave-bars">
      <div class="vn-bar"></div><div class="vn-bar"></div><div class="vn-bar"></div>
      <div class="vn-bar"></div><div class="vn-bar"></div>
    </div>`;
    rings?.classList.add('active');
    icon?.classList.add('pulsing');
  } else {
    btn.classList.remove('listening');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor"/>
      <path d="M5 10a7 7 0 0 0 14 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
    rings?.classList.remove('active');
    icon?.classList.remove('pulsing');
  }
}

function setMvpStatus(text, state) {
  const el = document.getElementById('mvpStatus');
  if (!el) return;
  el.textContent = text;
  el.className = 'mvp-status' + (state ? ' ' + state : '');
}

function showMvpTranscript(text) {
  const wrap = document.getElementById('mvpTranscript');
  const span = document.getElementById('mvpTranscriptText');
  if (!wrap || !span) return;
  span.textContent = `"${text}"`;
  wrap.style.display = 'flex';
}

function showMvpResult(match, errorMsg) {
  const el = document.getElementById('mvpResult');
  if (!el) return;

  if (match) {
    el.innerHTML = `
      <div class="mvp-result-box success">
        <span class="mvp-result-ico">${match.icon}</span>
        <div>
          <strong>${match.label}</strong>
          <span>Command recognised ✓</span>
        </div>
      </div>`;
    setMvpStatus('✅ Done!', 'success');
  } else {
    el.innerHTML = `
      <div class="mvp-result-box error">
        <span class="mvp-result-ico">🎙️</span>
        <div>
          <strong>Not understood</strong>
          <span>${errorMsg || 'Try again or use a chip.'}</span>
        </div>
      </div>`;
    setMvpStatus('Try again', 'error');
  }

  // Auto-clear after 5s
  clearTimeout(window._mvpResultTimer);
  window._mvpResultTimer = setTimeout(() => {
    if (el) el.innerHTML = '';
    setMvpStatus('Tap to speak', '');
    const wrap = document.getElementById('mvpTranscript');
    if (wrap) wrap.style.display = 'none';
  }, 5000);
}

function setMapVoiceLang(lang) { mvpLang = lang; }

// ══════════════════════════════════════════════
// COMMAND MATCHING (shared between map + floating panel)
// ══════════════════════════════════════════════

function matchVoiceCommand(text) {
  const t = text.toLowerCase().trim();
  return VOICE_COMMANDS.find(cmd =>
    cmd.patterns.some(p => t.includes(p))
  ) || null;
}

// ══════════════════════════════════════════════
// FLOATING PANEL (legacy – opened from shortcuts / keyboard)
// Kept so old openVoiceNav() calls still work.
// On the map page it redirects to the inline panel instead.
// ══════════════════════════════════════════════

function openVoiceNav() {
  // If we're on the map page, open the inline panel instead
  if (currentPage === 'map') {
    openMapVoice();
    return;
  }
  // Otherwise navigate to map and open there
  navigateTo('map');
  setTimeout(() => openMapVoice(), 350);
}

function closeVoiceNav() {
  closeMapVoice();
  // Also close any legacy floating panel elements
  document.getElementById('vnBackdrop')?.classList.remove('show');
  document.getElementById('vnPanel')?.classList.remove('open');
  if (!document.getElementById('scPanel')?.classList.contains('open'))
    document.body.style.overflow = '';
}

// ── Legacy floating-panel functions (kept for voice-nav.html chips) ──
function toggleVoiceListen() { toggleMapVoiceListen(); }

function simulateVoiceCommand(text) {
  // Route to map panel
  if (currentPage !== 'map') {
    navigateTo('map');
    setTimeout(() => {
      openMapVoice();
      setTimeout(() => runMapVoiceCommand(text), 350);
    }, 400);
  } else {
    openMapVoice();
    runMapVoiceCommand(text);
  }
}

function setVoiceLang(lang)  { vnLang = lang; mvpLang = lang; }
function toggleAutoRead(val) { vnAutoRead = val; mvpAutoRead = val; }