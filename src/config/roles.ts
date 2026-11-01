import {
  UserRole,
  USER_ROLES,
  Resource,
  RESOURCES,
  Action,
  ACTIONS,
  AuthorizationContext,
} from '@/types/roles';

export interface RoleMetadata {
  key: UserRole;
  label: string;
  description: string;
  badgeVariant: 'default' | 'secondary' | 'outline' | 'destructive' | 'brand';
  dashboardPath: string;
}

export const ROLE_METADATA: Record<UserRole, RoleMetadata> = {
  [USER_ROLES.PRINCIPAL]: {
    key: USER_ROLES.PRINCIPAL,
    label: 'Principal',
    description: 'School-wide executive oversight, academic and administrative governance.',
    badgeVariant: 'default',
    dashboardPath: '/principal/dashboard',
  },
  [USER_ROLES.ADMIN]: {
    key: USER_ROLES.ADMIN,
    label: 'Administrative Staff',
    description: 'Operational school management, admissions, records, and system administration.',
    badgeVariant: 'brand',
    dashboardPath: '/admin/dashboard',
  },
  [USER_ROLES.TEACHER]: {
    key: USER_ROLES.TEACHER,
    label: 'Teacher',
    description: 'Classroom instruction, attendance tracking, assignments, and exam evaluations.',
    badgeVariant: 'secondary',
    dashboardPath: '/teacher/dashboard',
  },
  [USER_ROLES.STUDENT]: {
    key: USER_ROLES.STUDENT,
    label: 'Student',
    description: 'Personal academic progress, homework submissions, timetables, and notices.',
    badgeVariant: 'outline',
    dashboardPath: '/student/dashboard',
  },
  [USER_ROLES.PARENT]: {
    key: USER_ROLES.PARENT,
    label: 'Parent / Guardian',
    description: 'Visibility into linked children attendance, performance, and school notices.',
    badgeVariant: 'outline',
    dashboardPath: '/parent/dashboard',
  },
};

