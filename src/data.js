export const phaseBadges = { 1: 'ABC', 2: 'MA', 3: 'SA', 4: 'LEE' };

export const letters = [
  { id: 'm', char: 'M', sound: '/mmm/' },
  { id: 'a', char: 'A', sound: '/aaa/' },
  { id: 'p', char: 'P', sound: '/ppp/' },
  { id: 's', char: 'S', sound: '/sss/' },
  { id: 'e', char: 'E', sound: '/eee/' },
];

export const syllables = [
  { id: 'ma', text: 'MA', partIds: ['m', 'a'], group: 'simple' },
  { id: 'pa', text: 'PA', partIds: ['p', 'a'], group: 'simple' },
  { id: 'sa', text: 'SA', partIds: ['s', 'a'], group: 'complex' },
  { id: 'pe', text: 'PE', partIds: ['p', 'e'], group: 'complex' },
];

export const words = [
  { id: 'mapa', text: 'MAPA', partIds: ['ma', 'pa'] },
  { id: 'pesa', text: 'PESA', partIds: ['pe', 'sa'] },
];

// Legacy prototype letters (M,A,P,S,E) were dropped from this sequence —
// real letter-sound learning now lives entirely in `phase1LetterSequence`
// below (31 real letters/sounds). `adventureSteps` now only covers the
// syllable/word phases (2 and 3), which stay gated behind Phase 1 completion.
export const adventureSteps = [
  // 'ma'/'pa' moved into the real Phase 2 (`phase2Levels`, tracked by
  // review_state.phase2Done); only the legacy complex syllables + words remain.
  { type: 'syllable', id: 'sa' }, { type: 'syllable', id: 'pe' },
  { type: 'word', id: 'mapa' }, { type: 'word', id: 'pesa' },
];

// 17-day roadmap for Phase 1 ("Sonidos de las letras"). Each day introduces
// one or two letters/sounds and has its own vivid color + animal emoji.
// Unlocking happens per LETTER (not per day): a letter only becomes
// available once the previous letter in the whole sequence is completed.
const PHASE1_RAW_DAYS = [
  { emoji: '🦩', hue: 20, letters: [{ id: 'p1-a', char: 'A' }, { id: 'p1-i', char: 'I' }] },
  { emoji: '🐨', hue: 300, letters: [{ id: 'p1-e', char: 'E' }, { id: 'p1-o', char: 'O' }] },
  { emoji: '🐱', hue: 350, letters: [{ id: 'p1-u', char: 'U' }] },
  { emoji: '🦊', hue: 40, letters: [{ id: 'p1-m', char: 'M' }, { id: 'p1-p', char: 'P' }] },
  { emoji: '🐰', hue: 145, letters: [{ id: 'p1-s', char: 'S' }, { id: 'p1-l', char: 'L' }] },
  { emoji: '🐻', hue: 70, letters: [{ id: 'p1-t', char: 'T' }, { id: 'p1-d', char: 'D' }] },
  { emoji: '🐼', hue: 250, letters: [{ id: 'p1-n', char: 'N' }, { id: 'p1-f', char: 'F' }] },
  { emoji: '🐨', hue: 195, letters: [{ id: 'p1-b', char: 'B' }, { id: 'p1-v', char: 'V' }] },
  { emoji: '🐯', hue: 75, letters: [{ id: 'p1-c1', char: 'C', sub: '1er sonido' }, { id: 'p1-c2', char: 'C', sub: '2do sonido' }] },
  { emoji: '🦆', hue: 55, letters: [{ id: 'p1-q', char: 'Q' }] },
  { emoji: '🦁', hue: 90, letters: [{ id: 'p1-g1', char: 'G', sub: '1er sonido' }, { id: 'p1-g2', char: 'G', sub: '2do sonido' }] },
  { emoji: '🐸', hue: 135, letters: [{ id: 'p1-r1', char: 'R', sub: '1er sonido' }, { id: 'p1-r2', char: 'R', sub: '2do sonido' }] },
  { emoji: '🐷', hue: 15, letters: [{ id: 'p1-j', char: 'J' }] },
  { emoji: '🦉', hue: 280, letters: [{ id: 'p1-enye', char: 'Ñ' }, { id: 'p1-h', char: 'H' }] },
  { emoji: '🐢', hue: 200, letters: [{ id: 'p1-y1', char: 'Y', sub: '1er sonido' }, { id: 'p1-y2', char: 'Y', sub: '2do sonido' }] },
  { emoji: '🦋', hue: 320, letters: [{ id: 'p1-z', char: 'Z' }, { id: 'p1-x', char: 'X' }] },
  { emoji: '🐧', hue: 230, letters: [{ id: 'p1-k', char: 'K' }, { id: 'p1-w', char: 'W' }] },
];

