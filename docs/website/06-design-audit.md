---
title: Design audit of v4.1
type: history
current: quality.md
---

# Design audit (v4.1, live site)

Status: **Audit done 2026-10-11; fixes in progress on branch `website-v5-audit-and-projects`** · Audited build: `main` @ `bd3a209`, the same build deployed at <https://dvez373.github.io/Personal-Profile-Portfolio/>

## 1. How the audit was done

| Lens | What it checks | Source |
|---|---|---|
| **taste-skill** (anti-slop frontend) | Brief fit, hero discipline, eyebrow and label count, decorative SVG, placeholder content, copy, motion purpose | `~/.claude/skills/taste-skill` |
| **ui-ux-pro-max** | Priority 1–10 checklist: accessibility, touch targets, performance, layout, typography, motion, navigation, charts; pattern database lookup for portfolios | `~/.claude/skills/ui-ux-pro-max` |
| **Measurement** | Full-page screenshots of every page at 1440×900 (light and dark) and 390×844 (phone); script counts of text under 12 px, targets under 24×24 px, uppercase labels and dashes; existing Playwright + axe-core suite | Local `astro preview` of the production build |

The skills named *impeccable* and *frontend-design* are not installed in this environment, so their checks are covered by the two skills above. Skill rules are guidance: where a rule conflicts with the brief (an engineer's portfolio, recruiter and client audience) the audit says so instead of applying it blindly.

**Design read:** a personal portfolio for recruiters and engineering clients in power systems, with a calm technical "instrument panel" language, built on native CSS + Astro + Geist. Fitting dials: variance 6, motion 4, density 5 (between the taste-skill "developer portfolio" and "trust-first" presets). The live site sits close to that.

## 2. What already works (keep it)

- **A real concept, not a template.** The grid-frequency instrument, single-line-diagram navigation and signal chain say "power systems + control" without a paragraph of text. This is the site's strongest asset.
- **Engineering quality.** 9–11 KB of JavaScript per page, content in the HTML, AVIF/WebP photos, schema-checked YAML content, vCard and QR card, view transitions that switch off for reduced motion.
- **Accessibility baseline.** 55 Playwright tests pass, axe-core finds no serious or critical violations, keyboard access works, dark mode is designed rather than inverted, `prefers-reduced-motion` is honoured.
- **Restraint.** One typeface family (Geist + Geist Mono), one signal-blue accent with photo-derived secondary colours, small radii, no purple gradients, no glassmorphism.

## 3. Findings

Severity: **P0** broken or embarrassing on the live site · **P1** hurts the main goal (getting hired or hired as a consultant) · **P2** polish.

| # | Sev | Finding | Evidence | Lens |
|---|---|---|---|---|
| 1 | P0 | **Certificates list is broken on desktop and phone.** Names wrap one word per line and the dates sit on top of them. | `skills.astro`: v4.1 (PR #7) removed the row number `<span class="n">` but the grid kept `grid-template-columns: 36px 1fr auto 20px`, so the name lands in the 36 px column. The test suite passed because it checks overflow and axe, not overlap. | Layout |
| 2 | P0 | **Developer notes are public.** "Placeholder: replace with a non-confidential summary, or delete this file." on `/projects/hybrid-ppc/`; "Work sample (placeholder)" in the command palette; "Image to come" slots on every project page; "Self-assessed. Levels are placeholders until confirmed." on Skills. | Live HTML | taste-skill §4.8, §4.9 |
| 3 | P1 | **The home page shows no work.** The order is hero → toy demo → navigation → career chips (now: hero → Selected work → navigation → career → demo). A recruiter has to click into Projects to see anything Devin built. The ui-ux-pro-max portfolio pattern is *Hero → Project grid → About → Contact*, "visuals first". | `index.astro` | ui-ux-pro-max landing `portfolio-grid` |
| 4 | P1 | **Professional work is missing.** A year of client projects (PPC, CCGT, DFIM pumped storage, synchronous condenser, travelling-wave fault location, data-center grid compliance) appears only as bullet points in Experience. Projects lists three student projects and one placeholder. | `src/content/projects/` | Content |
| 5 | P1 | **Project figures are generic drawings.** Every card uses a hand-drawn SVG; MARL and SCANOCR share the same neural-network drawing. Real diagrams exist for the professional work. | `ProjectArt.astro`, projects grid | taste-skill §4.8 |
| 6 | P1 | **Project page H1 is off-system and collides with the header art.** It still uses `font-weight: 400`, sized for the removed Instrument Serif, so it is lighter than every other H1; long titles at 1440 px run into the network ornament. | `projects/[slug].astro` L166–171 | Typography, layout |
| 7 | P1 | **Career-chart bars are tiny tap targets on phones** (21–28 × 16 px; WCAG 2.2 asks for 24 × 24). | Measured at 390 px | ui-ux-pro-max §1 `web-target-size` |
| 8 | P2 | **Eyebrow and label overload.** Every page header repeats its H1 as an eyebrow ("PROJECTS / Projects"); every section has an uppercase note; the home page has 16 uppercase labels. taste-skill allows about one per three sections. | Screenshots | taste-skill §4.7 |
| 9 | P2 | **"Electrical Engineer" twice in the hero** (eyebrow and headline line). | `index.astro` hero | taste-skill hero stack |
| 10 | P2 | **About ends with two contact blocks** (its own contact list, then the global "Let's build cleaner, smarter energy systems" band). Same intent twice. | About screenshot | taste-skill §4.5 duplicate CTA |
| 11 | P2 | **Graduation photo is used three times** (Education banner, inside the degree entry on the same page, About). | Screenshots | Content |
| 12 | P2 | **Small labels.** 4–17 text nodes per page render at 11.2–11.8 px (mono labels, chart axes, meter captions). Readable on desktop, tight on phones. | Measured at 390 px | ui-ux-pro-max §6 |
| 13 | P2 | **Dead space.** ~150–200 px of empty band under the last section of every page before the contact band, and a large gap between hero and demo. | Screenshots | Layout rhythm |
| 14 | P2 | **Leftover v4.1 code.** `SectionHead` still renders a hidden `§ index`; the `index` props on every page do nothing. | `SectionHead.astro`, `global.css` `.idx { display: none }` | Maintainability |
| 15 | P2 | **Test gap.** No check catches overlapping or collapsed text, so finding 1 shipped green. | `tests/site.spec.ts` | Process |

Notes on rules not applied:
- **Date ranges keep the en dash** (`Sep 2024 – Jul 2025`). taste-skill bans dashes as a style tic, but an en dash in a range is correct typography and reads better than a hyphen; there are no em dashes in the copy.
- **The Jakarta clock stays.** taste-skill flags locale strips as decoration, but Devin works with clients in several time zones, so a visible time zone is useful.

## 4. Scorecard

| Area | Score | Why |
|---|---:|---|
| Concept and originality | 8/10 | Domain-specific language and a playable demo; not a template |
| Accessibility | 8/10 | axe clean, keyboard, reduced motion; minus small targets and 11 px labels |
| Performance | 9/10 | Tiny JS, optimised images, static HTML |
| Visual system | 7/10 | Coherent tokens and type; minus label overload and the off-system project H1 |
| Layout | 6/10 | Broken certificates list, dead space, header-art collision |
| **Content and proof of work** | **4/10** | No work on Home, no professional projects, placeholders public |
| **Overall** | **7/10** | Strong frame, weak proof. The fastest win is real project content |

## 5. Plan (this branch)

1. Fix P0: certificates grid; remove every public placeholder string.
2. Add the professional projects as case studies with their real overview figures (findings 4–5), replacing the `hybrid-ppc` placeholder.
3. Add a "Selected work" grid to Home directly after the hero (finding 3).
4. Fix the project-page H1 weight and header-art overlap (finding 6) and the chart tap targets (finding 7).
5. Add a regression test for collapsed text (finding 15).
6. Leave findings 8–14 as recommendations for a later pass unless Devin approves them.

## 6. Progress

| Item | Status |
|---|---|
| 1. Certificates grid (finding 1) | Done: grid reduced to name, date and icon columns |
| 1. Public placeholder strings (finding 2) | Done: placeholder project removed, "Image to come" slots removed, Skills caveat reworded |
| 2. Client projects with real figures (findings 4–5) | Done (v5): 8 of 8 client case studies, all anonymised with approximate ratings (the two PV controller projects merged into one, so 9 sources became 8) |
| 3. "Selected work" on Home (finding 3) | Done |
| 4. Project-page H1 and header art (finding 6) | Done: H1 back to weight 600 and max 22ch; header ornament hidden when a real figure is shown; leftover 56 px step indent removed |
| 4. Chart tap targets (finding 7) | Done: invisible 24 × 24 px minimum hit area per bar |
| 5. Regression test (finding 15) | Done: per-page squeezed-text and placeholder check; home → project figure-loading check |
| v5 design revision (findings 8–14 and the step 2b review) | Done: plan items R1–R17 in [07-v5-plan.md](07-v5-plan.md) §5 (steps 2, 10 and 11); audit 19/20, critique 25/32 |

Progress is logged in [03-work-log.md](03-work-log.md).
