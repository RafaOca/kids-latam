import { useEffect, useRef, useState } from 'react';
import { IconButton } from '../components/Button.jsx';
import { getPhase1LetterByChar } from '../data.js';
import {
  ArrowButton,
  Balloon,
  BalloonBurst,
  BALLOON_PALETTE,
  DotsNav,
  DragHint,
  LetterVideo,
  SoundMouthButton,
  SustainTrack,
  TrackConfetti,
  VIDEO2_GENERAL_BALLOON,
  VIDEO2_GENERAL_DRAG,
  playAudio,
} from './Phase1LetterActivity.jsx';
import { LevelVideoIntro, titleStyle } from './SyllableActivity.jsx';

// Phase 2 · Level 3 syllable activity (consonant balloon + vowel), first
// prototype: PA. Six steps:
//   1. intro video (placeholder)            2. balloon (left) + sustain (right)
//   3. video                                4. pop the balloon and drag it, without
//                                              lifting the finger, through the A
//   5. video                                6. balloon pops on top of the A, forming
//                                              the syllable, then drag to the end
const LEVEL_COUNT = 6;
const ROWS = 3;
const DONE_AT = 0.95;
// Step 4: where the fixed A sits on each row (fraction of the track) — it
// gets closer to the P every row, the last one almost touching.
const A_DROP_POINTS = [0.55, 0.36, 0.17];
// Step 6: track length per row (fraction of the available width).
const TOP_ROW_WIDTHS = [1, 1, 0.6];

function VideoStep({ title, src, onPlay, shake, caption = 'Mira el video para continuar' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      <div style={titleStyle}>{title}</div>
      <div style={{ width: '100%', animation: shake ? 'shakeX 0.4s' : undefined }}>
        <LetterVideo src={src} onPlay={onPlay} />
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>{caption}</div>
    </div>
  );
}

// ---- Step 2: balloon on the left, sustain track on the right ----

function LevelBalloonSustain({ letters, popped, onPop, progress, setProgress, activeIndex, hintDone, markHintDone, shake, audioPlayed, onAudioPlay }) {
  const [burstIndex, setBurstIndex] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
      <div style={titleStyle}>Une los sonidos</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14, width: '100%' }}>
        {letters.map((letter, c) => (
          <div key={c} style={{ display: 'flex', justifyContent: 'center' }}>
            <SoundMouthButton letter={letter} played={audioPlayed[c]} onPlay={() => onAudioPlay(c)} size={124} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14, rowGap: 14, width: '100%', alignItems: 'end', marginTop: 8 }}>
        {Array.from({ length: ROWS }).flatMap((_, r) => {
          const balloonK = r * 2;
          const trackK = r * 2 + 1;
          return [
            <div key={`b${r}`} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <Balloon
                char={letters[0].char}
                colorIndex={r}
                status={popped[r] ? 'popped' : balloonK === activeIndex ? 'active' : 'locked'}
                onPop={() => {
                  setBurstIndex(r);
                  setTimeout(() => setBurstIndex(null), 650);
                  onPop(r);
                }}
              />
              {burstIndex === r && <BalloonBurst />}
            </div>,
            <div
              key={`t${r}`}
              style={{
                paddingBottom: 18,
                borderRadius: 999,
                animation: trackK === activeIndex ? 'glowPulse 1.8s ease-in-out infinite' : undefined,
              }}
            >
              <SustainTrack
                letter={letters[1]}
                progress={progress[r]}
                setProgress={(v) => setProgress(r, v)}
                active={trackK === activeIndex}
                done={progress[r] >= DONE_AT}
                locked={trackK > activeIndex}
                shakeTrack={shake && trackK === activeIndex}
                showHint={trackK === activeIndex && !hintDone[r]}
                onFirstDrag={() => markHintDone(r)}
                guideSize={56}
                hintTravel="min(34vw, 110px)"
              />
            </div>,
          ];
        })}
      </div>

      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
        Explota el globo y sostén el sonido · {Math.min(activeIndex, ROWS * 2)}/{ROWS * 2}
      </div>
    </div>
  );
}

