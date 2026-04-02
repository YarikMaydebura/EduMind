import {
  BATTLE_REWARDS,
  DEFEND_DEF_BONUS,
  DEFEND_MP_RECOVERY,
  DEFEND_STA_RECOVERY,
  FREEZE_SKIP_CHANCE,
  MAX_TURNS,
  MP_REGEN_PER_TURN,
  SHOCK_SPD_REDUCTION,
  STA_REGEN_PER_TURN,
  STATUS_EFFECT_DAMAGE,
} from '../constants/battle.constants';
import type {
  BattleAction,
  BattleLogEntry,
  BattleRewards,
  BattleState,
  EquippedSkillInfo,
  FighterState,
  StatusEffect,
} from '../types/battle.types';
import { calculateDamage, calculateDerivedStats } from './stats';

// ─── Initialize Battle ───────────────────────────────────────────────────────

export function initBattle(
  p1: FighterState,
  p2: FighterState,
  maxTurns: number = MAX_TURNS,
): BattleState {
  return {
    turn: 1,
    maxTurns,
    player1: { ...p1, cooldowns: {}, statusEffects: [], isDefending: false },
    player2: { ...p2, cooldowns: {}, statusEffects: [], isDefending: false },
    log: [],
    status: 'IN_PROGRESS',
    currentActorId: null,
  };
}

// ─── Turn Order ──────────────────────────────────────────────────────────────

export function determineTurnOrder(
  p1: FighterState,
  p2: FighterState,
): [FighterState, FighterState] {
  const p1Spd = getEffectiveStat(p1, 'spd');
  const p2Spd = getEffectiveStat(p2, 'spd');

  if (p1Spd > p2Spd) return [p1, p2];
  if (p2Spd > p1Spd) return [p2, p1];
  return Math.random() < 0.5 ? [p1, p2] : [p2, p1];
}

function getEffectiveStat(fighter: FighterState, stat: 'atk' | 'def' | 'spd'): number {
  let value = fighter[stat];

  // Apply defending bonus
  if (stat === 'def' && fighter.isDefending) {
    value = Math.floor(value * (1 + DEFEND_DEF_BONUS));
  }

  // Apply buff/debuff status effects
  for (const effect of fighter.statusEffects) {
    if (effect.stat === stat.toUpperCase()) {
      if (effect.type === 'BUFF') {
        value = Math.floor(value * (1 + effect.value));
      } else if (effect.type === 'DEBUFF') {
        value = Math.floor(value * (1 - effect.value));
      }
    }
  }

  // Apply shock SPD reduction
  if (stat === 'spd' && fighter.statusEffects.some((e) => e.type === 'SHOCK')) {
    value = Math.floor(value * (1 - SHOCK_SPD_REDUCTION));
  }

  return Math.max(1, value);
}

// ─── Process Full Turn ───────────────────────────────────────────────────────

export function processTurn(
  state: BattleState,
  p1Action: BattleAction,
  p2Action: BattleAction,
): BattleState {
  if (state.status !== 'IN_PROGRESS') return state;

  let newState = { ...state, log: [...state.log] };

  // Reset defending status
  newState.player1 = { ...newState.player1, isDefending: false };
  newState.player2 = { ...newState.player2, isDefending: false };

  // Determine turn order
  const [first, second] = determineTurnOrder(newState.player1, newState.player2);
  const firstAction = first.id === newState.player1.id ? p1Action : p2Action;
  const secondAction = first.id === newState.player1.id ? p2Action : p1Action;

  // Check freeze skip for first actor
  const firstFrozen = checkFreezeSkip(first, state.turn, newState.log);
  if (!firstFrozen) {
    newState = processAction(newState, first.id, firstAction);
  }

  // Check if battle ended after first action
  newState.status = checkWinCondition(newState);
  if (newState.status !== 'IN_PROGRESS') {
    return newState;
  }

  // Check freeze skip for second actor
  const secondFighter = first.id === newState.player1.id ? newState.player2 : newState.player1;
  const secondFrozen = checkFreezeSkip(secondFighter, state.turn, newState.log);
  if (!secondFrozen) {
    newState = processAction(newState, second.id, secondAction);
  }

  // End of turn processing
  newState = endTurnProcessing(newState);

  // Check win condition again
  newState.status = checkWinCondition(newState);

  // Advance turn
  newState.turn += 1;
  if (newState.turn > newState.maxTurns && newState.status === 'IN_PROGRESS') {
    newState.status = 'DRAW';
  }

  return newState;
}

