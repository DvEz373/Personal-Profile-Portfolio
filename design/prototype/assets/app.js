(() => {
  const P = window.PROFILE;
  const page = document.body.dataset.page;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ICONS = {
    timeline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><path d="M6 8v8M11 6h9M11 18h9M11 12h6"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  // Placeholder figure: soft gradient + faint waveform + label
  const ph = (label) => `<div class="ph" role="img" aria-label="Placeholder: ${esc(label)}">
    <svg viewBox="0 0 160 90" preserveAspectRatio="none"><path d="M0 45 Q20 15 40 45 T80 45 T120 45 T160 45" fill="none" stroke="currentColor" stroke-width="1"/><path d="M0 55 Q20 25 40 55 T80 55 T120 55 T160 55" fill="none" stroke="currentColor" stroke-width=".6"/></svg>
    <span>${esc(label)}</span></div>`;

  // ---------- Theme ----------
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const saved = store.get("theme");
  if (saved) document.documentElement.dataset.theme = saved;
  const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;

  // ---------- Shell ----------
  const pages = [["index.html", "Home", "home"], ["experience.html", "Experience", "experience"], ["projects.html", "Projects", "projects"], ["skills.html", "Skills", "skills"], ["about.html", "About", "about"]];
  document.body.insertAdjacentHTML("afterbegin", `
    <a class="skip" href="#main">Skip to content</a>
    <header class="nav"><div class="wrap nav-inner">
      <a class="logo" href="index.html"><span class="logo-mark">DP</span><span>Devin</span></a>
      <button class="icon-btn menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="nav-links">${ICONS.menu}</button>
      <ul class="nav-links" id="nav-links">${pages.map(([h, t, k]) => `<li><a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul>
      <button class="icon-btn theme-btn" aria-label="Toggle dark mode"></button>
    </div></header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer><div class="wrap"><span>© ${new Date().getFullYear()} ${esc(P.name)}</span>
      <nav><a href="${P.links.linkedin}">LinkedIn</a><a href="${P.links.github}">GitHub</a><a href="${P.links.instagram}">Instagram</a><a href="mailto:${P.email}">Email</a></nav></div></footer>`);

  const themeBtn = $(".theme-btn");
  const paintThemeBtn = () => (themeBtn.innerHTML = isDark() ? ICONS.sun : ICONS.moon);
  paintThemeBtn();
  themeBtn.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("theme", next);
    paintThemeBtn();
  });

  const menuBtn = $(".menu-btn"), links = $("#nav-links");
  menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.innerHTML = open ? ICONS.close : ICONS.menu;
  });

  const nav = $(".nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.dispatchEvent(new Event("reveal"));
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  const reveal = (el) => { el.classList.add("reveal"); io.observe(el); };

  const main = $("#main");

  // ---------- Pages ----------
  const render = {
    home() {
      main.innerHTML = `
        <section class="hero"><div class="wrap">
          <div class="hero-grid">
            <div class="portrait">${ph("Portrait")}</div>
            <div>
              <h1>${esc(P.name)}</h1>
              <p class="title">${esc(P.title)}</p>
              <p class="tagline">${esc(P.tagline)}</p>
              <div class="actions"><a class="btn primary" href="${P.cv}" download>Download CV</a><a class="btn" href="about.html#contact">Get in touch</a></div>
            </div>
          </div>
          <canvas id="wave" aria-label="Animated three-phase waveform. Move your pointer over it to change frequency and amplitude." role="img"></canvas>
          <p class="wave-hint">Move over the waves to tune them</p>
        </div></section>
        <section class="wrap"><div class="stats">${P.stats.map((s) => `<div class="stat"><b data-to="${s.value}" data-dec="${s.decimals || 0}" data-suf="${s.suffix || ""}">0</b><span>${esc(s.label)}</span></div>`).join("")}</div></section>
        <nav class="wrap doors" aria-label="Sections">${P.doors.map((d) => `
          <a class="door" href="${d.href}"><span class="ico">${ICONS[d.icon]}</span><h3>${d.title}</h3><p>${esc(d.line)}</p><span class="arrow" aria-hidden="true">→</span></a>`).join("")}</nav>`;
      document.querySelectorAll(".door").forEach(reveal);
      document.querySelectorAll(".stat b").forEach((b) => {
        const to = +b.dataset.to, dec = +b.dataset.dec, suf = b.dataset.suf;
        const fmt = (v) => v.toFixed(dec) + suf;
        if (reduced) { b.textContent = fmt(to); return; }
        reveal(b.parentElement);
        b.parentElement.addEventListener("reveal", () => {
          const t0 = performance.now();
          const step = (t) => { const k = Math.min(1, (t - t0) / 1200); b.textContent = fmt(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        });
      });
      wave($("#wave"));
    },

    experience() {
      const types = [["all", "All"], ["work", "Work"], ["research", "Research"], ["leadership", "Leadership"]];
      main.innerHTML = `
        <header class="page-head narrow"><h1>Experience</h1><p>Tap an entry to see the details.</p></header>
        <div class="narrow">
          <div class="chips" role="group" aria-label="Filter by type">${types.map(([k, t], i) => `<button class="chip" data-f="${k}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>
          <div class="legend"><span><i style="background:var(--pc)"></i>Work</span><span><i style="background:var(--pb)"></i>Research</span><span><i style="background:var(--pa)"></i>Leadership</span></div>
          <ol class="timeline">${P.experience.map((e, i) => `
            <li class="tl-item" data-type="${e.type}"><details class="tl-card"${i === 0 ? " open" : ""}>
              <summary><span class="date">${e.start} – ${e.end}</span><h3>${esc(e.role)}</h3><span class="org">${esc(e.org)} · ${esc(e.place)}</span><span class="sum">${esc(e.summary)}</span><span class="plus" aria-hidden="true">+</span></summary>
              <div class="tl-body"><ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>${e.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
            </details></li>`).join("")}</ol>
        </div>`;
      document.querySelectorAll(".tl-item").forEach(reveal);
      filter(".chip", ".tl-item", (el, f) => el.dataset.type === f);
    },

    projects() {
      const cats = [["all", "All"], ["power", "Power systems"], ["ai", "AI / ML"], ["iot", "IoT"]];
      main.innerHTML = `
        <header class="page-head wrap"><h1>Projects</h1><p>Open a card for the problem, approach and result.</p></header>
        <div class="wrap">
          <div class="chips" role="group" aria-label="Filter by category">${cats.map(([k, t], i) => `<button class="chip" data-f="${k}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>
          <div class="grid">${P.projects.map((p) => `
            <button class="pcard" data-cat="${p.cat}" data-id="${p.id}" aria-haspopup="dialog">
              <div class="fig">${ph(p.title + " figure")}</div>
              <div class="body"><span class="date mono muted" style="font-size:.8rem">${esc(p.context)}</span><h3>${esc(p.title)}</h3><p>${esc(p.blurb)}</p>
              <div>${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div><span class="more">View details →</span></div>
            </button>`).join("")}</div>
        </div>
        <dialog id="pmodal" aria-labelledby="pm-title"></dialog>`;
      document.querySelectorAll(".pcard").forEach(reveal);
      filter(".chip", ".pcard", (el, f) => el.dataset.cat === f);
      const dlg = $("#pmodal");
      document.querySelectorAll(".pcard").forEach((card) => card.addEventListener("click", () => {
        const p = P.projects.find((x) => x.id === card.dataset.id);
        const figs = Array.from({ length: p.figures }, (_, i) => `<div>${ph(`Figure ${i + 1} of ${p.figures}`)}</div>`).join("");
        dlg.innerHTML = `
          <button class="icon-btn modal-close" aria-label="Close">${ICONS.close}</button>
          <div class="modal-figs" tabindex="0" aria-label="Figures, scroll sideways">${figs}</div>
          ${p.figures > 1 ? `<div class="dots">${Array.from({ length: p.figures }, (_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>` : ""}
          <div class="modal-body">
            <span class="mono muted" style="font-size:.8rem">${esc(p.context)}</span>
            <h2 id="pm-title">${esc(p.title)}</h2>
            <dl><dt>Problem</dt><dd>${esc(p.problem)}</dd><dt>Approach</dt><dd>${esc(p.approach)}</dd><dt>Result</dt><dd>${esc(p.result)}</dd></dl>
            <div>${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
            ${p.link ? `<p><a class="btn" href="${p.link}">View on GitHub →</a></p>` : ""}
          </div>`;
        const strip = $(".modal-figs", dlg), dots = dlg.querySelectorAll(".dots i");
        strip.addEventListener("scroll", () => { const i = Math.round(strip.scrollLeft / strip.clientWidth); dots.forEach((d, j) => d.classList.toggle("on", i === j)); }, { passive: true });
        $(".modal-close", dlg).addEventListener("click", () => dlg.close());
        dlg.showModal();
      }));
      dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    },

    skills() {
      main.innerHTML = `
        <header class="page-head wrap"><h1>Skills</h1><p>Self-assessed proficiency. Bars are placeholders until you confirm the levels.</p></header>
        <div class="wrap">
          <div class="skill-groups">${P.skillGroups.map((g) => `
            <section class="sgroup"><h2>${esc(g.name)}</h2>${g.items.map(([n, v]) => `
              <div class="bar"><label><span>${esc(n)}</span><span class="mono muted">${v}%</span></label>
              <div class="track" role="progressbar" aria-label="${esc(n)}" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100"><div class="fill" data-w="${v}"></div></div></div>`).join("")}
            </section>`).join("")}</div>
          <h2>Certifications</h2>
          <ul class="certs">${P.certs.map(([n, by, yr, url]) => `<li><a href="${url}"><span><b>${esc(n)}</b><br><span class="muted" style="font-size:.88rem">${esc(by)}</span></span><span class="yr">${yr}</span></a></li>`).join("")}</ul>
        </div>`;
      document.querySelectorAll(".sgroup").forEach((g) => {
        reveal(g);
        g.addEventListener("reveal", () => g.querySelectorAll(".fill").forEach((f) => (f.style.width = f.dataset.w + "%")));
      });
    },

    about() {
      const E = P.education;
      main.innerHTML = `
        <header class="page-head wrap"><h1>About</h1></header>
        <div class="wrap about-grid">
          <div class="portrait">${ph("Portrait")}</div>
          <div>
            <section class="card"><h2>Hello</h2><p style="margin:0">${esc(P.bio)}</p></section>
            <section class="card"><h2>Education</h2>
              <p style="margin:0"><b>${esc(E.school)}</b> <span class="mono muted" style="font-size:.85rem">${E.years}</span><br>${esc(E.degree)} · ${esc(E.focus)}<br><span class="muted">${esc(E.gpa)}</span></p>
              <ul>${E.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></section>
            <section class="card" id="contact"><h2>Contact</h2>
              <div class="contact-list">
                <button class="btn" id="copy-email">✉ ${esc(P.email)}</button>
                <a class="btn" href="${P.links.linkedin}">LinkedIn</a>
                <a class="btn" href="${P.links.github}">GitHub</a>
                <a class="btn" href="${P.links.instagram}">Instagram</a>
                <a class="btn primary" href="${P.cv}" download>Download CV</a>
              </div><span class="copy-ok" aria-live="polite"></span></section>
          </div>
        </div>`;
      document.querySelectorAll(".card").forEach(reveal);
      const ok = $(".copy-ok");
      $("#copy-email").addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(P.email); ok.textContent = "Email copied"; }
        catch { location.href = "mailto:" + P.email; return; }
        ok.classList.add("show"); setTimeout(() => ok.classList.remove("show"), 1800);
      });
    },
  };

  function filter(chipSel, itemSel, match) {
    const chips = document.querySelectorAll(chipSel);
    chips.forEach((c) => c.addEventListener("click", () => {
      chips.forEach((x) => x.setAttribute("aria-pressed", x === c));
      const f = c.dataset.f;
      document.querySelectorAll(itemSel).forEach((el) => el.classList.toggle("hide", f !== "all" && !match(el, f)));
    }));
  }

  // ---------- Three-phase waveform ----------
  function wave(cv) {
    const ctx = cv.getContext("2d");
    let w, h, freq = 2, amp = 0.75, tf = 2, ta = 0.75, t = 0, visible = true, raf;
    const colors = () => { const s = getComputedStyle(document.documentElement); return ["--pa", "--pb", "--pc"].map((v) => s.getPropertyValue(v).trim()); };
    const size = () => { const r = devicePixelRatio || 1; w = cv.clientWidth; h = cv.clientHeight; cv.width = w * r; cv.height = h * r; ctx.setTransform(r, 0, 0, r, 0, 0); };
    const draw = () => {
      freq += (tf - freq) * 0.08; amp += (ta - amp) * 0.08;
      ctx.clearRect(0, 0, w, h);
      const cols = colors();
      for (let k = 0; k < 3; k++) {
        ctx.beginPath(); ctx.lineWidth = 2.2; ctx.strokeStyle = cols[k];
        for (let x = 0; x <= w; x += 2) {
          const y = h / 2 + Math.sin((x / w) * Math.PI * 2 * freq - t - (k * 2 * Math.PI) / 3) * amp * (h / 2 - 6);
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      t += 0.03;
      if (!reduced && visible) raf = requestAnimationFrame(draw);
    };
    const tune = (cx, cy) => { const r = cv.getBoundingClientRect(); tf = 1 + ((cx - r.left) / r.width) * 4; ta = 0.25 + (1 - (cy - r.top) / r.height) * 0.7; if (reduced) draw(); };
    cv.addEventListener("pointermove", (e) => tune(e.clientX, e.clientY));
    cv.addEventListener("pointerleave", () => { tf = 2; ta = 0.75; if (reduced) draw(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) draw(); }).observe(cv);
    addEventListener("resize", () => { size(); draw(); });
    themeBtn.addEventListener("click", () => reduced && draw());
    size(); draw();
  }

  render[page]();
})();
