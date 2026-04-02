# EduMind AI - Complete Implementation Guide

> **Purpose**: This document contains all specifications needed to build the EduMind AI frontend. Follow this guide exactly for consistent implementation.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Design System](#4-design-system)
5. [Theme System](#5-theme-system)
6. [Component Library](#6-component-library)
7. [Screen Implementations](#7-screen-implementations)
8. [Rarity System](#8-rarity-system)
9. [Animation Guidelines](#9-animation-guidelines)
10. [Responsive Design](#10-responsive-design)
11. [Implementation Checklist](#11-implementation-checklist)

---

## 1. Project Overview

**EduMind AI** is a gamified educational platform that transforms learning into an RPG adventure. Students earn XP, level up, unlock character classes, battle peers, and track achievements.

### Core Features
- 🎮 RPG-style gamification (XP, levels, classes, battles)
- 🎨 5 switchable visual themes
- ⚔️ Turn-based PvP battle system
- 🏆 Achievement and badge system
- 📚 Subject-based learning with progress tracking
- 👥 Social features (friends, leaderboards)

### Key Design Principles
- Desktop-first design (1200px+), responsive to mobile
- Card-based content organization
- Consistent sidebar navigation (180px width)
- Interactive gamification elements throughout
- Smooth animations and transitions

---

## 2. Tech Stack

```
Framework:      Next.js 14 (App Router)
Language:       TypeScript
Styling:        Tailwind CSS + CSS Variables
UI Components:  shadcn/ui (customized)
State:          React Context + Zustand
Icons:          Lucide React
Charts:         Recharts
Animations:     Framer Motion
Font Loading:   next/font
```

### Package Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^10.0.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.383.0",
    "zustand": "^4.4.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

## 3. Project Structure

```
apps/web/src/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Dashboard (home)
│   ├── globals.css             # CSS variables & base styles
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   └── (dashboard)/
│       ├── layout.tsx          # Dashboard layout with sidebar
│       ├── profile/
│       ├── character/
│       ├── classes/
│       ├── subjects/[id]/
│       ├── battle/
│       ├── achievements/
│       ├── settings/
│       ├── notifications/
│       └── onboarding/
├── components/
│   ├── ui/                     # Base UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   ├── toggle.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── dashboard/
│   │   ├── CharacterCard.tsx
│   │   ├── QuickStats.tsx
│   │   ├── DailyQuests.tsx
│   │   ├── ScheduleCard.tsx
│   │   └── ClassesGrid.tsx
│   ├── character/
│   │   ├── ClassCarousel.tsx
│   │   ├── ClassCard.tsx
│   │   └── ClassDetailModal.tsx
│   ├── battle/
│   │   ├── ArenaHub.tsx
│   │   ├── BattleScreen.tsx
│   │   ├── FighterCard.tsx
│   │   └── Leaderboard.tsx
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── FriendsList.tsx
│   │   └── ActivityFeed.tsx
│   ├── achievements/
│   │   ├── AchievementCard.tsx
│   │   ├── AchievementGrid.tsx
│   │   └── ProgressBar.tsx
│   └── shared/
│       ├── XPBar.tsx
│       ├── LevelBadge.tsx
│       ├── RarityBorder.tsx
│       ├── StatBar.tsx
│       └── NotificationItem.tsx
├── lib/
│   ├── themes.ts               # Theme configuration
│   ├── utils.ts                # Utility functions
│   └── constants.ts            # App constants
├── hooks/
│   ├── useTheme.ts
│   ├── useXP.ts
│   └── useBattle.ts
├── stores/
│   ├── themeStore.ts
│   ├── userStore.ts
│   └── battleStore.ts
└── types/
    ├── theme.ts
    ├── user.ts
    ├── character.ts
    └── battle.ts
```

---

## 4. Design System

### 4.1 Typography

```typescript
// lib/fonts.ts
import { Rajdhani, Nunito, Inter } from 'next/font/google';

export const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
});

export const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

// Orbitron for Cyberpunk theme (load from Google Fonts CDN)
```

| Theme | Font Family | Weights |
|-------|-------------|---------|
| Dark Fantasy | Rajdhani | 500, 600, 700 |
| Ghibli | Nunito | 400, 600, 700 |
| Bright | Inter | 400, 500, 600, 700 |
| Pixel | monospace (system) | - |
| Cyberpunk | Orbitron | 500, 700 |

### 4.2 Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### 4.3 Border Radius

```css
/* Per theme */
--radius-dark: 8px;
--radius-ghibli: 16px;
--radius-bright: 12px;
--radius-pixel: 0px;
--radius-cyber: 0px;
```

### 4.4 Shadows

```css
/* Card shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-glow: 0 0 20px var(--accent);
```

---

## 5. Theme System

### 5.1 Theme Configuration

```typescript
// lib/themes.ts
export type ThemeName = 'dark' | 'ghibli' | 'bright' | 'pixel' | 'cyber';

export interface Theme {
  name: ThemeName;
  label: string;
  font: string;
  colors: {
    bg: string;
    bg2: string;
    card: string;
    border: string;
    accent: string;
    accentDark: string;
    text: string;
    text2: string;
    text3: string;
    btnBg: string;
    btnText: string;
    btn2Bg: string;
    btn2Text: string;
    btn2Border: string;
    hoverBg: string;
    green: string;
    red: string;
    gold: string;
  };
  radius: string;
}

export const themes: Record<ThemeName, Theme> = {
  dark: {
    name: 'dark',
    label: 'Dark Fantasy',
    font: 'Rajdhani',
    colors: {
      bg: '#080c18',
      bg2: '#0d1525',
      card: '#0d1525',
      border: '#2a5a7a',
      accent: '#00d4ff',
      accentDark: '#00a8cc',
      text: '#e0f0ff',
      text2: '#8ab4d4',
      text3: '#506070',
      btnBg: '#00d4ff',
      btnText: '#000000',
      btn2Bg: 'transparent',
      btn2Text: '#e0f0ff',
      btn2Border: '#2a5a7a',
      hoverBg: 'rgba(0, 212, 255, 0.15)',
      green: '#40ff90',
      red: '#ff4060',
      gold: '#f0c040',
    },
    radius: '8px',
  },
  ghibli: {
    name: 'ghibli',
    label: 'Ghibli',
    font: 'Nunito',
    colors: {
      bg: '#f5efe6',
      bg2: '#ebe4d8',
      card: '#ffffff',
      border: '#a08060',
      accent: '#2d5a2d',
      accentDark: '#1e3d1e',
      text: '#1a1208',
      text2: '#4a4035',
      text3: '#7a7065',
      btnBg: '#2d5a2d',
      btnText: '#ffffff',
      btn2Bg: '#ffffff',
      btn2Text: '#1a1208',
      btn2Border: '#a08060',
      hoverBg: '#f0e8dc',
      green: '#2d5a2d',
      red: '#b84040',
      gold: '#b8860b',
    },
    radius: '16px',
  },
  bright: {
    name: 'bright',
    label: 'Bright',
    font: 'Inter',
    colors: {
      bg: '#f8fafc',
      bg2: '#f1f5f9',
      card: '#ffffff',
      border: '#94a3b8',
      accent: '#0d9488',
      accentDark: '#0a7c72',
      text: '#0f172a',
      text2: '#334155',
      text3: '#64748b',
      btnBg: '#0d9488',
      btnText: '#ffffff',
      btn2Bg: '#ffffff',
      btn2Text: '#0f172a',
      btn2Border: '#64748b',
      hoverBg: '#f1f5f9',
      green: '#10b981',
      red: '#ef4444',
      gold: '#d97706',
    },
    radius: '12px',
  },
  pixel: {
    name: 'pixel',
    label: 'Pixel',
    font: 'monospace',
    colors: {
      bg: '#0f0e1a',
      bg2: '#16152a',
      card: '#1a1a2e',
      border: '#5a5a7a',
      accent: '#f0c040',
      accentDark: '#d0a030',
      text: '#e8e8d0',
      text2: '#a0a090',
      text3: '#606050',
      btnBg: '#f0c040',
      btnText: '#000000',
      btn2Bg: 'transparent',
      btn2Text: '#e8e8d0',
      btn2Border: '#5a5a7a',
      hoverBg: 'rgba(240, 192, 64, 0.15)',
      green: '#40ff90',
      red: '#ff4060',
      gold: '#f0c040',
    },
    radius: '0px',
  },
  cyber: {
    name: 'cyber',
    label: 'Cyberpunk',
    font: 'Orbitron',
    colors: {
      bg: '#0a0a0f',
      bg2: '#12121a',
      card: '#0f0f18',
      border: 'rgba(255, 0, 255, 0.33)',
      accent: '#00ffff',
      accentDark: '#00cccc',
      text: '#e0ffff',
      text2: '#80ffff',
      text3: '#407070',
      btnBg: '#00ffff',
      btnText: '#000000',
      btn2Bg: 'transparent',
      btn2Text: '#00ffff',
      btn2Border: 'rgba(0, 255, 255, 0.33)',
      hoverBg: 'rgba(0, 255, 255, 0.1)',
      green: '#00ff88',
      red: '#ff0055',
      gold: '#ffaa00',
    },
    radius: '0px',
  },
};
```

### 5.2 CSS Variables (globals.css)

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Default to dark theme */
  --font: 'Rajdhani', sans-serif;
  --bg: #080c18;
  --bg2: #0d1525;
  --card: #0d1525;
  --border: #2a5a7a;
  --accent: #00d4ff;
  --accent-dark: #00a8cc;
  --text: #e0f0ff;
  --text2: #8ab4d4;
  --text3: #506070;
  --btn-bg: #00d4ff;
  --btn-text: #000000;
  --btn2-bg: transparent;
  --btn2-text: #e0f0ff;
  --btn2-border: #2a5a7a;
  --hover-bg: rgba(0, 212, 255, 0.15);
  --green: #40ff90;
  --red: #ff4060;
  --gold: #f0c040;
  --radius: 8px;
  
  /* Rarity colors */
  --rarity-common: #9ca3af;
  --rarity-uncommon: #22c55e;
  --rarity-rare: #3b82f6;
  --rarity-epic: #8b5cf6;
  --rarity-legendary: #f59e0b;
  --rarity-mythic: #ef4444;
}

[data-theme="dark"] {
  --font: 'Rajdhani', sans-serif;
  --bg: #080c18;
  --bg2: #0d1525;
  --card: #0d1525;
  --border: #2a5a7a;
  --accent: #00d4ff;
  --accent-dark: #00a8cc;
  --text: #e0f0ff;
  --text2: #8ab4d4;
  --text3: #506070;
  --btn-bg: #00d4ff;
  --btn-text: #000000;
  --btn2-bg: transparent;
  --btn2-text: #e0f0ff;
  --btn2-border: #2a5a7a;
  --hover-bg: rgba(0, 212, 255, 0.15);
  --radius: 8px;
}

[data-theme="ghibli"] {
  --font: 'Nunito', sans-serif;
  --bg: #f5efe6;
  --bg2: #ebe4d8;
  --card: #ffffff;
  --border: #a08060;
  --accent: #2d5a2d;
  --accent-dark: #1e3d1e;
  --text: #1a1208;
  --text2: #4a4035;
  --text3: #7a7065;
  --btn-bg: #2d5a2d;
  --btn-text: #ffffff;
  --btn2-bg: #ffffff;
  --btn2-text: #1a1208;
  --btn2-border: #a08060;
  --hover-bg: #f0e8dc;
  --radius: 16px;
}

[data-theme="bright"] {
  --font: 'Inter', sans-serif;
  --bg: #f8fafc;
  --bg2: #f1f5f9;
  --card: #ffffff;
  --border: #94a3b8;
  --accent: #0d9488;
  --accent-dark: #0a7c72;
  --text: #0f172a;
  --text2: #334155;
  --text3: #64748b;
  --btn-bg: #0d9488;
  --btn-text: #ffffff;
  --btn2-bg: #ffffff;
  --btn2-text: #0f172a;
  --btn2-border: #64748b;
  --hover-bg: #f1f5f9;
  --radius: 12px;
}

[data-theme="pixel"] {
  --font: monospace;
  --bg: #0f0e1a;
  --bg2: #16152a;
  --card: #1a1a2e;
  --border: #5a5a7a;
  --accent: #f0c040;
  --accent-dark: #d0a030;
  --text: #e8e8d0;
  --text2: #a0a090;
  --text3: #606050;
  --btn-bg: #f0c040;
  --btn-text: #000000;
  --btn2-bg: transparent;
  --btn2-text: #e8e8d0;
  --btn2-border: #5a5a7a;
  --hover-bg: rgba(240, 192, 64, 0.15);
  --radius: 0px;
}

[data-theme="cyber"] {
  --font: 'Orbitron', sans-serif;
  --bg: #0a0a0f;
  --bg2: #12121a;
  --card: #0f0f18;
  --border: rgba(255, 0, 255, 0.33);
  --accent: #00ffff;
  --accent-dark: #00cccc;
  --accent2: #ff00ff;
  --text: #e0ffff;
  --text2: #80ffff;
  --text3: #407070;
  --btn-bg: #00ffff;
  --btn-text: #000000;
  --btn2-bg: transparent;
  --btn2-text: #00ffff;
  --btn2-border: rgba(0, 255, 255, 0.33);
  --hover-bg: rgba(0, 255, 255, 0.1);
  --radius: 0px;
}

/* Base styles */
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
}

/* Cyberpunk special effects */
[data-theme="cyber"] .scanlines {
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

[data-theme="cyber"] .cyber-card {
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
}

[data-theme="cyber"] .glitch-text {
  animation: glitch 3s infinite;
}

@keyframes glitch {
  0%, 90%, 100% { transform: translate(0); opacity: 1; }
  91% { transform: translate(-2px, 1px); opacity: 0.8; }
  93% { transform: translate(2px, -1px); opacity: 0.9; }
  95% { transform: translate(-1px, 2px); opacity: 0.8; }
}
```

### 5.3 Theme Provider

```typescript
// components/providers/ThemeProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeName, themes } from '@/lib/themes';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('edumind-theme') as ThemeName;
    if (saved && themes[saved]) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('edumind-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

---

## 6. Component Library

### 6.1 Base Components

#### Button Component

```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold transition-all duration-200 disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--btn-bg)] text-[var(--btn-text)] border-2 border-[var(--btn-bg)] hover:opacity-90',
        secondary: 'bg-[var(--btn2-bg)] text-[var(--btn2-text)] border-2 border-[var(--btn2-border)] hover:border-[var(--accent)] hover:bg-[var(--hover-bg)]',
        danger: 'bg-transparent text-[var(--red)] border-2 border-[var(--red)] hover:bg-[var(--red)] hover:text-white',
        ghost: 'bg-transparent text-[var(--text)] hover:bg-[var(--hover-bg)]',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs rounded-[var(--radius)]',
        md: 'px-4 py-2 text-sm rounded-[var(--radius)]',
        lg: 'px-6 py-3 text-base rounded-[var(--radius)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

#### Card Component

```typescript
// components/ui/card.tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'cyber';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--card)] border-2 border-[var(--border)] rounded-[var(--radius)] p-5',
        variant === 'cyber' && 'cyber-card',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex justify-between items-center mb-4 pb-3 border-b border-[var(--border)]', className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-bold text-[var(--text)]', className)}
      {...props}
    />
  );
}
```

#### XP Bar Component

```typescript
// components/shared/XPBar.tsx
interface XPBarProps {
  current: number;
  max: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XPBar({ current, max, showText = true, size = 'md' }: XPBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={cn(
        'w-full bg-[var(--border)] rounded-full overflow-hidden',
        heights[size]
      )}>
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <p className="text-xs text-[var(--text3)] mt-1">
          {current.toLocaleString()} / {max.toLocaleString()} XP
        </p>
      )}
    </div>
  );
}
```

#### Level Badge Component

```typescript
// components/shared/LevelBadge.tsx
interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

export function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div className={cn(
      'bg-[var(--btn-bg)] text-[var(--btn-text)] rounded-full flex items-center justify-center font-bold',
      sizes[size]
    )}>
      {level}
    </div>
  );
}
```

#### Stat Bar Component

```typescript
// components/shared/StatBar.tsx
interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
}