// ---- Steps 4 & 6: one draggable balloon/handle on a line ----
//
// mode 'drag' (step 4): the balloon sits above the start of the line with the
//   second letter fixed further along. Popping it turns it into the first
//   letter, which must be dragged — without lifting the finger — through the
//   second letter (they fuse) and to the end. Releasing early resets the row.
// mode 'onTop' (step 6): the second letter sits at the start of the line with
//   the balloon floating above it (both readable). Popping fuses them into the
//   syllable right away; the child then drags it to the end (can re-grab).

const BALLOON_W = 62;
const BALLOON_H = 72;

function MiniBalloon({ char, colorIndex }) {
  const palette = BALLOON_PALETTE[colorIndex % BALLOON_PALETTE.length];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'balloonPulse 1.6s ease-in-out infinite' }}>
      <div
        style={{
          width: BALLOON_W,
          height: BALLOON_H,
          borderRadius: '50% 50% 50% 50% / 58% 58% 42% 42%',
          background: palette.bg,
          border: '3px solid rgba(255,255,255,0.55)',
          boxShadow: '0 8px 16px oklch(0% 0 0 / 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 28,
          color: palette.text,
          textShadow: '0 2px 3px rgba(0,0,0,0.25)',
          position: 'relative',
        }}
      >
        {char}
        <div
          style={{
            position: 'absolute',
            bottom: -7,
            left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `9px solid ${palette.knot}`,
          }}
        />
      </div>
      <div style={{ width: 2, height: 14, background: 'oklch(72% 0.02 250)' }} />
    </div>
  );
}

function PopDragTrack({ mode, letters, syllable, dropAt, widthFrac = 1, colorIndex, done, active, locked, showHint, onDone, onReset, onTry }) {
  const trackRef = useRef(null);
  const isDrag = mode === 'drag';
  const [progress, setProgress] = useState(done ? 1 : 0);
  const [popped, setPopped] = useState(done);
  const [merged, setMerged] = useState(done || !isDrag);
  const [dragging, setDragging] = useState(false);
  const [burst, setBurst] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const prevDoneRef = useRef(done);

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

  const pctFrom = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };
  const applyProgress = (v) => {
    setProgress(v);
    if (isDrag && !merged && v >= dropAt) setMerged(true);
  };

  const onPointerDown = (e) => {
    if (locked || done) return;
    // The balloon is the only way to start: touching the letter alone does nothing.
    if (!popped && !e.target.closest('[data-balloon]')) return;
    onTry?.();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
    if (!popped) {
      setPopped(true);
      setBurst(true);
      setTimeout(() => setBurst(false), 650);
    }
    applyProgress(pctFrom(e.clientX));
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    applyProgress(pctFrom(e.clientX));
  };
  const finish = () => {
    if (!dragging) return;
    setDragging(false);
    if (progress >= DONE_AT) {
      onDone();
    } else {
      setPopped(false);
      setMerged(false);
      setProgress(0);
      onReset?.();
    }
  };

  const showSyllable = isDrag ? merged : popped;
  const bubbleLabel = isDrag ? (merged ? syllable : letters[0].char) : popped ? syllable : letters[1].char;
  const bubbleW = bubbleLabel.length > 1 ? 66 : 50;
  const showBubble = isDrag ? popped : true;
  const showBalloon = !popped && !done;

  return (
    <div
      style={{
        position: 'relative',
        width: `${widthFrac * 100}%`,
        padding: `${BALLOON_H + 34}px 30px 6px`,
        marginBottom: 14,
        opacity: locked ? 0.4 : 1,
        transition: 'opacity var(--duration-base) var(--ease-standard)',
        borderRadius: 999,
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
          animation: active && !done ? 'glowPulse 1.8s ease-in-out infinite' : undefined,
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

        {showHint && showBalloon && <DragHint travel="min(46vw, 170px)" />}

        {/* fixed second letter (step 4 only, until it fuses with the first) */}
        {isDrag && !merged && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${dropAt * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: 50,
              height: 50,
              borderRadius: '50%',
              border: '3px solid var(--color-primary)',
              background: 'var(--color-primary-tint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: 'var(--color-primary-dark)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {letters[1].char}
          </div>
        )}

        {/* the draggable thing: balloon (before the pop) + letter bubble */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finish}
          onPointerCancel={finish}
          style={{
            position: 'absolute',
            top: '50%',
            left: `calc(${progress * 100}% - ${bubbleW / 2}px)`,
            transform: 'translateY(-50%)',
            width: bubbleW,
            height: 50,
            touchAction: 'none',
            cursor: locked || done ? 'default' : 'grab',
            zIndex: 3,
            transition: dragging ? 'none' : 'left var(--duration-base) var(--ease-standard)',
          }}
        >
          {showBubble && (
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 25,
                border: '3px solid var(--color-primary)',
                background: done ? 'var(--color-primary-tint)' : '#fff',
                boxShadow: 'var(--shadow-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 800,
                fontSize: showSyllable && bubbleLabel.length > 1 ? 20 : 22,
                color: 'var(--color-primary-dark)',
              }}
            >
              {bubbleLabel}
            </div>
          )}
          {showBalloon && (
            <div data-balloon style={{ position: 'absolute', left: '50%', bottom: isDrag ? 8 : 58, transform: 'translateX(-50%)' }}>
              <MiniBalloon char={letters[0].char} colorIndex={colorIndex} />
              {!isDrag && active && !locked && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: BALLOON_H + 22,
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    boxShadow: 'var(--shadow-card)',
                    pointerEvents: 'none',
                  }}
                >
                  👆 ¡Explota el globo!
                </div>
              )}
            </div>
          )}
          {burst && <BalloonBurst />}
        </div>
      </div>
      {celebrate && <TrackConfetti />}
    </div>
  );
}

