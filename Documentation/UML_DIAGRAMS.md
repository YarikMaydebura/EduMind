# EduMind AI — UML Diagrams

## Document Info
```
Version: 1.1.0
Format: Mermaid.js
Purpose: System diagrams for documentation and development
Note: Each diagram is standalone and can be rendered separately
```

---

## 1. Entity Relationship Diagrams (ERD)

### 1.1 User & Tenant Management

```mermaid
erDiagram
    TENANT ||--o{ USER : contains
    TENANT ||--o{ CLASS : has
    TENANT ||--o{ INVITE : generates
    
    TENANT {
        uuid id PK
        string type
        string name
        string slug UK
        string plan
        int max_students
        int ai_requests_used
        timestamp created_at
    }
    
    USER ||--o| TEACHER : is_a
    USER ||--o| STUDENT : is_a
    USER ||--o| PARENT : is_a
    USER ||--o{ SESSION : has
    USER ||--o{ NOTIFICATION : receives
    
    USER {
        uuid id PK
        uuid tenant_id FK
        string email UK
        string password_hash
        string role
        string first_name
        string last_name
        string language
        string theme
        timestamp last_active_at
    }
```

### 1.2 Role Profiles

```mermaid
erDiagram
    TEACHER ||--o{ CLASS : teaches
    TEACHER ||--o{ LESSON : conducts
    TEACHER ||--o{ HOMEWORK : assigns
    TEACHER ||--o{ QUIZ : creates
    
    TEACHER {
        uuid id PK
        uuid user_id FK
        string subjects
        boolean is_private_tutor
        json preferences
    }
    
    STUDENT ||--o{ CLASS_ENROLLMENT : enrolled_in
    STUDENT ||--o{ HOMEWORK_SUBMISSION : submits
    STUDENT ||--o{ QUIZ_RESULT : takes
    STUDENT ||--o{ STUDENT_ACHIEVEMENT : earns
    
    STUDENT {
        uuid id PK
        uuid user_id FK
        string grade_year
        int total_xp
        int overall_level
        string current_grade
        int streak_days
        string avatar_url
    }
    
    PARENT ||--o{ PARENT_STUDENT : links_to
    PARENT_STUDENT }o--|| STUDENT : monitors
    
    PARENT {
        uuid id PK
        uuid user_id FK
        boolean alert_on_low_grade
        boolean weekly_digest
    }
```

### 1.3 Class & Enrollment

```mermaid
erDiagram
    CLASS ||--o{ CLASS_ENROLLMENT : has
    CLASS ||--o{ LESSON : contains
    CLASS ||--o{ HOMEWORK : has
    CLASS ||--o{ QUIZ : has
    CLASS ||--o| LEARNING_PLAN : follows
    
    CLASS {
        uuid id PK
        uuid tenant_id FK
        uuid teacher_id FK
        string name
        string subject
        string grade_year
        int lessons_per_week
        boolean is_archived
    }
    
    CLASS_ENROLLMENT {
        uuid id PK
        uuid class_id FK
        uuid student_id FK
        boolean is_active
        timestamp joined_at
    }
    
    STUDENT_CLASS_PROFILE {
        uuid id PK
        uuid student_id FK
        uuid class_id FK
        int class_xp
        int class_level
        string class_grade
        json skills
    }
```

### 1.4 Learning Content

```mermaid
erDiagram
    LESSON ||--o| LESSON_PLAN : has
    LESSON ||--o{ LESSON_ATTENDANCE : tracks
    LESSON ||--o{ HOMEWORK : assigns
    
    LESSON {
        uuid id PK
        uuid class_id FK
        uuid teacher_id FK
        string title
        string topic
        timestamp scheduled_at
        int duration
        string status
    }
    
    LESSON_PLAN {
        uuid id PK
        uuid lesson_id FK
        json structure
        json materials
        string objectives
        boolean generated_by_ai
    }
    
    LEARNING_PLAN {
        uuid id PK
        uuid class_id FK
        string title
        int total_weeks
        json phases
        boolean generated_by_ai
    }
```

### 1.5 Homework & Quizzes

```mermaid
erDiagram
    HOMEWORK ||--o{ HOMEWORK_SUBMISSION : has
    
    HOMEWORK {
        uuid id PK
        uuid class_id FK
        uuid teacher_id FK
        string title
        timestamp due_at
        int max_score
        int base_xp_reward
        boolean generated_by_ai
    }
    
    HOMEWORK_SUBMISSION {
        uuid id PK
        uuid homework_id FK
        uuid student_id FK
        string content
        string status
        int score
        string teacher_feedback
        string ai_feedback
        int xp_earned
    }
    
    QUIZ ||--o{ QUIZ_RESULT : has
    
    QUIZ {
        uuid id PK
        uuid class_id FK
        string title
        string type
        json questions
        int time_limit
        boolean is_boss_battle
    }
    
    QUIZ_RESULT {
        uuid id PK
        uuid quiz_id FK
        uuid student_id FK
        int score
        float percentage
        int time_spent
        int xp_earned
    }
```