export function StatBar({ label, value, max, color }: StatBarProps) {
  const percentage = (value / max) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--text2)] w-10 font-semibold">{label}</span>
      <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color || 'var(--accent)',
          }}
        />
      </div>
      <span className="text-xs text-[var(--text)] w-8 text-right font-bold">{value}</span>
    </div>
  );
}
```

#### Toggle Switch Component

```typescript
// components/ui/toggle.tsx
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors duration-200',
        checked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200',
          checked ? 'translate-x-7' : 'translate-x-1'
        )}
      />
    </button>
  );
}
```

### 6.2 Layout Components

#### Sidebar Component

```typescript
// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, User, Palette, BookOpen, 
  Swords, Trophy, Settings, Bell 
} from 'lucide-react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/character', icon: Palette, label: 'Character' },
  { href: '/classes', icon: BookOpen, label: 'Classes' },
  { href: '/battle', icon: Swords, label: 'Battle Arena' },
  { href: '/achievements', icon: Trophy, label: 'Achievements' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/notifications', icon: Bell, label: 'Notifications', badge: 5 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[180px] bg-[var(--bg2)] border-r border-[var(--border)] p-4 flex-shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[var(--border)]">
        <span className="text-xl">⚔️</span>
        <span className="text-lg font-bold text-[var(--accent)]">EduMind</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius)] text-sm font-semibold transition-colors relative',
                isActive
                  ? 'bg-[var(--btn-bg)] text-[var(--btn-text)]'
                  : 'text-[var(--text2)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.badge && (
                <span className="absolute right-2 bg-[var(--red)] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

