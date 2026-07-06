/* ============ Nyanwan Rx — mini-game engines ============
   Every tool launches one of these. Design rule: NO FAIL STATES.
   A miss gets a friendly "almost!" and play continues until success,
   which always ends in three stars and a cheer. */

/* ---------- tiny synth sounds (no audio files) ---------- */
const Sound = (() => {
  let ctx = null;
  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, dur = 0.12, type = "sine", vol = 0.18, when = 0) {
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
const Minigames = (() => {
  const modal = () => document.getElementById("modal");
  const content = () => document.getElementById("modal-content");
  const rand = (a, b) => a + Math.random() * (b - a);

  let running = false; // rAF loops check this

  function build(title, instructions, opts = {}) {
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

  function finish(ui, resolve) {
    running = false;
    ui.stars.textContent = "⭐⭐⭐";
    ui.msg.textContent = "Great job, Doctor!";
    Sound.win();
    setTimeout(() => { modal().classList.add("hidden"); resolve(); }, 1400);
  }

  /* ---- 1. heartbeat: tap the heart when it beats BIG ---- */
  function heartbeat(ui, ctx, resolve) {
    ui.stage.innerHTML = `<div class="hb-ring"></div><div class="hb-heart">❤️</div>`;
    const heart = ui.stage.querySelector(".hb-heart");
    const ring = ui.stage.querySelector(".hb-ring");
    let hits = 0;
    const NEED = 3;
    const show = () => { ui.msg.textContent = `Tap the heart when it's BIG! ${"💗".repeat(hits)}${"🤍".repeat(NEED - hits)}`; };
    show();
    let phase = 0;
    function loop(t) {
      if (!running) return;
      phase = (Math.sin(t / 350) + 1) / 2; // 0..1
      const s = 0.7 + phase * 0.7;
      heart.style.transform = `scale(${s})`;
      ring.style.transform = `scale(${s * 1.3})`;
      ring.style.opacity = phase * 0.8;
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
  }

  /* ---- 2. hold: press and hold to fill, let go in the green ---- */
  function hold(ui, ctx, resolve) {
    ui.stage.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%">
        <div style="font-size:3.5rem">🌡️ ${ctx.petEmoji}</div>
        <div class="meter"><div class="zone" style="left:55%;width:35%"></div><div class="fill"></div></div>
        <div style="font-size:1rem;opacity:.75">Press and HOLD anywhere... let go in the green!</div>
      </div>`;
    const fill = ui.stage.querySelector(".fill");
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
  }

  /* ---- 3/4. spot & xray: find and tap the sparkly thing ---- */
  function findSpot(ui, ctx, resolve, { target, need, msgText }) {
    ui.stage.innerHTML = `<div class="mg-pet-bg">${ctx.petEmoji}</div>`;
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
  const spot = (ui, ctx, resolve) =>
    findSpot(ui, ctx, resolve, { target: "✨", need: 3, msgText: "Find the sparkly spots and tap them!" });
  const xray = (ui, ctx, resolve) =>
    findSpot(ui, ctx, resolve, { target: "🦴", need: 2, msgText: "Look closely... tap what you find in the X-ray!" });

  /* ---- 5. simon: repeat the medicine-bottle pattern ---- */
  function simon(ui, ctx, resolve) {
    const flavors = ["🍓", "🍋", "🫐"];
    const notes = [440, 554, 659];
    ui.stage.innerHTML = `<div class="simon-row"></div>`;
    const row = ui.stage.querySelector(".simon-row");
    const btns = flavors.map((f, i) => {
      const b = document.createElement("button");
      b.className = "simon-b";
      b.textContent = f;
      row.appendChild(b);
      return b;
    });
    const seq = Array.from({ length: 3 }, () => Math.floor(Math.random() * 3));
    let pos = 0, accepting = false;
    function light(i, d = 0) {
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
  }

  /* ---- 6. slider: stop the bouncing marker in the green ---- */
  function slider(ui, ctx, resolve) {
    ui.stage.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%">
        <div style="font-size:3.5rem">💉 ${ctx.petEmoji}</div>
        <div class="meter"><div class="zone" style="left:35%;width:30%"></div><div class="marker"></div></div>
        <button class="big-btn" style="font-size:1.3rem">STOP! ✋</button>
      </div>`;
    const marker = ui.stage.querySelector(".marker");
    const btn = ui.stage.querySelector("button");
    ui.msg.textContent = "Tap STOP when the stick is in the green!";
    let t0 = performance.now(), x = 0;
    function loop(t) {
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
  }

  /* ---- 7. mash: tap tap tap to wrap the bandage ---- */
  function mash(ui, ctx, resolve) {
    ui.stage.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;width:100%">
        <div class="mash-target">${ctx.petEmoji}</div>
        <div class="wrap-bar"><div class="fill"></div></div>
      </div>`;
    const target = ui.stage.querySelector(".mash-target");
    const fill = ui.stage.querySelector(".wrap-bar .fill");
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
  }

  /* ---- 8. bubbles: pop them all ---- */
  function bubbles(ui, ctx, resolve) {
    ui.stage.innerHTML = `<div class="mg-pet-bg">${ctx.petEmoji}</div>`;
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
  }

  /* ---- 9. stars: catch the magic stars one by one ---- */
  function stars(ui, ctx, resolve) {
    ui.stage.innerHTML = `<div class="mg-pet-bg">${ctx.petEmoji}</div>`;
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
  }

  const GAMES = { heartbeat, hold, spot, xray, simon, slider, mash, bubbles, stars };

  /* Play a tool's mini-game. Resolves when the player succeeds. */
  function play(tool, ctx) {
    return new Promise(resolve => {
      const ui = build(`${tool.emoji} ${tool.label}`, "", { dark: tool.game === "xray" });
      GAMES[tool.game](ui, ctx, resolve);
    });
  }

  return { play };
})();
