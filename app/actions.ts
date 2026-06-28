"use server";

import { db } from "@/lib/db";
import { Schedule, ScheduleStatus, User, Student, Period } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  return db.users;
}

export async function getSchedules() {
  return db.schedules;
}

export async function getPeriods() {
  return db.periods;
}

export async function getActivePeriod() {
  return db.periods.find((p) => p.id === db.activePeriodId) || db.periods[0];
}

export async function setActivePeriod(id: string) {
  db.activePeriodId = id;
  revalidatePath("/");
}

export async function getStudents() {
  return db.students;
}

export async function getPrograms() {
  return db.programs;
}

export async function createStudent(data: Omit<Student, "id">) {
  const newStudent: Student = {
    ...data,
    id: `ST${Date.now()}`,
  };
  db.students.push(newStudent);
  revalidatePath("/");
}

export async function createPeriod(data: Omit<Period, "id">) {
  const newPeriod: Period = {
    ...data,
    id: `P${Date.now()}`,
  };
  db.periods.push(newPeriod);
  revalidatePath("/");
}

export async function updatePeriod(id: string, data: Partial<Period>) {
  const periodIndex = db.periods.findIndex((p) => p.id === id);
  if (periodIndex !== -1) {
    db.periods[periodIndex] = { ...db.periods[periodIndex], ...data };
  }
  revalidatePath("/");
}

export async function deletePeriod(id: string) {
  db.periods = db.periods.filter((p) => p.id !== id);
  if (db.activePeriodId === id) {
    db.activePeriodId = db.periods[0]?.id || "";
  }
  revalidatePath("/");
}

export async function createTeacher(data: Partial<User>) {
  const newTeacher: User = {
    ...data,
    id: `U${Date.now()}`,
    role: "TEACHER",
    teacherId: `T${Date.now()}`,
  } as User;
  db.users.push(newTeacher);
  revalidatePath("/");
}

export async function updateTeacher(id: string, data: Partial<User>) {
  const teacherIndex = db.users.findIndex((u) => u.id === id);
  if (teacherIndex !== -1) {
    db.users[teacherIndex] = { ...db.users[teacherIndex], ...data };
  }
  revalidatePath("/");
}

export async function deleteTeacher(id: string) {
  db.users = db.users.filter((u) => u.id !== id);
  revalidatePath("/");
}

export async function payTeacherSchedules(
  teacherId: string,
  startDate: string,
  endDate: string,
) {
  db.schedules.forEach((s) => {
    if (
      s.teacherId === teacherId &&
      s.status === "VALIDATED" &&
      s.date >= startDate &&
      s.date <= endDate
    ) {
      s.status = "PAID";
    }
  });
  revalidatePath("/");
}

export async function updateScheduleStatus(id: string, status: ScheduleStatus) {
  const schedule = db.schedules.find((s) => s.id === id);
  if (schedule) {
    schedule.status = status;
  }
  revalidatePath("/");
}

export async function updateScheduleHonor(id: string, honorAmount: number) {
  const schedule = db.schedules.find((s) => s.id === id);
  if (schedule) {
    schedule.honorAmount = honorAmount;
  }
  revalidatePath("/");
}

export async function checkIn(id: string, lat: number, lng: number) {
  const schedule = db.schedules.find((s) => s.id === id);
  if (schedule) {
    schedule.status = "IN_PROGRESS";
    schedule.checkIn = {
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      lat,
      lng,
    };
  }
  revalidatePath("/");
}

export async function checkOutAndReport(
  id: string,
  lat: number,
  lng: number,
  report: NonNullable<Schedule["report"]>,
) {
  const schedule = db.schedules.find((s) => s.id === id);
  if (schedule) {
    schedule.status = "WAITING_VERIFICATION";
    schedule.checkOut = {
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      lat,
      lng,
    };
    schedule.report = report;
  }
  revalidatePath("/");
}

export async function createSchedule(data: Omit<Schedule, "id" | "status">) {
  const newSchedule: Schedule = {
    ...data,
    id: `S${Date.now()}`,
    status: "WAITING_APPROVAL",
  };
  db.schedules.push(newSchedule);
  revalidatePath("/");
}
