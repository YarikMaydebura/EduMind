import type { Grade, GradeCalculation } from '../types/gamification.types';

export function calculateGrade(
  level: number,
  homeworkAvg: number | null,
  quizAvg: number | null,
): GradeCalculation {
  const levelScore = level;
  const hwScore = homeworkAvg ?? 50;
  const qzScore = quizAvg ?? 50;

  const combinedScore = levelScore * 0.3 + hwScore * 0.35 + qzScore * 0.35;

  let grade: Grade;
  let nextGrade: Grade | null;
  let threshold: number;

  if (combinedScore >= 95) {
    grade = 'S+';
    nextGrade = null;
    threshold = 100;
  } else if (combinedScore >= 90) {
    grade = 'S';
    nextGrade = 'S+';
    threshold = 95;
  } else if (combinedScore >= 80) {
    grade = 'A';
    nextGrade = 'S';
    threshold = 90;
  } else if (combinedScore >= 70) {
    grade = 'B';
    nextGrade = 'A';
    threshold = 80;
  } else if (combinedScore >= 60) {
    grade = 'C';
    nextGrade = 'B';
    threshold = 70;
  } else if (combinedScore >= 50) {
    grade = 'D';
    nextGrade = 'C';
    threshold = 60;
  } else {
    grade = 'E';
    nextGrade = 'D';
    threshold = 50;
  }

  return {
    grade,
    score: combinedScore,
    breakdown: {
      levelScore,
      homeworkScore: hwScore,
      quizScore: qzScore,
    },
    nextGrade,
    pointsToNext: nextGrade ? threshold - combinedScore : 0,
  };
}