### 1.6 Gamification

```mermaid
erDiagram
    ACHIEVEMENT ||--o{ STUDENT_ACHIEVEMENT : unlocked_by
    
    ACHIEVEMENT {
        uuid id PK
        string name
        string description
        string icon
        string category
        string rarity
        string condition_type
        int condition_value
        int xp_reward
        boolean is_hidden
    }
    
    STUDENT_ACHIEVEMENT {
        uuid id PK
        uuid student_id FK
        uuid achievement_id FK
        int progress
        boolean is_unlocked
        timestamp unlocked_at
    }
    
    ACTIVITY_FEED {
        uuid id PK
        uuid student_id FK
        string type
        string title
        int xp_gained
        boolean is_public
        timestamp created_at
    }
    
    LEADERBOARD_ENTRY {
        uuid id PK
        uuid student_id FK
        string scope
        string period
        int rank
        int xp
    }
```

---

## 2. Use Case Diagram

```mermaid
graph TB
    subgraph Actors
        T[Teacher]
        S[Student]
        P[Parent]
        AI[AI System]
    end
    
    subgraph Authentication
        UC1((Register))
        UC2((Login))
        UC3((OAuth SSO))
    end
    
    subgraph Class_Management
        UC10((Create Class))
        UC11((Invite Students))
        UC12((Manage Enrollment))
    end
    
    subgraph Learning
        UC20((Create Lesson))
        UC21((AI Learning Plan))
        UC22((AI Lesson Plan))
    end
    
    subgraph Homework_Quizzes
        UC30((Create Homework))
        UC31((Submit Homework))
        UC32((Take Quiz))
        UC33((Boss Battle))
    end
    
    subgraph Gamification
        UC40((Earn XP))
        UC41((Level Up))
        UC42((Unlock Achievement))
        UC43((View Leaderboard))
    end
    
    T --> UC1 & UC2 & UC10 & UC11 & UC20 & UC30
    S --> UC2 & UC3 & UC31 & UC32 & UC33 & UC40 & UC41 & UC42 & UC43
    P --> UC2 & UC3
    
    AI --> UC21 & UC22
    UC20 -.-> AI
    UC30 -.-> AI
```

---

## 3. Class Diagram - Core Domain

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +UserRole role
        +String firstName
        +String lastName
        +login()
        +logout()
    }
    
    class Teacher {
        +UUID id
        +UUID userId
        +Subject[] subjects
        +createClass()
        +createLesson()
        +assignHomework()
    }
    
    class Student {
        +UUID id
        +UUID userId
        +Int totalXp
        +Int overallLevel
        +String currentGrade
        +Int streakDays
        +earnXP()
        +levelUp()
        +unlockAchievement()
    }
    
    class Class {
        +UUID id
        +String name
        +Subject subject
        +generateInvite()
        +addStudent()
    }
    
    class Achievement {
        +UUID id
        +String name
        +AchievementRarity rarity
        +Int xpReward
        +checkCondition()
    }
    
    User <|-- Teacher
    User <|-- Student
    
    Teacher "1" --> "*" Class : teaches
    Student "*" --> "*" Class : enrolled_in
    Student "1" --> "*" Achievement : earns
```

---

## 4. Sequence Diagram - Student Takes Quiz

```mermaid
sequenceDiagram
    participant S as Student
    participant UI as Frontend
    participant API as API Server
    participant DB as Database
    participant GM as Gamification
    
    S->>UI: Click Start Quiz
    UI->>API: GET /quizzes/id/start
    API->>DB: Get quiz data
    DB-->>API: Quiz with questions
    API->>DB: Create quiz attempt
    API-->>UI: Quiz data
    UI-->>S: Display quiz
    
    Note over S,UI: Student answers questions
    
    S->>UI: Submit answers
    UI->>API: POST /quizzes/attemptId/submit
    API->>API: Calculate score
    API->>GM: Calculate XP reward
    GM->>DB: Update student XP
    GM->>GM: Check achievements
    
    opt Achievement unlocked
        GM->>DB: Create achievement record
        GM-->>API: Achievement unlocked
    end
    
    API-->>UI: Quiz result + rewards
    UI-->>S: Show results
```

---

## 5. Sequence Diagram - AI Generates Lesson Plan

```mermaid
sequenceDiagram
    participant T as Teacher
    participant UI as Frontend
    participant API as API Server
    participant Cache as Redis
    participant AI as AI API
    participant DB as Database
    
    T->>UI: Request lesson plan
    UI->>API: POST /ai/lesson-plan/generate
    API->>API: Check rate limit
    API->>Cache: Check cache
    
    alt Cache hit
        Cache-->>API: Cached response
        API-->>UI: Lesson plan cached
    else Cache miss
        API->>DB: Get class context
        DB-->>API: Class data
        API->>AI: Generate lesson plan
        AI-->>API: Generated plan
        API->>Cache: Store in cache
        API->>DB: Save lesson plan
        API->>DB: Log AI usage
        API-->>UI: Lesson plan data
    end
    
    UI-->>T: Display generated plan
