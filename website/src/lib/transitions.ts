import type { TransitionDirectionalAnimations } from "astro";

const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";

/** Main content slides up slightly on navigation; keyframes live in global.css. */
export const pageAnimation: TransitionDirectionalAnimations = {
  forwards: {
    old: { name: "vt-out", duration: "200ms", easing: ease, fillMode: "both" },
    new: { name: "vt-in", duration: "360ms", easing: ease, fillMode: "both" },
  },
  backwards: {
    old: { name: "vt-out", duration: "200ms", easing: ease, fillMode: "both" },
    new: { name: "vt-in", duration: "360ms", easing: ease, fillMode: "both" },
  },
};
