import type { XPEvent } from '../types/gamification.types';

export function calculateHomeworkXP(score: number, maxScore: number, isLate: boolean): XPEvent {
  const percentage = (score / maxScore) * 100;
  let baseXP = 20;
  let bonusXP = 0;
  let reason = 'Homework submitted';

  if (isLate) {
    baseXP = 10;
    reason = 'Homework submitted (late)';
  }

  if (percentage >= 100) {
    baseXP = 50;
    bonusXP = 20;
    reason = 'Perfect homework!';
  } else if (percentage >= 90) {
    baseXP = 40;
    reason = 'Excellent homework!';
  } else if (percentage >= 80) {
    baseXP = 30;
    reason = 'Great homework!';
  }

  return {
    type: 'homework_submit',
    baseXP,
    bonusXP,
    totalXP: baseXP + bonusXP,
    reason,
  };
}

export function calculateQuizXP(
  score: number,
  maxScore: number,
  isBossBattle: boolean,
): XPEvent {
  const percentage = (score / maxScore) * 100;

  if (isBossBattle) {
    if (percentage >= 100) {
      return {
        type: 'boss_perfect',
        baseXP: 250,
        bonusXP: 100,
        totalXP: 350,
        reason: 'Boss defeated PERFECTLY!',
      };
    } else if (percentage >= 60) {
      return {
        type: 'boss_defeat',
        baseXP: 150,
        bonusXP: 0,
        totalXP: 150,
        reason: 'Boss defeated!',
      };
    }
    return {
      type: 'quiz_complete',
      baseXP: 30,
      bonusXP: 0,
      totalXP: 30,
      reason: 'Boss battle attempted',
    };
  }

  if (percentage >= 100) {
    return {
      type: 'quiz_perfect',
      baseXP: 100,
      bonusXP: 25,
      totalXP: 125,
      reason: 'Perfect quiz!',
    };
  } else if (percentage >= 90) {
    return {
      type: 'quiz_complete',
      baseXP: 75,
      bonusXP: 0,
      totalXP: 75,
      reason: 'Excellent quiz!',
    };
  } else if (percentage >= 80) {
    return {
      type: 'quiz_complete',
      baseXP: 50,
      bonusXP: 0,
      totalXP: 50,
      reason: 'Great quiz!',
    };
  }

  return {
    type: 'quiz_complete',
    baseXP: 30,
    bonusXP: 0,
    totalXP: 30,
    reason: 'Quiz completed',
  };
}

export function calculateStreakXP(streakDays: number): XPEvent | null {
  const milestones: Record<number, { xp: number; reason: string }> = {
    3: { xp: 25, reason: '3-day streak!' },
    7: { xp: 75, reason: '1-week streak!' },
    14: { xp: 150, reason: '2-week streak!' },
    30: { xp: 400, reason: '1-month streak!' },
    60: { xp: 800, reason: '2-month streak!' },
    100: { xp: 1500, reason: '100-day streak!' },
    365: { xp: 5000, reason: '1-YEAR STREAK!' },
  };

  const milestone = milestones[streakDays];
  if (!milestone) return null;

  return {
    type: 'streak_bonus',
    baseXP: milestone.xp,
    bonusXP: 0,
    totalXP: milestone.xp,
    reason: milestone.reason,
  };
}

export function calculateLessonXP(attended: boolean, participated: boolean): XPEvent {
  const baseXP = attended ? 50 : 0;
  const bonusXP = participated ? 10 : 0;

  return {
    type: 'lesson_complete',
    baseXP,
    bonusXP,
    totalXP: baseXP + bonusXP,
    reason: participated ? 'Lesson completed with participation!' : 'Lesson completed',
  };
}
