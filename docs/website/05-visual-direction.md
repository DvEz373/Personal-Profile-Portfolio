# Visual direction v4: "Grid & Signal"

Status: **Implemented in `website/`, open for review** · Date: 2026-10-03 · Builds on [01-design-plan.md](01-design-plan.md) (structure, palette §12)

## 1. Why v3 looked generic

These observations come from the v3 screenshots.

| # | Observation | Effect |
|---|---|---|
| 1 | Home follows the stock portfolio template: name left, photo right, a row of counters, a row of equal icon cards | Looks like thousands of template sites, so nothing is memorable |
| 2 | One sans-serif family at a few sizes, rendering in system fallback fonts | No typographic voice |
| 3 | Every container is the same rounded card with a 1 px border | No rhythm or hierarchy; NN/g notes hierarchy comes from contrast in scale, colour and grouping ([visual hierarchy][nng-vh]) |
| 4 | Background ornaments are wallpaper at 6–7 % opacity | Barely visible and carry no meaning |
| 5 | Interactions are the stock set: fade-up, hover lift, count-up | Feels like a template |
| 6 | The pages list facts but never show the core idea, *energy systems × intelligent control* | The visitor has to infer the story |

## 2. Concept

**The portfolio as an engineer's instrument panel and technical drawing.**

Devin works where power grids meet intelligent control. The site borrows that visual language: oscilloscope traces, single-line diagrams, datasheet annotations and measurement read-outs, set in editorial typography. Interactive parts behave like systems: they respond, oscillate, get damped and settle.

Five pillars:

1. **Show, don't tell.** The home page contains a working toy model. The visitor trips a generator, watches grid frequency dip and oscillate, then switches the controller on and sees it settle. That is the elevator pitch, playable.
2. **Datasheet typography.**
   - Headlines use a serif with italic accents (Instrument Serif).
   - Reading text uses a clean sans (Geist).
   - Every label, date and number uses a monospace (Geist Mono), with annotations like `FIG. 02`, `§ 01`, `[ 50.00 Hz ]`.
3. **Schematic structure.** Hairline rules, numbered sections, crosshair marks on figures, and a faint drafting grid only where it frames something. The ornaments now sit in page headers instead of covering every page.
4. **Navigation as a single-line diagram.** The home page's section links are drawn as feeders off a bus bar, fed by a generator labelled with Devin's initials. Hover or focus a feeder and current flows to it.
5. **Calm reading surfaces.** Detail pages are plain text columns (≤ 68 characters). Rich visuals stay on overview surfaces, so content remains easy to read.

## 3. Page by page

### Home
```
┌ § 00 ─────────────────────────────────────────────────────────────┐
│ Electrical engineer                    ┌ FIG. 01  GRID FREQUENCY ┐ │
│ for energy & AI  (serif italic)        │  ∿∿∿ 3-phase traces     │ │
│                                        │  ─╲╱─ frequency trend   │ │
│ ● Power System Engineer @ Lean Power   │  [Trip generator]       │ │
│ [Download CV] [Contact] [⌘K]           │  Controller ○ off ● on  │ │
│                                        │  f 49.82 Hz  nadir …    │ │
│ portrait (annotated)                   └─────────────────────────┘ │
├ § 01  Explore ────────────────────────────────────────────────────┤
│ (G)━━━━━━━━━━━━━━━━━━━━ bus ━━━━━━━━━━━━━━━━━━━━━━━━              │
│   ┃ Experience   ┃ Education   ┃ Projects   ┃ Skills   ┃ About     │
│   ▼ 7 roles      ▼ 3 entries   ▼ 4 builds   ▼ 4 areas  ▼ contact   │
├ § 02  Focus ──────────────────────────────────────────────────────┤
│  Renewable energy · DER · Power system dynamics · Power electronics │
│  AI · ML · DL · RL · Intelligent control · Digital twin · …         │
└───────────────────────────────────────────────────────────────────┘
```
On phones, the bus turns vertical and the feeders run to the right, one per row.

