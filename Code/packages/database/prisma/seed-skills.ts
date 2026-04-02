import type { PrismaClient } from '@prisma/client';

interface SkillSeed {
  name: string;
  type: 'PHYSICAL' | 'MAGIC' | 'HYBRID' | 'HEAL' | 'BUFF' | 'DEBUFF' | 'STATUS' | 'UTILITY' | 'ULTIMATE';
  rarity: 'SKILL_COMMON' | 'SKILL_UNCOMMON' | 'SKILL_RARE' | 'SKILL_EPIC' | 'SKILL_LEGENDARY' | 'SKILL_MYTHIC';
  description: string;
  mpCost: number;
  staCost: number;
  power: number;
  hitCount: number;
  cooldown: number;
  effects: Record<string, unknown>;
  unlockConditions: Record<string, unknown>;
  primarySubject: string | null;
  exclusiveClassName?: string;
}

// ═══════════════════════════════════════════════════════════════
// 156 Skills for the EduMind AI Battle System
// ═══════════════════════════════════════════════════════════════

const SKILLS: SkillSeed[] = [
  // ──────────────── COMMON SKILLS (50) ────────────────

  // ── Common Physical Attacks (15) ──
  { name: 'Punch', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Basic attack', mpCost: 0, staCost: 10, power: 100, hitCount: 1, cooldown: 0, effects: { description: 'Basic attack' }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Kick', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Basic attack', mpCost: 0, staCost: 12, power: 110, hitCount: 1, cooldown: 0, effects: { description: 'Basic attack' }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Slash', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Sword attack', mpCost: 0, staCost: 15, power: 120, hitCount: 1, cooldown: 0, effects: { description: 'Sword attack' }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Thrust', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Piercing attack', mpCost: 0, staCost: 15, power: 125, hitCount: 1, cooldown: 0, effects: { description: 'Piercing attack' }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Bash', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Blunt attack', mpCost: 0, staCost: 18, power: 130, hitCount: 1, cooldown: 0, effects: { description: 'Blunt attack' }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Quick Strike', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: '+10% SPD this turn', mpCost: 0, staCost: 12, power: 105, hitCount: 1, cooldown: 0, effects: { description: '+10% SPD this turn', buff: { stat: 'SPD', percentage: 10, turns: 1 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Heavy Blow', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Slow but strong', mpCost: 0, staCost: 20, power: 140, hitCount: 1, cooldown: 1, effects: { description: 'Slow but strong' }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Double Hit', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Hits twice', mpCost: 0, staCost: 22, power: 70, hitCount: 2, cooldown: 0, effects: { description: 'Hits twice' }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Guard Break', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: '-10% enemy DEF', mpCost: 0, staCost: 18, power: 115, hitCount: 1, cooldown: 0, effects: { description: '-10% enemy DEF', debuff: { stat: 'DEF', percentage: -10, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Counter Stance', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Counter next attack 150%', mpCost: 0, staCost: 15, power: 0, hitCount: 1, cooldown: 1, effects: { description: 'Counter next attack 150%', counter: { multiplier: 150 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'HISTORY' },
  { name: 'Tackle', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: '10% stun chance', mpCost: 0, staCost: 14, power: 115, hitCount: 1, cooldown: 0, effects: { description: '10% stun chance', stun: { chance: 10, turns: 1 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Uppercut', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: '+5% crit chance', mpCost: 0, staCost: 16, power: 125, hitCount: 1, cooldown: 0, effects: { description: '+5% crit chance', crit: { bonusChance: 5 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Sweep', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: '15% trip (skip turn)', mpCost: 0, staCost: 18, power: 110, hitCount: 1, cooldown: 0, effects: { description: '15% trip (skip turn)', trip: { chance: 15, turns: 1 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Jab', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Very fast', mpCost: 0, staCost: 8, power: 80, hitCount: 1, cooldown: 0, effects: { description: 'Very fast' }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Body Slam', type: 'PHYSICAL', rarity: 'SKILL_COMMON', description: 'Self -5% HP', mpCost: 0, staCost: 25, power: 150, hitCount: 1, cooldown: 0, effects: { description: 'Self -5% HP', recoil: { percentage: 5 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },

  // ── Common Magic Attacks (15) ──
  { name: 'Spark', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Basic magic', mpCost: 10, staCost: 0, power: 100, hitCount: 1, cooldown: 0, effects: { description: 'Basic magic' }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Ember', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Fire damage', mpCost: 12, staCost: 0, power: 110, hitCount: 1, cooldown: 0, effects: { description: 'Fire damage' }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Frost Bolt', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Ice damage', mpCost: 12, staCost: 0, power: 110, hitCount: 1, cooldown: 0, effects: { description: 'Ice damage' }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Shock', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Electric damage', mpCost: 15, staCost: 0, power: 120, hitCount: 1, cooldown: 0, effects: { description: 'Electric damage' }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Wind Blade', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Air damage', mpCost: 14, staCost: 0, power: 115, hitCount: 1, cooldown: 0, effects: { description: 'Air damage' }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Stone Shot', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Earth damage', mpCost: 16, staCost: 0, power: 125, hitCount: 1, cooldown: 0, effects: { description: 'Earth damage' }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Water Jet', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Water damage', mpCost: 14, staCost: 0, power: 115, hitCount: 1, cooldown: 0, effects: { description: 'Water damage' }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Light Ray', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Holy damage', mpCost: 18, staCost: 0, power: 130, hitCount: 1, cooldown: 0, effects: { description: 'Holy damage' }, unlockConditions: { minLevel: 5 }, primarySubject: 'ARTS' },
  { name: 'Shadow Bolt', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Dark damage', mpCost: 18, staCost: 0, power: 130, hitCount: 1, cooldown: 0, effects: { description: 'Dark damage' }, unlockConditions: { minLevel: 5 }, primarySubject: 'ARTS' },
  { name: 'Arcane Missile', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Pure magic', mpCost: 15, staCost: 0, power: 120, hitCount: 1, cooldown: 0, effects: { description: 'Pure magic' }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Energy Burst', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Raw energy', mpCost: 20, staCost: 0, power: 140, hitCount: 1, cooldown: 0, effects: { description: 'Raw energy' }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Acid Spray', type: 'MAGIC', rarity: 'SKILL_COMMON', description: '5% poison chance', mpCost: 16, staCost: 0, power: 110, hitCount: 1, cooldown: 0, effects: { description: '5% poison chance', poison: { chance: 5, damage: 2, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Mind Spike', type: 'MAGIC', rarity: 'SKILL_COMMON', description: 'Psychic damage', mpCost: 18, staCost: 0, power: 125, hitCount: 1, cooldown: 0, effects: { description: 'Psychic damage' }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Gravity Pull', type: 'MAGIC', rarity: 'SKILL_COMMON', description: '-5% enemy SPD', mpCost: 20, staCost: 0, power: 130, hitCount: 1, cooldown: 0, effects: { description: '-5% enemy SPD', debuff: { stat: 'SPD', percentage: -5, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Flash', type: 'MAGIC', rarity: 'SKILL_COMMON', description: '10% blind (miss)', mpCost: 12, staCost: 0, power: 90, hitCount: 1, cooldown: 0, effects: { description: '10% blind (miss)', blind: { chance: 10, turns: 2 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'ARTS' },

  // ── Common Support Skills (20) ──
  { name: 'Minor Heal', type: 'HEAL', rarity: 'SKILL_COMMON', description: 'Restore 20% HP', mpCost: 15, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: 'Restore 20% HP', heal: { percentage: 20 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'ARTS' },
  { name: 'Bandage', type: 'HEAL', rarity: 'SKILL_COMMON', description: 'Restore 15% HP', mpCost: 0, staCost: 10, power: 0, hitCount: 1, cooldown: 0, effects: { description: 'Restore 15% HP', heal: { percentage: 15 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'First Aid', type: 'HEAL', rarity: 'SKILL_COMMON', description: 'Restore 18% HP', mpCost: 12, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: 'Restore 18% HP', heal: { percentage: 18 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Focus', type: 'BUFF', rarity: 'SKILL_COMMON', description: '+10% ATK', mpCost: 15, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '+10% ATK', buff: { stat: 'ATK', percentage: 10, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Harden', type: 'BUFF', rarity: 'SKILL_COMMON', description: '+10% DEF', mpCost: 15, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '+10% DEF', buff: { stat: 'DEF', percentage: 10, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Quicken', type: 'BUFF', rarity: 'SKILL_COMMON', description: '+10% SPD', mpCost: 15, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '+10% SPD', buff: { stat: 'SPD', percentage: 10, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'LANGUAGES' },
  { name: 'Sharpen', type: 'BUFF', rarity: 'SKILL_COMMON', description: '+5% crit chance', mpCost: 12, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '+5% crit chance', buff: { stat: 'CRIT', percentage: 5, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Protect', type: 'BUFF', rarity: 'SKILL_COMMON', description: '+15% DEF', mpCost: 18, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '+15% DEF', buff: { stat: 'DEF', percentage: 15, turns: 2 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'HISTORY' },
  { name: 'Weaken', type: 'DEBUFF', rarity: 'SKILL_COMMON', description: '-10% enemy ATK', mpCost: 15, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '-10% enemy ATK', debuff: { stat: 'ATK', percentage: -10, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Slow', type: 'DEBUFF', rarity: 'SKILL_COMMON', description: '-10% enemy SPD', mpCost: 15, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '-10% enemy SPD', debuff: { stat: 'SPD', percentage: -10, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Corrode', type: 'DEBUFF', rarity: 'SKILL_COMMON', description: '-10% enemy DEF', mpCost: 18, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '-10% enemy DEF', debuff: { stat: 'DEF', percentage: -10, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Distract', type: 'DEBUFF', rarity: 'SKILL_COMMON', description: '-5% enemy accuracy', mpCost: 12, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '-5% enemy accuracy', debuff: { stat: 'ACC', percentage: -5, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'LANGUAGES' },
  { name: 'Ignite', type: 'STATUS', rarity: 'SKILL_COMMON', description: 'Burn: 3% HP/turn', mpCost: 20, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: 'Burn: 3% HP/turn', burn: { damage: 3, turns: 3 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Chill', type: 'STATUS', rarity: 'SKILL_COMMON', description: '15% freeze chance', mpCost: 20, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '15% freeze chance', freeze: { chance: 15, turns: 2 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Toxin', type: 'STATUS', rarity: 'SKILL_COMMON', description: 'Poison: 2% HP/turn', mpCost: 18, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: 'Poison: 2% HP/turn', poison: { damage: 2, turns: 4 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Shock Touch', type: 'STATUS', rarity: 'SKILL_COMMON', description: '10% stun', mpCost: 18, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: '10% stun', stun: { chance: 10, turns: 1 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'SCIENCE' },
  { name: 'Analyze', type: 'UTILITY', rarity: 'SKILL_COMMON', description: 'See enemy HP/MP', mpCost: 10, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: 'See enemy HP/MP', reveal: true }, unlockConditions: { minLevel: 5 }, primarySubject: 'MATHEMATICS' },
  { name: 'Taunt', type: 'UTILITY', rarity: 'SKILL_COMMON', description: 'Enemy targets you', mpCost: 0, staCost: 10, power: 0, hitCount: 1, cooldown: 0, effects: { description: 'Enemy targets you', taunt: { turns: 2 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Meditate', type: 'UTILITY', rarity: 'SKILL_COMMON', description: 'Recover +15 MP', mpCost: 0, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: 'Recover +15 MP', restore: { mp: 15 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'ARTS' },
  { name: 'Rest', type: 'UTILITY', rarity: 'SKILL_COMMON', description: 'Recover +15 STA', mpCost: 0, staCost: 0, power: 0, hitCount: 1, cooldown: 0, effects: { description: 'Recover +15 STA', restore: { sta: 15 } }, unlockConditions: { minLevel: 5 }, primarySubject: 'PHYSICAL_EDUCATION' },

  // ──────────────── UNCOMMON SKILLS (40) ────────────────

  // ── Uncommon Physical Attacks (12) ──
  { name: 'Power Strike', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: 'Strong hit', mpCost: 0, staCost: 25, power: 180, hitCount: 1, cooldown: 1, effects: { description: 'Strong hit' }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Whirlwind', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: 'AoE attack', mpCost: 0, staCost: 30, power: 150, hitCount: 1, cooldown: 1, effects: { description: 'AoE attack', aoe: true }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70 }, battlesWon: 20 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Armor Pierce', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: 'Ignore 20% DEF', mpCost: 0, staCost: 28, power: 160, hitCount: 1, cooldown: 1, effects: { description: 'Ignore 20% DEF', pierce: { percentage: 20 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 75, HISTORY: 60 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Critical Edge', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: '+15% crit', mpCost: 0, staCost: 25, power: 170, hitCount: 1, cooldown: 1, effects: { description: '+15% crit', crit: { bonusChance: 15 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70, MATHEMATICS: 60 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Blitz', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: 'Always first', mpCost: 0, staCost: 22, power: 155, hitCount: 1, cooldown: 1, effects: { description: 'Always first', priority: true }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70, LANGUAGES: 65 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Combo Attack', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: 'Hits 3 times', mpCost: 0, staCost: 35, power: 60, hitCount: 3, cooldown: 1, effects: { description: 'Hits 3 times' }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 75 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Shield Bash', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: '20% stun', mpCost: 0, staCost: 28, power: 140, hitCount: 1, cooldown: 1, effects: { description: '20% stun', stun: { chance: 20, turns: 1 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70, HISTORY: 70 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Reckless Charge', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: 'Self -10% DEF', mpCost: 0, staCost: 30, power: 200, hitCount: 1, cooldown: 2, effects: { description: 'Self -10% DEF', recoil: { stat: 'DEF', percentage: -10, turns: 2 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 75 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Precise Strike', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: 'Cannot miss', mpCost: 0, staCost: 22, power: 165, hitCount: 1, cooldown: 1, effects: { description: 'Cannot miss', guaranteed: true }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70, MATHEMATICS: 70 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Leg Sweep', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: '-15% enemy SPD', mpCost: 0, staCost: 24, power: 145, hitCount: 1, cooldown: 1, effects: { description: '-15% enemy SPD', debuff: { stat: 'SPD', percentage: -15, turns: 3 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Headbutt', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: 'Self -3% HP', mpCost: 0, staCost: 26, power: 170, hitCount: 1, cooldown: 1, effects: { description: 'Self -3% HP', recoil: { percentage: 3 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 75 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Grapple', type: 'PHYSICAL', rarity: 'SKILL_UNCOMMON', description: 'Enemy skip turn', mpCost: 0, staCost: 28, power: 130, hitCount: 1, cooldown: 2, effects: { description: 'Enemy skip turn', skipTurn: { turns: 1 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 75, HISTORY: 65 } }, primarySubject: 'PHYSICAL_EDUCATION' },

  // ── Uncommon Magic Attacks (12) ──
  { name: 'Fireball', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Fire + 10% burn', mpCost: 30, staCost: 0, power: 180, hitCount: 1, cooldown: 1, effects: { description: 'Fire + 10% burn', burn: { chance: 10, damage: 3, turns: 3 } }, unlockConditions: { subjects: { MATHEMATICS: 70, SCIENCE: 65 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Ice Lance', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Ice + 15% slow', mpCost: 28, staCost: 0, power: 175, hitCount: 1, cooldown: 1, effects: { description: 'Ice + 15% slow', slow: { chance: 15, percentage: -15, turns: 3 } }, unlockConditions: { subjects: { MATHEMATICS: 70, SCIENCE: 65 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Lightning Bolt', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Electric + stun 10%', mpCost: 32, staCost: 0, power: 190, hitCount: 1, cooldown: 1, effects: { description: 'Electric + stun 10%', stun: { chance: 10, turns: 1 } }, unlockConditions: { subjects: { MATHEMATICS: 70, SCIENCE: 70 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Earth Spike', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Earth + bleed', mpCost: 30, staCost: 0, power: 185, hitCount: 1, cooldown: 1, effects: { description: 'Earth + bleed', bleed: { damage: 3, turns: 3 } }, unlockConditions: { subjects: { MATHEMATICS: 70, SCIENCE: 65 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Gust', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Push back', mpCost: 25, staCost: 0, power: 160, hitCount: 1, cooldown: 1, effects: { description: 'Push back', pushBack: true }, unlockConditions: { subjects: { MATHEMATICS: 70 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Torrent', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Water + -10% fire res', mpCost: 28, staCost: 0, power: 170, hitCount: 1, cooldown: 1, effects: { description: 'Water + -10% fire res', debuff: { stat: 'FIRE_RES', percentage: -10, turns: 3 } }, unlockConditions: { subjects: { SCIENCE: 75 } }, primarySubject: 'SCIENCE' },
  { name: 'Holy Smite', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Holy + heal 5%', mpCost: 32, staCost: 0, power: 185, hitCount: 1, cooldown: 1, effects: { description: 'Holy + heal 5%', heal: { percentage: 5 } }, unlockConditions: { subjects: { ARTS: 70, MATHEMATICS: 65 } }, primarySubject: 'ARTS' },
  { name: 'Dark Pulse', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Dark + fear 10%', mpCost: 30, staCost: 0, power: 180, hitCount: 1, cooldown: 1, effects: { description: 'Dark + fear 10%', fear: { chance: 10, turns: 2 } }, unlockConditions: { subjects: { MATHEMATICS: 70, ARTS: 65 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Arcane Barrage', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: '3 magic missiles', mpCost: 35, staCost: 0, power: 65, hitCount: 3, cooldown: 1, effects: { description: '3 magic missiles' }, unlockConditions: { subjects: { MATHEMATICS: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Chain Lightning', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Bounces to second target', mpCost: 35, staCost: 0, power: 150, hitCount: 1, cooldown: 2, effects: { description: 'Bounces to second target', bounce: { secondaryPower: 100 } }, unlockConditions: { subjects: { MATHEMATICS: 75, SCIENCE: 70 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Drain Life', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Heal 30% of damage', mpCost: 28, staCost: 0, power: 160, hitCount: 1, cooldown: 1, effects: { description: 'Heal 30% of damage', lifesteal: { percentage: 30 } }, unlockConditions: { subjects: { MATHEMATICS: 70, SCIENCE: 65 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Mana Burn', type: 'MAGIC', rarity: 'SKILL_UNCOMMON', description: 'Enemy -20 MP', mpCost: 30, staCost: 0, power: 150, hitCount: 1, cooldown: 1, effects: { description: 'Enemy -20 MP', manaBurn: { amount: 20 } }, unlockConditions: { subjects: { MATHEMATICS: 75, COMPUTER_SCIENCE: 65 } }, primarySubject: 'MATHEMATICS' },

  // ── Uncommon Support Skills (16) ──
  { name: 'Heal', type: 'HEAL', rarity: 'SKILL_UNCOMMON', description: 'Restore 35% HP', mpCost: 25, staCost: 0, power: 0, hitCount: 1, cooldown: 1, effects: { description: 'Restore 35% HP', heal: { percentage: 35 } }, unlockConditions: { subjects: { ARTS: 70, SCIENCE: 65 } }, primarySubject: 'ARTS' },
  { name: 'Regeneration', type: 'HEAL', rarity: 'SKILL_UNCOMMON', description: '8% HP/turn, 3 turns', mpCost: 30, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '8% HP/turn, 3 turns', regen: { percentage: 8, turns: 3 } }, unlockConditions: { subjects: { SCIENCE: 75 } }, primarySubject: 'SCIENCE' },
  { name: 'Cleanse', type: 'HEAL', rarity: 'SKILL_UNCOMMON', description: 'Remove 1 debuff', mpCost: 20, staCost: 0, power: 0, hitCount: 1, cooldown: 1, effects: { description: 'Remove 1 debuff', cleanse: { count: 1 } }, unlockConditions: { subjects: { SCIENCE: 70, ARTS: 65 } }, primarySubject: 'SCIENCE' },
  { name: 'Power Up', type: 'BUFF', rarity: 'SKILL_UNCOMMON', description: '+20% ATK, 3 turns', mpCost: 25, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '+20% ATK, 3 turns', buff: { stat: 'ATK', percentage: 20, turns: 3 } }, unlockConditions: { subjects: { MATHEMATICS: 70 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Iron Skin', type: 'BUFF', rarity: 'SKILL_UNCOMMON', description: '+20% DEF, 3 turns', mpCost: 25, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '+20% DEF, 3 turns', buff: { stat: 'DEF', percentage: 20, turns: 3 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70, HISTORY: 65 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Haste', type: 'BUFF', rarity: 'SKILL_UNCOMMON', description: '+20% SPD, 3 turns', mpCost: 25, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '+20% SPD, 3 turns', buff: { stat: 'SPD', percentage: 20, turns: 3 } }, unlockConditions: { subjects: { LANGUAGES: 75 } }, primarySubject: 'LANGUAGES' },
  { name: 'Battle Cry', type: 'BUFF', rarity: 'SKILL_UNCOMMON', description: '+15% ATK+DEF, 2 turns', mpCost: 30, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '+15% ATK+DEF, 2 turns', buff: { stats: ['ATK', 'DEF'], percentage: 15, turns: 2 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70, HISTORY: 70 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Magic Shield', type: 'BUFF', rarity: 'SKILL_UNCOMMON', description: 'Absorb 50 magic dmg', mpCost: 28, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: 'Absorb 50 magic dmg', shield: { amount: 50, type: 'magic' } }, unlockConditions: { subjects: { MATHEMATICS: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Curse', type: 'DEBUFF', rarity: 'SKILL_UNCOMMON', description: '-15% all stats, 2 turns', mpCost: 28, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '-15% all stats, 2 turns', debuff: { stat: 'ALL', percentage: -15, turns: 2 } }, unlockConditions: { subjects: { MATHEMATICS: 70, ARTS: 65 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Silence', type: 'DEBUFF', rarity: 'SKILL_UNCOMMON', description: 'Cannot use magic 2 turns', mpCost: 25, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: 'Cannot use magic 2 turns', silence: { turns: 2 } }, unlockConditions: { subjects: { LANGUAGES: 75, COMPUTER_SCIENCE: 65 } }, primarySubject: 'LANGUAGES' },
  { name: 'Blind', type: 'DEBUFF', rarity: 'SKILL_UNCOMMON', description: '30% miss chance, 2 turns', mpCost: 22, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '30% miss chance, 2 turns', blind: { chance: 30, turns: 2 } }, unlockConditions: { subjects: { SCIENCE: 70 } }, primarySubject: 'SCIENCE' },
  { name: 'Intimidate', type: 'DEBUFF', rarity: 'SKILL_UNCOMMON', description: '-20% enemy ATK, 2 turns', mpCost: 20, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '-20% enemy ATK, 2 turns', debuff: { stat: 'ATK', percentage: -20, turns: 2 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 70, LANGUAGES: 65 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Inferno', type: 'STATUS', rarity: 'SKILL_UNCOMMON', description: 'Burn: 5% HP/turn', mpCost: 30, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: 'Burn: 5% HP/turn', burn: { damage: 5, turns: 3 } }, unlockConditions: { subjects: { SCIENCE: 75, MATHEMATICS: 65 } }, primarySubject: 'SCIENCE' },
  { name: 'Deep Freeze', type: 'STATUS', rarity: 'SKILL_UNCOMMON', description: '25% freeze, 3 turns', mpCost: 30, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '25% freeze, 3 turns', freeze: { chance: 25, turns: 3 } }, unlockConditions: { subjects: { SCIENCE: 75 } }, primarySubject: 'SCIENCE' },
  { name: 'Venom', type: 'STATUS', rarity: 'SKILL_UNCOMMON', description: 'Poison: 4% HP/turn, 4 turns', mpCost: 28, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: 'Poison: 4% HP/turn, 4 turns', poison: { damage: 4, turns: 4 } }, unlockConditions: { subjects: { SCIENCE: 75 } }, primarySubject: 'SCIENCE' },
  { name: 'Paralyze', type: 'STATUS', rarity: 'SKILL_UNCOMMON', description: '20% stun, 3 turns', mpCost: 30, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: '20% stun, 3 turns', stun: { chance: 20, turns: 3 } }, unlockConditions: { subjects: { SCIENCE: 75, COMPUTER_SCIENCE: 65 } }, primarySubject: 'SCIENCE' },

  // ──────────────── RARE SKILLS (30) ────────────────

  // ── Rare Physical Attacks (8) ──
  { name: 'Devastating Blow', type: 'PHYSICAL', rarity: 'SKILL_RARE', description: 'Massive damage', mpCost: 0, staCost: 40, power: 250, hitCount: 1, cooldown: 2, effects: { description: 'Massive damage' }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 80 }, battlesWon: 50 }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Blade Dance', type: 'PHYSICAL', rarity: 'SKILL_RARE', description: '4 rapid hits', mpCost: 0, staCost: 45, power: 80, hitCount: 4, cooldown: 2, effects: { description: '4 rapid hits' }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 80, ARTS: 70 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Execution', type: 'PHYSICAL', rarity: 'SKILL_RARE', description: 'Only if enemy <30% HP', mpCost: 0, staCost: 50, power: 350, hitCount: 1, cooldown: 3, effects: { description: 'Only if enemy <30% HP', execute: { threshold: 30 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 80, HISTORY: 75 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Berserker Rage', type: 'PHYSICAL', rarity: 'SKILL_RARE', description: '+30% ATK, -20% DEF', mpCost: 0, staCost: 35, power: 220, hitCount: 1, cooldown: 2, effects: { description: '+30% ATK, -20% DEF', selfBuff: { stat: 'ATK', percentage: 30, turns: 3 }, selfDebuff: { stat: 'DEF', percentage: -20, turns: 3 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 85 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Perfect Counter', type: 'PHYSICAL', rarity: 'SKILL_RARE', description: 'Counter + stun', mpCost: 0, staCost: 30, power: 200, hitCount: 1, cooldown: 3, effects: { description: 'Counter + stun', counter: { multiplier: 200 }, stun: { chance: 100, turns: 1 } }, unlockConditions: { subjects: { HISTORY: 80, PHYSICAL_EDUCATION: 75 } }, primarySubject: 'HISTORY' },
  { name: 'Phantom Strike', type: 'PHYSICAL', rarity: 'SKILL_RARE', description: 'Ignore dodge', mpCost: 0, staCost: 38, power: 230, hitCount: 1, cooldown: 2, effects: { description: 'Ignore dodge', ignoreDodge: true }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 80, LANGUAGES: 75 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Earthquake', type: 'PHYSICAL', rarity: 'SKILL_RARE', description: 'All enemies, stun 15%', mpCost: 0, staCost: 50, power: 180, hitCount: 1, cooldown: 3, effects: { description: 'AoE, stun 15%', aoe: true, stun: { chance: 15, turns: 1 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 80, SCIENCE: 75 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'One Inch Punch', type: 'PHYSICAL', rarity: 'SKILL_RARE', description: 'Close range only', mpCost: 0, staCost: 35, power: 240, hitCount: 1, cooldown: 2, effects: { description: 'Close range only' }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 85, ARTS: 70 } }, primarySubject: 'PHYSICAL_EDUCATION' },

  // ── Rare Magic Attacks (10) ──
  { name: 'Meteor', type: 'MAGIC', rarity: 'SKILL_RARE', description: 'Fire AoE + burn', mpCost: 45, staCost: 0, power: 250, hitCount: 1, cooldown: 3, effects: { description: 'Fire AoE + burn', aoe: true, burn: { damage: 5, turns: 3 } }, unlockConditions: { subjects: { MATHEMATICS: 80, SCIENCE: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Blizzard', type: 'MAGIC', rarity: 'SKILL_RARE', description: 'Ice AoE + freeze 20%', mpCost: 45, staCost: 0, power: 220, hitCount: 1, cooldown: 3, effects: { description: 'Ice AoE + freeze 20%', aoe: true, freeze: { chance: 20, turns: 2 } }, unlockConditions: { subjects: { MATHEMATICS: 80, SCIENCE: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Thunder Storm', type: 'MAGIC', rarity: 'SKILL_RARE', description: 'Electric + stun 25%', mpCost: 50, staCost: 0, power: 240, hitCount: 1, cooldown: 3, effects: { description: 'Electric + stun 25%', stun: { chance: 25, turns: 1 } }, unlockConditions: { subjects: { MATHEMATICS: 80, SCIENCE: 80 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Gravity Crush', type: 'MAGIC', rarity: 'SKILL_RARE', description: '-25% enemy SPD', mpCost: 45, staCost: 0, power: 230, hitCount: 1, cooldown: 2, effects: { description: '-25% enemy SPD', debuff: { stat: 'SPD', percentage: -25, turns: 3 } }, unlockConditions: { subjects: { MATHEMATICS: 85, SCIENCE: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Solar Beam', type: 'MAGIC', rarity: 'SKILL_RARE', description: 'Holy + blind', mpCost: 50, staCost: 0, power: 260, hitCount: 1, cooldown: 3, effects: { description: 'Holy + blind', blind: { chance: 30, turns: 2 } }, unlockConditions: { subjects: { MATHEMATICS: 80, ARTS: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Void Blast', type: 'MAGIC', rarity: 'SKILL_RARE', description: 'Dark + fear 20%', mpCost: 48, staCost: 0, power: 245, hitCount: 1, cooldown: 3, effects: { description: 'Dark + fear 20%', fear: { chance: 20, turns: 2 } }, unlockConditions: { subjects: { MATHEMATICS: 80, ARTS: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Disintegrate', type: 'MAGIC', rarity: 'SKILL_RARE', description: 'Ignore 30% DEF', mpCost: 55, staCost: 0, power: 280, hitCount: 1, cooldown: 3, effects: { description: 'Ignore 30% DEF', pierce: { percentage: 30 } }, unlockConditions: { subjects: { MATHEMATICS: 85, SCIENCE: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Mind Blast', type: 'MAGIC', rarity: 'SKILL_RARE', description: 'Psychic + confuse', mpCost: 42, staCost: 0, power: 220, hitCount: 1, cooldown: 2, effects: { description: 'Psychic + confuse', confuse: { chance: 25, turns: 2 } }, unlockConditions: { subjects: { MATHEMATICS: 80, LANGUAGES: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Soul Drain', type: 'MAGIC', rarity: 'SKILL_RARE', description: 'Heal 50% of damage', mpCost: 45, staCost: 0, power: 200, hitCount: 1, cooldown: 2, effects: { description: 'Heal 50% of damage', lifesteal: { percentage: 50 } }, unlockConditions: { subjects: { MATHEMATICS: 80, ARTS: 70 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Mana Storm', type: 'MAGIC', rarity: 'SKILL_RARE', description: 'Enemy -40 MP', mpCost: 50, staCost: 0, power: 230, hitCount: 1, cooldown: 3, effects: { description: 'Enemy -40 MP', manaBurn: { amount: 40 } }, unlockConditions: { subjects: { MATHEMATICS: 85, COMPUTER_SCIENCE: 75 } }, primarySubject: 'MATHEMATICS' },

  // ── Rare Support Skills (12) ──
  { name: 'Greater Heal', type: 'HEAL', rarity: 'SKILL_RARE', description: 'Restore 60% HP', mpCost: 40, staCost: 0, power: 0, hitCount: 1, cooldown: 2, effects: { description: 'Restore 60% HP', heal: { percentage: 60 } }, unlockConditions: { subjects: { ARTS: 80, SCIENCE: 75 } }, primarySubject: 'ARTS' },
  { name: 'Mass Heal', type: 'HEAL', rarity: 'SKILL_RARE', description: 'All allies 30% HP', mpCost: 50, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: 'All allies 30% HP', heal: { percentage: 30, aoe: true } }, unlockConditions: { subjects: { ARTS: 80, LANGUAGES: 75 } }, primarySubject: 'ARTS' },
  { name: 'Resurrection', type: 'HEAL', rarity: 'SKILL_RARE', description: 'Revive with 30% HP', mpCost: 80, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: 'Revive with 30% HP', revive: { percentage: 30 } }, unlockConditions: { subjects: { ARTS: 85, SCIENCE: 75 } }, primarySubject: 'ARTS' },
  { name: 'Berserk', type: 'BUFF', rarity: 'SKILL_RARE', description: '+40% ATK, -15% DEF, 3 turns', mpCost: 40, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: '+40% ATK, -15% DEF, 3 turns', buff: { stat: 'ATK', percentage: 40, turns: 3 }, selfDebuff: { stat: 'DEF', percentage: -15, turns: 3 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 80, MATHEMATICS: 70 } }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Invincibility', type: 'BUFF', rarity: 'SKILL_RARE', description: 'Immune to damage 1 turn', mpCost: 50, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: 'Immune to damage 1 turn', invincible: { turns: 1 } }, unlockConditions: { subjects: { HISTORY: 80, PHYSICAL_EDUCATION: 75 } }, primarySubject: 'HISTORY' },
  { name: 'Time Warp', type: 'BUFF', rarity: 'SKILL_RARE', description: 'Extra turn', mpCost: 60, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: 'Extra turn', extraTurn: true }, unlockConditions: { subjects: { MATHEMATICS: 85, SCIENCE: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Elemental Shield', type: 'BUFF', rarity: 'SKILL_RARE', description: 'Absorb 150 magic dmg', mpCost: 45, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: 'Absorb 150 magic dmg', shield: { amount: 150, type: 'magic' } }, unlockConditions: { subjects: { MATHEMATICS: 80, SCIENCE: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Doom', type: 'DEBUFF', rarity: 'SKILL_RARE', description: '-30% all stats, 3 turns', mpCost: 50, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: '-30% all stats, 3 turns', debuff: { stat: 'ALL', percentage: -30, turns: 3 } }, unlockConditions: { subjects: { MATHEMATICS: 80, ARTS: 75 } }, primarySubject: 'MATHEMATICS' },
  { name: 'Petrify', type: 'DEBUFF', rarity: 'SKILL_RARE', description: '35% enemy skip 2 turns', mpCost: 55, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: '35% enemy skip 2 turns', petrify: { chance: 35, turns: 2 } }, unlockConditions: { subjects: { SCIENCE: 80, ARTS: 75 } }, primarySubject: 'SCIENCE' },
  { name: 'Skill Seal', type: 'DEBUFF', rarity: 'SKILL_RARE', description: 'Cannot use skills 2 turns', mpCost: 45, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: 'Cannot use skills 2 turns', seal: { turns: 2 } }, unlockConditions: { subjects: { COMPUTER_SCIENCE: 80, LANGUAGES: 75 } }, primarySubject: 'COMPUTER_SCIENCE' },
  { name: 'Hellfire', type: 'STATUS', rarity: 'SKILL_RARE', description: 'Burn: 8% HP/turn, 3 turns', mpCost: 45, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: 'Burn: 8% HP/turn, 3 turns', burn: { damage: 8, turns: 3 } }, unlockConditions: { subjects: { SCIENCE: 80, MATHEMATICS: 75 } }, primarySubject: 'SCIENCE' },
  { name: 'Absolute Zero', type: 'STATUS', rarity: 'SKILL_RARE', description: '40% freeze, 3 turns', mpCost: 48, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: '40% freeze, 3 turns', freeze: { chance: 40, turns: 3 } }, unlockConditions: { subjects: { SCIENCE: 80, MATHEMATICS: 75 } }, primarySubject: 'SCIENCE' },

  // ──────────────── EPIC SKILLS (20) ────────────────

  // ── Epic Attack Skills (10) ──
  { name: 'Ultimate Strike', type: 'PHYSICAL', rarity: 'SKILL_EPIC', description: 'Guaranteed crit', mpCost: 0, staCost: 55, power: 320, hitCount: 1, cooldown: 3, effects: { description: 'Guaranteed crit', crit: { bonusChance: 100 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 85 }, battlesWon: 100, classRarity: 'CLASS_EPIC' }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Dragon Fist', type: 'PHYSICAL', rarity: 'SKILL_EPIC', description: 'Fire damage add', mpCost: 0, staCost: 60, power: 350, hitCount: 1, cooldown: 4, effects: { description: 'Fire damage add', fireDamage: true }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 85, ARTS: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Shadow Assault', type: 'PHYSICAL', rarity: 'SKILL_EPIC', description: '5 rapid strikes', mpCost: 0, staCost: 50, power: 100, hitCount: 5, cooldown: 3, effects: { description: '5 rapid strikes' }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 85, LANGUAGES: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Meteor Strike', type: 'HYBRID', rarity: 'SKILL_EPIC', description: 'Ignore all DEF', mpCost: 30, staCost: 40, power: 380, hitCount: 1, cooldown: 4, effects: { description: 'Ignore all DEF', pierce: { percentage: 100 } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 85, MATHEMATICS: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Apocalypse', type: 'MAGIC', rarity: 'SKILL_EPIC', description: 'All elements AoE', mpCost: 70, staCost: 0, power: 350, hitCount: 1, cooldown: 4, effects: { description: 'All elements AoE', aoe: true }, unlockConditions: { subjects: { MATHEMATICS: 85, SCIENCE: 85 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'MATHEMATICS' },
  { name: 'Black Hole', type: 'MAGIC', rarity: 'SKILL_EPIC', description: 'Pull + crush', mpCost: 65, staCost: 0, power: 330, hitCount: 1, cooldown: 4, effects: { description: 'Pull + crush', pull: true }, unlockConditions: { subjects: { MATHEMATICS: 85, SCIENCE: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'MATHEMATICS' },
  { name: 'Divine Judgment', type: 'MAGIC', rarity: 'SKILL_EPIC', description: 'Holy + purify', mpCost: 70, staCost: 0, power: 360, hitCount: 1, cooldown: 4, effects: { description: 'Holy + purify', purify: true }, unlockConditions: { subjects: { MATHEMATICS: 85, ARTS: 85 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'MATHEMATICS' },
  { name: 'Chaos Storm', type: 'MAGIC', rarity: 'SKILL_EPIC', description: 'Random status effects AoE', mpCost: 75, staCost: 0, power: 300, hitCount: 1, cooldown: 4, effects: { description: 'Random status effects AoE', aoe: true, randomStatus: true }, unlockConditions: { subjects: { MATHEMATICS: 85, SCIENCE: 85 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'MATHEMATICS' },
  { name: 'Psychic Destruction', type: 'MAGIC', rarity: 'SKILL_EPIC', description: 'Ignore magic DEF', mpCost: 65, staCost: 0, power: 340, hitCount: 1, cooldown: 3, effects: { description: 'Ignore magic DEF', pierce: { percentage: 100, type: 'magic' } }, unlockConditions: { subjects: { MATHEMATICS: 85, LANGUAGES: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'MATHEMATICS' },
  { name: 'Elemental Fury', type: 'HYBRID', rarity: 'SKILL_EPIC', description: '4 elements', mpCost: 40, staCost: 40, power: 100, hitCount: 4, cooldown: 4, effects: { description: '4 elemental hits' }, unlockConditions: { subjects: { MATHEMATICS: 80, SCIENCE: 80, PHYSICAL_EDUCATION: 75 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'MATHEMATICS' },

  // ── Epic Support Skills (10) ──
  { name: 'Full Restore', type: 'HEAL', rarity: 'SKILL_EPIC', description: 'Restore 100% HP', mpCost: 70, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: 'Restore 100% HP', heal: { percentage: 100 } }, unlockConditions: { subjects: { ARTS: 85, SCIENCE: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'ARTS' },
  { name: 'Phoenix Rebirth', type: 'HEAL', rarity: 'SKILL_EPIC', description: 'Auto-revive 50% HP', mpCost: 100, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: 'Auto-revive 50% HP', autoRevive: { percentage: 50 } }, unlockConditions: { subjects: { ARTS: 85 }, achievements: 30, classRarity: 'CLASS_EPIC' }, primarySubject: 'ARTS' },
  { name: 'Awakening', type: 'BUFF', rarity: 'SKILL_EPIC', description: '+50% all stats, 2 turns', mpCost: 60, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: '+50% all stats, 2 turns', buff: { stat: 'ALL', percentage: 50, turns: 2 } }, unlockConditions: { subjects: { MATHEMATICS: 80, SCIENCE: 80, PHYSICAL_EDUCATION: 80, LANGUAGES: 80, HISTORY: 80, ARTS: 80, COMPUTER_SCIENCE: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: null },
  { name: 'Divine Protection', type: 'BUFF', rarity: 'SKILL_EPIC', description: 'Immune 2 turns', mpCost: 70, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: 'Immune 2 turns', invincible: { turns: 2 } }, unlockConditions: { subjects: { HISTORY: 85, ARTS: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'HISTORY' },
  { name: 'Limit Break', type: 'BUFF', rarity: 'SKILL_EPIC', description: 'Double next attack', mpCost: 50, staCost: 0, power: 0, hitCount: 1, cooldown: 3, effects: { description: 'Double next attack', nextAttackMultiplier: 2 }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 85, MATHEMATICS: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Soul Crush', type: 'DEBUFF', rarity: 'SKILL_EPIC', description: '-50% enemy ATK, 3 turns', mpCost: 60, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: '-50% enemy ATK, 3 turns', debuff: { stat: 'ATK', percentage: -50, turns: 3 } }, unlockConditions: { subjects: { MATHEMATICS: 85, ARTS: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'MATHEMATICS' },
  { name: 'Time Stop', type: 'DEBUFF', rarity: 'SKILL_EPIC', description: 'Enemy skip 2 turns', mpCost: 80, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: 'Enemy skip 2 turns', skipTurn: { turns: 2 } }, unlockConditions: { subjects: { MATHEMATICS: 90, SCIENCE: 85 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'MATHEMATICS' },
  { name: 'System Shutdown', type: 'DEBUFF', rarity: 'SKILL_EPIC', description: 'All skills disabled 2 turns', mpCost: 65, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: 'All skills disabled 2 turns', seal: { turns: 2, all: true } }, unlockConditions: { subjects: { COMPUTER_SCIENCE: 85, MATHEMATICS: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'COMPUTER_SCIENCE' },
  { name: 'Perfect Dodge', type: 'UTILITY', rarity: 'SKILL_EPIC', description: 'Dodge all 2 turns', mpCost: 40, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: 'Dodge all 2 turns', dodge: { turns: 2 } }, unlockConditions: { subjects: { LANGUAGES: 85, PHYSICAL_EDUCATION: 80 }, classRarity: 'CLASS_EPIC' }, primarySubject: 'LANGUAGES' },
  { name: 'Mana Surge', type: 'UTILITY', rarity: 'SKILL_EPIC', description: 'Full MP restore', mpCost: 0, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: 'Full MP restore', restore: { mp: 'full' } }, unlockConditions: { subjects: { MATHEMATICS: 85 }, achievements: 50, classRarity: 'CLASS_EPIC' }, primarySubject: 'MATHEMATICS' },

  // ──────────────── LEGENDARY SKILLS (10) ────────────────

  { name: 'World Breaker', type: 'PHYSICAL', rarity: 'SKILL_LEGENDARY', description: 'Destroy all buffs', mpCost: 0, staCost: 80, power: 450, hitCount: 1, cooldown: 5, effects: { description: 'Destroy all buffs', dispel: { all: true } }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 90 }, classRarity: 'CLASS_LEGENDARY' }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Infinity Blade', type: 'PHYSICAL', rarity: 'SKILL_LEGENDARY', description: 'Hits until miss', mpCost: 0, staCost: 70, power: 400, hitCount: 1, cooldown: 5, effects: { description: 'Hits until miss, +50% per hit', infiniteHits: true }, unlockConditions: { subjects: { PHYSICAL_EDUCATION: 90 }, classRarity: 'CLASS_LEGENDARY' }, primarySubject: 'PHYSICAL_EDUCATION' },
  { name: 'Big Bang', type: 'MAGIC', rarity: 'SKILL_LEGENDARY', description: 'Universe explosion', mpCost: 90, staCost: 0, power: 450, hitCount: 1, cooldown: 5, effects: { description: 'Universe explosion AoE', aoe: true }, unlockConditions: { subjects: { MATHEMATICS: 90, SCIENCE: 90 }, classRarity: 'CLASS_LEGENDARY' }, primarySubject: 'MATHEMATICS' },
  { name: 'Absolute Zero Point', type: 'MAGIC', rarity: 'SKILL_LEGENDARY', description: '80% freeze 3 turns', mpCost: 85, staCost: 0, power: 420, hitCount: 1, cooldown: 5, effects: { description: '80% freeze 3 turns', freeze: { chance: 80, turns: 3 } }, unlockConditions: { subjects: { SCIENCE: 90 }, classRarity: 'CLASS_LEGENDARY' }, primarySubject: 'SCIENCE' },
  { name: 'Divine Intervention', type: 'HEAL', rarity: 'SKILL_LEGENDARY', description: 'Full heal + cleanse all allies', mpCost: 100, staCost: 0, power: 0, hitCount: 1, cooldown: 5, effects: { description: 'Full heal + cleanse all allies', heal: { percentage: 100, aoe: true }, cleanse: { all: true } }, unlockConditions: { subjects: { ARTS: 90 }, classRarity: 'CLASS_LEGENDARY' }, primarySubject: 'ARTS' },
  { name: 'Transcendence', type: 'BUFF', rarity: 'SKILL_LEGENDARY', description: '+100% all stats 1 turn', mpCost: 80, staCost: 0, power: 0, hitCount: 1, cooldown: 5, effects: { description: '+100% all stats 1 turn', buff: { stat: 'ALL', percentage: 100, turns: 1 } }, unlockConditions: { subjects: { MATHEMATICS: 85, SCIENCE: 85, PHYSICAL_EDUCATION: 85, LANGUAGES: 85, HISTORY: 85, ARTS: 85, COMPUTER_SCIENCE: 85 }, classRarity: 'CLASS_LEGENDARY' }, primarySubject: null },
  { name: 'Oblivion', type: 'DEBUFF', rarity: 'SKILL_LEGENDARY', description: '-80% all enemy stats 2 turns', mpCost: 90, staCost: 0, power: 0, hitCount: 1, cooldown: 5, effects: { description: '-80% all enemy stats 2 turns', debuff: { stat: 'ALL', percentage: -80, turns: 2 } }, unlockConditions: { subjects: { MATHEMATICS: 90 }, classRarity: 'CLASS_LEGENDARY' }, primarySubject: 'MATHEMATICS' },
  { name: 'Fate Manipulation', type: 'UTILITY', rarity: 'SKILL_LEGENDARY', description: 'Reroll all enemy attacks', mpCost: 70, staCost: 0, power: 0, hitCount: 1, cooldown: 4, effects: { description: 'Reroll all enemy attacks', reroll: true }, unlockConditions: { subjects: { MATHEMATICS: 90, HISTORY: 85 }, classRarity: 'CLASS_LEGENDARY' }, primarySubject: 'MATHEMATICS' },
  { name: "Dragon's Wrath", type: 'HYBRID', rarity: 'SKILL_LEGENDARY', description: 'Transform attack', mpCost: 50, staCost: 50, power: 480, hitCount: 1, cooldown: 5, effects: { description: 'Transform attack', transform: true }, unlockConditions: { exclusiveClass: 'Dragon Knight', classRarity: 'CLASS_LEGENDARY' }, primarySubject: null },
  { name: 'Shadow Army', type: 'MAGIC', rarity: 'SKILL_LEGENDARY', description: 'Summon 3 shadows', mpCost: 85, staCost: 0, power: 0, hitCount: 1, cooldown: 5, effects: { description: 'Summon 3 shadows', summon: { count: 3, type: 'shadow' } }, unlockConditions: { classRarity: 'CLASS_LEGENDARY' }, primarySubject: null },

  // ──────────────── MYTHIC SKILLS (6) ────────────────

  { name: 'Supreme Magic: Reality Warp', type: 'ULTIMATE', rarity: 'SKILL_MYTHIC', description: 'Bend reality itself to deal true damage', mpCost: 100, staCost: 0, power: 600, hitCount: 1, cooldown: 6, effects: { description: 'Ignore ALL defenses', trueDamage: true }, unlockConditions: { exclusiveClass: 'Supreme Mage' }, primarySubject: 'MATHEMATICS', exclusiveClassName: 'Supreme Mage' },
  { name: 'Admin Access', type: 'ULTIMATE', rarity: 'SKILL_MYTHIC', description: 'Hack into enemy\'s mind', mpCost: 90, staCost: 0, power: 0, hitCount: 1, cooldown: 6, effects: { description: 'Control enemy 1 turn', mindControl: { turns: 1 } }, unlockConditions: { exclusiveClass: 'Digital God' }, primarySubject: 'COMPUTER_SCIENCE', exclusiveClassName: 'Digital God' },
  { name: 'One Man Army', type: 'ULTIMATE', rarity: 'SKILL_MYTHIC', description: 'Unmatched combat prowess', mpCost: 0, staCost: 100, power: 200, hitCount: 5, cooldown: 6, effects: { description: 'Attack all 5 times', aoe: true }, unlockConditions: { exclusiveClass: 'Absolute Warrior' }, primarySubject: 'PHYSICAL_EDUCATION', exclusiveClassName: 'Absolute Warrior' },
  { name: 'Time Paradox', type: 'ULTIMATE', rarity: 'SKILL_MYTHIC', description: 'Rewrite battle history', mpCost: 100, staCost: 0, power: 0, hitCount: 1, cooldown: 6, effects: { description: 'Undo last 3 turns', timeRewind: { turns: 3 } }, unlockConditions: { exclusiveClass: 'Time Lord' }, primarySubject: 'MATHEMATICS', exclusiveClassName: 'Time Lord' },
  { name: 'Arise', type: 'ULTIMATE', rarity: 'SKILL_MYTHIC', description: 'Command the dead', mpCost: 100, staCost: 0, power: 0, hitCount: 1, cooldown: 6, effects: { description: 'Revive enemies as allies', necromancy: true }, unlockConditions: { exclusiveClass: 'Shadow Monarch' }, primarySubject: null, exclusiveClassName: 'Shadow Monarch' },
  { name: 'Infinite Engine', type: 'ULTIMATE', rarity: 'SKILL_MYTHIC', description: 'Perpetual motion achieved', mpCost: 50, staCost: 0, power: 0, hitCount: 1, cooldown: 5, effects: { description: 'No costs for 5 turns', freeCast: { turns: 5 } }, unlockConditions: { exclusiveClass: 'Clockwork God' }, primarySubject: 'SCIENCE', exclusiveClassName: 'Clockwork God' },
];

// ═══════════════════════════════════════════════════════════════
// Seed function
// ═══════════════════════════════════════════════════════════════

export async function seedSkills(prisma: PrismaClient) {
  console.log(`Seeding ${SKILLS.length} skills...`);

  for (const s of SKILLS) {
    await prisma.skill.upsert({
      where: { name: s.name },
      update: {
        type: s.type,
        rarity: s.rarity,
        description: s.description,
        mpCost: s.mpCost,
        staCost: s.staCost,
        power: s.power,
        hitCount: s.hitCount,
        cooldown: s.cooldown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        effects: s.effects as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        unlockConditions: s.unlockConditions as any,
        primarySubject: s.primarySubject,
      },
      create: {
        name: s.name,
        type: s.type,
        rarity: s.rarity,
        description: s.description,
        mpCost: s.mpCost,
        staCost: s.staCost,
        power: s.power,
        hitCount: s.hitCount,
        cooldown: s.cooldown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        effects: s.effects as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        unlockConditions: s.unlockConditions as any,
        primarySubject: s.primarySubject,
      },
    });
  }

  // Second pass: set exclusive class IDs for Mythic skills
  for (const s of SKILLS) {
    if (s.exclusiveClassName) {
      const charClass = await prisma.characterClass.findUnique({
        where: { name: s.exclusiveClassName },
      });
      if (charClass) {
        await prisma.skill.update({
          where: { name: s.name },
          data: { exclusiveClassId: charClass.id },
        });
      }
    }
  }

  console.log(`Seeded ${SKILLS.length} skills.`);
}
