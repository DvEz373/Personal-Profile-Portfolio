// Content lives in plain files. Each schema below is checked at build time,
// so a typo in a YAML or Markdown file stops the build with a clear message
// instead of publishing a broken page.
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { THEMES } from "./lib/themes";

/** Year and month, written as "2025-09". Use "present" for an ongoing entry. */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use "YYYY-MM", for example "2025-09"');
const monthOrPresent = z.union([month, z.literal("present")]);

const profile = defineCollection({
  loader: file("src/data/profile.yaml"),
  schema: z.object({
    name: z.string(),
    givenNames: z.string(),
    familyName: z.string(),
    initials: z.string(),
    headline: z.string(),
    headlineAccent: z.string(),
    tagline: z.string(),
    role: z.string(),
    org: z.string(),
    city: z.string(),
    country: z.string(),
    timezone: z.string(),
    coordinates: z.string(),
    email: z.email(),
    phone: z.string(),
    links: z.object({ linkedin: z.url(), github: z.url(), instagram: z.url() }),
    bio: z.array(z.string()).min(1),
    chain: z.array(z.object({ stage: z.string(), label: z.string(), items: z.array(z.string()) })).length(3),
  }),
});

const experience = defineCollection({
  loader: file("src/data/experience.yaml"),
  schema: z.object({
    type: z.enum(["work", "internship", "campus"]),
    role: z.string(),
    short: z.string().optional(),
    org: z.string(),
    place: z.string(),
    start: month,
    end: monthOrPresent,
    summary: z.string(),
    points: z.array(z.string()),
    tags: z.array(z.string()).default([]),
  }),
});

const education = defineCollection({
  loader: file("src/data/education.yaml"),
  schema: z.object({
    kind: z.enum(["degree", "exchange", "courses"]),
    title: z.string(),
    place: z.string(),
    start: month,
    end: monthOrPresent,
    summary: z.string(),
    points: z.array(z.string()).default([]),
    callout: z.object({ label: z.string(), text: z.string() }).optional(),
    link: z.object({ href: z.string(), label: z.string() }).optional(),
  }),
});

const skills = defineCollection({
  loader: file("src/data/skills.yaml"),
  schema: z.object({
    order: z.number().int(),
    name: z.string(),
    blurb: z.string(),
    color: z.enum(["sun", "signal", "leaf", "ink"]),
    items: z.array(z.object({ name: z.string(), level: z.number().int().min(1).max(5) })),
  }),
});

const certifications = defineCollection({
  loader: file("src/data/certifications.yaml"),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    start: month,
    end: month,
    url: z.url(),
  }),
});

/** Projects may give just a year ("2025") when the exact month is not public. */
const yearOrMonth = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, 'Use "YYYY" or "YYYY-MM", for example "2025" or "2025-09"');

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "*.md" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(THEMES),
      /** Extra filter chips the project also appears under. */
      also: z.array(z.enum(THEMES)).default([]),
      /** professional = client work at an employer; academic = thesis, coursework, side projects. */
      kind: z.enum(["professional", "academic"]),
      order: z.number().int(),
      /** Shown in the "Selected work" grid on the home page. */
      featured: z.boolean().default(false),
      context: z.string(),
      start: yearOrMonth,
      end: z.union([yearOrMonth, z.literal("present")]).optional(),
      blurb: z.string(),
      /** Devin's own part in the project, in one line. Shown as "My part". */
      role: z.string().optional(),
      problem: z.string(),
      approach: z.string(),
      result: z.string(),
      stack: z.array(z.string()),
      facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
      /** Real figures. The first one is the cover on cards and the page header. */
      figures: z.array(z.object({ src: image(), alt: z.string(), caption: z.string() })).default([]),
      /** Card crop of the cover: a CSS object-position (e.g. "30% 40%") and a zoom factor. Page headers always show the whole figure. */
      coverFocus: z.string().optional(),
      coverZoom: z.number().min(1).max(3).optional(),
    }),
});

export const collections = { profile, experience, education, skills, certifications, projects };
