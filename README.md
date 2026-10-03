# Personal-Profile-Portfolio

Devin Ezekiel Purba's personal profile hub.

| # | Part | Folder | Status |
|---|------|--------|--------|
| 1 | ATS-friendly CV (LaTeX) | [`cv/`](cv/) | ✅ Building |
| 2 | Personal profile website (GitHub Pages) | [`website/`](website/), redesign in [`design/prototype/`](design/prototype/) | 🎨 Redesign in review |
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

Plain static site in `website/` (`index.html` + `style.css`, no build step). Open `website/index.html`
in a browser to preview.

The **Deploy website** Action runs on pushes to `main` that touch `website/` or `cv/`. It compiles
the CV (personal-email variant), copies it to `cv.pdf` for the "Download CV" button, and deploys to
GitHub Pages at <https://dvez373.github.io/Personal-Profile-Portfolio/>.

One-time setup: make the repo public (or use GitHub Pro), then **Settings → Pages → Source: GitHub Actions**.

Design plan, prototype review guide and work log: [`docs/`](docs/).
