# EduMind AI — Database Schema

## Document Info
```
Version: 1.0.0
Database: PostgreSQL (Supabase)
ORM: Prisma 5.x
```

---

## 1. Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              EDUMIND DATABASE ERD                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   TENANT    │────────<│    USER     │>────────│   SESSION   │
│             │         │             │         │             │
│ id          │         │ id          │         │ id          │
│ type        │         │ tenant_id   │         │ user_id     │
│ name        │         │ email       │         │ token       │
│ settings    │         │ role        │         │ expires_at  │
│ plan        │         │ profile     │         └─────────────┘
└──────┬──────┘         └──────┬──────┘
       │                       │
       │         ┌─────────────┴─────────────┬─────────────────┬────────────────┐
       │         │                           │                 │                │
       │    ┌────▼────┐               ┌──────▼──────┐   ┌──────▼──────┐  ┌──────▼──────┐
       │    │ TEACHER │               │  STUDENT    │   │   PARENT    │  │SCHOOL_ADMIN │
       │    │         │               │             │   │             │  │             │
       │    │ id      │               │ id          │   │ id          │  │ id          │
       │    │ user_id │───────────┐   │ user_id     │   │ user_id     │  │ user_id     │
       │    │ subjects│           │   │ grade_year  │   │ children[]  │  │ permissions │
       │    └────┬────┘           │   │ avatar      │   └─────────────┘  └─────────────┘
       │         │                │   │ xp_total    │
       │         │                │   │ level       │
       │    ┌────▼────┐           │   └──────┬──────┘
       │    │  CLASS  │<──────────┘          │
       │    │         │                      │
       │    │ id      │         ┌────────────┴─────────────┐
       │    │teacher_id         │                          │
       │    │ subject │   ┌─────▼─────┐           ┌────────▼────────┐
       │    │ grade   │   │CLASS_ENROLL│          │ STUDENT_PROFILE │
       │    └────┬────┘   │           │           │                 │
       │         │        │ class_id  │           │ student_id      │
       │         │        │ student_id│           │ class_id        │
       │    ┌────▼────┐   │ joined_at │           │ xp              │
       │    │ LESSON  │   └───────────┘           │ level           │
       │    │         │                           │ skills{}        │
       │    │ id      │                           └─────────────────┘
       │    │class_id │
       │    │ topic   │◄────────────────────────────────────┐
       │    │ date    │                                     │
       │    └────┬────┘                                     │
       │         │                                          │
       │    ┌────▼─────────┐      ┌────────────┐     ┌─────┴──────┐
       │    │ LESSON_PLAN  │      │  HOMEWORK  │     │   QUIZ     │
       │    │              │      │            │     │            │
       │    │ lesson_id    │      │ class_id   │     │ class_id   │
       │    │ ai_generated │      │ lesson_id  │     │ lesson_id  │
       │    │ structure    │      │ due_date   │     │ questions  │
       │    └──────────────┘      └─────┬──────┘     └─────┬──────┘
       │                                │                  │
       │                          ┌─────▼──────┐    ┌──────▼──────┐
       │                          │ HW_SUBMIT  │    │ QUIZ_RESULT │
       │                          │            │    │             │
       │                          │ student_id │    │ student_id  │
       │                          │ homework_id│    │ quiz_id     │
       │                          │ score      │    │ score       │
       │                          │ feedback   │    │ answers     │
       │                          └────────────┘    └─────────────┘
       │
       │    ┌─────────────────────────────────────────────────────────┐
       │    │                    GAMIFICATION                         │
       │    └─────────────────────────────────────────────────────────┘
       │
       │    ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
       │    │ ACHIEVEMENT │    │STU_ACHIEVE  │    │ ACTIVITY_FEED   │
       │    │             │    │             │    │                 │
       │    │ id          │◄───│ achieve_id  │    │ id              │
       │    │ name        │    │ student_id  │    │ student_id      │
       │    │ condition   │    │ unlocked_at │    │ type            │
       │    │ xp_reward   │    └─────────────┘    │ data            │
       │    └─────────────┘                       └─────────────────┘
       │
       │    ┌─────────────┐    ┌─────────────┐
       │    │ LEADERBOARD │    │ STUDENT_    │
       │    │   _ENTRY    │    │   FOLLOW    │
       │    │             │    │             │
       │    │ student_id  │    │ follower_id │
       │    │ scope       │    │ following_id│
       │    │ rank        │    └─────────────┘
       │    │ xp          │
       │    └─────────────┘
       │
       │    ┌─────────────────────────────────────────────────────────┐
       │    │                    COMMUNICATION                        │
       │    └─────────────────────────────────────────────────────────┘
       │
       │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
       │    │NOTIFICATION │    │  MESSAGE    │    │   INVITE    │
       │    │             │    │             │    │             │
       │    │ user_id     │    │ sender_id   │    │ class_id    │
       │    │ type        │    │ receiver_id │    │ code        │
       │    │ read        │    │ content     │    │ expires_at  │
       └────│ data        │    └─────────────┘    └─────────────┘
            └─────────────┘
