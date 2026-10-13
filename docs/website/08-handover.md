# Handover: building v5 step by step

Status: **Open** · Written 2026-10-13 · For: the next agent (or Devin) continuing on branch `website-v5-audit-and-projects`
Read first: [06-design-audit.md](06-design-audit.md) (why), [07-v5-plan.md](07-v5-plan.md) (what), this file (how).

## 1. Where things stand

| Item | State |
|---|---|
| Repo | `D:\Documents\Projects\Personal-Profile-Portfolio`, GitHub `DvEz373/Personal-Profile-Portfolio`, **public**, deployed to GitHub Pages from `main` |
| Branch | `website-v5-audit-and-projects`, 3 commits on top of `main` (audit, v5, plan + handover), **not pushed** |
| Done on the branch | Audit; certificates fix; public placeholders removed; project schema with real figures (`kind`, `featured`, `also`, `facts`, `figures`); `ProjectCover` / `ProjectCard`; Selected work on Home (demo at the bottom); 2 anonymised client case studies; 24 px chart targets; squeezed-text, placeholder and figure-loading tests; figure-metadata guard (`scripts/figures.mjs` in `npm run check`); screenshot script (`scripts/shots.mjs`); measurement script (`scripts/measure.mjs`) |
| Last gate | `npm run check` 0 errors, figures clean; build 15 pages; Playwright 81 passed, 1 skipped; private name scan clean |
| Next | Steps 0–12 below |

## 2. Rules that are not negotiable

1. **Public repo.** No client, employer, intermediary, plant, vendor, grid operator, market body or place names, no project codes and no internal model names in any committed file, commit message, figure (pixels **or** metadata), PR or issue. The employer may appear only in job history (Experience, CV).
2. **The private folder stays private.** `D:\Documents\Projects\Portfolio_Private\` (outside the repo) holds the source map, the per-project removal list, the deny list and the name scanner. Never copy its contents, or the source folder names, into the repo.
3. **Sources are read-only.** Copy figures and `.drawio` files out of the source folder named in the private handover; never edit, move or delete anything there. Edit `.drawio` copies only in the session scratchpad.
4. **Every figure** goes through: copy (or re-export) → `node scripts/figures.mjs --fix` → look at it → private scan.
5. **Ask before:** pushing, opening a PR, merging, changing the CV, and anything marked "Needs OK" in the plan. Commit as `DvEz373 <ezekiel.devin@gmail.com>`; `gh` also has a second account, so run `gh auth status` before any push.
6. **Do not invent facts.** Roles, dates and numbers come from the source summaries or from Devin.

## 3. Environment notes (Windows)

- Shells: PowerShell and Git Bash. Python is `py -3` (not `python`). Node 24.
- **Git Bash rewrites `/` arguments** into `C:/Program Files/Git/`. Use `home` for the home page in `scripts/shots.mjs`, or prefix `MSYS_NO_PATHCONV=1`.
- Preview: `cd website && npm run build && npx astro preview --port 4321` (run in the background), site at `http://localhost:4321/Personal-Profile-Portfolio/`. Playwright tests reuse a running preview server; after a rebuild the static server picks up new files without a restart.
- Screenshots: `node scripts/shots.mjs <scratch-dir> "home,projects/,projects/<slug>/"`, then view the PNGs. Desktop light, desktop dark and phone are produced together.
- draw.io desktop: `C:\Program Files\draw.io\draw.io.exe`; command-line export is tested and described in the private handover.
- OneDrive paths can be cloud-only and fail to read from a sandboxed shell; the sources now sit in a local folder, so this should not recur.

## 4. Steps

Tick each box in this file as you go and add a dated entry to [03-work-log.md](03-work-log.md) per step. One commit per step.

### Step 0. Baseline
- [ ] `git status` clean on `website-v5-audit-and-projects`; `git log --oneline -4` shows the audit, v5 and planning commits on top of `main`.
- [ ] Read 06, 07, this file, and the private handover.
- [ ] Run the gate (§5). Expect: check 0 errors and "figures: no metadata found"; 15 pages; 81 passed, 1 skipped; scan clean.

### Step 1. Questions for Devin (one message)
- [ ] For each of the 8 client case studies (titles in plan §4): one line on **his own part**.
- [ ] Start and end months, if he knows them (otherwise keep the start year only).
- [ ] OK or not for plan items **R3** (theme filters) and **R4** (Home without Explore and Career direction).
- [ ] Confirm that publishing anonymised summaries and figures is allowed by his employer and clients.
- [ ] Record the answers in the work log (roles may be quoted; they contain no client names, but check).

### Step 2. Schema and rendering (plan R1, R2)
- [ ] `content.config.ts`: optional `role: z.string()`, `coverFocus: z.string()` (an `object-position` value), `coverZoom: z.number().min(1).max(3)`.
- [ ] Project page: "My part" row at the top of the datasheet and one line under the blurb; `ProjectCover` honours focus and zoom on cards only (page headers always show the whole figure).
- [ ] Tests: a project with `role` shows "My part".

### Step 3. Data center update
- [ ] Round the text per the private map (decision D2) and drop the voltage-levels fact.
- [ ] Re-export the overview figure without exact voltages; replace `src/assets/projects/datacenter-grid-compliance/facility-overview.png`; `figures.mjs --fix`; view it.
- [ ] Add `role`.

### Steps 4–9. One case study each
Order: `pumped-storage-dfim-model`, `synchronous-condenser-model`, `ccgt-excitation-limiters`, `pv-plant-controller-models`, `gas-engine-plant-model`, `biogas-chp-plant-controller`. For each:
- [ ] Read the source summary (path in the private handover) and the private removal list for that slug.
- [ ] Figures: copy the ones marked "use"; re-export the ones marked "re-export" from a scratch copy of the `.drawio`; skip the rest. Save as `src/assets/projects/<slug>/<short-name>.png`.
- [ ] `node scripts/figures.mjs --fix`, then view every PNG.
- [ ] Write `src/content/projects/<slug>.md`, modelled on `datacenter-grid-compliance.md`: `kind: professional`, `category: energy` (or the theme set from R3), `start` (year, or months if Devin gave them), blurb ≤ 25 words, Problem / Approach / Result of 1–3 sentences each, 3–5 `facts`, `role`, figures with real `alt` text (what the figure shows) and a one-sentence `caption`, then a short Markdown body ("What we did" / "How we checked it").
- [ ] Writing style: plain English, short sentences, numbers with units, no marketing words, no em dashes; run the `stop-slop` skill on the text if available.
- [ ] Gate.

### Step 10. Selection and order
- [ ] `featured: true` on the four in plan §4; `order` as in plan §4 (academic projects keep 20–22).
- [ ] If R3 is approved: replace the category enum and chips with themes; update `CATEGORY_LABEL`, `TONE`, the filters and tests.
- [ ] Gate; screenshots of Home and Projects.

### Step 11. Design revision
- [ ] R4 only if approved; R5–R12 as written in the plan.
- [ ] If the `frontend-design` plugin is installed, run it as a review on Home, Projects and one case study; otherwise run `taste-skill` §14 pre-flight and the ui-ux-pro-max Quick Reference §1–§3 again.
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
- Exact project months (only start years are shown).
