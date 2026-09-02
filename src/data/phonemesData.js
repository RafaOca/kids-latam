// Mock/derived phoneme data for the review system (Calentamiento +
// Checkpoint). Rather than inventing a second, disconnected set of test
// fixtures, this reuses the *real* per-letter audio/mouth-photo assets
// already wired up in `phase1LetterSequence` (see ../data.js) — so the
// review engine is testable immediately with production-quality assets,
// and never drifts out of sync with the letters actually taught.
import { phase1LetterSequence } from '../data.js';

// One entry per Phase 1 letter/sound: { id, char, sound, day, audioUrl, mouthImageUrl }.
export const PHONEMES = phase1LetterSequence.map((l) => ({
  id: l.id,
  char: l.char,
  sound: `/${l.char.toLowerCase()}/`,
  day: l.day,
  audioUrl: l.audio || null,
  mouthImageUrl: l.image || null,
}));

// id -> phoneme, for O(1) lookups from the spaced-repetition engine.
export const PHONEMES_BY_ID = PHONEMES.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {});

export const getPhoneme = (id) => PHONEMES_BY_ID[id] || null;