```

---

## 2. Complete Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================================================
// ENUMS
// ============================================================================

enum TenantType {
  SCHOOL
  PRIVATE_TUTOR
}

enum UserRole {
  TECH_ADMIN
  SCHOOL_ADMIN
  TEACHER
  STUDENT
  PARENT
}

enum SubscriptionPlan {
  FREE_TRIAL
  TUTOR_BASIC
  TUTOR_PRO
  SCHOOL_BASIC
  SCHOOL_PRO
  ENTERPRISE
}

enum Subject {
  // Core Academic
  MATHEMATICS
  ENGLISH
  PHYSICS
  CHEMISTRY
  BIOLOGY
  COMPUTER_SCIENCE
  HISTORY
  GEOGRAPHY
  ECONOMICS
  PSYCHOLOGY
  SOCIOLOGY
  
  // Languages
  GERMAN
  FRENCH
  SPANISH
  JAPANESE
  CHINESE
  RUSSIAN
  LATIN
  UKRAINIAN
  DUTCH
  
  // Arts
  ART
  MUSIC
  DRAMA
  DANCE
  PHOTOGRAPHY
  
  // Technical
  ENGINEERING
  ROBOTICS
  WEB_DEVELOPMENT
  APP_DEVELOPMENT
  DATA_SCIENCE
  
  // Business
  ACCOUNTING
  MARKETING
  ENTREPRENEURSHIP
  
  // Other
  PHYSICAL_EDUCATION
  HEALTH
  PHILOSOPHY
  RELIGIOUS_STUDIES
}

enum GradeYear {
  GRADE_1
  GRADE_2
  GRADE_3
  GRADE_4
  GRADE_5
  GRADE_6
  GRADE_7
  GRADE_8
  GRADE_9
  GRADE_10
  GRADE_11
  GRADE_12
  UNIVERSITY_1
  UNIVERSITY_2
  UNIVERSITY_3
  UNIVERSITY_4
  ADULT
}

enum LessonStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum HomeworkStatus {
  ASSIGNED
  SUBMITTED
  GRADED
  RETURNED
}

enum QuizType {
  DIAGNOSTIC
  PRACTICE
  TEST
  EXAM
  BOSS_BATTLE
}

enum AchievementRarity {
  COMMON
  UNCOMMON
  RARE
  EPIC
  LEGENDARY
  MYTHIC
}

enum NotificationType {
  LESSON_REMINDER
  HOMEWORK_ASSIGNED
  HOMEWORK_GRADED
  QUIZ_AVAILABLE
  ACHIEVEMENT_UNLOCKED
  LEVEL_UP
  MESSAGE
  SYSTEM
  PARENT_ALERT
}

enum ActivityType {
  LESSON_COMPLETED
  HOMEWORK_SUBMITTED
  QUIZ_COMPLETED
  ACHIEVEMENT_UNLOCKED
  LEVEL_UP
  STREAK_MILESTONE
  RANK_UP
}

enum AvatarStyle {
  CYBERPUNK
  FANTASY
  COSMIC
  NATURE
  STEAMPUNK
  MINIMAL
}

enum ThemePreference {
  DARK_MODERN
  PLAYFUL_COLORFUL
  CORPORATE_PROFESSIONAL
  WARM_FRIENDLY
  SYSTEM
}

// ============================================================================
// TENANT & USER
// ============================================================================

model Tenant {
  id        String      @id @default(cuid())
  type      TenantType
  name      String
  slug      String      @unique
  logo      String?
  
  // Settings
  settings  Json        @default("{}")  // Theme, language, features
  features  String[]    @default([])    // Enabled features
  
  // Subscription
  plan              SubscriptionPlan @default(FREE_TRIAL)
  subscriptionId    String?          // Paddle subscription ID
  trialEndsAt       DateTime?
  subscriptionEndsAt DateTime?
  
  // Limits
  maxStudents       Int       @default(5)
  maxTeachers       Int       @default(1)
  aiRequestsLimit   Int       @default(100)
  aiRequestsUsed    Int       @default(0)
  aiRequestsResetAt DateTime?
  
  // Relations
  users             User[]
  classes           Class[]
  invites           Invite[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([slug])
  @@index([plan])
}

model User {
  id        String    @id @default(cuid())
  tenantId  String
  tenant    Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Auth
  email           String    @unique
  emailVerified   DateTime?
  passwordHash    String?
  
  // OAuth
  microsoftId     String?   @unique
  googleId        String?   @unique
  
  // Profile
  role            UserRole
  firstName       String
  lastName        String
  avatar          String?
  phone           String?
  timezone        String    @default("UTC")
  language        String    @default("en") // en, uk, de, ja, nl
  
  // Preferences
  theme           ThemePreference @default(SYSTEM)
  notifications   Json      @default("{}") // Notification preferences
  
  // Status
  isActive        Boolean   @default(true)
  lastActiveAt    DateTime?
  
  // Role-specific profiles
  teacherProfile  Teacher?
  studentProfile  Student?
  parentProfile   Parent?
  schoolAdmin     SchoolAdmin?
  
  // Relations
  sessions        Session[]
  sentMessages    Message[]     @relation("SentMessages")
  receivedMessages Message[]    @relation("ReceivedMessages")
  notifications   Notification[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([tenantId])
  @@index([email])
  @@index([role])
}

model Session {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  token       String   @unique
  userAgent   String?
  ipAddress   String?
  
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([token])
}

// ============================================================================
// ROLE-SPECIFIC PROFILES
// ============================================================================

model SchoolAdmin {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Permissions
  permissions Json   @default("{}") // Granular permissions
  
  // Analytics access
  canViewFinancials Boolean @default(true)
  canManageStaff    Boolean @default(true)
  canManageSettings Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Teacher {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Professional info
  subjects        Subject[]
  qualifications  String[]
  bio             String?
  yearsExperience Int?
  
  // For private tutors
  isPrivateTutor  Boolean @default(false)
  hourlyRate      Decimal? @db.Decimal(10, 2)
  
  // Settings
  preferences     Json    @default("{}")  // AI preferences, teaching style
  
  // Relations
  classes         Class[]
  lessons         Lesson[]
  homeworks       Homework[]
  quizzes         Quiz[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}

model Student {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Academic info
  gradeYear       GradeYear
  dateOfBirth     DateTime?
  
  // Gamification - Global
  totalXp         Int       @default(0)
  overallLevel    Int       @default(1)
  currentGrade    String    @default("E")  // E, D, C, B, A, S, S+
  streakDays      Int       @default(0)
  longestStreak   Int       @default(0)
  lastActivityAt  DateTime?
  
  // Avatar & Customization
  avatarUrl       String?
  avatarStyle     AvatarStyle @default(FANTASY)
  profileFrame    String?     // Unlocked frame
  badges          String[]    @default([])
  title           String?     // Unlocked title
  
  // Privacy settings
  profileVisibility String   @default("class") // everyone, class, private
  showOnLeaderboard Boolean  @default(true)
  showAchievements  Boolean  @default(true)
  showStats         Boolean  @default(true)
  
  // Relations
  classEnrollments ClassEnrollment[]
  classProfiles    StudentClassProfile[]
  homeworkSubmissions HomeworkSubmission[]
  quizResults      QuizResult[]
  achievements     StudentAchievement[]
  activityFeed     ActivityFeed[]
  followers        StudentFollow[]  @relation("Following")
  following        StudentFollow[]  @relation("Followers")
  
  // Parent connection
  parents          ParentStudent[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([gradeYear])
  @@index([totalXp])
}

model Parent {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Notification preferences
  alertOnLowGrade   Boolean @default(true)
  alertOnMissedHw   Boolean @default(true)
  alertOnAbsence    Boolean @default(true)
  weeklyDigest      Boolean @default(true)
  
  // Relations
  children          ParentStudent[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ParentStudent {
  id         String   @id @default(cuid())
  parentId   String
  parent     Parent   @relation(fields: [parentId], references: [id], onDelete: Cascade)
  studentId  String
  student    Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  // Verification
  verified   Boolean  @default(false)
  verifiedAt DateTime?
  
  createdAt  DateTime @default(now())
  
  @@unique([parentId, studentId])
}

// ============================================================================
// CLASSES & ENROLLMENT
// ============================================================================

model Class {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  teacherId String
  teacher   Teacher  @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  
  // Class info
  name            String
  subject         Subject
  gradeYear       GradeYear
  description     String?
  
  // Schedule
  lessonsPerWeek  Int       @default(2)
  defaultDuration Int       @default(45) // minutes
  
  // Settings
  settings        Json      @default("{}")
  isArchived      Boolean   @default(false)
  
  // Learning plan (AI generated)
  learningPlan    LearningPlan?
  
  // Relations
  enrollments     ClassEnrollment[]
  studentProfiles StudentClassProfile[]
  lessons         Lesson[]
  homeworks       Homework[]
  quizzes         Quiz[]
  invites         Invite[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([tenantId])
  @@index([teacherId])
  @@index([subject])
}

model ClassEnrollment {
  id        String   @id @default(cuid())
  classId   String
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  studentId String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  // Status
  isActive  Boolean  @default(true)
  joinedAt  DateTime @default(now())
  leftAt    DateTime?
  
  @@unique([classId, studentId])
  @@index([classId])
  @@index([studentId])
}

model StudentClassProfile {
  id        String   @id @default(cuid())
  studentId String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  classId   String
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  
  // Class-specific gamification
  classXp           Int       @default(0)
  classLevel        Int       @default(1)
  classGrade        String    @default("E")  // E, D, C, B, A, S, S+
  
  // Skills (JSON for flexibility per subject)
  // Example for English: {"grammar": 45, "vocabulary": 60, "speaking": 30, "listening": 55, "writing": 40}
  skills            Json      @default("{}")
  
  // Progress tracking
  lessonsCompleted  Int       @default(0)
  homeworkCompleted Int       @default(0)
  quizzesCompleted  Int       @default(0)
  averageScore      Float?
  
  // Streaks for this class
  lessonStreak      Int       @default(0)
  homeworkStreak    Int       @default(0)
  
  // AI insights (cached)
  aiInsights        Json?     // Strengths, weaknesses, recommendations
  insightsUpdatedAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([studentId, classId])
  @@index([studentId])
  @@index([classId])
  @@index([classXp])
}

// ============================================================================
// LEARNING & LESSONS
// ============================================================================

model LearningPlan {
  id        String   @id @default(cuid())
  classId   String   @unique
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  
  // Plan details
  title           String
  description     String?
  targetLevel     String?     // e.g., "B1" for languages
  totalWeeks      Int
  lessonsPerWeek  Int
  
  // AI generation
  generatedByAi   Boolean   @default(false)
  aiModel         String?
  generatedAt     DateTime?
  
  // Structure (phases/modules)
  // [{phase: 1, name: "Foundations", weeks: 4, topics: [...], objectives: [...]}]
  phases          Json      @default("[]")
  
  // Materials & resources
  textbooks       String[]  @default([])
  resources       Json      @default("[]")
  
  // Progress
  currentPhase    Int       @default(1)
  currentWeek     Int       @default(1)
  
  // Teacher adjustments
  teacherNotes    String?
  lastReviewedAt  DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Lesson {
  id        String   @id @default(cuid())
  classId   String
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  teacherId String
  teacher   Teacher  @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  
  // Lesson info
  title           String
  description     String?
  topic           String
  
  // Schedule
  scheduledAt     DateTime
  duration        Int       @default(45) // minutes
  status          LessonStatus @default(SCHEDULED)
  
  // For recurring lessons
  recurringId     String?
  
  // Lesson plan (AI generated)
  lessonPlan      LessonPlan?
  
  // Relations
  homeworks       Homework[]
  quizzes         Quiz[]
  attendance      LessonAttendance[]
  
  // Notes & feedback
  teacherNotes    String?
  studentFeedback Json?     // Aggregated feedback
  
  // Completion
  startedAt       DateTime?
  completedAt     DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([classId])
  @@index([teacherId])
  @@index([scheduledAt])
  @@index([status])
}

model LessonPlan {
  id        String   @id @default(cuid())
  lessonId  String   @unique
  lesson    Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  // AI generation
  generatedByAi   Boolean   @default(false)
  aiModel         String?
  generatedAt     DateTime?
  
  // Structure
  // {warmup: {...}, mainContent: [...], activities: [...], wrapup: {...}}
  structure       Json      @default("{}")
  
  // Materials
  materials       Json      @default("[]")  // [{type: "video", url: "...", title: "..."}]
  
  // Learning objectives
  objectives      String[]  @default([])
  
  // Skills targeted
  targetSkills    Json      @default("{}")  // {"grammar": 2, "speaking": 1}
  
  // AI tips for teacher
  aiTips          String?
  
  // Teacher modifications
  teacherEdits    Json?
  
  // Can be exported
  exportedPdf     String?   // R2 URL
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model LessonAttendance {
  id        String   @id @default(cuid())
  lessonId  String
  lesson    Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  studentId String
  
  // Attendance
  present   Boolean  @default(true)
  joinedAt  DateTime?
  leftAt    DateTime?
  
  // Participation (teacher marks)
  participationScore Int?    // 1-5
  notes     String?
  
  createdAt DateTime @default(now())
  
  @@unique([lessonId, studentId])
}

// ============================================================================
// HOMEWORK & QUIZZES
// ============================================================================

model Homework {
  id        String   @id @default(cuid())
  classId   String
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  teacherId String
  teacher   Teacher  @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  lessonId  String?
  lesson    Lesson?  @relation(fields: [lessonId], references: [id], onDelete: SetNull)
  
  // Homework info
  title           String
  description     String
  instructions    String?
  
  // AI generation
  generatedByAi   Boolean   @default(false)
  aiModel         String?
  
  // Due date
  assignedAt      DateTime  @default(now())
  dueAt           DateTime
  
  // Grading
  maxScore        Int       @default(100)
  passingScore    Int       @default(60)
  
  // XP reward
  baseXpReward    Int       @default(30)
  bonusXpPerfect  Int       @default(20)
  
  // Attachments
  attachments     Json      @default("[]")  // [{name, url, type}]
  
  // Relations
  submissions     HomeworkSubmission[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([classId])
  @@index([dueAt])
}

model HomeworkSubmission {
  id          String   @id @default(cuid())
  homeworkId  String
  homework    Homework @relation(fields: [homeworkId], references: [id], onDelete: Cascade)
  studentId   String
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  // Submission
  content     String?
  attachments Json     @default("[]")
  submittedAt DateTime @default(now())
  
  // Grading
  status      HomeworkStatus @default(SUBMITTED)
  score       Int?
  percentage  Float?
  
  // Feedback
  teacherFeedback String?
  aiFeedback      String?   // AI-generated feedback
  aiSuggestions   Json?     // Improvement suggestions
  
  // XP earned
  xpEarned    Int       @default(0)
  
  // Late submission
  isLate      Boolean   @default(false)
  
  gradedAt    DateTime?
  gradedBy    String?   // Teacher user ID
  
  @@unique([homeworkId, studentId])
  @@index([studentId])
  @@index([status])
}

model Quiz {
  id        String   @id @default(cuid())
  classId   String
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  teacherId String
  teacher   Teacher  @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  lessonId  String?
  lesson    Lesson?  @relation(fields: [lessonId], references: [id], onDelete: SetNull)
  
  // Quiz info
  title           String
  description     String?
  type            QuizType    @default(PRACTICE)
  
  // AI generation
  generatedByAi   Boolean     @default(false)
  aiModel         String?
  difficulty      Int         @default(50)  // 1-100
  
  // Questions
  // [{id, type, question, options?, correctAnswer, explanation, points, skill}]
  questions       Json        @default("[]")
  totalQuestions  Int         @default(0)
  totalPoints     Int         @default(100)
  
  // Settings
  timeLimit       Int?        // minutes, null = unlimited
  shuffleQuestions Boolean    @default(true)
  showCorrectAnswers Boolean  @default(true)
  allowRetakes    Boolean     @default(false)
  maxAttempts     Int         @default(1)
  
  // Availability
  availableFrom   DateTime?
  availableUntil  DateTime?
  
  // XP rewards
  baseXpReward    Int         @default(50)
  bonusXpPerfect  Int         @default(50)
  
  // Boss battle specific
  isBossBattle    Boolean     @default(false)
  bossName        String?
  bossImage       String?
  
  // Relations
  results         QuizResult[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([classId])
  @@index([type])
}

model QuizResult {
  id        String   @id @default(cuid())
  quizId    String
  quiz      Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  studentId String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  // Attempt tracking
  attemptNumber Int      @default(1)
  
  // Results
  score           Int
  percentage      Float
  correctAnswers  Int
  totalQuestions  Int
  
  // Detailed answers
  // [{questionId, answer, correct, timeSpent}]
  answers         Json      @default("[]")
  
  // Timing
  startedAt       DateTime
  completedAt     DateTime?
  timeSpent       Int?      // seconds
  
  // Skills impact
  skillsGained    Json?     // {"grammar": 5, "vocabulary": 3}
  
  // XP earned
  xpEarned        Int       @default(0)
  
  // Boss battle result
  bossDefeated    Boolean?
  
  createdAt DateTime @default(now())
  
  @@index([quizId])
  @@index([studentId])
  @@index([percentage])
}

// ============================================================================
// GAMIFICATION
// ============================================================================

model Achievement {
  id        String   @id @default(cuid())
  
  // Info
  name            String
  nameTranslations Json     @default("{}")  // {"uk": "...", "de": "..."}
  description     String
  descriptionTranslations Json @default("{}")
  
  // Visual
  icon            String    // Emoji or icon name
  image           String?   // Custom image URL
  
  // Classification
  category        String    // streak, level, homework, quiz, social, skill, hidden
  rarity          AchievementRarity @default(COMMON)
  subject         Subject?  // null = global achievement
  
  // Unlock condition
  conditionType   String    // streak_days, level_reached, homework_perfect, etc.
  conditionValue  Int
  conditionExtra  Json?     // Additional conditions
  
  // Rewards
  xpReward        Int       @default(50)
  unlocksTitle    String?   // Title player can use
  unlocksFrame    String?   // Profile frame
  unlocksBadge    String?   // Badge ID
  
  // Visibility
  isHidden        Boolean   @default(false)  // Secret achievement
  isActive        Boolean   @default(true)
  
  // Relations
  students        StudentAchievement[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([category])
  @@index([rarity])
  @@index([subject])
}

model StudentAchievement {
  id            String   @id @default(cuid())
  studentId     String
  student       Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  
  // Class-specific achievement (null = global)
  classId       String?
  
  // Progress (for progressive achievements)
  progress      Int       @default(0)
  progressMax   Int?
  
  // Unlock
  unlockedAt    DateTime?
  isUnlocked    Boolean   @default(false)
  
  // Notification sent
  notified      Boolean   @default(false)
  
  createdAt DateTime @default(now())
  
  @@unique([studentId, achievementId, classId])
  @@index([studentId])
  @@index([isUnlocked])
}

model ActivityFeed {
  id        String   @id @default(cuid())
  studentId String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  // Activity
  type          ActivityType
  title         String
  description   String?
  
  // Related entity
  relatedType   String?   // achievement, quiz, homework, lesson
  relatedId     String?
  
  // Display data
  icon          String?
  color         String?
  xpGained      Int?
  
  // Visibility
  isPublic      Boolean   @default(true)
  
  createdAt DateTime @default(now())
  
  @@index([studentId])
  @@index([createdAt])
  @@index([isPublic])
}

model StudentFollow {
  id          String   @id @default(cuid())
  followerId  String
  follower    Student  @relation("Followers", fields: [followerId], references: [id], onDelete: Cascade)
  followingId String
  following   Student  @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

model LeaderboardEntry {
  id        String   @id @default(cuid())
  studentId String
  
  // Scope
  scope         String    // global, school:{id}, class:{id}, subject:{subject}
  period        String    // all_time, weekly, monthly
  
  // Rankings
  rank          Int
  previousRank  Int?
  xp            Int
  level         Int
  
  // Calculated at
  calculatedAt  DateTime  @default(now())
  
  @@unique([studentId, scope, period])
  @@index([scope, period, rank])
}

// ============================================================================
// COMMUNICATION
// ============================================================================

model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Content
  type          NotificationType
  title         String
  message       String
  
  // Related entity
  relatedType   String?
  relatedId     String?
  
  // Action
  actionUrl     String?
  
  // Status
  read          Boolean   @default(false)
  readAt        DateTime?
  
  // Push notification
  pushSent      Boolean   @default(false)
  pushSentAt    DateTime?
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([read])
  @@index([createdAt])
}

model Message {
  id          String   @id @default(cuid())
  senderId    String
  sender      User     @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId  String
  receiver    User     @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  
  // Content
  content     String
  attachments Json     @default("[]")
  
  // Status
  read        Boolean   @default(false)
  readAt      DateTime?
  
  createdAt DateTime @default(now())
  
  @@index([senderId])
  @@index([receiverId])
  @@index([createdAt])
}

model Invite {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  classId   String?
  class     Class?   @relation(fields: [classId], references: [id], onDelete: Cascade)
  
  // Invite details
  code          String    @unique
  role          UserRole  // STUDENT or PARENT
  email         String?   // If sent to specific email
  
  // Usage
  maxUses       Int       @default(1)
  usedCount     Int       @default(0)
  
  // Validity
  expiresAt     DateTime
  
  // Creator
  createdById   String
  
  createdAt DateTime @default(now())
  
  @@index([code])
  @@index([classId])
}

// ============================================================================
// CALENDAR
// ============================================================================

model CalendarEvent {
  id        String   @id @default(cuid())
  userId    String
  
  // Event details
  title         String
  description   String?
  
  // Time
  startAt       DateTime
  endAt         DateTime
  allDay        Boolean   @default(false)
  
  // Recurrence
  isRecurring   Boolean   @default(false)
  recurrenceRule String?  // RRULE format
  
  // Related
  lessonId      String?
  homeworkId    String?
  quizId        String?
  
  // External sync
  googleEventId String?
  outlookEventId String?
  
  // Reminders
  reminders     Json      @default("[]")  // [{minutes: 30, sent: false}]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([startAt])
}

// ============================================================================
// AI & ANALYTICS
// ============================================================================

model AiGenerationLog {
  id        String   @id @default(cuid())
  tenantId  String
  userId    String
  
  // Request
  type          String    // learning_plan, lesson_plan, quiz, homework, feedback, assistant
  model         String    // claude-3.5-sonnet, claude-3-haiku
  
  // Input/Output summary (not full content for privacy)
  inputTokens   Int
  outputTokens  Int
  totalTokens   Int
  
  // Cost tracking
  costUsd       Decimal   @db.Decimal(10, 6)
  
  // Performance
  latencyMs     Int
  
  // Status
  success       Boolean
  errorMessage  String?
  
  // Caching
  cacheHit      Boolean   @default(false)
  cacheKey      String?
  
  createdAt DateTime @default(now())
  
  @@index([tenantId])
  @@index([userId])
  @@index([type])
  @@index([createdAt])
}

model StudentAiProfile {
  id        String   @id @default(cuid())
  studentId String   @unique
  
  // Learning profile (AI analyzed)
  learningStyle     String?   // visual, auditory, reading, kinesthetic
  strengthAreas     String[]  @default([])
  weaknessAreas     String[]  @default([])
  preferredDifficulty Int     @default(50)  // 1-100
  
  // Engagement patterns
  peakHours         Json?     // {"monday": [14, 15, 16], ...}
  averageSessionLength Int?   // minutes
  completionRate    Float?
  
  // AI conversation context (for continuity)
  conversationContext Json?
  
  // Last analysis
  lastAnalyzedAt    DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 3. Database Indexes Strategy

```sql
-- Performance critical indexes (add via migration)

