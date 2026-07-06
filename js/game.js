/* ============ Nyanwan Rx — screens & game flow ============
   Loop: title → intake → questions → exam → checkout → next patient.
   Rolodex (cards) and Office (trophy shelf) are viewable any time. */

(() => {
  const $screen = () => document.getElementById("screen");
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  /* ---------- save data ---------- */
  const SAVE_KEY = "nyanwanrx-save-v1";
  let save = { yen: 0, healed: 0, cards: [], gifts: [] };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) save = Object.assign(save, JSON.parse(raw));
  } catch (e) { /* fresh start is fine */ }
  const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} };

  function updateTopbar() {
    document.getElementById("yen-display").textContent = `💴 ¥${save.yen.toLocaleString()}`;
    document.getElementById("healed-display").textContent = `💖 ${save.healed}`;
  }

  /* ---------- current patient ---------- */
  let currentCase = null;
  let renderCurrent = () => showTitle(); // screen to return to from rolodex/office

  const STATUS_EMOJI = {
    tummy: "🤢", sniffles: "🤧", paw: "🤕", ear: "😖", itchy: "😫",
    sleepy: "💤", throat: "🐸", hiccups: "💫", wing: "🤕", sparkle: "🌫️",
    overheat: "🥵", static: "⚡", muddy: "🟤", tooth: "😬", bump: "💫",
  };

  function newCase() {
    const species = pick(SPECIES);
    const options = AILMENTS.filter(a =>
      a.tags.includes("any") || a.tags.some(t => species.tags.includes(t)));
    const ailment = pick(options);
    const gender = Math.random() < 0.5 ? { label: "girl", sign: "♀" } : { label: "boy", sign: "♂" };
    const months = randInt(3, 96);
    const age = months < 12 ? `${months} months old`
      : `${Math.floor(months / 12)} year${months >= 24 ? "s" : ""} old`;
    currentCase = {
      owner: pick(OWNERS),
      petName: pick(PET_NAMES),
      species, ailment, gender, age,
      asked: ailment.questions.map(() => false),
      doneTools: [],   // required tools completed
      triedTools: [],  // optional tools played
      rewarded: false, // checkout payout applied?
    };
  }

  /* replace {pet} in dialogue lines */
  const line = s => s.replaceAll("{pet}", currentCase.petName);

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function bigBtn(text, onTap, opts = {}) {
    const b = el("button", "big-btn" + (opts.minor ? " minor" : "") + (opts.pulse ? " pulse" : ""));
    b.textContent = text;
    b.addEventListener("click", onTap);
    return b;
  }

  function petSprite(big, statusEmoji) {
    const wrap = el("div", "pet-sprite" + (big ? " big" : ""));
    wrap.append(document.createTextNode(currentCase.species.emoji));
    if (statusEmoji) wrap.appendChild(el("span", "status", statusEmoji));
    return wrap;
  }

  function patientBanner() {
    const c = currentCase;
    return el("div", "patient-banner",
      `<span>🧑‍⚕️ Owner: <b>${c.owner.name}</b></span>` +
      `<span>🐾 Pet: <b>${c.petName}</b></span>` +
      `<span>Type: <b>${c.species.label}</b></span>` +
      `<span>${c.gender.sign} <b>${c.gender.label}</b></span>` +
      `<span>🎂 <b>${c.age}</b></span>`);
  }

  /* ---------- screens ---------- */

  function setScreen(...children) {
    const s = $screen();
    s.innerHTML = "";
    s.append(...children);
    s.scrollTop = 0;
  }

  function showTitle() {
    renderCurrent = showTitle;
    document.getElementById("topbar").classList.toggle("hidden", save.healed === 0 && save.yen === 0);
    updateTopbar();
    const col = el("div", "center-col");
    col.append(
      el("h1", "title", "🐾 Nyanwan Rx"),
      el("div", "subtitle", "にゃんワン クリニック — Your very own pet clinic!"),
      el("div", "", `<span style="font-size:4rem">🏥🐕🐈🦜🦄</span>`),
      bigBtn("Open the Clinic! 🔔", () => { newCase(); showIntake(); }, { pulse: true }),
    );
    if (save.cards.length) {
      const row = el("div", "btn-row");
      row.append(
        bigBtn("📇 Patient Cards", showRolodex, { minor: true }),
        bigBtn("🏆 My Office", showOffice, { minor: true }),
      );
      col.appendChild(row);
    }
    setScreen(col);
  }

  function showIntake() {
    renderCurrent = showIntake;
    document.getElementById("topbar").classList.remove("hidden");
    updateTopbar();
    const c = currentCase;
    const duo = el("div", "duo");
    duo.append(el("div", "owner-sprite", c.owner.emoji), petSprite(false, STATUS_EMOJI[c.ailment.id] || "😢"));
    const bubble = el("div", "bubble",
      `Hello, Doctor! I'm <b>${c.owner.name}</b>, and this is <b>${c.petName}</b>. ` +
      line(c.ailment.ownerLine));
    const col = el("div", "center-col");
    col.append(
      el("h2", "", "🔔 A patient is here!"),
      duo, patientBanner(), bubble,
      bigBtn("Ask some questions 💬", showQuestions, { pulse: true }),
    );
    setScreen(col);
  }

  function showQuestions() {
    renderCurrent = showQuestions;
    const c = currentCase;
    const col = el("div", "center-col");
    const duo = el("div", "duo");
    duo.style.animation = "none";
    duo.append(el("div", "owner-sprite", c.owner.emoji), petSprite(false, STATUS_EMOJI[c.ailment.id] || "😢"));

    const chart = el("div", "chart", `<h3>📋 ${c.petName}'s Chart</h3>`);
    const chips = el("div");
    chart.appendChild(chips);
    const refreshChips = () => {
      chips.innerHTML = "";
      c.ailment.questions.forEach((q, i) => {
        if (c.asked[i]) chips.appendChild(el("span", "chip", q.symptom));
      });
      if (!c.asked.some(Boolean)) chips.innerHTML = `<i style="opacity:.6">Ask questions to fill in the chart!</i>`;
    };
    refreshChips();

    const qList = el("div", "q-list");
    c.ailment.questions.forEach((q, i) => {
      const b = el("button", "q-btn", `💬 ${line(q.q)}`);
      if (c.asked[i]) {
        b.classList.add("asked");
        b.appendChild(el("div", "q-answer", `${c.owner.emoji} ${line(q.a)}`));
      }
      b.addEventListener("click", () => {
        if (c.asked[i]) return;
        c.asked[i] = true;
        Sound.good();
        b.classList.add("asked");
        b.appendChild(el("div", "q-answer", `${c.owner.emoji} ${line(q.a)}`));
        refreshChips();
      });
      qList.appendChild(b);
    });

    col.append(
      el("h2", "", `🩺 Ask ${c.owner.name} about ${c.petName}`),
      duo, qList, chart,
      bigBtn("To the exam room! 🚪", showExam, { pulse: true }),
    );
    setScreen(col);
  }

  function showExam() {
    renderCurrent = showExam;
    const c = currentCase;
    const cured = c.doneTools.length >= c.ailment.required.length;
    const col = el("div", "exam-wrap");

    const table = el("div", "exam-table");
    table.append(
      el("h2", "", cured ? `${c.petName} is all better! 🎉` : `🛏️ ${c.petName} is on the exam table`),
      petSprite(true, cured ? "💖" : STATUS_EMOJI[c.ailment.id] || "😢"),
      el("div", "table-edge"),
    );

    /* chart: symptoms + checks that flip from ❓ to ✅ */
    const chart = el("div", "chart", `<h3>📋 ${c.petName}'s Chart</h3>`);
    const chips = el("div");
    c.ailment.questions.forEach((q, i) => { if (c.asked[i]) chips.appendChild(el("span", "chip", q.symptom)); });
    chart.appendChild(chips);
    const checks = el("div");
    c.ailment.required.forEach(r => {
      const done = c.doneTools.includes(r.tool);
      checks.appendChild(el("div", "check-line" + (done ? " done" : ""),
        done ? `✅ ${line(r.finding)}` : `❓ ${c.petName} needs a check with a glowing tool...`));
    });
    chart.appendChild(checks);

    col.append(table, chart);

    if (cured) {
      col.append(
        el("div", "diagnosis-banner", `🔍 Diagnosis: ${c.petName} had ${c.ailment.diagnosis}!`),
        bigBtn("All better! Back to the waiting room 🎉", showCheckout, { pulse: true }),
      );
      setScreen(col);
      return;
    }

    /* tool palette — needed tools glow gold (Sprout tier) */
    const palette = el("div", "tool-palette");
    TOOLS.forEach(tool => {
      const needed = c.ailment.required.some(r => r.tool === tool.id) && !c.doneTools.includes(tool.id);
      const usedGood = c.doneTools.includes(tool.id) || c.triedTools.includes(tool.id);
      const b = el("button", "tool-btn" + (needed ? " needed" : "") + (usedGood ? " used-good" : ""));
      b.append(el("span", "t-emoji", tool.emoji), el("span", "", tool.label));
      b.addEventListener("click", async () => {
        await Minigames.play(tool, { petEmoji: c.species.emoji });
        const req = c.ailment.required.find(r => r.tool === tool.id);
        if (req && !c.doneTools.includes(tool.id)) c.doneTools.push(tool.id);
        else if (!req && !c.triedTools.includes(tool.id)) c.triedTools.push(tool.id);
        showExam(); // re-render with updated chart
      });
      palette.appendChild(b);
    });

    col.append(
      el("div", "mg-msg", "Pick a tool! The ✨glowing✨ ones are what " + c.petName + " needs."),
      palette,
    );
    setScreen(col);
  }

  function showCheckout() {
    renderCurrent = showCheckout;
    const c = currentCase;

    /* apply rewards exactly once, even if we leave and come back */
    if (!c.rewarded) {
      c.rewarded = true;
      c.pay = randInt(c.ailment.pay[0] / 100, c.ailment.pay[1] / 100) * 100;
      c.gift = Math.random() < 0.3 ? pick(GIFTS) : null;
      c.card = {
        petName: c.petName, species: c.species.label, emoji: c.species.emoji,
        gender: c.gender.label, sign: c.gender.sign, age: c.age,
        owner: c.owner.name, diagnosis: c.ailment.diagnosis,
        fee: c.pay, fancy: c.species.tags.includes("fantasy") || c.species.tags.includes("pocket"),
        date: new Date().toLocaleDateString(),
      };
      save.yen += c.pay;
      save.healed += 1;
      save.cards.push(c.card);
      if (c.gift) save.gifts.push(c.gift);
      persist();
      Sound.coin();
    }
    updateTopbar();

    const col = el("div", "center-col");
    const duo = el("div", "duo");
    duo.style.animation = "none";
    duo.append(el("div", "owner-sprite", c.owner.emoji), petSprite(false, "💖"));

    col.append(
      el("h2", "", "🌸 All done!"),
      duo,
      el("div", "bubble", line(pick(THANK_YOUS))),
      el("div", "pay-line", `💴 +¥${c.pay.toLocaleString()}`),
      el("h3", "", `You earned a new patient card!`),
      cardScene(c.card),
      el("div", "flip-hint", "👆 Tap the card to flip it over!"),
    );

    if (c.gift) {
      col.appendChild(el("div", "gem-gift",
        `<span class="g">${c.gift.emoji}</span>${c.petName} left you a <b>${c.gift.label}</b>!<br>It's on your office shelf now! 🏆`));
    }

    const row = el("div", "btn-row");
    row.append(
      bigBtn("Next patient! ➡️", () => { newCase(); showIntake(); }, { pulse: true }),
      bigBtn("Close the clinic 🌙", showTitle, { minor: true }),
    );
    col.appendChild(row);
    setScreen(col);
  }

  /* ---------- trading cards ---------- */
  function cardScene(card) {
    const scene = el("div", "card-scene");
    const t = el("div", "tcard" + (card.fancy ? " fancy" : ""));
    const front = el("div", "face front",
      `<div class="portrait">${card.emoji}</div>` +
      `<div class="pet-name">${card.petName} 💖</div>` +
      `<div>${card.species}</div>` +
      `<div style="font-size:.85rem;opacity:.7">Nyanwan Rx ・ Happy & Healthy!</div>`);
    const back = el("div", "face back",
      `<div class="pet-name">📇 ${card.petName}</div>` +
      `<div class="stat">🐾 Type: <b>${card.species}</b></div>` +
      `<div class="stat">${card.sign} Gender: <b>${card.gender}</b></div>` +
      `<div class="stat">🎂 Age: <b>${card.age}</b></div>` +
      `<div class="stat">🧑 Owner: <b>${card.owner}</b></div>` +
      `<div class="stat">🔍 Had: <b>${card.diagnosis}</b></div>` +
      `<div class="stat">📅 Healed: <b>${card.date}</b></div>` +
      `<div class="stat">💴 Fee: <b>¥${card.fee.toLocaleString()}</b></div>`);
    t.append(front, back);
    t.addEventListener("click", () => { t.classList.toggle("flipped"); Sound.tap(); });
    scene.appendChild(t);
    return scene;
  }

  function showRolodex() {
    const col = el("div", "center-col");
    col.append(el("h2", "", `📇 Patient Rolodex — ${save.cards.length} pets healed!`));
    if (!save.cards.length) {
      col.appendChild(el("div", "subtitle", "No cards yet — heal your first patient to start your collection!"));
    } else {
      const grid = el("div", "rolo-grid");
      [...save.cards].reverse().forEach(card => grid.appendChild(cardScene(card)));
      col.appendChild(grid);
    }
    col.appendChild(bigBtn("⬅️ Back", () => renderCurrent(), { minor: true }));
    setScreen(col);
  }

  function showOffice() {
    const col = el("div", "center-col");
    col.append(
      el("h2", "", "🏆 Your Office Shelf"),
      el("div", "subtitle", "Gifts from grateful pets live here forever."),
    );
    const shelf = el("div", "shelf");
    if (!save.gifts.length) {
      shelf.appendChild(el("div", "shelf-label", "Empty for now... some pets leave a thank-you gift! 🎁"));
    } else {
      save.gifts.forEach(g => {
        const d = el("div", "deco", g.emoji);
        d.title = g.label;
        shelf.appendChild(d);
      });
    }
    col.append(shelf, bigBtn("⬅️ Back", () => renderCurrent(), { minor: true }));
    setScreen(col);
  }

  /* ---------- top bar wiring ---------- */
  document.getElementById("btn-home").addEventListener("click", showTitle);
  document.getElementById("btn-rolodex").addEventListener("click", showRolodex);
  document.getElementById("btn-office").addEventListener("click", showOffice);

  showTitle();
})();
