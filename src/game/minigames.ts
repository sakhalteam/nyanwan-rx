/* ============ Nyanwan Rx — mini-game engines ============
   Every tool launches one of these. Design rule: NO FAIL STATES.
   A miss gets a friendly "almost!" and play continues until success,
   which always ends in three stars and a cheer. */

import type { Tool } from "./data";

/* ---------- tiny synth sounds (no audio files) ---------- */
export const Sound = (() => {
  let ctx: AudioContext | null = null;
  function ac(): AudioContext | null {
    if (!ctx) {
      try { ctx = new AudioContext(); } catch { return null; }
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq: number, dur = 0.12, type: OscillatorType = "sine", vol = 0.18, when = 0) {
    const a = ac();
    if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, a.currentTime + when);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + when + dur);
    o.connect(g).connect(a.destination);
    o.start(a.currentTime + when); o.stop(a.currentTime + when + dur + 0.05);
  }
  return {
    tap:    () => tone(600, 0.08, "triangle"),
    good:   () => { tone(660, 0.1); tone(880, 0.12, "sine", 0.18, 0.09); },
    almost: () => tone(280, 0.15, "sine", 0.1),
    pop:    () => tone(900 + Math.random() * 300, 0.07, "triangle"),
    win:    () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, "sine", 0.2, i * 0.13)),
    coin:   () => { tone(988, 0.09, "square", 0.08); tone(1319, 0.22, "square", 0.08, 0.08); },
  };
})();

/* ---------- shared framework ---------- */
interface MgUi {
  stage: HTMLDivElement;
  msg: HTMLDivElement;
  stars: HTMLDivElement;
}
interface MgCtx {
  /* returns the patient's art sized ~px tall: pixel sprite when the case
   * has one (see spriteInline), emoji text otherwise */
  petArt: (px: number) => string;
}
type Resolve = () => void;
type Game = (ui: MgUi, ctx: MgCtx, resolve: Resolve) => void;

