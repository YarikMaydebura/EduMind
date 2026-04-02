import type { BattleAttributes, BattleRewardConfig, SubjectConversion } from '../types/battle.types';

export const BASE_STATS: BattleAttributes = {
  HP: 100,
  MP: 50,
  STA: 50,
  ATK: 10,
  DEF: 10,
  SPD: 10,
  LCK: 5,
};

export const MAX_STATS: BattleAttributes = {
  HP: 999,
  MP: 500,
  STA: 500,
  ATK: 200,
  DEF: 200,
  SPD: 150,
  LCK: 100,
};

export const SUBJECT_CONVERSIONS: SubjectConversion[] = [
  {
    subject: 'MATHEMATICS',
    conversions: [
      { attribute: 'MP', multiplier: 0.5 },
      { attribute: 'ATK', multiplier: 0.15, type: 'magic' },
      { attribute: 'LCK', multiplier: 0.05 },
    ],
  },
  {
    subject: 'SCIENCE',
    conversions: [
      { attribute: 'MP', multiplier: 0.3 },
      { attribute: 'DEF', multiplier: 0.2 },
    ],
  },
  {
    subject: 'PHYSICAL_EDUCATION',
    conversions: [
      { attribute: 'HP', multiplier: 0.8 },
      { attribute: 'STA', multiplier: 0.5 },
      { attribute: 'ATK', multiplier: 0.2, type: 'physical' },
      { attribute: 'DEF', multiplier: 0.15 },
    ],
  },
  {
    subject: 'LANGUAGES',
    conversions: [
      { attribute: 'SPD', multiplier: 0.3 },
      { attribute: 'MP', multiplier: 0.2 },
    ],
  },
  {
    subject: 'SOCIAL_STUDIES',
    conversions: [
      { attribute: 'DEF', multiplier: 0.35 },
      { attribute: 'HP', multiplier: 0.25 },
    ],
  },
  {
    subject: 'ARTS',
    conversions: [
      { attribute: 'MP', multiplier: 0.35 },
    ],
  },
  {
    subject: 'COMPUTER_SCIENCE',
    conversions: [
      { attribute: 'MP', multiplier: 0.4 },
      { attribute: 'SPD', multiplier: 0.15 },
      { attribute: 'LCK', multiplier: 0.1 },
    ],
  },
];

export const BATTLE_LIMITS = {
  pvp: { maxPerDay: 5, cooldownMinutes: 5, minLevel: 5 },
  dungeon: { maxPerDay: 10, cooldownMinutes: 0, minLevel: 5 },
  friendly: { maxPerDay: Infinity, cooldownMinutes: 1, minLevel: 5 },
} as const;

export const MAX_TURNS = 30;
export const MP_REGEN_PER_TURN = 5;
export const STA_REGEN_PER_TURN = 5;
export const DEFEND_DEF_BONUS = 0.5;
export const DEFEND_MP_RECOVERY = 10;
export const DEFEND_STA_RECOVERY = 10;

export const BATTLE_REWARDS: Record<string, BattleRewardConfig> = {
  PVP: { winXP: 75, winKP: 75, loseXP: 20, loseKP: 20, drawXP: 35, drawKP: 35 },
  PVE_DUNGEON: { winXP: 50, winKP: 50, loseXP: 15, loseKP: 10, drawXP: 25, drawKP: 20 },
  FRIENDLY: { winXP: 25, winKP: 25, loseXP: 10, loseKP: 10, drawXP: 15, drawKP: 15 },
  BOSS_RAID: { winXP: 150, winKP: 100, loseXP: 30, loseKP: 20, drawXP: 50, drawKP: 40 },
};

export const STATUS_EFFECT_DAMAGE: Record<string, number> = {
  BURN: 0.05,    // 5% max HP per turn
  POISON: 0.03,  // 3% max HP per turn
};

export const FREEZE_SKIP_CHANCE = 0.25;  // 25% chance to skip turn when frozen
export const SHOCK_SPD_REDUCTION = 0.20; // -20% SPD when shocked
