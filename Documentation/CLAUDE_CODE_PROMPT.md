# EduMind AI — Claude Code Implementation Prompt

## 🎯 Project Overview

You are implementing **EduMind AI** — a gamified educational platform inspired by Solo Leveling, Pokemon, and Final Fantasy. The core principle is **"STUDY = POWER"** — students who study better become stronger in the battle system.

## 📚 Documentation Files (Read ALL before starting)

Read these files in order to understand the full system:

### Core Documentation (Required Reading)
```
/docs/ARCHITECTURE.md        — System design, tech stack, auth, RBAC
/docs/DATABASE.md            — Prisma schema, 20+ models, ERD
/docs/AI_SYSTEM.md           — 6 AI features with Claude API
/docs/GAMIFICATION.md        — XP, levels, grades, activity types
/docs/API.md                 — 50+ REST endpoints
/docs/UI_SCREENS.md          — 4 themes, 35+ screens
/docs/DEVELOPMENT_GUIDE.md   — Setup, conventions, Git workflow
```

### Battle System Documentation (Required Reading)
```
/docs/BATTLE_SYSTEM.md       — Complete battle mechanics, formulas
/docs/CLASSES_COMPLETE.md    — All 96 character classes
/docs/SKILLS_COMPLETE.md     — All 156 battle skills
/docs/battle-system-schema.prisma — Database additions for battle
```

### Reference Documentation
```
/docs/SUBJECTS_SKILLS.md     — 100+ subjects with academic skills
/docs/ACHIEVEMENTS_COMPLETE.md — 127 achievements
/docs/UML_DIAGRAMS.md        — Mermaid diagrams
/docs/PLANTUML_DIAGRAMS.puml — PlantUML diagrams
/docs/prisma-seed.ts         — Seed data for subjects/achievements
```

## 🏗️ Tech Stack

```
Frontend:        Next.js 14 (App Router), React, TypeScript, Tailwind CSS
Backend:         Next.js API Routes + Express.js (separate service)
Database:        PostgreSQL (Supabase)
Cache:           Redis (Upstash)
AI:              Anthropic Claude API (Sonnet 3.5 + Haiku 3.5)
Auth:            NextAuth.js + Microsoft OAuth
Monorepo:        Turborepo
Storage:         Cloudflare R2
Payments:        Paddle
Email:           Resend
```

## 📁 Project Structure

```
edumind/
├── apps/
│   ├── web/                 # Next.js 14 frontend + API routes
│   │   ├── app/
│   │   │   ├── (auth)/      # Login, register, OAuth
│   │   │   ├── (dashboard)/ # Main app pages
│   │   │   ├── (battle)/    # Battle system pages
│   │   │   └── api/         # API routes
│   │   ├── components/
│   │   │   ├── ui/          # Base components (shadcn)
│   │   │   ├── gamification/# XP bars, level badges, etc.
│   │   │   └── battle/      # Battle UI components
│   │   └── lib/
│   │       ├── auth/        # NextAuth config
│   │       ├── db/          # Prisma client
│   │       └── ai/          # Claude API client
│   │
│   ├── api/                 # Express.js backend (optional)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   └── routes/
│   │   └── package.json
│   │
│   └── mobile/              # React Native (future)
│
├── packages/
│   ├── database/            # Prisma schema & client
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── index.ts
│   │
│   ├── shared/              # Shared types & utils
│   │   ├── src/
│   │   │   ├── types/       # TypeScript types
│   │   │   ├── constants/   # Enums, configs
│   │   │   ├── utils/       # Helper functions
│   │   │   ├── gamification/# XP calc, level calc
│   │   │   └── battle/      # Battle formulas
│   │   └── index.ts
│   │
│   ├── ui/                  # Shared UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   └── index.ts
│   │
│   └── ai/                  # AI service wrapper
│       ├── src/
│       │   ├── providers/
│       │   ├── prompts/
│       │   └── services/
│       └── index.ts
│
├── docs/                    # All documentation (copy from outputs)
├── turbo.json
├── package.json
└── README.md
```

## 🎮 Core Systems to Implement

### 1. Authentication & Multi-tenancy
- Microsoft OAuth for schools
- Email/password for private tutors
- Role-based access: Tech Admin, School Admin, Teacher, Student, Parent
- Tenant isolation (schools/tutors)

### 2. Academic System
- Classes, lessons, homework, quizzes
- Subject stats tracking (0-100% per skill)
- Boss battles (major exams)
- AI-powered content generation

