export default function ImageSlot({ placeholder }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background:
          'repeating-linear-gradient(45deg, oklch(90% 0.03 235), oklch(90% 0.03 235) 14px, oklch(85% 0.04 235) 14px, oklch(85% 0.04 235) 28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 16,
      }}
    >
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          color: 'oklch(35% 0.05 235)',
          background: 'oklch(99% 0.003 235 / 0.8)',
          padding: '6px 10px',
          borderRadius: 8,
        }}
      >
        {placeholder}
      </span>
    </div>
  );
}
