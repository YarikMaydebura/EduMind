export const THEME_CONFIG: Record<
  string,
  { label: string; color: string; bgClass: string; description: string; emoji: string }
> = {
  FANTASY: {
    label: 'Fantasy',
    color: 'emerald',
    bgClass: 'from-emerald-500 to-green-600',
    description: 'Knights, mages, and mythical beasts in a realm of magic',
    emoji: '🏰',
  },
  CYBERPUNK_THEME: {
    label: 'Cyberpunk',
    color: 'cyan',
    bgClass: 'from-cyan-500 to-blue-600',
    description: 'Neon-lit hackers and cyber warriors in a digital world',
    emoji: '🌆',
  },
  MILITARY: {
    label: 'Military',
    color: 'amber',
    bgClass: 'from-amber-500 to-orange-600',
    description: 'Tactical soldiers and strategic commanders on the battlefield',
    emoji: '🎖️',
  },
  SCI_FI: {
    label: 'Sci-Fi',
    color: 'violet',
    bgClass: 'from-violet-500 to-purple-600',
    description: 'Space explorers and alien encounters among the stars',
    emoji: '🚀',
  },
  ANIME: {
    label: 'Anime',
    color: 'rose',
    bgClass: 'from-rose-500 to-pink-600',
    description: 'Hunters, mages, and spirit warriors with awakened powers',
    emoji: '🌟',
  },
  STEAMPUNK_THEME: {
    label: 'Steampunk',
    color: 'orange',
    bgClass: 'from-orange-500 to-amber-700',
    description: 'Inventors and engineers in a world of gears and steam',
    emoji: '⚙️',
  },
};

export const THEME_KEYS = Object.keys(THEME_CONFIG);
