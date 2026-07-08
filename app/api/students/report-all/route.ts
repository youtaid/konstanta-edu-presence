import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { getStudents, getStudentSessionReports } from "@/app/actions";
import { computeAttendanceSummary } from "@/lib/attendance";
import { buildStudentReportDocx } from "@/lib/reports/build-docx";
import { buildStudentReportPdf } from "@/lib/reports/build-pdf";

function safeFilename(name: string) {
  return name.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "Siswa";
}

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get("format") === "pdf" ? "pdf" : "docx";
  const students = await getStudents();

  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (const student of students) {
    const reports = await getStudentSessionReports(student.id);
    const summary = computeAttendanceSummary(student.id, reports);
    const buffer =
      format === "pdf"
        ? await buildStudentReportPdf(student, reports, summary)
        : await buildStudentReportDocx(student, reports, summary);

    let baseName = safeFilename(student.name);
    let filename = `Laporan_${baseName}.${format}`;
    let suffix = 2;
    while (usedNames.has(filename)) {
      filename = `Laporan_${baseName}_${suffix}.${format}`;
      suffix += 1;
    }
    usedNames.add(filename);

    zip.file(filename, buffer);
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="Laporan_Semua_Siswa_${format.toUpperCase()}.zip"`,
    },
  });
}
