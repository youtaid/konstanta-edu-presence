"use client";

import { useEffect, useState } from "react";
import { getEvaluationResultsForStudent, getStudentSessionReports, getStudentDiagnosticReport } from "@/app/actions";
import { computeAttendanceSummary } from "@/lib/attendance";
import type { EvaluationAssessment, Student, StudentSessionReport } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Award,
  Calendar,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  FileText,
  HelpCircle,
  ThumbsUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export function attendanceBadgeVariant(attendance: string) {
  if (attendance === "Hadir") return "success" as const;
  if (attendance === "Alpa") return "destructive" as const;
  return "outline" as const;
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-500 italic py-8 text-center border border-dashed rounded-xl">
      {children}
    </p>
  );
}

function EvaluationCard({ assessment }: { assessment: EvaluationAssessment }) {
  const result = assessment.results[0];
  return (
    <div className="p-4 bg-white border border-teal-100 rounded-xl text-sm shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start gap-3 mb-2">
        <div>
          <span className="font-semibold text-gray-900 block text-base">
            {assessment.title}
          </span>
          <span className="text-xs text-gray-500 block mt-0.5">
            {assessment.assessmentDate} • {assessment.subject} • {assessment.assessmentType}
          </span>
        </div>
        {result?.score !== undefined && result.score !== null && (
          <Badge variant="secondary" className="shrink-0 font-bold bg-teal-50 text-teal-700 border border-teal-200">
            Nilai {result.score}/{assessment.maxScore || 100}
          </Badge>
        )}
      </div>
      <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs leading-relaxed">
        {result?.qualitativeFeedback || "Tidak ada catatan atau feedback dari penilai."}
      </p>
    </div>
  );
}

function SessionReportCard({ report }: { report: StudentSessionReport }) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl text-sm shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold text-gray-900 block text-base">
            {report.subject} — <span className="font-normal text-gray-600">{report.topic || "KBM"}</span>
          </span>
          <span className="text-xs text-gray-500 block mt-0.5">
            {report.sessionDate} • Guru: {report.teacherName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {report.score !== undefined && report.score !== null && (
            <Badge variant="secondary" className="text-xs font-semibold bg-gray-100 text-gray-800 border">
              Nilai {report.score}
            </Badge>
          )}
          <Badge
            variant={attendanceBadgeVariant(report.attendance)}
            className="text-xs font-semibold"
          >
            {report.attendance}
          </Badge>
        </div>
      </div>
      <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs leading-relaxed">
        {report.progressNote || "Tidak ada catatan perkembangan siswa pada sesi ini."}
      </p>
    </div>
  );
}

function formatDateShort(dateStr: string) {
  if (!dateStr) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const day = parseInt(parts[2], 10);
    const monthIdx = parseInt(parts[1], 10) - 1;
    return `${day} ${months[monthIdx] || ""}`;
  }
  return dateStr;
}

const ATTENDANCE_COLORS = {
  Hadir: "#10b981",
  Sakit: "#f59e0b",
  Izin: "#3b82f6",
  Alpa: "#ef4444"
};

