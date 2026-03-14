# EduMind AI — API Documentation

## Document Info
```
Version: 1.0.0
Base URL: https://api.edumind.ai/v1
Authentication: Bearer JWT Token
```

---

## 1. API Overview

### Base Response Format

```typescript
// Success Response
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
}

// Error Response
interface ErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details?: Record<string, string[]>;
    helpUrl?: string;
  };
  requestId: string;
}
```

### Authentication Headers

```
Authorization: Bearer <access_token>
X-Tenant-ID: <tenant_uuid>  (optional, auto-detected from token)
Accept-Language: en | uk | de | ja | nl
```

### Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Auth endpoints | 10 | 1 minute |
| AI endpoints | Based on plan | Hourly |
| General API | 100 | 1 minute |
| Webhooks | 1000 | 1 minute |

---

## 2. Authentication Endpoints

### POST /auth/register

Register a new user (teacher starting a new account).

```typescript
// Request
POST /auth/register
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Smith",
  "role": "TEACHER",
  "language": "en",
  "tenantType": "PRIVATE_TUTOR" | "SCHOOL"
}

// Response 201
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_xxx",
      "email": "teacher@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "role": "TEACHER"
    },
    "tenant": {
      "id": "tnt_xxx",
      "type": "PRIVATE_TUTOR",
      "name": "John Smith's Classes"
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 900
    }
  }
}
```

### POST /auth/login

```typescript
// Request
POST /auth/login
{
  "email": "teacher@example.com",
  "password": "SecurePass123!"
}

// Response 200
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

### POST /auth/login/microsoft

```typescript
// Request
POST /auth/login/microsoft
{
  "code": "oauth_authorization_code",
  "redirectUri": "https://app.edumind.ai/auth/callback"
}

// Response 200
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... },
    "isNewUser": false
  }
}
```

### POST /auth/refresh

```typescript
// Request
POST /auth/refresh
{
  "refreshToken": "eyJ..."
}

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 900
  }
}
```

### POST /auth/logout

```typescript
// Request
POST /auth/logout
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": null
}
```

### POST /auth/forgot-password

```typescript
// Request
POST /auth/forgot-password
{
  "email": "teacher@example.com"
}

// Response 200
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

---

## 3. User Endpoints

### GET /users/me

Get current user profile.

```typescript
// Response 200
{
  "success": true,
  "data": {
    "id": "usr_xxx",
    "email": "teacher@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "role": "TEACHER",
    "avatar": "https://...",
    "language": "en",
    "theme": "DARK_MODERN",
    "tenant": {
      "id": "tnt_xxx",
      "name": "...",
      "plan": "TUTOR_PRO"
    },
    "profile": {
      // Role-specific profile data
    }
  }
}
```

### PATCH /users/me

Update current user.

```typescript
// Request
PATCH /users/me
{
  "firstName": "John",
  "lastName": "Smith",
  "language": "uk",
  "theme": "WARM_FRIENDLY",
  "notifications": {
    "email": true,
    "push": true,
    "lessonReminders": true
  }
}

// Response 200
{
  "success": true,
  "data": { ... }
}
```

### POST /users/me/avatar

Upload avatar image.

```typescript
// Request
POST /users/me/avatar
Content-Type: multipart/form-data

file: <image file>

// Response 200
{
  "success": true,
  "data": {
    "avatarUrl": "https://..."
  }
}
```

---

## 4. Class Endpoints

### GET /classes

List all classes (for teacher/admin).

```typescript
// Request
GET /classes?page=1&perPage=20&archived=false

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "cls_xxx",
      "name": "English 7A",
      "subject": "ENGLISH",
      "gradeYear": "GRADE_7",
      "studentsCount": 25,
      "lessonsPerWeek": 3,
      "nextLesson": "2024-01-15T09:00:00Z",
      "averageProgress": 65
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 5
  }
}
```

### POST /classes

Create a new class.

