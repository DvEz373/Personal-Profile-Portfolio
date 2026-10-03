# Website

Devin Ezekiel Purba's portfolio, built with [Astro](https://astro.build) 7 and TypeScript. It ships static HTML with about 9–11 KB of JavaScript per page.
Why Astro: [`docs/website/04-framework-research.md`](../docs/website/04-framework-research.md). Design: [`docs/website/05-visual-direction.md`](../docs/website/05-visual-direction.md).

## Run it on your computer (Windows, macOS or Linux)

1. Install **Node.js 22.12 or newer** (24 LTS recommended). On Windows: `winget install OpenJS.NodeJS.LTS`, or the installer from nodejs.org.
2. In a terminal:
   ```bash
   cd website
   npm install
   npm run dev
   ```
3. Open <http://localhost:4321/Personal-Profile-Portfolio/>. Pages reload as you edit.

## Edit the content

All text lives in plain files. Change them and save; the build checks every field and stops with a clear message if something is wrong (for example a date written as `Sept 2025` instead of `2025-09`).

| What | File |
|---|---|
| Name, headline, contact, bio, the home page "signal chain" | `src/data/profile.yaml` |
| Jobs, internships, campus roles | `src/data/experience.yaml` |
| Education timeline | `src/data/education.yaml` |
| Skill domains and levels (1–5) | `src/data/skills.yaml` |
| Certificates | `src/data/certifications.yaml` |
| Projects (one file each; the file name becomes the URL) | `src/content/projects/*.md` |
| Photos | `src/assets/photos/` (resized to AVIF/WebP automatically) |

Dates are `YYYY-MM`. Use `end: present` for something ongoing.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local preview with live reload |
| `npm run check` | Type-checks the code and content |
| `npm run build` | Builds the site into `dist/` |
| `npm run preview` | Serves `dist/` the way GitHub Pages will |
| `npm run test:install` | One time: downloads the browser used by the tests |
| `npm test` | Builds must exist first. Runs the browser tests (pages load, no errors, no sideways scroll, accessibility scan, interactions) on desktop and phone sizes |

## Placeholders still to replace

- **Project figures:** each project page lists "Image to come" slots. Add real images to the project and swap the generated illustration.
- **Skill levels** in `skills.yaml` are self-assessed placeholders.
- **`src/content/projects/hybrid-ppc.md`:** replace with a non-confidential summary, or delete the file.

## Social preview image

`public/og.jpg` is what LinkedIn or WhatsApp show when the link is shared. After changing the name or headline, regenerate it:

```bash
npm run build && npm run preview      # terminal 1
node scripts/make-og.mjs               # terminal 2
```

## Publishing

The **Website** GitHub Actions workflow builds and tests every pull request that touches `website/`. On `main` it also compiles the CV into `cv.pdf` for the download button and uploads the site. It deploys only after GitHub Pages is switched on:

1. Make the repository public, or use GitHub Pro. The published site is public either way.
2. **Settings → Pages → Source: GitHub Actions**.
3. **Settings → Secrets and variables → Actions → Variables**: add `PAGES_ENABLED` = `true`.
4. Re-run the latest **Website** workflow on `main`. The site appears at <https://dvez373.github.io/Personal-Profile-Portfolio/>.

For a custom domain or a `<username>.github.io` repository, build with `SITE_URL=https://your.domain SITE_BASE=/`.
