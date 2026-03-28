# EduMind AI — Gamification System

## Document Info
```
Version: 1.0.0
Purpose: Complete gamification specifications for student engagement
```

---

## 1. Core Gamification Concepts

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         GAMIFICATION HIERARCHY                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                              ┌──────────────┐                                   │
│                              │   STUDENT    │                                   │
│                              │   PROFILE    │                                   │
│                              └──────┬───────┘                                   │
│                                     │                                           │
│         ┌───────────────────────────┼───────────────────────────┐              │
│         │                           │                           │              │
│    ┌────▼────┐                ┌─────▼─────┐              ┌──────▼──────┐       │
│    │ GLOBAL  │                │   CLASS   │              │   CLASS     │       │
│    │  STATS  │                │  ENGLISH  │              │    MATH     │       │
│    └────┬────┘                └─────┬─────┘              └──────┬──────┘       │
│         │                           │                           │              │
│    • Total XP                  • Class XP                  • Class XP          │
│    • Overall Level             • Class Level               • Class Level       │
│    • Overall Grade             • Class Grade               • Class Grade       │
│    • Streak Days               • Skills                    • Skills            │
│    • Global Achievements       • Class Achievements        • Class Achievements│
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. XP (Experience Points) System

### XP Sources

| Action | Base XP | Bonus Conditions | Max XP |
|--------|---------|------------------|--------|
| **Lessons** |
| Complete lesson | 50 | +10 per participation point (1-5) | 100 |
| Perfect attendance streak (5) | 25 | - | 25 |
| **Homework** |
| Submit homework (on time) | 20 | +10 if early | 30 |
| Score 80-89% | 30 | - | 30 |
| Score 90-99% | 40 | - | 40 |
| Perfect score (100%) | 50 | +20 bonus | 70 |
| **Quizzes** |
| Complete quiz | 30 | - | 30 |
| Score 80-89% | 50 | - | 50 |
| Score 90-99% | 75 | - | 75 |
| Perfect score (100%) | 100 | +25 bonus | 125 |
| **Boss Battle Quiz** |
| Defeat boss (pass) | 150 | - | 150 |
| Defeat boss (perfect) | 250 | +100 bonus | 350 |
| **Daily & Streaks** |
| Daily login | 10 | - | 10 |
| 3-day streak bonus | 25 | - | 25 |
| 7-day streak bonus | 75 | - | 75 |
| 14-day streak bonus | 150 | - | 150 |
| 30-day streak bonus | 400 | - | 400 |
| 100-day streak bonus | 1500 | - | 1500 |
| **Achievements** |
| Common | 25-50 | - | 50 |
| Uncommon | 100-200 | - | 200 |
| Rare | 200-300 | - | 300 |
| Epic | 500-750 | - | 750 |
| Legendary | 1000-1500 | - | 1500 |
| Mythic | 2000-3000 | - | 3000 |
| **Social** |
| Help classmate (verified) | 25 | - | 25 |
| Reach top 10 weekly | 100 | - | 100 |
| Reach #1 weekly | 250 | - | 250 |
| **Extra** |
| Bonus exercise | 30-50 | Based on difficulty | 50 |
| Skill milestone (every 10%) | 50 | - | 50 |
| Level up | 100 | - | 100 |

### XP Calculation Code

```typescript
// packages/shared/src/gamification/xp.ts

export interface XPEvent {
  type: XPEventType;
  baseXP: number;
  bonusXP: number;
  totalXP: number;
  reason: string;
}

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
    reason = 'Perfect homework! 🌟';
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
  isBossBattle: boolean
): XPEvent {
  const percentage = (score / maxScore) * 100;
  
  if (isBossBattle) {
    if (percentage >= 100) {
      return {
        type: 'boss_perfect',
        baseXP: 250,
        bonusXP: 100,
        totalXP: 350,
        reason: 'Boss defeated PERFECTLY! 👑',
      };
    } else if (percentage >= 60) {
      return {
        type: 'boss_defeat',
        baseXP: 150,
        bonusXP: 0,
        totalXP: 150,
        reason: 'Boss defeated! ⚔️',
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
  
  // Regular quiz
  if (percentage >= 100) {
    return {
      type: 'quiz_perfect',
      baseXP: 100,
      bonusXP: 25,
      totalXP: 125,
      reason: 'Perfect quiz! 🌟',
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
    3: { xp: 25, reason: '3-day streak! 🔥' },
    7: { xp: 75, reason: '1-week streak! 🔥🔥' },
    14: { xp: 150, reason: '2-week streak! 🔥🔥🔥' },
    30: { xp: 400, reason: '1-month streak! 🌟🔥' },
    60: { xp: 800, reason: '2-month streak! 💎🔥' },
    100: { xp: 1500, reason: '100-day streak! 👑🔥' },
    365: { xp: 5000, reason: '1-YEAR STREAK! 🏆👑🔥' },
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
```

---

## 3. Level System

### Level Formula

```typescript
// Level = floor(sqrt(XP / 100)) + 1
// Max Level per Grade Year: 100

export function calculateLevel(xp: number): number {
  return Math.min(100, Math.floor(Math.sqrt(xp / 100)) + 1);
}

export function xpForLevel(level: number): number {
  // XP needed to reach this level
  return Math.pow(level - 1, 2) * 100;
}

export function xpToNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
  const currentLevel = calculateLevel(currentXP);
  const currentLevelXP = xpForLevel(currentLevel);
  const nextLevelXP = xpForLevel(currentLevel + 1);
  
  return {
    current: currentXP - currentLevelXP,
    needed: nextLevelXP - currentLevelXP,
    progress: (currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP),
  };
}
```

### Level Milestones

| Level | XP Required | Cumulative XP | Title |
|-------|-------------|---------------|-------|
| 1 | 0 | 0 | Newcomer |
| 5 | 1,600 | 1,600 | Student |
| 10 | 8,100 | 8,100 | Learner |
| 15 | 19,600 | 19,600 | Scholar |
| 20 | 36,100 | 36,100 | Apprentice |
| 25 | 57,600 | 57,600 | Adept |
| 30 | 84,100 | 84,100 | Expert |
| 40 | 152,100 | 152,100 | Master |
| 50 | 240,100 | 240,100 | Grandmaster |
| 75 | 548,100 | 548,100 | Sage |
| 100 | 980,100 | 980,100 | Legend |

### Level Titles by Subject

```typescript
export const LEVEL_TITLES: Record<string, Record<number, string>> = {
  // Global titles
  global: {
    1: 'Newcomer',
    5: 'Student',
    10: 'Learner',
    15: 'Scholar',
    20: 'Apprentice',
    25: 'Adept',
    30: 'Expert',
    40: 'Master',
    50: 'Grandmaster',
    75: 'Sage',
    100: 'Legend',
  },
  
  // English-specific
  ENGLISH: {
    1: 'Word Seeker',
    10: 'Phrase Builder',
    20: 'Grammar Guardian',
    30: 'Vocabulary Virtuoso',
    40: 'Syntax Sage',
    50: 'Eloquent Expert',
    75: 'Linguistic Luminary',
    100: 'Language Legend',
  },
  
  // Mathematics-specific
  MATHEMATICS: {
    1: 'Number Novice',
    10: 'Equation Explorer',
    20: 'Problem Solver',
    30: 'Formula Finder',
    40: 'Calculation Champion',
    50: 'Math Mastermind',
    75: 'Theorem Theorist',
    100: 'Mathematical Legend',
  },
  
  // Computer Science-specific
  COMPUTER_SCIENCE: {
    1: 'Code Curious',
    10: 'Bug Hunter',
    20: 'Algorithm Apprentice',
    30: 'Debug Demon',
    40: 'System Architect',
    50: 'Code Wizard',
    75: 'Binary Sage',
    100: 'Programming Legend',
  },
};

export function getLevelTitle(level: number, subject?: string): string {
  const titles = subject ? LEVEL_TITLES[subject] : LEVEL_TITLES.global;
  
  // Find the highest title at or below current level
  const applicableLevels = Object.keys(titles)
    .map(Number)
    .filter(l => l <= level)
    .sort((a, b) => b - a);
  
  return titles[applicableLevels[0]] || 'Newcomer';
}
```

