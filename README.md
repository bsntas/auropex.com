# auropex.com

The website of Auropex Software Labs LLP: a static one-page site (`index.html`, `styles.css`, `script.js`) with no build step. Open `index.html` in a browser, or serve the folder with any static host.

Sections: hero, capabilities marquee, the studio (example solutions being built), services (what a solution includes, then a bento grid), how we work, Pushtakalaya (our product and proof), research, about, start a project.

## Positioning

Auropex builds and runs whole business solutions, not websites: the systems a business runs on (orders, bookings, billing and GST, stock, staff, records), with apps for staff and customers. A website comes only as an add-on to a solution, and copy says so positively ("a website comes as an add-on to your solution") rather than in negatives about website-only work (headings included); it says so once in each place a visitor chooses what to ask for (the Services layers, the studio note, the brief form) rather than in every section, and never offers a website on its own or makes it the deliverable. Reach is "from Darjeeling, the Queen of the Hills, to the whole of India and the world", not "Darjeeling first, India later".

## Brand

Logos in `assets/` come from the Auropex logo kit's SVG masters: the `dark` set on navy, the `light` set on white. Colours in `styles.css` follow the kit: navy `#07192F`, gold `#F0CC74`→`#BA8530` (dark) / `#C28F25`→`#7A5008` (light), teal `#52C6E0`→`#2C9CC0` (dark) / `#0D84A8`→`#065B7A` (light). Type (Google Fonts): Geist for headings and text, Geist Mono for labels, Cormorant Garamond italic for the accent words in headings (gold-to-teal gradient), Mukta for Devanagari.

## Themes

Light ("first light over the hills") and dark ("night"), each complete: every colour is a variable set under `[data-theme="light"]` / `[data-theme="dark"]` at the top of `styles.css`, so a new section uses the variables (`--bg`, `--bg-2`, `--surface`, `--glass`, `--line`, `--heading`, `--muted`, `--gold-text`, `--teal-text`, `--accent-gold`, `--accent-teal`…) and works in both. A small script in `<head>` picks the theme before first paint: the visitor's saved choice (`localStorage` `theme`), else the device setting, which it keeps following until they choose. The sun/moon button in the header switches and saves it, with a circle growing from the button where the browser has View Transitions (`script.js`).

Images that differ by theme come in pairs, `class="for-light"` and `class="for-dark"`: the kit's light logos on the light theme and its dark logos on the dark one. Note that Pushtakalaya's files are named the other way round from the kit: its `logo-light.svg` is the one *for dark backgrounds*, copied here as `pushtakalaya-mark-on-dark.svg`.

## How the page works

- **Aurora**: blurred, drifting gradient blobs (`.aurora`) behind the hero and the contact card, with a film-grain overlay (`body::after`) so large gradients don't band.
- **Reveal on scroll**: `.reveal` elements fade in with scroll-driven animations (`animation-timeline: view()`). Browsers without them get the same through an `IntersectionObserver` in `script.js`; with neither, nothing is hidden. The reading-progress bar and the "how we work" line also run on scroll timelines.
- **The studio** (`#studio`): tabs for five illustrative solutions (school management, fleet management, e-commerce, gym membership, hospital management). The preview is the dashboard the business's people work in (side menu, figures, a live list, a chart); the side lists the whole solution around it. Each is an entry in `SOLUTIONS` in `script.js` (address, colours, menu, figures, list rows, chart, modules, build log); the first is also written in the HTML so the page reads without the script. The browser frame is the size container, so the dashboard lays itself out by its width; it switches with a View Transition and tours the examples while on screen until the visitor picks one.
- **Spotlight cards**: any `.card` gets a soft glow that follows the pointer (`--mx`/`--my`).
- **Quick search**: Ctrl/⌘ K or `/` opens a command palette (`<dialog id="cmdk">`, `COMMANDS` in `script.js`) to jump to sections, switch theme, or email us.
- **Start a project**: the brief form builds an email (subject from the chosen needs) and opens the visitor's email app; nothing is sent from the page. Ticking only "Website add-on" (with no message) shows a note that a website is built as an add-on to a solution, and the email waits until something else is ticked or written.
- **Less motion**: with `prefers-reduced-motion`, animations, the word rotator, the marquee and the studio tour stop.
