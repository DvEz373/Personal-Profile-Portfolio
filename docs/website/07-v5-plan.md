# v5 plan: client case studies and design revision

Status: **Planned 2026-10-13, ready to build** · Branch: `website-v5-audit-and-projects` (local, not pushed) · Follows [06-design-audit.md](06-design-audit.md) · Execution guide: [08-handover.md](08-handover.md)

## 1. Goal

Turn the site from "strong frame, weak proof" (audit score 4/10 for content) into a portfolio whose first screen after the hero shows real engineering work. Do it with eight anonymised client case studies built from real figures, without changing the visual identity that already works.

## 2. Research

### 2.1 Tools and skills used

| Lens | Result |
|---|---|
| **taste-skill** | Design read: personal portfolio for recruiters and engineering clients, calm technical "instrument panel" language, native CSS + Astro + Geist. Dials: variance 6, motion 4, density 5. Flags still open on the site: eyebrow overload, decorative locale strip (kept on purpose, see audit §3), hand-drawn decorative SVG on cards without figures |
| **ui-ux-pro-max** | Pattern `portfolio-grid`: *Hero → Project grid → About → Contact*, visuals first, filter by category. Design system query for this brief returned "Minimalism & Swiss style, monochrome + blue accent", which the current palette already matches. It suggested Archivo + Space Grotesk; keep Geist, which taste-skill lists as a preferred sans and which v4.1 settled on. Direction: **targeted evolution, not a redesign** (taste-skill §11.E) |
| **design:design-critique** (Design plugin) | First impression correct (name and portrait, then work). Issues: diagram covers are dense and unreadable at card size; Home has three navigation-like sections in a row (Selected work link, Explore, Career direction); client cards all read "Energy & power", so the filter does nothing for client work; case studies say "we" and never state Devin's part |
| **frontend-design** (Anthropic plugin) | Available in the plugin catalog but not installed; offered to the user on 2026-10-13. Run it on step 11 if installed |
| **impeccable** (v4.5.2, Apache 2.0) | Installed 2026-10-13 into `~/.claude/skills/impeccable`: instructions only (`SKILL.md`, `reference/`). Its engine binary, launcher and edit hooks were **not** installed (they download and run an unverified binary), so its deterministic detector is unavailable and the skill runs in its documented "launcher unavailable" mode. Results in §2.4 |

### 2.2 What reviewers look for in case studies

- **Problem first, then process, then outcome.** Hiring managers want to see how a project started, the constraints, the decisions and what changed because of the work. A problem-first structure with the problem in one or two sentences at the top works best ([uxfol.io][uxfolio], [lyssna][lyssna]; NN/g findings as summarised there, not checked at the source).
- **Fewer, deeper projects.** Several sources recommend 2–4 strong case studies over many thin ones, and 3 deep case studies over 10 screenshots ([fueler][fueler], [jobcannon][jobcannon]). Here: eight client case studies is fine on the Projects page, but Home features **four**, and the two near-identical PV controller projects become **one**.
- **Own contribution.** Be explicit about what you did versus what the team did ([medium][medium-ux]). Every case study gets a **"My part"** line written from Devin's own answer.

### 2.3 Showing work under NDA

- Describe the client by category, not name; remove logos, project codenames, file names and identifying screenshots; keep the reasoning and process; round numbers that could identify ([fueler][fueler], [GrabCAD][grabcad]).
- **Found on this project:** draw.io PNG exports embed the whole editable diagram in a `zTXt` chunk. Several figures that look clean carry client and plant names in that hidden source. The site's "Full size" link serves the original PNG, so this would publish it. Guarded since 2026-10-13 by `website/scripts/figures.mjs`, which runs in `npm run check`.
- Ratings can identify unique plants even without names. Decision below.
- Permission is the owner's responsibility: Devin confirms that publishing anonymised summaries and figures is allowed under his employment and client agreements before the branch is pushed.

### 2.4 impeccable audit and critique (2026-10-13, single-context, no detector)

**Audit: 16/20 (Good).** Accessibility 3 (axe clean, focus, reduced motion; labels at 11–11.8 px; tap targets under 44 px on phones). Performance 4. Theming 3 (full tokens and designed dark mode; a few hard-coded colours). Responsive 3 (no overflow; same tap targets). Implementation integrity 3 (person-specific system; v4.1 leftovers).