---

## 4. Grade System (E to S+)

### Grade Calculation

Grades are calculated based on:
- Level progress (30%)
- Average homework score (35%)
- Average quiz score (35%)

```typescript
export type Grade = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S+';

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

export function calculateGrade(
  level: number,
  homeworkAvg: number | null,  // 0-100
  quizAvg: number | null       // 0-100
): GradeCalculation {
  // Normalize level to 0-100 scale
  const levelScore = level;
  const hwScore = homeworkAvg ?? 50;
  const qzScore = quizAvg ?? 50;
  
  // Weighted score
  const combinedScore = (levelScore * 0.3) + (hwScore * 0.35) + (qzScore * 0.35);
  
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
```

### Grade Visual Representation

```typescript
export const GRADE_CONFIG: Record<Grade, {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}> = {
  'E': {
    color: '#6B7280',      // gray-500
    bgColor: '#F3F4F6',    // gray-100
    borderColor: '#D1D5DB',
    icon: '📘',
    description: 'Getting Started',
  },
  'D': {
    color: '#78716C',      // stone-500
    bgColor: '#F5F5F4',    // stone-100
    borderColor: '#D6D3D1',
    icon: '📗',
    description: 'Making Progress',
  },
  'C': {
    color: '#22C55E',      // green-500
    bgColor: '#DCFCE7',    // green-100
    borderColor: '#86EFAC',
    icon: '📕',
    description: 'Good Work',
  },
  'B': {
    color: '#3B82F6',      // blue-500
    bgColor: '#DBEAFE',    // blue-100
    borderColor: '#93C5FD',
    icon: '📙',
    description: 'Great Job',
  },
  'A': {
    color: '#8B5CF6',      // purple-500
    bgColor: '#EDE9FE',    // purple-100
    borderColor: '#C4B5FD',
    icon: '⭐',
    description: 'Excellent',
  },
  'S': {
    color: '#F59E0B',      // amber-500
    bgColor: '#FEF3C7',    // amber-100
    borderColor: '#FCD34D',
    icon: '🌟',
    description: 'Outstanding',
  },
  'S+': {
    color: '#EF4444',      // red-500
    bgColor: '#FEE2E2',    // red-100
    borderColor: '#FCA5A5',
    icon: '👑',
    description: 'Legendary',
  },
};
```

---

## 5. Skills System

### Skills by Subject

> **📋 COMPLETE LIST:** See **SUBJECTS_SKILLS.md** for the full 100+ subjects with all skills.

