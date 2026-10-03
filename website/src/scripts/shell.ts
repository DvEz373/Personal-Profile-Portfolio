// Behaviour shared by every page: theme toggle, mobile menu, header state,
// the Jakarta clock and toast messages. Runs on each `astro:page-load`.

let clockTimer: number | undefined;
let pageListeners: AbortController | undefined;

export function toast(message: string) {
  const el = document.querySelector<HTMLElement>("[data-toast]");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  window.clearTimeout(Number(el.dataset.timer));
  el.dataset.timer = String(window.setTimeout(() => el.classList.remove("show"), 2200));
}

export function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* storage blocked: the choice lasts for this page view only */
  }
  updateThemeLabel();
  document.dispatchEvent(new CustomEvent("themechange"));
}

function updateThemeLabel() {
  const dark = document.documentElement.dataset.theme === "dark";
  document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme"));
}

function startClock() {
  window.clearInterval(clockTimer);
  const els = document.querySelectorAll<HTMLTimeElement>("[data-clock]");
  if (!els.length) return;
  const tick = () =>
    els.forEach((el) => {
      const tz = el.dataset.tz || "Asia/Jakarta";
      el.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date());
    });
  tick();
  clockTimer = window.setInterval(tick, 15_000);
}

export function initShell() {
  // Listeners on window/document are dropped when the next page loads.
  pageListeners?.abort();
  pageListeners = new AbortController();
  const { signal } = pageListeners;

  updateThemeLabel();
  document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", toggleTheme));

  // Mobile menu
  const menuBtn = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (menuBtn && nav) {
    const setOpen = (open: boolean) => {
      menuBtn.setAttribute("aria-expanded", String(open));
      nav.toggleAttribute("data-open", open);
    };
    menuBtn.addEventListener("click", () => setOpen(menuBtn.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest("a")) setOpen(false);
    });
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
          setOpen(false);
          menuBtn.focus();
        }
      },
      { signal },
    );
  }

  // Header border once the page is scrolled
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (header) {
    const onScroll = () => header.toggleAttribute("data-scrolled", window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true, signal });
  }

  // Keyboard hint matches the platform
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll("[data-kbd]").forEach((k) => (k.textContent = mac ? "⌘ K" : "Ctrl K"));

  startClock();
}
