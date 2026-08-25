import { IconButton } from '../components/Button.jsx';
import Card from '../components/Card.jsx';

export default function Settings({ goProfile, soundOn, toggleSound }) {
  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <IconButton onClick={goProfile}>←</IconButton>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)', marginTop: 16 }}>
        Configuración
      </div>
      <Card radius="var(--radius-xl)" padding="18px 20px" style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: 'var(--color-ink-soft)' }}>Sonido</span>
        <button
          onClick={toggleSound}
          className="pressable"
          aria-pressed={soundOn}
          style={{ width: 48, height: 28, borderRadius: 'var(--radius-full)', background: soundOn ? 'var(--color-primary)' : 'oklch(88% 0.01 250)', position: 'relative', cursor: 'pointer', border: 'none', padding: 0 }}
        >
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: soundOn ? 23 : 3, transition: 'left 0.2s' }} />
        </button>
      </Card>
    </div>
  );
}
