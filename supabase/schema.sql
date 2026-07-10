-- Schema for Konstanta Edu Presence Auth profiles & LMS tables

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'akademik', 'ketetap', 'kangguru', 'eval', 'karyawan', 'otk', 'kenz')),
  full_name TEXT NOT NULL,
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  teacher_id TEXT UNIQUE,
  teacher_type TEXT CHECK (teacher_type IN ('TETAP', 'FREELANCE')),
  base_salary NUMERIC DEFAULT 0,
  transport_allowance NUMERIC DEFAULT 0,
  other_allowance NUMERIC DEFAULT 0,
  bpjs_ketenagakerjaan NUMERIC DEFAULT 0,
  bpjs_kesehatan NUMERIC DEFAULT 0,
  -- Standard working hours for KETetap teachers, stored as "HH:MM" text (same
  -- convention as schedules.start_time/end_time). Used to auto-detect whether a
  -- KBM session falls inside or outside the teacher's normal work hours.
  work_start_time TEXT,
  work_end_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure columns exist in profiles if table was already created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS teacher_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS teacher_type TEXT CHECK (teacher_type IN ('TETAP', 'FREELANCE'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS base_salary NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS transport_allowance NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS other_allowance NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bpjs_ketenagakerjaan NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bpjs_kesehatan NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_start_time TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_end_time TEXT;

-- Widen the role check constraint for tables that already existed before
-- OTK/KEnz (CREATE TABLE IF NOT EXISTS above is a no-op against a live
-- database, so the inline CHECK edit alone would never take effect there).
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'akademik', 'ketetap', 'kangguru', 'eval', 'karyawan', 'otk', 'kenz'));

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. PERIODS Table
CREATE TABLE IF NOT EXISTS public.periods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;

-- 3. STUDENTS Table
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  program TEXT NOT NULL,
  class_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure class_name exists in students if table was already created
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS class_name TEXT;

