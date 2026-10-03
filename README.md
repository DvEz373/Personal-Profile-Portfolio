# Personal-Profile-Portfolio

Devin Ezekiel Purba's personal profile hub.

| # | Part | Folder | Status |
|---|------|--------|--------|
| 1 | ATS-friendly CV (LaTeX) | [`cv/`](cv/) | ✅ Building |
| 2 | Personal profile website (GitHub Pages) | `website/` | 🔜 Planned |
| 3 | Online name card with QR code | `card/` | 🔜 Planned |

## 1. CV

Source lives in `cv/`. `main.tex` pulls in one file per section.

Build locally (MiKTeX or TeX Live):

```bash
cd cv
latexmk -pdf main.tex
```

Every push that touches `cv/` runs the **Build CV** GitHub Action, which compiles the PDF,
checks that an ATS can extract its text, and uploads `main.pdf` as a downloadable artifact.

**ATS notes:** single column, standard section names, real Unicode text
(`glyphtounicode` + T1 fonts), visible URLs, and PDF metadata set. No tables, icons, or images.
