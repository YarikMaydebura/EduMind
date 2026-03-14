# EduMind AI — AI System Documentation

## Document Info
```
Version: 1.0.0
AI Provider: Anthropic (Claude API)
Purpose: Complete AI integration specifications
```

---

## 1. AI Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AI SERVICE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                          AI ROUTER                                       │   │
│   │                                                                         │   │
│   │  • Model selection based on task complexity                             │   │
│   │  • Rate limiting per tenant                                             │   │
│   │  • Cost tracking                                                        │   │
│   │  • Response caching                                                     │   │
│   └────────────────────────────────┬────────────────────────────────────────┘   │
│                                    │                                            │
│          ┌─────────────────────────┼─────────────────────────┐                  │
│          │                         │                         │                  │
│   ┌──────▼──────┐          ┌───────▼───────┐          ┌──────▼──────┐          │
│   │   Claude    │          │    Claude     │          │   Cache     │          │
│   │ 3.5 Sonnet  │          │   3 Haiku     │          │  (Redis)    │          │
│   │             │          │               │          │             │          │
│   │ Complex:    │          │ Simple:       │          │ • Responses │          │
│   │ • Plans     │          │ • Q&A         │          │ • Prompts   │          │
│   │ • Lessons   │          │ • Hints       │          │ • Templates │          │
│   │ • Analysis  │          │ • Checks      │          │             │          │
│   └─────────────┘          └───────────────┘          └─────────────┘          │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                              AI FEATURES                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│   │  Learning    │ │   Lesson     │ │    Quiz      │ │  Homework    │          │
│   │    Plan      │ │    Plan      │ │  Generator   │ │   Checker    │          │
│   │  Generator   │ │  Generator   │ │              │ │              │          │
│   └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                                                  │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│   │   Student    │ │   Teacher    │ │   Progress   │ │   School     │          │
│   │  Assistant   │ │  Assistant   │ │   Analyzer   │ │  Analyzer    │          │
│   │   (Tutor)    │ │              │ │              │ │              │          │
│   └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Model Selection Strategy

### Model Assignment by Task

| Task | Model | Rationale | Avg Tokens | Est. Cost/Request |
|------|-------|-----------|------------|-------------------|
| Learning Plan Generation | Claude 3.5 Sonnet | Complex, requires deep understanding | ~4,000 | $0.06 |
| Lesson Plan Generation | Claude 3.5 Sonnet | Detailed structure needed | ~3,000 | $0.045 |
| Quiz Generation | Claude 3.5 Sonnet | Quality questions matter | ~2,000 | $0.03 |
| Homework Generation | Claude 3.5 Sonnet | Personalization needed | ~1,500 | $0.022 |
| Homework Checking | Claude 3 Haiku | Pattern matching | ~800 | $0.001 |
| Student Q&A (Hints) | Claude 3 Haiku | Quick responses | ~500 | $0.0006 |
| Simple Feedback | Claude 3 Haiku | Templated responses | ~300 | $0.0004 |
| Progress Analysis | Claude 3.5 Sonnet | Complex analysis | ~2,000 | $0.03 |
| School Analytics | Claude 3.5 Sonnet | Aggregated insights | ~3,000 | $0.045 |

### Model Selection Code

```typescript
// packages/ai/src/model-selector.ts

export type AITask =
  | 'learning_plan'
  | 'lesson_plan'
  | 'quiz_generation'
  | 'homework_generation'
  | 'homework_check'
  | 'student_qa'
  | 'feedback'
  | 'progress_analysis'
  | 'school_analytics';

const MODEL_CONFIG: Record<AITask, { model: string; maxTokens: number }> = {
  learning_plan: { model: 'claude-3-5-sonnet-20241022', maxTokens: 4000 },
  lesson_plan: { model: 'claude-3-5-sonnet-20241022', maxTokens: 3000 },
  quiz_generation: { model: 'claude-3-5-sonnet-20241022', maxTokens: 2500 },
  homework_generation: { model: 'claude-3-5-sonnet-20241022', maxTokens: 2000 },
  homework_check: { model: 'claude-3-haiku-20240307', maxTokens: 1000 },
  student_qa: { model: 'claude-3-haiku-20240307', maxTokens: 800 },
  feedback: { model: 'claude-3-haiku-20240307', maxTokens: 500 },
  progress_analysis: { model: 'claude-3-5-sonnet-20241022', maxTokens: 2000 },
  school_analytics: { model: 'claude-3-5-sonnet-20241022', maxTokens: 3000 },
};

export function getModelConfig(task: AITask) {
  return MODEL_CONFIG[task];
}
```

