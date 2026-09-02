import { useEffect, useRef, useState } from 'react';
import GoldCoin from './GoldCoin.jsx';

/**
 * Persistent "Monedas Estrella" balance pill. Pass a new `bumpKey` (any
 * value that changes, e.g. `${coins}-${Date.now()}`) whenever coins were
 * just earned to play a little "+N flies up" animation over the counter —
 * the coin icon also does a quick pop so the gain feels tangible even if
 * the child doesn't read the number.
 */
export default function CoinCounter({ coins, bumpAmount, bumpKey, onClick, size = 'md' }) {
  const [floaters, setFloaters] = useState([]);
  const prevBumpKey = useRef(bumpKey);

  useEffect(() => {
    if (bumpKey === undefined || bumpKey === prevBumpKey.current) return;
    prevBumpKey.current = bumpKey;
    if (!bumpAmount) return;
    const id = Math.random().toString(36).slice(2);
    setFloaters((f) => [...f, { id, amount: bumpAmount }]);
    const t = setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 900);
    return () => clearTimeout(t);
  }, [bumpKey, bumpAmount]);

  const compact = size === 'sm';
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={onClick ? 'pressable' : undefined}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        background: '#fff',
        color: 'var(--color-primary-ink)',
        fontFamily: "'Fredoka', sans-serif",
        fontWeight: 800,
        fontSize: compact ? 13 : 15,
        padding: compact ? '5px 12px 5px 6px' : '6px 16px 6px 8px',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 3px 8px oklch(20% 0.1 250 / 0.2)',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          animation: floaters.length ? 'pulseLetter 0.5s ease' : undefined,
        }}
      >
        <GoldCoin size={compact ? 16 : 20} />
      </span>
      <span>{coins ?? 0}</span>

      {floaters.map((f) => (
        <span
          key={f.id}
          style={{
            position: 'absolute',
            top: -4,
            right: 8,
            fontSize: 13,
            fontWeight: 800,
            color: 'var(--color-success-ink)',
            animation: 'coinFloatUp 0.9s ease forwards',
            pointerEvents: 'none',
          }}
        >
          +{f.amount}
        </span>
      ))}

      <style>{`
        @keyframes coinFloatUp {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-26px); opacity: 0; }
        }
      `}</style>
    </Wrapper>
  );
}
