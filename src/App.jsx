import { useEffect, useRef, useState } from 'react';
import {
  supabase,
  fetchChildProfiles,
  createChildProfile,
  updateChildProfileProgress,
  updateChildProfilePractice,
  updateChildProfilePhase1,
  updateChildProfileEconomy,
  updateChildProfileReviewState,
} from './lib/supabaseClient.js';
import {
  phaseBadges,
  letters,
  syllables,
  words,
  adventureSteps,
  avatars,
  phase1Days,
  phase1LetterSequence,
  PHASE1_CHECKPOINT_DAYS,
  getLetter,
  getSyllable,
  getWord,
  getAvatar,
  adventureIndexFor,
  stepStatus,
  COIN_REWARDS,
  DEFAULT_ECONOMY,
} from './data.js';
import { recordWarmUpAnswer } from './lib/spacedRepetitionEngine.js';
import { isStandalone, isPwaRememberValid, markPwaRemember, clearPwaRemember } from './lib/pwa.js';
import { initPwaUpdates } from './lib/pwaRegister.js';

import BottomNav from './components/BottomNav.jsx';
import RewardModal from './components/RewardModal.jsx';
import CalentamientoModal, { CheckpointView } from './components/CalentamientoModal.jsx';
import UpdatePrompt from './components/UpdatePrompt.jsx';

import Onboarding1 from './screens/Onboarding1.jsx';
import Onboarding2 from './screens/Onboarding2.jsx';
import Onboarding3 from './screens/Onboarding3.jsx';
import Onboarding4 from './screens/Onboarding4.jsx';
import Login from './screens/Login.jsx';
import ProfileSwitcher from './screens/ProfileSwitcher.jsx';
import Home from './screens/Home.jsx';
import Adventure from './screens/Adventure.jsx';
import Achievements from './screens/Achievements.jsx';
import Profile from './screens/Profile.jsx';
import Settings from './screens/Settings.jsx';
import Help from './screens/Help.jsx';
import ParentGate from './screens/ParentGate.jsx';
import ParentDashboard from './screens/ParentDashboard.jsx';
import PhaseDetail from './screens/PhaseDetail.jsx';
import Phase1LetterActivity from './screens/Phase1LetterActivity.jsx';
import LetterLearn from './screens/LetterLearn.jsx';
import LetterActivity from './screens/LetterActivity.jsx';
import SyllableBlend from './screens/SyllableBlend.jsx';
import WordBlend from './screens/WordBlend.jsx';
import Completion from './screens/Completion.jsx';
import Tienda from './screens/Tienda.jsx';

const NAV_SCREENS = ['home', 'adventure', 'achievements', 'profile'];

const initialState = {
  screen: 'login',
  authChecking: true,
  userEmail: null,
  tempName: '',
  tempAvatarId: 'perro',
  profiles: [],
  activeProfileId: null,
  activePhase: 1,
  currentItemType: null,
  currentItemId: null,
  quizOptions: [],
  quizSelected: null,
  quizResult: null,
  blendStage: 0,
  isPlaying: false,
  soundOn: true,
  mathA: 0,
  mathB: 0,
  mathInput: '',
  mathError: false,
  lockedMessage: '',
  lockedToastVisible: false,
  transitionOpacity: 0,
  phase1ActiveIndex: null,
  screenBeforeTienda: 'home',
  rewardOpen: false,
  rewardAmount: 0,
  rewardKind: 'mini',
  rewardSubtitle: '',
  coinBumpAmount: 0,
  coinBumpKey: 0,
  reviewGateOpen: false,
  reviewGateVariant: 'warmup', // 'warmup' | 'checkpoint'
  reviewGateDay: null,
  reviewGatePendingIndex: null,
  updateAvailable: false,
};

const DEFAULT_REVIEW_STATE = { mastery: {}, warmupCompletedDays: [], checkpointsCompleted: [] };
const getReviewState = (p) => ({ ...DEFAULT_REVIEW_STATE, ...(p?.reviewState || {}) });

