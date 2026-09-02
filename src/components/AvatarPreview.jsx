import { getShopItem, RARITY_META } from '../data.js';
import { AvatarBodyArt, HatArt, GlassesArt, CapeArt } from './avatarArt.jsx';

/**
 * Layered avatar renderer ("AvatarRenderer"): every piece is real vector
 * (SVG) art, stacked in a fixed z-index order —
 *   [Fondo/Aura] -> [Capa/Cuello] -> [Cuerpo] -> [Gafas/Máscara] -> [Gorro]
 * — so a future asset swap (hand-drawn PNGs, etc.) only touches avatarArt.jsx,
 * never the layering logic here. `avatarId` accepts both the 12 onboarding
 * animal ids and the rarer shop-only species ids (dragón, unicornio…) since
 * they all live in the same `SHOP_AVATARS` catalog now.
 */
export default function AvatarPreview({ avatarId, equippedItems = {}, size = 96 }) {
  const avatarItem = getShopItem(avatarId);
  const speciesId = avatarItem ? avatarId : 'perro';
  const rarity = avatarItem?.rarity || 'common';
  const outfit = equippedItems.outfit ? getShopItem(equippedItems.outfit) : null;
  const hat = equippedItems.hat ? getShopItem(equippedItems.hat) : null;
  const glasses = equippedItems.glasses ? getShopItem(equippedItems.glasses) : null;
  const cape = equippedItems.cape ? getShopItem(equippedItems.cape) : null;
  const rarityMeta = RARITY_META[rarity];
  const hasAura = rarity !== 'common';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Fondo/Aura — a soft rarity-tinted glow behind everything, only for
          Raro/Legendario companions so common pets stay visually calm. */}
      {hasAura && (
        <div
          style={{
            position: 'absolute',
            inset: -size * 0.14,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rarityMeta.border} 0%, transparent 70%)`,
            opacity: 0.45,
            filter: 'blur(1px)',
          }}
        />
      )}

      {/* Capa/Cuello — sits behind the body, poking out below the chin/shoulders.
          Anchored low enough that most of its height escapes the opaque body
          disc above it (which spans 0..size), so it actually reads as a
          collar/cape instead of being fully hidden behind the head. */}
      {cape && (
        <div
          style={{
            position: 'absolute',
            top: size * 0.58,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        >
          <CapeArt id={cape.id} size={size * 0.82} />
        </div>
      )}

      {/* Cuerpo — the base disc (equipped outfit color, if any) + species art. */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: outfit ? outfit.color : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 14px oklch(20% 0.1 250 / 0.25)',
          border: `3px solid ${outfit ? 'oklch(100% 0 0 / 0.6)' : 'oklch(90% 0.02 235)'}`,
          overflow: 'hidden',
        }}
      >
        <AvatarBodyArt speciesId={speciesId} size={size * 0.92} />
      </div>

      {/* Gafas/Máscara — centered over the character's eye-line. */}
      {glasses && (
        <div
          style={{
            position: 'absolute',
            top: size * 0.4,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            filter: 'drop-shadow(0 2px 3px oklch(0% 0 0 / 0.25))',
          }}
        >
          <GlassesArt id={glasses.id} size={size * 0.4} />
        </div>
      )}

      {/* Gorro — perched on top of the head, above everything else. */}
      {hat && (
        <div
          style={{
            position: 'absolute',
            top: -size * 0.1,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            filter: 'drop-shadow(0 2px 3px oklch(0% 0 0 / 0.25))',
          }}
        >
          <HatArt id={hat.id} size={size * 0.62} />
        </div>
      )}
    </div>
  );
}
