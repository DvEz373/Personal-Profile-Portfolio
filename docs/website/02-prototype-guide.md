# Prototype review guide (v3, superseded)

> The live site is now the Astro build in [`website/`](../../website/). This vanilla-JS prototype is kept only for before/after comparison and can be deleted.

The prototype lives in `design/prototype/`. It is separate from the live `website/` folder, so nothing changes on the published site until the design is approved.

## Open it

On Windows, double-click `design\prototype\index.html`, or from the repo root run:

```bash
python -m http.server 8000 --directory design/prototype
```

then open <http://localhost:8000>. To test it on your phone, connect it to the same Wi-Fi and open `http://<your-PC-IP>:8000`.

The "Download CV" button points to `cv.pdf`, which only exists once the site is deployed, so in the prototype that link returns "not found".

## Files

| File | Role |
|---|---|
| `index.html`, `experience.html`, `education.html`, `projects.html`, `skills.html`, `about.html` | Page shells. Each one only sets `data-page` |
| `assets/data.js` | **All content.** Edit this to change any text, link, stat or skill |
| `assets/app.js` | Builds the menu bar and footer, renders each page from `data.js`, runs the interactions |
| `assets/style.css` | Design tokens (colours, type, spacing) and all layout |

## What to check

| Page | Try this |
|---|---|
| Home | Move the mouse (or drag a finger) across the waves: left/right changes frequency, up/down changes amplitude. Watch the numbers count up. Hover the four tiles |
| Experience / Education | Tap the filter chips. Tap an entry to expand or collapse it |
| Projects | Filter by category. Click a card to open the details window, swipe the figures, close it with Esc, × or a click outside |
| Skills | Scroll down so the bars fill |
| About | Click the email button to copy your address |
| All pages | Toggle the sun/moon button (dark mode is remembered). Shrink the window below 760 px to see the phone menu |

## Placeholders

Every grey box with a dashed label is a placeholder figure: the portrait, the project figures, and a fourth project ("Hybrid PV-BESS Plant Controller") that is a stand-in for a work sample. The skill percentages and the high-school entry on the Education page are also placeholders. See section 9 of the design plan for what is needed to replace them.
