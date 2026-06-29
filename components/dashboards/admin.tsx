"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getSchedules,
  updateScheduleStatus,
  updateScheduleHonor,
  getPeriods,
  getActivePeriod,
  setActivePeriod,
  createPeriod,
  payTeacherSchedules,
  getUsers,
} from "@/app/actions";
import { Schedule, Period, User } from "@/lib/types";
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
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Users,
  Edit,
  UserCheck,
  UserX,
  Plus,
} from "lucide-react";
import { isWithinWorkHours } from "@/lib/honor";
import type { HonorType } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editHonorModal, setEditHonorModal] = useState<{
    id: string;
    amount: number;
    honorType: HonorType;
    isTetap: boolean;
    isWajibDetected: boolean;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"ringkasan" | "gaji" | "guru" | "periode">(
    "ringkasan",
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    const [allSchedules, allPeriods, activeP, allUsers] = await Promise.all([
      getSchedules(),
      getPeriods(),
      getActivePeriod(),
      getUsers(),
    ]);
    setSchedules(allSchedules);
    setPeriods(allPeriods);
    setTeachers(allUsers.filter((u) => u.role === "TEACHER"));
    if (!selectedPeriodId) setSelectedPeriodId(activeP?.id || "");
    setLoading(false);
  }, [selectedPeriodId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleValidate = async (id: string) => {
    await updateScheduleStatus(id, "VALIDATED");
    loadData();
  };

  const handlePay = async (id: string) => {
    await updateScheduleStatus(id, "PAID");
    loadData();
  };

  const handlePayAll = async (teacherId: string) => {
    if (!currentPeriod) return;
    await payTeacherSchedules(
      teacherId,
      currentPeriod.startDate,
      currentPeriod.endDate,
    );
    loadData();
  };

  // Admin determines jam kerja (via Data Guru), jenis honor (Wajib/100%/50%),
  // and nominal honor for KETetap, plus the honor nominal for KangGuru.
  const openEditHonorModal = (schedule: Schedule) => {
    const teacher = teachers.find((t) => t.teacherId === schedule.teacherId);
    const isTetap = teacher?.teacherType === "TETAP";
    const isWajibDetected =
      isTetap && isWithinWorkHours(schedule.startTime, teacher?.workStartTime, teacher?.workEndTime);
    const honorType: HonorType = isWajibDetected
      ? "WAJIB"
      : schedule.honorType === "WAJIB"
        ? "FULL"
        : schedule.honorType;

    setEditHonorModal({
      id: schedule.id,
      amount: isWajibDetected ? 0 : schedule.honorAmount,
      honorType,
      isTetap: !!isTetap,
      isWajibDetected: !!isWajibDetected,
    });
  };

  const handleUpdateHonor = async () => {
    if (editHonorModal) {
      const finalHonorType = editHonorModal.isWajibDetected ? "WAJIB" : editHonorModal.honorType;
      const finalAmount = finalHonorType === "WAJIB" ? 0 : editHonorModal.amount;
      await updateScheduleHonor(editHonorModal.id, finalAmount, finalHonorType);
      setEditHonorModal(null);
      loadData();
    }
  };

  const handleSetGlobalPeriod = async () => {
    await setActivePeriod(selectedPeriodId);
    alert("Periode aktif berhasil diubah.");
  };

  if (loading) return <div className="p-4">Memuat data admin...</div>;

  const currentPeriod = periods.find((p) => p.id === selectedPeriodId);

  const periodSchedules = schedules.filter((s) => {
    if (!currentPeriod) return false;
    return s.date >= currentPeriod.startDate && s.date <= currentPeriod.endDate;
  });

  const toValidate = periodSchedules.filter(
    (s) => s.status === "WAITING_VALIDATION",
  );
  const validated = periodSchedules.filter((s) => s.status === "VALIDATED");
  const paidSchedules = periodSchedules.filter((s) => s.status === "PAID");

  const totalPaid = paidSchedules.reduce((acc, s) => acc + s.honorAmount, 0);
  const totalPendingPay = validated.reduce((acc, s) => acc + s.honorAmount, 0);

  const ptkpHarian = 150000;
  const ptkpSetahun = 54000000;

  // Group by teacher for the selected period
  const teacherStats = periodSchedules.reduce(
    (acc, s) => {
      if (s.status === "VALIDATED" || s.status === "PAID") {
        if (!acc[s.teacherId]) {
          const user = teachers.find((u) => u.teacherId === s.teacherId);
          acc[s.teacherId] = {
            id: s.teacherId,
            name: s.teacherName,
            totalHonor: 0,
            sessionCount: 0,
            pendingPay: 0,
            paidPay: 0,
            teacherType: user?.teacherType || "FREELANCE",
            baseSalary: user?.baseSalary || 0,
            transportAllowance: user?.transportAllowance || 0,
            otherAllowance: user?.otherAllowance || 0,
            bpjsKetenagakerjaan: user?.bpjsKetenagakerjaan || 0,
            bpjsKesehatan: user?.bpjsKesehatan || 0,
            dailyWages: {},
          };
        }
        // For KETetap, honor_type determines how much of honorAmount actually
        // gets paid on top of the base salary: WAJIB (in-hours) = 0%, HALF
        // (out-of-hours) = 50%, FULL (out-of-hours) = 100%. KangGuru
        // (freelance) always gets the full amount since it's their only pay.
        const honorMultiplier =
          acc[s.teacherId].teacherType === "TETAP"
            ? s.honorType === "WAJIB"
              ? 0
              : s.honorType === "HALF"
                ? 0.5
                : 1
            : 1;
        const effectiveHonor = s.honorAmount * honorMultiplier;

        acc[s.teacherId].totalHonor += effectiveHonor;
        acc[s.teacherId].sessionCount += 1;
        if (s.status === "VALIDATED") {
          acc[s.teacherId].pendingPay += effectiveHonor;
        } else if (s.status === "PAID") {
          acc[s.teacherId].paidPay += effectiveHonor;
        }
        if (!acc[s.teacherId].dailyWages[s.date]) {
          acc[s.teacherId].dailyWages[s.date] = 0;
        }
        acc[s.teacherId].dailyWages[s.date] += effectiveHonor;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        id: string;
        name: string;
        totalHonor: number;
        sessionCount: number;
        pendingPay: number;
        paidPay: number;
        teacherType: string;
        baseSalary: number;
        transportAllowance: number;
        otherAllowance: number;
        bpjsKetenagakerjaan: number;
        bpjsKesehatan: number;
        dailyWages: Record<string, number>;
        taxAmount?: number;
        netHonor?: number;
      }
    >,
  );

  // Add the base salary teachers even if they have no schedules in this period
  teachers
    .filter((t) => t.teacherType === "TETAP")
    .forEach((t) => {
      if (t.teacherId && !teacherStats[t.teacherId]) {
        teacherStats[t.teacherId] = {
          id: t.teacherId,
          name: t.name,
          totalHonor: 0,
          sessionCount: 0,
          pendingPay: 0,
          paidPay: 0,
          teacherType: "TETAP",
          baseSalary: t.baseSalary || 0,
          transportAllowance: t.transportAllowance || 0,
          otherAllowance: t.otherAllowance || 0,
          bpjsKetenagakerjaan: t.bpjsKetenagakerjaan || 0,
          bpjsKesehatan: t.bpjsKesehatan || 0,
          dailyWages: {},
        };
      }
    });

  Object.values(teacherStats).forEach((stat) => {
    if (stat.teacherType === "FREELANCE") {
      let tax = 0;
      if (stat.totalHonor <= 3000000) {
        for (const date in stat.dailyWages) {
          if (stat.dailyWages[date] > 300000) {
            tax += (stat.dailyWages[date] - 300000) * 0.05;
          }
        }
      } else if (stat.totalHonor <= 8200000) {
        for (const date in stat.dailyWages) {
          if (stat.dailyWages[date] > ptkpHarian) {
            tax += (stat.dailyWages[date] - ptkpHarian) * 0.05;
          }
        }
      } else {
        const brutoSetahun = stat.totalHonor * 12;
        const pkp = Math.max(0, brutoSetahun - ptkpSetahun);
        let pph21Tahunan = 0;
        let sisa = pkp;

        if (sisa > 0) {
          const tier1 = Math.min(sisa, 60000000);
          pph21Tahunan += tier1 * 0.05;
          sisa -= tier1;
        }
        if (sisa > 0) {
          const tier2 = Math.min(sisa, 190000000); // 250M - 60M
          pph21Tahunan += tier2 * 0.15;
          sisa -= tier2;
        }
        if (sisa > 0) {
          const tier3 = Math.min(sisa, 250000000); // 500M - 250M
          pph21Tahunan += tier3 * 0.25;
          sisa -= tier3;
        }
        if (sisa > 0) {
          const tier4 = Math.min(sisa, 4500000000); // 5000M - 500M
          pph21Tahunan += tier4 * 0.3;
          sisa -= tier4;
        }
        if (sisa > 0) {
          pph21Tahunan += sisa * 0.35;
        }
        tax = pph21Tahunan / 12;
      }
      stat.taxAmount = Math.round(tax);
      stat.netHonor = Math.round(stat.totalHonor - tax);
    } else {
      stat.taxAmount = 0;
      const totalBruto =
        stat.baseSalary +
        stat.transportAllowance +
        stat.otherAllowance +
        stat.totalHonor;
      const potongan = stat.bpjsKetenagakerjaan + stat.bpjsKesehatan;
      stat.netHonor = Math.round(totalBruto - potongan);

      // Update pending/paid based on total (simplification for TETAP)
      // If there's pending session pay, we mark that as pending, rest is assumed paid for display,
      // or we can just show the netHonor. Let's keep pendingPay derived from schedules.
      // But they have base salary too. Let's show total net honor.
    }
  });

  // Attendance for today
  const todayString = new Date().toISOString().split("T")[0];
  const todaySchedules = schedules.filter((s) => s.date === todayString);
  const teachersExpected = Array.from(
    new Set(todaySchedules.map((s) => s.teacherId)),
  );
  const teachersPresent = Array.from(
    new Set(todaySchedules.filter((s) => s.checkIn).map((s) => s.teacherId)),
  );
  const teachersAbsent = teachersExpected.filter(
    (id) => !teachersPresent.includes(id),
  );

  // Attendance for the last 30 days
  const chartData = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const daySchedules = schedules.filter((s) => s.date === dateStr);

    const dayTeachersExpected = Array.from(
      new Set(daySchedules.map((s) => s.teacherId)),
    );
    const dayTeachersPresent = Array.from(
      new Set(daySchedules.filter((s) => s.checkIn).map((s) => s.teacherId)),
    );
    chartData.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      Hadir: dayTeachersPresent.length,
      Absen: dayTeachersExpected.length - dayTeachersPresent.length,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 card-3d p-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-teal-800">
            Dashboard Admin
          </h2>
          <p className="text-gray-500">
            Tinjau keuangan dan kelola periode penggajian.
          </p>
        </div>
        <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "ringkasan" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("ringkasan")}
          >
            Ringkasan Keuangan
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "gaji" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("gaji")}
          >
            Rincian Gaji Guru
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "guru" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("guru")}
          >
            Data Guru
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "periode" ? "bg-white text-teal-700 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("periode")}
          >
            Kelola Periode
          </button>
        </div>
      </div>

      <div className="flex items-end gap-2 card-3d p-5">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-wider">
            Periode Tinjauan
          </label>
          <select
            className="border-2 border-gray-200 rounded-lg p-2 text-sm bg-gray-50 min-w-[200px] outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
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
        <button
          onClick={handleSetGlobalPeriod}
          className="btn-3d-outline h-[40px] px-4 rounded-lg text-sm text-teal-700"
        >
          Jadikan Aktif
        </button>
      </div>

      {activeTab === "ringkasan" && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="card-3d bg-gradient-to-br from-teal-500 to-teal-700 text-white border-none shadow-[0_8px_0_0_#0f766e]">
              <div className="p-5 pb-2">
                <h3 className="text-sm font-bold flex items-center text-teal-100">
                  <DollarSign className="w-4 h-4 mr-1" /> Honor Siap Dibayar
                </h3>
              </div>
              <div className="p-5 pt-0">
                <div className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  Rp {totalPendingPay.toLocaleString("id-ID")}
                </div>
                <p className="text-teal-100 text-xs mt-1 font-medium">
                  {validated.length} transaksi tervalidasi
                </p>
              </div>
            </div>

            <div className="card-3d">
              <div className="p-5 pb-2">
                <h3 className="text-sm font-bold text-gray-500 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> Total Telah Dibayar
                </h3>
              </div>
              <div className="p-5 pt-0">
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Rp {totalPaid.toLocaleString("id-ID")}
                </div>
                <p className="text-gray-500 text-xs mt-1 font-medium">
                  {paidSchedules.length} transaksi telah dibayar
                </p>
              </div>
            </div>

            <div className="card-3d border-amber-200 shadow-[0_8px_0_0_#fde68a]">
              <div className="p-5 pb-2">
                <h3 className="text-sm font-bold text-amber-700 flex items-center">
                  <Users className="w-4 h-4 mr-1" /> Menunggu Validasi
                </h3>
              </div>
              <div className="p-5 pt-0">
                <div className="text-3xl font-extrabold text-amber-600 tracking-tight">
                  {toValidate.length}
                </div>
                <p className="text-amber-600/70 text-xs mt-1 font-medium">
                  Jadwal diverifikasi akademik
                </p>
              </div>
            </div>

            <div className="card-3d">
              <div className="p-5 pb-2">
                <h3 className="text-sm font-bold text-gray-500 flex items-center justify-between">
                  <span className="flex items-center">
                    <UserCheck className="w-4 h-4 mr-1" /> Kehadiran (Hari Ini)
                  </span>
                </h3>
              </div>
              <div className="p-5 pt-0">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-3xl font-extrabold text-teal-600 tracking-tight">
                      {teachersPresent.length}
                    </div>
                    <p className="text-gray-500 text-xs mt-1 font-medium">
                      Hadir
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-rose-500">
                      {teachersAbsent.length}
                    </div>
                    <p className="text-gray-500 text-xs mt-1 font-medium">
                      Absen
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden flex border border-gray-200">
                  <div
                    className="bg-teal-500 h-full"
                    style={{
                      width: `${teachersExpected.length ? (teachersPresent.length / teachersExpected.length) * 100 : 0}%`,
                    }}
                  ></div>
                  <div
                    className="bg-rose-400 h-full"
                    style={{
                      width: `${teachersExpected.length ? (teachersAbsent.length / teachersExpected.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-3d p-5">
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
              Tren Kehadiran Guru (30 Hari Terakhir)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Hadir"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: "#0d9488",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Absen"
                    stroke="#fb7185"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: "#fb7185",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Validasi Honor ({toValidate.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {toValidate.map((schedule) => (
                <Card key={schedule.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{schedule.id}</Badge>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          Rp {schedule.honorAmount.toLocaleString("id-ID")}
                        </span>
                        <button
                          className="text-gray-400 hover:text-teal-600 transition-colors"
                          onClick={() => openEditHonorModal(schedule)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <CardTitle className="text-md mt-2">
                      {schedule.teacherName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 text-sm text-gray-600">
                    <p>{schedule.date}</p>
                    <p className="flex items-center gap-2">
                      {schedule.program} - {schedule.subject}
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {schedule.classMode === "ONLINE" ? "Online" : "Offline"}
                      </Badge>
                    </p>
                    <p className="mt-2 text-xs bg-gray-100 p-2 rounded">
                      Durasi: {schedule.checkIn?.time} -{" "}
                      {schedule.checkOut?.time}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      onClick={() => handleValidate(schedule.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Validasi Honor
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {toValidate.length === 0 && (
                <div className="col-span-full py-8 text-center text-gray-500 border border-dashed rounded-xl">
                  Tidak ada data yang menunggu validasi admin.
                </div>
              )}
            </div>
          </div>

          {validated.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                Pembayaran Honor
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {validated.map((schedule) => (
                  <Card key={schedule.id} className="border-teal-200">
                    <CardHeader className="pb-2 bg-teal-50/50">
                      <div className="flex justify-between items-center">
                        <Badge variant="success">Siap Dibayar</Badge>
                      </div>
                      <CardTitle className="text-md mt-2">
                        {schedule.teacherName}
                      </CardTitle>
                      <p className="text-2xl font-bold text-teal-700">
                        Rp {schedule.honorAmount.toLocaleString("id-ID")}
                      </p>
                    </CardHeader>
                    <CardFooter className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full border-teal-600 text-teal-700 hover:bg-teal-50"
                        onClick={() => handlePay(schedule.id)}
                      >
                        <DollarSign className="w-4 h-4 mr-2" /> Tandai Lunas
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "gaji" && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2 text-teal-800">
              Rincian Gaji Guru Tetap (KETetap)
            </h3>
            {Object.values(teacherStats).filter(
              (t) => t.teacherType === "TETAP",
            ).length === 0 ? (
              <p className="text-gray-500 italic text-sm">
                Belum ada data guru tetap.
              </p>
            ) : (
              <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nama Guru</th>
                      <th className="px-4 py-3 font-medium text-right">
                        Gaji Pokok
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        Transport
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        Honor Ekstra
                      </th>
                      <th className="px-4 py-3 font-medium text-right text-rose-600">
                        Potongan BPJS
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        Take Home Pay
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Aksi (Sesi)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.values(teacherStats)
                      .filter((t) => t.teacherType === "TETAP")
                      .map((stat) => (
                        <tr key={stat.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {stat.name}
                          </td>
                          <td className="px-4 py-3 text-right">
                            Rp {(stat.baseSalary || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            Rp{" "}
                            {(stat.transportAllowance || 0).toLocaleString(
                              "id-ID",
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            Rp {(stat.totalHonor || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-right text-rose-600">
                            Rp{" "}
                            {(
                              (stat.bpjsKetenagakerjaan || 0) +
                              (stat.bpjsKesehatan || 0)
                            ).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-teal-700">
                            Rp {(stat.netHonor || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              onClick={() => handlePayAll(stat.id)}
                              size="sm"
                              disabled={stat.pendingPay === 0}
                              className={
                                stat.pendingPay === 0
                                  ? "bg-gray-300"
                                  : "bg-teal-600 hover:bg-teal-700"
                              }
                            >
                              Lunas Sesi
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2 text-teal-800">
              Rincian Gaji Guru Freelance (KangGuru)
            </h3>
            {Object.values(teacherStats).filter(
              (t) => t.teacherType === "FREELANCE",
            ).length === 0 ? (
              <p className="text-gray-500 italic text-sm">
                Belum ada data guru freelance.
              </p>
            ) : (
              <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nama Guru</th>
                      <th className="px-4 py-3 font-medium text-center">
                        Jml Sesi
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        Honor Bruto
                      </th>
                      <th className="px-4 py-3 font-medium text-right text-rose-600">
                        Pajak (PPh)
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        Take Home Pay
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Aksi (Sesi)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.values(teacherStats)
                      .filter((t) => t.teacherType === "FREELANCE")
                      .map((stat) => (
                        <tr key={stat.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {stat.name}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {stat.sessionCount}
                          </td>
                          <td className="px-4 py-3 text-right">
                            Rp {(stat.totalHonor || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-right text-rose-600">
                            Rp {(stat.taxAmount || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-teal-700">
                            Rp {(stat.netHonor || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              onClick={() => handlePayAll(stat.id)}
                              size="sm"
                              disabled={stat.pendingPay === 0}
                              className={
                                stat.pendingPay === 0
                                  ? "bg-gray-300"
                                  : "bg-teal-600 hover:bg-teal-700"
                              }
                            >
                              Lunas Sesi
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "guru" && (
        <TeacherDataTab teachers={teachers} onTeacherUpdated={loadData} />
      )}

      {activeTab === "periode" && <PeriodTab onPeriodCreated={loadData} />}

      {editHonorModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Ubah Honor</CardTitle>
              <p className="text-sm text-gray-500">
                Tentukan jenis & nominal honor untuk sesi ini sebelum divalidasi.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {editHonorModal.isTetap && (
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Jenis Honor
                  </label>
                  {editHonorModal.isWajibDetected ? (
                    <p className="text-sm bg-teal-50 border border-teal-200 text-teal-800 rounded-md p-2">
                      Sesi Wajib (Dalam Jam Kerja) — tidak ada honor tambahan, sudah termasuk gaji pokok.
                    </p>
                  ) : (
                    <select
                      className="w-full border rounded-md p-2 text-sm"
                      value={editHonorModal.honorType}
                      onChange={(e) =>
                        setEditHonorModal({
                          ...editHonorModal,
                          honorType: e.target.value as HonorType,
                        })
                      }
                    >
                      <option value="FULL">Diluar Jam Kerja - 100% Honor</option>
                      <option value="HALF">Diluar Jam Kerja - 50% Honor</option>
                    </select>
                  )}
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md p-2 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                  value={editHonorModal.isWajibDetected ? 0 : editHonorModal.amount}
                  disabled={editHonorModal.isWajibDetected}
                  onChange={(e) =>
                    setEditHonorModal({
                      ...editHonorModal,
                      amount: Number(e.target.value),
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-2">
              <Button variant="outline" onClick={() => setEditHonorModal(null)}>
                Batal
              </Button>
              <Button onClick={handleUpdateHonor}>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

function PeriodTab({ onPeriodCreated }: { onPeriodCreated: () => void }) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    const { getPeriods } = await import("@/app/actions");
    const allPeriods = await getPeriods();
    setPeriods(allPeriods);
  };

  const handleSavePeriod = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) return;
    setLoading(true);
    const { createPeriod, updatePeriod } = await import("@/app/actions");

    if (editingId) {
      await updatePeriod(editingId, formData);
    } else {
      await createPeriod(formData);
    }

    setFormData({ name: "", startDate: "", endDate: "" });
    setIsCreating(false);
    setEditingId(null);
    setLoading(false);
    loadPeriods();
    onPeriodCreated();
  };

  const handleEdit = (p: Period) => {
    setFormData({
      name: p.name,
      startDate: p.startDate,
      endDate: p.endDate,
    });
    setEditingId(p.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus periode ini?")) return;
    const { deletePeriod } = await import("@/app/actions");
    await deletePeriod(id);
    loadPeriods();
    onPeriodCreated();
  };

  const resetForm = () => {
    setFormData({ name: "", startDate: "", endDate: "" });
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-semibold">Kelola Periode Tinjauan</h3>
        <Button onClick={() => setIsCreating(true)} size="sm">
          Tambah Periode Baru
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-teal-50 border-teal-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-teal-800">
              {editingId ? "Edit Periode" : "Buat Periode Baru"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nama Periode
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Contoh: 26 Mei - 25 Juni 2026"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Tanggal Mulai
              </label>
              <input
                type="date"
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Tanggal Selesai
              </label>
              <input
                type="date"
                className="w-full border rounded-md p-2 text-sm bg-white"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
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
              onClick={handleSavePeriod}
              disabled={loading}
            >
              Simpan Periode
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Nama Periode</th>
              <th className="px-4 py-3 font-medium">Tanggal Mulai</th>
              <th className="px-4 py-3 font-medium">Tanggal Selesai</th>
              <th className="px-4 py-3 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {periods.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.startDate}</td>
                <td className="px-4 py-3 text-gray-600">{p.endDate}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
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
    workStartTime: "08:00",
    workEndTime: "16:00",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

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
      workStartTime: "08:00",
      workEndTime: "16:00",
    });
    setError(null);
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
      workStartTime: t.workStartTime || "08:00",
      workEndTime: t.workEndTime || "16:00",
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
    setError(null);
    const { createTeacher, updateTeacher } = await import("@/app/actions");

    try {
      if (editingId) {
        await updateTeacher(editingId, formData);
        resetForm();
      } else {
        const result = await createTeacher(formData);
        setCreatedCredentials({
          name: formData.name || "",
          email: result.email,
          password: result.password,
        });
        setIsCreating(false);
        setEditingId(null);
      }
      onTeacherUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data guru.");
    } finally {
      setLoading(false);
    }
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
            {!editingId && (
              <p className="text-sm text-teal-700/80">
                Akun login akan dibuat otomatis (KangGuru/KETetap) dengan password awal yang wajib diganti saat login pertama.
              </p>
            )}
          </CardHeader>
          {error && (
            <div className="mx-6 mb-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
              {error}
            </div>
          )}
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
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Jam Kerja Mulai
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={formData.workStartTime}
                    onChange={(e) =>
                      setFormData({ ...formData, workStartTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Jam Kerja Selesai
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded-md p-2 text-sm bg-white"
                    value={formData.workEndTime}
                    onChange={(e) =>
                      setFormData({ ...formData, workEndTime: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sesi KBM yang dijadwalkan dalam rentang jam ini otomatis
                    dianggap Sesi Wajib (tanpa honor tambahan).
                  </p>
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

      {createdCredentials && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-teal-800">Akun Guru Dibuat</CardTitle>
              <p className="text-sm text-gray-500">
                Bagikan kredensial ini ke {createdCredentials.name}. Password
                wajib diganti saat login pertama dan tidak dapat dilihat lagi
                setelah ini ditutup.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Email Login
                </label>
                <p className="font-mono text-sm bg-gray-100 rounded-md p-2 mt-1">
                  {createdCredentials.email}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Password Awal
                </label>
                <p className="font-mono text-sm bg-gray-100 rounded-md p-2 mt-1">
                  {createdCredentials.password}
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700"
                onClick={() => {
                  setCreatedCredentials(null);
                  resetForm();
                }}
              >
                Tutup
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
