# EduMind AI — Development Roadmap

## Progress Overview

| Phase | Name | Tasks | Done | Status |
|-------|------|-------|------|--------|
| 1 | Foundation | 15 | 15 | ✅ Complete |
| 2 | Core Academic | 20 | 0 | 🔴 Not Started |
| 3 | Gamification | 18 | 0 | 🔴 Not Started |
| 4 | AI Integration | 15 | 0 | 🔴 Not Started |
| 5 | Battle System | 25 | 0 | 🔴 Not Started |
| 6 | Polish & Launch | 12 | 0 | 🔴 Not Started |
| **Total** | | **105** | **15** | **14%** |

**Legend:** ✅ Done | 🟡 In Progress | 🔴 Not Started | ⏸️ Blocked

---

## Phase 1: Foundation (Week 1-2) ✅ COMPLETE

### 1.1 Project Setup
- [x] Create Turborepo monorepo with pnpm workspaces in `Code/`
- [x] Configure root `package.json` with workspaces and scripts
- [x] Setup `turbo.json` with build pipelines
- [x] Configure TypeScript (`tsconfig.base.json`, `tsconfig.nextjs.json`)
- [x] Setup ESLint & Prettier configs (with Tailwind plugin)
- [x] Add `.env.example` with all required variables
- [x] Create placeholder packages (`apps/api`, `apps/mobile`, `packages/ui`, `packages/ai`)

### 1.2 Database Package (`packages/database`)
- [x] Initialize Prisma with complete schema (30+ models, all enums)
- [x] Add battle system models (CharacterClass, BattleCharacter, Skill, Battle, etc.)
- [x] Configure PostgreSQL connection
- [x] Generate Prisma Client with hot-reload singleton
- [x] Export typed client from `packages/database/src/index.ts`
- [x] Create seed file (32 subjects, 57 achievements, skills by subject)

### 1.3 Shared Package (`packages/shared`)
- [x] Create TypeScript types (tenant, user, gamification, battle, API, auth)
- [x] Define all constants (XP values, grade config, level titles, permissions, battle stats)
- [x] Implement XP calculation utilities (`calculateHomeworkXP`, `calculateQuizXP`, `calculateStreakXP`, `calculateLessonXP`)
- [x] Implement level calculation utilities (`calculateLevel`, `xpForLevel`, `xpToNextLevel`, `getLevelTitle`)
- [x] Implement grade calculation utilities (`calculateGrade` with weighted formula)
- [x] Implement battle stat conversion utilities (`calculateBattleStats`, `calculateDerivedStats`, `calculateDamage`)
- [x] Create Zod validation schemas (auth, class, user profile)
- [x] Create error classes (AppError, NotFoundError, UnauthorizedError, ForbiddenError, ValidationError)
- [x] Create utility functions (`generateInviteCode`, `slugify`, `formatXP`, `formatDuration`)
- [x] Write unit tests for gamification formulas (37 tests, all passing)

### 1.4 Next.js App Setup (`apps/web`)
- [x] Create Next.js 14 app with App Router and TypeScript
- [x] Configure Tailwind CSS with custom grade/rarity colors
- [x] Install Shadcn/ui components (Button, Card, Input, Label, Separator, Sonner)
- [x] Setup App Router structure with role-based routes (`/t/`, `/s/`, `/p/`, `/a/`)
- [x] Configure environment variables (`.env.local`)
- [x] Create root layout with Providers (SessionProvider, QueryClient, ThemeProvider, Toaster)
- [x] Setup loading, error, and not-found boundaries

### 1.5 Authentication
- [x] Install and configure NextAuth.js v5 (beta)
- [x] Configure Microsoft OAuth provider (multi-tenant)
- [x] Configure credentials provider (email/password with bcrypt)
- [x] Create auth API routes (`/api/auth/[...nextauth]`)
- [x] Implement JWT session handling with role & tenantId
- [x] Create login page with email/password form + Microsoft OAuth
- [x] Create registration page with tenant type selection (Private Tutor / School)
- [x] Implement role-based middleware (route protection + RBAC)
- [x] Create registration API with tenant + user + role profile creation in transaction

**Phase 1 Completion:** 15/15 tasks ✅

---

## Phase 2: Core Academic System (Week 3-4)

### 2.1 Tenant & User Management
- [ ] Create tenant registration flow
- [ ] Implement tenant settings page
- [ ] Create user CRUD API endpoints
- [ ] Implement user profile page
- [ ] Create invite system (generate codes)
- [ ] Implement invite acceptance flow
- [ ] Create user list/management page (admin)
- [ ] Implement role assignment

