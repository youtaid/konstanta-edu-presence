"use client";

import { useEffect, useState } from "react";
import { getStudents } from "@/app/actions";
import type { Student } from "@/lib/types";
import StudentProgressView from "@/components/student-progress-view";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// getStudents() runs through the cookie-bound (RLS-respecting) client, so a
// KEnz account only ever gets back its own students row (auth_user_id match).
export default function SiswaDashboard() {
  const [me, setMe] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents().then((data) => {
      setMe(data[0] || null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-gray-500 italic py-8 text-center">
        Memuat data...
      </p>
    );
  }

  if (!me) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-sm text-gray-500 border">
        Akun Anda belum terhubung ke data siswa. Silakan hubungi bagian
        Akademik.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Halo, {me.name}!</CardTitle>
        <div className="flex gap-2 mt-1">
          <Badge variant="outline">{me.program}</Badge>
          {me.className && <Badge variant="secondary">{me.className}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <StudentProgressView student={me} />
      </CardContent>
    </Card>
  );
}