```typescript
// Request
POST /classes
{
  "name": "English 7A",
  "subject": "ENGLISH",
  "gradeYear": "GRADE_7",
  "description": "Advanced English class",
  "lessonsPerWeek": 3,
  "defaultDuration": 45,
  "settings": {
    "allowStudentChat": true,
    "showLeaderboard": true
  }
}

// Response 201
{
  "success": true,
  "data": {
    "id": "cls_xxx",
    "name": "English 7A",
    ...
    "inviteCode": "ABC123"
  }
}
```

### GET /classes/:id

Get class details.

```typescript
// Response 200
{
  "success": true,
  "data": {
    "id": "cls_xxx",
    "name": "English 7A",
    "subject": "ENGLISH",
    "gradeYear": "GRADE_7",
    "teacher": {
      "id": "usr_xxx",
      "name": "John Smith"
    },
    "studentsCount": 25,
    "students": [
      {
        "id": "stu_xxx",
        "name": "Anna P.",
        "level": 12,
        "grade": "B",
        "lastActive": "2024-01-14T15:30:00Z"
      }
    ],
    "learningPlan": {
      "id": "lp_xxx",
      "currentPhase": 2,
      "currentWeek": 8,
      "progress": 35
    },
    "stats": {
      "totalLessons": 24,
      "completedLessons": 18,
      "averageAttendance": 92,
      "averageHomeworkScore": 78
    }
  }
}
```

### POST /classes/:id/invite

Generate invite link for students.

```typescript
// Request
POST /classes/:id/invite
{
  "role": "STUDENT",
  "maxUses": 30,
  "expiresIn": "7d"
}

// Response 201
{
  "success": true,
  "data": {
    "code": "ABC123XYZ",
    "url": "https://app.edumind.ai/join/ABC123XYZ",
    "expiresAt": "2024-01-22T00:00:00Z",
    "maxUses": 30,
    "usedCount": 0
  }
}
```

### POST /classes/join

Join class via invite code.

```typescript
// Request
POST /classes/join
{
  "code": "ABC123XYZ"
}

// Response 200
{
  "success": true,
  "data": {
    "class": {
      "id": "cls_xxx",
      "name": "English 7A",
      "teacher": "John Smith"
    },
    "enrollment": {
      "id": "enr_xxx",
      "joinedAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

---

## 5. Lesson Endpoints

### GET /classes/:classId/lessons

List lessons for a class.

```typescript
// Request
GET /classes/:classId/lessons?from=2024-01-01&to=2024-01-31&status=SCHEDULED

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "les_xxx",
      "title": "Past Perfect Tense",
      "topic": "Grammar",
      "scheduledAt": "2024-01-15T09:00:00Z",
      "duration": 45,
      "status": "SCHEDULED",
      "hasLessonPlan": true
    }
  ]
}
```

### POST /classes/:classId/lessons

Create a lesson.

```typescript
// Request
POST /classes/:classId/lessons
{
  "title": "Past Perfect Tense",
  "topic": "Grammar",
  "description": "Learning past perfect tense and its usage",
  "scheduledAt": "2024-01-15T09:00:00Z",
  "duration": 45,
  "isRecurring": false
}

// Response 201
{
  "success": true,
  "data": {
    "id": "les_xxx",
    ...
  }
}
```

### POST /lessons/:id/start

Start a lesson (mark as in progress).

```typescript
// Response 200
{
  "success": true,
  "data": {
    "id": "les_xxx",
    "status": "IN_PROGRESS",
    "startedAt": "2024-01-15T09:02:00Z"
  }
}
```

### POST /lessons/:id/complete

Complete a lesson.

```typescript
// Request
POST /lessons/:id/complete
{
  "teacherNotes": "Good class, students understood the topic well",
  "attendance": [
    { "studentId": "stu_xxx", "present": true, "participationScore": 4 },
    { "studentId": "stu_yyy", "present": false }
  ]
}

