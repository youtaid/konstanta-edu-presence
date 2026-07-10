-- LMS features mock data seeds for Konstanta Edu Presence (konstanta.my.id)

-- 1. Setup system settings
INSERT INTO public.settings (key, value, updated_at) values 
('activePeriodId', 'P1', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- 2. Link Demo accounts to teacher IDs T1 and T2 for schedule mock matching
UPDATE public.profiles 
SET teacher_id = 'T1', teacher_type = 'TETAP', full_name = 'Budi Santoso (KETetap)' 
WHERE id = 'd0000000-0000-0000-0000-000000000003';

UPDATE public.profiles 
SET teacher_id = 'T2', teacher_type = 'FREELANCE', full_name = 'Siti Aminah (KangGuru)' 
WHERE id = 'd0000000-0000-0000-0000-000000000004';

-- 3. Seed PROGRAMS
INSERT INTO public.programs (name, created_at) values
('ELC', now()),
('TPS', now()),
('OSN', now()),
('PM', now()),
('Privat', now()),
('TKA', now())
ON CONFLICT (name) DO NOTHING;

-- 4. Seed PERIODS
INSERT INTO public.periods (id, name, start_date, end_date, created_at) values
('P1', '26 Mei - 25 Juni 2026', '2026-05-26', '2026-06-25', now()),
('P2', '26 Juni - 25 Juli 2026', '2026-06-26', '2026-07-25', now())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  start_date = EXCLUDED.start_date, 
  end_date = EXCLUDED.end_date;

-- 5. Seed STUDENTS
INSERT INTO public.students (id, name, program, class_name, created_at) values
('ST1', 'Ahmad', 'ELC', '12-IPA-1', now()),
('ST2', 'Siti', 'Privat', '12-IPA-2', now()),
('ST3', 'Kevin', 'ELC', '10-A', now()),
('ST4', 'Budi', 'ELC', NULL, now()),
('ST5', 'Caca', 'ELC', NULL, now()),
('ST6', 'Doni', 'Privat', NULL, now()),
('ST7', 'Eka', 'PM', NULL, now())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  program = EXCLUDED.program, 
  class_name = EXCLUDED.class_name;

-- 6. Seed SCHEDULES
INSERT INTO public.schedules (
  id, date, start_time, end_time, program, subject, topic, 
  teacher_id, teacher_name, student_ids, students_data, branch, 
  status, honor_amount, report, check_in, check_out, created_at
) values
(
  'S1',
  CURRENT_DATE,
  '14:00',
  '15:30',
  'ELC',
  'Matematika',
  'Integral Tak Tentu',
  'T1',
  'Budi Santoso',
  ARRAY['ST1', 'ST3', 'ST4', 'ST5'],
  '[{"id": "ST1", "name": "Ahmad"}, {"id": "ST3", "name": "Kevin"}, {"id": "ST4", "name": "Budi"}, {"id": "ST5", "name": "Caca"}]'::jsonb,
  'Tebet',
  'WAITING_APPROVAL',
  150000,
  NULL,
  NULL,
  NULL,
  now()
),
(
  'S2',
  '2026-06-20',
  '16:00',
  '17:30',
  'TPS',
  'Penalaran Umum',
  'Logika Proposisi',
  'T1',
  'Budi Santoso',
  NULL,
  NULL,
  'Tebet',
  'VALIDATED',
  150000,
  '{"materialTaught": "Penalaran Umum Dasar", "understandingLevel": "Baik", "studentActivity": "Aktif bertanya"}'::jsonb,
  '{"time": "15:55", "lat": -6.2301, "lng": 106.8501}'::jsonb,
  '{"time": "17:35", "lat": -6.2301, "lng": 106.8501}'::jsonb,
  now()
),
(
  'S3',
  '2026-06-22',
  '09:00',
  '10:30',
  'Privat',
  'Fisika',
  'Listrik Statis',
  'T1',
  'Budi Santoso',
  ARRAY['ST2'],
  '[{"id": "ST2", "name": "Siti"}]'::jsonb,
  'Depok',
  'PAID',
  125000,
  '{"materialTaught": "Hukum Coulomb", "understandingLevel": "Cukup", "studentActivity": "Kurang Aktif", "studentProgresses": [{"studentId": "ST2", "studentName": "Siti", "attendance": "Hadir", "progress": "Siti mulai paham konsep gaya tolak menolak, tapi butuh latihan soal lebih banyak."}]}'::jsonb,
  '{"time": "08:50", "lat": -6.38, "lng": 106.83}'::jsonb,
  '{"time": "10:35", "lat": -6.38, "lng": 106.83}'::jsonb,
  now()
),
(
  'S4',
  CURRENT_DATE,
  '13:00',
  '14:30',
  'TPS',
  'Penalaran Kuantitatif',
  'Aljabar Dasar',
  'T2',
  'Siti Aminah',
  ARRAY['ST3', 'ST4'],
  '[{"id": "ST3", "name": "Kevin"}, {"id": "ST4", "name": "Budi"}]'::jsonb,
  'Tebet',
  'WAITING_APPROVAL',
  150000,
  NULL,
  NULL,
  NULL,
  now()
),
(
  'S5',
  '2026-06-21',
  '10:00',
  '11:30',
  'OSN',
  'Astronomi',
  'Hukum Kepler',
  'T2',
  'Siti Aminah',
  ARRAY['ST7'],
  '[{"id": "ST7", "name": "Eka"}]'::jsonb,
  'Tebet',
  'VALIDATED',
  150000,
  '{"materialTaught": "Hukum Kepler dan Orbit", "understandingLevel": "Sangat Baik", "studentActivity": "Sangat antusias bertanya"}'::jsonb,
  '{"time": "09:50", "lat": -6.2301, "lng": 106.8501}'::jsonb,
  '{"time": "11:35", "lat": -6.2301, "lng": 106.8501}'::jsonb,
  now()
)
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  program = EXCLUDED.program,
  subject = EXCLUDED.subject,
  topic = EXCLUDED.topic,
  teacher_id = EXCLUDED.teacher_id,
  teacher_name = EXCLUDED.teacher_name,
  student_ids = EXCLUDED.student_ids,
  students_data = EXCLUDED.students_data,
  branch = EXCLUDED.branch,
  status = EXCLUDED.status,
  honor_amount = EXCLUDED.honor_amount,
  report = EXCLUDED.report,
  check_in = EXCLUDED.check_in,
  check_out = EXCLUDED.check_out;

-- 7. Seed STUDENT_SESSION_REPORTS (demo attendance/progress/nilai data for
-- ST1 and ST2) — this table is normally only populated by
-- checkOutAndReport() at runtime, so a fresh seed otherwise leaves it
-- empty and the Demo Orang Tua (OTK) / Demo Siswa (KEnz) accounts below
-- would have nothing to browse. 'S3_ST2' mirrors the report already on
-- schedule S3 above; the rest are synthetic history (no matching row in
-- `schedules` needed — this table has no FK, same as the rest of this
-- schema). Score is only set on ELC/Privat rows to match the app's
-- "Nilai KBM" gate.
INSERT INTO public.student_session_reports (
  id, schedule_id, student_id, student_name, program, class_name, subject,
  topic, teacher_id, teacher_name, session_date, attendance, progress_note, score, created_at
) values
('S_DEMO_1_ST1', 'S_DEMO_1', 'ST1', 'Ahmad', 'ELC', '12-IPA-1', 'Matematika', 'Integral Tak Tentu', 'T1', 'Budi Santoso', '2026-06-18', 'Hadir', 'Ahmad aktif menjawab soal integral, pemahaman baik.', 88, now()),
('S_DEMO_2_ST1', 'S_DEMO_2', 'ST1', 'Ahmad', 'ELC', '12-IPA-1', 'Fisika', 'Gerak Lurus', 'T2', 'Siti Aminah', '2026-06-25', 'Hadir', 'Mengerjakan soal gerak lurus dengan baik, perlu latihan soal HOTS.', 82, now()),
('S_DEMO_3_ST1', 'S_DEMO_3', 'ST1', 'Ahmad', 'ELC', '12-IPA-1', 'Kimia', 'Stoikiometri', 'T1', 'Budi Santoso', '2026-07-02', 'Izin', 'Izin karena sakit ringan, materi susulan diberikan.', NULL, now()),
('S_DEMO_4_ST1', 'S_DEMO_4', 'ST1', 'Ahmad', 'ELC', '12-IPA-1', 'Matematika', 'Limit Fungsi', 'T1', 'Budi Santoso', '2026-07-08', 'Hadir', 'Peningkatan signifikan di topik limit fungsi.', 90, now()),
('S3_ST2', 'S3', 'ST2', 'Siti', 'Privat', '12-IPA-2', 'Fisika', 'Listrik Statis', 'T1', 'Budi Santoso', '2026-06-22', 'Hadir', 'Siti mulai paham konsep gaya tolak menolak, tapi butuh latihan soal lebih banyak.', 75, now()),
('S_DEMO_5_ST2', 'S_DEMO_5', 'ST2', 'Siti', 'Privat', '12-IPA-2', 'Matematika', 'Trigonometri', 'T1', 'Budi Santoso', '2026-06-29', 'Sakit', 'Sakit demam, sesi ditunda.', NULL, now()),
('S_DEMO_6_ST2', 'S_DEMO_6', 'ST2', 'Siti', 'Privat', '12-IPA-2', 'Fisika', 'Rangkaian Listrik', 'T1', 'Budi Santoso', '2026-07-06', 'Hadir', 'Sudah bisa menyelesaikan soal rangkaian listrik sederhana.', 85, now())
ON CONFLICT (id) DO UPDATE SET
  attendance = EXCLUDED.attendance,
  progress_note = EXCLUDED.progress_note,
  score = EXCLUDED.score;

-- 8. Link Demo Siswa (KEnz) & Demo Orang Tua (OTK) demo accounts (seeded by
-- supabase/seed_staff.sql — run that BEFORE this file) to demo students by
-- email lookup, since auth.users ids are Supabase-generated and not known
-- ahead of time. Written so it's a no-op (inserts/updates nothing) rather
-- than erroring if seed_staff.sql hasn't run yet.
UPDATE public.students
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'demo.kenz@konstanta.my.id')
WHERE id = 'ST1'
  AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo.kenz@konstanta.my.id');

INSERT INTO public.parent_student_links (id, parent_id, student_id, relationship, created_at)
SELECT u.id::text || '_' || v.sid, u.id, v.sid, 'Wali', now()
FROM auth.users u, (VALUES ('ST1'), ('ST2')) AS v(sid)
WHERE u.email = 'demo.otk@konstanta.my.id'
ON CONFLICT (parent_id, student_id) DO NOTHING;