-- User lookups
CREATE INDEX CONCURRENTLY idx_users_tenant_role ON users(tenant_id, role);
CREATE INDEX CONCURRENTLY idx_users_active ON users(is_active) WHERE is_active = true;

-- Class queries
CREATE INDEX CONCURRENTLY idx_classes_teacher_active ON classes(teacher_id) WHERE is_archived = false;
CREATE INDEX CONCURRENTLY idx_class_enrollment_active ON class_enrollments(class_id) WHERE is_active = true;

-- Lesson scheduling
CREATE INDEX CONCURRENTLY idx_lessons_schedule ON lessons(class_id, scheduled_at, status);
CREATE INDEX CONCURRENTLY idx_lessons_upcoming ON lessons(scheduled_at) WHERE status = 'SCHEDULED';

-- Homework queries
CREATE INDEX CONCURRENTLY idx_homework_due ON homeworks(class_id, due_at);
CREATE INDEX CONCURRENTLY idx_homework_submissions_pending ON homework_submissions(status) WHERE status = 'SUBMITTED';

-- Gamification
CREATE INDEX CONCURRENTLY idx_student_class_profile_xp ON student_class_profiles(class_id, class_xp DESC);
CREATE INDEX CONCURRENTLY idx_students_total_xp ON students(total_xp DESC);
CREATE INDEX CONCURRENTLY idx_achievements_category ON achievements(category, rarity);