export default function StudentProgressView({ student }: { student: Student }) {
  const [reports, setReports] = useState<StudentSessionReport[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationAssessment[]>([]);
  const [diagnosticReport, setDiagnosticReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"analisis" | "kbm" | "evaluasi">("analisis");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getStudentSessionReports(student.id),
      getEvaluationResultsForStudent(student.id),
      getStudentDiagnosticReport(student.id),
    ]).then(([data, evalData, diagData]) => {
      if (cancelled) return;
      setReports(data);
      setEvaluations(evalData);
      setDiagnosticReport(diagData);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [student.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 italic">Memuat riwayat & analitik siswa...</p>
      </div>
    );
  }

  const summary = computeAttendanceSummary(student.id, reports);

  // Parse student's class grade for diagnostic report
  const classGrade = student.className ? (student.className.match(/^(\d+)/)?.[1] || null) : null;
  const hasDiagnosticReport = classGrade && ["9", "10", "11", "12"].includes(classGrade);
  const diagnosticFileName = hasDiagnosticReport ? `Laporan Diagnostik Kelas ${classGrade}.xlsx` : null;
  const diagnosticDownloadUrl = hasDiagnosticReport ? `/Tes Diagnostik/${encodeURIComponent(diagnosticFileName!)}` : null;

  // Process personal diagnostic statistics
  const diagStats = (() => {
    if (!diagnosticReport?.questions?.length) return null;
    const qs = diagnosticReport.questions;
    const total = qs.length;
    const correct = qs.filter((q: any) => q.isCorrect).length;
    const percentage = Math.round((correct / total) * 100);

    const subjectMap: Record<string, { total: number; correct: number }> = {};
    qs.forEach((q: any) => {
      if (!subjectMap[q.subject]) {
        subjectMap[q.subject] = { total: 0, correct: 0 };
      }
      subjectMap[q.subject].total += 1;
      if (q.isCorrect) {
        subjectMap[q.subject].correct += 1;
      }
    });

    const subjectBreakdown = Object.entries(subjectMap).map(([subject, stats]) => ({
      subject,
      total: stats.total,
      correct: stats.correct,
      percentage: Math.round((stats.correct / stats.total) * 100),
    }));

    const needsImprovement = qs
      .filter((q: any) => !q.isCorrect)
      .map((q: any) => ({
        subject: q.subject,
        questionNumber: q.questionNumber,
        competency: q.competency,
      }));

    return {
      total,
      correct,
      percentage,
      subjectBreakdown,
      needsImprovement,
    };
  })();

  // ----------------------------------------------------
  // ANALYTICS COMPUTATIONS
  // ----------------------------------------------------
  
  // 1. Grade list and metrics
  const sessionScores = reports
    .filter((r) => r.score !== undefined && r.score !== null)
    .map((r) => r.score as number);

  const evalScores = evaluations
    .map((e) => e.results[0]?.score)
    .filter((s): s is number => s !== undefined && s !== null);

  const allScores = [...sessionScores, ...evalScores];

  const overallAvg = allScores.length
    ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
    : null;

  const kbmAvg = sessionScores.length
    ? Math.round((sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length) * 10) / 10
    : null;

  const evalAvg = evalScores.length
    ? Math.round((evalScores.reduce((a, b) => a + b, 0) / evalScores.length) * 10) / 10
    : null;

  const maxScore = allScores.length ? Math.max(...allScores) : null;
  const minScore = allScores.length ? Math.min(...allScores) : null;

  // 2. Trend Data chronological
  const formattedSessionScores = reports
    .filter((r) => r.score !== undefined && r.score !== null)
    .map((r) => ({
      date: r.sessionDate,
      score: r.score as number,
      type: "KBM",
      subject: r.subject,
      label: r.topic || "KBM Sesi"
    }));

  const formattedEvalScores = evaluations
    .filter((e) => e.results[0]?.score !== undefined && e.results[0]?.score !== null)
    .map((e) => ({
      date: e.assessmentDate,
      score: e.results[0].score as number,
      type: "Evaluasi",
      subject: e.subject,
      label: e.title
    }));

  const trendDataRaw = [...formattedSessionScores, ...formattedEvalScores]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const trendData = trendDataRaw.map((t) => ({
    ...t,
    formattedDate: formatDateShort(t.date)
  }));

  // 3. Subject Averages
  const subjectScoresMap: Record<string, number[]> = {};
  trendDataRaw.forEach((t) => {
    if (!subjectScoresMap[t.subject]) {
      subjectScoresMap[t.subject] = [];
    }
    subjectScoresMap[t.subject].push(t.score);
  });

  const subjectData = Object.entries(subjectScoresMap).map(([subject, scores]) => ({
    subject,
    average: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
    count: scores.length
  })).sort((a, b) => b.average - a.average);

  // 4. Attendance Pie Data
  const pieData = [
    { name: "Hadir", value: summary.hadirCount, color: ATTENDANCE_COLORS.Hadir },
    { name: "Sakit", value: summary.sakitCount, color: ATTENDANCE_COLORS.Sakit },
    { name: "Izin", value: summary.izinCount, color: ATTENDANCE_COLORS.Izin },
    { name: "Alpa", value: summary.alpaCount, color: ATTENDANCE_COLORS.Alpa }
  ].filter((item) => item.value > 0);

  // 5. Dynamic Recommendations
  const recommendations: string[] = [];
  if (summary.attendancePercentage < 85 && summary.totalSessions > 0) {
    recommendations.push(
      `Kehadiran (${summary.attendancePercentage}%) berada di bawah batas target minimal 85%. Disarankan untuk mengantisipasi ketidakhadiran di sesi mendatang dan menjadwalkan kelas pengganti jika memungkinkan.`
    );
  }

  const weakSubjects = subjectData.filter((s) => s.average < 75);
  if (weakSubjects.length > 0) {
    const subNames = weakSubjects.map((s) => `${s.subject} (Rata-rata: ${s.average})`).join(", ");
    recommendations.push(
      `Nilai di beberapa pelajaran perlu mendapat perhatian ekstra: ${subNames}. Fokuskan latihan mandiri atau tingkatkan komunikasi dengan pengajar di sesi berikutnya.`
    );
  }

  if (recommendations.length === 0) {
    if (overallAvg && overallAvg >= 85) {
      recommendations.push(
        "Kinerja Akademis Luar Biasa! Nilai rata-rata dan tingkat kehadiran siswa sangat memuaskan. Pertahankan motivasi dan metode belajar berkinerja tinggi ini."
      );
    } else {
      recommendations.push(
        "Perkembangan Akademis Stabil. Kehadiran dan nilai rata-rata siswa memenuhi standar evaluasi dengan baik. Jaga konsistensi keaktifan di dalam kelas."
      );
    }
  }

  // Attendance status label
  const percentLabel =
    summary.attendancePercentage >= 80 ? "Baik"
    : summary.attendancePercentage >= 60 ? "Perlu Diperhatikan"
    : "Kritis";

  const percentVariant =
    summary.attendancePercentage >= 80 ? "success"
    : summary.attendancePercentage >= 60 ? "warning"
    : "destructive";

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------
          TABS NAVIGATION
          ---------------------------------------------------- */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("analisis")}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "analisis"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Activity className="w-4 h-4" />
          Ringkasan & Analisis
        </button>
        <button
          onClick={() => setActiveTab("kbm")}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "kbm"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Riwayat KBM ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab("evaluasi")}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "evaluasi"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          Evaluasi ({evaluations.length})
        </button>
      </div>

      {/* ----------------------------------------------------
          TAB 1: ANALYSIS & CHARTS
          ---------------------------------------------------- */}
      {activeTab === "analisis" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Average Grade Card */}
            <Card className="border border-teal-100 bg-gradient-to-br from-white to-teal-50/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
                      Rata-rata Nilai
                    </span>
                    <span className="text-4xl font-extrabold text-gray-900 block">
                      {overallAvg !== null ? overallAvg : "N/A"}
                    </span>
                    <div className="text-xs text-gray-500 font-medium">
                      {kbmAvg !== null && `KBM: ${kbmAvg}`}
                      {kbmAvg !== null && evalAvg !== null && " • "}
                      {evalAvg !== null && `Evaluasi: ${evalAvg}`}
                    </div>
                  </div>
                  <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                {overallAvg !== null && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> Max: <strong className="text-gray-800">{maxScore}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" /> Min: <strong className="text-gray-800">{minScore}</strong>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendance Percentage Card */}
            <Card className="border border-blue-100 bg-gradient-to-br from-white to-blue-50/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">
                      Kehadiran Siswa
                    </span>
                    <span className="text-4xl font-extrabold text-gray-900 block">
                      {summary.attendancePercentage}%
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant={percentVariant} className="text-[10px] px-1.5 py-0.5">
                        {percentLabel}
                      </Badge>
                      <span className="text-xs text-gray-500 font-medium">
                        {summary.hadirCount} dari {summary.totalSessions} sesi
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between gap-1 text-[11px] font-medium text-gray-500">
                  <span className="text-emerald-600">H: {summary.hadirCount}</span>
                  <span className="text-blue-600">I: {summary.izinCount}</span>
                  <span className="text-amber-600">S: {summary.sakitCount}</span>
                  <span className="text-rose-600">A: {summary.alpaCount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Graded Sessions Card */}
            <Card className="border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block">
                      Aktivitas Belajar
                    </span>
                    <span className="text-4xl font-extrabold text-gray-900 block">
                      {reports.length} <span className="text-lg font-medium text-gray-500">Sesi</span>
                    </span>
                    <div className="text-xs text-gray-500 font-medium">
                      {evaluations.length} Ujian & Evaluasi terbit
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                  <span>Sesi Dinilai: <strong>{sessionScores.length}</strong></span>
                  <span>Evaluasi Dinilai: <strong>{evalScores.length}</strong></span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Trend Chart */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Tren Perkembangan Nilai
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  {mounted && trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                          dataKey="formattedDate"
                          stroke="#9ca3af"
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          stroke="#9ca3af"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-lg text-xs space-y-1">
                                  <p className="font-semibold text-gray-700">{d.date}</p>
                                  <p className="text-teal-600 font-bold">Nilai: {d.score}</p>
                                  <p className="text-gray-500">Pelajaran: {d.subject}</p>
                                  <p className="text-gray-500">Tipe: {d.type}</p>
                                  <p className="text-gray-400 italic mt-1">"{d.label}"</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#0d9488"
                          strokeWidth={3}
                          dot={{ r: 4, stroke: "#0d9488", strokeWidth: 2, fill: "#ffffff" }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : diagStats ? (
                    <div className="flex flex-col justify-center h-full space-y-3 pb-2">
                      <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-3 flex items-start gap-2.5">
                        <Activity className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <h6 className="font-bold text-gray-900 text-[11px]">Hasil Diagnostic Test sebagai Baseline Awal</h6>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                            Belum ada aktivitas kelas harian (KBM) yang dinilai. Hasil diagnostic test Anda menunjukkan pemahaman materi awal sebesar <strong>{diagStats.percentage}%</strong>. Perkembangan nilai KBM berikutnya akan diplot di grafik ini.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100/70">
                          <span className="text-[9px] text-gray-400 font-bold block">TOTAL SOAL</span>
                          <span className="text-xs font-extrabold text-gray-800">{diagStats.total}</span>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100/70">
                          <span className="text-[9px] text-gray-400 font-bold block">SOAL BENAR</span>
                          <span className="text-xs font-extrabold text-teal-600">{diagStats.correct}</span>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100/70">
                          <span className="text-[9px] text-gray-400 font-bold block">SOAL SALAH</span>
                          <span className="text-xs font-extrabold text-rose-600">{diagStats.total - diagStats.correct}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                      Belum ada data nilai tercatat untuk grafik tren
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance & Attendance Composition Grid */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Rata-rata per Pelajaran & Kehadiran
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Performance Bar Chart */}
                <div className="flex flex-col justify-between">
                  <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Nilai Mata Pelajaran
                  </h4>
                  <div className="h-44 w-full">
                    {mounted && subjectData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={subjectData}
                          margin={{ top: 5, right: 0, left: -25, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis
                            dataKey="subject"
                            stroke="#9ca3af"
                            fontSize={10}
                            tickLine={false}
                          />
                          <YAxis
                            domain={[0, 100]}
                            stroke="#9ca3af"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                  <div className="bg-white p-2 border border-gray-100 rounded-lg shadow-md text-xs">
                                    <p className="font-semibold text-gray-800">{d.subject}</p>
                                    <p className="text-blue-600 font-semibold">Rata-rata: {d.average}</p>
                                    <p className="text-gray-400 text-[10px]">{d.count} evaluasi</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30}>
                            {subjectData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.average >= 75 ? "#3b82f6" : "#f59e0b"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                        Belum ada data nilai pelajaran
                      </div>
                    )}
                  </div>
                </div>

                {/* Attendance Pie Chart */}
                <div className="flex flex-col items-center justify-between">
                  <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 self-start">
                    Komposisi Kehadiran
                  </h4>
                  <div className="h-32 w-full flex items-center justify-center relative">
                    {mounted && pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={45}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-xs text-gray-400 italic">Belum ada data kehadiran</div>
                    )}
                    {mounted && pieData.length > 0 && (
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">
                          {summary.attendancePercentage}%
                        </span>
                        <span className="text-[9px] text-gray-400">Hadir</span>
                      </div>
                    )}
                  </div>
                  {/* Legend list */}
                  <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mt-2 text-[10px] font-medium">
                    {pieData.map((d) => (
                      <span key={d.name} className="flex items-center gap-1 text-gray-600">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        {d.name} ({d.value})
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Diagnostic Test Report Section */}
          {hasDiagnosticReport && (
            <>
              {diagStats ? (
                <Card className="border border-teal-200 bg-white shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50/30 border-b border-teal-100/50 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-teal-600 text-white rounded-lg">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold text-gray-900">Analisis Hasil Tes Diagnostik Personal</CardTitle>
                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                            Berdasarkan data pengerjaan Lembar Tes Diagnostik Kelas {classGrade} ({diagnosticReport.sheetName})
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 self-start sm:self-center">
                        {diagnosticReport.pdfUrl && (
                          <Button size="sm" asChild className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                            <a href={diagnosticReport.pdfUrl} download>
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              Unduh PDF Personal
                            </a>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild className="text-teal-700 border-teal-200 hover:bg-teal-50 hover:text-teal-800">
                          <a href={diagnosticDownloadUrl!} download>
                            <Download className="w-3.5 h-3.5 mr-1" />
                            Unduh Excel Kelas
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-5 space-y-6">
                    {/* Score summary and chart */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Big Score Card */}
                      <div className="bg-gradient-to-br from-teal-50/40 to-teal-50/10 border border-teal-50 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">Akurasi Jawaban</span>
                        <div className="relative flex items-center justify-center">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="34" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                            <circle
                              cx="40"
                              cy="40"
                              r="34"
                              stroke="#0d9488"
                              strokeWidth="6"
                              fill="transparent"
                              strokeDasharray={`${2 * Math.PI * 34}`}
                              strokeDashoffset={`${2 * Math.PI * 34 * (1 - diagStats.percentage / 100)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-xl font-extrabold text-gray-900">{diagStats.percentage}%</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">{diagStats.correct} dari {diagStats.total} Benar</span>
                      </div>

                      {/* Subject breakdown */}
                      <div className="md:col-span-2 space-y-3">
                        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nilai per Mata Pelajaran</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {diagStats.subjectBreakdown.map((sub: any, idx: number) => (
                            <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-lg p-3 space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-800 truncate pr-2">{sub.subject}</span>
                                <span className="font-extrabold text-teal-700 shrink-0">{sub.percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200/70 rounded-full h-2">
                                <div
                                  className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${sub.percentage}%` }}
                                />
                              </div>
                              <div className="text-[10px] text-gray-400 font-medium">
                                {sub.correct} dari {sub.total} soal benar
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Needs Improvement list */}
                    {diagStats.needsImprovement.length > 0 ? (
                      <div className="space-y-2.5">
                        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          Rekomendasi Pembenahan Kompetensi
                        </h5>
                        <div className="max-h-52 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-100 bg-gray-50/30">
                          {diagStats.needsImprovement.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 text-xs flex items-start gap-3 hover:bg-white transition-colors">
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 mt-0.5 uppercase">
                                No {item.questionNumber}
                              </span>
                              <div className="space-y-0.5">
                                <p className="font-semibold text-gray-900 leading-normal">{item.competency}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{item.subject}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold">Luar Biasa! Seluruh kompetensi tes diagnostik berhasil dikuasai dengan sempurna.</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-teal-200 bg-teal-50/10 shadow-sm">
                  <CardContent className="pt-5 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-teal-100 text-teal-700 rounded-xl">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {diagnosticReport?.pdfUrl ? "Hasil Tes Diagnostik Personal Tersedia" : "Hasil Tes Diagnostik Tersedia"}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {diagnosticReport?.pdfUrl
                            ? `Laporan analisis potensi belajar mandiri untuk ${student.name} (.pdf).`
                            : `Laporan analisis potensi & diagnostik belajar untuk Kelas ${classGrade}.`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 self-start sm:self-center">
                      {diagnosticReport?.pdfUrl && (
                        <Button size="sm" asChild className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                          <a href={diagnosticReport.pdfUrl} download>
                            <FileText className="w-3.5 h-3.5 mr-1" />
                            Unduh PDF Personal
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild className="text-teal-700 border-teal-200 hover:bg-teal-50 hover:text-teal-800">
                        <a href={diagnosticDownloadUrl!} download>
                          <Download className="w-4 h-4 mr-1.5" />
                          Unduh Excel Kelas
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Recommendations Card */}
          <Card className="border border-teal-100/70 bg-gradient-to-r from-teal-50/10 to-teal-50/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-teal-800 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                Catatan, Rekomendasi & Rencana Tindak Lanjut
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 bg-white p-3 rounded-lg border border-teal-50 shadow-sm">
                  {rec.includes("Luar Biasa") || rec.includes("Sangat Baik") ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : rec.includes("di bawah") || rec.includes("perlu mendapat") ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed font-medium">{rec}</p>
                </div>
              ))}

              {/* Rencana Tindak Lanjut dari Tes Diagnostik */}
              {diagStats && diagStats.needsImprovement.length > 0 && (
                <div className="mt-4 pt-4 border-t border-teal-100 space-y-2.5">
                  <h5 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    Rencana Tindak Lanjut (Diagnostic Follow-up)
                  </h5>
                  <div className="space-y-2">
                    <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                      Berdasarkan hasil analisis diagnostic test, berikut rencana intervensi akademik yang akan dilaksanakan selama sesi KBM:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {diagStats.needsImprovement.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-white border border-teal-50/50 rounded-lg shadow-sm flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                          <div className="text-[11px] text-gray-700 leading-normal">
                            <span className="font-bold text-teal-800">{item.subject}:</span> Melakukan latihan intensif dan bimbingan privat 1-on-1 pada kompetensi <em>"{item.competency}"</em> untuk mengejar pemahaman materi dasar.
                          </div>
                        </div>
                      ))}
                      {diagStats.needsImprovement.length > 3 && (
                        <p className="text-[10px] text-teal-600 font-semibold italic pl-1">
                          + {diagStats.needsImprovement.length - 3} rencana tindak lanjut lainnya sedang dikoordinasikan dengan guru mata pelajaran terkait.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: DAILY SCHEDULES & ATTENDANCE REPORTS
          ---------------------------------------------------- */}
      {activeTab === "kbm" && (
        <div className="space-y-3 animate-fadeIn">
          {reports.map((report) => (
            <SessionReportCard key={report.id} report={report} />
          ))}
          {reports.length === 0 && (
            <EmptyNote>Belum ada riwayat kehadiran/perkembangan untuk siswa ini.</EmptyNote>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: EVALUATION ASSESSMENTS
          ---------------------------------------------------- */}
      {activeTab === "evaluasi" && (
        <div className="space-y-3 animate-fadeIn">
          {evaluations.map((assessment) => (
            <EvaluationCard key={assessment.id} assessment={assessment} />
          ))}
          {evaluations.length === 0 && (
            <EmptyNote>Belum ada evaluasi yang dipublikasikan.</EmptyNote>
          )}
        </div>
      )}
    </div>
  );
}
