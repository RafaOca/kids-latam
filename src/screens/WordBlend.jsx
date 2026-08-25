import { IconButton, PrimaryButton } from '../components/Button.jsx';
import ImageSlot from '../components/ImageSlot.jsx';

export default function WordBlend({
  goToPhaseDetail,
  blendNotMerged,
  blendMerged,
  blendGap,
  blendSyl1,
  blendSyl2,
  blendWordResult,
  startBlend,
  advanceAndComplete,
}) {
  return (
    <div style={{ padding: '58px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ alignSelf: 'flex-start' }}>
        <IconButton onClick={goToPhaseDetail}>←</IconButton>
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--color-text-strong)', marginTop: 14 }}>
        Primeras palabras
      </div>

      {blendNotMerged && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: blendGap, marginTop: 44, transition: 'gap 0.6s ease' }}>
            <div style={{ width: 100, height: 110, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 36, color: 'var(--color-text-strong)', boxShadow: 'var(--shadow-card)' }}>
              {blendSyl1.text}
            </div>
            <div style={{ width: 100, height: 110, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 36, color: 'var(--color-text-strong)', boxShadow: 'var(--shadow-card)' }}>
              {blendSyl2.text}
            </div>
          </div>
          <PrimaryButton onClick={startBlend} style={{ marginTop: 32, padding: 18, borderRadius: 22, fontSize: 18 }}>
            Juntar
          </PrimaryButton>
        </>
      )}

      {blendMerged && (
        <>
          <div style={{ marginTop: 24, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 56, color: 'var(--color-text-strong)', animation: 'popIn 0.4s ease' }}>
            {blendWordResult.text}
          </div>
          <div style={{ marginTop: 18, width: 180, height: 120, borderRadius: 18, overflow: 'hidden' }}>
            <ImageSlot placeholder={`ilustración:\n${blendWordResult.text}`} />
          </div>
          <div style={{ marginTop: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 19, color: 'oklch(45% 0.13 155)' }}>
            ¡Leíste {blendWordResult.text}!
          </div>
          <PrimaryButton onClick={advanceAndComplete} style={{ marginTop: 24, padding: 18, borderRadius: 22, fontSize: 18 }}>
            Continuar
          </PrimaryButton>
        </>
      )}
    </div>
  );
}
