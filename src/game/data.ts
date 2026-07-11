/* ============ Nyanwan Rx — game content ============
   Everything here is plain data. To add an animal, an ailment,
   or a name, just add an entry — no other code changes needed. */

export const SPECIES = [
  // --- real animals ---
  { id: "dog",      label: "Puppy",          emoji: "🐕", tags: ["furry"] },
  { id: "cat",      label: "Kitten",         emoji: "🐈", tags: ["furry"] },
  { id: "rabbit",   label: "Bunny",          emoji: "🐇", tags: ["furry", "tiny"] },
  { id: "hamster",  label: "Hamster",        emoji: "🐹", tags: ["furry", "tiny"] },
  { id: "bird",     label: "Songbird",       emoji: "🐦", tags: ["winged", "tiny"] },
  { id: "parrot",   label: "Parrot",         emoji: "🦜", tags: ["winged"] },
  { id: "owl",      label: "Owl",            emoji: "🦉", tags: ["winged"] },
  { id: "duck",     label: "Duckling",       emoji: "🦆", tags: ["winged"] },
  { id: "penguin",  label: "Penguin",        emoji: "🐧", tags: ["winged"] },
  { id: "turtle",   label: "Turtle",         emoji: "🐢", tags: ["scaly"] },
  { id: "lizard",   label: "Gecko",          emoji: "🦎", tags: ["scaly", "tiny"] },
  { id: "frog",     label: "Frog",           emoji: "🐸", tags: ["tiny"] },
  { id: "fish",     label: "Goldfish",       emoji: "🐠", tags: ["aquatic", "tiny"] },
  { id: "pony",     label: "Pony",           emoji: "🐴", tags: ["furry"] },
  { id: "pig",      label: "Mini Pig",       emoji: "🐖", tags: ["furry"] },
  { id: "goat",     label: "Baby Goat",      emoji: "🐐", tags: ["furry"] },
  { id: "hedgehog", label: "Hedgehog",       emoji: "🦔", tags: ["tiny"] },
  { id: "fox",      label: "Fox Kit",        emoji: "🦊", tags: ["furry"] },
  { id: "panda",    label: "Panda Cub",      emoji: "🐼", tags: ["furry"] },
  { id: "koala",    label: "Koala",          emoji: "🐨", tags: ["furry"] },
  { id: "monkey",   label: "Monkey",         emoji: "🐒", tags: ["furry"] },
  { id: "chicken",  label: "Chicken",        emoji: "🐔", tags: ["winged"] },
  { id: "cow",      label: "Baby Cow",       emoji: "🐄", tags: ["furry"] },
  { id: "donkey",   label: "Little Donkey",  emoji: "🫏", tags: ["furry"] },
  { id: "lion",     label: "Lion Cub",       emoji: "🦁", tags: ["furry"] },
  { id: "raccoon",  label: "Raccoon",        emoji: "🦝", tags: ["furry"] },
  { id: "boar",     label: "Wild Boar",      emoji: "🐗", tags: ["furry"] },
  // --- unusual patients (have pixel sprites!) ---
  { id: "bat",      label: "Bat Pup",        emoji: "🦇", tags: ["winged", "tiny"] },
  { id: "rat",      label: "Fancy Rat",      emoji: "🐀", tags: ["furry", "tiny"] },
  { id: "hyena",    label: "Hyena Cub",      emoji: "🐺", tags: ["furry"] },
  { id: "scorpion", label: "Scorpion",       emoji: "🦂", tags: ["scaly", "tiny"] },
  { id: "snake",    label: "Noodle Snake",   emoji: "🐍", tags: ["scaly"] },
  { id: "vulture",  label: "Vulture Chick",  emoji: "🦅", tags: ["winged"] },
  // --- fantasy friends ---
  { id: "dragon",   label: "Dragon Hatchling", emoji: "🐉", tags: ["fantasy", "scaly", "winged", "fire"] },
  { id: "unicorn",  label: "Unicorn Foal",     emoji: "🦄", tags: ["fantasy", "furry"] },
  { id: "ghostcat", label: "Ghost Kitten",     emoji: "👻", tags: ["fantasy"] },
  { id: "robopup",  label: "Robo-Pup",         emoji: "🤖", tags: ["fantasy", "electric"] },
  { id: "starbun",  label: "Star Bunny",       emoji: "⭐", tags: ["fantasy", "tiny"] },
  { id: "kraken",   label: "Baby Kraken",      emoji: "🐙", tags: ["fantasy", "aquatic"] },
  // --- pocket monsters (personal family project!) ---
  // a species is an evolution line named for its base stage; the sprite
  // variant decides which stage walks in, and the chart names that stage
  { id: "pikachu",    label: "Pikachu",    emoji: "⚡🐭", tags: ["pocket", "furry", "electric"] },
  { id: "eevee",      label: "Eevee",      emoji: "🦊✨", tags: ["pocket", "furry"] },
  { id: "charmander", label: "Charmander", emoji: "🦎🔥", tags: ["pocket", "scaly", "fire"] },
  { id: "squirtle",   label: "Squirtle",   emoji: "🐢💧", tags: ["pocket", "scaly", "aquatic"] },
  { id: "jigglypuff", label: "Jigglypuff", emoji: "🎀🎈", tags: ["pocket", "tiny"] },
  { id: "snivy",      label: "Snivy",      emoji: "🐍🌿", tags: ["pocket", "scaly"] },
  { id: "oshawott",   label: "Oshawott",   emoji: "🦦💧", tags: ["pocket", "furry", "aquatic"] },
  { id: "bidoof",     label: "Bidoof",     emoji: "🦫",   tags: ["pocket", "furry"] },
  { id: "bulbasaur",  label: "Bulbasaur",  emoji: "🐸🌱", tags: ["pocket", "scaly"] },
  { id: "cleffa",     label: "Cleffa",     emoji: "⭐🌙", tags: ["pocket", "tiny", "fantasy"] },
  { id: "ditto",      label: "Ditto",      emoji: "🟣😊", tags: ["pocket", "tiny", "fantasy"] },
  { id: "gastly",     label: "Gastly",     emoji: "👻💜", tags: ["pocket", "fantasy"] },
  { id: "geodude",    label: "Geodude",    emoji: "🪨💪", tags: ["pocket", "scaly"] },
  { id: "gible",      label: "Gible",      emoji: "🦈⛰️", tags: ["pocket", "scaly"] },
  { id: "girafarig",  label: "Girafarig",  emoji: "🦒✨", tags: ["pocket", "furry"] },
  { id: "happiny",    label: "Happiny",    emoji: "🥚💗", tags: ["pocket", "tiny"] },
  { id: "hoothoot",   label: "Hoothoot",   emoji: "🦉🕐", tags: ["pocket", "winged"] },
  { id: "hoppip",     label: "Hoppip",     emoji: "🌸🍃", tags: ["pocket", "winged", "tiny"] },
  { id: "horsea",     label: "Horsea",     emoji: "🌊🐴", tags: ["pocket", "aquatic", "scaly"] },
  { id: "kabuto",     label: "Kabuto",     emoji: "🦀🛡️", tags: ["pocket", "scaly", "tiny"] },
  { id: "koffing",    label: "Koffing",    emoji: "☁️💨", tags: ["pocket", "fantasy"] },
  { id: "krabby",     label: "Krabby",     emoji: "🦀🫧", tags: ["pocket", "aquatic", "scaly"] },
  { id: "lapras",     label: "Lapras",     emoji: "🦕🌊", tags: ["pocket", "aquatic", "scaly"] },
  { id: "lotad",      label: "Lotad",      emoji: "🪷💧", tags: ["pocket", "aquatic", "tiny"] },
  { id: "makuhita",   label: "Makuhita",   emoji: "👊💪", tags: ["pocket", "furry"] },
  { id: "mankey",     label: "Mankey",     emoji: "🐒💢", tags: ["pocket", "furry"] },
  { id: "mantyke",    label: "Mantyke",    emoji: "🐟🌊", tags: ["pocket", "aquatic", "winged"] },
  { id: "moltres",    label: "Moltres",    emoji: "🔥🦅", tags: ["pocket", "winged", "fire"] },
  { id: "mudkip",     label: "Mudkip",     emoji: "💧🐸", tags: ["pocket", "aquatic"] },
  { id: "natu",       label: "Natu",       emoji: "🐦🔮", tags: ["pocket", "winged", "tiny"] },
];

