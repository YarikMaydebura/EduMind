import {
  calculateBattleRewards,
  generateAiOpponent,
  initBattle,
  processTurn,
  selectAiAction,
  BATTLE_LIMITS,
} from '@edumind/shared';
import type { BattleAction, EquippedSkillInfo, FighterState } from '@edumind/shared';

import { db } from '@/lib/db';

// ─── Start Battle ────────────────────────────────────────────────────────────

export async function startBattle(
  studentId: string,
  battleType: 'PVE_DUNGEON' | 'FRIENDLY',
  opponentLevel?: number,
) {
  // Load character with equipped skills
  const character = await db.battleCharacter.findUnique({
    where: { studentId },
    include: {
      student: { select: { user: { select: { firstName: true } }, overallLevel: true } },
      class: { select: { name: true } },
      equippedSkills: {
        where: { isEquipped: true },
        include: {
          skill: {
            select: {
              id: true, name: true, type: true,
              mpCost: true, staCost: true, power: true, hitCount: true, cooldown: true,
              effects: true,
            },
          },
        },
      },
    },
  });

  if (!character) throw new Error('No battle character found');

  // Check daily limits
  const limitKey = battleType === 'PVE_DUNGEON' ? 'dungeon' : 'friendly';
  const limits = BATTLE_LIMITS[limitKey];

  if (character.pvpBattlesToday >= limits.maxPerDay) {
    throw new Error(`Daily ${battleType} limit reached (${limits.maxPerDay})`);
  }

  // Check cooldown
  if (character.lastBattleAt && limits.cooldownMinutes > 0) {
    const cooldownMs = limits.cooldownMinutes * 60 * 1000;
    const elapsed = Date.now() - character.lastBattleAt.getTime();
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
      throw new Error(`Cooldown: ${remaining}s remaining`);
    }
  }

  // Build player fighter state
  const playerSkills: EquippedSkillInfo[] = character.equippedSkills.map((cs) => ({
    id: cs.skill.id,
    name: cs.skill.name,
    type: cs.skill.type as EquippedSkillInfo['type'],
    mpCost: cs.skill.mpCost,
    staCost: cs.skill.staCost,
    power: cs.skill.power,
    hitCount: cs.skill.hitCount,
    cooldown: cs.skill.cooldown,
    effects: (cs.skill.effects ?? {}) as Record<string, unknown>,
  }));

  const player: FighterState = {
    id: character.id,
    name: `${character.student.user.firstName} (${character.class.name})`,
    hp: character.maxHp,
    maxHp: character.maxHp,
    mp: character.maxMp,
    maxMp: character.maxMp,
    sta: character.maxSta,
    maxSta: character.maxSta,
    atk: character.atk,
    def: character.def,
    spd: character.spd,
    lck: character.lck,
    skills: playerSkills,
    cooldowns: {},
    statusEffects: [],
    isDefending: false,
  };

  // Generate AI opponent
  const aiLevel = opponentLevel ?? character.student.overallLevel;
  const opponent = generateAiOpponent(aiLevel, 'NORMAL');

  // Initialize battle state
  const battleState = initBattle(player, opponent);

  // Create battle record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const battle = await db.battle.create({
    data: {
      type: battleType,
      status: 'BATTLE_IN_PROGRESS',
      player1Id: character.id,
      aiOpponent: JSON.parse(JSON.stringify(opponent)) as any,
      player1Stats: JSON.parse(JSON.stringify(player)) as any,
      player2Stats: JSON.parse(JSON.stringify(opponent)) as any,
      battleLog: JSON.parse(JSON.stringify(battleState)) as any,
      currentTurn: 1,
    },
  });

  // Update last battle time
  await db.battleCharacter.update({
    where: { id: character.id },
    data: { lastBattleAt: new Date() },
  });

  return { battleId: battle.id, state: battleState };
}

// ─── Submit Action ───────────────────────────────────────────────────────────

