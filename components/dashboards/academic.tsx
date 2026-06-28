"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getSchedules,
  updateScheduleStatus,
  createSchedule,
  getUsers,
  getPrograms,
  getStudents,
} from "@/app/actions";
import { Schedule, User, Student } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, FileText, XCircle } from "lucide-react";

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
  const [newSchedule, setNewSchedule] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "15:30",
    program: "ELC",
    subject: "Matematika",
    topic: "",
    teacherId: "T1",
    teacherName: "Budi Santoso",
    studentIds: [] as string[],
    students: [] as { id: string; name: string }[],
    branch: "Tebet",
    honorAmount: 150000,
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
    setTeachers(allUsers.filter((u) => u.role === "TEACHER"));
    setPrograms(allPrograms);
    setStudents(allStudents);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async () => {
    await createSchedule(newSchedule);
    setIsCreating(false);
    loadData();
  };

  const handleVerify = async (id: string, approve: boolean) => {
    await updateScheduleStatus(id, approve ? "WAITING_VALIDATION" : "REJECTED");
    loadData();
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
                    {teachers.map((t) => (
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
                {(newSchedule.program === "ELC" ||
                  newSchedule.program === "Privat") && (
                  <div className="md:col-span-2 border-t pt-3 mt-1">
                    <label className="text-sm font-medium mb-2 block text-teal-700">
                      Pilih Siswa (Khusus ELC / Privat)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {students
                        .filter((s) => s.program === newSchedule.program)
                        .map((s) => (
                          <label
                            key={s.id}
                            className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200 cursor-pointer hover:bg-teal-50"
                          >
                            <input
                              type="checkbox"
                              className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                              checked={newSchedule.studentIds.includes(s.id)}
                              onChange={(e) => {
                                let newIds = [...newSchedule.studentIds];
                                let newStudents = [...newSchedule.students];
                                if (e.target.checked) {
                                  newIds.push(s.id);
                                  newStudents.push({ id: s.id, name: s.name });
                                } else {
                                  newIds = newIds.filter((id) => id !== s.id);
                                  newStudents = newStudents.filter(
                                    (st) => st.id !== s.id,
                                  );
                                }
                                setNewSchedule({
                                  ...newSchedule,
                                  studentIds: newIds,
                                  students: newStudents,
                                });
                              }}
                            />
                            <span className="text-sm text-gray-700">
                              {s.name}
                            </span>
                          </label>
                        ))}
                    </div>
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
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Semua Jadwal
            </h3>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Tanggal</th>
                      <th className="px-4 py-3 font-medium">Guru</th>
                      <th className="px-4 py-3 font-medium">Program</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {schedules.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
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
                          <Badge variant="outline">
                            {s.status.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
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

function StudentDataTab({
  students,
  programs,
  onStudentCreated,
}: {
  students: Student[];
  programs: string[];
  onStudentCreated: () => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    program: programs[0] || "ELC",
  });
  const [loading, setLoading] = useState(false);

  const handleCreateStudent = async () => {
    if (!newStudent.name || !newStudent.program) return;
    setLoading(true);
    const { createStudent } = await import("@/app/actions");
    await createStudent(newStudent);
    setNewStudent({ name: "", program: programs[0] || "ELC" });
    setIsCreating(false);
    setLoading(false);
    onStudentCreated();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Siswa Baru
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-teal-50 border-teal-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-teal-800">Data Siswa Baru</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nama Siswa
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
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
                value={newStudent.program}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, program: e.target.value })
                }
              >
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-teal-100 pt-4">
            <Button
              variant="outline"
              className="text-teal-700 border-teal-200"
              onClick={() => setIsCreating(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleCreateStudent}
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
        return (
          <div key={prog} className="mt-6">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">
              Program: {prog}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {progStudents.map((student) => (
                <Card
                  key={student.id}
                  className="p-4 flex items-center justify-between border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {student.id}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-gray-50">
                    {prog}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TeacherDataTab({
  teachers,
  onTeacherUpdated,
}: {
  teachers: User[];
  onTeacherUpdated: () => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    teacherType: "FREELANCE",
    baseSalary: 0,
    transportAllowance: 0,
    otherAllowance: 0,
    bpjsKetenagakerjaan: 0,
    bpjsKesehatan: 0,
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      teacherType: "FREELANCE",
      baseSalary: 0,
      transportAllowance: 0,
      otherAllowance: 0,
      bpjsKetenagakerjaan: 0,
      bpjsKesehatan: 0,
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (t: User) => {
    setFormData({
      name: t.name,
      email: t.email,
      teacherType: t.teacherType || "FREELANCE",
      baseSalary: t.baseSalary || 0,
      transportAllowance: t.transportAllowance || 0,
      otherAllowance: t.otherAllowance || 0,
      bpjsKetenagakerjaan: t.bpjsKetenagakerjaan || 0,
      bpjsKesehatan: t.bpjsKesehatan || 0,
    });
    setEditingId(t.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data guru?")) return;
    const { deleteTeacher } = await import("@/app/actions");
    await deleteTeacher(id);
    onTeacherUpdated();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) return;
    setLoading(true);
    const { createTeacher, updateTeacher } = await import("@/app/actions");

    if (editingId) {
      await updateTeacher(editingId, formData);
    } else {
      await createTeacher(formData);
    }

    resetForm();
    setLoading(false);
    onTeacherUpdated();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Guru Baru
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-teal-50 border-teal-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-teal-800">
              {editingId ? "Edit Data Guru" : "Data Guru Baru"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nama Guru
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                type="email"
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Tipe Guru
              </label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.teacherType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teacherType: e.target.value as any,
                  })
                }
              >
                <option value="FREELANCE">KangGuru (Freelance)</option>
                <option value="TETAP">KETetap (Tetap)</option>
              </select>
            </div>

            {formData.teacherType === "TETAP" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Gaji Pokok
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={formData.baseSalary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        baseSalary: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Transport
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={formData.transportAllowance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transportAllowance: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Tunjangan Lain
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={formData.otherAllowance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otherAllowance: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    BPJS Ketenagakerjaan
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={formData.bpjsKetenagakerjaan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bpjsKetenagakerjaan: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    BPJS Kesehatan
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={formData.bpjsKesehatan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bpjsKesehatan: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </>
            )}
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
              Simpan Data Guru
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Nama Guru</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Tipe</th>
              <th className="px-4 py-3 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teachers.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {t.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{t.email}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">
                    {t.teacherType === "TETAP" ? "KETetap" : "KangGuru"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(t)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(t.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
