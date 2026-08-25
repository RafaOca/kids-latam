import { PrimaryButton } from '../components/Button.jsx';

export default function Onboarding4({ tempAvatarEmoji, finishOnboarding }) {
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
          boxShadow: '0 12px 24px oklch(50% 0.05 250 / 0.25)',
        }}
      >
        {tempAvatarEmoji}
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--color-text-strong)', marginTop: 28, maxWidth: 280, lineHeight: 1.4 }}>
        ¡Tu aventura está a punto de comenzar!
      </div>
      <PrimaryButton onClick={finishOnboarding} style={{ marginTop: 36, maxWidth: 280 }}>
        Comenzar a leer
      </PrimaryButton>
    </div>
  );
}
