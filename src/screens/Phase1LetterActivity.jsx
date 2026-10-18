import { useEffect, useRef, useState } from 'react';
import { IconButton } from '../components/Button.jsx';
import { phase1LetterSequence, PHASE1_CONFUSABLE_GROUPS } from '../data.js';

// Given a letter id, returns the set of every other letter id that shares a
// confusable (visually identical) mouth-shape photo with it, so the "guess
// the mouth" game never offers two confusable letters in the same round.
function confusableIdsFor(letterId) {
  const group = PHASE1_CONFUSABLE_GROUPS.find((g) => g.includes(letterId));
  return group ? new Set(group.filter((id) => id !== letterId)) : new Set();
}

// Standard: Discover, Watch, Sustain, Calligraphy-video, Calligraphy,
// Match. Balloon letters swap the sustain round for the two balloon
// rounds, so they get one extra level overall.
const STANDARD_LEVEL_COUNT = 6;
const BALLOON_LEVEL_COUNT = 7;

// Consonants where the sound only exists as a hard, isolated "stop" (no way
// to stretch it out like a vowel or a fricative), so instead of the
// drag-to-sustain exercise they get two balloon-popping rounds: one where
// popping plays the letter's sound, one where the child does it solo.
const BALLOON_LETTER_IDS = new Set([
  'p1-p',
  'p1-t',
  'p1-b',
  'p1-d',
  'p1-c1',
  'p1-q',
  'p1-g1',
  'p1-x',
  'p1-k',
]);

const R2_BASE = 'https://pub-d0dfbec199994a7295161016b0631fb4.r2.dev';

// "Segundo vídeo" shown right before the drag-to-sustain exercise (non-balloon
// letters) or right before the balloon-popping exercise (balloon letters). A
// and I get their own bespoke video; P and T (balloon letters) also get their
// own; every other letter falls back to a shared video for its flow.
const VIDEO2_OVERRIDES = {
  'p1-a': `${R2_BASE}/video-2-letra-A.mp4`,
  'p1-i': `${R2_BASE}/video-2-letra-I.mp4`,
  'p1-p': `${R2_BASE}/video-4-balao.mp4`,
  'p1-t': `${R2_BASE}/video-4-balao-T.mp4`,
};
export const VIDEO2_GENERAL_DRAG = `${R2_BASE}/video-2-letra-geral.mp4`;
export const VIDEO2_GENERAL_BALLOON = `${R2_BASE}/video-4-balao-geral.mp4`;

function video2For(letter) {
  if (VIDEO2_OVERRIDES[letter.id]) return VIDEO2_OVERRIDES[letter.id];
  return BALLOON_LETTER_IDS.has(letter.id) ? VIDEO2_GENERAL_BALLOON : VIDEO2_GENERAL_DRAG;
}

// Video shown right before the free-hand calligraphy practice. A gets a
// bespoke video; every other letter shares a general one.
const CALLIGRAPHY_VIDEO_OVERRIDES = {
  'p1-a': `${R2_BASE}/video-caligrafia-A.mp4`,
};
const CALLIGRAPHY_VIDEO_GENERAL = `${R2_BASE}/video-caligrafia-geral.mp4`;

function calligraphyVideoFor(letter) {
  return CALLIGRAPHY_VIDEO_OVERRIDES[letter.id] || CALLIGRAPHY_VIDEO_GENERAL;
}

// Video shown above the sound button on the final "¿Cuál es la boca
// correcta?" level — same clip for every letter, and it never gates
// progress (only picking the right answer does).
const LEVEL4_VIDEO_URL = `${R2_BASE}/video5.mp4`;

// Played once, automatically, the moment the child lands on the silent
// balloon round (no sound plays when they pop those balloons, so this cues
// them that it's their turn to say the sound out loud).
const BALLOON_YOUR_TURN_AUDIO_URL = `${R2_BASE}/agora-e-sua-vez.MP3`;

// Plays a short remote audio clip (letter pronunciation / sound sample).
// Fire-and-forget: playback errors (e.g. blocked autoplay before any user
// gesture) are swallowed since these are always triggered by a tap.
export function playAudio(url) {
  if (!url) return;
  const audio = new Audio(url);
  audio.play().catch(() => {});
}

// ---- shared little building blocks ----

export function LetterVideo({ src, onPlay }) {
  return (
    <video
      key={src}
      controls
      playsInline
      preload="metadata"
      src={src}
      onPlay={onPlay}
      style={{
        width: '100%',
        aspectRatio: '16 / 10',
        borderRadius: 'var(--radius-xl)',
        background: '#000',
        boxShadow: 'var(--shadow-card)',
      }}
    />
  );
}

export function VideoPlaceholder({ label }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16 / 10',
        borderRadius: 'var(--radius-xl)',
        background: 'oklch(90% 0.008 250)',
        border: '2px dashed oklch(78% 0.02 250)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        color: 'var(--color-text-muted)',
      }}
    >
      <div style={{ fontSize: 34 }}>🎬</div>
      <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

