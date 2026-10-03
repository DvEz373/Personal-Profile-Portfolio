// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Published as a GitHub Pages project site: https://dvez373.github.io/Personal-Profile-Portfolio/
// For a custom domain or a <user>.github.io repository, build with SITE_URL=<url> SITE_BASE=/
const site = process.env.SITE_URL ?? "https://dvez373.github.io";
const base = process.env.SITE_BASE ?? "/Personal-Profile-Portfolio";

// Fonts are self-hosted: Astro copies these files from node_modules into the build.
// No font is requested from a CDN, at build time or in the browser.
const local = fontProviders.local();
/** @param {string} path */
const font = (path) => `@fontsource${path}`;

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [sitemap({ filter: (page) => !page.includes("/og-card") })],
  fonts: [
    {
      provider: local,
      name: "Geist",
      cssVariable: "--font-sans",
      fallbacks: ["system-ui", "sans-serif"],
      options: { variants: [{ src: [font("-variable/geist/files/geist-latin-wght-normal.woff2")], weight: "100 900", style: "normal" }] },
    },
    {
      provider: local,
      name: "Geist Mono",
      cssVariable: "--font-mono",
      fallbacks: ["ui-monospace", "monospace"],
      options: { variants: [{ src: [font("-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2")], weight: "100 900", style: "normal" }] },
    },
    {
      provider: local,
      name: "Instrument Serif",
      cssVariable: "--font-serif",
      fallbacks: ["Georgia", "serif"],
      options: {
        variants: [
          { src: [font("/instrument-serif/files/instrument-serif-latin-400-normal.woff2")], weight: 400, style: "normal" },
          { src: [font("/instrument-serif/files/instrument-serif-latin-400-italic.woff2")], weight: 400, style: "italic" },
        ],
      },
    },
  ],
});
