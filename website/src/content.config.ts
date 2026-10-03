// Content lives in plain files. Each schema below is checked at build time,
// so a typo in a YAML or Markdown file stops the build with a clear message
// instead of publishing a broken page.
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

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
    photo: z.boolean().default(false),
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

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "*.md" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["energy", "ai", "iot"]),
    order: z.number().int(),
    context: z.string(),
    start: month,
    end: monthOrPresent,
    blurb: z.string(),
    problem: z.string(),
    approach: z.string(),
    result: z.string(),
    stack: z.array(z.string()),
    links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
    figures: z.array(z.string()).min(1),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { profile, experience, education, skills, certifications, projects };
