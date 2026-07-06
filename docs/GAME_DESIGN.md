# Nyanwan Rx — Game Design Document

*A cozy vet-clinic game that grows up with its player.*

## 1. Vision

You run a tiny animal clinic. Every session is a parade of adorable
patients: real animals, fantasy creatures, and pocket monsters. The joy
comes from three loops layered on top of each other:

1. **Moment-to-moment:** tactile, forgiving mini-games (tap the
   heartbeat, wrap the bandage, find the bone in the X-ray).
2. **Per-patient:** a little story — meet the owner, hear the problem,
   investigate, cure, get thanked and paid.
3. **Long-term:** collection and memory — a rolodex of trading cards for
   every pet ever healed, a shelf of gems and trophies grateful pets left
   behind, and a growing pile of yen.

**Primary player:** a 5-year-old who can't read yet (a grown-up voices
the dialogue). **Design constraint #1:** she must be able to navigate the
whole loop by herself. **Design constraint #2:** the same game must have
room to get deeper for a 7- and 9-year-old without a rewrite.

### 1.1 Presentation

A retro pixel homage to River City Ransom's shop screens. The screen is a
fixed frame and every scene fills the same five regions:

- **Top HUD:** doctor portrait, decorative energy bars, five item slots
  (they show the most recent thank-you gifts), yen total, pets-healed
  count, and a ticking wall clock.
- **Left panel:** the patient chart — pet stats, symptom list, and the
  exam checklist.
- **Center:** the angled clinic room (waiting room / exam room / office),
  drawn with CSS-and-emoji placeholder art to be swapped for real pixel
  sprites later. Characters walk in from the right.
- **Right panel:** the location-titled choice menu with a price column
  (questions are free; tools list the yen they add to the visit bill).
  A blinking ▶ always marks the suggested next choice — that's how a
  pre-reader navigates.
- **Bottom:** the `NAME: dialogue` bar with a typewriter effect — the
  text a grown-up reads aloud.

## 2. The core loop

```
 WAITING ROOM ──► QUESTIONS ──► EXAM ROOM ──► CURED! ──► CHECKOUT ─┐
      ▲            (chart fills   (tools =      (diagnosis  (yen +   │
      │             with          mini-games,    revealed)   card +  │
      │             symptoms)     chart checks)              gem?)   │
      └────────────────────────── next patient ◄────────────────────┘
```

### 2.1 Waiting room (intake)

- Owner + pet slide in. A patient banner shows: **owner name, pet name,
  species, gender, age** — the "all that" stats.
- Owner speech bubble describes the ailment in kid-friendly words
  ("Mochi keeps holding up her paw and won't chase her ball!").
- One big pulsing button: **Ask some questions 💬**.

### 2.2 Follow-up questions

- 3 question buttons per case (e.g. "Did she eat anything unusual?",
  "When did it start?", "Does it hurt when you touch it?").
- Each answer adds a **symptom chip** to the chart with a sparkle.
- Questions are optional-but-encouraged at age 5 (the Next button never
  locks). At older tiers, asking the right questions is what narrows the
  diagnosis (see §7).
- Big button: **To the exam room! 🚪**

### 2.3 Exam room

- Pet sits on the exam table (worried face). The **chart** shows the
  symptom chips plus a checklist of needed checks (shown as ❓ until
  discovered by using tools).
- **Tool palette** — every tool launches a mini-game:

| Tool | Mini-game | Input skill |
|---|---|---|
| 🩺 Stethoscope | Tap the heart when it beats big | Timing |
| 🌡️ Thermometer | Hold to fill, release in the green zone | Hold & release |
| 🔦 Otoscope/light | Find and tap the sparkly spot | Search & tap |
| ☢️ X-ray | Spot the bone/bump in the scan | Search & tap |
| 💊 Medicine mixer | Repeat the 3-bottle color pattern | Memory (Simon) |
| 💉 Vitamin shot | Stop the slider in the green zone | Timing |
| 🩹 Bandage | Tap-tap-tap to wrap it up | Mashing |
| 🛁 Bubble bath | Pop all the bubbles on the pet | Multi-tap |
| ✨ Magic wand | Catch the drifting stars | Tracking & tap |

