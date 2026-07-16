"use client";

import { useEffect, useState } from "react";
import { getStudents } from "@/app/actions";
import type { Student } from "@/lib/types";
import StudentProgressView from "@/components/student-progress-view";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { formatStudentClassAndProgram } from "@/lib/format-utils";

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold">Halo, {me.name}!</CardTitle>
          <div className="flex gap-2 mt-1.5">
            <Badge variant="outline">
              {formatStudentClassAndProgram(me.program, me.className)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="h-8 text-xs">
            <a href={`/api/students/${me.id}/report?format=pdf`} download>
              <FileDown className="w-3.5 h-3.5 mr-1" /> Unduh PDF
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="h-8 text-xs">
            <a href={`/api/students/${me.id}/report?format=docx`} download>
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Unduh Word
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <StudentProgressView student={me} />
      </CardContent>
    </Card>
  );
}
