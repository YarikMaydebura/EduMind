# EduMind AI — Complete Codebase Overview

## Document Info
```
Version: 1.0.0
Last Updated: March 2026
Overall Progress: 127/164 tasks (77%)
Phases Complete: 1 (Foundation), 2 (Core Academic), 3 (Gamification), 4 (AI Integration)
Current Phase: 5 (Battle System) — 5.1 Character System complete
```

---

## 1. Architecture

### Monorepo Structure
```
EdumindAI/
├── Code/                          # Turborepo monorepo (pnpm workspaces)
│   ├── apps/
│   │   └── web/                   # Next.js 14 (App Router) — main application
│   ├── packages/
│   │   ├── database/              # Prisma ORM, schema, seeds
│   │   └── shared/                # Types, constants, utils, validation
│   ├── turbo.json                 # Build pipeline config
│   └── pnpm-lock.yaml
├── Documentation/                 # All project docs, UML, design files
└── Marketing/                     # School/institution data for outreach
```

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, Server Components) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + Shadcn/ui (Radix primitives) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 (JWT sessions, Microsoft OAuth + credentials) |
| AI | Anthropic SDK (`@anthropic-ai/sdk`) |
| State | Zustand (sidebar), React Query (data fetching) |
| Animation | Framer Motion |
| Validation | Zod |
| Icons | Lucide React |
| Toasts | Sonner |
| Package Manager | pnpm |
| Build System | Turborepo |

---

## 2. Database (42 Prisma Models)

The schema is organized into 8 domains. All models use `cuid()` IDs.

### 2.1 Core (7 models)
| Model | Purpose | Key Relations |
|-------|---------|--------------|
| **Tenant** | Multi-tenant organization (school/tutor) | → Users, Classes, Invites |
| **User** | All users with role field | → Tenant, Teacher/Student/Parent profiles |
| **Session** | Auth sessions (JWT) | → User |
| **SchoolAdmin** | Admin-specific profile | → User (1:1) |
| **Teacher** | Teacher profile (subjects, bio) | → User (1:1), Classes, Lessons, Homeworks, Quizzes |
| **Student** | Student profile + gamification stats | → User (1:1), Enrollments, BattleCharacter |
| **Parent** | Parent profile + alert preferences | → User (1:1), ParentStudent children |

**Student** is the most connected model — it holds global XP, level, grade, streak, and links to class profiles, submissions, achievements, activity feed, battle character, and leaderboard entries.

### 2.2 Academic (4 models)
| Model | Purpose | Key Relations |
|-------|---------|--------------|
| **Class** | A course (subject + grade year) | → Tenant, Teacher, Enrollments, Lessons, Homeworks, Quizzes |
| **ClassEnrollment** | Student enrolled in a class | → Class, Student (unique pair) |
| **StudentClassProfile** | Per-class XP, level, grade, stats | → Student, Class (unique pair) |
| **LearningPlan** | Curriculum plan for a class | → Class (1:1) |

**StudentClassProfile** tracks class-specific progress: `classXp`, `classLevel`, `classGrade`, `lessonsCompleted`, `homeworkCompleted`, `quizzesCompleted`, `averageScore`, and AI insights.

### 2.3 Learning Content (6 models)
| Model | Purpose | Key Relations |
|-------|---------|--------------|
| **Lesson** | Individual lesson with schedule | → Class, Teacher, LessonPlan, Attendance[], Homeworks[], Quizzes[] |
| **LessonPlan** | Structured lesson plan (AI-generated) | → Lesson (1:1) |
| **LessonAttendance** | Student attendance per lesson | → Lesson, Student |
| **Homework** | Assignment with rubric support | → Class, Teacher, Lesson?, Submissions[] |
| **HomeworkSubmission** | Student work + grading | → Homework, Student (unique pair) |
| **Quiz** | Quiz/test with questions (JSON) | → Class, Teacher, Lesson?, Results[] |
| **QuizResult** | Attempt with score and answers | → Quiz, Student |