**Critique: 23/32 (72 %, Good)**, heuristics 5 and 10 n/a for a portfolio. Lowest: aesthetic and minimalist design (2), because Home stacks three navigation-like blocks. Design specificity passes; the template-like parts are the career chip cards and eyebrow-over-H1 headers.

| Priority | Issue | Plan item |
|---|---|---|
| P1 | Home: Explore and Career direction after Selected work dilute the page | R4 |
| P1 | Card covers are whole diagrams, unreadable at card size | R1 |
| P2 | Jargon (RoCoF, EMT/RMS, PSS/E) with no plain explanation for non-engineer recruiters | **R13** (new) |
| P2 | Phone tap targets under 44 × 44 px: header search/theme/menu buttons, filter chips, footer links | **R14** (new) |
| P2 | Eyebrow overload | R5 |
| P3 | Hard-coded colours outside tokens (Home `#e9eef3`, figure sheets, instrument background) | **R15** (new) |

## 3. Decisions (Devin, 2026-10-11 and 2026-10-13)

| # | Decision |
|---|---|
| D1 | Client case studies name no client, employer, intermediary, plant, vendor, grid operator, market body or place, and no project codes or internal model names, in text, figure pixels or figure metadata |
| D2 | Exact ratings stay for common plants (PV, gas engine, biogas CHP). Unique plants (pumped storage, combined-cycle, data center, synchronous condenser) use rounded or class figures, and their figures are re-exported without exact ratings |
| D3 | The two PV power plant controller projects become one case study |
| D4 | Devin gives a one-line role for each project; the agent asks before writing and never invents one |
| D5 | The employer stays on Experience and the CV (job history), never in case studies |
| D6 | The interactive demo stays at the bottom of Home |
| D7 | (2026-10-13, answer to step 1) Publishing is allowed on these terms: no names, no locations, **no real ratings for any plant, only approximate or class figures** (this replaces the D2 exception for common plants), no internal algorithms, and everything kept as general as possible |
| D8 | (2026-10-13) Start years only; no months. R3 and R4 approved ("proceed as you see fit") |

## 4. Content plan

Eight client case studies plus the three academic projects. Order and featuring are proposals; Devin can reorder.

| Order | Slug | Working title | Theme | Ratings | Featured |
|---:|---|---|---|---|:-:|
| 1 | `datacenter-grid-compliance` | Grid Compliance Model for a Hyperscale Data Center | Grid studies | Round (update the published text and figure) | ✓ |
| 2 | `pumped-storage-dfim-model` | Adjustable Speed Pumped Storage Model | Machine models | Round, re-export figures | ✓ |
| 3 | `synchronous-condenser-model` | Synchronous Condenser Model and Automated Test Bench | Machine models | Round, re-export figure | ✓ |
| 4 | `tw-fault-locator` | AI Fault Locator for Power Lines | AI | Fine as published | ✓ |
| 5 | `ccgt-excitation-limiters` | Excitation Limiter Models for a Combined-Cycle Plant | Machine models | Round, re-export figures | |
| 6 | `pv-plant-controller-models` | Power Plant Controller Models for PV Plants | Plant controllers | Keep | |
| 7 | `gas-engine-plant-model` | Gas Engine Power Plant Model | Plant controllers | Keep | |
| 8 | `biogas-chp-plant-controller` | Biogas CHP Plant Controller Model | Plant controllers | Keep | |

Featured mix: one study, one unusual machine, one automation-heavy validation, one AI project. Each case study keeps the existing shape: blurb, Problem / Approach / Result, key facts, **My part** (new), Markdown body, 1–3 figures.

Source paths, the per-project list of names to remove, and the figure-by-figure verdicts live in a **private** file outside this repository (see the handover). Nothing in that file may be copied here.

## 5. Design revision backlog

Severity follows the audit. "Needs OK" items change what visitors see in a way Devin should approve first; ask once, in one message, at step 1.