```typescript
// ═══════════════════════════════════════════════════════════════════════════════
// SUBJECT CATEGORIES (100+ subjects total)
// ═══════════════════════════════════════════════════════════════════════════════

export enum SubjectCategory {
  CORE_MATH = 'CORE_MATH',           // 10 subjects
  CORE_SCIENCE = 'CORE_SCIENCE',     // 11 subjects
  CORE_ENGLISH = 'CORE_ENGLISH',     // 8 subjects
  SOCIAL_STUDIES = 'SOCIAL_STUDIES', // 10 subjects
  LANGUAGES = 'LANGUAGES',           // 19 subjects
  ARTS = 'ARTS',                     // 7 subjects
  MUSIC = 'MUSIC',                   // 9 subjects
  PERFORMING = 'PERFORMING',         // 6 subjects
  TECHNOLOGY = 'TECHNOLOGY',         // 13 subjects
  BUSINESS = 'BUSINESS',             // 8 subjects
  HEALTH_PE = 'HEALTH_PE',           // 7 subjects
  VOCATIONAL = 'VOCATIONAL',         // 13 subjects
  OTHER = 'OTHER',                   // 8 subjects
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKILL TEMPLATES BY CATEGORY
// ═══════════════════════════════════════════════════════════════════════════════

export const SUBJECT_SKILLS: Record<string, {
  id: string;
  name: string;
  icon: string;
  maxLevel: number;
}[]> = {
  
  // ─────────────────────────────────────────────────────────────────────────────
  // MATHEMATICS (applies to: MATHEMATICS, ALGEBRA, GEOMETRY, CALCULUS, etc.)
  // ─────────────────────────────────────────────────────────────────────────────
  MATHEMATICS: [
    { id: 'arithmetic', name: 'Arithmetic', icon: '🔢', maxLevel: 100 },
    { id: 'algebra', name: 'Algebra', icon: '📐', maxLevel: 100 },
    { id: 'geometry', name: 'Geometry', icon: '📏', maxLevel: 100 },
    { id: 'trigonometry', name: 'Trigonometry', icon: '📊', maxLevel: 100 },
    { id: 'calculus', name: 'Calculus', icon: '∫', maxLevel: 100 },
    { id: 'statistics', name: 'Statistics', icon: '📈', maxLevel: 100 },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩', maxLevel: 100 },
    { id: 'logic', name: 'Logic', icon: '🧠', maxLevel: 100 },
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SCIENCE (applies to: BIOLOGY, CHEMISTRY, PHYSICS, etc.)
  // ─────────────────────────────────────────────────────────────────────────────
  BIOLOGY: [
    { id: 'cell_biology', name: 'Cell Biology', icon: '🔬', maxLevel: 100 },
    { id: 'genetics', name: 'Genetics', icon: '🧬', maxLevel: 100 },
    { id: 'evolution', name: 'Evolution', icon: '🦎', maxLevel: 100 },
    { id: 'ecology', name: 'Ecology', icon: '🌿', maxLevel: 100 },
    { id: 'anatomy', name: 'Anatomy', icon: '🫀', maxLevel: 100 },
    { id: 'physiology', name: 'Physiology', icon: '💪', maxLevel: 100 },
    { id: 'microbiology', name: 'Microbiology', icon: '🦠', maxLevel: 100 },
    { id: 'lab_skills', name: 'Lab Skills', icon: '🥼', maxLevel: 100 },
  ],
  
  CHEMISTRY: [
    { id: 'atomic_structure', name: 'Atomic Structure', icon: '⚛️', maxLevel: 100 },
    { id: 'periodic_table', name: 'Periodic Table', icon: '🔬', maxLevel: 100 },
    { id: 'chemical_bonds', name: 'Chemical Bonds', icon: '🔗', maxLevel: 100 },
    { id: 'reactions', name: 'Reactions', icon: '🧪', maxLevel: 100 },
    { id: 'stoichiometry', name: 'Stoichiometry', icon: '⚖️', maxLevel: 100 },
    { id: 'organic', name: 'Organic Chemistry', icon: '🧬', maxLevel: 100 },
    { id: 'lab_skills', name: 'Lab Skills', icon: '🥼', maxLevel: 100 },
  ],
  
  PHYSICS: [
    { id: 'mechanics', name: 'Mechanics', icon: '⚙️', maxLevel: 100 },
    { id: 'thermodynamics', name: 'Thermodynamics', icon: '🌡️', maxLevel: 100 },
    { id: 'electromagnetism', name: 'Electromagnetism', icon: '⚡', maxLevel: 100 },
    { id: 'waves', name: 'Waves & Sound', icon: '🌊', maxLevel: 100 },
    { id: 'optics', name: 'Optics', icon: '🔦', maxLevel: 100 },
    { id: 'modern_physics', name: 'Modern Physics', icon: '⚛️', maxLevel: 100 },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩', maxLevel: 100 },
  ],
  
  EARTH_SCIENCE: [
    { id: 'geology', name: 'Geology', icon: '🪨', maxLevel: 100 },
    { id: 'meteorology', name: 'Meteorology', icon: '🌤️', maxLevel: 100 },
    { id: 'oceanography', name: 'Oceanography', icon: '🌊', maxLevel: 100 },
    { id: 'climate', name: 'Climate Science', icon: '🌍', maxLevel: 100 },
  ],
  
  ASTRONOMY: [
    { id: 'solar_system', name: 'Solar System', icon: '☀️', maxLevel: 100 },
    { id: 'stars', name: 'Stars & Galaxies', icon: '⭐', maxLevel: 100 },
    { id: 'cosmology', name: 'Cosmology', icon: '🌌', maxLevel: 100 },
    { id: 'observation', name: 'Observation', icon: '🔭', maxLevel: 100 },
  ],
  
  ENVIRONMENTAL_SCIENCE: [
    { id: 'ecosystems', name: 'Ecosystems', icon: '🌳', maxLevel: 100 },
    { id: 'pollution', name: 'Pollution', icon: '🏭', maxLevel: 100 },
    { id: 'conservation', name: 'Conservation', icon: '♻️', maxLevel: 100 },
    { id: 'sustainability', name: 'Sustainability', icon: '🌱', maxLevel: 100 },
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ENGLISH/LANGUAGE ARTS
  // ─────────────────────────────────────────────────────────────────────────────
  ENGLISH: [
    { id: 'grammar', name: 'Grammar', icon: '📖', maxLevel: 100 },
    { id: 'vocabulary', name: 'Vocabulary', icon: '📝', maxLevel: 100 },
    { id: 'reading', name: 'Reading Comprehension', icon: '📚', maxLevel: 100 },
    { id: 'writing', name: 'Writing', icon: '✍️', maxLevel: 100 },
    { id: 'speaking', name: 'Speaking', icon: '🗣️', maxLevel: 100 },
    { id: 'listening', name: 'Listening', icon: '👂', maxLevel: 100 },
  ],
  
  LITERATURE: [
    { id: 'analysis', name: 'Literary Analysis', icon: '🔍', maxLevel: 100 },
    { id: 'themes', name: 'Themes & Motifs', icon: '🎭', maxLevel: 100 },
    { id: 'characters', name: 'Character Study', icon: '👤', maxLevel: 100 },
    { id: 'genres', name: 'Genre Knowledge', icon: '📚', maxLevel: 100 },
    { id: 'historical_context', name: 'Historical Context', icon: '📜', maxLevel: 100 },
    { id: 'critical_thinking', name: 'Critical Thinking', icon: '🧠', maxLevel: 100 },
  ],
  
  CREATIVE_WRITING: [
    { id: 'fiction', name: 'Fiction Writing', icon: '📖', maxLevel: 100 },
    { id: 'poetry', name: 'Poetry', icon: '🎭', maxLevel: 100 },
    { id: 'dialogue', name: 'Dialogue', icon: '💬', maxLevel: 100 },
    { id: 'world_building', name: 'World Building', icon: '🌍', maxLevel: 100 },
    { id: 'character_dev', name: 'Character Development', icon: '👤', maxLevel: 100 },
    { id: 'editing', name: 'Editing & Revision', icon: '✏️', maxLevel: 100 },
  ],
  
  JOURNALISM: [
    { id: 'news_writing', name: 'News Writing', icon: '📰', maxLevel: 100 },
    { id: 'research', name: 'Research', icon: '🔍', maxLevel: 100 },
    { id: 'interviewing', name: 'Interviewing', icon: '🎤', maxLevel: 100 },
    { id: 'ethics', name: 'Journalistic Ethics', icon: '⚖️', maxLevel: 100 },
    { id: 'multimedia', name: 'Multimedia', icon: '📱', maxLevel: 100 },
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SOCIAL STUDIES/HUMANITIES
  // ─────────────────────────────────────────────────────────────────────────────
  HISTORY: [
    { id: 'chronology', name: 'Chronology', icon: '📅', maxLevel: 100 },
    { id: 'analysis', name: 'Historical Analysis', icon: '🔍', maxLevel: 100 },
    { id: 'primary_sources', name: 'Primary Sources', icon: '📜', maxLevel: 100 },
    { id: 'cause_effect', name: 'Cause & Effect', icon: '🔗', maxLevel: 100 },
    { id: 'geography', name: 'Historical Geography', icon: '🗺️', maxLevel: 100 },
    { id: 'perspectives', name: 'Multiple Perspectives', icon: '👁️', maxLevel: 100 },
  ],
  
  GEOGRAPHY: [
    { id: 'physical', name: 'Physical Geography', icon: '🏔️', maxLevel: 100 },
    { id: 'human', name: 'Human Geography', icon: '👥', maxLevel: 100 },
    { id: 'maps', name: 'Map Skills', icon: '🗺️', maxLevel: 100 },
    { id: 'regions', name: 'World Regions', icon: '🌍', maxLevel: 100 },
    { id: 'climate', name: 'Climate & Weather', icon: '🌤️', maxLevel: 100 },
  ],
  
  ECONOMICS: [
    { id: 'microeconomics', name: 'Microeconomics', icon: '📊', maxLevel: 100 },
    { id: 'macroeconomics', name: 'Macroeconomics', icon: '🌐', maxLevel: 100 },
    { id: 'markets', name: 'Markets', icon: '📈', maxLevel: 100 },
    { id: 'finance', name: 'Financial Literacy', icon: '💰', maxLevel: 100 },
    { id: 'policy', name: 'Economic Policy', icon: '📋', maxLevel: 100 },
  ],
  
  CIVICS: [
    { id: 'government', name: 'Government Structure', icon: '🏛️', maxLevel: 100 },
    { id: 'constitution', name: 'Constitution', icon: '📜', maxLevel: 100 },
    { id: 'rights', name: 'Rights & Responsibilities', icon: '⚖️', maxLevel: 100 },
    { id: 'voting', name: 'Voting & Elections', icon: '🗳️', maxLevel: 100 },
    { id: 'citizenship', name: 'Active Citizenship', icon: '🤝', maxLevel: 100 },
  ],
  
  PSYCHOLOGY: [
    { id: 'cognitive', name: 'Cognitive Psychology', icon: '🧠', maxLevel: 100 },
    { id: 'developmental', name: 'Developmental', icon: '👶', maxLevel: 100 },
    { id: 'social', name: 'Social Psychology', icon: '👥', maxLevel: 100 },
    { id: 'abnormal', name: 'Abnormal Psychology', icon: '🔬', maxLevel: 100 },
    { id: 'research', name: 'Research Methods', icon: '📊', maxLevel: 100 },
  ],
  
  SOCIOLOGY: [
    { id: 'social_structures', name: 'Social Structures', icon: '🏗️', maxLevel: 100 },
    { id: 'culture', name: 'Culture & Society', icon: '🎭', maxLevel: 100 },
    { id: 'inequality', name: 'Social Inequality', icon: '⚖️', maxLevel: 100 },
    { id: 'institutions', name: 'Social Institutions', icon: '🏛️', maxLevel: 100 },
  ],
  
  PHILOSOPHY: [
    { id: 'logic', name: 'Logic', icon: '🧠', maxLevel: 100 },
    { id: 'ethics', name: 'Ethics', icon: '⚖️', maxLevel: 100 },
    { id: 'metaphysics', name: 'Metaphysics', icon: '💭', maxLevel: 100 },
    { id: 'epistemology', name: 'Epistemology', icon: '📚', maxLevel: 100 },
    { id: 'argumentation', name: 'Argumentation', icon: '💬', maxLevel: 100 },
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // LANGUAGES (template for all 19 languages)
  // Applies to: SPANISH, FRENCH, GERMAN, MANDARIN, JAPANESE, ITALIAN, 
  // PORTUGUESE, RUSSIAN, ARABIC, KOREAN, LATIN, GREEK, UKRAINIAN, 
  // DUTCH, POLISH, HINDI, TURKISH, VIETNAMESE, SWEDISH
  // ─────────────────────────────────────────────────────────────────────────────
  LANGUAGE_TEMPLATE: [
    { id: 'grammar', name: 'Grammar', icon: '📖', maxLevel: 100 },
    { id: 'vocabulary', name: 'Vocabulary', icon: '📝', maxLevel: 100 },
    { id: 'speaking', name: 'Speaking', icon: '🗣️', maxLevel: 100 },
    { id: 'listening', name: 'Listening', icon: '👂', maxLevel: 100 },
    { id: 'reading', name: 'Reading', icon: '📚', maxLevel: 100 },
    { id: 'writing', name: 'Writing', icon: '✍️', maxLevel: 100 },
    { id: 'pronunciation', name: 'Pronunciation', icon: '🔊', maxLevel: 100 },
    { id: 'culture', name: 'Culture', icon: '🎭', maxLevel: 100 },
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ARTS & MUSIC
  // ─────────────────────────────────────────────────────────────────────────────
  VISUAL_ARTS: [
    { id: 'drawing', name: 'Drawing', icon: '✏️', maxLevel: 100 },
    { id: 'painting', name: 'Painting', icon: '🎨', maxLevel: 100 },
    { id: 'composition', name: 'Composition', icon: '🖼️', maxLevel: 100 },
    { id: 'color_theory', name: 'Color Theory', icon: '🌈', maxLevel: 100 },
    { id: 'perspective', name: 'Perspective', icon: '👁️', maxLevel: 100 },
    { id: 'art_history', name: 'Art History', icon: '📜', maxLevel: 100 },
    { id: 'critique', name: 'Art Critique', icon: '🔍', maxLevel: 100 },
  ],
  
  PHOTOGRAPHY: [
    { id: 'camera', name: 'Camera Techniques', icon: '📷', maxLevel: 100 },
    { id: 'lighting', name: 'Lighting', icon: '💡', maxLevel: 100 },
    { id: 'composition', name: 'Composition', icon: '🖼️', maxLevel: 100 },
    { id: 'editing', name: 'Photo Editing', icon: '🖥️', maxLevel: 100 },
    { id: 'genres', name: 'Photo Genres', icon: '📸', maxLevel: 100 },
  ],
  
  MUSIC: [
    { id: 'theory', name: 'Music Theory', icon: '🎼', maxLevel: 100 },
    { id: 'rhythm', name: 'Rhythm', icon: '🥁', maxLevel: 100 },
    { id: 'melody', name: 'Melody', icon: '🎵', maxLevel: 100 },
    { id: 'harmony', name: 'Harmony', icon: '🎶', maxLevel: 100 },
    { id: 'performance', name: 'Performance', icon: '🎤', maxLevel: 100 },
    { id: 'ear_training', name: 'Ear Training', icon: '👂', maxLevel: 100 },
    { id: 'sight_reading', name: 'Sight Reading', icon: '📖', maxLevel: 100 },
  ],
  
  // Instrument skills (PIANO, GUITAR, VIOLIN, DRUMS, etc.)
  INSTRUMENT: [
    { id: 'technique', name: 'Technique', icon: '🎹', maxLevel: 100 },
    { id: 'scales', name: 'Scales & Arpeggios', icon: '🎼', maxLevel: 100 },
    { id: 'repertoire', name: 'Repertoire', icon: '📚', maxLevel: 100 },
    { id: 'sight_reading', name: 'Sight Reading', icon: '👀', maxLevel: 100 },
    { id: 'performance', name: 'Performance', icon: '🎭', maxLevel: 100 },
  ],
  
  DRAMA: [
    { id: 'acting', name: 'Acting', icon: '🎭', maxLevel: 100 },
    { id: 'voice', name: 'Voice & Diction', icon: '🗣️', maxLevel: 100 },
    { id: 'movement', name: 'Movement', icon: '🏃', maxLevel: 100 },
    { id: 'improv', name: 'Improvisation', icon: '🎲', maxLevel: 100 },
    { id: 'script', name: 'Script Analysis', icon: '📜', maxLevel: 100 },
    { id: 'production', name: 'Production', icon: '🎬', maxLevel: 100 },
  ],
  
  DANCE: [
    { id: 'technique', name: 'Technique', icon: '💃', maxLevel: 100 },
    { id: 'choreography', name: 'Choreography', icon: '📋', maxLevel: 100 },
    { id: 'rhythm', name: 'Rhythm & Timing', icon: '🎵', maxLevel: 100 },
    { id: 'flexibility', name: 'Flexibility', icon: '🤸', maxLevel: 100 },
    { id: 'performance', name: 'Performance', icon: '🎭', maxLevel: 100 },
  ],
  
  FILM_STUDIES: [
    { id: 'analysis', name: 'Film Analysis', icon: '🔍', maxLevel: 100 },
    { id: 'cinematography', name: 'Cinematography', icon: '🎥', maxLevel: 100 },
    { id: 'editing', name: 'Editing', icon: '✂️', maxLevel: 100 },
    { id: 'sound', name: 'Sound Design', icon: '🔊', maxLevel: 100 },
    { id: 'screenwriting', name: 'Screenwriting', icon: '📝', maxLevel: 100 },
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TECHNOLOGY & COMPUTER SCIENCE
  // ─────────────────────────────────────────────────────────────────────────────
  COMPUTER_SCIENCE: [
    { id: 'algorithms', name: 'Algorithms', icon: '🔄', maxLevel: 100 },
    { id: 'data_structures', name: 'Data Structures', icon: '🗂️', maxLevel: 100 },
    { id: 'programming', name: 'Programming', icon: '💻', maxLevel: 100 },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩', maxLevel: 100 },
    { id: 'debugging', name: 'Debugging', icon: '🐛', maxLevel: 100 },
    { id: 'theory', name: 'CS Theory', icon: '📚', maxLevel: 100 },
  ],
  
  PROGRAMMING: [
    { id: 'syntax', name: 'Syntax', icon: '📝', maxLevel: 100 },
    { id: 'logic', name: 'Programming Logic', icon: '🧠', maxLevel: 100 },
    { id: 'oop', name: 'OOP', icon: '📦', maxLevel: 100 },
    { id: 'functional', name: 'Functional Programming', icon: 'λ', maxLevel: 100 },
    { id: 'testing', name: 'Testing', icon: '✅', maxLevel: 100 },
    { id: 'best_practices', name: 'Best Practices', icon: '⭐', maxLevel: 100 },
  ],
  
  WEB_DEVELOPMENT: [
    { id: 'html', name: 'HTML', icon: '🌐', maxLevel: 100 },
    { id: 'css', name: 'CSS', icon: '🎨', maxLevel: 100 },
    { id: 'javascript', name: 'JavaScript', icon: '📜', maxLevel: 100 },
    { id: 'frontend', name: 'Frontend', icon: '🖥️', maxLevel: 100 },
    { id: 'backend', name: 'Backend', icon: '⚙️', maxLevel: 100 },
    { id: 'databases', name: 'Databases', icon: '🗄️', maxLevel: 100 },
    { id: 'responsive', name: 'Responsive Design', icon: '📱', maxLevel: 100 },
  ],
  
  DATA_SCIENCE: [
    { id: 'analysis', name: 'Data Analysis', icon: '📊', maxLevel: 100 },
    { id: 'visualization', name: 'Data Visualization', icon: '📈', maxLevel: 100 },
    { id: 'statistics', name: 'Statistics', icon: '📉', maxLevel: 100 },
    { id: 'python', name: 'Python/R', icon: '🐍', maxLevel: 100 },
    { id: 'ml_basics', name: 'ML Basics', icon: '🤖', maxLevel: 100 },
  ],
  
  ROBOTICS: [
    { id: 'mechanics', name: 'Mechanics', icon: '⚙️', maxLevel: 100 },
    { id: 'electronics', name: 'Electronics', icon: '🔌', maxLevel: 100 },
    { id: 'programming', name: 'Robot Programming', icon: '💻', maxLevel: 100 },
    { id: 'sensors', name: 'Sensors', icon: '📡', maxLevel: 100 },
    { id: 'automation', name: 'Automation', icon: '🤖', maxLevel: 100 },
  ],
  
  CYBERSECURITY: [
    { id: 'network', name: 'Network Security', icon: '🔐', maxLevel: 100 },
    { id: 'cryptography', name: 'Cryptography', icon: '🔑', maxLevel: 100 },
    { id: 'threats', name: 'Threat Analysis', icon: '⚠️', maxLevel: 100 },
    { id: 'ethical_hacking', name: 'Ethical Hacking', icon: '🎯', maxLevel: 100 },
  ],
  
  GRAPHIC_DESIGN: [
    { id: 'typography', name: 'Typography', icon: '🔤', maxLevel: 100 },
    { id: 'color', name: 'Color Theory', icon: '🎨', maxLevel: 100 },
    { id: 'layout', name: 'Layout', icon: '📐', maxLevel: 100 },
    { id: 'software', name: 'Design Software', icon: '💻', maxLevel: 100 },
    { id: 'branding', name: 'Branding', icon: '🏷️', maxLevel: 100 },
    { id: 'ux_ui', name: 'UX/UI', icon: '📱', maxLevel: 100 },
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // BUSINESS
  // ─────────────────────────────────────────────────────────────────────────────
  BUSINESS: [
    { id: 'fundamentals', name: 'Business Fundamentals', icon: '📊', maxLevel: 100 },
    { id: 'strategy', name: 'Strategy', icon: '🎯', maxLevel: 100 },
    { id: 'operations', name: 'Operations', icon: '⚙️', maxLevel: 100 },
    { id: 'communication', name: 'Business Communication', icon: '💬', maxLevel: 100 },
    { id: 'ethics', name: 'Business Ethics', icon: '⚖️', maxLevel: 100 },
  ],
  
  FINANCE: [
    { id: 'accounting_basics', name: 'Accounting Basics', icon: '📒', maxLevel: 100 },
    { id: 'financial_analysis', name: 'Financial Analysis', icon: '📊', maxLevel: 100 },
    { id: 'investments', name: 'Investments', icon: '📈', maxLevel: 100 },
    { id: 'budgeting', name: 'Budgeting', icon: '💰', maxLevel: 100 },
    { id: 'markets', name: 'Financial Markets', icon: '🏦', maxLevel: 100 },
  ],
  
  ACCOUNTING: [
    { id: 'bookkeeping', name: 'Bookkeeping', icon: '📒', maxLevel: 100 },
    { id: 'financial_statements', name: 'Financial Statements', icon: '📄', maxLevel: 100 },
    { id: 'tax', name: 'Taxation', icon: '📋', maxLevel: 100 },
    { id: 'auditing', name: 'Auditing', icon: '🔍', maxLevel: 100 },
  ],
  
  MARKETING: [
    { id: 'strategy', name: 'Marketing Strategy', icon: '🎯', maxLevel: 100 },
    { id: 'digital', name: 'Digital Marketing', icon: '📱', maxLevel: 100 },
    { id: 'branding', name: 'Branding', icon: '🏷️', maxLevel: 100 },
    { id: 'analytics', name: 'Marketing Analytics', icon: '📊', maxLevel: 100 },
    { id: 'content', name: 'Content Marketing', icon: '📝', maxLevel: 100 },
    { id: 'social_media', name: 'Social Media', icon: '📲', maxLevel: 100 },
  ],
  
  ENTREPRENEURSHIP: [
    { id: 'ideation', name: 'Ideation', icon: '💡', maxLevel: 100 },
    { id: 'business_plan', name: 'Business Planning', icon: '📋', maxLevel: 100 },
    { id: 'fundraising', name: 'Fundraising', icon: '💰', maxLevel: 100 },
    { id: 'leadership', name: 'Leadership', icon: '👑', maxLevel: 100 },
    { id: 'growth', name: 'Growth Strategy', icon: '📈', maxLevel: 100 },
    { id: 'pitching', name: 'Pitching', icon: '🎤', maxLevel: 100 },
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // PHYSICAL & HEALTH EDUCATION
  // ─────────────────────────────────────────────────────────────────────────────
  PHYSICAL_EDUCATION: [
    { id: 'fitness', name: 'Physical Fitness', icon: '💪', maxLevel: 100 },
    { id: 'sports', name: 'Sports Skills', icon: '⚽', maxLevel: 100 },
    { id: 'teamwork', name: 'Teamwork', icon: '🤝', maxLevel: 100 },
    { id: 'coordination', name: 'Coordination', icon: '🤸', maxLevel: 100 },
    { id: 'endurance', name: 'Endurance', icon: '🏃', maxLevel: 100 },
    { id: 'flexibility', name: 'Flexibility', icon: '🧘', maxLevel: 100 },
  ],
  
  HEALTH: [
    { id: 'body_systems', name: 'Body Systems', icon: '🫀', maxLevel: 100 },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗', maxLevel: 100 },
    { id: 'mental_health', name: 'Mental Health', icon: '🧠', maxLevel: 100 },
    { id: 'safety', name: 'Safety', icon: '🛡️', maxLevel: 100 },
    { id: 'prevention', name: 'Disease Prevention', icon: '💉', maxLevel: 100 },
    { id: 'decision_making', name: 'Health Decisions', icon: '⚖️', maxLevel: 100 },
  ],
  
  NUTRITION: [
    { id: 'macronutrients', name: 'Macronutrients', icon: '🍎', maxLevel: 100 },
    { id: 'micronutrients', name: 'Micronutrients', icon: '💊', maxLevel: 100 },
    { id: 'meal_planning', name: 'Meal Planning', icon: '📋', maxLevel: 100 },
    { id: 'diet_analysis', name: 'Diet Analysis', icon: '📊', maxLevel: 100 },
  ],
  
  FIRST_AID: [
    { id: 'basic', name: 'Basic First Aid', icon: '🩹', maxLevel: 100 },
    { id: 'cpr', name: 'CPR', icon: '❤️', maxLevel: 100 },
    { id: 'emergency', name: 'Emergency Response', icon: '🚨', maxLevel: 100 },
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // VOCATIONAL & ENGINEERING
  // ─────────────────────────────────────────────────────────────────────────────
  ENGINEERING: [
    { id: 'design', name: 'Engineering Design', icon: '📐', maxLevel: 100 },
    { id: 'materials', name: 'Materials', icon: '🧱', maxLevel: 100 },
    { id: 'cad', name: 'CAD', icon: '💻', maxLevel: 100 },
    { id: 'prototyping', name: 'Prototyping', icon: '🔧', maxLevel: 100 },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩', maxLevel: 100 },
    { id: 'physics_app', name: 'Applied Physics', icon: '⚙️', maxLevel: 100 },
  ],
  
  CULINARY_ARTS: [
    { id: 'knife_skills', name: 'Knife Skills', icon: '🔪', maxLevel: 100 },
    { id: 'cooking_methods', name: 'Cooking Methods', icon: '🍳', maxLevel: 100 },
    { id: 'baking', name: 'Baking', icon: '🍰', maxLevel: 100 },
    { id: 'food_safety', name: 'Food Safety', icon: '🧤', maxLevel: 100 },
    { id: 'presentation', name: 'Plating', icon: '🍽️', maxLevel: 100 },
    { id: 'cuisine', name: 'World Cuisines', icon: '🌍', maxLevel: 100 },
  ],
  
  AUTOMOTIVE: [
    { id: 'engine', name: 'Engine Systems', icon: '🔧', maxLevel: 100 },
    { id: 'electrical', name: 'Electrical Systems', icon: '⚡', maxLevel: 100 },
    { id: 'diagnostics', name: 'Diagnostics', icon: '🔍', maxLevel: 100 },
    { id: 'maintenance', name: 'Maintenance', icon: '🛠️', maxLevel: 100 },
    { id: 'safety', name: 'Safety', icon: '🛡️', maxLevel: 100 },
  ],
  
  WOODWORKING: [
    { id: 'hand_tools', name: 'Hand Tools', icon: '🔨', maxLevel: 100 },
    { id: 'power_tools', name: 'Power Tools', icon: '⚡', maxLevel: 100 },
    { id: 'joinery', name: 'Joinery', icon: '🪵', maxLevel: 100 },
    { id: 'finishing', name: 'Finishing', icon: '🎨', maxLevel: 100 },
    { id: 'design', name: 'Design', icon: '📐', maxLevel: 100 },
  ],
  
  ARCHITECTURE: [
    { id: 'design', name: 'Architectural Design', icon: '🏛️', maxLevel: 100 },
    { id: 'drafting', name: 'Drafting', icon: '📐', maxLevel: 100 },
    { id: 'cad', name: 'CAD/BIM', icon: '💻', maxLevel: 100 },
    { id: 'history', name: 'Architectural History', icon: '📜', maxLevel: 100 },
    { id: 'sustainability', name: 'Sustainable Design', icon: '🌿', maxLevel: 100 },
    { id: 'structures', name: 'Structures', icon: '🏗️', maxLevel: 100 },
  ],
};
```

