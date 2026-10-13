# Handover: building v5 step by step

Status: **Open** · Written 2026-10-13, updated 2026-10-14 (steps 0–2b done) · For: the next agent (or Devin) continuing on branch `website-v5-audit-and-projects`
Read first: [06-design-audit.md](06-design-audit.md) (why), [07-v5-plan.md](07-v5-plan.md) (what), this file (how).

## 1. Where things stand

| Item | State |
|---|---|
| Repo | `D:\Documents\Projects\Personal-Profile-Portfolio`, GitHub `DvEz373/Personal-Profile-Portfolio`, **public**, deployed to GitHub Pages from `main` |
| Branch | `website-v5-audit-and-projects`, **not pushed**. On top of `main`: audit, v5, plan + handover, step 0, impeccable plan update, step 1, step 2 |
| Done on the branch | Audit; certificates fix; public placeholders removed; project schema with real figures (`kind`, `featured`, `also`, `facts`, `figures`); `ProjectCover` / `ProjectCard`; Selected work on Home (demo at the bottom); 2 anonymised client case studies; 24 px chart targets; squeezed-text, placeholder and figure-loading tests; figure-metadata guard (`scripts/figures.mjs` in `npm run check`); screenshot script (`scripts/shots.mjs`); measurement script (`scripts/measure.mjs`) |
| Last gate | After step 2: `npm run check` 0 errors, figures clean; build 15 pages; Playwright 83 passed, 1 skipped; private name scan clean |
| Step 3 draft | In `git stash` (`stash@{0}`, "v5 step 3 draft"): rounded data-center text and role, data-center overview re-exported without voltages, fault-locator approach and hybrid-method figure generalised (D7). **Not gated, not committed.** Apply with `git stash pop`, view both figures, then run the gate |
| Step 2b | Done 2026-10-14: audit 16/20, critique 23/32 (unchanged); new R16 (lead figure clipped) and R17 (em-dash readouts, footer version) |
| Step 3 | Done 2026-10-14 (data center rounded, fault locator generalised, card crops for both) |
| Steps 4–9 | Done: `pumped-storage-dfim-model` (step 4), `synchronous-condenser-model` (step 5), `ccgt-excitation-limiters` (step 6), `pv-plant-controller-models` (step 7) |
| Next | **Steps 8–12** |

## 2. Rules that are not negotiable

