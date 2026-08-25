import Card from '../components/Card.jsx';

export default function ProfileSwitcher({ profileCards, switchProfile, addProfile, canAddProfile }) {
  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--color-text-strong)', textAlign: 'center' }}>
        ¿Quién va a leer?
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24 }}>
        {profileCards.map((pc) => (
          <Card
            key={pc.id}
            onClick={() => switchProfile(pc.id)}
            radius="var(--radius-xl)"
            style={{ textAlign: 'center', border: `3px solid ${pc.borderColor}` }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto' }}>
              {pc.emoji}
            </div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: 'var(--color-text-strong)', marginTop: 10 }}>
              {pc.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 2 }}>Nivel {pc.level}</div>
          </Card>
        ))}
        {canAddProfile && (
        <div
          onClick={addProfile}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); addProfile(); } }}
          className="card-pressable"
          style={{
            background: '#fff',
            borderRadius: 'var(--radius-xl)',
            padding: 18,
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)',
            border: '3px dashed oklch(85% 0.03 235)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: 'var(--color-primary-dark)' }}>
            +
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--color-primary-dark)', marginTop: 10 }}>
            Agregar perfil
          </div>
        </div>
        )}
      </div>
      {!canAddProfile && (
        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 12, color: 'var(--color-text-subtle)' }}>
          Máximo de 2 perfiles por cuenta.
        </div>
      )}
    </div>
  );
}