export default function App() {
  const [state, setState] = useState(initialState);
  const transTimer1 = useRef(null);
  const transTimer2 = useRef(null);

  const update = (partial) =>
    setState((s) => ({ ...s, ...(typeof partial === 'function' ? partial(s) : partial) }));

  // ---- auth (Supabase) ----
  const loadProfilesAndEnter = async (session) => {
    // Refreshes the "stay logged in for 1 week" window on every successful
    // boot/login while running as an installed PWA — a normal browser tab
    // relies on Supabase's own persisted session instead (see ./lib/pwa.js).
    markPwaRemember();
    try {
      const profiles = await fetchChildProfiles();
      update({
        authChecking: false,
        userEmail: session.user.email,
        profiles,
        activeProfileId: profiles[0]?.id ?? null,
        screen: profiles.length ? 'profile-switcher' : 'ob1',
      });
    } catch (e) {
      console.error(e);
      update({ authChecking: false, userEmail: session.user.email, screen: 'ob1' });
    }
  };

  useEffect(() => {
    let active = true;
    // Installed-PWA-only gate: if the 1-week "remember me" window has lapsed,
    // force a fresh login instead of silently riding Supabase's own
    // (much longer-lived) refresh token.
    const bootCheck =
      isStandalone() && !isPwaRememberValid()
        ? supabase.auth.signOut()
        : Promise.resolve();
    bootCheck.then(() =>
      supabase.auth.getSession().then(({ data }) => {
        if (!active) return;
        const session = data.session;
        if (session) {
          loadProfilesAndEnter(session);
        } else {
          update({ authChecking: false, userEmail: null, screen: 'login' });
        }
      }),
    );

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        update({ userEmail: null, profiles: [], activeProfileId: null, screen: 'login' });
      }
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const onLoginSuccess = (session) => {
    update({ authChecking: true });
    loadProfilesAndEnter(session);
  };

  // ---- PWA update lifecycle ----
  const applyUpdateRef = useRef(() => {});
  useEffect(() => {
    applyUpdateRef.current = initPwaUpdates(() => update({ updateAvailable: true }));
  }, []);
  const applyUpdate = () => applyUpdateRef.current();

  // ---- practice time / days tracking (real usage data for the parent area) ----
  const PRACTICE_EXCLUDED_SCREENS = [
    'login', 'profile-switcher', 'parent-gate', 'parent-dashboard', 'settings', 'help',
  ];
  useEffect(() => {
    if (state.authChecking || !state.activeProfileId) return undefined;
    if (PRACTICE_EXCLUDED_SCREENS.includes(state.screen)) return undefined;
    const activeId = state.activeProfileId;
    const TICK_SECONDS = 15;
    const interval = setInterval(() => {
      const today = new Date().toISOString().slice(0, 10);
      update((s) => {
        const profiles = s.profiles.map((p) => {
          if (p.id !== activeId) return p;
          const practiceDays = p.practiceDays.includes(today) ? p.practiceDays : [...p.practiceDays, today];
          return { ...p, practiceSeconds: (p.practiceSeconds || 0) + TICK_SECONDS, practiceDays };
        });
        const updated = profiles.find((p) => p.id === activeId);
        if (updated) {
          updateChildProfilePractice(activeId, {
            practiceSeconds: updated.practiceSeconds,
            practiceDays: updated.practiceDays,
          }).catch((e) => console.error('No se pudo guardar el tiempo de práctica', e));
        }
        return { profiles };
      });
    }, TICK_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [state.authChecking, state.activeProfileId, state.screen]);

  const getActiveProfile = () =>
    state.profiles.find((p) => p.id === state.activeProfileId) ||
    { name: '', avatarId: 'perro', progressIndex: 0, phase1DoneLetters: 0, economy: DEFAULT_ECONOMY, reviewState: DEFAULT_REVIEW_STATE };

  // ---- navigation ----
  const navigateWithTransition = (nextScreen, extra = {}) => {
    update((s) => (s.screen === nextScreen ? s : { transitionOpacity: 1 }));
    clearTimeout(transTimer1.current);
    clearTimeout(transTimer2.current);
    transTimer1.current = setTimeout(
      () => update({ screen: nextScreen, lockedToastVisible: false, ...extra }),
      280,
    );
    transTimer2.current = setTimeout(() => update({ transitionOpacity: 0 }), 560);
  };
  // Bottom-tab navigation switches instantly (no fade) — the transition
  // effect is reserved for entering a level, like openPhaseDetailWithTransition.
  const goHome = () => update({ screen: 'home', lockedToastVisible: false });
  const goAdventure = () => update({ screen: 'adventure', lockedToastVisible: false });
  const goAchievements = () => update({ screen: 'achievements', lockedToastVisible: false });
  const goProfile = () => update({ screen: 'profile', lockedToastVisible: false });
  const goSettings = () => update({ screen: 'settings' });
  const goHelp = () => update({ screen: 'help' });
  const goEmpezar = () => update({ screen: 'ob2' });
  const goProfileSwitcher = () => update({ screen: 'profile-switcher' });
  const setTempName = (value) => update({ tempName: value });
  const confirmName = () => update((s) => ({ tempName: s.tempName.trim() || 'Amigo', screen: 'ob3' }));
  const setTempAvatarId = (id) => update({ tempAvatarId: id });
  const confirmAvatar = () => update({ screen: 'ob4' });
  const toggleSound = () => update((s) => ({ soundOn: !s.soundOn }));

  const finishOnboarding = async () => {
    try {
      const profile = await createChildProfile({
        name: state.tempName || 'Amigo',
        avatarId: state.tempAvatarId,
      });
      update((s) => ({
        profiles: [...s.profiles, profile],
        activeProfileId: profile.id,
        screen: 'home',
      }));
    } catch (e) {
      console.error('No se pudo guardar el perfil', e);
      alert('Ya tienes el máximo de 2 perfiles en esta cuenta.');
      update({ screen: 'profile-switcher' });
    }
  };
  const addProfile = () => update({ tempName: '', tempAvatarId: avatars[0].id, screen: 'ob2' });
  const switchProfile = (id) => update({ activeProfileId: id, screen: 'home' });
  const logOut = () => {
    update({ screen: 'login' });
    clearPwaRemember();
    supabase.auth.signOut();
  };

  // ---- parent gate ----
  // Uses a simple one-digit multiplication: trivial mental math for an
  // adult, but still an effective gate since the kids using this app are
  // just learning to read letters and don't know multiplication yet.
  const randomMathPair = () => ({
    a: 2 + Math.floor(Math.random() * 8),
    b: 2 + Math.floor(Math.random() * 8),
  });
  const startParentGate = () => {
    const { a, b } = randomMathPair();
    update({ mathA: a, mathB: b, mathInput: '', mathError: false, screen: 'parent-gate' });
  };
  const setMathInput = (value) => update({ mathInput: value });
  const checkParentGate = () => {
    update((s) => {
      if (parseInt(s.mathInput, 10) === s.mathA * s.mathB) {
        return { screen: 'parent-dashboard' };
      }
      const { a, b } = randomMathPair();
      return { mathA: a, mathB: b, mathInput: '', mathError: true };
    });
  };

  // ---- levels ----
  // Back navigation into/out of a phase also gets the fade transition (only
  // bottom-tab switches stay instant).
  const goToPhaseDetail = () => navigateWithTransition('phase-detail');
  const backFromPhaseDetail = () => navigateWithTransition('adventure');
  const goToLearn = () => update({ screen: 'letter-learn', quizResult: null, quizSelected: null });

  const showLockedMessage = () =>
    update({ lockedMessage: '🔒 Completa el nivel anterior primero.', lockedToastVisible: true });

  const openPhaseDetailWithTransition = (phase, locked) => {
    if (locked) { showLockedMessage(); return; }
    update({ transitionOpacity: 1, lockedToastVisible: false });
    clearTimeout(transTimer1.current);
    clearTimeout(transTimer2.current);
    transTimer1.current = setTimeout(() => update({ activePhase: phase, screen: 'phase-detail' }), 350);
    transTimer2.current = setTimeout(() => update({ transitionOpacity: 0 }), 700);
  };

  const openLevel = (type, id, locked) => {
    if (locked) { showLockedMessage(); return; }
    update({ transitionOpacity: 1, lockedToastVisible: false });
    clearTimeout(transTimer1.current);
    clearTimeout(transTimer2.current);
    transTimer1.current = setTimeout(() => {
      if (type === 'letter') {
        const letter = getLetter(id);
        const pool = letters.filter((l) => l.id !== id);
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 2);
        const opts = [letter, ...shuffled].sort(() => Math.random() - 0.5);
        update({ currentItemType: 'letter', currentItemId: id, activePhase: 1, quizOptions: opts, quizSelected: null, quizResult: null, screen: 'letter-learn' });
      } else if (type === 'syllable') {
        const sy = getSyllable(id);
        update({ currentItemType: 'syllable', currentItemId: id, activePhase: sy.group === 'simple' ? 2 : 3, blendStage: 0, screen: 'phase2-blend' });
      } else {
        update({ currentItemType: 'word', currentItemId: id, activePhase: 4, blendStage: 0, screen: 'phase3-blend' });
      }
    }, 280);
    transTimer2.current = setTimeout(() => update({ transitionOpacity: 0 }), 560);
  };

  // Phase 1 letters unlock sequentially (one at a time, not one per day).
  // Tapping an unlocked (or already-done, for review) letter opens its
  // 4-level activity screen; only finishing all 4 levels there marks the
  // letter as done. Only the final "done" boolean is persisted per profile
  // (not per-sublevel progress), same pattern as progressIndex/practice.
  const openPhase1Letter = (index) => {
    const profile = getActiveProfile();
    const done = profile.phase1DoneLetters || 0;
    if (index > done) { showLockedMessage(); return; }

    // Spaced-repetition gate: the very first time the child unlocks a new
    // day's first letter (Day 2+), it must go through a Calentamiento
    // warm-up first — or a longer Checkpoint round on designated review
    // days — before the new letter loads. Re-opening an already-learned
    // letter (review) or a letter that isn't the day's first never gates.
    const seqItem = phase1LetterSequence[index];
    const isFirstOfDay = index === 0 || phase1LetterSequence[index - 1].day !== seqItem.day;
    const isFreshUnlock = index === done;
    if (isFirstOfDay && isFreshUnlock) {
      const learnedIds = phase1LetterSequence.slice(0, index).map((l) => l.id);
      if (learnedIds.length > 0) {
        const rs = getReviewState(profile);
        if (PHASE1_CHECKPOINT_DAYS.includes(seqItem.day) && !rs.checkpointsCompleted.includes(seqItem.day)) {
          update({ reviewGateOpen: true, reviewGateVariant: 'checkpoint', reviewGateDay: seqItem.day, reviewGatePendingIndex: index, lockedToastVisible: false });
          return;
        }
        if (seqItem.day >= 2 && !rs.warmupCompletedDays.includes(seqItem.day)) {
          update({ reviewGateOpen: true, reviewGateVariant: 'warmup', reviewGateDay: seqItem.day, reviewGatePendingIndex: index, lockedToastVisible: false });
          return;
        }
      }
    }
    navigateWithTransition('phase1-letter-activity', { phase1ActiveIndex: index, lockedToastVisible: false });
  };

  // A tap during the warm-up/checkpoint round: update the letter's mastery
  // entry immediately (local state only — the full review-state blob is
  // persisted once, in handleReviewGateComplete, to avoid a network write
  // per tap).
  const handleReviewAnswer = (letterId, correct) => {
    const activeId = state.activeProfileId;
    const day = state.reviewGateDay;
    update((s) => ({
      profiles: s.profiles.map((p) => {
        if (p.id !== activeId) return p;
        const rs = getReviewState(p);
        return { ...p, reviewState: { ...rs, mastery: recordWarmUpAnswer(rs.mastery, letterId, correct, day) } };
      }),
    }));
  };

  // Finished all rounds: mark the day (or checkpoint) as done, persist the
  // review-state blob, award the coins, close the gate, and resume straight
  // into the originally-tapped letter.
  const handleReviewGateComplete = (coinsEarned) => {
    const activeId = state.activeProfileId;
    const variant = state.reviewGateVariant;
    const day = state.reviewGateDay;
    const pendingIndex = state.reviewGatePendingIndex;
    update((s) => ({
      profiles: s.profiles.map((p) => {
        if (p.id !== activeId) return p;
        const rs = getReviewState(p);
        const nextRs =
          variant === 'checkpoint'
            ? { ...rs, checkpointsCompleted: [...rs.checkpointsCompleted, day] }
            : { ...rs, warmupCompletedDays: [...rs.warmupCompletedDays, day] };
        updateChildProfileReviewState(activeId, nextRs).catch((e) =>
          console.error('No se pudo guardar el progreso de repaso', e),
        );
        return { ...p, reviewState: nextRs };
      }),
      reviewGateOpen: false,
    }));
    awardCoins(
      coinsEarned,
      variant === 'checkpoint' ? 'checkpoint' : 'mini',
      variant === 'checkpoint' ? '¡Repaso completo!' : '¡Calentamiento completo!',
    );
    if (pendingIndex != null) {
      navigateWithTransition('phase1-letter-activity', { phase1ActiveIndex: pendingIndex });
    }
  };

  const completePhase1Letter = () => {
    const activeId = state.activeProfileId;
    const index = state.phase1ActiveIndex;
    const done = getActiveProfile().phase1DoneLetters || 0;
    const newDone = Math.max(done, index + 1);
    if (newDone !== done) {
      update((s) => ({
        profiles: s.profiles.map((p) => (p.id === activeId ? { ...p, phase1DoneLetters: newDone } : p)),
      }));
      updateChildProfilePhase1(activeId, newDone).catch((e) =>
        console.error('No se pudo guardar el avance de la fase 1', e),
      );

      // Was this the last letter of its day? phase1LetterSequence is
      // globally ordered and each item carries its `day` number, so the day
      // just finished the moment the next item's day changes (or we ran out
      // of letters entirely).
      const finishedDayComplete =
        index === phase1LetterSequence.length - 1 ||
        phase1LetterSequence[index + 1]?.day !== phase1LetterSequence[index].day;
      const finishedAllPhase1 = newDone >= phase1LetterSequence.length;

      if (finishedAllPhase1) {
        awardCoins(COIN_REWARDS.checkpoint, 'checkpoint', '¡Completaste todas las letras!');
      } else if (finishedDayComplete) {
        awardCoins(COIN_REWARDS.dayComplete, 'day', '¡Día completo!');
      } else {
        awardCoins(COIN_REWARDS.letterComplete, 'letter', '¡Letra completa!');
      }
    }
    navigateWithTransition('phase-detail');
  };

  const exitPhase1Letter = () => navigateWithTransition('phase-detail');

  const onPhase1MiniActivity = () => awardCoins(COIN_REWARDS.miniActivity, 'mini');

  // ---- economy: coins & shop ----
  const awardCoins = (amount, kind = 'mini', subtitle = '') => {
    const activeId = state.activeProfileId;
    if (!activeId || !amount) return;
    update((s) => {
      const profiles = s.profiles.map((p) => {
        if (p.id !== activeId) return p;
        const economy = { ...DEFAULT_ECONOMY, ...(p.economy || {}) };
        const newEconomy = { ...economy, coins: economy.coins + amount };
        updateChildProfileEconomy(activeId, newEconomy).catch((e) =>
          console.error('No se pudo guardar las monedas', e),
        );
        return { ...p, economy: newEconomy };
      });
      return {
        profiles,
        rewardOpen: true,
        rewardAmount: amount,
        rewardKind: kind,
        rewardSubtitle: subtitle,
        coinBumpAmount: amount,
        coinBumpKey: Date.now(),
      };
    });
  };
  const closeReward = () => update({ rewardOpen: false });

  const goTienda = () => update((s) => (s.screen === 'tienda' ? s : { screen: 'tienda', screenBeforeTienda: s.screen }));
  const closeTienda = () => update((s) => ({ screen: s.screenBeforeTienda || 'home' }));

  const buyShopItem = (type, item) => {
    const activeId = state.activeProfileId;
    if (!activeId) return;
    update((s) => {
      const p = s.profiles.find((x) => x.id === activeId);
      if (!p) return {};
      const economy = { ...DEFAULT_ECONOMY, ...(p.economy || {}) };
      if (economy.coins < item.price) return {};
      let newEconomy;
      if (type === 'avatar') {
        newEconomy = {
          ...economy,
          coins: economy.coins - item.price,
          unlockedAvatars: [...economy.unlockedAvatars, item.id],
          activeAvatarId: item.id,
        };
      } else {
        newEconomy = {
          ...economy,
          coins: economy.coins - item.price,
          inventory: [...economy.inventory, item.id],
          equippedItems: { ...economy.equippedItems, [type]: item.id },
        };
      }
      updateChildProfileEconomy(activeId, newEconomy).catch((e) =>
        console.error('No se pudo guardar la compra', e),
      );
      return {
        profiles: s.profiles.map((x) => (x.id === activeId ? { ...x, economy: newEconomy } : x)),
      };
    });
  };

  const equipShopItem = (type, item) => {
    const activeId = state.activeProfileId;
    if (!activeId) return;
    update((s) => {
      const p = s.profiles.find((x) => x.id === activeId);
      if (!p) return {};
      const economy = { ...DEFAULT_ECONOMY, ...(p.economy || {}) };
      const newEconomy =
        type === 'avatar'
          ? { ...economy, activeAvatarId: item.id }
          : { ...economy, equippedItems: { ...economy.equippedItems, [type]: item.id } };
      updateChildProfileEconomy(activeId, newEconomy).catch((e) =>
        console.error('No se pudo guardar el cambio', e),
      );
      return {
        profiles: s.profiles.map((x) => (x.id === activeId ? { ...x, economy: newEconomy } : x)),
      };
    });
  };

  const unequipShopItem = (type) => {
    const activeId = state.activeProfileId;
    if (!activeId) return;
    update((s) => {
      const p = s.profiles.find((x) => x.id === activeId);
      if (!p) return {};
      const economy = { ...DEFAULT_ECONOMY, ...(p.economy || {}) };
      const newEconomy = { ...economy, equippedItems: { ...economy.equippedItems, [type]: null } };
      updateChildProfileEconomy(activeId, newEconomy).catch((e) =>
        console.error('No se pudo guardar el cambio', e),
      );
      return {
        profiles: s.profiles.map((x) => (x.id === activeId ? { ...x, economy: newEconomy } : x)),
      };
    });
  };

  const playSound = () => {
    update({ isPlaying: true });
    setTimeout(() => update({ isPlaying: false }), 650);
  };
  const continueFromLearn = () => update({ screen: 'letter-activity' });

  const selectAnswer = (id) => {
    if (state.quizResult === 'correct') return;
    const correct = id === state.currentItemId;
    update({ quizSelected: id, quizResult: correct ? 'correct' : 'wrong' });
    if (!correct) setTimeout(() => update({ quizSelected: null, quizResult: null }), 900);
  };

  const startBlend = () => {
    update({ blendStage: 1 });
    setTimeout(() => update({ blendStage: 2 }), 700);
  };

  const advanceAndComplete = () => {
    const activeId = state.activeProfileId;
    const current = getActiveProfile();
    const newProgress = Math.min(current.progressIndex + 1, adventureSteps.length);
    update((s) => ({
      profiles: s.profiles.map((p) => (p.id === activeId ? { ...p, progressIndex: newProgress } : p)),
      screen: 'completion',
    }));
    updateChildProfileProgress(activeId, newProgress).catch((e) =>
      console.error('No se pudo guardar el progreso', e),
    );
    // A "checkpoint" is crossing a full phase boundary (or finishing the
    // whole prototype adventure) in this simple letters/syllables/words map.
    const crossedCheckpoint = phaseRanges.some((p) => p.start + p.total === newProgress);
    if (crossedCheckpoint) {
      awardCoins(COIN_REWARDS.checkpoint, 'checkpoint', '¡Súper logro desbloqueado!');
    }
  };
  const continueFromCompletion = () => update({ screen: 'home' });

  const goToRecommended = () => {
    const progressIndex = getActiveProfile().progressIndex;
    const step = adventureSteps[progressIndex];
    if (!step) { update({ screen: 'home' }); return; }
    openLevel(step.type, step.id);
  };

  const buildLevelItem = (kind, data, index, progressIndex) => {
    const status = stepStatus(index, progressIndex);
    const styles = {
      done: { cardBorder: 'oklch(76% 0.15 155)', opacity: 1, label: '' },
      current: { cardBorder: 'oklch(68% 0.14 235)', opacity: 1, label: 'Actual' },
      locked: { cardBorder: 'oklch(89% 0.02 235)', opacity: 0.5, label: 'Bloqueado' },
    }[status];
    let sub;
    if (kind === 'letter') sub = data.sound;
    else if (kind === 'syllable') sub = `${getLetter(data.partIds[0]).char} + ${getLetter(data.partIds[1]).char}`;
    else sub = `${getSyllable(data.partIds[0]).text} + ${getSyllable(data.partIds[1]).text}`;
    return {
      main: data.char || data.text,
      sub,
      cardBorder: styles.cardBorder,
      opacity: styles.opacity,
      statusLabel: styles.label,
      onSelect: () => openLevel(kind, data.id, status === 'locked'),
    };
  };

  // ---- derived values (mirrors the original prototype's renderVals) ----
  const profile = getActiveProfile();
  const progressIndex = profile.progressIndex || 0;
  const total = adventureSteps.length;
  const appComplete = progressIndex >= total;
  const percent = Math.round((progressIndex / total) * 100);
  const doneSteps = adventureSteps.slice(0, progressIndex);
  const lettersDoneCount = doneSteps.filter((x) => x.type === 'letter').length;
  const syllablesDoneCount = doneSteps.filter((x) => x.type === 'syllable').length;
  const wordsDoneCount = doneSteps.filter((x) => x.type === 'word').length;

  const practiceSeconds = profile.practiceSeconds || 0;
  const practiceDaysCount = (profile.practiceDays || []).length;
  const practiceHours = Math.floor(practiceSeconds / 3600);
  const practiceMinutes = Math.floor((practiceSeconds % 3600) / 60);
  const practiceTimeLabel =
    practiceSeconds < 60
      ? 'Menos de 1min'
      : practiceHours > 0
        ? `${practiceHours}h ${practiceMinutes}min`
        : `${practiceMinutes}min`;
  const practiceDaysLabel = `${practiceDaysCount} ${practiceDaysCount === 1 ? 'día' : 'días'}`;

  const tempAvatarEmoji = getAvatar(state.tempAvatarId).emoji;

  let missionIcon = '🏆';
  let missionLabel = '¡Completaste tu aventura!';
  if (!appComplete) {
    const step = adventureSteps[progressIndex];
    if (step.type === 'letter') {
      const l = getLetter(step.id);
      missionIcon = '🔤';
      missionLabel = `Aprender el sonido de ${l.char}`;
    } else if (step.type === 'syllable') {
      const sy = getSyllable(step.id);
      const l1 = getLetter(sy.partIds[0]);
      const l2 = getLetter(sy.partIds[1]);
      missionIcon = `${l1.char}${l2.char}`;
      missionLabel = `Juntar ${l1.char} + ${l2.char}`;
    } else {
      missionIcon = '📖';
      missionLabel = 'Formar una palabra';
    }
  }

  const activePhase = state.activePhase || 1;
  const phaseData = {
    1: { title: 'Sonidos de las letras', icon: phaseBadges[1], levels: letters.map((l) => buildLevelItem('letter', l, adventureIndexFor('letter', l.id), progressIndex)) },
    2: { title: 'Sílabas simples', icon: phaseBadges[2], levels: syllables.filter((sy) => sy.group === 'simple').map((sy) => buildLevelItem('syllable', sy, adventureIndexFor('syllable', sy.id), progressIndex)) },
    3: { title: 'Sílabas complejas', icon: phaseBadges[3], levels: syllables.filter((sy) => sy.group === 'complex').map((sy) => buildLevelItem('syllable', sy, adventureIndexFor('syllable', sy.id), progressIndex)) },
    4: { title: 'Primeras palabras', icon: phaseBadges[4], levels: words.map((w) => buildLevelItem('word', w, adventureIndexFor('word', w.id), progressIndex)) },
  }[activePhase];

  const phaseRanges = [
    { num: 1, title: 'Sonidos de las letras', total: 5, start: 0 },
    { num: 2, title: 'Sílabas simples', total: 2, start: 5 },
    { num: 3, title: 'Sílabas complejas', total: 2, start: 7 },
    { num: 4, title: 'Primeras palabras', total: 2, start: 9 },
  ];
  // level 1 sits at the bottom of the map, level 4 at the top
  const nodePositions = [{ left: 190, top: 590 }, { left: 40, top: 400 }, { left: 190, top: 210 }, { left: 40, top: 20 }];
  const connectorGeom = [
    { left: 130, top: 118, width: 124, angle: 50.2 },
    { left: 210, top: 298, width: 124, angle: 129.8 },
    { left: 130, top: 478, width: 124, angle: 50.2 },
  ];
  const connectorForIndex = [connectorGeom[2], connectorGeom[1], connectorGeom[0], null];
  const phasesSummary = phaseRanges.map((p, i) => {
    const doneCount = Math.max(0, Math.min(p.total, progressIndex - p.start));
    const status = progressIndex > p.start + p.total - 1 ? 'done' : progressIndex >= p.start ? 'current' : 'locked';
    const borderColor = status === 'done' ? 'oklch(76% 0.15 155)' : status === 'current' ? 'oklch(68% 0.14 235)' : 'oklch(89% 0.02 250)';
    const conn = connectorForIndex[i];
    return {
      ...p,
      doneCount,
      status,
      borderColor,
      isLocked: status === 'locked',
      isUnlocked: status !== 'locked',
      badgeText: phaseBadges[p.num],
      nodeBg: status === 'locked' ? 'oklch(90% 0.008 250)' : '#fff',
      pulseAnim: status === 'current' ? 'glowPulse 2s ease-in-out infinite' : 'none',
      nodeLeft: nodePositions[i].left,
      nodeTop: nodePositions[i].top,
      hasConnector: !!conn,
      connLeft: conn ? conn.left : 0,
      connTop: conn ? conn.top : 0,
      connWidth: conn ? conn.width : 0,
      connAngle: conn ? conn.angle : 0,
      onSelect: () => openPhaseDetailWithTransition(p.num, status === 'locked'),
    };
  });

  // Each achievement keeps its own emoji even when locked — locked ones are
  // just rendered dimmed/grayscale (with a small lock badge) in Achievements.jsx,
  // instead of being replaced by a generic 🔒.
  const achievements = [
    { icon: '🔤', title: 'Mi primera letra', unlocked: lettersDoneCount >= 1 },
    { icon: '🔗', title: 'Mi primera sílaba', unlocked: syllablesDoneCount >= 1 },
    { icon: '📖', title: 'Mi primera palabra', unlocked: wordsDoneCount >= 1 },
    { icon: '🎯', title: 'Todos los sonidos', unlocked: lettersDoneCount >= 5 },
    { icon: '🧠', title: 'Todas las sílabas', unlocked: syllablesDoneCount >= 4 },
    { icon: '🏆', title: '¡Aventura completa!', unlocked: appComplete },
  ];

  const currentLetter = getLetter(state.currentItemId) || letters[0];
  const quizOptions = (state.quizOptions || []).map((o) => ({
    ...o,
    borderColor: state.quizSelected === o.id ? (state.quizResult === 'correct' ? 'oklch(76% 0.15 155)' : 'oklch(70% 0.15 30)') : 'oklch(93% 0.02 235)',
    onSelect: () => selectAnswer(o.id),
  }));

  let blendPart1 = {}, blendPart2 = {}, blendResult = {}, blendSyl1 = {}, blendSyl2 = {}, blendWordResult = {};
  if (state.currentItemType === 'syllable') {
    const sy = getSyllable(state.currentItemId) || syllables[0];
    blendPart1 = getLetter(sy.partIds[0]);
    blendPart2 = getLetter(sy.partIds[1]);
    blendResult = sy;
  }
  if (state.currentItemType === 'word') {
    const w = getWord(state.currentItemId) || words[0];
    blendSyl1 = getSyllable(w.partIds[0]);
    blendSyl2 = getSyllable(w.partIds[1]);
    blendWordResult = w;
  }
  const blendGap = state.blendStage === 0 ? 70 : state.blendStage === 1 ? 6 : 0;

  let completionSubtitle = '';
  let completionButtonLabel = 'Siguiente';
  if (state.currentItemType === 'letter') completionSubtitle = `Hoy aprendiste el sonido de ${currentLetter.char}.`;
  else if (state.currentItemType === 'syllable') completionSubtitle = `Hoy aprendiste ${(getSyllable(state.currentItemId) || {}).text}.`;
  else if (state.currentItemType === 'word') completionSubtitle = `¡Hoy leíste ${(getWord(state.currentItemId) || {}).text}!`;
  if (appComplete) completionButtonLabel = 'Volver al inicio';

  const learningNow = !appComplete ? [missionLabel] : [];
  const masteredList = doneSteps.map((step) =>
    step.type === 'letter' ? getLetter(step.id).char : step.type === 'syllable' ? getSyllable(step.id).text : getWord(step.id).text,
  );

  const profileCards = state.profiles
    .filter((p) => p.id !== state.activeProfileId)
    .concat(state.profiles.filter((p) => p.id === state.activeProfileId))
    .map((p) => ({
      ...p,
      emoji: getAvatar(p.avatarId).emoji,
      level: Math.max(1, p.progressIndex + 1),
      borderColor: p.id === state.activeProfileId ? 'oklch(68% 0.14 235)' : 'oklch(93% 0.02 235)',
    }));

  const economy = { ...DEFAULT_ECONOMY, ...(profile.economy || {}) };

  const screen = state.screen;
  const showBottomNav = NAV_SCREENS.includes(screen);

  let ScreenView = null;
  switch (screen) {
    case 'ob1':
      ScreenView = <Onboarding1 goEmpezar={goEmpezar} />;
      break;
    case 'ob2':
      ScreenView = <Onboarding2 tempName={state.tempName} setTempName={setTempName} confirmName={confirmName} />;
      break;
    case 'ob3':
      ScreenView = (
        <Onboarding3
          tempName={state.tempName}
          tempAvatarId={state.tempAvatarId}
          setTempAvatarId={setTempAvatarId}
          confirmAvatar={confirmAvatar}
        />
      );
      break;
    case 'ob4':
      ScreenView = <Onboarding4 tempAvatarEmoji={tempAvatarEmoji} finishOnboarding={finishOnboarding} />;
      break;
    case 'login':
      ScreenView = <Login onLoginSuccess={onLoginSuccess} />;
      break;
    case 'profile-switcher':
      ScreenView = (
        <ProfileSwitcher
          profileCards={profileCards}
          switchProfile={switchProfile}
          addProfile={addProfile}
          canAddProfile={state.profiles.length < 2}
        />
      );
      break;
    case 'home':
      ScreenView = (
        <Home
          profileEmoji={getAvatar(profile.avatarId).emoji}
          activeAvatarId={economy.activeAvatarId || profile.avatarId}
          equippedItems={economy.equippedItems}
          profileName={profile.name}
          goProfile={goProfile}
          missionIcon={missionIcon}
          missionLabel={missionLabel}
          goToRecommended={goToRecommended}
          progressPercent={percent}
          lettersDoneCount={lettersDoneCount}
          syllablesDoneCount={syllablesDoneCount}
          wordsDoneCount={wordsDoneCount}
          goAchievements={goAchievements}
          achievementsPreview={achievements}
          coins={economy.coins}
          coinBumpAmount={state.coinBumpAmount}
          coinBumpKey={state.coinBumpKey}
          goTienda={goTienda}
        />
      );
      break;
    case 'adventure':
      ScreenView = (
        <Adventure phasesSummary={phasesSummary} lockedMessage={state.lockedMessage} lockedToastVisible={state.lockedToastVisible} />
      );
      break;
    case 'achievements':
      ScreenView = <Achievements achievements={achievements} />;
      break;
    case 'profile':
      ScreenView = (
        <Profile
          profileEmoji={getAvatar(profile.avatarId).emoji}
          profileName={profile.name}
          level={Math.max(1, progressIndex + 1)}
          goAdventure={goAdventure}
          goAchievements={goAchievements}
          goSettings={goSettings}
          goHelp={goHelp}
          goProfileSwitcher={goProfileSwitcher}
          startParentGate={startParentGate}
          logOut={logOut}
          activeAvatarId={economy.activeAvatarId || profile.avatarId}
          equippedItems={economy.equippedItems}
          coins={economy.coins}
          goTienda={goTienda}
        />
      );
      break;
    case 'settings':
      ScreenView = <Settings goProfile={goProfile} soundOn={state.soundOn} toggleSound={toggleSound} />;
      break;
    case 'help':
      ScreenView = <Help goProfile={goProfile} />;
      break;
    case 'parent-gate':
      ScreenView = (
        <ParentGate
          goProfile={goProfile}
          mathA={state.mathA}
          mathB={state.mathB}
          mathInput={state.mathInput}
          setMathInput={setMathInput}
          mathError={state.mathError}
          checkParentGate={checkParentGate}
        />
      );
      break;
    case 'parent-dashboard':
      ScreenView = (
        <ParentDashboard
          goProfile={goProfile}
          profileName={profile.name}
          progressPercent={percent}
          lettersDoneCount={lettersDoneCount}
          syllablesDoneCount={syllablesDoneCount}
          wordsDoneCount={wordsDoneCount}
          learningNow={learningNow}
          masteredList={masteredList}
          practiceTimeLabel={practiceTimeLabel}
          practiceDaysLabel={practiceDaysLabel}
        />
      );
      break;
    case 'phase-detail':
      ScreenView = (
        <PhaseDetail
          goAdventure={backFromPhaseDetail}
          activePhase={activePhase}
          currentPhaseIcon={phaseData.icon}
          currentPhaseTitle={phaseData.title}
          currentPhaseLevels={phaseData.levels}
          phase1Days={phase1Days}
          phase1DoneLetters={profile.phase1DoneLetters || 0}
          openPhase1Letter={openPhase1Letter}
          lockedMessage={state.lockedMessage}
          lockedToastVisible={state.lockedToastVisible}
        />
      );
      break;
    case 'phase1-letter-activity': {
      const seqItem = phase1LetterSequence[state.phase1ActiveIndex] || phase1LetterSequence[0];
      ScreenView = (
        <Phase1LetterActivity
          day={seqItem.day}
          letter={seqItem}
          onComplete={completePhase1Letter}
          onClose={exitPhase1Letter}
          onMiniActivity={onPhase1MiniActivity}
        />
      );
      break;
    }
    case 'letter-learn':
      ScreenView = (
        <LetterLearn
          goToPhaseDetail={goToPhaseDetail}
          currentLetter={currentLetter}
          isPlaying={state.isPlaying}
          playSound={playSound}
          continueFromLearn={continueFromLearn}
        />
      );
      break;
    case 'letter-activity':
      ScreenView = (
        <LetterActivity
          goToLearn={goToLearn}
          currentLetter={currentLetter}
          playSound={playSound}
          quizOptions={quizOptions}
          showCorrectFeedback={state.quizResult === 'correct'}
          showWrongFeedback={state.quizResult === 'wrong'}
          advanceAndComplete={advanceAndComplete}
        />
      );
      break;
    case 'phase2-blend':
      ScreenView = (
        <SyllableBlend
          goToPhaseDetail={goToPhaseDetail}
          currentPhaseTitle={phaseData.title}
          blendNotMerged={state.blendStage < 2}
          blendMerged={state.blendStage === 2}
          blendGap={blendGap}
          blendPart1={blendPart1}
          blendPart2={blendPart2}
          blendResult={blendResult}
          startBlend={startBlend}
          advanceAndComplete={advanceAndComplete}
        />
      );
      break;
    case 'phase3-blend':
      ScreenView = (
        <WordBlend
          goToPhaseDetail={goToPhaseDetail}
          blendNotMerged={state.blendStage < 2}
          blendMerged={state.blendStage === 2}
          blendGap={blendGap}
          blendSyl1={blendSyl1}
          blendSyl2={blendSyl2}
          blendWordResult={blendWordResult}
          startBlend={startBlend}
          advanceAndComplete={advanceAndComplete}
        />
      );
      break;
    case 'completion':
      ScreenView = (
        <Completion
          profileName={profile.name}
          completionSubtitle={completionSubtitle}
          completionButtonLabel={completionButtonLabel}
          continueFromCompletion={continueFromCompletion}
        />
      );
      break;
    case 'tienda':
      ScreenView = (
        <Tienda
          goBack={closeTienda}
          coins={economy.coins}
          activeAvatarId={economy.activeAvatarId || profile.avatarId}
          equippedItems={economy.equippedItems}
          unlockedAvatars={economy.unlockedAvatars}
          profileAvatarId={profile.avatarId}
          inventory={economy.inventory}
          onBuyItem={buyShopItem}
          onEquipItem={equipShopItem}
          onUnequipItem={unequipShopItem}
        />
      );
      break;
    default:
      ScreenView = null;
  }

  if (state.authChecking) {
    return (
      <div className="app-stage">
        <div className="phone-frame">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-onboarding)' }}>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: 'var(--color-text-strong)' }}>
              Cargando…
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-stage">
      <div className="phone-frame">
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>{ScreenView}</div>
        {showBottomNav && (
          <BottomNav
            active={screen}
            onNavigate={(key) => {
              if (key === 'home') goHome();
              if (key === 'adventure') goAdventure();
              if (key === 'achievements') goAchievements();
              if (key === 'profile') goProfile();
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-primary)',
            opacity: state.transitionOpacity,
            transition: 'opacity 0.35s ease',
            pointerEvents: 'none',
            zIndex: 999,
          }}
        />
        <UpdatePrompt visible={state.updateAvailable} onUpdate={applyUpdate} />
        <RewardModal
          open={state.rewardOpen}
          amount={state.rewardAmount}
          kind={state.rewardKind}
          subtitle={state.rewardSubtitle}
          onContinue={closeReward}
        />
        {state.reviewGateVariant === 'checkpoint' ? (
          <CheckpointView
            open={state.reviewGateOpen}
            letterMastery={getReviewState(profile).mastery}
            learnedLetterIds={phase1LetterSequence.slice(0, state.reviewGatePendingIndex ?? 0).map((l) => l.id)}
            currentDay={state.reviewGateDay}
            onAnswer={handleReviewAnswer}
            onComplete={handleReviewGateComplete}
          />
        ) : (
          <CalentamientoModal
            open={state.reviewGateOpen}
            letterMastery={getReviewState(profile).mastery}
            learnedLetterIds={phase1LetterSequence.slice(0, state.reviewGatePendingIndex ?? 0).map((l) => l.id)}
            currentDay={state.reviewGateDay}
            onAnswer={handleReviewAnswer}
            onComplete={handleReviewGateComplete}
            coinsReward={COIN_REWARDS.warmup}
          />
        )}
      </div>
    </div>
  );
}
