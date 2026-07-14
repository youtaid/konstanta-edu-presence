"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import {
  Schedule,
  ScheduleStatus,
  User,
  Student,
  Period,
  StudentSessionReport,
  ParentLink,
  EvaluationAssessment,
  EvaluationResult,
  EvaluationStatus,
  EvaluationType,
} from "@/lib/types";
import { mapProfileToUser } from "@/lib/profile-mapper";
import { revalidatePath } from "next/cache";

async function getSupabase() {
  const cookieStore = await cookies();
  return createSupabaseClient(cookieStore);
}

function generateInitialPassword() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `Konstanta${digits}`;
}

// Guards the OTK/KEnz account-management actions below, which use the
// admin/service-role client and so bypass RLS entirely — RLS tightening
// alone does not protect them. Without this, any authenticated user
// (including a freshly created OTK/KEnz account) could call these actions
// directly and link themselves to arbitrary students.
async function requireStaffCaller(allowed: string[] = ["admin", "akademik"]) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const role = (user?.app_metadata as any)?.role;
  if (!user || !allowed.includes(role)) {
    throw new Error("Anda tidak memiliki akses untuk aksi ini.");
  }
}

async function requireRoleCaller(allowed: string[]) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const role = (user?.app_metadata as any)?.role;
  if (!user || !allowed.includes(role)) {
    throw new Error("Anda tidak memiliki akses untuk aksi ini.");
  }
  return { user, role };
}

// Independent TS port of scripts/generate-staff.js's cleanNameForEmail —
// that script is a standalone CJS tool outside the Next build, same
// duplication pattern already used for the role-mapping logic.
function cleanNameForEmail(name: string): string {
  let clean = name.replace(/\s*\([^)]*\)\s*/g, "").trim().replace(/\s+/g, " ");
  clean = clean.replace(/[^a-zA-Z0-9\s.]/g, "");
  return clean.toLowerCase().split(" ").filter(Boolean).join(".");
}

// Tries `local@konstanta.my.id`, then `local2@...`, `local3@...` etc. on
// collision — OTK/KEnz emails are always auto-generated (unlike
// createTeacher, where Akademik types the email by hand), so collisions
// are likely (siblings, common first names).
async function createAuthUserWithUniqueEmail(
  admin: ReturnType<typeof createAdminClient>,
  baseName: string,
  password: string,
  appMetadata: Record<string, unknown>,
  userMetadata: Record<string, unknown>,
) {
  const local = cleanNameForEmail(baseName);
  const domain = "konstanta.my.id";
  for (let attempt = 0; attempt < 20; attempt++) {
    const email = attempt === 0 ? `${local}@${domain}` : `${local}${attempt + 1}@${domain}`;
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: appMetadata,
      user_metadata: userMetadata,
    });
    if (!error) return { email, user: data.user! };
    if (!/already registered|already exists|email_exists/i.test(error.message)) {
      throw new Error(error.message);
    }
  }
  throw new Error("Gagal membuat email unik setelah 20 percobaan.");
}

export async function getUsers() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name", { ascending: true });
  
  if (!data) return [];

  // email not saved on profiles for privacy, or fetched via auth later
  return data.map((profile: any) => mapProfileToUser(profile, ""));
}

export async function getTeachersForEvaluation(): Promise<User[]> {
  await requireRoleCaller(["eval", "admin", "akademik"]);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, role, full_name, teacher_id, teacher_type")
    .in("role", ["ketetap", "kangguru"])
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map((profile: any) => mapProfileToUser(profile, ""));
}

export async function getSchedules() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("schedules")
    .select("*")
    .order("date", { ascending: false });

  if (!data) return [];

  return data.map((s: any) => ({
    id: s.id,
    date: s.date,
    startTime: s.start_time,
    endTime: s.end_time,
    program: s.program,
    subject: s.subject,
    topic: s.topic,
    teacherId: s.teacher_id,
    teacherName: s.teacher_name,
    studentIds: s.student_ids || [],
    students: s.students_data || [],
    branch: s.branch,
    status: s.status as ScheduleStatus,
    honorAmount: Number(s.honor_amount || 0),
    honorType: (s.honor_type || "FULL") as Schedule["honorType"],
    classMode: (s.class_mode || "OFFLINE") as Schedule["classMode"],
    archived: s.archived || false,
    report: s.report || undefined,
    checkIn: s.check_in || undefined,
    checkOut: s.check_out || undefined,
  }));
}

export async function getPeriods() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("periods")
    .select("*")
    .order("start_date", { ascending: false });

  if (!data) return [];

  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    startDate: p.start_date,
    endDate: p.end_date,
  }));
}