1. **Public repo.** No client, employer, intermediary, plant, vendor, grid operator, market body or place names, no project codes and no internal model names in any committed file, commit message, figure (pixels **or** metadata), PR or issue. The employer may appear only in job history (Experience, CV).
2. **The private folder stays private.** `D:\Documents\Projects\Portfolio_Private\` (outside the repo) holds the source map, the per-project removal list, the deny list and the name scanner. Never copy its contents, or the source folder names, into the repo.
3. **Sources are read-only.** Copy figures and `.drawio` files out of the source folder named in the private handover; never edit, move or delete anything there. Edit `.drawio` copies only in the session scratchpad.
4. **Every figure** goes through: copy (or re-export) → `node scripts/figures.mjs --fix` → look at it → private scan.
5. **Ask before:** pushing, opening a PR, merging, changing the CV, and anything marked "Needs OK" in the plan. Commit as `DvEz373 <ezekiel.devin@gmail.com>`; `gh` also has a second account, so run `gh auth status` before any push.
6. **Do not invent facts.** Roles, dates and numbers come from the source summaries or from Devin.
7. **Devin's publishing terms (plan D7, 2026-10-13):** no names, no locations, **approximate ratings only for every plant** (this overrides the D2 and private-map notes that keep exact ratings for PV, gas engine and biogas), **no internal algorithms** (describe methods at block level: no thresholds, layer sizes, gains or controller logic), as general as possible. Start years only (D8). His roles are in the work log, step 1 entry.

## 3. Environment notes (Windows)

- Shells: PowerShell and Git Bash. Python is `py -3` (not `python`). Node 24.
- **Git Bash rewrites `/` arguments** into `C:/Program Files/Git/`. Use `home` for the home page in `scripts/shots.mjs`, or prefix `MSYS_NO_PATHCONV=1`.
- Preview: `cd website && npm run build && npx astro preview --port 4321` (run in the background), site at `http://localhost:4321/Personal-Profile-Portfolio/`. Playwright tests reuse a running preview server; after a rebuild the static server picks up new files without a restart.
- Screenshots: `node scripts/shots.mjs <scratch-dir> "home,projects/,projects/<slug>/"`, then view the PNGs. Desktop light, desktop dark and phone are produced together.
- draw.io desktop: `C:\Program Files\draw.io\draw.io.exe`; **large diagrams are cropped even at `--scale 2`** (the pumped-storage overview, about 1250 × 700 px): check every export at full extent, and if it is cropped export `--format svg` and render that SVG in Chromium at device scale 2 (Playwright from `website/node_modules`, screenshot of the `svg` element). The draw.io SVG export carries no embedded diagram; command-line export is described in the private handover. **Use `--scale 2`**: on this machine `--scale 3` sizes the canvas for 3× but draws larger (display scaling), so the PNG is silently cropped to the top-left. Scale 2 gives the full diagram at the size of the published figures.
- Viewing figures: the Read tool shows only part of very large PNGs. Make a scaled copy first, in the scratchpad and never next to the source: Python has no Pillow here, so use `sharp` from `website/node_modules` (`sharp(in).resize({ width: 1800, fit: "inside" }).jpeg().toFile(out)`).
- Relabelling a `.drawio` copy: labels are `value="..."` attributes holding HTML-escaped text. Unescape each value, replace whole labels from a map, re-escape (`html.escape(v, quote=True)`), and fail if a label in the map was not found. Also look at `name=` attributes (page names) for leftovers.
- OneDrive paths can be cloud-only and fail to read from a sandboxed shell; the sources now sit in a local folder, so this should not recur.

## 4. Steps

Tick each box in this file as you go and add a dated entry to [03-work-log.md](03-work-log.md) per step. One commit per step.

### Step 0. Baseline
- [x] `git status` clean on `website-v5-audit-and-projects`; `git log --oneline -4` shows the audit, v5 and planning commits on top of `main`.
- [x] Read 06, 07, this file, and the private handover.
- [x] Run the gate (§5). Expect: check 0 errors and "figures: no metadata found"; 15 pages; 81 passed, 1 skipped; scan clean.

### Step 1. Questions for Devin (one message)
- [x] For each of the 8 client case studies (titles in plan §4): one line on **his own part**.
- [x] Start and end months, if he knows them (otherwise keep the start year only).
- [x] OK or not for plan items **R3** (theme filters) and **R4** (Home without Explore and Career direction).
- [x] Confirm that publishing anonymised summaries and figures is allowed by his employer and clients.
- [x] Record the answers in the work log (roles may be quoted; they contain no client names, but check).

### Step 2. Schema and rendering (plan R1, R2)
- [x] `content.config.ts`: optional `role: z.string()`, `coverFocus: z.string()` (an `object-position` value), `coverZoom: z.number().min(1).max(3)`.
- [x] Project page: "My part" row at the top of the datasheet and one line under the blurb; `ProjectCover` honours focus and zoom on cards only (page headers always show the whole figure).
- [x] Tests: a project with `role` shows "My part".

### Step 2b. Design audit before continuing (do this first in the next session)
Purpose: confirm the baseline and settle which design items (R1–R15) change before more content goes in, so the case studies are written into the final layout. Do not edit code in this step; write the results into plan §2.4 and adjust the backlog.
- [x] Build and start the preview (§3). Take screenshots of Home, Projects and one case study (`scripts/shots.mjs`) and run `node scripts/measure.mjs` for the numbers.
- [x] **impeccable** (`~/.claude/skills/impeccable`, instructions only): follow `reference/audit.md` (scores five dimensions out of 20) and `reference/critique.md` (heuristics out of 32) on those three pages. Its engine is not installed: when it says to run `scripts/impeccable`, take its "launcher unavailable" path; never download or run the engine.
- [x] **taste-skill** §14 pre-flight and **ui-ux-pro-max** Quick Reference §1–§3 on the same pages.
- [x] Compare with the baseline (audit 16/20, critique 23/32, plan §2.4; measure baseline in step 11). Record the scores, then for each finding name the R item that fixes it or add a new R item. Targets for step 11: audit ≥ 18/20, critique ≥ 26/32.
- [x] Keep it short: one pass, findings as a table, no code changes. Commit the plan update as its own step.

