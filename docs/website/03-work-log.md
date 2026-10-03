# Website work log

Each step records what was done, why, and how it was checked.

## 2026-10-03 · Step 0: Groundwork (PR #1, merged)

- Built a simple one-page site in `website/` from the CV, plus the `Deploy website` workflow that builds the CV into `cv.pdf` and publishes to GitHub Pages on pushes to `main`.
- **Check:** rendered in Chromium at 375 px and 1280 px; no sideways scrolling.
- That page stays live until the new design replaces it.

## 2026-10-03 · Step 1: Design plan

- Wrote [01-design-plan.md](01-design-plan.md): requirements mapped to design decisions, a 5-page structure, wireframes, colour and type tokens, the interaction list with fallbacks, breakpoints, accessibility targets, and the tech choice.
- **Key decisions:**
  - **Minimal home page.** Name, title, one tagline, four numbers, four doorway tiles. Every detail moves to its own page.
  - **Three-phase waveform** as the signature interaction. It ties the site to power systems without needing a photo, and colours A/B/C are reused for the timeline categories.
  - **Plain HTML/CSS/JS, no build step.** GitHub Pages serves it as-is and it can be edited on Windows without installing Node.
  - **One content file (`data.js`)** so updating the site means editing one place.

## 2026-10-03 · Step 2: Clickable prototype

- Built `design/prototype/` with all 5 pages, placeholder figures, and every interaction in the plan: waveform, counters, filters, expandable timeline, project modal with a swipeable figure strip, animated skill bars, copy-email, dark-mode toggle, collapsible phone menu, scroll reveals.
- Respects `prefers-reduced-motion`: animation stops, numbers show instantly, the waveform draws once and redraws only when touched.
- Theme choice is stored in `localStorage` inside try/catch, so the site still works when storage is blocked.
- **Checks (headless Chromium):**
  - All 5 pages at 375 × 812 (light) and 1280 × 860 (dark): no JavaScript errors, no horizontal overflow.
  - Opened a project modal and confirmed it renders.
  - Sticky menu bar is at the top of the viewport.
  - Google Fonts could not load inside the build container (its network proxy), so screenshots used fallback fonts; this does not affect real visitors.

## 2026-10-03 · Step 3: Review round 1

Feedback: separate experience types, add an education timeline, keep the site general to ECE/CS, highlight AI and intelligent control, and present renewable energy and power systems as the main field.

- **Experience** now has three types: Work, Internships, Campus & academic. TEEP and PLN ICON+ became internships; lab assistant, KSE and EXERCISE became campus roles.
- **New Education page** using the same timeline component: degree, Coursera AI courses, the NTUST exchange, and a placeholder for high school. Ordered by end date.
- **Repositioned content:** new tagline, 8 focus chips on Home and About, a 3-paragraph bio (background → current work → interests), skills regrouped into Renewable energy & power systems, AI & intelligent control, Automation & digitalization, and Tools. Project filters renamed. The thesis is tagged Reinforcement learning and Digital twin.
- **Stats** (except GPA) are now counted from the content lists, so they update when entries are added.
- **Check:** all 6 pages at 375, 800 and 1280 px: no JavaScript errors, no horizontal overflow.

## 2026-10-03 · Step 4: Review round 2 (photos, palette, ornaments)

Feedback: headline "Electrical Engineer · Energy & AI", keep the waves and add digital/renewable/grid ornaments, design a palette that matches the photos, show the phone number, drop the high-school entry, use the two photos with a light touch-up.

- **Headline** changed. The current job now sits under it as a small line with a pulsing status dot.
- **Photos** touched up with Pillow (script steps listed in plan §12) and exported as WebP + JPEG. The portrait is in the Home hero and About. The graduation photo is the Education banner, the degree entry and About.
- **Palette** rebuilt from the photos (plan §12). Waves, timeline dots, focus chips and skill bars now use sun / blue / leaf.
- **Ornaments** added as a fixed SVG background layer (plan §12).
- **Phone** added to the About contact buttons (tap to call) and the footer.
- **High school** entry removed.
- **Fixes found while testing:**
  - The hero-only portrait ordering leaked into About; scoped it to `.hero`.
  - Contact buttons wrapped mid-number; they are now one per row when narrow.
  - Footer links no longer break inside the phone number.
- **Check:** all 6 pages at 375, 800 and 1280 px: no JavaScript errors, no horizontal overflow. Light and dark screenshots reviewed.

## 2026-10-03 · Step 5: Framework research (v4)

Request: upgrade the frontend, research frameworks first (React, Vue, Next.js or a better option); the site looked too generic.

- Checked claims against official documentation (GitHub Docs, Next.js, Astro, web.dev, MDN, W3C, NN/g). Direct fetches were blocked by the build environment's network policy, so checks went through search results restricted to those domains.
- **Measured** what each framework ships for an identical tiny page in headless Chromium:

  | Setup | JS (gzip) | Content in HTML |
  |---|---:|:-:|
  | Astro 7 | 0 KB | yes |
  | SvelteKit 3 | 30.6 KB | yes |
  | Vite + React 19 | 66.2 KB | no |
  | Next.js 16 | 130.3 KB | yes |
  | Vite + Vue 3.5 | 23.3 KB | no |

  The v3 prototype also failed the "content in HTML" check.
