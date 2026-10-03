// Command palette: Ctrl/⌘+K (or "/") opens a searchable list of pages,
// projects, roles and actions. Follows the WAI-ARIA combobox + listbox pattern.
import { navigate } from "astro:transitions/client";
import { toast, toggleTheme } from "./shell";

type Item = {
  id: string;
  group: string;
  title: string;
  hint?: string;
  href?: string;
  action?: string;
  external?: boolean;
  download?: string;
  keywords?: string;
};

let globalKeysBound = false;

function score(item: Item, terms: string[]): number {
  if (!terms.length) return 1;
  const title = item.title.toLowerCase();
  const hay = `${title} ${item.group} ${item.hint ?? ""} ${item.keywords ?? ""}`.toLowerCase();
  let total = 0;
  for (const t of terms) {
    if (title.startsWith(t)) total += 6;
    else if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(title)) total += 4;
    else if (hay.includes(t)) total += 1;
    else return 0;
  }
  return total;
}

function openDialog() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-cmdk]");
  if (!dialog || dialog.open) return;
  dialog.showModal();
  const input = dialog.querySelector<HTMLInputElement>("[data-cmdk-input]");
  if (input) {
    input.value = "";
    input.dispatchEvent(new Event("input"));
    input.focus();
  }
}

function bindGlobalKeys() {
  if (globalKeysBound) return;
  globalKeysBound = true;
  document.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;
    const typing = target.closest("input, textarea, [contenteditable='true']");
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const dialog = document.querySelector<HTMLDialogElement>("[data-cmdk]");
      if (dialog?.open) dialog.close();
      else openDialog();
    } else if (e.key === "/" && !typing) {
      e.preventDefault();
      openDialog();
    }
  });
}

export function initCommandPalette() {
  bindGlobalKeys();
  const dialog = document.querySelector<HTMLDialogElement>("[data-cmdk]");
  const input = dialog?.querySelector<HTMLInputElement>("[data-cmdk-input]");
  const list = dialog?.querySelector<HTMLUListElement>("[data-cmdk-list]");
  const empty = dialog?.querySelector<HTMLElement>("[data-cmdk-empty]");
  const data = document.querySelector("[data-cmdk-data]");
  if (!dialog || !input || !list || !empty || !data) return;

  const items: Item[] = JSON.parse(data.textContent || "[]");
  let results: Item[] = [];
  let active = 0;

  const render = () => {
    const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    results = items
      .map((item, i) => ({ item, s: score(item, terms), i }))
      .filter((r) => r.s > 0)
      .sort((a, b) => (terms.length ? b.s - a.s : 0) || a.i - b.i)
      .slice(0, terms.length ? 12 : items.length)
      .map((r) => r.item);
    active = 0;
    list.replaceChildren();
    let lastGroup = "";
    results.forEach((item, i) => {
      if (item.group !== lastGroup && !terms.length) {
        const g = document.createElement("li");
        g.className = "group";
        g.setAttribute("role", "presentation");
        g.textContent = item.group;
        list.append(g);
        lastGroup = item.group;
      }
      const li = document.createElement("li");
      li.id = `cmdk-${item.id}`;
      li.setAttribute("role", "option");
      li.dataset.index = String(i);
      const title = document.createElement("span");
      title.textContent = item.title;
      li.append(title);
      const hint = item.hint ?? (terms.length ? item.group : "");
      if (hint) {
        const h = document.createElement("span");
        h.className = "hint";
        h.textContent = hint;
        li.append(h);
      }
      list.append(li);
    });
    empty.hidden = results.length > 0;
    highlight();
  };

  const highlight = () => {
    list.querySelectorAll<HTMLElement>("[role='option']").forEach((el) => {
      const on = Number(el.dataset.index) === active;
      el.setAttribute("aria-selected", String(on));
      if (on) {
        input.setAttribute("aria-activedescendant", el.id);
        el.scrollIntoView({ block: "nearest" });
      }
    });
    if (!results.length) input.removeAttribute("aria-activedescendant");
  };

  const run = async (item: Item | undefined) => {
    if (!item) return;
    dialog.close();
    if (item.action === "copy-email") {
      const email = item.hint ?? "";
      try {
        await navigator.clipboard.writeText(email);
        toast(`Copied ${email}`);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    } else if (item.action === "toggle-theme") {
      toggleTheme();
    } else if (item.download && item.href) {
      const a = document.createElement("a");
      a.href = item.href;
      a.download = item.download;
      document.body.append(a);
      a.click();
      a.remove();
    } else if (item.external && item.href) {
      window.open(item.href, "_blank", "noopener");
    } else if (item.href?.startsWith("tel:")) {
      window.location.href = item.href;
    } else if (item.href) {
      navigate(item.href);
    }
  };

  input.addEventListener("input", render);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = Math.min(active + 1, results.length - 1);
      highlight();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      active = Math.max(active - 1, 0);
      highlight();
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    }
  });
  list.addEventListener("click", (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>("[role='option']");
    if (li) run(results[Number(li.dataset.index)]);
  });
  list.addEventListener("mousemove", (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>("[role='option']");
    if (li && Number(li.dataset.index) !== active) {
      active = Number(li.dataset.index);
      highlight();
    }
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  document.querySelectorAll("[data-cmdk-open]").forEach((b) => b.addEventListener("click", openDialog));
  render();
}
