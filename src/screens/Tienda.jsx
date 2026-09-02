import { useState } from 'react';
import Card from '../components/Card.jsx';
import CoinCounter from '../components/CoinCounter.jsx';
import GoldCoin from '../components/GoldCoin.jsx';
import AvatarPreview from '../components/AvatarPreview.jsx';
import { AvatarBodyArt, HatArt, GlassesArt, CapeArt } from '../components/avatarArt.jsx';
import { SHOP_AVATARS, SHOP_HATS, SHOP_GLASSES, SHOP_CAPES, SHOP_OUTFITS, RARITY_META } from '../data.js';

const TABS = [
  { key: 'avatar', label: 'Personajes', icon: '🦊' },
  { key: 'hat', label: 'Gorros', icon: '🧢' },
  { key: 'glasses', label: 'Accesorios', icon: '🕶️' },
  { key: 'cape', label: 'Capas', icon: '🧣' },
  { key: 'outfit', label: 'Colores', icon: '🎨' },
];

const ITEMS_BY_TAB = {
  avatar: SHOP_AVATARS,
  hat: SHOP_HATS,
  glasses: SHOP_GLASSES,
  cape: SHOP_CAPES,
  outfit: SHOP_OUTFITS,
};

function statusFor({ tab, item, coins, ownedAvatarIds, activeAvatarId, inventory, equippedItems }) {
  if (tab === 'avatar') {
    const owned = ownedAvatarIds.includes(item.id);
    if (!owned) return coins >= item.price ? 'buyable' : 'locked';
    return activeAvatarId === item.id ? 'equipped' : 'ownedSelectable';
  }
  const owned = inventory.includes(item.id);
  if (!owned) return coins >= item.price ? 'buyable' : 'locked';
  return equippedItems[tab] === item.id ? 'equipped' : 'ownedSelectable';
}

const STATUS_META = {
  locked: { label: 'Bloqueado', bg: 'var(--color-locked-bg)', color: 'var(--color-text-subtle)' },
  buyable: { label: 'Comprar', bg: 'var(--color-primary)', color: '#fff' },
  ownedSelectable: { label: 'Elegir', bg: 'var(--color-primary-tint)', color: 'var(--color-primary-ink)' },
  equipped: { label: '✓ Equipado', bg: 'var(--color-success)', color: '#fff' },
};

// Renders the right piece of vector art for a catalog card, independent of
// which tab it lives in — each artwork map (avatarArt.jsx) already exposes
// exactly the pieces the shop needs, so this is just a switch on `tab`.
function ItemArt({ tab, item, dimmed }) {
  const style = { filter: dimmed ? 'grayscale(0.6)' : 'none', opacity: dimmed ? 0.6 : 1 };
  if (tab === 'avatar') return <div style={style}><AvatarBodyArt speciesId={item.id} size={56} /></div>;
  if (tab === 'hat') return <div style={style}><HatArt id={item.id} size={52} /></div>;
  if (tab === 'glasses') return <div style={style}><GlassesArt id={item.id} size={44} /></div>;
  if (tab === 'cape') return <div style={style}><CapeArt id={item.id} size={44} /></div>;
  return null;
}

/**
 * Tap-and-sound tab navigation (each tab plays a short pressable click via
 * the shared `.pressable` class) over a 2-column item grid. Business rules
 * (can-they-afford-it, is-it-owned) are computed here for display only —
 * the actual coin deduction / equip mutation lives in App.jsx's
 * `buyShopItem` / `equipShopItem`, same "screens are dumb, App owns state"
 * pattern as the rest of the app. Every card gets a rarity-colored border
 * (gris = común, azul = raro, dorado = legendario) and shows its price even
 * while locked, so the child always knows what they're saving up for.
 */
export default function Tienda({
  goBack,
  coins,
  activeAvatarId,
  equippedItems,
  unlockedAvatars,
  profileAvatarId,
  inventory,
  onBuyItem,
  onEquipItem,
  onUnequipItem,
  playTapSound,
}) {
  const [tab, setTab] = useState('avatar');
  const ownedAvatarIds = [profileAvatarId, ...unlockedAvatars];
  const items = ITEMS_BY_TAB[tab];

  const handleTap = (item) => {
    playTapSound?.();
    const status = statusFor({ tab, item, coins, ownedAvatarIds, activeAvatarId, inventory, equippedItems });
    if (status === 'buyable') onBuyItem(tab, item);
    else if (status === 'ownedSelectable') onEquipItem(tab, item);
    else if (status === 'equipped' && tab !== 'avatar') onUnequipItem(tab);
    // locked + already-equipped avatar taps are no-ops
  };

  return (
    <div style={{ padding: '58px 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={goBack}
            className="pressable"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#fff',
              border: 'none',
              boxShadow: 'var(--shadow-card)',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)' }}>
            🛍️ Tienda
          </div>
        </div>
        <CoinCounter coins={coins} />
      </div>

      {/* current avatar preview banner */}
      <Card style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <AvatarPreview avatarId={activeAvatarId || profileAvatarId} equippedItems={equippedItems} size={72} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Tu personaje
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--color-text-strong)', marginTop: 2 }}>
            ¡Personalízalo!
          </div>
        </div>
      </Card>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 4, marginTop: 20, background: 'var(--color-surface-tint)', padding: 5, borderRadius: 'var(--radius-full)', overflowX: 'auto' }}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                playTapSound?.();
                setTab(t.key);
              }}
              className="pressable"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '8px 2px',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                background: active ? '#fff' : 'transparent',
                boxShadow: active ? '0 2px 6px oklch(20% 0.1 250 / 0.12)' : 'none',
                cursor: 'pointer',
                minHeight: 'var(--touch-target-min)',
              }}
            >
              <span style={{ fontSize: 15 }}>{t.icon}</span>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: active ? 'var(--color-primary-dark)' : 'var(--color-text-subtle)' }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* item grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18 }}>
        {items.map((item) => {
          const status = statusFor({ tab, item, coins, ownedAvatarIds, activeAvatarId, inventory, equippedItems });
          const meta = STATUS_META[status];
          const dimmed = status === 'locked';
          const rarity = RARITY_META[item.rarity] || RARITY_META.common;
          const isStarterAvatar = tab === 'avatar' && item.id === profileAvatarId;
          return (
            <Card
              key={item.id}
              onClick={() => handleTap(item)}
              radius="var(--radius-xl)"
              style={{ textAlign: 'center', position: 'relative', border: `2.5px solid ${rarity.border}` }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  color: rarity.text,
                  background: rarity.tint,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                }}
              >
                {rarity.label}
              </div>
              {status === 'locked' && (
                <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 14 }}>🔒</div>
              )}
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: '18px auto 0',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: tab === 'outfit' ? item.color : 'var(--color-primary-tint)',
                  filter: dimmed && tab === 'outfit' ? 'grayscale(0.6)' : 'none',
                  opacity: dimmed && tab === 'outfit' ? 0.55 : 1,
                }}
              >
                <ItemArt tab={tab} item={item} dimmed={dimmed} />
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: 'var(--color-text-strong)',
                  marginTop: 10,
                  minHeight: 34,
                }}
              >
                {item.name}
                {isStarterAvatar && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary-dark)', marginTop: 2 }}>
                    Tu compañero inicial
                  </div>
                )}
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  width: '100%',
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  color: meta.color,
                  background: meta.bg,
                  padding: '7px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {status === 'buyable' || status === 'locked' ? (
                  <>
                    <GoldCoin size={14} />
                    {item.price}
                  </>
                ) : (
                  meta.label
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