// Response 200
{
  "success": true,
  "data": {
    "id": "les_xxx",
    "status": "COMPLETED",
    "completedAt": "2024-01-15T09:47:00Z",
    "xpAwarded": {
      "total": 1250,
      "perStudent": 50
    }
  }
}
```

---

## 6. AI Endpoints

### POST /ai/learning-plan/generate

Generate a learning plan for a class.

```typescript
// Request
POST /ai/learning-plan/generate
{
  "classId": "cls_xxx",
  "totalWeeks": 18,
  "textbook": "English File Intermediate",
  "targetLevel": "B2",
  "objectives": [
    "Improve spoken fluency",
    "Master conditional sentences"
  ],
  "teacherNotes": "Students struggle with pronunciation"
}

// Response 200 (streaming)
{
  "success": true,
  "data": {
    "id": "lp_xxx",
    "status": "generating",
    "streamUrl": "wss://api.edumind.ai/ai/stream/lp_xxx"
  }
}

// Or non-streaming (may take 30-60 seconds)
{
  "success": true,
  "data": {
    "id": "lp_xxx",
    "title": "B1 to B2 English Course",
    "phases": [...],
    "generatedAt": "2024-01-15T10:00:00Z",
    "tokensUsed": 3500
  }
}
```

### POST /ai/lesson-plan/generate

Generate a lesson plan.

```typescript
// Request
POST /ai/lesson-plan/generate
{
  "lessonId": "les_xxx",
  "topic": "Past Perfect Tense",
  "duration": 45,
  "focusSkills": ["grammar", "speaking"],
  "studentLevels": {
    "average": 65,
    "weakAreas": ["speaking", "listening"]
  }
}

// Response 200
{
  "success": true,
  "data": {
    "id": "lspl_xxx",
    "lessonId": "les_xxx",
    "structure": {
      "warmup": {...},
      "introduction": {...},
      "mainContent": [...],
      "practice": {...},
      "wrapup": {...}
    },
    "materials": [...],
    "objectives": [...],
    "aiTips": "Focus on contrasting past simple vs past perfect...",
    "exportPdfUrl": "https://..."
  }
}
```

### POST /ai/quiz/generate

Generate a quiz.

```typescript
// Request
POST /ai/quiz/generate
{
  "classId": "cls_xxx",
  "topic": "Past Perfect Tense",
  "type": "PRACTICE",
  "questionCount": 10,
  "difficulty": 60,
  "questionTypes": ["multiple_choice", "fill_blank"],
  "targetSkills": {
    "grammar": 7,
    "vocabulary": 3
  }
}

// Response 200
{
  "success": true,
  "data": {
    "id": "qz_xxx",
    "title": "Past Perfect Practice Quiz",
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "By the time I arrived, she ___ already left.",
        "options": ["has", "had", "have", "having"],
        "correctAnswer": "had",
        "explanation": "We use 'had' + past participle...",
        "points": 10,
        "skill": "grammar"
      }
    ],
    "totalPoints": 100
  }
}
```

### POST /ai/homework/generate

Generate homework assignment.

```typescript
// Request
POST /ai/homework/generate
{
  "classId": "cls_xxx",
  "lessonId": "les_xxx",
  "topic": "Past Perfect Tense",
  "dueInDays": 3,
  "difficulty": 50,
  "personalized": true  // Different for each student based on their level
}

// Response 200
{
  "success": true,
  "data": {
    "id": "hw_xxx",
    "title": "Past Perfect Practice",
    "description": "Complete the exercises...",
    "assignments": [
      {
        "studentId": "stu_xxx",
        "customDifficulty": 55,
        "exercises": [...]
      }
    ],
    "dueAt": "2024-01-18T23:59:59Z"
  }
}
```

### POST /ai/student/chat

Student AI tutor chat.

```typescript
// Request
POST /ai/student/chat
{
  "studentId": "stu_xxx",
  "classId": "cls_xxx",
  "message": "I don't understand when to use past perfect vs past simple",
  "context": {
    "currentTopic": "Past Perfect Tense",
    "homeworkId": "hw_xxx"  // Optional
  }
}

