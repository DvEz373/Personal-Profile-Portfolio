# Website design plan

Status: **Draft v3 for review** (review rounds 1–2 applied, see the work log) · Prototype: [`design/prototype/`](../../design/prototype/)

## 1. Goals (from the brief)

| Requirement | How the design answers it |
|---|---|
| Interactive | Live 3-phase waveform hero that reacts to the pointer, filterable timeline, expandable cards, project modals, theme toggle, scroll reveals |
| Responsive | Mobile-first CSS, 3 breakpoints, fluid type (`clamp`), no horizontal scroll at 320 px |
| Easy to read | Max line length ~68 characters, 17 px base type, high-contrast tokens, one idea per card |
| Minimal front page | Name, one-line title, 4 numbers, 4 doorway tiles. No paragraphs |
| Details on other pages | Each tile opens a dedicated page; details hide behind "expand" so pages stay scannable |

## 2. Information architecture

```
index.html        Home       — who, what, focus chips, 4 stats, 5 doorways
experience.html   Experience — jobs, internships, campus & academic roles (filterable timeline)
education.html    Education  — degree, exchange, online courses, school (same timeline component)
projects.html     Projects   — filterable card grid (Energy & power · AI/ML · IoT & automation) → detail modal
skills.html       Skills     — 4 groups with bars, certifications list
about.html        About      — bio, what I work on, contact, CV download
```

Every page shares one top bar (logo, 6 links, theme toggle) that collapses to a menu button below 760 px.

## 3. Wireframes

### Home (desktop)
```
┌──────────────────────────────────────────────────────────────┐
│ DP   Home  Experience  Projects  Skills  About         ☾      │
├──────────────────────────────────────────────────────────────┤
│                                              ┌───────────┐   │
│  Devin Ezekiel Purba                         │  portrait │   │
│  Power System Engineer                       │ placeholder│  │
│  Control systems · Power system dynamics     └───────────┘   │
│  [Download CV]  [Get in touch]                               │
│  ~~~~~~ animated 3-phase waveform (reacts to pointer) ~~~~~~ │
├──────────────────────────────────────────────────────────────┤
│   3.84 GPA  │  4+ plant types │  2 grid codes │ 7 certs      │
├──────────────────────────────────────────────────────────────┤
│ ┌Experience─┐ ┌Projects──┐ ┌Skills────┐ ┌About─────┐          │
│ │ icon      │ │ icon     │ │ icon     │ │ icon     │          │
│ │ 1 line  → │ │ 1 line → │ │ 1 line → │ │ 1 line → │          │
│ └───────────┘ └──────────┘ └──────────┘ └──────────┘          │
└──────────────────────────────────────────────────────────────┘
```
Mobile: portrait moves above the name, stats become a 2×2 grid, tiles stack.

### Experience
```
[All] [Work] [Research] [Leadership]          ← filter chips
●─ Sep 2025 – Present  Power System Engineer · Lean Power Solutions   [+]
│    (expanded) bullets · tags: PSS/E, PSCAD, Fortran
●─ Jan 2024 – Jul 2025 Laboratory Assistant · UI Control Lab          [+]
...
```

### Projects
```
[All] [Power systems] [AI/ML] [IoT]
┌figure┐ ┌figure┐ ┌figure┐
│title │ │title │ │title │   → click opens modal: figure, problem,
│tags  │ │tags  │ │tags  │     approach, result, links
└──────┘ └──────┘ └──────┘
```

## 4. Visual design

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f6f7f9` | `#0d1117` | page |
| `--surface` | `#ffffff` | `#161b22` | cards |
| `--text` | `#14181f` | `#e6edf3` | body |
| `--muted` | `#5a6472` | `#9aa6b2` | meta, dates |
| `--accent` | `#1f5fbf` | `#6ea8ff` | links, primary button |
| phase A/B/C | `#e5484d` / `#f5a524` / `#1f8fff` | same | waveform, small accents (borrowed from 3-phase colour coding) |

- **Type:** Inter (Google Fonts) for text, JetBrains Mono for numbers/dates. Base 17 px, scale 1.25.
- **Spacing:** 4 px grid; sections 64 px apart on desktop, 40 px on mobile.
- **Shape:** 12 px radius cards, 1 px borders, shadow only on hover.
- **Theme:** follows the OS, toggle overrides it and is remembered.

## 5. Interactions

