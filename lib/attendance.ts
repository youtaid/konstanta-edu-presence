import type { StudentAttendanceSummary, StudentSessionReport } from "./types";

export function computeAttendanceSummary(
  studentId: string,
  reports: StudentSessionReport[],
): StudentAttendanceSummary {
  const totalSessions = reports.length;
  const hadirCount = reports.filter((r) => r.attendance === "Hadir").length;
  const izinCount = reports.filter((r) => r.attendance === "Izin").length;
  const sakitCount = reports.filter((r) => r.attendance === "Sakit").length;
  const alpaCount = reports.filter((r) => r.attendance === "Alpa").length;

  return {
    studentId,
    totalSessions,
    hadirCount,
    izinCount,
    sakitCount,
    alpaCount,
    attendancePercentage:
      totalSessions === 0 ? 0 : Math.round((hadirCount / totalSessions) * 100),
  };
}