---

## 3. AI Feature Specifications

### 3.1 Learning Plan Generator

**Purpose:** Generate semester/year-long learning plan for a class based on subject, grade, and objectives.

**Input:**
```typescript
interface LearningPlanInput {
  subject: Subject;
  gradeYear: GradeYear;
  totalWeeks: number;
  lessonsPerWeek: number;
  
  // Optional context
  textbook?: string;
  targetLevel?: string;  // e.g., "B1" for languages
  objectives?: string[];
  currentKnowledge?: string;
  classSize?: number;
  
  // Teacher preferences
  teacherNotes?: string;
  focusAreas?: string[];
}
```

**System Prompt:**
```
You are an expert curriculum designer and educational consultant with decades of experience in creating effective learning plans.

Your task is to create a comprehensive, well-structured learning plan for a {{subject}} class.

REQUIREMENTS:
- Grade/Level: {{gradeYear}}
- Duration: {{totalWeeks}} weeks
- Lessons per week: {{lessonsPerWeek}}
{{#if textbook}}- Primary textbook: {{textbook}}{{/if}}
{{#if targetLevel}}- Target proficiency level: {{targetLevel}}{{/if}}

GUIDELINES:
1. Divide the plan into logical phases/modules (typically 3-5 phases)
2. Each phase should build upon the previous one
3. Include clear learning objectives for each phase
4. Suggest assessment methods for each phase
5. Consider varied learning activities (individual, group, practical)
6. Plan for periodic review and reinforcement
7. Include flexibility for adjustment based on student progress

OUTPUT FORMAT:
Respond with a JSON object following this structure:
{
  "title": "Learning Plan Title",
  "description": "Brief description",
  "targetLevel": "Starting level → Target level",
  "phases": [
    {
      "number": 1,
      "name": "Phase Name",
      "durationWeeks": 4,
      "description": "Phase description",
      "objectives": ["Objective 1", "Objective 2"],
      "topics": [
        {
          "name": "Topic Name",
          "lessons": 3,
          "skills": ["skill1", "skill2"]
        }
      ],
      "assessments": ["Quiz on X", "Project Y"],
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "keyMilestones": ["Milestone 1", "Milestone 2"],
  "assessmentStrategy": "Description of overall assessment approach",
  "differentiationTips": "Tips for different learning levels"
}
```

**User Prompt Template:**
```
Create a learning plan with these specific details:

Subject: {{subject}}
Grade: {{gradeYear}}
Duration: {{totalWeeks}} weeks ({{lessonsPerWeek}} lessons/week)
{{#if textbook}}Textbook: {{textbook}}{{/if}}
{{#if targetLevel}}Target Level: {{targetLevel}}{{/if}}

{{#if objectives}}
Specific Objectives:
{{#each objectives}}- {{this}}
{{/each}}
{{/if}}

{{#if currentKnowledge}}
Current Class Knowledge:
{{currentKnowledge}}
{{/if}}

{{#if teacherNotes}}
Teacher Notes:
{{teacherNotes}}
{{/if}}

Generate a detailed, practical learning plan.
```

---

### 3.2 Lesson Plan Generator

**Purpose:** Generate detailed lesson plan for a specific lesson within the learning plan.

