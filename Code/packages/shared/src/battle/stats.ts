import { BASE_STATS, MAX_STATS, SUBJECT_CONVERSIONS } from '../constants/battle.constants';
import type { Attribute, BattleAttributes, DerivedStats } from '../types/battle.types';

export function calculateBattleStats(
  subjectAverages: Record<string, number>,
  classBonus?: Partial<BattleAttributes>,
): BattleAttributes {
  const stats: BattleAttributes = { ...BASE_STATS };

  for (const conversion of SUBJECT_CONVERSIONS) {
    const avg = subjectAverages[conversion.subject];
    if (avg == null) continue;

    for (const conv of conversion.conversions) {
      const attr = conv.attribute as Attribute;
      if (attr in stats) {
        stats[attr] += Math.floor(avg * conv.multiplier);
      }
    }
  }

  if (classBonus) {
    for (const [attr, bonus] of Object.entries(classBonus) as [Attribute, number][]) {
      if (attr in stats) {
        stats[attr] += bonus;
      }
    }
  }

  for (const attr of Object.keys(stats) as Attribute[]) {
    stats[attr] = Math.min(stats[attr], MAX_STATS[attr]);
  }

  return stats;
}

export function calculateDerivedStats(stats: BattleAttributes): DerivedStats {
  return {
    critChance: Math.min(50, stats.LCK * 0.5),
    critDamage: Math.min(200, 150 + stats.LCK * 0.5),
    dodgeChance: Math.min(30, stats.SPD * 0.2),
    damageReduction: Math.min(66, (stats.DEF / (stats.DEF + 100)) * 100),
  };
}

export function calculateDamage(
  attackerATK: number,
  defenderDEF: number,
  skillPower: number,
  isCrit: boolean,
  critDamage: number,
): number {
  const baseDamage = attackerATK * (skillPower / 100);
  const reduction = defenderDEF / (defenderDEF + 100);
  let damage = baseDamage * (1 - reduction);

  if (isCrit) {
    damage *= critDamage / 100;
  }

  return Math.max(1, Math.floor(damage));
}