**Homework flow**: Teacher creates → Students submit → Teacher grades (with optional AI suggestion) → XP awarded.
**Quiz flow**: Teacher creates → Student takes (timed, auto-graded MCQ/TF/short) → XP awarded.

### 2.4 Gamification (6 models)
| Model | Purpose |
|-------|---------|
| **Achievement** | 57 achievement definitions with rarity (Common→Mythic), conditions, rewards |
| **StudentAchievement** | Progress tracking per student per achievement |
| **ActivityFeed** | XP events, level-ups, achievements — public/private feed |
| **StudentFollow** | Social following between students |
| **LeaderboardEntry** | Ranked entries (class/school/global, daily/weekly/monthly) |
| **StudentAiProfile** | AI learning profile: style, strengths, weaknesses, conversation history |

### 2.5 Communication (4 models)
| Model | Purpose |
|-------|---------|
| **Notification** | Push-style notifications (lesson reminders, homework graded, level up, awakening) |
| **Message** | Direct messages between users |
| **Invite** | Invite codes for joining tenant/class with role, expiry, max uses |
| **CalendarEvent** | Calendar entries linked to lessons/homework/quizzes |

### 2.6 AI & Analytics (1 model)
| Model | Purpose |
|-------|---------|
| **AiGenerationLog** | Every AI API call: type, model, tokens, cost, latency, success/error |

### 2.7 Battle System — Characters (3 models)
| Model | Purpose |
|-------|---------|
| **CharacterClass** | 96 class definitions (16 per theme × 6 themes) with passives, requirements, evolution |
| **BattleCharacter** | Student's battle avatar: stats (HP/MP/STA/ATK/DEF/SPD/LCK), battle record, KP |
| **ClassChangeHistory** | Evolution/class change audit trail |

### 2.8 Battle System — Combat (7 models)
| Model | Purpose |
|-------|---------|
| **Skill** | Battle skills with type, rarity, costs, effects, unlock conditions |
| **CharacterSkill** | Equipped skills per character (max 6 slots) |
| **Item** | Equipment and consumables with effects |
| **CharacterItem** | Character inventory |
| **Battle** | Battle instance: PVP/PVE/Friendly/Boss, turn log, rewards |
| **Dungeon** | Dungeon definitions with waves, bosses, rewards |
| **DungeonCompletion** | Dungeon run results |
| **BattleLeaderboard** | Battle rankings |
| **ShopTransaction** | KP purchase history |

---

## 3. Authentication & Authorization

### Auth Stack
- **NextAuth v5** (beta) with App Router integration
- **Providers**: Microsoft Entra ID (OAuth) + Credentials (email/password with bcrypt)
- **Session**: JWT-based with `role`, `tenantId`, `id` in the token
- **Middleware**: Role-based route protection

### RBAC (5 Roles)
| Role | Route Prefix | Capabilities |
|------|-------------|-------------|
| `TECH_ADMIN` | `/a/` | Full system access |
| `SCHOOL_ADMIN` | `/a/` | Tenant management, user management, class oversight |
| `TEACHER` | `/t/` | Class CRUD, lessons, homework, quizzes, grading, AI tools |
| `STUDENT` | `/s/` | View classes, submit work, take quizzes, AI tutor, battle system |
| `PARENT` | `/p/` | View child progress (basic) |

### Auth Helpers (`src/lib/auth/helpers.ts`)
```typescript
requireAuth()           // Redirect to /login if no session
requireRole(...roles)   // Redirect to / if role not allowed
getTenantId()           // Extract tenantId from session
```

### Multi-Tenancy
Every query filters by `tenantId` from the session. Tenants have:
- Subscription plan (FREE_TRIAL → ENTERPRISE)
- Student/teacher limits
- AI request quotas (`aiRequestsLimit`, `aiRequestsUsed`, daily reset)

---