**Input:**
```typescript
interface LessonPlanInput {
  subject: Subject;
  gradeYear: GradeYear;
  topic: string;
  duration: number;  // minutes
  
  // Context from learning plan
  learningPlanContext?: {
    currentPhase: string;
    previousTopics: string[];
    objectives: string[];
  };
  
  // Class context
  classSize: number;
  averageLevel?: number;  // 1-100
  recentQuizResults?: {
    topic: string;
    averageScore: number;
    weakAreas: string[];
  };
  
  // Teacher preferences
  preferredActivities?: string[];
  availableResources?: string[];
  teacherStyle?: string;
}
```

**System Prompt:**
```
You are an experienced {{subject}} teacher creating a detailed lesson plan.

Create an engaging, well-structured lesson that achieves clear learning objectives while keeping students actively involved.

LESSON CONTEXT:
- Subject: {{subject}}
- Grade: {{gradeYear}}
- Duration: {{duration}} minutes
- Class size: {{classSize}} students
{{#if averageLevel}}- Average class level: {{averageLevel}}/100{{/if}}

GUIDELINES:
1. Start with an engaging hook/warmup (5-10 min)
2. Present new content in digestible chunks
3. Include interactive activities
4. Allow for practice and application
5. End with summary and preview of next lesson
6. Consider different learning styles
7. Include formative assessment opportunities

OUTPUT FORMAT (JSON):
{
  "title": "Lesson Title",
  "objectives": ["Students will be able to..."],
  "materials": ["Material 1", "Material 2"],
  "structure": {
    "warmup": {
      "duration": 5,
      "activity": "Description",
      "purpose": "Why this works"
    },
    "introduction": {
      "duration": 10,
      "content": "What to teach",
      "method": "How to teach it"
    },
    "mainContent": [
      {
        "duration": 15,
        "topic": "Topic name",
        "explanation": "How to explain",
        "examples": ["Example 1"],
        "checkForUnderstanding": "Quick check method"
      }
    ],
    "practice": {
      "duration": 10,
      "activity": "Activity description",
      "instructions": "Step by step",
      "differentiation": {
        "struggling": "Modification for struggling students",
        "advanced": "Extension for advanced students"
      }
    },
    "wrapup": {
      "duration": 5,
      "summary": "Key points to reinforce",
      "homework": "Homework assignment if any",
      "nextLessonPreview": "What's coming next"
    }
  },
  "assessmentOpportunities": ["Method 1", "Method 2"],
  "teacherTips": ["Tip 1", "Tip 2"],
  "commonMistakes": ["Mistake 1 and how to address"],
  "skillsTargeted": {
    "skill_name": 2  // Points this lesson contributes to skill
  }
}
```

---

### 3.3 Quiz Generator

**Purpose:** Generate quizzes with various question types, adaptive difficulty, and skill targeting.

**Input:**
```typescript
interface QuizGeneratorInput {
  subject: Subject;
  gradeYear: GradeYear;
  topic: string;
  quizType: 'diagnostic' | 'practice' | 'test' | 'exam' | 'boss_battle';
  
  // Configuration
  questionCount: number;
  difficulty: number;  // 1-100
  timeLimit?: number;  // minutes
  
  // Skill targeting
  targetSkills?: Record<string, number>;  // {"grammar": 3, "vocabulary": 2}
  
  // Student context (for personalization)
  studentProfile?: {
    level: number;
    weakAreas: string[];
    previousResults: { topic: string; score: number }[];
  };
  
  // Question types to include
  questionTypes?: ('multiple_choice' | 'true_false' | 'fill_blank' | 'matching' | 'short_answer' | 'ordering')[];
}
```

