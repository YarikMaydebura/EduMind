'use client';

import { Check, Monitor } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useThemePreference } from '@/hooks/useThemePreference';
import { THEME_CONFIGS } from '@/lib/themes';
import { cn } from '@/lib/utils';

export function ThemeSelector() {
  const { currentTheme, updateTheme, isSaving } = useThemePreference();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {THEME_CONFIGS.map((config) => {
        const isActive = currentTheme === config.dataThemeValue;
        const isSystem = config.id === 'SYSTEM';

        return (
          <Card
            key={config.id}
            className={cn(
              'cursor-pointer transition-all hover:ring-2 hover:ring-primary/50',
              isActive && 'ring-2 ring-primary',
              isSaving && 'pointer-events-none opacity-50',
            )}
            onClick={() => updateTheme(config.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isSystem && <Monitor className="h-4 w-4 text-muted-foreground" />}
                  <h3 className="font-medium">{config.name}</h3>
                </div>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{config.description}</p>

              {/* Color swatches */}
              <div className="mt-3 flex gap-2">
                {Object.entries(config.previewColors).map(([key, hex]) => (
                  <div
                    key={key}
                    className="h-6 w-6 rounded-full border border-border/50"
                    style={{ backgroundColor: hex }}
                    title={key}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
