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
// Illustrative businesses (the page says so). The preview is the dashboard its people run the business from;
// modules and log cover the whole solution around it (apps, payments, records).
// kpis: [label, value, note]; rows: [what, detail, status, tone ok|warn|info]; chart: bar heights 0–100.
const SOLUTIONS = {
  school: {
    url: 'erp.hillsideacademy.example', name: 'Hillside Academy', product: 'School management', view: "Principal's desk",
    colors: { accent: '#1f4e8c', bg: '#f2f5fb', ink: '#0f1d33', soft: '#dfe7f5' },
    nav: ['Dashboard', 'Students', 'Fees', 'Attendance', 'Exams', 'Staff'],
    title: 'Today at Hillside',
    kpis: [['Present today', '612 / 648', '94%'], ['Fees this term', '₹18.4L', '82% collected'], ['Board exams', 'Class X', 'from 3 March']],
    listTitle: 'Fee dues',
    rows: [['Pema Lama · IX B', '₹12,500', 'Due', 'warn'], ['Arjun Rai · VII A', '₹9,800', 'Paid', 'ok'], ['Sonam Bhutia · X A', '₹14,200', 'Reminded', 'info']],
    chartTitle: 'Attendance · this week', chart: [88, 94, 92, 96, 90, 94],
    modules: ['Admissions', 'Fees & receipts', 'Attendance', 'Exams & report cards', 'Timetable', 'Staff & payroll', 'Parent app'],
    log: ['Classes, staff and 648 students imported', 'Fees collected online with receipts', 'Teachers mark attendance on their phones', 'Report cards in the parent app on Google Play'],
  },
  fleet: {
    url: 'ops.teestatravels.example', name: 'Teesta Travels', product: 'Fleet management', view: 'Dispatch',
    colors: { accent: '#b4532a', bg: '#fbf5ef', ink: '#2b1a12', soft: '#f3e2d4' },
    nav: ['Dispatch', 'Vehicles', 'Drivers', 'Bookings', 'Fuel', 'Service'],
    title: 'Fleet on the road',
    kpis: [['On trips', '18 of 24', '6 free'], ['Bookings today', '41', '9 online'], ['Fuel this week', '₹62,300', '4% less']],
    listTitle: 'Live trips',
    rows: [['WB 76 · Bagdogra → Darjeeling', 'Sangay', 'On time', 'ok'], ['SK 01 · Gangtok → NJP', 'Tashi', '12 min late', 'warn'], ['WB 74 · Mirik round trip', 'Bikash', 'Boarding', 'info']],
    chartTitle: 'Trips · last 7 days', chart: [62, 70, 58, 74, 81, 96, 88],
    modules: ['Bookings', 'Dispatch board', 'GPS tracking', 'Driver app', 'Fuel & expenses', 'Service reminders', 'Permits & papers'],
    log: ['24 vehicles and 30 drivers added', 'Phone, web and agent bookings on one board', 'Drivers start and close trips in their app', 'Service and permit renewals flagged ahead'],
  },
  shop: {
    url: 'admin.glenmist.example', name: 'Glenmist Tea', product: 'E-commerce', view: 'Store admin',
    colors: { accent: '#2f6b3a', bg: '#f4f1e6', ink: '#1d2a1f', soft: '#e4ead9' },
    nav: ['Overview', 'Orders', 'Products', 'Inventory', 'Customers', 'Payouts'],
    title: 'Store overview',
    kpis: [['Orders today', '86', '14% up'], ['Revenue', '₹1.42L', '71% by UPI'], ['Low stock', '3 items', 'reorder sent']],
    listTitle: 'Recent orders',
    rows: [['#1042 · Pune', '₹1,840', 'Packed', 'info'], ['#1041 · Kolkata', '₹920', 'Delivered', 'ok'], ['#1040 · Dubai', '$38', 'In customs', 'warn']],
    chartTitle: 'Sales · last 7 days', chart: [54, 60, 66, 58, 72, 90, 84],
    modules: ['Storefront & app', 'Catalogue', 'UPI, cards & abroad', 'GST invoices', 'Inventory', 'Shipping & returns', 'Customer accounts', 'Reports'],
    log: ['Storefront, catalogue and app launched', 'Payments in rupees and from abroad', 'Stock synced with the packing house', 'Courier labels and tracking on every order'],
  },
  gym: {
    url: 'app.summitfitness.example', name: 'Summit Fitness', product: 'Gym membership', view: 'Front desk',
    colors: { accent: '#9c3d54', bg: '#fff6f2', ink: '#2e1218', soft: '#f8e1e2' },
    nav: ['Members', 'Check-ins', 'Plans', 'Classes', 'Trainers', 'Payments'],
    title: 'Front desk',
    kpis: [['Active members', '428', '22 new this month'], ['Check-ins today', '137', 'busiest 6–8 am'], ['Renewals due', '19', 'this week']],
    listTitle: 'Check-ins',
    rows: [['Riya Thapa', 'Quarterly', '6:42 am', 'ok'], ['Karma Sherpa', 'Monthly', 'Ends in 3 days', 'warn'], ['Anil Gurung', 'PT · Dawa', 'In session', 'info']],
    chartTitle: 'Check-ins · last 7 days', chart: [76, 84, 70, 88, 80, 52, 40],
    modules: ['Plans & renewals', 'QR check-in', 'Class booking', 'Trainer schedules', 'Reminders', 'Member app', 'Payments'],
    log: ['Members and plans moved off the paper register', 'QR check-in at the door', 'Renewal reminders by WhatsApp and SMS', 'Members book classes in the app'],
  },
  hospital: {
    url: 'his.mirikcare.example', name: 'Mirik Care Hospital', product: 'Hospital management', view: 'Reception',
    colors: { accent: '#0f7a6c', bg: '#f0f8f6', ink: '#0c2420', soft: '#d8eee9' },
    nav: ['OPD', 'Patients', 'Beds', 'Pharmacy', 'Lab', 'Billing'],
    title: 'OPD today',
    kpis: [['OPD visits', '164', '12 in queue'], ['Beds occupied', '38 / 50', '76%'], ['Lab reports', '52', '9 pending']],
    listTitle: 'Queue',
    rows: [['Token 41 · Dr Pradhan', 'General', 'In consult', 'info'], ['Token 42 · Dr Lepcha', 'Paediatrics', 'Waiting', 'warn'], ['Token 38 · Dr Pradhan', 'Lab', 'Report ready', 'ok']],
    chartTitle: 'OPD visits · last 7 days', chart: [70, 82, 76, 90, 86, 64, 38],
    modules: ['Registration & tokens', 'OPD & doctors', 'Beds & IPD', 'Pharmacy stock', 'Lab reports', 'Billing & insurance', 'Patient records'],
    log: ['Doctors, beds and pharmacy stock set up', 'Patients get a token and an SMS when called', 'Lab reports reach doctors and patients', 'Bills, insurance and records in one place'],
  },
};

