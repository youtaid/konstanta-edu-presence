import type { User } from "./types";

// Single source of truth for turning a public.profiles row into a User.
// Used by both getUsers() (server) and the login flow (client) so the
// teacherId/payroll fields a teacher sees about themselves always match what
// Akademik/Admin see when assigning them to a schedule.
export function mapProfileToUser(profile: any, email = ""): User {
  let roleMapped: User["role"] = "KARYAWAN";
  if (profile.role === "admin") roleMapped = "ADMIN";
  else if (profile.role === "akademik") roleMapped = "ACADEMIC";
  else if (profile.role === "ketetap" || profile.role === "kangguru") roleMapped = "TEACHER";
  else if (profile.role === "eval") roleMapped = "EVAL";
  else if (profile.role === "otk") roleMapped = "OTK";
  else if (profile.role === "kenz") roleMapped = "KENZ";

  // Staff seeded via SQL only ever get `role` set, not `teacher_type` — fall
  // back to deriving it from role so seeded KETetap/KangGuru are still
  // classified correctly (e.g. show up in payroll, can have jam kerja set).
  const teacherType =
    profile.teacher_type ||
    (profile.role === "ketetap" ? "TETAP" : profile.role === "kangguru" ? "FREELANCE" : undefined);

  const user: User = {
    id: profile.id,
    name: profile.full_name,
    email,
    role: roleMapped,
    // Fall back to the profile's own id when no separate teacher_id text was
    // assigned (e.g. seeded staff) so every teacher always has a stable,
    // unique identifier that matches what schedules.teacher_id stores.
    teacherId: profile.teacher_id || profile.id,
    teacherType,
  };

  if (teacherType === "TETAP") {
    user.baseSalary = Number(profile.base_salary || 0);
    user.transportAllowance = Number(profile.transport_allowance || 0);
    user.otherAllowance = Number(profile.other_allowance || 0);
    user.bpjsKetenagakerjaan = Number(profile.bpjs_ketenagakerjaan || 0);
    user.bpjsKesehatan = Number(profile.bpjs_kesehatan || 0);
    user.workStartTime = profile.work_start_time || undefined;
    user.workEndTime = profile.work_end_time || undefined;
  }

  return user;
}
