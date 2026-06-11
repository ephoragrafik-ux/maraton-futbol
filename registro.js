/* ===========================
   BASES ACCORDION
   =========================== */
function openBases() {
  const body    = document.getElementById('basesBody');
  const chevron = document.getElementById('basesChevron');
  const btnText = document.getElementById('basesBtnText');
  body.classList.add('open');
  chevron.classList.add('open');
  btnText.textContent = 'Ocultar bases';
  setTimeout(() => {
    document.getElementById('basesToggle').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

document.getElementById('basesToggle').addEventListener('click', function(e) {
  if (e.target.closest('a')) return;
  const body    = document.getElementById('basesBody');
  const chevron = document.getElementById('basesChevron');
  const btnText = document.getElementById('basesBtnText');
  const isOpen  = body.classList.toggle('open');
  chevron.classList.toggle('open', isOpen);
  btnText.textContent = isOpen ? 'Ocultar bases' : 'Ver bases completas';
});

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
   FORM SUBMIT → N8N
   =========================== */
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyO_To8CAm7gYbXBtgD3J2nQ6x1ShryYPDW2jpbiBR2hBMxrbIk769s78trA6fVR2wh/exec';

document.getElementById('regForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!this.checkValidity()) {
    this.reportValidity();
    return;
  }

  const submitBtn = this.querySelector('.btn-submit');
  submitBtn.textContent = 'Enviando…';
  submitBtn.disabled = true;

  const payload = {
    equipo:      document.getElementById('teamName').value.trim(),
    cofradia:    document.getElementById('cofradia').value.trim(),
    responsable: document.getElementById('responsable').value.trim(),
    telefono:    document.getElementById('phone').value.trim(),
    email:       document.getElementById('email').value.trim(),
    fecha_inscripcion: new Date().toISOString(),
  };

  try {
    await fetch(FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });

    this.classList.add('hidden');
    document.getElementById('regSuccess').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    console.error('Error al enviar inscripción:', err);
    submitBtn.textContent = 'Enviar inscripción →';
    submitBtn.disabled = false;
    alert('Ha ocurrido un error al enviar la inscripción. Por favor, inténtalo de nuevo o contacta con la organización.');
  }
});
