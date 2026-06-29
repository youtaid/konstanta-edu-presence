import { Schedule, User, Period, Student } from './types';

type Database = {
  users: User[];
  schedules: Schedule[];
  periods: Period[];
  students: Student[];
  programs: string[];
  activePeriodId: string;
};

const initialUsers: User[] = [
  { id: 'U1', name: 'Admin Utama', email: 'admin@konstanta.edu', role: 'ADMIN' },
  { id: 'U2', name: 'Staf Akademik', email: 'akademik@konstanta.edu', role: 'ACADEMIC' },
  { id: 'U3', name: 'Budi Santoso (KETetap)', email: 'budi@konstanta.edu', role: 'TEACHER', teacherId: 'T1', teacherType: 'TETAP', baseSalary: 3500000, transportAllowance: 500000, otherAllowance: 200000, bpjsKetenagakerjaan: 70000, bpjsKesehatan: 35000 },
  { id: 'U4', name: 'Siti Aminah (KangGuru)', email: 'siti@konstanta.edu', role: 'TEACHER', teacherId: 'T2', teacherType: 'FREELANCE' },
];

const initialPrograms = ['ELC', 'TPS', 'OSN', 'PM', 'Privat', 'TKA'];

const initialStudents: Student[] = [
  { id: 'ST1', name: 'Ahmad', program: 'ELC' },
  { id: 'ST2', name: 'Siti', program: 'Privat' },
  { id: 'ST3', name: 'Kevin', program: 'ELC' },
  { id: 'ST4', name: 'Budi', program: 'ELC' },
  { id: 'ST5', name: 'Caca', program: 'ELC' },
  { id: 'ST6', name: 'Doni', program: 'Privat' },
  { id: 'ST7', name: 'Eka', program: 'PM' },
];

const initialPeriods: Period[] = [
  { id: 'P1', name: '26 Mei - 25 Juni 2026', startDate: '2026-05-26', endDate: '2026-06-25' },
  { id: 'P2', name: '26 Juni - 25 Juli 2026', startDate: '2026-06-26', endDate: '2026-07-25' },
];

const initialSchedules: Schedule[] = [
  {
    id: 'S1',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:30',
    program: 'ELC',
    subject: 'Matematika',
    topic: 'Integral Tak Tentu',
    teacherId: 'T1',
    teacherName: 'Budi Santoso',
    studentIds: ['ST1', 'ST3', 'ST4', 'ST5'],
    students: [
      { id: 'ST1', name: 'Ahmad' },
      { id: 'ST3', name: 'Kevin' },
      { id: 'ST4', name: 'Budi' },
      { id: 'ST5', name: 'Caca' }
    ],
    branch: 'Tebet',
    status: 'WAITING_APPROVAL',
    honorAmount: 150000,
    honorType: 'FULL',
    classMode: 'OFFLINE',
  },
  {
    id: 'S2',
    date: '2026-06-20',
    startTime: '16:00',
    endTime: '17:30',
    program: 'TPS',
    subject: 'Penalaran Umum',
    topic: 'Logika Proposisi',
    teacherId: 'T1',
    teacherName: 'Budi Santoso',
    branch: 'Tebet',
    status: 'VALIDATED',
    honorAmount: 150000,
    honorType: 'FULL',
    classMode: 'OFFLINE',
    checkIn: { time: '15:55', lat: -6.2301, lng: 106.8501 },
    checkOut: { time: '17:35', lat: -6.2301, lng: 106.8501 },
    report: {
      materialTaught: 'Penalaran Umum Dasar',
      understandingLevel: 'Baik',
      studentActivity: 'Aktif bertanya',
    }
  },
  {
    id: 'S3',
    date: '2026-06-22',
    startTime: '09:00',
    endTime: '10:30',
    program: 'Privat',
    subject: 'Fisika',
    topic: 'Listrik Statis',
    teacherId: 'T1',
    teacherName: 'Budi Santoso',
    studentIds: ['ST2'],
    students: [
      { id: 'ST2', name: 'Siti' }
    ],
    branch: 'Depok',
    status: 'PAID',
    honorAmount: 125000,
    honorType: 'FULL',
    classMode: 'OFFLINE',
    checkIn: { time: '08:50', lat: -6.38, lng: 106.83 },
    checkOut: { time: '10:35', lat: -6.38, lng: 106.83 },
    report: {
      materialTaught: 'Hukum Coulomb',
      understandingLevel: 'Cukup',
      studentActivity: 'Kurang Aktif',
      studentProgresses: [
        { studentId: 'ST2', studentName: 'Siti', attendance: 'Hadir', progress: 'Siti mulai paham konsep gaya tolak menolak, tapi butuh latihan soal lebih banyak.' }
      ]
    }
  }
];

const globalForDb = global as unknown as { db: Database };

export const db = globalForDb.db || {
  users: initialUsers,
  schedules: initialSchedules,
  periods: initialPeriods,
  students: initialStudents,
  programs: initialPrograms,
  activePeriodId: 'P1',
};

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