export const Minigames = (() => {
  const modal = () => document.getElementById("modal")!;
  const content = () => document.getElementById("modal-content")!;
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  let running = false; // rAF loops check this

  function build(title: string, instructions: string, opts: { dark?: boolean } = {}): MgUi {
    running = true;
    content().innerHTML = "";
    const h = document.createElement("h2");
    h.textContent = title;
    const stage = document.createElement("div");
    stage.className = "mg-stage" + (opts.dark ? " dark" : "");
    const msg = document.createElement("div");
    msg.className = "mg-msg";
    msg.textContent = instructions;
    const stars = document.createElement("div");
    stars.className = "mg-stars";
    content().append(h, stage, msg, stars);
    modal().classList.remove("hidden");
    return { stage, msg, stars };
  }

  function finish(ui: MgUi, resolve: Resolve) {
    running = false;
    ui.stars.textContent = "⭐⭐⭐";
    ui.msg.textContent = "Great job, Doctor!";
    Sound.win();
    setTimeout(() => { modal().classList.add("hidden"); resolve(); }, 1400);
  }

  /* ---- 1. heartbeat: tap the heart when it beats BIG ---- */
  const heartbeat: Game = (ui, _ctx, resolve) => {
    ui.stage.innerHTML = `<div class="hb-ring"></div><div class="hb-heart">❤️</div>`;
    const heart = ui.stage.querySelector<HTMLElement>(".hb-heart")!;
    const ring = ui.stage.querySelector<HTMLElement>(".hb-ring")!;
    let hits = 0;
    const NEED = 3;
    const show = () => { ui.msg.textContent = `Tap the heart when it's BIG! ${"💗".repeat(hits)}${"🤍".repeat(NEED - hits)}`; };
    show();
    let phase = 0;
    function loop(t: number) {
      if (!running) return;
      phase = (Math.sin(t / 350) + 1) / 2; // 0..1
      const s = 0.7 + phase * 0.7;
      heart.style.transform = `scale(${s})`;
      ring.style.transform = `scale(${s * 1.3})`;
      ring.style.opacity = String(phase * 0.8);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    heart.addEventListener("pointerdown", () => {
      if (!running) return;
      if (phase > 0.65) {
        hits++; Sound.good(); show();
        if (hits >= NEED) finish(ui, resolve);
      } else {
        Sound.almost();
        ui.msg.textContent = "Almost! Wait for the BIG beat... 💓";
      }
    });
  };

  /* ---- 2. hold: press and hold to fill, let go in the green ---- */
  const hold: Game = (ui, ctx, resolve) => {
    ui.stage.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%">
        <div style="font-size:3.5rem">🌡️ ${ctx.petArt(56)}</div>
        <div class="meter"><div class="zone" style="left:55%;width:35%"></div><div class="fill"></div></div>
        <div style="font-size:1rem;opacity:.75">Press and HOLD anywhere... let go in the green!</div>
      </div>`;
    const fill = ui.stage.querySelector<HTMLElement>(".fill")!;
    let level = 0, holding = false;
    ui.msg.textContent = "Hold to warm it up! 👇";
    function loop() {
      if (!running) return;
      if (holding) level = Math.min(100, level + 1.1);
      else level = Math.max(0, level - 0.6);
      fill.style.width = level + "%";
      if (holding && level >= 100) { // gentle overshoot: just drain back
        holding = false;
        Sound.almost();
        ui.msg.textContent = "Ooh, too toasty! Let it cool and try again 😊";
        level = 0;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    ui.stage.addEventListener("pointerdown", () => { if (running) { holding = true; Sound.tap(); } });
    const release = () => {
      if (!running || !holding) return;
      holding = false;
      if (level >= 55 && level <= 90) finish(ui, resolve);
      else { Sound.almost(); ui.msg.textContent = level < 55 ? "Almost! Hold a little longer! 💪" : "So close! Let go a tiny bit sooner!"; }
    };
    ui.stage.addEventListener("pointerup", release);
    ui.stage.addEventListener("pointerleave", release);
  };

  /* ---- 3/4. spot & xray: find and tap the sparkly thing ---- */
  function findSpot(ui: MgUi, ctx: MgCtx, resolve: Resolve,
                    { target, need, msgText }: { target: string; need: number; msgText: string }) {
    ui.stage.innerHTML = `<div class="mg-pet-bg">${ctx.petArt(136)}</div>`;
    let found = 0;
    const show = () => { ui.msg.textContent = `${msgText} ${"⭐".repeat(found)}${"⬜".repeat(need - found)}`; };
    show();
    function place() {
      const s = document.createElement("div");
      s.className = "spot";
      s.textContent = target;
      s.style.left = rand(8, 78) + "%";
      s.style.top = rand(8, 70) + "%";
      s.addEventListener("pointerdown", () => {
        if (!running) return;
        Sound.pop();
        s.remove();
        found++;
        show();
        if (found >= need) finish(ui, resolve);
        else place();
      });
      ui.stage.appendChild(s);
    }
    place();
  }
  const spot: Game = (ui, ctx, resolve) =>
    findSpot(ui, ctx, resolve, { target: "✨", need: 3, msgText: "Find the sparkly spots and tap them!" });

  /* ---- 4. xray: the scanner sweeps the patient into bone-form, then
   *      match the bone shown on the panel to the same one inside ---- */
  const BONES = [
    `<g transform="rotate(45 12 12)"><rect x="10" y="6" width="4" height="12"/><circle cx="9.7" cy="6" r="2.7"/><circle cx="14.3" cy="6" r="2.7"/><circle cx="9.7" cy="18" r="2.7"/><circle cx="14.3" cy="18" r="2.7"/></g>`,
    `<circle cx="12" cy="10" r="7"/><rect x="8" y="15" width="8" height="5" rx="1.5"/><circle cx="9.3" cy="9.5" r="1.9" fill="#10222e"/><circle cx="14.7" cy="9.5" r="1.9" fill="#10222e"/>`,
    `<rect x="11" y="3" width="2" height="18" rx="1"/><ellipse cx="12" cy="8" rx="7.5" ry="2.6" fill="none" stroke="#eaf6ff" stroke-width="2"/><ellipse cx="12" cy="13" rx="7.5" ry="2.6" fill="none" stroke="#eaf6ff" stroke-width="2"/><ellipse cx="12" cy="18" rx="6" ry="2.2" fill="none" stroke="#eaf6ff" stroke-width="2"/>`,
    `<rect x="9" y="2" width="6" height="3.2" rx="1.4"/><rect x="9" y="6.4" width="6" height="3.2" rx="1.4"/><rect x="9" y="10.8" width="6" height="3.2" rx="1.4"/><rect x="9" y="15.2" width="6" height="3.2" rx="1.4"/><rect x="9" y="19.6" width="6" height="3.2" rx="1.4"/><rect x="5.6" y="11.2" width="12.8" height="2.4" rx="1.2"/>`,
    `<ellipse cx="12" cy="15.5" rx="6" ry="5"/><circle cx="5" cy="9.5" r="2.5"/><circle cx="9.7" cy="6.5" r="2.5"/><circle cx="14.3" cy="6.5" r="2.5"/><circle cx="19" cy="9.5" r="2.5"/>`,
    `<circle cx="5.5" cy="12" r="3.4"/><rect x="8" y="11" width="10" height="2"/><path d="M10 12 l3.5-4.5 M13 12 l3.5-4.5 M10 12 l3.5 4.5 M13 12 l3.5 4.5" stroke="#eaf6ff" stroke-width="1.8" fill="none"/><path d="M18 12 l4-4.5 v9 z"/>`,
    `<path d="M12 21 C11.2 14 8.5 9 5.5 4.5 M12 21 C12.8 14 15.5 9 18.5 4.5" stroke="#eaf6ff" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    `<path d="M5 5 v7 a7 7 0 0 0 14 0 V5" fill="none" stroke="#eaf6ff" stroke-width="2.6"/><rect x="6.4" y="5" width="2.6" height="4.6" rx="1"/><rect x="10.7" y="5" width="2.6" height="4.6" rx="1"/><rect x="15" y="5" width="2.6" height="4.6" rx="1"/>`,
  ].map(inner => `<svg viewBox="0 0 24 24" fill="#eaf6ff">${inner}</svg>`);

  const xray: Game = (ui, ctx, resolve) => {
    ui.stage.innerHTML = `
      <div class="xr-wrap">
        <div class="xr-ghost">${ctx.petArt(150)}</div>
        <div class="xr-normal">${ctx.petArt(150)}</div>
        <div class="xr-line"></div>
      </div>
      <div class="xr-panel hidden">FIND THIS BONE<div class="xr-want"></div></div>`;
    const wrap = ui.stage.querySelector<HTMLElement>(".xr-wrap")!;
    const normal = ui.stage.querySelector<HTMLElement>(".xr-normal")!;
    const lineEl = ui.stage.querySelector<HTMLElement>(".xr-line")!;
    const panel = ui.stage.querySelector<HTMLElement>(".xr-panel")!;
    const want = ui.stage.querySelector<HTMLElement>(".xr-want")!;
    ui.msg.textContent = "Scanning... hold very still... 🩻";

    let found = 0;
    const NEED = 2;
    function round() {
      panel.classList.remove("hidden");
      const order = [...BONES.keys()].sort(() => Math.random() - 0.5).slice(0, 6);
      const target = order[Math.floor(Math.random() * order.length)];
      want.innerHTML = BONES[target];
      ui.msg.textContent = `Tap the same bone inside! ${"⭐".repeat(found)}${"⬜".repeat(NEED - found)}`;
      wrap.querySelectorAll(".xr-bone").forEach(b => b.remove());
      order.forEach((bi, k) => {
        const b = document.createElement("div");
        b.className = "xr-bone";
        b.innerHTML = BONES[bi];
        b.style.left = 16 + (k % 3) * 24 + rand(-3, 3) + "%";
        b.style.top = 16 + Math.floor(k / 3) * 28 + rand(-4, 4) + "%";
        b.style.rotate = rand(-30, 30) + "deg";
        b.addEventListener("pointerdown", () => {
          if (!running) return;
          if (bi === target) {
            Sound.good();
            found++;
            if (found >= NEED) finish(ui, resolve);
            else round();
          } else {
            Sound.almost();
            ui.msg.textContent = "Hmm, not that one — look very closely! 🔍";
          }
        });
        wrap.appendChild(b);
      });
    }

    const t0 = performance.now();
    const SCAN = 2400;
    requestAnimationFrame(function scan(t: number) {
      if (!running) return;
      const p = Math.min(1, (t - t0) / SCAN);
      lineEl.style.left = p * 100 + "%";
      normal.style.clipPath = `inset(0 0 0 ${p * 100}%)`; // bone-form appears behind the line
      if (p < 1) requestAnimationFrame(scan);
      else { lineEl.remove(); round(); }
    });
  };

  /* ---- 5. simon: repeat the medicine-bottle pattern ---- */
  const simon: Game = (ui, _ctx, resolve) => {
    const flavors = ["🍓", "🍋", "🫐"];
    ui.stage.innerHTML = `<div class="simon-row"></div>`;
    const row = ui.stage.querySelector<HTMLElement>(".simon-row")!;
    const btns = flavors.map(f => {
      const b = document.createElement("button");
      b.className = "simon-b";
      b.textContent = f;
      row.appendChild(b);
      return b;
    });
    const seq = Array.from({ length: 3 }, () => Math.floor(Math.random() * 3));
    let pos = 0, accepting = false;
    function light(i: number, d = 0) {
      setTimeout(() => {
        if (!running) return;
        btns[i].classList.add("lit");
        Sound.tap();
        setTimeout(() => btns[i].classList.remove("lit"), 380);
      }, d);
    }
    function playback() {
      accepting = false; pos = 0;
      ui.msg.textContent = "Watch the medicine bottles... 👀";
      seq.forEach((i, k) => light(i, 500 + k * 650));
      setTimeout(() => {
        if (!running) return;
        accepting = true;
        ui.msg.textContent = "Your turn! Tap them in the same order! 👇";
      }, 500 + seq.length * 650);
    }
    btns.forEach((b, i) => b.addEventListener("pointerdown", () => {
      if (!running || !accepting) return;
      b.classList.add("lit");
      setTimeout(() => b.classList.remove("lit"), 250);
      if (i === seq[pos]) {
        Sound.good();
        pos++;
        if (pos >= seq.length) { accepting = false; finish(ui, resolve); }
      } else {
        Sound.almost();
        ui.msg.textContent = "Oops, let's watch it one more time! 😊";
        setTimeout(playback, 900);
        accepting = false;
      }
    }));
    playback();
  };

  /* ---- 6. slider: stop the bouncing marker in the green ---- */
  const slider: Game = (ui, ctx, resolve) => {
    ui.stage.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%">
        <div style="font-size:3.5rem">💉 ${ctx.petArt(56)}</div>
        <div class="meter"><div class="zone" style="left:35%;width:30%"></div><div class="marker"></div></div>
        <button class="big-btn" style="font-size:1.3rem">STOP! ✋</button>
      </div>`;
    const marker = ui.stage.querySelector<HTMLElement>(".marker")!;
    const btn = ui.stage.querySelector<HTMLElement>("button")!;
    ui.msg.textContent = "Tap STOP when the stick is in the green!";
    const t0 = performance.now();
    let x = 0;
    function loop(t: number) {
      if (!running) return;
      x = (Math.sin((t - t0) / 480) + 1) / 2; // 0..1 back and forth
      marker.style.left = `calc(${x * 100}% - 5px)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    btn.addEventListener("pointerdown", () => {
      if (!running) return;
      if (x >= 0.35 && x <= 0.65) finish(ui, resolve);
      else { Sound.almost(); ui.msg.textContent = "Almost! Watch it swing back... 🎯"; }
    });
  };

  /* ---- 7. mash: tap tap tap to wrap the bandage ---- */
  const mash: Game = (ui, ctx, resolve) => {
    ui.stage.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;width:100%">
        <div class="mash-target">${ctx.petArt(86)}</div>
        <div class="wrap-bar"><div class="fill"></div></div>
      </div>`;
    const target = ui.stage.querySelector<HTMLElement>(".mash-target")!;
    const fill = ui.stage.querySelector<HTMLElement>(".wrap-bar .fill")!;
    const NEED = 8;
    let taps = 0;
    ui.msg.textContent = "Tap the patient to wrap the bandage! 🩹";
    ui.stage.addEventListener("pointerdown", () => {
      if (!running) return;
      taps++;
      Sound.tap();
      fill.style.width = (taps / NEED) * 100 + "%";
      target.style.transform = `rotate(${(taps % 2 ? 1 : -1) * 8}deg) scale(${1 + taps / 40})`;
      if (taps === Math.ceil(NEED / 2)) ui.msg.textContent = "Halfway there — keep wrapping! 🌀";
      if (taps >= NEED) finish(ui, resolve);
    });
  };

  /* ---- 8. bubbles: pop them all ---- */
  const bubbles: Game = (ui, ctx, resolve) => {
    ui.stage.innerHTML = `<div class="mg-pet-bg">${ctx.petArt(136)}</div>`;
    const NEED = 6;
    let popped = 0;
    ui.msg.textContent = "Pop all the bubbles to scrub-a-dub! 🛁";
    for (let i = 0; i < NEED; i++) {
      const b = document.createElement("div");
      b.className = "spot";
      b.textContent = "🫧";
      b.style.left = rand(5, 80) + "%";
      b.style.top = rand(5, 72) + "%";
      b.style.animationDelay = rand(0, 1) + "s";
      b.addEventListener("pointerdown", () => {
        if (!running) return;
        Sound.pop();
        b.textContent = "💦";
        b.style.pointerEvents = "none";
        setTimeout(() => b.remove(), 300);
        popped++;
        if (popped >= NEED) finish(ui, resolve);
      });
      ui.stage.appendChild(b);
    }
  };

  /* ---- 9. stars: catch the magic stars one by one ---- */
  const stars: Game = (ui, ctx, resolve) => {
    ui.stage.innerHTML = `<div class="mg-pet-bg">${ctx.petArt(136)}</div>`;
    const NEED = 4;
    let caught = 0;
    const show = () => { ui.msg.textContent = `Catch the magic stars! ${"🌟".repeat(caught)}${"⬜".repeat(NEED - caught)}`; };
    show();
    function place() {
      const s = document.createElement("div");
      s.className = "spot";
      s.textContent = "🌟";
      s.style.left = rand(8, 78) + "%";
      s.style.top = rand(8, 70) + "%";
      s.addEventListener("pointerdown", () => {
        if (!running) return;
        Sound.good();
        s.remove();
        caught++;
        show();
        if (caught >= NEED) finish(ui, resolve);
        else place();
      });
      ui.stage.appendChild(s);
    }
    place();
  };

  /* ---- 10. splinters: gently tweeze every prickle out ---- */
  const splinters: Game = (ui, ctx, resolve) => {
    ui.stage.innerHTML = `<div class="sp-pet">${ctx.petArt(150)}</div>`;
    const NEED = 5;
    let out = 0;
    const show = () => { ui.msg.textContent = `Gently tweeze out every prickle! 🥢 ${"✨".repeat(out)}${"🌵".repeat(NEED - out)}`; };
    show();
    for (let i = 0; i < NEED; i++) {
      const s = document.createElement("div");
      s.className = "splinter";
      s.style.left = rand(32, 64) + "%";
      s.style.top = rand(26, 66) + "%";
      s.style.setProperty("--rot", rand(-70, 70) + "deg");
      s.style.animationDelay = rand(0, 0.8) + "s";
      s.addEventListener("pointerdown", () => {
        if (!running || s.classList.contains("plucked")) return;
        Sound.pop();
        s.classList.add("plucked");
        setTimeout(() => s.remove(), 500);
        out++;
        show();
        if (out >= NEED) finish(ui, resolve);
      });
      ui.stage.appendChild(s);
    }
  };

  const GAMES: Record<string, Game> = { heartbeat, hold, spot, xray, simon, slider, mash, bubbles, stars, splinters };

  /* Play a tool's mini-game. Resolves when the player succeeds. */
  function play(tool: Tool, ctx: MgCtx): Promise<void> {
    return new Promise(resolve => {
      const ui = build(`${tool.emoji} ${tool.label}`, "", { dark: tool.game === "xray" });
      GAMES[tool.game](ui, ctx, resolve);
    });
  }

  return { play };
})();
