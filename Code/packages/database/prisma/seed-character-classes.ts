import type { PrismaClient } from '@prisma/client';

interface ClassSeed {
  name: string;
  theme: 'FANTASY' | 'CYBERPUNK_THEME' | 'MILITARY' | 'SCI_FI' | 'ANIME' | 'STEAMPUNK_THEME';
  rarity: 'CLASS_COMMON' | 'CLASS_UNCOMMON' | 'CLASS_RARE' | 'CLASS_EPIC' | 'CLASS_LEGENDARY' | 'CLASS_MYTHIC';
  description: string;
  passives: Record<string, number>;
  requirements: Record<string, unknown>;
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
  { name: 'Elementalist', theme: 'FANTASY', rarity: 'CLASS_UNCOMMON', description: 'Controls fire, water, earth, air', passives: { MP: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } } },
  { name: 'Knight', theme: 'FANTASY', rarity: 'CLASS_UNCOMMON', description: 'Armored warrior with shield', passives: { DEF: 0.08, HP: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } } },
  { name: 'Priest', theme: 'FANTASY', rarity: 'CLASS_UNCOMMON', description: 'Divine healer of the light', passives: { MP: 0.08 }, requirements: { minLevel: 10, subjects: { ARTS: 70 } } },
  { name: 'Ranger', theme: 'FANTASY', rarity: 'CLASS_UNCOMMON', description: 'Master of bow and forest', passives: { SPD: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { LANGUAGES: 70 } } },
  // Rare (3)
  { name: 'Archmage', theme: 'FANTASY', rarity: 'CLASS_RARE', description: 'Master of arcane magic with devastating spells', passives: { MP: 0.12, ATK: 0.12 }, requirements: { minLevel: 20, subjects: { MATHEMATICS: 80, SCIENCE: 80 } } },
  { name: 'Paladin', theme: 'FANTASY', rarity: 'CLASS_RARE', description: 'Holy warrior with impenetrable defenses', passives: { DEF: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SOCIAL_STUDIES: 80 } } },
  { name: 'Assassin', theme: 'FANTASY', rarity: 'CLASS_RARE', description: 'Silent blade striking from the shadows', passives: { SPD: 0.12, LCK: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, LANGUAGES: 80 } } },
  // Epic (2)
  { name: 'Sage', theme: 'FANTASY', rarity: 'CLASS_EPIC', description: 'Ancient scholar of wisdom and power', passives: { MP: 0.15, ATK: 0.15 }, requirements: { minLevel: 35, subjects: { MATHEMATICS: 85, SCIENCE: 85 }, achievements: 15 } },
  { name: 'Champion', theme: 'FANTASY', rarity: 'CLASS_EPIC', description: 'Legendary warrior of the realm', passives: { ATK: 0.15, HP: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SOCIAL_STUDIES: 85 }, achievements: 15 } },
  // Legendary (2)
  { name: 'Grand Sage', theme: 'FANTASY', rarity: 'CLASS_LEGENDARY', description: 'Master of all magical arts', passives: { MP: 0.20, ATK: 0.20, LCK: 0.20 }, requirements: { minLevel: 50, subjects: { MATHEMATICS: 90, SCIENCE: 90, ARTS: 90 }, achievements: 30 } },
  { name: 'Dragon Knight', theme: 'FANTASY', rarity: 'CLASS_LEGENDARY', description: 'Bonded with a dragon spirit', passives: { HP: 0.20, ATK: 0.20, DEF: 0.20 }, requirements: { minLevel: 50, subjects: { PHYSICAL_EDUCATION: 90, SOCIAL_STUDIES: 90, LANGUAGES: 90 }, achievements: 30 } },
  // Mythic (1)
  { name: 'Supreme Mage', theme: 'FANTASY', rarity: 'CLASS_MYTHIC', description: 'One who has transcended mortality through knowledge', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, subjects: { MATHEMATICS: 100, SCIENCE: 100 }, achievements: 50, streak: 365 } },

  // ──────────────── CYBERPUNK (16) ────────────────
  // Common (4)
  { name: 'Script Kiddie', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Beginner hacker with basic scripts', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Street Samurai', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Cybernetically enhanced fighter', passives: { ATK: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Medtech', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Street medic with basic chrome', passives: { DEF: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Runner', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Information courier and scout', passives: { SPD: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'Netrunner', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Skilled hacker diving into the net', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { COMPUTER_SCIENCE: 70 } } },
  { name: 'Cyborg', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Heavily augmented soldier', passives: { HP: 0.08, DEF: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } } },
  { name: 'Ripper Doc', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Expert cybernetic surgeon', passives: { MP: 0.08 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } } },
  { name: 'Fixer', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Connected dealer and negotiator', passives: { LCK: 0.08, SPD: 0.03 }, requirements: { minLevel: 10, subjects: { LANGUAGES: 70 } } },
  // Rare (3)
  { name: 'Elite Hacker', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_RARE', description: 'Master of digital infiltration', passives: { MP: 0.12, LCK: 0.12 }, requirements: { minLevel: 20, subjects: { COMPUTER_SCIENCE: 80, MATHEMATICS: 80 } } },
  { name: 'Chrome Warrior', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_RARE', description: 'Full-body cybernetic combat machine', passives: { ATK: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SCIENCE: 80 } } },
  { name: 'Tech Ninja', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_RARE', description: 'Stealth operative with optical camo', passives: { SPD: 0.12, ATK: 0.12 }, requirements: { minLevel: 20, subjects: { COMPUTER_SCIENCE: 80, PHYSICAL_EDUCATION: 80 } } },
  // Epic (2)
  { name: 'Blackhat', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_EPIC', description: 'Legendary hacker who can breach any system', passives: { MP: 0.15, LCK: 0.15 }, requirements: { minLevel: 35, subjects: { COMPUTER_SCIENCE: 85, MATHEMATICS: 85 }, achievements: 15 } },
  { name: 'Full Borg', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_EPIC', description: 'Fully cybernetic war machine', passives: { HP: 0.15, ATK: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SCIENCE: 85 }, achievements: 15 } },
  // Legendary (2)
  { name: 'Digital Ghost', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_LEGENDARY', description: 'Exists between the digital and physical', passives: { MP: 0.20, SPD: 0.20, LCK: 0.20 }, requirements: { minLevel: 50, subjects: { COMPUTER_SCIENCE: 90, MATHEMATICS: 90, LANGUAGES: 90 }, achievements: 30 } },
  { name: 'Apex Predator', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_LEGENDARY', description: 'The ultimate hunter in the neon jungle', passives: { ATK: 0.20, HP: 0.20, DEF: 0.20 }, requirements: { minLevel: 50, subjects: { PHYSICAL_EDUCATION: 90, SCIENCE: 90, COMPUTER_SCIENCE: 90 }, achievements: 30 } },
  // Mythic (1)
  { name: 'Digital God', theme: 'CYBERPUNK_THEME', rarity: 'CLASS_MYTHIC', description: 'Has achieved digital omniscience', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, subjects: { COMPUTER_SCIENCE: 100, MATHEMATICS: 100 }, pvpWins: 500 } },

  // ──────────────── MILITARY (16) ────────────────
  // Common (4)
  { name: 'Recruit', theme: 'MILITARY', rarity: 'CLASS_COMMON', description: 'Fresh soldier in basic training', passives: { HP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Military Cadet', theme: 'MILITARY', rarity: 'CLASS_COMMON', description: 'Military academy student', passives: { DEF: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Field Medic', theme: 'MILITARY', rarity: 'CLASS_COMMON', description: 'Basic combat medic', passives: { STA: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Military Scout', theme: 'MILITARY', rarity: 'CLASS_COMMON', description: 'Reconnaissance specialist', passives: { SPD: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'Soldier', theme: 'MILITARY', rarity: 'CLASS_UNCOMMON', description: 'Standard infantry fighter', passives: { ATK: 0.08, HP: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } } },
  { name: 'Tactician', theme: 'MILITARY', rarity: 'CLASS_UNCOMMON', description: 'Strategic defensive expert', passives: { DEF: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { SOCIAL_STUDIES: 70 } } },
  { name: 'Combat Medic', theme: 'MILITARY', rarity: 'CLASS_UNCOMMON', description: 'Battlefield healer', passives: { STA: 0.08, HP: 0.03 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } } },
  { name: 'Sniper', theme: 'MILITARY', rarity: 'CLASS_UNCOMMON', description: 'Long-range precision shooter', passives: { ATK: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } } },
  // Rare (3)
  { name: 'Special Forces', theme: 'MILITARY', rarity: 'CLASS_RARE', description: 'Elite tactical unit', passives: { ATK: 0.12, SPD: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, LANGUAGES: 80 } } },
  { name: 'Commander', theme: 'MILITARY', rarity: 'CLASS_RARE', description: 'Battlefield leader and strategist', passives: { DEF: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { SOCIAL_STUDIES: 80, LANGUAGES: 80 } } },
  { name: 'Demolitions', theme: 'MILITARY', rarity: 'CLASS_RARE', description: 'Explosives and heavy ordnance expert', passives: { ATK: 0.12, MP: 0.12 }, requirements: { minLevel: 20, subjects: { SCIENCE: 80, MATHEMATICS: 80 } } },
  // Epic (2)
  { name: 'Black Ops', theme: 'MILITARY', rarity: 'CLASS_EPIC', description: 'Covert operations specialist', passives: { ATK: 0.15, SPD: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SOCIAL_STUDIES: 85 }, achievements: 15 } },
  { name: 'General', theme: 'MILITARY', rarity: 'CLASS_EPIC', description: 'Supreme military commander', passives: { DEF: 0.15, HP: 0.15 }, requirements: { minLevel: 35, subjects: { SOCIAL_STUDIES: 85, LANGUAGES: 85 }, achievements: 15 } },
  // Legendary (2)
  { name: 'Legendary Sniper', theme: 'MILITARY', rarity: 'CLASS_LEGENDARY', description: 'One shot, one kill from any distance', passives: { ATK: 0.20, LCK: 0.20, SPD: 0.20 }, requirements: { minLevel: 50, subjects: { MATHEMATICS: 90, PHYSICAL_EDUCATION: 90, SOCIAL_STUDIES: 90 }, achievements: 30 } },
  { name: 'Supreme Commander', theme: 'MILITARY', rarity: 'CLASS_LEGENDARY', description: 'Commands armies and inspires nations', passives: { DEF: 0.20, HP: 0.20, STA: 0.20 }, requirements: { minLevel: 50, subjects: { SOCIAL_STUDIES: 90, LANGUAGES: 90, PHYSICAL_EDUCATION: 90 }, achievements: 30 } },
  // Mythic (1)
  { name: 'Absolute Warrior', theme: 'MILITARY', rarity: 'CLASS_MYTHIC', description: 'The embodiment of military perfection', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, subjects: { PHYSICAL_EDUCATION: 100, SOCIAL_STUDIES: 100 }, homeworkCompleted: 1000 } },

  // ──────────────── SCI-FI (16) ────────────────
  // Common (4)
  { name: 'Space Cadet', theme: 'SCI_FI', rarity: 'CLASS_COMMON', description: 'Space academy trainee', passives: { HP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Lab Assistant', theme: 'SCI_FI', rarity: 'CLASS_COMMON', description: 'Junior researcher in the space lab', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Navigator', theme: 'SCI_FI', rarity: 'CLASS_COMMON', description: 'Ship pilot in training', passives: { SPD: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Comm Officer', theme: 'SCI_FI', rarity: 'CLASS_COMMON', description: 'Communications specialist', passives: { LCK: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'Space Marine', theme: 'SCI_FI', rarity: 'CLASS_UNCOMMON', description: 'Elite space soldier', passives: { HP: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } } },
  { name: 'Scientist', theme: 'SCI_FI', rarity: 'CLASS_UNCOMMON', description: 'Research specialist', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } } },
  { name: 'Pilot', theme: 'SCI_FI', rarity: 'CLASS_UNCOMMON', description: 'Skilled ship operator', passives: { SPD: 0.08, DEF: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } } },
  { name: 'Xenolinguist', theme: 'SCI_FI', rarity: 'CLASS_UNCOMMON', description: 'Alien language expert', passives: { MP: 0.08 }, requirements: { minLevel: 10, subjects: { LANGUAGES: 70 } } },
  // Rare (3)
  { name: 'Shock Trooper', theme: 'SCI_FI', rarity: 'CLASS_RARE', description: 'Heavy assault shock infantry', passives: { ATK: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SCIENCE: 80 } } },
  { name: 'Quantum Physicist', theme: 'SCI_FI', rarity: 'CLASS_RARE', description: 'Bends reality with quantum mechanics', passives: { MP: 0.12, ATK: 0.12 }, requirements: { minLevel: 20, subjects: { SCIENCE: 80, MATHEMATICS: 80 } } },
  { name: 'Ace Pilot', theme: 'SCI_FI', rarity: 'CLASS_RARE', description: 'Legendary starfighter pilot', passives: { SPD: 0.12, DEF: 0.12 }, requirements: { minLevel: 20, subjects: { MATHEMATICS: 80, PHYSICAL_EDUCATION: 80 } } },
  // Epic (2)
  { name: 'Void Walker', theme: 'SCI_FI', rarity: 'CLASS_EPIC', description: 'Traverses the void between stars', passives: { MP: 0.15, SPD: 0.15 }, requirements: { minLevel: 35, subjects: { SCIENCE: 85, MATHEMATICS: 85 }, achievements: 15 } },
  { name: 'Fleet Admiral', theme: 'SCI_FI', rarity: 'CLASS_EPIC', description: 'Commands an entire space fleet', passives: { DEF: 0.15, HP: 0.15 }, requirements: { minLevel: 35, subjects: { SOCIAL_STUDIES: 85, LANGUAGES: 85 }, achievements: 15 } },
  // Legendary (2)
  { name: 'Psionic', theme: 'SCI_FI', rarity: 'CLASS_LEGENDARY', description: 'Wields the power of the mind', passives: { MP: 0.20, ATK: 0.20, SPD: 0.20 }, requirements: { minLevel: 50, subjects: { SCIENCE: 90, MATHEMATICS: 90, ARTS: 90 }, achievements: 30 } },
  { name: 'Starship Captain', theme: 'SCI_FI', rarity: 'CLASS_LEGENDARY', description: 'Leads humanity to the stars', passives: { HP: 0.20, DEF: 0.20, STA: 0.20 }, requirements: { minLevel: 50, subjects: { SOCIAL_STUDIES: 90, LANGUAGES: 90, MATHEMATICS: 90 }, achievements: 30 } },
  // Mythic (1)
  { name: 'Time Lord', theme: 'SCI_FI', rarity: 'CLASS_MYTHIC', description: 'Master of time and space itself', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, streak: 365, bossDefeats: 100 } },

  // ──────────────── ANIME/MANHWA (16) ────────────────
  // Common (4)
  { name: 'E-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_COMMON', description: 'Weakest hunter, just awakened', passives: { ATK: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Student Mage', theme: 'ANIME', rarity: 'CLASS_COMMON', description: 'Magic academy freshman', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Trainee', theme: 'ANIME', rarity: 'CLASS_COMMON', description: 'Dojo apprentice learning the basics', passives: { HP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Spirit User', theme: 'ANIME', rarity: 'CLASS_COMMON', description: 'Can see and interact with weak spirits', passives: { LCK: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'D-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_UNCOMMON', description: 'Dungeon delver gaining experience', passives: { ATK: 0.08, SPD: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } } },
  { name: 'Battle Mage', theme: 'ANIME', rarity: 'CLASS_UNCOMMON', description: 'Combat-focused mage', passives: { MP: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } } },
  { name: 'Martial Artist', theme: 'ANIME', rarity: 'CLASS_UNCOMMON', description: 'Hand-to-hand combat specialist', passives: { STA: 0.08, ATK: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } } },
  { name: 'Spirit Contractor', theme: 'ANIME', rarity: 'CLASS_UNCOMMON', description: 'Commands spirits in battle', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { ARTS: 70 } } },
  // Rare (3)
  { name: 'C-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_RARE', description: 'Experienced dungeon hunter', passives: { ATK: 0.12, HP: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SOCIAL_STUDIES: 80 } } },
  { name: 'Sword Saint', theme: 'ANIME', rarity: 'CLASS_RARE', description: 'Master of the blade with lethal precision', passives: { ATK: 0.12, SPD: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, ARTS: 80 } } },
  { name: 'Summoner', theme: 'ANIME', rarity: 'CLASS_RARE', description: 'Calls powerful creatures to fight', passives: { MP: 0.12, LCK: 0.12 }, requirements: { minLevel: 20, subjects: { ARTS: 80, LANGUAGES: 80 } } },
  // Epic (2)
  { name: 'B-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_EPIC', description: 'Elite hunter with awakened powers', passives: { ATK: 0.15, HP: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SOCIAL_STUDIES: 85 }, achievements: 15 } },
  { name: 'Arcane Knight', theme: 'ANIME', rarity: 'CLASS_EPIC', description: 'Combines sword mastery with magic', passives: { ATK: 0.15, MP: 0.15 }, requirements: { minLevel: 35, subjects: { MATHEMATICS: 85, PHYSICAL_EDUCATION: 85 }, achievements: 15 } },
  // Legendary (2)
  { name: 'A-Rank Hunter', theme: 'ANIME', rarity: 'CLASS_LEGENDARY', description: 'Among the strongest hunters alive', passives: { ATK: 0.20, HP: 0.20, SPD: 0.20 }, requirements: { minLevel: 50, subjects: { PHYSICAL_EDUCATION: 90, SOCIAL_STUDIES: 90, MATHEMATICS: 90 }, achievements: 30 } },
  { name: 'Grand Summoner', theme: 'ANIME', rarity: 'CLASS_LEGENDARY', description: 'Commands an army of spirits', passives: { MP: 0.20, LCK: 0.20, STA: 0.20 }, requirements: { minLevel: 50, subjects: { ARTS: 90, LANGUAGES: 90, SCIENCE: 90 }, achievements: 30 } },
  // Mythic (1)
  { name: 'Shadow Monarch', theme: 'ANIME', rarity: 'CLASS_MYTHIC', description: 'Ruler of shadows who commands the dead', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, bossDefeats: 100, rank: 1 } },

  // ──────────────── STEAMPUNK (16) ────────────────
  // Common (4)
  { name: 'Tinkerer', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Amateur inventor with basic gadgets', passives: { MP: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Brawler', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Steam-powered fighter', passives: { ATK: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Apothecary', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Medicine mixer and healer', passives: { STA: 0.05 }, requirements: { minLevel: 5 } },
  { name: 'Courier', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_COMMON', description: 'Airship messenger and delivery expert', passives: { SPD: 0.05 }, requirements: { minLevel: 5 } },
  // Uncommon (4)
  { name: 'Inventor', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Creates useful gadgets and machines', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } } },
  { name: 'Ironclad', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Heavy armor powered by steam', passives: { DEF: 0.08, HP: 0.03 }, requirements: { minLevel: 10, subjects: { PHYSICAL_EDUCATION: 70 } } },
  { name: 'Alchemist', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Potion master and transmuter', passives: { MP: 0.08, LCK: 0.03 }, requirements: { minLevel: 10, subjects: { SCIENCE: 70 } } },
  { name: 'Aeronaut', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_UNCOMMON', description: 'Airship specialist and navigator', passives: { SPD: 0.08, DEF: 0.03 }, requirements: { minLevel: 10, subjects: { MATHEMATICS: 70 } } },
  // Rare (3)
  { name: 'Mechanist', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_RARE', description: 'Builds and deploys combat automatons', passives: { MP: 0.12, ATK: 0.12 }, requirements: { minLevel: 20, subjects: { SCIENCE: 80, MATHEMATICS: 80 } } },
  { name: 'Steam Knight', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_RARE', description: 'Steam-powered armored warrior', passives: { ATK: 0.12, DEF: 0.12 }, requirements: { minLevel: 20, subjects: { PHYSICAL_EDUCATION: 80, SOCIAL_STUDIES: 80 } } },
  { name: 'Mad Scientist', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_RARE', description: 'Unpredictable genius with wild experiments', passives: { MP: 0.12, LCK: 0.12 }, requirements: { minLevel: 20, subjects: { SCIENCE: 80, ARTS: 80 } } },
  // Epic (2)
  { name: 'Engineer', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_EPIC', description: 'Master builder of mechanical wonders', passives: { MP: 0.15, ATK: 0.15 }, requirements: { minLevel: 35, subjects: { SCIENCE: 85, MATHEMATICS: 85 }, achievements: 15 } },
  { name: 'Clockwork Knight', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_EPIC', description: 'Precision-engineered combat machine', passives: { ATK: 0.15, DEF: 0.15 }, requirements: { minLevel: 35, subjects: { PHYSICAL_EDUCATION: 85, SCIENCE: 85 }, achievements: 15 } },
  // Legendary (2)
  { name: 'Grand Inventor', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_LEGENDARY', description: 'Creator of world-changing machines', passives: { MP: 0.20, ATK: 0.20, LCK: 0.20 }, requirements: { minLevel: 50, subjects: { SCIENCE: 90, MATHEMATICS: 90, ARTS: 90 }, achievements: 30 } },
  { name: 'Airship Captain', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_LEGENDARY', description: 'Commands a fleet of airships', passives: { SPD: 0.20, HP: 0.20, DEF: 0.20 }, requirements: { minLevel: 50, subjects: { MATHEMATICS: 90, SOCIAL_STUDIES: 90, LANGUAGES: 90 }, achievements: 30 } },
  // Mythic (1)
  { name: 'Clockwork God', theme: 'STEAMPUNK_THEME', rarity: 'CLASS_MYTHIC', description: 'Has built the perfect perpetual engine', passives: { HP: 0.25, MP: 0.25, STA: 0.25, ATK: 0.25, DEF: 0.25, SPD: 0.25, LCK: 0.25 }, requirements: { minLevel: 75, subjects: { SCIENCE: 100, MATHEMATICS: 100 }, achievements: 50 } },
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

  console.log(`Seeded ${CLASSES.length} character classes.`);
}
