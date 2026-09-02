import { useEffect, useRef, useState } from 'react';
import { PrimaryButton } from './Button.jsx';
import GoldCoin from './GoldCoin.jsx';
import { CHALLENGE_TYPES, generateWarmUpChallenges } from '../lib/spacedRepetitionEngine.js';
import { PHONEMES_BY_ID } from '../data/phonemesData.js';

// Fire-and-forget remote audio playback — same pattern used throughout
// Phase1LetterActivity.jsx, kept local here so this component has no
// dependency on that screen.
function playAudio(url) {
  if (!url) return;
  const audio = new Audio(url);
  audio.play().catch(() => {});
}

// ---- small shared bits ----

function ProgressDots({ count, current }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 22 : 8,
            height: 8,
            borderRadius: 'var(--radius-full)',
            background: i < current ? 'var(--color-success)' : i === current ? 'var(--color-primary)' : 'var(--color-locked-bg)',
            transition: 'width var(--duration-base) var(--ease-standard), background var(--duration-base) var(--ease-standard)',
          }}
        />
      ))}
    </div>
  );
}

function SpeakerButton({ onPlay, shake, size = 88 }) {
  return (
    <div
      onClick={onPlay}
      className="pressable"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: 'var(--shadow-elevated)',
        border: '3px solid var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        cursor: 'pointer',
        animation: shake ? 'shakeX 0.4s' : 'pulseLetter 1.6s ease-in-out infinite',
      }}
    >
      🔊
    </div>
  );
}

