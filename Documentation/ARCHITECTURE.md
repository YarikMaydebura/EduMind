# EduMind AI — System Architecture

## Document Info
```
Version: 1.0.0
Last Updated: 2026-03-05
Purpose: Technical architecture
```

---

## 1. Architecture Decision Records (ADR)

### ADR-001: Monorepo with Separated Services
**Decision:** Use a monorepo structure with separated frontend and backend.

**Rationale:**
- Schools require high availability and scalability
- Separation allows independent scaling of API and frontend
- Easier to maintain and deploy different parts
- Better for team collaboration in future

**Structure:**
```
edumind/
├── apps/
│   ├── web/                 # Next.js 14 frontend
│   ├── mobile/              # React Native (Expo)
│   └── api/                 # Express.js backend
├── packages/
│   ├── database/            # Prisma schema & client
│   ├── shared/              # Shared types, utils
│   ├── ui/                  # Shared UI components
│   └── ai/                  # AI service layer
├── turbo.json
└── package.json
```

### ADR-002: API Style — REST with OpenAPI
**Decision:** REST API with OpenAPI 3.0 specification.

**Rationale:**
- Better caching at CDN level for read-heavy operations
- Easier integration with schools' existing systems
- More predictable for large-scale operations
- Swagger documentation for API consumers

### ADR-003: Database — Supabase (PostgreSQL)
**Decision:** Supabase for PostgreSQL + Auth + Real-time + Storage.

**Rationale:**
- Fastest time to market
- Built-in Row Level Security (RLS)
- Real-time subscriptions out of the box
- Free tier for development, predictable scaling costs
- PostgreSQL is enterprise-ready

### ADR-004: Authentication — Supabase Auth + Microsoft OAuth
**Decision:** Supabase Auth with Microsoft OAuth as primary provider.

**Rationale:**
- Schools primarily use Microsoft 365/Azure AD
- Single sign-on (SSO) capability for enterprise
- Email/password as fallback
- Easy to add more providers later

### ADR-005: Real-time — Socket.io
**Decision:** Socket.io for real-time notifications and live updates.

**Rationale:**
- More control than Supabase Realtime
- Better reconnection handling
- Room-based broadcasting (per class, per school)
- Proven at scale

### ADR-006: AI Provider — AI API
**Decision:** Advanced AI Model for complex tasks, Fast AI Model for simple tasks.