**System Prompt:**
```
You are an expert assessment designer creating a {{quizType}} for {{subject}}.

CONTEXT:
- Topic: {{topic}}
- Grade: {{gradeYear}}
- Difficulty: {{difficulty}}/100
- Number of questions: {{questionCount}}
{{#if targetSkills}}- Target skills: {{json targetSkills}}{{/if}}

QUESTION TYPE GUIDELINES:
- Multiple choice: 4 options, only 1 correct, plausible distractors
- True/False: Clear statements, avoid tricks
- Fill in blank: Test specific knowledge, provide context
- Matching: Related items only, balanced columns
- Short answer: Clear criteria for correct answer
- Ordering: Logical sequences only

DIFFICULTY CALIBRATION:
- 1-20: Basic recall, simple concepts
- 21-40: Understanding, simple application
- 41-60: Application, some analysis
- 61-80: Analysis, synthesis
- 81-100: Evaluation, complex problem-solving

{{#if quizType === 'boss_battle'}}
BOSS BATTLE SPECIAL:
- Make it dramatic and gamified
- Progressive difficulty
- Include a "boss" theme in questions
- Reward strategic thinking
{{/if}}

OUTPUT FORMAT (JSON):
{
  "title": "Quiz Title",
  "description": "Brief description",
  "difficulty": {{difficulty}},
  "totalPoints": 100,
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B",
      "explanation": "Why B is correct",
      "points": 10,
      "skill": "grammar",
      "difficulty": 45
    },
    {
      "id": "q2",
      "type": "fill_blank",
      "question": "Complete: The ___ jumped over the ___.",
      "correctAnswers": [["cat", "dog"], ["fence", "wall"]],
      "explanation": "Explanation",
      "points": 10,
      "skill": "vocabulary",
      "difficulty": 30
    }
  ]
}
```

---

### 3.4 AI Student Assistant (Tutor)

**Purpose:** Help students understand concepts WITHOUT giving direct answers. Acts as a Socratic tutor.

**System Prompt:**
```
You are a friendly, encouraging AI tutor helping a {{gradeYear}} student with {{subject}}.

CRITICAL RULES:
1. NEVER give the direct answer to homework or quiz questions
2. Guide through questions and hints
3. Break down complex problems into steps
4. Encourage the student to think
5. Celebrate small victories
6. Be patient and supportive

YOUR APPROACH:
- If asked for answer: "Let me help you figure it out yourself!"
- Ask leading questions
- Provide analogies and examples
- Connect to things they might already know
- If they're stuck, give a small hint, not the solution

STUDENT CONTEXT:
- Name: {{studentName}}
- Level: {{level}}/100
- Current streak: {{streak}} days
- Strong areas: {{strongAreas}}
- Areas to improve: {{weakAreas}}

PERSONALITY:
- Encouraging and positive
- Uses age-appropriate language
- Adds occasional emojis for engagement 🎯
- Celebrates progress: "Great thinking!"
- Never condescending

LIMITATIONS:
- Only help with academic topics
- Redirect off-topic conversations politely
- Don't pretend to be human
- Don't help with anything inappropriate
```

**Conversation Handling:**
```typescript
interface TutorConversation {
  studentId: string;
  subject: Subject;
  context: {
    currentTopic?: string;
    homeworkId?: string;
    quizId?: string;
  };
  messages: {
    role: 'student' | 'tutor';
    content: string;
    timestamp: Date;
  }[];
}

// Message classification
type MessageIntent =
  | 'ask_for_answer'      // Block and redirect
  | 'ask_for_explanation' // Provide
  | 'ask_for_hint'        // Give small hint
  | 'confused'            // Break down further
  | 'off_topic'           // Politely redirect
  | 'greeting'            // Respond friendly
  | 'feedback'            // Acknowledge
```

**Example Interactions:**

```
Student: "What's the answer to question 3?"
Tutor: "I can't give you the answer directly, but I can help you find it! 🎯
        Let's break it down:
        - What do you think the question is asking?
        - What concepts from class might apply here?"

Student: "I don't understand past perfect tense"
Tutor: "Great question! Let me explain with an example 📚
        
        Think about it like this: when you're telling a story about the past,
        sometimes you need to talk about something that happened EVEN EARLIER.
        
        Regular past: 'I ate breakfast'
        Past perfect: 'I had already eaten breakfast (before something else happened)'
        
        Can you think of a time when you might use this?"

Student: "Can you do my homework for me?"
Tutor: "I wish I could make it easier! But here's the thing - if I do it for you,
        you won't learn it, and the test will be way harder 😅
        
        How about we tackle it together, step by step?
        What's the first question about?"
```

