"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  getSchedules,
  updateScheduleStatus,
  setSchedulesArchived,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  deleteSchedulesBulk,
  getUsers,
  getPrograms,
  getStudents,
  rejectReportWithNote,
} from "@/app/actions";
import { Schedule, User, Student, HonorType, ClassMode } from "@/lib/types";
import { isWithinWorkHours, getDefaultKangGuruHonor } from "@/lib/honor";
import StudentProgressView from "@/components/student-progress-view";
import ParentLinkModal from "@/components/dashboards/parent-link-modal";
import StudentAccountModal from "@/components/dashboards/student-account-modal";
import EvaluationReviewPanel from "@/components/dashboards/evaluation-review-panel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, FileText, XCircle, Pencil, Trash2, Archive, ArchiveRestore, History, X, Download, Calendar, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

type TimeFilter = "all" | "today" | "week" | "month" | "custom";

function isWithinTimeFilter(
  dateStr: string,
  filter: TimeFilter,
  customStart: string,
  customEnd: string,
): boolean {
  if (filter === "all") return true;

  const todayStr = new Date().toISOString().split("T")[0];

  if (filter === "today") return dateStr === todayStr;

  if (filter === "week") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    return dateStr >= weekAgo.toISOString().split("T")[0] && dateStr <= todayStr;
  }

  if (filter === "month") {
    return dateStr.slice(0, 7) === todayStr.slice(0, 7);
  }

  // custom
  if (customStart && dateStr < customStart) return false;
  if (customEnd && dateStr > customEnd) return false;
  return true;
}
import TeacherDataTab from "@/components/dashboards/teacher-data-tab";
const SUBJECTS = [
  "Antropologi",
  "Astronomi",
  "Biologi",
  "Ekonomi",
  "Fisika",
  "Geografi",
  "Informatika",
  "Kebumian",
  "Kemampuan Memahami Bacaan dan Menulis",
  "Kimia",
  "Lit. Bahasa Indonesia",
  "Lit. Bahasa Inggris",
  "Matematika Lanjut",
  "Matematika Wajib",
  "Numerasi",
  "Penalaran Matematika",
  "Penalaran Umum",
  "Pengetahuan dan Pemahaman Umum",
  "Pengetahuan Kuantitatif",
  "PKN",
  "Sejarah",
  "Sosiologi",
];

type AcademicTab = "jadwal" | "siswa" | "guru" | "eval";

const ACADEMIC_TABS: { id: AcademicTab; label: string }[] = [
  { id: "jadwal", label: "Jadwal KBM" },
  { id: "siswa", label: "Data Siswa" },
  { id: "guru", label: "Data Guru" },
  { id: "eval", label: "Review Eval" },
];

