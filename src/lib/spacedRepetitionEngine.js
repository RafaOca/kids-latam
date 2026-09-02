// ---- Spaced Repetition Engine ----
//
// Local (client-side) logic that tracks how well the child has mastered each
// phoneme/letter learned so far in Phase 1, and uses that to build the
// 3-question "Calentamiento" warm-up round shown before a new day's letters
// unlock (and the longer Checkpoint review rounds).
//
// Persisted shape (see `child_profiles.review_state` jsonb column):
//   {
//     mastery: { [letterId]: LetterMastery },
//     warmupCompletedDays: number[],   // curriculum day numbers already warmed up
//     checkpointsCompleted: number[],  // curriculum day numbers whose checkpoint is done
//   }
//
// LetterMastery shape:
//   {
//     letterId: string,
//     timesReviewed: number,   // total times shown in a warm-up/checkpoint round
//     errorCount: number,      // wrong taps accumulated across all reviews
//     lastReviewedDay: number, // curriculum day number of the most recent review
//     needsReview: boolean,    // true right after a miss, cleared on the next hit
//   }

/** Builds a brand-new mastery entry for a letter that has never been reviewed. */
export function createMasteryEntry(letterId) {
  return {
    letterId,
    timesReviewed: 0,
    errorCount: 0,
    lastReviewedDay: 0,
    needsReview: false,
  };
}

/** Reads a letter's mastery entry, falling back to a fresh one (never mutates the map). */
export function getMasteryFor(masteryMap, letterId) {
  return (masteryMap && masteryMap[letterId]) || createMasteryEntry(letterId);
}

// Weighted-priority comparator used to rank candidate letters for the next
// warm-up/checkpoint round. Lower "score" = picked first. Priority order,
// exactly as specced:
//   1) needsReview flag (recent mistake) — always goes first.
//   2) learned on the immediately-previous curriculum day (freshest material).
//   3) fewer timesReviewed, then a longer gap since lastReviewedDay.
function priorityScore(mastery, currentDay, previousDay) {
  let score = 0;
  if (!mastery.needsReview) score += 1000; // needsReview letters sort first
  if (mastery.lastReviewedDay !== previousDay) score += 500; // D-1 letters sort next
  score += mastery.timesReviewed * 10; // fewer reviews sorts earlier
  const gap = Math.max(0, currentDay - mastery.lastReviewedDay);
  score -= Math.min(gap, 30); // bigger gap since last seen sorts a bit earlier
  return score;
}

/**
 * Picks up to `count` distinct letter ids to review next, from the pool of
 * letters already learned (`learnedLetterIds`), ranked by the priority rules
 * above. If the learned pool is smaller than `count`, ids repeat (padded) so
 * callers always get exactly `count` entries back — safe for Day 2, which
 * may only have 2 learned letters available.
 */
export function selectWarmUpLetterIds(masteryMap, learnedLetterIds, currentDay, count = 3) {
  const pool = (learnedLetterIds || []).filter(Boolean);
  if (pool.length === 0) return [];
  const previousDay = currentDay - 1;

  const ranked = [...new Set(pool)]
    .map((id) => ({ id, mastery: getMasteryFor(masteryMap, id) }))
    .sort((a, b) => priorityScore(a.mastery, currentDay, previousDay) - priorityScore(b.mastery, currentDay, previousDay));

  const picked = ranked.slice(0, count).map((r) => r.id);
  // Pad with repeats (cycling through the ranked pool) if there aren't
  // enough distinct learned letters yet for a full round.
  let i = 0;
  while (picked.length < count) {
    picked.push(ranked[i % ranked.length].id);
    i += 1;
  }
  return picked;
}

/**
 * Records the outcome of one review tap and returns a *new* mastery map
 * (immutable update, safe to drop straight into React state / persist).
 * A miss sets `needsReview = true` so the letter is guaranteed to resurface
 * in tomorrow's warm-up; a hit clears the flag.
 */
export function recordWarmUpAnswer(masteryMap, letterId, correct, currentDay) {
  const prev = getMasteryFor(masteryMap, letterId);
  const next = {
    ...prev,
    letterId,
    timesReviewed: prev.timesReviewed + 1,
    errorCount: prev.errorCount + (correct ? 0 : 1),
    lastReviewedDay: currentDay,
    needsReview: !correct,
  };
  return { ...(masteryMap || {}), [letterId]: next };
}

// The three mini-challenge types the Calentamiento/Checkpoint rounds mix
// together. Kept as string constants so screens/components can switch on
// them without magic strings scattered around.
export const CHALLENGE_TYPES = {
  SOUND_TO_LETTER: 'sound-to-letter', // Tipo A
  SOUND_TO_MOUTH: 'sound-to-mouth', // Tipo B
  BALLOON_POP: 'balloon-pop', // Tipo C
};

const ALL_TYPES = [CHALLENGE_TYPES.SOUND_TO_LETTER, CHALLENGE_TYPES.SOUND_TO_MOUTH, CHALLENGE_TYPES.BALLOON_POP];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Builds one challenge object for a target phoneme: picks 2 distractor
// phonemes from the wider pool (never the target itself) and a random type.
function buildChallenge(targetId, type, phonemesById, allLetterIds) {
  const distractorPool = allLetterIds.filter((id) => id !== targetId);
  const distractors = shuffle(distractorPool).slice(0, 2);
  const optionIds = shuffle([targetId, ...distractors]);
  return {
    type,
    targetId,
    optionIds,
    phoneme: phonemesById[targetId] || null,
  };
}

/**
 * Generates a full round of `count` challenges for the Calentamiento modal
 * (or a longer Checkpoint round). `learnedLetterIds` should be every letter
 * id the child has unlocked so far (used both to pick targets via the
 * priority ranking, and as the distractor pool for every question type).
 */
export function generateWarmUpChallenges(masteryMap, learnedLetterIds, currentDay, phonemesById, count = 3) {
  const targets = selectWarmUpLetterIds(masteryMap, learnedLetterIds, currentDay, count);
  const distractorPool = learnedLetterIds.length >= 3 ? learnedLetterIds : [...learnedLetterIds, ...learnedLetterIds, ...learnedLetterIds];
  const types = shuffle(ALL_TYPES);
  return targets.map((id, i) => buildChallenge(id, types[i % types.length], phonemesById, distractorPool));
}
