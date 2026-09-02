// Flat-vector "critter" art rendered instead of emoji for every avatar,
// hat, pair of glasses and cape in the shop. Everything here is built from a
// small set of shared primitives (ears, head, snout, eyes, decorations) so
// adding a new avatar/species is a config entry, not a bespoke illustration
// — but the output is real layered SVG, not text emoji.

function Ears({ shape, color }) {
  switch (shape) {
    case 'pointy':
      return (
        <>
          <path d="M 22 34 L 13 4 L 39 26 Z" fill={color} />
          <path d="M 78 34 L 87 4 L 61 26 Z" fill={color} />
        </>
      );
    case 'floppy':
      return (
        <>
          <ellipse cx="15" cy="58" rx="11" ry="21" fill={color} transform="rotate(-16 15 58)" />
          <ellipse cx="85" cy="58" rx="11" ry="21" fill={color} transform="rotate(16 85 58)" />
        </>
      );
    case 'tall':
      return (
        <>
          <ellipse cx="35" cy="12" rx="8" ry="25" fill={color} />
          <ellipse cx="65" cy="12" rx="8" ry="25" fill={color} />
          <ellipse cx="35" cy="16" rx="4" ry="18" fill="oklch(85% 0.08 350)" />
          <ellipse cx="65" cy="16" rx="4" ry="18" fill="oklch(85% 0.08 350)" />
        </>
      );
    case 'round':
    default:
      return (
        <>
          <circle cx="19" cy="27" r="14" fill={color} />
          <circle cx="81" cy="27" r="14" fill={color} />
        </>
      );
  }
}

function Mane({ color }) {
  const spikes = 12;
  return (
    <g>
      {Array.from({ length: spikes }).map((_, i) => {
        const angle = (i / spikes) * Math.PI * 2;
        const x = 50 + Math.cos(angle) * 34;
        const y = 55 + Math.sin(angle) * 34;
        return <circle key={i} cx={x} cy={y} r="12" fill={color} />;
      })}
    </g>
  );
}

function Wings({ color }) {
  return (
    <>
      <path d="M 10 50 Q -6 40 4 22 Q 16 34 22 46 Z" fill={color} />
      <path d="M 90 50 Q 106 40 96 22 Q 84 34 78 46 Z" fill={color} />
    </>
  );
}

function FlameCrown({ color }) {
  const tips = 9;
  return (
    <g>
      {Array.from({ length: tips }).map((_, i) => {
        const angle = Math.PI + (i / (tips - 1)) * Math.PI;
        const x1 = 50 + Math.cos(angle) * 30;
        const y1 = 55 + Math.sin(angle) * 30;
        const x2 = 50 + Math.cos(angle) * 44;
        const y2 = 55 + Math.sin(angle) * 44;
        return <path key={i} d={`M ${x1} ${y1} Q ${(x1 + x2) / 2 + 4} ${(y1 + y2) / 2} ${x2} ${y2} Q ${(x1 + x2) / 2 - 4} ${(y1 + y2) / 2} ${x1} ${y1} Z`} fill={color} />;
      })}
    </g>
  );
}

function Stripes({ color }) {
  return (
    <g stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.85">
      <path d="M 24 34 L 32 46" />
      <path d="M 30 28 L 40 42" />
      <path d="M 70 28 L 60 42" />
      <path d="M 76 34 L 68 46" />
      <path d="M 50 24 L 50 38" />
    </g>
  );
}

function Patches({ color }) {
  return (
    <>
      <ellipse cx="37" cy="49" rx="10" ry="12" fill={color} />
      <ellipse cx="63" cy="49" rx="10" ry="12" fill={color} />
    </>
  );
}

function Horn() {
  return (
    <path d="M 50 4 L 44 22 L 56 22 Z" fill="url(#hornGradient)" stroke="oklch(80% 0.1 85)" strokeWidth="1" />
  );
}

