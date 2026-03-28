import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  title?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getLevelColor(level: number): string {
  if (level >= 50) return 'bg-yellow-500 text-white';
  if (level >= 40) return 'bg-orange-500 text-white';
  if (level >= 25) return 'bg-purple-500 text-white';
  if (level >= 10) return 'bg-blue-500 text-white';
  return 'bg-gray-500 text-white';
}

const sizes = {
  sm: { badge: 'h-8 w-8 text-sm', title: 'text-xs' },
  md: { badge: 'h-12 w-12 text-lg', title: 'text-sm' },
  lg: { badge: 'h-16 w-16 text-2xl', title: 'text-base' },
};

export function LevelBadge({ level, title, size = 'md', className }: LevelBadgeProps) {
  const colorClass = getLevelColor(level);
  const sizeConfig = sizes[size];

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold',
          colorClass,
          sizeConfig.badge,
        )}
      >
        {level}
      </div>
      {title && (
        <span className={cn('font-medium text-muted-foreground', sizeConfig.title)}>{title}</span>
      )}
    </div>
  );
}
