/**
 * Attendance Feature Module
 * Daily student attendance tracking, leave applications, and monthly registers.
 * Full implementation scheduled for Phase 4.
 */
export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  sectionId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'excused';
  remarks?: string;
  markedById: string;
}
