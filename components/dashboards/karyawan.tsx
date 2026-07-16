"use client";

import { useAuth } from "@/components/auth-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSchedules, getStudents, getPrograms, getPeriods } from "@/app/actions";
import { Schedule, ScheduleStatus, Student, Period } from "@/lib/types";
import StudentDataTab from "@/components/dashboards/student-data-tab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Archive, Search, Users } from "lucide-react";

type KaryawanTab = "jadwal" | "siswa";

const KARYAWAN_TABS: { id: KaryawanTab; label: string }[] = [
  { id: "jadwal", label: "Jadwal KBM" },
  { id: "siswa", label: "Data Siswa" },
];

// Karyawan's Jadwal KBM tab is deliberately read-only: creating/editing
// schedules is Akademik's job, check-in/out and status self-approval is the
// assigned teacher's, and honor/validation is Admin's — RLS technically lets
// karyawan write these tables too, but no UI is given for it here so the
// role can't step into those workflow owners' jobs. Honor amount/type are
// also omitted from the table below since payroll stays admin-only.
function getStatusBadge(status: ScheduleStatus) {
  switch (status) {
    case "WAITING_APPROVAL":
      return <Badge variant="warning">Menunggu Persetujuan</Badge>;
    case "APPROVED":
      return <Badge variant="success">Disetujui</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">Ditolak</Badge>;
    case "IN_PROGRESS":
      return <Badge variant="default" className="animate-pulse">Berlangsung</Badge>;
    case "WAITING_VERIFICATION":
      return <Badge variant="secondary">Menunggu Verifikasi</Badge>;
    case "VERIFIED":
      return <Badge variant="secondary">Terverifikasi</Badge>;
    case "WAITING_VALIDATION":
      return <Badge variant="warning">Menunggu Validasi</Badge>;
    case "VALIDATED":
      return <Badge variant="success">Tervalidasi</Badge>;
    case "PAID":
      return <Badge variant="success">Lunas</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function KaryawanDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<KaryawanTab>("jadwal");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const loadData = useCallback(async () => {
    const [allSchedules, allStudents, allPrograms, allPeriods] = await Promise.all([
      getSchedules(),
      getStudents(),
      getPrograms(),
      getPeriods(),
    ]);
    setSchedules(allSchedules);
    setStudents(allStudents);
    setPrograms(allPrograms);
    setPeriods(allPeriods);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activePeriods = useMemo(
    () => periods.filter((p) => p.id === periodFilter),
    [periods, periodFilter],
  );

  const filteredSchedules = useMemo(() => {
    const query = search.trim().toLowerCase();
    return schedules
      .filter((s) => (showArchived ? s.archived : !s.archived))
      .filter((s) => !programFilter || s.program === programFilter)
      .filter((s) => !statusFilter || s.status === statusFilter)
      .filter((s) => {
        if (!periodFilter || activePeriods.length === 0) return true;
        const period = activePeriods[0];
        return s.date >= period.startDate && s.date <= period.endDate;
      })
      .filter((s) => {
        if (!query) return true;
        return (
          s.teacherName.toLowerCase().includes(query) ||
          s.subject.toLowerCase().includes(query) ||
          s.topic.toLowerCase().includes(query) ||
          s.branch.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [schedules, search, programFilter, statusFilter, periodFilter, activePeriods, showArchived]);

  const scheduleStatuses: ScheduleStatus[] = [
    "DRAFT",
    "WAITING_APPROVAL",
    "APPROVED",
    "REJECTED",
    "IN_PROGRESS",
    "WAITING_VERIFICATION",
    "VERIFIED",
    "WAITING_VALIDATION",
    "VALIDATED",
    "PAID",
  ];

  if (loading) {
    return (
      <p className="text-sm text-gray-500 italic py-8 text-center">
        Memuat data...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0 border border-teal-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Halo, {user?.name}!</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">
                Data operasional Konstanta Education — peran Karyawan.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {KARYAWAN_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white text-teal-700 shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "jadwal" && (
        <Card>
          <CardHeader className="pb-4 space-y-3">
            <CardTitle className="text-base">Jadwal KBM (Lihat Saja)</CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <Input
                  placeholder="Cari guru, mapel, cabang..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9 text-sm w-56"
                />
              </div>
              <select
                className="border rounded-md h-9 px-2 text-sm bg-white"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="">Semua Program</option>
                {programs.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                className="border rounded-md h-9 px-2 text-sm bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                {scheduleStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                className="border rounded-md h-9 px-2 text-sm bg-white"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <option value="">Semua Periode</option>
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowArchived((v) => !v)}
                className={`flex items-center gap-1.5 px-3 h-9 rounded-md text-xs font-medium border transition-all ${
                  showArchived
                    ? "bg-teal-50 text-teal-700 border-teal-200"
                    : "bg-white text-gray-500 border-gray-200 hover:text-gray-900"
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                {showArchived ? "Menampilkan Arsip" : "Tampilkan Arsip"}
              </button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b">
                  <th className="py-2 pr-3">Tanggal</th>
                  <th className="py-2 pr-3">Waktu</th>
                  <th className="py-2 pr-3">Program</th>
                  <th className="py-2 pr-3">Mapel / Topik</th>
                  <th className="py-2 pr-3">Guru</th>
                  <th className="py-2 pr-3">Cabang</th>
                  <th className="py-2 pr-3">Mode</th>
                  <th className="py-2 pr-3">Siswa</th>
                  <th className="py-2 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 pr-3 whitespace-nowrap">{s.date}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-gray-600">
                      {s.startTime}–{s.endTime}
                    </td>
                    <td className="py-2.5 pr-3">
                      <Badge variant="outline">{s.program}</Badge>
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="font-medium text-gray-900">{s.subject}</div>
                      <div className="text-xs text-gray-500">{s.topic}</div>
                    </td>
                    <td className="py-2.5 pr-3">{s.teacherName}</td>
                    <td className="py-2.5 pr-3 text-gray-600">{s.branch}</td>
                    <td className="py-2.5 pr-3">
                      <Badge variant="secondary">{s.classMode}</Badge>
                    </td>
                    <td className="py-2.5 pr-3 text-gray-600">
                      {s.students?.length ?? s.studentIds?.length ?? 0}
                    </td>
                    <td className="py-2.5 pr-3">{getStatusBadge(s.status)}</td>
                  </tr>
                ))}
                {filteredSchedules.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-gray-400 italic">
                      Tidak ada jadwal yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === "siswa" && (
        <StudentDataTab
          students={students}
          programs={programs}
          onStudentCreated={loadData}
          canManageAccounts={false}
        />
      )}
    </div>
  );
}
