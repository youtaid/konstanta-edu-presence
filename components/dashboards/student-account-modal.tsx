"use client";

import { useState } from "react";
import { createStudentAccount } from "@/app/actions";
import type { Student } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function StudentAccountModal({
  student,
  onClose,
  onAccountCreated,
}: {
  student: Student;
  onClose: () => void;
  onAccountCreated: () => void;
}) {
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const handleCreate = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await createStudentAccount(student.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCreatedCredentials({ email: result.email!, password: result.password! });
      onAccountCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat akun siswa.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] flex flex-col">
        <CardHeader className="shrink-0">
          <div className="flex items-start justify-between">
            <CardTitle>Kelola Akun Siswa — {student.name}</CardTitle>
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
                Bagikan kredensial ini ke {student.name}. Password wajib
                diganti saat login pertama dan tidak dapat dilihat lagi
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
                onClick={onClose}
              >
                Tutup
              </Button>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-semibold mb-2 text-teal-800">
                  Status Akun
                </h4>
                {student.hasAccount ? (
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                    <span>Akun login aktif</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Siswa ini belum memiliki akun login.
                  </p>
                )}
              </div>

              {!student.hasAccount && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2 text-teal-800">
                    Buat Akun Siswa Baru
                  </h4>
                  <Button
                    className="w-full"
                    disabled={actionLoading}
                    onClick={handleCreate}
                  >
                    {actionLoading ? "Membuat..." : "Buat Akun"}
                  </Button>
                </div>
              )}
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
