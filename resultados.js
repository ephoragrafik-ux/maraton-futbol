/* ===========================
   DATA
   groupTeams, groupMatches, qfMatches, sfMatches y finalMatch
   viven en matches-data.js (compartido con la portada) y se
   actualizan automáticamente desde el Google Sheet de resultados.
   =========================== */

/* ===========================
   STANDINGS CALCULATOR
   =========================== */

function calcGroupStandings(groupNum) {
  const teams = groupTeams[groupNum];
  const stats = {};
  teams.forEach(t => {
    stats[t.slot] = { slot:t.slot, name:t.name, color:t.color, pj:0, g:0, e:0, p:0, gf:0, gc:0 };
  });

  groupMatches.filter(m => m.group === groupNum && m.status === 'done').forEach(m => {
    const h = stats[m.homeSlot], a = stats[m.awaySlot];
    h.pj++; a.pj++;
    h.gf += m.homeScore; h.gc += m.awayScore;
    a.gf += m.awayScore; a.gc += m.homeScore;
    if (m.homeScore > m.awayScore)      { h.g++; a.p++; }
    else if (m.homeScore < m.awayScore) { a.g++; h.p++; }
    else                                { h.e++; a.e++; }
  });

  return Object.values(stats)
    .map(s => ({ ...s, dg: s.gf - s.gc, pts: s.g * 3 + s.e }))
    .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
}

/* ===========================
   RENDER HELPERS
   =========================== */

function statusHTML(status) {
  if (status === 'done')    return `<span class="ko-status"><span class="match-status-dot dot-done"></span>Finalizado</span>`;
  if (status === 'live')    return `<span class="ko-status"><span class="match-status-dot dot-live"></span>En directo</span>`;
  return `<span class="ko-status"><span class="match-status-dot dot-pending"></span>Pendiente</span>`;
}

function teamName(slot, groupNum) {
  const t = groupTeams[groupNum].find(x => x.slot === slot);
  return t ? (t.name !== 'Por confirmar' ? t.name : `Equipo ${slot}`) : `Equipo ${slot}`;
}

/* ===========================
   RENDER GROUP BLOCKS
   =========================== */

function renderGroups() {
  const wrapper = document.getElementById('groupsWrapper');
  if (!wrapper) return;

  [1, 2, 3, 4].forEach(g => {
    const standings = calcGroupStandings(g);
    const matches   = groupMatches.filter(m => m.group === g);

    /* Standings rows */
    const rows = standings.map((s, i) => {
      const qualClass = i < 2 ? 'qualify-row' : '';
      const dgStr = s.dg > 0 ? `+${s.dg}` : `${s.dg}`;
      return `
        <tr class="${qualClass}">
          <td>${i + 1}</td>
          <td class="col-team-name">
            <div class="mini-team-cell">
              <span class="mini-dot" style="background:${s.color}"></span>
              <span>${s.name !== 'Por confirmar' ? s.name : `Equipo ${s.slot}`}</span>
            </div>
          </td>
          <td>${s.pj}</td>
          <td>${s.g}</td>
          <td>${s.e}</td>
          <td>${s.p}</td>
          <td>${s.gf}</td>
          <td>${s.gc}</td>
          <td>${dgStr}</td>
          <td class="mini-pts">${s.pts}</td>
        </tr>`;
    }).join('');

    /* Match rows */
    const matchRows = matches.map(m => {
      const homeName = teamName(m.homeSlot, g);
      const awayName = teamName(m.awaySlot, g);
      const isDone   = m.status === 'done';
      const scoreHTML = isDone
        ? `<span class="match-score-val">${m.homeScore}&thinsp;–&thinsp;${m.awayScore}</span>`
        : `<span class="match-vs">VS</span>`;
      return `
        <div class="match-row${isDone ? ' done' : ''}">
          <span class="match-team">${homeName}</span>
          <div class="match-center">
            ${scoreHTML}
            <span class="match-time-label">${m.date} · ${m.time}</span>
          </div>
          <span class="match-team match-team-away">${awayName}</span>
        </div>`;
    }).join('');

    wrapper.insertAdjacentHTML('beforeend', `
      <div class="group-block">
        <div class="group-title">
          <span class="gt-${g}">Grupo ${g}</span>
          <span class="group-team-count">3 equipos · 3 partidos</span>
        </div>
        <table class="mini-standings">
          <thead>
            <tr>
              <th>#</th>
              <th class="col-team-name">Equipo</th>
              <th title="Jugados">PJ</th>
              <th title="Ganados">G</th>
              <th title="Empates">E</th>
              <th title="Perdidos">P</th>
              <th title="Goles favor">GF</th>
              <th title="Goles contra">GC</th>
              <th title="Diferencia">DG</th>
              <th title="Puntos">Pts</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="group-matches">${matchRows}</div>
      </div>
    `);
  });
}

/* ===========================
   RENDER KNOCKOUT CARD
   =========================== */

function koCard(match, isFinal = false) {
  const isDone = match.status === 'done';
  const cardClass = `ko-card${isDone ? ' done' : ''}${isFinal ? ' final-card' : ''}`;

  const scoreBlock = isDone
    ? `<span class="ko-score">${match.homeScore}&thinsp;–&thinsp;${match.awayScore}</span>`
    : `<span class="ko-score-vs">VS</span>`;

  const trophyBlock = (isFinal && isDone)
    ? `<div class="trophy-area">
        <div class="trophy-icon">🏆</div>
        <div class="trophy-text">¡Campeón del XV Maratón Cofrade Fútbol Sala!</div>
        <div class="trophy-winner">${match.homeScore > match.awayScore ? match.home : match.away}</div>
       </div>` : '';

  return `
    <div class="${cardClass}">
      <div class="ko-card-header">
        <span class="ko-label">${match.label}</span>
        ${statusHTML(match.status)}
      </div>
      <div class="ko-body">
        <div class="ko-team">
          <span class="ko-team-name">${match.home}</span>
          ${match.homeSub ? `<span class="ko-team-sub">${match.homeSub}</span>` : ''}
        </div>
        <div class="ko-score-area">
          ${scoreBlock}
        </div>
        <div class="ko-team ko-team-away">
          <span class="ko-team-name">${match.away}</span>
          ${match.awaySub ? `<span class="ko-team-sub">${match.awaySub}</span>` : ''}
        </div>
      </div>
      <div class="ko-footer">📅 ${match.date} · ⏰ ${match.time}</div>
      ${trophyBlock}
    </div>`;
}

function renderKnockout() {
  const qfGrid = document.getElementById('qfGrid');
  const sfGrid = document.getElementById('sfGrid');
  const finalGrid = document.getElementById('finalGrid');

  if (qfGrid) qfMatches.forEach(m => qfGrid.insertAdjacentHTML('beforeend', koCard(m)));
  if (sfGrid) sfMatches.forEach(m => sfGrid.insertAdjacentHTML('beforeend', koCard(m)));
  if (finalGrid) finalGrid.innerHTML = koCard(finalMatch, true);
}

/* ===========================
   PHASE NAV HIGHLIGHT ON SCROLL
   =========================== */

function initPhaseNav() {
  const sections = ['grupos','cuartos','semis','final'];
  const btns     = document.querySelectorAll('.phase-btn');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        btns.forEach(b => b.classList.remove('active'));
        const active = document.querySelector(`.phase-btn[data-phase="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

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
loadResultsFromSheet().then(() => {
  renderGroups();
  renderKnockout();
  initPhaseNav();
});