export const OWNERS = [
  { name: "Yuki",   emoji: "👧" }, { name: "Kenta",  emoji: "👦" },
  { name: "Hana",   emoji: "👩" }, { name: "Sora",   emoji: "🧑" },
  { name: "Sakura", emoji: "👩‍🦰" }, { name: "Riko",   emoji: "👧🏽" },
  { name: "Ren",    emoji: "👦🏻" }, { name: "Mei",    emoji: "👵" },
  { name: "Taiga",  emoji: "👴" }, { name: "Aiko",   emoji: "👩🏻" },
  { name: "Emma",   emoji: "👱‍♀️" }, { name: "Leo",    emoji: "🧒" },
  { name: "Momoka", emoji: "👩‍🦱" }, { name: "Daichi", emoji: "🧔" },
];

export const PET_NAMES = [
  "Mochi", "Momo", "Taro", "Luna", "Kuro", "Shiro", "Azuki", "Choco",
  "Pudding", "Nori", "Sushi", "Biscuit", "Poppy", "Peanut", "Maple",
  "Coco", "Yuzu", "Hoshi", "Sora", "Bubbles", "Waffle", "Ume", "Kiki",
  "Pom", "Dango", "Melon", "Tofu", "Ginger", "Snowy", "Pochi",
];

/* Tools. Each launches the mini-game named in `game` (see minigames.js).
   `fee` is what the tool adds to the visit bill — every tool you use
   earns a little more yen at checkout. */
