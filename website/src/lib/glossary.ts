// Acronyms used in the project pages, expanded on first use per page with <abbr title>
// so a visitor who is not a power engineer can hover or long-press for the meaning.
export const GLOSSARY: Record<string, string> = {
  AVR: "automatic voltage regulator",
  CHP: "combined heat and power",
  DFIM: "doubly fed induction machine",
  DLL: "dynamic-link library",
  EMT: "electromagnetic transient",
  FSM: "frequency sensitive mode",
  HV: "high voltage",
  HVRT: "high-voltage ride-through",
  LFSM: "limited frequency sensitive mode",
  LV: "low voltage",
  LVRT: "low-voltage ride-through",
  MAE: "mean absolute error",
  MV: "medium voltage",
  PFC: "power factor correction",
  PLL: "phase-locked loop",
  PoC: "point of connection",
  POD: "power oscillation damping",
  PPC: "power plant controller",
  PQ: "active and reactive power",
  PSS: "power system stabiliser",
  PSU: "power supply unit",
  PV: "photovoltaic (solar)",
  QV: "reactive power against voltage",
  RMS: "root mean square, a phasor-domain simulation",
  RMSE: "root mean square error",
  RoCoF: "rate of change of frequency",
  RTU: "remote terminal unit",
  SCR: "short-circuit ratio",
  TSO: "transmission system operator",
  UPS: "uninterruptible power supply",
};

// Whole words only; "PSS" inside "PSS/E" (a product name) is left alone.
const PATTERN = new RegExp(`(?<![\w/])(${Object.keys(GLOSSARY).join("|")})(?![\w/])`, "g");

/** Split text into plain strings and the first use of each glossary term not yet in `seen`. */
export function splitAbbr(text: string, seen: Set<string>): (string | { term: string; title: string })[] {
  const out: (string | { term: string; title: string })[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    const term = m[1];
    if (seen.has(term)) continue;
    seen.add(term);
    out.push(text.slice(last, m.index), { term, title: GLOSSARY[term] });
    last = m.index + term.length;
  }
  out.push(text.slice(last));
  return out.filter((x) => x !== "");
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const wrap = (x: string | { term: string; title: string }, escape: (s: string) => string) =>
  typeof x === "string" ? escape(x) : `<abbr title="${esc(x.title)}">${x.term}</abbr>`;

/** Rendered Markdown: wrap first uses in text, but not inside links, code or an existing <abbr>. */
export function abbrRenderedHtml(html: string, seen: Set<string>): string {
  let skip = 0;
  return html
    .split(/(<[^>]+>)/)
    .map((part) => {
      const tag = part.match(/^<(\/?)(a|abbr|code|pre)[\s>]/i);
      if (tag) skip += tag[1] ? -1 : 1;
      if (part.startsWith("<") || skip > 0) return part;
      return splitAbbr(part, seen).map((x) => wrap(x, (s) => s)).join("");
    })
    .join("");
}

/** HTML for a plain-text field, with first uses wrapped in <abbr>. */
export function abbrHtml(text: string, seen: Set<string>): string {
  return splitAbbr(text, seen)
    .map((x) => wrap(x, esc))
    .join("");
}
