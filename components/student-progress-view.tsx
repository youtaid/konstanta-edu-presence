"use client";

import { useEffect, useState } from "react";
import { getEvaluationResultsForStudent, getStudentSessionReports } from "@/app/actions";
import { computeAttendanceSummary } from "@/lib/attendance";
import type { EvaluationAssessment, Student, StudentSessionReport } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function attendanceBadgeVariant(attendance: string) {
  if (attendance === "Hadir") return "success" as const;
  if (attendance === "Alpa") return "destructive" as const;
  return "outline" as const;
}

// Fetches and renders a student's attendance summary + per-session history
// (attendance, progress note, nilai KBM). Shared by Akademik's
// StudentHistoryModal, OrangTuaDashboard (OTK), and SiswaDashboard (KEnz) —
// RLS on student_session_reports/students scopes what each caller sees, this
// component just renders whatever getStudentSessionReports() returns.
export default function StudentProgressView({ student }: { student: Student }) {
  const [reports, setReports] = useState<StudentSessionReport[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getStudentSessionReports(student.id),
      getEvaluationResultsForStudent(student.id),
    ]).then(([data, evalData]) => {
      if (!cancelled) {
        setReports(data);
        setEvaluations(evalData);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [student.id]);

  const summary = computeAttendanceSummary(student.id, reports);
  const percentVariant =
    summary.attendancePercentage >= 80
      ? ("success" as const)
      : summary.attendancePercentage >= 60
        ? ("warning" as const)
        : ("destructive" as const);

  if (loading) {
    return <p className="text-sm text-gray-500 italic py-4">Memuat riwayat...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-500 block">
            Persentase Kehadiran ({summary.totalSessions} sesi)
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {summary.attendancePercentage}%
          </span>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Badge variant={percentVariant}>
            {summary.attendancePercentage >= 80
              ? "Baik"
              : summary.attendancePercentage >= 60
                ? "Perlu Diperhatikan"
                : "Rendah"}
          </Badge>
          <Badge variant="success">Hadir {summary.hadirCount}</Badge>
          <Badge variant="outline">Izin {summary.izinCount}</Badge>
          <Badge variant="outline">Sakit {summary.sakitCount}</Badge>
          <Badge variant="destructive">Alpa {summary.alpaCount}</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-2">
            Evaluasi
          </h3>
          <div className="space-y-2">
            {evaluations.map((assessment) => {
              const result = assessment.results[0];
              return (
                <div
                  key={assessment.id}
                  className="p-3 bg-white border border-teal-100 rounded-lg text-sm"
                >
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <div>
                      <span className="font-medium text-gray-900 block">
                        {assessment.assessmentDate} - {assessment.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {assessment.subject} - {assessment.assessmentType}
                      </span>
                    </div>
                    {result?.score !== undefined && result.score !== null && (
                      <Badge variant="secondary" className="shrink-0">
                        Nilai {result.score}/{assessment.maxScore || 100}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700">
                    {result?.qualitativeFeedback || "Tidak ada feedback"}
                  </p>
                </div>
              );
            })}
            {evaluations.length === 0 && (
              <p className="text-sm text-gray-500 italic py-3 text-center border border-dashed rounded-lg">
                Belum ada evaluasi yang dipublish.
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-2">
            Riwayat KBM
          </h3>
        {reports.map((r) => (
          <div
            key={r.id}
            className="p-3 bg-white border border-gray-200 rounded-lg text-sm"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900">
                {r.sessionDate} — {r.subject}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {r.score !== undefined && r.score !== null && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-5"
                  >
                    Nilai {r.score}
                  </Badge>
                )}
                <Badge
                  variant={attendanceBadgeVariant(r.attendance)}
                  className="text-[10px] px-1.5 py-0 h-5"
                >
                  {r.attendance}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Guru: {r.teacherName}</p>
            <p className="text-gray-700">
              {r.progressNote || "Tidak ada catatan"}
            </p>
          </div>
        ))}
        {reports.length === 0 && (
          <p className="text-sm text-gray-500 italic py-4 text-center">
            Belum ada riwayat kehadiran/perkembangan untuk siswa ini.
          </p>
        )}
        </div>
      </div>
    </div>
  );
}
