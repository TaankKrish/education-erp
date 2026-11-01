# EduNexa ERP — Multi-Tenant School Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-Vitest_Passing-brightgreen?logo=vitest)](https://vitest.dev/)

EduNexa ERP is a production-oriented, multi-tenant School Education ERP SaaS platform engineered for private CBSE schools in India (500–2,000 students).

Built on Next.js 15 App Router, Supabase, PostgreSQL Row Level Security (RLS), and a feature-first modular architecture.

---

## 1. Five Primary User Roles

1. **Principal** — School-wide strategic and academic governance.
2. **Administrative Staff** — Student admissions, fee setup, faculty onboarding, class allocations.
3. **Teacher** — Daily classroom attendance, homework assignments, marks entry.
4. **Student** — Timetables, attendance records, homework submissions, exam report cards.
5. **Parent / Guardian** — Attendance alerts and academic tracking strictly scoped to linked children.

---

## 2. Project Architecture & Directory Structure

```
education-erp/
├── docs/                       # Project documentation & architectural decisions
│   ├── PROJECT.md              # Product overview, target users, core goals, MVP scope
│   ├── ARCHITECTURE.md         # Technology stack, folder structure, SSR clients
│   ├── DATABASE.md             # Schema, RLS policies, indexes, and future entities
│   ├── ROLES_AND_PERMISSIONS.md# 5 roles, authorization matrix, contextual checks
│   ├── DEVELOPMENT_ROADMAP.md  # Step-by-step phased development plan
│   ├── DECISIONS.md            # Architectural Decision Records (ADRs)
│   └── TASKS.md                # Completed tasks, pending work, next milestone
├── src/
│   ├── app/                    # Next.js App Router (Layouts, Pages, Health Route)
│   ├── components/             # Reusable UI primitives (Button, Card, Badge, Table) & Shell
│   ├── config/                 # Central app metadata, role permissions, and site config
│   ├── features/               # Modular domain modules (auth, students, teachers, etc.)
│   ├── hooks/                  # Cross-cutting custom hooks
│   ├── lib/                    # Supabase SSR clients, utils (cn, formatDate), and Zod env
│   ├── middleware.ts           # Next.js auth session refresher
│   └── types/                  # TypeScript interfaces, database schemas, and role types
├── supabase/
│   ├── migrations/             # Versioned PostgreSQL migrations
│   │   └── 20261101000000_initial_schema.sql
│   └── seed.sql                # Seed records for local development
└── tests/                      # Vitest unit & integration test suites
```

---

## 3. Getting Started

### Prerequisites
- **Node.js:** `v22.x` or later
- **npm:** `v10.x` or later (or `pnpm`)
- **Git**

### Installation

1. **Clone the repository and enter directory:**
   ```bash
   git clone <repository-url>
   cd education-erp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials (see Supabase Setup below).

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Development Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server on port 3000. |
| `npm run build` | Compiles optimized production build. |
| `npm run start` | Starts Next.js production server. |
| `npm run type-check` | Executes strict TypeScript compiler checks (`tsc --noEmit`). |
| `npm run lint` | Runs Next.js ESLint checks. |
| `npm test` | Runs unit tests via Vitest in-memory runner. |
| `npm run test:watch` | Starts Vitest in interactive watch mode. |

---

## 5. Supabase Setup Instructions

1. **Create a Supabase Project:**
   Log in to [Supabase](https://supabase.com) and create a new project.

2. **Obtain API Keys:**
   Navigate to **Project Settings -> API** in the Supabase Dashboard:
   - Copy the **Project URL** and assign to `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy the **anon public** key and assign to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Copy the **service_role secret** key and assign to `SUPABASE_SERVICE_ROLE_KEY`.

3. **Apply Database Migration:**
   - Option A (Supabase Dashboard SQL Editor):
     Paste the contents of `supabase/migrations/20261101000000_initial_schema.sql` into the SQL Editor and execute.
   - Option B (Supabase CLI):
     ```bash
     supabase db push
     ```

4. **Seed Sample Data (Optional):**
   Execute `supabase/seed.sql` in the SQL Editor to populate sample CBSE schools.

---

## 6. Current Status & Next Milestone

- **Current Phase:** Phase 0 (Project Foundation) — **Complete**
- **Next Milestone:** Phase 1 (Authentication and Role-Based Access Control)
- **Status Dashboard:** Visit [http://localhost:3000](http://localhost:3000) to review the live architecture status.
