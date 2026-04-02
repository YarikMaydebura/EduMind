/** KP cost to evolve to each rarity tier */
export const EVOLUTION_KP_COST: Record<string, number> = {
  CLASS_UNCOMMON: 50,
  CLASS_RARE: 150,
  CLASS_EPIC: 400,
  CLASS_LEGENDARY: 1000,
  CLASS_MYTHIC: 3000,
};

/** Rarity display labels */
export const RARITY_LABELS: Record<string, string> = {
  CLASS_COMMON: 'Common',
  CLASS_UNCOMMON: 'Uncommon',
  CLASS_RARE: 'Rare',
  CLASS_EPIC: 'Epic',
  CLASS_LEGENDARY: 'Legendary',
  CLASS_MYTHIC: 'Mythic',
};

/** Rarity color classes for UI */
export const RARITY_COLORS: Record<string, string> = {
  CLASS_COMMON: 'text-gray-400 border-gray-400',
  CLASS_UNCOMMON: 'text-green-500 border-green-500',
  CLASS_RARE: 'text-blue-500 border-blue-500',
  CLASS_EPIC: 'text-purple-500 border-purple-500',
  CLASS_LEGENDARY: 'text-amber-500 border-amber-500',
  CLASS_MYTHIC: 'text-red-500 border-red-500',
};

/** Rarity order for sorting */
export const RARITY_ORDER: string[] = [
  'CLASS_COMMON',
  'CLASS_UNCOMMON',
  'CLASS_RARE',
  'CLASS_EPIC',
  'CLASS_LEGENDARY',
  'CLASS_MYTHIC',
];
