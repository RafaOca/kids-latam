import { IconButton, PrimaryButton, SecondaryButton } from '../components/Button.jsx';

export default function LetterLearn({ goToPhaseDetail, currentLetter, isPlaying, playSound, continueFromLearn }) {
  return (
    <div style={{ padding: '58px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ alignSelf: 'flex-start' }}>
        <IconButton onClick={goToPhaseDetail}>←</IconButton>
      </div>
      <div
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 110,
          color: 'var(--color-text-strong)',
          marginTop: 24,
          animation: isPlaying ? 'pulseLetter 0.6s ease' : 'none',
        }}
      >
        {currentLetter.char}
      </div>
      <button
        onClick={playSound}
        className="pressable"
        style={{ marginTop: 10, padding: '14px 26px', border: 'none', borderRadius: 20, background: 'var(--color-primary-tint)', color: 'var(--color-primary-ink)', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20, cursor: 'pointer' }}
      >
        🔊 {currentLetter.sound}
      </button>
      <div style={{ marginTop: 28, background: '#fff', borderRadius: 20, padding: '18px 20px', maxWidth: 280, boxShadow: 'var(--shadow-card)', position: 'relative', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ fontSize: 15, color: 'oklch(35% 0.05 250)', textAlign: 'center' }}>
          💡 Esta letra hace {currentLetter.sound}.
        </div>
      </div>
      <PrimaryButton onClick={playSound} style={{ marginTop: 28, padding: 18, borderRadius: 22, fontSize: 18 }}>
        Escuchar
      </PrimaryButton>
      <SecondaryButton onClick={continueFromLearn} style={{ marginTop: 12 }}>
        Continuar
      </SecondaryButton>
    </div>
  );
}