// Classic handwriting-practice paper: a solid top rule, a dashed
// mid-line (x-height guide), and a solid bottom rule (baseline), with
// the letter's watermark sitting on the baseline like real caligraphy sheets.
function RuledPaper({ letter, watermarkSize }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: '6%',
          right: '6%',
          top: '18%',
          borderTop: '2px solid oklch(80% 0.02 250)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '6%',
          right: '6%',
          top: '50%',
          borderTop: '2px dashed oklch(83% 0.02 250)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '6%',
          right: '6%',
          top: '82%',
          borderTop: '2px solid oklch(80% 0.02 250)',
        }}
      />
      <svg
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '18%',
          height: '64%',
          width: '100%',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="none"
          stroke="oklch(78% 0.03 245)"
          strokeWidth={Math.max(2, watermarkSize / 46)}
          strokeDasharray={`${watermarkSize / 42} ${watermarkSize / 16}`}
          strokeLinecap="round"
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontWeight: 200,
            fontSize: watermarkSize,
          }}
        >
          {letter.char}
        </text>
      </svg>
    </>
  );
}

export function DotsNav({ level, unlockedCount, levelCount }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: levelCount }).map((_, i) => {
        const isCurrent = i === level;
        const isDone = i < unlockedCount;
        return (
          <div
            key={i}
            style={{
              width: isCurrent ? 24 : 10,
              height: 10,
              borderRadius: 999,
              transition: 'all var(--duration-base) var(--ease-standard)',
              background: isCurrent ? 'var(--color-primary)' : isDone ? 'var(--color-primary-tint)' : '#fff',
              border: isCurrent
                ? 'none'
                : isDone
                ? '2px solid var(--color-primary)'
                : '2px solid oklch(62% 0.04 250)',
              boxShadow: isCurrent ? '0 1px 4px oklch(50% 0.12 235 / 0.4)' : '0 1px 2px oklch(0% 0 0 / 0.12)',
            }}
          />
        );
      })}
    </div>
  );
}

export function ArrowButton({ dir, onClick, shake }) {
  return (
    <IconButton
      onClick={onClick}
      style={{
        animation: shake ? 'shakeX 0.4s' : undefined,
      }}
    >
      {dir === 'prev' ? '←' : '→'}
    </IconButton>
  );
}

