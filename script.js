// Theme toggle, mobile menu and the footer year; the page works without this script.
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const systemDark = matchMedia('(prefers-color-scheme: dark)');

function savedTheme() {
  try { return localStorage.getItem('theme'); } catch { return null; }
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  // Browser bar colour follows the page, not just the device setting.
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.content = theme === 'dark' ? '#07192f' : '#fbf8f1';
  });
}

applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

themeButton.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', next); } catch { /* private mode: still switch for this visit */ }
  applyTheme(next);
});

// With no saved choice, follow the device when it changes (e.g. dark at sunset).
systemDark.addEventListener('change', (e) => {
  if (!savedTheme()) applyTheme(e.matches ? 'dark' : 'light');
});

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

function setOpen(open) {
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
}

toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

document.getElementById('year').textContent = String(new Date().getFullYear());
