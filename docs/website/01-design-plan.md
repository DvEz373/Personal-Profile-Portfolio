# Website design plan

Status: **Draft for review** · Prototype: [`design/prototype/`](../../design/prototype/)

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
index.html        Home       — who, what, 4 stats, 4 doorways
experience.html   Experience — filterable timeline (Work · Research · Leadership), expandable entries
projects.html     Projects   — filterable card grid, click a card → detail modal with figures
skills.html       Skills     — skill groups with proficiency bars, certifications list
about.html        About      — short bio, education, contact, CV download
```

Every page shares one top bar (logo, 5 links, theme toggle) that collapses to a menu button below 760 px.

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