## 4. API Routes (42 endpoints)

All routes follow this pattern:
```typescript
export async function GET/POST/PATCH/DELETE(req: Request) {
  const session = await requireAuth();
  // Role check
  // Tenant isolation (where: { tenantId: session.user.tenantId })
  // Validation (Zod)
  // Business logic
  return NextResponse.json({ success: true, data: result });
}
```

### Route Map

#### Auth & Registration
| Method | Route | Purpose |
|--------|-------|---------|
| `*` | `/api/auth/[...nextauth]` | NextAuth handler |
| POST | `/api/auth/register` | Register tenant + user (transaction) |
| GET/POST | `/api/join/[code]` | Validate invite / register via invite |

#### Users & Tenant
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/users` | List users (admin) |
| GET | `/api/users/me` | Current user profile |
| GET/PATCH/DELETE | `/api/users/[id]` | User CRUD (admin) |
| GET/PATCH | `/api/tenant` | Tenant settings (admin) |

#### Classes
| Method | Route | Purpose |
|--------|-------|---------|
| GET/POST | `/api/classes` | List/create classes |
| GET/PATCH | `/api/classes/[id]` | Class detail/update |
| GET/POST | `/api/classes/[id]/students` | Enrollment management |
| DELETE | `/api/classes/[id]/students/[studentId]` | Remove student |
| POST | `/api/classes/[id]/invite` | Generate invite |
| GET/POST | `/api/classes/[id]/lessons` | Class lessons |
| GET/POST | `/api/classes/[id]/homeworks` | Class homeworks |
| GET/POST | `/api/classes/[id]/quizzes` | Class quizzes |

#### Lessons
| Method | Route | Purpose |
|--------|-------|---------|
| GET/PATCH | `/api/lessons/[id]` | Lesson detail/update |
| POST | `/api/lessons/[id]/start` | Start lesson (SCHEDULED→IN_PROGRESS) |
| POST | `/api/lessons/[id]/complete` | Complete + award attendance XP |
| GET/POST | `/api/lessons/[id]/attendance` | Attendance records |
| GET/PUT | `/api/lessons/[id]/plan` | Lesson plan (upsert) |

#### Homework
| Method | Route | Purpose |
|--------|-------|---------|
| GET/PATCH/DELETE | `/api/homeworks/[id]` | Homework CRUD |
| GET/POST | `/api/homeworks/[id]/submissions` | List/submit |
| PATCH | `/api/homeworks/[id]/submissions/[studentId]` | Grade submission (awards XP) |

#### Quizzes
| Method | Route | Purpose |
|--------|-------|---------|
| GET/PATCH | `/api/quizzes/[id]` | Quiz detail |
| POST | `/api/quizzes/[id]/attempts` | Submit quiz attempt (auto-grade, award XP) |

#### Student Data
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/students/me/xp` | XP, level, grade, class profiles, hasCharacter |
| GET | `/api/students/me/achievements` | Achievement list with progress |
| GET | `/api/students/me/activity` | Activity feed |
| GET | `/api/students/leaderboard` | Leaderboard (class/school/global) |

#### AI Features
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/ai/lesson-plan/generate` | Generate lesson plan (teacher) |
| POST | `/api/ai/quiz/generate` | Generate quiz questions (teacher) |
| POST | `/api/ai/homework/check` | AI grade suggestion (teacher) |
| POST | `/api/ai/student/chat` | AI tutor chat (student) |
| GET/DELETE | `/api/ai/student/chat/history` | Conversation history per subject |

All AI routes go through `withAiRoute` middleware which handles:
- Tenant rate limiting (daily reset)
- Per-student daily cap (50 requests)
- `AiGenerationLog` creation (tokens, cost, latency)
- Tenant counter increment

#### Character System
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/characters/me` | Get student's battle character (or null) |
| POST | `/api/characters/awaken` | Create character (theme + class selection) |
| GET | `/api/characters/classes?theme=X` | Available Common classes for theme |
| GET | `/api/characters/propose?theme=X` | Proposed classes with match scores |