---

### 3.5 Homework Checker (AI-Assisted Grading)

**Purpose:** Help teachers grade homework faster while providing personalized feedback.

**Input:**
```typescript
interface HomeworkCheckInput {
  homework: {
    title: string;
    description: string;
    rubric?: string;
    maxScore: number;
    expectedAnswers?: string;
  };
  submission: {
    studentId: string;
    content: string;
    attachments?: string[];
  };
  studentProfile: {
    name: string;
    level: number;
    previousWork: {
      score: number;
      commonErrors: string[];
    }[];
  };
}
```

**System Prompt:**
```
You are an experienced {{subject}} teacher grading a student's homework.

HOMEWORK:
Title: {{homework.title}}
Description: {{homework.description}}
Max Score: {{homework.maxScore}}
{{#if homework.rubric}}
Rubric:
{{homework.rubric}}
{{/if}}

STUDENT CONTEXT:
- Name: {{studentProfile.name}}
- Current level: {{studentProfile.level}}/100
- Previous common errors: {{studentProfile.previousWork.commonErrors}}

SUBMISSION:
{{submission.content}}

GRADING GUIDELINES:
1. Be fair and consistent
2. Focus on learning, not just correctness
3. Provide constructive feedback
4. Recognize effort and improvement
5. Note specific areas to improve
6. Keep feedback encouraging but honest

OUTPUT FORMAT (JSON):
{
  "score": 85,
  "percentage": 85.0,
  "feedback": {
    "overall": "Overall feedback comment",
    "strengths": ["Strength 1", "Strength 2"],
    "improvements": ["Area to improve 1", "Area to improve 2"],
    "specificComments": [
      {
        "section": "Question 1",
        "comment": "Specific feedback",
        "points": 10,
        "maxPoints": 10
      }
    ]
  },
  "suggestedNextSteps": ["Practice X", "Review Y"],
  "skillsAssessed": {
    "grammar": { "score": 8, "max": 10 },
    "vocabulary": { "score": 7, "max": 10 }
  },
  "teacherNotes": "Notes only the teacher sees (patterns, concerns)"
}
```

---

### 3.6 Progress Analyzer

**Purpose:** Analyze student progress and generate insights for teachers and parents.

**Input:**
```typescript
interface ProgressAnalysisInput {
  student: {
    name: string;
    gradeYear: GradeYear;
    enrolledSince: Date;
  };
  classData: {
    subject: Subject;
    lessonsAttended: number;
    totalLessons: number;
    homeworks: { score: number; maxScore: number; topic: string }[];
    quizzes: { score: number; maxScore: number; topic: string; skills: Record<string, number> }[];
    currentSkills: Record<string, number>;
    xp: number;
    level: number;
  };
  comparisonData?: {
    classAverage: Record<string, number>;
    gradeAverage: Record<string, number>;
  };
}
```

**Output:**
```typescript
interface ProgressAnalysisOutput {
  summary: string;
  
  performance: {
    overall: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'at_risk';
    trend: 'improving' | 'stable' | 'declining';
    percentile: number;  // Compared to class/grade
  };
  
  strengths: {
    skill: string;
    score: number;
    insight: string;
  }[];
  
  areasForImprovement: {
    skill: string;
    currentScore: number;
    targetScore: number;
    recommendation: string;
  }[];
  
  recommendations: {
    forStudent: string[];
    forTeacher: string[];
    forParent: string[];
  };
  
  riskFactors?: string[];
  
  nextMilestones: {
    goal: string;
    currentProgress: number;
    target: number;
  }[];
}
```

---

## 4. Prompt Management

### Template System