function checkFreezeSkip(fighter: FighterState, turn: number, log: BattleLogEntry[]): boolean {
  const isFrozen = fighter.statusEffects.some((e) => e.type === 'FREEZE');
  if (isFrozen && Math.random() < FREEZE_SKIP_CHANCE) {
    log.push({
      turn,
      actorId: fighter.id,
      action: 'ATTACK',
      message: `${fighter.name} is frozen and cannot act!`,
    });
    return true;
  }
  return false;
}

// ─── Process Single Action ───────────────────────────────────────────────────

function processAction(
  state: BattleState,
  actorId: string,
  action: BattleAction,
): BattleState {
  const isP1 = actorId === state.player1.id;
  const attacker = isP1 ? { ...state.player1 } : { ...state.player2 };
  const defender = isP1 ? { ...state.player2 } : { ...state.player1 };

  let logEntry: BattleLogEntry;

  switch (action.type) {
    case 'ATTACK':
      logEntry = processBasicAttack(attacker, defender, state.turn);
      break;
    case 'SKILL':
      logEntry = processSkillUse(attacker, defender, action.skillId ?? '', state.turn);
      break;
    case 'DEFEND':
      logEntry = processDefend(attacker, state.turn);
      break;
    default:
      logEntry = {
        turn: state.turn,
        actorId,
        action: 'ATTACK',
        message: `${attacker.name} does nothing.`,
      };
  }

  const newState = { ...state, log: [...state.log, logEntry] };
  if (isP1) {
    newState.player1 = attacker;
    newState.player2 = defender;
  } else {
    newState.player1 = defender;
    newState.player2 = attacker;
  }

  return newState;
}

// ─── Basic Attack ────────────────────────────────────────────────────────────

function processBasicAttack(
  attacker: FighterState,
  defender: FighterState,
  turn: number,
): BattleLogEntry {
  const derived = calculateDerivedStats({
    HP: attacker.maxHp, MP: attacker.maxMp, STA: attacker.maxSta,
    ATK: attacker.atk, DEF: attacker.def, SPD: attacker.spd, LCK: attacker.lck,
  });
  const defDerived = calculateDerivedStats({
    HP: defender.maxHp, MP: defender.maxMp, STA: defender.maxSta,
    ATK: defender.atk, DEF: defender.def, SPD: defender.spd, LCK: defender.lck,
  });

  // Dodge check
  if (Math.random() * 100 < defDerived.dodgeChance) {
    return {
      turn, actorId: attacker.id, action: 'ATTACK', isDodged: true, damage: 0,
      message: `${attacker.name} attacks but ${defender.name} dodges!`,
    };
  }

  const isCrit = Math.random() * 100 < derived.critChance;
  const effectiveDef = getEffectiveStat(defender, 'def');
  const effectiveAtk = getEffectiveStat(attacker, 'atk');
  const damage = calculateDamage(effectiveAtk, effectiveDef, 100, isCrit, derived.critDamage);

  defender.hp = Math.max(0, defender.hp - damage);

  return {
    turn, actorId: attacker.id, action: 'ATTACK', damage, isCrit,
    message: `${attacker.name} attacks for ${damage} damage${isCrit ? ' (CRITICAL!)' : ''}`,
  };
}

// ─── Skill Use ───────────────────────────────────────────────────────────────

function processSkillUse(
  attacker: FighterState,
  defender: FighterState,
  skillId: string,
  turn: number,
): BattleLogEntry {
  const skill = attacker.skills.find((s) => s.id === skillId);
  if (!skill) {
    return { turn, actorId: attacker.id, action: 'SKILL', message: `${attacker.name} tries to use an unknown skill!` };
  }

  // Check cooldown
  if ((attacker.cooldowns[skillId] ?? 0) > 0) {
    return { turn, actorId: attacker.id, action: 'SKILL', skillName: skill.name, message: `${skill.name} is on cooldown!` };
  }

  // Check resources
  if (attacker.mp < skill.mpCost || attacker.sta < skill.staCost) {
    return { turn, actorId: attacker.id, action: 'SKILL', skillName: skill.name, message: `Not enough resources for ${skill.name}!` };
  }

  // Deduct resources
  attacker.mp -= skill.mpCost;
  attacker.sta -= skill.staCost;

  // Set cooldown
  if (skill.cooldown > 0) {
    attacker.cooldowns[skillId] = skill.cooldown;
  }

  // Handle different skill types
  const derived = calculateDerivedStats({
    HP: attacker.maxHp, MP: attacker.maxMp, STA: attacker.maxSta,
    ATK: attacker.atk, DEF: attacker.def, SPD: attacker.spd, LCK: attacker.lck,
  });

  if (skill.type === 'HEAL') {
    return processHealSkill(attacker, skill, turn, derived);
  }

  if (skill.type === 'BUFF') {
    return processBuffSkill(attacker, skill, turn);
  }

  if (skill.type === 'DEBUFF' || skill.type === 'STATUS') {
    return processDebuffSkill(attacker, defender, skill, turn);
  }

  // Damage skills (PHYSICAL, MAGIC, HYBRID, ULTIMATE)
  return processDamageSkill(attacker, defender, skill, turn, derived);
}

