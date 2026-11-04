import type { APIRoute } from "astro";
import { url } from "../lib/url";

// Allows all crawling (as before, when there was no file) and names the sitemap, which helps
// crawlers find it. Built from `site`, so it follows SITE_URL like the sitemap does.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(url("sitemap-index.xml"), site)}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