```typescript
// packages/ai/src/prompts/template-engine.ts

import Handlebars from 'handlebars';

// Register helpers
Handlebars.registerHelper('json', (context) => JSON.stringify(context, null, 2));
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

// Prompt templates stored in database or files
interface PromptTemplate {
  id: string;
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  version: number;
  isActive: boolean;
  variables: string[];  // Required variables
}

export class PromptManager {
  private templates: Map<string, Handlebars.TemplateDelegate> = new Map();
  
  async loadTemplate(templateId: string): Promise<void> {
    const template = await db.promptTemplate.findUnique({
      where: { id: templateId, isActive: true }
    });
    
    if (template) {
      this.templates.set(`${templateId}_system`, Handlebars.compile(template.systemPrompt));
      this.templates.set(`${templateId}_user`, Handlebars.compile(template.userPromptTemplate));
    }
  }
  
  render(templateId: string, type: 'system' | 'user', variables: Record<string, any>): string {
    const template = this.templates.get(`${templateId}_${type}`);
    if (!template) throw new Error(`Template not found: ${templateId}`);
    return template(variables);
  }
}
```

### Prompt Versioning

```sql
-- Track prompt performance
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  task_type VARCHAR(50) NOT NULL,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT false,
  
  -- Performance metrics
  usage_count INT DEFAULT 0,
  avg_quality_score FLOAT,
  avg_latency_ms INT,
  
  -- A/B testing
  traffic_percentage INT DEFAULT 100,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(name, version)
);

-- Log prompt performance
CREATE TABLE prompt_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_template_id UUID REFERENCES prompt_templates(id),
  
  -- Request context
  input_hash VARCHAR(64),  -- For caching
  input_tokens INT,
  output_tokens INT,
  latency_ms INT,
  
  -- Quality metrics (human or automated)
  quality_score INT,  -- 1-5
  feedback TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. Caching Strategy

### Cache Implementation

```typescript
// packages/ai/src/cache/ai-cache.ts

import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface CacheConfig {
  ttl: number;  // seconds
  tags: string[];
}

const CACHE_CONFIG: Record<AITask, CacheConfig> = {
  learning_plan: { ttl: 86400 * 7, tags: ['learning_plan'] },  // 7 days
  lesson_plan: { ttl: 86400, tags: ['lesson_plan'] },          // 1 day
  quiz_generation: { ttl: 3600, tags: ['quiz'] },              // 1 hour
  homework_generation: { ttl: 3600, tags: ['homework'] },      // 1 hour
  homework_check: { ttl: 0, tags: [] },                        // No cache (unique)
  student_qa: { ttl: 0, tags: [] },                            // No cache (conversational)
  feedback: { ttl: 300, tags: ['feedback'] },                  // 5 minutes
  progress_analysis: { ttl: 3600, tags: ['analysis'] },        // 1 hour
  school_analytics: { ttl: 3600, tags: ['analytics'] },        // 1 hour
};

export class AICache {
  private generateKey(task: AITask, input: Record<string, any>): string {
    const normalized = JSON.stringify(input, Object.keys(input).sort());
    const hash = createHash('sha256').update(normalized).digest('hex').slice(0, 16);
    return `ai:${task}:${hash}`;
  }
  
  async get<T>(task: AITask, input: Record<string, any>): Promise<T | null> {
    const config = CACHE_CONFIG[task];
    if (config.ttl === 0) return null;
    
    const key = this.generateKey(task, input);
    const cached = await redis.get<T>(key);
    
    return cached;
  }
  
  async set<T>(task: AITask, input: Record<string, any>, value: T): Promise<void> {
    const config = CACHE_CONFIG[task];
    if (config.ttl === 0) return;
    
    const key = this.generateKey(task, input);
    await redis.set(key, value, { ex: config.ttl });
    
    // Add to tag sets for invalidation
    for (const tag of config.tags) {
      await redis.sadd(`ai:tag:${tag}`, key);
    }
  }
  