function processDamageSkill(
  attacker: FighterState,
  defender: FighterState,
  skill: EquippedSkillInfo,
  turn: number,
  derived: ReturnType<typeof calculateDerivedStats>,
): BattleLogEntry {
  const defDerived = calculateDerivedStats({
    HP: defender.maxHp, MP: defender.maxMp, STA: defender.maxSta,
    ATK: defender.atk, DEF: defender.def, SPD: defender.spd, LCK: defender.lck,
  });

  // Dodge check
  if (Math.random() * 100 < defDerived.dodgeChance) {
    return {
      turn, actorId: attacker.id, action: 'SKILL', skillId: skill.id, skillName: skill.name,
      isDodged: true, damage: 0,
      message: `${attacker.name} uses ${skill.name} but ${defender.name} dodges!`,
    };
  }

  const isCrit = Math.random() * 100 < derived.critChance;
  const effectiveAtk = getEffectiveStat(attacker, 'atk');
  const effectiveDef = getEffectiveStat(defender, 'def');

  let totalDamage = 0;
  for (let i = 0; i < skill.hitCount; i++) {
    totalDamage += calculateDamage(effectiveAtk, effectiveDef, skill.power, isCrit && i === 0, derived.critDamage);
  }

  defender.hp = Math.max(0, defender.hp - totalDamage);

  // Check for status effect application
  let statusApplied: string | undefined;
  const effects = skill.effects as Record<string, unknown>;
  if (effects.burn && typeof effects.burn === 'object') {
    const burnChance = ((effects.burn as Record<string, number>).chance ?? 0) / 100;
    if (Math.random() < burnChance) {
      defender.statusEffects.push({ type: 'BURN', value: STATUS_EFFECT_DAMAGE.BURN ?? 0.05, turnsRemaining: 3, sourceSkill: skill.name });
      statusApplied = 'BURN';
    }
  }
  if (effects.freeze && typeof effects.freeze === 'object') {
    const freezeChance = ((effects.freeze as Record<string, number>).chance ?? 0) / 100;
    if (Math.random() < freezeChance) {
      defender.statusEffects.push({ type: 'FREEZE', value: 0, turnsRemaining: 2, sourceSkill: skill.name });
      statusApplied = 'FREEZE';
    }
  }

  const hitText = skill.hitCount > 1 ? ` (${skill.hitCount} hits)` : '';
  const critText = isCrit ? ' (CRITICAL!)' : '';
  const statusText = statusApplied ? ` Applied ${statusApplied}!` : '';

  return {
    turn, actorId: attacker.id, action: 'SKILL', skillId: skill.id, skillName: skill.name,
    damage: totalDamage, isCrit, statusApplied,
    message: `${attacker.name} uses ${skill.name} for ${totalDamage} damage${hitText}${critText}${statusText}`,
  };
}

function processHealSkill(
  attacker: FighterState,
  skill: EquippedSkillInfo,
  turn: number,
  _derived: ReturnType<typeof calculateDerivedStats>,
): BattleLogEntry {
  const effects = skill.effects as Record<string, unknown>;
  const healPercentage = (effects.heal as Record<string, number>)?.percentage ?? 20;
  const healing = Math.floor(attacker.maxHp * (healPercentage / 100));
  attacker.hp = Math.min(attacker.maxHp, attacker.hp + healing);

  return {
    turn, actorId: attacker.id, action: 'SKILL', skillId: skill.id, skillName: skill.name,
    healing,
    message: `${attacker.name} uses ${skill.name} and heals ${healing} HP`,
  };
}

function processBuffSkill(
  attacker: FighterState,
  skill: EquippedSkillInfo,
  turn: number,
): BattleLogEntry {
  const effects = skill.effects as Record<string, unknown>;
  const buff = effects.buff as Record<string, unknown> | undefined;
  if (buff) {
    attacker.statusEffects.push({
      type: 'BUFF',
      stat: (buff.stat as string) ?? 'ATK',
      value: ((buff.percentage as number) ?? 10) / 100,
      turnsRemaining: (buff.turns as number) ?? 3,
      sourceSkill: skill.name,
    });
  }

  return {
    turn, actorId: attacker.id, action: 'SKILL', skillId: skill.id, skillName: skill.name,
    statusApplied: 'BUFF',
    message: `${attacker.name} uses ${skill.name} and gains a buff!`,
  };
}

