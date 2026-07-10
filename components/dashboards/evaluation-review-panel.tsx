"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getEvaluationAssessments,
  publishEvaluationAssessment,
  rejectEvaluationAssessment,
} from "@/app/actions";
import type { EvaluationAssessment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export default function EvaluationReviewPanel() {
  const [assessments, setAssessments] = useState<EvaluationAssessment[]>([]);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadData = useCallback(async () => {
    const data = await getEvaluationAssessments();
    setAssessments(data.filter((assessment) => assessment.status === "SUBMITTED"));
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handlePublish = async (id: string) => {
    setBusy(true);
    try {
      await publishEvaluationAssessment(id);
      await loadData();
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingId || !rejectNote.trim()) return;
    setBusy(true);
    try {
      await rejectEvaluationAssessment(rejectingId, rejectNote);
      setRejectingId(null);
      setRejectNote("");
      await loadData();
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-4">Memuat review evaluasi...</div>;

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <Card key={assessment.id}>
          <CardHeader className="border-b">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-lg text-teal-800">{assessment.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  {assessment.assessmentDate} - {assessment.subject} - {assessment.assessmentType}
                </p>
              </div>
              <Badge variant="warning">Menunggu Review</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-lg border bg-gray-50 p-3">
                <span className="text-xs text-gray-500 block">Program</span>
                <span className="font-semibold">{assessment.program || "Semua"}</span>
              </div>
              <div className="rounded-lg border bg-gray-50 p-3">
                <span className="text-xs text-gray-500 block">Kelas</span>
                <span className="font-semibold">{assessment.className || "Semua"}</span>
              </div>
              <div className="rounded-lg border bg-gray-50 p-3">
                <span className="text-xs text-gray-500 block">Siswa Dinilai</span>
                <span className="font-semibold">{assessment.results.length}</span>
              </div>
              <div className="rounded-lg border bg-gray-50 p-3">
                <span className="text-xs text-gray-500 block">Guru Penerima</span>
                <span className="font-semibold">{assessment.teacherRecipients.length}</span>
              </div>
            </div>

            {assessment.description && (
              <p className="text-sm text-gray-700 bg-teal-50 border border-teal-100 rounded-lg p-3">
                {assessment.description}
              </p>
            )}

            <div className="rounded-xl border overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                Sampel Hasil Evaluasi
              </div>
              <div className="divide-y max-h-72 overflow-y-auto">
                {assessment.results.slice(0, 8).map((result) => (
                  <div key={result.id} className="p-3 text-sm grid gap-2 sm:grid-cols-[180px_90px_minmax(0,1fr)]">
                    <span className="font-semibold text-gray-900">{result.studentName || result.studentId}</span>
                    <span className="text-gray-600">
                      {result.score === undefined || result.score === null ? "-" : `${result.score}/${assessment.maxScore || 100}`}
                    </span>
                    <span className="text-gray-700">{result.qualitativeFeedback || "-"}</span>
                  </div>
                ))}
                {assessment.results.length === 0 && (
                  <p className="text-sm text-gray-500 p-4 text-center">Belum ada hasil siswa.</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50/60 flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              onClick={() => setRejectingId(assessment.id)}
              disabled={busy}
            >
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => handlePublish(assessment.id)}
              disabled={busy}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Publish
            </Button>
          </CardFooter>
        </Card>
      ))}

      {assessments.length === 0 && (
        <div className="rounded-xl border-2 border-dashed py-12 text-center text-gray-500">
          Tidak ada evaluasi yang menunggu review.
        </div>
      )}

      {rejectingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reject Evaluasi</CardTitle>
              <p className="text-sm text-gray-500">Catatan ini akan terlihat oleh tim Eval untuk revisi.</p>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={4}
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Tuliskan alasan reject atau revisi yang perlu dilakukan..."
              />
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRejectingId(null)} disabled={busy}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={busy || !rejectNote.trim()}>
                Kirim Reject
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
