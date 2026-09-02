import { avatars } from '../data.js';
import { PrimaryButton } from '../components/Button.jsx';

export default function Onboarding3({ tempName, tempAvatarId, setTempAvatarId, confirmAvatar }) {
  return (
    <div style={{ minHeight: '100%', padding: '58px 24px 40px', textAlign: 'center' }}>
      <div style={{ fontSize: 17, color: 'oklch(50% 0.04 250)' }}>¡Hola, {tempName}! 👋</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--color-text-strong)', marginTop: 6 }}>
        Elige tu avatar
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
        {avatars.map((av) => {
          const selected = av.id === tempAvatarId;
          return (
            <div
              key={av.id}
              onClick={() => setTempAvatarId(av.id)}
              className="pressable"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTempAvatarId(av.id); } }}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: selected ? 'linear-gradient(150deg, var(--color-primary-tint) 0%, oklch(88% 0.06 235) 100%)' : 'oklch(93% 0.03 235)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  boxShadow: selected ? '0 0 0 4px var(--color-primary), 0 6px 14px oklch(60% 0.1 235 / 0.25)' : 'none',
                  transition: 'box-shadow var(--duration-base) var(--ease-standard)',
                }}
              >
                {av.emoji}
              </div>
              {selected && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: 4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: '0 2px 6px oklch(20% 0.05 250 / 0.35)',
                  }}
                >
                  ✓
                </div>
              )}
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 11, color: selected ? 'var(--color-primary-dark)' : 'oklch(40% 0.05 250)' }}>
                {av.name}
              </div>
            </div>
          );
        })}
      </div>
      <PrimaryButton onClick={confirmAvatar} style={{ marginTop: 28 }}>
        ¡Este soy yo!
      </PrimaryButton>
    </div>
  );
}