function processDebuffSkill(
  attacker: FighterState,
  defender: FighterState,
  skill: EquippedSkillInfo,
  turn: number,
): BattleLogEntry {
  const effects = skill.effects as Record<string, unknown>;
  const debuff = effects.debuff as Record<string, unknown> | undefined;
  if (debuff) {
    defender.statusEffects.push({
      type: 'DEBUFF',
      stat: (debuff.stat as string) ?? 'ATK',
      value: Math.abs((debuff.percentage as number) ?? 10) / 100,
      turnsRemaining: (debuff.turns as number) ?? 3,
      sourceSkill: skill.name,
    });
  }

  return {
    turn, actorId: attacker.id, action: 'SKILL', skillId: skill.id, skillName: skill.name,
    statusApplied: 'DEBUFF',
    message: `${attacker.name} uses ${skill.name} and weakens ${defender.name}!`,
  };
}

// ─── Defend ──────────────────────────────────────────────────────────────────

function processDefend(fighter: FighterState, turn: number): BattleLogEntry {
  fighter.isDefending = true;
  fighter.mp = Math.min(fighter.maxMp, fighter.mp + DEFEND_MP_RECOVERY);
  fighter.sta = Math.min(fighter.maxSta, fighter.sta + DEFEND_STA_RECOVERY);

  return {
    turn, actorId: fighter.id, action: 'DEFEND',
    message: `${fighter.name} defends! (+50% DEF, +${DEFEND_MP_RECOVERY} MP, +${DEFEND_STA_RECOVERY} STA)`,
  };
}

// ─── End Turn Processing ─────────────────────────────────────────────────────

function endTurnProcessing(state: BattleState): BattleState {
  const newState = { ...state };
  newState.player1 = applyEndTurn(newState.player1, state.turn, newState.log);
  newState.player2 = applyEndTurn(newState.player2, state.turn, newState.log);
  return newState;
}

function applyEndTurn(fighter: FighterState, turn: number, log: BattleLogEntry[]): FighterState {
  const f = { ...fighter, statusEffects: [...fighter.statusEffects] };

  // Apply DoT effects
  for (const effect of f.statusEffects) {
    if (effect.type === 'BURN' || effect.type === 'POISON') {
      const dot = Math.floor(f.maxHp * effect.value);
      f.hp = Math.max(0, f.hp - dot);
      log.push({
        turn, actorId: f.id, action: 'ATTACK',
        damage: dot,
        message: `${f.name} takes ${dot} ${effect.type.toLowerCase()} damage`,
      });
    }
  }

  // Decrement durations and remove expired
  f.statusEffects = f.statusEffects
    .map((e) => ({ ...e, turnsRemaining: e.turnsRemaining - 1 }))
    .filter((e) => e.turnsRemaining > 0);

  // Regen MP/STA
  f.mp = Math.min(f.maxMp, f.mp + MP_REGEN_PER_TURN);
  f.sta = Math.min(f.maxSta, f.sta + STA_REGEN_PER_TURN);

  // Decrement cooldowns
  const newCooldowns: Record<string, number> = {};
  for (const [skillId, cd] of Object.entries(f.cooldowns)) {
    if (cd > 1) newCooldowns[skillId] = cd - 1;
  }
  f.cooldowns = newCooldowns;

  return f;
}

// ─── Win Condition ───────────────────────────────────────────────────────────

export function checkWinCondition(state: BattleState): BattleState['status'] {
  if (state.player1.hp <= 0 && state.player2.hp <= 0) return 'DRAW';
  if (state.player1.hp <= 0) return 'P2_WIN';
  if (state.player2.hp <= 0) return 'P1_WIN';
  if (state.turn > state.maxTurns) return 'DRAW';
  return 'IN_PROGRESS';
}

// ─── Rewards ─────────────────────────────────────────────────────────────────

export function calculateBattleRewards(
  status: BattleState['status'],
  battleType: string,
): BattleRewards {
  const config = BATTLE_REWARDS[battleType] ?? BATTLE_REWARDS.FRIENDLY!;

  switch (status) {
    case 'P1_WIN':
      return { player1XP: config.winXP, player1KP: config.winKP, player2XP: config.loseXP, player2KP: config.loseKP };
    case 'P2_WIN':
      return { player1XP: config.loseXP, player1KP: config.loseKP, player2XP: config.winXP, player2KP: config.winKP };
    case 'DRAW':
      return { player1XP: config.drawXP, player1KP: config.drawKP, player2XP: config.drawXP, player2KP: config.drawKP };
    default:
      return { player1XP: 0, player1KP: 0, player2XP: 0, player2KP: 0 };
  }
}
