/* ============ Nyanwan Rx — screens & game flow ============
   Retro shop-menu presentation: the screen is a fixed frame —
   HUD on top, patient chart on the left, angled room in the middle,
   a location-titled choice menu on the right, and a "NAME: dialogue"
   bar along the bottom. Each screen fills those regions.

   The engine drives the frame imperatively (innerHTML per region),
   River City Ransom shop-screen style; React renders the frame once
   in App.tsx and hands control over via initGame(). */

import { SPECIES, OWNERS, PET_NAMES, TOOLS, AILMENTS, GIFTS, THANK_YOUS } from "./data";
import type { Ailment, Gift, Owner, Species } from "./data";
import { SPECIES_SPRITES, HUMAN_SPRITES, spriteImg, spriteInline } from "./sprites";
import type { SpriteOpts } from "./sprites";
import { Minigames, Sound } from "./minigames";

interface Card {
  petName: string;
  species: string;
  emoji: string;
  gender: string;
  sign: string;
  age: string;
  owner: string;
  diagnosis: string;
  fee: number;
  fancy: boolean;
  date: string;
}

interface Case {
  owner: Owner;
  petName: string;
  species: Species;
  ailment: Ailment;
  gender: { label: string; sign: string };
  age: string;
  petSprite: string | null;
  ownerSprite: string;
  asked: boolean[];
  doneTools: string[];
  triedTools: string[];
  rewarded: boolean;
  pay?: number;
  gift?: Gift | null;
  card?: Card;
}

interface MenuItem {
  label?: string;
  price?: string;
  onTap?: () => void;
  marked?: boolean;
  done?: boolean;
  note?: string;
}

interface SaveData {
  yen: number;
  healed: number;
  cards: Card[];
  gifts: Gift[];
}

let booted = false;

