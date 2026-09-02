import { PrimaryButton } from '../components/Button.jsx';
import Mascot from '../components/Mascot.jsx';

export default function Completion({ profileName, completionSubtitle, completionButtonLabel, continueFromCompletion }) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, oklch(88% 0.05 235) 0%, oklch(92% 0.03 235) 100%)',
        padding: '58px 32px 40px',
        textAlign: 'center',
      }}
    >
      <div style={{ position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.2)' }} />
      <div style={{ position: 'absolute', bottom: -30, right: -40, width: 130, height: 130, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.18)' }} />
      <Mascot size={96} duration="2.4s" />
      <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
        <div style={{ fontSize: 34, animation: 'starPop 0.5s ease' }}>⭐</div>
        <div style={{ fontSize: 34, animation: 'starPop 0.5s ease 0.15s backwards' }}>⭐</div>
        <div style={{ fontSize: 34, animation: 'starPop 0.5s ease 0.3s backwards' }}>⭐</div>
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26, color: 'var(--color-text-strong)', marginTop: 18 }}>
        ¡Excelente, {profileName}!
      </div>
      <div style={{ fontSize: 16, color: 'oklch(40% 0.05 250)', marginTop: 8 }}>{completionSubtitle}</div>
      <PrimaryButton onClick={continueFromCompletion} style={{ marginTop: 36, maxWidth: 280 }}>
        {completionButtonLabel}
      </PrimaryButton>
    </div>
  );
}
