"use client";

import { useEffect, useState } from "react";
import { getStudents } from "@/app/actions";
import type { Student } from "@/lib/types";
import StudentProgressView from "@/components/student-progress-view";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// getStudents() runs through the cookie-bound (RLS-respecting) client, so
// it already returns only the children linked to this parent via
// parent_student_links — no separate fetch/filter needed here.
export default function OrangTuaDashboard() {
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents().then((data) => {
      setChildren(data);
      setSelectedId(data[0]?.id || "");
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

  if (children.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-sm text-gray-500 border">
        Belum ada data siswa yang terhubung ke akun Anda. Silakan hubungi
        bagian Akademik.
      </div>
    );
  }

  const selected = children.find((c) => c.id === selectedId) || children[0];

  return (
    <div className="space-y-6">
      {children.length > 1 && (
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl overflow-x-auto">
          {children.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                selectedId === c.id
                  ? "bg-white text-teal-700 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>{selected.name}</CardTitle>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline">{selected.program}</Badge>
            {selected.className && (
              <Badge variant="secondary">{selected.className}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <StudentProgressView student={selected} />
        </CardContent>
      </Card>
    </div>
  );
}
