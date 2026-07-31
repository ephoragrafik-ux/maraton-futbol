/* ===========================
   DATOS COMPARTIDOS DE PARTIDOS
   Usado por index.html (tabla de clasificación) y resultados.html.

   Los resultados (goles y estado) se pueden actualizar sin tocar
   código: se cargan desde un Google Sheet publicado como CSV.
   Ver SHEET_CSV_URL más abajo.
   =========================== */

const GROUP_COLORS = { 1:'#69f0ae', 2:'#82b1ff', 3:'#ffcc80', 4:'#f48fb1' };

/* ---- GRUPO data (slot → equipo real) ---- */
const groupTeams = {
  1: [
    { slot:'A', name:'Imperio Romano',        color:'#0000FD', shield:'kits/escudo-romanos.png' },
    { slot:'B', name:'Grupo Joven Vera Crux', color:'#B5DCCA', shield:'kits/escudo-grupo-joven.png' },
    { slot:'C', name:'Jesús Caído',           color:'#0d1b4b', shield:'kits/escudo-jesus-caido.png' },
  ],
  2: [
    { slot:'D', name:'Santo Entierro',        color:'#1a1a1a', shield:'kits/escudo-santo-entierro.png' },
    { slot:'E', name:'Resucitado',            color:'#c62828', shield:'kits/escudo-resucitado.png' },
    { slot:'F', name:'Costaleras Amor y Paz', color:'#FB3D8B', shield:'kits/escudo-borriquita.png' },
  ],
  3: [
    { slot:'G', name:'Humildad',              color:'#800020', shield:'kits/humildad-escudo-01.png' },
    { slot:'H', name:'Flagelación',           color:'#6F1749', shield:'kits/escudo-flagelacion.png' },
    { slot:'I', name:'Padre Jesús',           color:'#6a1b9a', shield:'kits/pjes.png' },
  ],
  4: [
    { slot:'J', name:'Vera Crux',             color:'#174C27', shield:'kits/escudo-vera-crux.png' },
    { slot:'K', name:'Virgen de la Cabeza',   color:'#8AC7E4', shield:'kits/escudo-cabeza.png' },
    { slot:'L', name:'Los Estudiantes',       color:'#D2CC98', shield:'kits/escudo-misericordia.png' },
  ],
};

/* ---- GROUP MATCHES (3 por grupo, liguilla) ---- */
const groupMatches = [
  // Grupo 1
  { id:'g1m1', group:1, homeSlot:'A', awaySlot:'B', homeScore:null, awayScore:null, date:'31 Jul', time:'21:00', status:'pending' },
  { id:'g1m2', group:1, homeSlot:'A', awaySlot:'C', homeScore:null, awayScore:null, date:'1 Ago', time:'01:00', status:'pending' },
  { id:'g1m3', group:1, homeSlot:'B', awaySlot:'C', homeScore:null, awayScore:null, date:'1 Ago', time:'05:00', status:'pending' },
  // Grupo 2
  { id:'g2m1', group:2, homeSlot:'D', awaySlot:'E', homeScore:null, awayScore:null, date:'31 Jul', time:'22:00', status:'pending' },
  { id:'g2m2', group:2, homeSlot:'D', awaySlot:'F', homeScore:null, awayScore:null, date:'1 Ago', time:'02:00', status:'pending' },
  { id:'g2m3', group:2, homeSlot:'E', awaySlot:'F', homeScore:null, awayScore:null, date:'1 Ago', time:'06:00', status:'pending' },
  // Grupo 3
  { id:'g3m1', group:3, homeSlot:'G', awaySlot:'H', homeScore:null, awayScore:null, date:'31 Jul', time:'23:00', status:'pending' },
  { id:'g3m2', group:3, homeSlot:'G', awaySlot:'I', homeScore:null, awayScore:null, date:'1 Ago', time:'03:00', status:'pending' },
  { id:'g3m3', group:3, homeSlot:'H', awaySlot:'I', homeScore:null, awayScore:null, date:'1 Ago', time:'07:00', status:'pending' },
  // Grupo 4
  { id:'g4m1', group:4, homeSlot:'J', awaySlot:'K', homeScore:null, awayScore:null, date:'1 Ago', time:'00:00', status:'pending' },
  { id:'g4m2', group:4, homeSlot:'J', awaySlot:'L', homeScore:null, awayScore:null, date:'1 Ago', time:'04:00', status:'pending' },
  { id:'g4m3', group:4, homeSlot:'K', awaySlot:'L', homeScore:null, awayScore:null, date:'1 Ago', time:'08:00', status:'pending' },
];

