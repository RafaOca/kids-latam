import { IconButton } from '../components/Button.jsx';

export default function Help({ goProfile }) {
  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <IconButton onClick={goProfile}>←</IconButton>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)', marginTop: 16 }}>
        Ayuda
      </div>
      <div style={{ marginTop: 18, background: '#fff', borderRadius: 22, padding: 20, boxShadow: 'var(--shadow-card)', fontSize: 14, lineHeight: 1.7, color: 'oklch(38% 0.04 250)' }}>
        Toca "Continuar" en la pantalla de inicio para seguir con la próxima actividad. Escucha el sonido de cada letra antes de responder. Si necesitas ayuda, un adulto puede acompañarte desde el área de padres.
      </div>
    </div>
  );
}
