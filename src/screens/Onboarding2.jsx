import { PrimaryButton } from '../components/Button.jsx';

export default function Onboarding2({ tempName, setTempName, confirmName }) {
  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '58px 32px 40px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--color-primary-tint)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
        }}
      >
        ✏️
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 28, color: 'var(--color-text-strong)', marginTop: 18 }}>
        ¿Cómo te llamas?
      </div>
      <input
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
        placeholder="Lara"
        className="text-input"
        style={{
          marginTop: 32,
          width: '100%',
          maxWidth: 280,
          padding: '18px 22px',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--color-locked)',
          fontFamily: "'Fredoka', sans-serif",
          fontSize: 22,
          textAlign: 'center',
          color: 'var(--color-text-strong)',
          background: '#fff',
          boxShadow: 'var(--shadow-card)',
        }}
      />
      <PrimaryButton onClick={confirmName} style={{ marginTop: 32, maxWidth: 280 }}>
        Continuar
      </PrimaryButton>
    </div>
  );
}
