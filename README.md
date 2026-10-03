# Personal-Profile-Portfolio

Devin Ezekiel Purba's personal profile hub: Electrical Engineer · Energy & AI.

- **Website:** <https://dvez373.github.io/Personal-Profile-Portfolio/>
- **Name card:** <https://dvez373.github.io/Personal-Profile-Portfolio/card/>

| # | Part | Folder | Status |
|---|------|--------|--------|
| 1 | ATS-friendly CV (LaTeX) | [`cv/`](cv/) | ✅ Building |
| 2 | Personal profile website (GitHub Pages) | [`website/`](website/) (Astro) | ✅ Live |
| 3 | Online name card with QR code | [`website/src/pages/card/`](website/src/pages/card/) | ✅ Live |

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
The **Website** workflow compiles the CV, type-checks, builds and browser-tests every change (desktop, phone, accessibility),
and deploys `main` to <https://dvez373.github.io/Personal-Profile-Portfolio/> (gated by the `PAGES_ENABLED` repository variable).

Personal details live in `website/src/data/*.yaml` and projects in `website/src/content/projects/`; edit and push, and the site rebuilds.

## 3. Name card

| URL | What |
|---|---|
| [`/card/`](https://dvez373.github.io/Personal-Profile-Portfolio/card/) | Phone card: save contact (.vcf), email, call, WhatsApp, LinkedIn, Instagram, GitHub, website; share and full-screen QR |
| [`/card/print/`](https://dvez373.github.io/Personal-Profile-Portfolio/card/print/) | Print-ready front and back, 85 × 55 mm + 3 mm bleed (Print → Save as PDF, margins None, scale 100%) |
| [`/card-qr.svg`](https://dvez373.github.io/Personal-Profile-Portfolio/card-qr.svg) | Vector QR for print, email signatures and slides |

The QR points to `/card/`, so details can change without reprinting. Contact data comes from `website/src/data/profile.yaml`.

## Docs

Research, design decisions and the step-by-step log: [`docs/website/`](docs/website/) and [`docs/card/`](docs/card/).
