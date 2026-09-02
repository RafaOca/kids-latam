import { IconButton } from '../components/Button.jsx';
import Card from '../components/Card.jsx';

function LetterChip({ letter, status, textColor, onSelect, wide }) {
  const locked = status === 'locked';
  const current = status === 'current';
  return (
    <div
      onClick={onSelect}
      className="pressable"
      style={{
        position: 'relative',
        width: wide ? 96 : 80,
        height: 80,
        borderRadius: 22,
        background: '#fff',
        border: current ? '3px solid var(--color-primary)' : '3px solid transparent',
        boxShadow: '0 10px 20px oklch(20% 0.06 250 / 0.28)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        animation: current ? 'glowPulse 1.8s infinite' : undefined,
      }}
    >
      <div
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 32,
          color: locked ? 'oklch(78% 0.02 250)' : textColor,
          lineHeight: 1,
        }}
      >
        {letter.char}
      </div>
      {letter.sub && (
        <div style={{ fontSize: 9, fontWeight: 700, color: locked ? 'oklch(78% 0.02 250)' : textColor, marginTop: 2 }}>
          {letter.sub}
        </div>
      )}
      {locked && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'oklch(55% 0.02 250)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            boxShadow: '0 2px 6px oklch(20% 0.05 250 / 0.35)',
          }}
        >
          🔒
        </div>
      )}
      {status === 'done' && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--color-primary-dark)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 2px 6px oklch(20% 0.05 250 / 0.35)',
          }}
        >
          ✓
        </div>
      )}
      {current && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            boxShadow: '0 2px 6px oklch(20% 0.05 250 / 0.35)',
          }}
        >
          ▶
        </div>
      )}
    </div>
  );
}

function DayBlock({ day, letterStatuses, onSelectLetter }) {
  const allDone = letterStatuses.every((s) => s === 'done');
  return (
    <div style={{ position: 'relative', marginBottom: 56 }}>
      <div
        style={{
          background: day.color,
          borderRadius: 32,
          padding: '26px 20px 44px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 26px oklch(20% 0.06 250 / 0.18)',
        }}
      >
        <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.08)' }} />
        {allDone && (
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'oklch(100% 0 0 / 0.25)',
              border: '1px solid oklch(100% 0 0 / 0.4)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            ✓ Completo
          </div>
        )}
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: 20,
            background: 'oklch(100% 0 0 / 0.22)',
            border: '2px solid oklch(100% 0 0 / 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 38,
            boxShadow: '0 4px 10px oklch(20% 0.1 250 / 0.15)',
          }}
        >
          {day.emoji}
        </div>
        <div style={{ color: '#fff', opacity: 0.85, fontSize: 18, marginTop: 4, lineHeight: 1 }}>▾</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, color: '#fff', marginTop: 2 }}>
          Día {day.day}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -34,
          display: 'flex',
          gap: 14,
          justifyContent: 'center',
        }}
      >
        {day.letters.map((l, li) => (
          <LetterChip
            key={l.id}
            letter={l}
            status={letterStatuses[li]}
            textColor={day.textColor}
            wide={day.letters.length === 1}
            onSelect={() => onSelectLetter(li)}
          />
        ))}
      </div>
    </div>
  );
}

export default function PhaseDetail({
  goAdventure,
  activePhase,
  currentPhaseIcon,
  currentPhaseTitle,
  currentPhaseLevels,
  phase1Days,
  phase1DoneLetters,
  openPhase1Letter,
  lockedMessage,
  lockedToastVisible,
}) {
  const isPhase1 = activePhase === 1;

  // Running counter across days so unlocking is per-letter, not per-day.
  let flatIndex = 0;

  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <IconButton onClick={goAdventure}>←</IconButton>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(150deg, var(--color-primary) 0%, oklch(60% 0.16 235) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            boxShadow: '0 4px 10px oklch(60% 0.1 235 / 0.3)',
          }}
        >
          {currentPhaseIcon}
        </div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 21, color: 'var(--color-text-strong)' }}>
          {currentPhaseTitle}
        </div>
      </div>

      {isPhase1 ? (
        <div style={{ marginTop: 32 }}>
          {phase1Days.map((day) => {
            const letterStatuses = day.letters.map(() => {
              const idx = flatIndex;
              flatIndex += 1;
              return idx < phase1DoneLetters ? 'done' : idx === phase1DoneLetters ? 'current' : 'locked';
            });
            const startIndex = flatIndex - day.letters.length;
            return (
              <DayBlock
                key={day.day}
                day={day}
                letterStatuses={letterStatuses}
                onSelectLetter={(li) => openPhase1Letter(startIndex + li)}
              />
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 22 }}>
          {currentPhaseLevels.map((lv, i) => {
            const tint = lv.cardBorder.replace(')', ' / 0.15)');
            return (
              <Card
                key={i}
                onClick={lv.onSelect}
                radius="var(--radius-xl)"
                padding="20px 12px"
                style={{ textAlign: 'center', border: `2px solid ${lv.cardBorder}`, opacity: lv.opacity, position: 'relative' }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    margin: '0 auto',
                    borderRadius: '50%',
                    background: tint,
                    color: lv.cardBorder,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26, color: 'var(--color-text-strong)', marginTop: 8 }}>{lv.main}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{lv.sub}</div>
                {lv.statusLabel && (
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 700,
                      color: lv.cardBorder,
                      background: tint,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      marginTop: 8,
                    }}
                  >
                    {lv.statusLabel}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <div
        style={{
          position: 'sticky',
          bottom: 12,
          marginTop: 16,
          background: 'var(--color-scrim)',
          color: '#fff',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          display: lockedToastVisible ? 'block' : 'none',
        }}
      >
        {lockedMessage}
      </div>
    </div>
  );
}
