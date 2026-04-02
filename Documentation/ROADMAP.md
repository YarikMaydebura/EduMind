# EduMind AI — Development Roadmap

## Progress Overview

| Phase | Name | Tasks | Done | Status |
|-------|------|-------|------|--------|
| 1 | Foundation | 15 | 15 | ✅ Complete |
| 2 | Core Academic | 41 | 41 | ✅ Complete |
| 3 | Gamification | 56 | 56 | ✅ Complete |
| 4 | AI Integration | 15 | 15 | ✅ Complete |
| 5 | Battle System | 25 | 24 | 🟡 In Progress |
| 6 | Polish & Launch | 12 | 0 | 🔴 Not Started |
| **Total** | | **164** | **151** | **92%** |

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

### 2.1 Tenant & User Management ✅
- [x] Create tenant registration flow
- [x] Implement tenant settings page
- [x] Create user CRUD API endpoints
- [x] Implement user profile page
- [x] Create invite system (generate codes)
- [x] Implement invite acceptance flow
- [x] Create user list/management page (admin)
- [x] Implement role assignment

### 2.2 Class Management ✅
- [x] Create class CRUD API endpoints
- [x] Implement class creation form
- [x] Create class list page
- [x] Implement class detail page
- [x] Create enrollment API endpoints
- [x] Implement student enrollment flow
- [x] Create class settings page
- [x] Implement class archiving

### 2.3 Lesson System ✅
- [x] Create lesson CRUD API endpoints
- [x] Implement lesson creation form
- [x] Create lesson list view (date-grouped, status filters)
- [x] Implement lesson detail page (teacher + student)
- [x] Create attendance tracking API with XP awarding
- [x] Implement attendance UI (mark present, participation scores)
- [x] Create lesson plan association (objectives, structure, materials)

### 2.4 Homework System ✅
- [x] Create homework CRUD API endpoints
- [x] Implement homework creation form (teacher)
- [x] Create homework list page (teacher tab + student sections)
- [x] Implement homework detail page (teacher + student)
- [x] Create submission API endpoints (submit + grade)
- [x] Implement submission form (student)
- [x] Create grading interface (teacher, with XP preview)
- [x] Implement XP awarding on grade (transaction with profile updates)
- [x] Create homework views (teacher submissions table, student pending/completed)

### 2.5 Quiz System ✅
- [x] Create quiz CRUD API endpoints
- [x] Implement quiz builder UI (multi-step dialog with question builder)
- [x] Create question types (MCQ, true/false, short answer)
- [x] Implement quiz taking interface (question-by-question with navigation)
- [x] Create quiz timer functionality (countdown with auto-submit)
- [x] Implement auto-grading for MCQ/TF/short answer
- [x] Create quiz results page (score, XP, answer breakdown)
- [x] Implement XP awarding (transaction with profile updates)
- [x] Add boss battle flag and special UI

**Phase 2 Completion:** 41/41 tasks ✅

---

## Phase 3: Gamification System (Week 5-6)

### 3.1 XP System
- [x] Create XP transaction model/API (using ActivityFeed as XP history)
- [x] Implement XP awarding service (`awardXP` helper)
- [x] Create XP history API (`/api/students/me/activity`)
- [x] Implement XP notification toasts
- [x] Create XP breakdown component (`XPDisplay`, `ActivityFeed`)
- [x] Add XP animations (level-up toast)

### 3.2 Level System
- [x] Implement level calculation from XP (already existed in shared)
- [x] Create level-up detection (in `awardXP` helper)
- [x] Implement level-up modal/animation (level-up toast on quiz submit)
- [x] Create level badge component (`LevelBadge`)
- [x] Implement level progress bar (`LevelProgress`)
- [x] Add title unlocking on level milestones (in `awardXP` helper)

### 3.3 Grade System
- [x] Implement grade calculation (weighted formula) — already existed in `calculateGrade()`
- [x] Create grade display component (`GradeDisplay` with breakdown bars)
- [x] Implement grade update triggers (`recalculateGrade` called via `awardXP` on every XP event)
- [x] Create grade history tracking (via ActivityFeed `RANK_UP` entries)
- [x] Add grade change notifications (Notification `SYSTEM` type on grade change)

### 3.4 Achievement System ✅
- [x] Create achievement checking service
- [x] Implement achievement conditions (streak, level, grade, homework, quiz, boss — 10 condition types)
- [x] Create achievement unlock API
- [x] Implement achievement notification
- [x] Create achievements page
- [x] Implement achievement progress tracking
- [x] Add achievement badges to profile