// Media assets (sound-discovery video, pronunciation audio, mouth-shape
// photo) for each of the 31 Phase 1 letters/sounds, keyed by letter id.
const PHASE1_MEDIA = {
  'p1-a': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/1-A.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/1-%20A.MP3',
    image: 'https://i.imgur.com/pEdq81c.jpeg',
  },
  'p1-e': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/2-%20e.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/2-%20E.MP3',
    image: 'https://i.imgur.com/4kCys5o.jpeg',
  },
  'p1-i': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/3-%20I.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/3-%20I.MP3',
    image: 'https://i.imgur.com/kJQLoEB.jpeg',
  },
  'p1-o': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/4-%20O.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/4-%20O.MP3',
    image: 'https://i.imgur.com/b16DbtA.png',
  },
  'p1-u': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/5-%20U.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/5-%20U.MP3',
    image: 'https://i.imgur.com/nL6tj2q.jpeg',
  },
  'p1-m': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/6-%20M.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/6-%20M.MP3',
    image: 'https://i.imgur.com/QN4wZCm.png',
  },
  'p1-p': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/7-%20P.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/7-%20P.MP3',
    image: 'https://i.imgur.com/acO9Qjs.png',
  },
  'p1-s': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/8-%20S.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/8-%20S.MP3',
    image: 'https://i.imgur.com/Hzpuo99.png',
  },
  'p1-l': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/9-%20L.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/9-%20L.MP3',
    image: 'https://i.imgur.com/VhiVJxN.jpeg',
  },
  'p1-t': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/10-%20T.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/10-%20T.MP3',
    image: 'https://i.imgur.com/8RT3l7z.png',
  },
  'p1-d': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/11-%20D.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/11-%20D.MP3',
    image: 'https://i.imgur.com/YWaiDbs.jpeg',
  },
  'p1-n': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/12-%20N.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/12-%20N.MP3',
    image: 'https://i.imgur.com/gU9EVI3.jpeg',
  },
  'p1-f': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/13-%20F.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/13-%20F.MP3',
    image: 'https://i.imgur.com/SJv9U55.png',
  },
  'p1-b': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/14-%20B.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/14-%20B.MP3',
    image: 'https://i.imgur.com/MdSLpX9.png',
  },
  'p1-v': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/15-%20V.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/15-%20V.MP3',
    image: 'https://i.imgur.com/MdSLpX9.png',
  },
  'p1-c1': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/16-%20C1.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/16-%20C1.MP3',
    image: 'https://i.imgur.com/YSpATCt.png',
  },
  'p1-c2': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/17-%20C2.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/17-%20C2.MP3',
    image: 'https://i.imgur.com/At4Bz3o.png',
  },
  'p1-q': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/18-%20Q.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/18-%20Q.MP3',
    image: 'https://i.imgur.com/YSpATCt.png',
  },
  'p1-g1': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/19-%20G1.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/19-%20G1.MP3',
    image: 'https://i.imgur.com/FyktaEf.jpeg',
  },
  'p1-g2': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/20-%20G2.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/20-%20G2.MP3',
    image: 'https://i.imgur.com/XTl4uph.png',
  },
  'p1-r1': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/21-%20R1.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/21-%20R1.MP3',
    image: 'https://i.imgur.com/YWaiDbs.jpeg',
  },
  'p1-r2': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/22-%20R2.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/22-%20R2.MP3',
    image: 'https://i.imgur.com/4eTzrwr.png',
  },
  'p1-j': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/23-%20J.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/23-%20J.MP3',
    image: 'https://i.imgur.com/XTl4uph.png',
  },
  'p1-enye': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/24-%20%C3%B1.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/24-%20%C3%B1.MP3',
    image: 'https://i.imgur.com/mT4NWld.png',
  },
  'p1-h': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/25-%20H.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/25-%20H.MP3',
    image: 'https://i.imgur.com/FpTOrQC.jpeg',
  },
  'p1-y1': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/26-%20Y1.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/26-%20Y1.MP3',
    image: 'https://i.imgur.com/wrAFlqo.png',
  },
  'p1-y2': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/27-%20Y2.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/27-%20Y2.MP3',
    image: 'https://i.imgur.com/UA7ToBw.jpeg',
  },
  'p1-z': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/28-%20Z.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/28-%20Z.MP3',
    image: 'https://i.imgur.com/Hzpuo99.png',
  },
  'p1-x': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/29-%20X.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/29-%20X.MP3',
    image: 'https://i.imgur.com/1STwQoD.png',
  },
  'p1-k': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/30-%20K.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/30-%20K.MP3',
    image: 'https://i.imgur.com/YSpATCt.png',
  },
  'p1-w': {
    video: 'https://pub-623e600528b64744950e64473c52a95c.r2.dev/31-%20W.mp4',
    audio: 'https://pub-f85ab45a6b104db19f77b4d2cb06de40.r2.dev/31-%20W.MP3',
    image: 'https://i.imgur.com/RKrlRLV.jpeg',
  },
};