```

---

## 6. Sequence Diagram - Student Onboarding

```mermaid
sequenceDiagram
    participant T as Teacher
    participant S as New Student
    participant UI as Frontend
    participant API as API Server
    participant DB as Database
    
    T->>UI: Generate class invite
    UI->>API: POST /classes/id/invite
    API->>DB: Create invite record
    API-->>UI: Invite URL
    UI-->>T: Show invite link
    
    Note over T,S: Teacher shares link
    
    S->>UI: Open invite link
    UI->>API: GET /invites/code/validate
    API->>DB: Check invite validity
    API-->>UI: Valid - show signup
    
    S->>UI: Fill registration form
    UI->>API: POST /auth/register-with-invite
    API->>DB: Create user
    API->>DB: Create student profile
    API->>DB: Create class enrollment
    API-->>UI: Success + tokens
    UI-->>S: Redirect to dashboard
```

---

## 7. State Diagram - Homework Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Teacher creates
    
    Draft --> Assigned: Publish
    Draft --> Deleted: Delete
    
    Assigned --> Submitted: Student submits
    Assigned --> Overdue: Past due date
    
    Submitted --> Grading: Review
    Grading --> Graded: Score assigned
    Grading --> Returned: Needs revision
    
    Returned --> Submitted: Resubmit
    Graded --> [*]
    
    Overdue --> Submitted: Late submission
    Overdue --> Closed: No submission
    Closed --> [*]
```

---

## 8. State Diagram - Level Progression

```mermaid
stateDiagram-v2
    [*] --> Level1: New student
    
    Level1 --> Level5: Earn XP
    Level5 --> Level10: Earn XP
    Level10 --> Level25: Earn XP
    Level25 --> Level50: Earn XP
    Level50 --> Level75: Earn XP
    Level75 --> Level100: Earn XP
    
    Level100 --> [*]: Max reached
    
    note right of Level5: Title - Student
    note right of Level25: Title - Adept
    note right of Level50: Frame - Golden
    note right of Level100: Title - Legend
```

---

## 9. Component Diagram

```mermaid
graph TB
    subgraph Client_Layer
        WEB[Web App - Next.js]
        MOB[Mobile App - React Native]
    end
    
    subgraph API_Layer
        GW[API Gateway]
        REST[REST API - Express]
        WS[WebSocket - Socket.io]
    end
    
    subgraph Service_Layer
        AUTH[Auth Service]
        CLASS[Class Service]
        GAME[Gamification Service]
        NOTIF[Notification Service]
    end
    
    subgraph AI_Layer
        ROUTER[AI Router]
        SONNET[Advanced AI]
        HAIKU[Fast AI]
    end
    
    subgraph Data_Layer
        PG[(PostgreSQL)]
        REDIS[(Redis)]
        R2[(R2 Storage)]
    end
    
    WEB --> GW
    MOB --> GW
    GW --> REST
    GW --> WS
    
    REST --> AUTH & CLASS & GAME & NOTIF
    
    CLASS --> ROUTER
    ROUTER --> SONNET & HAIKU
    
    AUTH & CLASS & GAME --> PG
    GAME --> REDIS
```

---

## 10. Deployment Diagram

```mermaid
graph TB
    subgraph Users
        BROWSER[Browser]
        IOS[iOS App]
        ANDROID[Android App]
    end
    
    subgraph Cloudflare
        CDN[CDN]
        WAF[WAF]
        R2[(R2 Storage)]
    end
    
    subgraph Vercel
        EDGE[Edge Functions]
        NEXT[Next.js App]
    end
    
    subgraph Railway
        API[Express API]
        WORKER[Background Workers]
    end
    
    subgraph Supabase
        DB[(PostgreSQL)]
        AUTH[Auth]
    end
    
    subgraph Upstash
        REDIS[(Redis)]
    end
    
    subgraph External
        AI_SERVICE[AI API]
        PADDLE[Paddle]
        RESEND[Resend]
    end
    
    BROWSER --> CDN
    IOS --> CDN
    ANDROID --> CDN
    
    CDN --> WAF --> EDGE
    EDGE --> NEXT
    EDGE --> API
    
    NEXT --> AUTH
    API --> DB
    API --> REDIS
    API --> R2
    
    WORKER --> AI_SERVICE
    WORKER --> RESEND
    API --> PADDLE
```

---

## Quick Reference - Mermaid Syntax

### ERD Relationships
```
||--|| : One to One
||--o{ : One to Many  
}o--o{ : Many to Many
```

### Common Issues
1. Avoid comments with double percent signs in some renderers
2. Keep diagrams small - split large ones into sections
3. Avoid special characters in labels
4. Use underscore instead of spaces in identifiers

---

**End of UML Diagrams**
