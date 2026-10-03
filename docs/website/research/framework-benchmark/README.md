# Framework baseline benchmark

Reproducible data behind [04-framework-research.md](../../04-framework-research.md).

## What was measured

The same tiny page in every setup: an `<h1>Hello</h1>` and a button that counts clicks. For each build:

1. Serve the build output with `python3 -m http.server`.
2. Load it in headless Chromium (Playwright), record every response of type `script`, and click the button to prove the page is interactive.
3. Compress each script body locally (gzip level 9, Brotli quality 11) and add them up.
4. Check whether the `<h1>` is already in the HTML the server sends (it matters for search engines, link previews and visitors without JavaScript).

## Versions (2026-10-03, from the npm registry)

| App | Key packages |
|---|---|
| `astro-vanilla` | astro 7.3.5 |
| `astro-react` | astro 7.3.5, @astrojs/react 7.0.0, react 19.3.0 |
| `next` | next 16.3.8, react 19.3.0 (`output: "export"`) |
| `vite-react` | vite 8.3.2, @vitejs/plugin-react 6.1.1, react 19.3.0 |
| `vite-vue` | vite 8.3.2, @vitejs/plugin-vue 6.0.9, vue 3.5.43 |
| `sveltekit` | @sveltejs/kit 3.0.0, @sveltejs/adapter-static 4.0.0, svelte 5.57.1 |

Node 22.22.0, npm 10.9.4, Linux.

## Results

| Setup | JS files loaded | JS gzip (KB) | JS Brotli (KB) | `<h1>` in server HTML | Click works |
|---|---:|---:|---:|:-:|:-:|
| Astro 7, plain `<script>` | 0 (106 B inlined) | 0.0 | 0.0 | yes | yes |
| Astro 7 + 1 React island | 3 | 67.4 | 58.4 | yes | yes |
| Next.js 16 static export | 6 | 130.3 | 111.3 | yes | yes |
| Vite 8 + React 19 (SPA) | 1 | 66.2 | 57.0 | **no** | yes |
| Vite 8 + Vue 3.5 (SPA) | 1 | 23.3 | 21.3 | **no** | yes |
| SvelteKit 3 static | 10 | 30.6 | 27.7 | yes | yes |
| Current prototype (vanilla JS, v3) | 2 | 11.7 | 9.9 | **no** | n/a |

Install size of `node_modules`: Vite + React 42 MB, Vite + Vue 51 MB, SvelteKit 45 MB, Astro 169 MB, Astro + React 180 MB, Next.js 341 MB.

Raw console output: [`results.txt`](results.txt).

## Notes and caveats

- **Baselines only:** a hello-world page shows each framework's fixed cost, not what the finished site will weigh.
- **Compression:** sizes are computed locally. What a visitor actually downloads depends on the server's compression, which was not measured for GitHub Pages here.
- **Timing:** installs and builds ran in parallel on one machine, so build times are not reported as results.
- **SvelteKit 3 config change:** version 3.0.0 (released 2026-10-01) rejects `svelte.config.js` (`config_file_unsupported`). The config was moved into the `sveltekit()` Vite plugin to build it.

## Re-run

```bash
# in each app folder
npm install && npm run build
# then, from this folder (needs: npm i playwright, and a Chromium)
node measure.mjs
```
