# EduMind AI — Development Roadmap

## Progress Overview

| Phase | Name | Tasks | Done | Status |
|-------|------|-------|------|--------|
| 1 | Foundation | 15 | 15 | ✅ Complete |
| 2 | Core Academic | 41 | 41 | ✅ Complete |
| 3 | Gamification | 56 | 56 | ✅ Complete |
| 4 | AI Integration | 15 | 12 | 🟡 In Progress |
| 5 | Battle System | 25 | 0 | 🔴 Not Started |
| 6 | Polish & Launch | 12 | 0 | 🔴 Not Started |
| **Total** | | **164** | **124** | **76%** |

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

### 4.1 AI Service Setup
- [x] Create AI client (`apps/web/src/lib/ai/client.ts` — singleton)
- [x] Configure AI models and task routing (`config.ts` — advanced/fast model selection)
- [ ] Implement rate limiting
- [x] Create usage tracking/logging (AiGenerationLog model exists)
- [ ] Implement caching layer (Redis)
- [ ] Create AI cost tracking

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

### 4.5 Student Tutor
- [x] Create tutoring chat prompt (`student-tutor.ts` with safety filters)
- [x] Implement chat API endpoint (`/api/ai/student/chat`)
- [x] Create chat UI component (full chat with typing indicator, bouncing dots)
- [x] Implement context awareness (subject selector, student level personalization)
- [ ] Add conversation history (database persistence)
- [ ] Implement rate limiting per student

**Phase 4 Completion:** 12/15 tasks (remaining: rate limiting, caching, conversation history)

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

**Last Updated:** March 23, 2026
**Current Phase:** 4 🟡 In Progress (12/15)
**Overall Progress:** 124/164 (76%)
