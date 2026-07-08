"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  getSchedules,
  updateScheduleStatus,
  checkIn,
  checkOutAndReport,
  getPeriods,
  getActivePeriod,
} from "@/app/actions";
import { Schedule, ScheduleStatus, Period } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Printer,
} from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [activePeriod, setActivePeriod] = useState<Period | null>(null);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const [reportForm, setReportForm] = useState({
    materialTaught: "",
    understandingLevel: "Baik",
    studentActivity: "Aktif",
    studentProgresses: [] as {
      studentId: string;
      studentName: string;
      attendance: string;
      progress: string;
    }[],
  });

  const [activeTab, setActiveTab] = useState<"jadwal" | "rekap" | "gaji">(
    "jadwal",
  );

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    const [all, allPeriods, activeP] = await Promise.all([
      getSchedules(),
      getPeriods(),
      getActivePeriod(),
    ]);
    setSchedules(all.filter((s) => s.teacherId === user?.teacherId));
    setPeriods(allPeriods);
    setActivePeriod(activeP);
    if (!selectedPeriodId) setSelectedPeriodId(activeP?.id || "");
    setLoading(false);
  }, [user, selectedPeriodId]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const handleStatusChange = async (id: string, status: ScheduleStatus) => {
    await updateScheduleStatus(id, status);
    loadSchedules();
  };

  const handleCheckIn = async (id: string) => {
    // Mock Geolocation
    const lat = -6.2301;
    const lng = 106.8501;
    await checkIn(id, lat, lng);
    loadSchedules();
  };

  const handleCheckOut = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    const initialProgresses = (schedule.students || []).map((s) => ({
      studentId: s.id,
      studentName: s.name,
      attendance: "Hadir",
      progress: "",
    }));
    setReportForm({
      materialTaught: "",
      understandingLevel: "Baik",
      studentActivity: "Aktif",
      studentProgresses: initialProgresses,
    });
    setReportModalOpen(true);
  };

  const submitReport = async () => {
    if (selectedSchedule) {
      await checkOutAndReport(
        selectedSchedule.id,
        -6.2301,
        106.8501,
        reportForm,
      );
      setReportModalOpen(false);
      loadSchedules();
    }
  };

  const getStatusBadge = (status: ScheduleStatus) => {
    switch (status) {
      case "WAITING_APPROVAL":
        return <Badge variant="warning">Menunggu Persetujuan</Badge>;
      case "APPROVED":
        return <Badge variant="success">Disetujui, Siap Mulai</Badge>;
      case "IN_PROGRESS":
        return (
          <Badge variant="default" className="animate-pulse">
            Sedang Berlangsung
          </Badge>
        );
      case "WAITING_VERIFICATION":
        return <Badge variant="secondary">Menunggu Verifikasi</Badge>;
      case "VALIDATED":
        return <Badge variant="success">Tervalidasi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) return <div className="p-4">Memuat jadwal...</div>;

  const activeSchedules = schedules.filter(
    (s) => s.status !== "VALIDATED" && s.status !== "PAID",
  );
  const validatedSchedules = schedules.filter(
    (s) => s.status === "VALIDATED" || s.status === "PAID",
  );
  const totalHonor = validatedSchedules.reduce(
    (acc, s) => acc + s.honorAmount,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 card-3d p-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-teal-800">
            Dashboard Guru
          </h2>
          <p className="text-gray-500">
            Kelola persetujuan, presensi, dan rekap honor Anda.
          </p>
        </div>
        <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "jadwal" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("jadwal")}
          >
            Jadwal Mengajar
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "rekap" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("rekap")}
          >
            Rekap Mengajar
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "gaji" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("gaji")}
          >
            Gaji Periode
          </button>
        </div>
      </div>

      {activeTab === "jadwal" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeSchedules.map((schedule) => (
            <Card key={schedule.id} className="flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{schedule.id}</Badge>
                  {getStatusBadge(schedule.status)}
                </div>
                <CardTitle className="text-lg text-teal-800">
                  {schedule.program} - {schedule.subject}
                </CardTitle>
                <p className="text-sm font-medium text-gray-700">
                  {schedule.topic}
                </p>
              </CardHeader>
              <CardContent className="py-4 space-y-2 flex-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {schedule.date}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {schedule.startTime} - {schedule.endTime}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  Cabang {schedule.branch}
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t bg-gray-50/50 rounded-b-xl flex flex-col gap-2">
                {schedule.status === "WAITING_APPROVAL" && (
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() =>
                        handleStatusChange(schedule.id, "APPROVED")
                      }
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Terima
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600"
                      onClick={() =>
                        handleStatusChange(schedule.id, "REJECTED")
                      }
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Tolak
                    </Button>
                  </div>
                )}
                {schedule.status === "APPROVED" && (
                  <Button
                    variant="default"
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    onClick={() => handleCheckIn(schedule.id)}
                  >
                    <MapPin className="w-4 h-4 mr-2" /> Check In Sekarang
                  </Button>
                )}
                {schedule.status === "IN_PROGRESS" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleCheckOut(schedule)}
                  >
                    Akhiri Sesi & Buat Laporan
                  </Button>
                )}
                {schedule.status !== "WAITING_APPROVAL" &&
                  schedule.status !== "APPROVED" &&
                  schedule.status !== "IN_PROGRESS" && (
                    <Button variant="secondary" className="w-full" disabled>
                      Tindakan Selesai
                    </Button>
                  )}
              </CardFooter>
            </Card>
          ))}
          {activeSchedules.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed rounded-xl">
              Tidak ada jadwal mengajar aktif saat ini.
            </div>
          )}
        </div>
      )}

      {activeTab === "rekap" && (
        <div className="space-y-4">
          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="py-6 flex flex-col items-center text-center">
              <div className="text-sm font-medium text-teal-700 mb-1">
                Total Honor Tervalidasi
              </div>
              <div className="text-4xl font-bold text-teal-900">
                Rp {totalHonor.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-teal-600 mt-2">
                Dari {validatedSchedules.length} sesi mengajar
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {validatedSchedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="outline">{schedule.date}</Badge>
                    {getStatusBadge(schedule.status)}
                  </div>
                  <CardTitle className="text-md">
                    {schedule.program} - {schedule.subject}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 flex justify-between items-center border-t mt-2">
                  <span className="text-sm text-gray-500">Nominal Honor</span>
                  <span className="font-semibold text-teal-700">
                    Rp {schedule.honorAmount.toLocaleString("id-ID")}
                  </span>
                </CardContent>
              </Card>
            ))}
            {validatedSchedules.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed rounded-xl">
                Belum ada rekap mengajar yang tervalidasi.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "gaji" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Pilih Periode
              </label>
              <select
                className="border rounded-md p-2 text-sm bg-gray-50 min-w-[200px]"
                value={selectedPeriodId}
                onChange={(e) => setSelectedPeriodId(e.target.value)}
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="text-teal-700 border-teal-200 hover:bg-teal-50"
            >
              <Printer className="w-4 h-4 mr-2" /> Cetak Slip Gaji
            </Button>
          </div>

          <Card id="printable-slip" className="bg-white">
            <CardHeader className="border-b pb-4 text-center">
              <h2 className="text-2xl font-bold text-teal-800">
                Slip Gaji Guru
              </h2>
              <p className="text-gray-500">Konstanta Education</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Nama Guru:</p>
                  <p className="font-semibold text-lg">{user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 mb-1">Periode:</p>
                  <p className="font-semibold text-lg">
                    {periods.find((p) => p.id === selectedPeriodId)?.name}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 border-b pb-2 mb-3">
                  Rincian Mengajar
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 font-medium">Tanggal</th>
                        <th className="px-4 py-2 font-medium">Program</th>
                        <th className="px-4 py-2 font-medium">Siswa</th>
                        <th className="px-4 py-2 text-right font-medium">
                          Honor (Rp)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {validatedSchedules
                        .filter((s) => {
                          const period = periods.find(
                            (p) => p.id === selectedPeriodId,
                          );
                          if (!period) return false;
                          return (
                            s.date >= period.startDate &&
                            s.date <= period.endDate
                          );
                        })
                        .map((s) => (
                          <tr key={s.id}>
                            <td className="px-4 py-3 text-gray-600">
                              {s.date}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {s.program} - {s.subject}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {s.students?.map((st) => st.name).join(", ") ||
                                "-"}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">
                              {s.honorAmount.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-teal-50/50 font-bold">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-right text-teal-800"
                        >
                          Total Honor:
                        </td>
                        <td className="px-4 py-3 text-right text-teal-900 text-lg">
                          Rp{" "}
                          {validatedSchedules
                            .filter((s) => {
                              const period = periods.find(
                                (p) => p.id === selectedPeriodId,
                              );
                              if (!period) return false;
                              return (
                                s.date >= period.startDate &&
                                s.date <= period.endDate
                              );
                            })
                            .reduce((sum, s) => sum + s.honorAmount, 0)
                            .toLocaleString("id-ID")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {reportModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] flex flex-col">
            <CardHeader className="shrink-0">
              <CardTitle>Laporan Mengajar</CardTitle>
              <p className="text-sm text-gray-500">
                Isi laporan KBM untuk menyelesaikan sesi {selectedSchedule.id}.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto shrink min-h-0">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Materi yang diajarkan
                </label>
                <textarea
                  className="w-full border rounded-md p-2 text-sm"
                  rows={3}
                  value={reportForm.materialTaught}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      materialTaught: e.target.value,
                    })
                  }
                  placeholder="Misal: Penjelasan rumus dan latihan soal..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Tingkat Pemahaman
                </label>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={reportForm.understandingLevel}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      understandingLevel: e.target.value,
                    })
                  }
                >
                  <option>Sangat Baik</option>
                  <option>Baik</option>
                  <option>Cukup</option>
                  <option>Perlu Pendampingan</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Keaktifan Siswa
                </label>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={reportForm.studentActivity}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      studentActivity: e.target.value,
                    })
                  }
                >
                  <option>Sangat Aktif</option>
                  <option>Aktif</option>
                  <option>Kurang Aktif</option>
                  <option>Pasif</option>
                </select>
              </div>
              {reportForm.studentProgresses.length > 0 && (
                  <div className="border-t pt-4 mt-2">
                    <h4 className="text-sm font-semibold mb-3 text-teal-800">
                      Laporan Progress Siswa
                    </h4>
                    <div className="space-y-4">
                      {reportForm.studentProgresses.map((sp, index) => (
                        <div
                          key={sp.studentId}
                          className="bg-gray-50 p-3 rounded-lg border"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">
                              {sp.studentName}
                            </span>
                            <select
                              className="border rounded px-2 py-1 text-xs"
                              value={sp.attendance}
                              onChange={(e) => {
                                const newProgresses = [
                                  ...reportForm.studentProgresses,
                                ];
                                newProgresses[index].attendance =
                                  e.target.value;
                                setReportForm({
                                  ...reportForm,
                                  studentProgresses: newProgresses,
                                });
                              }}
                            >
                              <option value="Hadir">Hadir</option>
                              <option value="Izin">Izin</option>
                              <option value="Sakit">Sakit</option>
                              <option value="Alpa">Alpa</option>
                            </select>
                          </div>
                          <textarea
                            className="w-full border rounded-md p-2 text-xs"
                            rows={2}
                            value={sp.progress}
                            onChange={(e) => {
                              const newProgresses = [
                                ...reportForm.studentProgresses,
                              ];
                              newProgresses[index].progress = e.target.value;
                              setReportForm({
                                ...reportForm,
                                studentProgresses: newProgresses,
                              });
                            }}
                            placeholder="Catatan kemajuan siswa ini..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setReportModalOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={submitReport}>Kirim Laporan & Check Out</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