| # | Item | Proposal | Needs OK |
|---|---|---|:-:|
| R1 | Readable covers | Cards show a cropped region of the cover diagram instead of the whole drawing: add optional `coverFocus` (CSS `object-position`) and `coverZoom` per project; default to the full figure | |
| R2 | "My part" | New optional `role` field; shown in the datasheet as "My part" and as one line under the blurb on the project page | |
| R3 | Filters that work for client work | Replace Energy / AI / IoT chips with themes: Plant controllers · Machine models · Grid studies · AI · IoT (client and academic projects share them) | ✓ approved |
| R4 | Home rhythm | Hero → Selected work (4) → About teaser (2–3 lines + link) → Interactive demo → contact. Remove "Explore" (duplicates the header nav) and "Career direction" (its chips already appear on About) | ✓ approved |
| R5 | Eyebrow overload (audit #8) | Drop page-header eyebrows that repeat the H1; keep section notes only where they add information | |
| R6 | Hero duplicate (audit #9) | Eyebrow becomes the location only ("Jakarta, Indonesia"); "Electrical Engineer" stays in the headline | |
| R7 | About double contact (audit #10) | Hide the global contact band on About | |
| R8 | Graduation photo ×3 (audit #11) | Remove it from inside the degree entry | |
| R9 | Small labels (audit #12) | Minimum 12 px for every label; chart axes 12 px | |
| R10 | Dead space (audit #13) | Trim the empty band above the contact section and the hero bottom padding | |
| R11 | Leftover `SectionHead` index (audit #14) | Remove the hidden `§ index` span and the `index` props | |
| R12 | Dark mode figure glare | In dark mode, figure sheets use an off-white (`#eef1f4`) instead of pure white | |
| R13 | Plain language (impeccable critique) | First sentence of every blurb readable by a non-engineer; expand each acronym on first use per page with `<abbr title>` (RoCoF, EMT, RMS, PPC, PoC, DFIM, LVRT…) | |
| R14 | 44 px phone targets (impeccable audit) | Under `(pointer: coarse)`: header tool buttons, filter chips and footer links get a 44 px minimum hit area (padding or `::before` pad, as on the career chart) | |
| R15 | Colour tokens (impeccable audit) | Move the remaining hard-coded colours into tokens (`--figure-sheet`, `--instrument-bg`, the Home light-text value) | |

## 6. Build plan

Each step ends with the gate in §7 and its own commit. The handover has the exact commands.

| Step | Work | Done when |
|---|---|---|
| 0 | Baseline: read docs 06–08 and the private handover; run the gate on the current branch | Gate passes, nothing changed |
| 1 | Ask Devin, in one message: role for each of the 8 client projects, any known start/end months, OK or not for R3 and R4 | Answers recorded in the work log |
| 2 | Schema: `role`, `coverFocus`, `coverZoom` (R1, R2); render "My part" | Check passes; existing pages unchanged except the new line where set |
| 3 | Data center: round the text (D2), re-export the overview figure without voltages, add role | Gate passes; private scan clean |
| 4–9 | One case study per step, in the table order (skip the two already published): copy figures, re-export where the private map says so, strip metadata, look at every figure, write the Markdown, add role | Gate passes per project |
| 10 | Featured, order, Selected-work copy; R3 if approved | Home shows the four featured projects |
| 11 | Design revision R4–R15 (R3/R4 only if approved); then re-run impeccable `audit` and `critique` (target: audit ≥ 18/20, critique ≥ 26/32), taste-skill §14 pre-flight and ui-ux-pro-max Quick Reference §1–§3 | Screenshots reviewed in light, dark and phone |
| 12 | Final QA and docs: audit §6 progress, README, work log, this plan's status | Gate passes; Devin reviews screenshots; push and PR only after Devin says so |

## 7. Gate (every step)

1. `npm run check` (types and figure metadata), `npm run build`, `npm test`.
2. Private name scan (path in the handover) exits 0.
3. Screenshots of every page the step touched, viewed in desktop light, desktop dark and phone.
4. Work log entry added; commit message names no client, plant or place.

[uxfolio]: https://blog.uxfol.io/how-to-create-a-personal-portfolio/
[lyssna]: https://www.lyssna.com/blog/ux-designer-portfolio/
[medium-ux]: https://medium.com/design-bootcamp/stop-guessing-the-exact-ux-portfolio-structure-top-companies-love-8da8a19594e1
[fueler]: https://www.fueler.io/blog/how-to-write-case-study-client-work-under-nda
[grabcad]: https://blog.grabcad.com/blog/2015/05/19/confidential-engineering-portfolio/
[jobcannon]: https://jobcannon.io/de/skills/portfolio-building
