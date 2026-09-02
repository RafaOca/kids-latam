// Small "new version available" banner — the visible half of the PWA
// update-lifecycle flow (the other half is the SW registration/update-check
// logic in ../lib/pwaRegister.js). Tapping the button calls the updateSW()
// callback, which activates the waiting service worker and reloads.
export default function UpdatePrompt({ visible, onUpdate }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 1200,
        background: 'var(--color-text-strong)',
        color: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        boxShadow: 'var(--shadow-float)',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
        🔄 Hay una nueva versión disponible.
      </div>
      <button
        onClick={onUpdate}
        className="pressable"
        style={{
          flexShrink: 0,
          border: 'none',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-primary)',
          color: '#fff',
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          padding: '10px 16px',
          cursor: 'pointer',
          minHeight: 'var(--touch-target-min)',
        }}
      >
        Actualizar
      </button>
    </div>
  );
}
