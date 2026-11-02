# EduNexa ERP — Architectural Decision Records (ADRs)

## ADR 001: Multi-Tenancy via Shared Database and PostgreSQL Row Level Security (RLS)

- **Status:** Accepted
- **Context:**
  EduNexa ERP must serve dozens of independent private schools. We need complete data isolation between schools without incurring unreasonable infrastructure costs or operational maintenance complexity.
- **Decision:**
  Adopt a single PostgreSQL database with a shared schema. Every tenant-owned table includes a foreign key `school_id REFERENCES schools(id)`. Access control is enforced at the database engine level using PostgreSQL Row Level Security (RLS). A user's school affiliations and roles are stored in `school_memberships`.
- **Alternatives Considered:**
  1. *Database-per-tenant:* High operational overhead, slow onboarding, expensive connection pooling, difficult schema migrations across hundreds of databases.
  2. *Schema-per-tenant:* Migration complexity, dynamic search_path switching, poor support in serverless and ORM tooling.
  3. *Application-only filtering (`WHERE school_id = ...`):* Catastrophic vulnerability risk if a single developer forgets a filter clause.
- **Consequences:**
  Guarantees airtight tenant isolation while maintaining a single, unified database migration pipeline.

---

## ADR 002: Next.js 15 App Router with Server Components and Route Handlers

- **Status:** Accepted
- **Context:**
  The frontend and API layer must deliver fast page rendering, secure session handling, and SEO/performance optimization across desktop and mobile devices.
- **Decision:**
  Use Next.js 15 with App Router. Business logic and database access run in Server Components, Server Actions, and Route Handlers. Client components are restricted strictly to interactive UI widgets.
- **Alternatives Considered:**
  1. *Vite + React SPA + Express backend:* Requires two separate deployments, duplicate type definitions, and complex CORS/cookie configuration.
  2. *Next.js Pages Router:* Legacy architecture lacking streaming, granular Server Actions, and modern layout nesting.
- **Consequences:**
  Unified TypeScript codebase, direct database querying on the server without internal REST round-trips, and zero client bundle exposure for backend dependencies.

---

## ADR 003: Supabase SSR Client Architecture

- **Status:** Accepted
- **Context:**
  Authentication and database queries require robust session synchronization across Next.js 15 Server Components, Client Components, and Edge Middleware.
- **Decision:**
  Implement the official `@supabase/ssr` package with separate factory functions:
  - `createBrowserClient()` in `src/lib/supabase/client.ts`
  - `createServerClient()` with async `cookies()` in `src/lib/supabase/server.ts`
  - `createAdminClient()` utilizing `SUPABASE_SERVICE_ROLE_KEY` for trusted server workflows.
  - `updateSession()` in `src/middleware.ts` to refresh tokens on incoming requests.
- **Alternatives Considered:**
  1. *Pure `@supabase/supabase-js` without SSR wrapper:* Fails to handle server cookie synchronization cleanly in Next.js App Router.
  2. *Custom JWT verification:* Reinventing auth lifecycle, password hashing, and token refresh loops.
- **Consequences:**
  Clean, standard session lifecycle with secure, HTTP-only cookie storage.

---

## ADR 004: Decoupled User Profiles and School Memberships

- **Status:** Accepted
- **Context:**
  A single person may have affiliations with multiple schools (e.g. a teacher teaching at School A whose child attends School B, or a principal overseeing multiple campuses). Furthermore, a user may hold different roles in different schools.
- **Decision:**
  Decouple global user identity (`profiles` linked 1:1 with `auth.users`) from school affiliations (`school_memberships`). The `school_memberships` table contains `(school_id, user_id, role, status)` with a unique constraint on `(school_id, user_id, role)`.
- **Alternatives Considered:**
  1. *Role stored directly on `profiles` table:* Makes multi-school or multi-role participation impossible without creating duplicate login accounts.
- **Consequences:**
  Maximum flexibility. Users log in once and can switch between affiliated schools and roles seamlessly.

---

## ADR 005: Strict Feature-Based Modular Code Structure

- **Status:** Accepted
- **Context:**
  School ERP platforms have extensive domain models (students, teachers, attendance, exams, fees, timetable). Traditional monolithic structures (`components/`, `api/`, `controllers/`) lead to file sprawl and spaghetti dependencies.
- **Decision:**
  Organize domain logic in `src/features/<feature-name>/`, containing feature-specific types, queries, actions, and UI components. Shared utilities and atomic UI primitives remain in `src/components/ui/` and `src/lib/`.
- **Alternatives Considered:**
  1. *Flat structure by tech layer:* Hard to navigate for solo developers; poor separation of business logic from UI.
- **Consequences:**
  High modularity. Each feature can be built and audited independently during upcoming development phases.

---

## ADR 006: Zod for Environment Configuration and Validation

- **Status:** Accepted
- **Context:**
  Missing or malformed environment variables cause runtime exceptions in production that are difficult to diagnose.
- **Decision:**
  Implement a central validator in `src/lib/validations/env.ts` with Zod. Provide graceful fallback checks via `isSupabaseConfigured()` so build and local testing work without requiring production secrets.
- **Consequences:**
  Immediate, readable startup errors when critical configuration is missing; zero risk of exposing secrets.

