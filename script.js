/* ===========================
   DATA
   =========================== */

/* Cada slide puede tener:
   - img: 'images/nombre.jpg'   ← añadir cuando haya imagen real
   - gradient: fondo CSS de reserva (siempre activo; imagen encima si se especifica)
   Para añadir imagen real: img: 'images/noticia1.jpg'
*/
const newsItems = [
  {
    tag: 'noticia', tagLabel: 'Evento Oficial',
    headline: 'XV Maratón Cofrade de Fútbol Sala · Montoro 2026',
    desc: '📅 31 de julio y 1 de agosto de 2026  ·  📍 Polideportivo Municipal de Montoro (Córdoba)',
    img: 'images/banner-maraton.jpg',
    gradient: 'linear-gradient(135deg, #020508 0%, #040a10 100%)',
  },
  {
    tag: 'noticia', tagLabel: 'Preinscripción',
    headline: '⚠️ Preinscripción abierta hasta el 22 de junio',
    desc: 'Rellena el formulario antes del 22 de junio y abona 50 € por Bizum para reservar tu plaza. ¡No te quedes fuera!',
    img: 'images/banner-inscripciones.jpg',
    gradient: 'linear-gradient(135deg, #080010 0%, #0c0018 100%)',
  },
];

const tickerItems = [
  '⚽ Preinscripción abierta hasta el 22 de junio — ¡Apunta tu equipo!',
  '📍 Polideportivo Municipal de Montoro (Córdoba) · 31 Jul – 1 Ago 2026',
  '🏛️ Organiza: Cofradía de la Santa Vera Crux y Santiago Apóstol',
  '🤝 Colabora: Excmo. Ayuntamiento de Montoro',
  '🎯 72 horas de fútbol sala · 12 equipos · 4 grupos · 1 campeón',
];

const teamColors = [
  '#e53935','#1e88e5','#43a047','#fb8c00',
  '#8e24aa','#00acc1','#f4511e','#6d4c41',
  '#00897b','#c0ca33','#5e35b1','#e91e63'
];

const teams = [
  { id:1,  name:'Equipo 1',  short:'E1'  },
  { id:2,  name:'Equipo 2',  short:'E2'  },
  { id:3,  name:'Equipo 3',  short:'E3'  },
  { id:4,  name:'Equipo 4',  short:'E4'  },
  { id:5,  name:'Equipo 5',  short:'E5'  },
  { id:6,  name:'Equipo 6',  short:'E6'  },
  { id:7,  name:'Equipo 7',  short:'E7'  },
  { id:8,  name:'Equipo 8',  short:'E8'  },
  { id:9,  name:'Equipo 9',  short:'E9'  },
  { id:10, name:'Equipo 10', short:'E10' },
  { id:11, name:'Equipo 11', short:'E11' },
  { id:12, name:'Equipo 12', short:'E12' },
].map((t, i) => ({ ...t, color: teamColors[i] }));

const matches = [];

const mainSponsors = [
  { name:'Aceites Rosan',         img:'logos/aceitesrosan-01.png'    },
  { name:'Ana Calleja',           img:'logos/anacalleja-01.png'      },
  { name:'Aranda',                img:'logos/aranda-01.png'          },
  { name:'El Montoreño',          img:'logos/elmontoreño-01.png'     },
  { name:'Navas',                 img:'logos/navas-01.png'           },
  { name:'Neumáticos Leiva',      img:'logos/neumaticosleiva-01.png' },
  { name:'Óptica Millenium',      img:'logos/opticamillenium-01.png' },
  { name:'Super Juguete',         img:'logos/superjuguete-01.png'    },
  { name:'Tu Batería',            img:'logos/tubateria-01.png'       },
];

const collabSponsors = [
  { name:'Cofradía Vera Crux', img:'logos/organiza-02.png' },
  { name:'Ayto. Montoro',      img:'logos/organiza-03.png' },
];

/* ===========================
   IMAGE CAROUSEL
   =========================== */

const SLIDE_DURATION = 5500; // ms per slide

let currentSlide = 0;
let slideTimer;
let progressTimer;
let progressStart;