export async function getActivePeriod() {
  const supabase = await getSupabase();
  const { data: activeSetting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "activePeriodId")
    .single();

  if (activeSetting?.value) {
    const { data: period } = await supabase
      .from("periods")
      .select("*")
      .eq("id", activeSetting.value)
      .single();

    if (period) {
      return {
        id: period.id,
        name: period.name,
        startDate: period.start_date,
        endDate: period.end_date,
      };
    }
  }

  const periods = await getPeriods();
  return periods[0] || { id: "", name: "", startDate: "", endDate: "" };
}

export async function setActivePeriod(id: string) {
  const supabase = await getSupabase();
  await supabase
    .from("settings")
    .upsert({ key: "activePeriodId", value: id, updated_at: new Date().toISOString() });
  revalidatePath("/");
}

export async function getStudents() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("students")
    .select("*")
    .order("name", { ascending: true });

  if (!data) return [];

  return data.map((s: any) => ({
    id: s.id,
    name: s.name,
    program: s.program,
    className: s.class_name || undefined,
    hasAccount: !!s.auth_user_id,
  }));
}

export async function getStudentSessionReports(
  studentId: string,
): Promise<StudentSessionReport[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("student_session_reports")
    .select("*")
    .eq("student_id", studentId)
    .order("session_date", { ascending: false });

  if (!data) return [];

  return data.map((r: any) => ({
    id: r.id,
    scheduleId: r.schedule_id,
    studentId: r.student_id,
    studentName: r.student_name,
    program: r.program,
    className: r.class_name || undefined,
    subject: r.subject,
    topic: r.topic || undefined,
    teacherId: r.teacher_id,
    teacherName: r.teacher_name,
    sessionDate: r.session_date,
    attendance: r.attendance,
    progressNote: r.progress_note || "",
    score: r.score === null || r.score === undefined ? undefined : Number(r.score),
    createdAt: r.created_at,
  }));
}