### Step 3. Data center update
- [x] Start from the stash (`git stash pop`). Round the text per the private map (decisions D2, D7) and drop the voltage-levels fact.
- [x] Re-export the overview figure without exact voltages; replace `src/assets/projects/datacenter-grid-compliance/facility-overview.png`; `figures.mjs --fix`; view it.
- [x] Add `role`.
- [x] Fault locator (D7, also in the stash): drop the 1 % arrival threshold and the layer sizes from the text and from the hybrid-method figure; keep the textbook steps (Clarke transform, Teager energy, arrival times). Check that no other published text names an internal parameter.

### Steps 4–9. One case study each
Order: `pumped-storage-dfim-model`, `synchronous-condenser-model`, `ccgt-excitation-limiters`, `pv-plant-controller-models`, `gas-engine-plant-model`, `biogas-chp-plant-controller`. For each:
- [ ] Read the source summary (path in the private handover) and the private removal list for that slug. Apply D7 on top of it: approximate ratings for every plant, no internal algorithms.
- [ ] Figures: copy the ones marked "use" only if they show no exact rating (D7), otherwise re-export; re-export the ones marked "re-export" from a scratch copy of the `.drawio` (`--scale 2`); skip the rest. Save as `src/assets/projects/<slug>/<short-name>.png`.
- [ ] `node scripts/figures.mjs --fix`, then view every PNG.
- [ ] Write `src/content/projects/<slug>.md`, modelled on `datacenter-grid-compliance.md`: `kind: professional`, `category: energy` (or the theme set from R3), `start` (year, or months if Devin gave them), blurb ≤ 25 words, Problem / Approach / Result of 1–3 sentences each, 3–5 `facts`, `role`, figures with real `alt` text (what the figure shows) and a one-sentence `caption`, then a short Markdown body ("What we did" / "How we checked it").
- [ ] Writing style: plain English, short sentences, numbers with units, no marketing words, no em dashes; run the `stop-slop` skill on the text if available.
- [ ] Gate.

### Step 10. Selection and order
- [ ] `featured: true` on the four in plan §4; `order` as in plan §4 (academic projects keep 20–22).
- [ ] If R3 is approved: replace the category enum and chips with themes; update `CATEGORY_LABEL`, `TONE`, the filters and tests.
- [ ] Gate; screenshots of Home and Projects.

### Step 11. Design revision
- [ ] R4 only if approved; R5–R17 as written in the plan (R16: lead figure clipped, found in step 2b).
- [ ] Review with the **impeccable** skill (`~/.claude/skills/impeccable`, instructions only): follow `reference/audit.md` and `reference/critique.md` for Home, Projects and one case study, and `reference/polish.md` + `reference/craft-floor.md` before UI edits. Its engine and hooks are deliberately not installed: when it asks to run `scripts/impeccable`, take its "launcher unavailable" path and do **not** download or run the engine. Targets: audit ≥ 18/20, critique ≥ 26/32 (baseline 16/20 and 23/32, plan §2.4).
- [ ] Then `taste-skill` §14 pre-flight and ui-ux-pro-max Quick Reference §1–§3. Use the `frontend-design` plugin too if Devin has installed it.
- [ ] `node scripts/measure.mjs`: no text under 12 px, no target under 24 × 24 px on phones, fewer uppercase labels than the audit baseline (Home 17, Experience 7 on 2026-10-13), no em dashes.
- [ ] Gate; full screenshot set.

