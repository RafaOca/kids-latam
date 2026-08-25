import Mascot from '../components/Mascot.jsx';
import { PrimaryButton } from '../components/Button.jsx';

export default function Onboarding1({ goEmpezar }) {
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
      <Mascot size={120} />
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, color: 'var(--color-text-strong)', marginTop: 32 }}>
        ¡Hola! 👋
      </div>
      <div style={{ fontSize: 18, color: 'oklch(38% 0.05 250)', marginTop: 12, maxWidth: 280, lineHeight: 1.5 }}>
        Vamos a aprender a leer juntos.
      </div>
      <PrimaryButton onClick={goEmpezar} style={{ marginTop: 44, maxWidth: 280 }}>
        ¡Empezar!
      </PrimaryButton>
    </div>
  );
}
