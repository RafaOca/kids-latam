import Card from '../components/Card.jsx';
import CoinCounter from '../components/CoinCounter.jsx';
import AvatarPreview from '../components/AvatarPreview.jsx';
import InstallButton from '../components/InstallButton.jsx';

export default function Home({
  profileEmoji,
  activeAvatarId,
  equippedItems,
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
  coins,
  coinBumpAmount,
  coinBumpKey,
  goTienda,
}) {
  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* ---- colorful header band ---- */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '58px 20px 34px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, oklch(72% 0.13 205) 100%)',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 10px 26px oklch(55% 0.12 235 / 0.3)',
        }}
      >
        <div style={{ position: 'absolute', top: -34, right: -28, width: 130, height: 130, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.12)' }} />
        <div style={{ position: 'absolute', bottom: -46, left: -24, width: 100, height: 100, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.08)' }} />
        <div style={{ position: 'absolute', top: 18, right: 90, fontSize: 16, opacity: 0.6 }}>✨</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ animation: 'bob 3s ease-in-out infinite' }}>
              {activeAvatarId ? (
                <div style={{ filter: 'drop-shadow(0 6px 14px oklch(20% 0.1 250 / 0.28))' }}>
                  <AvatarPreview avatarId={activeAvatarId} equippedItems={equippedItems} size={48} />
                </div>
              ) : (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    boxShadow: '0 6px 14px oklch(20% 0.1 250 / 0.28)',
                  }}
                >
                  {profileEmoji}
                </div>
              )}
            </div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 19, color: '#fff' }}>
              Hola, {profileName}! 👋
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CoinCounter coins={coins} bumpAmount={coinBumpAmount} bumpKey={coinBumpKey} onClick={goTienda} />
            <InstallButton
              variant="icon"
              style={{
                width: 44,
                height: 44,
                background: 'oklch(100% 0 0 / 0.2)',
                border: '2px solid oklch(100% 0 0 / 0.35)',
                color: '#fff',
                fontSize: 18,
              }}
            />
            <button
              onClick={goProfile}
              className="pressable"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'oklch(100% 0 0 / 0.2)',
                border: '2px solid oklch(100% 0 0 / 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <Card style={{ marginTop: -20, position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: 'var(--color-primary-ink)',
              background: 'var(--color-primary-tint)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
            }}
          >
            🎯 Tu misión de hoy
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(150deg, var(--color-primary-tint) 0%, oklch(88% 0.06 235) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                flexShrink: 0,
                boxShadow: '0 4px 10px oklch(60% 0.1 235 / 0.18)',
              }}
            >
              {missionIcon}
            </div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 19, color: 'var(--color-text-strong)', lineHeight: 1.3 }}>
              {missionLabel}
            </div>
          </div>
          <button
            onClick={goToRecommended}
            className="pressable"
            style={{
              marginTop: 18,
              width: '100%',
              padding: 16,
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, oklch(60% 0.16 235) 100%)',
              color: '#fff',
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              fontSize: 17,
              cursor: 'pointer',
              minHeight: 'var(--touch-target-min)',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            Continuar →
          </button>
        </Card>

        <Card style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--color-text-strong)' }}>
              Mi progreso
            </div>
            <div
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: '#fff',
                background: progressPercent >= 100 ? 'var(--color-success)' : 'var(--color-primary)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {progressPercent >= 100 ? '🏆 100%' : `${progressPercent}%`}
            </div>
          </div>
          <div style={{ marginTop: 14, height: 14, borderRadius: 10, background: 'oklch(92% 0.015 235)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                borderRadius: 10,
                background: 'linear-gradient(90deg, oklch(72% 0.13 200) 0%, var(--color-primary) 100%)',
                width: `${progressPercent}%`,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {[
              { icon: '🔤', label: `${lettersDoneCount} letras` },
              { icon: '🧩', label: `${syllablesDoneCount} sílabas` },
              { icon: '📖', label: `${wordsDoneCount} palabras` },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  background: 'var(--color-surface-tint)',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <span>{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>
        </Card>

        <Card onClick={goAchievements} style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--color-text-strong)' }}>
              🏅 Mis logros
            </div>
            <span style={{ color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: 13 }}>Ver todos ›</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
            {achievementsPreview.map((ap, i) => (
              <div
                key={i}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: ap.opacity === 1 ? 'oklch(93% 0.06 85)' : 'var(--color-locked-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  opacity: ap.opacity,
                  boxShadow: ap.opacity === 1 ? '0 3px 8px oklch(70% 0.12 85 / 0.35)' : 'none',
                }}
              >
                {ap.icon}
              </div>
            ))}
          </div>
        </Card>
        <Card onClick={goTienda} style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(150deg, oklch(93% 0.06 85) 0%, oklch(88% 0.08 60) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            🛍️
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--color-text-strong)' }}>
              Tienda
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 2 }}>
              Personaliza tu avatar
            </div>
          </div>
          <span style={{ color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: 13 }}>Ver ›</span>
        </Card>
      </div>
    </div>
  );
}
