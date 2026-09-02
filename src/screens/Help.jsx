import { IconButton } from '../components/Button.jsx';

export default function Help({ goProfile }) {
  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <IconButton onClick={goProfile}>←</IconButton>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)', marginTop: 16 }}>
        ❓ Ayuda
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
        {[
          { icon: '👉', text: 'Toca "Continuar" en la pantalla de inicio para seguir con la próxima actividad.' },
          { icon: '🔊', text: 'Escucha el sonido de cada letra antes de responder.' },
          { icon: '🔒', text: 'Si necesitas ayuda, un adulto puede acompañarte desde el área de padres.' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              background: '#fff',
              borderRadius: 'var(--radius-xl)',
              padding: 16,
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-primary-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'oklch(38% 0.04 250)', marginTop: 4 }}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