export default function AcademicDashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<AcademicTab>("jadwal");
  const [scheduleViewMode, setScheduleViewMode] = useState<"calendar" | "list">("calendar");

  const [isCreating, setIsCreating] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  // "Semua Jadwal" table controls: bulk selection, archive view toggle, time filter.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isArchiving, setIsArchiving] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "15:30",
    program: "ELC",
    subject: "Antropologi",
    topic: "",
    teacherId: "",
    teacherName: "",
    studentIds: [] as string[],
    students: [] as { id: string; name: string }[],
    branch: "Tebet",
    classMode: "OFFLINE" as ClassMode,
  });
  const [revisionModal, setRevisionModal] = useState<{
    open: boolean;
    scheduleId: string;
    note: string;
  } | null>(null);

  // Edit schedule modal state
  const [editModal, setEditModal] = useState<{
    open: boolean;
    schedule: Schedule | null;
    form: {
      date: string;
      startTime: string;
      endTime: string;
      program: string;
      subject: string;
      topic: string;
      teacherId: string;
      teacherName: string;
      studentIds: string[];
      students: { id: string; name: string }[];
      branch: string;
      classMode: ClassMode;
    };
  } | null>(null);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    mode: "single" | "bulk";
    scheduleId?: string;
    scheduleName?: string;
    count?: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    const [allSchedules, allUsers, allPrograms, allStudents] =
      await Promise.all([
        getSchedules(),
        getUsers(),
        getPrograms(),
        getStudents(),
      ]);
    setSchedules(allSchedules);
    const activeTeachers = allUsers.filter((u) => u.role === "TEACHER");
    setTeachers(activeTeachers);
    setPrograms(allPrograms);
    setStudents(allStudents);

    // Set default selected teacher dynamically to the first available teacher from database
    if (activeTeachers.length > 0) {
      setNewSchedule((prev) => {
        if (prev.teacherId === "") {
          return {
            ...prev,
            teacherId: activeTeachers[0].teacherId || "",
            teacherName: activeTeachers[0].name,
          };
        }
        return prev;
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // Keep the selected teacher valid whenever the filter text narrows the
  // visible options (prevents a stale/hidden selection like "Budi Santoso").
  const handleTeacherFilterChange = (value: string) => {
    setTeacherFilter(value);
    const filtered = teachers.filter((t) =>
      t.name.toLowerCase().includes(value.toLowerCase()),
    );
    if (filtered.length > 0 && !filtered.some((t) => t.teacherId === newSchedule.teacherId)) {
      setNewSchedule((prev) => ({
        ...prev,
        teacherId: filtered[0].teacherId || "",
        teacherName: filtered[0].name,
      }));
    }
  };

  // Same idea for the subject filter: keep the selected subject valid.
  const handleSubjectFilterChange = (value: string) => {
    setSubjectFilter(value);
    const filtered = SUBJECTS.filter((s) =>
      s.toLowerCase().includes(value.toLowerCase()),
    );
    if (filtered.length > 0 && !filtered.includes(newSchedule.subject)) {
      setNewSchedule((prev) => ({ ...prev, subject: filtered[0] }));
    }
  };

  // Akademik only sets the KBM details + class mode. Jam kerja, jenis honor
  // (Wajib/100%/50%), and nominal honor are Admin's call — this is just an
  // automatic starting estimate that Admin reviews/adjusts during validasi.
  const selectedTeacher = teachers.find((t) => t.teacherId === newSchedule.teacherId);
  const withinWorkHours = isWithinWorkHours(
    newSchedule.startTime,
    selectedTeacher?.workStartTime,
    selectedTeacher?.workEndTime,
  );
  const isTetap = selectedTeacher?.teacherType === "TETAP";
  const estimatedHonorType: HonorType = isTetap ? (withinWorkHours ? "WAJIB" : "FULL") : "FULL";
  const estimatedHonorAmount = isTetap
    ? 0
    : getDefaultKangGuruHonor(newSchedule.program, newSchedule.classMode);

  const handleCreate = async () => {
    await createSchedule({
      ...newSchedule,
      honorType: estimatedHonorType,
      honorAmount: estimatedHonorAmount,
    });
    setIsCreating(false);
    loadData();
  };

  const handleVerify = async (id: string, approve: boolean) => {
    if (approve) {
      await updateScheduleStatus(id, "WAITING_VALIDATION");
      loadData();
    } else {
      setRevisionModal({
        open: true,
        scheduleId: id,
        note: "",
      });
    }
  };

  const submitRevisionRequest = async () => {
    if (revisionModal && revisionModal.note.trim()) {
      await rejectReportWithNote(revisionModal.scheduleId, revisionModal.note);
      setRevisionModal(null);
      loadData();
    } else {
      alert("Harap masukkan catatan revisi.");
    }
  };

  const visibleSchedules = schedules
    .filter((s) => (showArchived ? s.archived : !s.archived))
    .filter((s) => isWithinTimeFilter(s.date, timeFilter, customStart, customEnd));

  const allVisibleSelected =
    visibleSchedules.length > 0 && visibleSchedules.every((s) => selectedIds.has(s.id));

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(visibleSchedules.map((s) => s.id)) : new Set());
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const switchArchiveView = (archived: boolean) => {
    setShowArchived(archived);
    setSelectedIds(new Set());
  };

  const handleBulkArchive = async (archived: boolean) => {
    if (selectedIds.size === 0) return;
    setIsArchiving(true);
    try {
      await setSchedulesArchived(Array.from(selectedIds), archived);
      setSelectedIds(new Set());
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengarsipkan jadwal");
    }
    setIsArchiving(false);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditModal({
      open: true,
      schedule,
      form: {
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        program: schedule.program,
        subject: schedule.subject,
        topic: schedule.topic,
        teacherId: schedule.teacherId,
        teacherName: schedule.teacherName,
        studentIds: schedule.studentIds || [],
        students: schedule.students || [],
        branch: schedule.branch,
        classMode: schedule.classMode,
      },
    });
  };

  const handleDeleteSingle = (schedule: Schedule) => {
    setDeleteConfirm({
      open: true,
      mode: "single",
      scheduleId: schedule.id,
      scheduleName: `${schedule.date} - ${schedule.teacherName} (${schedule.program})`,
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setDeleteConfirm({
      open: true,
      mode: "bulk",
      count: selectedIds.size,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      if (deleteConfirm.mode === "single" && deleteConfirm.scheduleId) {
        await deleteSchedule(deleteConfirm.scheduleId);
      } else {
        await deleteSchedulesBulk(Array.from(selectedIds));
        setSelectedIds(new Set());
      }
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus jadwal");
    }
    setIsDeleting(false);
    setDeleteConfirm(null);
  };

  const handleUpdateSchedule = async () => {
    if (!editModal?.schedule) return;
    try {
      await updateSchedule(editModal.schedule.id, editModal.form);
      setEditModal(null);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengupdate jadwal");
    }
  };

  if (loading) return <div className="p-4">Memuat data akademik...</div>;

  const toVerify = schedules.filter((s) => s.status === "WAITING_VERIFICATION");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 card-3d p-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-teal-800">
            Dashboard Akademik
          </h2>
          <p className="text-gray-500">
            Kelola jadwal, verifikasi laporan, dan data siswa.
          </p>
        </div>
        <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200">
          {ACADEMIC_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "jadwal" && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 p-4 rounded-xl border border-gray-200/50 mb-2">
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-sm shrink-0">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  scheduleViewMode === "calendar"
                    ? "bg-white text-teal-700 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setScheduleViewMode("calendar")}
              >
                <Calendar className="w-4 h-4" /> Kalender KBM
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  scheduleViewMode === "list"
                    ? "bg-white text-teal-700 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setScheduleViewMode("list")}
              >
                <FileText className="w-4 h-4" /> Daftar Jadwal
              </button>
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="btn-3d h-[40px] px-4 rounded-lg text-sm flex items-center shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" /> Buat Jadwal Baru
            </button>
          </div>

          {scheduleViewMode === "calendar" && (
            <div className="card-3d p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-teal-700" />
                <h3 className="text-lg font-bold text-teal-800">Visualisasi Jadwal KBM</h3>
              </div>
              <KbmCalendarView schedules={schedules} onVerify={handleVerify} />
            </div>
          )}

          {isCreating && (
            <div className="card-3d bg-teal-50/50 border-teal-200">
              <CardHeader>
                <CardTitle className="text-teal-800">
                  Buat Jadwal KBM Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Guru</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-sm bg-white mb-1"
                    placeholder="Cari nama guru..."
                    value={teacherFilter}
                    onChange={(e) => handleTeacherFilterChange(e.target.value)}
                  />
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={newSchedule.teacherId}
                    onChange={(e) => {
                      const t = teachers.find(
                        (t) => t.teacherId === e.target.value,
                      );
                      setNewSchedule({
                        ...newSchedule,
                        teacherId: e.target.value,
                        teacherName: t?.name || "",
                      });
                    }}
                  >
                    {teachers
                      .filter((t) =>
                        t.name.toLowerCase().includes(teacherFilter.toLowerCase()),
                      )
                      .map((t) => (
                        <option key={t.teacherId} value={t.teacherId}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={newSchedule.date}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Jam Mulai - Selesai
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      className="w-full border rounded-md p-2 text-sm bg-white"
                      value={newSchedule.startTime}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          startTime: e.target.value,
                        })
                      }
                    />
                    <input
                      type="time"
                      className="w-full border rounded-md p-2 text-sm bg-white"
                      value={newSchedule.endTime}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          endTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Program & Mata Pelajaran
                  </label>
                  <div className="flex items-start gap-2">
                    <select
                      className="w-1/3 border rounded-md p-2 text-sm bg-white"
                      value={newSchedule.program}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          program: e.target.value,
                        })
                      }
                    >
                      {programs.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <div className="w-2/3 space-y-1">
                      <input
                        type="text"
                        className="w-full border rounded-md p-2 text-sm bg-white"
                        placeholder="Cari mata pelajaran..."
                        value={subjectFilter}
                        onChange={(e) => handleSubjectFilterChange(e.target.value)}
                      />
                      <select
                        className="w-full border rounded-md p-2 text-sm bg-white"
                        value={newSchedule.subject}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            subject: e.target.value,
                          })
                        }
                      >
                        {SUBJECTS.filter((s) =>
                          s.toLowerCase().includes(subjectFilter.toLowerCase())
                        ).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Mode Kelas
                  </label>
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={newSchedule.classMode}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        classMode: e.target.value as ClassMode,
                      })
                    }
                  >
                    <option value="OFFLINE">Offline</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Cabang
                  </label>
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={newSchedule.branch}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        branch: e.target.value,
                      })
                    }
                  >
                    <option value="Tebet">Tebet</option>
                    <option value="Kuningan">Kuningan</option>
                    <option value="Depok">Depok</option>
                    <option value="Bekasi">Bekasi</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Estimasi Honor
                  </label>
                  <p className="text-sm bg-gray-50 border border-gray-200 text-gray-700 rounded-md p-2">
                    {isTetap
                      ? withinWorkHours
                        ? "Sesi Wajib — tidak ada honor tambahan (sudah termasuk gaji pokok)."
                        : "Diluar jam kerja guru ini — jenis & nominal honor akan ditentukan Admin saat validasi."
                      : `Rp ${estimatedHonorAmount.toLocaleString("id-ID")} (default, dapat disesuaikan Admin saat validasi).`}
                  </p>
                </div>

                {(newSchedule.program === "ELC" ||
                  newSchedule.program === "Privat") && (
                  <div className="md:col-span-2 border-t pt-3 mt-1">
                    <label className="text-sm font-medium mb-2 block text-teal-700">
                      Pilih Siswa (Khusus ELC / Privat) — bisa manual per
                      siswa atau sekaligus per kelas
                    </label>
                    {(() => {
                      const programStudents = students.filter(
                        (s) => s.program === newSchedule.program,
                      );
                      const groups = new Map<string, Student[]>();
                      programStudents.forEach((s) => {
                        const key = s.className || "Belum Ada Kelas";
                        if (!groups.has(key)) groups.set(key, []);
                        groups.get(key)!.push(s);
                      });

                      const toggleStudent = (s: Student, checked: boolean) => {
                        let newIds = [...newSchedule.studentIds];
                        let newStudents = [...newSchedule.students];
                        if (checked) {
                          if (!newIds.includes(s.id)) {
                            newIds.push(s.id);
                            newStudents.push({ id: s.id, name: s.name });
                          }
                        } else {
                          newIds = newIds.filter((id) => id !== s.id);
                          newStudents = newStudents.filter((st) => st.id !== s.id);
                        }
                        setNewSchedule({ ...newSchedule, studentIds: newIds, students: newStudents });
                      };

                      const toggleClass = (classStudents: Student[], checked: boolean) => {
                        let newIds = [...newSchedule.studentIds];
                        let newStudents = [...newSchedule.students];
                        classStudents.forEach((s) => {
                          if (checked) {
                            if (!newIds.includes(s.id)) {
                              newIds.push(s.id);
                              newStudents.push({ id: s.id, name: s.name });
                            }
                          } else {
                            newIds = newIds.filter((id) => id !== s.id);
                            newStudents = newStudents.filter((st) => st.id !== s.id);
                          }
                        });
                        setNewSchedule({ ...newSchedule, studentIds: newIds, students: newStudents });
                      };

                      return (
                        <div className="space-y-3">
                          {Array.from(groups.entries()).map(([className, classStudents]) => {
                            const selectedCount = classStudents.filter((s) =>
                              newSchedule.studentIds.includes(s.id),
                            ).length;
                            const allSelected = selectedCount === classStudents.length;

                            return (
                              <div key={className} className="bg-white border border-gray-200 rounded-md p-2">
                                <label className="flex items-center space-x-2 cursor-pointer mb-2 pb-2 border-b border-gray-100">
                                  <input
                                    type="checkbox"
                                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                                    checked={allSelected}
                                    onChange={(e) => toggleClass(classStudents, e.target.checked)}
                                  />
                                  <span className="text-sm font-semibold text-teal-700">
                                    Kelas: {className} ({selectedCount}/{classStudents.length} dipilih)
                                  </span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {classStudents.map((s) => (
                                    <label
                                      key={s.id}
                                      className="flex items-center space-x-2 p-1 rounded cursor-pointer hover:bg-teal-50"
                                    >
                                      <input
                                        type="checkbox"
                                        className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                                        checked={newSchedule.studentIds.includes(s.id)}
                                        onChange={(e) => toggleStudent(s, e.target.checked)}
                                      />
                                      <span className="text-sm text-gray-700">{s.name}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    Topik / Materi (Opsional)
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={newSchedule.topic}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, topic: e.target.value })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Batal
                </Button>
                <Button onClick={handleCreate}>
                  Simpan Jadwal & Kirim ke Guru
                </Button>
              </CardFooter>
            </div>
          )}

          {scheduleViewMode === "list" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                  Menunggu Verifikasi ({toVerify.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {toVerify.map((schedule) => (
                    <Card key={schedule.id} className="border-teal-100">
                      <CardHeader className="pb-2 bg-teal-50/50">
                        <div className="flex justify-between">
                          <Badge variant="secondary">{schedule.id}</Badge>
                          <span className="text-sm font-medium text-teal-700">
                            {schedule.teacherName}
                          </span>
                        </div>
                        <CardTitle className="text-md">
                          {schedule.program} - {schedule.subject}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-4 text-sm space-y-2">
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-md">
                          <div>
                            <span className="text-gray-500 block text-xs">
                              Check In
                            </span>
                            <span className="font-medium text-teal-600">
                              {schedule.checkIn?.time || "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">
                              Check Out
                            </span>
                            <span className="font-medium text-teal-600">
                              {schedule.checkOut?.time || "-"}
                            </span>
                          </div>
                        </div>
                        {schedule.report && (
                          <div className="pt-2">
                            <div className="flex items-center font-semibold text-gray-800 mb-1">
                              <FileText className="w-4 h-4 mr-1" /> Laporan Guru
                            </div>
                            <p className="text-gray-600">
                              <span className="font-medium">Materi:</span>{" "}
                              {schedule.report.materialTaught}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Pemahaman:</span>{" "}
                              {schedule.report.understandingLevel}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Keaktifan:</span>{" "}
                              {schedule.report.studentActivity}
                            </p>
                            {schedule.report.studentProgresses &&
                              schedule.report.studentProgresses.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {schedule.report.studentProgresses.map((sp) => (
                                    <div
                                      key={sp.studentId}
                                      className="p-2 bg-teal-50 border border-teal-100 rounded text-teal-800 text-xs"
                                    >
                                      <div className="flex justify-between font-medium mb-1">
                                        <span>{sp.studentName}</span>
                                        <Badge
                                          variant={
                                            sp.attendance === "Hadir"
                                              ? "success"
                                              : "outline"
                                          }
                                          className="text-[10px] px-1 py-0 h-4"
                                        >
                                          {sp.attendance}
                                        </Badge>
                                      </div>
                                      <p className="text-gray-700">
                                        {sp.progress || "Tidak ada catatan"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0 flex gap-2">
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => handleVerify(schedule.id, true)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Setujui
                          Verifikasi
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600 w-full"
                          onClick={() => handleVerify(schedule.id, false)}
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Kembalikan
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                {toVerify.length === 0 && (
                  <p className="text-sm text-gray-500 italic py-4">
                    Semua jadwal telah diverifikasi.
                  </p>
                )}
              </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4 border-b pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Semua Jadwal</h3>
                <div className="flex bg-gray-100/50 p-1 rounded-lg border border-gray-200">
                  <button
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!showArchived ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
                    onClick={() => switchArchiveView(false)}
                  >
                    Aktif ({schedules.filter((s) => !s.archived).length})
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${showArchived ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
                    onClick={() => switchArchiveView(true)}
                  >
                    <Archive className="w-3 h-3" /> Arsip ({schedules.filter((s) => s.archived).length})
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="border rounded-md p-1.5 text-xs bg-white"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                >
                  <option value="all">Semua Waktu</option>
                  <option value="today">Hari Ini</option>
                  <option value="week">7 Hari Terakhir</option>
                  <option value="month">Bulan Ini</option>
                  <option value="custom">Rentang Kustom...</option>
                </select>
                {timeFilter === "custom" && (
                  <div className="flex items-center gap-1">
                    <input
                      type="date"
                      className="border rounded-md p-1.5 text-xs bg-white"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                    />
                    <span className="text-xs text-gray-400">-</span>
                    <input
                      type="date"
                      className="border rounded-md p-1.5 text-xs bg-white"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-4 py-2.5 mb-3">
                <span className="text-sm font-medium text-teal-800">
                  {selectedIds.size} jadwal dipilih
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
                    Batal
                  </Button>
                  {showArchived ? (
                    <Button size="sm" disabled={isArchiving} onClick={() => handleBulkArchive(false)}>
                      <ArchiveRestore className="w-3.5 h-3.5 mr-1.5" /> Pulihkan
                    </Button>
                  ) : (
                    <Button size="sm" disabled={isArchiving} onClick={() => handleBulkArchive(true)}>
                      <Archive className="w-3.5 h-3.5 mr-1.5" /> Arsipkan
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus
                  </Button>
                </div>
              </div>
            )}

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-medium w-10">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                          checked={allVisibleSelected}
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Tanggal</th>
                      <th className="px-4 py-3 font-medium">Guru</th>
                      <th className="px-4 py-3 font-medium">Program</th>
                      <th className="px-4 py-3 font-medium">Jenis Honor</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {visibleSchedules.map((s) => (
                      <tr key={s.id} className={`hover:bg-gray-50 ${selectedIds.has(s.id) ? "bg-teal-50/50" : ""}`}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                            checked={selectedIds.has(s.id)}
                            onChange={(e) => toggleSelectRow(s.id, e.target.checked)}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {s.id}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.date}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {s.teacherName}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {s.program} - {s.subject}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={s.honorType === "WAJIB" ? "secondary" : "outline"}>
                            {s.honorType === "WAJIB"
                              ? "Wajib (0%)"
                              : s.honorType === "HALF"
                                ? "Luar Jam (50%)"
                                : "Luar Jam (100%)"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">
                            {s.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-center">
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit Jadwal"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSingle(s)}
                              className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                              title="Hapus Jadwal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {visibleSchedules.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-500 italic">
                          {showArchived
                            ? "Belum ada jadwal yang diarsipkan."
                            : "Tidak ada jadwal untuk filter waktu ini."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
          )}
        </>
      )}

      {revisionModal?.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg border-amber-200">
            <CardHeader className="bg-amber-50/50">
              <CardTitle className="text-amber-800">Kembalikan Laporan Guru</CardTitle>
              <p className="text-sm text-gray-500">
                Berikan catatan masukan/revisi agar guru mengetahui apa yang harus diperbaiki.
              </p>
            </CardHeader>
            <CardContent className="py-4">
              <label className="text-sm font-medium mb-1 block">Catatan Revisi</label>
              <textarea
                className="w-full border rounded-md p-2 text-sm bg-white"
                rows={4}
                value={revisionModal.note}
                onChange={(e) =>
                  setRevisionModal({
                    ...revisionModal,
                    note: e.target.value,
                  })
                }
                placeholder="Misal: Harap lengkapi materi bab 3 dan kehadiran murid..."
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-gray-50/50">
              <Button variant="outline" onClick={() => setRevisionModal(null)}>
                Batal
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium"
                onClick={submitRevisionRequest}
              >
                Kirim Catatan Revisi
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {editModal?.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-lg border-blue-200 max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-blue-50/50 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-800">Edit Jadwal</CardTitle>
                <button onClick={() => setEditModal(null)} className="p-1 rounded hover:bg-blue-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                ID: {editModal.schedule?.id}
              </p>
            </CardHeader>
            <CardContent className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Tanggal</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={editModal.form.date}
                    onChange={(e) => setEditModal({ ...editModal, form: { ...editModal.form, date: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Cabang</label>
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={editModal.form.branch}
                    onChange={(e) => setEditModal({ ...editModal, form: { ...editModal.form, branch: e.target.value } })}
                  >
                    {["Tebet", "Depok", "Kuningan", "Bekasi"].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Jam Mulai</label>
                  <input
                    type="time"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={editModal.form.startTime}
                    onChange={(e) => setEditModal({ ...editModal, form: { ...editModal.form, startTime: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Jam Selesai</label>
                  <input
                    type="time"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={editModal.form.endTime}
                    onChange={(e) => setEditModal({ ...editModal, form: { ...editModal.form, endTime: e.target.value } })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Program</label>
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={editModal.form.program}
                    onChange={(e) => setEditModal({ ...editModal, form: { ...editModal.form, program: e.target.value } })}
                  >
                    {programs.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Mode Kelas</label>
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={editModal.form.classMode}
                    onChange={(e) => setEditModal({ ...editModal, form: { ...editModal.form, classMode: e.target.value as ClassMode } })}
                  >
                    <option value="OFFLINE">Offline</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Guru</label>
                <select
                  className="w-full border rounded-md p-2 text-sm bg-white"
                  value={editModal.form.teacherId}
                  onChange={(e) => {
                    const teacher = teachers.find((t) => t.id === e.target.value);
                    setEditModal({
                      ...editModal,
                      form: {
                        ...editModal.form,
                        teacherId: e.target.value,
                        teacherName: teacher?.name || editModal.form.teacherName,
                      },
                    });
                  }}
                >
                  <option value="">-- Pilih Guru --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Mata Pelajaran</label>
                <select
                  className="w-full border rounded-md p-2 text-sm bg-white"
                  value={editModal.form.subject}
                  onChange={(e) => setEditModal({ ...editModal, form: { ...editModal.form, subject: e.target.value } })}
                >
                  {SUBJECTS.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Topik / Materi</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 text-sm bg-white"
                  value={editModal.form.topic}
                  onChange={(e) => setEditModal({ ...editModal, form: { ...editModal.form, topic: e.target.value } })}
                  placeholder="Topik pembahasan (opsional)"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Siswa</label>
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto bg-white space-y-1">
                  {students
                    .filter((st) => !editModal.form.program || st.program === editModal.form.program)
                    .map((st) => (
                      <label key={st.id} className="flex items-center gap-2 text-sm py-0.5 hover:bg-gray-50 px-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
                          checked={editModal.form.studentIds.includes(st.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const newStudentIds = checked
                              ? [...editModal.form.studentIds, st.id]
                              : editModal.form.studentIds.filter((sid) => sid !== st.id);
                            const newStudents = checked
                              ? [...editModal.form.students, { id: st.id, name: st.name }]
                              : editModal.form.students.filter((s) => s.id !== st.id);
                            setEditModal({
                              ...editModal,
                              form: { ...editModal.form, studentIds: newStudentIds, students: newStudents },
                            });
                          }}
                        />
                        {st.name}
                        {st.className && <span className="text-xs text-gray-400">({st.className})</span>}
                      </label>
                    ))}
                  {students.filter((st) => !editModal.form.program || st.program === editModal.form.program).length === 0 && (
                    <p className="text-xs text-gray-400 italic py-1">Tidak ada siswa di program ini</p>
                  )}
                </div>
                {editModal.form.studentIds.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{editModal.form.studentIds.length} siswa dipilih</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-gray-50/50 sticky bottom-0">
              <Button variant="outline" onClick={() => setEditModal(null)}>
                Batal
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                onClick={handleUpdateSchedule}
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" /> Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm?.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm shadow-lg border-red-200">
            <CardHeader className="bg-red-50/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-red-800">Konfirmasi Hapus</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              {deleteConfirm.mode === "single" ? (
                <p className="text-sm text-gray-700">
                  Apakah Anda yakin ingin menghapus jadwal berikut?
                  <br />
                  <span className="font-medium text-gray-900 mt-1 block">{deleteConfirm.scheduleName}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-700">
                  Apakah Anda yakin ingin menghapus <span className="font-bold text-red-700">{deleteConfirm.count}</span> jadwal yang dipilih?
                </p>
              )}
              <p className="text-xs text-red-500 mt-2">
                ⚠️ Tindakan ini tidak dapat dibatalkan. Data laporan terkait juga akan dihapus.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-gray-50/50">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={isDeleting}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Menghapus..." : "Hapus Permanen"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {activeTab === "siswa" && (
        <StudentDataTab
          students={students}
          programs={programs}
          onStudentCreated={loadData}
        />
      )}

      {activeTab === "guru" && (
        <TeacherDataTab teachers={teachers} onTeacherUpdated={loadData} />
      )}

      {activeTab === "eval" && <EvaluationReviewPanel />}
    </div>
  );
}

// Class names are always built as "<Tingkat> <Program> <Nomor>" (e.g. "12 ELC 1",
// "12 ELC 2") instead of free text, so every class is consistent and easy to find
// when a teacher is tracking/evaluating a specific cohort.
const GRADE_LEVELS = ["7", "8", "9", "10", "11", "12"];

function buildClassName(grade: string, program: string, number: number) {
  return `${grade} ${program} ${number}`;
}

function parseClassName(className: string | undefined, program: string) {
  if (!className) return null;
  const escapedProgram = program.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = className.match(new RegExp(`^(\\d+)\\s+${escapedProgram}\\s+(\\d+)$`));
  if (!match) return null;
  return { grade: match[1], number: Number(match[2]) };
}

function nextClassNumber(students: Student[], program: string, grade: string) {
  const numbers = students
    .map((s) => parseClassName(s.className, s.program))
    .filter(
      (p, i): p is { grade: string; number: number } =>
        !!p && students[i].program === program && p.grade === grade,
    )
    .map((p) => p.number);
  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}

function StudentDataTab({
  students,
  programs,
  onStudentCreated,
}: {
  students: Student[];
  programs: string[];
  onStudentCreated: () => void;
}) {
  const defaultGrade = GRADE_LEVELS[GRADE_LEVELS.length - 1];
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  const [parentLinkStudent, setParentLinkStudent] = useState<Student | null>(null);
  const [accountStudent, setAccountStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    program: programs[0] || "ELC",
    grade: defaultGrade,
    classNumber: 1,
  });
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // The form lives at the top of this tab, above the class list — without
  // this, clicking Edit on a student far down the (potentially long) list
  // opens the form off-screen and looks like the button did nothing.
  useEffect(() => {
    if (isCreating) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isCreating, editingId]);

  const resetForm = () => {
    const program = programs[0] || "ELC";
    setFormData({
      name: "",
      program,
      grade: defaultGrade,
      classNumber: nextClassNumber(students, program, defaultGrade),
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleProgramOrGradeChange = (partial: { program?: string; grade?: string }) => {
    const merged = { ...formData, ...partial };
    if (!editingId) {
      merged.classNumber = nextClassNumber(students, merged.program, merged.grade);
    }
    setFormData(merged);
  };

  const handleEdit = (s: Student) => {
    const parsed = parseClassName(s.className, s.program);
    setFormData({
      name: s.name,
      program: s.program,
      grade: parsed?.grade || defaultGrade,
      classNumber: parsed?.number || 1,
    });
    setEditingId(s.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data siswa ini?")) return;
    const { deleteStudent } = await import("@/app/actions");
    await deleteStudent(id);
    onStudentCreated();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.program) return;
    setLoading(true);
    const { createStudent, updateStudent } = await import("@/app/actions");
    const payload = {
      name: formData.name,
      program: formData.program,
      className: buildClassName(formData.grade, formData.program, formData.classNumber),
    };

    if (editingId) {
      await updateStudent(editingId, payload);
    } else {
      await createStudent(payload);
    }

    resetForm();
    setLoading(false);
    onStudentCreated();
  };

  const previewClassName = buildClassName(formData.grade, formData.program, formData.classNumber);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/api/students/report-all?format=pdf" download>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Unduh Semua (PDF)
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/api/students/report-all?format=docx" download>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Unduh Semua (DOCX)
            </a>
          </Button>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Siswa Baru
        </Button>
      </div>

      {isCreating && (
        <Card ref={formRef} className="bg-teal-50 border-teal-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-teal-800">
              {editingId ? "Edit Data Siswa" : "Data Siswa Baru"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nama Siswa
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nama lengkap..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Program Belajar
              </label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.program}
                onChange={(e) =>
                  handleProgramOrGradeChange({ program: e.target.value })
                }
              >
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Tingkat
              </label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.grade}
                onChange={(e) =>
                  handleProgramOrGradeChange({ grade: e.target.value })
                }
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    Kelas {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nomor Rombel
              </label>
              <input
                type="number"
                min={1}
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.classNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    classNumber: Math.max(1, Number(e.target.value) || 1),
                  })
                }
              />
            </div>
            <div className="sm:col-span-4 text-sm text-teal-800 bg-white border border-teal-100 rounded-md p-2">
              Nama kelas yang akan tersimpan:{" "}
              <span className="font-semibold">{previewClassName}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-teal-100 pt-4">
            <Button
              variant="outline"
              className="text-teal-700 border-teal-200"
              onClick={resetForm}
            >
              Batal
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleSave}
              disabled={loading}
            >
              Simpan Siswa
            </Button>
          </CardFooter>
        </Card>
      )}

      {programs.map((prog) => {
        const progStudents = students.filter((s) => s.program === prog);
        if (progStudents.length === 0) return null;

        const groups = new Map<string, Student[]>();
        progStudents.forEach((s) => {
          const key = s.className || "Belum Ada Kelas";
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(s);
        });

        const sortedClassNames = Array.from(groups.keys()).sort((a, b) => {
          const pa = parseClassName(a, prog);
          const pb = parseClassName(b, prog);
          if (pa && pb) {
            return Number(pa.grade) - Number(pb.grade) || pa.number - pb.number;
          }
          if (pa) return -1;
          if (pb) return 1;
          return a.localeCompare(b);
        });

        return (
          <div key={prog} className="mt-6">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">
              Program: {prog}
            </h3>
            <div className="space-y-4">
              {sortedClassNames.map((className) => (
                <div key={className}>
                  <h4 className="text-sm font-bold text-teal-700 mb-2">
                    Kelas: {className} ({groups.get(className)!.length} siswa)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {groups.get(className)!.map((student) => (
                      <Card
                        key={student.id}
                        className="p-4 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              ID: {student.id}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-gray-50 shrink-0">
                            {prog}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setHistoryStudent(student)}
                          >
                            <History className="w-3.5 h-3.5 mr-1" /> Riwayat
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEdit(student)}
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                          </Button>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setAccountStudent(student)}
                          >
                            Kelola Akun Siswa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setParentLinkStudent(student)}
                          >
                            Kelola Orang Tua
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {historyStudent && (
        <StudentHistoryModal
          student={historyStudent}
          onClose={() => setHistoryStudent(null)}
        />
      )}

      {parentLinkStudent && (
        <ParentLinkModal
          student={parentLinkStudent}
          onClose={() => setParentLinkStudent(null)}
        />
      )}

      {accountStudent && (
        <StudentAccountModal
          student={accountStudent}
          onClose={() => setAccountStudent(null)}
          onAccountCreated={onStudentCreated}
        />
      )}
    </div>
  );
}

function StudentHistoryModal({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{student.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{student.program}</Badge>
                {student.className && (
                  <Badge variant="secondary">{student.className}</Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto shrink min-h-0">
          <StudentProgressView student={student} />
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-4 shrink-0">
          <Button variant="outline" asChild>
            <a href={`/api/students/${student.id}/report?format=pdf`} download>
              <Download className="w-4 h-4 mr-2" /> Unduh PDF
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`/api/students/${student.id}/report?format=docx`} download>
              <Download className="w-4 h-4 mr-2" /> Unduh DOCX
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface CalendarEvent {
  schedule: Schedule;
  top: number;
  height: number;
  left: number;
  width: number;
}

const INDO_DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const INDO_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function getWeekDates(monday: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    dates.push(nextDate);
  }
  return dates;
}

function formatDayName(date: Date): string {
  return INDO_DAYS[date.getDay()];
}

function formatLocalDate(date: Date): string {
  return `${date.getDate()} ${INDO_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function getStatusBadgeStyle(status: Schedule["status"]): string {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "WAITING_APPROVAL":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "APPROVED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "REJECTED":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "WAITING_VERIFICATION":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "VERIFIED":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "WAITING_VALIDATION":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "VALIDATED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "PAID":
      return "bg-sky-100 text-sky-800 border-sky-200";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getProgramColor(program: string): string {
  switch (program) {
    case "ELC":
      return "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80";
    case "TPS":
      return "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100/80";
    case "OSN":
      return "bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100/80";
    case "PM":
      return "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100/80";
    case "Privat":
      return "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100/80";
    case "TKA":
      return "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100/80";
    default:
      return "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100/80";
  }
}

function layoutDaySchedules(daySchedules: Schedule[]): CalendarEvent[] {
  const events: CalendarEvent[] = daySchedules.map(s => {
    const [startH, startM] = s.startTime.split(":").map(Number);
    const [endH, endM] = s.endTime.split(":").map(Number);
    
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    
    const gridStart = 7 * 60; // 07:00
    const gridEnd = 21 * 60; // 21:00
    const totalDuration = gridEnd - gridStart; // 840 mins
    
    const sMins = Math.max(gridStart, Math.min(gridEnd, startMins));
    const eMins = Math.max(gridStart, Math.min(gridEnd, endMins));
    
    const top = ((sMins - gridStart) / totalDuration) * 100;
    const height = Math.max(4, ((eMins - sMins) / totalDuration) * 100);
    
    return {
      schedule: s,
      top,
      height,
      left: 0,
      width: 100,
    };
  });

  events.sort((a, b) => a.top - b.top);
  
  const groups: CalendarEvent[][] = [];
  events.forEach(event => {
    let placed = false;
    for (const group of groups) {
      const overlaps = group.some(ge => {
        const aStart = event.top;
        const aEnd = event.top + event.height;
        const bStart = ge.top;
        const bEnd = ge.top + ge.height;
        return aStart < bEnd && aEnd > bStart;
      });
      if (overlaps) {
        group.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      groups.push([event]);
    }
  });

  groups.forEach(group => {
    const columns: CalendarEvent[][] = [];
    group.forEach(event => {
      let colIdx = 0;
      while (true) {
        if (!columns[colIdx]) {
          columns[colIdx] = [event];
          break;
        }
        const colOverlaps = columns[colIdx].some(ce => {
          const aStart = event.top;
          const aEnd = event.top + event.height;
          const bStart = ce.top;
          const bEnd = ce.top + ce.height;
          return aStart < bEnd && aEnd > bStart;
        });
        if (!colOverlaps) {
          columns[colIdx].push(event);
          break;
        }
        colIdx++;
      }
    });

    const totalCols = columns.length;
    columns.forEach((col, colIdx) => {
      col.forEach(event => {
        event.left = (colIdx / totalCols) * 100;
        event.width = (1 / totalCols) * 100;
      });
    });
  });

  return events;
}

function KbmCalendarView({
  schedules,
  onVerify,
}: {
  schedules: Schedule[];
  onVerify: (id: string, approve: boolean) => Promise<void>;
}) {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<"day" | "week">("week");
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);

  const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00 - 21:00

  const navigate = (direction: "prev" | "next") => {
    const newDate = new Date(calendarDate);
    const offset = viewType === "day" ? 1 : 7;
    if (direction === "prev") {
      newDate.setDate(calendarDate.getDate() - offset);
    } else {
      newDate.setDate(calendarDate.getDate() + offset);
    }
    setCalendarDate(newDate);
  };

  const getDays = () => {
    if (viewType === "day") {
      return [calendarDate];
    } else {
      const mon = getMonday(calendarDate);
      return getWeekDates(mon);
    }
  };

  const getDateLabel = () => {
    if (viewType === "day") {
      return `${formatDayName(calendarDate)}, ${formatLocalDate(calendarDate)}`;
    } else {
      const monday = getMonday(calendarDate);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      if (monday.getMonth() === sunday.getMonth() && monday.getFullYear() === sunday.getFullYear()) {
        return `${monday.getDate()} - ${sunday.getDate()} ${INDO_MONTHS[monday.getMonth()]} ${monday.getFullYear()}`;
      } else if (monday.getFullYear() === sunday.getFullYear()) {
        return `${monday.getDate()} ${INDO_MONTHS[monday.getMonth()]} - ${sunday.getDate()} ${INDO_MONTHS[sunday.getMonth()]} ${monday.getFullYear()}`;
      } else {
        return `${monday.getDate()} ${INDO_MONTHS[monday.getMonth()]} ${monday.getFullYear()} - ${sunday.getDate()} ${INDO_MONTHS[sunday.getMonth()]} ${sunday.getFullYear()}`;
      }
    }
  };

  const days = getDays();

  return (
    <div className="space-y-4">
      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("prev")}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCalendarDate(new Date())}
            className="h-8 px-3 text-xs font-semibold"
          >
            Hari Ini
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("next")}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-sm font-bold text-teal-800 ml-2">
            {getDateLabel()}
          </span>
        </div>

        <div className="flex bg-gray-200/60 p-0.5 rounded-lg border border-gray-300/40">
          <button
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewType === "day"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
            onClick={() => setViewType("day")}
          >
            Hari
          </button>
          <button
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewType === "week"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
            onClick={() => setViewType("week")}
          >
            Minggu
          </button>
        </div>
      </div>

      {/* Main Calendar View Container */}
      <div className="flex bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        {/* Hour Axis Column */}
        <div className="w-14 flex-shrink-0 bg-gray-50/50 border-r border-gray-200 pt-[45px] pb-4">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-[60px] text-right pr-2 text-[10px] font-bold text-gray-400 select-none -mt-[6px]"
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Days Columns Body */}
        <div className="flex-1 flex overflow-x-auto divide-x divide-gray-200">
          {days.map((day) => {
            const dayStr = getLocalDateString(day);
            const daySchedules = schedules.filter(
              (s) => s.date === dayStr && !s.archived
            );
            const positionedEvents = layoutDaySchedules(daySchedules);
            const isToday = getLocalDateString(new Date()) === dayStr;

            return (
              <div
                key={dayStr}
                className={`flex-1 min-w-[120px] flex flex-col ${
                  isToday ? "bg-teal-50/10" : ""
                }`}
              >
                {/* Column Day Header */}
                <div
                  className={`h-[45px] flex flex-col items-center justify-center border-b border-gray-200 sticky top-0 bg-white z-10 py-1 ${
                    isToday ? "bg-teal-50/55" : ""
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase ${
                      isToday ? "text-teal-700" : "text-gray-400"
                    }`}
                  >
                    {formatDayName(day)}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full mt-0.5 min-w-[20px] text-center ${
                      isToday ? "bg-teal-600 text-white" : "text-gray-800"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>

                {/* Day Body with 14 hours block height */}
                <div
                  className="relative bg-white/50"
                  style={{ height: `${14 * 60}px` }}
                >
                  {/* Grid Lines */}
                  {Array.from({ length: 14 }).map((_, hIdx) => (
                    <div
                      key={hIdx}
                      className="absolute left-0 right-0 border-b border-gray-100/70"
                      style={{ top: `${(hIdx + 1) * 60}px` }}
                    />
                  ))}

                  {/* Absolute Cards */}
                  {positionedEvents.map((evt) => {
                    const s = evt.schedule;
                    const colorClass = getProgramColor(s.program);
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedEvent(s)}
                        className={`absolute rounded-lg border p-1.5 text-left transition-all shadow-sm ${colorClass} select-none group text-xs cursor-pointer flex flex-col justify-between`}
                        style={{
                          top: `${evt.top}%`,
                          height: `${evt.height}%`,
                          left: `${evt.left}%`,
                          width: `${evt.width - 1.5}%`,
                          zIndex: 5,
                        }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 font-extrabold truncate text-[10px] leading-tight mb-0.5">
                            <span className="truncate">{s.program} - {s.subject}</span>
                          </div>
                          <div className="text-[9px] truncate text-black/60 font-medium leading-none">
                            {s.teacherName}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-1 text-[8px] font-semibold pt-1 border-t border-black/5 leading-none">
                          <span className="opacity-75">{s.startTime}</span>
                          <span className="opacity-90">{s.classMode}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details modal */}
      {selectedEvent && (
        <ScheduleDetailModal
          schedule={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onVerify={onVerify}
        />
      )}
    </div>
  );
}

function ScheduleDetailModal({
  schedule,
  onClose,
  onVerify,
}: {
  schedule: Schedule;
  onClose: () => void;
  onVerify: (id: string, approve: boolean) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (approve: boolean) => {
    setLoading(true);
    try {
      await onVerify(schedule.id, approve);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const parsedDate = new Date(schedule.date);
  const formattedDate = `${formatDayName(parsedDate)}, ${formatLocalDate(parsedDate)}`;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg shadow-2xl border-teal-100 flex flex-col max-h-[90vh]">
        <CardHeader className="bg-teal-50/50 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Badge variant="outline" className="bg-white border-teal-200 text-teal-800 font-bold">
                  {schedule.id}
                </Badge>
                <Badge className={getStatusBadgeStyle(schedule.status)}>
                  {schedule.status.replace("_", " ")}
                </Badge>
                <Badge variant="secondary">
                  {schedule.classMode}
                </Badge>
              </div>
              <CardTitle className="text-xl text-teal-800 font-extrabold">
                {schedule.program} - {schedule.subject}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-gray-500 hover:text-gray-800 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 py-4 overflow-y-auto shrink text-sm">
          {/* Detail fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
            <div>
              <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Tanggal</span>
              <span className="font-semibold text-gray-800">{formattedDate}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Waktu Belajar</span>
              <span className="font-semibold text-gray-800">{schedule.startTime} - {schedule.endTime}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Guru Pengajar</span>
              <span className="font-semibold text-teal-700">{schedule.teacherName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider mb-0.5">Cabang</span>
              <span className="font-semibold text-gray-800">{schedule.branch}</span>
            </div>
          </div>

          <div>
            <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider mb-1.5">Topik / Materi</span>
            <p className="p-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium">
              {schedule.topic || <span className="text-gray-400 italic font-normal">Tidak ada topik tertentu</span>}
            </p>
          </div>

          {/* Students List */}
          <div>
            <span className="text-gray-400 block text-xs font-bold uppercase tracking-wider mb-1.5">
              Daftar Siswa ({schedule.students?.length || 0})
            </span>
            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
              {schedule.students && schedule.students.length > 0 ? (
                schedule.students.map((student) => (
                  <div key={student.id} className="p-2.5 bg-white hover:bg-gray-50 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{student.name}</span>
                    <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">ID: {student.id}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-400 italic">Tidak ada siswa yang terdaftar</div>
              )}
            </div>
          </div>

          {/* Teacher's Reports if verified/waiting verification */}
          {schedule.report && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Laporan Sesi Pengajaran
              </h4>
              <div className="p-3 bg-teal-50/40 border border-teal-100 rounded-xl space-y-2 text-xs text-gray-700">
                <div>
                  <span className="font-bold text-teal-800">Materi yang diajarkan:</span> {schedule.report.materialTaught}
                </div>
                <div>
                  <span className="font-bold text-teal-800">Tingkat Pemahaman:</span> {schedule.report.understandingLevel}
                </div>
                <div>
                  <span className="font-bold text-teal-800">Keaktifan:</span> {schedule.report.studentActivity}
                </div>
              </div>
            </div>
          )}

          {/* Check-In / Check-Out logs */}
          {(schedule.checkIn || schedule.checkOut) && (
            <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
              {schedule.checkIn && (
                <div className="p-3 bg-gray-50 border border-gray-200/50 rounded-xl">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-wider mb-1">Check In</span>
                  <span className="text-xs font-bold text-teal-700">{schedule.checkIn.time}</span>
                  <span className="block text-[9px] text-gray-400 mt-0.5">Lat: {schedule.checkIn.lat}, Lng: {schedule.checkIn.lng}</span>
                </div>
              )}
              {schedule.checkOut && (
                <div className="p-3 bg-gray-50 border border-gray-200/50 rounded-xl">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-wider mb-1">Check Out</span>
                  <span className="text-xs font-bold text-teal-700">{schedule.checkOut.time}</span>
                  <span className="block text-[9px] text-gray-400 mt-0.5">Lat: {schedule.checkOut.lat}, Lng: {schedule.checkOut.lng}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-gray-100 pt-4 pb-4 px-6 flex justify-end gap-2 shrink-0 bg-gray-50/50">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Tutup
          </Button>

          {schedule.status === "WAITING_VERIFICATION" && (
            <>
              <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={() => handleAction(false)}
                disabled={loading}
              >
                <XCircle className="w-4 h-4 mr-2" /> Kembalikan
              </Button>
              <Button
                onClick={() => handleAction(true)}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Setujui Verifikasi
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

