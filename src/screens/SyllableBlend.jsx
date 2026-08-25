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
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--color-text-strong)', marginTop: 14 }}>
        {currentPhaseTitle}
      </div>

      {blendNotMerged && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: blendGap, marginTop: 44, transition: 'gap 0.6s ease' }}>
            <div style={{ width: 90, height: 110, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 44, color: 'var(--color-text-strong)', boxShadow: 'var(--shadow-card)' }}>
              {blendPart1.char}
            </div>
            <div style={{ width: 90, height: 110, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 44, color: 'var(--color-text-strong)', boxShadow: 'var(--shadow-card)' }}>
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
          <div style={{ marginTop: 52, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 70, color: 'var(--color-text-strong)', animation: 'popIn 0.4s ease' }}>
            {blendResult.text}
          </div>
          <div style={{ marginTop: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 19, color: 'oklch(45% 0.13 155)' }}>
            ¡Formaste una sílaba!
          </div>
          <PrimaryButton onClick={advanceAndComplete} style={{ marginTop: 32, padding: 18, borderRadius: 22, fontSize: 18 }}>
            Continuar
          </PrimaryButton>
        </>
      )}
    </div>
  );
}
