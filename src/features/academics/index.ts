/**
 * Academics Feature Module
 * Manages academic years, classes, sections, subjects, and timetables.
 * Full implementation scheduled for Phase 2.
 */
export interface AcademicYearRecord {
  id: string;
  schoolId: string;
  name: string; // e.g. "2026-2027"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface ClassRecord {
  id: string;
  schoolId: string;
  name: string; // e.g. "Class 10"
  stage: 'primary' | 'middle' | 'secondary' | 'senior_secondary';
  orderIndex: number;
}

export interface SectionRecord {
  id: string;
  classId: string;
  name: string; // e.g. "A"
  classTeacherId: string | null;
}

export interface SubjectRecord {
  id: string;
  schoolId: string;
  name: string; // e.g. "Mathematics"
  code: string; // e.g. "041"
}