### 3. Gamification System
- XP from all activities
- 100 levels with titles
- Grades E to S+
- 127 achievements
- Streaks and leaderboards

### 4. Battle System (NEW)
- Level 5 awakening (class selection)
- 96 character classes (6 themes × 6 rarities)
- 156 battle skills
- Turn-based PvP combat
- Class evolution system
- KP (Knowledge Points) economy

## 🔄 Implementation Order

Follow this order for dependencies:

### Phase 1: Foundation (Week 1-2)
1. Setup Turborepo monorepo
2. Configure packages/database with Prisma schema
3. Setup packages/shared with types
4. Configure Next.js app with auth
5. Implement base UI components

### Phase 2: Core Academic (Week 3-4)
6. Tenant & user management
7. Class & enrollment system
8. Lesson management
9. Homework system (CRUD + submissions)
10. Quiz system (including boss battles)

### Phase 3: Gamification (Week 5-6)
11. XP calculation service
12. Level & grade system
13. Achievement system
14. Streak tracking
15. Leaderboards

### Phase 4: AI Integration (Week 7-8)
16. Claude API integration
17. Lesson plan generator
18. Homework checker
19. Quiz generator
20. Student tutor chat

### Phase 5: Battle System (Week 9-12)
21. Character creation & awakening
22. Class system (96 classes)
23. Skill system (156 skills)
24. Battle engine (turn-based)
25. PvP matchmaking
26. Shop & inventory
27. Class evolution

### Phase 6: Polish (Week 13-14)
28. Notifications
29. Parent dashboard
30. Analytics
31. Mobile responsive
32. Testing & bug fixes

## 📋 Key Formulas (from documentation)

### XP Calculation
```typescript
// Homework XP
const homeworkXP = (submissionBonus) + (gradeBonus);
// submissionBonus: early=35, onTime=25, late=10
// gradeBonus: 100%=45, 90%=35, 80%=25, 70%=15, <70%=5

// Quiz XP
const quizXP = 30 + (percentage * 0.5) + (perfect ? 25 : 0) + (firstAttempt ? 15 : 0);

// Boss Battle XP
const bossXP = defeated ? (150 + scoreBonus + perfectBonus + speedBonus) : 50;
```

### Level Calculation
```typescript
const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
const xpForLevel = (level - 1) ** 2 * 100;
```

### Battle Stats from Subjects
```typescript
const stats = {
  HP: 100 + (PE * 0.8) + (History * 0.25),
  MP: 50 + (Math * 0.5) + (Science * 0.3) + (Arts * 0.35),
  STA: 50 + (PE * 0.5),
  ATK: 10 + (Math * 0.15) + (PE * 0.2),
  DEF: 10 + (Science * 0.2) + (History * 0.35),
  SPD: 10 + (Languages * 0.3),
  LCK: 5 + (Math * 0.05) + (CS * 0.1),
};
```

### Damage Calculation
```typescript
const baseDamage = (skillPower / 100) * attackerATK;
const finalDamage = baseDamage * (100 / (100 + defenderDEF));
const critDamage = isCrit ? finalDamage * (1.5 + attackerLCK * 0.005) : finalDamage;
```

## ⚠️ Important Rules

1. **Read ALL documentation before coding** — formulas and logic are specified
2. **Follow the schema exactly** — DATABASE.md has complete Prisma schema
3. **Multi-tenant first** — Every query must filter by tenantId
4. **Type everything** — Use TypeScript strictly
5. **Test battle formulas** — Balance is crucial
6. **Mobile-first UI** — Students use phones

## 🚀 Getting Started Command

```bash
# 1. Create monorepo
npx create-turbo@latest edumind

# 2. Copy all docs to /docs folder

# 3. Read this prompt + all documentation

# 4. Start with Phase 1, Step 1

# 5. Update ROADMAP.md after each task
```

## 📊 Progress Tracking

After completing each task:
1. Check it off in `/docs/ROADMAP.md`
2. Commit with message: `[Phase X] Task: description`
3. Update any blockers or notes

## 💬 Communication

When you need clarification:
1. Quote the specific section from documentation
2. Explain what's unclear
3. Propose a solution
4. Ask for confirmation

---

**START BY:**
1. Reading all /docs/*.md files
2. Creating the project structure
3. Checking off first items in ROADMAP.md
4. Implementing Phase 1, Step 1

Good luck! 🎮📚
