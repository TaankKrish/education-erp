/**
 * Examinations Feature Module
 * Exam scheduling, report cards, marks entry, and CBSE grading.
 * Full implementation scheduled for Phase 6.
 */
export interface ExaminationRecord {
  id: string;
  schoolId: string;
  academicYearId: string;
  name: string; // e.g. "Term 1 Mid-Term", "Annual Examination"
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

