import { chromium } from 'playwright';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
const apps = [
  ['Astro 7 (plain <script>)', 'astro-vanilla/dist'],
  ['Astro 7 + 1 React island', 'astro-react/dist'],
  ['Next.js 16 static export', 'next/out'],
  ['Vite 8 + React 19 (SPA)', 'vite-react/dist'],
  ['Vite 8 + Vue 3.5 (SPA)', 'vite-vue/dist'],
  ['SvelteKit 3 static', 'sveltekit/build'],
  ['Current prototype (vanilla)', '../../../../design/prototype'],
];
const b = await chromium.launch(); let port = 4600; const rows = [];
for (const [name, dir] of apps) {
  port++; const srv = spawn('python3', ['-m', 'http.server', String(port), '-d', dir], { stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 600));
  const html = await (await fetch('http://127.0.0.1:' + port + '/')).text();
  const p = await b.newPage(); const js = [];
  p.on('response', async r => { if (r.request().resourceType() === 'script') { try { js.push(await r.body()); } catch {} } });
  await p.goto('http://127.0.0.1:' + port + '/', { waitUntil: 'networkidle' });
  const isProto = dir.includes('prototype');
  let after = 'n/a';
  if (!isProto) { await p.click('button'); await p.waitForTimeout(150); after = await p.textContent('button'); }
  const raw = js.reduce((a, x) => a + x.length, 0);
  const gz = js.reduce((a, x) => a + gzipSync(x, { level: 9 }).length, 0);
  const br = js.reduce((a, x) => a + brotliCompressSync(x, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length, 0);
  rows.push({ name, requests: js.length, rawKB: (raw/1024).toFixed(1), gzipKB: (gz/1024).toFixed(1), brotliKB: (br/1024).toFixed(1), htmlHasHeading: /Hello|Devin Ezekiel Purba/.test(html), clickWorks: after === 'n/a' ? 'n/a' : after.trim() === '1' });
  await p.close(); srv.kill();
}
await b.close(); console.table(rows);