function LevelPopDrag({ mode, title, hint, letters, syllable, doneRows, onRowDone, activeIndex }) {
  const [msg, setMsg] = useState('');
  const msgTimer = useRef(null);
  useEffect(() => () => clearTimeout(msgTimer.current), []);
  const flash = () => {
    setMsg(
      mode === 'onTop'
        ? '¡Explota el globo sobre la letra y arrastra sin soltar el dedo!'
        : '¡Explota y arrastra sin soltar el dedo!',
    );
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2600);
  };
  const [hintDone, setHintDone] = useState(() => Array(ROWS).fill(false));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', width: '100%' }}>
      <div style={titleStyle}>{title}</div>
      <div
        style={{
          minHeight: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: msg ? 'var(--color-warning-tint)' : 'transparent',
          color: 'var(--color-warning-ink)',
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          textAlign: 'center',
          visibility: msg ? 'visible' : 'hidden',
        }}
      >
        {msg || '·'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        {Array.from({ length: ROWS }).map((_, r) => (
          <PopDragTrack
            key={r}
            mode={mode}
            letters={letters}
            syllable={syllable}
            dropAt={mode === 'drag' ? A_DROP_POINTS[r] : 0}
            widthFrac={mode === 'onTop' ? TOP_ROW_WIDTHS[r] : 1}
            colorIndex={r}
            done={doneRows[r]}
            active={r === activeIndex}
            locked={r > activeIndex}
            showHint={r === activeIndex && !hintDone[r]}
            onTry={() => setHintDone((h) => h.map((x, i) => (i === r ? true : x)))}
            onReset={flash}
            onDone={() => onRowDone(r)}
          />
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
        {hint} · {Math.min(activeIndex, ROWS)}/{ROWS}
      </div>
    </div>
  );
}

export default function SyllableBalloonActivity({ syllable, onComplete, onClose, onMiniActivity }) {
  const letters = syllable.split('').map((ch) => getPhase1LetterByChar(ch));

  const [level, setLevel] = useState(0);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [popped, setPopped] = useState(() => Array(ROWS).fill(false));
  const [progress, setProgressState] = useState(() => Array(ROWS).fill(0));
  const [hintDone, setHintDone] = useState(() => Array(ROWS).fill(false));
  const [audioPlayed, setAudioPlayed] = useState([false, false]);
  const [video3, setVideo3] = useState(false);
  const [rows4, setRows4] = useState(() => Array(ROWS).fill(false));
  const [video5, setVideo5] = useState(false);
  const [rows6, setRows6] = useState(() => Array(ROWS).fill(false));
  const [shakeTarget, setShakeTarget] = useState(null);
  const awardedRef = useRef(new Set());
  const advancingRef = useRef(false);

  useEffect(() => {
    advancingRef.current = false;
  }, [level]);

  // Step 2 order: balloon(row 0), track(row 0), balloon(row 1), ...
  const step2Flags = Array.from({ length: ROWS }).flatMap((_, r) => [popped[r], progress[r] >= DONE_AT]);
  const step2Active = (() => {
    const i = step2Flags.findIndex((x) => !x);
    return i === -1 ? step2Flags.length : i;
  })();
  const firstFalse = (arr) => {
    const i = arr.findIndex((x) => !x);
    return i === -1 ? arr.length : i;
  };

  const gateOk = [introPlayed, step2Active >= step2Flags.length, video3, rows4.every(Boolean), video5, rows6.every(Boolean)];
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
    // Coins for the balloon+sustain round (2) and the final step (6) — step 4 gives none.
    if ((level === 1 || level === 5) && !awardedRef.current.has(level)) {
      awardedRef.current.add(level);
      onMiniActivity?.();
    }
    if (level === LEVEL_COUNT - 1) {
      onComplete();
      return;
    }
    setLevel((l) => l + 1);
  };

  const goPrev = () => {
    if (level === 0) {
      onClose();
      return;
    }
    setLevel((l) => l - 1);
  };

  const markRow = (setter) => (r) => setter((arr) => arr.map((x, i) => (i === r ? true : x)));
  const playMouth = (c) => {
    playAudio(letters[c].audio);
    setAudioPlayed((a) => a.map((x, i) => (i === c ? true : x)));
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
          <LevelVideoIntro syllable={syllable} played={introPlayed} onPlay={() => setIntroPlayed(true)} shake={shakeTarget === 0} />
        )}
        {level === 1 && (
          <LevelBalloonSustain
            letters={letters}
            popped={popped}
            onPop={markRow(setPopped)}
            progress={progress}
            setProgress={(r, v) => setProgressState((arr) => arr.map((x, i) => (i === r ? v : x)))}
            activeIndex={step2Active}
            hintDone={hintDone}
            markHintDone={(r) => setHintDone((h) => h.map((x, i) => (i === r ? true : x)))}
            shake={shakeTarget === 1}
            audioPlayed={audioPlayed}
            onAudioPlay={playMouth}
          />
        )}
        {level === 2 && <VideoStep title="Juntando los sonidos" src={VIDEO2_GENERAL_BALLOON} onPlay={() => setVideo3(true)} shake={shakeTarget === 2} />}
        {level === 3 && (
          <LevelPopDrag
            mode="drag"
            title="Explota y arrastra"
            hint="Explota el globo y arrastra sin soltar hasta el final"
            letters={letters}
            syllable={syllable}
            doneRows={rows4}
            onRowDone={markRow(setRows4)}
            activeIndex={firstFalse(rows4)}
          />
        )}
        {level === 4 && <VideoStep title="Formando la sílaba" src={VIDEO2_GENERAL_DRAG} onPlay={() => setVideo5(true)} shake={shakeTarget === 4} />}
        {level === 5 && (
          <LevelPopDrag
            mode="onTop"
            title="Explota el globo"
            hint="Explota el globo sobre la letra y arrastra sin soltar hasta el final"
            letters={letters}
            syllable={syllable}
            doneRows={rows6}
            onRowDone={markRow(setRows6)}
            activeIndex={firstFalse(rows6)}
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
