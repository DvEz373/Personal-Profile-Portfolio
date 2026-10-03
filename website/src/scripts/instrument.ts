// FIG. 01, the grid frequency instrument.
//
// A toy model for illustration: frequency deviation Δf (Hz) from 50 Hz follows a
// damped second-order system. Tripping a generator kicks the rate of change of
// frequency negative; the controller switches the damping ratio between a weakly
// damped system (rings for ~15 s) and a well-damped one (settles in ~2 s).
//   Δf'' = −2ζω·Δf' − ω²·Δf + noise
// Nothing here models a specific plant or controller.

const F0 = 50;
const OMEGA = 2 * Math.PI * 0.45; // natural frequency of the swing, rad/s
const ZETA = { off: 0.08, on: 0.55 } as const;
const KICK = -1.6; // initial RoCoF after a trip, Hz/s
const WINDOW_S = 12; // seconds of frequency history on screen
const SAMPLE_HZ = 30;
const DT = 1 / 120; // physics step, s
const F_MIN = 49.35;
const F_MAX = 50.55;
const SETTLE_BAND = 0.02; // Hz
const GUTTER = 44; // px reserved for the frequency axis labels

type Sample = { t: number; f: number };

export function initInstrument(root: HTMLElement): () => void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-canvas]")!;
  const ctx = canvas.getContext("2d")!;
  const out = {
    f: root.querySelector<HTMLElement>("[data-f]")!,
    rocof: root.querySelector<HTMLElement>("[data-rocof]")!,
    nadir: root.querySelector<HTMLElement>("[data-nadir]")!,
    settle: root.querySelector<HTMLElement>("[data-settle]")!,
    status: root.querySelector<HTMLElement>("[data-status]")!,
    announce: root.querySelector<HTMLElement>("[data-announce]")!,
    cursor: root.querySelector<HTMLElement>("[data-cursor]")!,
  };
  const tripBtn = root.querySelector<HTMLButtonElement>("[data-trip]")!;
  const runBtn = root.querySelector<HTMLButtonElement>("[data-run]")!;
  const ctlBtns = [...root.querySelectorAll<HTMLButtonElement>("[data-ctl]")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- simulation state
  let x = 0; // Δf, Hz
  let v = 0; // dΔf/dt, Hz/s
  let noise = 0;
  let t = 0; // simulated seconds
  let controller: "off" | "on" = "off";
  let running = !reduced;
  let visible = true;
  let tripAt: number | null = null;
  let nadir = 0;
  let quietSince: number | null = null;
  let settledReported = true;
  let autoTripped = false;
  let phase = 0;
  const history: Sample[] = [];
  let sampleAcc = 0;
  let raf = 0;
  let last = 0;
  let w = 0;
  let h = 0;
  let pointerX: number | null = null;
  let colors = readColors();

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    const v = (n: string) => s.getPropertyValue(n).trim();
    return { a: v("--sun"), b: v("--signal"), c: v("--leaf"), ink: v("--ink"), ink2: v("--ink-2"), line: v("--line-strong"), paper: v("--paper"), dark: document.documentElement.dataset.theme === "dark" };
  }

  function step(dt: number) {
    const zeta = ZETA[controller];
    // Ornstein–Uhlenbeck noise keeps the trace alive at ±0.01 Hz.
    noise += (-noise * 2 + (Math.random() - 0.5) * 0.9) * dt;
    const a = -2 * zeta * OMEGA * v - OMEGA * OMEGA * x + noise * 0.25;
    v += a * dt;
    x += v * dt;
    t += dt;
    phase += 2 * Math.PI * 0.9 * (1 + x * 0.9) * dt;

    if (tripAt !== null) {
      nadir = Math.min(nadir, x);
      if (Math.abs(x) < SETTLE_BAND && Math.abs(v) < 0.05) {
        quietSince ??= t;
        if (!settledReported && t - quietSince > 0.5) {
          settledReported = true;
          const secs = quietSince - tripAt;
          out.settle.textContent = secs.toFixed(1);
          out.announce.textContent = `Frequency fell to ${(F0 + nadir).toFixed(2)} hertz and settled after ${secs.toFixed(1)} seconds with the controller ${controller}.`;
        }
      } else {
        quietSince = null;
      }
    }

    sampleAcc += dt;
    if (sampleAcc >= 1 / SAMPLE_HZ) {
      sampleAcc = 0;
      history.push({ t, f: F0 + x });
      while (history.length && history[0].t < t - WINDOW_S) history.shift();
    }
  }

  function trip() {
    v += KICK;
    tripAt = t;
    nadir = 0;
    quietSince = null;
    settledReported = false;
    out.rocof.textContent = KICK.toFixed(2);
    out.nadir.textContent = "…";
    out.settle.textContent = "…";
    root.dataset.tripped = "";
    if (reduced) {
      // No animation: run the next 12 s instantly and draw the result once.
      for (let i = 0; i < WINDOW_S / DT; i++) step(DT);
      out.nadir.textContent = (F0 + nadir).toFixed(2);
      if (!settledReported) out.settle.textContent = "> 12";
      draw();
    }
  }

  function setController(mode: "off" | "on") {
    controller = mode;
    ctlBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.ctl === mode)));
    root.dataset.controller = mode;
  }

  function setRunning(on: boolean) {
    running = on;
    runBtn.setAttribute("aria-pressed", String(on));
    runBtn.querySelector("span")!.textContent = on ? "Pause" : "Run";
    out.status.textContent = on ? "● RUN" : "■ STOP";
    out.status.dataset.state = on ? "run" : "stop";
    if (on) loop(performance.now());
  }

  // ---- drawing
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  const monoFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "ui-monospace, monospace";
  const mono = (size: number) => `${size}px ${monoFamily}`;

  function draw() {
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const pad = 12;
    const laneA = { y: pad, h: h * 0.42 - pad };
    const laneB = { y: h * 0.42 + 18, h: h * 0.58 - 18 - 26 };
    const font = mono(11);

    // Lane separator
    ctx.strokeStyle = colors.line;
    ctx.setLineDash([3, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.42 + 6);
    ctx.lineTo(w, h * 0.42 + 6);
    ctx.stroke();
    ctx.setLineDash([]);

    // ---- Lane A: three-phase voltages
    const mid = laneA.y + laneA.h / 2;
    const amp = (laneA.h / 2 - 6) * (1 - Math.min(Math.abs(x) / 0.6, 1) * 0.18);
    const cycles = w < 520 ? 1.6 : 2.4;
    [colors.a, colors.b, colors.c].forEach((col, k) => {
      ctx.beginPath();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      if (colors.dark) {
        ctx.shadowColor = col;
        ctx.shadowBlur = 6;
      }
      for (let px = 0; px <= w; px += 2) {
        const y = mid - Math.sin((px / w) * cycles * 2 * Math.PI - phase - (k * 2 * Math.PI) / 3) * amp;
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = colors.paper;
    ctx.fillRect(4, laneA.y - 3, 3 * 46 + 4, 18);
    ctx.globalAlpha = 1;
    ["A", "B", "C"].forEach((ch, k) => {
      ctx.fillStyle = [colors.a, colors.b, colors.c][k];
      ctx.fillText(`CH ${ch}`, 8 + k * 46, laneA.y);
    });

    // ---- Lane B: frequency trend
    const fy = (f: number) => laneB.y + ((F_MAX - f) / (F_MAX - F_MIN)) * laneB.h;
    const tx = (s: number) => w - ((t - s) / WINDOW_S) * (w - GUTTER);

    // Normal operating band ±0.2 Hz
    ctx.fillStyle = colors.dark ? "rgba(122,172,255,0.07)" : "rgba(29,95,196,0.06)";
    ctx.fillRect(GUTTER, fy(50.2), w - GUTTER, fy(49.8) - fy(50.2));

    // Axis labels and the 50 Hz reference
    ctx.fillStyle = colors.ink2;
    ctx.textBaseline = "middle";
    [50.4, 50.2, 50.0, 49.8, 49.6, 49.4].forEach((f) => {
      ctx.fillText(f.toFixed(1), 6, fy(f));
    });
    ctx.strokeStyle = colors.ink2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(GUTTER, fy(50));
    ctx.lineTo(w, fy(50));
    ctx.stroke();
    ctx.setLineDash([]);

    // Trip markers
    if (tripAt !== null && tripAt > t - WINDOW_S) {
      const X = tx(tripAt);
      ctx.strokeStyle = colors.a;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(X, laneB.y - 4);
      ctx.lineTo(X, laneB.y + laneB.h);
      ctx.stroke();
      ctx.fillStyle = colors.a;
      ctx.textBaseline = "bottom";
      ctx.fillText("TRIP", Math.min(X + 4, w - 34), laneB.y + 8);
    }

    // Trace
    if (history.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = colors.b;
      ctx.lineWidth = 2.2;
      if (colors.dark) {
        ctx.shadowColor = colors.b;
        ctx.shadowBlur = 8;
      }
      history.forEach((s, i) => {
        const X = tx(s.t);
        const Y = fy(Math.max(F_MIN, Math.min(F_MAX, s.f)));
        if (i === 0) ctx.moveTo(X, Y);
        else ctx.lineTo(X, Y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Nadir marker inside the window
      let low = history[0];
      for (const s of history) if (s.f < low.f) low = s;
      if (low.f < 49.9) {
        const X = tx(low.t);
        const Y = fy(low.f);
        ctx.fillStyle = colors.ink;
        ctx.beginPath();
        ctx.moveTo(X, Y + 5);
        ctx.lineTo(X - 5, Y + 13);
        ctx.lineTo(X + 5, Y + 13);
        ctx.closePath();
        ctx.fill();
        ctx.textBaseline = "top";
        ctx.fillText(`nadir ${low.f.toFixed(2)}`, Math.min(Math.max(X - 34, GUTTER + 2), w - 96), Y + 16);
      }
    }

    // Time axis
    ctx.fillStyle = colors.ink2;
    ctx.textBaseline = "bottom";
    ctx.fillText(`−${WINDOW_S} s`, GUTTER, h - 4);
    ctx.textAlign = "right";
    ctx.fillText("now", w - 6, h - 4);
    ctx.textAlign = "left";
    ctx.fillText("f · Hz", GUTTER, laneB.y - 2);

    // Oscilloscope cursor
    if (pointerX !== null && pointerX >= GUTTER) {
      ctx.strokeStyle = colors.ink2;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pointerX, 0);
      ctx.lineTo(pointerX, h);
      ctx.stroke();
      const at = t - ((w - pointerX) / (w - GUTTER)) * WINDOW_S;
      const near = history.reduce<Sample | null>((best, s) => (!best || Math.abs(s.t - at) < Math.abs(best.t - at) ? s : best), null);
      if (near) {
        out.cursor.hidden = false;
        out.cursor.textContent = `t −${(t - near.t).toFixed(1)} s · ${near.f.toFixed(3)} Hz`;
        out.cursor.style.left = `${Math.min(Math.max(pointerX + 10, 8), w - 170)}px`;
      }
    } else {
      out.cursor.hidden = true;
    }
  }

  function updateReadouts() {
    out.f.textContent = (F0 + x).toFixed(3);
    if (tripAt !== null && !settledReported) out.nadir.textContent = (F0 + nadir).toFixed(2);
  }

  function loop(now: number) {
    cancelAnimationFrame(raf);
    if (!running || !visible) return;
    const elapsed = last ? Math.min((now - last) / 1000, 0.1) : DT;
    last = now;
    for (let acc = elapsed; acc > 0; acc -= DT) step(DT);
    draw();
    updateReadouts();
    raf = requestAnimationFrame((n) => loop(n));
  }

  // ---- warm up so the trace is full on first paint
  for (let i = 0; i < WINDOW_S / DT; i++) step(DT);
  updateReadouts();

  // ---- events
  const ac = new AbortController();
  const { signal } = ac;
  tripBtn.addEventListener("click", () => trip(), { signal });
  ctlBtns.forEach((b) => b.addEventListener("click", () => setController(b.dataset.ctl as "off" | "on"), { signal }));
  runBtn.addEventListener("click", () => setRunning(!running), { signal });
  canvas.addEventListener(
    "pointermove",
    (e) => {
      const r = canvas.getBoundingClientRect();
      pointerX = e.clientX - r.left;
      if (!running) draw();
    },
    { signal },
  );
  canvas.addEventListener(
    "pointerleave",
    () => {
      pointerX = null;
      if (!running) draw();
    },
    { signal },
  );
  document.addEventListener(
    "themechange",
    () => {
      colors = readColors();
      draw();
    },
    { signal },
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      visible = !document.hidden;
      last = 0;
      loop(performance.now());
    },
    { signal },
  );

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      last = 0;
      if (visible) {
        loop(performance.now());
        // One automatic trip the first time the instrument is seen, so the story plays without a click.
        if (!autoTripped && !reduced) {
          autoTripped = true;
          window.setTimeout(() => {
            if (tripAt === null) trip();
          }, 1400);
        }
      }
    },
    { threshold: 0.35 },
  );
  io.observe(root);

  setController("off");
  setRunning(running);
  if (reduced) {
    runBtn.hidden = true;
    out.status.textContent = "■ STATIC";
  }
  resize();

  return () => {
    cancelAnimationFrame(raf);
    ac.abort();
    ro.disconnect();
    io.disconnect();
  };
}
