# Personal-Profile-Portfolio

Devin Ezekiel Purba's personal profile hub.

| # | Part | Folder | Status |
|---|------|--------|--------|
| 1 | ATS-friendly CV (LaTeX) | [`cv/`](cv/) | ✅ Building |
| 2 | Personal profile website (GitHub Pages) | [`website/`](website/) (Astro) | 🚧 Built and tested; Pages not enabled yet |
| 3 | Online name card with QR code | `card/` | 🔜 Planned |

## 1. CV

Source lives in `cv/`. `main.tex` pulls in one file per section.

Build locally (MiKTeX or TeX Live):

```bash
cd cv
latexmk -pdf main.tex                                                          # personal email -> main.pdf
latexmk -pdf -jobname=main-work "-usepretex=\def\UseWorkEmail{}" main.tex     # work email     -> main-work.pdf
```

The two addresses live in `cv/config.sty` (`\personalemail`, `\workemail`).

Every push that touches `cv/` runs the **Build CV** GitHub Action, which compiles the PDF,
checks that an ATS can extract its text, and uploads both variants (personal and work email) as downloadable artifacts.

**ATS notes:** single column, standard section names, real Unicode text
(`glyphtounicode` + T1 fonts), visible URLs, and PDF metadata set. No tables, icons, or images.

## 2. Website

Astro 7 + TypeScript site in [`website/`](website/): run, edit and publish instructions are in [`website/README.md`](website/README.md).
The **Website** workflow type-checks, builds and browser-tests every change; it deploys to
<https://dvez373.github.io/Personal-Profile-Portfolio/> once Pages is enabled and the `PAGES_ENABLED` repository variable is `true`.

Research, design decisions and the step-by-step log: [`docs/`](docs/).
