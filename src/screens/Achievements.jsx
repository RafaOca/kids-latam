import Card from '../components/Card.jsx';

export default function Achievements({ achievements }) {
  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--color-text-strong)' }}>
        Mis logros
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 20 }}>
        {achievements.map((a) => (
          <Card key={a.title} radius="var(--radius-xl)" style={{ textAlign: 'center', opacity: a.opacity }}>
            <div style={{ fontSize: 32 }}>{a.icon}</div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 13, color: 'oklch(32% 0.06 250)', marginTop: 8, lineHeight: 1.3 }}>
              {a.title}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
