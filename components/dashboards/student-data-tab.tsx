"use client";

import { useEffect, useRef, useState } from "react";
import { Student } from "@/lib/types";
import { formatStudentClassAndProgram } from "@/lib/format-utils";
import StudentProgressView from "@/components/student-progress-view";
import ParentLinkModal from "@/components/dashboards/parent-link-modal";
import StudentAccountModal from "@/components/dashboards/student-account-modal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, History, Pencil, Trash2, X, Download } from "lucide-react";

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

export default function StudentDataTab({
  students,
  programs,
  onStudentCreated,
  canManageAccounts = true,
}: {
  students: Student[];
  programs: string[];
  onStudentCreated: () => void;
  canManageAccounts?: boolean;
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
                        {canManageAccounts && (
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
                        )}
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

      {canManageAccounts && parentLinkStudent && (
        <ParentLinkModal
          student={parentLinkStudent}
          onClose={() => setParentLinkStudent(null)}
        />
      )}

      {canManageAccounts && accountStudent && (
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
                <Badge variant="outline">
                  {formatStudentClassAndProgram(student.program, student.className)}
                </Badge>
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
