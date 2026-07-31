/* ===========================
   DATA
   Los equipos y los partidos (groupTeams / groupMatches) viven en
   matches-data.js, compartido con la página de Resultados.
   =========================== */

const mainSponsors = [
  { name:'Aceites Rosan',         img:'logos/aceitesrosan-01.png'    },
  { name:'Alba',                  img:'logos/alba-01.png'            },
  { name:'Ana Calleja',           img:'logos/anacalleja-01.png'      },
  { name:'Aranda',                img:'logos/aranda-01.png'          },
  { name:'Arroyo',                img:'logos/ARROYO-01.png'          },
  { name:'El Montoreño',          img:'logos/elmontoreño-01.png'     },
  { name:'Marcos',                img:'logos/marcos-01.png'          },
  { name:'Muntur',                img:'logos/muntur-01.png'          },
  { name:'Navas',                 img:'logos/navas-01.png'           },
  { name:'Neumáticos Leiva',      img:'logos/neumaticosleiva-01.png' },
  { name:'Óptica Millenium',      img:'logos/opticamillenium-01.png' },
  { name:'Puente Nuevo',          img:'logos/puente nuevo-01.png'    },
  { name:'Super Juguete',         img:'logos/superjuguete-01.png'    },
  { name:'Talleres Palma',        img:'logos/tallerespalma-01.png'   },
  { name:'Tu Batería',            img:'logos/tubateria-01.png'       },
];

const collabSponsors = [
  { name:'Cofradía Vera Crux', img:'logos/organiza-02.png'  },
  { name:'Ayto. Montoro',      img:'logos/organiza-03.png'  },
  { name:'Humildad',           img:'logos/humildad-01.png'  },
];

/* ===========================
   SPONSORS
   =========================== */

function logoItemHTML(s) {
  const inner = s.img
    ? `<img src="${s.img}" alt="${s.name}" class="logo-real-img">`
    : s.emoji || '';
  return `
    <div class="logo-item" title="${s.name}">
      <div class="logo-box">${inner}</div>
    </div>`;
}

function buildSponsors() {
  const mainEl   = document.getElementById('mainLogosTrack');
  const collabEl = document.getElementById('collabLogosTrack');

  /* Patrocinadores: ocultar sección si no hay logos aún */
  if (mainEl) {
    if (mainSponsors.length === 0) {
      mainEl.closest('.logos-band').style.display = 'none';
    } else {
      const html  = mainSponsors.map(logoItemHTML).join('');
      const reps  = Math.max(8, Math.ceil(1920 / (mainSponsors.length * 220)));
      const block = html.repeat(reps);
      mainEl.innerHTML = block + block;
    }
  }

  /* Colaboradores: siempre visible */
  if (collabEl && collabSponsors.length > 0) {
    const html  = collabSponsors.map(logoItemHTML).join('');
    const reps  = Math.max(8, Math.ceil(1920 / (collabSponsors.length * 170)));
    const block = html.repeat(reps);
    collabEl.innerHTML = block + block;
  }
}

/* ===========================
   STANDINGS
   =========================== */

function calcStandings() {
  const stats = {};
  Object.values(groupTeams).flat().forEach(t => {
    stats[t.slot] = { slot:t.slot, name:t.name, shield:t.shield, pj:0, g:0, e:0, p:0, gf:0, gc:0 };
  });

  groupMatches.filter(m => m.status === 'done').forEach(m => {
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

function buildStandings() {
  const tbody = document.getElementById('standingsBody');
  if (!tbody) return;

  const rows = calcStandings();

  tbody.innerHTML = rows.map((s, i) => {
    const pos  = i + 1;
    const zone = pos === 1 ? 'zone-top' : pos <= 3 ? 'zone-top-2' : pos >= rows.length ? 'zone-bottom' : '';
    const dgCls = s.dg > 0 ? 'dg-pos' : s.dg < 0 ? 'dg-neg' : '';
    const rankCls = pos <= 3 ? `rank-${pos}` : '';

    return `
      <tr class="${zone} ${rankCls}">
        <td><span class="rank-badge">${pos}</span></td>
        <td class="col-team">
          <div class="team-cell">
            <img class="team-badge" src="${s.shield}" alt="Escudo ${s.name}">
            <span>${s.name}</span>
          </div>
        </td>
        <td>${s.pj}</td>
        <td>${s.g}</td>
        <td>${s.e}</td>
        <td>${s.p}</td>
        <td>${s.gf}</td>
        <td>${s.gc}</td>
        <td class="${dgCls}">${s.dg > 0 ? '+' : ''}${s.dg}</td>
        <td class="col-pts">${s.pts}</td>
      </tr>
    `;
  }).join('');
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

buildSponsors();
loadResultsFromSheet().then(buildStandings);



