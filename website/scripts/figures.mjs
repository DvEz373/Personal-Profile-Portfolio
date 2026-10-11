// Project figures must carry pixels only. draw.io PNG exports embed the whole editable
// diagram (zTXt "mxGraphModel"), which can hold client names, notes and file paths even
// when the picture itself is clean, and the "Full size" link serves the original file.
//
//   node scripts/figures.mjs          check: exit 1 if any figure carries metadata
//   node scripts/figures.mjs --fix    rewrite the files with image chunks only
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../src/assets/projects/", import.meta.url));
const KEEP = new Set(["IHDR", "PLTE", "tRNS", "gAMA", "cHRM", "sRGB", "iCCP", "sBIT", "pHYs", "IDAT", "IEND"]);
const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else yield p;
  }
}

function chunks(buf) {
  const out = [];
  for (let i = 8; i < buf.length; ) {
    const len = buf.readUInt32BE(i);
    out.push({ type: buf.toString("latin1", i + 4, i + 8), raw: buf.subarray(i, i + 12 + len) });
    i += 12 + len;
  }
  return out;
}

const fix = process.argv.includes("--fix");
const bad = [];
for (const file of files(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (ext === ".svg") {
    bad.push(`${file}: SVG figures can hide text and embedded sources; export PNG instead`);
    continue;
  }
  if (ext !== ".png") continue;
  const buf = readFileSync(file);
  if (!buf.subarray(0, 8).equals(SIG)) {
    bad.push(`${file}: not a PNG`);
    continue;
  }
  const all = chunks(buf);
  const extra = all.filter((c) => !KEEP.has(c.type)).map((c) => c.type);
  if (extra.length === 0) continue;
  if (fix) {
    writeFileSync(file, Buffer.concat([SIG, ...all.filter((c) => KEEP.has(c.type)).map((c) => c.raw)]));
    console.log(`stripped ${extra.join(", ")} from ${file}`);
  } else {
    bad.push(`${file}: carries ${extra.join(", ")} (run: node scripts/figures.mjs --fix)`);
  }
}

if (bad.length) {
  console.error(bad.join("\n"));
  process.exit(1);
}
console.log(fix ? "figures clean" : "figures: no metadata found");
