---
title: Website design system
aliases: [Website design system]
type: reference
covers: [website/src/styles/global.css, website/src/lib/themes.ts, website/src/lib/transitions.ts, website/astro.config.mjs]
---

# Website design system

"Grid & Signal": the portfolio as an engineer's instrument panel and technical drawing ([history: 05 visual direction](05-visual-direction.md)). Since v4.1 it uses one typeface. Since v5 it follows the R1 to R17 revisions ([decisions](../project/decisions.md)). All tokens live in `website/src/styles/global.css`.

## Colour tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#f3f5f7` | `#0c0f14` | Page background |
| `--panel`, `--panel-2` | `#ffffff`, `#e9edf1` | `#141920`, `#1b222b` | Cards, raised surfaces |
| `--ink`, `--ink-2` | `#12161c`, `#4c5866` | `#e7ecf1`, `#9aa6b3` | Text, secondary text |
| `--line`, `--line-strong` | `#d5dbe2`, `#aeb8c3` | `#262f39`, `#3b4653` | Hairlines, borders |
| `--signal` (+ `-ink`, `-soft`) | `#1d5fc4` | `#7aacff` | Primary accent, links, AI |
| `--sun` (+ `-ink`, `-soft`) | `#c99400` | `#f5c518` | Energy themes. Never as text on light backgrounds (use `--sun-ink`) |
| `--leaf` (+ `-ink`, `-soft`) | `#0e8f7e` | `#2fc4ae` | IoT, campus roles, live dot |
| `--figure-sheet` | `#ffffff` | `#eef1f4` | Sheet behind project figures (R12) |
| `--screen` | `var(--paper)` | `#080b0f` | Instrument background (R15) |
| `--grid-line` | signal at 7 % | signal at 7 % | Drafting grid |

Dark mode is `:root[data-theme="dark"]`. A script in `Base.astro` sets `data-theme` from `localStorage` or the system setting before first paint.

**Tones**: `.c-sun`, `.c-signal`, `.c-leaf`, `.c-ink` set `--c`, `--c-ink`, `--c-soft` for a component. Project themes map to tones in `lib/themes.ts` (`TONE`); experience types and education kinds map to tones in their pages.

## Contrast matrix

The bar is WCAG 2.2 AA: 4.5:1 for text (3:1 at 24 px, or 18.66 px bold), 3:1 for graphics a reader needs (1.4.11). The text pairs below are the ones actually rendered. They were collected from all 20 pages in both themes and checked by pixel sampling (audit 2026-11-02). Check a changed token against every row in both themes.

| Foreground on background | Light | Dark | Where |
|---|---|---|---|
| `--ink` on `--paper` / `--panel` | 16.6 / 18.2 | 16.2 / 14.9 | Headings, body text |
| `--ink-2` on `--paper` / `--panel` / `--panel-2` | 6.64 / 7.25 / 6.17 | 7.75 / 7.13 / 6.47 | Secondary text, tags, chip counts |
| `--ink-2` on `--signal-soft` | 5.98 | 6.24 | Callout label, selected palette hint |
| `--signal` on `--paper` / `--panel` | 5.51 / 6.02 | 8.38 / 7.71 | Links, accent, focus ring |
| `--signal-ink` on `--signal` | 6.02 | 8.38 | Primary button, skip link |
| `--sun-ink` on `--paper` / `--panel` | **4.97** / 5.43 | 11.8 / 10.8 | Skills caveat, sun card label, timeline type |
| `--leaf-ink` on `--paper` / `--panel` | 5.78 / 6.32 | 10.7 / 9.86 | Live status, "now" label |
| `--paper` on `--ink` | 16.6 | 16.2 | Pressed chip, toast |
| `--ink-2` on the header backdrop (82 % `--paper` over the darkest content) | 4.54 | 4.59 | Nav links while scrolled |

- **Avoid**: `--sun-ink` on `--signal-soft` is 4.48:1 in light. `--sun` is never text on light backgrounds (2.49:1 on `--paper`). No opacity on text: 70 % `--ink-2` fell to 3.49:1 (the old chip counts).
- **Graphics (3:1)**: a graphic needs 3:1 when it is the only carrier of the information.
  - Gantt bars are, so each bar has a 1 px `--c-ink` edge: 4.26:1 or more in every tone and theme, where the light `--sun` fill alone is 2.4:1.
  - A bar dimmed by a filter keeps the edge and an 18 % fill (edge 5.43:1 or more).
  - Timeline node rings, chip dots and Skills pips sit next to text with the same meaning, so they may be lighter.

## Forced colours (Windows High Contrast)

In forced colours the browser replaces author colours with the user's palette and paints every background as `Canvas`. Anything drawn only with a background disappears: before 2026-11-04 that was the career chart and every pressed state.