// A quick celebratory confetti pop (reused visual language from
// RewardModal/Phase1LetterActivity) shown right when a challenge is solved.
function MiniConfetti() {
  const pieces = useRef(
    Array.from({ length: 26 }).map((_, i) => {
      const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 60 + Math.random() * 50;
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        hue: [235, 40, 340, 150, 60][i % 5],
        size: 5 + Math.random() * 5,
        spin: 180 + Math.random() * 360,
        delay: Math.random() * 0.05,
        duration: 0.5 + Math.random() * 0.3,
        key: i,
      };
    }),
  ).current;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8, overflow: 'hidden' }}>
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
            animation: `warmupBurst ${p.duration}s ${p.delay}s cubic-bezier(0.2,0.7,0.4,1) forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes warmupBurst {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--spin)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ---- challenge type A: Sonido -> Letra ----

function SoundToLetter({ challenge, onPick, wrongId, solved, played, onPlay, removedIds }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <SpeakerButton onPlay={onPlay} shake={!played} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, width: '100%' }}>
        {challenge.optionIds.filter((id) => !removedIds?.has(id)).map((id) => {
          const phoneme = PHONEMES_BY_ID[id];
          const isCorrect = solved && id === challenge.targetId;
          return (
            <div
              key={id}
              onClick={() => onPick(id)}
              className="pressable"
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 'var(--radius-xl)',
                background: isCorrect ? 'var(--color-primary-tint)' : '#fff',
                border: `3px solid ${isCorrect ? 'var(--color-primary)' : 'var(--color-border)'}`,
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 700,
                fontSize: 34,
                color: 'var(--color-text-strong)',
                cursor: solved ? 'default' : 'pointer',
                animation: wrongId === id ? 'shakeX 0.4s' : isCorrect ? 'pulseLetter 0.5s ease' : undefined,
              }}
            >
              {phoneme?.char || '?'}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- challenge type B: Sonido -> Boca ----

function SoundToMouth({ challenge, onPick, wrongId, solved, played, onPlay, removedIds }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <SpeakerButton onPlay={onPlay} shake={!played} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, width: '100%' }}>
        {challenge.optionIds.filter((id) => !removedIds?.has(id)).map((id) => {
          const phoneme = PHONEMES_BY_ID[id];
          const isCorrect = solved && id === challenge.targetId;
          return (
            <div
              key={id}
              onClick={() => onPick(id)}
              className="pressable"
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 'var(--radius-xl)',
                background: isCorrect ? 'var(--color-primary-tint)' : '#fff',
                border: `3px solid ${isCorrect ? 'var(--color-primary)' : 'var(--color-border)'}`,
                boxShadow: 'var(--shadow-card)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                cursor: solved ? 'default' : 'pointer',
                animation: wrongId === id ? 'shakeX 0.4s' : isCorrect ? 'pulseLetter 0.5s ease' : undefined,
              }}
            >
              {phoneme?.mouthImageUrl ? (
                <img src={phoneme.mouthImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                '👄'
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- challenge type C: Estouro Rápido (balloon pop) ----

const BALLOON_PALETTE = [
  { bg: 'linear-gradient(160deg, oklch(78% 0.16 20), oklch(60% 0.18 10))', knot: 'oklch(56% 0.18 10)' },
  { bg: 'linear-gradient(160deg, oklch(80% 0.15 150), oklch(62% 0.17 160))', knot: 'oklch(58% 0.17 160)' },
  { bg: 'linear-gradient(160deg, oklch(78% 0.15 260), oklch(58% 0.18 250))', knot: 'oklch(54% 0.18 250)' },
];

function BalloonPop({ challenge, onPick, wrongId, poppedId, solved, removedIds }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 8 }}>
        {challenge.optionIds.filter((id) => !removedIds?.has(id)).map((id, i) => {
          const phoneme = PHONEMES_BY_ID[id];
          const palette = BALLOON_PALETTE[i % BALLOON_PALETTE.length];
          const popped = poppedId === id;
          return (
            <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
              {popped ? (
                <div style={{ width: 80, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  onClick={() => onPick(id)}
                  className={solved ? undefined : 'pressable'}
                  style={{
                    width: 80,
                    height: 96,
                    borderRadius: '50% 50% 50% 50% / 58% 58% 42% 42%',
                    background: palette.bg,
                    border: '3px solid rgba(255,255,255,0.55)',
                    boxShadow: '0 10px 22px oklch(0% 0 0 / 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: solved ? 'default' : 'pointer',
                    animation: wrongId === id ? 'shakeX 0.4s' : 'balloonBob 1.8s ease-in-out infinite',
                    animationDelay: wrongId === id ? '0s' : `${i * 0.2}s`,
                  }}
                >
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 28, color: '#fff', textShadow: '0 2px 3px rgba(0,0,0,0.25)' }}>
                    {phoneme?.char || '?'}
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
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes balloonBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

// ---- main modal ----

/**
 * `CalentamientoModal` — the mandatory daily warm-up shown before a new
 * day's letters unlock (Day 2+ of World 1). Draws `roundCount` challenges
 * from `spacedRepetitionEngine`, mixing all 3 mini-game types, and reports
 * every tap back to the parent via `onAnswer` so mastery state stays in
 * sync, then calls `onComplete(coinsEarned)` once every round is solved.
 *
 * The same component powers `CheckpointView` below (see the `variant` prop)
 * for the longer general-review days — same engine, same UI language, just
 * more rounds and a bigger reward.
 */
export default function CalentamientoModal({
  open,
  letterMastery,
  learnedLetterIds,
  currentDay,
  onAnswer,
  onComplete,
  roundCount = 3,
  coinsReward = 10,
  variant = 'warmup', // 'warmup' | 'checkpoint'
}) {
  const [challenges, setChallenges] = useState([]);
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongId, setWrongId] = useState(null);
  const [poppedId, setPoppedId] = useState(null);
  const [played, setPlayed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [removedIds, setRemovedIds] = useState(() => new Set());

  // Build a fresh round every time the modal transitions from closed -> open.
  useEffect(() => {
    if (!open) return;
    const round = generateWarmUpChallenges(letterMastery, learnedLetterIds, currentDay, PHONEMES_BY_ID, roundCount);
    setChallenges(round);
    setIndex(0);
    setSolved(false);
    setWrongId(null);
    setPoppedId(null);
    setPlayed(false);
    setFinished(false);
    setRemovedIds(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const current = challenges[index];

  // Auto-play the phoneme sound the moment a new challenge is shown.
  useEffect(() => {
    if (!open || !current || solved) return undefined;
    setPlayed(false);
    const t = setTimeout(() => {
      playAudio(current.phoneme?.audioUrl);
      setPlayed(true);
    }, 260);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  if (!open || !current) return null;

  const handleReplay = () => {
    playAudio(current.phoneme?.audioUrl);
    setPlayed(true);
  };

  const handlePick = (id) => {
    if (solved) return;
    const correct = id === current.targetId;
    onAnswer?.(current.targetId, correct);
    if (correct) {
      setSolved(true);
      if (current.type === CHALLENGE_TYPES.BALLOON_POP) setPoppedId(id);
      setTimeout(() => {
        if (index + 1 >= challenges.length) {
          setFinished(true);
        } else {
          setIndex((i) => i + 1);
          setSolved(false);
          setWrongId(null);
          setPoppedId(null);
          setRemovedIds(new Set());
        }
      }, 750);
    } else {
      setWrongId(id);
      playAudio(current.phoneme?.audioUrl);
      // Let the shake play out, then make the incorrect option disappear
      // (per spec) so the child isn't tempted to tap it again.
      setTimeout(() => {
        setWrongId(null);
        setRemovedIds((prev) => new Set(prev).add(id));
      }, 420);
    }
  };

  const title = variant === 'checkpoint' ? '¡Día de repaso!' : '¡Calentamiento!';
  const prompt =
    current.type === CHALLENGE_TYPES.SOUND_TO_LETTER
      ? '¿Qué letra hace ese sonido?'
      : current.type === CHALLENGE_TYPES.SOUND_TO_MOUTH
      ? '¿Qué boca hace ese sonido?'
      : `¡Revienta el sonido ${current.phoneme?.sound || ''}!`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1000,
        background: 'var(--color-scrim)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 340,
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-3xl)',
          padding: '28px 22px 26px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-float)',
          animation: 'popIn 0.35s var(--ease-standard)',
        }}
      >
        {!finished ? (
          <>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--color-text-strong)' }}>
              {title}
            </div>
            <div style={{ marginTop: 12 }}>
              <ProgressDots count={challenges.length} current={index} />
            </div>
            <div
              onClick={handleReplay}
              style={{ marginTop: 16, fontSize: 15, fontWeight: 700, color: 'var(--color-primary-ink)', cursor: 'pointer' }}
            >
              {prompt}
            </div>
            <div style={{ marginTop: 18, position: 'relative' }}>
              {current.type === CHALLENGE_TYPES.SOUND_TO_LETTER && (
                <SoundToLetter challenge={current} onPick={handlePick} wrongId={wrongId} solved={solved} played={played} onPlay={handleReplay} removedIds={removedIds} />
              )}
              {current.type === CHALLENGE_TYPES.SOUND_TO_MOUTH && (
                <SoundToMouth challenge={current} onPick={handlePick} wrongId={wrongId} solved={solved} played={played} onPlay={handleReplay} removedIds={removedIds} />
              )}
              {current.type === CHALLENGE_TYPES.BALLOON_POP && (
                <BalloonPop challenge={current} onPick={handlePick} wrongId={wrongId} poppedId={poppedId} solved={solved} removedIds={removedIds} />
              )}
              {solved && <MiniConfetti />}
            </div>
          </>
        ) : (
          <div style={{ padding: '10px 0 4px' }}>
            <div style={{ fontSize: 56, animation: 'popIn 0.4s var(--ease-standard)' }}>🔑</div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 21, color: 'var(--color-text-strong)', marginTop: 8 }}>
              {variant === 'checkpoint' ? '¡Repaso completo!' : '¡Calentamiento completo!'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 4 }}>
              {variant === 'checkpoint' ? 'Desbloqueaste un logro especial.' : 'Se liberó el cofre del día.'}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 16,
                background: 'var(--color-primary-tint)',
                color: 'var(--color-primary-ink)',
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 800,
                fontSize: 22,
                padding: '9px 20px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <GoldCoin size={22} />
              +{coinsReward}
            </div>
            <div style={{ marginTop: 22 }}>
              <PrimaryButton onClick={() => onComplete?.(coinsReward)}>Continuar →</PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Thin, explicitly-named wrapper for the general Checkpoint review days —
// same engine + UI, just a longer round and a bigger reward.
export function CheckpointView(props) {
  return <CalentamientoModal {...props} variant="checkpoint" roundCount={props.roundCount ?? 8} coinsReward={props.coinsReward ?? 150} />;
}
