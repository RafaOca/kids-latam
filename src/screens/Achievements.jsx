import Card from '../components/Card.jsx';

export default function Achievements({ achievements }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--color-text-strong)' }}>
          🏅 Mis logros
        </div>
        <div
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: '#fff',
            background: 'var(--color-primary)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {unlockedCount} / {achievements.length}
        </div>
      </div>
      <div style={{ marginTop: 12, height: 10, borderRadius: 10, background: 'oklch(92% 0.015 235)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: 10,
            background: 'linear-gradient(90deg, oklch(72% 0.13 200) 0%, var(--color-primary) 100%)',
            width: achievements.length ? `${(unlockedCount / achievements.length) * 100}%` : 0,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 20 }}>
        {achievements.map((a) => (
          <Card
            key={a.title}
            radius="var(--radius-xl)"
            style={{
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: a.unlocked ? '2px solid oklch(85% 0.09 85)' : '2px solid transparent',
              background: a.unlocked ? 'linear-gradient(160deg, #fff 0%, oklch(97% 0.04 85) 100%)' : 'var(--color-surface)',
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  background: a.unlocked ? 'oklch(93% 0.07 85)' : 'var(--color-locked-bg)',
                  boxShadow: a.unlocked ? '0 4px 10px oklch(70% 0.12 85 / 0.35)' : 'none',
                  filter: a.unlocked ? 'none' : 'grayscale(1)',
                  opacity: a.unlocked ? 1 : 0.45,
                }}
              >
                {a.icon}
              </div>
              {!a.unlocked && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    right: -6,
                    fontSize: 14,
                    background: '#fff',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px oklch(20% 0.05 250 / 0.25)',
                  }}
                >
                  🔒
                </div>
              )}
            </div>
            <div
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: a.unlocked ? 'oklch(32% 0.06 250)' : 'oklch(60% 0.02 250)',
                marginTop: 10,
                lineHeight: 1.3,
              }}
            >
              {a.title}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