### 3.5 Streaks & Leaderboards
- [x] Implement daily activity tracking
- [x] Create streak calculation service
- [x] Implement streak UI component
- [x] Create leaderboard API (class, school, global)
- [x] Implement leaderboard page
- [x] Add leaderboard filters (daily, weekly, monthly)
- [x] Create activity feed component

### 3.6 Enhanced Homework Grading
- [x] Add rubric schema fields + validation
- [x] Update homework creation API for rubrics
- [x] Update grading API for rubric scores + enhanced response
- [x] Create full-page grading view (split layout)
- [x] Add grading form with rubric support
- [x] Add post-grading summary component
- [x] Add grading statistics to submissions tab
- [x] Add rubric editor to create homework dialog
- [x] Create AI grading placeholder service
- [x] Add rubric breakdown to student view

### 3.7 UI Overhaul (Themes, Sidebar, Animations)
- [x] Fix theme validation schema
- [x] Create theme constants module
- [x] Implement 4-theme CSS variable system
- [x] Update ThemeProvider for custom themes
- [x] Create theme initializer component
- [x] Create sidebar Zustand store
- [x] Build collapsible sidebar navigation
- [x] Build mobile sidebar drawer
- [x] Create AppShell layout (replace header)
- [x] Create animation presets + motion components
- [x] Add animated XP counter + achievement hover effects
- [x] Create animated level-up and achievement toasts
- [x] Apply page/list animations to student pages
- [x] Create theme selector component
- [x] Build settings pages (student + teacher)

### 3.8 Teacher & Admin Dashboards
- [x] Create teacher dashboard API route
- [x] Build teacher dashboard UI (stats, upcoming lessons, ungraded work)
- [x] Create admin dashboard API route
- [x] Build admin dashboard UI (school overview, capacity, user stats)
- [x] Add MotionPage/MotionList animations to both dashboards
- [x] Update ROADMAP

**Phase 3 Completion:** 56/56 tasks ✅

---

## Phase 4: AI Integration (Week 7-8)

### 4.1 AI Service Setup ✅
- [x] Create AI client (`apps/web/src/lib/ai/client.ts` — singleton)
- [x] Configure AI models and task routing (`config.ts` — advanced/fast model selection)
- [x] Implement rate limiting (`withAiRoute` middleware — tenant-level + per-student daily cap)
- [x] Create usage tracking/logging (AiGenerationLog model + automatic logging in middleware)
- [x] Implement caching layer (DB-based via `StudentAiProfile.conversationContext`; Redis deferred)
- [x] Create AI cost tracking (TOKEN_COSTS per model, auto-calculated and logged per request)

### 4.2 Lesson Plan Generator ✅
- [x] Create lesson plan generation prompt (`prompts.ts`)
- [x] Implement API endpoint (`/api/ai/lesson-plan/generate`)
- [x] Create UI for generation request (Teacher AI page + lesson plan dialog)
- [x] Implement plan preview/edit (structured preview with objectives, phases, materials)
- [x] Add AI generate button to lesson plan form

### 4.3 Homework Checker ✅
- [x] Create homework checking prompt (`prompts.ts`)
- [x] Implement API endpoint (`/api/ai/homework/check`)
- [x] Create teacher review interface (AI Suggest button in grading form)
- [x] Implement AI feedback display (auto-fills score, feedback, rubric scores)
- [x] Add feedback editing capability (teacher can adjust before submitting)

### 4.4 Quiz Generator ✅
- [x] Create quiz generation prompt (`prompts.ts`)
- [x] Implement API endpoint (`/api/ai/quiz/generate`)
- [x] Create generation parameters UI (topic, difficulty, question count)
- [x] Implement quiz preview (question list with answers highlighted)
- [x] Add question editing before save

### 4.5 Student Tutor ✅
- [x] Create tutoring chat prompt (`student-tutor.ts` with safety filters)
- [x] Implement chat API endpoint (`/api/ai/student/chat`)
- [x] Create chat UI component (full chat with typing indicator, bouncing dots)
- [x] Implement context awareness (subject selector, student level personalization)
- [x] Add conversation history (per-subject DB persistence via `StudentAiProfile.conversationContext`, max 20 messages/subject)
- [x] Implement rate limiting per student (50 requests/day via `AiGenerationLog` count)

