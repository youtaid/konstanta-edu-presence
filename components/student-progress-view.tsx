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

function AttendanceSummary({
  totalSessions,
  attendancePercentage,
  hadirCount,
  izinCount,
  sakitCount,
  alpaCount,
}: ReturnType<typeof computeAttendanceSummary>) {
  const percentVariant =
    attendancePercentage >= 80 ? ("success" as const)
    : attendancePercentage >= 60 ? ("warning" as const)
    : ("destructive" as const);
  const percentLabel =
    attendancePercentage >= 80 ? "Baik"
    : attendancePercentage >= 60 ? "Perlu Diperhatikan"
    : "Rendah";

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <div>
        <span className="text-xs text-gray-500 block">
          Persentase Kehadiran ({totalSessions} sesi)
        </span>
        <span className="text-2xl font-bold text-gray-900">{attendancePercentage}%</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-end">
        <Badge variant={percentVariant}>{percentLabel}</Badge>
        <Badge variant="success">Hadir {hadirCount}</Badge>
        <Badge variant="outline">Izin {izinCount}</Badge>
        <Badge variant="outline">Sakit {sakitCount}</Badge>
        <Badge variant="destructive">Alpa {alpaCount}</Badge>
      </div>
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-500 italic py-3 text-center border border-dashed rounded-lg">
      {children}
    </p>
  );
}

function EvaluationCard({ assessment }: { assessment: EvaluationAssessment }) {
  const result = assessment.results[0];
  return (
    <div className="p-3 bg-white border border-teal-100 rounded-lg text-sm">
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
      <p className="text-gray-700">{result?.qualitativeFeedback || "Tidak ada feedback"}</p>
    </div>
  );
}

function SessionReportCard({ report }: { report: StudentSessionReport }) {
  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-gray-900">
          {report.sessionDate} — {report.subject}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {report.score !== undefined && report.score !== null && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
              Nilai {report.score}
            </Badge>
          )}
          <Badge
            variant={attendanceBadgeVariant(report.attendance)}
            className="text-[10px] px-1.5 py-0 h-5"
          >
            {report.attendance}
          </Badge>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-1">Guru: {report.teacherName}</p>
      <p className="text-gray-700">{report.progressNote || "Tidak ada catatan"}</p>
    </div>
  );
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
      if (cancelled) return;
      setReports(data);
      setEvaluations(evalData);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [student.id]);

  if (loading) {
    return <p className="text-sm text-gray-500 italic py-4">Memuat riwayat...</p>;
  }

  const summary = computeAttendanceSummary(student.id, reports);

  return (
    <div className="space-y-4">
      <AttendanceSummary {...summary} />

      <div className="space-y-2">
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-2">Evaluasi</h3>
          <div className="space-y-2">
            {evaluations.map((assessment) => (
              <EvaluationCard key={assessment.id} assessment={assessment} />
            ))}
            {evaluations.length === 0 && (
              <EmptyNote>Belum ada evaluasi yang dipublish.</EmptyNote>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-2">Riwayat KBM</h3>
          <div className="space-y-2">
            {reports.map((report) => (
              <SessionReportCard key={report.id} report={report} />
            ))}
            {reports.length === 0 && (
              <EmptyNote>Belum ada riwayat kehadiran/perkembangan untuk siswa ini.</EmptyNote>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
