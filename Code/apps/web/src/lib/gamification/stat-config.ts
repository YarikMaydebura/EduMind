import { MAX_STATS } from '@edumind/shared';

export const STAT_CONFIG: Record<
  string,
  { label: string; color: string; barClass: string; max: number }
> = {
  HP:  { label: 'Health',   color: 'red',    barClass: 'bg-red-500',    max: MAX_STATS.HP },
  MP:  { label: 'Mana',     color: 'blue',   barClass: 'bg-blue-500',   max: MAX_STATS.MP },
  STA: { label: 'Stamina',  color: 'green',  barClass: 'bg-green-500',  max: MAX_STATS.STA },
  ATK: { label: 'Attack',   color: 'orange', barClass: 'bg-orange-500', max: MAX_STATS.ATK },
  DEF: { label: 'Defense',  color: 'slate',  barClass: 'bg-slate-500',  max: MAX_STATS.DEF },
  SPD: { label: 'Speed',    color: 'yellow', barClass: 'bg-yellow-500', max: MAX_STATS.SPD },
  LCK: { label: 'Luck',     color: 'purple', barClass: 'bg-purple-500', max: MAX_STATS.LCK },
};

export const STAT_KEYS = ['HP', 'MP', 'STA', 'ATK', 'DEF', 'SPD', 'LCK'] as const;
