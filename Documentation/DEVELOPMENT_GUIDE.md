# EduMind AI — Development Guide

## Document Info
```
Version: 1.0.0
Purpose: Setup instructions and coding conventions
```

---

## 1. Project Setup

### Prerequisites

```bash
# Required
node >= 20.0.0
npm >= 10.0.0
pnpm >= 8.0.0  # We use pnpm for monorepo

# Recommended
- VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma
  - TypeScript
```

### Repository Structure

```
edumind/
├── apps/
│   ├── web/                    # Next.js 14 web app
│   │   ├── app/               # App Router pages
│   │   │   ├── (auth)/       # Auth routes group
│   │   │   ├── (teacher)/    # Teacher routes (/t/...)
│   │   │   ├── (student)/    # Student routes (/s/...)
│   │   │   ├── (parent)/     # Parent routes (/p/...)
│   │   │   ├── (admin)/      # Admin routes (/a/...)
│   │   │   └── api/          # API routes (if needed)
│   │   ├── components/        # App-specific components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   ├── styles/           # Global styles
│   │   └── public/           # Static assets
│   │
│   ├── mobile/                # React Native (Expo) app
│   │   ├── app/              # Expo Router pages
│   │   ├── components/       # Mobile components
│   │   ├── hooks/           # Shared hooks
│   │   └── lib/             # Utilities
│   │
│   └── api/                   # Express.js backend
│       ├── src/
│       │   ├── routes/       # Route handlers
│       │   ├── controllers/  # Business logic
│       │   ├── services/     # Service layer
│       │   ├── middleware/   # Express middleware
│       │   ├── lib/          # Utilities
│       │   └── index.ts      # Entry point
│       └── tests/
│
├── packages/
│   ├── database/              # Prisma schema & client
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── src/
│   │       └── index.ts       # Export Prisma client
│   │
│   ├── shared/                # Shared code
│   │   ├── src/
│   │   │   ├── types/        # TypeScript types
│   │   │   ├── constants/    # Shared constants
│   │   │   ├── utils/        # Utility functions
│   │   │   ├── validation/   # Zod schemas
│   │   │   └── gamification/ # XP, levels, achievements
│   │   └── index.ts
│   │
│   ├── ui/                    # Shared UI components
│   │   ├── src/
│   │   │   ├── components/   # Components
│   │   │   ├── hooks/        # UI hooks
│   │   │   └── styles/       # Component styles
│   │   └── index.ts
│   │
│   └── ai/                    # AI service layer
│       ├── src/
│       │   ├── providers/    # AI provider adapters
│       │   ├── prompts/      # Prompt templates
│       │   ├── cache/        # Response caching
│       │   └── services/     # AI feature services
│       └── index.ts
│
├── tooling/
│   ├── eslint/               # ESLint config
│   ├── prettier/             # Prettier config
│   └── typescript/           # TypeScript config
│
├── docker/
│   ├── docker-compose.yml    # Local development
│   └── Dockerfile.api        # API Dockerfile
│
├── .github/
│   └── workflows/            # GitHub Actions
│
├── turbo.json                # Turborepo config
├── pnpm-workspace.yaml       # pnpm workspaces
├── package.json
└── README.md
```

### Initial Setup Commands

```bash
# 1. Clone repository
git clone https://github.com/your-org/edumind.git
cd edumind

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp packages/database/.env.example packages/database/.env

# 4. Start local database (requires Docker)
docker-compose up -d postgres redis

# 5. Generate Prisma client
pnpm db:generate

# 6. Run database migrations
pnpm db:migrate

# 7. Seed database (optional)
pnpm db:seed

# 8. Start development servers
pnpm dev
```

### Environment Variables

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# apps/api/.env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edumind
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/edumind
SUPABASE_SERVICE_ROLE_KEY=xxx
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
ANTHROPIC_API_KEY=sk-ant-xxx
UPSTASH_REDIS_REST_URL=xxx
UPSTASH_REDIS_REST_TOKEN=xxx
RESEND_API_KEY=re_xxx

# packages/database/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edumind
```

---

## 2. Coding Conventions

### TypeScript

```typescript
// ✅ Use explicit types for function parameters and returns
function calculateXP(score: number, maxScore: number): number {
  return Math.round((score / maxScore) * 100);
}

// ✅ Use interfaces for objects, types for unions
interface User {
  id: string;
  email: string;
  role: UserRole;
}

type UserRole = 'TEACHER' | 'STUDENT' | 'PARENT' | 'ADMIN';

// ✅ Use const assertions for constant objects
const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
} as const;

