import { Database } from './database';
import { UserRole, MembershipStatus } from './roles';

export * from './roles';
export * from './database';

export type School = Database['public']['Tables']['schools']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type SchoolMembership = Database['public']['Tables']['school_memberships']['Row'];

/**
 * User session context including active school and resolved role.
 */
export interface UserSessionContext {
  user: Profile;
  activeSchool: School | null;
  activeRole: UserRole | null;
  memberships: (SchoolMembership & { school: School })[];
}

/**
 * School affiliation for multi-school users.
 */
export interface SchoolAffiliation {
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
  role: UserRole;
  status: MembershipStatus;
}