/* ---- KNOCKOUT MATCHES ---- */
const qfMatches = [
  { id:'qf1', label:'Cuarto de Final 1', home:'1º Grupo 1', homeSub:'', away:'2º Grupo 2', awaySub:'', homeScore:null, awayScore:null, date:'1 Ago', time:'21:00', status:'pending' },
  { id:'qf2', label:'Cuarto de Final 2', home:'1º Grupo 2', homeSub:'', away:'2º Grupo 1', awaySub:'', homeScore:null, awayScore:null, date:'1 Ago', time:'22:00', status:'pending' },
  { id:'qf3', label:'Cuarto de Final 3', home:'1º Grupo 3', homeSub:'', away:'2º Grupo 4', awaySub:'', homeScore:null, awayScore:null, date:'1 Ago', time:'23:00', status:'pending' },
  { id:'qf4', label:'Cuarto de Final 4', home:'1º Grupo 4', homeSub:'', away:'2º Grupo 3', awaySub:'', homeScore:null, awayScore:null, date:'2 Ago', time:'00:00', status:'pending' },
];

const sfMatches = [
  { id:'sf1', label:'Semifinal 1', home:'Ganador CF1', homeSub:'', away:'Ganador CF3', awaySub:'', homeScore:null, awayScore:null, date:'2 Ago', time:'01:00', status:'pending' },
  { id:'sf2', label:'Semifinal 2', home:'Ganador CF2', homeSub:'', away:'Ganador CF4', awaySub:'', homeScore:null, awayScore:null, date:'2 Ago', time:'02:00', status:'pending' },
];

const finalMatch = {
  id:'f1', label:'Gran Final',
  home:'Ganador SF1', homeSub:'',
  away:'Ganador SF2', awaySub:'',
  homeScore:null, awayScore:null,
  date:'2 Ago', time:'03:30', status:'pending',
};

const allMatches = [...groupMatches, ...qfMatches, ...sfMatches, finalMatch];

/* ===========================
   CARGA DE RESULTADOS DESDE GOOGLE SHEETS
   Archivo → Compartir → Publicar en la web → elige la hoja de
   resultados → formato CSV → pega aquí la URL que te da Google.
   Columnas esperadas (una fila por partido):
     id | homeScore | awayScore | status
   status debe ser: pending, live o done
   =========================== */

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIFGI_ZJ7ubflsoFtSpqpVqNyCxyqdpvmjjypKVvpmxxGrqihL_gTYOX7OCHHHRk-_cfgfsCqsqnXv/pub?gid=0&single=true&output=csv';

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const cells = line.split(',').map(c => c.trim());
    const row = {};
    header.forEach((h, i) => { row[h] = cells[i]; });
    return row;
  });
}

async function loadResultsFromSheet() {
  if (!SHEET_CSV_URL) return; // sin URL configurada: se quedan los datos locales

  try {
    const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = parseCSV(await res.text());

    rows.forEach(row => {
      const match = allMatches.find(m => m.id === row.id);
      if (!match) return;
      const hs = row.homescore === '' ? null : Number(row.homescore);
      const as = row.awayscore === '' ? null : Number(row.awayscore);
      match.homeScore = Number.isNaN(hs) ? null : hs;
      match.awayScore = Number.isNaN(as) ? null : as;
      match.status = row.status || 'pending';
    });
  } catch (err) {
    console.warn('No se pudieron cargar los resultados del Google Sheet, se muestran los datos locales.', err);
  }
}