export async function submitAction(
  battleId: string,
  characterId: string,
  action: BattleAction,
) {
  const battle = await db.battle.findUnique({
    where: { id: battleId },
    select: {
      id: true,
      status: true,
      type: true,
      player1Id: true,
      battleLog: true,
      aiOpponent: true,
    },
  });

  if (!battle) throw new Error('Battle not found');
  if (battle.status !== 'BATTLE_IN_PROGRESS') throw new Error('Battle is not in progress');
  if (battle.player1Id !== characterId) throw new Error('Not your battle');

  // Load current state
  const state = battle.battleLog as unknown as ReturnType<typeof initBattle>;
  if (state.status !== 'IN_PROGRESS') throw new Error('Battle already ended');

  // Get AI action
  const aiAction = selectAiAction(state.player2, state.player1);

  // Process the turn
  const newState = processTurn(state, action, aiAction);

  // Update battle in DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    battleLog: JSON.parse(JSON.stringify(newState)) as any,
    currentTurn: newState.turn,
  };

  // If battle ended, finalize
  if (newState.status !== 'IN_PROGRESS') {
    const prismaStatus =
      newState.status === 'DRAW' ? 'BATTLE_DRAW' : 'BATTLE_COMPLETED';

    const rewards = calculateBattleRewards(newState.status, battle.type);

    updateData.status = prismaStatus;
    updateData.completedAt = new Date();
    updateData.rewards = JSON.parse(JSON.stringify(rewards)) as any;

    if (newState.status === 'P1_WIN') {
      updateData.winnerId = characterId;
    }

    // Update character stats
    await db.battleCharacter.update({
      where: { id: characterId },
      data: {
        knowledgePoints: { increment: rewards.player1KP },
        battlesWon: newState.status === 'P1_WIN' ? { increment: 1 } : undefined,
        battlesLost: newState.status === 'P2_WIN' ? { increment: 1 } : undefined,
        battlesDraw: newState.status === 'DRAW' ? { increment: 1 } : undefined,
        mobsDefeated: newState.status === 'P1_WIN' ? { increment: 1 } : undefined,
      },
    });

    // Create activity feed entry
    const character = await db.battleCharacter.findUnique({
      where: { id: characterId },
      select: { studentId: true },
    });

    if (character) {
      const resultText =
        newState.status === 'P1_WIN' ? 'Victory!' :
        newState.status === 'P2_WIN' ? 'Defeated' : 'Draw';

      await db.activityFeed.create({
        data: {
          studentId: character.studentId,
          type: 'QUIZ_COMPLETED', // Reuse existing enum - closest match
          title: `Battle ${resultText}`,
          description: `${resultText} (+${rewards.player1KP} KP, +${rewards.player1XP} XP)`,
          icon: newState.status === 'P1_WIN' ? '⚔️' : '🛡️',
          xpGained: rewards.player1XP,
          isPublic: true,
        },
      });
    }
  }

  await db.battle.update({
    where: { id: battleId },
    data: updateData,
  });

  return { state: newState, isFinished: newState.status !== 'IN_PROGRESS' };
}

// ─── Forfeit ─────────────────────────────────────────────────────────────────