export const TOOLS = [
  { id: "steth",   label: "Stethoscope", emoji: "🩺", game: "heartbeat", fee: 300,
    okLine: "Their heartbeat sounds strong and happy!" },
  { id: "thermo",  label: "Thermometer", emoji: "🌡️", game: "hold", fee: 200,
    okLine: "Temperature is just right!" },
  { id: "light",   label: "Ear Light",   emoji: "🔦", game: "spot", fee: 250,
    okLine: "Ears look clean and cozy!" },
  { id: "xray",    label: "X-ray",       emoji: "☢️", game: "xray", fee: 800,
    okLine: "All the bones look great!" },
  { id: "meds",    label: "Medicine",    emoji: "💊", game: "simon", fee: 400,
    okLine: "A tasty vitamin, just in case!" },
  { id: "shot",    label: "Vitamin Shot", emoji: "💉", game: "slider", fee: 350,
    okLine: "A tiny boost of energy — barely a pinch!" },
  { id: "bandage", label: "Bandage",     emoji: "🩹", game: "mash", fee: 300,
    okLine: "A comfy little wrap, good as new!" },
  { id: "tweeze",  label: "Tweezers",    emoji: "🥢", game: "splinters", fee: 350,
    okLine: "No prickles anywhere — smooth and comfy!" },
  { id: "bath",    label: "Bubble Bath", emoji: "🛁", game: "bubbles", fee: 500,
    okLine: "So fresh and so clean!" },
  { id: "magic",   label: "Magic Wand",  emoji: "✨", game: "stars", fee: 900,
    okLine: "A sprinkle of sparkles for good luck!" },
];

/* Ailments.
   tags: which species can have it ("any" = everyone).
   questions: follow-ups; each answer adds a symptom chip to the chart.
   required: tools that cure it, each with the finding it reveals.  */