### Skill Progression

```typescript
export function updateSkill(
  currentValue: number,
  activityType: 'lesson' | 'homework' | 'quiz',
  score: number,  // 0-100
  difficulty: number  // 1-100
): { newValue: number; gained: number } {
  // Base skill gain
  let baseGain = 0;
  
  switch (activityType) {
    case 'lesson':
      baseGain = 2;  // Just attending gives small gain
      break;
    case 'homework':
      baseGain = score >= 80 ? 5 : score >= 60 ? 3 : 1;
      break;
    case 'quiz':
      baseGain = score >= 90 ? 8 : score >= 70 ? 5 : score >= 50 ? 3 : 1;
      break;
  }
  
  // Adjust for difficulty
  const difficultyMultiplier = 0.5 + (difficulty / 100);
  
  // Diminishing returns at higher levels
  const diminishingFactor = 1 - (currentValue / 150);  // Slower above 66%
  
  const finalGain = Math.max(1, Math.round(baseGain * difficultyMultiplier * diminishingFactor));
  const newValue = Math.min(100, currentValue + finalGain);
  
  return {
    newValue,
    gained: newValue - currentValue,
  };
}
```

---

## 6. Achievement System

### Achievement Categories

```typescript
export type AchievementCategory =
  | 'streak'
  | 'level'
  | 'homework'
  | 'quiz'
  | 'skill'
  | 'social'
  | 'special'
  | 'hidden';
```

