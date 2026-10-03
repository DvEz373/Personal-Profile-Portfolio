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

## Next (after review)

1. Apply review feedback to the plan and prototype.
2. Replace placeholders with real images.
3. Move the approved prototype into `website/` so it deploys.
4. Turn on GitHub Pages (repo public or GitHub Pro, Source: GitHub Actions).
