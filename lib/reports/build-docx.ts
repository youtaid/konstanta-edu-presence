import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  ShadingType,
} from "docx";
import fs from "fs";
import path from "path";
import type { EvaluationAssessment, Student, StudentAttendanceSummary, StudentSessionReport } from "@/lib/types";

const TEAL = "0F766E";
const COLUMN_WIDTHS = [15, 20, 20, 12, 33]; // percent, sums to 100

function infoLine(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun(value),
    ],
  });
}

function headerCell(text: string, widthPercent: number) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: TEAL, fill: TEAL },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: "FFFFFF" })],
      }),
    ],
  });
}

function bodyCell(text: string, widthPercent: number) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    children: [new Paragraph(text)],
  });
}

function historyTable(reports: StudentSessionReport[]) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell("Tanggal", COLUMN_WIDTHS[0]),
      headerCell("Mata Pelajaran", COLUMN_WIDTHS[1]),
      headerCell("Guru", COLUMN_WIDTHS[2]),
      headerCell("Kehadiran", COLUMN_WIDTHS[3]),
      headerCell("Catatan Perkembangan", COLUMN_WIDTHS[4]),
    ],
  });

  if (reports.length === 0) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        headerRow,
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 5,
              children: [new Paragraph("Belum ada riwayat kehadiran/perkembangan untuk siswa ini.")],
            }),
          ],
        }),
      ],
    });
  }

  const rows = reports.map(
    (r) =>
      new TableRow({
        children: [
          bodyCell(r.sessionDate, COLUMN_WIDTHS[0]),
          bodyCell(r.subject, COLUMN_WIDTHS[1]),
          bodyCell(r.teacherName, COLUMN_WIDTHS[2]),
          bodyCell(r.attendance, COLUMN_WIDTHS[3]),
          bodyCell(r.progressNote || "-", COLUMN_WIDTHS[4]),
        ],
      }),
  );

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...rows] });
}

function evaluationTable(evaluations: EvaluationAssessment[]) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell("Tanggal", 15),
      headerCell("Asesmen", 25),
      headerCell("Mata Pelajaran", 20),
      headerCell("Nilai", 12),
      headerCell("Feedback", 28),
    ],
  });

  if (evaluations.length === 0) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        headerRow,
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 5,
              children: [new Paragraph("Belum ada evaluasi yang dipublish.")],
            }),
          ],
        }),
      ],
    });
  }

  const rows = evaluations.map((assessment) => {
    const result = assessment.results[0];
    const score =
      result?.score === undefined || result.score === null
        ? "-"
        : `${result.score}/${assessment.maxScore || 100}`;
    return new TableRow({
      children: [
        bodyCell(assessment.assessmentDate, 15),
        bodyCell(`${assessment.title} (${assessment.assessmentType})`, 25),
        bodyCell(assessment.subject, 20),
        bodyCell(score, 12),
        bodyCell(result?.qualitativeFeedback || "-", 28),
      ],
    });
  });

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...rows] });
}

export async function buildStudentReportDocx(
  student: Student,
  reports: StudentSessionReport[],
  summary: StudentAttendanceSummary,
  evaluations: EvaluationAssessment[] = [],
): Promise<Buffer> {
  const sorted = [...reports].sort((a, b) => a.sessionDate.localeCompare(b.sessionDate));
  const sortedEvaluations = [...evaluations].sort((a, b) => a.assessmentDate.localeCompare(b.assessmentDate));
  const logoPath = path.join(process.cwd(), "public", "logo-konstanta-education.png");
  const logoBuffer = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;

  const children: Paragraph[] = [];

  if (logoBuffer) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: { width: 180, height: 60 },
            type: "png",
          }),
        ],
      }),
    );
  }

  children.push(
    new Paragraph({
      text: "Laporan Perkembangan Siswa",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: "" }),
    infoLine("Nama Siswa", student.name),
    infoLine("ID Siswa", student.id),
    infoLine("Program", student.program),
    infoLine("Kelas", student.className || "-"),
    infoLine(
      "Tanggal Cetak",
      new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    ),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "Ringkasan Kehadiran", heading: HeadingLevel.HEADING_2 }),
    new Paragraph({
      text: `Total Sesi: ${summary.totalSessions}  |  Persentase Kehadiran: ${summary.attendancePercentage}%`,
    }),
    new Paragraph({
      text: `Hadir: ${summary.hadirCount}   Izin: ${summary.izinCount}   Sakit: ${summary.sakitCount}   Alpa: ${summary.alpaCount}`,
    }),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "Evaluasi", heading: HeadingLevel.HEADING_2 }),
  );

  const doc = new Document({
    sections: [
      {
        children: [
          ...children,
          evaluationTable(sortedEvaluations),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Riwayat Sesi", heading: HeadingLevel.HEADING_2 }),
          historyTable(sorted),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
