// Theme, menu, studio, spotlight, quick search and the project brief.
// The page reads fine without this script; everything here is an enhancement.
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Theme ---------- */
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
    m.content = theme === 'dark' ? '#061427' : '#fbf8f1';
  });
}

// Switch with a circle growing out of the button, where View Transitions exist.
function switchTheme(theme, origin) {
  if (!document.startViewTransition || reduceMotion.matches) { applyTheme(theme); return; }
  if (origin) {
    const r = origin.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    root.style.setProperty('--vt-x', `${x}px`);
    root.style.setProperty('--vt-y', `${y}px`);
    root.style.setProperty('--vt-r', `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
  }
  document.startViewTransition(() => applyTheme(theme));
}

function toggleTheme(origin) {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', next); } catch { /* private mode: still switch for this visit */ }
  switchTheme(next, origin);
}

applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
themeButton.addEventListener('click', () => toggleTheme(themeButton));

// With no saved choice, follow the device when it changes (e.g. dark at sunset).
systemDark.addEventListener('change', (e) => {
  if (!savedTheme()) applyTheme(e.matches ? 'dark' : 'light');
});

/* ---------- Mobile menu ---------- */
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

function setMenu(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
}
navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('click', (e) => {
  if (nav.classList.contains('open') && !e.target.closest('.header-pill')) setMenu(false);
});

/* ---------- Current section in the nav ---------- */
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => {
      const on = a.getAttribute('href') === `#${entry.target.id}`;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => {
  const section = document.querySelector(a.getAttribute('href'));
  if (section) sectionObserver.observe(section);
});

/* ---------- Reveal fallback (browsers without scroll-driven animations) ---------- */
if (!CSS.supports('animation-timeline: view()')) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

/* ---------- Spotlight that follows the pointer on cards ---------- */
document.addEventListener('pointermove', (e) => {
  const card = e.target.closest?.('.card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
}, { passive: true });

/* ---------- Studio: example solutions ---------- */
// Illustrative businesses (the page says so). The preview is the customer-facing part; modules and log
// cover the whole solution behind it. Each is the same building blocks, shaped differently.
const SITES = {
  tea: {
    url: 'glenmist.example', name: 'Glenmist Tea', cart: '2',
    colors: { accent: '#2f6b3a', bg: '#f4f1e6', ink: '#1d2a1f', soft: '#e4ead9' },
    kicker: 'Single estate · Darjeeling',
    title: 'First flush, picked this spring.',
    sub: 'Garden-fresh Darjeeling tea, packed at the estate and shipped across India.',
    cta: 'Shop the harvest',
    items: [['First Flush', '₹780 · 100 g', 95], ['Muscatel', '₹920 · 100 g', 40], ['Autumnal', '₹640 · 100 g', 20]],
    modules: ['Online store', 'UPI & cards', 'GST invoices', 'Stock & dispatch', 'Sales reports'],
    log: ['Catalogue and stock kept in step with packing', 'UPI and card checkout connected', 'GST invoice sent with every order', 'Dispatch list and sales report each morning'],
  },
  stay: {
    url: 'kanchanview.example', name: 'Kanchan View', cart: '1',
    colors: { accent: '#b4532a', bg: '#fbf3ec', ink: '#2b1a12', soft: '#f3e2d4' },
    kicker: 'Homestay · 10 min from Chowrasta',
    title: 'Wake up to Kanchenjunga.',
    sub: 'Four rooms, home-cooked meals and a view of the range from every window.',
    cta: 'Check dates',
    items: [['Sunrise Room', '₹2,400 / night', 25], ['Family Suite', '₹3,800 / night', 200], ['Attic Room', '₹1,900 / night', 330]],
    modules: ['Booking calendar', 'Advance payment', 'Housekeeping list', 'Guest register', 'Nepali & English'],
    log: ['Rooms, rates and seasons added', 'Calendar stops double bookings', 'Advance paid by UPI on booking', 'Housekeeping and guest register kept for staff'],
  },
  cafe: {
    url: 'mallroadbakery.example', name: 'Mall Road Bakery', cart: '3',
    colors: { accent: '#9c3d54', bg: '#fff6f2', ink: '#2e1218', soft: '#f8e1e2' },
    kicker: 'Baked every morning',
    title: 'Fresh from the oven at seven.',
    sub: 'Order ahead for pickup, or have it brought to your door in town.',
    cta: 'Order now',
    items: [['Ginger honey cake', '₹420', 30], ['Cheese buns', '₹60 each', 45], ['Chhurpi cookies', '₹180 / box', 15]],
    modules: ['Menu & ordering', 'Pickup slots', 'Kitchen screen', 'Ingredient stock', 'Daily takings'],
    log: ['Menu with photos and daily specials', 'Orders show on the kitchen screen', 'Ingredients counted down as orders come', 'Paid by UPI, takings totalled each night'],
  },
  school: {
    url: 'hillsideacademy.example', name: 'Hillside Academy', cart: '!',
    colors: { accent: '#1f4e8c', bg: '#f2f5fb', ink: '#0f1d33', soft: '#dfe7f5' },
    kicker: 'For parents and students',
    title: 'Admissions open for 2027–28.',
    sub: 'Notices, fees and results for parents, in Nepali and English, on the web and Android.',
    cta: 'Apply online',
    items: [['Pay term fees', 'UPI or card', 215], ['Notice board', '3 new notices', 260], ['Results', 'Class X', 160]],
    modules: ['Parent app', 'Fee collection', 'Attendance', 'Results & records', 'Notices & SMS'],
    log: ['Classes, staff and parents imported', 'Fees collected online with receipts', 'Attendance and results kept by teachers', 'Android app published on Google Play'],
  },
};

const studio = document.querySelector('.studio');
if (studio) {
  const tabs = [...studio.querySelectorAll('[role="tab"]')];
  const panel = studio.querySelector('[role="tabpanel"]');
  const site = studio.querySelector('[data-f="site"]');
  const field = (name) => studio.querySelector(`[data-f="${name}"]`);
  const CYCLE = 6000;
  let current = 'tea';
  let timer = null;
  let auto = !reduceMotion.matches;
  let visible = false;

  function listItems(el, items, make) {
    el.replaceChildren(...items.map((item) => {
      const li = document.createElement('li');
      make(li, item);
      return li;
    }));
  }

  function render(key) {
    const s = SITES[key];
    field('url').textContent = s.url;
    field('name').textContent = s.name;
    field('cart').textContent = s.cart;
    field('kicker').textContent = s.kicker;
    field('title').textContent = s.title;
    field('sub').textContent = s.sub;
    field('cta').textContent = s.cta;
    site.style.setProperty('--s-accent', s.colors.accent);
    site.style.setProperty('--s-bg', s.colors.bg);
    site.style.setProperty('--s-ink', s.colors.ink);
    site.style.setProperty('--s-soft', s.colors.soft);
    listItems(field('items'), s.items, (li, [name, meta, hue]) => {
      const swatch = document.createElement('i');
      swatch.style.setProperty('--h', hue);
      const b = document.createElement('b');
      b.textContent = name;
      const span = document.createElement('span');
      span.textContent = meta;
      li.append(swatch, b, span);
    });
    listItems(field('modules'), s.modules, (li, text) => { li.textContent = text; });
    const log = field('log');
    listItems(log, s.log, (li, text) => { li.textContent = text; });
    // Restart the staggered "building" animations.
    for (const el of [site, log]) {
      el.classList.remove('building', 'typing');
      void el.offsetWidth;
    }
    site.classList.add('building');
    log.classList.add('typing');
  }

  function select(key, { focus = false } = {}) {
    if (key === current) return;
    current = key;
    tabs.forEach((t) => {
      const on = t.dataset.site === key;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      t.classList.remove('timing');
      if (on) {
        panel.setAttribute('aria-labelledby', t.id);
        if (focus) t.focus();
      }
    });
    if (document.startViewTransition && !reduceMotion.matches) document.startViewTransition(() => render(key));
    else render(key);
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    const tab = tabs.find((t) => t.dataset.site === current);
    tab.classList.remove('timing');
    if (!auto || !visible) return;
    void tab.offsetWidth;
    tab.style.setProperty('--cycle', `${CYCLE}ms`);
    tab.classList.add('timing');
    timer = setTimeout(() => {
      const i = tabs.findIndex((t) => t.dataset.site === current);
      select(tabs[(i + 1) % tabs.length].dataset.site);
    }, CYCLE);
  }

  // Choosing a business yourself stops the tour.
  tabs.forEach((t) => t.addEventListener('click', () => { auto = false; select(t.dataset.site); schedule(); }));
  studio.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let next = null;
    if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === 'Home') next = tabs[0];
    if (e.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    auto = false;
    select(next.dataset.site, { focus: true });
  });

  // Only tour while the studio is on screen.
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }, { threshold: 0.35 }).observe(studio);
}

