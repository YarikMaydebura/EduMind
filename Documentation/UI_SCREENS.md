# EduMind AI — UI/UX & Screens Documentation

## Document Info
```
Version: 1.0.0
Design System: Custom with Shadcn/ui base
Themes: 4 selectable themes
```

---

## 1. Design System

### Theme System

Users can select from 4 themes, with automatic adaptation based on user type:

```typescript
export const THEMES = {
  DARK_MODERN: {
    id: 'dark_modern',
    name: 'Dark Modern',
    description: 'GitHub/Discord style',
    targetAudience: ['teens', 'young_adults', 'developers'],
    colors: {
      background: '#0D1117',
      backgroundSecondary: '#161B22',
      backgroundTertiary: '#21262D',
      foreground: '#C9D1D9',
      foregroundMuted: '#8B949E',
      primary: '#58A6FF',
      primaryHover: '#79B8FF',
      secondary: '#238636',
      accent: '#F78166',
      border: '#30363D',
      error: '#F85149',
      warning: '#D29922',
      success: '#3FB950',
    },
  },
  
  PLAYFUL_COLORFUL: {
    id: 'playful_colorful',
    name: 'Playful',
    description: 'Duolingo style for kids',
    targetAudience: ['kids', 'young_teens'],
    colors: {
      background: '#FFFFFF',
      backgroundSecondary: '#F7F7F7',
      backgroundTertiary: '#E5E5E5',
      foreground: '#3C3C3C',
      foregroundMuted: '#777777',
      primary: '#58CC02',      // Green
      primaryHover: '#46A302',
      secondary: '#1CB0F6',    // Blue
      accent: '#FF9600',       // Orange
      border: '#E5E5E5',
      error: '#FF4B4B',
      warning: '#FFC800',
      success: '#58CC02',
      // Special colors
      xpColor: '#FFD900',
      streakColor: '#FF9600',
      levelColor: '#CE82FF',
    },
  },
  
  CORPORATE_PROFESSIONAL: {
    id: 'corporate_professional',
    name: 'Professional',
    description: 'Clean corporate style',
    targetAudience: ['teachers', 'admins', 'parents'],
    colors: {
      background: '#FFFFFF',
      backgroundSecondary: '#F8FAFC',
      backgroundTertiary: '#F1F5F9',
      foreground: '#0F172A',
      foregroundMuted: '#64748B',
      primary: '#2563EB',      // Blue
      primaryHover: '#1D4ED8',
      secondary: '#059669',    // Green
      accent: '#7C3AED',       // Purple
      border: '#E2E8F0',
      error: '#DC2626',
      warning: '#D97706',
      success: '#059669',
    },
  },
  
  WARM_FRIENDLY: {
    id: 'warm_friendly',
    name: 'Warm & Friendly',
    description: 'Soft, welcoming colors',
    targetAudience: ['universal'],
    colors: {
      background: '#FEF7ED',
      backgroundSecondary: '#FFFBF5',
      backgroundTertiary: '#FFF5E6',
      foreground: '#422006',
      foregroundMuted: '#78716C',
      primary: '#EA580C',      // Orange
      primaryHover: '#C2410C',
      secondary: '#0D9488',    // Teal
      accent: '#7C3AED',       // Purple
      border: '#FED7AA',
      error: '#DC2626',
      warning: '#D97706',
      success: '#059669',
    },
  },
};
```

### Typography

```typescript
export const TYPOGRAPHY = {
  // Headings - Geometric Sans
  heading: {
    fontFamily: "'Satoshi', 'General Sans', sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
      black: 900,
    },
  },
  
  // Body - Humanist Sans
  body: {
    fontFamily: "'Nunito', 'Source Sans Pro', sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Code - Monospace
  code: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    weights: {
      regular: 400,
      medium: 500,
    },
  },
  
  // Sizes
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
};
```

### Spacing & Layout

```typescript
export const SPACING = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

### Animation Presets

```typescript
export const ANIMATIONS = {
  // Micro-interactions
  buttonPress: {
    scale: 0.98,
    duration: 0.1,
  },
  
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  // Achievement unlock
  achievementUnlock: {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  },
  
  // XP gain
  xpGain: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  // Level up
  levelUp: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.5 },
  },
};
```

---

## 2. Component Library

### Core Components

```typescript
// Component inventory with Shadcn/ui base + custom

