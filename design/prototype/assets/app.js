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
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/></svg>',
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

  // Real photo with WebP + JPEG fallback
  const pic = (base, alt, cls = "") => `<picture class="${cls}"><source srcset="${base}.webp" type="image/webp"><img src="${base}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async"></picture>`;

  // ---------- Background ornaments: circuit traces, wind turbine, solar array, transmission tower, data blocks ----------
  const ORNAMENTS = `<svg class="ornaments" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="currentColor"/></pattern></defs>
    <rect width="1440" height="900" fill="url(#dots)" opacity=".35"/>
    <g class="orn-circuit" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M0 140 H120 L160 100 H300 M160 100 V40 M300 100 L340 140 H420"/>
      <path d="M0 220 H80 L120 180 H220 M220 180 V260 H330"/>
      <g fill="currentColor"><circle cx="420" cy="140" r="4"/><circle cx="160" cy="40" r="4"/><circle cx="330" cy="260" r="4"/><circle cx="300" cy="100" r="3"/></g>
      <rect x="236" y="20" width="44" height="44" rx="4"/><path d="M244 20v-8M258 20v-8M272 20v-8M244 64v8M258 64v8M272 64v8"/>
    </g>
    <g class="orn-turbine" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M1290 380 L1282 640 H1298 Z" fill="currentColor" opacity=".5"/>
      <g class="blades" style="transform-origin:1290px 380px"><path d="M1290 380 V290 M1290 380 L1368 425 M1290 380 L1212 425"/><circle cx="1290" cy="380" r="6" fill="currentColor"/></g>
      <path d="M1380 470 L1376 640 H1386 Z" fill="currentColor" opacity=".4"/>
      <g class="blades slow" style="transform-origin:1381px 470px"><path d="M1381 470 V412 M1381 470 L1431 499 M1381 470 L1331 499"/></g>
    </g>
    <g class="orn-solar" fill="none" stroke="currentColor" stroke-width="1.6">
      <g transform="translate(70 720) skewX(-18)"><rect width="200" height="96" rx="3"/><path d="M50 0V96M100 0V96M150 0V96M0 32H200M0 64H200"/></g>
      <path d="M110 816 V860 M210 816 V860"/>
    </g>
    <g class="orn-grid" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">
      <path d="M1000 900 L1040 700 L1080 900 M1012 840 H1068 M1022 790 H1058 M1040 700 V680 M1000 720 H1080 M1010 740 H1070 M1018 840 L1058 790 M1062 840 L1022 790"/>
      <path class="lines" d="M1000 720 Q900 780 760 760 M1080 720 Q1180 770 1300 750 M1010 740 Q905 800 770 780 M1070 740 Q1175 790 1310 770"/>
    </g>
    <g class="orn-accent" fill="none">
        <path class="pulse" d="M0 140 H120 L160 100 H300 L340 140 H420"/>
        <path class="pulse p2" d="M0 220 H80 L120 180 H220 V260 H330"/>
        <circle class="sun" cx="330" cy="660" r="22"/><path class="sun" d="M330 620v-12M330 712v-12M290 660h-12M382 660h-12M302 632l-8-8M366 696l-8-8M302 688l-8 8M366 624l-8 8"/>
    </g>
    <g class="orn-data" fill="currentColor" font-family="ui-monospace,monospace" font-size="13" opacity=".9">
      <text x="1120" y="70">01001101 01001100</text><text x="1150" y="92">∑ wᵢxᵢ + b</text><text x="1100" y="114">dx/dt = Ax + Bu</text>
      <g fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="1360" cy="150" r="7"/><circle cx="1410" cy="125" r="7"/><circle cx="1410" cy="175" r="7"/><circle cx="1310" cy="125" r="7"/><circle cx="1310" cy="175" r="7"/><path d="M1317 125 L1353 150 M1317 175 L1353 150 M1367 150 L1403 125 M1367 150 L1403 175"/></g>
    </g>
  </svg>`;
  document.body.insertAdjacentHTML("afterbegin", ORNAMENTS);

  // ---------- Theme ----------
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const saved = store.get("theme");
  if (saved) document.documentElement.dataset.theme = saved;
  const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;

  // ---------- Shell ----------
  const pages = [["index.html", "Home", "home"], ["experience.html", "Experience", "experience"], ["education.html", "Education", "education"], ["projects.html", "Projects", "projects"], ["skills.html", "Skills", "skills"], ["about.html", "About", "about"]];
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
      <nav><a href="${P.links.linkedin}">LinkedIn</a><a href="${P.links.github}">GitHub</a><a href="${P.links.instagram}">Instagram</a><a href="mailto:${P.email}">Email</a><a href="tel:${P.phone.replace(/\s/g, "")}">${esc(P.phone)}</a></nav></div></footer>`);

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
            <div class="portrait">${pic(P.portrait, "Portrait of " + P.name)}</div>
            <div>
              <h1>${esc(P.name)}</h1>
              <p class="title">${esc(P.title)}</p>
              <p class="tagline">${esc(P.tagline)}</p>
              <p class="role-now"><span class="live" aria-hidden="true"></span>${esc(P.role)}</p>
              <div class="actions"><a class="btn primary" href="${P.cv}" download>Download CV</a><a class="btn" href="about.html#contact">Get in touch</a></div>
            </div>
          </div>
          <canvas id="wave" aria-label="Animated three-phase waveform. Move your pointer over it to change frequency and amplitude." role="img"></canvas>
          <p class="wave-hint">Move over the waves to tune them</p>
          <ul class="focus" aria-label="Areas of focus">${P.focus.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        </div></section>
        <section class="wrap"><div class="stats">${P.stats.map((s) => `<div class="stat"><b data-to="${s.count ? P[s.count].length : s.value}" data-dec="${s.decimals || 0}" data-suf="${s.suffix || ""}">0</b><span>${esc(s.label)}</span></div>`).join("")}</div></section>
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
      timelinePage({
        title: "Experience", intro: "Jobs, internships and campus roles. Tap an entry for details.",
        types: [["work", "Work", "--pb"], ["internship", "Internships", "--pa"], ["campus", "Campus & academic", "--pc"]],
        items: P.experience.map((e) => ({ type: e.type, date: `${e.start} – ${e.end}`, title: e.role, sub: `${e.org} · ${e.place}`, summary: e.summary, points: e.points, tags: e.tags })),
      });
    },

    education() {
      timelinePage({
        title: "Education", intro: "Degree, exchange and continued learning.",
        types: [["degree", "Degree", "--pb"], ["exchange", "Exchange", "--pa"], ["courses", "Courses", "--pc"]],
        items: P.education.map((e) => ({ type: e.kind, date: `${e.start} – ${e.end}`, title: e.title, sub: e.place, summary: e.summary, points: e.points, tags: [], link: e.link, photo: e.photo, photoAlt: e.photoAlt })),
        openFirst: "degree",
        banner: { base: P.photos.graduationWide, alt: "Graduation day at Universitas Indonesia", caption: "Graduation day, Universitas Indonesia, 2025" },
      });
    },

    projects() {
      const cats = [["all", "All"], ["energy", "Energy & power"], ["ai", "AI / ML"], ["iot", "IoT & automation"]];
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
          <h2 id="certs">Certifications</h2>
          <ul class="certs">${P.certs.map(([n, by, yr, url]) => `<li><a href="${url}"><span><b>${esc(n)}</b><br><span class="muted" style="font-size:.88rem">${esc(by)}</span></span><span class="yr">${yr}</span></a></li>`).join("")}</ul>
        </div>`;
      document.querySelectorAll(".sgroup").forEach((g) => {
        reveal(g);
        g.addEventListener("reveal", () => g.querySelectorAll(".fill").forEach((f) => (f.style.width = f.dataset.w + "%")));
      });
    },

    about() {
      main.innerHTML = `
        <header class="page-head wrap"><h1>About</h1></header>
        <div class="wrap about-grid">
          <div class="about-photos"><div class="portrait">${pic(P.portrait, "Portrait of " + P.name)}</div><figure class="photo-card">${pic(P.photos.graduation, "Graduation at Universitas Indonesia")}<figcaption>Graduation, Universitas Indonesia</figcaption></figure></div>
          <div>
            <section class="card"><h2>Hello</h2>${P.bio.map((b) => `<p>${esc(b)}</p>`).join("")}</section>
            <section class="card"><h2>What I work on</h2><ul class="focus left">${P.focus.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></section>
            <section class="card" id="contact"><h2>Contact</h2>
              <div class="contact-list">
                <a class="btn" href="tel:${P.phone.replace(/\s/g, "")}">☎ ${esc(P.phone)}</a>
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

  // Shared filterable, expandable timeline (Experience and Education)
  function timelinePage({ title, intro, types, items, openFirst, banner }) {
    const first = openFirst ? items.findIndex((it) => it.type === openFirst) : 0;
    main.innerHTML = `
      <header class="page-head narrow"><h1>${title}</h1><p>${intro}</p></header>
      ${banner ? `<figure class="banner narrow">${pic(banner.base, banner.alt)}<figcaption>${esc(banner.caption)}</figcaption></figure>` : ""}
      <div class="narrow">
        <div class="chips" role="group" aria-label="Filter">${[["all", "All"], ...types].map(([k, t], i) => `<button class="chip" data-f="${k}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>
        <div class="legend">${types.map(([, t, c]) => `<span><i style="background:var(${c})"></i>${t}</span>`).join("")}</div>
        <ol class="timeline">${items.map((e, i) => `
          <li class="tl-item" data-type="${e.type}" style="--dot:var(${types.find((t) => t[0] === e.type)[2]})"><details class="tl-card"${i === first ? " open" : ""}>
            <summary><span class="date">${e.date}</span><h3>${esc(e.title)}</h3><span class="org">${esc(e.sub)}</span><span class="sum">${esc(e.summary)}</span><span class="plus" aria-hidden="true">+</span></summary>
            <div class="tl-body">${e.photo ? `<figure class="tl-photo">${pic(e.photo, e.photoAlt || e.title)}</figure>` : ""}${e.points.length ? `<ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : "<p></p>"}${e.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}${e.link ? `<p><a href="${e.link}">More →</a></p>` : ""}</div>
          </details></li>`).join("")}</ol>
      </div>`;
    document.querySelectorAll(".tl-item").forEach(reveal);
    filter(".chip", ".tl-item", (el, f) => el.dataset.type === f);
  }

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