const studio = document.querySelector('.studio');
if (studio) {
  const tabs = [...studio.querySelectorAll('[role="tab"]')];
  const panel = studio.querySelector('[role="tabpanel"]');
  const app = studio.querySelector('[data-f="app"]');
  const field = (name) => studio.querySelector(`[data-f="${name}"]`);
  const CYCLE = 6000;
  let current = tabs[0].dataset.solution;
  let timer = null;
  let auto = !reduceMotion.matches;
  let visible = false;

  function listItems(el, items, make) {
    el.replaceChildren(...items.map((item, i) => {
      const li = document.createElement('li');
      make(li, item, i);
      return li;
    }));
  }

  function el(tag, text, className) {
    const e = document.createElement(tag);
    if (text != null) e.textContent = text;
    if (className) e.className = className;
    return e;
  }

  function render(key) {
    const s = SOLUTIONS[key];
    for (const f of ['url', 'name', 'product', 'view', 'title', 'listTitle', 'chartTitle']) field(f).textContent = s[f];
    for (const [k, v] of Object.entries(s.colors)) app.style.setProperty(`--s-${k}`, v);
    listItems(field('nav'), s.nav, (li, text, i) => { li.textContent = text; if (i === 0) li.className = 'on'; });
    listItems(field('kpis'), s.kpis, (li, [label, value, note]) => li.append(el('span', label), el('b', value), el('small', note)));
    listItems(field('rows'), s.rows, (li, [what, detail, status, tone]) => li.append(el('b', what), el('span', detail), el('em', status, tone)));
    field('chart').replaceChildren(...s.chart.map((v) => {
      const bar = document.createElement('i');
      bar.style.setProperty('--v', v);
      return bar;
    }));
    listItems(field('modules'), s.modules, (li, text) => { li.textContent = text; });
    const log = field('log');
    listItems(log, s.log, (li, text) => { li.textContent = text; });
    // Restart the staggered "building" animations.
    for (const e of [app, log]) {
      e.classList.remove('building', 'typing');
      void e.offsetWidth;
    }
    app.classList.add('building');
    log.classList.add('typing');
  }

  function select(key, { focus = false } = {}) {
    if (key === current) return;
    current = key;
    tabs.forEach((t) => {
      const on = t.dataset.solution === key;
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
    const tab = tabs.find((t) => t.dataset.solution === current);
    tab.classList.remove('timing');
    if (!auto || !visible) return;
    void tab.offsetWidth;
    tab.style.setProperty('--cycle', `${CYCLE}ms`);
    tab.classList.add('timing');
    timer = setTimeout(() => {
      const i = tabs.findIndex((t) => t.dataset.solution === current);
      select(tabs[(i + 1) % tabs.length].dataset.solution);
    }, CYCLE);
  }

  // Choosing a business yourself stops the tour.
  tabs.forEach((t) => t.addEventListener('click', () => { auto = false; select(t.dataset.solution); schedule(); }));
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
    select(next.dataset.solution, { focus: true });
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
  { label: 'See what we build', icon: '▦', kind: 'Section', run: goTo('studio'), keys: 'studio examples demo school fleet travel ecommerce shop gym hospital' },
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
const briefWarn = document.getElementById('brief-warn');
// A website is built as an add-on to a solution: say so as soon as it's the only thing asked for.
const onlyWebsite = (data) => {
  const needs = data.getAll('need');
  return needs.length === 1 && needs[0] === 'Website add-on' && !String(data.get('message') || '').trim();
};
brief.addEventListener('input', () => { briefWarn.hidden = !onlyWebsite(new FormData(brief)); });
brief.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(brief);
  const needs = data.getAll('need');
  const name = String(data.get('name') || '').trim();
  const business = String(data.get('business') || '').trim();
  const message = String(data.get('message') || '').trim();
  if (onlyWebsite(data)) {
    briefWarn.hidden = false;
    return;
  }
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
