export const phaseBadges = { 1: 'ABC', 2: 'MA', 3: 'SA', 4: 'LEE' };

export const letters = [
  { id: 'm', char: 'M', sound: '/mmm/' },
  { id: 'a', char: 'A', sound: '/aaa/' },
  { id: 'p', char: 'P', sound: '/ppp/' },
  { id: 's', char: 'S', sound: '/sss/' },
  { id: 'e', char: 'E', sound: '/eee/' },
];

export const syllables = [
  { id: 'ma', text: 'MA', partIds: ['m', 'a'], group: 'simple' },
  { id: 'pa', text: 'PA', partIds: ['p', 'a'], group: 'simple' },
  { id: 'sa', text: 'SA', partIds: ['s', 'a'], group: 'complex' },
  { id: 'pe', text: 'PE', partIds: ['p', 'e'], group: 'complex' },
];

export const words = [
  { id: 'mapa', text: 'MAPA', partIds: ['ma', 'pa'] },
  { id: 'pesa', text: 'PESA', partIds: ['pe', 'sa'] },
];

export const adventureSteps = [
  { type: 'letter', id: 'm' }, { type: 'letter', id: 'a' }, { type: 'letter', id: 'p' },
  { type: 'letter', id: 's' }, { type: 'letter', id: 'e' },
  { type: 'syllable', id: 'ma' }, { type: 'syllable', id: 'pa' },
  { type: 'syllable', id: 'sa' }, { type: 'syllable', id: 'pe' },
  { type: 'word', id: 'mapa' }, { type: 'word', id: 'pesa' },
];

export const avatars = [
  { id: 'perro', emoji: '🐶', name: 'Perro' }, { id: 'gato', emoji: '🐱', name: 'Gato' },
  { id: 'conejo', emoji: '🐰', name: 'Conejo' }, { id: 'zorro', emoji: '🦊', name: 'Zorro' },
  { id: 'oso', emoji: '🐻', name: 'Oso' }, { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'koala', emoji: '🐨', name: 'Koala' }, { id: 'tigre', emoji: '🐯', name: 'Tigre' },
  { id: 'leon', emoji: '🦁', name: 'León' }, { id: 'rana', emoji: '🐸', name: 'Rana' },
  { id: 'mono', emoji: '🐵', name: 'Mono' }, { id: 'cerdito', emoji: '🐷', name: 'Cerdito' },
];

export const getLetter = (id) => letters.find((l) => l.id === id);
export const getSyllable = (id) => syllables.find((s) => s.id === id);
export const getWord = (id) => words.find((w) => w.id === id);
export const getAvatar = (id) => avatars.find((a) => a.id === id) || avatars[0];

export const adventureIndexFor = (type, id) =>
  adventureSteps.findIndex((s) => s.type === type && s.id === id);

export const stepStatus = (index, progressIndex) => {
  if (index < progressIndex) return 'done';
  if (index === progressIndex) return 'current';
  return 'locked';
};