### Complete Achievement List

```typescript
export const ACHIEVEMENTS: Achievement[] = [
  // ==================== STREAK ACHIEVEMENTS ====================
  {
    id: 'streak_3',
    name: 'First Flame',
    description: 'Maintain a 3-day study streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'COMMON',
    conditionType: 'streak_days',
    conditionValue: 3,
    xpReward: 25,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'COMMON',
    conditionType: 'streak_days',
    conditionValue: 7,
    xpReward: 75,
  },
  {
    id: 'streak_14',
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day study streak',
    icon: '🔥🔥',
    category: 'streak',
    rarity: 'UNCOMMON',
    conditionType: 'streak_days',
    conditionValue: 14,
    xpReward: 150,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day study streak',
    icon: '🌟🔥',
    category: 'streak',
    rarity: 'RARE',
    conditionType: 'streak_days',
    conditionValue: 30,
    xpReward: 400,
    unlocksTitle: 'Dedicated',
  },
  {
    id: 'streak_60',
    name: 'Discipline Disciple',
    description: 'Maintain a 60-day study streak',
    icon: '💎🔥',
    category: 'streak',
    rarity: 'EPIC',
    conditionType: 'streak_days',
    conditionValue: 60,
    xpReward: 800,
    unlocksFrame: 'flame_border',
  },
  {
    id: 'streak_100',
    name: 'Century Streak',
    description: 'Maintain a 100-day study streak',
    icon: '👑🔥',
    category: 'streak',
    rarity: 'LEGENDARY',
    conditionType: 'streak_days',
    conditionValue: 100,
    xpReward: 1500,
    unlocksTitle: 'Unstoppable',
    unlocksFrame: 'legendary_flame',
  },
  {
    id: 'streak_365',
    name: 'Year of Dedication',
    description: 'Maintain a 365-day study streak',
    icon: '🏆👑🔥',
    category: 'streak',
    rarity: 'MYTHIC',
    conditionType: 'streak_days',
    conditionValue: 365,
    xpReward: 5000,
    unlocksTitle: 'The Devoted',
    unlocksFrame: 'mythic_flame',
    unlocksBadge: 'year_badge',
  },
  
  // ==================== LEVEL ACHIEVEMENTS ====================
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    category: 'level',
    rarity: 'COMMON',
    conditionType: 'level_reached',
    conditionValue: 5,
    xpReward: 50,
  },
  {
    id: 'level_10',
    name: 'Double Digits',
    description: 'Reach Level 10',
    icon: '🌟',
    category: 'level',
    rarity: 'COMMON',
    conditionType: 'level_reached',
    conditionValue: 10,
    xpReward: 100,
  },
  {
    id: 'level_25',
    name: 'Quarter Century',
    description: 'Reach Level 25',
    icon: '✨',
    category: 'level',
    rarity: 'UNCOMMON',
    conditionType: 'level_reached',
    conditionValue: 25,
    xpReward: 250,
  },
  {
    id: 'level_50',
    name: 'Halfway Hero',
    description: 'Reach Level 50',
    icon: '💫',
    category: 'level',
    rarity: 'RARE',
    conditionType: 'level_reached',
    conditionValue: 50,
    xpReward: 500,
    unlocksFrame: 'golden_border',
  },
  {
    id: 'level_75',
    name: 'Elite Learner',
    description: 'Reach Level 75',
    icon: '🌠',
    category: 'level',
    rarity: 'EPIC',
    conditionType: 'level_reached',
    conditionValue: 75,
    xpReward: 750,
    unlocksTitle: 'Elite',
  },
  {
    id: 'level_100',
    name: 'Maximum Level',
    description: 'Reach Level 100',
    icon: '👑',
    category: 'level',
    rarity: 'LEGENDARY',
    conditionType: 'level_reached',
    conditionValue: 100,
    xpReward: 1500,
    unlocksTitle: 'The Maxed',
    unlocksFrame: 'legendary_crown',
  },
  
  // ==================== HOMEWORK ACHIEVEMENTS ====================
  {
    id: 'hw_first',
    name: 'First Steps',
    description: 'Complete your first homework',
    icon: '📝',
    category: 'homework',
    rarity: 'COMMON',
    conditionType: 'homework_count',
    conditionValue: 1,
    xpReward: 25,
  },
  {
    id: 'hw_10',
    name: 'Homework Habit',
    description: 'Complete 10 homeworks',
    icon: '📚',
    category: 'homework',
    rarity: 'COMMON',
    conditionType: 'homework_count',
    conditionValue: 10,
    xpReward: 100,
  },
  {
    id: 'hw_perfect_first',
    name: 'Perfectionist',
    description: 'Get 100% on a homework',
    icon: '💯',
    category: 'homework',
    rarity: 'UNCOMMON',
    conditionType: 'homework_perfect',
    conditionValue: 1,
    xpReward: 100,
  },
  {
    id: 'hw_perfect_10',
    name: 'Perfect Ten',
    description: 'Get 100% on 10 homeworks',
    icon: '🌟💯',
    category: 'homework',
    rarity: 'RARE',
    conditionType: 'homework_perfect',
    conditionValue: 10,
    xpReward: 300,
  },
  {
    id: 'hw_streak_10',
    name: 'On Time Every Time',
    description: 'Submit 10 homeworks on time in a row',
    icon: '⏰',
    category: 'homework',
    rarity: 'UNCOMMON',
    conditionType: 'homework_ontime_streak',
    conditionValue: 10,
    xpReward: 200,
  },
  {
    id: 'hw_100',
    name: 'Homework Hero',
    description: 'Complete 100 homeworks',
    icon: '🦸📚',
    category: 'homework',
    rarity: 'EPIC',
    conditionType: 'homework_count',
    conditionValue: 100,
    xpReward: 750,
    unlocksTitle: 'Homework Hero',
  },
  
  // ==================== QUIZ ACHIEVEMENTS ====================
  {
    id: 'quiz_first',
    name: 'Quiz Taker',
    description: 'Complete your first quiz',
    icon: '❓',
    category: 'quiz',
    rarity: 'COMMON',
    conditionType: 'quiz_count',
    conditionValue: 1,
    xpReward: 30,
  },
  {
    id: 'quiz_perfect_first',
    name: 'Flawless Victory',
    description: 'Get 100% on a quiz',
    icon: '🎯',
    category: 'quiz',
    rarity: 'UNCOMMON',
    conditionType: 'quiz_perfect',
    conditionValue: 1,
    xpReward: 125,
  },
  {
    id: 'quiz_perfect_5',
    name: 'Quiz Master',
    description: 'Get 100% on 5 quizzes',
    icon: '🎯🎯',
    category: 'quiz',
    rarity: 'RARE',
    conditionType: 'quiz_perfect',
    conditionValue: 5,
    xpReward: 300,
  },
  {
    id: 'boss_first',
    name: 'Boss Slayer',
    description: 'Defeat your first Boss Battle',
    icon: '⚔️',
    category: 'quiz',
    rarity: 'UNCOMMON',
    conditionType: 'boss_defeated',
    conditionValue: 1,
    xpReward: 200,
  },
  {
    id: 'boss_perfect',
    name: 'Flawless Boss Kill',
    description: 'Defeat a Boss with 100%',
    icon: '⚔️👑',
    category: 'quiz',
    rarity: 'EPIC',
    conditionType: 'boss_perfect',
    conditionValue: 1,
    xpReward: 500,
    unlocksTitle: 'Boss Crusher',
  },
  {
    id: 'boss_10',
    name: 'Raid Leader',
    description: 'Defeat 10 Boss Battles',
    icon: '🏆⚔️',
    category: 'quiz',
    rarity: 'LEGENDARY',
    conditionType: 'boss_defeated',
    conditionValue: 10,
    xpReward: 1000,
    unlocksFrame: 'boss_border',
  },
  
  // ==================== SKILL ACHIEVEMENTS (PER SUBJECT) ====================
  {
    id: 'skill_80',
    name: 'Skill Specialist',
    description: 'Reach 80% in any skill',
    icon: '📊',
    category: 'skill',
    rarity: 'UNCOMMON',
    conditionType: 'skill_level',
    conditionValue: 80,
    xpReward: 200,
  },
  {
    id: 'skill_master',
    name: 'Skill Master',
    description: 'Max out any skill (100%)',
    icon: '🏆📊',
    category: 'skill',
    rarity: 'RARE',
    conditionType: 'skill_level',
    conditionValue: 100,
    xpReward: 500,
  },
  {
    id: 'polyglot',
    name: 'Subject Polyglot',
    description: 'Reach 80% in all skills of a subject',
    icon: '🌍',
    category: 'skill',
    rarity: 'LEGENDARY',
    conditionType: 'all_skills_level',
    conditionValue: 80,
    xpReward: 1500,
    unlocksTitle: 'Polyglot',
  },
  
  // ==================== GRADE ACHIEVEMENTS ====================
  {
    id: 'grade_c',
    name: 'Making Progress',
    description: 'Reach Grade C',
    icon: '📗',
    category: 'level',
    rarity: 'COMMON',
    conditionType: 'grade_reached',
    conditionValue: 'C',
    xpReward: 50,
  },
  {
    id: 'grade_b',
    name: 'Getting Better',
    description: 'Reach Grade B',
    icon: '📙',
    category: 'level',
    rarity: 'UNCOMMON',
    conditionType: 'grade_reached',
    conditionValue: 'B',
    xpReward: 100,
  },
  {
    id: 'grade_a',
    name: 'Excellence',
    description: 'Reach Grade A',
    icon: '⭐',
    category: 'level',
    rarity: 'RARE',
    conditionType: 'grade_reached',
    conditionValue: 'A',
    xpReward: 250,
  },
  {
    id: 'grade_s',
    name: 'Outstanding',
    description: 'Reach Grade S',
    icon: '🌟',
    category: 'level',
    rarity: 'EPIC',
    conditionType: 'grade_reached',
    conditionValue: 'S',
    xpReward: 500,
    unlocksTitle: 'Outstanding',
  },
  {
    id: 'grade_s_plus',
    name: 'Legendary Status',
    description: 'Reach Grade S+',
    icon: '👑',
    category: 'level',
    rarity: 'LEGENDARY',
    conditionType: 'grade_reached',
    conditionValue: 'S+',
    xpReward: 1000,
    unlocksTitle: 'Legendary',
    unlocksFrame: 'legendary_grade',
  },
  
  // ==================== SOCIAL ACHIEVEMENTS ====================
  {
    id: 'social_first_follow',
    name: 'Making Friends',
    description: 'Follow your first classmate',
    icon: '👥',
    category: 'social',
    rarity: 'COMMON',
    conditionType: 'following_count',
    conditionValue: 1,
    xpReward: 25,
  },
  {
    id: 'social_10_followers',
    name: 'Popular',
    description: 'Get 10 followers',
    icon: '🌟👥',
    category: 'social',
    rarity: 'UNCOMMON',
    conditionType: 'followers_count',
    conditionValue: 10,
    xpReward: 200,
  },
  {
    id: 'social_top10_weekly',
    name: 'Top 10',
    description: 'Reach Top 10 on weekly leaderboard',
    icon: '🏅',
    category: 'social',
    rarity: 'RARE',
    conditionType: 'leaderboard_rank',
    conditionValue: 10,
    xpReward: 300,
  },
  {
    id: 'social_first_place',
    name: 'Number One',
    description: 'Reach #1 on any leaderboard',
    icon: '🥇',
    category: 'social',
    rarity: 'LEGENDARY',
    conditionType: 'leaderboard_rank',
    conditionValue: 1,
    xpReward: 1000,
    unlocksTitle: 'Champion',
    unlocksFrame: 'champion_crown',
  },
  
  // ==================== HIDDEN ACHIEVEMENTS ====================
  {
    id: 'hidden_night_owl',
    name: 'Night Owl',
    description: 'Study after midnight',
    icon: '🦉',
    category: 'hidden',
    rarity: 'UNCOMMON',
    conditionType: 'study_time',
    conditionValue: 0,  // midnight
    xpReward: 100,
    isHidden: true,
  },
  {
    id: 'hidden_early_bird',
    name: 'Early Bird',
    description: 'Study before 6 AM',
    icon: '🐦',
    category: 'hidden',
    rarity: 'UNCOMMON',
    conditionType: 'study_time',
    conditionValue: 6,
    xpReward: 100,
    isHidden: true,
  },
  {
    id: 'hidden_marathon',
    name: 'Study Marathon',
    description: 'Study for 5 hours in one day',
    icon: '🏃',
    category: 'hidden',
    rarity: 'RARE',
    conditionType: 'daily_study_hours',
    conditionValue: 5,
    xpReward: 300,
    isHidden: true,
  },
  {
    id: 'hidden_comeback',
    name: 'The Comeback',
    description: 'Return after 30+ days away',
    icon: '🔄',
    category: 'hidden',
    rarity: 'UNCOMMON',
    conditionType: 'comeback_days',
    conditionValue: 30,
    xpReward: 150,
    isHidden: true,
  },
  {
    id: 'hidden_speed_demon',
    name: 'Speed Demon',
    description: 'Complete a quiz in under 2 minutes with 100%',
    icon: '⚡',
    category: 'hidden',
    rarity: 'EPIC',
    conditionType: 'quiz_speed_perfect',
    conditionValue: 120,  // seconds
    xpReward: 500,
    isHidden: true,
  },
  {
    id: 'hidden_dedicated_to_one',
    name: 'Focused Mind',
    description: 'Complete 50 lessons in a single subject',
    icon: '🎯',
    category: 'hidden',
    rarity: 'RARE',
    conditionType: 'single_subject_lessons',
    conditionValue: 50,
    xpReward: 400,
    isHidden: true,
  },
];
```

