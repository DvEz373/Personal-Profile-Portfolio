---
title: Obsidian vault
aliases: [Obsidian vault, Obsidian]
type: reference
covers: [scripts/obsidian-setup.mjs, docs/Docs.base, .gitignore]
---

# Obsidian vault

The repository root is also an Obsidian vault. Devin works with Claude Code and Obsidian on the same files: Claude Code edits them in the repository, Obsidian reads and edits the same notes, and git keeps both in step. GitHub renders the same Markdown.

## Set up once (on each computer)

1. Pull the repository.
2. `node scripts/obsidian-setup.mjs` (from the repository root). It merges these settings into `.obsidian/app.json` and keeps any you already have:
   - `Use [[Wikilinks]]`: **off** and **New link format: relative path**, so links Obsidian inserts are relative Markdown links that GitHub and the link checker understand.
   - **Automatically update internal links: on**, so a rename inside Obsidian fixes the links.
   - **Excluded files**: `website/node_modules/`, build and test output, and the benchmark apps.
3. Obsidian → Open folder as vault → the repository folder. Trust the folder when asked.
4. Optional: Settings → Core plugins → turn on **Bases** (Obsidian 1.9 or later) for the dashboard below.

`.obsidian/` and `.trash/` are ignored by git: themes, plugins, hotkeys and workspace layout stay personal.

## What you get

| In Obsidian | File | Notes |
|---|---|---|
| Home note | [docs/README.md](../README.md) (alias "Home") | Index and reading paths |
| Agent brief | [CLAUDE.md](../../CLAUDE.md) | Same file Claude Code loads |
| Properties panel | Front matter of every doc | `title`, `aliases`, `type` (`index`, `reference`, `runbook`, `history`, `log`), `covers`, `current` |
| Quick switcher (Ctrl O) | Every doc by title | Aliases make "CV reference" and "Name card reference" findable, although both files are called `reference.md` |
| Graph view (Ctrl G) | All doc links | History docs point to the reference that replaced them through their links and `current` property |
| Dashboard | [docs/Docs.base](../Docs.base) | Tables: all docs by type, reference and runbooks, history with "replaced by" |
| Documentation map | [docs/graph/portfolio.canvas](../graph/portfolio.canvas) | Generated canvas: start here, project, website, CV and card, history; click a card to open the note |
| Diagrams | Mermaid blocks | Rendered natively in reading and live preview |

Code files (`.astro`, `.ts`, `.tex`) do not open in Obsidian. Use `node scripts/graph.mjs query <file>` in a terminal, or open them in the editor.

## Writing notes that work everywhere

- Link with **relative Markdown links**: `[runbooks](runbooks.md)`. Obsidian inserts this form after setup.
- `[[Wikilinks]]` also work (by file name, path or alias) and the checker validates them, but GitHub shows them as plain text. Use them only in notes that are not meant for GitHub readers. Ambiguous names such as `[[reference]]` fail the check: write `[[docs/cv/reference]]` or use the alias `[[CV reference]]`.
- Links to a section use GitHub's form (`runbooks.md#r-03-add-a-client-case-study`). Obsidian opens the right note, but may not scroll to the section.
- Every new note under `docs/` needs front matter with `title`, `aliases` and `type`. Reference notes also need `covers` (the files they explain); the check fails otherwise.
- Do not edit generated files: `docs/graph/README.md`, `docs/graph/modules.md`, `docs/graph/graph.json`, `docs/graph/portfolio.canvas`. Run `node scripts/graph.mjs` instead.
- Rename or move notes inside Obsidian so links update, then run `node scripts/graph.mjs --check`.
- Attachments: put images for docs next to the note that uses them, never in `website/src/assets/` (that folder is published).

## Claude Code and Obsidian together

| Step | Who |
|---|---|
| Write or update a doc, rename notes, browse the graph and canvas | Obsidian |
| Change code, regenerate the graph, run checks, commit | Claude Code (or a terminal) |
| Before committing anything Obsidian changed | `node scripts/graph.mjs` then `node scripts/graph.mjs --check` |

Obsidian can save while Claude Code edits the same file. Close a note in Obsidian before asking Claude Code to rewrite it.

## Known limits

- **Excluded files** hide folders from search, graph and the quick switcher, but Obsidian still sees them in the file tree. If the vault feels slow because of `website/node_modules/`, open `docs/` as the vault instead: everything under `docs/` works, but links to `CLAUDE.md` and the READMEs outside `docs/` will not resolve.
- The Bases dashboard and the canvas follow Obsidian's documented formats, but they were generated in a cloud session without Obsidian. If a view shows an error, report it and it will be fixed.
