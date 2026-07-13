"use client";

import { useEffect, useState } from "react";
import {
  getParentAccounts,
  getParentLinksForStudent,
  linkParentToStudent,
  unlinkParentFromStudent,
  createParentAccount,
  resetParentPassword,
} from "@/app/actions";
import type { ParentLink, Student } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ParentLinkModal({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) {
  const [links, setLinks] = useState<ParentLink[]>([]);
  const [parentAccounts, setParentAccounts] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExistingParentId, setSelectedExistingParentId] = useState("");
  const [newParentName, setNewParentName] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  const refresh = async () => {
    setLoading(true);
    const [linkData, parentData] = await Promise.all([
      getParentLinksForStudent(student.id),
      getParentAccounts(),
    ]);
    setLinks(linkData);
    setParentAccounts(parentData);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [student.id]);

  const linkedParentIds = new Set(links.map((l) => l.parentId));
  const availableParents = parentAccounts.filter((p) => !linkedParentIds.has(p.id));

  const handleUnlink = async (parentId: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await unlinkParentFromStudent(parentId, student.id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memutus hubungan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLinkExisting = async () => {
    if (!selectedExistingParentId) return;
    setActionLoading(true);
    setError(null);
    try {
      await linkParentToStudent(selectedExistingParentId, student.id);
      setSelectedExistingParentId("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghubungkan orang tua.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateNew = async () => {
    if (!newParentName) return;
    setActionLoading(true);
    setError(null);
    try {
      const result = await createParentAccount({
        name: newParentName,
        studentIds: [student.id],
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setCreatedCredentials({ name: newParentName, email: result.email!, password: result.password! });
      setNewParentName("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat akun orang tua.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (parentId: string, parentName: string) => {
    if (!confirm(`Reset password untuk orang tua ${parentName}?`)) return;
    setActionLoading(true);
    setError(null);
    try {
      const result = await resetParentPassword(parentId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCreatedCredentials({
        name: parentName,
        email: result.email!,
        password: result.password!,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mereset password orang tua.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] flex flex-col">
        <CardHeader className="shrink-0">
          <div className="flex items-start justify-between">
            <CardTitle>Kelola Orang Tua — {student.name}</CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 overflow-y-auto shrink min-h-0">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {createdCredentials ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Bagikan kredensial ini ke {createdCredentials.name}. Password
                wajib diganti saat login pertama dan tidak dapat dilihat lagi
                setelah ini ditutup.
              </p>
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
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700"
                onClick={() => setCreatedCredentials(null)}
              >
                Tutup
              </Button>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-semibold mb-2 text-teal-800">
                  Orang Tua Terhubung
                </h4>
                {loading ? (
                  <p className="text-sm text-gray-500 italic">Memuat...</p>
                ) : links.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    Belum ada orang tua yang terhubung.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {links.map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      >
                        <span>{l.parentName}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleResetPassword(l.parentId, l.parentName)}
                          >
                            Reset Password
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleUnlink(l.parentId)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2 text-teal-800">
                  Hubungkan Orang Tua yang Sudah Ada
                </h4>
                <div className="flex gap-2">
                  <select
                    className="flex-1 border rounded-md p-2 text-sm bg-white"
                    value={selectedExistingParentId}
                    onChange={(e) => setSelectedExistingParentId(e.target.value)}
                  >
                    <option value="">Pilih akun orang tua...</option>
                    {availableParents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    disabled={!selectedExistingParentId || actionLoading}
                    onClick={handleLinkExisting}
                  >
                    Hubungkan
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2 text-teal-800">
                  Buat Akun Orang Tua Baru
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border rounded-md p-2 text-sm bg-white"
                    placeholder="Nama orang tua"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                  />
                  <Button disabled={!newParentName || actionLoading} onClick={handleCreateNew}>
                    Buat & Hubungkan
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 shrink-0">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Tutup
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
