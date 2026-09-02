import { useEffect, useRef, useState } from 'react';
import { PrimaryButton } from './Button.jsx';
import GoldCoin from './GoldCoin.jsx';

const CONFETTI_HUES = [235, 40, 340, 150, 60];

function RewardConfetti() {
  const pieces = useRef(
    Array.from({ length: 70 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.2 + Math.random() * 1.4,
      hue: CONFETTI_HUES[i % CONFETTI_HUES.length],
      size: 6 + Math.random() * 7,
      sway: 16 + Math.random() * 26,
      key: i,
    })),
  ).current;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {pieces.map((p) => (
        <div
          key={p.key}
          style={{
            position: 'absolute',
            top: -20,
            left: `${p.left}%`,
            '--sway': `${p.sway}px`,
            width: p.size,
            height: p.size * 1.5,
            borderRadius: 2,
            background: `oklch(72% 0.19 ${p.hue})`,
            animation: `rewardConfettiFall ${p.duration}s ${p.delay}s linear forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes rewardConfettiFall {
          0% { transform: translate(0, -20px) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--sway), 480px) rotate(540deg); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

const KIND_META = {
  mini: { chest: '✨', title: '¡Muy bien!' },
  letter: { chest: '🎁', title: '¡Letra completa!' },
  day: { chest: '🎉', title: '¡Día completo!' },
  checkpoint: { chest: '🏆', title: '¡Súper logro!' },
};

/**
 * Full-screen celebratory modal shown when the child earns coins — a chest
 * "opens" (simple pop + bounce, no asset needed), the coin count rolls up
 * from 0 to the amount earned, and confetti falls behind it. `kind` picks
 * the headline + chest emoji ('mini' | 'letter' | 'day' | 'checkpoint');
 * default is 'mini' for a plain coin pickup.
 */
export default function RewardModal({ open, amount = 0, kind = 'mini', subtitle, onContinue }) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [chestOpen, setChestOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setDisplayAmount(0);
      setChestOpen(false);
      return undefined;
    }
    setChestOpen(false);
    const openTimer = setTimeout(() => setChestOpen(true), 180);

    const steps = Math.min(amount, 24) || 1;
    const stepAmount = amount / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setDisplayAmount(Math.min(amount, Math.round(stepAmount * current)));
      if (current >= steps) clearInterval(interval);
    }, 420 / steps);

    return () => {
      clearTimeout(openTimer);
      clearInterval(interval);
    };
  }, [open, amount]);

  if (!open) return null;

  const meta = KIND_META[kind] || KIND_META.mini;

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
      <RewardConfetti />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 320,
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-3xl)',
          padding: '36px 24px 28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-float)',
          animation: 'popIn 0.35s var(--ease-standard)',
        }}
      >
        <div
          style={{
            fontSize: 72,
            lineHeight: 1,
            transform: chestOpen ? 'scale(1.15) rotate(0deg)' : 'scale(0.9) rotate(-4deg)',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {meta.chest}
        </div>

        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)', marginTop: 12 }}>
          {meta.title}
        </div>

        {subtitle && (
          <div style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 6 }}>{subtitle}</div>
        )}

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 18,
            background: 'var(--color-primary-tint)',
            color: 'var(--color-primary-ink)',
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 800,
            fontSize: 26,
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <GoldCoin size={26} />
          +{displayAmount}
        </div>

        <div style={{ marginTop: 26 }}>
          <PrimaryButton onClick={onContinue}>Continuar →</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
