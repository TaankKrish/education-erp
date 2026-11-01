/**
 * Auth Feature Module
 * Handles user authentication, session resolution, and active school context.
 * Full implementation scheduled for Phase 1.
 */
export interface AuthSession {
  userId: string;
  email: string;
  activeSchoolId: string | null;
  activeRole: string | null;
}
