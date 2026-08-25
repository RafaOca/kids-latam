function StatBox({ label, value }) {
  return (
    <div style={{ background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: 'oklch(45% 0.02 250)', fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>{value}</div>
    </div>
  );
}

export default function ParentDashboard({
  goProfile,
  profileName,
  progressPercent,
  lettersDoneCount,
  syllablesDoneCount,
  wordsDoneCount,
  learningNow,
  masteredList,
}) {
  return (
    <div style={{ padding: '58px 20px 30px', background: '#fff', minHeight: '100%' }}>
      <button
        onClick={goProfile}
        className="pressable"
        style={{ fontSize: 14, color: 'var(--color-primary-dark)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', padding: '8px 0', minHeight: 'var(--touch-target-min)' }}
      >
        ‹ Volver a la app
      </button>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>
        Progreso de {profileName}
      </div>

      <div style={{ marginTop: 20, background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-lg)', padding: 18 }}>
        <div style={{ fontSize: 13, color: 'oklch(45% 0.02 250)', fontWeight: 700 }}>Progreso general</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 30, color: 'var(--color-primary-dark)', marginTop: 4 }}>{progressPercent}%</div>
        <div style={{ marginTop: 10, height: 10, borderRadius: 8, background: 'oklch(90% 0.01 250)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--color-primary)', width: `${progressPercent}%` }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
        <StatBox label="Letras" value={`${lettersDoneCount} / 5`} />
        <StatBox label="Sílabas" value={`${syllablesDoneCount} / 4`} />
        <StatBox label="Palabras" value={`${wordsDoneCount} / 2`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <div style={{ background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'oklch(45% 0.02 250)', fontWeight: 700 }}>Tiempo de práctica</div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>1h 32min</div>
        </div>
        <div style={{ background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'oklch(45% 0.02 250)', fontWeight: 700 }}>Días de práctica</div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>8 días</div>
        </div>
      </div>

      <div style={{ marginTop: 22, fontSize: 13, fontWeight: 700, color: 'oklch(45% 0.02 250)' }}>Lo que está aprendiendo</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {learningNow.map((li, i) => (
          <div key={i} style={{ background: 'var(--color-warning-tint)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--color-warning-ink)' }}>
            {li}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, fontSize: 13, fontWeight: 700, color: 'oklch(45% 0.02 250)' }}>Lo que ya domina</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {masteredList.map((mi, i) => (
          <div key={i} style={{ background: 'oklch(90% 0.1 155 / 0.3)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--color-success-ink)' }}>
            ✓ {mi}
          </div>
        ))}
      </div>
    </div>
  );
}
