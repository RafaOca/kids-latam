import { PrimaryButton } from '../components/Button.jsx';

export default function Onboarding4({ tempAvatarEmoji, finishOnboarding }) {
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
      <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.2)' }} />
      <div style={{ position: 'absolute', bottom: -20, left: -30, width: 110, height: 110, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.2)' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ fontSize: 26, animation: 'starPop 0.5s ease' }}>⭐</div>
        <div style={{ fontSize: 26, animation: 'starPop 0.5s ease 0.15s backwards' }}>✨</div>
        <div style={{ fontSize: 26, animation: 'starPop 0.5s ease 0.3s backwards' }}>⭐</div>
      </div>
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 56,
          marginTop: 16,
          boxShadow: '0 12px 24px oklch(50% 0.05 250 / 0.25)',
          border: '4px solid oklch(100% 0 0 / 0.6)',
          animation: 'bob 3s ease-in-out infinite',
        }}
      >
        {tempAvatarEmoji}
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--color-text-strong)', marginTop: 28, maxWidth: 280, lineHeight: 1.4 }}>
        ¡Tu aventura está a punto de comenzar!
      </div>
      <PrimaryButton onClick={finishOnboarding} style={{ marginTop: 36, maxWidth: 280 }}>
        Comenzar a leer 📖
      </PrimaryButton>
    </div>
  );
}
