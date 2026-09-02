const ADVENTURE_BG_URL =
  'https://gdjjwhrupmhadnahqslg.supabase.co/storage/v1/object/public/app-assets/fundo.png';

export default function Adventure({ phasesSummary, lockedMessage, lockedToastVisible }) {
  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          zIndex: 3,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '0.06em',
            color: '#fff',
            textTransform: 'uppercase',
            background: 'oklch(30% 0.06 250 / 0.4)',
            backdropFilter: 'blur(4px)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 4px 14px oklch(20% 0.05 250 / 0.25)',
          }}
        >
          🗺️ Mi aventura de leer
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 874 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src={ADVENTURE_BG_URL}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ position: 'relative', top: 110 }}>
        {phasesSummary.map((ph) => (
          <div key={ph.num} style={{ position: 'absolute', zIndex: 1 }}>
            {ph.hasConnector && (
              <div
                style={{
                  position: 'absolute',
                  left: ph.connLeft,
                  top: ph.connTop,
                  width: ph.connWidth,
                  height: 0,
                  borderTop: '4px dashed oklch(55% 0.15 240)',
                  transform: `rotate(${ph.connAngle}deg)`,
                  transformOrigin: '0 0',
                }}
              />
            )}
            <div
              onClick={ph.onSelect}
              className="pressable"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ph.onSelect(); } }}
              style={{
                position: 'absolute',
                left: ph.nodeLeft,
                top: ph.nodeTop,
                width: 130,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: ph.nodeBg,
                  border: `5px solid ${ph.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: ph.isUnlocked
                    ? `0 6px 18px oklch(20% 0.05 250 / 0.25), 0 0 0 6px ${ph.borderColor.replace(')', ' / 0.2)')}`
                    : '0 6px 18px oklch(20% 0.05 250 / 0.25)',
                  position: 'relative',
                  animation: ph.pulseAnim,
                }}
              >
                {ph.isLocked && <div style={{ fontSize: 32, opacity: 0.7 }}>🔒</div>}
                {ph.isUnlocked && (
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: `linear-gradient(150deg, ${ph.borderColor} 0%, var(--color-primary) 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      boxShadow: '0 3px 8px oklch(20% 0.1 250 / 0.25)',
                    }}
                  >
                    {ph.badgeText}
                  </div>
                )}
              </div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '6px 12px', marginTop: 8, boxShadow: '0 3px 10px oklch(20% 0.05 250 / 0.15)', minWidth: 94 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: ph.borderColor, flexShrink: 0 }} />
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 12, color: 'oklch(30% 0.06 250)', textAlign: 'center', lineHeight: 1.25 }}>
                    {ph.num}. {ph.title}
                  </div>
                </div>
                <div style={{ marginTop: 4, height: 5, borderRadius: 'var(--radius-full)', background: 'oklch(92% 0.01 250)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 'var(--radius-full)',
                      width: ph.total ? `${Math.min(100, (ph.doneCount / ph.total) * 100)}%` : 0,
                      background: ph.borderColor,
                    }}
                  />
                </div>
                <div style={{ fontSize: 10, color: 'oklch(55% 0.03 250)', textAlign: 'center', marginTop: 3, fontWeight: 700 }}>
                  {ph.doneCount} / {ph.total}
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
      <div
        style={{
          position: 'sticky',
          bottom: 12,
          marginTop: 14,
          background: 'oklch(30% 0.06 250)',
          color: '#fff',
          padding: '12px 18px',
          borderRadius: 16,
          textAlign: 'center',
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          display: lockedToastVisible ? 'block' : 'none',
        }}
      >
        {lockedMessage}
      </div>
    </div>
  );
}