### Achievement Checker

```typescript
// packages/shared/src/gamification/achievement-checker.ts

export async function checkAchievements(
  studentId: string,
  event: {
    type: string;
    data: Record<string, any>;
  }
): Promise<Achievement[]> {
  const unlocked: Achievement[] = [];
  
  // Get student's current progress
  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      achievements: true,
      classProfiles: true,
    },
  });
  
  if (!student) return [];
  
  // Get already unlocked achievement IDs
  const unlockedIds = new Set(
    student.achievements
      .filter(a => a.isUnlocked)
      .map(a => a.achievementId)
  );
  
  // Check each achievement
  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) continue;
    
    const shouldUnlock = await evaluateCondition(
      student,
      achievement,
      event
    );
    
    if (shouldUnlock) {
      // Unlock achievement
      await db.studentAchievement.upsert({
        where: {
          studentId_achievementId_classId: {
            studentId,
            achievementId: achievement.id,
            classId: event.data.classId || null,
          },
        },
        create: {
          studentId,
          achievementId: achievement.id,
          classId: event.data.classId || null,
          isUnlocked: true,
          unlockedAt: new Date(),
        },
        update: {
          isUnlocked: true,
          unlockedAt: new Date(),
        },
      });
      
      // Award XP
      await awardXP(studentId, {
        type: 'achievement_unlock',
        baseXP: achievement.xpReward,
        bonusXP: 0,
        totalXP: achievement.xpReward,
        reason: `Achievement: ${achievement.name}`,
      });
      
      unlocked.push(achievement);
    }
  }
  
  return unlocked;
}

async function evaluateCondition(
  student: Student,
  achievement: Achievement,
  event: { type: string; data: Record<string, any> }
): Promise<boolean> {
  switch (achievement.conditionType) {
    case 'streak_days':
      return student.streakDays >= achievement.conditionValue;
    
    case 'level_reached':
      return student.overallLevel >= achievement.conditionValue;
    
    case 'homework_count':
      return event.type === 'homework_submit' && 
        await getHomeworkCount(student.id) >= achievement.conditionValue;
    
    case 'homework_perfect':
      return event.type === 'homework_submit' && 
        event.data.percentage === 100 &&
        await getPerfectHomeworkCount(student.id) >= achievement.conditionValue;
    
    case 'quiz_perfect':
      return event.type === 'quiz_complete' &&
        event.data.percentage === 100 &&
        await getPerfectQuizCount(student.id) >= achievement.conditionValue;
    
    case 'boss_defeated':
      return event.type === 'quiz_complete' &&
        event.data.isBossBattle &&
        event.data.percentage >= 60 &&
        await getBossDefeatCount(student.id) >= achievement.conditionValue;
    
    case 'grade_reached':
      return student.currentGrade === achievement.conditionValue ||
        GRADE_ORDER.indexOf(student.currentGrade) >= 
        GRADE_ORDER.indexOf(achievement.conditionValue as Grade);
    
    // ... more conditions
    
    default:
      return false;
  }
}

const GRADE_ORDER: Grade[] = ['E', 'D', 'C', 'B', 'A', 'S', 'S+'];
```