#### Dashboards
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/teacher/dashboard` | Teacher stats (upcoming lessons, ungraded work) |
| GET | `/api/admin/dashboard` | School overview (users, capacity, activity) |

#### Invites
| Method | Route | Purpose |
|--------|-------|---------|
| GET/POST | `/api/invites` | List/create invite codes |
| GET/DELETE | `/api/invites/[code]` | Validate/revoke invite |

---

## 5. Frontend Pages & Components

### Dashboard Layout
Every dashboard page is wrapped in `AppShell` which provides:
- Collapsible sidebar navigation (role-specific items via `sidebar-nav-config.ts`)
- Mobile hamburger drawer
- Dashboard header with user info

### Page Pattern
Each page uses the **Server Component → Client Component** pattern:
```
page.tsx (server)         — auth check, data fetch
  └── component.tsx (client) — interactive UI with state
```

### Student Pages
| Page | Path | Description |
|------|------|------------|
| Dashboard | `/s/dashboard` | Level/XP/grade overview, class cards, activity feed, awakening banner |
| Classes | `/s/classes` | Enrolled class list with gamification stats |
| Class Detail | `/s/classes/[id]` | Lessons, homeworks, quizzes tabs per class |
| Lesson Detail | `/s/lessons/[id]` | Lesson info + attendance status |
| Homework Detail | `/s/homeworks/[id]` | Submit work or view grade/feedback |
| Quiz | `/s/quizzes/[id]` | Take quiz (timed, question-by-question) |
| AI Tutor | `/s/tutor` | Chat with AI tutor (per-subject, history persisted) |
| Achievements | `/s/achievements` | Achievement grid with progress, rarity badges |
| Leaderboard | `/s/leaderboard` | XP rankings (class/school/global, daily/weekly/monthly) |
| Character | `/s/character` | Battle character profile: stats, class, battle record |
| Awakening | `/s/awakening` | 4-step wizard: theme → class → confirm → celebrate |
| Settings | `/s/settings` | Theme selector, profile preferences |

### Teacher Pages
| Page | Path | Description |
|------|------|------------|
| Dashboard | `/t/dashboard` | Upcoming lessons, ungraded work, class stats |
| Classes | `/t/classes` | Class list, create class, manage students |
| Class Detail | `/t/classes/[id]` | Overview, students, lessons, homeworks, quizzes tabs |
| Lesson Detail | `/t/lessons/[id]` | Details, attendance form, lesson plan editor |
| Homework Detail | `/t/homeworks/[id]` | Submissions table with grading |
| Grading | `/t/homeworks/[id]/grade/[studentId]` | Split-view grading: submission + rubric + AI suggest |
| Quiz Detail | `/t/quizzes/[id]` | Quiz overview and results |
| AI Assistant | `/t/ai` | Lesson plan generator, quiz generator, homework grading tools |
| Settings | `/t/settings` | Theme, preferences |

### Admin Pages
| Page | Path | Description |
|------|------|------------|
| Dashboard | `/a/dashboard` | School overview: users, capacity, subscription, activity |
| Classes | `/a/classes` | All classes across tenant |
| Users | `/a/users` | User list, invite dialog, role management |
| Settings | `/a/settings` | Tenant settings, plan/usage info |

---

## 6. Gamification System

### XP Awards
XP is awarded through the central `awardXP()` function in a database transaction. It:
1. Updates class-specific profile (`StudentClassProfile.classXp`, `classLevel`)
2. Updates global student stats (`Student.totalXp`, `overallLevel`)
3. Updates daily streak
4. Creates activity feed entry
5. Creates level-up notification (if applicable)
6. Triggers battle awakening (if level reaches 5)
7. Recalculates grade
8. Checks achievement unlock conditions

### XP Sources
| Event | Base XP | Perfect Bonus |
|-------|---------|--------------|
| Homework submitted | 30 | +20 |
| Quiz completed | 50 | +25 |
| Lesson attended | 15 | — |
| Boss battle won | 150 | +100 |
| Streak milestones | 25–1500 | — |

### Level System
```
Level = floor(sqrt(XP / 100)) + 1
XP for Level N = (N-1)² × 100
```
Titles progress from "Newcomer" → "Apprentice" → ... → "Legend" based on level.

### Grade System (E → S+)
Weighted formula: `score = 0.30 × levelScore + 0.35 × homeworkAvg + 0.35 × quizAvg`

| Grade | Score Range |
|-------|------------|
| S+ | 95–100 |
| S | 90–94 |
| A+ | 85–89 |
| A | 80–84 |
| B+ | 75–79 |
| B | 70–74 |
| C | 60–69 |
| D | 50–59 |
| E | 0–49 |

### Achievement System
57 achievements across 10 condition types: `homework_count`, `quiz_count`, `streak`, `level`, `grade`, `boss_defeat`, `lesson_count`, `perfect_score`, `xp_total`, `class_level`. Rarity: Common → Uncommon → Rare → Epic → Legendary → Mythic.

---

## 7. AI Integration

### Architecture
```
Client (UI) → API Route → withAiRoute middleware → AI function → Anthropic SDK
                               ↓                        ↓
                     Rate limit check              AiGenerationLog
                     Tenant counter
