import { NextRequest, NextResponse } from "next/server";
import { getEvaluationResultsForStudent, getStudents, getStudentSessionReports } from "@/app/actions";
import { computeAttendanceSummary } from "@/lib/attendance";
import { buildStudentReportDocx } from "@/lib/reports/build-docx";
import { buildStudentReportPdf } from "@/lib/reports/build-pdf";

function safeFilename(name: string) {
  return name.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "Siswa";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const format = request.nextUrl.searchParams.get("format") === "pdf" ? "pdf" : "docx";

  const [students, reports, evaluations] = await Promise.all([
    getStudents(),
    getStudentSessionReports(id),
    getEvaluationResultsForStudent(id),
  ]);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
  }

  const summary = computeAttendanceSummary(id, reports);
  const filename = `Laporan_${safeFilename(student.name)}.${format}`;

  if (format === "pdf") {
    const buffer = await buildStudentReportPdf(student, reports, summary, evaluations);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  const buffer = await buildStudentReportDocx(student, reports, summary, evaluations);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