### Step 12. Wrap-up
- [ ] Update: audit §6 progress table, plan status line, `website/README.md` (add-a-project section: `role`, cover focus, the no-names rule, the figure-metadata check), work log.
- [ ] Final gate on a clean build (`rm -rf website/dist && npm run build`).
- [ ] Send Devin the screenshots (Home, Projects, two case studies; light, dark, phone).
- [ ] **Ask before pushing.** If he agrees: run the private scan once more (it also scans unpushed history), `gh auth status` (DvEz373 active), `git push -u origin website-v5-audit-and-projects`, open a PR to `main` that describes the changes without client details, and let the Website workflow run. Merging deploys the public site.

## 5. The gate (every step)

```bash
cd website
npm run check          # astro check + figure metadata guard
npm run build
npm test               # needs: npx playwright install chromium (once)
node D:/Documents/Projects/Portfolio_Private/scan-names.mjs
node scripts/shots.mjs <scratch>/shots "home,projects/,projects/<slug>/"
```

All must pass. If the scan reports a hit in history (an earlier commit on this branch), fix the file and rewrite the unpushed commit (`git commit --amend`, or an interactive-free `git reset --soft main` and recommit) so the name never reaches GitHub. Never rewrite anything that has been pushed.

## 6. Open questions to carry

- Experience bullets and the CV name a market operator and a grid-code document. They describe the job, not a client, but Devin may want them generalised too (asked 2026-10-11, no answer yet).
- The Home hero status line names the current employer. Rule 1 allows the employer in job history; ask Devin whether the hero line counts as that or should say "Power System Engineer" only.
- ~~Exact project months~~ Settled 2026-10-13: start years only (D8).

## 7. Prompt for the next session

Paste this into a new Claude Code session opened in the repo folder.

```text
Continue v5 of Devin Ezekiel Purba's portfolio (Astro 7 + TypeScript in `website/`) in `D:\Documents\Projects\Personal-Profile-Portfolio`, branch `website-v5-audit-and-projects` (local, not pushed).

1. `git switch website-v5-audit-and-projects`. `git status` must be clean (an untracked `.claude/` is fine). `git stash list` must show "v5 step 3 draft"; leave it until step 3.
2. Read, in this order: `docs/website/08-handover.md` (your task list, rules and gate), `docs/website/07-v5-plan.md` (decisions D1–D8, content plan, backlog R1–R15), `docs/website/03-work-log.md` (the step 1 entry has Devin's role for each project), `docs/website/06-design-audit.md`, then the private `D:\Documents\Projects\Portfolio_Private\HANDOVER_PRIVATE.md`, including its section 6 update.
3. Steps 0–2 are done. Next is **step 2b, the design audit**. Run it exactly as written, change no code, record the scores and findings in plan §2.4, and commit. Then do steps 3–12 in order, with one commit per step. Tick the boxes in 08-handover.md and add a dated work-log entry for each step.

Rules that matter most:
- The repo is public. Write no client, employer, plant, vendor, grid operator, market body or place names, no project codes and no internal model names in any committed file, commit message, figure pixels or figure metadata. Never copy anything from `Portfolio_Private` into the repo.
- Devin's terms (D7): approximate ratings only, for every plant, and no internal algorithms (no thresholds, layer sizes, gains or controller logic). Start years only. Use his roles from the work log; never invent a role, date or number.
- Sources in `D:\Documents\Work\Project_History\` are read-only. Edit `.drawio` copies in your scratchpad only. Export with `--scale 2`, because scale 3 crops the image. Check every figure from a scaled preview written to your scratchpad, then run `node website/scripts/figures.mjs --fix` and the private scan.
- The gate after every step is in handover §5. A preview server may already be running on port 4321; reuse it.
- Ask Devin before pushing, opening a PR, merging or changing the CV. Commit as DvEz373 <ezekiel.devin@gmail.com>. Run `gh auth status` before any push.
- Keep token use low: read only what a step needs, batch commands, view only the screenshots the gate requires, and report briefly.
```