-- Links a student row to a Supabase Auth user (KEnz login), 1:1.
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON public.students(auth_user_id);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 4. PROGRAMS Table
CREATE TABLE IF NOT EXISTS public.programs (
  name TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- 5. SCHEDULES Table
CREATE TABLE IF NOT EXISTS public.schedules (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  program TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  teacher_id TEXT NOT NULL, -- references profiles.teacher_id or profiles.id
  teacher_name TEXT NOT NULL,
  student_ids TEXT[], -- array of student IDs
  students_data JSONB, -- JSON representation of students [{id, name}]
  branch TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('DRAFT', 'WAITING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'WAITING_VERIFICATION', 'VERIFIED', 'WAITING_VALIDATION', 'VALIDATED', 'PAID')),
  honor_amount NUMERIC NOT NULL DEFAULT 0,
  -- For KETetap teachers only: WAJIB = inside normal work hours, no honor on
  -- top of base salary (0%); FULL = outside work hours, 100% honor; HALF =
  -- outside work hours, 50% honor. Always FULL for KangGuru (freelance), whose
  -- entire pay comes from honor_amount regardless of this field.
  honor_type TEXT NOT NULL DEFAULT 'FULL' CHECK (honor_type IN ('WAJIB', 'FULL', 'HALF')),
  -- Set by Akademik when scheduling; used by Admin to default KangGuru honor.
  class_mode TEXT NOT NULL DEFAULT 'OFFLINE' CHECK (class_mode IN ('ONLINE', 'OFFLINE')),
  report JSONB, -- lesson report details
  check_in JSONB, -- check in coordinate & time
  check_out JSONB, -- check out coordinate & time
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS honor_type TEXT NOT NULL DEFAULT 'FULL' CHECK (honor_type IN ('WAJIB', 'FULL', 'HALF'));
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS class_mode TEXT NOT NULL DEFAULT 'OFFLINE' CHECK (class_mode IN ('ONLINE', 'OFFLINE'));
-- Lets Akademik archive old/irrelevant jadwal out of the "Semua Jadwal" view
-- without deleting them (still needed for payroll/reporting history).
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_schedules_archived ON public.schedules(archived);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- 6. SYSTEM SETTINGS Table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 7. STUDENT_SESSION_REPORTS Table
-- Write-through derived index of schedules.report.studentProgresses[], one row
-- per (schedule_id, student_id), populated by checkOutAndReport. Lets us query
-- a student's attendance/progress history and attendance % without scanning
-- every schedule's report JSONB.
CREATE TABLE IF NOT EXISTS public.student_session_reports (
  id TEXT PRIMARY KEY, -- deterministic: `${schedule_id}_${student_id}`, doubles as upsert idempotency key
  schedule_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  program TEXT NOT NULL,
  class_name TEXT,
  subject TEXT NOT NULL,
  topic TEXT,
  teacher_id TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  attendance TEXT NOT NULL DEFAULT 'Hadir' CHECK (attendance IN ('Hadir', 'Izin', 'Sakit', 'Alpa')),
  progress_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ssr_student_date ON public.student_session_reports(student_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_ssr_schedule_id ON public.student_session_reports(schedule_id);

-- Nilai KBM numerik per sesi (Privat/ELC saja secara konsep; kolomnya
-- tetap nullable untuk semua baris/program).
ALTER TABLE public.student_session_reports ADD COLUMN IF NOT EXISTS score NUMERIC;

ALTER TABLE public.student_session_reports ENABLE ROW LEVEL SECURITY;

-- 8. PARENT_STUDENT_LINKS Table
-- Many-to-many: one parent (OTK) can have multiple children, one student
-- can have multiple guardians (KEnz's own login is separate — students.auth_user_id).
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id TEXT PRIMARY KEY, -- deterministic: `${parent_id}_${student_id}`
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relationship TEXT, -- optional: 'Ayah' / 'Ibu' / 'Wali'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_psl_parent ON public.parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_psl_student ON public.parent_student_links(student_id);
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;

-- 9. EVALUATION_ASSESSMENTS Table
-- Eval creates flexible assessments (Kuis/TO/Tugas/Lainnya), then submits
-- them for Akademik/Admin review before publishing to families and selected
-- teachers.
CREATE TABLE IF NOT EXISTS public.evaluation_assessments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('KUIS', 'TO', 'TUGAS', 'LAINNYA')),
  subject TEXT NOT NULL,
  program TEXT,
  class_name TEXT,
  assessment_date DATE NOT NULL,
  max_score NUMERIC,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'REJECTED', 'PUBLISHED')),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  review_note TEXT,
  published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_eval_assessments_status_date ON public.evaluation_assessments(status, assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_eval_assessments_created_by ON public.evaluation_assessments(created_by);
ALTER TABLE public.evaluation_assessments ENABLE ROW LEVEL SECURITY;

-- 10. EVALUATION_RESULTS Table
-- One row per student in an assessment. Scores are optional so qualitative-only
-- feedback stays supported.
CREATE TABLE IF NOT EXISTS public.evaluation_results (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES public.evaluation_assessments(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  score NUMERIC,
  qualitative_feedback TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_eval_results_student ON public.evaluation_results(student_id);
CREATE INDEX IF NOT EXISTS idx_eval_results_assessment ON public.evaluation_results(assessment_id);
ALTER TABLE public.evaluation_results ENABLE ROW LEVEL SECURITY;

-- 11. EVALUATION_TEACHER_RECIPIENTS Table
-- Eval manually chooses the teacher(s) who should receive a published
-- assessment's feedback.
CREATE TABLE IF NOT EXISTS public.evaluation_teacher_recipients (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES public.evaluation_assessments(id) ON DELETE CASCADE,
  teacher_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, teacher_profile_id)
);
CREATE INDEX IF NOT EXISTS idx_eval_teacher_recipients_teacher_profile ON public.evaluation_teacher_recipients(teacher_profile_id);
CREATE INDEX IF NOT EXISTS idx_eval_teacher_recipients_assessment ON public.evaluation_teacher_recipients(assessment_id);
ALTER TABLE public.evaluation_teacher_recipients ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Profiles policies
-- Previously USING(true) (any authenticated user could read every profile,
-- including every teacher's salary/BPJS/allowance fields). Tightened now
-- that OTK/KEnz logins exist: owner can always read their own row (needed
-- for the must_change_password check on login), staff can read all rows
-- (dashboards list teachers/staff), OTK/KEnz cannot browse other profiles.
DROP POLICY IF EXISTS "Profiles are visible to owner and staff" ON public.profiles;
CREATE POLICY "Profiles are visible to owner and staff"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan')
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  USING (
    -- Read the role from the JWT (set via raw_app_meta_data at login), not from
    -- public.profiles itself: querying profiles from within a profiles policy
    -- causes "infinite recursion detected in policy for relation profiles".
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Settings policies
DROP POLICY IF EXISTS "Settings are readable by authenticated users" ON public.settings;
CREATE POLICY "Settings are readable by authenticated users"
  ON public.settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Settings are manageable by admin" ON public.settings;
CREATE POLICY "Settings are manageable by admin"
  ON public.settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Other tables: staff (the 5 roles that existed before OTK/KEnz) get full
-- access; OTK/KEnz get narrow, scoped SELECT-only access below. Previously
-- these were blanket USING(true) for any authenticated user — that became
-- unsafe once non-staff (parent/student) logins exist, since every server
-- action in app/actions.ts relies on RLS alone for authorization on reads.
DROP POLICY IF EXISTS "Periods are manageable by staff" ON public.periods;
CREATE POLICY "Periods are manageable by staff" ON public.periods
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'));

DROP POLICY IF EXISTS "Students are manageable by staff" ON public.students;
CREATE POLICY "Students are manageable by staff" ON public.students
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'));

DROP POLICY IF EXISTS "Eval can view students" ON public.students;
CREATE POLICY "Eval can view students" ON public.students
  FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'eval');

DROP POLICY IF EXISTS "Parents can view their linked children" ON public.students;
CREATE POLICY "Parents can view their linked children" ON public.students
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.parent_student_links pl
    WHERE pl.student_id = students.id AND pl.parent_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Students can view their own record" ON public.students;
CREATE POLICY "Students can view their own record" ON public.students
  FOR SELECT
  USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Programs are manageable by staff" ON public.programs;
CREATE POLICY "Programs are manageable by staff" ON public.programs
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'));

DROP POLICY IF EXISTS "Eval can view programs" ON public.programs;
CREATE POLICY "Eval can view programs" ON public.programs
  FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'eval');

DROP POLICY IF EXISTS "Schedules are manageable by staff" ON public.schedules;
CREATE POLICY "Schedules are manageable by staff" ON public.schedules
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'));
-- No OTK/KEnz policy here: Phase 1 dashboards never query `schedules`
-- directly (only `student_session_reports`).

DROP POLICY IF EXISTS "Student session reports are manageable by staff" ON public.student_session_reports;
CREATE POLICY "Student session reports are manageable by staff" ON public.student_session_reports
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','ketetap','kangguru','karyawan'));

DROP POLICY IF EXISTS "Parents can view their children's session reports" ON public.student_session_reports;
CREATE POLICY "Parents can view their children's session reports" ON public.student_session_reports
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.parent_student_links pl
    WHERE pl.student_id = student_session_reports.student_id AND pl.parent_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Students can view their own session reports" ON public.student_session_reports;
CREATE POLICY "Students can view their own session reports" ON public.student_session_reports
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = student_session_reports.student_id AND s.auth_user_id = auth.uid()
  ));

-- parent_student_links: staff (admin/akademik only — they're the ones who
-- manage student data) manage all rows; a parent may read only their own.
DROP POLICY IF EXISTS "Parent links manageable by staff" ON public.parent_student_links;
CREATE POLICY "Parent links manageable by staff" ON public.parent_student_links
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik'));

DROP POLICY IF EXISTS "Parents can view their own links" ON public.parent_student_links;
CREATE POLICY "Parents can view their own links" ON public.parent_student_links
  FOR SELECT
  USING (parent_id = auth.uid());

-- Evaluation policies
DROP POLICY IF EXISTS "Evaluation assessments visible by role scope" ON public.evaluation_assessments;
CREATE POLICY "Evaluation assessments visible by role scope"
  ON public.evaluation_assessments FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','eval')
    OR (
      status = 'PUBLISHED'
      AND EXISTS (
        SELECT 1 FROM public.evaluation_results er
        JOIN public.parent_student_links pl ON pl.student_id = er.student_id
        WHERE er.assessment_id = evaluation_assessments.id
          AND pl.parent_id = auth.uid()
      )
    )
    OR (
      status = 'PUBLISHED'
      AND EXISTS (
        SELECT 1 FROM public.evaluation_results er
        JOIN public.students s ON s.id = er.student_id
        WHERE er.assessment_id = evaluation_assessments.id
          AND s.auth_user_id = auth.uid()
      )
    )
    OR (
      status = 'PUBLISHED'
      AND EXISTS (
        SELECT 1 FROM public.evaluation_teacher_recipients tr
        WHERE tr.assessment_id = evaluation_assessments.id
          AND tr.teacher_profile_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Eval can create assessments" ON public.evaluation_assessments;
CREATE POLICY "Eval can create assessments"
  ON public.evaluation_assessments FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'eval'
    AND created_by = auth.uid()
    AND status IN ('DRAFT','SUBMITTED')
  );

DROP POLICY IF EXISTS "Eval can update own editable assessments" ON public.evaluation_assessments;
CREATE POLICY "Eval can update own editable assessments"
  ON public.evaluation_assessments FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'eval'
    AND created_by = auth.uid()
    AND status IN ('DRAFT','REJECTED')
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'eval'
    AND created_by = auth.uid()
    AND status IN ('DRAFT','SUBMITTED','REJECTED')
  );

DROP POLICY IF EXISTS "Admin academic can review assessments" ON public.evaluation_assessments;
CREATE POLICY "Admin academic can review assessments"
  ON public.evaluation_assessments FOR UPDATE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik'));

DROP POLICY IF EXISTS "Evaluation results visible by role scope" ON public.evaluation_results;
CREATE POLICY "Evaluation results visible by role scope"
  ON public.evaluation_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.evaluation_assessments ea
      WHERE ea.id = evaluation_results.assessment_id
        AND (
          (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','eval')
          OR (
            ea.status = 'PUBLISHED'
            AND EXISTS (
              SELECT 1 FROM public.parent_student_links pl
              WHERE pl.student_id = evaluation_results.student_id
                AND pl.parent_id = auth.uid()
            )
          )
          OR (
            ea.status = 'PUBLISHED'
            AND EXISTS (
              SELECT 1 FROM public.students s
              WHERE s.id = evaluation_results.student_id
                AND s.auth_user_id = auth.uid()
            )
          )
          OR (
            ea.status = 'PUBLISHED'
            AND EXISTS (
              SELECT 1 FROM public.evaluation_teacher_recipients tr
              WHERE tr.assessment_id = ea.id
                AND tr.teacher_profile_id = auth.uid()
            )
          )
        )
    )
  );

DROP POLICY IF EXISTS "Eval can manage results for own editable assessments" ON public.evaluation_results;
CREATE POLICY "Eval can manage results for own editable assessments"
  ON public.evaluation_results FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.evaluation_assessments ea
    WHERE ea.id = evaluation_results.assessment_id
      AND ea.created_by = auth.uid()
      AND ea.status IN ('DRAFT','REJECTED')
      AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'eval'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.evaluation_assessments ea
    WHERE ea.id = evaluation_results.assessment_id
      AND ea.created_by = auth.uid()
      AND ea.status IN ('DRAFT','REJECTED')
      AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'eval'
  ));

DROP POLICY IF EXISTS "Evaluation teacher recipients visible by role scope" ON public.evaluation_teacher_recipients;
CREATE POLICY "Evaluation teacher recipients visible by role scope"
  ON public.evaluation_teacher_recipients FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','akademik','eval')
    OR (
      teacher_profile_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.evaluation_assessments ea
        WHERE ea.id = evaluation_teacher_recipients.assessment_id
          AND ea.status = 'PUBLISHED'
      )
    )
  );

DROP POLICY IF EXISTS "Eval can manage teacher recipients for own editable assessments" ON public.evaluation_teacher_recipients;
CREATE POLICY "Eval can manage teacher recipients for own editable assessments"
  ON public.evaluation_teacher_recipients FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.evaluation_assessments ea
    WHERE ea.id = evaluation_teacher_recipients.assessment_id
      AND ea.created_by = auth.uid()
      AND ea.status IN ('DRAFT','REJECTED')
      AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'eval'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.evaluation_assessments ea
    WHERE ea.id = evaluation_teacher_recipients.assessment_id
      AND ea.created_by = auth.uid()
      AND ea.status IN ('DRAFT','REJECTED')
      AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'eval'
  ));