-- Leaderboard
CREATE INDEX CONCURRENTLY idx_leaderboard_scope ON leaderboard_entries(scope, period, rank);

-- Notifications
CREATE INDEX CONCURRENTLY idx_notifications_unread ON notifications(user_id, read, created_at DESC) WHERE read = false;
```

---

## 4. Database Triggers

```sql
-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- Repeat for other tables...

-- Auto-calculate student level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INT)
RETURNS INT AS $$
BEGIN
  -- Level formula: level = floor(sqrt(xp / 100)) + 1
  -- Level 1: 0 XP, Level 10: 8,100 XP, Level 100: 980,100 XP
  RETURN GREATEST(1, LEAST(100, FLOOR(SQRT(xp / 100.0)) + 1));
END;
$$ LANGUAGE plpgsql;

-- Auto-calculate grade from level
CREATE OR REPLACE FUNCTION calculate_grade(level INT, homework_avg FLOAT, quiz_avg FLOAT)
RETURNS TEXT AS $$
DECLARE
  combined_score FLOAT;
BEGIN
  -- Grade based on level, homework, and quiz performance
  combined_score := (level * 0.3) + (COALESCE(homework_avg, 50) * 0.35) + (COALESCE(quiz_avg, 50) * 0.35);
  
  RETURN CASE
    WHEN combined_score >= 95 THEN 'S+'
    WHEN combined_score >= 90 THEN 'S'
    WHEN combined_score >= 80 THEN 'A'
    WHEN combined_score >= 70 THEN 'B'
    WHEN combined_score >= 60 THEN 'C'
    WHEN combined_score >= 50 THEN 'D'
    ELSE 'E'
  END;
