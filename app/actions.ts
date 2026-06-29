"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { Schedule, ScheduleStatus, User, Student, Period } from "@/lib/types";
import { revalidatePath } from "next/cache";

async function getSupabase() {
  const cookieStore = await cookies();
  return createSupabaseClient(cookieStore);
}

function generateInitialPassword() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `Konstanta${digits}`;
}

export async function getUsers() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name", { ascending: true });
  
  if (!data) return [];

  return data.map((profile: any) => {
    let roleMapped: 'ADMIN' | 'ACADEMIC' | 'TEACHER' | 'KARYAWAN' = 'KARYAWAN';
    if (profile.role === 'admin') roleMapped = 'ADMIN';
    else if (profile.role === 'akademik') roleMapped = 'ACADEMIC';
    else if (profile.role === 'ketetap' || profile.role === 'kangguru') roleMapped = 'TEACHER';

    const user: any = {
      id: profile.id,
      name: profile.full_name,
      email: "", // email not saved on profiles for privacy, or fetched via auth later
      role: roleMapped,
      teacherId: profile.teacher_id,
      teacherType: profile.teacher_type,
    };

    if (profile.teacher_type === 'TETAP') {
      user.baseSalary = Number(profile.base_salary || 0);
      user.transportAllowance = Number(profile.transport_allowance || 0);
      user.otherAllowance = Number(profile.other_allowance || 0);
      user.bpjsKetenagakerjaan = Number(profile.bpjs_ketenagakerjaan || 0);
      user.bpjsKesehatan = Number(profile.bpjs_kesehatan || 0);
      user.workStartTime = profile.work_start_time || undefined;
      user.workEndTime = profile.work_end_time || undefined;
    }
    return user;
  });
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
  }));
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
  const admin = createAdminClient();
  await admin.from("profiles").delete().eq("id", id);
  await admin.auth.admin.deleteUser(id);
  revalidatePath("/");
}

export async function payTeacherSchedules(
  teacherId: string,
  startDate: string,
  endDate: string,
) {
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

export async function checkIn(id: string, lat: number, lng: number) {
  const supabase = await getSupabase();
  const time = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await supabase
    .from("schedules")
    .update({
      status: "IN_PROGRESS",
      check_in: { time, lat, lng }
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

  await supabase
    .from("schedules")
    .update({
      status: "WAITING_VERIFICATION",
      check_out: { time, lat, lng },
      report
    })
    .eq("id", id);
  revalidatePath("/");
}

export async function createSchedule(data: Omit<Schedule, "id" | "status">) {
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