function mapEvaluationAssessment(row: any): EvaluationAssessment {
  const rawResults = row.evaluation_results || [];
  const rawRecipients = row.evaluation_teacher_recipients || [];

  return {
    id: row.id,
    title: row.title,
    assessmentType: row.assessment_type as EvaluationType,
    subject: row.subject,
    program: row.program || undefined,
    className: row.class_name || undefined,
    assessmentDate: row.assessment_date,
    maxScore: row.max_score === null || row.max_score === undefined ? undefined : Number(row.max_score),
    description: row.description || undefined,
    status: row.status as EvaluationStatus,
    createdBy: row.created_by,
    createdByName: row.profiles?.full_name || undefined,
    reviewNote: row.review_note || undefined,
    publishedBy: row.published_by || undefined,
    publishedAt: row.published_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    results: rawResults.map((r: any): EvaluationResult => ({
      id: r.id,
      assessmentId: r.assessment_id,
      studentId: r.student_id,
      studentName: r.students?.name || r.student_name || undefined,
      score: r.score === null || r.score === undefined ? undefined : Number(r.score),
      qualitativeFeedback: r.qualitative_feedback || "",
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
    teacherRecipients: rawRecipients.map((r: any) => ({
      id: r.id,
      assessmentId: r.assessment_id,
      teacherProfileId: r.teacher_profile_id,
      teacherId: r.teacher_id,
      teacherName: r.teacher_name,
      createdAt: r.created_at,
    })),
  };
}

async function assertEditableEvaluation(
  admin: ReturnType<typeof createAdminClient>,
  assessmentId: string,
  userId: string,
) {
  const { data, error } = await admin
    .from("evaluation_assessments")
    .select("id, created_by, status")
    .eq("id", assessmentId)
    .single();

  if (error || !data) throw new Error("Asesmen evaluasi tidak ditemukan.");
  if (data.created_by !== userId || !["DRAFT", "REJECTED"].includes(data.status)) {
    throw new Error("Asesmen ini tidak bisa diedit.");
  }
}

export async function getEvaluationAssessments(): Promise<EvaluationAssessment[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("evaluation_assessments")
    .select(`
      *,
      evaluation_results(*, students(name)),
      evaluation_teacher_recipients(*)
    `)
    .order("assessment_date", { ascending: false });

  return (data || []).map(mapEvaluationAssessment);
}

export async function getEvaluationResultsForStudent(
  studentId: string,
): Promise<EvaluationAssessment[]> {
  const supabase = await getSupabase();
  const { data: results } = await supabase
    .from("evaluation_results")
    .select("assessment_id")
    .eq("student_id", studentId);

  const assessmentIds = Array.from(new Set((results || []).map((r: any) => r.assessment_id)));
  if (assessmentIds.length === 0) return [];

  const { data } = await supabase
    .from("evaluation_assessments")
    .select(`
      *,
      evaluation_results(*, students(name)),
      evaluation_teacher_recipients(*)
    `)
    .in("id", assessmentIds)
    .eq("status", "PUBLISHED")
    .order("assessment_date", { ascending: false });

  return (data || [])
    .map(mapEvaluationAssessment)
    .map((assessment) => ({
      ...assessment,
      results: assessment.results.filter((r) => r.studentId === studentId),
    }))
    .filter((assessment) => assessment.results.length > 0);
}

export async function getEvaluationAssessmentsForTeacher(): Promise<EvaluationAssessment[]> {
  const { user } = await requireRoleCaller(["ketetap", "kangguru"]);
  const supabase = await getSupabase();

  const { data: recipients } = await supabase
    .from("evaluation_teacher_recipients")
    .select("assessment_id")
    .eq("teacher_profile_id", user.id);

  const assessmentIds = Array.from(new Set((recipients || []).map((r: any) => r.assessment_id)));
  if (assessmentIds.length === 0) return [];

  const { data } = await supabase
    .from("evaluation_assessments")
    .select(`
      *,
      evaluation_results(*, students(name)),
      evaluation_teacher_recipients(*)
    `)
    .in("id", assessmentIds)
    .eq("status", "PUBLISHED")
    .order("assessment_date", { ascending: false });

  return (data || []).map(mapEvaluationAssessment);
}

export async function createEvaluationAssessment(data: {
  title: string;
  assessmentType: EvaluationType;
  subject: string;
  program?: string;
  className?: string;
  assessmentDate: string;
  maxScore?: number | null;
  description?: string;
}) {
  const { user } = await requireRoleCaller(["eval"]);
  const admin = createAdminClient();
  const id = `EV${Date.now()}`;
  const { error } = await admin.from("evaluation_assessments").insert({
    id,
    title: data.title,
    assessment_type: data.assessmentType,
    subject: data.subject,
    program: data.program || null,
    class_name: data.className || null,
    assessment_date: data.assessmentDate,
    max_score: data.maxScore ?? null,
    description: data.description || null,
    status: "DRAFT",
    created_by: user.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  return id;
}

export async function updateEvaluationAssessment(
  id: string,
  data: Partial<{
    title: string;
    assessmentType: EvaluationType;
    subject: string;
    program: string;
    className: string;
    assessmentDate: string;
    maxScore: number | null;
    description: string;
  }>,
) {
  const { user } = await requireRoleCaller(["eval"]);
  const admin = createAdminClient();
  await assertEditableEvaluation(admin, id, user.id);

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (data.title !== undefined) updateData.title = data.title;
  if (data.assessmentType !== undefined) updateData.assessment_type = data.assessmentType;
  if (data.subject !== undefined) updateData.subject = data.subject;
  if (data.program !== undefined) updateData.program = data.program || null;
  if (data.className !== undefined) updateData.class_name = data.className || null;
  if (data.assessmentDate !== undefined) updateData.assessment_date = data.assessmentDate;
  if (data.maxScore !== undefined) updateData.max_score = data.maxScore;
  if (data.description !== undefined) updateData.description = data.description || null;

  const { error } = await admin.from("evaluation_assessments").update(updateData).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function upsertEvaluationResultsBulk(
  assessmentId: string,
  results: { studentId: string; score?: number | null; qualitativeFeedback: string }[],
) {
  const { user } = await requireRoleCaller(["eval"]);
  const admin = createAdminClient();
  await assertEditableEvaluation(admin, assessmentId, user.id);

  const now = new Date().toISOString();
  const rows = results
    .filter((r) => r.studentId && (r.score !== null && r.score !== undefined || r.qualitativeFeedback.trim()))
    .map((r) => ({
      id: `${assessmentId}_${r.studentId}`,
      assessment_id: assessmentId,
      student_id: r.studentId,
      score: r.score ?? null,
      qualitative_feedback: r.qualitativeFeedback.trim(),
      updated_at: now,
    }));

  const { data: existing } = await admin
    .from("evaluation_results")
    .select("student_id")
    .eq("assessment_id", assessmentId);
  const keepIds = new Set(rows.map((r) => r.student_id));
  const deleteIds = (existing || []).map((r: any) => r.student_id).filter((studentId: string) => !keepIds.has(studentId));

  if (deleteIds.length > 0) {
    const { error: deleteError } = await admin
      .from("evaluation_results")
      .delete()
      .eq("assessment_id", assessmentId)
      .in("student_id", deleteIds);
    if (deleteError) throw new Error(deleteError.message);
  }

  if (rows.length > 0) {
    const { error } = await admin
      .from("evaluation_results")
      .upsert(rows, { onConflict: "id" });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function setEvaluationTeacherRecipients(
  assessmentId: string,
  teachers: { profileId: string; teacherId: string; teacherName: string }[],
) {
  const { user } = await requireRoleCaller(["eval"]);
  const admin = createAdminClient();
  await assertEditableEvaluation(admin, assessmentId, user.id);

  const { error: deleteError } = await admin
    .from("evaluation_teacher_recipients")
    .delete()
    .eq("assessment_id", assessmentId);
  if (deleteError) throw new Error(deleteError.message);

  const rows = teachers.map((t) => ({
    id: `${assessmentId}_${t.profileId}`,
    assessment_id: assessmentId,
    teacher_profile_id: t.profileId,
    teacher_id: t.teacherId,
    teacher_name: t.teacherName,
  }));

  if (rows.length > 0) {
    const { error } = await admin.from("evaluation_teacher_recipients").insert(rows);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function submitEvaluationAssessment(id: string) {
  const { user } = await requireRoleCaller(["eval"]);
  const admin = createAdminClient();
  await assertEditableEvaluation(admin, id, user.id);

  const { error } = await admin
    .from("evaluation_assessments")
    .update({ status: "SUBMITTED", review_note: null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function publishEvaluationAssessment(id: string) {
  const { user } = await requireRoleCaller(["admin", "akademik"]);
  const admin = createAdminClient();
  const { error } = await admin
    .from("evaluation_assessments")
    .update({
      status: "PUBLISHED",
      published_by: user.id,
      published_at: new Date().toISOString(),
      review_note: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "SUBMITTED");
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function rejectEvaluationAssessment(id: string, note: string) {
  await requireRoleCaller(["admin", "akademik"]);
  if (!note.trim()) throw new Error("Catatan reject wajib diisi.");
  const admin = createAdminClient();
  const { error } = await admin
    .from("evaluation_assessments")
    .update({
      status: "REJECTED",
      review_note: note.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "SUBMITTED");
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function getPrograms() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("programs")
    .select("name");

  if (!data || data.length === 0) {
    return ['ELC', 'TPS', 'OSN', 'PM', 'Privat', 'TKA'];
  }
  return data.map((p: any) => p.name);
}

export async function createStudent(data: Omit<Student, "id">) {
  const supabase = await getSupabase();
  const id = `ST${Date.now()}`;
  await supabase
    .from("students")
    .insert({
      id,
      name: data.name,
      program: data.program,
      class_name: data.className || null
    });
  revalidatePath("/");
}

export async function updateStudent(id: string, data: Partial<Student>) {
  const supabase = await getSupabase();
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.program) updateData.program = data.program;
  if (data.className !== undefined) updateData.class_name = data.className || null;

  await supabase
    .from("students")
    .update(updateData)
    .eq("id", id);
  revalidatePath("/");
}

export async function deleteStudent(id: string) {
  const supabase = await getSupabase();
  await supabase
    .from("students")
    .delete()
    .eq("id", id);
  revalidatePath("/");
}

export async function createPeriod(data: Omit<Period, "id">) {
  const supabase = await getSupabase();
  const id = `P${Date.now()}`;
  await supabase
    .from("periods")
    .insert({
      id,
      name: data.name,
      start_date: data.startDate,
      end_date: data.endDate
    });
  revalidatePath("/");
}

export async function updatePeriod(id: string, data: Partial<Period>) {
  const supabase = await getSupabase();
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.startDate) updateData.start_date = data.startDate;
  if (data.endDate) updateData.end_date = data.endDate;

  await supabase
    .from("periods")
    .update(updateData)
    .eq("id", id);
  revalidatePath("/");
}

export async function deletePeriod(id: string) {
  const supabase = await getSupabase();
  await supabase
    .from("periods")
    .delete()
    .eq("id", id);
  revalidatePath("/");
}

// Creates a real Supabase Auth login (email + initial password) for a
// KangGuru (FREELANCE) or KETetap (TETAP) teacher, plus their payroll
// profile row. Returns the generated password so the caller can hand it
// to the new teacher; it cannot be retrieved again afterwards.
export async function createTeacher(data: Partial<User>) {
  await requireStaffCaller();
  if (!data.email) {
    throw new Error("Email wajib diisi untuk membuat akun login guru.");
  }

  const admin = createAdminClient();
  const role = data.teacherType === "TETAP" ? "ketetap" : "kangguru";
  const password = generateInitialPassword();
  const teacherId = `T${Date.now()}`;

  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email: data.email,
    password,
    email_confirm: true,
    app_metadata: {
      provider: "email",
      providers: ["email"],
      role,
      roles: [role],
    },
    user_metadata: { full_name: data.name || "" },
  });

  if (authError || !created.user) {
    throw new Error(authError?.message || "Gagal membuat akun login guru.");
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    role,
    full_name: data.name || "",
    must_change_password: true,
    teacher_id: teacherId,
    teacher_type: data.teacherType || "FREELANCE",
    base_salary: data.baseSalary || 0,
    transport_allowance: data.transportAllowance || 0,
    other_allowance: data.otherAllowance || 0,
    bpjs_ketenagakerjaan: data.bpjsKetenagakerjaan || 0,
    bpjs_kesehatan: data.bpjsKesehatan || 0,
    work_start_time: data.workStartTime || null,
    work_end_time: data.workEndTime || null,
  });

  if (profileError) {
    // Don't leave an orphaned login with no profile behind.
    await admin.auth.admin.deleteUser(created.user.id);
    throw new Error(profileError.message);
  }

  revalidatePath("/");
  return { email: data.email, password };
}

export async function updateTeacher(id: string, data: Partial<User>) {
  await requireStaffCaller();
  const admin = createAdminClient();
  const updateData: any = {};
  if (data.name) updateData.full_name = data.name;
  let role: string | undefined;
  if (data.teacherType) {
    updateData.teacher_type = data.teacherType;
    role = data.teacherType === "TETAP" ? "ketetap" : "kangguru";
    updateData.role = role;
  }
  if (data.baseSalary !== undefined) updateData.base_salary = data.baseSalary;
  if (data.transportAllowance !== undefined) updateData.transport_allowance = data.transportAllowance;
  if (data.otherAllowance !== undefined) updateData.other_allowance = data.otherAllowance;
  if (data.bpjsKetenagakerjaan !== undefined) updateData.bpjs_ketenagakerjaan = data.bpjsKetenagakerjaan;
  if (data.bpjsKesehatan !== undefined) updateData.bpjs_kesehatan = data.bpjsKesehatan;
  if (data.workStartTime !== undefined) updateData.work_start_time = data.workStartTime || null;
  if (data.workEndTime !== undefined) updateData.work_end_time = data.workEndTime || null;

  const { error: profileError } = await admin
    .from("profiles")
    .update(updateData)
    .eq("id", id);
  if (profileError) throw new Error(profileError.message);

  const authUpdate: Record<string, unknown> = {};
  if (data.email) authUpdate.email = data.email;
  if (data.name) authUpdate.user_metadata = { full_name: data.name };
  if (role) {
    authUpdate.app_metadata = {
      provider: "email",
      providers: ["email"],
      role,
      roles: [role],
    };
  }
  if (Object.keys(authUpdate).length > 0) {
    const { error: authError } = await admin.auth.admin.updateUserById(id, authUpdate);
    if (authError) throw new Error(authError.message);
  }

  revalidatePath("/");
}

export async function deleteTeacher(id: string) {
  await requireStaffCaller();
  const admin = createAdminClient();
  await admin.from("profiles").delete().eq("id", id);
  await admin.auth.admin.deleteUser(id);
  revalidatePath("/");
}

export async function createEvalAccount(data: { name: string; email: string }) {
  await requireStaffCaller(["admin"]);
  if (!data.name || !data.email) {
    throw new Error("Nama dan email Eval wajib diisi.");
  }

  const admin = createAdminClient();
  const password = generateInitialPassword();

  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email: data.email,
    password,
    email_confirm: true,
    app_metadata: {
      provider: "email",
      providers: ["email"],
      role: "eval",
      roles: ["eval"],
    },
    user_metadata: { full_name: data.name },
  });

  if (authError || !created.user) {
    throw new Error(authError?.message || "Gagal membuat akun Eval.");
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    role: "eval",
    full_name: data.name,
    must_change_password: true,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    throw new Error(profileError.message);
  }

  revalidatePath("/");
  return { email: data.email, password };
}

// Creates a KEnz (student) login for an existing students row.
export async function createStudentAccount(studentId: string): Promise<{ email?: string; password?: string; error?: string }> {
  try {
    await requireStaffCaller();
    const admin = createAdminClient();
    const { data: student, error: studentErr } = await admin
      .from("students").select("*").eq("id", studentId).single();
    if (studentErr || !student) throw new Error("Siswa tidak ditemukan.");
    if (student.auth_user_id) throw new Error("Siswa ini sudah memiliki akun login.");

    const password = generateInitialPassword();
    const { email, user } = await createAuthUserWithUniqueEmail(
      admin, student.name, password,
      { provider: "email", providers: ["email"], role: "kenz", roles: ["kenz"] },
      { full_name: student.name },
    );

    const { error: profileError } = await admin.from("profiles").insert({
      id: user.id, role: "kenz", full_name: student.name, must_change_password: true,
    });
    if (profileError) {
      await admin.auth.admin.deleteUser(user.id);
      throw new Error(profileError.message);
    }

    const { error: linkError } = await admin.from("students")
      .update({ auth_user_id: user.id }).eq("id", studentId);
    if (linkError) {
      await admin.from("profiles").delete().eq("id", user.id);
      await admin.auth.admin.deleteUser(user.id);
      throw new Error(linkError.message);
    }

    revalidatePath("/");
    return { email, password };
  } catch (err: any) {
    console.error("Error in createStudentAccount:", err);
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

// Creates a new OTK (parent) login and links it to one or more students.
export async function createParentAccount(data: { name: string; studentIds: string[] }): Promise<{ email?: string; password?: string; error?: string }> {
  try {
    await requireStaffCaller();
    if (!data.name) throw new Error("Nama orang tua wajib diisi.");
    if (!data.studentIds?.length) throw new Error("Pilih minimal satu siswa untuk dihubungkan.");

    const admin = createAdminClient();
    const password = generateInitialPassword();
    const { email, user } = await createAuthUserWithUniqueEmail(
      admin, data.name, password,
      { provider: "email", providers: ["email"], role: "otk", roles: ["otk"] },
      { full_name: data.name },
    );

    const { error: profileError } = await admin.from("profiles").insert({
      id: user.id, role: "otk", full_name: data.name, must_change_password: true,
    });
    if (profileError) {
      await admin.auth.admin.deleteUser(user.id);
      throw new Error(profileError.message);
    }

    const { error: linkError } = await admin.from("parent_student_links").insert(
      data.studentIds.map((sid) => ({ id: `${user.id}_${sid}`, parent_id: user.id, student_id: sid })),
    );
    if (linkError) {
      await admin.from("profiles").delete().eq("id", user.id);
      await admin.auth.admin.deleteUser(user.id);
      throw new Error(linkError.message);
    }

    revalidatePath("/");
    return { email, password };
  } catch (err: any) {
    console.error("Error in createParentAccount:", err);
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

// Links an already-existing OTK account to another child (second sibling case).
export async function linkParentToStudent(parentId: string, studentId: string, relationship?: string) {
  await requireStaffCaller();
  const admin = createAdminClient();
  const { error } = await admin.from("parent_student_links").insert({
    id: `${parentId}_${studentId}`, parent_id: parentId, student_id: studentId, relationship: relationship || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function unlinkParentFromStudent(parentId: string, studentId: string) {
  await requireStaffCaller();
  const admin = createAdminClient();
  await admin.from("parent_student_links").delete().eq("parent_id", parentId).eq("student_id", studentId);
  revalidatePath("/");
}

// For the "link an existing parent" picker in the Data Siswa tab.
export async function getParentAccounts(): Promise<{ id: string; name: string }[]> {
  const supabase = await getSupabase();
  const { data } = await supabase.from("profiles").select("id, full_name").eq("role", "otk").order("full_name");
  return (data || []).map((p: any) => ({ id: p.id, name: p.full_name }));
}

export async function getParentLinksForStudent(studentId: string): Promise<ParentLink[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("parent_student_links")
    .select("id, parent_id, student_id, relationship, profiles(full_name)")
    .eq("student_id", studentId);
  return (data || []).map((r: any) => ({
    id: r.id, parentId: r.parent_id, studentId: r.student_id,
    parentName: r.profiles?.full_name || "", relationship: r.relationship || undefined,
  }));
}

export async function deleteStudentAccount(studentId: string) {
  await requireStaffCaller();
  const admin = createAdminClient();
  const { data: student } = await admin.from("students").select("auth_user_id").eq("id", studentId).single();
  if (student?.auth_user_id) {
    await admin.from("profiles").delete().eq("id", student.auth_user_id);
    await admin.auth.admin.deleteUser(student.auth_user_id);
  }
  revalidatePath("/");
}

export async function deleteParentAccount(parentId: string) {
  await requireStaffCaller();
  const admin = createAdminClient();
  await admin.from("parent_student_links").delete().eq("parent_id", parentId);
  await admin.from("profiles").delete().eq("id", parentId);
  await admin.auth.admin.deleteUser(parentId);
  revalidatePath("/");
}

export async function payTeacherSchedules(
  teacherId: string,
  startDate: string,
  endDate: string,
) {
  await requireRoleCaller(["admin"]);
  const supabase = await getSupabase();
  await supabase
    .from("schedules")
    .update({ status: "PAID" })
    .eq("teacher_id", teacherId)
    .eq("status", "VALIDATED")
    .gte("date", startDate)
    .lte("date", endDate);
  revalidatePath("/");
}

export async function setSchedulesArchived(ids: string[], archived: boolean) {
  if (ids.length === 0) return;
  await requireStaffCaller();
  const admin = createAdminClient();
  const { error } = await admin
    .from("schedules")
    .update({ archived })
    .in("id", ids);
  if (error) throw new Error(`Gagal mengarsipkan jadwal: ${error.message}`);
  revalidatePath("/");
}

export async function deleteSchedule(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    await requireStaffCaller();
    const admin = createAdminClient();
    // Also delete related student_session_reports
    const { error: ssrError } = await admin.from("student_session_reports").delete().eq("schedule_id", id);
    if (ssrError) throw new Error(ssrError.message);
    const { error } = await admin.from("schedules").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteSchedule:", err);
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

export async function deleteSchedulesBulk(ids: string[]): Promise<{ success?: boolean; error?: string }> {
  try {
    if (ids.length === 0) return { success: true };
    await requireStaffCaller();
    const admin = createAdminClient();
    const { error: ssrError } = await admin.from("student_session_reports").delete().in("schedule_id", ids);
    if (ssrError) throw new Error(ssrError.message);
    const { error } = await admin.from("schedules").delete().in("id", ids);
    if (error) throw new Error(error.message);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteSchedulesBulk:", err);
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

export async function updateSchedule(id: string, data: Partial<Schedule>) {
  await requireStaffCaller();
  const admin = createAdminClient();
  const updateData: Record<string, unknown> = {};
  if (data.date !== undefined) updateData.date = data.date;
  if (data.startTime !== undefined) updateData.start_time = data.startTime;
  if (data.endTime !== undefined) updateData.end_time = data.endTime;
  if (data.program !== undefined) updateData.program = data.program;
  if (data.subject !== undefined) updateData.subject = data.subject;
  if (data.topic !== undefined) updateData.topic = data.topic;
  if (data.teacherId !== undefined) updateData.teacher_id = data.teacherId;
  if (data.teacherName !== undefined) updateData.teacher_name = data.teacherName;
  if (data.studentIds !== undefined) updateData.student_ids = data.studentIds;
  if (data.students !== undefined) updateData.students_data = data.students;
  if (data.branch !== undefined) updateData.branch = data.branch;
  if (data.honorAmount !== undefined) updateData.honor_amount = data.honorAmount;
  if (data.honorType !== undefined) updateData.honor_type = data.honorType;
  if (data.classMode !== undefined) updateData.class_mode = data.classMode;

  const { error } = await admin.from("schedules").update(updateData).eq("id", id);
  if (error) throw new Error(`Gagal mengupdate jadwal: ${error.message}`);
  revalidatePath("/");
}

export async function updateScheduleStatus(id: string, status: ScheduleStatus) {
  const supabase = await getSupabase();
  await supabase
    .from("schedules")
    .update({ status })
    .eq("id", id);
  revalidatePath("/");
}

export async function updateScheduleHonor(id: string, honorAmount: number, honorType?: Schedule["honorType"]) {
  const supabase = await getSupabase();
  const updateData: Record<string, unknown> = { honor_amount: honorAmount };
  if (honorType) updateData.honor_type = honorType;

  await supabase
    .from("schedules")
    .update(updateData)
    .eq("id", id);
  revalidatePath("/");
}

export async function checkIn(id: string, lat: number, lng: number, gpsBypassed?: boolean, distance?: number) {
  const supabase = await getSupabase();
  const time = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await supabase
    .from("schedules")
    .update({
      status: "IN_PROGRESS",
      check_in: { time, lat, lng, gpsBypassed, distance }
    })
    .eq("id", id);
  revalidatePath("/");
}

export async function checkOutAndReport(
  id: string,
  lat: number,
  lng: number,
  report: NonNullable<Schedule["report"]>,
) {
  const supabase = await getSupabase();
  const time = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Clear revisionNote from report upon resubmission
  const cleanedReport = { ...report } as any;
  delete cleanedReport.revisionNote;
  delete cleanedReport.revision_note;

  const { data: updated } = await supabase
    .from("schedules")
    .update({
      status: "WAITING_VERIFICATION",
      check_out: { time, lat, lng },
      report: cleanedReport
    })
    .eq("id", id)
    .select()
    .single();

  // Derived write-through index for per-student attendance/progress history.
  // Per-row upserts so one bad `attendance` value (CHECK constraint) can't
  // fail the whole batch; failures here don't block the teacher's checkout.
  if (updated && report.studentProgresses?.length) {
    await Promise.all(
      report.studentProgresses.map((sp) =>
        supabase
          .from("student_session_reports")
          .upsert(
            {
              id: `${id}_${sp.studentId}`,
              schedule_id: id,
              student_id: sp.studentId,
              student_name: sp.studentName,
              program: updated.program,
              subject: updated.subject,
              topic: updated.topic,
              teacher_id: updated.teacher_id,
              teacher_name: updated.teacher_name,
              session_date: updated.date,
              attendance: sp.attendance,
              progress_note: sp.progress,
              score: sp.score ?? null,
            },
            { onConflict: "id" },
          )
          .then(({ error }) => {
            if (error) console.error("student_session_reports upsert failed", error);
          }),
      ),
    );
  }

  revalidatePath("/");
}

export async function rejectReportWithNote(id: string, note: string) {
  const supabase = await getSupabase();

  const { data: current } = await supabase
    .from("schedules")
    .select("report")
    .eq("id", id)
    .single();

  const updatedReport = {
    ...(current?.report || {}),
    revisionNote: note,
  };

  await supabase
    .from("schedules")
    .update({
      status: "REJECTED",
      report: updatedReport,
    })
    .eq("id", id);

  revalidatePath("/");
}

export async function createSchedule(data: Omit<Schedule, "id" | "status" | "archived">) {
  const supabase = await getSupabase();
  const id = `S${Date.now()}`;

  await supabase
    .from("schedules")
    .insert({
      id,
      date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      program: data.program,
      subject: data.subject,
      topic: data.topic,
      teacher_id: data.teacherId,
      teacher_name: data.teacherName,
      student_ids: data.studentIds || null,
      students_data: data.students || null,
      branch: data.branch,
      status: "WAITING_APPROVAL",
      honor_amount: data.honorAmount,
      honor_type: data.honorType || "FULL",
      class_mode: data.classMode || "OFFLINE"
    });
  revalidatePath("/");
}

export async function resetStudentPassword(studentId: string): Promise<{ email?: string; password?: string; error?: string }> {
  try {
    await requireStaffCaller();
    const admin = createAdminClient();

    // 1. Get the student's auth_user_id
    const { data: student, error: studentErr } = await admin
      .from("students")
      .select("auth_user_id, name")
      .eq("id", studentId)
      .single();

    if (studentErr || !student) {
      throw new Error("Siswa tidak ditemukan.");
    }

    if (!student.auth_user_id) {
      throw new Error("Siswa ini belum memiliki akun login.");
    }

    // 2. Fetch user's email from auth.users
    const { data: { user }, error: userErr } = await admin.auth.admin.getUserById(student.auth_user_id);
    if (userErr || !user) {
      throw new Error("User auth tidak ditemukan.");
    }

    // 3. Generate a new password
    const password = generateInitialPassword();

    // 4. Update the user's password in Supabase Auth
    const { error: authError } = await admin.auth.admin.updateUserById(student.auth_user_id, {
      password: password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // 5. Update profiles.must_change_password to true
    const { error: profileError } = await admin
      .from("profiles")
      .update({ must_change_password: true })
      .eq("id", student.auth_user_id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    revalidatePath("/");
    return { email: user.email, password };
  } catch (err: any) {
    console.error("Error in resetStudentPassword:", err);
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

export async function resetParentPassword(parentId: string): Promise<{ email?: string; password?: string; error?: string }> {
  try {
    await requireStaffCaller();
    const admin = createAdminClient();

    // 1. Check profile role
    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("role")
      .eq("id", parentId)
      .single();

    if (profileErr || !profile) {
      throw new Error("Profil orang tua tidak ditemukan.");
    }

    if (profile.role !== "otk") {
      throw new Error("User bukan ber-role orang tua.");
    }

    // 2. Fetch user's email from auth
    const { data: { user }, error: userErr } = await admin.auth.admin.getUserById(parentId);
    if (userErr || !user) {
      throw new Error("User auth tidak ditemukan.");
    }

    // 3. Generate password
    const password = generateInitialPassword();

    // 4. Update password
    const { error: authError } = await admin.auth.admin.updateUserById(parentId, {
      password: password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // 5. Update must_change_password = true
    const { error: profileError } = await admin
      .from("profiles")
      .update({ must_change_password: true })
      .eq("id", parentId);

    if (profileError) {
      throw new Error(profileError.message);
    }

    revalidatePath("/");
    return { email: user.email, password };
  } catch (err: any) {
    console.error("Error in resetParentPassword:", err);
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