**Phase 4 Completion:** 15/15 tasks ✅

---

## Phase 5: Battle System (Week 9-12)

### 5.1 Character System ✅
- [x] Create BattleCharacter model integration (added `BATTLE_AWAKENING` to NotificationType, `pnpm db:generate`)
- [x] Implement character creation API (`/api/characters/awaken`, `/api/characters/me`, `/api/characters/classes`, `/api/characters/propose`)
- [x] Create awakening flow (Level 5 trigger in `award-xp.ts` → creates `BATTLE_AWAKENING` notification)
- [x] Implement theme selection UI (6-theme card grid in awakening wizard with Framer Motion)
- [x] Create class proposal algorithm (`propose-classes.ts` — scores Common classes against student stat profile)
- [x] Implement class selection UI (4 class cards with match scores, passive badges, confirmation step)
- [x] Create character stats calculation service (`getStudentSubjectAverages()` + `calculateBattleStats()` from shared)
- [x] Implement character profile page (`/s/character` — stats bars, derived stats, battle record, KP, class info)

### 5.2 Class System ✅
- [x] Seed all 96 classes to database (`seed-character-classes.ts` — 16 per theme × 6 themes)
- [x] Create class unlock checking service (`class-unlock.ts` — `getStudentProgressData`, `checkClassUnlock`, `getEvolutionOptions`)
- [x] Implement class details API (`GET /api/characters/classes/[classId]` — evolution chain, requirements, stat preview)
- [x] Create class preview components (`class-card.tsx`, `stat-comparison.tsx`, `evolution-chain.tsx`)
- [x] Implement passive bonus application (fixed `calculateBattleStats` — multiplicative % not additive, added `calculateStatsWithClass`)
- [x] Create class abilities system (abilities JSON on 30 Epic+ classes, `ClassAbilities` component)
- [x] Implement class evolution checking (`GET/POST /api/characters/evolution` — unlock validation, KP cost, stat recalculation)
- [x] Create evolution UI flow (`/s/character/evolve` — select → confirm → success + `/s/character/classes` browser)

### 5.3 Skill System ✅
- [x] Seed all 156 skills to database (`seed-skills.ts` — Common 50, Uncommon 40, Rare 30, Epic 20, Legendary 10, Mythic 6)
- [x] Create skill unlock checking service (`skill-unlock.ts` — reuses `getStudentProgressData`, adds `classRarity` + `exclusiveClass` conditions)
- [x] Implement skill learning API (`POST /api/skills/learn` — validates unlock requirements, creates `CharacterSkill`)
- [x] Create skill equip/unequip API (`POST /api/skills/equip` — slot 1-6, swap if occupied)
- [x] Implement skill slot management (max 6 enforced via `MAX_EQUIPPED_SKILLS` constant)
- [x] Create skills page UI (`/s/character/skills` — My Skills + All Skills tabs, type filters)
- [x] Implement skill details modal (`SkillDetailModal` — stats, requirements, learn/equip actions)
- [x] Create skill unlock notifications (`SKILL_UNLOCKED` notification type added to schema)

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

**Phase 5 Completion:** 24/25 tasks (5.1 ✅, 5.2 ✅, 5.3 ✅)

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

**Completed (continued):**
- Phase 2.1 (Tenant & User Management) — all 8 tasks
- Zod validation schemas for tenant, invite, user management
- User API routes (me, list, CRUD with soft-delete)
- Tenant settings API (GET/PATCH with admin role guard)
- Invite system API (create, list, revoke, join/accept)
- Admin settings page with plan/usage stats
- User profile page (all roles)
- User management page with search, role filter, invite dialog
- Join/invite acceptance page with registration form
- Shadcn/ui components: Badge, Table, Dialog, Select, DropdownMenu, Avatar

**Completed (continued):**
- Phase 2.2 (Class Management) — all 8 tasks
- Class CRUD API (list/create/detail/update/archive) with role-based access
- Enrollment API (list/enroll/remove students with StudentClassProfile)
- Class invite API + fixed join route to create StudentClassProfile
- Teacher classes page (card grid, create dialog, detail with overview/students/settings tabs)
- Admin classes page (all tenant classes overview)
- Student classes page (enrolled classes with gamification stats)

