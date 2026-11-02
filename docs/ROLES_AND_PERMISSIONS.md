# EduNexa ERP — Roles and Permissions Architecture

## 1. Core Principles

1. **Centralized Definition:**
   All roles, permissions, and metadata are declared in a single source of truth: `src/config/roles.ts` and `src/types/roles.ts`.
2. **Context-Aware Authorization:**
   A role alone does not confer access. Permissions require triple validation:
   - **School Membership:** Is the user an active member of this school?
   - **Role Capability:** Does this role possess permission to perform the action on the resource?
   - **Contextual Ownership/Assignment:** Is the teacher assigned to this class section? Is this student accessing their own record? Is this parent linked to this child?
3. **Defense in Depth:**
   Permissions are validated at both:
   - The application layer (Server Actions and Route Handlers).
   - The database layer (PostgreSQL Row Level Security policies).
   Hiding UI buttons is treated strictly as convenience, never as security.

---

## 2. Five Primary User Roles

### 2.1 PRINCIPAL (`USER_ROLES.PRINCIPAL`)
- **Executive Purpose:** Holistic oversight of school academics, operations, and governance.
- **Access Boundary:** Entire school institution across all academic years, classes, and departments.
- **Capabilities:**
  - View all student, teacher, and academic records.
  - Approve and publish final examination schedules and report cards.
  - Broadcast school-wide announcements and notices.
  - Review school attendance health and grade averages.
  - Update school profile and academic configuration.

---

### 2.2 ADMINISTRATIVE STAFF (`USER_ROLES.ADMIN`)
- **Operational Purpose:** Day-to-day administrative execution and student life-cycle management.
- **Access Boundary:** School-wide administrative domain.
- **Capabilities:**
  - Create and manage academic years, classes, and sections.
  - Process student admissions, enrollments, and status updates.
  - Register teachers and configure class-subject assignments.
  - Manage user memberships and issue invitations.
  - Generate statutory CBSE compliance reports.

---

### 2.3 TEACHER (`USER_ROLES.TEACHER`)
- **Pedagogical Purpose:** Direct classroom instruction, evaluation, and pastoral care.
- **Access Boundary:** Assigned classes, assigned sections, and assigned subjects.
- **Capabilities:**
  - Mark daily student attendance for assigned sections.
  - Create, publish, and grade homework assignments.
  - Enter test/exam marks for assigned subject courses.
  - Issue classroom notices and view student academic profiles.
- **Restrictions:**
  - Cannot modify school settings or academic year configuration.
  - Cannot alter marks or attendance for classes taught by other faculty without administrative delegation.

---

### 2.4 STUDENT (`USER_ROLES.STUDENT`)
- **Academic Purpose:** Active engagement with courses, assignments, and personal records.
- **Access Boundary:** Strictly isolated to their own user record and enrolled class/section.
- **Capabilities:**
  - View personal timetable and attendance percentages.
  - View and submit homework assignments.
  - View published examination schedules and own report cards.
  - Read school notices targeted to students or their section.
- **Restrictions:**
  - Read-only access to academic marks and attendance records.
  - Zero access to other students' personal information or marks.

---

### 2.5 PARENT / GUARDIAN (`USER_ROLES.PARENT`)
- **Parental Purpose:** Monitoring the safety, attendance, and academic progress of their children.
- **Access Boundary:** Strictly scoped to linked student records (`parent_student_mappings`).
- **Capabilities:**
  - View real-time attendance status and absence alerts for linked children.
  - View homework tasks, assignment grades, and exam report cards for linked children.
  - View notices sent to parents by teachers or school administration.
- **Restrictions:**
  - Zero access to any student record other than their explicitly linked children.
  - Read-only access to school academic records.

---

## 3. Permission Evaluation Matrix

| Resource | Action | Principal | Admin | Teacher | Student | Parent |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **School Profile** | Read / Update | Read + Update | Read + Update | Read | Read | Read |
| **Academic Year** | Manage / Read | Manage | Manage | Read | Read | Read |
| **Classes & Sections** | Manage / Read | Manage | Manage | Read | Read | Read |
| **Teacher Profiles** | Manage / Read | Manage | Manage | Read | Read (Assigned) | Read (Assigned) |
| **Student Profiles** | Manage / Read | Read + Update | Manage | Read | Read (Self Only) | Read (Linked Only) |
| **Attendance** | Mark / Read | Full Read | Full Read | Mark Assigned | Read (Self Only) | Read (Linked Only) |
| **Assignments** | Create / Submit | Read | Read | Create + Grade | Submit (Self) | Read (Linked Only) |
| **Examinations** | Schedule / Publish | Manage + Publish | Manage | Read | Read | Read |
| **Marks Entry** | Enter / Publish | Publish | Read | Enter Assigned | Read (Self Only) | Read (Linked Only) |
| **School Notices** | Create / Read | Create + Publish | Create + Publish | Create (Class) | Read | Read |
| **Memberships** | Manage / Read | Manage | Manage | Read | Read (Self Only) | Read (Self Only) |

---

## 4. Programmatic Evaluation API

```typescript
import { canPerformAction } from '@/config/roles';
import { USER_ROLES, RESOURCES, ACTIONS } from '@/types/roles';

// Example: Validating teacher attendance submission
const allowed = canPerformAction(
  {
    userId: teacherProfile.id,
    schoolId: activeSchool.id,
    role: USER_ROLES.TEACHER,
    assignedSectionIds: ['section-uuid-10a'],
  },
  RESOURCES.ATTENDANCE,
  ACTIONS.CREATE,
  'section-uuid-10a', // target section ID
);
```

