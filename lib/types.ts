export type Role = 'ADMIN' | 'ACADEMIC' | 'TEACHER' | 'KARYAWAN';

export type TeacherType = 'TETAP' | 'FREELANCE';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  teacherId?: string;
  teacherType?: TeacherType;
  // Tetap properties
  baseSalary?: number;
  transportAllowance?: number;
  otherAllowance?: number;
  bpjsKetenagakerjaan?: number;
  bpjsKesehatan?: number;
};

export type Period = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type Student = {
  id: string;
  name: string;
  program: string;
  className?: string;
};

export type ScheduleStatus =
  | 'DRAFT'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'WAITING_VERIFICATION'
  | 'VERIFIED'
  | 'WAITING_VALIDATION'
  | 'VALIDATED'
  | 'PAID';

export type Schedule = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  program: string;
  subject: string;
  topic: string;
  teacherId: string;
  teacherName: string;
  studentIds?: string[];
  students?: { id: string; name: string }[];
  branch: string;
  status: ScheduleStatus;
  honorAmount: number;
  report?: {
    materialTaught: string;
    understandingLevel: string;
    studentActivity: string;
    studentProgresses?: {
      studentId: string;
      studentName: string;
      attendance: string;
      progress: string;
    }[];
  };
  checkIn?: {
    time: string;
    lat: number;
    lng: number;
  };
  checkOut?: {
    time: string;
    lat: number;
    lng: number;
  };
};
