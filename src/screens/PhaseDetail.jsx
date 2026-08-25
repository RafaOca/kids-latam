import { IconButton } from '../components/Button.jsx';
import Card from '../components/Card.jsx';

export default function PhaseDetail({ goAdventure, currentPhaseIcon, currentPhaseTitle, currentPhaseLevels, lockedMessage, lockedToastVisible }) {
  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <IconButton onClick={goAdventure}>←</IconButton>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 13 }}>
          {currentPhaseIcon}
        </div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 21, color: 'var(--color-text-strong)' }}>
          {currentPhaseTitle}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 22 }}>
        {currentPhaseLevels.map((lv, i) => (
          <Card
            key={i}
            onClick={lv.onSelect}
            radius="var(--radius-xl)"
            padding="20px 12px"
            style={{ textAlign: 'center', border: `2px solid ${lv.cardBorder}`, opacity: lv.opacity }}
          >
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26, color: 'var(--color-text-strong)' }}>{lv.main}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{lv.sub}</div>
            {lv.statusLabel && (
              <div style={{ fontSize: 11, fontWeight: 700, color: lv.cardBorder, marginTop: 6 }}>{lv.statusLabel}</div>
            )}
          </Card>
        ))}
      </div>
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