```

### AI Features
| Feature | Model | Route | Description |
|---------|-------|-------|-------------|
| Lesson Plan Generator | Advanced (Sonnet) | `/api/ai/lesson-plan/generate` | Structured plan with objectives, phases, materials |
| Quiz Generator | Advanced (Sonnet) | `/api/ai/quiz/generate` | MCQ, T/F, short answer questions |
| Homework Grading | Fast (Haiku) | `/api/ai/homework/check` | Score suggestion, feedback, rubric scores |
| Student AI Tutor | Fast (Haiku) | `/api/ai/student/chat` | Socratic method chat, per-subject history |

### Rate Limiting
- **Tenant level**: `aiRequestsUsed` vs `aiRequestsLimit` with daily reset
- **Student level**: 50 requests/day (counted from `AiGenerationLog`)
- **Cost tracking**: Token costs calculated per model, logged per request

### Conversation History
- Stored in `StudentAiProfile.conversationContext` as JSON
- Per-subject storage: `{ "MATHEMATICS": ChatMessage[], "ENGLISH": [...] }`
- Max 20 messages per subject (auto-trimmed)
- Safety filters block direct-answer requests

---

## 8. Battle System (Phase 5)

### Awakening Flow
When a student reaches **Level 5**, the `awardXP` function creates a `BATTLE_AWAKENING` notification. The student then visits `/s/awakening` for a 4-step wizard:

1. **Theme Selection** — 6 themes: Fantasy, Cyberpunk, Military, Sci-Fi, Anime, Steampunk
2. **Class Proposal** — 4 Common classes per theme, ranked by stat match
3. **Confirmation** — Review selection and stat preview
4. **Celebration** — Animated reveal with stat bars

### Subject → Battle Stats
Academic performance converts to battle attributes via `SUBJECT_CONVERSIONS`:

| Subject Category | Stats Affected |
|-----------------|---------------|
| Mathematics | MP (+0.5), ATK (+0.15), LCK (+0.05) |
| Science | MP (+0.3), DEF (+0.2) |
| Physical Education | HP (+0.8), STA (+0.5), ATK (+0.2), DEF (+0.15) |
| Languages | SPD (+0.3), MP (+0.2) |
| Social Studies | DEF (+0.35), HP (+0.25) |
| Arts | MP (+0.35) |
| Computer Science | MP (+0.4), SPD (+0.15), LCK (+0.1) |

Base stats: HP=100, MP=50, STA=50, ATK=10, DEF=10, SPD=10, LCK=5

### Character Classes (96 total)
16 per theme, distributed as:
- 4 Common (+5% one stat, Level 5)
- 4 Uncommon (+8% + 3%, Level 10)
- 3 Rare (+12% two stats, Level 20)
- 2 Epic (+15% two stats + abilities, Level 35)
- 2 Legendary (+20% three stats + unique, Level 50)
- 1 Mythic (+25% all stats + exclusive, Level 75)

### Class Proposal Algorithm
Scores each Common class by comparing its passive stat bonuses against the student's strongest stats (derived from `StudentClassProfile` averages). Returns sorted list with match percentage and reason.

---

## 9. Theming System

5 theme presets applied via CSS variables on `:root`:

| Theme | Style |
|-------|-------|
| Dark Modern | Dark backgrounds, blue accents |
| Playful Colorful | Vibrant gradients, rounded corners |
| Corporate Professional | Clean whites, minimal colors |
| Warm Friendly | Warm tones, soft edges |
| System | Follows OS dark/light preference |

Theme state managed by `useThemePreference` hook → persisted in user preferences → applied via `ThemeInitializer` component on mount.

---

## 10. Project File Map

### `Code/apps/web/src/`

```
app/
├── (auth)/                          # Auth pages (login, register, join)
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── join/[code]/
├── (dashboard)/                     # Protected dashboard pages
│   ├── layout.tsx                   # AppShell wrapper
│   ├── a/                           # Admin pages
│   │   ├── dashboard/
│   │   ├── classes/
│   │   ├── users/
│   │   └── settings/
│   ├── t/                           # Teacher pages
│   │   ├── dashboard/
│   │   ├── classes/[id]/
│   │   ├── lessons/[id]/
│   │   ├── homeworks/[id]/grade/[studentId]/
│   │   ├── quizzes/[id]/
│   │   ├── ai/
│   │   └── settings/
│   ├── s/                           # Student pages
│   │   ├── dashboard/
│   │   ├── classes/[id]/
│   │   ├── lessons/[id]/
│   │   ├── homeworks/[id]/
│   │   ├── quizzes/[id]/
│   │   ├── tutor/
│   │   ├── achievements/
│   │   ├── leaderboard/
│   │   ├── character/
│   │   ├── awakening/
│   │   └── settings/
│   └── profile/
├── api/                             # 42 API route handlers
│   ├── auth/
│   ├── ai/
│   ├── characters/
│   ├── classes/[id]/
│   ├── homeworks/[id]/submissions/
│   ├── invites/
│   ├── join/[code]/
│   ├── lessons/[id]/
│   ├── quizzes/[id]/
│   ├── students/me/
│   ├── teacher/
│   ├── tenant/
│   └── users/
└── globals.css                      # 5 theme CSS variable sets