/**
 * Baseline permission matrix mapping Role -> Map of Resource -> Set of Allowed Actions.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Partial<Record<Resource, Action[]>>> = {
  [USER_ROLES.PRINCIPAL]: {
    [RESOURCES.SCHOOL]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.ACADEMIC_YEAR]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE],
    [RESOURCES.CLASS]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.SECTION]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.SUBJECT]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.STUDENT]: [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.CREATE],
    [RESOURCES.TEACHER]: [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.CREATE, ACTIONS.MANAGE],
    [RESOURCES.ATTENDANCE]: [ACTIONS.READ, ACTIONS.MANAGE],
    [RESOURCES.ASSIGNMENT]: [ACTIONS.READ],
    [RESOURCES.EXAMINATION]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.PUBLISH],
    [RESOURCES.MARKS]: [ACTIONS.READ, ACTIONS.PUBLISH],
    [RESOURCES.NOTICE]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH],
    [RESOURCES.MEMBERSHIP]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE],
  },
  [USER_ROLES.ADMIN]: {
    [RESOURCES.SCHOOL]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.ACADEMIC_YEAR]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE],
    [RESOURCES.CLASS]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE],
    [RESOURCES.SECTION]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE],
    [RESOURCES.SUBJECT]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE],
    [RESOURCES.STUDENT]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.TEACHER]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.ATTENDANCE]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.ASSIGNMENT]: [ACTIONS.READ],
    [RESOURCES.EXAMINATION]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.MARKS]: [ACTIONS.READ],
    [RESOURCES.NOTICE]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH],
    [RESOURCES.MEMBERSHIP]: [ACTIONS.MANAGE, ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE],
  },
  [USER_ROLES.TEACHER]: {
    [RESOURCES.SCHOOL]: [ACTIONS.READ],
    [RESOURCES.ACADEMIC_YEAR]: [ACTIONS.READ],
    [RESOURCES.CLASS]: [ACTIONS.READ],
    [RESOURCES.SECTION]: [ACTIONS.READ],
    [RESOURCES.SUBJECT]: [ACTIONS.READ],
    [RESOURCES.STUDENT]: [ACTIONS.READ],
    [RESOURCES.TEACHER]: [ACTIONS.READ],
    [RESOURCES.ATTENDANCE]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.ASSIGNMENT]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
    [RESOURCES.EXAMINATION]: [ACTIONS.READ],
    [RESOURCES.MARKS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.NOTICE]: [ACTIONS.CREATE, ACTIONS.READ],
    [RESOURCES.MEMBERSHIP]: [ACTIONS.READ],
  },
  [USER_ROLES.STUDENT]: {
    [RESOURCES.SCHOOL]: [ACTIONS.READ],
    [RESOURCES.ACADEMIC_YEAR]: [ACTIONS.READ],
    [RESOURCES.CLASS]: [ACTIONS.READ],
    [RESOURCES.SECTION]: [ACTIONS.READ],
    [RESOURCES.SUBJECT]: [ACTIONS.READ],
    [RESOURCES.STUDENT]: [ACTIONS.READ], // Restricted to self in authorization checks
    [RESOURCES.ATTENDANCE]: [ACTIONS.READ], // Restricted to self
    [RESOURCES.ASSIGNMENT]: [ACTIONS.READ, ACTIONS.SUBMIT],
    [RESOURCES.EXAMINATION]: [ACTIONS.READ],
    [RESOURCES.MARKS]: [ACTIONS.READ], // Restricted to self
    [RESOURCES.NOTICE]: [ACTIONS.READ],
  },
  [USER_ROLES.PARENT]: {
    [RESOURCES.SCHOOL]: [ACTIONS.READ],
    [RESOURCES.ACADEMIC_YEAR]: [ACTIONS.READ],
    [RESOURCES.STUDENT]: [ACTIONS.READ], // Restricted to linked children
    [RESOURCES.ATTENDANCE]: [ACTIONS.READ], // Restricted to linked children
    [RESOURCES.ASSIGNMENT]: [ACTIONS.READ], // Restricted to linked children
    [RESOURCES.EXAMINATION]: [ACTIONS.READ],
    [RESOURCES.MARKS]: [ACTIONS.READ], // Restricted to linked children
    [RESOURCES.NOTICE]: [ACTIONS.READ],
  },
};

/**
 * Check if a role has the base permission for a resource and action.
 */
export function hasBasePermission(role: UserRole, resource: Resource, action: Action): boolean {
  const roleRules = ROLE_PERMISSIONS[role];
  if (!roleRules) return false;
  const actions = roleRules[resource];
  if (!actions) return false;
  return actions.includes(action) || actions.includes(ACTIONS.MANAGE);
}

/**
 * Check contextual permission considering ownership and assignments.
 */
export function canPerformAction(
  context: AuthorizationContext,
  resource: Resource,
  action: Action,
  targetResourceId?: string,
): boolean {
  const { role, isOwner, linkedStudentIds, assignedSectionIds } = context;

  // Base permission check first
  if (!hasBasePermission(role, resource, action)) {
    return false;
  }

  // Contextual restrictions
  if (role === USER_ROLES.STUDENT) {
    if (resource === RESOURCES.STUDENT || resource === RESOURCES.ATTENDANCE || resource === RESOURCES.MARKS) {
      // Must be own record
      return Boolean(isOwner);
    }
  }

  if (role === USER_ROLES.PARENT) {
    if (resource === RESOURCES.STUDENT || resource === RESOURCES.ATTENDANCE || resource === RESOURCES.MARKS) {
      if (!targetResourceId || !linkedStudentIds) return false;
      return linkedStudentIds.includes(targetResourceId);
    }
  }

  if (role === USER_ROLES.TEACHER) {
    if (resource === RESOURCES.ATTENDANCE || resource === RESOURCES.MARKS) {
      if (action === ACTIONS.CREATE || action === ACTIONS.UPDATE) {
        // Must belong to assigned section
        if (targetResourceId && assignedSectionIds) {
          return assignedSectionIds.includes(targetResourceId);
        }
      }
    }
  }

  return true;
}