// ✅ Prefer null over undefined for intentional absence
interface Student {
  parentId: string | null;  // Explicitly optional
}

// ❌ Avoid any - use unknown if type is truly unknown
function parseJSON(data: unknown): User {
  // Type guard or validation
}
```

### File Naming

```
# Components (PascalCase)
Button.tsx
UserProfileCard.tsx

# Hooks (camelCase with use prefix)
useAuth.ts
useStudentProgress.ts

# Utils/Services (camelCase)
apiClient.ts
xpCalculator.ts

# Types (PascalCase)
User.types.ts
Achievement.types.ts

# Constants (SCREAMING_SNAKE_CASE for values)
constants.ts → export const MAX_XP = 1000;
```

### React Components

```tsx
// ✅ Functional components with explicit props interface
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ✅ Use forwardRef when needed
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn(baseStyles, className)} {...props} />;
  }
);
Input.displayName = 'Input';
```

### API Routes (Express)

```typescript
// ✅ Controller pattern
// controllers/class.controller.ts
export class ClassController {
  constructor(private classService: ClassService) {}
  
  getClasses = async (req: AuthRequest, res: Response) => {
    try {
      const classes = await this.classService.findByTeacher(req.user.id);
      res.json({ success: true, data: classes });
    } catch (error) {
      next(error);
    }
  };
  
  createClass = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const validated = createClassSchema.parse(req.body);
      const newClass = await this.classService.create(req.user.id, validated);
      res.status(201).json({ success: true, data: newClass });
    } catch (error) {
      next(error);
    }
  };
}

// ✅ Route registration
// routes/class.routes.ts
const router = Router();
const controller = new ClassController(new ClassService());

router.get('/', auth, controller.getClasses);
router.post('/', auth, validate(createClassSchema), controller.createClass);

export { router as classRoutes };
```

### Validation with Zod

```typescript
// packages/shared/src/validation/class.schema.ts
import { z } from 'zod';
import { Subject, GradeYear } from '../types';

export const createClassSchema = z.object({
  name: z.string().min(1).max(100),
  subject: z.nativeEnum(Subject),
  gradeYear: z.nativeEnum(GradeYear),
  description: z.string().max(500).optional(),
  lessonsPerWeek: z.number().int().min(1).max(10).default(2),
  defaultDuration: z.number().int().min(15).max(180).default(45),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
```

### Database Queries (Prisma)

```typescript
// ✅ Use service layer for database operations
// services/student.service.ts
export class StudentService {
  // Single responsibility methods
  async findById(id: string) {
    return db.student.findUnique({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        classEnrollments: { where: { isActive: true } },
      },
    });
  }
  
  async updateXP(studentId: string, xpGain: number) {
    return db.student.update({
      where: { id: studentId },
      data: {
        totalXp: { increment: xpGain },
        // Level is auto-calculated via trigger
      },
    });
  }
  
  // Use transactions for multi-step operations
  async completeHomework(studentId: string, homeworkId: string, score: number) {
    return db.$transaction(async (tx) => {
      // Update submission
      const submission = await tx.homeworkSubmission.update({
        where: { homeworkId_studentId: { homeworkId, studentId } },
        data: { status: 'GRADED', score },
      });
      
      // Calculate and award XP
      const xpEvent = calculateHomeworkXP(score, 100, submission.isLate);
      
      await tx.student.update({
        where: { id: studentId },
        data: { totalXp: { increment: xpEvent.totalXP } },
      });
      
      // Check achievements
      // ...
      
      return submission;
    });
  }
}
```

### Error Handling

```typescript
// packages/shared/src/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, 'NOT_FOUND', `${resource} with id ${id} not found`);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}

export class ValidationError extends AppError {
  constructor(details: Record<string, string[]>) {
    super(400, 'VALIDATION_ERROR', 'Validation failed', details);
  }
}

// Usage
if (!student) {
  throw new NotFoundError('Student', studentId);
}
```

---

## 3. Testing Strategy

### Unit Tests (Vitest)

```typescript
// packages/shared/src/gamification/__tests__/xp.test.ts
import { describe, it, expect } from 'vitest';
import { calculateHomeworkXP, calculateLevel } from '../xp';

describe('XP Calculations', () => {
  describe('calculateHomeworkXP', () => {
    it('should return 70 XP for perfect score', () => {
      const result = calculateHomeworkXP(100, 100, false);
      expect(result.totalXP).toBe(70);
      expect(result.type).toBe('homework_submit');
    });
    
    it('should return reduced XP for late submission', () => {
      const result = calculateHomeworkXP(100, 100, true);
      expect(result.totalXP).toBeLessThan(70);
    });
  });
  
  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });
    
    it('should cap at level 100', () => {
      expect(calculateLevel(9999999)).toBe(100);
    });
  });
});
```

### Integration Tests

```typescript
// apps/api/tests/integration/class.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { createTestUser, cleanupTestData } from '../helpers';