function buildCarousel() {
  const track  = document.getElementById('cTrack');
  const dotsEl = document.getElementById('cDots');
  if (!track || !dotsEl) return;

  /* Build slides */
  track.innerHTML = newsItems.map(n => {
    const bgStyle = n.img
      ? `background-image: url('${n.img}'), ${n.gradient}; background-size: cover;`
      : `background: ${n.gradient};`;
    return `
      <div class="c-slide" style="${bgStyle}">
        <div class="c-slide-content">
          <span class="c-tag ${n.tag}">${n.tagLabel}</span>
          <h2 class="c-headline">${n.headline}</h2>
          <p class="c-desc">${n.desc}</p>
        </div>
      </div>`;
  }).join('');

  /* Build dots */
  dotsEl.innerHTML = newsItems.map((_, i) =>
    `<button class="c-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Slide ${i+1}"></button>`
  ).join('');

  dotsEl.querySelectorAll('.c-dot').forEach(d =>
    d.addEventListener('click', () => goToSlide(Number(d.dataset.i)))
  );

  /* Arrow buttons */
  document.getElementById('cPrev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('cNext')?.addEventListener('click', () => goToSlide(currentSlide + 1));

  /* Touch/swipe */
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) goToSlide(dx < 0 ? currentSlide + 1 : currentSlide - 1);
  });

  startTimer();
}

function goToSlide(n) {
  const total = newsItems.length;
  currentSlide = ((n % total) + total) % total;

  /* Move track */
  document.getElementById('cTrack').style.transform = `translateX(-${currentSlide * 100}%)`;

  /* Animate content of new slide */
  const slides = document.querySelectorAll('.c-slide');
  slides.forEach((s, i) => {
    const content = s.querySelector('.c-slide-content');
    if (content) {
      content.style.animation = 'none';
      if (i === currentSlide) {
        requestAnimationFrame(() => {
          content.style.animation = '';
        });
      }
    }
  });

  /* Update dots */
  document.querySelectorAll('.c-dot').forEach((d, i) =>
    d.classList.toggle('active', i === currentSlide)
  );

  resetTimer();
}

function startTimer() {
  /* Progress bar */
  const bar = document.getElementById('cProgressBar');
  if (bar) {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      bar.style.transition = `width ${SLIDE_DURATION}ms linear`;
      bar.style.width = '100%';
    });
  }
  slideTimer = setTimeout(() => goToSlide(currentSlide + 1), SLIDE_DURATION);
}

function resetTimer() {
  clearTimeout(slideTimer);
  startTimer();
}

/* ===========================
   TICKER
   =========================== */

function buildTicker() {
  const el = document.getElementById('tickerContent');
  if (!el) return;
  const text = tickerItems.join('   ·   ');
  el.textContent = text + '   ·   ' + text;
}

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
  teams.forEach(t => {
    stats[t.id] = { id:t.id, pj:0, g:0, e:0, p:0, gf:0, gc:0 };
  });

  matches.filter(m => m.done).forEach(m => {
    const h = stats[m.home], a = stats[m.away];
    h.pj++; a.pj++;
    h.gf += m.hs; h.gc += m.as;
    a.gf += m.as; a.gc += m.hs;
    if (m.hs > m.as)      { h.g++; a.p++; }
    else if (m.hs < m.as) { a.g++; h.p++; }
    else                  { h.e++; a.e++; }
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
    const team = teams.find(t => t.id === s.id);
    const zone = pos === 1 ? 'zone-top' : pos <= 3 ? 'zone-top-2' : pos >= rows.length ? 'zone-bottom' : '';
    const dgCls = s.dg > 0 ? 'dg-pos' : s.dg < 0 ? 'dg-neg' : '';
    const rankCls = pos <= 3 ? `rank-${pos}` : '';

    return `
      <tr class="${zone} ${rankCls}">
        <td><span class="rank-badge">${pos}</span></td>
        <td class="col-team">
          <div class="team-cell">
            <div class="team-badge" style="background:${team.color};color:#000">${team.short}</div>
            <span>${team.name}</span>
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

buildCarousel();
buildTicker();
buildSponsors();
buildStandings();