- Scored six options on seven weighted criteria. **Astro 7** ranked first (86/100) and stayed first under five different weightings.
- Full record: [04-framework-research.md](04-framework-research.md); raw data and apps: [research/framework-benchmark/](research/framework-benchmark/).

## 2026-10-03 · Step 6: Visual direction v4, "Grid & Signal"

- Diagnosed why v3 looked generic: a template layout, one undistinguished typeface, uniform cards, decoration that carried no meaning, and stock interactions.
- New concept: the portfolio as an engineer's instrument panel and technical drawing.
  - **Type:** serif headlines, monospace annotations.
  - **Navigation:** a single-line diagram.
  - **Home:** a playable grid-frequency demo.
- Record: [05-visual-direction.md](05-visual-direction.md).

## 2026-10-03 · Step 7: Build in Astro (`website/`)

- **Content moved** from one `data.js` into YAML and Markdown files with build-time schema checks (`src/content.config.ts`).
- **New features:**
  - FIG. 01 grid-frequency instrument (toy second-order model, controller on/off, Run/Pause, a static version for reduced motion, screen-reader announcement).
  - Single-line-diagram section links.
  - "Signal chain" block diagram.
  - Interactive career chart linked to the timeline.
  - One datasheet page per project.
  - VU-meter skill levels.
  - Command palette (Ctrl/⌘ K).
  - Page transitions.
  - Live Jakarta clock.
  - Downloadable contact card (`.vcf`).
  - 404 "open circuit" page.
  - Social preview image.
- **Self-hosted fonts:** Geist, Geist Mono and Instrument Serif. The first attempt used Astro's npm font provider, which still downloaded from a CDN at build time and failed here; switched to the `local` provider pointing at the npm packages, so builds need no network.
- **Photos:** optimized at build time to AVIF/WebP, so the portrait goes from 44 KB to 4–12 KB.
- **Fixes found by reviewing screenshots and tests:**
  - Overlapping canvas labels: added an axis gutter.
  - Flat-topped overshoot on the frequency trace: widened the axis to 50.55 Hz.
  - Overlapping portrait labels on phones.
  - A CSS class name clash on the chart axis.
  - Alphabetical skill order: added an explicit `order`.
  - Chart clicks not opening entries: Astro's router does not fire `hashchange`.
  - The `hidden` attribute overridden by button styles.
  - Low-contrast menu numbers, caught by the axe-core scan.
  - Event listeners stacking up across client-side navigations: scoped with `AbortController`.

## 2026-10-03 · Step 8: Verification

- **Static checks:** `astro check` reports 0 errors, 0 warnings. `astro build` produces 12 pages.
- **Browser tests:** 45 Playwright tests pass, 1 skipped (keyboard shortcut on phones). They run on desktop (1280×900) and phone (Pixel 7) and cover:
  - every page loads with no errors and no sideways scroll;
  - content is present in the server HTML;
  - axe-core finds no serious or critical violations;
  - the command palette, theme persistence, filters, chart → timeline link, instrument, reduced-motion mode, vCard and 404 page all work.
- **Weight per page (phone, measured):**
  - JavaScript: 8.6–11.3 KB gzip (budget 40 KB).
  - Fonts: 93 KB.
  - Largest image on first view: 89 KB (budget 120 KB).
- **Lighthouse 13.5, default mobile settings (lab data, one run each):**

  | Page | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
  |---|---:|---:|---:|---:|---:|---:|---:|
  | Home | 99 | 100 | 100 | 100 | 1.8 s | 0 ms | 0 |
  | Education | 98 | 100 | 100 | 100 | 2.3 s | 0 ms | 0 |

  Lab results on a fast machine, not field data from real visitors.
- **CI:** the `Website` workflow now runs `check`, `build` and the browser tests on every pull request. It deploys only when `PAGES_ENABLED` is set, replacing the old deploy workflow that failed while Pages was off.
- **First CI run caught a type error** that my local check missed, because I had type-checked before writing the tests. `@axe-core/playwright` pulled in `playwright-core` 1.63.0 while `@playwright/test` uses 1.56.1, so their `Page` types differed. Fixed with an npm `overrides` entry that pins one `playwright-core`. Reproduced locally first, then `npm ci`, `astro check` (0 errors) and all 45 tests passed before pushing.

## Next (after review)

1. Review v4 in the browser (`cd website && npm install && npm run dev`).
2. Replace placeholders: project figures, skill levels, the hybrid PPC project.
3. Turn on GitHub Pages (repo public or GitHub Pro → Source: GitHub Actions) and set the `PAGES_ENABLED` variable to `true`.
4. Optional: delete `design/prototype/` once v4 is approved.