### 2.2 Class Management
- [ ] Create class CRUD API endpoints
- [ ] Implement class creation form
- [ ] Create class list page
- [ ] Implement class detail page
- [ ] Create enrollment API endpoints
- [ ] Implement student enrollment flow
- [ ] Create class settings page
- [ ] Implement class archiving

### 2.3 Lesson System
- [ ] Create lesson CRUD API endpoints
- [ ] Implement lesson creation form
- [ ] Create lesson calendar view
- [ ] Implement lesson detail page
- [ ] Create attendance tracking API
- [ ] Implement attendance UI
- [ ] Create lesson plan association

### 2.4 Homework System
- [ ] Create homework CRUD API endpoints
- [ ] Implement homework creation form (teacher)
- [ ] Create homework list page
- [ ] Implement homework detail page
- [ ] Create submission API endpoints
- [ ] Implement submission form (student)
- [ ] Create grading interface (teacher)
- [ ] Implement XP awarding on grade
- [ ] Create homework dashboard

### 2.5 Quiz System
- [ ] Create quiz CRUD API endpoints
- [ ] Implement quiz builder UI
- [ ] Create question types (MCQ, true/false, short answer)
- [ ] Implement quiz taking interface
- [ ] Create quiz timer functionality
- [ ] Implement auto-grading for MCQ
- [ ] Create quiz results page
- [ ] Implement XP awarding
- [ ] Add boss battle flag and special UI

**Phase 2 Completion:** ___/20 tasks

---

## Phase 3: Gamification System (Week 5-6)

### 3.1 XP System
- [ ] Create XP transaction model/API
- [ ] Implement XP awarding service
- [ ] Create XP history API
- [ ] Implement XP notification toasts
- [ ] Create XP breakdown component
- [ ] Add XP animations

### 3.2 Level System
- [ ] Implement level calculation from XP
- [ ] Create level-up detection
- [ ] Implement level-up modal/animation
- [ ] Create level badge component
- [ ] Implement level progress bar
- [ ] Add title unlocking on level milestones

### 3.3 Grade System
- [ ] Implement grade calculation (weighted formula)
- [ ] Create grade display component
- [ ] Implement grade update triggers
- [ ] Create grade history tracking
- [ ] Add grade change notifications

### 3.4 Achievement System
- [ ] Create achievement checking service
- [ ] Implement all 127 achievement conditions
- [ ] Create achievement unlock API
- [ ] Implement achievement notification
- [ ] Create achievements page
- [ ] Implement achievement progress tracking
- [ ] Add achievement badges to profile

### 3.5 Streaks & Leaderboards
- [ ] Implement daily activity tracking
- [ ] Create streak calculation service
- [ ] Implement streak UI component
- [ ] Create leaderboard API (class, school, global)
- [ ] Implement leaderboard page
- [ ] Add leaderboard filters (daily, weekly, monthly)
- [ ] Create activity feed component

**Phase 3 Completion:** ___/18 tasks

---

## Phase 4: AI Integration (Week 7-8)

### 4.1 AI Service Setup
- [ ] Create AI package (`packages/ai`)
- [ ] Configure Anthropic Claude client
- [ ] Implement rate limiting
- [ ] Create usage tracking/logging
- [ ] Implement caching layer (Redis)
- [ ] Create AI cost tracking

### 4.2 Lesson Plan Generator
- [ ] Create lesson plan generation prompt
- [ ] Implement API endpoint
- [ ] Create UI for generation request
- [ ] Implement plan preview/edit
- [ ] Add plan saving to lesson

### 4.3 Homework Checker
- [ ] Create homework checking prompt
- [ ] Implement API endpoint
- [ ] Create teacher review interface
- [ ] Implement AI feedback display
- [ ] Add feedback editing capability

### 4.4 Quiz Generator
- [ ] Create quiz generation prompt
- [ ] Implement API endpoint
- [ ] Create generation parameters UI
- [ ] Implement quiz preview
- [ ] Add question editing before save

### 4.5 Student Tutor
- [ ] Create tutoring chat prompt
- [ ] Implement chat API endpoint
- [ ] Create chat UI component
- [ ] Implement context awareness (current subject)
- [ ] Add conversation history
- [ ] Implement rate limiting per student

**Phase 4 Completion:** ___/15 tasks

---

## Phase 5: Battle System (Week 9-12)

### 5.1 Character System
- [ ] Create BattleCharacter model integration
- [ ] Implement character creation API
- [ ] Create awakening flow (Level 5 trigger)
- [ ] Implement theme selection UI
- [ ] Create class proposal algorithm
- [ ] Implement class selection UI
- [ ] Create character stats calculation service
- [ ] Implement character profile page

