const overlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'oklch(20% 0.02 250 / 0.55)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  zIndex: 1300,
};

const sheetStyle = {
  width: '100%',
  maxHeight: '86%',
  overflowY: 'auto',
  background: '#fff',
  borderTopLeftRadius: 'var(--radius-3xl)',
  borderTopRightRadius: 'var(--radius-3xl)',
  padding: '20px 22px 28px',
  boxShadow: '0 -12px 28px oklch(20% 0.02 250 / 0.25)',
};

function Step({ n, children }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 14 }}>
      <div
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: '#fff',
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-ink-soft)', lineHeight: 1.4, paddingTop: 3 }}>{children}</div>
    </div>
  );
}

function CloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      className="pressable"
      aria-label="Cerrar"
      style={{
        position: 'absolute',
        top: 14,
        right: 14,
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: 'none',
        background: 'var(--color-surface-tint)',
        color: 'var(--color-text-muted)',
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ✕
    </button>
  );
}

function MediaPreview({ src, alt }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        marginTop: 18,
        display: 'block',
        border: '1px solid var(--color-border)',
      }}
    />
  );
}

export function AndroidInstallModal({ open, onClose, gifUrl }) {
  if (!open) return null;
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClose={onClose} />
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 19, color: 'var(--color-text-strong)', paddingRight: 30 }}>
          Instalar la app
        </div>
        <Step n={1}>Accede al link del app en el navegador (Google Chrome, Firefox, etc.).</Step>
        <Step n={2}>Toca el ícono del menú en la esquina superior derecha del navegador.</Step>
        <Step n={3}>Aparecerá la opción <strong>"Instalar app"</strong> o <strong>"Añadir a la pantalla de inicio"</strong>. Tócala.</Step>
        <MediaPreview src={gifUrl} alt="Cómo instalar en Android" />
      </div>
    </div>
  );
}

export function IosInstallModal({ open, onClose, gifUrl }) {
  if (!open) return null;
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClose={onClose} />
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 19, color: 'var(--color-text-strong)', paddingRight: 30 }}>
          Instalar el App
        </div>
        <Step n={1}>Toca el ícono de Compartir (cuadrado con flecha hacia arriba, en la parte inferior).</Step>
        <Step n={2}>Desplázate hacia abajo y selecciona <strong>"Añadir a la pantalla de inicio"</strong>.</Step>
        <Step n={3}>Toca <strong>"Añadir"</strong> en la esquina superior derecha.</Step>
        <MediaPreview src={gifUrl} alt="Cómo instalar en iOS" />
      </div>
    </div>
  );
}
