import { useEffect, useRef, useState } from 'react';
import { IconButton } from '../components/Button.jsx';
import { getPhase1LetterByChar } from '../data.js';
import {
  ArrowButton,
  DotsNav,
  DragHint,
  TrackConfetti,
  LetterVideo,
  SoundMouthButton,
  SustainTrack,
  playAudio,
} from './Phase1LetterActivity.jsx';

// Phase 2 syllable activity (first prototype: AI). Steps:
//   1. intro video (placeholder for now — tap it to "play")
//   2. two-column sound sustain (first letter left, second letter right,
//      3 rows each; unlocks row by row: left, right, next row, ...)
//   3. second video (must be played to continue)
//   4. blend: A walks toward a fixed I; when they meet they fuse into the
//      syllable, which the child drags to the end. 4 rows, I gets closer
//      to A each time (last row starts already fused).
const LEVEL_COUNT = 4;

// Lesson videos (levels 1 & 2): F1 = intro (step 1), F2 = after the sound
// join (step 3). AI and MA have their own; every other syllable shares the
// general pair.
const VIDEO_BASE = 'https://pub-623e600528b64744950e64473c52a95c.r2.dev';
const SYLLABLE_VIDEOS = {
  AI: { f1: `${VIDEO_BASE}/M2-F1-AI.mp4`, f2: `${VIDEO_BASE}/M2-F2-AI.mp4` },
  MA: { f1: `${VIDEO_BASE}/M2-F1-MA.mp4`, f2: `${VIDEO_BASE}/M2-F2-MA.mp4` },
};
const GENERAL_VIDEOS = { f1: `${VIDEO_BASE}/M2-F1-G.mp4`, f2: `${VIDEO_BASE}/M2-F2-G.mp4` };
const videosFor = (syllable) => SYLLABLE_VIDEOS[syllable] || GENERAL_VIDEOS;
const ROWS = 3;
const DONE_AT = 0.95;

export const titleStyle = {
  fontFamily: "'Fredoka', sans-serif",
  fontWeight: 700,
  fontSize: 22,
  color: 'var(--color-text-strong)',
};

