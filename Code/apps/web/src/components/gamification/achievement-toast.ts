import { toast } from 'sonner';
import { createElement } from 'react';

import { AchievementToastContent } from './achievement-toast-content';

export function showAchievementToast(achievement: {
  name: string;
  icon: string;
  rarity: string;
  xpReward: number;
}) {
  toast.custom(
    (id) =>
      createElement(AchievementToastContent, {
        name: achievement.name,
        icon: achievement.icon,
        rarity: achievement.rarity,
        xpReward: achievement.xpReward,
        onDismiss: () => toast.dismiss(id),
      }),
    { duration: 6000 },
  );
}