END;
$$ LANGUAGE plpgsql;

-- Update student level when XP changes
CREATE OR REPLACE FUNCTION update_student_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.overall_level := calculate_level(NEW.total_xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_student_level
  BEFORE UPDATE OF total_xp ON students
  FOR EACH ROW EXECUTE FUNCTION update_student_level();

-- Update class profile level when XP changes
CREATE OR REPLACE FUNCTION update_class_profile_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.class_level := calculate_level(NEW.class_xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_class_profile_level
  BEFORE UPDATE OF class_xp ON student_class_profiles
  FOR EACH ROW EXECUTE FUNCTION update_class_profile_level();
```

---

## 5. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Tenant isolation
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Students can only see their own data
CREATE POLICY student_own_data ON students
  FOR SELECT
  USING (user_id = auth.uid());

-- Students can see classmates (with privacy settings)
CREATE POLICY student_classmates ON students
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_enrollments ce1
      JOIN class_enrollments ce2 ON ce1.class_id = ce2.class_id
      WHERE ce1.student_id = id
      AND ce2.student_id = (SELECT id FROM students WHERE user_id = auth.uid())
    )
    AND profile_visibility IN ('everyone', 'class')
  );

-- Teachers can see their students
CREATE POLICY teacher_students ON students
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_enrollments ce
      JOIN classes c ON ce.class_id = c.id
      JOIN teachers t ON c.teacher_id = t.id
      WHERE ce.student_id = id
      AND t.user_id = auth.uid()
    )
  );

-- Parents can see their children
CREATE POLICY parent_children ON students
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_students ps
      JOIN parents p ON ps.parent_id = p.id
      WHERE ps.student_id = id
      AND p.user_id = auth.uid()
    )
  );
```

---

**End of Database Schema Document**
