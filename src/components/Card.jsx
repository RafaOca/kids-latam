/**
 * Shared "white card" surface used across Home, Achievements, Profile,
 * PhaseDetail, ParentDashboard, etc. Centralizing it keeps radius/shadow/
 * padding consistent instead of every screen hand-rolling its own values.
 */
export default function Card({ children, onClick, padding = 22, radius = 'var(--radius-3xl)', style, ...props }) {
  const interactive = typeof onClick === 'function';
  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={interactive ? 'card-pressable' : undefined}
      style={{
        background: 'var(--color-surface)',
        borderRadius: radius,
        padding,
        boxShadow: 'var(--shadow-card)',
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