export const phase1Days = PHASE1_RAW_DAYS.map((d, i) => ({
  day: i + 1,
  emoji: d.emoji,
  color: `oklch(64% 0.15 ${d.hue})`,
  textColor: `oklch(42% 0.14 ${d.hue})`,
  letters: d.letters.map((l) => ({ ...l, ...(PHASE1_MEDIA[l.id] || {}) })),
}));

// Flattened, globally-ordered list of every letter/sound across all 16 days —
// this order is what drives the sequential per-letter unlock logic.
export const phase1LetterSequence = phase1Days.flatMap((d) =>
  d.letters.map((l) => ({ ...l, day: d.day })),
);

// Curriculum days that open with a mandatory "Checkpoint" general-review
// round instead of the normal 3-question Calentamiento warm-up — one right
// after the vowel block, one after the first big consonant block, and one
// after the second. (Day 17's ending is already covered by the existing
// "finishedAllPhase1" checkpoint-coin bonus in completePhase1Letter.)
export const PHASE1_CHECKPOINT_DAYS = [4, 9, 14];

// Groups of letter ids whose mouth-shape photo is the same (or visually
// indistinguishable). Used by the "¿Cuál es la boca correcta?" game so two
// letters from the same group never appear together as options in one round.
export const PHASE1_CONFUSABLE_GROUPS = [
  ['p1-b', 'p1-v', 'p1-p'],
  ['p1-d', 'p1-r1'],
  ['p1-j', 'p1-g2'],
  ['p1-c2', 'p1-s', 'p1-z'],
  ['p1-c1', 'p1-q', 'p1-k'],
];

