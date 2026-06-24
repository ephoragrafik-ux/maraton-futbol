/* ===========================
   TEAM DATA
   =========================== */

const teams = [
  { id: 1,  group: null, slot: null, name: 'HUMILDAD', cofradia: 'Hdad. y Cofradía de Nazarenos del S Cristo de la Humildad en su Presentación Ante Pilato y Ntra. Madre Y Sra. de Consolación y Esperanza', primary: '#800020', secondary: '#ffffff', kit: 'solid', shieldImg: 'kits/humildad-escudo-01.png', kitImgA: 'kits/HUMILDAD-A.png', kitImgB: 'kits/HUMILDAD-B.png', pending: false },
  { id: 2,  group: null, slot: null, name: 'PADRE JESÚS', cofradia: 'Real Cofradía de Ntro. Padre Jesús Nazareno y María Santísima de los Dolores', primary: '#6a1b9a', secondary: '#ffffff', kit: 'solid', shieldImg: 'kits/pjes.png', kitImgA: 'kits/PADRE-JESUS-A.png', kitImgB: 'kits/PADRE-JESUS-B.png', pending: false },
  { id: 3,  group: null, slot: null, name: 'RESUCITADO', cofradia: 'Cofradía del Santísimo Cristo Resucitado', primary: '#c62828', secondary: '#ffffff', kit: 'solid', shieldImg: 'kits/escudo-resucitado.png', kitImgA: 'kits/RESUCITADO-A.png', kitImgB: 'kits/RESUCITADO-B.png', pending: false },
  { id: 4,  group: null, slot: null, name: 'GRUPO JOVEN VERA CRUX', cofradia: 'Cofradía de la Santa Vera Crux y Santiago Apóstol', primary: '#B5DCCA', secondary: '#000000', kit: 'solid', shieldImg: 'kits/escudo-grupo-joven.png', kitImgA: 'kits/GRUPO-JOVEN-A.png', kitImgB: 'kits/GRUPO-JOVEN-B.png', pending: false },
  { id: 5,  group: null, slot: null, name: 'Equipo 5',  cofradia: '', primary: '#6a1b9a', secondary: '#ffffff', kit: 'solid',     pending: true },
  { id: 6,  group: null, slot: null, name: 'Equipo 6',  cofradia: '', primary: '#006064', secondary: '#ffffff', kit: 'stripes_v', pending: true },
  { id: 7,  group: null, slot: null, name: 'Equipo 7',  cofradia: '', primary: '#f57f17', secondary: '#000000', kit: 'hoops',     pending: true },
  { id: 8,  group: null, slot: null, name: 'Equipo 8',  cofradia: '', primary: '#1a237e', secondary: '#e53935', kit: 'diagonal',  pending: true },
  { id: 9,  group: null, slot: null, name: 'Equipo 9',  cofradia: '', primary: '#880e4f', secondary: '#ffffff', kit: 'halves',    pending: true },
  { id: 10, group: null, slot: null, name: 'Equipo 10', cofradia: '', primary: '#1b5e20', secondary: '#ffeb3b', kit: 'halves',    pending: true },
  { id: 11, group: null, slot: null, name: 'Equipo 11', cofradia: '', primary: '#212121', secondary: '#ffffff', kit: 'solid',     pending: true },
  { id: 12, group: null, slot: null, name: 'Equipo 12', cofradia: '', primary: '#4a148c', secondary: '#ffd600', kit: 'diagonal',  pending: true },
];

/* ===========================
   SVG GENERATORS
   =========================== */

/* ---- SHIRT ---- */
function kitSVG(primary, secondary, style) {
  const id = 'k' + Math.random().toString(36).slice(2, 7);

  /* Shirt outline: collar curve + body + sleeves */
  const body = `M 32,6
    C 39,6 45,20 50,20 C 55,20 61,6 68,6
    L 88,6 L 100,24 L 100,50 L 76,50
    L 76,112 L 24,112 L 24,50 L 0,50
    L 0,24 L 12,6 Z`;

  /* Collar highlight */
  const collar = `M 36,6 C 42,6 47,18 50,18 C 53,18 58,6 64,6`;

  let defs = '';
  let fill = primary;

  if (style === 'stripes_v') {
    defs = `<pattern id="${id}" patternUnits="userSpaceOnUse" width="14" height="200">
      <rect width="7"  height="200" fill="${primary}"/>
      <rect x="7" width="7" height="200" fill="${secondary}"/>
    </pattern>`;
    fill = `url(#${id})`;
  } else if (style === 'hoops') {
    defs = `<pattern id="${id}" patternUnits="userSpaceOnUse" width="200" height="16">
      <rect width="200" height="8"  fill="${primary}"/>
      <rect y="8" width="200" height="8" fill="${secondary}"/>
    </pattern>`;
    fill = `url(#${id})`;
  } else if (style === 'halves') {
    defs = `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="50%" stop-color="${primary}"/>
      <stop offset="50%" stop-color="${secondary}"/>
    </linearGradient>`;
    fill = `url(#${id})`;
  } else if (style === 'diagonal') {
    defs = `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="48%" stop-color="${primary}"/>
      <stop offset="48%" stop-color="${secondary}"/>
    </linearGradient>`;
    fill = `url(#${id})`;
  }

  /* Subtle inner shadow overlay */
  const overlay = `<path d="${body}" fill="none"
    stroke="rgba(255,255,255,0.07)" stroke-width="6" stroke-linejoin="round"/>`;

  return `<svg viewBox="0 0 100 118" xmlns="http://www.w3.org/2000/svg">
    <defs>${defs}</defs>
    <path d="${body}" fill="${fill}"
      stroke="rgba(0,0,0,0.35)" stroke-width="1.5" stroke-linejoin="round"/>
    ${overlay}
    <path d="${collar}" fill="none"
      stroke="rgba(255,255,255,0.5)" stroke-width="2.5"
      stroke-linecap="round"/>
  </svg>`;
}

