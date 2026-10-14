---
title: Documentation index
type: index
covers: [docs/]
---

# Documentation index

Devin Ezekiel Purba's professional profile: **website**, **CV** and **name card**, one repository. Start with [project/overview.md](project/overview.md).

## How the docs are organised

| Layer | Read when | Files |
|---|---|---|
| 0. Agent brief | Always (loaded automatically by Claude Code) | [`../CLAUDE.md`](../CLAUDE.md) |
| 1. Index and graph | To find the right doc or see what a file touches | this file, [graph/README.md](graph/README.md) |
| 2. Reference (current truth) | Before changing something | `project/`, `website/{architecture,content-model,design-system,quality}.md`, `cv/reference.md`, `card/reference.md` |
| 3. Runbooks | To do a known task | [project/runbooks.md](project/runbooks.md) |
| 4. History (why) | Only when the reason behind something matters | `website/01` to `08`, `card/01-research.md`, `website/research/` |

Every doc starts with front matter: `type` (`index`, `reference`, `runbook`, `history`, `log`), and `covers` (the files it explains) or `current` (for history docs, the reference doc that replaced it). `scripts/graph.mjs` reads it.

## Reading paths

| Task | Read, in order |
|---|---|
| Any change | `CLAUDE.md` → [publishing rules](project/publishing-rules.md) → `node scripts/graph.mjs query <file>` |
| Add or edit a project | [content model](website/content-model.md#projects) → [runbook R-03](project/runbooks.md#r-03-add-a-client-case-study) |
| Change a personal fact (job, phone, certificate) | [sources of truth](project/sources-of-truth.md) → [runbooks R-05 to R-07](project/runbooks.md#r-05-change-or-leave-a-job) |
| Website code or layout | [website architecture](website/architecture.md) → [design system](website/design-system.md) → [quality](website/quality.md) |
| CV | [CV reference](cv/reference.md) → [runbook R-08](project/runbooks.md#r-08-build-and-check-the-cv) |
| Name card | [card reference](card/reference.md) |
| CI, deploy, environments | [architecture](project/architecture.md#build-and-deploy) → [environments](project/environments.md) |
| Why a decision was made | [decision register](project/decisions.md) → linked history doc |

## All documents

### Project (cross-cutting)

| Doc | Covers |
|---|---|
| [project/overview.md](project/overview.md) | The three products, audience, status, where to go next |
| [project/architecture.md](project/architecture.md) | Repository layout, data flow, build and deploy, base path |
| [project/sources-of-truth.md](project/sources-of-truth.md) | Where each fact lives and which copies must stay in sync (site, CV, card) |
| [project/publishing-rules.md](project/publishing-rules.md) | What may be published in a public repository and site |
| [project/decisions.md](project/decisions.md) | Decision register: platform, card, content (D1 to D11), design (R1 to R17), docs |
| [project/runbooks.md](project/runbooks.md) | Task recipes R-01 to R-13 |
| [project/environments.md](project/environments.md) | Windows PC versus cloud session, gotchas |

### Website

| Doc | Type | Covers |
|---|---|---|
| [website/architecture.md](website/architecture.md) | reference | Routes, layouts, components, libraries, client scripts |
| [website/content-model.md](website/content-model.md) | reference | Collections and every field |
| [website/design-system.md](website/design-system.md) | reference | Tokens, type, motion, responsive rules |
| [website/quality.md](website/quality.md) | reference | Tests, scripts, targets, CI |
| [../website/README.md](../website/README.md) | guide | Run, edit and publish (for Devin) |
| [website/03-work-log.md](website/03-work-log.md) | log | Every step, newest at the bottom |
| [website/01-design-plan.md](website/01-design-plan.md) | history | Goals, page map, wireframes (v1 to v3) |
| [website/02-prototype-guide.md](website/02-prototype-guide.md) | history | v3 vanilla prototype in `design/prototype/` |
| [website/04-framework-research.md](website/04-framework-research.md) | history | Why Astro: criteria, measurements, scoring |
| [website/05-visual-direction.md](website/05-visual-direction.md) | history | "Grid & Signal" concept (v4) |
| [website/06-design-audit.md](website/06-design-audit.md) | history | Audit of v4.1 and its progress table |
| [website/07-v5-plan.md](website/07-v5-plan.md) | history | v5 research, decisions D1 to D8, backlog R1 to R17, audit scores |
| [website/08-handover.md](website/08-handover.md) | history | v5 step-by-step handover |
| [website/research/framework-benchmark/](website/research/framework-benchmark/README.md) | history | Benchmark apps and raw results |

### CV and name card

| Doc | Type | Covers |
|---|---|---|
| [cv/reference.md](cv/reference.md) | reference | Files, build variants, ATS check, writing rules |
| [card/reference.md](card/reference.md) | reference | Card, print card, QR, vCard, change checklist |
| [card/01-research.md](card/01-research.md) | history | Options compared, QR print rules |

### Knowledge graph

| File | What |
|---|---|
| [graph/README.md](graph/README.md) | Generated overview: diagrams, counts, how to query |
| `graph/graph.json` | Generated graph: nodes and edges, one per line |
| `graph/curated.mjs` | Hand-written layer: products, outputs, rules, decisions, sync links |

## Keeping docs true

1. Change code → update the reference doc that `covers` it (`node scripts/graph.mjs query <file>` lists them).
2. `node scripts/graph.mjs` → commit the regenerated graph.
3. `node scripts/graph.mjs --check` (CI runs it) fails on a stale graph, a broken link or a `covers` path that no longer exists.
4. Record the change in the [work log](website/03-work-log.md).