export async function forfeitBattle(battleId: string, characterId: string) {
  const battle = await db.battle.findUnique({
    where: { id: battleId },
    select: { id: true, status: true, player1Id: true, type: true },
  });

  if (!battle) throw new Error('Battle not found');
  if (battle.status !== 'BATTLE_IN_PROGRESS') throw new Error('Battle is not in progress');
  if (battle.player1Id !== characterId) throw new Error('Not your battle');

  const rewards = calculateBattleRewards('P2_WIN', battle.type);

  await db.battle.update({
    where: { id: battleId },
    data: {
      status: 'BATTLE_CANCELLED',
      completedAt: new Date(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rewards: JSON.parse(JSON.stringify(rewards)) as any,
    },
  });

  await db.battleCharacter.update({
    where: { id: characterId },
    data: {
      knowledgePoints: { increment: rewards.player1KP },
      battlesLost: { increment: 1 },
    },
  });

  return { rewards };
}

// ─── PvP Daily Reset ─────────────────────────────────────────────────────────

async function checkAndResetPvpDaily(characterId: string) {
  const character = await db.battleCharacter.findUnique({
    where: { id: characterId },
    select: { pvpBattlesToday: true, lastDailyReset: true },
  });

  if (!character) return;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (character.lastDailyReset < today) {
    await db.battleCharacter.update({
      where: { id: characterId },
      data: { pvpBattlesToday: 0, lastDailyReset: new Date() },
    });
  }
}

// ─── Start PvP Battle ────────────────────────────────────────────────────────

export async function startPvpBattle(
  studentId: string,
  opponentCharacterId: string,
) {
  // Load player character
  const character = await db.battleCharacter.findUnique({
    where: { studentId },
    include: {
      student: { select: { user: { select: { firstName: true } }, overallLevel: true, userId: true } },
      class: { select: { name: true } },
      equippedSkills: {
        where: { isEquipped: true },
        include: {
          skill: {
            select: {
              id: true, name: true, type: true,
              mpCost: true, staCost: true, power: true, hitCount: true, cooldown: true,
              effects: true,
            },
          },
        },
      },
    },
  });

  if (!character) throw new Error('No battle character found');

  // Daily reset check
  await checkAndResetPvpDaily(character.id);

  // Re-fetch after possible reset
  const freshChar = await db.battleCharacter.findUnique({
    where: { id: character.id },
    select: { pvpBattlesToday: true, lastBattleAt: true },
  });

  // Check PvP daily limit
  const pvpLimits = BATTLE_LIMITS.pvp;
  if ((freshChar?.pvpBattlesToday ?? 0) >= pvpLimits.maxPerDay) {
    throw new Error(`PvP daily limit reached (${pvpLimits.maxPerDay}/day)`);
  }

  // Check cooldown
  if (freshChar?.lastBattleAt && pvpLimits.cooldownMinutes > 0) {
    const cooldownMs = pvpLimits.cooldownMinutes * 60 * 1000;
    const elapsed = Date.now() - freshChar.lastBattleAt.getTime();
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
      throw new Error(`PvP cooldown: ${remaining}s remaining`);
    }
  }

  // Load opponent character
  const opponent = await db.battleCharacter.findUnique({
    where: { id: opponentCharacterId },
    include: {
      student: { select: { user: { select: { firstName: true } }, overallLevel: true, userId: true } },
      class: { select: { name: true } },
      equippedSkills: {
        where: { isEquipped: true },
        include: {
          skill: {
            select: {
              id: true, name: true, type: true,
              mpCost: true, staCost: true, power: true, hitCount: true, cooldown: true,
              effects: true,
            },
          },
        },
      },
    },
  });

  if (!opponent) throw new Error('Opponent not found');
  if (opponent.id === character.id) throw new Error('Cannot battle yourself');

  // Build fighter states
  const buildFighter = (char: typeof character): import('@edumind/shared').FighterState => ({
    id: char.id,
    name: `${char.student.user.firstName} (${char.class.name})`,
    hp: char.maxHp, maxHp: char.maxHp,
    mp: char.maxMp, maxMp: char.maxMp,
    sta: char.maxSta, maxSta: char.maxSta,
    atk: char.atk, def: char.def, spd: char.spd, lck: char.lck,
    skills: char.equippedSkills.map((cs) => ({
      id: cs.skill.id, name: cs.skill.name,
      type: cs.skill.type as import('@edumind/shared').EquippedSkillInfo['type'],
      mpCost: cs.skill.mpCost, staCost: cs.skill.staCost,
      power: cs.skill.power, hitCount: cs.skill.hitCount, cooldown: cs.skill.cooldown,
      effects: (cs.skill.effects ?? {}) as Record<string, unknown>,
    })),
    cooldowns: {}, statusEffects: [], isDefending: false,
  });

  const player = buildFighter(character);
  const opponentFighter = buildFighter(opponent);

  const battleState = initBattle(player, opponentFighter);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const battle = await db.battle.create({
    data: {
      type: 'PVP',
      status: 'BATTLE_IN_PROGRESS',
      player1Id: character.id,
      player2Id: opponent.id,
      player1Stats: JSON.parse(JSON.stringify(player)) as any,
      player2Stats: JSON.parse(JSON.stringify(opponentFighter)) as any,
      battleLog: JSON.parse(JSON.stringify(battleState)) as any,
      currentTurn: 1,
    },
  });

  // Update PvP tracking
  await db.battleCharacter.update({
    where: { id: character.id },
    data: {
      pvpBattlesToday: { increment: 1 },
      lastBattleAt: new Date(),
    },
  });

  return { battleId: battle.id, state: battleState, opponent: { name: opponentFighter.name, id: opponent.id } };
}

// ─── Matchmaking ─────────────────────────────────────────────────────────────

export async function findPvpOpponent(studentId: string, tenantId: string) {
  const myCharacter = await db.battleCharacter.findUnique({
    where: { studentId },
    select: { id: true, student: { select: { overallLevel: true } } },
  });

  if (!myCharacter) throw new Error('No battle character');

  const myLevel = myCharacter.student.overallLevel;

  // Find opponents from same tenant, similar level, not self
  const candidates = await db.battleCharacter.findMany({
    where: {
      student: {
        user: { tenantId },
        overallLevel: { gte: Math.max(1, myLevel - 5), lte: myLevel + 5 },
      },
      id: { not: myCharacter.id },
    },
    select: {
      id: true,
      theme: true,
      maxHp: true,
      atk: true,
      def: true,
      spd: true,
      battlesWon: true,
      battlesLost: true,
      student: { select: { user: { select: { firstName: true } }, overallLevel: true } },
      class: { select: { name: true, rarity: true } },
    },
    take: 20,
  });

  if (candidates.length === 0) throw new Error('No opponents available');

  // Pick random opponent
  const opponent = candidates[Math.floor(Math.random() * candidates.length)]!;
  const totalBattles = opponent.battlesWon + opponent.battlesLost;

  return {
    id: opponent.id,
    name: opponent.student.user.firstName,
    level: opponent.student.overallLevel,
    className: opponent.class.name,
    classRarity: opponent.class.rarity,
    theme: opponent.theme,
    stats: { hp: opponent.maxHp, atk: opponent.atk, def: opponent.def, spd: opponent.spd },
    winRate: totalBattles > 0 ? Math.round((opponent.battlesWon / totalBattles) * 100) : 0,
    battlesWon: opponent.battlesWon,
  };
}
