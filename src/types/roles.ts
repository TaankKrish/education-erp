/**
 * User roles supported across schools in the Education ERP.
 */
export const USER_ROLES = {
  PRINCIPAL: 'PRINCIPAL',
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Membership status for school affiliations.
 */
export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const;

export type MembershipStatus = (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];

/**
 * Core resource domains in the ERP.
 */
export const RESOURCES = {
  SCHOOL: 'school',
  ACADEMIC_YEAR: 'academic_year',
  CLASS: 'class',
  SECTION: 'section',
  SUBJECT: 'subject',
  STUDENT: 'student',
  TEACHER: 'teacher',
  ATTENDANCE: 'attendance',
  ASSIGNMENT: 'assignment',
  EXAMINATION: 'examination',
  MARKS: 'marks',
  NOTICE: 'notice',
  MEMBERSHIP: 'membership',
} as const;

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];

/**
 * Granular actions on resources.
 */
export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  PUBLISH: 'publish',
  SUBMIT: 'submit',
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

/**
 * Permission rule definition.
 */
export interface PermissionRule {
  resource: Resource;
  actions: Action[];
  description: string;
}

/**
 * Context for evaluating contextual authorization decisions
 * (e.g. Is this teacher assigned to section X? Is this student accessing their own record?).
 */
export interface AuthorizationContext {
  userId: string;
  schoolId: string;
  role: UserRole;
  isOwner?: boolean;
  assignedClassIds?: string[];
  assignedSectionIds?: string[];
  linkedStudentIds?: string[];
}

