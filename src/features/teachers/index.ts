/**
 * Teachers Feature Module
 * Manages faculty records, employee IDs, department, and teaching assignments.
 * Full implementation scheduled for Phase 3.
 */
export interface TeacherRecord {
  id: string;
  schoolId: string;
  userId: string;
  employeeCode: string;
  designation: string;
  department: string | null;
  joiningDate: string;
  status: 'active' | 'on_leave' | 'resigned';
}

