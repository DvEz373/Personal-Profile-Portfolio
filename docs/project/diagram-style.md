---
title: Diagram and visual style
aliases: [Diagram and visual style, Diagram style]
type: reference
covers: [docs/project/img/, scripts/graph.mjs]
---

# Diagram and visual style

Every diagram, figure or image in this project (docs, site, CV, card) is designed, not defaulted. Devin's rule (2026-10-14): use the design tools and skills for any visual work so it does not look generic.

## Tools, in order of use

| Step | Tool | Where it runs |
|---|---|---|
| Direction and anti-generic check | `frontend-design` skill (plan tokens, compare against the generic defaults it lists) | Cloud and PC |
| Taste and audit | **impeccable** (`audit`, `critique`, `polish`), **taste-skill** §14, **ui-ux-pro-max** | Devin's PC (`~/.claude/skills/`); not installed in cloud sessions |
| Drawing | **draw.io**: the draw.io MCP tool (`create_diagram`) to view and share, the draw.io app to edit | Cloud (MCP) and PC (app) |
| Critique | `design:design-critique` skill on a rendered PNG, at the width readers see (about 900 px for GitHub) | Cloud and PC |
| Generated diagrams | Mermaid with the theme below (`scripts/graph.mjs` writes it) | Anywhere |

Say in the work log which of these ran. If a tool is not available, say so; do not skip the critique.

## Visual language

- **Subject first.** Devin is a power-system engineer. The system map is a **single-line diagram**: sources are generators, checks are breakers, the build is a bus, transformers convert (Astro build, LaTeX), GitHub Pages is the grid, PR checks are a protection relay. Reuse this vocabulary rather than generic boxes and arrows.
- **Line legend** (same as the case-study figures on the site): solid ink for the power or content path, dashed sun `#c99400` for measurement, dashed signal `#1d5fc4` for command.
- **Palette**: the site's tokens. Ink `#12161c`, muted text `#4c5866`, paper background `#f3f5f7`, line `#aeb8c3`, signal `#1d5fc4` with soft `#e1eaf8` (code, data in), sun-ink `#8a6300` with soft `#fbf1cf` (outputs), leaf `#0e8f7e` with soft `#d9f0ec` (checks, data files).
- **Type**: Geist where it can load (draw.io), falling back to Helvetica or Arial; Mermaid keeps its default sans (see pitfalls). Sentence case. Bold title, muted detail line. No all-caps labels, no monospace micro-labels, no "→" decoration.
- **Restraint**: one bold idea per diagram; everything else quiet. Labels sit beside symbols, never on top of lines. No edge labels where a legend can say it.
- **Readable at 900 px**: GitHub shrinks wide images. Keep diagrams under about 1,000 px wide with 14 px text.

## Files

| Kind | Format | Edit with |
|---|---|---|
| Hand-drawn diagrams | `docs/**/img/*.drawio.svg` (SVG with the draw.io source embedded in its `content` attribute) | draw.io app or app.diagrams.net: open, edit, save; GitHub and Obsidian show it |
| Generated diagrams | Mermaid in `docs/graph/README.md`, `docs/graph/modules.md` | `scripts/graph.mjs` (`MERMAID_INIT`, `MERMAID_CLASSES`) |
| Hand-written Mermaid | Mermaid block with the init line below | text editor |
| Obsidian canvas | `docs/graph/portfolio.canvas`, generated; column colours are the site tokens | `scripts/graph.mjs` |
| Website figures | PNG in `website/src/assets/projects/`, metadata stripped | [publishing rules](publishing-rules.md) |

Mermaid init line (copy into hand-written diagrams):

```text
%%{init: {"theme": "base", "themeVariables": {"fontSize": "14px", "primaryColor": "#ffffff", "primaryTextColor": "#12161c", "primaryBorderColor": "#12161c", "lineColor": "#4c5866", "secondaryColor": "#f3f5f7", "tertiaryColor": "#f3f5f7", "clusterBkg": "#f3f5f7", "clusterBorder": "#aeb8c3", "edgeLabelBackground": "#f3f5f7"}}}%%
```

Node classes: `code` (signal soft), `data` (leaf soft), `out` (sun soft), `prod` (ink), `ext` (muted).

## Process

1. Write the brief in one line: what the diagram must show, for whom, where it is read.
2. Plan tokens and the one bold idea; check the plan against the generic defaults in `frontend-design`; revise.
3. Draw (draw.io XML or Mermaid). Render to PNG at reading width.
4. Critique with `design:design-critique`; on the PC also impeccable `critique`. Fix, render, look again.
5. Commit the `.drawio.svg` (or the Mermaid), run `node scripts/graph.mjs --check`, note the tools used in the work log.

## Pitfalls found so far

- Mermaid breaks when `themeVariables.fontFamily` is a font list: the CSS is dropped and text falls back to a serif. Leave `fontFamily` out.
- Rendering draw.io XML outside draw.io (the `mxgraph` npm engine) does not know draw.io's named styles: write `shape=ellipse;perimeter=ellipsePerimeter;` instead of `ellipse;`, and `fillColor=none;strokeColor=none;` for text.
- Obsidian does not render Markdown inside `<details>`: put large diagrams in their own note.
- The draw.io CDN and viewer are blocked in cloud sessions; render with `mxgraph` from npm in Chromium (see the work log entry of 2026-10-14).
