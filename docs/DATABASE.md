# EduNexa ERP — Database Architecture & Schema

## 1. Multi-Tenant Philosophy

EduNexa ERP adopts a **single-database, shared-schema, row-level isolated** multi-tenant model.

Every school has an isolated data domain. All business records belonging to a school include a `school_id` foreign key referencing the `schools` table. Cross-tenant leakage is prevented via PostgreSQL Row Level Security (RLS) enforced at the database engine level.

---

## 2. Foundational Entities (Phase 0)

### 2.1 Table: `schools`
Represents the root tenant entity (the school institution).

```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  affiliation_number TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  status school_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

- **Indexes:**
  - `idx_schools_slug` on `schools(slug)` — Fast tenant lookup by slug/subdomain.
  - `idx_schools_code` on `schools(code)` — Fast CBSE code lookup.
  - `idx_schools_status` on `schools(status)`.
- **Deletion Behavior:** Restricted in production. Deleting a school requires explicit administrative deactivation.

---

### 2.2 Table: `profiles`
Stores user identity independent of school memberships. Linked 1:1 with Supabase `auth.users`.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

- **PostgreSQL Trigger:**
  `on_auth_user_created` trigger automatically provisions a `profiles` row when an `auth.users` record is created.

---

### 2.3 Table: `school_memberships`
Binds a user profile to a specific school under a declared role. Enables multi-school and multi-role participation without duplicating user credentials.

```sql
CREATE TABLE school_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  status membership_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_school_user_role UNIQUE (school_id, user_id, role)
);
```

- **Indexes:**
  - `idx_memberships_school_id` on `school_memberships(school_id)`
  - `idx_memberships_user_id` on `school_memberships(user_id)`
  - `idx_memberships_lookup` on `school_memberships(school_id, user_id, status)`

---

## 3. Row Level Security (RLS) Policies

All tables have RLS explicitly enabled:

```sql
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_memberships ENABLE ROW LEVEL SECURITY;
```

### Security Helper Functions
1. `is_school_member(lookup_school_id UUID, required_roles user_role[] DEFAULT NULL)`
   - Marked `SECURITY DEFINER STABLE SET search_path = public`.
   - Validates whether `auth.uid()` has an active membership in the school, optionally checking if their role is present in `required_roles`.
2. `get_current_user_schools()`
   - Returns all active schools and associated roles for the authenticated user.

### Policy Rules Summary
- **`profiles`:**
  - `SELECT`: Own profile (`id = auth.uid()`) OR shared school membership.
  - `UPDATE`: Own profile (`id = auth.uid()`).
- **`schools`:**
  - `SELECT`: Active members of the school via `is_school_member(id)`.
  - `UPDATE`: Principals and Admins via `is_school_member(id, ARRAY['PRINCIPAL', 'ADMIN'])`.
- **`school_memberships`:**
  - `SELECT`: Own memberships (`user_id = auth.uid()`) OR school leadership (`PRINCIPAL`, `ADMIN`).
  - `INSERT / UPDATE / DELETE`: School leadership only.

---

## 4. Planned Future Entities (Roadmap)

| Entity | Description | Target Phase |
| :--- | :--- | :--- |
| `academic_years` | School academic sessions (e.g., "2026-2027") | Phase 2 |
| `classes` | Grades / Standards (e.g., "Class 10") | Phase 2 |
| `sections` | Divisions (e.g., "Section A") with Class Teacher mapping | Phase 2 |
| `subjects` | Subjects taught (e.g., "Mathematics 041") | Phase 2 |
| `students` | Student admission number, roll number, DOB, blood group | Phase 3 |
| `teachers` | Teacher employee code, designation, qualification | Phase 3 |
| `parent_student_mappings` | Relationship linking parents to their children | Phase 3 |
| `attendances` | Daily student attendance registers | Phase 4 |
| `assignments` | Homework tasks, due dates, file attachments | Phase 5 |
| `examinations` | Exam cycles, grading scales, schedules | Phase 6 |
| `marks` | Subject marks, grades, and teacher remarks | Phase 6 |
| `notices` | School broadcasts and announcements | Phase 7 |
