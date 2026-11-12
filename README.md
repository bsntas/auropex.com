# auropex.com

The website of Auropex Software Labs LLP: a static one-page site (`index.html`, `styles.css`, `script.js`) with no build step. Open `index.html` in a browser, or serve the folder with any static host.

Sections: hero, three pillars (product, service, research), Pushtakalaya, services for MSMEs, research, about, contact.

## Brand

Logos in `assets/` come from the Auropex logo kit's SVG masters: the `dark` set on navy, the `light` set on white. Colours in `styles.css` follow the kit: navy `#07192F`, gold `#F0CC74`→`#BA8530` (dark) / `#C28F25`→`#7A5008` (light), teal `#52C6E0`→`#2C9CC0` (dark) / `#0D84A8`→`#065B7A` (light). Type: Cormorant Garamond for headings, Inter for text, Mukta for Devanagari (Google Fonts).

## Themes

Light ("first light over the hills") and dark ("night"), each complete: every colour is a variable set under `[data-theme="light"]` / `[data-theme="dark"]` at the top of `styles.css`, so a new section uses the variables (`--bg`, `--surface`, `--heading`, `--text-soft`, `--gold-text`, `--teal-text`…) and works in both. A small script in `<head>` picks the theme before first paint: the visitor's saved choice (`localStorage` `theme`), else the device setting, which it keeps following until they choose. The sun/moon button in the header switches and saves it (`script.js`).

Images that differ by theme come in pairs, `class="for-light"` and `class="for-dark"`: the kit's light logos on the light theme and its dark logos on the dark one. Note that Pushtakalaya's files are named the other way round from the kit: its `logo-light.svg` is the one *for dark backgrounds*, copied here as `pushtakalaya-mark-on-dark.svg`.
