export function PrimaryButton({ children, style, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`pressable ${className}`}
      style={{
        width: '100%',
        padding: 20,
        border: 'none',
        borderRadius: 'var(--radius-2xl)',
        background: 'var(--color-primary)',
        color: '#fff',
        fontFamily: "'Fredoka', sans-serif",
        fontWeight: 600,
        fontSize: 20,
        boxShadow: 'var(--shadow-elevated)',
        cursor: 'pointer',
        minHeight: 'var(--touch-target-min)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, style, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`pressable ${className}`}
      style={{
        width: '100%',
        padding: 16,
        border: '2px solid oklch(80% 0.09 235)',
        borderRadius: 'var(--radius-xl)',
        background: '#fff',
        color: 'var(--color-primary-ink)',
        fontFamily: "'Fredoka', sans-serif",
        fontWeight: 600,
        fontSize: 17,
        cursor: 'pointer',
        minHeight: 'var(--touch-target-min)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function IconButton({ children, style, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`pressable ${className}`}
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: '#fff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        boxShadow: '0 2px 8px oklch(50% 0.05 250 / 0.1)',
        cursor: 'pointer',
        padding: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