components/
├── dashboard/                       # AppShell, sidebar, header
├── gamification/                    # Level badge, XP display, achievements, stat bar
├── motion/                          # Framer Motion wrappers
├── settings/                        # Theme selector
└── ui/                              # 14 Shadcn/ui components

lib/
├── auth/                            # NextAuth config + helpers
├── ai/                              # AI client, config, prompts, middleware, history
├── gamification/                    # XP, achievements, streaks, grades, battle utils
├── stores/                          # Zustand stores
├── db.ts                            # Prisma client
├── themes.ts                        # Theme definitions
├── motion.ts                        # Animation variants
└── utils.ts                         # General utilities
```

### `Code/packages/shared/src/`
```
types/                               # TypeScript interfaces (API, user, gamification, battle)
constants/                           # XP values, level titles, grade thresholds, battle stats
gamification/                        # XP, level, grade calculation functions
battle/                              # Stat calculations, subject mapping
validation/                          # 10 Zod schemas (auth, class, homework, quiz, character, etc.)
utils/                               # Shared utilities
errors/                              # Custom error classes
__tests__/                           # 37 unit tests
```

### `Code/packages/database/`
```
prisma/
├── schema.prisma                    # 42 models, 17 enums
├── seed-test-data.ts                # 5 students, 2 classes, teacher, admin
└── seed-character-classes.ts        # 96 character classes (16 × 6 themes)
```

---

## 11. Data Flow Examples

### Student Submits Homework
```
Student clicks Submit → POST /api/homeworks/[id]/submissions
  → Validate submission
  → Create HomeworkSubmission record
  → Return success