---

## 7. Leaderboard System

### Leaderboard Scopes

```typescript
export type LeaderboardScope =
  | 'global'           // All students (opt-in)
  | `school:${string}` // Within a school
  | `class:${string}`  // Within a class
  | `grade:${string}`  // Same grade year
  | `subject:${string}`; // Same subject

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all_time';
```

### Leaderboard Calculation

```typescript
// packages/shared/src/gamification/leaderboard.ts

export async function calculateLeaderboard(
  scope: LeaderboardScope,
  period: LeaderboardPeriod
): Promise<LeaderboardEntry[]> {
  const dateFilter = getDateFilter(period);
  
  let query: Prisma.StudentFindManyArgs;
  
  if (scope === 'global') {
    query = {
      where: {
        showOnLeaderboard: true,
      },
    };
  } else if (scope.startsWith('school:')) {
    const tenantId = scope.split(':')[1];
    query = {
      where: {
        user: { tenantId },
        showOnLeaderboard: true,
      },
    };
  } else if (scope.startsWith('class:')) {
    const classId = scope.split(':')[1];
    query = {
      where: {
        classEnrollments: {
          some: { classId, isActive: true },
        },
        showOnLeaderboard: true,
      },
    };
  }
  // ... more scopes
  
  // Get students with XP based on period
  const students = await db.student.findMany({
    ...query,
    select: {
      id: true,
      user: { select: { firstName: true, lastName: true } },
      avatarUrl: true,
      totalXp: true,
      overallLevel: true,
      currentGrade: true,
      // For period-specific XP, we need to calculate from activity
    },
    orderBy: { totalXp: 'desc' },
    take: 100,
  });
  
  // Calculate rankings
  return students.map((student, index) => ({
    rank: index + 1,
    studentId: student.id,
    name: `${student.user.firstName} ${student.user.lastName[0]}.`,
    avatar: student.avatarUrl,
    xp: student.totalXp,
    level: student.overallLevel,
    grade: student.currentGrade,
  }));
}

function getDateFilter(period: LeaderboardPeriod) {
  const now = new Date();
  
  switch (period) {
    case 'weekly':
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      return { gte: weekStart };
    
    case 'monthly':
      return { gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    
    case 'all_time':
    default:
      return undefined;
  }
}
```

