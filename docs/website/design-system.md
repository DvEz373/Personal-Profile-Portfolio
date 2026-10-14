---
title: Website design system
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

## Responsive and touch

- Phone layout below 860 px (`max-width: 859px`) and on coarse pointers.
- Under `(pointer: coarse)`: header tools, filter chips and footer links get at least 44 × 44 px hit areas with 8 px gaps (R14). Nothing under 24 × 24 px anywhere.
- No horizontal overflow at any width. Tests and `shots.mjs` check it.

## Content style on the page

- One eyebrow at most per page header (R5). Section notes are sentence case, not uppercase labels.
- Readouts and empty values use "–" (en dash), never an em dash (R17).
- Project figures always show whole on the project page (R16). Cards may crop (R1).
- Uppercase labels kept low (Home 9, Experience 5 on 2026-10-14).