describe('Class API', () => {
  let authToken: string;
  let teacherId: string;
  
  beforeAll(async () => {
    const { user, token } = await createTestUser('TEACHER');
    authToken = token;
    teacherId = user.id;
  });
  
  afterAll(async () => {
    await cleanupTestData();
  });
  
  describe('POST /api/v1/classes', () => {
    it('should create a class', async () => {
      const response = await request(app)
        .post('/api/v1/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Class',
          subject: 'ENGLISH',
          gradeYear: 'GRADE_7',
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('Test Class');
    });
    
    it('should reject invalid subject', async () => {
      const response = await request(app)
        .post('/api/v1/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Class',
          subject: 'INVALID',
          gradeYear: 'GRADE_7',
        });
      
      expect(response.status).toBe(400);
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// apps/web/tests/e2e/student-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Student Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test student
    await page.goto('/login');
    await page.fill('[name="email"]', 'test-student@example.com');
    await page.fill('[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/s/dashboard');
  });
  
  test('should display student dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('[data-testid="level-badge"]')).toBeVisible();
    await expect(page.locator('[data-testid="xp-bar"]')).toBeVisible();
  });
  
  test('should complete a homework', async ({ page }) => {
    await page.click('text=Homework');
    await page.click('[data-testid="homework-item"]');
    // Fill homework form
    await page.fill('[name="answer1"]', 'had gone');
    await page.click('button:text("Submit")');
    
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
```

---

## 4. Git Workflow

### Branch Naming

```
feature/add-quiz-generator
bugfix/fix-xp-calculation
hotfix/critical-auth-issue
chore/update-dependencies
docs/api-documentation
```

### Commit Messages (Conventional Commits)

```
feat(gamification): add achievement unlock animation
fix(api): correct XP calculation for late submissions
docs(readme): update setup instructions
chore(deps): upgrade Next.js to 14.1
refactor(ui): extract SkillBar component
test(api): add integration tests for class endpoints
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project conventions
- [ ] Self-reviewed the code
- [ ] Added comments for complex logic
- [ ] Updated documentation
- [ ] No new warnings
```

---

## 5. Development Commands

```bash
# Start all development servers
pnpm dev

# Start specific app
pnpm dev:web      # Next.js web app
pnpm dev:api      # Express API
pnpm dev:mobile   # Expo mobile app

# Database
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
pnpm db:seed      # Seed database
pnpm db:reset     # Reset database

# Testing
pnpm test         # Run all tests
pnpm test:web     # Web tests
pnpm test:api     # API tests
pnpm test:e2e     # E2E tests
pnpm test:cov     # With coverage

# Linting & Formatting
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix linting issues
pnpm format       # Run Prettier
pnpm typecheck    # TypeScript check

# Building
pnpm build        # Build all
pnpm build:web    # Build web only
pnpm build:api    # Build API only

# Other
pnpm clean        # Clean build artifacts
pnpm deps:check   # Check for outdated deps
```

---

## 6. Deployment

### Staging Deployment

```bash
# Auto-deploys on push to develop branch
git push origin develop

# URLs:
# - Web: https://staging.edumind.ai
# - API: https://api-staging.edumind.ai
```

### Production Deployment

```bash
# 1. Create release branch
git checkout main
git pull origin main
git checkout -b release/v1.0.0

# 2. Update version
npm version minor

# 3. Create PR to main
# After approval and merge, auto-deploys to production

# URLs:
# - Web: https://app.edumind.ai
# - API: https://api.edumind.ai
```

### Environment-Specific Config

| Environment | Database | Redis | AI |
|-------------|----------|-------|-----|
| Local | Docker Postgres | Docker Redis | AI API (test key) |
| Staging | Supabase (staging) | Upstash (staging) | AI API |
| Production | Supabase (prod) | Upstash (prod) | AI API |

---

## 7. Troubleshooting

### Common Issues

**Prisma client not found**
```bash
pnpm db:generate
```

**Port already in use**
```bash
# Kill process on port 3000
lsof -i :3000 | awk 'NR!=1 {print $2}' | xargs kill
```

**Node modules issues**
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

**Database connection issues**
```bash
# Check if Postgres is running
docker ps
# Restart containers
docker-compose down && docker-compose up -d
```

---

**End of Development Guide**
