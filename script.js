// PERSONALIZACIÓN: cambia esta fecha si el inicio de su relación fue diferente.
const relationshipStart = new Date(2025, 4, 17, 0, 0, 0); // 17 de marzo de 2026

// Cuando quieras colocar tu dedicatoria, cambia los párrafos dentro de
// <div id="letterBody"> en index.html. No necesitas editar este archivo.

const envelope = document.getElementById('envelopeButton');
const dialog = document.getElementById('letterDialog');
const closeButton = document.getElementById('closeDialog');
let openTimeout;
let lastFocus;

function openLetter() {
  if (dialog.classList.contains('visible') || envelope.classList.contains('opening')) return;
  lastFocus = document.activeElement;
  envelope.classList.add('opening');
  clearTimeout(openTimeout);
  openTimeout = setTimeout(() => {
    // Punto de salida: el papel que se asoma por el interior del sobre.
    const origin = envelope.querySelector('.envelope-paper').getBoundingClientRect();
    const page = dialog.querySelector('.letter-dialog');
    const destinationX = window.innerWidth / 2;
    const destinationY = window.innerHeight / 2;
    page.style.setProperty('--from-x', `${origin.left + origin.width / 2 - destinationX}px`);
    page.style.setProperty('--from-y', `${origin.top + origin.height / 2 - destinationY}px`);
    dialog.classList.add('visible');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('dialog-open');
    closeButton.focus({ preventScroll: true });
  }, 550);
}
function closeLetter() {
  clearTimeout(openTimeout);
  dialog.classList.remove('visible');
  dialog.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('dialog-open');
  window.setTimeout(() => envelope.classList.remove('opening'), 450);
  (lastFocus || envelope).focus({ preventScroll: true });
}
envelope.addEventListener('click', openLetter);
closeButton.addEventListener('click', closeLetter);
dialog.addEventListener('click', event => { if (event.target === dialog) closeLetter(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dialog.classList.contains('visible')) closeLetter();
  if (event.key === 'Tab' && dialog.classList.contains('visible')) {
    event.preventDefault();
    closeButton.focus();
  }
});

function updateCounter() {
  const now = new Date();
  const start = relationshipStart;
  if (now < start) {
    ['months','days','hours','minutes'].forEach(id => document.getElementById(id).textContent = '0');
    return;
  }
  // Meses calendario completos, respetando el día de aniversario.
  let months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
  let anchor = new Date(start.getFullYear(), start.getMonth() + months, start.getDate(), start.getHours(), start.getMinutes());
  if (anchor > now) { months--; anchor = new Date(start.getFullYear(), start.getMonth() + months, start.getDate(), start.getHours(), start.getMinutes()); }
  let rest = now - anchor;
  const days = Math.floor(rest / 86400000); rest %= 86400000;
  const hours = Math.floor(rest / 3600000); rest %= 3600000;
  const minutes = Math.floor(rest / 60000);
  Object.entries({months,days,hours,minutes}).forEach(([id,value]) => document.getElementById(id).textContent = value);
}
updateCounter();
setInterval(updateCounter, 30000);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const container = document.getElementById('floatingHearts');
  for (let i = 0; i < 24; i++) {
    const heart = document.createElement('span');
    heart.className = 'float-heart';
    heart.textContent = i % 4 === 0 ? '♡' : '♥';
    heart.style.left = `${(i * 47 + 11) % 100}%`;
    heart.style.setProperty('--size', `${12 + (i % 4) * 9}px`);
    heart.style.setProperty('--duration', `${12 + (i % 6) * 2.5}s`);
    heart.style.setProperty('--delay', `${-(i * 1.37)}s`);
    heart.style.setProperty('--drift', `${(i % 2 ? -1 : 1) * (25 + i * 2)}px`);
    container.appendChild(heart);
  }
}

// Reproductor oficial: se carga solo cuando la persona lo solicita.
const musicToggle = document.getElementById('musicToggle');
const spotifyPanel = document.getElementById('spotifyPanel');
musicToggle.addEventListener('click', () => {
  const opening = spotifyPanel.hidden;
  spotifyPanel.hidden = !opening;
  musicToggle.setAttribute('aria-expanded', String(opening));
  musicToggle.textContent = opening ? '♫ Ocultar reproductor' : '♫ Escuchar nuestra canción';
  if (opening) {
    const iframe = spotifyPanel.querySelector('iframe');
    if (!iframe.src) iframe.src = iframe.dataset.src;
  }
});