// Stand-in for the real intro video: a tappable placeholder that counts as
// "played" so the watch-to-advance gate can already be exercised.
export function PlayablePlaceholder({ label, played, onPlay, shake }) {
  return (
    <div
      onClick={onPlay}
      className="pressable"
      style={{
        width: '100%',
        aspectRatio: '16 / 10',
        borderRadius: 'var(--radius-xl)',
        background: played ? 'var(--color-primary-tint)' : 'oklch(90% 0.008 250)',
        border: `2px dashed ${played ? 'var(--color-primary)' : 'oklch(78% 0.02 250)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        color: 'var(--color-text-muted)',
        cursor: 'pointer',
        animation: shake ? 'shakeX 0.4s' : undefined,
      }}
    >
      <div style={{ fontSize: 40 }}>{played ? '✅' : '▶️'}</div>
      <div style={{ fontSize: 12, fontWeight: 600 }}>{played ? 'Video visto' : label}</div>
    </div>
  );
}

export function LevelVideoIntro({ syllable, played, onPlay, shake, src }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>Sílaba</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 48, color: 'var(--color-text-strong)' }}>
        {syllable}
      </div>
      {src ? (
        <div style={{ width: '100%', animation: shake ? 'shakeX 0.4s' : undefined }}>
          <LetterVideo src={src} onPlay={onPlay} />
        </div>
      ) : (
        <PlayablePlaceholder label="Video (próximamente) · toca para reproducir" played={played} onPlay={onPlay} shake={shake} />
      )}
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
        Mira el video para aprender a juntar los sonidos
      </div>
    </div>
  );
}

function LevelJoin({ letters, progress, setProgress, activeIndex, hintDone, markHintDone, shakeTrack, audioPlayed, onAudioPlay }) {
  // Row-major grid: [soundA, soundB, track(0,A), track(0,B), track(1,A), ...]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
      <div style={titleStyle}>Une los sonidos</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14, rowGap: 0, width: '100%' }}>
        {letters.map((letter, c) => (
          <div key={`btn-${c}`} style={{ display: 'flex', justifyContent: 'center' }}>
            <SoundMouthButton
              letter={letter}
              played={audioPlayed[c]}
              onPlay={() => onAudioPlay(c)}
              size={124}
            />
          </div>
        ))}
        {Array.from({ length: ROWS }).flatMap((_, r) =>
          letters.map((letter, c) => {
            const k = r * 2 + c;
            const isActive = k === activeIndex;
            return (
              <div
                key={k}
                style={{
                  marginTop: r === 0 ? 84 : 78,
                  padding: '0 2px',
                  borderRadius: 999,
                  animation: isActive ? 'glowPulse 1.8s ease-in-out infinite' : undefined,
                }}
              >
                <SustainTrack
                  letter={letter}
                  progress={progress[r][c]}
                  setProgress={(v) => setProgress(r, c, v)}
                  active={isActive}
                  done={progress[r][c] >= DONE_AT}
                  locked={k > activeIndex}
                  shakeTrack={shakeTrack && isActive}
                  showHint={isActive && !hintDone[k]}
                  onFirstDrag={() => markHintDone(k)}
                  guideSize={56}
                  hintTravel="min(34vw, 110px)"
                />
              </div>
            );
          }),
        )}
      </div>

      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 8 }}>
        Arrastra para sostener cada sonido · {Math.min(activeIndex, ROWS * 2)}/{ROWS * 2}
      </div>
    </div>
  );
}

function LevelVideoJoin({ src, onPlay, shake }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      <div style={titleStyle}>Juntando los sonidos</div>
      <div style={{ width: '100%', animation: shake ? 'shakeX 0.4s' : undefined }}>
        <LetterVideo src={src} onPlay={onPlay} />
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
        Mira el video para continuar
      </div>
    </div>
  );
}

// Where the fixed second letter sits on each of the 4 blend rows (fraction
// of the track). The last row is 0: both letters start fused.
const DROP_POINTS = [0.5, 0.34, 0.2, 0];

function BlendTrack({ letters, syllable, dropAt, progress, setProgress, active, done, locked, shake, showHint, onFirstDrag }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [merged, setMerged] = useState(dropAt === 0);
  const [celebrate, setCelebrate] = useState(false);
  const prevDoneRef = useRef(done);

  useEffect(() => {
    if (!merged && progress >= dropAt) setMerged(true);
  }, [progress, dropAt, merged]);

  useEffect(() => {
    if (done && !prevDoneRef.current) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 900);
      prevDoneRef.current = done;
      return () => clearTimeout(t);
    }
    prevDoneRef.current = done;
    return undefined;
  }, [done]);

  const update = (clientX) => {
    if (locked || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    setProgress(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  };

  const handleW = merged ? 66 : 50;
  const bubble = {
    position: 'absolute',
    top: '50%',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 800,
    border: '3px solid var(--color-primary)',
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        padding: '4px 30px',
        opacity: locked ? 0.4 : 1,
        transition: 'opacity var(--duration-base) var(--ease-standard)',
        animation: shake ? 'shakeX 0.4s' : undefined,
      }}
    >
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          width: '100%',
          height: 38,
          borderRadius: 999,
          background: 'oklch(90% 0.008 250)',
          border: `2px solid ${done ? 'var(--color-primary)' : 'oklch(88% 0.02 250)'}`,
          boxShadow: 'inset 0 2px 4px oklch(0% 0 0 / 0.08)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, borderRadius: 999, overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, var(--color-primary-tint), var(--color-primary))',
              transition: dragging ? 'none' : 'width var(--duration-base) var(--ease-standard)',
            }}
          />
        </div>

        {showHint && <DragHint travel="min(58vw, 200px)" />}

        {!merged && (
          <div
            style={{
              ...bubble,
              left: `${dropAt * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: 50,
              height: 50,
              background: 'var(--color-primary-tint)',
              fontSize: 22,
              color: 'var(--color-primary-dark)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {letters[1].char}
          </div>
        )}

        <div
          onPointerDown={(e) => {
            if (locked) return;
            onFirstDrag?.();
            setDragging(true);
            e.target.setPointerCapture?.(e.pointerId);
            update(e.clientX);
          }}
          onPointerMove={(e) => dragging && update(e.clientX)}
          onPointerUp={() => setDragging(false)}
          className="pressable"
          style={{
            ...bubble,
            left: `calc(${progress * 100}% - ${handleW / 2}px)`,
            transform: 'translateY(-50%)',
            width: handleW,
            height: 50,
            borderRadius: merged ? 25 : '50%',
            background: done ? 'var(--color-primary-tint)' : '#fff',
            boxShadow: 'var(--shadow-elevated)',
            fontSize: merged ? 20 : 22,
            color: 'var(--color-primary-dark)',
            cursor: locked ? 'default' : 'grab',
            touchAction: 'none',
            zIndex: 2,
            transition: dragging ? 'none' : 'left var(--duration-base) var(--ease-standard)',
          }}
        >
          {merged ? syllable : letters[0].char}
        </div>
      </div>
      {celebrate && <TrackConfetti />}
    </div>
  );
}

function LevelBlend({ letters, syllable, progress, setProgress, activeIndex, hintDone, markHintDone, shake, audioPlayed, onAudioPlay }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
      <div style={titleStyle}>Forma la sílaba</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14, width: '100%' }}>
        {letters.map((letter, c) => (
          <div key={c} style={{ display: 'flex', justifyContent: 'center' }}>
            <SoundMouthButton letter={letter} played={audioPlayed[c]} onPlay={() => onAudioPlay(c)} size={124} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, width: '100%', marginTop: 16 }}>
        {DROP_POINTS.map((dropAt, r) => (
          <div
            key={r}
            style={{ borderRadius: 999, animation: r === activeIndex ? 'glowPulse 1.8s ease-in-out infinite' : undefined }}
          >
            <BlendTrack
              letters={letters}
              syllable={syllable}
              dropAt={dropAt}
              progress={progress[r]}
              setProgress={(v) => setProgress(r, v)}
              active={r === activeIndex}
              done={progress[r] >= DONE_AT}
              locked={r > activeIndex}
              shake={shake && r === activeIndex}
              showHint={r === activeIndex && !hintDone[r]}
              onFirstDrag={() => markHintDone(r)}
            />
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
        Arrastra la {letters[0].char} hasta la {letters[1].char} y llévalas juntas hasta el final · {Math.min(activeIndex, DROP_POINTS.length)}/{DROP_POINTS.length}
      </div>
    </div>
  );
}

export default function SyllableActivity({ syllable, onComplete, onClose, onMiniActivity }) {
  const letters = syllable.split('').map((ch) => getPhase1LetterByChar(ch));

  const [level, setLevel] = useState(0);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [progress, setProgressState] = useState(() => Array.from({ length: ROWS }, () => [0, 0]));
  const [hintDone, setHintDone] = useState(() => Array(ROWS * 2).fill(false));
  const [audioPlayed, setAudioPlayed] = useState([false, false]);
  const [videoWatched, setVideoWatched] = useState(false);
  const [blendProgress, setBlendProgress] = useState(() => DROP_POINTS.map(() => 0));
  const [blendHintDone, setBlendHintDone] = useState(() => DROP_POINTS.map(() => false));
  const [shakeTarget, setShakeTarget] = useState(null);
  const awardedRef = useRef(false);
  const advancingRef = useRef(false);

  useEffect(() => {
    advancingRef.current = false;
  }, [level]);

  const setProgress = (r, c, v) =>
    setProgressState((rows) => rows.map((row, ri) => (ri === r ? row.map((x, ci) => (ci === c ? v : x)) : row)));
  const flat = progress.flatMap((row) => row);
  const activeIndex = (() => {
    const idx = flat.findIndex((p) => p < DONE_AT);
    return idx === -1 ? flat.length : idx;
  })();

  const blendActiveIndex = (() => {
    const idx = blendProgress.findIndex((p) => p < DONE_AT);
    return idx === -1 ? blendProgress.length : idx;
  })();

  const gateOk = [introPlayed, activeIndex >= flat.length, videoWatched, blendActiveIndex >= blendProgress.length];
  const unlockedCount = (() => {
    let n = 0;
    for (const ok of gateOk) {
      if (!ok) break;
      n += 1;
    }
    return n;
  })();

  const triggerShake = (target) => {
    setShakeTarget(target);
    setTimeout(() => setShakeTarget(null), 420);
  };

  const goNext = () => {
    if (!gateOk[level]) {
      triggerShake(level);
      return;
    }
    if (advancingRef.current) return;
    advancingRef.current = true;
    if (level === 1 && !awardedRef.current) {
      awardedRef.current = true;
      onMiniActivity?.();
    }
    if (level === LEVEL_COUNT - 1) {
      onComplete();
      return;
    }
    setLevel((l) => Math.min(LEVEL_COUNT - 1, l + 1));
  };

  const goPrev = () => {
    if (level === 0) {
      onClose();
      return;
    }
    setLevel((l) => Math.max(0, l - 1));
  };

  return (
    <div style={{ padding: '58px 20px 24px', position: 'relative', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={onClose}>✕</IconButton>
        <DotsNav level={level} unlockedCount={unlockedCount} levelCount={LEVEL_COUNT} />
        <div style={{ width: 44 }} />
      </div>

      <div style={{ marginTop: 28 }}>
        {level === 0 && (
          <LevelVideoIntro syllable={syllable} src={videosFor(syllable).f1} played={introPlayed} onPlay={() => setIntroPlayed(true)} shake={shakeTarget === 0} />
        )}
        {level === 1 && (
          <LevelJoin
            letters={letters}
            progress={progress}
            setProgress={setProgress}
            activeIndex={activeIndex}
            hintDone={hintDone}
            markHintDone={(k) => setHintDone((h) => h.map((x, i) => (i === k ? true : x)))}
            shakeTrack={shakeTarget === 1}
            audioPlayed={audioPlayed}
            onAudioPlay={(c) => {
              playAudio(letters[c].audio);
              setAudioPlayed((a) => a.map((x, i) => (i === c ? true : x)));
            }}
          />
        )}
        {level === 2 && <LevelVideoJoin src={videosFor(syllable).f2} onPlay={() => setVideoWatched(true)} shake={shakeTarget === 2} />}
        {level === 3 && (
          <LevelBlend
            letters={letters}
            syllable={syllable}
            progress={blendProgress}
            setProgress={(r, v) => setBlendProgress((arr) => arr.map((x, i) => (i === r ? v : x)))}
            activeIndex={blendActiveIndex}
            hintDone={blendHintDone}
            markHintDone={(r) => setBlendHintDone((h) => h.map((x, i) => (i === r ? true : x)))}
            shake={shakeTarget === 3}
            audioPlayed={audioPlayed}
            onAudioPlay={(c) => {
              playAudio(letters[c].audio);
              setAudioPlayed((a) => a.map((x, i) => (i === c ? true : x)));
            }}
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
        <ArrowButton dir="prev" onClick={goPrev} />
        <ArrowButton dir="next" onClick={goNext} shake={shakeTarget === level} />
      </div>
    </div>
  );
}