export const AILMENTS = [
  {
    id: "tummy", diagnosis: "the Wigglebelly", tags: ["any"], pay: [500, 900],
    ownerLine: "{pet} has a sore tummy and keeps rolling around groaning!",
    questions: [
      { q: "Did {pet} eat anything unusual?", a: "Well... {pet} did sneak a whole bag of treats yesterday.", symptom: "Ate too many treats" },
      { q: "Is {pet} still drinking water?", a: "Only little sips. Less than usual.", symptom: "Not drinking much" },
      { q: "When did the tummy ache start?", a: "Last night, right after dinner.", symptom: "Started after dinner" },
    ],
    required: [
      { tool: "steth", finding: "The tummy is making funny gurgle-gurgle sounds!" },
      { tool: "meds",  finding: "A gentle tummy-soother medicine mixes up perfectly." },
    ],
  },
  {
    id: "sniffles", diagnosis: "a case of the Sneezies", tags: ["any"], pay: [400, 800],
    ownerLine: "{pet} won't stop sneezing! Achoo, achoo, achoo, all day long!",
    questions: [
      { q: "Does {pet} feel warm?", a: "A little warm on the ears, yes.", symptom: "Warm ears" },
      { q: "Is {pet} sleeping okay?", a: "The sneezes keep waking {pet} up!", symptom: "Can't sleep" },
      { q: "Runny nose too?", a: "Yes, we've used a whole box of tissues.", symptom: "Runny nose" },
    ],
    required: [
      { tool: "thermo", finding: "A teeny tiny fever — just a smidge too warm." },
      { tool: "meds",   finding: "Cherry-flavored sniffle syrup, coming right up!" },
    ],
  },
  {
    id: "paw", diagnosis: "a Pebble Paw", tags: ["furry", "scaly", "tiny", "pocket"], pay: [700, 1200],
    ownerLine: "{pet} keeps holding up one paw and won't run and play!",
    questions: [
      { q: "Did {pet} step on something?", a: "Maybe! We were playing in the garden by the rocks.", symptom: "Played near rocks" },
      { q: "Does it hurt when you touch it?", a: "{pet} says 'ouch!' and pulls the paw away.", symptom: "Paw is tender" },
      { q: "Can {pet} still walk?", a: "Only on three legs, hop hop hop.", symptom: "Hopping on 3 legs" },
    ],
    required: [
      { tool: "xray",    finding: "The X-ray shows a tiny pebble stuck in the paw pad!" },
      { tool: "bandage", finding: "Pebble out! A soft bandage makes it all comfy." },
    ],
  },
  {
    id: "ear", diagnosis: "the Ear Tickles", tags: ["furry", "pocket"], pay: [500, 900],
    ownerLine: "{pet} keeps shaking and scratching at one ear, like something is tickling inside!",
    questions: [
      { q: "Which ear is it?", a: "The left one — see how it flops?", symptom: "Floppy left ear" },
      { q: "Has {pet} been rolling in the grass?", a: "All afternoon yesterday!", symptom: "Rolled in grass" },
      { q: "Is {pet} shaking their head?", a: "Shake shake shake, all the time!", symptom: "Head shaking" },
    ],
    required: [
      { tool: "light", finding: "There it is — a teeny ticklish grass seed in the ear!" },
      { tool: "meds",  finding: "Soothing ear drops to make the tickles go away." },
    ],
  },
  {
    id: "itchy", diagnosis: "the Itchy-Scritchies", tags: ["furry"], pay: [600, 1000],
    ownerLine: "{pet} is scratching and scratching! Scritch scritch scritch, all day!",
    questions: [
      { q: "Where does {pet} scratch most?", a: "Right behind the ears and on the back.", symptom: "Itchy back & ears" },
      { q: "Any new places {pet} has visited?", a: "The muddy dog park last weekend.", symptom: "Visited the park" },
      { q: "Is the fur falling out?", a: "A few fluffy patches, yes.", symptom: "Patchy fur" },
    ],
    required: [
      { tool: "light", finding: "A family of tiny itch-bugs is camping in the fur!" },
      { tool: "bath",  finding: "The bubble bath washes every last itch-bug away!" },
    ],
  },
  {
    id: "sleepy", diagnosis: "the Sleepy Slumps", tags: ["any"], pay: [500, 900],
    ownerLine: "{pet} is sooo tired. No zoomies, no playing — just flop, all day.",
    questions: [
      { q: "Is {pet} eating well?", a: "Barely nibbling at breakfast.", symptom: "Small appetite" },
      { q: "How long has {pet} been sleepy?", a: "Three whole days now.", symptom: "Sleepy for 3 days" },
      { q: "Any zoomies at all?", a: "Not one single zoomie. It's very strange.", symptom: "Zero zoomies" },
    ],
    required: [
      { tool: "steth", finding: "The heartbeat is a little slow and snoozy." },
      { tool: "shot",  finding: "One vitamin boost, and the energy comes zooming back!" },
    ],
  },
  {
    id: "throat", diagnosis: "a Froggy Throat", tags: ["any"], pay: [400, 800],
    ownerLine: "{pet}'s voice went funny! Every meow, bark and chirp comes out all croaky.",
    questions: [
      { q: "Has {pet} been extra noisy lately?", a: "{pet} sang at the moon all night on Tuesday!", symptom: "Sang all night" },
      { q: "Is it hard for {pet} to swallow?", a: "Dinner takes twice as long as usual.", symptom: "Slow swallowing" },
      { q: "Any coughing?", a: "Little cough-coughs in the morning.", symptom: "Morning coughs" },
    ],
    required: [
      { tool: "light", finding: "Say ahh! The throat is a little red and scratchy in there." },
      { tool: "meds",  finding: "Honey-lemon soothing syrup — the croaks melt away." },
    ],
  },
  {
    id: "hiccups", diagnosis: "the Bouncy Hiccups", tags: ["any"], pay: [400, 700],
    ownerLine: "{pet} has had the hiccups since breakfast! Hic! Hic! Hic! We can't make them stop!",
    questions: [
      { q: "Did {pet} eat breakfast too fast?", a: "Gobbled it in ten seconds flat!", symptom: "Ate too fast" },
      { q: "How big are the hiccups?", a: "So big {pet} bounces right off the floor!", symptom: "Bouncing hiccups" },
      { q: "Did you try a big glass of water?", a: "We tried! It only made bubbly hiccups.", symptom: "Water didn't help" },
    ],
    required: [
      { tool: "steth", finding: "Yep — the tummy is bouncing like a trampoline in there!" },
      { tool: "meds",  finding: "One fizzy anti-hiccup drop... and... all quiet!" },
    ],
  },
  {
    id: "wing", diagnosis: "a Sprained Wing-Wing", tags: ["winged"], pay: [800, 1300],
    ownerLine: "{pet} tried a fancy loop-de-loop and now one wing droops down low.",
    questions: [
      { q: "Can {pet} still fly?", a: "Only in wobbly little circles.", symptom: "Wobbly flying" },
      { q: "Which wing droops?", a: "The right one, see how it hangs?", symptom: "Droopy right wing" },
      { q: "Where did it happen?", a: "Showing off for the pigeons at the park.", symptom: "Loop-de-loop accident" },
    ],
    required: [
      { tool: "xray",    finding: "Good news — nothing broken! Just a stretched wing muscle." },
      { tool: "bandage", finding: "A snug wing-wrap so it can rest and heal." },
    ],
  },
  {
    id: "sparkle", diagnosis: "Sparkle Deficiency", tags: ["fantasy"], pay: [900, 1500],
    ownerLine: "{pet} has lost their sparkle! Usually {pet} glitters and glows, but today... nothing.",
    questions: [
      { q: "When did the sparkle fade?", a: "It's been dimming since the last full moon.", symptom: "Fading since full moon" },
      { q: "Has {pet} been eating stardust?", a: "{pet} has been refusing stardust snacks!", symptom: "No stardust snacks" },
      { q: "Any glow at all?", a: "Just a tiny flicker when {pet} sneezes.", symptom: "Only flickers" },
    ],
    required: [
      { tool: "magic", finding: "The wand hums — the sparkle circuits just need recharging!" },
      { tool: "meds",  finding: "Glitterberry tonic: the official sparkle refill." },
    ],
  },
  {
    id: "overheat", diagnosis: "the Toasty Torch Tummy", tags: ["fire"], pay: [900, 1500],
    ownerLine: "{pet} is TOO hot! Little puffs of smoke keep coming out with every burp!",
    questions: [
      { q: "Has {pet} been breathing extra fire?", a: "{pet} showed off at the birthday party — lit ALL the candles at once.", symptom: "Fire show-off" },
      { q: "Smoke from the nose too?", a: "Little smoke rings, all morning.", symptom: "Smoke rings" },
      { q: "Is {pet} drinking water?", a: "It sizzles when it goes down!", symptom: "Sizzly sips" },
    ],
    required: [
      { tool: "thermo", finding: "Wow — the thermometer says EXTRA toasty!" },
      { tool: "bath",   finding: "A cool bubble bath — sssssss — all cooled down!" },
    ],
  },
  {
    id: "static", diagnosis: "a Static Overload", tags: ["electric"], pay: [900, 1500],
    ownerLine: "{pet} is all crackly with static! Every cuddle gives us a little ZAP!",
    questions: [
      { q: "Is the fur standing up?", a: "Sticking straight out like a dandelion!", symptom: "Puffball fur" },
      { q: "What has {pet} been doing?", a: "Rolling on the carpet for hours.", symptom: "Carpet rolling" },
      { q: "How big are the zaps?", a: "Big enough to make my hair stand up too!", symptom: "Big zaps" },
    ],
    required: [
      { tool: "magic", finding: "The wand safely soaks up all the extra crackle!" },
      { tool: "bath",  finding: "An anti-static bubble bath — fluffy, not zappy!" },
    ],
  },
  {
    id: "muddy", diagnosis: "a Mega Mud Muddle", tags: ["furry", "scaly"], pay: [400, 700],
    ownerLine: "{pet} found the deepest, squelchiest mud puddle in town and dove right in!",
    questions: [
      { q: "How muddy are we talking?", a: "We can only see the eyes blinking.", symptom: "100% covered" },
      { q: "Did the mud get in the ears?", a: "Squish squish when the head tilts!", symptom: "Muddy ears" },
      { q: "Is {pet} proud of it?", a: "EXTREMELY proud.", symptom: "Zero regrets" },
    ],
    required: [
      { tool: "bath",  finding: "Scrub scrub scrub... there's a pet under all that mud!" },
      { tool: "light", finding: "Ears checked and wiped — squeaky clean in there!" },
    ],
  },
  {
    id: "tooth", diagnosis: "a Grumbly Tooth", tags: ["furry", "scaly", "pocket"], pay: [700, 1100],
    ownerLine: "{pet} chomped something too crunchy and now chews everything on one side, very slowly.",
    questions: [
      { q: "What did {pet} chomp?", a: "A super-crunchy dinosaur biscuit.", symptom: "Crunchy biscuit incident" },
      { q: "Is {pet} drooling?", a: "A little drool on the left side.", symptom: "Left-side drool" },
      { q: "Still eating dinner?", a: "Yes, but only the soft bits.", symptom: "Soft bits only" },
    ],
    required: [
      { tool: "light", finding: "Open wide... there's the grumbly tooth, a bit wiggly!" },
      { tool: "meds",  finding: "Numbing gel and a tooth-fix — chomping restored!" },
    ],
  },
  {
    id: "splinter", diagnosis: "the Prickle-Prickles", tags: ["any"], pay: [600, 1000],
    ownerLine: "{pet} rolled right into a prickly bush and now there are tiny splinters everywhere!",
    questions: [
      { q: "How did {pet} find a prickly bush?", a: "Chasing a butterfly behind the garden shed!", symptom: "Butterfly chase incident" },
      { q: "Does it hurt to pet {pet}?", a: "{pet} says 'yowch!' when we touch the prickly spots.", symptom: "Ouchy to the touch" },
      { q: "How many splinters are we talking?", a: "We counted five... then {pet} wiggled away.", symptom: "At least 5 prickles" },
    ],
    required: [
      { tool: "tweeze",  finding: "There they are — tiny prickles! Steady hands... got every last one!" },
      { tool: "bandage", finding: "A soft comfy wrap so the prickly spots can rest." },
    ],
  },
  {
    id: "bump", diagnosis: "a Boinky Bump", tags: ["any"], pay: [600, 1000],
    ownerLine: "{pet} was doing super-fast zoomies and went BONK right into the table leg!",
    questions: [
      { q: "Where's the bump?", a: "Right on top of the head, poor thing.", symptom: "Head bump" },
      { q: "How fast were the zoomies?", a: "The fastest zoomies I've ever seen.", symptom: "Maximum zoomies" },
      { q: "Did {pet} cry?", a: "One little sniffle, then asked for a snack.", symptom: "Brave patient" },
    ],
    required: [
      { tool: "xray",    finding: "Just a bump — the noggin is nice and strong underneath!" },
      { tool: "bandage", finding: "A cool-pack wrap and the boink shrinks right down." },
    ],
  },
];

