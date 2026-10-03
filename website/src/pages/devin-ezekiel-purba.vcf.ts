// Contact card (vCard 3.0) built from src/data/profile.yaml. Phones open it straight into contacts.
import type { APIRoute } from "astro";
import { getProfile } from "../lib/content";
import { url } from "../lib/url";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1");

export const GET: APIRoute = async ({ site }) => {
  const p = await getProfile();
  const home = new URL(url(), site).toString();
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(p.familyName)};${esc(p.givenNames)};;;`,
    `FN:${esc(p.name)}`,
    `TITLE:${esc(p.role)}`,
    `ORG:${esc(p.org)}`,
    `EMAIL;TYPE=INTERNET,PREF:${p.email}`,
    `TEL;TYPE=CELL:${p.phone.replace(/\s/g, "")}`,
    `ADR;TYPE=WORK:;;;${esc(p.city)};;;${esc(p.country)}`,
    `URL:${home}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${p.links.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${p.links.github}`,
    `X-SOCIALPROFILE;TYPE=instagram:${p.links.instagram}`,
    `NOTE:${esc(`${p.headline} · ${p.headlineAccent}. ${p.tagline}.`)}`,
    "END:VCARD",
  ];
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/vcard; charset=utf-8" },
  });
};
