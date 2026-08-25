function MenuRow({ label, onClick, last }) {
  return (
    <button
      onClick={onClick}
      className="pressable"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '18px 20px',
        minHeight: 'var(--touch-target-min)',
        cursor: 'pointer',
        border: 'none',
        borderBottom: last ? 'none' : `1px solid var(--color-border)`,
        background: 'transparent',
        textAlign: 'left',
      }}
    >
      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--color-ink-soft)' }}>{label}</span>
      <span style={{ color: 'oklch(70% 0.02 250)' }}>›</span>
    </button>
  );
}

export default function Profile({
  profileEmoji,
  profileName,
  level,
  goAdventure,
  goAchievements,
  goSettings,
  goHelp,
  goProfileSwitcher,
  startParentGate,
  logOut,
}) {
  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--color-primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, boxShadow: '0 8px 20px oklch(50% 0.05 250 / 0.15)' }}>
          {profileEmoji}
        </div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)', marginTop: 14 }}>
          {profileName}
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-primary-dark)', fontWeight: 700, marginTop: 2 }}>Nivel {level}</div>
      </div>

      <div style={{ marginTop: 24, background: '#fff', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
        <MenuRow label="Mi progreso" onClick={goAdventure} />
        <MenuRow label="Mis logros" onClick={goAchievements} />
        <MenuRow label="Configuración" onClick={goSettings} />
        <MenuRow label="Ayuda" onClick={goHelp} />
        <MenuRow label="Cambiar de perfil" onClick={goProfileSwitcher} last />
      </div>

      <button
        onClick={startParentGate}
        className="pressable"
        style={{
          marginTop: 20,
          width: '100%',
          padding: 18,
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--color-primary)',
          background: 'oklch(96% 0.02 235)',
          color: 'var(--color-primary-ink)',
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minHeight: 'var(--touch-target-min)',
        }}
      >
        🔒 Área de padres
      </button>

      <button
        onClick={logOut}
        className="pressable"
        style={{ display: 'block', margin: '20px auto 0', textAlign: 'center', fontSize: 14, color: 'var(--color-text-subtle)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', padding: '8px 12px', minHeight: 'var(--touch-target-min)' }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
