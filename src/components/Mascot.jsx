export default function Mascot({ size = 120, animate = true, duration = '3s' }) {
  const eye = size * 0.183;
  const pupil = size * 0.083;
  const mouthW = size * 0.283;
  const mouthH = size * 0.14;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'oklch(72% 0.13 235)',
        position: 'relative',
        boxShadow: '0 12px 28px oklch(60% 0.1 235 / 0.35)',
        animation: animate ? `bob ${duration} ease-in-out infinite` : 'none',
      }}
    >
      <div style={{ position: 'absolute', width: eye, height: eye, borderRadius: '50%', background: 'oklch(99% 0.003 235)', top: size * 0.2, left: size * 0.183 }} />
      <div style={{ position: 'absolute', width: eye, height: eye, borderRadius: '50%', background: 'oklch(99% 0.003 235)', top: size * 0.2, right: size * 0.183 }} />
      <div style={{ position: 'absolute', width: pupil, height: pupil, borderRadius: '50%', background: 'oklch(30% 0.06 250)', top: size * 0.267, left: size * 0.242 }} />
      <div style={{ position: 'absolute', width: pupil, height: pupil, borderRadius: '50%', background: 'oklch(30% 0.06 250)', top: size * 0.267, right: size * 0.242 }} />
      <div style={{ position: 'absolute', width: mouthW, height: mouthH, borderRadius: `0 0 ${mouthW}px ${mouthW}px`, borderBottom: '4px solid oklch(30% 0.06 250)', bottom: size * 0.217, left: size * 0.358 }} />
    </div>
  );
}
