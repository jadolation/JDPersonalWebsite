# Plan: Add Deployed Projects and Social Media Marketing sections

One commit per section. Both changes are independent except for shared nav/scroll-spy. Apply Prompt 1 first, then Prompt 2 on top.

---

## Prompt 1: Deployed Projects section

### Files to modify
- `main-page/index.html` — add nav link, add section markup before footer
- `main-page/css/styles.css` — add `.deployed-*` selectors, reuse SRV/Bakery patterns
- `main-page/js/main.js` — scroll-spy automatically picks up new `section#deployed`; no nav-link query changes needed because it uses `querySelectorAll('.nav-link')`

### Files to create
- `main-page/js/deployed.js` — tab strip behavior
- `main-page/assets/deployed/placeholder-1.svg` through `placeholder-5.svg`
- `main-page/assets/deployed/README.md`

### Navigation changes
1. Insert `<li><a href="#deployed" class="nav-link">Deployed</a></li>` after the SRV `<li>` (line 68).
2. Insert `<li><a href="#marketing" class="nav-link">Marketing</a></li>` after Deployed (Prompt 2 step, but do it here so the file is touched once).
3. Re-evaluate nav width at 1024px. Current nav has 8 items; with 2 more it may overflow. If so, change the hamburger breakpoint from `@media (max-width: 968px)` to `@media (max-width: 1120px)` in `styles.css` (three occurrences: `.nav-toggle` display, `.nav-menu` positioning, `.nav-list` flex-direction). Document this in the PR notes.

### HTML markup (`main-page/index.html`)
Insert after `</section><!-- /srv -->` and before `<!-- Skills Section -->`:

```html
<!-- Deployed Projects Section -->
<section id="deployed" aria-labelledby="deployed-title">
  <div class="container">
    <h2 id="deployed-title">Deployed Projects</h2>
    <p>Live projects I own or have helped build.</p>
    <div class="deployed-panels" data-enhanced>
      <!-- 5 panels, ids deployed-panel-1 ... deployed-panel-5 -->
      <!-- Each panel: .deployed-side (logo, h3, button) + .deployed-main (intro, dl.deployed-facts) -->
      <!-- Use data-placeholder + aria-disabled on buttons that have no real URL yet -->
    </div>
    <div class="logo-strip" role="tablist" aria-label="Deployed projects">
      <!-- 5 buttons role=tab, ids deployed-tab-1 ... deployed-tab-5 -->
      <!-- Each button wraps an <img> with src="assets/deployed/placeholder-N.svg" -->
    </div>
  </div>
</section>
```

Panel details (per prompt):
- Facts rows: 4 default (`Ownership`, `Status`, `My role`, `Stack`), but design must tolerate 3–5 rows.
- Button links: omit `<a>` entirely when no public URL (do not render an empty anchor).
- Shared `.achievements` block is optional; omit from placeholders.

### CSS additions (`main-page/css/styles.css`)
Add after the SRV block (~line 1401):

```css
/* Deployed Projects */
.deployed-panels {
  position: relative;
}

.deployed-panel {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 4rem;
  align-items: start;
}

.deployed-panels[data-enhanced] {
  display: grid;
}
.deployed-panels[data-enhanced] .deployed-panel {
  grid-area: 1 / 1;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
}
.deployed-panels[data-enhanced] .deployed-panel[data-active] {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
}

.deployed-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.deployed-logo {
  max-width: 300px;
  width: 100%;
  height: auto;
}
.deployed-name {
  color: var(--star);
  text-wrap: balance;
  margin: 0;
}
.deployed-cta {
  margin-top: auto;
  padding-bottom: calc((var(--fact-row, 3.5rem) - var(--btn-h, 3rem)) / 2);
  /* ResizeObserver will set --last-row-h on the panel; override padding-bottom if present */
}

.deployed-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.deployed-intro {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-dim);
}
.deployed-facts {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.deployed-facts > div {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--rule);
}
.deployed-facts > div:last-child {
  border-bottom: none;
}
.deployed-facts dt {
  color: var(--star);
  font-weight: 600;
  flex: 0 0 auto;
  min-width: 160px;
}
.deployed-facts dd {
  color: var(--text-dim);
  margin: 0;
  line-height: 1.6;
}

/* Logo strip */
.logo-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  background: var(--text);
  border-radius: 0;
  margin-top: 3rem;
}
.logo-strip button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  padding: 0 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
}
.logo-strip button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  background: var(--space);
  transition: height 175ms ease;
}
.logo-strip button[aria-selected="true"]::after {
  height: 2px;
}
.logo-strip img {
  height: 40px;
  width: auto;
  max-width: 140px;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.6;
  transition: filter 175ms ease, opacity 175ms ease;
}
.logo-strip button:hover img,
.logo-strip button:focus-visible img,
.logo-strip button[aria-selected="true"] img {
  filter: grayscale(0);
  opacity: 1;
}
.logo-strip button:focus-visible {
  outline: 2px solid var(--space);
  outline-offset: -4px;
}

@media (prefers-reduced-motion: reduce) {
  .deployed-panels[data-enhanced] .deployed-panel,
  .logo-strip img,
  .logo-strip button::after {
    transition: none;
  }
}

@media (max-width: 600px) {
  .logo-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .logo-strip button {
    height: 72px;
  }
}
```