export const avatars = [
  { id: 'perro', emoji: '🐶', name: 'Perro' }, { id: 'gato', emoji: '🐱', name: 'Gato' },
  { id: 'conejo', emoji: '🐰', name: 'Conejo' }, { id: 'zorro', emoji: '🦊', name: 'Zorro' },
  { id: 'oso', emoji: '🐻', name: 'Oso' }, { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'koala', emoji: '🐨', name: 'Koala' }, { id: 'tigre', emoji: '🐯', name: 'Tigre' },
  { id: 'leon', emoji: '🦁', name: 'León' }, { id: 'rana', emoji: '🐸', name: 'Rana' },
  { id: 'mono', emoji: '🐵', name: 'Mono' }, { id: 'cerdito', emoji: '🐷', name: 'Cerdito' },
];

// ---- Economy: "Monedas Estrella" coin rewards, avatars & shop catalog ----

// How many coins each kind of accomplishment grants. Kept as one table so
// tuning the economy later is a one-line change, not a hunt through screens.
export const COIN_REWARDS = {
  miniActivity: 5, // one graded sub-exercise inside a letter (balloons round, sustain round, calligraphy trace)
  letterComplete: 15, // finishing every level of one letter (bonus on top of its mini-activities)
  dayComplete: 30, // finishing every letter scheduled for a Phase 1 day (daily treasure chest)
  warmup: 10, // clearing the mandatory Calentamiento warm-up round before a Day 2+ node unlocks
  checkpoint: 150, // finishing an entire phase/world, or a Checkpoint general-review round (super bonus)
};

// Shape of the per-profile economy blob persisted as `child_profiles.economy`
// (jsonb). Exported so App.jsx/supabaseClient.js share one source of truth
// for what a "fresh" economy looks like. `cape` is the neck/back accessory
// slot (hero cape, scarf, bow tie, bandana).
export const DEFAULT_ECONOMY = {
  coins: 0,
  unlockedAvatars: [],
  activeAvatarId: null,
  equippedItems: { hat: null, glasses: null, outfit: null, cape: null },
  inventory: [],
};

// The three starter companions offered for free on first launch. IDs match
// entries in `avatars` above so existing avatar-lookup helpers keep working.
export const STARTER_AVATAR_IDS = ['zorro', 'leon', 'gato'];

// Rarity tiers drive both pricing bands and the card border color in the
// shop. Common = the 12 onboarding animals (the one the child already
// picked shows up owned/equipped for free); Raro/Legendario are themed
// avatars & accessories that read as real long-term goals against the
// ~80-100 coins/day a child earns finishing a full day of letters.
export const RARITY_META = {
  common: { label: 'Común', border: 'oklch(75% 0.01 250)', tint: 'oklch(95% 0.005 250)', text: 'oklch(45% 0.01 250)' },
  rare: { label: 'Raro', border: 'oklch(62% 0.16 250)', tint: 'oklch(94% 0.03 250)', text: 'oklch(48% 0.16 250)' },
  legendary: { label: 'Legendario', border: 'oklch(72% 0.15 85)', tint: 'oklch(95% 0.05 85)', text: 'oklch(48% 0.14 70)' },
};

// Every avatar sold in the "Personajes" shop tab — the 12 onboarding animals
// at Común prices, plus four Raro/Legendario special companions. Rendered as
// real layered SVG art (see avatarArt.jsx), not emoji.
export const SHOP_AVATARS = [
  { id: 'perro', name: 'Perro', price: 100, rarity: 'common' },
  { id: 'gato', name: 'Gato', price: 100, rarity: 'common' },
  { id: 'conejo', name: 'Conejo Pompón', price: 110, rarity: 'common' },
  { id: 'zorro', name: 'Zorro', price: 110, rarity: 'common' },
  { id: 'oso', name: 'Oso Bruno', price: 120, rarity: 'common' },
  { id: 'panda', name: 'Panda', price: 120, rarity: 'common' },
  { id: 'koala', name: 'Koala', price: 120, rarity: 'common' },
  { id: 'tigre', name: 'Tigre', price: 130, rarity: 'common' },
  { id: 'leon', name: 'León', price: 130, rarity: 'common' },
  { id: 'rana', name: 'Rana', price: 100, rarity: 'common' },
  { id: 'mono', name: 'Mono', price: 130, rarity: 'common' },
  { id: 'cerdito', name: 'Cerdito', price: 140, rarity: 'common' },
  { id: 'dragon', name: 'Dragón Chispitas', price: 300, rarity: 'rare' },
  { id: 'lobo', name: 'Lobo Astronauta', price: 380, rarity: 'rare' },
  { id: 'fenix', name: 'Fénix Dorado', price: 650, rarity: 'legendary' },
  { id: 'unicornio', name: 'Unicornio Estelar', price: 800, rarity: 'legendary' },
];

