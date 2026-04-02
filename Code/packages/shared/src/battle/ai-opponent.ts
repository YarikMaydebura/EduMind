import { BASE_STATS } from '../constants/battle.constants';
import type { BattleAction, EquippedSkillInfo, FighterState } from '../types/battle.types';

/**
 * Generate an AI opponent with stats scaled by level.
 */
export function generateAiOpponent(
  level: number,
  difficulty: 'EASY' | 'NORMAL' | 'HARD' = 'NORMAL',
  name?: string,
): FighterState {
  const diffMultiplier = difficulty === 'EASY' ? 0.7 : difficulty === 'HARD' ? 1.3 : 1.0;
  const levelMultiplier = 1 + (level - 1) * 0.15;
  const scale = diffMultiplier * levelMultiplier;

  const hp = Math.floor(BASE_STATS.HP * scale);
  const mp = Math.floor(BASE_STATS.MP * scale);
  const sta = Math.floor(BASE_STATS.STA * scale);

  // Generate basic AI skills
  const skills: EquippedSkillInfo[] = [
    {
      id: 'ai_attack',
      name: 'Strike',
      type: 'PHYSICAL',
      mpCost: 0,
      staCost: 15,
      power: 120,
      hitCount: 1,
      cooldown: 0,
      effects: { description: 'A basic strike' },
    },
    {
      id: 'ai_magic',
      name: 'Energy Blast',
      type: 'MAGIC',
      mpCost: 20,
      staCost: 0,
      power: 150,
      hitCount: 1,
      cooldown: 1,
      effects: { description: 'A magic energy blast' },
    },
  ];

  // Higher level AIs get more skills
  if (level >= 10) {
    skills.push({
      id: 'ai_heal',
      name: 'Recover',
      type: 'HEAL',
      mpCost: 25,
      staCost: 0,
      power: 0,
      hitCount: 1,
      cooldown: 3,
      effects: { description: 'Recover HP', heal: { percentage: 25 } },
    });
  }

  if (level >= 20) {
    skills.push({
      id: 'ai_power',
      name: 'Power Up',
      type: 'BUFF',
      mpCost: 20,
      staCost: 0,
      power: 0,
      hitCount: 1,
      cooldown: 4,
      effects: { description: 'Boost ATK', buff: { stat: 'ATK', percentage: 20, turns: 3 } },
    });
  }

  return {
    id: `ai_${level}_${Date.now()}`,
    name: name ?? `Lvl ${level} Opponent`,
    hp,
    maxHp: hp,
    mp,
    maxMp: mp,
    sta,
    maxSta: sta,
    atk: Math.floor(BASE_STATS.ATK * scale),
    def: Math.floor(BASE_STATS.DEF * scale),
    spd: Math.floor(BASE_STATS.SPD * scale),
    lck: Math.floor(BASE_STATS.LCK * scale),
    skills,
    cooldowns: {},
    statusEffects: [],
    isDefending: false,
  };
}

/**
 * Select an AI action based on simple heuristics.
 */
export function selectAiAction(
  ai: FighterState,
  _player: FighterState,
): BattleAction {
  // 10% chance to defend randomly
  if (Math.random() < 0.1) {
    return { type: 'DEFEND' };
  }

  // If HP < 30% and has heal skill available → heal
  if (ai.hp < ai.maxHp * 0.3) {
    const healSkill = ai.skills.find(
      (s) => s.type === 'HEAL' && ai.mp >= s.mpCost && (ai.cooldowns[s.id] ?? 0) === 0,
    );
    if (healSkill) {
      return { type: 'SKILL', skillId: healSkill.id };
    }
  }

  // If has buff skill and no active buff → use buff
  const hasBuff = ai.statusEffects.some((e) => e.type === 'BUFF');
  if (!hasBuff) {
    const buffSkill = ai.skills.find(
      (s) => s.type === 'BUFF' && ai.mp >= s.mpCost && (ai.cooldowns[s.id] ?? 0) === 0,
    );
    if (buffSkill) {
      return { type: 'SKILL', skillId: buffSkill.id };
    }
  }

  // Use strongest available damage skill
  const damageSkills = ai.skills
    .filter(
      (s) =>
        ['PHYSICAL', 'MAGIC', 'HYBRID', 'ULTIMATE'].includes(s.type) &&
        ai.mp >= s.mpCost &&
        ai.sta >= s.staCost &&
        (ai.cooldowns[s.id] ?? 0) === 0,
    )
    .sort((a, b) => b.power * b.hitCount - a.power * a.hitCount);

  if (damageSkills.length > 0) {
    return { type: 'SKILL', skillId: damageSkills[0]!.id };
  }

  // Default: basic attack
  return { type: 'ATTACK' };
}