  async invalidateByTag(tag: string): Promise<void> {
    const keys = await redis.smembers(`ai:tag:${tag}`);
    if (keys.length > 0) {
      await redis.del(...keys);
      await redis.del(`ai:tag:${tag}`);
    }
  }
}
```

### Cache Invalidation Triggers

```typescript
// Invalidation rules
const INVALIDATION_RULES = {
  // When learning plan is updated, invalidate related lesson plans
  'learning_plan_updated': ['lesson_plan'],
  
  // When class settings change
  'class_settings_updated': ['learning_plan', 'lesson_plan', 'quiz'],
  
  // When student profile updates significantly
  'student_profile_changed': ['analysis'],
  
  // Daily refresh of analytics
  'daily_refresh': ['analytics'],
};
```

---

## 6. Rate Limiting & Cost Control

### Per-Tenant Limits

```typescript
// packages/ai/src/rate-limiter.ts

interface TenantLimits {
  requestsPerHour: number;
  requestsPerDay: number;
  tokensPerMonth: number;
}

const PLAN_LIMITS: Record<SubscriptionPlan, TenantLimits> = {
  FREE_TRIAL: {
    requestsPerHour: 10,
    requestsPerDay: 50,
    tokensPerMonth: 50_000,
  },
  TUTOR_BASIC: {
    requestsPerHour: 50,
    requestsPerDay: 200,
    tokensPerMonth: 200_000,
  },
  TUTOR_PRO: {
    requestsPerHour: 200,
    requestsPerDay: 1000,
    tokensPerMonth: 1_000_000,
  },
  SCHOOL_BASIC: {
    requestsPerHour: 500,
    requestsPerDay: 5000,
    tokensPerMonth: 5_000_000,
  },
  SCHOOL_PRO: {
    requestsPerHour: 2000,
    requestsPerDay: 20000,
    tokensPerMonth: 20_000_000,
  },
  ENTERPRISE: {
    requestsPerHour: 10000,
    requestsPerDay: 100000,
    tokensPerMonth: 100_000_000,
  },
};