// Layout
- AppShell          // Main layout with sidebar
- PageHeader        // Page title + actions
- Card              // Content container
- Section           // Grouped content

// Navigation
- Sidebar           // Main navigation
- Breadcrumb        // Path navigation
- Tabs              // Content tabs
- BottomNav         // Mobile navigation

// Data Display
- DataTable         // Sortable, filterable tables
- StatCard          // Metric display
- ProgressBar       // Linear progress
- ProgressRing      // Circular progress
- Avatar            // User avatar
- Badge             // Status badges
- SkillBar          // Skill level display

// Forms
- Input             // Text input
- Select            // Dropdown
- Checkbox          // Checkboxes
- RadioGroup        // Radio buttons
- Switch            // Toggle
- DatePicker        // Date selection
- TimePicker        // Time selection
- FileUpload        // File uploads
- RichTextEditor    // WYSIWYG

// Feedback
- Toast             // Notifications
- Modal             // Dialogs
- Alert             // Inline alerts
- Tooltip           // Hover info
- Skeleton          // Loading states

// Gamification (Custom)
- XPBar             // XP progress
- LevelBadge        // Level display
- GradeBadge        // Grade (E-S+)
- AchievementCard   // Achievement display
- StreakIndicator   // Streak flame
- LeaderboardRow    // Ranking row
- SkillRadar        // Skills chart
```

### Gamification Components

```tsx
// XPBar Component
interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

// Usage
<XPBar
  currentXP={7450}
  maxXP={10000}
  level={24}
  showLabel
  size="lg"
  animated
/>