// Head accessories — rendered as the top-most layer over the avatar's head.
export const SHOP_HATS = [
  { id: 'hat-cap', name: 'Gorra volteada', price: 50, rarity: 'common' },
  { id: 'hat-flower', name: 'Tiara de flores', price: 65, rarity: 'common' },
  { id: 'hat-pirate', name: 'Sombrero pirata', price: 100, rarity: 'rare' },
  { id: 'hat-crown', name: 'Corona de rey', price: 180, rarity: 'legendary' },
  { id: 'hat-space', name: 'Casco espacial', price: 190, rarity: 'legendary' },
];

// Eye accessories — rendered just under the hat layer, over the face.
export const SHOP_GLASSES = [
  { id: 'glasses-cool', name: 'Lentes oscuros', price: 60, rarity: 'common' },
  { id: 'glasses-round', name: 'Lentes de científico', price: 55, rarity: 'common' },
  { id: 'glasses-eyepatch', name: 'Parche pirata', price: 90, rarity: 'rare' },
  { id: 'glasses-hero', name: 'Máscara de súper héroe', price: 110, rarity: 'rare' },
];

// Neck/back accessories — rendered behind the avatar's body.
export const SHOP_CAPES = [
  { id: 'cape-scarf', name: 'Cachecol colorido', price: 45, rarity: 'common' },
  { id: 'cape-bow', name: 'Lazo mariposa', price: 50, rarity: 'common' },
  { id: 'cape-bandana', name: 'Bandana aventurera', price: 85, rarity: 'rare' },
  { id: 'cape-hero', name: 'Capa de héroe', price: 170, rarity: 'legendary' },
];

// "Colors" are simple recolors of the avatar's background disc, so they're
// cheap and don't need any art asset — just a swatch id + CSS color.
export const SHOP_OUTFITS = [
  { id: 'outfit-sunny', name: 'Amarillo sol', price: 60, rarity: 'common', color: 'oklch(80% 0.15 90)' },
  { id: 'outfit-coral', name: 'Coral', price: 60, rarity: 'common', color: 'oklch(75% 0.16 30)' },
  { id: 'outfit-mint', name: 'Menta', price: 60, rarity: 'common', color: 'oklch(80% 0.13 165)' },
  { id: 'outfit-grape', name: 'Uva', price: 60, rarity: 'common', color: 'oklch(65% 0.15 300)' },
  { id: 'outfit-sky', name: 'Cielo', price: 60, rarity: 'common', color: 'oklch(78% 0.1 235)' },
];

// Flat catalog (every purchasable thing, one shape) — handy for price
// lookups / "what does item X cost" without caring which tab it lives in.
export const SHOP_CATALOG = [
  ...SHOP_AVATARS.map((a) => ({ id: a.id, name: a.name, type: 'avatar', price: a.price, rarity: a.rarity, assetUrl: null, isFree: false })),
  ...SHOP_HATS.map((h) => ({ id: h.id, name: h.name, type: 'hat', price: h.price, rarity: h.rarity, assetUrl: null, isFree: false })),
  ...SHOP_GLASSES.map((g) => ({ id: g.id, name: g.name, type: 'glasses', price: g.price, rarity: g.rarity, assetUrl: null, isFree: false })),
  ...SHOP_CAPES.map((c) => ({ id: c.id, name: c.name, type: 'cape', price: c.price, rarity: c.rarity, assetUrl: null, isFree: false })),
  ...SHOP_OUTFITS.map((o) => ({ id: o.id, name: o.name, type: 'outfit', price: o.price, rarity: o.rarity, assetUrl: null, color: o.color, isFree: false })),
];

