/**
 * Students Feature Module
 * Manages student profiles, admissions, roll numbers, and parent links.
 * Full implementation scheduled for Phase 3.
 */
export interface StudentRecord {
  id: string;
  schoolId: string;
  userId: string;
  admissionNumber: string;
  rollNumber: string | null;
  classId: string;
  sectionId: string;
  academicYearId: string;
  status: 'active' | 'transferred' | 'graduated' | 'inactive';
}
