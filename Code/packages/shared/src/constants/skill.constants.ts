/** Max skills a character can have equipped at once */
export const MAX_EQUIPPED_SKILLS = 6;

/** Skill rarity display labels */
export const SKILL_RARITY_LABELS: Record<string, string> = {
  SKILL_COMMON: 'Common',
  SKILL_UNCOMMON: 'Uncommon',
  SKILL_RARE: 'Rare',
  SKILL_EPIC: 'Epic',
  SKILL_LEGENDARY: 'Legendary',
  SKILL_MYTHIC: 'Mythic',
};

/** Skill rarity color classes */
export const SKILL_RARITY_COLORS: Record<string, string> = {
  SKILL_COMMON: 'text-gray-400 border-gray-400',
  SKILL_UNCOMMON: 'text-green-500 border-green-500',
  SKILL_RARE: 'text-blue-500 border-blue-500',
  SKILL_EPIC: 'text-purple-500 border-purple-500',
  SKILL_LEGENDARY: 'text-amber-500 border-amber-500',
  SKILL_MYTHIC: 'text-red-500 border-red-500',
};

/** Skill rarity order for sorting */
export const SKILL_RARITY_ORDER: string[] = [
  'SKILL_COMMON',
  'SKILL_UNCOMMON',
  'SKILL_RARE',
  'SKILL_EPIC',
  'SKILL_LEGENDARY',
  'SKILL_MYTHIC',
];

/** Skill type configuration */
export const SKILL_TYPE_CONFIG: Record<string, { label: string; color: string; icon: string; resource: string }> = {
  PHYSICAL: { label: 'Physical', color: 'text-red-500', icon: '⚔️', resource: 'STA' },
  MAGIC: { label: 'Magic', color: 'text-blue-500', icon: '✨', resource: 'MP' },
  HYBRID: { label: 'Hybrid', color: 'text-purple-500', icon: '💫', resource: 'MP+STA' },
  HEAL: { label: 'Heal', color: 'text-green-500', icon: '💚', resource: 'MP' },
  BUFF: { label: 'Buff', color: 'text-yellow-500', icon: '⬆️', resource: 'MP' },
  DEBUFF: { label: 'Debuff', color: 'text-orange-500', icon: '⬇️', resource: 'MP' },
  STATUS: { label: 'Status', color: 'text-pink-500', icon: '🔥', resource: 'MP' },
  UTILITY: { label: 'Utility', color: 'text-cyan-500', icon: '🔧', resource: 'MP/STA' },
  ULTIMATE: { label: 'Ultimate', color: 'text-amber-600', icon: '💥', resource: 'MP+STA' },
};