// Renders:
// ⭐ Level 24
// [████████████████░░░░] 7,450 / 10,000 XP
```

```tsx
// GradeBadge Component
interface GradeBadgeProps {
  grade: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S+';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

// Renders grade with appropriate color and icon
```

```tsx
// AchievementCard Component
interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: AchievementRarity;
    unlockedAt?: Date;
    progress?: number;
    progressMax?: number;
  };
  variant?: 'unlocked' | 'in_progress' | 'locked';
  onClick?: () => void;
}
```

```tsx
// SkillRadar Component (Spider/Radar chart for skills)
interface SkillRadarProps {
  skills: {
    name: string;
    value: number;
    maxValue: number;
  }[];
  size?: number;
  showLabels?: boolean;
  animated?: boolean;
}
```

---

## 3. Screen Inventory

### Authentication Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Welcome | `/` | Landing page |
| Login | `/login` | Email/password + OAuth |
| Register | `/register` | New account creation |
| Forgot Password | `/forgot-password` | Password reset request |
| Reset Password | `/reset-password` | New password entry |
| Join via Invite | `/join/:code` | Student/parent invite |

### Teacher Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `/t/dashboard` | Overview, schedule, alerts |
| Calendar | `/t/calendar` | Lesson calendar |
| Classes List | `/t/classes` | All classes |
| Class Detail | `/t/classes/:id` | Class overview, students |
| Class Students | `/t/classes/:id/students` | Student list |
| Class Analytics | `/t/classes/:id/analytics` | Class performance |
| Lesson Detail | `/t/lessons/:id` | Lesson view/edit |
| Create Lesson | `/t/classes/:id/lessons/new` | New lesson form |
| Homework List | `/t/homework` | All homework |
| Homework Detail | `/t/homework/:id` | View submissions |
| Create Homework | `/t/classes/:id/homework/new` | New homework |
| Quiz List | `/t/quizzes` | All quizzes |
| Quiz Detail | `/t/quizzes/:id` | Quiz results |
| Create Quiz | `/t/classes/:id/quizzes/new` | New quiz |
| Student Profile | `/t/students/:id` | Student detail view |
| AI Assistant | `/t/ai` | AI tools hub |
| Messages | `/t/messages` | Communication |
| Settings | `/t/settings` | Account settings |

### Student Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `/s/dashboard` | Overview, goals, classes |
| Class View | `/s/classes/:id` | Class stats, skills |
| Homework List | `/s/homework` | Assigned homework |
| Homework Detail | `/s/homework/:id` | Do homework |
| Quiz List | `/s/quizzes` | Available quizzes |
| Quiz Attempt | `/s/quizzes/:id/attempt` | Taking quiz |
| Quiz Result | `/s/quizzes/:id/result` | Quiz results |
| Profile | `/s/profile` | My profile |
| Achievements | `/s/achievements` | All achievements |
| Leaderboard | `/s/leaderboard` | Rankings |
| Friends | `/s/friends` | Following/followers |
| AI Tutor | `/s/tutor` | AI chat help |
| Settings | `/s/settings` | Preferences |

### Parent Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `/p/dashboard` | Children overview |
| Child Detail | `/p/children/:id` | Child stats |
| Child Report | `/p/children/:id/report` | Detailed report |
| Messages | `/p/messages` | Teacher communication |
| Settings | `/p/settings` | Preferences |

### Admin Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `/a/dashboard` | School overview |
| Teachers | `/a/teachers` | Teacher management |
| Students | `/a/students` | Student management |
| Classes | `/a/classes` | Class management |
| Analytics | `/a/analytics` | School analytics |
| AI Usage | `/a/ai-usage` | AI consumption |
| Settings | `/a/settings` | School settings |
| Billing | `/a/billing` | Subscription |

---

## 4. Key Screen Wireframes

### Student Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ┌─────┐                                          🔔 3    🏆 #12    [Avatar]   │
│  │Logo │  EduMind                                 Notifications  Rank          │
├──┴─────┴────────────────────────────────────────────────────────────────────────┤
│  │                                                                              │
│  │ 📚 Dashboard         ┌───────────────────────────────────────────────────┐  │
│  │ 📖 My Classes        │                                                   │  │
│  │ 📝 Homework          │   [AVATAR]    ANNA PETRENKO                       │  │
│  │ ❓ Quizzes           │                                                   │  │
│  │ 🏆 Achievements      │   ⭐ LEVEL 24 — Grammar Guardian                  │  │
│  │ 📊 Leaderboard       │   ████████████████████░░░░░  7,450 / 10,000 XP    │  │
│  │ 👥 Friends           │                                                   │  │
│  │ 🤖 AI Tutor          │   🔥 18 Day Streak    🏆 23/48 Achievements       │  │
│  │ ⚙️ Settings          │   📚 Grade: B                                     │  │
│  │                      │                                                   │  │
│  │                      └───────────────────────────────────────────────────┘  │
│  │                                                                              │
│  │                      ════════════════════════════════════════════════════   │
│  │                      📚 MY CLASSES                                          │
│  │                      ════════════════════════════════════════════════════   │
│  │                                                                              │
│  │                      ┌─────────────────┐  ┌─────────────────┐               │
│  │                      │ 🇬🇧 ENGLISH     │  │ 📐 MATHEMATICS  │               │
│  │                      │                 │  │                 │               │
│  │                      │ ⭐ Level 12     │  │ ⭐ Level 8      │               │
│  │                      │ ██████████░░░░  │  │ ████████░░░░░░  │               │
│  │                      │ 2,450 XP        │  │ 1,800 XP        │               │
│  │                      │                 │  │                 │               │
│  │                      │ Grade: A        │  │ Grade: B        │               │
│  │                      │ 🏆 5 achiev.    │  │ 🏆 3 achiev.    │               │
│  │                      │                 │  │                 │               │
│  │                      │ [View →]        │  │ [View →]        │               │
│  │                      └─────────────────┘  └─────────────────┘               │
│  │                                                                              │
│  │                      ════════════════════════════════════════════════════   │
│  │                      📋 TODAY'S TASKS                                       │
│  │                      ════════════════════════════════════════════════════   │
│  │                                                                              │
│  │                      ┌───────────────────────────────────────────────────┐  │
│  │                      │ ☐ Complete English homework      Due: Today       │  │
│  │                      │   Past Perfect Practice          +50 XP           │  │
│  │                      ├───────────────────────────────────────────────────┤  │
│  │                      │ ☐ Take Math quiz                 Available now    │  │
│  │                      │   Fractions Review               +100 XP          │  │
│  │                      ├───────────────────────────────────────────────────┤  │
│  │                      │ ✓ Attend English lesson          Completed ✓      │  │
│  │                      │   Grammar class                  +50 XP earned    │  │
│  │                      └───────────────────────────────────────────────────┘  │
│  │                                                                              │
└──┴──────────────────────────────────────────────────────────────────────────────┘
```