export class AIRateLimiter {
  async checkLimit(tenantId: string, plan: SubscriptionPlan): Promise<{
    allowed: boolean;
    remaining: { hourly: number; daily: number; monthly: number };
    resetTimes: { hourly: Date; daily: Date; monthly: Date };
  }> {
    const limits = PLAN_LIMITS[plan];
    const now = Date.now();
    
    const hourlyKey = `rl:${tenantId}:hourly:${Math.floor(now / 3600000)}`;
    const dailyKey = `rl:${tenantId}:daily:${Math.floor(now / 86400000)}`;
    const monthlyKey = `rl:${tenantId}:monthly:${new Date().toISOString().slice(0, 7)}`;
    
    const [hourlyCount, dailyCount, monthlyCount] = await Promise.all([
      redis.incr(hourlyKey),
      redis.incr(dailyKey),
      redis.incr(monthlyKey),
    ]);
    
    // Set expiry on first increment
    if (hourlyCount === 1) await redis.expire(hourlyKey, 3600);
    if (dailyCount === 1) await redis.expire(dailyKey, 86400);
    if (monthlyCount === 1) await redis.expire(monthlyKey, 86400 * 31);
    
    const allowed = 
      hourlyCount <= limits.requestsPerHour &&
      dailyCount <= limits.requestsPerDay;
    
    return {
      allowed,
      remaining: {
        hourly: Math.max(0, limits.requestsPerHour - hourlyCount),
        daily: Math.max(0, limits.requestsPerDay - dailyCount),
        monthly: Math.max(0, limits.tokensPerMonth - monthlyCount),
      },
      resetTimes: {
        hourly: new Date(Math.ceil(now / 3600000) * 3600000),
        daily: new Date(Math.ceil(now / 86400000) * 86400000),
        monthly: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    };
  }
}
```

### Cost Tracking

```typescript
// packages/ai/src/cost-tracker.ts

const COST_PER_1K_TOKENS = {
  'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
  'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
};

export async function trackAICost(
  tenantId: string,
  userId: string,
  task: AITask,
  model: string,
  inputTokens: number,
  outputTokens: number,
  latencyMs: number
): Promise<void> {
  const costs = COST_PER_1K_TOKENS[model];
  const totalCost = (inputTokens / 1000 * costs.input) + (outputTokens / 1000 * costs.output);
  
  await db.aiGenerationLog.create({
    data: {
      tenantId,
      userId,
      type: task,
      model,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      costUsd: totalCost,
      latencyMs,
      success: true,
    },
  });
  
  // Update tenant usage
  await db.tenant.update({
    where: { id: tenantId },
    data: {
      aiRequestsUsed: { increment: 1 },
    },
  });
}
```

---

## 7. Error Handling & Fallbacks

```typescript
// packages/ai/src/ai-service.ts

export class AIService {
  private async callWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error.status === 400 || error.status === 401) {
          throw error;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
  
  async generate(task: AITask, input: Record<string, any>): Promise<any> {
    const cache = new AICache();
    const rateLimiter = new AIRateLimiter();
    
    // Check cache first
    const cached = await cache.get(task, input);
    if (cached) {
      return { ...cached, fromCache: true };
    }
    
    // Check rate limits
    const { allowed, remaining } = await rateLimiter.checkLimit(
      input.tenantId,
      input.plan
    );
    
    if (!allowed) {
      throw new AIRateLimitError('AI rate limit exceeded', remaining);
    }
    
    // Get model config
    const config = getModelConfig(task);
    
    // Build prompts
    const promptManager = new PromptManager();
    await promptManager.loadTemplate(task);
    
    const systemPrompt = promptManager.render(task, 'system', input);
    const userPrompt = promptManager.render(task, 'user', input);
    
    // Call AI with retry
    const startTime = Date.now();
    
    const response = await this.callWithRetry(async () => {
      return await anthropic.messages.create({
        model: config.model,
        max_tokens: config.maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
    });
    
    const latencyMs = Date.now() - startTime;
    
    // Parse response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }
    
    let result;
    try {
      result = JSON.parse(content.text);
    } catch {
      result = { text: content.text };
    }
    
    // Track costs
    await trackAICost(
      input.tenantId,
      input.userId,
      task,
      config.model,
      response.usage.input_tokens,
      response.usage.output_tokens,
      latencyMs
    );
    
    // Cache result
    await cache.set(task, input, result);
    
    return result;
  }
}
```

---

## 8. Safety & Content Filtering

```typescript
// packages/ai/src/safety.ts

const BLOCKED_PATTERNS = [
  /homework.*answer/i,
  /solve.*for.*me/i,
  /cheat/i,
  /inappropriate/i,
];

const STUDENT_SAFE_TOPICS = [
  'academics',
  'study_tips',
  'homework_help',
  'concept_explanation',
  'motivation',
];

export async function validateStudentInput(
  input: string,
  studentAge?: number
): Promise<{ safe: boolean; reason?: string }> {
  // Check blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(input)) {
      return { safe: false, reason: 'Request blocked by content filter' };
    }
  }
  
  // Check input length
  if (input.length > 2000) {
    return { safe: false, reason: 'Input too long' };
  }
  
  // Additional checks for younger students
  if (studentAge && studentAge < 13) {
    // Extra filtering for children
  }
  
  return { safe: true };
}

export function sanitizeAIResponse(
  response: string,
  context: 'student' | 'teacher' | 'parent'
): string {
  // Remove any accidentally leaked system prompts
  response = response.replace(/\[system\].*?\[\/system\]/gi, '');
  
  // Context-specific sanitization
  if (context === 'student') {
    // Remove teacher-only notes
    response = response.replace(/\[teacher.*?\].*?\[\/teacher.*?\]/gi, '');
  }
  
  return response.trim();
}
```

---

**End of AI System Documentation**
