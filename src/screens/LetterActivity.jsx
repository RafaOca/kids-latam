import { IconButton } from '../components/Button.jsx';

export default function LetterActivity({ goToLearn, currentLetter, playSound, quizOptions, showCorrectFeedback, showWrongFeedback, advanceAndComplete }) {
  return (
    <div style={{ padding: '58px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ alignSelf: 'flex-start' }}>
        <IconButton onClick={goToLearn}>←</IconButton>
      </div>
      <div onClick={playSound} style={{ marginTop: 20, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20, color: 'oklch(45% 0.1 235)', cursor: 'pointer' }}>
        🔊 {currentLetter.sound}
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)', marginTop: 14 }}>
        ¿Cuál hace {currentLetter.sound}?
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
        {quizOptions.map((opt) => (
          <div
            key={opt.id}
            onClick={opt.onSelect}
            className="pressable"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opt.onSelect(); } }}
            style={{
              width: 84,
              height: 100,
              borderRadius: 'var(--radius-xl)',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700,
              fontSize: 38,
              color: 'var(--color-text-strong)',
              boxShadow: 'var(--shadow-card)',
              border: `3px solid ${opt.borderColor}`,
              cursor: 'pointer',
            }}
          >
            {opt.char}
          </div>
        ))}
      </div>
      {showCorrectFeedback && (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 44 }}>🎉</div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'oklch(45% 0.13 155)', marginTop: 6 }}>
            ¡Muy bien!
          </div>
          <button
            onClick={advanceAndComplete}
            style={{ marginTop: 18, padding: '16px 40px', border: 'none', borderRadius: 20, background: 'var(--color-primary)', color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, cursor: 'pointer' }}
          >
            Continuar
          </button>
        </div>
      )}
      {showWrongFeedback && (
        <div style={{ marginTop: 32, textAlign: 'center', animation: 'shakeX 0.4s' }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 19, color: 'oklch(55% 0.14 40)' }}>
            ¡Casi! Inténtalo otra vez.
          </div>
        </div>
      )}
    </div>
  );
}