- Each case requires 2–3 specific tools; completing one ticks the chart
  and reveals a **finding** ("The X-ray shows a tiny bump on her paw!").
  Using a non-required tool is never punished — it plays the game and
  reports "Everything looks great there!" (free play is a feature; 5-year-
  olds will want to use every tool on every pet, and that's fine).
- All required checks done → **diagnosis banner** ("It's a Pebble Paw!")
  → pet turns happy → big **All better! 🎉** button.

### 2.4 Checkout

- Owner thanks you by name and pays in yen with a coin count-up
  animation (¥400–¥1500 depending on case).
- **Trading card ceremony:** the card slides in, front = happy pet
  portrait; tap to flip → back = full stats (name, species, gender, age,
  owner, diagnosis, treatment date, fee). Card is filed in the Rolodex.
- **~30% chance:** the pet leaves a **gem or trophy** (💎 🏆 🔮 👑 🌸 …)
  that appears on your office shelf permanently.
- Buttons: **Next patient ➡️** / **Close the clinic 🌙** (back to title).

## 3. Content systems (data-driven, easy to grow)

All content lives in `js/data.js` as plain arrays — adding an animal, an
ailment, or a name is one entry, no code.

### 3.1 Species roster

Species carry **tags** that gate which ailments they can have:

- `furry` (shedding, fleas, bath cases), `winged` (wing sprain),
  `scaly`, `aquatic`, `fantasy` (magic-based cures), `electric`
  (static overload), `fire` (overheating dragons), `tiny`, `pocket`.
- Launch roster ≈ 30: dogs, cats, rabbits, hamsters, birds, turtles,
  lizards, ponies, foxes, pandas, penguins, hedgehogs… plus fantasy
  (dragon hatchling, unicorn foal, ghost kitten, robo-pup, star bunny,
  baby kraken) plus a handful of pocket monsters.
- **Growth path:** rare species (low spawn weight) → rarer cards →
  collection goals ("heal one of every species").

### 3.2 Ailment catalog

Each ailment defines: owner's description line, 3 follow-up Q&As (answer
→ symptom chip), required tools with finding lines, diagnosis name, fee
range, and species tags. Launch set ≈ 15 (tummy ache, sniffles, hurt paw,
ear tickles, itchy fur, sleepy slump, scratchy throat, hiccups, wing
sprain, lost sparkle, overheated, static overload, muddy mess, toothache,
bumpy bruise). Diagnoses have silly-official names ("Wigglebelly",
"Sparkle Deficiency") because kids love saying them.

### 3.3 Economy

- **Now:** yen is a pure score that goes up. Watching the number grow is
  the whole reward. Every tool used during a visit adds its listed fee to
  the bill (X-ray ¥800, thermometer ¥200…), so playing with extra tools
  earns a little extra — curiosity is never punished, it's paid.
- **Tier 2+:** a shop. Spend yen on office decorations, waiting-room
  toys (change patient mix), new tools, clinic upgrades (second exam
  room). Gems/trophies stay unbuyable — only gifts.

### 3.4 Collection

- **Rolodex 📇:** every healed pet becomes a card, browsable forever,
  flippable for stats. This is the clinic's memory — "remember when we
  healed the dragon with hiccups?"
- **Card polish later:** holo frames for fantasy/pocket species, a
  "healed 3 times" stamp for repeat patients, duplicate patients
  returning by name with a new ailment.
- **Trophy shelf 🏆:** gems render on a shelf in the office view; purely
  cosmetic, permanent, and extremely motivating.

## 4. No-fail philosophy (age 5)

- Mini-games cannot be failed, only *not finished yet*. Misses get a
  gentle "almost!" and the game continues. Success always ends in
  ⭐⭐⭐ + cheers.
- Exactly one pulsing "what's next" button per screen; a pre-reader can
  drive the whole loop by following the pulse.
- No timers, no game-over, no losing money, nothing scary — sick pets
  look *worried*, never gory, and every visit ends happy.

## 5. Audio

Tiny synthesized WebAudio chirps (no audio files): pop, ding, success
arpeggio, coin jingle. Muted until first tap (browser rule) and easy to
extend with real sounds later.

## 6. Tech

- Vanilla HTML/CSS/JS, zero dependencies, zero build. Works from
  `file://` or any static server; touch-first layout for tablets.
- `js/data.js` (content) / `js/minigames.js` (the 7 mini-game engines) /
  `js/game.js` (screens + state machine). Save = one `localStorage` key.

## 7. Growing up with the player (difficulty tiers)

The same content, deeper rules. A settings toggle, not a sequel.

**🌱 Sprout (age ~5) — ships now**
- Everything above: no fail, chart shows exactly which tools are needed,
  all questions optional, one pulsing path forward.

**🌷 Bloom (age ~7)**
- Chart shows symptoms only; the player *chooses* which tools make sense
  (wrong tool = "hmm, that looks fine" — mild info cost, no punishment).
- Player picks the diagnosis from 3 choices after gathering findings.
- Mini-games get a speed notch and a 1–3 star rating that scales the fee.
- Reading her own dialogue; shop unlocks for spending yen.

**🌳 Doctor (age ~9)**
- Questions cost time-of-day; only ~4 of 8 patients fit in a clinic day.
- Overlapping symptom sets: real differential diagnosis (tummy ache vs.
  wigglebelly share 2 of 3 symptoms; only the thermometer separates
  them). Misdiagnosis = pet comes back tomorrow, half fee.
- Clinic management: buy equipment, hire an assistant, reputation stars
  attract rare species.

## 8. Roadmap

1. ✅ Playable Sprout-tier prototype (this repo).
2. Sound/visual juice pass: pet idle animations, confetti, coin shower.
3. More content: 30 more ailments, seasonal patients (festival week!).
4. Repeat patients & card upgrades.
5. Bloom tier + shop.
6. Doctor tier + clinic days.