```

### Teacher Grades Homework
```
Teacher fills grade form → PATCH /api/homeworks/[id]/submissions/[studentId]
  → Validate score + feedback
  → db.$transaction:
    1. Update HomeworkSubmission (score, feedback, status=GRADED)
    2. awardXP() →
       a. Update StudentClassProfile (classXp, classLevel, homeworkCompleted)
       b. Update Student (totalXp, overallLevel)
       c. Update streak
       d. Check level-up → create notification
       e. Check awakening → create BATTLE_AWAKENING notification
       f. Recalculate grade
       g. Check achievements → unlock + award bonus XP
    3. Return result with XP, level, achievements
```

### Student Uses AI Tutor
```
Student sends message → POST /api/ai/student/chat
  → withAiRoute middleware:
    1. Auth + role check
    2. Tenant rate limit check
    3. Student daily limit check (50/day)
  → Handler:
    1. Load conversation history (StudentAiProfile)
    2. Append user message
    3. Call studentTutor() → Anthropic API (Haiku model)
    4. Save updated history
  → Middleware:
    5. Log to AiGenerationLog (tokens, cost, latency)
    6. Increment tenant counter
  → Return response
```

### Character Awakening
```
Student reaches Level 5 via awardXP()
  → BATTLE_AWAKENING notification created
  → Student visits /s/awakening
  → Step 1: GET themes → select theme
  → Step 2: GET /api/characters/propose?theme=X
    → Fetch StudentClassProfiles → aggregate subject averages
    → calculateBattleStats(averages) → compute stat profile
    → Score Common classes against student stats → return ranked
  → Step 3: Confirm selection
  → Step 4: POST /api/characters/awaken
    → Validate: level >= 5, no existing character, class is Common + matches theme
    → calculateBattleStats() → create BattleCharacter with stats
    → Create activity feed entry
    → Redirect to /s/character
```

---

## 12. Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...

# AI
ANTHROPIC_API_KEY=...

# (Future) Cache
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## 13. Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.2.15 | React framework |
| react | 18.3.1 | UI library |
| next-auth | 5.0.0-beta.25 | Authentication |
| @prisma/client | 5.22.0 | Database ORM |
| @anthropic-ai/sdk | ^0.80.0 | AI API |
| zod | 3.23.0 | Schema validation |
| zustand | 4.5.0 | State management |
| framer-motion | 11.2.0 | Animations |
| tailwindcss | 3.4.4 | Styling |
| @tanstack/react-query | 5.50.0 | Data fetching |
| sonner | 1.5.0 | Toast notifications |
| lucide-react | 0.400.0 | Icons |
| bcryptjs | 2.4.3 | Password hashing |

---

## 14. Remaining Work

### Phase 5 — Battle System (remaining: 5.2–5.7)
- 5.2: Class evolution system (unlock higher rarity classes)
- 5.3: Skill system (156 skills, equip/unequip, mastery)
- 5.4: Battle engine (turn-based combat, damage, status effects)
- 5.5: Battle UI (arena, animations, action selection)
- 5.6: PvP system (matchmaking, rankings, daily limits)
- 5.7: Shop & economy (KP currency, items, equipment)

### Phase 6 — Polish & Launch
- 6.1: Notification system (push, email)
- 6.2: Parent dashboard (child linking, progress overview)
- 6.3: Analytics (teacher charts, student tracking)
- 6.4: Final polish (mobile, performance, security, deploy)
