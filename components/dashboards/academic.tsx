"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getSchedules,
  updateScheduleStatus,
  setSchedulesArchived,
  createSchedule,
  getUsers,
  getPrograms,
  getStudents,
  getStudentSessionReports,
} from "@/app/actions";
import { Schedule, User, Student, HonorType, ClassMode, StudentSessionReport } from "@/lib/types";
import { isWithinWorkHours, getDefaultKangGuruHonor } from "@/lib/honor";
import { computeAttendanceSummary } from "@/lib/attendance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, FileText, XCircle, Pencil, Trash2, Archive, ArchiveRestore, History, X, Download } from "lucide-react";

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

export default function AcademicDashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"jadwal" | "siswa" | "guru">(
    "jadwal",
  );

  const [isCreating, setIsCreating] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState("");

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
    subject: "Matematika",
    topic: "",
    teacherId: "",
    teacherName: "",
    studentIds: [] as string[],
    students: [] as { id: string; name: string }[],
    branch: "Tebet",
    classMode: "OFFLINE" as ClassMode,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
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
    loadData();
  }, [loadData]);

  // Synchronize teacher selection with the filter input (prevents default values like Budi Santoso when option is filtered out)
  useEffect(() => {
    if (teachers.length === 0) return;
    const filtered = teachers.filter((t) =>
      t.name.toLowerCase().includes(teacherFilter.toLowerCase())
    );
    if (filtered.length > 0) {
      const exists = filtered.some((t) => t.teacherId === newSchedule.teacherId);
      if (!exists) {
        setNewSchedule((prev) => ({
          ...prev,
          teacherId: filtered[0].teacherId || "",
          teacherName: filtered[0].name,
        }));
      }
    }
  }, [teacherFilter, teachers, newSchedule.teacherId]);

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
    await updateScheduleStatus(id, approve ? "WAITING_VALIDATION" : "REJECTED");
    loadData();
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
    await setSchedulesArchived(Array.from(selectedIds), archived);
    setSelectedIds(new Set());
    await loadData();
    setIsArchiving(false);
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
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "jadwal" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("jadwal")}
          >
            Jadwal KBM
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "siswa" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("siswa")}
          >
            Data Siswa
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "guru" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("guru")}
          >
            Data Guru
          </button>
        </div>
      </div>

      {activeTab === "jadwal" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setIsCreating(true)}
              className="btn-3d h-[40px] px-4 rounded-lg text-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Buat Jadwal Baru
            </button>
          </div>

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
                    onChange={(e) => setTeacherFilter(e.target.value)}
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
                  <div className="flex gap-2">
                    <select
                      className="w-full border rounded-md p-2 text-sm bg-white"
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
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 text-sm bg-white"
                      placeholder="Mata Pelajaran"
                      value={newSchedule.subject}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          subject: e.target.value,
                        })
                      }
                    />
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

          <div>
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
              {toVerify.length === 0 && (
                <p className="text-sm text-gray-500 italic py-4">
                  Semua jadwal telah diverifikasi.
                </p>
              )}
            </div>
          </div>

          <div>
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
                      </tr>
                    ))}
                    {visibleSchedules.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500 italic">
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
        </>
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
  const [formData, setFormData] = useState({
    name: "",
    program: programs[0] || "ELC",
    grade: defaultGrade,
    classNumber: 1,
  });
  const [loading, setLoading] = useState(false);

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
        <Card className="bg-teal-50 border-teal-200 shadow-md">
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
    </div>
  );
}

function attendanceBadgeVariant(attendance: string) {
  if (attendance === "Hadir") return "success" as const;
  if (attendance === "Alpa") return "destructive" as const;
  return "outline" as const;
}

function StudentHistoryModal({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) {
  const [reports, setReports] = useState<StudentSessionReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getStudentSessionReports(student.id).then((data) => {
      if (!cancelled) {
        setReports(data);
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
          {loading ? (
            <p className="text-sm text-gray-500 italic py-4">Memuat riwayat...</p>
          ) : (
            <>
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
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg text-sm"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">
                        {r.sessionDate} — {r.subject}
                      </span>
                      <Badge
                        variant={attendanceBadgeVariant(r.attendance)}
                        className="text-[10px] px-1.5 py-0 h-5"
                      >
                        {r.attendance}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      Guru: {r.teacherName}
                    </p>
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
            </>
          )}
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

