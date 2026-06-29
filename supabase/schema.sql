-- Schema for Konstanta Edu Presence Auth profiles & LMS tables

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'akademik', 'ketetap', 'kangguru', 'karyawan')),
  full_name TEXT NOT NULL,
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  teacher_id TEXT UNIQUE,
  teacher_type TEXT CHECK (teacher_type IN ('TETAP', 'FREELANCE')),
  base_salary NUMERIC DEFAULT 0,
  transport_allowance NUMERIC DEFAULT 0,
  other_allowance NUMERIC DEFAULT 0,
  bpjs_ketenagakerjaan NUMERIC DEFAULT 0,
  bpjs_kesehatan NUMERIC DEFAULT 0,
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
  report JSONB, -- lesson report details
  check_in JSONB, -- check in coordinate & time
  check_out JSONB, -- check out coordinate & time
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- 6. SYSTEM SETTINGS Table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Profiles policies
DROP POLICY IF EXISTS "Profiles are visible to owner and staff" ON public.profiles;
CREATE POLICY "Profiles are visible to owner and staff"
  ON public.profiles FOR SELECT
  USING (true); -- Make readable for simplicity in select fields/dashboards

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

-- Other tables: Allow all actions for authenticated users for mock simplicity
DROP POLICY IF EXISTS "Periods are manageable by staff" ON public.periods;
CREATE POLICY "Periods are manageable by staff" ON public.periods FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Students are manageable by staff" ON public.students;
CREATE POLICY "Students are manageable by staff" ON public.students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Programs are manageable by staff" ON public.programs;
CREATE POLICY "Programs are manageable by staff" ON public.programs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Schedules are manageable by staff" ON public.schedules;
CREATE POLICY "Schedules are manageable by staff" ON public.schedules FOR ALL USING (true) WITH CHECK (true);