**Completed (continued):**
- Phase 2.3 (Lesson System) — all 7 tasks
- Lesson validation schemas (create, update, complete, lesson plan)
- Lesson CRUD API (list with date/status filters, create, detail, update, cancel)
- Lesson lifecycle API (start → in-progress, complete with attendance + XP awarding)
- Attendance API (student roster + attendance records)
- Lesson plan API (GET/PUT with upsert, objectives/structure/materials)
- Teacher lesson detail page (details/attendance/plan tabs, start/complete actions)
- Student lesson detail page (read-only with attendance card)
- Student class detail now shows upcoming/past lessons

**Completed (continued):**
- Phase 2.4 (Homework System) — all 9 tasks
- Homework validation schemas (create, update, submit, grade)
- Homework CRUD API (list with student submission status, create, detail, update, delete)
- Submission API (student submit with isLate calculation, teacher grade with XP awarding)
- Grading transaction: calculateHomeworkXP → update submission, StudentClassProfile (classXp, classLevel, homeworkCompleted, averageScore), Student (totalXp, overallLevel)
- Teacher homework UI: Homeworks tab in class detail, create dialog, detail page with submissions table, grade dialog with XP preview
- Student homework UI: pending/completed sections in class detail, homework detail with submission form, graded view with score/XP/feedback

**Next Steps:**
- Phase 2.5: Quiz System

**Blockers:**
- None

### Session 2 — Date: March 23, 2026
**Completed:**
- Phase 2 (Core Academic) — all 41 tasks (quiz system, homework grading with rubrics)
- Phase 3 (Gamification) — all 56 tasks (XP, levels, grades, achievements, streaks, leaderboards, themes, dashboards)
- Phase 4.1 (AI Integration) — 12/15 tasks

**AI Integration Details:**
- AI client infrastructure: singleton client, model config (advanced/fast model routing), prompt builders
- Lesson Plan Generator: API endpoint + teacher AI page with dialog UI + structured preview
- Quiz Generator: API endpoint + dialog UI with difficulty/question count params
- Homework Checker: API endpoint + AI Suggest button in grading form (auto-fills score, feedback, rubrics)
- Student AI Tutor: Chat API with safety filters + full chat UI with typing indicator and subject awareness
- Teacher AI Assistant page with 4 action cards

**Bug Fixes (Codebase Audit):**
- Fixed server-only function called from client component (grading form → now uses API route)
- Fixed completed lesson attendance showing "Unknown" for student names
- Fixed hardcoded GRADE_7 on student join (now selectable)
- Added missing Prisma relations: LessonAttendance→Student, Invite→User (createdBy), CalendarEvent→User
- Fixed User model relation names (teacherProfile/studentProfile/parentProfile) in profile and user routes

**Next Steps:**
- Phase 4 remaining: rate limiting, Redis caching, conversation history persistence
- Phase 5: Battle System

**Blockers:**
- None

### Session 3 — Date: March 28-31, 2026
**Completed:**
- Phase 4 completion (3 remaining tasks): `withAiRoute` middleware with rate limiting + cost tracking + AiGenerationLog, conversation history persistence (per-subject, max 20 messages), per-student daily limit (50/day)
- Phase 5.1 (Character System) — all 8 tasks:
  - Schema: added `BATTLE_AWAKENING` to NotificationType enum
  - Seed: 96 character classes (16 per theme × 6 themes) with passives and requirements
  - Shared: subject→category mapping for 30+ subjects, Zod awakening schema
  - Server: class proposal algorithm, theme/stat config helpers
  - API: 4 character endpoints (me, awaken, classes, propose)
  - Trigger: Level 5 awakening notification in `awardXP()`
  - UI: Multi-step awakening wizard (theme → class → confirm → celebrate)
  - UI: Character profile page with animated stat bars, derived stats, battle record
  - UI: Awakening banner on student dashboard, Character nav in sidebar
- Created `CODEBASE_OVERVIEW.md` — comprehensive documentation of all 42 models, 42 API routes, pages, components, and data flows

**Next Steps:**
- Phase 5.2 remaining: class unlock checking, evolution system
- Phase 5.3: Skill system
- Phase 5.4-5.7: Battle engine, UI, PvP, shop

**Blockers:**
- None