export const getShopItem = (id) => SHOP_CATALOG.find((i) => i.id === id);

export const getLetter = (id) => letters.find((l) => l.id === id);
export const getSyllable = (id) => syllables.find((s) => s.id === id);
export const getWord = (id) => words.find((w) => w.id === id);
export const getAvatar = (id) => avatars.find((a) => a.id === id) || avatars[0];

export const adventureIndexFor = (type, id) =>
  adventureSteps.findIndex((s) => s.type === type && s.id === id);

export const stepStatus = (index, progressIndex) => {
  if (index < progressIndex) return 'done';
  if (index === progressIndex) return 'current';
  return 'locked';
};

// Phase 2 ("Sílabas simples") interface skeleton: 3 levels, each a list of
// numbered blocks (no "Día N") with 3 syllable buttons. Only the UI exists
// for now — the per-syllable activities come later.
const PHASE2_RAW_LEVELS = [
  {
    level: 1,
    title: 'Vocal + Vocal',
    blocks: [['AI', 'AU', 'AE'], ['EI', 'OU', 'UI'], ['EU', 'AO', 'IA']],
  },
  {
    level: 2,
    title: 'Vocal + Consonante I',
    blocks: [['MA', 'MO', 'MU'], ['SA', 'SO', 'SU'], ['LA', 'LO', 'LU'], ['MI', 'SI', 'LO']],
  },
  {
    level: 3,
    title: 'Vocal + Consonante II',
    blocks: [['PA', 'PE', 'PO'], ['TA', 'TE', 'TO'], ['DA', 'DE', 'DO'], ['PI', 'TU', 'DI']],
  },
];
const PHASE2_BLOCK_STYLE = [
  { emoji: '🐶', hue: 235 },
  { emoji: '🐱', hue: 20 },
  { emoji: '🐸', hue: 150 },
  { emoji: '🦊', hue: 55 },
];
export const phase2Levels = PHASE2_RAW_LEVELS.map((lv) => ({
  level: lv.level,
  title: lv.title,
  blocks: lv.blocks.map((syls, bi) => {
    const st = PHASE2_BLOCK_STYLE[(bi + lv.level - 1) % PHASE2_BLOCK_STYLE.length];
    return {
      day: bi + 1,
      label: String(bi + 1),
      emoji: st.emoji,
      color: `oklch(64% 0.15 ${st.hue})`,
      textColor: `oklch(42% 0.14 ${st.hue})`,
      letters: syls.map((t, si) => ({ id: `p2-${lv.level}-${bi + 1}-${si + 1}`, char: t })),
    };
  }),
}));

export const getPhase1LetterByChar = (ch) => phase1LetterSequence.find((l) => l.char === ch);

// Every Phase 2 syllable has an activity now (levels 1-2: blend flow,
// level 3: balloon flow).
export const PHASE2_ALL_IDS = phase2Levels.flatMap((l) => l.blocks.flatMap((b) => b.letters.map((x) => x.id)));
export const PHASE2_TOTAL = PHASE2_ALL_IDS.length;
export const PHASE2_ACTIVE_SYLLABLES = new Set(PHASE2_ALL_IDS);
export const getPhase2Syllable = (id) =>
  phase2Levels.flatMap((l) => l.blocks.flatMap((b) => b.letters)).find((x) => x.id === id);

// Flat, ordered id list per level — drives the strictly sequential unlock.
export const phase2LevelOrder = (level) =>
  phase2Levels.find((l) => l.level === level).blocks.flatMap((b) => b.letters.map((x) => x.id));
