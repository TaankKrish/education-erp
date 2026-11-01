# EduNexa ERP — Project Overview

## 1. Product Overview

**EduNexa ERP** is a modern, production-oriented, multi-tenant Software-as-a-Service (SaaS) platform engineered specifically for school administration, academic management, and communication in Indian private schools.

The architecture is designed to support multiple independent schools on a unified software infrastructure, delivering strict school-level data isolation, role-specific workflows, and compliance with the Central Board of Secondary Education (CBSE) academic structure.

---

## 2. Target Market & User Demographics

- **Target Segment:** Indian Private CBSE Schools.
- **Typical School Size:** 500 to 2,000 enrolled students.
- **Operational Reality:**
  - High volume of attendance entries during morning periods.
  - Term-based examination schedules and CBSE grading conventions.
  - Diverse user technical literacy (principals, administrative clerks, subject teachers, students, and parents).
  - High mobile usage among parents and students; desktop-heavy usage among administrative staff and school leadership.

---

## 3. Five Primary User Roles

All users authenticate through a common authentication gateway and are directed into role-specific, permission-bounded dashboards:

1. **Principal:**
   - Strategic and school-wide oversight.
   - Academic governance, teacher workload reviews, attendance health, and examination publishing.
2. **Administrative Staff (Admin):**
   - Day-to-day operations: student admissions, fee structures, faculty onboarding, class-section allocations, and statutory reporting.
3. **Teacher:**
   - Daily attendance marking, timetable management, homework/assignments distribution, and examination marks entry.
4. **Student:**
   - Viewing daily timetables, homework deadlines, attendance percentages, report cards, and school notices.
5. **Parent / Guardian:**
   - Multi-child tracking, real-time absence alerts, academic progress reports, and teacher notices for linked children only.

---

## 4. Core Goals

1. **Strict Multi-Tenancy:**
   Complete school-level data isolation using PostgreSQL Row Level Security (RLS) so that cross-tenant data leakage is structurally impossible.
2. **Clean & Extensible Architecture:**
   Feature-sliced domain organization (`src/features/`) keeping business rules isolated from presentation components.
3. **High Developer Velocity & Type Safety:**
   End-to-end TypeScript strict mode, Zod runtime validation, and Supabase SSR integration.
4. **Accessible, Modern UI:**
   Tailwind CSS and shadcn/ui-inspired component system delivering a responsive experience across desktop, tablet, and mobile.

---

## 5. MVP Scope Boundaries

### Included in Initial MVP (Phases 1–8)
- Multi-tenant school onboarding and school context switching.
- Supabase Authentication with role-based routing.
- Academic year, class, section, and subject stream setup.
- Student admission records and parent-child mapping.
- Faculty onboarding and section-subject teacher allocations.
- Daily classroom attendance tracking and aggregate registers.
- School-wide and role-targeted notices and announcements.
- Homework assignment distribution and student submissions.
- Examination scheduling, marks entry, and report card publishing.
- Dedicated dashboards for Principal, Admin, Teacher, Student, and Parent.

### Explicitly Excluded from Initial MVP
- Online fee payment gateways and accounting reconciliation.
- Human resources payroll processing.
- School bus fleet / GPS transport tracking.
- Library barcode / inventory management.
- Native mobile applications (iOS/Android wrappers).
- Generative AI tutor bots / predictive ML analytics.
- Real-time peer-to-peer student chat.
