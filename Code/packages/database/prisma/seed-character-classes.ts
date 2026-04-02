import type { PrismaClient } from '@prisma/client';

interface ClassAbility {
  name: string;
  description: string;
  type: 'passive' | 'active';
  icon: string;
  effects: string;
}

interface ClassSeed {
  name: string;
  theme: 'FANTASY' | 'CYBERPUNK_THEME' | 'MILITARY' | 'SCI_FI' | 'ANIME' | 'STEAMPUNK_THEME';
  rarity: 'CLASS_COMMON' | 'CLASS_UNCOMMON' | 'CLASS_RARE' | 'CLASS_EPIC' | 'CLASS_LEGENDARY' | 'CLASS_MYTHIC';
  description: string;
  passives: Record<string, number>;
  requirements: Record<string, unknown>;
  evolvesFrom?: string;
  abilities?: ClassAbility[];
}

// ═══════════════════════════════════════════════════════════════
// 96 Character Classes (16 per theme × 6 themes)
// ═══════════════════════════════════════════════════════════════

const CLASSES: ClassSeed[] = [
  // ──────────────── FANTASY (16) ────────────────
  // Common (4)
  { name: 'Apprentice Mage', theme: 'FANTASY', rarity: 'CLASS_COMMON', description: 'Beginner magic user learning the arcane arts', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Squire', theme: 'FANTASY', rarity: 'CLASS_COMMON', description: 'Young warrior in training', passives: { HP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Acolyte', theme: 'FANTASY', rarity: 'CLASS_COMMON', description: 'Healer apprentice serving the temple', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Fantasy Scout', theme: 'FANTASY', rarity: 'CLASS_COMMON', description: 'Swift messenger and lookout', passives: { SPD: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'Elementalist', theme: 'FANTASY', rarity: 'CLASS_UNCOMMON', description: 'Controls fire, water, earth, air', passives: { MP: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } }, evolvesFrom: 'Apprentice Mage' },
  { name: 'Knight', theme: 'FANTASY', rarity: 'CLASS_UNCOMMON', description: 'Armored warrior with shield', passives: { DEF: 0.08, HP: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } }, evolvesFrom: 'Squire' },
  { name: 'Priest', theme: 'FANTASY', rarity: 'CLASS_UNCOMMON', description: 'Divine healer of the light', passives: { MP: 0.08 }, requirements: { minLevel: 10, subjects: { ARTS: 70 } }, evolvesFrom: 'Acolyte' },
  { name: 'Ranger', theme: 'FANTASY', rarity: 'CLASS_UNCOMMON', description: 'Master of bow and forest', passives: { SPD: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { LANGUAGES: 70 } }, evolvesFrom: 'Fantasy Scout' },
  // Rare (3)
  { name: 'Archmage', theme: 'FANTASY', rarity: 'CLASS_RARE', description: 'Master of arcane magic with devastating spells', passives: { MP: 0.12, ATK: 0.12 }, requirements: { minLevel: 20, subjects: { MATHEMATICS: 80, SCIENCE: 80 } }, evolvesFrom: 'Elementalist' },
  { name: 'Paladin', theme: 'FANTASY', rarity: 'CLASS_RARE', description: 'Holy warrior with impenetrable defenses', passives: { DEF: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SOCIAL_STUDIES: 80 } }, evolvesFrom: 'Knight' },
  { name: 'Assassin', theme: 'FANTASY', rarity: 'CLASS_RARE', description: 'Silent blade striking from the shadows', passives: { SPD: 0.12, LCK: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, LANGUAGES: 80 } }, evolvesFrom: 'Ranger' },
  // Epic (2)
  { name: 'Sage', theme: 'FANTASY', rarity: 'CLASS_EPIC', description: 'Ancient scholar of wisdom and power', passives: { MP: 0.15, ATK: 0.15 }, requirements: { minLevel: 35, subjects: { MATHEMATICS: 85, SCIENCE: 85 }, achievements: 15 }, evolvesFrom: 'Archmage', abilities: [{ name: 'Wisdom Aura', type: 'passive', description: '+10% team MP in battle', icon: '📚', effects: '+10% team MP' }, { name: 'Ancient Knowledge', type: 'active', description: 'Deal 200% magic damage', icon: '💥', effects: '200% MP-based damage' }] },
  { name: 'Champion', theme: 'FANTASY', rarity: 'CLASS_EPIC', description: 'Legendary warrior of the realm', passives: { ATK: 0.15, HP: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SOCIAL_STUDIES: 85 }, achievements: 15 }, evolvesFrom: 'Paladin', abilities: [{ name: 'Battle Cry', type: 'active', description: '+15% team ATK for 2 turns', icon: '📣', effects: '+15% team ATK' }, { name: 'Last Stand', type: 'passive', description: 'Survive fatal blow once per battle', icon: '🛡️', effects: 'Survive 1 fatal blow' }] },
  // Legendary (2)
  { name: 'Grand Sage', theme: 'FANTASY', rarity: 'CLASS_LEGENDARY', description: 'Master of all magical arts', passives: { MP: 0.20, ATK: 0.20, LCK: 0.20 }, requirements: { minLevel: 50, subjects: { MATHEMATICS: 90, SCIENCE: 90, ARTS: 90 }, achievements: 30 }, evolvesFrom: 'Sage', abilities: [{ name: 'Arcane Mastery', type: 'passive', description: 'All magic costs -30%', icon: '✨', effects: '-30% MP costs' }, { name: 'Time Warp', type: 'active', description: 'Take 2 turns in a row', icon: '⏰', effects: 'Extra turn' }] },
  { name: 'Dragon Knight', theme: 'FANTASY', rarity: 'CLASS_LEGENDARY', description: 'Bonded with a dragon spirit', passives: { HP: 0.20, ATK: 0.20, DEF: 0.20 }, requirements: { minLevel: 50, subjects: { PHYSICAL_EDUCATION: 90, SOCIAL_STUDIES: 90, LANGUAGES: 90 }, achievements: 30 }, evolvesFrom: 'Champion', abilities: [{ name: 'Dragon Soul', type: 'active', description: 'Transform: +50% all stats for 3 turns', icon: '🐉', effects: '+50% all stats 3 turns' }, { name: 'Dragon Breath', type: 'active', description: 'AoE fire damage to all enemies', icon: '🔥', effects: 'AoE fire damage' }] },
  // Mythic (1)
  { name: 'Supreme Mage', theme: 'FANTASY', rarity: 'CLASS_MYTHIC', description: 'One who has transcended mortality through knowledge', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, subjects: { MATHEMATICS: 100, SCIENCE: 100 }, achievements: 50, streak: 365 }, evolvesFrom: 'Grand Sage', abilities: [{ name: 'Reality Warp', type: 'active', description: 'Ignore all enemy defenses once per battle', icon: '🌀', effects: 'Pierce all defenses' }, { name: 'Infinite Mana', type: 'active', description: 'No MP cost for 5 turns', icon: '♾️', effects: 'Free casting 5 turns' }, { name: 'Dimensional Rift', type: 'passive', description: '+25% dodge chance', icon: '🌌', effects: '+25% dodge' }] },

  // ──────────────── CYBERPUNK (16) ────────────────
  // Common (4)
  { name: 'Script Kiddie', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Beginner hacker with basic scripts', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Street Samurai', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Cybernetically enhanced fighter', passives: { ATK: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Medtech', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Street medic with basic chrome', passives: { DEF: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Runner', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Information courier and scout', passives: { SPD: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'Netrunner', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Skilled hacker diving into the net', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { COMPUTER_SCIENCE: 70 } }, evolvesFrom: 'Script Kiddie' },
  { name: 'Cyborg', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Heavily augmented soldier', passives: { HP: 0.08, DEF: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } }, evolvesFrom: 'Street Samurai' },
  { name: 'Ripper Doc', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Expert cybernetic surgeon', passives: { MP: 0.08 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } }, evolvesFrom: 'Medtech' },
  { name: 'Fixer', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Connected dealer and negotiator', passives: { LCK: 0.08, SPD: 0.03 }, requirements: { minLevel: 10, subjects: { LANGUAGES: 70 } }, evolvesFrom: 'Runner' },
  // Rare (3)
  { name: 'Elite Hacker', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_RARE', description: 'Master of digital infiltration', passives: { MP: 0.12, LCK: 0.12 }, requirements: { minLevel: 20, subjects: { COMPUTER_SCIENCE: 80, MATHEMATICS: 80 } }, evolvesFrom: 'Netrunner' },
  { name: 'Chrome Warrior', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_RARE', description: 'Full-body cybernetic combat machine', passives: { ATK: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SCIENCE: 80 } }, evolvesFrom: 'Cyborg' },
  { name: 'Tech Ninja', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_RARE', description: 'Stealth operative with optical camo', passives: { SPD: 0.12, ATK: 0.12 }, requirements: { minLevel: 20, subjects: { COMPUTER_SCIENCE: 80, PHYSICAL_EDUCATION: 80 } }, evolvesFrom: 'Fixer' },
  // Epic (2)
  { name: 'Blackhat', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_EPIC', description: 'Legendary hacker who can breach any system', passives: { MP: 0.15, LCK: 0.15 }, requirements: { minLevel: 35, subjects: { COMPUTER_SCIENCE: 85, MATHEMATICS: 85 }, achievements: 15 }, evolvesFrom: 'Elite Hacker', abilities: [{ name: 'Virus Upload', type: 'active', description: 'DoT + disable enemy skill', icon: '🦠', effects: 'DoT + skill disable' }, { name: 'Firewall', type: 'passive', description: 'Reflect debuffs back to sender', icon: '🔒', effects: 'Reflect debuffs' }] },
  { name: 'Full Borg', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_EPIC', description: 'Fully cybernetic war machine', passives: { HP: 0.15, ATK: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SCIENCE: 85 }, achievements: 15 }, evolvesFrom: 'Chrome Warrior', abilities: [{ name: 'Titanium Frame', type: 'passive', description: '+30% DEF permanently', icon: '🤖', effects: '+30% DEF' }, { name: 'Berserker Mode', type: 'active', description: '+40% ATK, -20% DEF for 3 turns', icon: '💢', effects: '+40% ATK, -20% DEF' }] },
  // Legendary (2)
  { name: 'Digital Ghost', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_LEGENDARY', description: 'Exists between the digital and physical', passives: { MP: 0.20, SPD: 0.20, LCK: 0.20 }, requirements: { minLevel: 50, subjects: { COMPUTER_SCIENCE: 90, MATHEMATICS: 90, LANGUAGES: 90 }, achievements: 30 }, evolvesFrom: 'Blackhat', abilities: [{ name: 'Ghost Protocol', type: 'active', description: 'Become untargetable for 2 turns', icon: '👻', effects: 'Untargetable 2 turns' }, { name: 'Memory Wipe', type: 'active', description: 'Remove all enemy buffs', icon: '🧹', effects: 'Purge all buffs' }] },
  { name: 'Apex Predator', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_LEGENDARY', description: 'The ultimate hunter in the neon jungle', passives: { ATK: 0.20, HP: 0.20, DEF: 0.20 }, requirements: { minLevel: 50, subjects: { PHYSICAL_EDUCATION: 90, SCIENCE: 90, COMPUTER_SCIENCE: 90 }, achievements: 30 }, evolvesFrom: 'Full Borg', abilities: [{ name: 'Thermal Vision', type: 'passive', description: 'Attacks never miss', icon: '👁️', effects: '100% accuracy' }, { name: 'Plasma Claws', type: 'active', description: 'Armor-piercing melee attack', icon: '⚡', effects: 'Ignore DEF' }] },
  // Mythic (1)
  { name: 'Digital God', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_MYTHIC', description: 'Has achieved digital omniscience', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, subjects: { COMPUTER_SCIENCE: 100, MATHEMATICS: 100 }, pvpWins: 500 }, evolvesFrom: 'Digital Ghost', abilities: [{ name: 'Admin Access', type: 'active', description: 'Control enemy for 1 turn', icon: '👑', effects: 'Mind control 1 turn' }, { name: 'Singularity', type: 'active', description: 'Deal 50% enemy max HP damage', icon: '💀', effects: '50% max HP damage' }, { name: 'Quantum Computing', type: 'passive', description: '+20% all stats', icon: '🖥️', effects: '+20% all stats' }] },

  // ──────────────── MILITARY (16) ────────────────
  // Common (4)
  { name: 'Recruit', theme: 'MILITARY', rarity: 'CLASS_COMMON', description: 'Fresh soldier in basic training', passives: { HP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Military Cadet', theme: 'MILITARY', rarity: 'CLASS_COMMON', description: 'Military academy student', passives: { DEF: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Field Medic', theme: 'MILITARY', rarity: 'CLASS_COMMON', description: 'Basic combat medic', passives: { STA: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Military Scout', theme: 'MILITARY', rarity: 'CLASS_COMMON', description: 'Reconnaissance specialist', passives: { SPD: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'Soldier', theme: 'MILITARY', rarity: 'CLASS_UNCOMMON', description: 'Standard infantry fighter', passives: { ATK: 0.08, HP: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } }, evolvesFrom: 'Recruit' },
  { name: 'Tactician', theme: 'MILITARY', rarity: 'CLASS_UNCOMMON', description: 'Strategic defensive expert', passives: { DEF: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { SOCIAL_STUDIES: 70 } }, evolvesFrom: 'Military Cadet' },
  { name: 'Combat Medic', theme: 'MILITARY', rarity: 'CLASS_UNCOMMON', description: 'Battlefield healer', passives: { STA: 0.08, HP: 0.03 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } }, evolvesFrom: 'Field Medic' },
  { name: 'Sniper', theme: 'MILITARY', rarity: 'CLASS_UNCOMMON', description: 'Long-range precision shooter', passives: { ATK: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } }, evolvesFrom: 'Military Scout' },
  // Rare (3)
  { name: 'Special Forces', theme: 'MILITARY', rarity: 'CLASS_RARE', description: 'Elite tactical unit', passives: { ATK: 0.12, SPD: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, LANGUAGES: 80 } }, evolvesFrom: 'Soldier' },
  { name: 'Commander', theme: 'MILITARY', rarity: 'CLASS_RARE', description: 'Battlefield leader and strategist', passives: { DEF: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { SOCIAL_STUDIES: 80, LANGUAGES: 80 } }, evolvesFrom: 'Tactician' },
  { name: 'Demolitions', theme: 'MILITARY', rarity: 'CLASS_RARE', description: 'Explosives and heavy ordnance expert', passives: { ATK: 0.12, MP: 0.12 }, requirements: { minLevel: 20, subjects: { SCIENCE: 80, MATHEMATICS: 80 } }, evolvesFrom: 'Sniper' },
  // Epic (2)
  { name: 'Black Ops', theme: 'MILITARY', rarity: 'CLASS_EPIC', description: 'Covert operations specialist', passives: { ATK: 0.15, SPD: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SOCIAL_STUDIES: 85 }, achievements: 15 }, evolvesFrom: 'Special Forces', abilities: [{ name: 'Silent Kill', type: 'active', description: 'Bypass defense on next attack', icon: '🗡️', effects: 'Ignore DEF once' }, { name: 'Extraction', type: 'active', description: 'Escape battle (counts as draw)', icon: '🚁', effects: 'Force draw' }] },
  { name: 'General', theme: 'MILITARY', rarity: 'CLASS_EPIC', description: 'Supreme military commander', passives: { DEF: 0.15, HP: 0.15 }, requirements: { minLevel: 35, subjects: { SOCIAL_STUDIES: 85, LANGUAGES: 85 }, achievements: 15 }, evolvesFrom: 'Commander', abilities: [{ name: 'Battle Plan', type: 'active', description: '+20% all team stats for 2 turns', icon: '📋', effects: '+20% team stats' }, { name: 'Fortify', type: 'active', description: '+50% team DEF for 1 turn', icon: '🏰', effects: '+50% team DEF' }] },
  // Legendary (2)
  { name: 'Legendary Sniper', theme: 'MILITARY', rarity: 'CLASS_LEGENDARY', description: 'One shot, one kill from any distance', passives: { ATK: 0.20, LCK: 0.20, SPD: 0.20 }, requirements: { minLevel: 50, subjects: { MATHEMATICS: 90, PHYSICAL_EDUCATION: 90, SOCIAL_STUDIES: 90 }, achievements: 30 }, evolvesFrom: 'Black Ops', abilities: [{ name: 'Headshot', type: 'active', description: '30% chance of instant KO', icon: '🎯', effects: '30% instant KO' }, { name: 'Ghost Protocol', type: 'passive', description: 'Invisible for first 3 turns', icon: '🥷', effects: 'Invisible 3 turns' }] },
  { name: 'Supreme Commander', theme: 'MILITARY', rarity: 'CLASS_LEGENDARY', description: 'Commands armies and inspires nations', passives: { DEF: 0.20, HP: 0.20, STA: 0.20 }, requirements: { minLevel: 50, subjects: { SOCIAL_STUDIES: 90, LANGUAGES: 90, PHYSICAL_EDUCATION: 90 }, achievements: 30 }, evolvesFrom: 'General', abilities: [{ name: 'Total War', type: 'active', description: '+30% all stats for 3 turns', icon: '⚔️', effects: '+30% all stats' }, { name: 'Strategic Retreat', type: 'active', description: 'Full heal once per battle', icon: '🏥', effects: 'Full heal once' }] },
  // Mythic (1)
  { name: 'Absolute Warrior', theme: 'MILITARY', rarity: 'CLASS_MYTHIC', description: 'The embodiment of military perfection', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, subjects: { PHYSICAL_EDUCATION: 100, SOCIAL_STUDIES: 100 }, homeworkCompleted: 1000 }, evolvesFrom: 'Legendary Sniper', abilities: [{ name: 'One Man Army', type: 'active', description: 'Attack all enemies at once', icon: '💪', effects: 'AoE full damage' }, { name: 'Immortal Will', type: 'passive', description: 'Revive with 100% HP once', icon: '☠️', effects: 'Auto-revive once' }, { name: 'Iron Discipline', type: 'passive', description: '+15% all stats', icon: '🎖️', effects: '+15% all stats' }] },

  // ──────────────── SCI-FI (16) ────────────────
  // Common (4)
  { name: 'Space Cadet', theme: 'SCI_FI', rarity: 'CLASS_COMMON', description: 'Space academy trainee', passives: { HP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Lab Assistant', theme: 'SCI_FI', rarity: 'CLASS_COMMON', description: 'Junior researcher in the space lab', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Navigator', theme: 'SCI_FI', rarity: 'CLASS_COMMON', description: 'Ship pilot in training', passives: { SPD: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Comm Officer', theme: 'SCI_FI', rarity: 'CLASS_COMMON', description: 'Communications specialist', passives: { LCK: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'Space Marine', theme: 'SCI_FI', rarity: 'CLASS_UNCOMMON', description: 'Elite space soldier', passives: { HP: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } }, evolvesFrom: 'Space Cadet' },
  { name: 'Scientist', theme: 'SCI_FI', rarity: 'CLASS_UNCOMMON', description: 'Research specialist', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } }, evolvesFrom: 'Lab Assistant' },
  { name: 'Pilot', theme: 'SCI_FI', rarity: 'CLASS_UNCOMMON', description: 'Skilled ship operator', passives: { SPD: 0.08, DEF: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } }, evolvesFrom: 'Navigator' },
  { name: 'Xenolinguist', theme: 'SCI_FI', rarity: 'CLASS_UNCOMMON', description: 'Alien language expert', passives: { MP: 0.08 }, requirements: { minLevel: 10, subjects: { LANGUAGES: 70 } }, evolvesFrom: 'Comm Officer' },
  // Rare (3)
  { name: 'Shock Trooper', theme: 'SCI_FI', rarity: 'CLASS_RARE', description: 'Heavy assault shock infantry', passives: { ATK: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SCIENCE: 80 } }, evolvesFrom: 'Space Marine' },
  { name: 'Quantum Physicist', theme: 'SCI_FI', rarity: 'CLASS_RARE', description: 'Bends reality with quantum mechanics', passives: { MP: 0.12, ATK: 0.12 }, requirements: { minLevel: 20, subjects: { SCIENCE: 80, MATHEMATICS: 80 } }, evolvesFrom: 'Scientist' },
  { name: 'Ace Pilot', theme: 'SCI_FI', rarity: 'CLASS_RARE', description: 'Legendary starfighter pilot', passives: { SPD: 0.12, DEF: 0.12 }, requirements: { minLevel: 20, subjects: { MATHEMATICS: 80, PHYSICAL_EDUCATION: 80 } }, evolvesFrom: 'Pilot' },
  // Epic (2)
  { name: 'Void Walker', theme: 'SCI_FI', rarity: 'CLASS_EPIC', description: 'Traverses the void between stars', passives: { MP: 0.15, SPD: 0.15 }, requirements: { minLevel: 35, subjects: { SCIENCE: 85, MATHEMATICS: 85 }, achievements: 15 }, evolvesFrom: 'Shock Trooper', abilities: [{ name: 'Teleport', type: 'active', description: 'Swap positions with enemy', icon: '🌀', effects: 'Position swap' }, { name: 'Gravity Well', type: 'active', description: 'Slow all enemies for 2 turns', icon: '🕳️', effects: 'Slow enemies 2 turns' }] },
  { name: 'Fleet Admiral', theme: 'SCI_FI', rarity: 'CLASS_EPIC', description: 'Commands an entire space fleet', passives: { DEF: 0.15, HP: 0.15 }, requirements: { minLevel: 35, subjects: { SOCIAL_STUDIES: 85, LANGUAGES: 85 }, achievements: 15 }, evolvesFrom: 'Quantum Physicist', abilities: [{ name: 'Shields Up', type: 'active', description: 'Absorb next 3 attacks', icon: '🛡️', effects: 'Block 3 attacks' }, { name: 'Fire All', type: 'active', description: 'Multi-hit attack (3 strikes)', icon: '🚀', effects: '3x attack' }] },
  // Legendary (2)
  { name: 'Psionic', theme: 'SCI_FI', rarity: 'CLASS_LEGENDARY', description: 'Wields the power of the mind', passives: { MP: 0.20, ATK: 0.20, SPD: 0.20 }, requirements: { minLevel: 50, subjects: { SCIENCE: 90, MATHEMATICS: 90, ARTS: 90 }, achievements: 30 }, evolvesFrom: 'Void Walker', abilities: [{ name: 'Mind Control', type: 'active', description: 'Enemy attacks itself', icon: '🧠', effects: 'Confuse enemy 1 turn' }, { name: 'Psychic Storm', type: 'active', description: 'Ignore all defenses', icon: '⚡', effects: 'Pierce all DEF' }] },
  { name: 'Starship Captain', theme: 'SCI_FI', rarity: 'CLASS_LEGENDARY', description: 'Leads humanity to the stars', passives: { HP: 0.20, DEF: 0.20, STA: 0.20 }, requirements: { minLevel: 50, subjects: { SOCIAL_STUDIES: 90, LANGUAGES: 90, MATHEMATICS: 90 }, achievements: 30 }, evolvesFrom: 'Fleet Admiral', abilities: [{ name: 'Warp Speed', type: 'passive', description: 'Always act first', icon: '🚀', effects: '+999 SPD priority' }, { name: 'Photon Torpedo', type: 'active', description: 'Massive single-target damage', icon: '💫', effects: '300% damage' }] },
  // Mythic (1)
  { name: 'Time Lord', theme: 'SCI_FI', rarity: 'CLASS_MYTHIC', description: 'Master of time and space itself', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, streak: 365, bossDefeats: 100 }, evolvesFrom: 'Psionic', abilities: [{ name: 'Time Rewind', type: 'active', description: "Undo last turn's damage", icon: '⏪', effects: 'Reverse last turn' }, { name: 'Temporal Lock', type: 'active', description: 'Enemy skips 2 turns', icon: '⏸️', effects: 'Stun 2 turns' }, { name: 'Chronoshift', type: 'passive', description: '+20% SPD and +20% LCK', icon: '⏰', effects: '+20% SPD/LCK' }] },

  // ──────────────── ANIME/MANHWA (16) ────────────────
  // Common (4)
  { name: 'E-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_COMMON', description: 'Weakest hunter, just awakened', passives: { ATK: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Student Mage', theme: 'ANIME', rarity: 'CLASS_COMMON', description: 'Magic academy freshman', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Trainee', theme: 'ANIME', rarity: 'CLASS_COMMON', description: 'Dojo apprentice learning the basics', passives: { HP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Spirit User', theme: 'ANIME', rarity: 'CLASS_COMMON', description: 'Can see and interact with weak spirits', passives: { LCK: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'D-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_UNCOMMON', description: 'Dungeon delver gaining experience', passives: { ATK: 0.08, SPD: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } }, evolvesFrom: 'E-Rank Hunter' },
  { name: 'Battle Mage', theme: 'ANIME', rarity: 'CLASS_UNCOMMON', description: 'Combat-focused mage', passives: { MP: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } }, evolvesFrom: 'Student Mage' },
  { name: 'Martial Artist', theme: 'ANIME', rarity: 'CLASS_UNCOMMON', description: 'Hand-to-hand combat specialist', passives: { STA: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } }, evolvesFrom: 'Trainee' },
  { name: 'Spirit Contractor', theme: 'ANIME', rarity: 'CLASS_UNCOMMON', description: 'Commands spirits in battle', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { ARTS: 70 } }, evolvesFrom: 'Spirit User' },
  // Rare (3)
  { name: 'C-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_RARE', description: 'Experienced dungeon hunter', passives: { ATK: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SOCIAL_STUDIES: 80 } }, evolvesFrom: 'D-Rank Hunter' },
  { name: 'Sword Saint', theme: 'ANIME', rarity: 'CLASS_RARE', description: 'Master of the blade with lethal precision', passives: { ATK: 0.12, SPD: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, ARTS: 80 } }, evolvesFrom: 'Battle Mage' },
  { name: 'Summoner', theme: 'ANIME', rarity: 'CLASS_RARE', description: 'Calls powerful creatures to fight', passives: { MP: 0.12, LCK: 0.12 }, requirements: { minLevel: 20, subjects: { ARTS: 80, LANGUAGES: 80 } }, evolvesFrom: 'Martial Artist' },
  // Epic (2)
  { name: 'B-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_EPIC', description: 'Elite hunter with awakened powers', passives: { ATK: 0.15, HP: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SOCIAL_STUDIES: 85 }, achievements: 15 }, evolvesFrom: 'C-Rank Hunter', abilities: [{ name: 'Limit Break', type: 'active', description: 'Double all stats for 1 turn', icon: '💥', effects: '2x stats 1 turn' }, { name: "Hunter's Eye", type: 'passive', description: 'See enemy stats and weaknesses', icon: '👁️', effects: 'Reveal enemy stats' }] },
  { name: 'Arcane Knight', theme: 'ANIME', rarity: 'CLASS_EPIC', description: 'Combines sword mastery with magic', passives: { ATK: 0.15, MP: 0.15 }, requirements: { minLevel: 35, subjects: { MATHEMATICS: 85, PHYSICAL_EDUCATION: 85 }, achievements: 15 }, evolvesFrom: 'Sword Saint', abilities: [{ name: 'Magic Blade', type: 'active', description: 'Physical + magic combined damage', icon: '⚔️', effects: 'ATK+MP damage' }, { name: 'Enchant Weapon', type: 'active', description: 'Add element to attacks for 3 turns', icon: '✨', effects: 'Elemental attacks' }] },
  // Legendary (2)
  { name: 'A-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_LEGENDARY', description: 'Among the strongest hunters alive', passives: { ATK: 0.20, HP: 0.20, SPD: 0.20 }, requirements: { minLevel: 50, subjects: { PHYSICAL_EDUCATION: 90, SOCIAL_STUDIES: 90, MATHEMATICS: 90 }, achievements: 30 }, evolvesFrom: 'B-Rank Hunter', abilities: [{ name: 'Domain Expansion', type: 'active', description: 'Massive AoE damage', icon: '🌟', effects: '250% AoE damage' }, { name: 'Regeneration', type: 'passive', description: 'Heal 10% HP per turn', icon: '💚', effects: '10% HP regen/turn' }] },
  { name: 'Grand Summoner', theme: 'ANIME', rarity: 'CLASS_LEGENDARY', description: 'Commands an army of spirits', passives: { MP: 0.20, LCK: 0.20, STA: 0.20 }, requirements: { minLevel: 50, subjects: { ARTS: 90, LANGUAGES: 90, SCIENCE: 90 }, achievements: 30 }, evolvesFrom: 'Arcane Knight', abilities: [{ name: 'Army of Spirits', type: 'active', description: 'Summon multiple allies', icon: '👻', effects: 'Multi-summon' }, { name: 'Dragon Contract', type: 'active', description: 'Ultimate summon: massive damage', icon: '🐲', effects: '400% damage' }] },
  // Mythic (1)
  { name: 'Shadow Monarch', theme: 'ANIME', rarity: 'CLASS_MYTHIC', description: 'Ruler of shadows who commands the dead', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, bossDefeats: 100, rank: 1 }, evolvesFrom: 'A-Rank Hunter', abilities: [{ name: 'Arise', type: 'active', description: 'Resurrect defeated enemies as allies', icon: '⬆️', effects: 'Revive enemies as allies' }, { name: "Ruler's Authority", type: 'active', description: 'Enemy cannot move for 2 turns', icon: '👑', effects: 'Paralyze 2 turns' }, { name: 'Shadow Exchange', type: 'passive', description: '+25% ATK when HP below 30%', icon: '🌑', effects: '+25% ATK at low HP' }] },

  // ──────────────── STEAMPUNK (16) ────────────────
  // Common (4)
  { name: 'Tinkerer', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Amateur inventor with basic gadgets', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Brawler', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Steam-powered fighter', passives: { ATK: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Apothecary', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Medicine mixer and healer', passives: { STA: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Courier', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Airship messenger and delivery expert', passives: { SPD: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'Inventor', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Creates useful gadgets and machines', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } }, evolvesFrom: 'Tinkerer' },
  { name: 'Ironclad', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Heavy armor powered by steam', passives: { DEF: 0.08, HP: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } }, evolvesFrom: 'Brawler' },
  { name: 'Alchemist', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Potion master and transmuter', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } }, evolvesFrom: 'Apothecary' },
  { name: 'Aeronaut', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Airship specialist and navigator', passives: { SPD: 0.08, DEF: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } }, evolvesFrom: 'Courier' },
  // Rare (3)
  { name: 'Mechanist', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_RARE', description: 'Builds and deploys combat automatons', passives: { MP: 0.12, ATK: 0.12 }, requirements: { minLevel: 20, subjects: { SCIENCE: 80, MATHEMATICS: 80 } }, evolvesFrom: 'Inventor' },
  { name: 'Steam Knight', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_RARE', description: 'Steam-powered armored warrior', passives: { ATK: 0.12, DEF: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SOCIAL_STUDIES: 80 } }, evolvesFrom: 'Ironclad' },
  { name: 'Mad Scientist', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_RARE', description: 'Unpredictable genius with wild experiments', passives: { MP: 0.12, LCK: 0.12 }, requirements: { minLevel: 20, subjects: { SCIENCE: 80, ARTS: 80 } }, evolvesFrom: 'Aeronaut' },
  // Epic (2)
  { name: 'Engineer', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_EPIC', description: 'Master builder of mechanical wonders', passives: { MP: 0.15, ATK: 0.15 }, requirements: { minLevel: 35, subjects: { SCIENCE: 85, MATHEMATICS: 85 }, achievements: 15 }, evolvesFrom: 'Mechanist', abilities: [{ name: 'Mech Suit', type: 'active', description: 'Transform: +40% ATK and DEF for 3 turns', icon: '🤖', effects: '+40% ATK/DEF 3 turns' }, { name: 'Repair', type: 'active', description: 'Heal 30% HP and remove debuffs', icon: '🔧', effects: 'Heal 30% + cleanse' }] },
  { name: 'Clockwork Knight', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_EPIC', description: 'Precision-engineered combat machine', passives: { ATK: 0.15, DEF: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SCIENCE: 85 }, achievements: 15 }, evolvesFrom: 'Steam Knight', abilities: [{ name: 'Overclock', type: 'active', description: 'Take an extra turn', icon: '⚙️', effects: 'Extra turn' }, { name: 'Gear Shield', type: 'passive', description: 'Reflect 20% of damage taken', icon: '🛡️', effects: '20% damage reflect' }] },
  // Legendary (2)
  { name: 'Grand Inventor', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_LEGENDARY', description: 'Creator of world-changing machines', passives: { MP: 0.20, ATK: 0.20, LCK: 0.20 }, requirements: { minLevel: 50, subjects: { SCIENCE: 90, MATHEMATICS: 90, ARTS: 90 }, achievements: 30 }, evolvesFrom: 'Engineer', abilities: [{ name: 'Ultimate Creation', type: 'active', description: 'Summon giant mech ally', icon: '🏗️', effects: 'Summon mech' }, { name: 'Time Bomb', type: 'active', description: 'Delayed massive damage (explodes in 2 turns)', icon: '💣', effects: 'Delayed 400% damage' }] },
  { name: 'Airship Captain', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_LEGENDARY', description: 'Commands a fleet of airships', passives: { SPD: 0.20, HP: 0.20, DEF: 0.20 }, requirements: { minLevel: 50, subjects: { MATHEMATICS: 90, SOCIAL_STUDIES: 90, LANGUAGES: 90 }, achievements: 30 }, evolvesFrom: 'Clockwork Knight', abilities: [{ name: 'Broadside', type: 'active', description: 'Multi-hit cannon attack', icon: '💥', effects: '5x hit attack' }, { name: 'Emergency Altitude', type: 'active', description: 'Dodge all attacks for 1 turn', icon: '🎈', effects: 'Full dodge 1 turn' }] },
  // Mythic (1)
  { name: 'Clockwork God', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_MYTHIC', description: 'Has built the perfect perpetual engine', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, subjects: { SCIENCE: 100, MATHEMATICS: 100 }, achievements: 50 }, evolvesFrom: 'Grand Inventor', abilities: [{ name: 'Infinite Engine', type: 'passive', description: 'No resource costs (MP/STA free)', icon: '♾️', effects: 'Free casting' }, { name: 'Time Stop', type: 'active', description: 'Take 3 free turns', icon: '⏱️', effects: '3 extra turns' }, { name: 'Perfect Mechanism', type: 'passive', description: '+20% all stats', icon: '⚙️', effects: '+20% all stats' }] },
];

export async function seedCharacterClasses(prisma: PrismaClient) {
  console.log(`Seeding ${CLASSES.length} character classes...`);

  for (const c of CLASSES) {
    await prisma.characterClass.upsert({
      where: { name: c.name },
      update: {
        theme: c.theme,
        rarity: c.rarity,
        description: c.description,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        passives: c.passives as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requirements: c.requirements as any,
      },
      create: {
        name: c.name,
        theme: c.theme,
        rarity: c.rarity,
        description: c.description,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        passives: c.passives as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requirements: c.requirements as any,
      },
    });
  }

  // Second pass: set evolution chains
  const classMap = new Map<string, string>();
  const allClasses = await prisma.characterClass.findMany({ select: { id: true, name: true } });
  for (const c of allClasses) classMap.set(c.name, c.id);

  for (const c of CLASSES) {
    if (c.evolvesFrom) {
      const parentId = classMap.get(c.evolvesFrom);
      const childId = classMap.get(c.name);
      if (parentId && childId) {
        await prisma.characterClass.update({
          where: { id: childId },
          data: { evolvesFromId: parentId },
        });
      }
    }
  }

  console.log(`Seeded ${CLASSES.length} character classes.`);
}
