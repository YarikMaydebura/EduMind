import type { Grade } from '../types/gamification.types';

export const GRADE_CONFIG: Record<
  Grade,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    icon: string;
    description: string;
  }
> = {
  E: {
    color: '#6B7280',
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    icon: '📘',
    description: 'Getting Started',
  },
  D: {
    color: '#78716C',
    bgColor: '#F5F5F4',
    borderColor: '#D6D3D1',
    icon: '📗',
    description: 'Making Progress',
  },
  C: {
    color: '#22C55E',
    bgColor: '#DCFCE7',
    borderColor: '#86EFAC',
    icon: '📕',
    description: 'Good Work',
  },
  B: {
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    borderColor: '#93C5FD',
    icon: '📙',
    description: 'Great Job',
  },
  A: {
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    borderColor: '#C4B5FD',
    icon: '⭐',
    description: 'Excellent',
  },
  S: {
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    borderColor: '#FCD34D',
    icon: '🌟',
    description: 'Outstanding',
  },
  'S+': {
    color: '#EF4444',
    bgColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    icon: '👑',
    description: 'Legendary',
  },
};

export const GRADE_THRESHOLDS: Record<Grade, number> = {
  E: 0,
  D: 50,
  C: 60,
  B: 70,
  A: 80,
  S: 90,
  'S+': 95,
};
