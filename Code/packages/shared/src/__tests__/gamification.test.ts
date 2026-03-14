import { describe, expect, it } from 'vitest';

import { calculateGrade } from '../gamification/grades';
import { calculateLevel, getLevelTitle, xpForLevel, xpToNextLevel } from '../gamification/levels';
import {
  calculateHomeworkXP,
  calculateLessonXP,
  calculateQuizXP,
  calculateStreakXP,
} from '../gamification/xp';

describe('XP Calculations', () => {
  describe('calculateHomeworkXP', () => {
    it('returns 50 base + 20 bonus for perfect homework', () => {
      const result = calculateHomeworkXP(100, 100, false);
      expect(result.baseXP).toBe(50);
      expect(result.bonusXP).toBe(20);
      expect(result.totalXP).toBe(70);
      expect(result.type).toBe('homework_submit');
    });

    it('returns 40 XP for 90%+ homework', () => {
      const result = calculateHomeworkXP(92, 100, false);
      expect(result.baseXP).toBe(40);
      expect(result.totalXP).toBe(40);
    });

    it('returns 30 XP for 80%+ homework', () => {
      const result = calculateHomeworkXP(85, 100, false);
      expect(result.baseXP).toBe(30);
    });

    it('returns 20 XP for below 80% homework', () => {
      const result = calculateHomeworkXP(60, 100, false);
      expect(result.baseXP).toBe(20);
    });

    it('returns 10 XP for late homework', () => {
      const result = calculateHomeworkXP(60, 100, true);
      expect(result.baseXP).toBe(10);
    });

    it('overrides late penalty when score is perfect', () => {
      const result = calculateHomeworkXP(100, 100, true);
      expect(result.baseXP).toBe(50);
      expect(result.bonusXP).toBe(20);
    });
  });

  describe('calculateQuizXP', () => {
    it('returns 125 XP for perfect regular quiz', () => {
      const result = calculateQuizXP(100, 100, false);
      expect(result.totalXP).toBe(125);
      expect(result.type).toBe('quiz_perfect');
    });

    it('returns 75 XP for 90%+ quiz', () => {
      const result = calculateQuizXP(95, 100, false);
      expect(result.totalXP).toBe(75);
    });

    it('returns 50 XP for 80%+ quiz', () => {
      const result = calculateQuizXP(85, 100, false);
      expect(result.totalXP).toBe(50);
    });

    it('returns 30 XP for below 80% quiz', () => {
      const result = calculateQuizXP(50, 100, false);
      expect(result.totalXP).toBe(30);
    });

    it('returns 350 XP for perfect boss battle', () => {
      const result = calculateQuizXP(100, 100, true);
      expect(result.totalXP).toBe(350);
      expect(result.type).toBe('boss_perfect');
    });

    it('returns 150 XP for boss defeat (60%+)', () => {
      const result = calculateQuizXP(70, 100, true);
      expect(result.totalXP).toBe(150);
      expect(result.type).toBe('boss_defeat');
    });

    it('returns 30 XP for failed boss battle', () => {
      const result = calculateQuizXP(40, 100, true);
      expect(result.totalXP).toBe(30);
    });
  });

  describe('calculateStreakXP', () => {
    it('returns null for non-milestone days', () => {
      expect(calculateStreakXP(1)).toBeNull();
      expect(calculateStreakXP(5)).toBeNull();
      expect(calculateStreakXP(50)).toBeNull();
    });

    it('returns correct XP for streak milestones', () => {
      expect(calculateStreakXP(3)?.totalXP).toBe(25);
      expect(calculateStreakXP(7)?.totalXP).toBe(75);
      expect(calculateStreakXP(14)?.totalXP).toBe(150);
      expect(calculateStreakXP(30)?.totalXP).toBe(400);
      expect(calculateStreakXP(60)?.totalXP).toBe(800);
      expect(calculateStreakXP(100)?.totalXP).toBe(1500);
      expect(calculateStreakXP(365)?.totalXP).toBe(5000);
    });
  });

  describe('calculateLessonXP', () => {
    it('returns 60 XP for attended + participated', () => {
      const result = calculateLessonXP(true, true);
      expect(result.totalXP).toBe(60);
    });

    it('returns 50 XP for attended without participation', () => {
      const result = calculateLessonXP(true, false);
      expect(result.totalXP).toBe(50);
    });

    it('returns 0 XP for not attended', () => {
      const result = calculateLessonXP(false, false);
      expect(result.totalXP).toBe(0);
    });
  });
});