/** Boot the clinic inside the already-rendered frame (see App.tsx). */
export function initGame() {
  if (booted) return; // React StrictMode mounts effects twice in dev
  booted = true;

  const $ = (id: string) => document.getElementById(id)!;
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

  /* ---------- save data ---------- */
  const SAVE_KEY = "nyanwanrx-save-v1";
  let save: SaveData = { yen: 0, healed: 0, cards: [], gifts: [] };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) save = Object.assign(save, JSON.parse(raw));
  } catch { /* fresh start is fine */ }
  const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch { /* ok */ } };

  /* ---------- HUD ---------- */
  function updateHud() {
    $("hud-yen").textContent = `¥${save.yen.toLocaleString()}`;
    $("hud-healed").textContent = `💖 ${save.healed}`;
    const slots = $("slots");
    slots.innerHTML = "";
    const recent = save.gifts.slice(-5);
    for (let i = 0; i < 5; i++) {
      const s = document.createElement("div");
      s.className = "slot";
      if (recent[i]) { s.textContent = recent[i].emoji; s.title = recent[i].label; }
      slots.appendChild(s);
    }
  }

  /* ---------- frame region helpers ---------- */
  function el(tag: string, cls: string, html?: string) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  let typeTimer: ReturnType<typeof setInterval> | undefined;
  function setDialogue(speaker: string, text: string) {
    clearInterval(typeTimer);
    $("dlg-speaker").textContent = speaker ? speaker.toUpperCase() + ":" : "";
    const target = $("dlg-text");
    target.innerHTML = "";
    let i = 0;
    typeTimer = setInterval(() => {
      i++;
      target.innerHTML = text.slice(0, i) + (i < text.length ? `<span class="cursor">▊</span>` : "");
      if (i >= text.length) clearInterval(typeTimer);
    }, 16);
  }

  function setMenu(title: string, items: MenuItem[]) {
    const m = $("menu");
    m.innerHTML = "";
    m.appendChild(el("h3", "", title));
    items.forEach(it => {
      if (it.note) { m.appendChild(el("div", "menu-note", it.note)); return; }
      const b = el("button",
        "menu-item" + (it.marked ? " marked" : "") + (it.done ? " done" : ""));
      b.appendChild(el("span", "mi-label", it.label));
      if (it.price !== undefined) b.appendChild(el("span", "mi-price", it.price));
      if (it.onTap) b.addEventListener("click", it.onTap);
      m.appendChild(b);
    });
  }

  function setChart(html: string) { $("chart").innerHTML = html; }

  /* ---------- room scenes (CSS/emoji placeholder art) ---------- */
  function prop(emoji: string, size: number, x: number, y: number, extra = "") {
    return `<div class="prop" style="left:${x}%;top:${y}%;${extra}">
      <span class="p-emoji" style="font-size:${size}px">${emoji}</span></div>`;
  }
  function sprite(emoji: string, size: number, x: number, y: number, opts: SpriteOpts = {}) {
    return `<div class="sprite${opts.enter ? " enter" : ""}" style="left:${x}%;top:${y}%">
      ${opts.status ? `<span class="s-status">${opts.status}</span>` : ""}
      <span class="s-emoji" style="font-size:${size}px">${emoji}</span></div>`;
  }

  /* pet/owner with pixel sheets when the case has them, emoji otherwise.
   * opts.pose picks an animation (spriteImg falls back to idle). */
  function petS(size: number, x: number, y: number, opts: SpriteOpts = {}) {
    const c = currentCase;
    return (c.petSprite && spriteImg(c.petSprite, opts.pose || "idle", x, y, opts))
      || sprite(petEmoji(), size, x, y, opts);
  }
  function ownerS(size: number, x: number, y: number, opts: SpriteOpts = {}) {
    const c = currentCase;
    return (c.ownerSprite && spriteImg(c.ownerSprite, "idle", x, y, opts))
      || sprite(c.owner.emoji, size, x, y, opts);
  }

  function setRoom(kind: "waiting" | "exam" | "office", sprites = "") {
    const decor = {
      waiting: `
        ${prop("🖼️", 34, 8, 22)} ${prop("🪟", 44, 30, 20)} ${prop("📋", 30, 50, 24)}
        ${prop("🚪", 56, 82, 16)}
        <div class="counter" style="left:3%;bottom:4%;width:24%;height:17%"></div>
        ${prop("🪴", 42, 3, 38)} ${prop("🪑", 36, 14, 56)} ${prop("🪑", 36, 24, 60)}
        <div class="rug"></div>`,
      exam: `
        ${prop("🦴", 30, 18, 24)} ${prop("📊", 32, 30, 20)} ${prop("🧪", 30, 48, 24)}
        ${prop("🚪", 56, 4, 16)} ${prop("💡", 34, 64, 12)}
        <div class="counter" style="right:2%;bottom:34%;width:18%;height:12%"></div>
        <div class="counter" style="left:35%;top:63%;width:26%;height:13%"></div>`,
      office: `
        ${prop("🖼️", 34, 12, 22)} ${prop("🪟", 44, 40, 20)} ${prop("📚", 34, 70, 26)}
        <div class="counter" style="left:6%;bottom:6%;width:26%;height:17%"></div>
        ${prop("🪴", 44, 82, 42)}
        <div class="rug"></div>`,
    }[kind] || "";
    $("room").innerHTML =
      `<div class="room-wall"></div><div class="room-floor"></div>${decor}${sprites}`;
  }

  function setRoomPage(html: string) {
    const page = el("div", "room-page", html);
    $("room").appendChild(page);
    return page;
  }

  /* ---------- current patient ---------- */
  let currentCase: Case = null as unknown as Case; // set by newCase() before any case screen
  let renderCurrent = () => showTitle();

  const STATUS_EMOJI: Record<string, string> = {
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
    const age = months < 12 ? `${months} mo` : `${Math.floor(months / 12)} yr`;
    const petVariants = SPECIES_SPRITES[species.id];
    currentCase = {
      owner: pick(OWNERS),
      petName: pick(PET_NAMES),
      species, ailment, gender, age,
      /* pixel sheet variants, chosen once so the pet/owner look stable all visit */
      petSprite: petVariants ? pick(petVariants) : null,
      ownerSprite: pick(HUMAN_SPRITES),
      asked: ailment.questions.map(() => false),
      doneTools: [],   // required tools completed
      triedTools: [],  // optional tools played
      rewarded: false, // checkout payout applied?
    };
  }

  const line = (s: string) => s.replaceAll("{pet}", currentCase.petName);
  const petEmoji = () => currentCase.species.emoji;
  /* what the chart calls the patient — pocket variants are real pokemon,
   * so a "gastly" case examining a gengar says Gengar */
  const petType = () => {
    const c = currentCase;
    return c.species.tags.includes("pocket") && c.petSprite
      ? c.petSprite.charAt(0).toUpperCase() + c.petSprite.slice(1)
      : c.species.label;
  };
  /* patient art for minigame stages: sprite at ~px tall, else emoji */
  const petArt = (px: number) =>
    (currentCase.petSprite && spriteInline(currentCase.petSprite, px)) || petEmoji();

  /* ---------- chart contents ---------- */
  function chartCase(opts: { checks?: boolean } = {}) {
    const c = currentCase;
    let h = `<h3>📋 CHART</h3>
      <div class="c-row">PATIENT <b>${c.petName}</b></div>
      <div class="c-row">TYPE <b>${petType()}</b></div>
      <div class="c-row">SEX <b>${c.gender.sign} ${c.gender.label}</b></div>
      <div class="c-row">AGE <b>${c.age}</b></div>
      <div class="c-row">OWNER <b>${c.owner.name}</b></div>
      <hr>SYMPTOMS`;
    const anyAsked = c.asked.some(Boolean);
    if (!anyAsked) h += `<div class="dim">ask questions...</div>`;
    c.ailment.questions.forEach((q, i) => {
      if (c.asked[i]) h += `<div class="sym">· ${q.symptom}</div>`;
    });
    if (opts.checks) {
      h += `<hr>CHECKS`;
      c.ailment.required.forEach(r => {
        const done = c.doneTools.includes(r.tool);
        h += done
          ? `<div class="chk done">✓ ${line(r.finding)}</div>`
          : `<div class="chk">? use a ▶ tool...</div>`;
      });
    }
    setChart(h);
  }

  function chartTotals() {
    setChart(`<h3>🏥 CLINIC</h3>
      <div class="c-row">SAVINGS <b>¥${save.yen.toLocaleString()}</b></div>
      <div class="c-row">HEALED <b>${save.healed}</b></div>
      <div class="c-row">CARDS <b>${save.cards.length}</b></div>
      <div class="c-row">GIFTS <b>${save.gifts.length}</b></div>
      <hr><div class="dim">Gifts from grateful pets appear in your item slots and on the office shelf.</div>`);
  }

  /* ---------- screens ---------- */

  function showTitle() {
    renderCurrent = showTitle;
    updateHud();
    setRoom("waiting", sprite("🧑‍⚕️", 52, 44, 52));
    chartTotals();
    setDialogue("Nyanwan Rx", save.healed
      ? `Welcome back, Doctor! ${save.healed} happy patients so far. Ready for more?`
      : "A tiny clinic is waiting for its doctor. That's you! Ring the bell to open up.");
    const items: MenuItem[] = [
      { label: "Open the Clinic", marked: true, onTap: () => { newCase(); showIntake(); } },
    ];
    if (save.cards.length) {
      items.push({ label: "Patient Cards", price: `${save.cards.length}`, onTap: showRolodex });
      items.push({ label: "My Office", price: `${save.gifts.length}🏆`, onTap: showOffice });
    }
    items.push({ note: "▶ marks what to do next. Tools cost yen — the owner pays the bill!" });
    setMenu("~ Front Desk ~", items);
  }

  function showIntake(entering = true) {
    renderCurrent = () => showIntake(false);
    updateHud();
    const c = currentCase;
    setRoom("waiting",
      ownerS(46, 30, 48, { enter: entering }) +
      petS(38, 42, 58, { enter: entering, status: STATUS_EMOJI[c.ailment.id] || "😢" }) +
      sprite("🧑‍⚕️", 52, 66, 44));
    chartCase();
    if (entering) {
      setDialogue(c.owner.name,
        `Hello, Doctor! I'm ${c.owner.name}, and this is ${c.petName}. ` + line(c.ailment.ownerLine));
    }
    /* ▶ guides to the first unasked question, then to the exam room */
    function renderMenu() {
      const next = c.asked.findIndex(v => !v);
      setMenu("~ Waiting Room ~", [
        ...c.ailment.questions.map((q, i): MenuItem => ({
          label: line(q.q),
          done: c.asked[i],
          marked: i === next,
          onTap: () => {
            if (!c.asked[i]) { c.asked[i] = true; Sound.good(); }
            setDialogue(c.owner.name, line(q.a));
            chartCase();
            renderMenu();
          },
        })),
        { label: "To the exam room!", marked: next === -1, onTap: showExam },
      ]);
    }
    renderMenu();
  }

  function showExam() {
    renderCurrent = showExam;
    updateHud();
    const c = currentCase;
    const cured = c.doneTools.length >= c.ailment.required.length;
    setRoom("exam",
      petS(44, 45, 55, { pose: cured ? "stretch" : "sit",
        status: cured ? "💖" : STATUS_EMOJI[c.ailment.id] || "😢" }) +
      sprite("🧑‍⚕️", 52, 66, 50));
    chartCase({ checks: true });

    if (cured) {
      setDialogue("You", `I know just what it is... ${c.petName} has ${c.ailment.diagnosis}! All patched up — let's get you back to ${c.owner.name}!`);
      setMenu("~ Exam Room ~", [
        { label: "All better! 🎉", marked: true, onTap: showCheckout },
        { note: "Diagnosis complete! Back to the waiting room." },
      ]);
      return;
    }

    setDialogue("You", `Okay ${c.petName}, up on the table. Let's see what's going on... (pick a ▶ tool!)`);
    const items = TOOLS.map((tool): MenuItem => {
      const needed = c.ailment.required.some(r => r.tool === tool.id) && !c.doneTools.includes(tool.id);
      const used = c.doneTools.includes(tool.id) || c.triedTools.includes(tool.id);
      return {
        label: `${tool.emoji} ${tool.label}`,
        price: `${tool.fee}`,
        marked: needed,
        done: used,
        onTap: async () => {
          await Minigames.play(tool, { petArt });
          const req = c.ailment.required.find(r => r.tool === tool.id);
          if (req && !c.doneTools.includes(tool.id)) {
            c.doneTools.push(tool.id);
            setDialogue("You", line(req.finding));
          } else {
            if (!req && !c.triedTools.includes(tool.id)) c.triedTools.push(tool.id);
            setDialogue("You", tool.okLine);
          }
          showExam();
        },
      };
    });
    setMenu("~ Exam Room ~", items);
  }

  function showCheckout() {
    renderCurrent = showCheckout;
    const c = currentCase;

    /* compute + apply rewards exactly once */
    if (!c.rewarded) {
      c.rewarded = true;
      const base = randInt(c.ailment.pay[0] / 100, c.ailment.pay[1] / 100) * 100;
      const extras = [...c.doneTools, ...c.triedTools]
        .reduce((sum, id) => sum + (TOOLS.find(t => t.id === id)?.fee || 0), 0);
      c.pay = base + extras;
      c.gift = Math.random() < 0.3 ? pick(GIFTS) : null;
      c.card = {
        petName: c.petName, species: petType(), emoji: c.species.emoji,
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
    updateHud();

    setRoom("waiting",
      ownerS(46, 32, 48) +
      petS(38, 44, 58, { pose: "run", status: "💖" }) +
      sprite("🧑‍⚕️", 52, 66, 44));
    chartCase({ checks: true });
    setDialogue(c.owner.name, line(pick(THANK_YOUS)) + ` (pays you ¥${c.pay!.toLocaleString()})`);

    const afterCard = () => setMenu("~ Front Desk ~", [
      { label: "Next patient!", marked: true, onTap: () => { newCase(); showIntake(); } },
      { label: "Patient Cards", price: `${save.cards.length}`, onTap: showRolodex },
      { label: "Close the clinic", onTap: showTitle },
    ]);

    setMenu("~ Front Desk ~", [
      { label: "Collect payment", price: `${c.pay}`, marked: true,
        onTap: () => { showCardCeremony(c, afterCard); } },
      { note: `Visit fee ¥${c.pay!.toLocaleString()} — includes every tool you used!` },
    ]);
  }

  /* card (+ maybe gift) presented in a modal, RCR-panel styled */
  function showCardCeremony(c: Case, onClose: () => void) {
    const modal = $("modal"), content = $("modal-content");
    content.innerHTML = "";
    content.appendChild(el("h2", "", "★ NEW PATIENT CARD ★"));
    content.appendChild(cardScene(c.card!));
    content.appendChild(el("div", "flip-hint", "tap the card to flip it over!"));
    content.appendChild(el("div", "pay-line", `+¥${c.pay!.toLocaleString()}`));
    if (c.gift) {
      content.appendChild(el("div", "gem-gift",
        `<span class="g">${c.gift.emoji}</span>${c.petName} left you a ${c.gift.label}!<br>It's in your item slots + office shelf!`));
    }
    const ok = el("button", "menu-item marked");
    ok.appendChild(el("span", "mi-label", "File it in the Rolodex"));
    ok.addEventListener("click", () => { modal.classList.add("hidden"); onClose(); });
    content.appendChild(ok);
    modal.classList.remove("hidden");
    updateHud();
  }

  /* ---------- trading cards ---------- */
  function cardScene(card: Card) {
    const scene = el("div", "card-scene");
    const t = el("div", "tcard" + (card.fancy ? " fancy" : ""));
    const front = el("div", "face front",
      `<div class="portrait-lg">${card.emoji}</div>` +
      `<div class="pet-name">${card.petName} 💖</div>` +
      `<div class="sub">${card.species}</div>` +
      `<div class="sub">NYANWAN RX ・ HAPPY & HEALTHY</div>`);
    const back = el("div", "face back",
      `<div class="pet-name">${card.petName}</div>` +
      `<div class="stat">TYPE ・ ${card.species}</div>` +
      `<div class="stat">SEX ・ ${card.sign} ${card.gender}</div>` +
      `<div class="stat">AGE ・ ${card.age}</div>` +
      `<div class="stat">OWNER ・ ${card.owner}</div>` +
      `<div class="stat">HAD ・ ${card.diagnosis}</div>` +
      `<div class="stat">HEALED ・ ${card.date}</div>` +
      `<div class="stat">FEE ・ ¥${card.fee.toLocaleString()}</div>`);
    t.append(front, back);
    t.addEventListener("click", () => { t.classList.toggle("flipped"); Sound.tap(); });
    scene.appendChild(t);
    return scene;
  }

  function showRolodex() {
    updateHud();
    setRoom("office");
    chartTotals();
    setDialogue("Rolodex", save.cards.length
      ? `Every pet you ever healed — all ${save.cards.length} of them. Tap a card to flip it!`
      : "No cards yet! Heal your first patient to start the collection.");
    const page = setRoomPage(`<h2>📇 PATIENT ROLODEX</h2>`);
    [...save.cards].reverse().forEach(card => page.appendChild(cardScene(card)));
    setMenu("~ Records ~", [
      { label: "Back", marked: true, onTap: () => renderCurrent() },
    ]);
  }

  function showOffice() {
    updateHud();
    const shelfItems = save.gifts.map(g => `<span title="${g.label}">${g.emoji}</span>`).join("");
    setRoom("office",
      `<div class="shelfcase" style="left:20%;top:16%;width:60%;height:26%">${shelfItems}</div>` +
      sprite("🧑‍⚕️", 52, 46, 52));
    chartTotals();
    setDialogue("Your Office", save.gifts.length
      ? `${save.gifts.length} thank-you gift${save.gifts.length > 1 ? "s" : ""} from grateful pets, on display forever.`
      : "Your trophy shelf is empty for now... some pets leave a thank-you gift!");
    setMenu("~ Office ~", [
      { label: "Back", marked: true, onTap: () => renderCurrent() },
    ]);
  }

  showTitle();
}