const SPECIES = {
  perro: { base: 'oklch(78% 0.09 75)', ear: 'floppy', snout: '#fff', eye: '#2b2320', cheeks: true, name: 'Perro' },
  gato: { base: 'oklch(74% 0.1 55)', ear: 'pointy', snout: '#fff', eye: '#2b2320', cheeks: true, name: 'Gato' },
  conejo: { base: '#fbeff2', ear: 'tall', snout: '#fff', eye: '#2b2320', cheeks: true, name: 'Conejo Pompón' },
  zorro: { base: 'oklch(72% 0.16 45)', ear: 'pointy', snout: '#fff', eye: '#2b2320', cheeks: true, name: 'Zorro' },
  oso: { base: 'oklch(56% 0.08 55)', ear: 'round', snout: '#e8c9a6', eye: '#2b2320', cheeks: false, name: 'Oso Bruno' },
  panda: { base: '#fdfdfb', ear: 'round', earColor: '#2a2a2a', snout: '#fff', eye: '#2a2a2a', mark: 'patches', markColor: '#2a2a2a', cheeks: false, name: 'Panda' },
  koala: { base: 'oklch(78% 0.02 250)', ear: 'round', snout: '#5c5450', eye: '#2b2320', cheeks: false, name: 'Koala' },
  tigre: { base: 'oklch(72% 0.15 55)', ear: 'round', snout: '#fff', eye: '#2b2320', mark: 'stripes', markColor: '#2a2320', cheeks: true, name: 'Tigre' },
  leon: { base: 'oklch(76% 0.13 75)', ear: 'round', snout: '#f6dfb0', eye: '#2b2320', mark: 'mane', markColor: 'oklch(68% 0.14 55)', cheeks: false, name: 'León' },
  rana: { base: 'oklch(78% 0.15 145)', ear: null, snout: '#e7f7dc', eye: '#1f3320', cheeks: false, name: 'Rana' },
  mono: { base: 'oklch(58% 0.09 55)', ear: 'round', snout: '#e8c9a6', eye: '#2b2320', cheeks: false, name: 'Mono' },
  cerdito: { base: 'oklch(84% 0.08 15)', ear: 'pointy', snout: 'oklch(76% 0.11 15)', eye: '#2b2320', cheeks: true, name: 'Cerdito' },
  dragon: { base: 'oklch(64% 0.14 155)', ear: null, snout: 'oklch(72% 0.13 145)', eye: '#fff700', mark: 'wings', markColor: 'oklch(58% 0.13 155)', horn: true, cheeks: false, name: 'Dragón Chispitas' },
  lobo: { base: 'oklch(68% 0.02 250)', ear: 'pointy', snout: '#fff', eye: 'oklch(70% 0.18 235)', cheeks: false, name: 'Lobo Astronauta' },
  fenix: { base: 'oklch(72% 0.17 55)', ear: null, snout: 'oklch(80% 0.15 85)', eye: '#7a2b00', mark: 'flame', markColor: 'oklch(76% 0.17 40)', cheeks: false, name: 'Fénix Dorado' },
  unicornio: { base: '#fdfdff', ear: 'tall', snout: '#fff', eye: '#2b2320', horn: true, cheeks: true, mark: 'mane', markColor: 'oklch(80% 0.12 320)', name: 'Unicornio Estelar' },
};

export function AvatarBodyArt({ speciesId, size = 96 }) {
  const cfg = SPECIES[speciesId] || SPECIES.perro;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="hornGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(88% 0.1 85)" />
          <stop offset="100%" stopColor="oklch(75% 0.15 70)" />
        </linearGradient>
      </defs>
      {cfg.mark === 'mane' && <Mane color={cfg.markColor} />}
      {cfg.mark === 'wings' && <Wings color={cfg.markColor} />}
      {cfg.mark === 'flame' && <FlameCrown color={cfg.markColor} />}
      {cfg.ear && <Ears shape={cfg.ear} color={cfg.earColor || cfg.base} />}
      <circle cx="50" cy="55" r="32" fill={cfg.base} />
      {cfg.mark === 'patches' && <Patches color={cfg.markColor} />}
      {cfg.mark === 'stripes' && <Stripes color={cfg.markColor} />}
      {cfg.horn && <Horn />}
      {cfg.cheeks && (
        <>
          <circle cx="27" cy="63" r="6" fill="oklch(80% 0.1 15)" opacity="0.55" />
          <circle cx="73" cy="63" r="6" fill="oklch(80% 0.1 15)" opacity="0.55" />
        </>
      )}
      {cfg.snout && <ellipse cx="50" cy="67" rx="15" ry="10" fill={cfg.snout} />}
      <circle cx="44" cy="65" r="1.6" fill="#000" opacity="0.35" />
      <circle cx="56" cy="65" r="1.6" fill="#000" opacity="0.35" />
      <circle cx="37" cy="50" r="4.2" fill={cfg.eye} />
      <circle cx="63" cy="50" r="4.2" fill={cfg.eye} />
      <circle cx="38.3" cy="48.6" r="1.3" fill="#fff" />
      <circle cx="64.3" cy="48.6" r="1.3" fill="#fff" />
    </svg>
  );
}

export const AVATAR_NAMES = Object.fromEntries(Object.entries(SPECIES).map(([id, c]) => [id, c.name]));

// ---- accessories: hats, glasses, capes — positioned as overlay layers ----

