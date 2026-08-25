import Card from '../components/Card.jsx';

export default function Home({
  profileEmoji,
  profileName,
  goProfile,
  missionIcon,
  missionLabel,
  goToRecommended,
  progressPercent,
  lettersDoneCount,
  syllablesDoneCount,
  wordsDoneCount,
  goAchievements,
  achievementsPreview,
}) {
  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            {profileEmoji}
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--color-text-strong)' }}>
            Hola, {profileName}! 👋
          </div>
        </div>
        <button
          onClick={goProfile}
          className="pressable"
          style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 2px 8px oklch(50% 0.05 250 / 0.1)', cursor: 'pointer' }}
        >
          ⚙️
        </button>
      </div>

      <Card style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', color: 'oklch(60% 0.1 235)', textTransform: 'uppercase' }}>
          Tu misión de hoy
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
            {missionIcon}
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 19, color: 'var(--color-text-strong)', lineHeight: 1.3 }}>
            {missionLabel}
          </div>
        </div>
        <button
          onClick={goToRecommended}
          className="pressable"
          style={{ marginTop: 18, width: '100%', padding: 16, border: 'none', borderRadius: 'var(--radius-lg)', background: 'var(--color-primary)', color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17, cursor: 'pointer', minHeight: 'var(--touch-target-min)' }}
        >
          Continuar
        </button>
      </Card>

      <Card style={{ marginTop: 18 }}>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--color-text-strong)' }}>
          Mi progreso
        </div>
        <div style={{ marginTop: 12, height: 14, borderRadius: 10, background: 'oklch(92% 0.015 235)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 10, background: 'var(--color-primary)', width: `${progressPercent}%`, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            {lettersDoneCount} letras • {syllablesDoneCount} sílabas • {wordsDoneCount} palabras
          </span>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--color-primary-dark)' }}>
            {progressPercent}%
          </span>
        </div>
      </Card>

      <Card onClick={goAchievements} style={{ marginTop: 18 }}>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--color-text-strong)' }}>
          Mis logros
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
          {achievementsPreview.map((ap, i) => (
            <div key={i} style={{ fontSize: 24, opacity: ap.opacity }}>
              {ap.icon}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