/* ---------- Quick search (Ctrl/⌘ K) ---------- */
const cmdk = document.getElementById('cmdk');
const cmdkInput = cmdk.querySelector('input');
const cmdkList = cmdk.querySelector('.cmdk-list');
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
if (isMac) document.querySelectorAll('.kbd-mod').forEach((k) => { k.textContent = '⌘'; });

const goTo = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
const COMMANDS = [
  { label: 'Start a project', icon: '✦', kind: 'Action', run: goTo('contact'), keys: 'contact hire quote email brief' },
  { label: 'See what we build', icon: '▦', kind: 'Section', run: goTo('studio'), keys: 'studio examples demo' },
  { label: 'Services', icon: '⚙', kind: 'Section', run: goTo('services'), keys: 'solutions business systems website store payments gst stock bookings app android ocr hosting nepali english languages' },
  { label: 'How we work', icon: '→', kind: 'Section', run: goTo('process'), keys: 'process steps' },
  { label: 'Pushtakalaya', icon: '📚', kind: 'Section', run: goTo('pushtakalaya'), keys: 'books reader library पुस्तकालय' },
  { label: 'Research', icon: '🔬', kind: 'Section', run: goTo('research'), keys: 'ai language nepali ocr data' },
  { label: 'About us', icon: '⛰', kind: 'Section', run: goTo('about'), keys: 'darjeeling queen of the hills india world company' },
  { label: 'Switch theme', icon: '◐', kind: 'Action', run: () => toggleTheme(null), keys: 'dark light mode' },
  { label: 'Open the Pushtakalaya beta', icon: '↗', kind: 'Link', run: () => window.open('https://beta.pushtakalaya.com', '_blank', 'noopener'), keys: 'read books' },
  { label: 'Publish with us', icon: '↗', kind: 'Link', run: () => window.open('https://beta-portal.pushtakalaya.com', '_blank', 'noopener'), keys: 'author publisher portal' },
  { label: 'Email contact@auropex.com', icon: '✉', kind: 'Link', run: () => { location.href = 'mailto:contact@auropex.com'; }, keys: 'mail write' },
  { label: 'Copy email address', icon: '⧉', kind: 'Action', run: () => navigator.clipboard?.writeText('contact@auropex.com'), keys: 'clipboard' },
];
let cmdResults = COMMANDS;
let cmdIndex = 0;

