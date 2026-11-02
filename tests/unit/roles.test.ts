import { describe, it, expect } from 'vitest';
import { USER_ROLES, RESOURCES, ACTIONS } from '@/types/roles';
import { ROLE_METADATA, hasBasePermission, canPerformAction } from '@/config/roles';

describe('Roles and Permissions Architecture', () => {
  it('defines exactly the 5 primary user roles', () => {
    const roles = Object.values(USER_ROLES);
    expect(roles).toHaveLength(5);
    expect(roles).toContain('PRINCIPAL');
    expect(roles).toContain('ADMIN');
    expect(roles).toContain('TEACHER');
    expect(roles).toContain('STUDENT');
    expect(roles).toContain('PARENT');
  });

  it('provides comprehensive metadata for each role', () => {
    Object.values(USER_ROLES).forEach((role) => {
      const meta = ROLE_METADATA[role];
      expect(meta).toBeDefined();
      expect(meta.label).toBeTruthy();
      expect(meta.dashboardPath).toBeTruthy();
      expect(meta.description).toBeTruthy();
    });
  });

  it('allows Principal school-wide oversight', () => {
    expect(hasBasePermission(USER_ROLES.PRINCIPAL, RESOURCES.SCHOOL, ACTIONS.READ)).toBe(true);
    expect(hasBasePermission(USER_ROLES.PRINCIPAL, RESOURCES.CLASS, ACTIONS.MANAGE)).toBe(true);
    expect(hasBasePermission(USER_ROLES.PRINCIPAL, RESOURCES.EXAMINATION, ACTIONS.PUBLISH)).toBe(true);
  });

  it('restricts Student actions appropriately', () => {
    expect(hasBasePermission(USER_ROLES.STUDENT, RESOURCES.SCHOOL, ACTIONS.READ)).toBe(true);
    expect(hasBasePermission(USER_ROLES.STUDENT, RESOURCES.STUDENT, ACTIONS.READ)).toBe(true);
    expect(hasBasePermission(USER_ROLES.STUDENT, RESOURCES.ASSIGNMENT, ACTIONS.SUBMIT)).toBe(true);
    // Student cannot manage classes or update school details
    expect(hasBasePermission(USER_ROLES.STUDENT, RESOURCES.SCHOOL, ACTIONS.UPDATE)).toBe(false);
    expect(hasBasePermission(USER_ROLES.STUDENT, RESOURCES.CLASS, ACTIONS.CREATE)).toBe(false);
  });

  it('evaluates contextual student ownership correctly', () => {
    const studentContext = {
      userId: 'student-uuid-1',
      schoolId: 'school-uuid-1',
      role: USER_ROLES.STUDENT,
      isOwner: true,
    };

    // Allowed to read own attendance
    expect(canPerformAction(studentContext, RESOURCES.ATTENDANCE, ACTIONS.READ)).toBe(true);

    // Disallowed if not owner
    expect(
      canPerformAction({ ...studentContext, isOwner: false }, RESOURCES.ATTENDANCE, ACTIONS.READ),
    ).toBe(false);
  });

  it('evaluates contextual parent-child linkage correctly', () => {
    const parentContext = {
      userId: 'parent-uuid-1',
      schoolId: 'school-uuid-1',
      role: USER_ROLES.PARENT,
      linkedStudentIds: ['child-uuid-10', 'child-uuid-11'],
    };

    // Allowed to view linked child
    expect(
      canPerformAction(parentContext, RESOURCES.STUDENT, ACTIONS.READ, 'child-uuid-10'),
    ).toBe(true);

    // Disallowed for unlinked child
    expect(
      canPerformAction(parentContext, RESOURCES.STUDENT, ACTIONS.READ, 'unrelated-child-99'),
    ).toBe(false);
  });
});

