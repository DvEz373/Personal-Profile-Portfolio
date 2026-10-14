#!/usr/bin/env node
// Prepares the repository root as an Obsidian vault (docs/project/obsidian.md).
// Merges the settings this repository needs into .obsidian/app.json and keeps every
// other setting you already have. Safe to run again. .obsidian/ is not committed.
//
//   node scripts/obsidian-setup.mjs           write the settings
//   node scripts/obsidian-setup.mjs --dry     show what would change
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const APP = join(ROOT, ".obsidian", "app.json");
const dry = process.argv.includes("--dry");

// Build output, dependencies and benchmark apps: thousands of files Obsidian should not index.
const bench = "docs/website/research/framework-benchmark";
const benchApps = existsSync(join(ROOT, bench)) ? readdirSync(join(ROOT, bench)).filter((d) => statSync(join(ROOT, bench, d)).isDirectory()).map((d) => `${bench}/${d}/`) : [];
const ignore = ["website/node_modules/", "website/dist/", "website/.astro/", "website/test-results/", "website/playwright-report/", ...benchApps];

// Links stay standard relative Markdown links so GitHub, Claude Code and Obsidian all resolve them.
const wanted = {
  useMarkdownLinks: true,
  newLinkFormat: "relative",
  alwaysUpdateLinks: true,
};

let current = {};
if (existsSync(APP)) {
  try {
    current = JSON.parse(readFileSync(APP, "utf8"));
  } catch {
    console.error(`${APP} is not valid JSON; fix or remove it first.`);
    process.exit(1);
  }
}

const next = { ...current, ...wanted, userIgnoreFilters: [...new Set([...(current.userIgnoreFilters ?? []), ...ignore])] };
const changes = Object.keys(next).filter((k) => JSON.stringify(next[k]) !== JSON.stringify(current[k]));

if (!changes.length) {
  console.log("Obsidian settings already match. Open the repository folder as a vault.");
} else if (dry) {
  for (const k of changes) console.log(`${k}: ${JSON.stringify(current[k])} -> ${JSON.stringify(next[k])}`);
} else {
  mkdirSync(dirname(APP), { recursive: true });
  writeFileSync(APP, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Updated .obsidian/app.json (${changes.join(", ")}). Reload Obsidian if the vault is open.`);
}
