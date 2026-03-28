export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  dataThemeValue: string;
  previewColors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    foreground: string;
  };
}

export const THEME_CONFIGS: ThemeConfig[] = [
  {
    id: 'DARK_MODERN',
    name: 'Dark Modern',
    description: 'GitHub/Discord style dark theme',
    dataThemeValue: 'dark_modern',
    previewColors: {
      background: '#0D1117',
      primary: '#58A6FF',
      secondary: '#238636',
      accent: '#F78166',
      foreground: '#C9D1D9',
    },
  },
  {
    id: 'PLAYFUL_COLORFUL',
    name: 'Playful',
    description: 'Duolingo style — bright and fun',
    dataThemeValue: 'playful_colorful',
    previewColors: {
      background: '#FFFFFF',
      primary: '#58CC02',
      secondary: '#1CB0F6',
      accent: '#FF9600',
      foreground: '#3C3C3C',
    },
  },
  {
    id: 'CORPORATE_PROFESSIONAL',
    name: 'Professional',
    description: 'Clean and corporate',
    dataThemeValue: 'corporate_professional',
    previewColors: {
      background: '#FFFFFF',
      primary: '#2563EB',
      secondary: '#059669',
      accent: '#7C3AED',
      foreground: '#0F172A',
    },
  },
  {
    id: 'WARM_FRIENDLY',
    name: 'Warm & Friendly',
    description: 'Soft, welcoming colors',
    dataThemeValue: 'warm_friendly',
    previewColors: {
      background: '#FEF7ED',
      primary: '#EA580C',
      secondary: '#0D9488',
      accent: '#7C3AED',
      foreground: '#422006',
    },
  },
  {
    id: 'SYSTEM',
    name: 'System',
    description: 'Follow your OS preference',
    dataThemeValue: 'system',
    previewColors: {
      background: '#FFFFFF',
      primary: '#2563EB',
      secondary: '#059669',
      accent: '#7C3AED',
      foreground: '#0F172A',
    },
  },
];

export function themePreferenceToThemeName(pref: string): string {
  if (pref === 'SYSTEM') return 'system';
  return pref.toLowerCase();
}

export function themeNameToPreference(name: string): string {
  if (name === 'system') return 'SYSTEM';
  return name.toUpperCase();
}