**Rationale:**
- Superior instruction following
- Better at educational content
- Competitive pricing for high volume
- Strong safety features for educational context

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENTS                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐         │
│   │   Web App        │    │   Mobile App     │    │   Admin Panel    │         │
│   │   (Next.js 14)   │    │   (React Native) │    │   (Next.js)      │         │
│   │                  │    │   (Expo)         │    │                  │         │
│   └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘         │
│            │                       │                       │                    │
│            └───────────────────────┼───────────────────────┘                    │
│                                    │                                            │
│                            ┌───────▼───────┐                                    │
│                            │   Cloudflare  │                                    │
│                            │   (CDN + WAF) │                                    │
│                            └───────┬───────┘                                    │
│                                    │                                            │
└────────────────────────────────────┼────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────────┐
│                              API GATEWAY                                         │
├────────────────────────────────────┼────────────────────────────────────────────┤
│                                    │                                            │
│                            ┌───────▼───────┐                                    │
│                            │    Vercel     │                                    │
│                            │  (Edge Funcs) │                                    │
│                            └───────┬───────┘                                    │
│                                    │                                            │
│            ┌───────────────────────┼───────────────────────┐                    │
│            │                       │                       │                    │
│    ┌───────▼───────┐       ┌───────▼───────┐       ┌───────▼───────┐           │
│    │  REST API     │       │  WebSocket    │       │  Webhook      │           │
│    │  (Express)    │       │  (Socket.io)  │       │  Handlers     │           │
│    │  /api/v1/*    │       │  Real-time    │       │  (Paddle,etc) │           │
│    └───────┬───────┘       └───────┬───────┘       └───────┬───────┘           │
│            │                       │                       │                    │
└────────────┼───────────────────────┼───────────────────────┼────────────────────┘
             │                       │                       │
┌────────────┼───────────────────────┼───────────────────────┼────────────────────┐
│            │              SERVICE LAYER                    │                    │
├────────────┼───────────────────────┼───────────────────────┼────────────────────┤
│            │                       │                       │                    │
│    ┌───────▼───────────────────────▼───────────────────────▼───────┐           │
│    │                      APPLICATION SERVICES                      │           │
│    ├────────────────────────────────────────────────────────────────┤           │
│    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │           │
│    │  │   Auth   │ │  Users   │ │  Classes │ │  Lessons │         │           │
│    │  │ Service  │ │ Service  │ │ Service  │ │ Service  │         │           │
│    │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │           │
│    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │           │
│    │  │   AI     │ │ Homework │ │  Quiz    │ │ Progress │         │           │
│    │  │ Service  │ │ Service  │ │ Service  │ │ Service  │         │           │
│    │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │           │
│    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │           │
│    │  │ Gamific. │ │  Notif.  │ │ Calendar │ │ Analytics│         │           │
│    │  │ Service  │ │ Service  │ │ Service  │ │ Service  │         │           │
│    │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │           │
│    └────────────────────────────────────────────────────────────────┘           │
│                                    │                                            │
└────────────────────────────────────┼────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────────┐
│                              DATA LAYER                                          │
├────────────────────────────────────┼────────────────────────────────────────────┤
│                                    │                                            │
│    ┌───────────────────────────────┼───────────────────────────────┐           │
│    │                               │                               │           │
│    │   ┌───────────────┐   ┌───────▼───────┐   ┌───────────────┐  │           │
│    │   │    Redis      │   │   Supabase    │   │  Cloudflare   │  │           │
│    │   │   (Upstash)   │   │  PostgreSQL   │   │      R2       │  │           │
│    │   │               │   │               │   │               │  │           │
│    │   │ • Sessions    │   │ • All data    │   │ • Files       │  │           │
│    │   │ • Cache       │   │ • RLS         │   │ • Avatars     │  │           │
│    │   │ • Rate limit  │   │ • Triggers    │   │ • Materials   │  │           │
│    │   │ • Queues      │   │ • Functions   │   │ • Exports     │  │           │
│    │   └───────────────┘   └───────────────┘   └───────────────┘  │           │
│    │                                                               │           │
│    └───────────────────────────────────────────────────────────────┘           │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                      │
├────────────────────────────────────┼────────────────────────────────────────────┤
│                                    │                                            │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│   │    AI    │ │  Paddle  │ │  Resend  │ │  Sentry  │ │ Calendar │            │
│   │(Provider)│ │(Payments)│ │ (Email)  │ │ (Errors) │ │  APIs    │            │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend (Web)
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Framer Motion | 11.x | Animations |
| Shadcn/ui | latest | Base UI components |
| TanStack Query | 5.x | Server state management |
| Zustand | 4.x | Client state management |
| React Hook Form | 7.x | Form handling |
| Zod | 3.x | Schema validation |
| Socket.io Client | 4.x | Real-time communication |
| i18next | 23.x | Internationalization |

### Frontend (Mobile)
| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.73.x | Mobile framework |
| Expo | 50.x | Development platform |
| Expo Router | 3.x | Navigation |
| NativeWind | 4.x | Tailwind for RN |
| React Native Reanimated | 3.x | Animations |
| MMKV | 2.x | Fast storage |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| Express.js | 4.x | API framework |
| TypeScript | 5.x | Type safety |
| Prisma | 5.x | ORM |
| Socket.io | 4.x | WebSocket server |
| Bull | 5.x | Job queues |
| Helmet | 7.x | Security headers |
| CORS | 2.x | Cross-origin |
| Morgan | 1.x | Logging |
| Express Validator | 7.x | Input validation |

### Database & Storage
| Technology | Purpose |
|------------|---------|
| Supabase PostgreSQL | Primary database |
| Upstash Redis | Caching, sessions, rate limiting |
| Cloudflare R2 | File storage (cheapest option) |

### AI
| Model | Use Case | Cost/1M tokens |
|-------|----------|----------------|
| Advanced AI Model | Learning plans, lesson plans, complex analysis | $3/$15 |
| Fast AI Model | Quick Q&A, homework hints, simple checks | $0.25/$1.25 |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting, Edge functions |
| Railway | Backend hosting |
| Cloudflare | CDN, DNS, R2 storage, WAF |
| Sentry | Error tracking |
| Resend | Transactional email (cheapest) |
| Paddle | Payments (EU-friendly) |

---

## 4. Multi-Tenancy Architecture

### Tenant Hierarchy
```
┌─────────────────────────────────────────────────────────────────┐
│                        PLATFORM                                  │
│                     (EduMind Global)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│   │   SCHOOL A      │  │   SCHOOL B      │  │  PRIVATE TUTOR  │ │
│   │   (Tenant)      │  │   (Tenant)      │  │    (Tenant)     │ │
│   ├─────────────────┤  ├─────────────────┤  ├─────────────────┤ │
│   │                 │  │                 │  │                 │ │
│   │ School Admin    │  │ School Admin    │  │ Teacher (Owner) │ │
│   │      │          │  │      │          │  │      │          │ │
│   │  Teachers[]     │  │  Teachers[]     │  │  Students[]     │ │
│   │      │          │  │      │          │  │      │          │ │
│   │  Classes[]      │  │  Classes[]      │  │  (No classes)   │ │
│   │      │          │  │      │          │  │                 │ │
│   │  Students[]     │  │  Students[]     │  │  Parents[]      │ │
│   │      │          │  │      │          │  │                 │ │
│   │  Parents[]      │  │  Parents[]      │  │                 │ │
│   │                 │  │                 │  │                 │ │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Isolation Strategy
```sql
-- Every tenant-scoped table has:
tenant_id UUID NOT NULL REFERENCES tenants(id)

-- Row Level Security (RLS) example:
CREATE POLICY tenant_isolation ON students
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

---

## 5. Authentication Flow

### OAuth Flow (Microsoft SSO)
```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │  EduMind │     │ Supabase │     │Microsoft │
│          │     │   API    │     │   Auth   │     │  Azure   │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ 1. Click       │                │                │
     │ "Sign in with  │                │                │
     │  Microsoft"    │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │ 2. Redirect to │                │                │
     │    Auth URL    │                │                │
     │<───────────────│                │                │
     │                │                │                │
     │ 3. OAuth consent page           │                │
     │─────────────────────────────────────────────────>│
     │                │                │                │
     │ 4. Auth code callback           │                │
     │<─────────────────────────────────────────────────│
     │                │                │                │
     │ 5. Exchange code for tokens     │                │
     │────────────────────────────────>│                │
     │                │                │                │
     │                │  6. Verify with Microsoft       │
     │                │                │───────────────>│
     │                │                │                │
     │                │                │  7. User info  │
     │                │                │<───────────────│
     │                │                │                │
     │ 8. Session + JWT                │                │
     │<────────────────────────────────│                │
     │                │                │                │
     │ 9. Store tokens│                │                │
     │ (httpOnly cookie)               │                │
     │                │                │                │
```

### Invite System Flow
```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Teacher  │     │   API    │     │ Database │     │ Student  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ 1. Generate    │                │                │
     │ invite for     │                │                │
     │ Class X        │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │ 2. Create      │                │
     │                │ invite record  │                │
     │                │───────────────>│                │
     │                │                │                │
     │ 3. Invite URL  │                │                │
     │ /join/abc123   │                │                │
     │<───────────────│                │                │
     │                │                │                │
     │ ═══════════════════════════════════════════════ │
     │         Teacher shares link with student        │
     │ ═══════════════════════════════════════════════ │
     │                │                │                │
     │                │                │  4. Open link  │
     │                │                │<───────────────│
     │                │                │                │
     │                │ 5. Validate    │                │
     │                │ invite code    │                │
     │                │<───────────────│                │
     │                │                │                │
     │                │ 6. Show signup │                │
     │                │ form with class│                │
     │                │ context        │                │
     │                │───────────────>│                │
     │                │                │                │
     │                │                │  7. Complete   │
     │                │                │  registration  │
     │                │                │<───────────────│
     │                │                │                │
     │                │ 8. Create user,│                │
     │                │ link to class  │                │
     │                │<───────────────│                │
     │                │                │                │
     │ 9. Notification│                │                │
     │ "New student   │                │                │
     │  joined"       │                │                │
     │<───────────────│                │                │
     │                │                │                │
```

---

## 6. Role-Based Access Control (RBAC)

### Permission Matrix

| Permission | TECH_ADMIN | SCHOOL_ADMIN | TEACHER | STUDENT | PARENT |
|------------|:----------:|:------------:|:-------:|:-------:|:------:|
| **SYSTEM** |
| system.manage | ✓ | ✗ | ✗ | ✗ | ✗ |
| system.view_logs | ✓ | ✗ | ✗ | ✗ | ✗ |
| system.feature_flags | ✓ | ✗ | ✗ | ✗ | ✗ |
| system.impersonate | ✓ | ✗ | ✗ | ✗ | ✗ |
| **SCHOOL** |
| school.manage | ✓ | ✓ | ✗ | ✗ | ✗ |
| school.settings | ✓ | ✓ | ✗ | ✗ | ✗ |
| school.billing | ✓ | ✓ | ✗ | ✗ | ✗ |
| school.analytics | ✓ | ✓ | ✗ | ✗ | ✗ |
| **TEACHERS** |
| teachers.manage | ✓ | ✓ | ✗ | ✗ | ✗ |
| teachers.invite | ✓ | ✓ | ✗ | ✗ | ✗ |
| **CLASSES** |
| classes.create | ✓ | ✓ | ✓ | ✗ | ✗ |
| classes.manage_own | ✓ | ✓ | ✓ | ✗ | ✗ |
| classes.manage_all | ✓ | ✓ | ✗ | ✗ | ✗ |
| **STUDENTS** |
| students.invite | ✓ | ✓ | ✓ | ✗ | ✗ |
| students.manage_class | ✓ | ✓ | ✓ | ✗ | ✗ |
| students.view_own | ✓ | ✓ | ✓ | ✓ | ✓* |
| **LESSONS** |
| lessons.create | ✓ | ✓ | ✓ | ✗ | ✗ |
| lessons.manage_own | ✓ | ✓ | ✓ | ✗ | ✗ |
| **HOMEWORK** |
| homework.create | ✓ | ✓ | ✓ | ✗ | ✗ |
| homework.submit | ✗ | ✗ | ✗ | ✓ | ✗ |
| homework.grade | ✓ | ✓ | ✓ | ✗ | ✗ |
| **AI** |
| ai.generate_plans | ✓ | ✓ | ✓ | ✗ | ✗ |
| ai.student_assistant | ✗ | ✗ | ✗ | ✓ | ✗ |
| **GAMIFICATION** |
| gamification.view | ✓ | ✓ | ✓ | ✓ | ✓* |
| gamification.manage | ✓ | ✓ | ✗ | ✗ | ✗ |

*Parent can only view their linked children's data

---

## 7. Environment Configuration

### Environment Variables
```bash
# .env.example

# === Application ===
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:4000

# === Database ===
DATABASE_URL=postgresql://user:pass@localhost:5432/edumind
DIRECT_URL=postgresql://user:pass@localhost:5432/edumind

# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# === Redis ===
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# === Auth ===
JWT_SECRET=xxx
JWT_REFRESH_SECRET=xxx
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx

# === AI ===
ANTHROPIC_API_KEY=xxx

# === Storage ===
CLOUDFLARE_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=edumind

# === Email ===
RESEND_API_KEY=xxx

# === Payments ===
PADDLE_VENDOR_ID=xxx
PADDLE_API_KEY=xxx
PADDLE_WEBHOOK_SECRET=xxx

# === Monitoring ===
SENTRY_DSN=xxx
```

---

**End of Architecture Document**