---

## 7. Screen Implementations

### 7.1 Dashboard

**Route**: `/` or `/dashboard`

**Components**:
- `CharacterCard` - Avatar, level, XP bar, radar chart, battle power
- `QuickStats` - 6 stat cards (Total XP, Level, Avg Grade, Battles Won, Streak, Rank)
- `TodaySchedule` - Time-based schedule entries
- `ClassesGrid` - Subject cards with grades and XP
- `UpcomingDeadlines` - List of homework/quiz deadlines
- `DailyQuests` - Checklist with XP rewards

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Sidebar │ Character Card          │ Quick Stats (6)     │
│         ├────────────────────────┼─────────────────────┤
│         │ Today's Schedule       │ Upcoming Deadlines  │
│         ├────────────────────────┼─────────────────────┤
│         │ My Classes (Grid)      │ Daily Quests        │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Character Class Selection

**Route**: `/character`

**Components**:
- `ClassCarousel` - Horizontal scrolling row per category
- `ClassCard` - Character preview with rarity border
- `ClassDetailModal` - Full details popup on click

**Categories**: Fantasy, Anime, Cyberpunk, Military, Sci-Fi, Steampunk

**States**: Locked, Unlocked, Equipped

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Sidebar │ Page Title: Choose Your Class                │
│         ├──────────────────────────────────────────────┤
│         │ Fantasy     [Card][Card][Card][Card] →       │
│         │ Anime       [Card][Card][Card][Card] →       │
│         │ Cyberpunk   [Card][Card][Card][Card] →       │
│         │ ...                                          │
└─────────────────────────────────────────────────────────┘
```

### 7.3 Subject Page

**Route**: `/subjects/[id]`

**Components**:
- `SubjectHeader` - Icon, name, teacher, level badge, grade
- `SubjectXPBar` - Progress to next level
- `TabNavigation` - Overview, Lessons, Homework, Quizzes, Grades
- `GradeBreakdown` - Visual bars with weights
- `HomeworkList` - Pending/completed assignments
- `QuizList` - Upcoming/completed quizzes

**Tabs**:
1. **Overview**: Deadlines, grade breakdown, recent lessons, teacher info
2. **Lessons**: List of lessons with completion status
3. **Homework**: Pending and completed with XP rewards
4. **Quizzes**: Upcoming and completed with scores
5. **Grades**: Big grade display + category breakdown

### 7.4 Battle Arena

**Route**: `/battle`

**Sub-routes**:
- `/battle` - Arena Hub
- `/battle/fight/[id]` - Active Battle
- `/battle/history` - Battle History
- `/battle/leaderboard` - Rankings

**Components**:
- `ArenaHub` - Quick Match, Ranked buttons
- `FighterCard` - Your stats (HP/ATK/DEF/SPD)
- `BattleScreen` - Turn-based combat UI
- `BattleHistory` - Win/loss records
- `Leaderboard` - Top players with ranks

**Battle Screen Layout**:
```
┌─────────────────────────────────────────────────────────┐
│         OPPONENT (smaller, top)                         │
│         [Avatar] [HP Bar] [Name]                        │
│                                                         │
│         ═══════════════════════════                     │
│                Battle Arena                             │
│         ═══════════════════════════                     │
│                                                         │
│         PLAYER (larger, bottom)                         │
│         [Avatar] [HP Bar] [Name]                        │
├─────────────────────────────────────────────────────────┤
│ [Attack] [Shadow Strike] [Arise] [Defend]               │
│ [Items] [Flee]                    [Battle Log]          │
└─────────────────────────────────────────────────────────┘
```

### 7.5 Onboarding/Tutorial

**Route**: `/onboarding`

**Steps**:
1. **Welcome** - Platform introduction
2. **Theme Picker** - Interactive theme selection (changes UI)
3. **XP System** - Clickable buttons to earn demo XP
4. **Battle Demo** - Attack button simulation
5. **Ready** - Final message: "Learn and Become The Strongest!"

**Components**:
- `OnboardingProgress` - Progress bar + step dots
- `StepContent` - Content for each step
- `ThemePicker` - 5 theme preview buttons
- `XPDemo` - Interactive XP earning buttons
- `BattleDemo` - Simple attack simulation

### 7.6 Student Profile

**Route**: `/profile`

**Components**:
- `ProfileHeader` - Banner, avatar with XP ring, level badge, character class
- `StatsGrid` - 6 stats (Total XP, Level, Avg Grade, Battles Won, Streak, Rank)
- `AchievementBadges` - 6 recent badges with "See All" link
- `PersonalInfo` - Editable user details
- `FriendsList` - Online/offline status, battle button
- `ActivityFeed` - Recent XP-earning activities

### 7.7 Achievements

**Route**: `/achievements`

**Components**:
- `AchievementHeader` - Stats (Unlocked/Total/%)
- `OverallProgress` - Progress bar with milestones
- `CategoryTabs` - All, Combat, Academic, Social, Special
- `AchievementGrid` - Cards with rarity, progress, rewards
- `AchievementCard` - Icon, name, desc, progress, XP reward

**Card States**:
- **Unlocked**: Full color, glow effect, unlock date
- **Locked**: Grayscale, 50% opacity, progress bar

### 7.8 Settings

**Route**: `/settings`

**Sections**:
1. **Appearance** - Theme picker, animations toggle, compact mode
2. **Notifications** - Push, email, homework, battle, level up toggles
3. **Account** - Email, password, school, 2FA
4. **Privacy** - Profile visibility, online status, leaderboard, battle requests
5. **Sound & Audio** - Sound effects, music, volume slider
6. **Danger Zone** - Reset progress, delete account

**Components**:
- `SettingCard` - Section container
- `SettingRow` - Label, description, control
- `ThemeSelector` - Visual theme picker
- `Toggle` - On/off switches
- `VolumeSlider` - Range input

### 7.9 Notifications Center

**Route**: `/notifications`

**Components**:
- `NotificationHeader` - Mark All Read, Clear All buttons
- `FilterTabs` - All, Unread, Battles, Academic, Social, System
- `NotificationSection` - Grouped by time (Today, Yesterday, Earlier)
- `NotificationItem` - Icon, title, description, time, actions

**Notification Types**:
- ⚔️ Battle challenges/victories
- 📝 Homework reminders
- ✅ Quiz results
- 👥 Friend requests
- 🎉 Level ups
- 🏅 Achievement unlocks
- 🔥 Streak milestones
- 📈 Rank changes

**States**:
- **Unread**: Accent border, dot indicator
- **Urgent**: Pulsing animation (red border)
- **Read**: Default styling

---

## 8. Rarity System

### 8.1 Rarity Tiers

| Tier | Color | Hex | Border Width | Glow |
|------|-------|-----|--------------|------|
| Common | Gray | `#9CA3AF` | 2px | None |
| Uncommon | Green | `#22C55E` | 2px | Subtle |
| Rare | Blue | `#3B82F6` | 2px | Medium |
| Epic | Purple | `#8B5CF6` | 3px | Strong |
| Legendary | Gold | `#F59E0B` | 3px | Strong |
| Mythic | Red/Rainbow | `#EF4444` | 3px | Animated |