### Session 4 — Date: April 2, 2026
**Completed:**
- Phase 5.2 (Class System) — all 7 remaining tasks:
  - Fixed `calculateBattleStats` passive bug (was additive, now multiplicative %)
  - Added `calculateStatsWithClass()` for stat comparison (base vs with-class)
  - Evolution constants: KP costs (50→3000), rarity labels/colors/order
  - Updated seed: 72 `evolvesFrom` chains + 30 abilities on Epic/Legendary/Mythic classes
  - Class unlock service: `getStudentProgressData()`, `checkClassUnlock()`, `getEvolutionOptions()`
  - API: expanded `/api/characters/classes` (all rarities), `/api/characters/classes/[id]` (detail), `/api/characters/evolution` (GET+POST)
  - UI components: `class-card`, `class-abilities`, `stat-comparison`, `evolution-chain`
  - Pages: class browser (`/s/character/classes`), class detail (`/s/character/classes/[id]`), evolution flow (`/s/character/evolve`)
  - Updated character profile with abilities section + evolution/browse buttons
- Added UI Redesign Track to ROADMAP (72 tasks across UI-1/UI-2/UI-3 phases)

**Next Steps:**
- Phase 5.3: Skill System (156 skills, equip/unequip, mastery)
- Phase 5.4: Battle Engine

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

## UI Redesign Track

> **Reference**: All specs in [EDUMIND_IMPLEMENTATION_GUIDE.md](./Design/EDUMIND_IMPLEMENTATION_GUIDE.md)
>
> This is a parallel track implementing the new 5-theme design system (Dark Fantasy, Ghibli, Bright, Pixel, Cyberpunk) with 9 screen redesigns and gamified RPG-style components. Runs alongside the backend feature phases.

### Implementation Rules
- All colors via CSS variables (`var(--accent)`, `var(--text)`, etc.) — never hardcode
- Border radius via `var(--radius)` — changes per theme (0px–16px)
- Ghibli and Bright themes have **light backgrounds** — ensure dark text on buttons (`--btn-text`)
- Cyberpunk theme needs scanlines, glitch effects, angular `clip-path` corners
- Follow file structure from Guide Section 3

### UI Redesign Progress

| Phase | Name | Tasks | Done | Status |
|-------|------|-------|------|--------|
| UI-1 | Foundation | 16 | 0 | 🔴 Not Started |
| UI-2 | Screens | 43 | 0 | 🔴 Not Started |
| UI-3 | Polish & Testing | 13 | 0 | 🔴 Not Started |
| **Total** | | **72** | **0** | **0%** |

---

### UI-1: Foundation (Week 1-2)

#### UI-1.1 Theme System Setup

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-1.1.1 | Create `globals.css` with CSS variables for all 5 themes (dark, ghibli, bright, pixel, cyber) — replace current 4-theme system | 2h | — | §5.2 |
| UI-1.1.2 | Create `lib/themes.ts` with `ThemeName` type, `Theme` interface, and `themes` record for all 5 themes | 1h | UI-1.1.1 | §5.1 |
| UI-1.1.3 | Build `ThemeProvider` component with `data-theme` attribute on `<html>`, localStorage persistence | 2h | UI-1.1.2 | §5.3 |
| UI-1.1.4 | Add Cyberpunk special effects: scanlines overlay, `.cyber-card` clip-path, `.glitch-text` animation | 1h | UI-1.1.1 | §5.2 |
| UI-1.1.5 | Configure fonts: Rajdhani (Dark), Nunito (Ghibli), Inter (Bright), monospace (Pixel), Orbitron (Cyber) | 1h | — | §4.1 |

#### UI-1.2 Base UI Components

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-1.2.1 | Build `Button` with variants: primary, secondary, danger, ghost — all using CSS variables | 2h | UI-1.1.1 | §6.1 |
| UI-1.2.2 | Build `Card` with default + `cyber` variant (clip-path corners) | 1h | UI-1.1.1 | §6.1 |
| UI-1.2.3 | Build `XPBar` (sm/md/lg sizes) with accent color fill and text label | 1h | UI-1.1.1 | §6.1 |
| UI-1.2.4 | Build `LevelBadge` (sm/md/lg) — circular badge with `--btn-bg`/`--btn-text` | 30m | UI-1.1.1 | §6.1 |
| UI-1.2.5 | Build `StatBar` for HP/ATK/DEF/SPD — label, bar, value | 1h | UI-1.1.1 | §6.1 |
| UI-1.2.6 | Build `Toggle` switch using `--accent` and `--border` variables | 1h | UI-1.1.1 | §6.1 |
| UI-1.2.7 | Build `RarityBorder` with 6 tiers: Common→Mythic (glow, animated rainbow for Mythic) | 2h | UI-1.1.1 | §8 |

