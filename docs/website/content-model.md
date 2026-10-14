---
title: Website content model
type: reference
covers: [website/src/content.config.ts, website/src/data/, website/src/content/projects/, website/src/lib/content.ts, website/src/lib/themes.ts, website/src/lib/glossary.ts]
---

# Website content model

All content is plain files, validated by Zod schemas in `website/src/content.config.ts`. A wrong field stops `npm run check` and `npm run build` with a message. Dates are `"YYYY-MM"`; `end: present` marks an ongoing entry. Which facts are repeated in the CV: [sources of truth](../project/sources-of-truth.md).

| Collection | File | Loader | Sorted by (`lib/content.ts`) |
|---|---|---|---|
| `profile` | `src/data/profile.yaml` (one entry, id `devin`) | `file()` | n/a (`getProfile()`) |
| `experience` | `src/data/experience.yaml` | `file()` | newest first |
| `education` | `src/data/education.yaml` | `file()` | newest first |
| `skills` | `src/data/skills.yaml` | `file()` | `order` |
| `certifications` | `src/data/certifications.yaml` | `file()` | newest first |
| `projects` | `src/content/projects/*.md` (file name = slug) | `glob()` | `order` |

## profile

`name`, `givenNames`, `familyName`, `initials`, `headline`, `headlineAccent`, `tagline`, `role`, `org`, `focus` (list, at least 1), `city`, `country`, `timezone` (IANA), `coordinates`, `email`, `phone`, `links` (`linkedin`, `github`, `instagram`, all URLs), `bio` (list of paragraphs), `chain` (exactly 3 blocks of `stage`, `label`, `items`; shown as About focus tags).

## experience

| Field | Type | Notes |
|---|---|---|
| `type` | `work` \| `internship` \| `campus` | Filter chip and colour |
| `role`, `short` | string, optional short | `short` labels the Gantt bar |
| `org`, `place` | string | The employer is allowed here (job history) |
| `start`, `end` | month, month or `present` | |
| `summary` | string | One line |
| `points` | list | Short bullets; the CV has the long STAR form |
| `tags` | list | Tools |

## education

`kind` (`degree` \| `exchange` \| `courses`), `title`, `place`, `start`, `end`, `summary`, `points`, optional `callout` (`label`, `text`), optional `link` (`href`, `label`).

## skills

`order`, `name`, `blurb`, `color` (`sun` \| `signal` \| `leaf` \| `ink`), `items` (list of `name` and `level` 1 to 5; labels Aware, Familiar, Proficient, Advanced, Expert).

## certifications

`name`, `issuer`, `start`, `end`, `url`.

## projects

| Field | Type | Notes |
|---|---|---|
| `title` | string | Card and page H1 |
| `category` | theme | Main filter chip. Themes from `lib/themes.ts`: `controllers` (Plant controllers), `machines` (Machine models), `grid` (Grid studies), `ai` (AI), `iot` (IoT) |
| `also` | list of themes | Extra chips |
| `kind` | `professional` \| `academic` | Client work is listed first and labelled "Client work" |
| `order` | integer | Client work 1 to 8, academic 20 and up |
| `featured` | boolean | Home "Selected work" takes the first four by `order` |
| `context` | string | Datasheet "Context" |
| `start`, `end` | `YYYY` or `YYYY-MM`, `end` optional or `present` | Client work: start year only (D8) |
| `blurb` | string, about 25 words | First sentence readable by a non-engineer (R13) |
| `role` | string, optional | "My part", Devin's words (D4) |
| `problem`, `approach`, `result` | string, 1 to 3 sentences each | |
| `stack` | list | Card shows the first four |
| `facts` | list of `label`, `value` | Datasheet "Key facts", 3 to 5 |
| `links` | list of `label`, `href` | For example source code |
| `figures` | list of `src` (path relative to the `.md` file), `alt`, `caption` | First is the cover and lead figure. PNG only, metadata stripped |
| `coverFocus`, `coverZoom` | CSS `object-position`, number 1 to 3 | Card crop only; the page shows the whole figure |

The Markdown body follows Problem / Approach / Result. Client case studies use "What we did" and "How we checked it".

## Derived behaviour

- **Acronyms**: the first use of each `GLOSSARY` term per project page gets `<abbr title>`. "PSS" inside "PSS/E" is left alone. Add new acronyms to `lib/glossary.ts`.
- **Theme colours**: `TONE` maps the energy themes to sun, AI to signal blue, IoT to leaf teal. `DOMAIN` picks the `ProjectArt` illustration.
- **Durations**: `formatDuration` counts months inclusively (Sep 2023 to Sep 2025 = 2 yr 1 mo).
- **"present"** ends at the build date, so the site shows correct durations after each deploy.