// A rounded card showing the letter's mouth-shape photo (portrait 3:4 frame,
// never cropped tight) with a "tap to listen" label underneath. Shared by
// Level1 (bigger) and the sustain-sound level (smaller, "Sonido" variant).
export function SoundMouthButton({ letter, played, onPlay, shakeButton, size = 190 }) {
  const compact = size < 150;
  return (
    <div
      onClick={onPlay}
      className="pressable"
      style={{
        width: '100%',
        maxWidth: size,
        borderRadius: 'var(--radius-2xl)',
        background: played ? 'var(--color-primary-tint)' : '#fff',
        boxShadow: 'var(--shadow-elevated)',
        border: `3px solid ${played ? 'var(--color-primary)' : 'oklch(88% 0.02 250)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 4 : 8,
        padding: compact ? '8px 8px 7px' : '14px 14px 12px',
        cursor: 'pointer',
        animation: shakeButton ? 'shakeX 0.4s' : undefined,
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 2px 6px oklch(0% 0 0 / 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'oklch(96% 0.005 250)',
        }}
      >
        {letter.image ? (
          <img src={letter.image} alt={letter.char} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <div style={{ fontSize: compact ? 26 : 52 }}>👄</div>
        )}
      </div>
      <div style={{ fontSize: compact ? 11 : 13, fontWeight: 700, color: 'var(--color-primary-dark)', textAlign: 'center' }}>
        {played ? '🔊 Escuchado' : 'Toca para escuchar'}
      </div>
    </div>
  );
}

// ---- Level 1: Descubriendo el sonido ----

function Level1({ day, letter, played, onPlay, shakeButton }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>Día {day}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)' }}>
        Descubriendo el sonido
      </div>
      {letter.video ? <LetterVideo src={letter.video} /> : <VideoPlaceholder label="Video (próximamente)" />}
      <SoundMouthButton letter={letter} played={played} onPlay={onPlay} shakeButton={shakeButton} size={170} />
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 48, color: 'var(--color-text-strong)' }}>
        {letter.char}
      </div>
    </div>
  );
}

// ---- Level 2: watch the "sostén el sonido" video ----
//
// Standard (sustainable) sounds get the "sostén el sonido" framing, since
// the next level has them drag-hold the sound. Balloon letters (hard stop
// consonants) can't be sustained at all, so they get a "learn the letter"
// framing instead — matches what actually happens next for them.

function LevelWatch({ letter, video, onVideoPlay, shake, isBalloonFlow }) {
  const title = isBalloonFlow ? 'Aprende a pronunciar la letra' : 'Sostén el sonido';
  const caption = isBalloonFlow
    ? 'Mira el video para descubrir cómo se pronuncia la letra'
    : 'Mira el video para descubrir cómo se sostiene el sonido';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)' }}>
        {title}
      </div>
      <div style={{ width: '100%', animation: shake ? 'shakeX 0.4s' : undefined }}>
        {video ? (
          <LetterVideo src={video} onPlay={onVideoPlay} />
        ) : (
          <VideoPlaceholder label="Video (próximamente)" />
        )}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
        {caption}
      </div>
    </div>
  );
}

// ---- Level 3: sustaining the sound (drag to fill), 3 rounds ----

const SUSTAIN_ROUNDS = 3;

// A hand that visibly taps down (press), slides across the track (drag),
// then lifts and fades out before looping — a clear "tap and drag" mime,
// shown once above the first round until the child makes their first move.
export function DragHint({ travel }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: -6,
        left: 0,
        width: '100%',
        height: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 0,
          fontSize: 34,
          transformOrigin: '30% 20%',
          filter: 'drop-shadow(0 3px 4px oklch(0% 0 0 / 0.25))',
          animation: 'dragHintMove 1.8s cubic-bezier(0.45,0,0.55,1) infinite',
          ...(travel ? { '--travel': travel } : {}),
        }}
      >
        🖐️
      </div>
      <style>{`
        @keyframes dragHintMove {
          0% { transform: translateX(0) scale(1); opacity: 0; }
          8% { opacity: 1; transform: translateX(0) scale(1); }
          18% { transform: translateX(0) scale(0.82); }
          28% { transform: translateX(0) scale(0.88); }
          68% { transform: translateX(var(--travel, min(58vw, 220px))) scale(0.88); opacity: 1; }
          80% { transform: translateX(var(--travel, min(58vw, 220px))) scale(1); opacity: 1; }
          92% { opacity: 0; transform: translateX(var(--travel, min(58vw, 220px))) scale(1); }
          100% { opacity: 0; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

const TRACK_CONFETTI_HUES = [235, 40, 340, 150];

// A short, contained confetti pop that bursts right above a single track
// the instant it's completed — a small, local echo of the big final
// celebration so each round feels rewarding on its own.
export function TrackConfetti() {
  const pieces = useRef(
    Array.from({ length: 18 }).map((_, i) => ({
      left: 10 + Math.random() * 80,
      delay: Math.random() * 0.12,
      duration: 0.55 + Math.random() * 0.4,
      hue: TRACK_CONFETTI_HUES[i % TRACK_CONFETTI_HUES.length],
      size: 5 + Math.random() * 5,
      dx: (Math.random() - 0.5) * 90,
      dy: -34 - Math.random() * 40,
      spin: 180 + Math.random() * 360,
      key: i,
    })),
  ).current;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 6 }}>
      {pieces.map((p) => (
        <div
          key={p.key}
          style={{
            position: 'absolute',
            top: '50%',
            left: `${p.left}%`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--spin': `${p.spin}deg`,
            width: p.size,
            height: p.size * 1.6,
            borderRadius: 2,
            background: `oklch(72% 0.19 ${p.hue})`,
            animation: `trackConfettiPop ${p.duration}s ${p.delay}s cubic-bezier(0.2,0.7,0.4,1) forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes trackConfettiPop {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--spin)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// One draggable "sustain" line. When `active`, a small guide square floats
// above the handle showing the letter's mouth shape + character, tracking
// the handle's position — a pure visual guide with no sound of its own.
const GUIDE_SIZE = 78;

export function SustainTrack({ letter, progress, setProgress, active, done, locked, shakeTrack, showHint, onFirstDrag, guideSize, hintTravel }) {
  const gs = guideSize || GUIDE_SIZE;
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
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
  }, [done]);

  const updateFromClientX = (clientX) => {
    if (locked) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setProgress(pct);
  };

  const onPointerDown = (e) => {
    if (locked) return;
    onFirstDrag?.();
    setDragging(true);
    e.target.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => setDragging(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        padding: '4px 6px',
        opacity: locked ? 0.4 : 1,
        transition: 'opacity var(--duration-base) var(--ease-standard)',
        animation: shakeTrack ? 'shakeX 0.4s' : undefined,
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
              boxShadow: '0 0 10px oklch(60% 0.15 235 / 0.35)',
              transition: dragging ? 'none' : 'width var(--duration-base) var(--ease-standard)',
            }}
          />
        </div>

        {active && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: guideSize ? `clamp(0px, calc(${progress * 100}% - ${gs / 2}px), calc(100% - ${gs}px))` : `calc(${progress * 100}% - ${gs / 2}px)`,
              marginBottom: 14,
              width: gs,
              height: gs,
              borderRadius: 'var(--radius-xl)',
              background: '#fff',
              boxShadow: 'var(--shadow-elevated)',
              border: '3px solid var(--color-primary)',
              overflow: 'hidden',
              pointerEvents: 'none',
              transition: dragging ? 'none' : 'left var(--duration-base) var(--ease-standard)',
            }}
          >
            {letter.image ? (
              <img src={letter.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700,
                  fontSize: 32,
                  color: 'var(--color-primary-dark)',
                  background: 'oklch(96% 0.005 250)',
                }}
              >
                {letter.char}
              </div>
            )}
            {letter.image && (
              <div
                style={{
                  position: 'absolute',
                  right: -2,
                  bottom: -2,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: "'Fredoka', sans-serif",
                  boxShadow: '0 1px 3px oklch(0% 0 0 / 0.25)',
                }}
              >
                {letter.char}
              </div>
            )}
          </div>
        )}

        {showHint && <DragHint travel={hintTravel} />}

        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="pressable"
          style={{
            position: 'absolute',
            top: '50%',
            left: `calc(${progress * 100}% - 25px)`,
            transform: 'translateY(-50%)',
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: done ? 'var(--color-primary-tint)' : '#fff',
            boxShadow: 'var(--shadow-elevated)',
            border: '3px solid var(--color-primary)',
            cursor: locked ? 'default' : 'grab',
            touchAction: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--color-primary)',
            gap: 3,
          }}
        >
          {done ? (
            '✓'
          ) : (
            <>
              <span style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--color-primary)', opacity: 0.55 }} />
              <span style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--color-primary)', opacity: 0.55 }} />
              <span style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--color-primary)', opacity: 0.55 }} />
            </>
          )}
        </div>
      </div>

      {celebrate && <TrackConfetti />}
    </div>
  );
}

function LevelSustain({ letter, progresses, setProgress, activeIndex, shakeTrack, hintShown, onFirstDrag, audioPlayed, onAudioPlay }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', width: '100%' }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)' }}>
        Sostén el sonido
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <SoundMouthButton letter={letter} played={audioPlayed} onPlay={onAudioPlay} size={112} />
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            boxShadow: 'var(--shadow-card)',
            flexShrink: 0,
          }}
        >
          🔊
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 110, width: '100%', marginTop: 20, marginBottom: 8 }}>
        {progresses.map((p, i) => (
          <SustainTrack
            key={i}
            letter={letter}
            progress={p}
            setProgress={(v) => setProgress(i, v)}
            active={i === activeIndex}
            done={p >= 0.95}
            locked={i > activeIndex}
            shakeTrack={shakeTrack && i === activeIndex}
            showHint={hintShown && i === 0 && i === activeIndex}
            onFirstDrag={onFirstDrag}
          />
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>
        Arrastra para sostener el sonido · {Math.min(activeIndex, SUSTAIN_ROUNDS)}/{SUSTAIN_ROUNDS}
      </div>
    </div>
  );
}

// ---- Balloon-popping rounds (hard-stop consonants only) ----

export const BALLOON_PALETTE = [
  { bg: 'linear-gradient(160deg, oklch(78% 0.16 20), oklch(60% 0.18 10))', text: '#fff', knot: 'oklch(56% 0.18 10)' },
  { bg: 'linear-gradient(160deg, oklch(80% 0.15 150), oklch(62% 0.17 160))', text: '#fff', knot: 'oklch(58% 0.17 160)' },
  { bg: 'linear-gradient(160deg, oklch(78% 0.15 260), oklch(58% 0.18 250))', text: '#fff', knot: 'oklch(54% 0.18 250)' },
];

// A single balloon: pulses while it's the active/tappable one, pops into a
// checkmark once popped, and sits dimmed+inert while still locked behind an
// earlier balloon in the sequence.
export function Balloon({ char, colorIndex, status, onPop }) {
  const palette = BALLOON_PALETTE[colorIndex % BALLOON_PALETTE.length];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 84 }}>
      {status === 'popped' ? (
        <div style={{ width: 84, height: 98, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--color-primary-tint)',
              border: '2px solid var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 800,
              color: 'var(--color-primary-dark)',
              animation: 'popIn 0.3s ease',
            }}
          >
            ✓
          </div>
        </div>
      ) : (
        <div
          onClick={status === 'active' ? onPop : undefined}
          className={status === 'active' ? 'pressable' : undefined}
          style={{
            width: 84,
            height: 98,
            borderRadius: '50% 50% 50% 50% / 58% 58% 42% 42%',
            background: palette.bg,
            boxShadow: status === 'active' ? '0 10px 22px oklch(0% 0 0 / 0.28)' : '0 6px 14px oklch(0% 0 0 / 0.15)',
            border: '3px solid rgba(255,255,255,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: status === 'active' ? 'pointer' : 'default',
            opacity: status === 'locked' ? 0.4 : 1,
            transition: 'opacity var(--duration-base) var(--ease-standard)',
            animation: status === 'active' ? 'balloonPulse 1.6s ease-in-out infinite' : undefined,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 18,
              width: 16,
              height: 22,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.35)',
              transform: 'rotate(-20deg)',
            }}
          />
          <span
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700,
              fontSize: 30,
              color: palette.text,
              textShadow: '0 2px 3px rgba(0,0,0,0.25)',
            }}
          >
            {char}
          </span>
          <div
            style={{
              position: 'absolute',
              bottom: -7,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `9px solid ${palette.knot}`,
            }}
          />
        </div>
      )}
      <div style={{ width: 2, height: 30, background: 'oklch(72% 0.02 250)', marginTop: status === 'popped' ? 0 : 2 }} />
      <style>{`
        @keyframes balloonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.07); }
        }
      `}</style>
    </div>
  );
}

// An omnidirectional confetti pop, centered on a just-popped balloon —
// pieces fly outward in a ring rather than just drifting upward.
export function BalloonBurst() {
  const pieces = useRef(
    Array.from({ length: 22 }).map((_, i) => {
      const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 46 + Math.random() * 38;
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        hue: TRACK_CONFETTI_HUES[i % TRACK_CONFETTI_HUES.length],
        size: 5 + Math.random() * 5,
        spin: 180 + Math.random() * 360,
        delay: Math.random() * 0.05,
        duration: 0.5 + Math.random() * 0.3,
        key: i,
      };
    }),
  ).current;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8 }}>
      {pieces.map((p) => (
        <div
          key={p.key}
          style={{
            position: 'absolute',
            top: '46%',
            left: '50%',
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--spin': `${p.spin}deg`,
            width: p.size,
            height: p.size * 1.6,
            borderRadius: 2,
            background: `oklch(72% 0.19 ${p.hue})`,
            animation: `balloonBurstPop ${p.duration}s ${p.delay}s cubic-bezier(0.2,0.7,0.4,1) forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes balloonBurstPop {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--spin)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// One balloon-popping round: 3 balloons unlock in sequence, popping the
// active one plays the letter's sound (or, in the silent round, nothing —
// the child says it instead) and bursts into confetti. Finishing the 3rd
// balloon shows a small celebration and unlocks the → arrow, but never
// advances on its own — the child has to tap it themselves.
function LevelBalloons({ letter, withSound, poppedCount, onPop, shake, audioPlayed, onAudioPlay }) {
  const [burstIndex, setBurstIndex] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  const handlePop = (i) => {
    if (i !== poppedCount) return;
    if (withSound) playAudio(letter.audio);
    setBurstIndex(i);
    setTimeout(() => setBurstIndex(null), 650);
    const next = poppedCount + 1;
    onPop(next);
    if (next >= 3) {
      setTimeout(() => {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1300);
      }, 250);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', width: '100%', position: 'relative' }}>
      <div
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 22,
          color: 'var(--color-text-strong)',
          textAlign: 'center',
        }}
      >
        {withSound ? 'Explota los globos' : '¡Ahora es tu turno!'}
      </div>

      <SoundMouthButton letter={letter} played={audioPlayed} onPlay={onAudioPlay} size={112} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 22,
          width: '100%',
          marginTop: 16,
          marginBottom: 4,
          animation: shake ? 'shakeX 0.4s' : undefined,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'relative' }}>
            <Balloon
              char={letter.char}
              colorIndex={i}
              status={i < poppedCount ? 'popped' : i === poppedCount ? 'active' : 'locked'}
              onPop={() => handlePop(i)}
            />
            {burstIndex === i && <BalloonBurst />}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
        {withSound ? 'Escucha el sonido al explotar cada globo' : 'Di el sonido y explota cada globo'} ·{' '}
        {Math.min(poppedCount, 3)}/3
      </div>

      {celebrate && (
        <>
          <Confetti />
          <SuccessBadge
            title="¡Genial!"
            subtitle={withSound ? '¡Explotaste los 3 globos!' : '¡Lo lograste tú solo!'}
          />
        </>
      )}
    </div>
  );
}

// ---- Level: watch how the letter is written, right before free practice ----
//
// Same mechanic as LevelWatch — a video (or its placeholder, if none is
// wired up yet) that only gates on having started playback, not on
// finishing it.

function LevelCalligraphyVideo({ video, onVideoPlay, shake }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)' }}>
        Aprende a escribir la letra
      </div>
      <div style={{ width: '100%', animation: shake ? 'shakeX 0.4s' : undefined }}>
        {video ? (
          <LetterVideo src={video} onPlay={onVideoPlay} />
        ) : (
          <VideoPlaceholder label="Video (próximamente)" />
        )}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
        Mira el video para descubrir cómo se escribe la letra
      </div>
    </div>
  );
}

// ---- Level 4: free-hand calligraphy practice ----
//
// No checkpoints, no validation, no forced strokes — just a notebook-style
// page with the uppercase letter as a faint watermark behind a free-draw
// canvas. The child can write however they like; the only gate to move on
// is that they've actually put pen to paper at least once.

function Calligraphy({ letter, started, onStart, shake }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 14;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-dark').trim() || '#333';
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e) => {
    drawingRef.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (!started) onStart();
    e.target.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const onPointerUp = () => {
    drawingRef.current = false;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: '100%', position: 'relative' }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)' }}>
        Practica la letra
      </div>
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 0.9',
          borderRadius: 'var(--radius-2xl)',
          background: '#fff',
          boxShadow: started ? '0 0 0 4px var(--color-primary), var(--shadow-elevated)' : 'var(--shadow-card)',
          border: '2px solid var(--color-border)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow var(--duration-base) var(--ease-standard)',
          animation: shake ? 'shakeX 0.4s' : undefined,
        }}
      >
        <RuledPaper letter={letter} watermarkSize={190} />
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none' }}
        />
        <IconButton
          onClick={clearCanvas}
          style={{ position: 'absolute', top: 8, right: 8, width: 40, height: 40, fontSize: 16 }}
        >
          🗑️
        </IconButton>
        {started && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 999,
              pointerEvents: 'none',
            }}
          >
            ✓ ¡Empezaste!
          </div>
        )}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
        Escribe la letra libremente en el cuaderno
      </div>
    </div>
  );
}