// Response 200
{
  "success": true,
  "data": {
    "response": "Great question! Let me explain the difference with a simple example 📚\n\nImagine you're telling a story about yesterday...",
    "followUpQuestions": [
      "Can you give me an example using these tenses?",
      "What's the signal word for past perfect?"
    ],
    "relatedMaterials": [
      { "type": "video", "title": "Past Perfect Explained", "url": "..." }
    ]
  }
}
```

### POST /ai/homework/check

AI-assisted homework grading.

```typescript
// Request
POST /ai/homework/check
{
  "homeworkId": "hw_xxx",
  "submissionId": "sub_xxx",
  "autoGrade": true
}

// Response 200
{
  "success": true,
  "data": {
    "score": 85,
    "percentage": 85,
    "feedback": {
      "overall": "Good work! You understood the main concept...",
      "strengths": ["Correct use of had + past participle"],
      "improvements": ["Watch out for irregular past participles"],
      "specificComments": [
        { "question": 1, "comment": "Perfect!", "points": 10 },
        { "question": 2, "comment": "Almost - 'went' not 'gone'", "points": 7 }
      ]
    },
    "suggestedGrade": 85,
    "requiresTeacherReview": false
  }
}
```

---

## 7. Student Endpoints

### GET /students/me

Get current student's profile (student role only).

```typescript
// Response 200
{
  "success": true,
  "data": {
    "id": "stu_xxx",
    "name": "Anna Petrenko",
    "gradeYear": "GRADE_7",
    "totalXp": 7450,
    "overallLevel": 24,
    "currentGrade": "B",
    "streakDays": 18,
    "avatar": "https://...",
    "avatarStyle": "FANTASY",
    "title": "Grammar Guardian",
    "classes": [
      {
        "id": "cls_xxx",
        "name": "English 7A",
        "subject": "ENGLISH",
        "classLevel": 12,
        "classGrade": "A",
        "classXp": 2450
      }
    ],
    "achievements": {
      "total": 48,
      "unlocked": 23
    },
    "stats": {
      "lessonsCompleted": 45,
      "homeworkCompleted": 38,
      "quizzesCompleted": 12,
      "averageScore": 78
    }
  }
}
```

### GET /students/me/classes/:classId

Get student's class-specific data.

```typescript
// Response 200
{
  "success": true,
  "data": {
    "class": {
      "id": "cls_xxx",
      "name": "English 7A",
      "subject": "ENGLISH",
      "teacher": "John Smith"
    },
    "profile": {
      "classXp": 2450,
      "classLevel": 12,
      "classGrade": "A",
      "skills": {
        "grammar": 80,
        "vocabulary": 72,
        "speaking": 35,
        "listening": 48,
        "writing": 58,
        "reading": 65
      },
      "progress": {
        "lessonsCompleted": 18,
        "totalLessons": 24,
        "homeworkCompleted": 15,
        "averageScore": 82
      }
    },
    "upcomingHomework": [...],
    "upcomingQuizzes": [...],
    "recentActivity": [...]
  }
}
```

### GET /students/me/homework

Get student's homework.

```typescript
// Request
GET /students/me/homework?status=ASSIGNED&classId=cls_xxx

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "hw_xxx",
      "title": "Past Perfect Practice",
      "class": "English 7A",
      "dueAt": "2024-01-18T23:59:59Z",
      "status": "ASSIGNED",
      "maxScore": 100,
      "xpReward": 50
    }
  ]
}
```

### POST /students/me/homework/:id/submit

Submit homework.

```typescript
// Request
POST /students/me/homework/:id/submit
Content-Type: multipart/form-data

content: "My answers: 1. had gone, 2. had eaten..."
files: [attachment1.pdf, attachment2.jpg]

