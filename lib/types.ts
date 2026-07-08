export type Role = 'ADMIN' | 'ACADEMIC' | 'TEACHER' | 'KARYAWAN';

export type TeacherType = 'TETAP' | 'FREELANCE';

// WAJIB = sesi dalam jam kerja guru tetap, tidak ada honor tambahan (0%, sudah
// termasuk gaji pokok). FULL/HALF = sesi diluar jam kerja, dibayar 100%/50%
// honor. KangGuru (freelance) selalu diperlakukan sebagai FULL.
export type HonorType = 'WAJIB' | 'FULL' | 'HALF';

// Diatur oleh Akademik saat membuat jadwal; dipakai Admin untuk menentukan
// default nominal honor KangGuru per program.
export type ClassMode = 'ONLINE' | 'OFFLINE';

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
  // Jam kerja standar (format "HH:MM"), untuk deteksi otomatis sesi Wajib vs Diluar Jam Kerja
  workStartTime?: string;
  workEndTime?: string;
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

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

// One row per (schedule, student) session report, derived from
// Schedule["report"]["studentProgresses"] when a teacher checks out. Powers
// per-student attendance/progress history & percentage in the Academic
// dashboard's "Data Siswa" tab.
export type StudentSessionReport = {
  id: string;
  scheduleId: string;
  studentId: string;
  studentName: string;
  program: string;
  className?: string;
  subject: string;
  topic?: string;
  teacherId: string;
  teacherName: string;
  sessionDate: string;
  attendance: AttendanceStatus;
  progressNote: string;
  createdAt: string;
};

export type StudentAttendanceSummary = {
  studentId: string;
  totalSessions: number;
  hadirCount: number;
  izinCount: number;
  sakitCount: number;
  alpaCount: number;
  attendancePercentage: number;
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
  honorType: HonorType;
  classMode: ClassMode;
  archived: boolean;
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