### 8.2 Rarity Component

```typescript
// components/shared/RarityBorder.tsx
type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

interface RarityBorderProps {
  rarity: Rarity;
  children: React.ReactNode;
  className?: string;
}

const rarityStyles: Record<Rarity, string> = {
  common: 'border-[var(--rarity-common)]',
  uncommon: 'border-[var(--rarity-uncommon)] shadow-[0_0_10px_rgba(34,197,94,0.3)]',
  rare: 'border-[var(--rarity-rare)] shadow-[0_0_15px_rgba(59,130,246,0.4)]',
  epic: 'border-[var(--rarity-epic)] border-[3px] shadow-[0_0_20px_rgba(139,92,246,0.5)]',
  legendary: 'border-[var(--rarity-legendary)] border-[3px] shadow-[0_0_25px_rgba(245,158,11,0.5)]',
  mythic: 'border-[var(--rarity-mythic)] border-[3px] animate-mythic-glow',
};

export function RarityBorder({ rarity, children, className }: RarityBorderProps) {
  return (
    <div className={cn(
      'border-2 rounded-[var(--radius)] relative overflow-hidden',
      rarityStyles[rarity],
      className
    )}>
      {rarity === 'mythic' && (
        <div className="absolute inset-0 bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 opacity-20 animate-spin-slow" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

### 8.3 CSS for Mythic Animation

```css
@keyframes mythic-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.6); }
  25% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.6); }
  50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); }
  75% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); }
}