### Class Stats Page (Student)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  🇬🇧 ENGLISH CLASS                                                        │  │
│  │  Teacher: John Smith                                                      │  │
│  │                                                                           │  │
│  │  ⭐ CLASS LEVEL 12 — Grammar Apprentice                                   │  │
│  │  ████████████████████░░░░░░░░░░  2,450 / 3,000 XP                        │  │
│  │                                                                           │  │
│  │  Grade: A     🔥 12 lesson streak     📚 18/24 lessons                    │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ════════════════════════════════════════════════════════════════════════════   │
│  📊 SKILLS                                                                      │
│  ════════════════════════════════════════════════════════════════════════════   │
│                                                                                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│  │
│  │  │ 📖      │ │ 📝      │ │ 🗣️      │ │ 👂      │ │ ✍️      │ │ 📚      ││  │
│  │  │Grammar  │ │ Vocab   │ │Speaking │ │Listening│ │Writing  │ │Reading  ││  │
│  │  │         │ │         │ │         │ │         │ │         │ │         ││  │
│  │  │   80    │ │   72    │ │   35    │ │   48    │ │   58    │ │   65    ││  │
│  │  │  ████   │ │  ███░   │ │  ██░░   │ │  ██░░   │ │  ███░   │ │  ███░   ││  │
│  │  │         │ │         │ │         │ │         │ │         │ │         ││  │
│  │  │  +5↑    │ │  +8↑    │ │  +2↑    │ │  +4↑    │ │  +3↑    │ │  +6↑    ││  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘│  │
│  │                                                                           │  │
│  │  💡 TIP: Speaking and Listening need more practice!                       │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ┌───────────────────────┐  ┌───────────────────────────────────────────────┐  │
│  │  🏆 CLASS ACHIEVEMENTS │  │  📈 PROGRESS CHART                            │  │
│  │                       │  │                                               │  │
│  │  ✓ First Lesson       │  │  [Line chart showing skills over time]        │  │
│  │  ✓ Perfect Homework   │  │                                               │  │
│  │  ✓ 10 Lessons         │  │  Grammar ───────                              │  │
│  │  ○ Grammar Master     │  │  Vocab   - - - -                              │  │
│  │  ○ Quiz Champion      │  │  Speaking ·······                             │  │
│  │                       │  │                                               │  │
│  │  [View All →]         │  │                                               │  │
│  └───────────────────────┘  └───────────────────────────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Teacher Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  EduMind AI                                      🔔 5  👤 John Smith  [EN ▼]   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  │                                                                              │
│  │ 📊 Dashboard         Good morning, John! 👋                                 │
│  │ 📅 Calendar          You have 4 lessons today                               │
│  │ 📚 Classes           ─────────────────────────────────────────────────────  │
│  │ 📝 Homework                                                                  │
│  │ ❓ Quizzes           ┌─────────────────────────────────────────────────────┐│
│  │ 👨‍🎓 Students          │  📅 TODAY'S SCHEDULE                                ││
│  │ 🤖 AI Tools          │                                                     ││
│  │ 💬 Messages          │  09:00  🔵 Class 7A - English     [▶ Start Lesson] ││
│  │ ⚙️ Settings          │         Past Perfect Tense                          ││
│  │                      │                                                     ││
│  │                      │  10:30  🟢 Anna Petrenko (1:1)    [▶ Start]        ││
│  │                      │         Speaking Practice                           ││
│  │                      │                                                     ││
│  │                      │  14:00  🔵 Class 8B - English     [▶ Start]        ││
│  │                      │         Conditionals                                ││
│  │                      │                                                     ││
│  │                      │  16:00  🟢 Oleg K. (1:1)          [▶ Start]        ││
│  │                      │         Python Functions                            ││
│  │                      └─────────────────────────────────────────────────────┘│
│  │                                                                              │
│  │                      ┌──────────────────┐  ┌────────────────────────────┐   │
│  │                      │  📊 QUICK STATS  │  │  ⚠️ NEEDS ATTENTION        │   │
│  │                      │                  │  │                            │   │
│  │                      │  Students: 47    │  │  • 3 unchecked homeworks   │   │
│  │                      │  Classes: 4      │  │  • 2 students struggling   │   │
│  │                      │  Avg Score: 76%  │  │  • 1 quiz to review        │   │
│  │                      │                  │  │                            │   │
│  │                      │  [Analytics →]   │  │  [View Details →]          │   │
│  │                      └──────────────────┘  └────────────────────────────┘   │
│  │                                                                              │
│  │                      ┌─────────────────────────────────────────────────────┐│
│  │                      │  🤖 AI QUICK ACTIONS                                ││
│  │                      │                                                     ││
│  │                      │  [🎯 Generate Quiz]  [📝 Create Homework]           ││
│  │                      │  [📋 Lesson Plan]    [💬 AI Assistant]              ││
│  │                      └─────────────────────────────────────────────────────┘│
│  │                                                                              │
└──┴──────────────────────────────────────────────────────────────────────────────┘
```

### Achievement Unlock Modal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│                              ╔═══════════════════════╗                          │
│                              ║                       ║                          │
│                              ║   🎉 ACHIEVEMENT! 🎉  ║                          │
│                              ║                       ║                          │
│                              ╚═══════════════════════╝                          │
│                                                                                  │
│                                    ┌─────────┐                                  │
│                                    │         │                                  │
│                                    │   🔥    │  ← Animated icon                 │
│                                    │         │                                  │
│                                    └─────────┘                                  │
│                                                                                  │
│                              WEEK WARRIOR                                        │
│                                                                                  │
│                          Maintain a 7-day streak                                │
│                                                                                  │
│                              ┌───────────────┐                                  │
│                              │   +75 XP      │                                  │
│                              └───────────────┘                                  │
│                                                                                  │
│                           Rarity: ⬜ COMMON                                      │
│                                                                                  │
│                                                                                  │
│                    [Share 📤]              [Awesome! 🎉]                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Level Up Modal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│                              ╔═══════════════════════╗                          │
│                              ║                       ║                          │
│                              ║   ⬆️ LEVEL UP! ⬆️     ║                          │
│                              ║                       ║                          │
│                              ╚═══════════════════════╝                          │
│                                                                                  │
│                                    ┌─────────┐                                  │
│                                    │         │                                  │
│                                    │   ⭐    │  ← Glowing animation             │
│                                    │   25    │                                  │
│                                    └─────────┘                                  │
│                                                                                  │
│                         You reached Level 25!                                   │
│                                                                                  │
│                              "ADEPT"                                            │
│                                                                                  │
│                              ┌───────────────┐                                  │
│                              │   +100 XP     │                                  │
│                              └───────────────┘                                  │
│                                                                                  │
│                          🎁 REWARDS UNLOCKED:                                   │
│                          • New profile frame                                    │
│                          • "Adept" title available                             │
│                                                                                  │
│                              [Continue →]                                       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Mobile Adaptation

### Bottom Navigation (Mobile)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│                              [Main Content Area]                                │
│                                                                                  │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│     🏠          📚          📝          🏆          👤                          │
│    Home       Classes     Tasks     Achieve.    Profile                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 640px | Single column, bottom nav |
| 640-768px | Collapsible sidebar |
| 768-1024px | Compact sidebar |
| > 1024px | Full sidebar |

---

## 6. Loading & Empty States

### Loading Skeleton

```tsx
// Skeleton component for cards
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
</div>
```

### Empty States

```tsx
// No homework
<EmptyState
  icon="📝"
  title="No homework yet!"
  description="Your teacher hasn't assigned any homework. Enjoy!"
/>

// No achievements
<EmptyState
  icon="🏆"
  title="Start earning achievements"
  description="Complete lessons and homework to unlock achievements"
  action={{ label: "Go to Classes", href: "/s/classes" }}
/>
```

---

**End of UI/UX Documentation**
