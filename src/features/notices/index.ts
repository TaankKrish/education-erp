/**
 * Notices Feature Module
 * School-wide, role-targeted, and class-specific announcements.
 * Full implementation scheduled for Phase 7.
 */
export interface NoticeRecord {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  targetRoles: ('PRINCIPAL' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT')[];
  isPinned: boolean;
  publishedAt: string;
  authorId: string;
}
