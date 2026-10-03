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

## Next (after review)

1. Apply review feedback to the plan and prototype.
2. Replace placeholders with real images.
3. Move the approved prototype into `website/` so it deploys.
4. Turn on GitHub Pages (repo public or GitHub Pro, Source: GitHub Actions).
