// Filter chips for lists ([data-filterable]) and anchor behaviour for timelines.

// Window/document listeners are tied to the current page and dropped on the next navigation.
let page: AbortController | undefined;

export function initFilters() {
  page?.abort();
  page = new AbortController();
  document.querySelectorAll<HTMLElement>("[data-filterable]").forEach((root) => {
    const chips = [...root.querySelectorAll<HTMLButtonElement>("[data-filter]")];
    const items = [...root.querySelectorAll<HTMLElement>("[data-kind]")];
    const shown = root.querySelector<HTMLElement>("[data-shown]");
    const apply = (key: string) => {
      let n = 0;
      items.forEach((el) => {
        const on = key === "all" || el.dataset.kind === key;
        el.hidden = !on;
        if (on) n++;
      });
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === key)));
      if (shown) shown.textContent = `Showing ${n} of ${items.length}`;
      document.dispatchEvent(new CustomEvent("filterchange", { detail: { root, key } }));
    };
    chips.forEach((c) => c.addEventListener("click", () => apply(c.dataset.filter || "all")));
  });
}

/** Open and highlight a timeline entry when it is linked to (#id), from the chart or another page. */
export function initTimelineAnchors() {
  const openById = (id: string | undefined) => {
    if (!id) return;
    const item = document.getElementById(id);
    const details = item?.querySelector("details");
    if (!item || !details) return;
    if (item.hidden) {
      // Reset any filter that hides the target.
      item.closest("[data-filterable]")?.querySelector<HTMLButtonElement>('[data-filter="all"]')?.click();
    }
    details.open = true;
  };
  const openFromHash = () => openById(decodeURIComponent(location.hash.slice(1)));
  openFromHash();
  const signal = page?.signal;
  window.addEventListener("hashchange", openFromHash, { signal });

  // Chart ↔ list highlight
  const chart = document.querySelector<HTMLElement>("[data-gantt]");
  if (!chart) return;
  const setHot = (id: string | undefined, on: boolean) => {
    if (!id) return;
    document.getElementById(id)?.toggleAttribute("data-hot", on);
    chart.querySelector(`[data-target="${CSS.escape(id)}"]`)?.toggleAttribute("data-hot", on);
  };
  chart.querySelectorAll<HTMLElement>("[data-target]").forEach((bar) => {
    bar.addEventListener("pointerenter", () => setHot(bar.dataset.target, true));
    bar.addEventListener("pointerleave", () => setHot(bar.dataset.target, false));
    bar.addEventListener("focus", () => setHot(bar.dataset.target, true));
    bar.addEventListener("blur", () => setHot(bar.dataset.target, false));
    // Astro's router handles same-page anchors without a hashchange event.
    bar.addEventListener("click", () => openById(bar.dataset.target));
  });
  document.querySelectorAll<HTMLElement>("[data-filterable] [data-kind]").forEach((item) => {
    item.addEventListener("pointerenter", () => setHot(item.id, true));
    item.addEventListener("pointerleave", () => setHot(item.id, false));
  });
  // Dim chart bars that the list filter hides.
  document.addEventListener(
    "filterchange",
    (e) => {
      const key = (e as CustomEvent<{ key: string }>).detail.key;
      chart.querySelectorAll<HTMLElement>("[data-target]").forEach((bar) => {
        bar.toggleAttribute("data-dim", key !== "all" && bar.dataset.kind !== key);
      });
    },
    { signal },
  );
}

/** Run filters + timeline anchors once per page, however many components ask for them. */
export function initFilterablePage() {
  if (document.body.dataset.filtersReady) return;
  document.body.dataset.filtersReady = "true";
  initFilters();
  initTimelineAnchors();
}
