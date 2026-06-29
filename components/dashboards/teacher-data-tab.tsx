"use client";

import { useState } from "react";
import { User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default 
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