#### UI-1.3 Layout Components

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-1.3.1 | Build `Sidebar` (180px, `--bg2` background, active item highlight, notification badge) | 2h | UI-1.2.1 | §6.2 |
| UI-1.3.2 | Build `DashboardLayout` wrapper (sidebar + main content area) | 1h | UI-1.3.1 | §3 |
| UI-1.3.3 | Build `MobileNav` — bottom navigation bar (hidden on desktop, 5 icons) | 2h | UI-1.2.1 | §10.3 |
| UI-1.3.4 | Build `ThemeSwitcher` — 5 theme preview buttons for Settings page | 1h | UI-1.1.3 | §7.8 |

**UI-1 Total: ~19.5 hours | 16 tasks**

---

### UI-2: Screen Implementation (Week 2-4)

#### UI-2.1 Dashboard Screen

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-2.1.1 | Build `CharacterCard` — avatar with level ring, XP bar, radar chart placeholder, battle power stat | 3h | UI-1.2.* | §7.1 |
| UI-2.1.2 | Build `QuickStats` — 6 stat cards in responsive grid (Total XP, Level, Avg Grade, Battles Won, Streak, Rank) | 2h | UI-1.2.2 | §7.1 |
| UI-2.1.3 | Build `TodaySchedule` — time-based schedule entries with subject color dots | 2h | UI-1.2.2 | §7.1 |
| UI-2.1.4 | Build `ClassesGrid` — subject cards with grades, XP bars, level badges | 2h | UI-1.2.2, UI-1.2.3 | §7.1 |
| UI-2.1.5 | Build `UpcomingDeadlines` — deadline list with urgency color indicators | 1h | UI-1.2.2 | §7.1 |
| UI-2.1.6 | Build `DailyQuests` — checklist with XP rewards and progress bar | 2h | UI-1.2.2, UI-1.2.3 | §7.1 |
| UI-2.1.7 | Assemble Dashboard page with 2-column layout, all components | 2h | UI-2.1.1–6 | §7.1 |

#### UI-2.2 Character Class Selection Screen

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-2.2.1 | Build `ClassCard` — character preview with rarity border, lock/unlock/equipped states | 2h | UI-1.2.7 | §7.2 |
| UI-2.2.2 | Build `ClassCarousel` — horizontal scrolling row per theme category | 3h | UI-2.2.1 | §7.2 |
| UI-2.2.3 | Build `ClassDetailModal` — full details: abilities, requirements, passive bonuses, evolution path | 3h | UI-2.2.1 | §7.2 |
| UI-2.2.4 | Assemble Character page with 6 category rows (Fantasy, Anime, Cyberpunk, Military, Sci-Fi, Steampunk) | 2h | UI-2.2.1–3 | §7.2 |

#### UI-2.3 Subject Page Screen

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-2.3.1 | Build `SubjectHeader` — icon, name, teacher, level badge, grade badge | 2h | UI-1.2.4 | §7.3 |
| UI-2.3.2 | Build `SubjectTabs` — Overview, Lessons, Homework, Quizzes, Grades tabs | 2h | — | §7.3 |
| UI-2.3.3 | Build `GradeBreakdown` — visual weight bars (Level 30%, Homework 35%, Quiz 35%) | 2h | UI-1.2.5 | §7.3 |
| UI-2.3.4 | Build `HomeworkList` — pending/completed with XP rewards and status badges | 2h | UI-1.2.2, UI-1.2.3 | §7.3 |
| UI-2.3.5 | Build `QuizList` — upcoming/completed with scores and time remaining | 2h | UI-1.2.2 | §7.3 |
| UI-2.3.6 | Assemble Subject page with all tabs wired to data | 2h | UI-2.3.1–5 | §7.3 |

#### UI-2.4 Battle Arena Screen

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-2.4.1 | Build `ArenaHub` — Quick Match and Ranked Battle mode cards | 2h | UI-1.2.1, UI-1.2.2 | §7.4 |
| UI-2.4.2 | Build `FighterCard` — HP/ATK/DEF/SPD stat bars with battle power number | 2h | UI-1.2.5 | §7.4 |
| UI-2.4.3 | Build `BattleScreen` — opponent top, player bottom, skill buttons, HP/MP/STA bars, turn counter | 4h | UI-1.2.1, UI-1.2.5 | §7.4 |
| UI-2.4.4 | Build `BattleHistory` — win/loss records with XP earned, opponent details | 2h | UI-1.2.2 | §7.4 |
| UI-2.4.5 | Build `Leaderboard` — ranked player list with highlight for current user | 2h | UI-1.2.2 | §7.4 |
| UI-2.4.6 | Assemble Battle Arena with tabs: Hub, Battle, History, Leaderboard | 2h | UI-2.4.1–5 | §7.4 |