describe('Level Calculations', () => {
  describe('calculateLevel', () => {
    it('returns level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('returns level 2 for 100 XP', () => {
      expect(calculateLevel(100)).toBe(2);
    });

    it('returns level 10 for 8100 XP', () => {
      expect(calculateLevel(8100)).toBe(10);
    });

    it('caps at MAX_LEVEL (100)', () => {
      expect(calculateLevel(999999999)).toBe(100);
    });
  });

  describe('xpForLevel', () => {
    it('returns 0 for level 1', () => {
      expect(xpForLevel(1)).toBe(0);
    });

    it('returns 100 for level 2', () => {
      expect(xpForLevel(2)).toBe(100);
    });

    it('returns 8100 for level 10', () => {
      expect(xpForLevel(10)).toBe(8100);
    });
  });

  describe('xpToNextLevel', () => {
    it('calculates progress correctly', () => {
      // At 150 XP: level 2 (starts at 100), next level 3 (starts at 400)
      const progress = xpToNextLevel(150);
      expect(progress.current).toBe(50);
      expect(progress.needed).toBe(300);
      expect(progress.progress).toBeCloseTo(0.167, 2);
    });

    it('returns 0 progress at exact level boundary', () => {
      const progress = xpToNextLevel(100);
      expect(progress.current).toBe(0);
      expect(progress.progress).toBe(0);
    });
  });

  describe('getLevelTitle', () => {
    it('returns Newcomer for level 1', () => {
      expect(getLevelTitle(1)).toBe('Newcomer');
    });

    it('returns Student for level 5-9', () => {
      expect(getLevelTitle(5)).toBe('Student');
      expect(getLevelTitle(9)).toBe('Student');
    });

    it('returns Legend for level 100', () => {
      expect(getLevelTitle(100)).toBe('Legend');
    });

    it('returns subject-specific title', () => {
      expect(getLevelTitle(1, 'MATHEMATICS')).toBe('Number Novice');
      expect(getLevelTitle(50, 'COMPUTER_SCIENCE')).toBe('Code Wizard');
    });

    it('falls back to Newcomer for unknown subject', () => {
      expect(getLevelTitle(50, 'UNKNOWN')).toBe('Newcomer');
    });
  });
});

describe('Grade Calculations', () => {
  describe('calculateGrade', () => {
    it('returns S+ for top performance', () => {
      const result = calculateGrade(100, 100, 100);
      expect(result.grade).toBe('S+');
      expect(result.nextGrade).toBeNull();
      expect(result.pointsToNext).toBe(0);
    });

    it('returns E for low performance', () => {
      const result = calculateGrade(1, 10, 10);
      expect(result.grade).toBe('E');
      expect(result.nextGrade).toBe('D');
    });

    it('uses 50 as default for null averages', () => {
      const result = calculateGrade(50, null, null);
      expect(result.breakdown.homeworkScore).toBe(50);
      expect(result.breakdown.quizScore).toBe(50);
    });

    it('calculates weighted score correctly', () => {
      const result = calculateGrade(80, 70, 60);
      // 80 * 0.3 + 70 * 0.35 + 60 * 0.35 = 24 + 24.5 + 21 = 69.5
      expect(result.score).toBeCloseTo(69.5);
      expect(result.grade).toBe('C');
    });

    it('returns correct pointsToNext', () => {
      const result = calculateGrade(60, 60, 60);
      // 60 * 0.3 + 60 * 0.35 + 60 * 0.35 = 18 + 21 + 21 = 60
      expect(result.grade).toBe('C');
      expect(result.nextGrade).toBe('B');
      expect(result.pointsToNext).toBeCloseTo(10);
    });
  });
});