---

## 8. Avatar & Customization System

### Avatar Styles

```typescript
export const AVATAR_STYLES = {
  CYBERPUNK: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon lights and tech vibes',
    colors: ['#00FFFF', '#FF00FF', '#FFFF00'],
    unlockedAtLevel: 1,
  },
  FANTASY: {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Magic and medieval',
    colors: ['#9B59B6', '#3498DB', '#2ECC71'],
    unlockedAtLevel: 1,
  },
  COSMIC: {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Stars and galaxies',
    colors: ['#1A1A2E', '#16213E', '#0F3460'],
    unlockedAtLevel: 10,
  },
  NATURE: {
    id: 'nature',
    name: 'Nature',
    description: 'Earth and elements',
    colors: ['#27AE60', '#8B4513', '#87CEEB'],
    unlockedAtLevel: 1,
  },
  STEAMPUNK: {
    id: 'steampunk',
    name: 'Steampunk',
    description: 'Gears and brass',
    colors: ['#B87333', '#8B4513', '#D4AF37'],
    unlockedAtLevel: 25,
  },
  MINIMAL: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple',
    colors: ['#2C3E50', '#ECF0F1', '#BDC3C7'],
    unlockedAtLevel: 1,
  },
};
```

### Profile Frames

```typescript
export const PROFILE_FRAMES = {
  // Default frames
  default: { id: 'default', name: 'Basic', requiredLevel: 0 },
  
  // Level-based frames
  bronze_border: { id: 'bronze_border', name: 'Bronze', requiredLevel: 10 },
  silver_border: { id: 'silver_border', name: 'Silver', requiredLevel: 25 },
  golden_border: { id: 'golden_border', name: 'Golden', requiredLevel: 50 },
  
  // Achievement frames
  flame_border: { 
    id: 'flame_border', 
    name: 'Flame', 
    requiredAchievement: 'streak_60' 
  },
  legendary_flame: { 
    id: 'legendary_flame', 
    name: 'Eternal Flame', 
    requiredAchievement: 'streak_100' 
  },
  boss_border: { 
    id: 'boss_border', 
    name: 'Boss Slayer', 
    requiredAchievement: 'boss_10' 
  },
  champion_crown: { 
    id: 'champion_crown', 
    name: 'Champion', 
    requiredAchievement: 'social_first_place' 
  },
  legendary_grade: { 
    id: 'legendary_grade', 
    name: 'S+ Legend', 
    requiredAchievement: 'grade_s_plus' 
  },
  legendary_crown: { 
    id: 'legendary_crown', 
    name: 'Ultimate', 
    requiredAchievement: 'level_100' 
  },
};
```

---

## 9. Grade Year Progression

When a student moves to a new grade year:

```typescript
export async function promoteToNextGrade(
  studentId: string,
  newGradeYear: GradeYear
): Promise<void> {
  const student = await db.student.findUnique({
    where: { id: studentId },
  });
  
  if (!student) throw new Error('Student not found');
  
  // Archive current grade achievements
  await db.studentAchievement.updateMany({
    where: {
      studentId,
      classId: { not: null },
    },
    data: {
      // Mark as from previous grade
    },
  });
  
  // Reset class-specific progress but keep global stats
  await db.student.update({
    where: { id: studentId },
    data: {
      gradeYear: newGradeYear,
      // Keep totalXp, overallLevel, streakDays
      // Reset class-specific stuff happens automatically with new enrollments
    },
  });
  
  // Award grade completion achievement
  await checkAchievements(studentId, {
    type: 'grade_completed',
    data: { previousGrade: student.gradeYear },
  });
  
  // Create activity feed entry
  await db.activityFeed.create({
    data: {
      studentId,
      type: 'LEVEL_UP',
      title: `Promoted to ${newGradeYear}!`,
      description: `Started a new academic year`,
      icon: '🎓',
      isPublic: true,
    },
  });
}
```

---

**End of Gamification Documentation**
