import { PrimaryButton } from '../components/Button.jsx';

export default function Completion({ profileName, completionSubtitle, completionButtonLabel, continueFromCompletion }) {
  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-onboarding)',
        padding: '58px 32px 40px',
        textAlign: 'center',
      }}
    >
      <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'oklch(72% 0.13 235)', position: 'relative', animation: 'bob 2.4s ease-in-out infinite' }}>
        <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 20, left: 18 }} />
        <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 20, right: 18 }} />
        <div style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: 'oklch(30% 0.06 250)', top: 26, left: 24 }} />
        <div style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: 'oklch(30% 0.06 250)', top: 26, right: 24 }} />
      </div>
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
