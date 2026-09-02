import { IconButton, PrimaryButton } from '../components/Button.jsx';

export default function SyllableBlend({
  goToPhaseDetail,
  currentPhaseTitle,
  blendNotMerged,
  blendMerged,
  blendGap,
  blendPart1,
  blendPart2,
  blendResult,
  startBlend,
  advanceAndComplete,
}) {
  return (
    <div style={{ padding: '58px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ alignSelf: 'flex-start' }}>
        <IconButton onClick={goToPhaseDetail}>←</IconButton>
      </div>
      <div
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          color: 'var(--color-primary-ink)',
          background: 'var(--color-primary-tint)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          marginTop: 14,
        }}
      >
        🧩 {currentPhaseTitle}
      </div>

      {blendNotMerged && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: blendGap, marginTop: 44, transition: 'gap 0.6s ease' }}>
            <div style={{ width: 90, height: 110, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 44, color: 'var(--color-text-strong)', boxShadow: 'var(--shadow-card)', border: '3px solid var(--color-primary-tint)' }}>
              {blendPart1.char}
            </div>
            <div style={{ width: 90, height: 110, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 44, color: 'var(--color-text-strong)', boxShadow: 'var(--shadow-card)', border: '3px solid var(--color-primary-tint)' }}>
              {blendPart2.char}
            </div>
          </div>
          <div style={{ marginTop: 18, fontSize: 16, color: 'oklch(50% 0.04 250)' }}>
            {blendPart1.sound} + {blendPart2.sound}
          </div>
          <PrimaryButton onClick={startBlend} style={{ marginTop: 32, padding: 18, borderRadius: 22, fontSize: 18 }}>
            Juntar
          </PrimaryButton>
        </>
      )}

      {blendMerged && (
        <>
          <div
            style={{
              marginTop: 52,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'linear-gradient(150deg, var(--color-primary-tint) 0%, oklch(88% 0.06 235) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700,
              fontSize: 62,
              color: 'var(--color-text-strong)',
              animation: 'popIn 0.4s ease',
              boxShadow: '0 10px 22px oklch(60% 0.1 235 / 0.25)',
            }}
          >
            {blendResult.text}
          </div>
          <div style={{ marginTop: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 19, color: 'oklch(45% 0.13 155)' }}>
            🎉 ¡Formaste una sílaba!
          </div>
          <PrimaryButton onClick={advanceAndComplete} style={{ marginTop: 32, padding: 18, borderRadius: 22, fontSize: 18 }}>
            Continuar
          </PrimaryButton>
        </>
      )}
    </div>
  );
}