- Restore such parts inside `@media (forced-colors: active)`, with **system colour keywords only** (`Canvas`, `CanvasText`, `LinkText`, `SelectedItem`, `SelectedItemText`). They come from the user's theme, so this is the one exception to the tokens-only rule (decision A12).
- Graphics: Gantt bars use `LinkText` (they are links), dimmed bars `Canvas` with a `LinkText` edge, Skills segments a `CanvasText` outline with lit ones filled.
- Pressed states (`.chip[aria-pressed="true"]`, the demo's controller buttons) use `SelectedItem` and `SelectedItemText`. Only these rules add `forced-color-adjust: none`: without it Chromium draws a `Canvas` backplate behind the text and hides it. Never apply `forced-color-adjust: none` more widely.
- Borders and outlines already take the user's colours, so anything with a border needs no rule. Check changes with Playwright's `forcedColors: "active"` in light and dark, and in Edge on Windows when possible.

## Focus

- One global ring: `:focus-visible` 2 px `--signal`, 3 px offset (global.css). Never remove an outline without drawing a replacement.
- Project cards: the title link is stretched over the card (`.title a::after`), and that pseudo-element draws the ring round the whole card. The link's own outline is turned off.
- Command palette: the field has no outline; a 2 px `--signal` line under `.field:focus-within` marks it.
- Name card links: the list clips its corners, so the ring sits inside the row (`outline-offset: -3px`).

## Type

- **Geist Variable**, upright and italic, self-hosted. Hierarchy comes from weight, size and colour.
- Scale: `--step-0` 1.0625 rem body; `--step-1` and `--step-2` fluid headings; `--step-3` fluid display.
- Minimum label size 12 px (R9). `scripts/measure.mjs` checks it.
- Reading columns at most about 68 characters.

## Space and shape

`--wrap` 1200 px max width, `--gutter` clamp(16 px, 4vw, 40 px), `--header-h` 64 px. Radii `--radius-s` 6 px, `--radius` 10 px, `--radius-l` 16 px. Hairlines 1 px. `--shadow` changes per theme.

## Motion

| Token | Value |
|---|---|
| `--t-micro`, `--t-ui`, `--t-page` | 120 ms, 240 ms, 400 ms |
| `--ease` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--ease-settle` | `cubic-bezier(0.34, 1.56, 0.64, 1)`, only for small "needle settle" indicators |

Page transitions: `lib/transitions.ts` (200 ms out, 360 ms in). Every animation sits inside `@media (prefers-reduced-motion: no-preference)` or stops under `reduce`. No scroll-jacking, no parallax on text.

Motion that starts by itself stops within 5 s (WCAG 2.2.2 Pause, Stop, Hide; decision A14).
- The live dot pulses twice (2 × 2.4 s).
- The `Schematic` flow line runs three cycles (3 × 1.6 s).
- Each turbine coasts down through one third of a turn in 4.8 s, so it ends in a pose that looks like the start (three blades). Its first speed matches the old 9 s per turn.
- Longer motion needs a visible Pause control, like the Instrument demo. Hover-only motion (the `ProjectArt` dash on cards) does not count as starting by itself.
- A test fails on any running clock-driven animation longer than 5 s.

## Responsive and touch

- Phone layout below 860 px (`max-width: 859px`) and on coarse pointers.
- Under `(pointer: coarse)`: header tools, filter chips and footer links get at least 44 × 44 px hit areas with 8 px gaps (R14). Nothing under 24 × 24 px anywhere.
- No horizontal overflow at any width, down to 320 px. Tests and `shots.mjs` check it. A grid that centres a card needs `minmax(0, 1fr)` columns, or the card grows to its longest unbroken line.
- One left edge per page: narrower reading columns (the Experience and Education timelines, 880 px) start where the page title starts.
- Sticky side panels stay inside the area they describe and stick only where they fit on screen. The project datasheet sticks only at 960 × 1100 px and up; a test scrolls the page at 1280 × 900 and 1920 × 1200 and fails on any overlap.

## Content style on the page

- One eyebrow at most per page header (R5). Section notes are sentence case, not uppercase labels.
- Readouts and empty values use "–" (en dash), never an em dash (R17).
- Inline meta rows ("dates · duration · type") never start a line with a separator dot: the Timeline clips line-start dots.
- Uppercase labels must not change meaning: write "Frequency", not the symbol f, which would show as F.
- Project figures always show whole on the project page (R16). Cards may crop (R1), but a crop never cuts text: its edges fall in white space ([content model](content-model.md#projects)). Lines may run off the edge.
- Card labels name the theme, not the kind: the section heading already says "Client work".
- Uppercase labels kept low (Home 9, Experience 5 on 2026-10-14).