### 5.2 Class System
- [ ] Seed all 96 classes to database
- [ ] Create class unlock checking service
- [ ] Implement class details API
- [ ] Create class preview component
- [ ] Implement passive bonus application
- [ ] Create class abilities system
- [ ] Implement class evolution checking
- [ ] Create evolution UI flow

### 5.3 Skill System
- [ ] Seed all 156 skills to database
- [ ] Create skill unlock checking service
- [ ] Implement skill learning API
- [ ] Create skill equip/unequip API
- [ ] Implement skill slot management (max 6)
- [ ] Create skills page UI
- [ ] Implement skill details modal
- [ ] Create skill unlock notifications

### 5.4 Battle Engine
- [ ] Create battle initialization service
- [ ] Implement turn order calculation
- [ ] Create action processing (attack, skill, defend, item)
- [ ] Implement damage calculation
- [ ] Create status effect system
- [ ] Implement HP/MP/STA tracking
- [ ] Create win condition checking
- [ ] Implement battle logging
- [ ] Create reward calculation

### 5.5 Battle UI
- [ ] Create battle arena component
- [ ] Implement character display (HP/MP/STA bars)
- [ ] Create action selection UI
- [ ] Implement skill selection
- [ ] Create attack animations
- [ ] Implement damage numbers
- [ ] Create status effect indicators
- [ ] Implement battle log display
- [ ] Create victory/defeat screens

### 5.6 PvP System
- [ ] Create matchmaking API
- [ ] Implement battle request system
- [ ] Create battle queue
- [ ] Implement daily limits tracking
- [ ] Create cooldown enforcement
- [ ] Implement PvP rankings
- [ ] Create battle history page

### 5.7 Shop & Economy
- [ ] Seed all items to database
- [ ] Create KP awarding on battles
- [ ] Implement shop API endpoints
- [ ] Create shop UI
- [ ] Implement purchase flow
- [ ] Create inventory management
- [ ] Implement item usage
- [ ] Create equipment system

**Phase 5 Completion:** ___/25 tasks

---

## Phase 6: Polish & Launch (Week 13-14)

### 6.1 Notifications
- [ ] Create notification system
- [ ] Implement push notifications (web)
- [ ] Create email notifications
- [ ] Implement notification preferences

### 6.2 Parent Dashboard
- [ ] Create parent view API
- [ ] Implement child linking
- [ ] Create progress overview
- [ ] Implement alert system

### 6.3 Analytics
- [ ] Create analytics dashboard (teacher)
- [ ] Implement class performance charts
- [ ] Create student progress tracking
- [ ] Implement AI usage reports

### 6.4 Final Polish
- [ ] Mobile responsive testing
- [ ] Performance optimization
- [ ] Error handling review
- [ ] Loading states review
- [ ] Accessibility audit
- [ ] Security audit
- [ ] Documentation update
- [ ] Deploy to production

**Phase 6 Completion:** ___/12 tasks

---

## Session Notes

### Session 1 — Date: March 12-14, 2026
**Completed:**
- Phase 1 (Foundation) — all 15 tasks
- Turborepo monorepo with pnpm workspaces, TypeScript, ESLint, Prettier
- Complete Prisma schema (30+ models) with battle system
- Shared package with types, constants, gamification/battle utils, Zod validation, error classes
- 37 unit tests for gamification formulas (all passing)
- Next.js 14 app with App Router, Tailwind, Shadcn/ui, role-based routing
- NextAuth v5 with Microsoft OAuth + credentials, RBAC middleware, registration flow

**Next Steps:**
- Phase 2: Core Academic System (tenant management, classes, lessons, homework, quizzes)

**Blockers:**
- None

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=

# AI
ANTHROPIC_API_KEY=

# Cache
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Storage
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
CLOUDFLARE_R2_BUCKET=

# Email
RESEND_API_KEY=

# Payments
PADDLE_VENDOR_ID=
PADDLE_API_KEY=
```

---

## Quick Links

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [DATABASE.md](./DATABASE.md) — Schema reference
- [BATTLE_SYSTEM.md](./BATTLE_SYSTEM.md) — Battle mechanics
- [GAMIFICATION.md](./GAMIFICATION.md) — XP/Level formulas
- [API.md](./API.md) — Endpoint reference
- [UI_SCREENS.md](./UI_SCREENS.md) — Screen designs

---

**Last Updated:** March 14, 2026
**Current Phase:** 2
**Overall Progress:** 15/105 (14%)
