---
title: Website quality, tests and scripts
aliases: [Website quality tests and scripts]
type: reference
covers: [website/tests/site.spec.ts, website/scripts/legacy-paths.mjs, website/playwright.config.ts, website/scripts/figures.mjs, website/scripts/shots.mjs, website/scripts/measure.mjs, website/scripts/make-og.mjs, .github/workflows/website.yml]
---

# Website quality, tests and scripts

The gate for every change is in [runbooks R-02](../project/runbooks.md#r-02-the-gate-before-every-commit-that-touches-the-site). This page explains what each check covers.

## npm scripts (`website/package.json`)

| Script | Runs |
|---|---|
| `npm run dev` | Astro dev server with live reload |
| `npm run check` | `astro check` (TypeScript, Astro, content schemas) then `node scripts/figures.mjs` |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serves `dist/` like GitHub Pages |
| `npm test` | Playwright against the preview server (reuses one on port 4321) |
| `npm run test:install` | Downloads Chromium for Playwright (not needed in cloud sessions) |

## Playwright tests (`tests/site.spec.ts`)

Two projects: `desktop` (1280 × 900) and `mobile` (Pixel 7). CI retries once.

**Per page** (home, experience, education, projects, two project pages, skills, about, card, card print), on both projects:

- Loads with status 200 and no page or console errors.
- No horizontal overflow.
- No squeezed text and no leftover placeholder words ("placeholder", "image to come", "replace with").
- No axe-core violations of any impact, in the light **and** the dark theme (since 2026-11-04; before, serious and critical only, light only).
- No unreviewed colour-contrast checks: axe leaves some contrast checks "incomplete" (text over a gradient, an image or a pseudo-element, symbols). Each such node must sit inside an element group on the `CONTRAST_REVIEWED` list in the test file, and each entry states its measured ratio. A new node fails the test until someone measures it (by sampling the rendered pixels) and adds it with the reason. This rule exists because the filter chip counts failed contrast for weeks while axe called them "incomplete" (audit 2026-11-02).
- One h1 and no skipped heading levels, read from the accessibility tree (`ariaSnapshot`), which is what screen readers list.

**Features**:

| Test | Guards |
|---|---|
| Content is in the HTML before JavaScript | H1 name; "Power System Engineer" on Experience (update when the job title changes); Open Graph image |
| Home shows selected work, figures load | Featured cards and figure loading |
| Case studies state the author's own part | "My part" when `role` is set |
| Command palette (keyboard, desktop only) and search button | Ctrl K, navigation; the search button's name contains the visible "Ctrl K" (WCAG 2.5.3) |
| Theme choice survives navigation | `localStorage` theme across `ClientRouter` swaps |
| Experience filters and career chart | Chips, Gantt bar opens the entry, and Enter on a bar moves focus to that entry |
| Project theme filters | Client and academic work together, counts |
| Closed phone menu does not block taps (phone only) | `pointer-events` fix from v5 step 10 |
| No accessibility violations in open states | axe, light and dark, with the command palette open, the phone menu open (phone only), a project filter on, every role open plus a filter, and the name card QR open. The first-load scan never sees these states; one serious violation hid there (2026-11-02) |
| Forced colours keep the chart and the pressed filter visible | Windows High Contrast emulation: Gantt bars differ from the chart background, dimmed bars keep an edge, the pressed chip differs from the others (2026-11-02) |
| Filter chips read as label and count | The name is "Internship 2", not "Internship2" |
| The phone menu comes next in the Tab order (phone only) | Tab after opening reaches the first menu link; Tab past the last link closes the menu and lands on Search (WCAG 2.4.3, 2.4.11) |
| Project cards are headed links with short names | Each card has one `h3 a`, name 80 characters or less, on Home and Projects |
| Motion that starts by itself stops within five seconds | With motion allowed, no running clock-driven animation lasts over 5 s (WCAG 2.2.2). Scroll-driven reveals and hover-only art are excluded |
| `robots.txt` names the sitemap | 200 and a `Sitemap:` line |
| Lead figures show the whole image | R16 |
| The datasheet never covers the figures or the story (desktop) | Scrolls a project page at 1280 × 900 and 1920 × 1200 and fails on any overlap of the datasheet with other content (bug found 2026-10-14) |
| Pages fit a 320 px phone (phone only) | No sideways scroll on Home, Experience, a project page and the name card at 320 px; compares with 320, because a phone browser widens its layout viewport to fit wide content (bug found 2026-10-14) |
| Zoomed card covers stay sharp (desktop) | Each cropped card cover loads a file at least as wide as it is drawn after `cover` and zoom (blur found 2026-10-14) |
| Acronyms expanded once, at first use | R13 |
| Home features four client case studies | `featured` and `order` |
| Instrument trips, reports a nadir, settles | Demo behaviour; reduced-motion variant |
| Contact card is a valid vCard | `/devin-ezekiel-purba.vcf` fields |
| CV download name, and the CV and its old address serve a PDF | Download CV links on Home and About point to `/CV_Devin_Ezekiel_Purba.pdf` with `download`; when the build has the CV (`main` only), that file, `/cv.pdf` and `/Personal-Profile-Portfolio/cv.pdf` return a PDF (2026-10-21) |
| Old links forward to the new pages | `/Personal-Profile-Portfolio/...` (including the printed QR address `/card/`), `/card/` on the new site, a `#fragment`, and the old vCard file (move to the user site, 2026-10-18) |
| Unknown pages show the 404 page | No `canonical` link on it (it pointed at `/404/`, an address that does not exist) |
| Name card links and scannable QR | Contact links, WhatsApp URL, QR dialog, SVG download |

Last result (2026-11-04, cloud session): 159 passed, 9 skipped. The skips are the device-specific tests on the other project, plus the CV PDF test on both projects, because only `main` builds compile the CV. With the CV in the build, expect 161 passed, 7 skipped.

## Scripts (`website/scripts/`)

| Script | Purpose | Needs |
|---|---|---|
| `figures.mjs [--fix]` | Fails if a PNG in `src/assets/projects/` carries metadata chunks (draw.io embeds its editable source) or if an SVG figure exists; `--fix` keeps image chunks only | nothing |
| `shots.mjs <dir> [pages]` | Full-page screenshots: desktop light, desktop dark, phone; reports overflow and page errors | running preview |
| `measure.mjs [pages]` | At 390 px: text under 12 px, targets under 24 × 24 px, uppercase labels, em dashes. Default pages include the name card since 2026-10-16 | running preview |
| `legacy-paths.mjs` | Runs after `astro build` (part of `npm run build`): forwarding pages for every old `/Personal-Profile-Portfolio/` and `/card/` address, and copies of the CV, vCard, QR and preview image at their old paths. Skips itself if `SITE_BASE` is not `/` | `dist/` |
| `make-og.mjs` | Screenshots `/og-card/` to `public/og.png` (and `og.jpg` with Pillow) | running preview |

Pages for `shots.mjs` and `measure.mjs` are comma-separated paths; use `home` for the home page. Like the Playwright config and `make-og.mjs`, both scripts launch the browser from `CHROMIUM_PATH` when it is set (cloud sessions: `CHROMIUM_PATH=/opt/pw-browsers/chromium`).

## Targets

| Check | Target | Last measured |
|---|---|---|
| Text under 12 px | 0 | 0 on every page (2026-11-04) |
| Targets under 24 × 24 px | 0 | 0 (2026-11-04) |
| Phone touch targets | 44 × 44 px with 8 px gaps | met |
| Em dashes on the site | 0 | 0 (2026-11-04) |
| JavaScript per page | ≤ 40 KB gzip | 11 to 14 KB as transferred, shared router included (Lighthouse, 2026-11-02) |
| Accessibility bar | WCAG 2.2 AA | met in Chromium, light and dark, 20 pages and 5 open states (2026-11-04); real screen readers and real Windows High Contrast not yet checked |
| Text contrast | 4.5:1 (3:1 for large text) | lowest rendered pair 4.97:1 (`--sun-ink` on `--paper`), see [design system](design-system.md#contrast-matrix) |
| Graphics that carry meaning | 3:1 (WCAG 1.4.11) | Gantt bar edges 4.26:1 or more |
| Lighthouse lab, mobile, median of 3 | LCP ≤ 2.5 s, CLS ≤ 0.1 | Home 0.90 s, Projects 1.80 s, Experience 0.91 s, a project page 1.58 s; CLS 0; TBT 0 ms; fonts 29 KB (2026-11-04, Lighthouse 13.6, local preview, simulated throttling, not field data) |
| impeccable audit / critique | ≥ 18/20, ≥ 26/32 | 19/20, 25/32 (2026-10-14) |

## CI

`.github/workflows/website.yml` runs `npm ci`, `npm run check`, `npm run build`, installs Chromium and runs `npm test` on every PR touching `website/`. On failure it uploads the Playwright report for 7 days. On `main` it also compiles the CV and deploys. The build job runs on `ubuntu-24.04`, not `ubuntu-latest`: on Ubuntu 26.04 Playwright 1.56.1 cannot install Chromium (2026-11-04). Lift the pin when Playwright is upgraded. See [project architecture](../project/architecture.md#build-and-deploy).