| Element | Behaviour | Fallback |
|---|---|---|
| Hero waveform (canvas) | Three sine waves 120° apart; pointer X changes frequency, Y changes amplitude | Paused when `prefers-reduced-motion`; hidden off-screen to save battery |
| Stat counters | Count up once when scrolled into view | Show final number instantly with reduced motion |
| Doorway tiles | Lift + arrow slide on hover/focus | Whole tile is a link, keyboard focus ring |
| Timeline filter | Chips filter entries with a fade | All entries visible without JS |
| Timeline entry | Click/Enter expands details (`<details>` element) | Native `<details>` works without JS |
| Project card | Opens accessible modal (`<dialog>`), Esc/backdrop closes | Card links to anchor section |
| Skill bars | Fill animate on reveal | Static fill |
| Nav | Sticky, shrinks on scroll; active page underlined | — |

## 6. Responsive breakpoints

| Width | Layout |
|---|---|
| < 560 px | single column, menu button, 2×2 stats |
| 560 – 959 px | 2-column tiles and project grid |
| ≥ 960 px | 4 tiles in a row, 3-column projects, hero split text/portrait |

## 7. Accessibility

WCAG 2.2 AA contrast for both themes, visible focus rings, skip link, semantic landmarks, `alt` on figures, all interactions keyboard-reachable, motion respects `prefers-reduced-motion`.

## 8. Tech choice

Plain HTML + CSS + vanilla JS, no build step, so GitHub Pages serves it directly and you can edit it on Windows without Node.
Content (experience, projects, skills) lives in one file, `assets/data.js`, and pages render from it, so updating the site means editing one file.
Trade-off: content rendered by JS is less visible to search engines than static HTML. For a personal site linked from a CV and name card this is acceptable; if SEO matters later, a small build script can pre-render the pages.

## 9. Placeholders to replace

| Placeholder | Where | Needed from you |
|---|---|---|
| Portrait | Home hero, About | Square photo, ≥ 800 px |
| Project figures | Project cards and modals | 1–3 images per project (screenshots, plots, diagrams) |
| Work figures | Experience (optional) | Only non-confidential images |
| Stats | Home | Confirm the 4 numbers are what you want shown |

## 10. Open questions for review

1. Are the 5 pages right, or should Skills merge into About?
2. Is the waveform hero the right tone, or do you prefer something calmer?
3. Should the phone number appear anywhere on the site? (Current plan: no.)
4. Colour: keep the blue accent, or choose another?

## 11. Positioning (v2)

The site speaks to a general Electrical/Computer Engineering and Computer Science audience, not only power system specialists.

| Layer | Message |
|---|---|
| Headline | Power System Engineer (job title) |
| Tagline | Renewable energy · Power systems · AI & intelligent control |
| Current focus | Renewable energy, distributed energy resources, power system dynamics, power electronics, AI/ML/DL/RL |
| Background | Control systems, automation, digitalization, digital twin |
| Identity | AI and digital transformation enthusiast |

Specialist detail (limiters, grid codes, PSS/E) stays on the Experience page, not the front page.

## 12. Palette and imagery (v3)

Colours are taken from the two photos so the page and the pictures belong together.

| Token | Light | Dark | Source | Use |
|---|---|---|---|---|
| Neutrals `--bg/--surface` | `#f4f6f8` / `#ffffff` | `#0f1318` / `#171c23` | Charcoal studio backdrop of the portrait | Page and cards |
| `--accent` | `#1d5fc4` | `#6fa6ff` | Blue of the #UI sign | Links, buttons, phase B |
| `--sun` | `#c99400` | `#f5c518` | Yellow of the #UI sign, solar | Highlights, phase A (never body text on white) |
| `--leaf` | `#0e8f7e` | `#2fc4ae` | Renewable / green campus | Status dot, phase C |

The three waves and the timeline categories reuse sun / blue / leaf, and headings get a short sun→blue→leaf underline.

**Background ornaments:** one fixed SVG layer behind all pages, 6–7 % opacity: dot grid, PCB circuit traces with travelling pulses, a chip, two rotating wind turbines, a solar array with a sun, a transmission tower with flowing lines, and a small neural network with control/ML equations. Phone widths hide the text parts. All motion stops under `prefers-reduced-motion`.

**Photos:** `assets/img/`, each as WebP with JPEG fallback.

| File | Crop | Used on |
|---|---|---|
| `portrait` 600×600 | Square | Home hero, About |
| `graduation` 960×1200 | 4:5 around subject, sign and tower | About, Education degree entry |
| `graduation-wide` 1600×900 | 16:9 subject + sign | Education page banner |

**Touch-up applied:** tone-preserving auto-contrast, slight brightness and saturation lift, shadow lift on the graduation photo (subject was in shade), light sharpening, soft vignette. No retouching of the face.
The portrait source is only 288×288 px, so it was upscaled to 600 px; a larger original would look sharper on high-resolution screens.
