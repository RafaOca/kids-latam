import { useEffect, useRef, useState } from 'react';
import {
  supabase,
  fetchChildProfiles,
  createChildProfile,
  updateChildProfileProgress,
} from './lib/supabaseClient.js';
import {
  phaseBadges,
  letters,
  syllables,
  words,
  adventureSteps,
  avatars,
  getLetter,
  getSyllable,
  getWord,
  getAvatar,
  adventureIndexFor,
  stepStatus,
} from './data.js';

import BottomNav from './components/BottomNav.jsx';

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
import LetterLearn from './screens/LetterLearn.jsx';
import LetterActivity from './screens/LetterActivity.jsx';
import SyllableBlend from './screens/SyllableBlend.jsx';
import WordBlend from './screens/WordBlend.jsx';
import Completion from './screens/Completion.jsx';

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
};

export default function App() {
  const [state, setState] = useState(initialState);
  const transTimer1 = useRef(null);
  const transTimer2 = useRef(null);

  const update = (partial) =>
    setState((s) => ({ ...s, ...(typeof partial === 'function' ? partial(s) : partial) }));

  // ---- auth (Supabase) ----
  const loadProfilesAndEnter = async (session) => {
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
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const session = data.session;
      if (session) {
        loadProfilesAndEnter(session);
      } else {
        update({ authChecking: false, userEmail: null, screen: 'login' });
      }
    });

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

  const getActiveProfile = () =>
    state.profiles.find((p) => p.id === state.activeProfileId) || { name: '', avatarId: 'perro', progressIndex: 0 };

  // ---- navigation ----
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
    supabase.auth.signOut();
  };

  // ---- parent gate ----
  const startParentGate = () => {
    const a = 12 + Math.floor(Math.random() * 30);
    const b = 12 + Math.floor(Math.random() * 30);
    update({ mathA: a, mathB: b, mathInput: '', mathError: false, screen: 'parent-gate' });
  };
  const setMathInput = (value) => update({ mathInput: value });
  const checkParentGate = () => {
    update((s) => {
      if (parseInt(s.mathInput, 10) === s.mathA + s.mathB) {
        return { screen: 'parent-dashboard' };
      }
      const a = 12 + Math.floor(Math.random() * 30);
      const b = 12 + Math.floor(Math.random() * 30);
      return { mathA: a, mathB: b, mathInput: '', mathError: true };
    });
  };

  // ---- levels ----
  const goToPhaseDetail = () => update({ screen: 'phase-detail', lockedToastVisible: false });
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
    update({ lockedToastVisible: false });
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

  const achievements = [
    { icon: lettersDoneCount >= 1 ? '🏆' : '🔒', title: 'Mi primera letra', unlocked: lettersDoneCount >= 1 },
    { icon: syllablesDoneCount >= 1 ? '🏆' : '🔒', title: 'Mi primera sílaba', unlocked: syllablesDoneCount >= 1 },
    { icon: wordsDoneCount >= 1 ? '🏆' : '🔒', title: 'Mi primera palabra', unlocked: wordsDoneCount >= 1 },
    { icon: lettersDoneCount >= 5 ? '⭐' : '🔒', title: 'Todos los sonidos', unlocked: lettersDoneCount >= 5 },
    { icon: syllablesDoneCount >= 4 ? '⭐' : '🔒', title: 'Todas las sílabas', unlocked: syllablesDoneCount >= 4 },
    { icon: appComplete ? '🌟' : '🔒', title: '¡Aventura completa!', unlocked: appComplete },
  ].map((a) => ({ ...a, opacity: a.unlocked ? 1 : 0.45 }));

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
        />
      );
      break;
    case 'phase-detail':
      ScreenView = (
        <PhaseDetail
          goAdventure={goAdventure}
          currentPhaseIcon={phaseData.icon}
          currentPhaseTitle={phaseData.title}
          currentPhaseLevels={phaseData.levels}
          lockedMessage={state.lockedMessage}
          lockedToastVisible={state.lockedToastVisible}
        />
      );
      break;
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
      </div>
    </div>
  );
}
