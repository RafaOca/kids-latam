import Mascot from '../components/Mascot.jsx';
import { PrimaryButton } from '../components/Button.jsx';

export default function Onboarding1({ goEmpezar }) {
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
      <div style={{ position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.25)' }} />
      <div style={{ position: 'absolute', bottom: 40, right: -50, width: 140, height: 140, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.2)' }} />
      <div style={{ position: 'absolute', top: '18%', right: 36, fontSize: 22 }}>✨</div>
      <div style={{ position: 'absolute', top: '30%', left: 30, fontSize: 18 }}>⭐</div>

      <Mascot size={120} />
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, color: 'var(--color-text-strong)', marginTop: 32 }}>
        ¡Hola! 👋
      </div>
      <div style={{ fontSize: 18, color: 'oklch(38% 0.05 250)', marginTop: 12, maxWidth: 280, lineHeight: 1.5 }}>
        Vamos a aprender a leer juntos.
      </div>
      <PrimaryButton onClick={goEmpezar} style={{ marginTop: 44, maxWidth: 280 }}>
        ¡Empezar! 🚀
      </PrimaryButton>
    </div>
  );
}