### Experience
A **chart of the career**: one horizontal bar per role across 2023 → today, coloured by type (Work, Internship, Campus), with a "now" marker. Hovering a bar highlights its entry and clicking it scrolls there. The filterable, expandable timeline sits below.

### Education
The graduation photo as a banner, then the same timeline component, with a call-out card for the thesis.

### Projects
Cards carry a `FIG.` label and a figure. Every project now has **its own page** laid out like a datasheet: a spec table (context, period, stack, links), a figure gallery, then Problem / Approach / Result. The card's figure morphs into the page header during navigation.

### Skills
Four domain panels with segmented level meters (VU-meter style, 5 segments, honest bands instead of fake percentages), plus the certificates list.

### About
Bio in a reading column, annotated photos, and a "spec sheet" with location, live Jakarta time and focus areas. The contact card has tap-to-call, copy email, LinkedIn/GitHub/Instagram and **Save contact (.vcf)**, which the QR name card can reuse later.

### Everywhere
- **Command palette** (`Ctrl/⌘ K` or the button): jump to any page, project or role, copy the email, download the CV, switch theme.
- **Page transitions** via the browser's View Transitions API through Astro's `<ClientRouter />`. They switch off automatically for reduced-motion users ([Astro view transitions][astro-vt]).
- **Footer:** live Jakarta time, links, and the build date.

## 4. Visual system

| Token | Decision |
|---|---|
| Type | Instrument Serif (display, with italics), Geist Variable (text/UI), Geist Mono Variable (labels, data). Self-hosted from npm |
| Scale | Three working sizes (display, heading, body) plus a small mono label, in line with NN/g's advice to keep to about three sizes ([visual design principles][nng-vd]) |
| Colour | Unchanged from §12 of the plan: photo-derived neutrals, signal blue, sun yellow, leaf teal. Yellow is never used for text on light backgrounds |
| Lines | 1 px hairlines; section rules carry a mono index (`§ 01`); figures get crosshair corner marks |
| Grid | 12 columns, max width 1200 px, 16 px phone gutters |
| Shape | Smaller radii (6–10 px) than v3's uniform 12 px, so it reads as technical rather than "app card" |

## 5. Motion rules

| Rule | Value |
|---|---|
| Purpose | Feedback, state change, navigation only, following NN/g ([animation duration][nng-anim]) |
| Durations | 120 ms micro · 240 ms UI · 400 ms page |
| Easing | `cubic-bezier(.2,.8,.2,1)` standard; a small overshoot `cubic-bezier(.34,1.56,.64,1)` only for "needle settle" on small indicators |
| Never | Scroll-jacking ([NN/g][nng-scroll]), custom cursors, parallax on text, autoplaying motion that cannot be stopped |
| Reduced motion | `prefers-reduced-motion` stops all non-essential motion ([MDN][mdn-rm], [WCAG 2.3.3][wcag233]). The simulator then draws still frames and updates only when the visitor acts |

## 6. Budgets (checked after build; see the work log)

| Budget | Target |
|---|---|
| JavaScript per page | ≤ 40 KB gzip |
| Largest image on first view | ≤ 120 KB |
| Fonts | Latin subsets, `woff2`, `font-display: swap` |
| Core Web Vitals | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 ([web.dev][vitals]) |
| Accessibility | No serious or critical axe-core violations; keyboard access to every control |

## 7. Honesty notes

- **The simulator is a toy:** it shows a damped second-order response, says so on screen, and makes no claim about any real controller or project.
- **Skill levels are self-assessed placeholders** until Devin confirms them.

[nng-vh]: https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
[nng-vd]: https://www.nngroup.com/articles/principles-visual-design/
[nng-anim]: https://www.nngroup.com/articles/animation-duration/
[nng-scroll]: https://www.nngroup.com/articles/scrolljacking-101/
[mdn-rm]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
[wcag233]: https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
[astro-vt]: https://docs.astro.build/en/guides/view-transitions/
[vitals]: https://web.dev/articles/vitals
