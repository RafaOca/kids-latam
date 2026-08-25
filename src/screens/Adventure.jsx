const ADVENTURE_BG_URL =
  'https://gdjjwhrupmhadnahqslg.supabase.co/storage/v1/object/public/app-assets/fundo.png';

export default function Adventure({ phasesSummary, lockedMessage, lockedToastVisible }) {
  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '0.08em',
          color: '#fff',
          textAlign: 'center',
          textTransform: 'uppercase',
          textShadow: '0 2px 6px oklch(20% 0.05 250 / 0.5)',
          position: 'absolute',
          top: 58,
          left: 0,
          right: 0,
          zIndex: 3,
        }}
      >
        Mi aventura de leer
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
                  boxShadow: '0 6px 18px oklch(20% 0.05 250 / 0.25)',
                  position: 'relative',
                  animation: ph.pulseAnim,
                }}
              >
                {ph.isLocked && <div style={{ fontSize: 32 }}>🔒</div>}
                {ph.isUnlocked && (
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14 }}>
                    {ph.badgeText}
                  </div>
                )}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: '4px 10px', marginTop: 8, boxShadow: '0 3px 10px oklch(20% 0.05 250 / 0.15)' }}>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 12, color: 'oklch(30% 0.06 250)', textAlign: 'center', lineHeight: 1.25 }}>
                  {ph.num}. {ph.title}
                </div>
                <div style={{ fontSize: 10, color: 'oklch(55% 0.03 250)', textAlign: 'center' }}>
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
