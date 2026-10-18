import CoinCounter from '../components/CoinCounter.jsx';
import InstallButton from '../components/InstallButton.jsx';

function StatBox({ icon, label, value }) {
  return (
    <div style={{ background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'oklch(45% 0.02 250)', fontWeight: 700, marginTop: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>{value}</div>
    </div>
  );
}

export default function ParentDashboard({
  goProfile,
  profileName,
  progressPercent,
  lettersDoneCount,
  lettersTotal = 31,
  syllablesDoneCount,
  syllablesTotal = 4,
  wordsDoneCount,
  wordsTotal = 2,
  learningNow,
  masteredList,
  practiceTimeLabel,
  practiceDaysLabel,
  coins,
}) {
  return (
    <div style={{ padding: '58px 20px 30px', background: '#fff', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={goProfile}
          className="pressable"
          style={{ fontSize: 14, color: 'var(--color-primary-dark)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', padding: '8px 0', minHeight: 'var(--touch-target-min)' }}
        >
          ‹ Volver a la app
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CoinCounter coins={coins} size="sm" />
          <InstallButton variant="icon" />
        </div>
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>
        📊 Progreso de {profileName}
      </div>

      <div
        style={{
          marginTop: 20,
          background: 'linear-gradient(135deg, var(--color-primary) 0%, oklch(72% 0.13 205) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 18,
          boxShadow: '0 10px 22px oklch(55% 0.12 235 / 0.25)',
        }}
      >
        <div style={{ fontSize: 13, color: 'oklch(97% 0.01 235)', fontWeight: 700 }}>Progreso general</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 30, color: '#fff', marginTop: 4 }}>{progressPercent}%</div>
        <div style={{ marginTop: 10, height: 10, borderRadius: 8, background: 'oklch(100% 0 0 / 0.25)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#fff', width: `${progressPercent}%` }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
        <StatBox icon="🔤" label="Letras" value={`${lettersDoneCount} / ${lettersTotal}`} />
        <StatBox icon="🧩" label="Sílabas" value={`${syllablesDoneCount} / ${syllablesTotal}`} />
        <StatBox icon="📖" label="Palabras" value={`${wordsDoneCount} / ${wordsTotal}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <div style={{ background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'oklch(45% 0.02 250)', fontWeight: 700 }}>⏱️ Tiempo de práctica</div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>{practiceTimeLabel}</div>
        </div>
        <div style={{ background: 'var(--color-surface-tint)', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'oklch(45% 0.02 250)', fontWeight: 700 }}>📅 Días de práctica</div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: 'oklch(22% 0.02 250)', marginTop: 4 }}>{practiceDaysLabel}</div>
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