// ---- Level 5: find the correct mouth ----

const CONFETTI_SHAPES = ['rect', 'circle', 'ribbon'];
const CONFETTI_EMOJI = ['🎉', '⭐', '✨', '🎊'];

// A big, playful confetti burst: falling rectangles/circles/ribbons that
// sway side to side as they fall, plus a handful of drifting sparkle/party
// emoji mixed in, so the celebration reads as lively rather than a few
// straight-falling bars.
function Confetti() {
  const pieces = useRef(
    Array.from({ length: 140 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.2 + Math.random() * 1.6,
      hue: Math.floor(Math.random() * 360),
      rotate: Math.random() * 360,
      spin: 360 + Math.random() * 540,
      size: 7 + Math.random() * 9,
      sway: 20 + Math.random() * 60,
      shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
      key: i,
    })),
  ).current;

  const emoji = useRef(
    Array.from({ length: 16 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.4 + Math.random() * 1.4,
      size: 20 + Math.random() * 14,
      char: CONFETTI_EMOJI[i % CONFETTI_EMOJI.length],
      key: i,
    })),
  ).current;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 40 }}>
      {pieces.map((p) => (
        <div
          key={p.key}
          style={{
            position: 'absolute',
            top: -24,
            left: `${p.left}%`,
            '--sway': `${p.sway}px`,
            '--spin': `${p.spin}deg`,
            animation: `confettiFall ${p.duration}s ${p.delay}s cubic-bezier(0.4,0.1,0.6,0.9) forwards`,
          }}
        >
          <div
            style={{
              width: p.shape === 'ribbon' ? p.size * 0.5 : p.size,
              height: p.shape === 'ribbon' ? p.size * 2.4 : p.shape === 'circle' ? p.size : p.size * 1.5,
              borderRadius: p.shape === 'circle' ? '50%' : 3,
              background: `oklch(72% 0.19 ${p.hue})`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        </div>
      ))}
      {emoji.map((e) => (
        <div
          key={`e${e.key}`}
          style={{
            position: 'absolute',
            top: -30,
            left: `${e.left}%`,
            fontSize: e.size,
            '--sway': '36px',
            '--spin': '40deg',
            animation: `confettiFall ${e.duration}s ${e.delay}s ease-in forwards`,
          }}
        >
          {e.char}
        </div>
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          50% { transform: translate(var(--sway), 380px) rotate(calc(var(--spin) * 0.5)); }
          100% { transform: translate(0, 780px) rotate(var(--spin)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// The celebratory badge that pops up once the child picks the right mouth:
// a bouncing trophy card ringed with twinkling stars and soft glow pulses,
// so success feels like a real reward instead of just a border color change.
function SuccessBadge({ title = '¡Genial!', subtitle = '¡Encontraste la boca correcta!' }) {
  const sparkles = [
    { top: '-8%', left: '4%', size: 26, delay: 0 },
    { top: '4%', left: '86%', size: 20, delay: 0.15 },
    { top: '70%', left: '-4%', size: 22, delay: 0.3 },
    { top: '82%', left: '90%', size: 26, delay: 0.1 },
  ];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 35,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 200,
          padding: '26px 20px',
          borderRadius: 'var(--radius-3xl)',
          background: 'linear-gradient(160deg, #fff, var(--color-primary-tint))',
          boxShadow: '0 20px 44px oklch(55% 0.12 235 / 0.35)',
          border: '3px solid #fff',
          textAlign: 'center',
          animation: 'badgePop 0.55s cubic-bezier(0.34,1.56,0.64,1) both, glowPulse 1.8s ease-in-out 0.6s infinite',
        }}
      >
        {sparkles.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: s.top,
              left: s.left,
              fontSize: s.size,
              animation: `starPop 0.6s ease ${0.3 + s.delay}s backwards, bob 2.2s ease-in-out ${s.delay}s infinite`,
            }}
          >
            ✨
          </div>
        ))}
        <div style={{ fontSize: 54, animation: 'bob 1.6s ease-in-out infinite' }}>🏆</div>
        <div
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--color-primary-dark)',
            marginTop: 6,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', marginTop: 2 }}>
          {subtitle}
        </div>
      </div>
      <style>{`
        @keyframes badgePop {
          0% { transform: scale(0.3) rotate(-8deg); opacity: 0; }
          60% { transform: scale(1.08) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Level4({ letter, played, onPlay, shakeButton, solved, onSolved, wrongIndex, setWrongIndex }) {
  // Correct option is the current letter's own mouth-shape photo; the 3
  // distractors are other letters' mouth photos, picked once per mount and
  // shuffled together so the correct answer isn't trivially always first.
  // Letters that share a confusable (visually identical) mouth photo with
  // the current letter are excluded from the distractor pool.
  const options = useRef(
    (() => {
      const excluded = confusableIdsFor(letter.id);
      const pool = phase1LetterSequence.filter(
        (l) => l.id !== letter.id && l.image && !excluded.has(l.id),
      );
      const shuffledPool = [...pool];
      for (let i = shuffledPool.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
      }
      const distractors = shuffledPool.slice(0, 3);
      const arr = [
        { id: 0, correct: true, image: letter.image },
        ...distractors.map((d, i) => ({ id: i + 1, correct: false, image: d.image })),
      ];
      for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    })(),
  ).current;

  // Preload all 4 option images together and only reveal the grid once every
  // one of them has finished loading, so the correct answer (which might
  // otherwise already be cached from an earlier level) doesn't visibly pop
  // in before the distractors and give the game away. A short safety-net
  // timeout keeps this from ever turning into a long stuck wait if one
  // image is slow (e.g. flaky connection) — after it, whatever's ready
  // just gets shown together instead of blocking indefinitely.
  const [imagesReady, setImagesReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const urls = options.map((opt) => opt.image).filter(Boolean);
    if (urls.length === 0) {
      setImagesReady(true);
      return undefined;
    }
    let loaded = 0;
    const reveal = () => {
      if (!cancelled) setImagesReady(true);
    };
    urls.forEach((url) => {
      const img = new Image();
      const done = () => {
        loaded += 1;
        if (loaded === urls.length) reveal();
      };
      img.onload = done;
      img.onerror = done;
      img.src = url;
    });
    const safetyTimer = setTimeout(reveal, 1800);
    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePick = (opt) => {
    if (solved || !imagesReady) return;
    if (opt.correct) {
      onSolved();
    } else {
      setWrongIndex(opt.id);
      setTimeout(() => setWrongIndex(null), 400);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', position: 'relative' }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)' }}>
        ¿Cuál es la boca correcta?
      </div>
      <LetterVideo src={LEVEL4_VIDEO_URL} />
      <div
        onClick={onPlay}
        className="pressable"
        style={{
          width: 92,
          height: 92,
          borderRadius: '50%',
          background: played ? 'var(--color-primary-tint)' : '#fff',
          boxShadow: 'var(--shadow-elevated)',
          border: `3px solid ${played ? 'var(--color-primary)' : 'oklch(88% 0.02 250)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          cursor: 'pointer',
          animation: shakeButton ? 'shakeX 0.4s' : undefined,
        }}
      >
        🔊
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          width: '100%',
          transition: 'filter var(--duration-base) var(--ease-standard), opacity var(--duration-base) var(--ease-standard)',
          filter: solved ? 'blur(1.5px) brightness(0.94)' : 'none',
          opacity: solved ? 0.55 : 1,
        }}
      >
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => handlePick(opt)}
            className="pressable"
            style={{
              aspectRatio: '1 / 1',
              borderRadius: 'var(--radius-xl)',
              background: solved && opt.correct ? 'var(--color-primary-tint)' : '#fff',
              boxShadow: 'var(--shadow-card)',
              border: `2px solid ${
                solved && opt.correct ? 'var(--color-primary)' : 'var(--color-border)'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              overflow: 'hidden',
              cursor: solved || !imagesReady ? 'default' : 'pointer',
              animation:
                wrongIndex === opt.id
                  ? 'shakeX 0.4s'
                  : solved && opt.correct
                  ? 'pulseLetter 0.5s ease'
                  : undefined,
            }}
          >
            {!imagesReady ? (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '3px solid oklch(88% 0.02 250)',
                  borderTopColor: 'var(--color-primary)',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : opt.image ? (
              <img src={opt.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              '👄'
            )}
          </div>
        ))}
      </div>
      {solved && (
        <>
          <Confetti />
          <SuccessBadge />
        </>
      )}
    </div>
  );
}

// ---- main screen ----

export default function Phase1LetterActivity({ day, letter, onComplete, onClose, onMiniActivity }) {
  const isBalloonFlow = BALLOON_LETTER_IDS.has(letter.id);
  const levelCount = isBalloonFlow ? BALLOON_LEVEL_COUNT : STANDARD_LEVEL_COUNT;
  // Coin-earning "mini activities" within the flow: the sound/balloon round
  // (always index 2) and the calligraphy trace round (always the level right
  // before the final match level, i.e. levelCount - 2). A ref-backed Set
  // guards against double-awarding coins if the child navigates back and
  // forward across the same level again.
  const miniActivityLevels = useRef(new Set([2, levelCount - 2]));
  const awardedLevels = useRef(new Set());

  const [level, setLevel] = useState(0);
  const [played1, setPlayed1] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [sustainProgress, setSustainProgress] = useState([0, 0, 0]);
  const [sustainAudioPlayed, setSustainAudioPlayed] = useState(false);
  const [sustainHintShown, setSustainHintShown] = useState(true);
  const [balloonSoundCount, setBalloonSoundCount] = useState(0);
  const [balloonSilentCount, setBalloonSilentCount] = useState(0);
  const [balloonAudioPlayed, setBalloonAudioPlayed] = useState(false);
  const [calligraphyVideoWatched, setCalligraphyVideoWatched] = useState(false);
  const [calligraphyStarted, setCalligraphyStarted] = useState(false);
  const [played4, setPlayed4] = useState(false);
  const [solved4, setSolved4] = useState(false);
  const [wrongIndex4, setWrongIndex4] = useState(null);
  const [shakeTarget, setShakeTarget] = useState(null);

  // Guards against advancing two levels from a single tap: the balloon
  // rounds auto-advance on a timer once their 3rd balloon pops, and if the
  // child also happens to tap the → arrow in that same window, goNext()
  // would fire on top of it and skip a whole level. Only the first of the
  // two "advance" calls in flight for a given level is allowed through;
  // it resets as soon as the level actually changes.
  const advancingRef = useRef(false);
  useEffect(() => {
    advancingRef.current = false;
  }, [level]);

  // The silent balloon round (level index 3, balloon-flow letters only)
  // never plays the letter's sound when a balloon pops — that's the whole
  // point, the child has to say it themselves — so a short cue plays once,
  // automatically, the moment they land on that level.
  useEffect(() => {
    if (isBalloonFlow && level === 3) {
      playAudio(BALLOON_YOUR_TURN_AUDIO_URL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const setSustainRound = (i, v) => {
    setSustainProgress((arr) => arr.map((x, idx) => (idx === i ? v : x)));
  };
  const sustainActiveIndex = (() => {
    const idx = sustainProgress.findIndex((p) => p < 0.95);
    return idx === -1 ? sustainProgress.length : idx;
  })();

  const gateOk = isBalloonFlow
    ? [
        played1,
        videoWatched || !video2For(letter),
        balloonSoundCount >= 3,
        true, // silent balloon round is optional practice — free to advance any time
        calligraphyVideoWatched || !calligraphyVideoFor(letter),
        calligraphyStarted,
        solved4,
      ]
    : [
        played1,
        videoWatched || !video2For(letter),
        sustainProgress.every((p) => p >= 0.95),
        calligraphyVideoWatched || !calligraphyVideoFor(letter),
        calligraphyStarted,
        solved4,
      ];
  // Counts only a *leading run* of completed gates (not a raw true-count):
  // the silent balloon round's gate is always true (it's optional), so a
  // plain filter(Boolean) would mark it "done" even before earlier, actually
  // required levels are finished.
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
    if (miniActivityLevels.current.has(level) && !awardedLevels.current.has(level)) {
      awardedLevels.current.add(level);
      onMiniActivity?.();
    }
    if (level === levelCount - 1) {
      onComplete();
      return;
    }
    setLevel((l) => Math.min(levelCount - 1, l + 1));
  };

  // The final "guess the mouth" level is the only one that finishes the
  // whole activity, so once it's solved we let the child enjoy the confetti
  // for a beat and then move on automatically — no extra tap needed.
  useEffect(() => {
    if (!solved4) return undefined;
    const t = setTimeout(() => {
      goNext();
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved4]);

  const goPrev = () => {
    if (level === 0) {
      onClose();
      return;
    }
    setLevel((l) => Math.max(0, l - 1));
  };

  const playLetterAudio = () => {
    playAudio(letter.audio);
  };

  return (
    <div style={{ padding: '58px 20px 24px', position: 'relative', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={onClose}>✕</IconButton>
        <DotsNav level={level} unlockedCount={unlockedCount} levelCount={levelCount} />
        <div style={{ width: 44 }} />
      </div>

      <div style={{ marginTop: 28 }}>
        {level === 0 && (
          <Level1
            day={day}
            letter={letter}
            played={played1}
            shakeButton={shakeTarget === 0}
            onPlay={() => {
              playLetterAudio();
              setPlayed1(true);
            }}
          />
        )}
        {level === 1 && (
          <LevelWatch
            letter={letter}
            video={video2For(letter)}
            onVideoPlay={() => setVideoWatched(true)}
            shake={shakeTarget === 1}
            isBalloonFlow={isBalloonFlow}
          />
        )}

        {!isBalloonFlow && level === 2 && (
          <LevelSustain
            letter={letter}
            progresses={sustainProgress}
            setProgress={setSustainRound}
            activeIndex={sustainActiveIndex}
            shakeTrack={shakeTarget === 2}
            hintShown={sustainHintShown}
            onFirstDrag={() => setSustainHintShown(false)}
            audioPlayed={sustainAudioPlayed}
            onAudioPlay={() => {
              playLetterAudio();
              setSustainAudioPlayed(true);
            }}
          />
        )}

        {isBalloonFlow && level === 2 && (
          <LevelBalloons
            letter={letter}
            withSound
            poppedCount={balloonSoundCount}
            onPop={setBalloonSoundCount}
            shake={shakeTarget === 2}
            audioPlayed={balloonAudioPlayed}
            onAudioPlay={() => {
              playLetterAudio();
              setBalloonAudioPlayed(true);
            }}
          />
        )}
        {isBalloonFlow && level === 3 && (
          <LevelBalloons
            letter={letter}
            withSound={false}
            poppedCount={balloonSilentCount}
            onPop={setBalloonSilentCount}
            shake={shakeTarget === 3}
            audioPlayed={balloonAudioPlayed}
            onAudioPlay={() => {
              playLetterAudio();
              setBalloonAudioPlayed(true);
            }}
          />
        )}

        {level === (isBalloonFlow ? 4 : 3) && (
          <LevelCalligraphyVideo
            video={calligraphyVideoFor(letter)}
            onVideoPlay={() => setCalligraphyVideoWatched(true)}
            shake={shakeTarget === (isBalloonFlow ? 4 : 3)}
          />
        )}
        {level === (isBalloonFlow ? 5 : 4) && (
          <Calligraphy
            letter={letter}
            started={calligraphyStarted}
            onStart={() => setCalligraphyStarted(true)}
            shake={shakeTarget === (isBalloonFlow ? 5 : 4)}
          />
        )}
        {level === (isBalloonFlow ? 6 : 5) && (
          <Level4
            letter={letter}
            played={played4}
            shakeButton={shakeTarget === (isBalloonFlow ? 6 : 5)}
            solved={solved4}
            wrongIndex={wrongIndex4}
            setWrongIndex={setWrongIndex4}
            onPlay={() => {
              playLetterAudio();
              setPlayed4(true);
            }}
            onSolved={() => setSolved4(true)}
          />
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 28,
        }}
      >
        <ArrowButton dir="prev" onClick={goPrev} />
        <ArrowButton dir="next" onClick={goNext} shake={shakeTarget === level} />
      </div>
    </div>
  );
}