**Important:** Do not apply `.srv-section`/`.bakery` shared styles directly to `.deployed-panel`. Instead, mirror the spacing via the grid gap and reuse the existing `.deployed-facts` rules (which intentionally duplicate `.srv-detail-row`'s token usage: `var(--star)` for dt, `var(--text-dim)` for dd, `var(--rule)` borders). This avoids regressing SRV/Bakery.

### JavaScript (`main-page/js/deployed.js`)
```js
(function () {
  'use strict';
  const root = document.getElementById('deployed');
  if (!root) return;

  const panels = root.querySelectorAll('.deployed-panel');
  const tabs = root.querySelectorAll('.logo-strip button[role="tab"]');
  if (!panels.length || !tabs.length) return;

  // Enhanced mode
  root.querySelector('.deployed-panels').setAttribute('data-enhanced', '');

  // Hide strip if only one tab
  const strip = root.querySelector('.logo-strip');
  if (tabs.length === 1) strip.style.display = 'none';

  function activate(index) {
    const i = ((index % panels.length) + panels.length) % panels.length;
    panels.forEach((p, idx) => {
      const active = idx === i;
      p.setAttribute('data-active', active ? '' : null);
    });
    tabs.forEach((t, idx) => {
      const active = idx === i;
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => activate(idx));
    tab.addEventListener('keydown', (e) => {
      let target = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = idx + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = idx - 1;
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End') target = tabs.length - 1;
      else return;
      e.preventDefault();
      target = ((target % tabs.length) + tabs.length) % tabs.length;
      tabs[target].focus();
      activate(target);
    });
  });

  // Prevent placeholder link jumps
  root.querySelectorAll('a[data-placeholder]').forEach(a => {
    a.addEventListener('click', (e) => e.preventDefault());
  });

  // Optional: ResizeObserver for last-row height alignment
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const panel = entry.target.closest('.deployed-panel');
        if (!panel) continue;
        const lastRow = entry.target.lastElementChild;
        if (lastRow) {
          panel.style.setProperty('--last-row-h', Math.ceil(lastRow.getBoundingClientRect().height) + 'px');
          const side = panel.querySelector('.deployed-side');
          if (side) side.style.paddingBottom = 'calc((var(--last-row-h) - var(--btn-h, 3rem)) / 2)';
        }
      }
    });
    panels.forEach(p => {
      const facts = p.querySelector('.deployed-facts');
      if (facts) ro.observe(facts);
    });
  }
})();
```

### Placeholder assets
`main-page/assets/deployed/placeholder-N.svg` (N = 1..5):
- 240x120 viewBox
- Rounded rect `rx="8"` fill `#B8BFCE`
- Text "LOGO N" centered in `#5C6579`, `font-family: system-ui`, `font-size: 20px`

`main-page/assets/deployed/README.md` — list fields per project: logo filename, URL, ownership, status, role, stack, description (1–3 sentences). Instruct owner to use SVG preferred; if PNG/WebP, at least 300px wide and readable on a light background.

### Script load order
Append after `js/starfield.js` in `main-page/index.html`:
```html
<script src="js/deployed.js"></script>
```

### Acceptance criteria (Prompt 1)
- Panel 1 visible on load; clicking each tab swaps content with no layout jump (section height stable).
- Strip logos grayscale at rest, color on hover/focus/selected; selected has 2px bottom bar.
- Keyboard: Tab reaches strip; arrows/Home/End switch; SR announces tabs and panels.
- At 1024–1900px: button vertical center within 4px of last facts row center.
- Logo top aligns with intro first line; name sits directly under logo.
- <=968px: mobile order is logo, name, button, intro, facts; strip becomes 3-col grid at <=600px.
- JS disabled: panels flow vertically, strip hidden.
- Placeholder links do nothing; panels without buttons don't break layout.
- Nav fits at 1024px (or breakpoint raised to 1120px with PR note); scroll-spy highlights Deployed.
- No console errors; no external requests beyond Google Fonts.
- Single commit: `Add deployed projects section with logo selector`.

---

## Prompt 2: Social Media Marketing section

### Files to modify
- `main-page/index.html` — add nav link (already added in Prompt 1 step), add section markup
- `main-page/css/styles.css` — add `.marketing-*` selectors
- `main-page/js/main.js` — no changes; scroll-spy auto-discovers `section#marketing`

### Files to create
- `main-page/js/marketing.js` — lightbox behavior
- `main-page/assets/marketing/` — placeholder WebP images + README

### Placeholder images (generated by implementation agent)
Since source PNGs are not in the repo, create 5 placeholder WebP files using ImageMagick:
- `srv-launching-540.webp` (540x675), `srv-launching-1080.webp` (1080x1350)
- `srv-call-for-providers-540.webp` (540x675), `srv-call-for-providers-1080.webp` (1080x1350)
- `srv-beta-tester-540.webp` (540x675), `srv-beta-tester-1080.webp` (1080x1350)
- `bakery-cover-960.webp` (960x540), `bakery-cover-1600.webp` (1600x900)
- `bakery-coming-soon-540.webp` (540x675), `bakery-coming-soon-1080.webp` (1080x1350)

Placeholder spec: solid fill `#B8BFCE`, centered text label matching filename, dark text `#5C6579` in system-ui. This keeps total thumbnail weight well under 400 KB.

Do NOT commit original PNGs. Only the WebP placeholders are committed.

### HTML markup
Insert after `</section><!-- /deployed -->` and before the next section.

```html
<!-- Marketing Section -->
<section id="marketing" aria-labelledby="marketing-title">
  <div class="container">
    <h2 id="marketing-title">Social Media Marketing</h2>
    <p>Selected posts from the two company accounts I've handled.</p>
    <p class="marketing-cta-line"><!-- OWNER: delete if unwanted --> Interested in working together? <a href="#contact">Get in touch.</a></p>

    <div class="marketing-group">
      <h3>SRV Digital Solutions Co.</h3>
      <p class="marketing-meta"><!-- OWNER: platforms / your role (optional) --></p>
      <ul class="marketing-grid" role="list">
        <li class="marketing-item"><figure>
          <button type="button" class="marketing-open" aria-label="View larger: SRV launch announcement post showing the app screens, with the text 'is finally launching this May'" data-full="assets/marketing/srv-launching-1080.webp">
            <img src="assets/marketing/srv-launching-540.webp" alt="SRV launch announcement post showing the app screens, with the text 'is finally launching this May'" width="540" height="675" loading="lazy" decoding="async">
          </button>
          <figcaption><!-- OWNER: campaign / month and year (optional) --></figcaption>
        </figure></li>
        <li class="marketing-item"><figure>
          <button type="button" class="marketing-open" aria-label="View larger: SRV post calling Cordilleran service providers and home-based freelancers to join" data-full="assets/marketing/srv-call-for-providers-1080.webp">
            <img src="assets/marketing/srv-call-for-providers-540.webp" alt="SRV post calling Cordilleran service providers and home-based freelancers to join" width="540" height="675" loading="lazy" decoding="async">
          </button>
          <figcaption><!-- OWNER: campaign / month and year (optional) --></figcaption>
        </figure></li>
        <li class="marketing-item"><figure>
          <button type="button" class="marketing-open" aria-label="View larger: SRV beta tester recruitment post with a QR code and the website srvpinoy.com" data-full="assets/marketing/srv-beta-tester-1080.webp">
            <img src="assets/marketing/srv-beta-tester-540.webp" alt="SRV beta tester recruitment post with a QR code and the website srvpinoy.com" width="540" height="675" loading="lazy" decoding="async">
          </button>
          <figcaption><!-- OWNER: campaign / month and year (optional) --></figcaption>
        </figure></li>
        <li class="marketing-item marketing-item--placeholder" aria-hidden="true">
          <div class="marketing-placeholder">Image placeholder</div>
        </li>
      </ul>
    </div>

    <div class="marketing-group">
      <h3>New Creation 517 Bakery</h3>
      <p class="marketing-meta"><!-- OWNER: platforms / your role (optional) --></p>
      <ul class="marketing-grid" role="list">
        <li class="marketing-item marketing-item--wide"><figure>
          <button type="button" class="marketing-open" aria-label="View larger: New Creation 517 Bakery cover photo with the logo and the tagline 'Fresh breads, fresh joy everyday'" data-full="assets/marketing/bakery-cover-1600.webp">
            <img src="assets/marketing/bakery-cover-960.webp" alt="New Creation 517 Bakery cover photo with the logo and the tagline 'Fresh breads, fresh joy everyday'" width="960" height="540" loading="lazy" decoding="async">
          </button>
          <figcaption><!-- OWNER: campaign / month and year (optional) --></figcaption>
        </figure></li>
        <li class="marketing-item"><figure>
          <button type="button" class="marketing-open" aria-label="View larger: New Creation 517 Bakery 'Currently baking something, coming soon' announcement post" data-full="assets/marketing/bakery-coming-soon-1080.webp">
            <img src="assets/marketing/bakery-coming-soon-540.webp" alt="New Creation 517 Bakery 'Currently baking something, coming soon' announcement post" width="540" height="675" loading="lazy" decoding="async">
          </button>
          <figcaption><!-- OWNER: campaign / month and year (optional) --></figcaption>
        </figure></li>
        <li class="marketing-item marketing-item--placeholder" aria-hidden="true">
          <div class="marketing-placeholder">Image placeholder</div>
        </li>
      </ul>
    </div>
  </div>
</section>
```

### CSS additions
```css
/* Marketing */
.marketing-group + .marketing-group {
  margin-top: 64px;
}
.marketing-group h3 {
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
}
.marketing-meta:empty {
  display: none;
}
.marketing-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}
.marketing-item {
  display: flex;
}
.marketing-item figure {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
}
.marketing-item img {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border: 1px solid var(--rule);
  border-radius: 4px;
  background: var(--space-raised);
  display: block;
}
.marketing-item--wide img {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
.marketing-open {
  display: block;
  padding: 0;
  border: none;
  background: transparent;
  cursor: zoom-in;
  text-align: left;
}
.marketing-open:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
.marketing-open:hover + figcaption,
.marketing-open:focus + figcaption {
  /* no hover zoom per spec */
}
.marketing-item:hover img,
.marketing-item:focus-within img {
  border-color: var(--accent);
  transition: border-color 175ms ease;
}
.marketing-item img {
  transition: border-color 175ms ease;
}
figcaption:empty {
  display: none;
}
.marketing-placeholder {
  width: 100%;
  aspect-ratio: 4 / 5;
  border: 1px dashed var(--rule);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  font-size: 0.95rem;
}
.marketing-item--placeholder {
  pointer-events: none;
}
.marketing-item--wide + .marketing-item--placeholder .marketing-placeholder,
.marketing-item--placeholder .marketing-placeholder {
  /* keep poster aspect for placeholders unless overridden by wide class context */
}

@media (max-width: 1023px) and (min-width: 601px) {
  .marketing-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .marketing-grid {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 72%;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
    scrollbar-color: var(--rule) transparent;
    padding-bottom: 8px;
  }
  .marketing-grid > * {
    scroll-snap-align: start;
  }
  .marketing-item--wide {
    grid-auto-columns: 90%;
  }
  .marketing-item img,
  .marketing-placeholder {
    aspect-ratio: auto;
    height: 100%;
  }
}
```

### JavaScript (`main-page/js/marketing.js`)
```js
(function () {
  'use strict';
  const dialog = document.getElementById('lightbox'));
  if (!dialog) return;

  const img = dialog.querySelector('img');
  const counter = dialog.querySelector('.lightbox-counter');
  const prevBtn = dialog.querySelector('[data-lightbox-prev]');
  const nextBtn = dialog.querySelector('[data-lightbox-next]');
  const closeBtn = dialog.querySelector('[data-lightbox-close]');
  let currentGroup = [];
  let currentIndex = -1;

  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.documentElement.style.overflow = '';
  }

  function openLightbox(trigger, group) {
    currentGroup = group;
    const fullSrc = trigger.getAttribute('data-full');
    const alt = trigger.querySelector('img').getAttribute('alt') || '';
    img.src = fullSrc;
    img.alt = alt;
    currentIndex = group.indexOf(trigger);
    updateCounter();
    dialog.showModal();
    lockScroll();
    closeBtn.focus();
  }

  function updateCounter() {
    if (counter) counter.textContent = (currentIndex + 1) + ' of ' + currentGroup.length;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    const trigger = currentGroup[currentIndex];
    img.src = trigger.getAttribute('data-full');
    img.alt = trigger.querySelector('img').getAttribute('alt') || '';
    updateCounter();
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % currentGroup.length;
    const trigger = currentGroup[currentIndex];
    img.src = trigger.getAttribute('data-full');
    img.alt = trigger.querySelector('img').getAttribute('alt') || '';
    updateCounter();
  }

  function closeLightbox() {
    dialog.close();
    unlockScroll();
    if (currentGroup[currentIndex]) currentGroup[currentIndex].focus();
  }

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeLightbox();
  });

  closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); showPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showNext(); }
  });

  document.querySelectorAll('.marketing-group').forEach(group => {
    const triggers = Array.from(group.querySelectorAll('.marketing-open'));
    if (!triggers.length) return;
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => openLightbox(trigger, triggers));
    });
  });
})();
```

### Dialog markup
Add once to `main-page/index.html`, just before `</body>`:
```html
<dialog id="lightbox" aria-label="Image preview">
  <img src="" alt="">
  <div class="lightbox-controls">
    <button type="button" data-lightbox-prev>Previous</button>
    <span class="lightbox-counter" aria-live="polite"></span>
    <button type="button" data-lightbox-next>Next</button>
    <button type="button" data-lightbox-close>Close</button>
  </div>
</dialog>
```

### Lightbox CSS
```css
#lightbox {
  background: transparent;
  border: 0;
  padding: 0;
  max-width: none;
  max-height: none;
}
#lightbox::backdrop {
  background: rgba(7, 10, 18, 0.92);
}
#lightbox img {
  display: block;
  max-width: min(92vw, 1080px);
  max-height: 86vh;
  object-fit: contain;
  margin: 0 auto;
}
.lightbox-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
.lightbox-counter {
  color: var(--text);
  font-size: 0.9rem;
  min-width: 4ch;
  text-align: center;
}
.lightbox-controls button {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--rule);
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.85rem;
}
.lightbox-controls button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Script load order
Append after `js/deployed.js`:
```html
<script src="js/marketing.js"></script>
```

### Image conversion command (run once by implementation agent)
Use ImageMagick (already allowed) to generate placeholders from solid-color SVGs or inline commands. Example per image:
```bash
convert -size 540x675 xc:'#B8BFCE' -gravity center -pointsize 24 -fill '#5C6579' -font system-ui -annotate +0+0 'SRV Launching' main-page/assets/marketing/srv-launching-540.webp
```
Repeat for each size (1080x1350, 960x540, 1600x900, etc.). Set quality:
```bash
cwebp -q 82 input.webp -o output.webp
```

### Acceptance criteria (Prompt 2)
- Five thumbnails in two labeled groups, each with one placeholder slot.
- 4 columns at 1440px; 2 at 768px; horizontal snap rows at 360px with no page-level horizontal scroll.
- Bakery cover spans 2 columns; row height matches posters; no clipped text on cover.
- Clicking an image opens lightbox with full-size file; Esc, backdrop click, Close, arrows, and Previous/Next work within the same group and wrap.
- Beta tester QR code is crisp in lightbox (placeholder will be crisp; real image should be rendered at 1080px wide).
- Placeholders not clickable and not in lightbox cycle.
- Originals not in repo; thumbnails total under 400 KB (5 × ~30–60 KB = well under).
- Nav fits at 1024px (breakpoint already raised by Prompt 1 if needed); scroll-spy highlights Marketing.
- No console errors; no external requests beyond Google Fonts.
- Single commit: `Add social media marketing section`.

---

## Out of scope / explicit decisions
- Do not touch SRV or Bakery styling beyond reusing token references (no duplicated raw values).
- Do not add icons, gradients, glow, shadow, hover lift, or new colors.
- Do not edit other sections.
- `CUSTOMIZATION_EXAMPLES.js`, `theme-picker.js`, and `archive/legacy/` are out of scope.
- Root `script.js` does not duplicate nav logic; only `main.js` needs scroll-spy updates (automatic).
- Marketing section appears before any "terminal" section because no such section exists in `main-page/index.html`.