/* ---- SHIELD ---- */
function shieldSVG(primary, secondary, initials) {
  /* Classic heraldic shield path */
  const shield = `M 50,4 L 94,18 L 94,58
    Q 94,96 50,113 Q 6,96 6,58 L 6,18 Z`;

  /* Light diagonal divider on shield */
  const divider = `M 6,58 L 94,58`;

  /* Choose text color: white if primary is dark, else primary */
  const textCol = secondary === '#ffffff' ? '#ffffff' : secondary;

  return `<svg viewBox="0 0 100 118" xmlns="http://www.w3.org/2000/svg">
    <!-- shadow -->
    <path d="${shield}" fill="rgba(0,0,0,0.4)"
      transform="translate(2,3)"/>
    <!-- body -->
    <path d="${shield}" fill="${primary}"
      stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <!-- inner stroke -->
    <path d="${shield}" fill="none"
      stroke="rgba(255,255,255,0.1)" stroke-width="5"
      stroke-linejoin="round"/>
    <!-- horizontal band -->
    <line x1="6" y1="58" x2="94" y2="58"
      stroke="${secondary}" stroke-width="1.5" opacity="0.45"/>
    <!-- initials -->
    <text x="50" y="70" text-anchor="middle"
      font-size="20" font-weight="900"
      font-family="'Segoe UI', Arial, sans-serif"
      fill="${textCol}" letter-spacing="1.5"
      style="text-shadow:0 1px 4px rgba(0,0,0,0.6)">${initials}</text>
  </svg>`;
}

/* ===========================
   CARD BUILDER
   =========================== */

function teamInitials(name) {
  if (!name || name === 'Por confirmar') return '?';
  return name
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 3)
    .map(w => w[0].toUpperCase())
    .join('');
}

function buildCard(team) {
  const initials = teamInitials(team.name);
  const isPending = team.pending || team.name === 'Por confirmar';
  const hasRealKit = !!team.kitImgA;

  const shield = team.shieldImg
    ? `<img src="${team.shieldImg}" alt="Escudo ${team.name}" class="shield-real-img">`
    : shieldSVG(team.primary, team.secondary, initials);

  const kitHTML = hasRealKit
    ? `<div class="kit-real-wrap">
         <img src="${team.kitImgA}" alt="Equipación A ${team.name}" class="kit-real-img" id="kit-img-${team.id}">
         <div class="kit-toggle">
           <button class="kit-toggle-btn active" onclick="switchKit(${team.id},'A',this)">▲ Front</button>
           <button class="kit-toggle-btn" onclick="switchKit(${team.id},'B',this)">▼ Back</button>
         </div>
       </div>`
    : `<div class="kit-wrap">${kitSVG(team.primary, team.secondary, team.kit)}</div>`;

  const groupTag = team.group
    ? `<span class="card-group-tag tag-${team.group}">Grupo ${team.group} · Equipo ${team.slot}</span>`
    : `<span class="card-group-tag tag-pending">🎲 Pendiente de sorteo</span>`;

  const cofradiaLine = team.cofradia
    ? `<p class="card-cofradia">${team.cofradia}</p>`
    : '';

  const buyBtn = isPending
    ? `<button class="btn-buy-kit" disabled style="opacity:0.4;cursor:default">Plaza disponible</button>`
    : `<a href="tienda.html" class="btn-buy-kit">🛒 Comprar camiseta</a>`;

  return `
    <div class="team-card${isPending ? ' pending' : ''}${hasRealKit ? ' has-real-kit' : ''}">
      <div class="card-accent" style="background:${team.primary}"></div>
      <div class="card-visuals">
        <div class="shield-wrap">${shield}</div>
        ${kitHTML}
      </div>
      <div class="card-info">
        <p class="card-team-name">${team.name}</p>
        ${cofradiaLine}
        ${groupTag}
      </div>
      <div class="card-footer">${buyBtn}</div>
    </div>
  `;
}

function switchKit(teamId, variant, btn) {
  const team = teams.find(t => t.id === teamId);
  if (!team) return;
  const img = document.getElementById(`kit-img-${teamId}`);
  if (img) img.src = variant === 'A' ? team.kitImgA : team.kitImgB;
  btn.closest('.kit-toggle').querySelectorAll('.kit-toggle-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ===========================
   RENDER GROUPS
   =========================== */

function renderTeams() {
  const container = document.getElementById('allTeams');
  if (!container) return;
  teams.forEach(t => container.insertAdjacentHTML('beforeend', buildCard(t)));
}

/* ===========================
   MODAL
   =========================== */

function openModal(teamId) {
  const team = teams.find(t => t.id === teamId);
  if (!team) return;

  document.getElementById('modalKit').innerHTML = team.kitImgA
    ? `<img src="${team.kitImgA}" class="kit-real-img" style="height:80px">`
    : kitSVG(team.primary, team.secondary, team.kit);
  document.getElementById('modalTeamName').textContent = team.name;
  document.getElementById('modalGroup').textContent =
    team.group
      ? `Grupo ${team.group} · Equipo ${team.slot}${team.cofradia ? ' · ' + team.cofradia : ''}`
      : team.cofradia || 'Grupo pendiente de sorteo';

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ===========================
   MOBILE NAV
   =========================== */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

/* ===========================
   INIT
   =========================== */
renderTeams();
