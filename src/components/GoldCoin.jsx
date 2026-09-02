/**
 * Small reusable gold-coin icon (flat vector) — replaces the plain 🪙 emoji
 * everywhere coins are shown (CoinCounter, RewardModal, Profile, Tienda) so
 * the "monedas doradas" feel is consistent across the whole app instead of
 * relying on the OS emoji glyph (which renders flat gray on some devices).
 */
export default function GoldCoin({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="goldCoinGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="oklch(92% 0.13 90)" />
          <stop offset="55%" stopColor="oklch(80% 0.16 80)" />
          <stop offset="100%" stopColor="oklch(62% 0.15 65)" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" fill="url(#goldCoinGrad)" stroke="oklch(55% 0.13 65)" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="7.4" fill="none" stroke="oklch(88% 0.1 85 / 0.7)" strokeWidth="1" />
      <text
        x="12"
        y="16.2"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fontFamily="'Fredoka', sans-serif"
        fill="oklch(50% 0.1 65)"
      >
        $
      </text>
      <ellipse cx="8.5" cy="7.5" rx="2.6" ry="1.4" fill="oklch(98% 0.02 90 / 0.55)" transform="rotate(-25 8.5 7.5)" />
    </svg>
  );
}