#### UI-2.5 Student Profile Screen

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-2.5.1 | Build `ProfileHeader` — banner image, avatar with XP ring, level badge, character class label | 3h | UI-1.2.3, UI-1.2.4 | §7.6 |
| UI-2.5.2 | Build `StatsGrid` — 6 stats (Total XP, Level, Avg Grade, Battles Won, Streak, Rank) | 2h | UI-1.2.2 | §7.6 |
| UI-2.5.3 | Build `AchievementBadges` — 6 recent badges preview with rarity borders | 2h | UI-1.2.7 | §7.6 |
| UI-2.5.4 | Build `PersonalInfo` — editable user details card (name, email, school) | 2h | UI-1.2.2, UI-1.2.1 | §7.6 |
| UI-2.5.5 | Build `FriendsList` — online/offline status dots, battle challenge button | 2h | UI-1.2.1, UI-1.2.2 | §7.6 |
| UI-2.5.6 | Build `ActivityFeed` — recent XP-earning activities with icons and timestamps | 2h | UI-1.2.2 | §7.6 |
| UI-2.5.7 | Assemble Profile page with all sections | 2h | UI-2.5.1–6 | §7.6 |

#### UI-2.6 Achievements Screen

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-2.6.1 | Build `AchievementHeader` — unlocked/total count, completion percentage | 1h | UI-1.2.2 | §7.7 |
| UI-2.6.2 | Build `OverallProgress` — progress bar with milestone markers | 2h | UI-1.2.3 | §7.7 |
| UI-2.6.3 | Build `CategoryTabs` — All, Combat, Academic, Social, Special filter tabs | 1h | UI-1.2.1 | §7.7 |
| UI-2.6.4 | Build `AchievementCard` — icon, rarity border, name, description, progress bar, XP reward, lock state | 3h | UI-1.2.7 | §7.7 |
| UI-2.6.5 | Assemble Achievements page with grid layout and category filters | 2h | UI-2.6.1–4 | §7.7 |

#### UI-2.7 Settings Screen

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-2.7.1 | Build `SettingCard` — section container with title and divider | 1h | UI-1.2.2 | §7.8 |
| UI-2.7.2 | Build `SettingRow` — label, description, and control (toggle/select/slider) | 1h | — | §7.8 |
| UI-2.7.3 | Build `ThemeSelector` — 5 theme preview buttons with active indicator | 2h | UI-1.3.4 | §7.8 |
| UI-2.7.4 | Build `VolumeSlider` — range input with percentage display | 1h | — | §7.8 |
| UI-2.7.5 | Build Settings sections: Appearance, Notifications, Account, Privacy, Sound, Danger Zone | 3h | UI-2.7.1–4 | §7.8 |
| UI-2.7.6 | Assemble Settings page with all sections | 1h | UI-2.7.5 | §7.8 |

#### UI-2.8 Notifications Center Screen

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-2.8.1 | Build `NotificationHeader` — Mark All Read button, Clear All button | 1h | UI-1.2.1 | §7.9 |
| UI-2.8.2 | Build `FilterTabs` — All, Unread, Battles, Academic, Social, System | 1h | UI-1.2.1 | §7.9 |
| UI-2.8.3 | Build `NotificationItem` — icon, title, description, time, actions, unread/urgent states | 3h | UI-1.2.1, UI-1.2.2 | §7.9 |
| UI-2.8.4 | Build `NotificationSection` — grouped by time (Today, Yesterday, Earlier) | 1h | UI-2.8.3 | §7.9 |
| UI-2.8.5 | Assemble Notifications page with filters and time-grouped sections | 2h | UI-2.8.1–4 | §7.9 |

