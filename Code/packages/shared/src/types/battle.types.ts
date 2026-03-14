export type BattleTheme = 'FANTASY' | 'CYBERPUNK' | 'MILITARY' | 'SCI_FI' | 'ANIME' | 'STEAMPUNK';

export type ClassRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';

export type SkillRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';

export type SkillType =
  | 'PHYSICAL'
  | 'MAGIC'
  | 'HYBRID'
  | 'HEAL'
  | 'BUFF'
  | 'DEBUFF'
  | 'STATUS'
  | 'UTILITY'
  | 'ULTIMATE';

export type BattleType = 'PVP' | 'PVE_DUNGEON' | 'FRIENDLY' | 'BOSS_RAID';

export type Attribute = 'HP' | 'MP' | 'STA' | 'ATK' | 'DEF' | 'SPD' | 'LCK';

export interface BattleAttributes {
  HP: number;
  MP: number;
  STA: number;
  ATK: number;
  DEF: number;
  SPD: number;
  LCK: number;
}

export interface DerivedStats {
  critChance: number;
  critDamage: number;
  dodgeChance: number;
  damageReduction: number;
}

export interface SubjectConversion {
  subject: string;
  conversions: {
    attribute: string;
    multiplier: number;
    type?: 'magic' | 'physical';
  }[];
}