const HATS = {
  'hat-cap': (
    <g>
      <path d="M 18 46 Q 50 18 82 46 L 82 52 Q 50 32 18 52 Z" fill="oklch(62% 0.16 250)" />
      <path d="M 50 20 Q 78 22 82 48 Q 64 40 50 40 Z" fill="oklch(55% 0.16 250)" />
      <circle cx="50" cy="24" r="3" fill="oklch(80% 0.05 250)" />
    </g>
  ),
  'hat-crown': (
    <g>
      <path d="M 22 50 L 26 26 L 40 40 L 50 20 L 60 40 L 74 26 L 78 50 Z" fill="oklch(80% 0.14 85)" stroke="oklch(65% 0.14 70)" strokeWidth="1.5" />
      <circle cx="26" cy="24" r="3.5" fill="oklch(65% 0.18 25)" />
      <circle cx="50" cy="18" r="4" fill="oklch(60% 0.18 250)" />
      <circle cx="74" cy="24" r="3.5" fill="oklch(65% 0.18 25)" />
    </g>
  ),
  'hat-pirate': (
    <g>
      <path d="M 14 46 Q 50 14 86 46 Q 74 40 50 40 Q 26 40 14 46 Z" fill="oklch(30% 0.02 250)" />
      <path d="M 40 30 L 60 30 L 50 20 Z" fill="oklch(90% 0.02 250)" />
    </g>
  ),
  'hat-flower': (
    <g>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 20;
        const y = 26 + Math.sin(rad) * 10;
        return <circle key={i} cx={x} cy={y} r="7" fill={i % 2 ? 'oklch(78% 0.14 350)' : 'oklch(82% 0.14 320)'} />;
      })}
      <circle cx="50" cy="26" r="5" fill="oklch(85% 0.15 90)" />
    </g>
  ),
  'hat-space': (
    <g>
      <circle cx="50" cy="42" r="26" fill="oklch(92% 0.02 235 / 0.55)" stroke="oklch(75% 0.05 235)" strokeWidth="2" />
      <path d="M 24 42 Q 50 60 76 42" fill="none" stroke="oklch(75% 0.05 235)" strokeWidth="1.5" opacity="0.6" />
      <circle cx="38" cy="36" r="4" fill="#fff" opacity="0.8" />
    </g>
  ),
};

const GLASSES = {
  'glasses-cool': (
    <g>
      <rect x="26" y="46" width="20" height="13" rx="5" fill="oklch(25% 0.02 250)" />
      <rect x="54" y="46" width="20" height="13" rx="5" fill="oklch(25% 0.02 250)" />
      <rect x="46" y="50" width="8" height="3" fill="oklch(25% 0.02 250)" />
    </g>
  ),
  'glasses-round': (
    <g fill="none" stroke="oklch(35% 0.02 250)" strokeWidth="3">
      <circle cx="36" cy="52" r="10" />
      <circle cx="64" cy="52" r="10" />
      <path d="M 46 52 L 54 52" />
    </g>
  ),
  'glasses-eyepatch': (
    <g>
      <ellipse cx="63" cy="52" rx="10" ry="12" fill="oklch(20% 0.01 250)" />
      <path d="M 20 40 L 80 66" stroke="oklch(20% 0.01 250)" strokeWidth="3" />
    </g>
  ),
  'glasses-hero': (
    <path d="M 22 44 Q 50 36 78 44 L 74 58 Q 50 66 26 58 Z" fill="oklch(28% 0.05 250)" opacity="0.9" />
  ),
};

const CAPES = {
  'cape-hero': (
    <path d="M 30 60 Q 20 100 10 128 Q 50 112 90 128 Q 80 100 70 60 Z" fill="oklch(60% 0.18 25)" />
  ),
  'cape-scarf': (
    <g>
      <path d="M 26 66 Q 50 78 74 66 L 74 76 Q 50 88 26 76 Z" fill="oklch(64% 0.16 25)" />
      <rect x="30" y="76" width="8" height="26" rx="3" fill="oklch(64% 0.16 25)" />
    </g>
  ),
  'cape-bow': (
    <g>
      <path d="M 50 62 L 30 52 L 30 72 Z" fill="oklch(66% 0.17 350)" />
      <path d="M 50 62 L 70 52 L 70 72 Z" fill="oklch(66% 0.17 350)" />
      <circle cx="50" cy="62" r="5" fill="oklch(58% 0.18 350)" />
    </g>
  ),
  'cape-bandana': (
    <path d="M 24 60 Q 50 72 76 60 L 66 74 Q 50 80 34 74 Z" fill="oklch(64% 0.15 145)" />
  ),
};

export function HatArt({ id, size = 40 }) {
  const node = HATS[id];
  if (!node) return null;
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
      {node}
    </svg>
  );
}

export function GlassesArt({ id, size = 34 }) {
  const node = GLASSES[id];
  if (!node) return null;
  return (
    <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
      {node}
    </svg>
  );
}

export function CapeArt({ id, size = 60 }) {
  const node = CAPES[id];
  if (!node) return null;
  return (
    <svg viewBox="0 0 100 130" width={size} height={size * 1.3}>
      {node}
    </svg>
  );
}
