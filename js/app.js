/* ═══════════════════════════════════════════
   ScriptVault — App Logic
   File: js/app.js
═══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let currentFilter = 'all';
let currentSearch = '';
let mobileOnly    = false;
let currentScript = null;


/* ─────────────────────────────────────────
   HELPERS — Thumbnail
───────────────────────────────────────── */
function getThumbClass(thumb) {
  const map = {
    blox:   'thumb-blox',
    sailor: 'thumb-sailor',
    pet:    'thumb-pet',
    brook:  'thumb-brook'
  };
  return map[thumb] || 'thumb-custom';
}

function getThumbLabel(thumb) {
  const map = {
    blox:   'BLOX FRUITS',
    sailor: 'SAILOR PIECE',
    pet:    'PET SIM',
    brook:  'BROOKHAVEN'
  };
  return map[thumb] || 'SCRIPT';
}


/* ─────────────────────────────────────────
   HELPERS — Tags
───────────────────────────────────────── */
const TAG_CLASS_MAP = {
  'No Key':    'tag-nokey',
  'Mobile':    'tag-mobile',
  'New':       'tag-new',
  'Auto Farm': 'tag-feature',
  'ESP':       'tag-feature',
  'Admin':     'tag-feature',
  'Fruit ESP': 'tag-feature',
  'Sea 2':     'tag-feature',
  'Sea 3':     'tag-feature'
};

function buildTag(label) {
  const cls = TAG_CLASS_MAP[label] || 'tag-feature';
  return `<span class="tag ${cls}">${label}</span>`;
}

function buildGameTag(game) {
  return `<span class="tag tag-game">${game}</span>`;
}


/* ─────────────────────────────────────────
   FILTER — Returns matching scripts
───────────────────────────────────────── */
function getFilteredScripts() {
  return SCRIPTS.filter(script => {
    const matchGame   = currentFilter === 'all' || script.game === currentFilter;
    const matchMobile = !mobileOnly || script.tags.includes('Mobile');
    const q           = currentSearch.toLowerCase();
    const matchSearch = !q
      || script.title.toLowerCase().includes(q)
      || script.game.toLowerCase().includes(q)
      || script.hub.toLowerCase().includes(q)
      || script.tags.some(t => t.toLowerCase().includes(q));

    return matchGame && matchMobile && matchSearch;
  });
}


/* ─────────────────────────────────────────
   RENDER — Build thumbnail (YouTube or placeholder)
───────────────────────────────────────── */
function buildThumbHTML(script) {
  if (script.image) {
    return `<img class="card-thumb-img" src="${script.image}" alt="${script.title}">`;
  }
  if (script.youtube) {
    return `
      <div class="card-video" onclick="event.stopPropagation();">
        <iframe
          src="https://www.youtube.com/embed/${script.youtube}?rel=0&modestbranding=1"
          title="${script.title}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    `;
  }
  return `
    <div class="card-thumb-placeholder ${getThumbClass(script.thumb)}">
      ${getThumbLabel(script.thumb)}
    </div>
  `;
}


/* ─────────────────────────────────────────
   RENDER — Build a single card
   Clicking the card body → opens detail modal
   Clicking "Get Script" → goes directly to Linkvertise
   Clicking the video → plays inline (no modal trigger)
───────────────────────────────────────── */
function buildCardHTML(script) {
  const featuredClass = script.featured ? ' featured' : '';
  const tagHTML       = script.tags.map(buildTag).join('');

  return `
    <div class="script-card${featuredClass}" onclick="openModal(${script.id})">
      ${buildThumbHTML(script)}
      <div class="card-body">
        <div class="card-tags">${buildGameTag(script.game)}${tagHTML}</div>
        <div class="card-title">${script.title}</div>
        <div class="card-footer">
          <span class="card-date">${script.date}</span>
          <a
            class="btn-get"
            href="${script.linkvertise}"
            target="_blank"
            rel="noopener noreferrer"
            onclick="event.stopPropagation();"
          >Get Script</a>
        </div>
      </div>
    </div>
  `;
}


/* ─────────────────────────────────────────
   RENDER — Update the grid
───────────────────────────────────────── */
function render() {
  const filtered  = getFilteredScripts();
  const grid      = document.getElementById('scriptsGrid');
  const noResults = document.getElementById('noResults');
  const badge     = document.getElementById('countBadge');

  // Update stat counter in hero
  document.getElementById('totalScripts').textContent = SCRIPTS.length;

  // Update count badge
  badge.textContent = `${filtered.length} script${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
    grid.innerHTML = filtered.map(buildCardHTML).join('');
  }
}


/* ─────────────────────────────────────────
   FILTER BUTTONS
───────────────────────────────────────── */
function filterBy(game, btn) {
  currentFilter = game;
  mobileOnly    = false;

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  render();
}

function showMobileOnly(btn) {
  mobileOnly    = !mobileOnly;
  currentFilter = 'all';

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (mobileOnly && btn) btn.classList.add('active');

  render();
}


/* ─────────────────────────────────────────
   SEARCH
───────────────────────────────────────── */
function handleSearch() {
  currentSearch = document.getElementById('searchInput').value;
  render();
}


/* ─────────────────────────────────────────
   MODAL — Open (shows detail + Get Script link)
───────────────────────────────────────── */
function openModal(id) {
  const script = SCRIPTS.find(s => s.id === id);
  if (!script) return;
  currentScript = script;

  // Thumbnail
  const thumb = document.getElementById('modalThumb');
  thumb.className  = `modal-thumb ${getThumbClass(script.thumb)}`;
  thumb.textContent = getThumbLabel(script.thumb);

  // Tags
  document.getElementById('modalTags').innerHTML =
    buildGameTag(script.game) + script.tags.map(buildTag).join('');

  // Text content
  document.getElementById('modalTitle').textContent = script.title;
  document.getElementById('modalDesc').textContent  = script.desc;

  // Features list
  document.getElementById('modalFeatures').innerHTML =
    script.features.map(f => `<div class="feature-item">${f}</div>`).join('');

  // Meta row
  document.getElementById('modalDate').textContent = script.date;
  document.getElementById('modalGame').textContent = script.game;
  document.getElementById('modalHub').textContent  = script.hub;

  // Get Script button — direct Linkvertise link
  document.getElementById('modalLink').href = script.linkvertise;

  // Show modal
  document.getElementById('modalBg').classList.add('open');
  document.body.style.overflow = 'hidden';
}


/* ─────────────────────────────────────────
   MODAL — Close
───────────────────────────────────────── */
function closeModal(event) {
  if (event && event.target !== document.getElementById('modalBg')) return;
  document.getElementById('modalBg').classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});


/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
render();
