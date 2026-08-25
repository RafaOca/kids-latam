const TABS = [
  { key: 'home', icon: '🏠', label: 'Inicio' },
  { key: 'adventure', icon: '🗺️', label: 'Aventura' },
  { key: 'achievements', icon: '🏆', label: 'Logros' },
  { key: 'profile', icon: '👤', label: 'Perfil' },
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        background: '#fff',
        boxShadow: '0 -2px 12px oklch(50% 0.05 250 / 0.08)',
        padding: '10px 8px calc(10px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onNavigate(tab.key)}
            className="pressable"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              padding: '6px 4px',
              minHeight: 'var(--touch-target-min)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 30,
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? 'var(--color-primary-tint)' : 'transparent',
                transition: 'background var(--duration-base) var(--ease-standard)',
              }}
            >
              <div style={{ fontSize: 20 }}>{tab.icon}</div>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-subtle)',
              }}
            >
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