// Response 200
{
  "success": true,
  "data": {
    "id": "sub_xxx",
    "homeworkId": "hw_xxx",
    "submittedAt": "2024-01-17T15:30:00Z",
    "status": "SUBMITTED",
    "isLate": false,
    "xpEarned": 20  // Just for submitting
  }
}
```

### GET /students/me/quizzes/:id/start

Start a quiz attempt.

```typescript
// Response 200
{
  "success": true,
  "data": {
    "attemptId": "att_xxx",
    "quiz": {
      "id": "qz_xxx",
      "title": "Past Perfect Quiz",
      "timeLimit": 15,  // minutes
      "totalQuestions": 10
    },
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "By the time I arrived...",
        "options": ["A", "B", "C", "D"]
        // No correct answer shown!
      }
    ],
    "startedAt": "2024-01-17T16:00:00Z",
    "endsAt": "2024-01-17T16:15:00Z"
  }
}
```

### POST /students/me/quizzes/:attemptId/submit

Submit quiz answers.

```typescript
// Request
POST /students/me/quizzes/:attemptId/submit
{
  "answers": [
    { "questionId": "q1", "answer": "B" },
    { "questionId": "q2", "answer": "had gone" }
  ]
}

// Response 200
{
  "success": true,
  "data": {
    "score": 90,
    "percentage": 90,
    "correctAnswers": 9,
    "totalQuestions": 10,
    "timeSpent": 480,  // seconds
    "xpEarned": 75,
    "skillsGained": {
      "grammar": 5,
      "vocabulary": 2
    },
    "achievements": [
      { "id": "quiz_90", "name": "Quiz Master", "xp": 100 }
    ],
    "results": [
      {
        "questionId": "q1",
        "yourAnswer": "B",
        "correctAnswer": "B",
        "correct": true,
        "explanation": "..."
      }
    ]
  }
}
```

---

## 8. Gamification Endpoints

### GET /students/me/achievements

Get student achievements.

```typescript
// Response 200
{
  "success": true,
  "data": {
    "unlocked": [
      {
        "id": "streak_7",
        "name": "Week Warrior",
        "description": "Maintain a 7-day streak",
        "icon": "🔥",
        "rarity": "COMMON",
        "unlockedAt": "2024-01-10T10:00:00Z",
        "xpReward": 75
      }
    ],
    "inProgress": [
      {
        "id": "streak_14",
        "name": "Fortnight Fighter",
        "progress": 11,
        "target": 14,
        "percentage": 78
      }
    ],
    "locked": [
      {
        "id": "streak_30",
        "name": "Monthly Master",
        "description": "Maintain a 30-day streak",
        "rarity": "RARE",
        "hint": "Keep your streak going!"
      }
    ]
  }
}
```

### GET /leaderboard

Get leaderboard.

```typescript
// Request
GET /leaderboard?scope=class:cls_xxx&period=weekly

