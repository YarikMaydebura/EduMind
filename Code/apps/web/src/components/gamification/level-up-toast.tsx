import { toast } from 'sonner';

import { LevelUpToastContent } from './level-up-toast-content';

export function showLevelUpToast(newLevel: number, newTitle: string | null) {
  toast.custom(
    (id) => (
      <LevelUpToastContent
        level={newLevel}
        title={newTitle}
        onDismiss={() => toast.dismiss(id)}
      />
    ),
    { duration: 5000 },
  );
}
