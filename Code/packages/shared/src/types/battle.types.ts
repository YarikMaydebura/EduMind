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

// ─── Battle Engine Types ─────────────────────────────────────────────────────

export type BattleActionType = 'ATTACK' | 'SKILL' | 'DEFEND' | 'ITEM';
export type BattleResultStatus = 'IN_PROGRESS' | 'P1_WIN' | 'P2_WIN' | 'DRAW';
export type StatusEffectType = 'BURN' | 'POISON' | 'FREEZE' | 'SHOCK' | 'BUFF' | 'DEBUFF';

export interface EquippedSkillInfo {
  id: string;
  name: string;
  type: SkillType;
  mpCost: number;
  staCost: number;
  power: number;
  hitCount: number;
  cooldown: number;
  effects: Record<string, unknown>;
}

export interface StatusEffect {
  type: StatusEffectType;
  stat?: string;
  value: number;
  turnsRemaining: number;
  sourceSkill?: string;
}

export interface FighterState {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  sta: number;
  maxSta: number;
  atk: number;
  def: number;
  spd: number;
  lck: number;
  skills: EquippedSkillInfo[];
  cooldowns: Record<string, number>;
  statusEffects: StatusEffect[];
  isDefending: boolean;
}

export interface BattleLogEntry {
  turn: number;
  actorId: string;
  action: BattleActionType;
  skillId?: string;
  skillName?: string;
  damage?: number;
  healing?: number;
  isCrit?: boolean;
  isDodged?: boolean;
  statusApplied?: string;
  message: string;
}

export interface BattleState {
  turn: number;
  maxTurns: number;
  player1: FighterState;
  player2: FighterState;
  log: BattleLogEntry[];
  status: BattleResultStatus;
  currentActorId: string | null;
}

export interface BattleAction {
  type: BattleActionType;
  skillId?: string;
}

export interface BattleRewardConfig {
  winXP: number;
  winKP: number;
  loseXP: number;
  loseKP: number;
  drawXP: number;
  drawKP: number;
}

export interface BattleRewards {
  player1XP: number;
  player1KP: number;
  player2XP: number;
  player2KP: number;
}