// Response 200
{
  "success": true,
  "data": {
    "scope": "class:cls_xxx",
    "period": "weekly",
    "entries": [
      {
        "rank": 1,
        "studentId": "stu_xxx",
        "name": "Anna P.",
        "avatar": "https://...",
        "xp": 450,
        "level": 24,
        "grade": "A",
        "change": 2  // Moved up 2 positions
      }
    ],
    "myRank": {
      "rank": 5,
      "xp": 280,
      "change": -1
    }
  }
}
```

### GET /students/me/activity-feed

Get activity feed.

```typescript
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "act_xxx",
      "type": "ACHIEVEMENT_UNLOCKED",
      "title": "Achievement Unlocked!",
      "description": "Week Warrior 🔥",
      "icon": "🏆",
      "xpGained": 75,
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "act_yyy",
      "type": "QUIZ_COMPLETED",
      "title": "Quiz Completed",
      "description": "Past Perfect Quiz - 90%",
      "xpGained": 75,
      "createdAt": "2024-01-15T09:45:00Z"
    }
  ]
}
```

---

## 9. Parent Endpoints

### GET /parents/me/children

Get parent's linked children.

```typescript
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "stu_xxx",
      "name": "Anna Petrenko",
      "gradeYear": "GRADE_7",
      "avatar": "https://...",
      "overallLevel": 24,
      "currentGrade": "B",
      "streakDays": 18,
      "classes": [
        {
          "name": "English 7A",
          "teacher": "John Smith",
          "averageScore": 82
        }
      ],
      "recentAlerts": [],
      "lastActive": "2024-01-15T15:30:00Z"
    }
  ]
}
```

### GET /parents/me/children/:studentId/report

Get detailed report for a child.

```typescript
// Response 200
{
  "success": true,
  "data": {
    "student": {...},
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-15",
    "attendance": {
      "present": 12,
      "absent": 1,
      "total": 13,
      "percentage": 92
    },
    "homework": {
      "completed": 8,
      "total": 9,
      "averageScore": 78,
      "onTimeRate": 88
    },
    "quizzes": {
      "completed": 3,
      "averageScore": 82
    },
    "progress": {
      "xpGained": 650,
      "levelsGained": 2,
      "skillsImproved": ["grammar", "vocabulary"]
    },
    "teacherNotes": [
      {
        "teacher": "John Smith",
        "date": "2024-01-10",
        "note": "Anna is making good progress..."
      }
    ],
    "recommendations": [
      "Practice speaking more",
      "Review listening exercises"
    ]
  }
}
```

---

## 10. Notification Endpoints

### GET /notifications

Get user notifications.

```typescript
// Response 200
{
  "success": true,
  "data": {
    "unreadCount": 5,
    "notifications": [
      {
        "id": "ntf_xxx",
        "type": "HOMEWORK_ASSIGNED",
        "title": "New Homework",
        "message": "Past Perfect Practice due in 3 days",
        "read": false,
        "actionUrl": "/homework/hw_xxx",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

### POST /notifications/:id/read

Mark notification as read.

```typescript
// Response 200
{
  "success": true,
  "data": null
}
```

### POST /notifications/read-all

Mark all notifications as read.

---

## 11. Calendar Endpoints

### GET /calendar/events

Get calendar events.

```typescript
// Request
GET /calendar/events?from=2024-01-01&to=2024-01-31

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "evt_xxx",
      "title": "English 7A - Grammar",
      "type": "lesson",
      "startAt": "2024-01-15T09:00:00Z",
      "endAt": "2024-01-15T09:45:00Z",
      "classId": "cls_xxx",
      "lessonId": "les_xxx"
    },
    {
      "id": "evt_yyy",
      "title": "Homework Due: Past Perfect",
      "type": "homework_due",
      "startAt": "2024-01-18T23:59:59Z",
      "homeworkId": "hw_xxx"
    }
  ]
}
```

### POST /calendar/sync/google

Sync with Google Calendar.

```typescript
// Request
POST /calendar/sync/google
{
  "accessToken": "google_oauth_token"
}

// Response 200
{
  "success": true,
  "data": {
    "synced": true,
    "eventsCreated": 12,
    "nextSync": "2024-01-15T11:00:00Z"
  }
}
```

---

## 12. Admin Endpoints

### GET /admin/analytics/school

School-wide analytics (School Admin only).

```typescript
// Response 200
{
  "success": true,
  "data": {
    "overview": {
      "totalStudents": 450,
      "activeStudents": 420,
      "totalTeachers": 25,
      "totalClasses": 45
    },
    "performance": {
      "averageAttendance": 94,
      "averageHomeworkScore": 76,
      "averageQuizScore": 72,
      "studentsAtRisk": 12
    },
    "engagement": {
      "dailyActiveUsers": 380,
      "weeklyActiveUsers": 420,
      "averageSessionDuration": 25  // minutes
    },
    "aiUsage": {
      "requestsThisMonth": 2500,
      "limit": 5000,
      "topFeatures": ["quiz_generation", "homework_check"]
    }
  }
}
```

### GET /admin/students/at-risk

Get students needing attention.

```typescript
// Response 200
{
  "success": true,
  "data": [
    {
      "student": {...},
      "riskFactors": [
        { "type": "low_attendance", "value": "65%", "severity": "high" },
        { "type": "declining_grades", "value": "-15%", "severity": "medium" }
      ],
      "recommendations": [
        "Schedule parent meeting",
        "Assign mentor"
      ]
    }
  ]
}
```

---

## 13. Webhook Endpoints

### POST /webhooks/paddle

Paddle payment webhooks.

```typescript
// Handled events:
// - subscription_created
// - subscription_updated
// - subscription_cancelled
// - payment_succeeded
// - payment_failed
```

---

**End of API Documentation**