.animate-mythic-glow {
  animation: mythic-glow 4s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}
```

---

## 9. Animation Guidelines

### 9.1 Framer Motion Variants

```typescript
// lib/animations.ts
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

### 9.2 Transition Defaults

```typescript
export const defaultTransition = {
  duration: 0.2,
  ease: 'easeOut',
};

export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};
```

### 9.3 Hover Effects

```css
/* Card hover */
.card-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Button hover */
.btn-hover:hover {
  transform: translateY(-2px);
}

/* Notification slide */
.notif-hover:hover {
  transform: translateX(4px);
}
```

---

## 10. Responsive Design

### 10.1 Breakpoints

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
```

### 10.2 Responsive Patterns

```css
/* Sidebar: Hide on mobile */
@media (max-width: 768px) {
  .sidebar { display: none; }
}

/* Stats grid: 6 → 3 → 2 columns */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}
@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Content grid: 2 → 1 columns */
.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
}
```

### 10.3 Mobile Navigation

On mobile, use a bottom navigation bar or hamburger menu:

```typescript
// components/layout/MobileNav.tsx
export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] p-2 flex justify-around md:hidden">
      <NavButton href="/" icon={Home} label="Home" />
      <NavButton href="/battle" icon={Swords} label="Battle" />
      <NavButton href="/character" icon={User} label="Character" />
      <NavButton href="/profile" icon={Trophy} label="Profile" />
      <NavButton href="/settings" icon={Settings} label="More" />
    </nav>
  );
}
```

---

## 11. Implementation Checklist

### Phase 1: Foundation
- [ ] Set up Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS with custom theme
- [ ] Add all CSS variables to globals.css
- [ ] Create ThemeProvider and useTheme hook
- [ ] Build base UI components (Button, Card, Toggle, etc.)
- [ ] Implement Sidebar and layout structure

### Phase 2: Core Screens
- [ ] Dashboard with all widgets
- [ ] Character Class Selection with carousel
- [ ] Subject Page with tabs
- [ ] Battle Arena Hub

### Phase 3: User Features
- [ ] Student Profile page
- [ ] Achievements page
- [ ] Settings page
- [ ] Notifications Center

### Phase 4: Gamification
- [ ] XP system and level calculations
- [ ] Rarity system for classes and achievements
- [ ] Battle mechanics (turn-based)
- [ ] Streak tracking

### Phase 5: Polish
- [ ] Onboarding/Tutorial flow
- [ ] Animations and transitions
- [ ] Responsive design for all screens
- [ ] Cyberpunk special effects (scanlines, glitch)

### Phase 6: Testing
- [ ] Test all 5 themes on all screens
- [ ] Verify button text visibility (especially Ghibli/Bright)
- [ ] Test responsive breakpoints
- [ ] Cross-browser testing

---

## Quick Reference

### Colors by Theme

| Theme | Background | Accent | Text | Button Text |
|-------|------------|--------|------|-------------|
| Dark | `#080c18` | `#00d4ff` | `#e0f0ff` | `#000000` |
| Ghibli | `#f5efe6` | `#2d5a2d` | `#1a1208` | `#ffffff` |
| Bright | `#f8fafc` | `#0d9488` | `#0f172a` | `#ffffff` |
| Pixel | `#0f0e1a` | `#f0c040` | `#e8e8d0` | `#000000` |
| Cyber | `#0a0a0f` | `#00ffff` | `#e0ffff` | `#000000` |

### Rarity Colors

```css
--rarity-common: #9ca3af;
--rarity-uncommon: #22c55e;
--rarity-rare: #3b82f6;
--rarity-epic: #8b5cf6;
--rarity-legendary: #f59e0b;
--rarity-mythic: #ef4444;
```

### Key Measurements

- Sidebar width: `180px`
- Card padding: `20px`
- Border radius: varies by theme (0-16px)
- Default border: `2px solid var(--border)`

---

**Document Version**: 1.0  
**Last Updated**: March 30, 2026  
**Author**: EduMind AI Team
