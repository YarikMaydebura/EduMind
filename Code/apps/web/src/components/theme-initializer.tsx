'use client';

import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

import { themePreferenceToThemeName } from '@/lib/themes';

export function ThemeInitializer() {
  const { setTheme } = useTheme();
  const { data: session } = useSession();
  const initialized = useRef(false);

  useEffect(() => {
    if (!session?.user || initialized.current) return;
    initialized.current = true;

    fetch('/api/users/me')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.theme && json.data.theme !== 'SYSTEM') {
          setTheme(themePreferenceToThemeName(json.data.theme));
        }
      })
      .catch(() => {});
  }, [session?.user, setTheme]);

  return null;
}