function renderCommands() {
  const q = cmdkInput.value.trim().toLowerCase();
  cmdResults = COMMANDS.filter((c) => !q || `${c.label} ${c.keys}`.toLowerCase().includes(q));
  cmdIndex = Math.min(cmdIndex, Math.max(cmdResults.length - 1, 0));
  if (!cmdResults.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Nothing matches. Try “store” or “Nepali”.';
    cmdkList.replaceChildren(li);
    cmdkInput.removeAttribute('aria-activedescendant');
    return;
  }
  cmdkList.replaceChildren(...cmdResults.map((c, i) => {
    const li = document.createElement('li');
    li.id = `cmd-${i}`;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', String(i === cmdIndex));
    const ico = document.createElement('span');
    ico.className = 'ico';
    ico.setAttribute('aria-hidden', 'true');
    ico.textContent = c.icon;
    const kind = document.createElement('small');
    kind.textContent = c.kind;
    li.append(ico, c.label, kind);
    li.addEventListener('click', () => runCommand(i));
    li.addEventListener('pointermove', () => { if (cmdIndex !== i) { cmdIndex = i; highlight(); } });
    return li;
  }));
  cmdkInput.setAttribute('aria-activedescendant', `cmd-${cmdIndex}`);
}

function highlight() {
  [...cmdkList.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === cmdIndex)));
  cmdkInput.setAttribute('aria-activedescendant', `cmd-${cmdIndex}`);
  cmdkList.children[cmdIndex]?.scrollIntoView({ block: 'nearest' });
}

function runCommand(i) {
  const c = cmdResults[i];
  if (!c) return;
  cmdk.close();
  c.run();
}

function openCmdk() {
  if (cmdk.open) return;
  setMenu(false);
  cmdkInput.value = '';
  cmdIndex = 0;
  renderCommands();
  cmdk.showModal();
  cmdkInput.focus();
}

document.querySelector('.cmdk-open').addEventListener('click', openCmdk);
cmdkInput.addEventListener('input', () => { cmdIndex = 0; renderCommands(); });
cmdkInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); cmdIndex = (cmdIndex + 1) % Math.max(cmdResults.length, 1); highlight(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); cmdIndex = (cmdIndex - 1 + cmdResults.length) % Math.max(cmdResults.length, 1); highlight(); }
  if (e.key === 'Enter') { e.preventDefault(); runCommand(cmdIndex); }
});
// A click on the backdrop (the dialog itself, outside the box) closes it.
cmdk.addEventListener('click', (e) => { if (e.target === cmdk) cmdk.close(); });

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (cmdk.open) cmdk.close(); else openCmdk(); return; }
  if (e.key === 'Escape') setMenu(false);
  const typing = e.target.closest?.('input, textarea, [contenteditable]');
  if (e.key === '/' && !typing && !cmdk.open) { e.preventDefault(); openCmdk(); }
});

/* ---------- Project brief → email ---------- */
const brief = document.getElementById('brief');
brief.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(brief);
  const needs = data.getAll('need');
  const name = String(data.get('name') || '').trim();
  const business = String(data.get('business') || '').trim();
  const message = String(data.get('message') || '').trim();
  const subject = needs.length ? `Project enquiry: ${needs.join(', ')}` : 'Project enquiry';
  const details = [
    needs.length ? `Interested in: ${needs.join(', ')}` : '',
    business ? `Business: ${business}` : '',
  ].filter(Boolean);
  const body = [
    'Hello Auropex,',
    message || 'I would like to talk about a project.',
    details.join('\n'),
    name,
  ].filter(Boolean).join('\n\n');
  location.href = `mailto:contact@auropex.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.getElementById('year').textContent = String(new Date().getFullYear());