#### UI-2.9 Onboarding/Tutorial Screen

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-2.9.1 | Build `OnboardingProgress` — progress bar + step dots (5 steps) | 1h | UI-1.2.3 | §7.5 |
| UI-2.9.2 | Build Step 1: Welcome — platform intro with animation | 1h | UI-1.2.2 | §7.5 |
| UI-2.9.3 | Build Step 2: ThemePicker — interactive theme selection that changes UI live | 2h | UI-1.3.4 | §7.5 |
| UI-2.9.4 | Build Step 3: XPDemo — clickable buttons that earn demo XP with bar animation | 2h | UI-1.2.1, UI-1.2.3 | §7.5 |
| UI-2.9.5 | Build Step 4: BattleDemo — attack button simulation with damage numbers | 2h | UI-1.2.1 | §7.5 |
| UI-2.9.6 | Build Step 5: Ready — "Learn and Become The Strongest!" with CTA button | 1h | UI-1.2.1 | §7.5 |
| UI-2.9.7 | Assemble Onboarding flow with step navigation and completion redirect | 2h | UI-2.9.1–6 | §7.5 |

**UI-2 Total: ~95 hours | 43 tasks**

---

### UI-3: Polish & Testing (Week 4-5)

#### UI-3.1 Animations

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-3.1.1 | Add Framer Motion page transitions (fadeIn, slideUp, scaleIn) | 2h | UI-2 | §9.1 |
| UI-3.1.2 | Add card hover effects (translateY -4px, shadow elevation) | 1h | UI-2 | §9.3 |
| UI-3.1.3 | Add XP gain popup animations (scale + fade + float up) | 2h | UI-2 | §9 |
| UI-3.1.4 | Add Mythic rarity rainbow glow animation (conic gradient spin) | 1h | UI-1.2.7 | §8.3 |
| UI-3.1.5 | Add notification slide-in animations (translateX) | 1h | UI-2.8.3 | §9.3 |

#### UI-3.2 Responsive Design

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-3.2.1 | Make Dashboard responsive (6→3→2 column stat grids, stack content) | 2h | UI-2.1.7 | §10.2 |
| UI-3.2.2 | Make all screens responsive for tablet (768px breakpoint) | 3h | UI-2 | §10.2 |
| UI-3.2.3 | Make all screens responsive for mobile (640px breakpoint) | 3h | UI-2 | §10.2 |
| UI-3.2.4 | Implement MobileNav bottom bar for mobile devices | 2h | UI-1.3.3 | §10.3 |

#### UI-3.3 Theme Testing

| Task | Description | Time | Deps | Guide Ref |
|------|-------------|------|------|-----------|
| UI-3.3.1 | Test all screens in Dark Fantasy theme — verify contrast and accent colors | 1h | UI-2 | §5.2 |
| UI-3.3.2 | Test all screens in Ghibli theme — verify text visibility on light background | 1h | UI-2 | §5.2 |
| UI-3.3.3 | Test all screens in Bright theme — verify button text and contrast | 1h | UI-2 | §5.2 |
| UI-3.3.4 | Test all screens in Pixel theme — verify monospace font rendering | 1h | UI-2 | §5.2 |
| UI-3.3.5 | Test all screens in Cyberpunk theme — verify scanlines, glitch, clip-path effects | 1h | UI-2 | §5.2 |
| UI-3.3.6 | Fix any theme-specific bugs found during testing | 2h | UI-3.3.1–5 | — |

**UI-3 Total: ~24 hours | 13 tasks**

---

### UI Redesign Summary

| Phase | Tasks | Estimated Hours |
|-------|-------|----------------|
| UI-1: Foundation | 16 | ~20h |
| UI-2: Screens | 43 | ~95h |
| UI-3: Polish | 13 | ~24h |
| **Total** | **72** | **~139h** |

---

## Quick Links

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [DATABASE.md](./DATABASE.md) — Schema reference
- [BATTLE_SYSTEM.md](./BATTLE_SYSTEM.md) — Battle mechanics
- [GAMIFICATION.md](./GAMIFICATION.md) — XP/Level formulas
- [API.md](./API.md) — Endpoint reference
- [UI_SCREENS.md](./UI_SCREENS.md) — Screen designs
- [EDUMIND_IMPLEMENTATION_GUIDE.md](./Design/EDUMIND_IMPLEMENTATION_GUIDE.md) — Complete UI specs (5 themes, 9 screens, components)
- [CODEBASE_OVERVIEW.md](./CODEBASE_OVERVIEW.md) — Full codebase documentation

---

**Last Updated:** April 2, 2026
**Current Phase:** 5 🟡 In Progress (24/25) + UI Redesign Track (0/72)
**Overall Progress:** 151/236 (64% including UI track)
