import { PrimaryButton } from './Button.jsx';
import Countdown from './Countdown.jsx';

// Friendly "slow down" popup shown when a child tries to start a 3rd new
// block in the same day — explains why (the brain keeps more when learning
// in small steps) and counts down to when the next block opens.
export default function PaceModal({ open, nextUnlockAt, onClose, maxBlocks = 2 }) {
  if (!open) return null;
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
          width: '100%',
          maxWidth: 330,
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-3xl)',
          padding: '32px 24px 26px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-float)',
          animation: 'popIn 0.35s var(--ease-standard)',
        }}
      >
        <div style={{ fontSize: 64, lineHeight: 1 }}>🐢</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)', marginTop: 12 }}>
          ¡Vas muy rápido!
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 10, lineHeight: 1.45 }}>
          Para aprender de verdad, no conviene avanzar todo de una vez. El cerebro retiene mucho más cuando aprende poco a poco y descansa entre sesiones. 🧠
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-text-strong)', fontWeight: 700, marginTop: 10, lineHeight: 1.45 }}>
          Por eso solo se liberan {maxBlocks} bloques por día.
        </div>
        <div
          style={{
            marginTop: 16,
            background: 'var(--color-warning-tint)',
            color: 'var(--color-warning-ink)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 14px',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700 }}>El próximo bloque se libera en</div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 800, fontSize: 26, marginTop: 2 }}>
            ⏳ <Countdown targetMs={nextUnlockAt} />
          </div>
        </div>
        <div style={{ marginTop: 22 }}>
          <PrimaryButton onClick={onClose}>¡Entendido!</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