/* Gifts a grateful pet sometimes leaves behind (~30% of visits). */
export const GIFTS = [
  { emoji: "💎", label: "Sparkling Gem" },
  { emoji: "🏆", label: "Golden Trophy" },
  { emoji: "🔮", label: "Mystic Orb" },
  { emoji: "👑", label: "Tiny Crown" },
  { emoji: "🌸", label: "Lucky Blossom" },
  { emoji: "🍀", label: "Four-Leaf Clover" },
  { emoji: "🐚", label: "Singing Seashell" },
  { emoji: "🪙", label: "Ancient Coin" },
  { emoji: "🎀", label: "Ribbon of Thanks" },
  { emoji: "🌟", label: "Fallen Star" },
];

export const THANK_YOUS = [
  "Thank you so much, Doctor! You're the best vet in town!",
  "Look how happy {pet} is! We can't thank you enough!",
  "Amazing! {pet} feels better already! Thank you, Doctor!",
  "You fixed {pet} right up! We'll tell all our friends about this clinic!",
  "{pet} wants to give you a big thank-you nuzzle, Doctor!",
];

/* ---------- derived types ---------- */
export type Species = (typeof SPECIES)[number];
export type Owner = (typeof OWNERS)[number];
export type Tool = (typeof TOOLS)[number];
export type Ailment = (typeof AILMENTS)[number];
export type Gift = (typeof GIFTS)[number];
