"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEvaluationAssessment,
  getEvaluationAssessments,
  getPrograms,
  getStudents,
  getTeachersForEvaluation,
  setEvaluationTeacherRecipients,
  submitEvaluationAssessment,
  updateEvaluationAssessment,
  upsertEvaluationResultsBulk,
  getDiagnosticReportsList,
  uploadDiagnosticReport,
} from "@/app/actions";
import type { EvaluationAssessment, EvaluationType, Student, User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, ClipboardList, Edit, Save, Send, Users, FileUp, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type ResultDraft = {
  studentId: string;
  score: string;
  qualitativeFeedback: string;
};

const ASSESSMENT_TYPES: EvaluationType[] = ["KUIS", "TO", "TUGAS", "LAINNYA"];

const emptyForm = {
  title: "",
  assessmentType: "KUIS" as EvaluationType,
  subject: "",
  program: "",
  className: "",
  assessmentDate: new Date().toISOString().split("T")[0],
  maxScore: "100",
  description: "",
};

function statusVariant(status: EvaluationAssessment["status"]) {
  if (status === "PUBLISHED") return "success" as const;
  if (status === "SUBMITTED") return "warning" as const;
  if (status === "REJECTED") return "destructive" as const;
  return "outline" as const;
}

export default function EvalDashboard() {
  const [assessments, setAssessments] = useState<EvaluationAssessment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<Set<string>>(new Set());
  const [resultDrafts, setResultDrafts] = useState<Record<string, ResultDraft>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Diagnostic report coordination states
  const [activeDashboardTab, setActiveDashboardTab] = useState<"asesmen" | "diagnostik">("asesmen");
  const [diagnosticReports, setDiagnosticReports] = useState<any[]>([]);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
  const [uploadingGrade, setUploadingGrade] = useState<string | null>(null);

  const loadDiagnostics = useCallback(async () => {
    setLoadingDiagnostics(true);
    try {
      const data = await getDiagnosticReportsList();
      setDiagnosticReports(data);
    } catch (err) {
      console.error("Gagal memuat hasil diagnostik:", err);
    } finally {
      setLoadingDiagnostics(false);
    }
  }, []);

  useEffect(() => {
    if (activeDashboardTab === "diagnostik") {
      loadDiagnostics();
    }
  }, [activeDashboardTab, loadDiagnostics]);

  const handleUploadDiagnostic = async (grade: string, file: File) => {
    if (!file) return;
    setUploadingGrade(grade);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadDiagnosticReport(grade, formData);
      if (res.success) {
        await loadDiagnostics();
        setMessage(`Laporan Diagnostik Kelas ${grade} berhasil diunggah.`);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gagal mengunggah laporan.");
    } finally {
      setUploadingGrade(null);
    }
  };

  const loadData = useCallback(async () => {
    const [allAssessments, allStudents, allUsers, allPrograms] = await Promise.all([
      getEvaluationAssessments(),
      getStudents(),
      getTeachersForEvaluation(),
      getPrograms(),
    ]);
    setAssessments(allAssessments);
    setStudents(allStudents);
    setTeachers(allUsers.filter((u) => u.role === "TEACHER"));
    setPrograms(allPrograms);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const selectedAssessment = assessments.find((a) => a.id === selectedId) || null;
  const isEditable = !selectedAssessment || selectedAssessment.status === "DRAFT" || selectedAssessment.status === "REJECTED";

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        if (form.program && student.program !== form.program) return false;
        if (form.className && student.className !== form.className) return false;
        return true;
      }),
    [students, form.program, form.className],
  );

  const classOptions = useMemo(
    () =>
      Array.from(
        new Set(
          students
            .filter((student) => !form.program || student.program === form.program)
            .map((student) => student.className)
            .filter(Boolean) as string[],
        ),
      ).sort(),
    [students, form.program],
  );

  const startNew = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setSelectedTeacherIds(new Set());
    setResultDrafts({});
    setMessage(null);
  };

  const openAssessment = (assessment: EvaluationAssessment) => {
    setSelectedId(assessment.id);
    setForm({
      title: assessment.title,
      assessmentType: assessment.assessmentType,
      subject: assessment.subject,
      program: assessment.program || "",
      className: assessment.className || "",
      assessmentDate: assessment.assessmentDate,
      maxScore: assessment.maxScore?.toString() || "",
      description: assessment.description || "",
    });
    setSelectedTeacherIds(new Set(assessment.teacherRecipients.map((r) => r.teacherProfileId)));
    const drafts: Record<string, ResultDraft> = {};
    assessment.results.forEach((result) => {
      drafts[result.studentId] = {
        studentId: result.studentId,
        score: result.score === null || result.score === undefined ? "" : String(result.score),
        qualitativeFeedback: result.qualitativeFeedback,
      };
    });
    setResultDrafts(drafts);
    setMessage(null);
  };

  const updateResult = (studentId: string, patch: Partial<ResultDraft>) => {
    setResultDrafts((prev) => ({
      ...prev,
      [studentId]: {
        studentId,
        score: prev[studentId]?.score || "",
        qualitativeFeedback: prev[studentId]?.qualitativeFeedback || "",
        ...patch,
      },
    }));
  };

  const saveDraft = async () => {
    if (!form.title.trim() || !form.subject.trim() || !form.assessmentDate) {
      setMessage("Judul, mata pelajaran, dan tanggal wajib diisi.");
      return null;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        title: form.title.trim(),
        assessmentType: form.assessmentType,
        subject: form.subject.trim(),
        program: form.program || undefined,
        className: form.className || undefined,
        assessmentDate: form.assessmentDate,
        maxScore: form.maxScore === "" ? null : Number(form.maxScore),
        description: form.description.trim() || undefined,
      };
      let assessmentId: string;
      if (selectedAssessment) {
        await updateEvaluationAssessment(selectedAssessment.id, payload);
        assessmentId = selectedAssessment.id;
      } else {
        assessmentId = await createEvaluationAssessment(payload);
      }

      const selectedTeachers = teachers
        .filter((teacher) => selectedTeacherIds.has(teacher.id))
        .map((teacher) => ({
          profileId: teacher.id,
          teacherId: teacher.teacherId || teacher.id,
          teacherName: teacher.name,
        }));
      await setEvaluationTeacherRecipients(assessmentId, selectedTeachers);

      await upsertEvaluationResultsBulk(
        assessmentId,
        Object.values(resultDrafts).map((draft) => ({
          studentId: draft.studentId,
          score: draft.score === "" ? null : Number(draft.score),
          qualitativeFeedback: draft.qualitativeFeedback,
        })),
      );

      await loadData();
      setSelectedId(assessmentId);
      setMessage("Draft evaluasi berhasil disimpan.");
      return assessmentId;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gagal menyimpan evaluasi.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const submitForReview = async () => {
    const assessmentId = await saveDraft();
    if (!assessmentId) return;
    setSaving(true);
    try {
      await submitEvaluationAssessment(assessmentId);
      await loadData();
      setMessage("Evaluasi dikirim ke Akademik/Admin untuk review.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gagal submit evaluasi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Memuat dashboard Eval...</div>;

  return (
    <div className="space-y-6">
      <div className="card-3d p-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-teal-800">Dashboard Eval</h2>
          <p className="text-gray-500">Buat asesmen, isi feedback massal, lalu kirim untuk review.</p>
        </div>
        <Button onClick={startNew} className="bg-teal-600 hover:bg-teal-700 text-white">
          <ClipboardList className="w-4 h-4 mr-2" /> Asesmen Baru
        </Button>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => { setActiveDashboardTab("asesmen"); setMessage(null); }}
          className={`flex items-center gap-2 pb-3 px-5 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeDashboardTab === "asesmen"
              ? "border-teal-600 text-teal-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Asesmen Harian
        </button>
        <button
          onClick={() => { setActiveDashboardTab("diagnostik"); setMessage(null); }}
          className={`flex items-center gap-2 pb-3 px-5 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
            activeDashboardTab === "diagnostik"
              ? "border-teal-600 text-teal-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FileUp className="w-4 h-4" />
          Koordinasi Tes Diagnostik
        </button>
      </div>

      {activeDashboardTab === "asesmen" ? (
        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Daftar Asesmen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[620px] overflow-y-auto">
              {assessments.map((assessment) => (
                <button
                  key={assessment.id}
                  onClick={() => openAssessment(assessment)}
                  className={`w-full text-left rounded-lg border p-3 transition-all ${
                    selectedId === assessment.id
                      ? "border-teal-300 bg-teal-50 text-teal-900"
                      : "border-gray-200 bg-white hover:border-teal-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm">{assessment.title}</span>
                    <Badge variant={statusVariant(assessment.status)} className="text-[10px]">
                      {assessment.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {assessment.assessmentDate} - {assessment.subject}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {assessment.results.length} siswa, {assessment.teacherRecipients.length} guru
                  </p>
                </button>
              ))}
              {assessments.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">Belum ada asesmen Eval.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-xl text-teal-800">
                    {selectedAssessment ? "Edit Asesmen Eval" : "Asesmen Eval Baru"}
                  </CardTitle>
                  {selectedAssessment?.reviewNote && (
                    <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg p-2 mt-2">
                      Catatan review: {selectedAssessment.reviewNote}
                    </p>
                  )}
                </div>
                {selectedAssessment && <Badge variant={statusVariant(selectedAssessment.status)}>{selectedAssessment.status}</Badge>}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              {message && (
                <div className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm text-teal-800">
                  {message}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Judul Asesmen</label>
                  <input
                    disabled={!isEditable}
                    className="w-full border rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Kuis Integral / TO UTBK Paket 1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipe</label>
                  <select
                    disabled={!isEditable}
                    className="w-full border rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
                    value={form.assessmentType}
                    onChange={(e) => setForm({ ...form, assessmentType: e.target.value as EvaluationType })}
                  >
                    {ASSESSMENT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Mata Pelajaran</label>
                  <input
                    disabled={!isEditable}
                    className="w-full border rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Matematika"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tanggal</label>
                  <input
                    disabled={!isEditable}
                    type="date"
                    className="w-full border rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
                    value={form.assessmentDate}
                    onChange={(e) => setForm({ ...form, assessmentDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Program</label>
                  <select
                    disabled={!isEditable}
                    className="w-full border rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value, className: "" })}
                  >
                    <option value="">Semua Program</option>
                    {programs.map((program) => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Kelas</label>
                  <select
                    disabled={!isEditable}
                    className="w-full border rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
                    value={form.className}
                    onChange={(e) => setForm({ ...form, className: e.target.value })}
                  >
                    <option value="">Semua Kelas</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Keterangan / Deskripsi</label>
                <textarea
                  disabled={!isEditable}
                  className="w-full border rounded-md p-2 text-sm bg-white disabled:bg-gray-100"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Keterangan tambahan..."
                  rows={2}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Bagikan ke Guru (Teacher Recipients)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teachers.map((teacher) => {
                    const isSelected = selectedTeacherIds.has(teacher.id);
                    return (
                      <button
                        key={teacher.id}
                        disabled={!isEditable}
                        onClick={() => {
                          setSelectedTeacherIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(teacher.id)) {
                              next.delete(teacher.id);
                            } else {
                              next.add(teacher.id);
                            }
                            return next;
                          });
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isSelected
                            ? "bg-teal-50 border-teal-300 text-teal-800 font-semibold"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {teacher.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4" />
                  Isi Feedback & Nilai Siswa
                </h3>
                <div className="space-y-3">
                  {filteredStudents.map((student) => {
                    const draft = resultDrafts[student.id] || { studentId: student.id, score: "", qualitativeFeedback: "" };
                    return (
                      <div key={student.id} className="p-3 bg-gray-50/50 border rounded-lg flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="md:w-1/3">
                          <span className="font-semibold text-sm text-gray-900 block">{student.name}</span>
                          <span className="text-[10px] text-gray-500">{student.program} {student.className && `• ${student.className}`}</span>
                        </div>
                        <div className="flex gap-2 items-center md:w-24">
                          <input
                            disabled={!isEditable}
                            type="number"
                            className="w-full border rounded p-1 text-sm bg-white text-center"
                            value={draft.score}
                            onChange={(e) => updateResult(student.id, { score: e.target.value })}
                            placeholder="Nilai"
                            min={0}
                            max={100}
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            disabled={!isEditable}
                            className="w-full border rounded p-1 text-sm bg-white"
                            value={draft.qualitativeFeedback}
                            onChange={(e) => updateResult(student.id, { qualitativeFeedback: e.target.value })}
                            placeholder="Feedback kualitatif..."
                          />
                        </div>
                      </div>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <p className="text-center text-sm text-gray-500 py-8">Tidak ada siswa pada filter ini.</p>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-gray-50/60 flex justify-end gap-2">
              {!isEditable && (
                <p className="text-sm text-gray-500 mr-auto">Asesmen yang sudah submitted/published tidak bisa diedit oleh Eval.</p>
              )}
              {isEditable && (
                <>
                  <Button variant="outline" onClick={saveDraft} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" /> Simpan Draft
                  </Button>
                  <Button onClick={submitForReview} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Send className="w-4 h-4 mr-2" /> Submit Review
                  </Button>
                </>
              )}
              {selectedAssessment && (
                <Button variant="outline" onClick={() => openAssessment(selectedAssessment)}>
                  <Edit className="w-4 h-4 mr-2" /> Muat Ulang
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {message && (
            <div className="rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm text-teal-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
              {message}
            </div>
          )}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-teal-800 flex items-center gap-2">
                <FileUp className="w-5 h-5" />
                Manajemen Laporan Tes Diagnostik
              </CardTitle>
              <p className="text-xs text-gray-500">
                Unggah hasil tes diagnostik (format berkas .xlsx) untuk setiap angkatan siswa. File ini akan terintegrasi langsung dan dapat diunduh oleh KEnz (Siswa) dan OTK (Orang Tua) yang sesuai tingkat kelasnya.
              </p>
            </CardHeader>
            <CardContent>
              {loadingDiagnostics ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  Memproses laporan diagnostik...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diagnosticReports.map((report) => (
                    <div key={report.grade} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-200 transition-all">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">Siswa Kelas {report.grade}</h4>
                            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Angkatan Tingkat {report.grade}</span>
                          </div>
                          <Badge variant={report.exists ? "success" : "outline"} className="text-[10px] font-semibold px-2 py-0.5">
                            {report.exists ? "Tersedia" : "Belum Ada"}
                          </Badge>
                        </div>
                        
                        {report.exists ? (
                          <div className="mt-3 text-xs text-gray-600 space-y-1 bg-gray-50 p-2.5 rounded-lg border border-gray-100 font-mono">
                            <p className="truncate"><strong>Berkas:</strong> {report.fileName}</p>
                            <p><strong>Ukuran:</strong> {Math.round(report.sizeBytes / 1024 * 10) / 10} KB</p>
                            <p><strong>Pembaruan:</strong> {new Date(report.updatedAt).toLocaleString("id-ID")}</p>
                          </div>
                        ) : (
                          <div className="text-[11px] text-amber-600 italic mt-3 bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex items-center gap-1.5 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            Laporan belum diunggah untuk angkatan ini.
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-2 flex gap-2">
                        {report.exists && (
                          <Button variant="outline" size="sm" asChild className="flex-1 text-xs h-9">
                            <a href={`/Tes Diagnostik/${report.fileName}`} download>
                              <Download className="w-3.5 h-3.5 mr-1" /> Unduh
                            </a>
                          </Button>
                        )}
                        <div className="relative flex-1">
                          <input
                            type="file"
                            accept=".xlsx"
                            id={`file-upload-${report.grade}`}
                            className="hidden"
                            disabled={uploadingGrade !== null}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadDiagnostic(report.grade, file);
                              }
                            }}
                          />
                          <Button
                            variant={report.exists ? "secondary" : "default"}
                            size="sm"
                            className={`w-full text-xs h-9 ${!report.exists && "bg-teal-600 hover:bg-teal-700 text-white"}`}
                            disabled={uploadingGrade !== null}
                            onClick={() => document.getElementById(`file-upload-${report.grade}`)?.click()}
                          >
                            {uploadingGrade === report.grade ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                                Mengunggah...
                              </>
                            ) : (
                              <>
                                <FileUp className="w-3.5 h-3.5 mr-1" />
                                {report.exists ? "Ganti File" : "Unggah Excel"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
