export type Grade = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S+';

export type AchievementRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';

export type XPEventType =
  | 'lesson_complete'
  | 'homework_submit'
  | 'homework_perfect'
  | 'quiz_complete'
  | 'quiz_perfect'
  | 'boss_defeat'
  | 'boss_perfect'
  | 'daily_login'
  | 'streak_bonus'
  | 'achievement_unlock'
  | 'skill_milestone'
  | 'level_up';

export interface XPEvent {
  type: XPEventType;
  baseXP: number;
  bonusXP: number;
  totalXP: number;
  reason: string;
}

export interface GradeCalculation {
  grade: Grade;
  score: number;
  breakdown: {
    levelScore: number;
    homeworkScore: number;
    quizScore: number;
  };
  nextGrade: Grade | null;
  pointsToNext: number;
}

export interface LevelProgress {
  current: number;
  needed: number;
  progress: number;
}
