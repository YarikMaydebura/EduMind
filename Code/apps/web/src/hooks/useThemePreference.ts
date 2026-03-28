'use client';

import { useTheme } from 'next-themes';
import { useState } from 'react';
import { toast } from 'sonner';

import { themePreferenceToThemeName } from '@/lib/themes';

export function useThemePreference() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  async function updateTheme(preference: string) {
    const themeName = themePreferenceToThemeName(preference);
    setTheme(themeName);

    setIsSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themePreference: preference }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error('Failed to save theme preference');
      }
    } catch {
      toast.error('Failed to save theme preference');
    } finally {
      setIsSaving(false);
    }
  }

  return {
    currentTheme: theme,
    resolvedTheme,
    updateTheme,
    isSaving,
  };
}
