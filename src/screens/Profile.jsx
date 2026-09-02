import AvatarPreview from '../components/AvatarPreview.jsx';
import GoldCoin from '../components/GoldCoin.jsx';

const MENU_ITEMS_META = {
  'Mi progreso': '🗺️',
  'Mis logros': '🏅',
  'Tienda': '🛍️',
  'Configuración': '⚙️',
  'Ayuda': '❓',
  'Cambiar de perfil': '🔄',
};

function MenuRow({ label, onClick, last }) {
  return (
    <button
      onClick={onClick}
      className="pressable"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '16px 20px',
        minHeight: 'var(--touch-target-min)',
        cursor: 'pointer',
        border: 'none',
        borderBottom: last ? 'none' : `1px solid var(--color-border)`,
        background: 'transparent',
        textAlign: 'left',
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
        {MENU_ITEMS_META[label] || '•'}
      </div>
      <span style={{ flex: 1, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--color-ink-soft)' }}>{label}</span>
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
  activeAvatarId,
  equippedItems,
  coins,
  goTienda,
}) {
  return (
    <div style={{ padding: '0 0 24px' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '58px 20px 40px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, oklch(72% 0.13 205) 100%)',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 10px 26px oklch(55% 0.12 235 / 0.3)',
        }}
      >
        <div style={{ position: 'absolute', top: -30, left: -26, width: 110, height: 110, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.1)' }} />
        <div style={{ position: 'absolute', bottom: -40, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.08)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {activeAvatarId ? (
            <div style={{ filter: 'drop-shadow(0 10px 24px oklch(20% 0.1 250 / 0.3))' }}>
              <AvatarPreview avatarId={activeAvatarId} equippedItems={equippedItems} size={100} />
            </div>
          ) : (
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                boxShadow: '0 10px 24px oklch(20% 0.1 250 / 0.3)',
                border: '4px solid oklch(100% 0 0 / 0.5)',
              }}
            >
              {profileEmoji}
            </div>
          )}
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', marginTop: 14 }}>
            {profileName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13,
                color: 'var(--color-primary-ink)',
                fontWeight: 800,
                background: '#fff',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 3px 8px oklch(20% 0.1 250 / 0.2)',
              }}
            >
              ⭐ Nivel {level}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13,
                color: 'var(--color-primary-ink)',
                fontWeight: 800,
                background: '#fff',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 3px 8px oklch(20% 0.1 250 / 0.2)',
              }}
            >
              <GoldCoin size={15} /> {coins ?? 0}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ marginTop: 22, background: '#fff', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <MenuRow label="Mi progreso" onClick={goAdventure} />
          <MenuRow label="Mis logros" onClick={goAchievements} />
          <MenuRow label="Tienda" onClick={goTienda} />
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
    </div>
  );
}
