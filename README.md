# 🐾 Nyanwan Rx（にゃんワンRx）

A cozy veterinary clinic game for kids. You are the vet! Patients bring in
their pets, you ask questions, examine them with your tools (each tool is a
little mini-game), fix them up, get paid in yen, and collect a trading card
of every pet you've ever healed.

Built to be playable by a 5-year-old (a grown-up reads the dialogue out
loud), with a design that grows in complexity as the player grows up — see
[docs/GAME_DESIGN.md](docs/GAME_DESIGN.md).

## How to play

No build step, no install. It's plain HTML/CSS/JS:

- **Easiest:** open `index.html` in any browser (double-click it).
- **Or serve it:** `python3 -m http.server` in this folder, then visit
  `http://localhost:8000`. This also works great on an iPad on the same
  Wi-Fi (visit `http://<your-computer-ip>:8000`).

Progress (yen, trading cards, gems and trophies) is saved automatically in
the browser via `localStorage`.

## The loop

1. **Waiting room** — an owner walks in with their pet (name, species,
   gender, age) and describes what's wrong.
2. **Questions** — choose follow-up questions; each answer adds a symptom
   to the pet's chart.
3. **Exam room** — pick tools from your palette. Every tool is a
   mini-game (timing taps, hold-and-release, find-the-spot, repeat the
   pattern, tap-to-wrap, stop-the-slider, pop the bubbles…). The chart
   tells you which checks the pet still needs.
4. **Diagnosis & cure** — complete the needed checks and the pet is all
   better!
5. **Checkout** — the owner pays you in yen 💴, you get a **trading card**
   of the happy pet (tap to flip it for their stats), and sometimes the
   pet leaves you a **gem or trophy** that decorates your office forever.
6. **Rolodex** 📇 — browse every card you've ever earned and remember all
   the pets you treated.

## Kid-friendly by design

- There is **no way to lose**. Mini-games are forgiving and just keep
  going until you succeed, with cheers at the end.
- One big pulsing button always shows what to do next, so a
  pre-reader can navigate alone.
- All art is emoji: huge, colorful, and touch-friendly.

## Note on Pokémon

A few Pocket-Monster-style creatures appear in the species roster because
a certain 5-year-old demands them. This is a personal, non-commercial
family project; swap them out in `js/data.js` if you ever share this more
widely.
