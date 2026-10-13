// Project themes: the filter chips on Projects and the label on each project page.
// Client and academic projects share them. The colour follows the domain (energy, AI, IoT).
export const THEMES = ["controllers", "machines", "grid", "ai", "iot"] as const;
export type Theme = (typeof THEMES)[number];

export const CATEGORY_LABEL: Record<Theme, string> = {
  controllers: "Plant controllers",
  machines: "Machine models",
  grid: "Grid studies",
  ai: "AI",
  iot: "IoT",
};

export const DOMAIN: Record<Theme, "energy" | "ai" | "iot"> = { controllers: "energy", machines: "energy", grid: "energy", ai: "ai", iot: "iot" };
export const TONE: Record<Theme, string> = { controllers: "c-sun", machines: "c-sun", grid: "c-sun", ai: "c-signal", iot: "c-leaf" };
