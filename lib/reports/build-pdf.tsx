import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import type { EvaluationAssessment, Student, StudentAttendanceSummary, StudentSessionReport } from "@/lib/types";

const TEAL = "#0F766E";
const COLUMN_WIDTHS = ["15%", "20%", "20%", "12%", "33%"] as const;

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1F2937" },
  header: { alignItems: "center", marginBottom: 16 },
  logo: { width: 160, marginBottom: 8 },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  infoRow: { flexDirection: "row", marginBottom: 2 },
  label: { fontFamily: "Helvetica-Bold", width: 110 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 16, marginBottom: 6 },
  summaryBox: {
    backgroundColor: "#F0FDFA",
    borderRadius: 4,
    padding: 10,
    marginBottom: 4,
  },
  table: { display: "flex", width: "100%", borderTop: "1 solid #E5E7EB" },
  tableRow: { flexDirection: "row" },
  tableHeaderCell: {
    backgroundColor: TEAL,
    color: "white",
    padding: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tableCell: {
    padding: 4,
    fontSize: 9,
    borderBottom: "1 solid #E5E7EB",
  },
  emptyRow: { padding: 8, fontSize: 9, fontStyle: "italic", color: "#6B7280" },
});

export async function buildStudentReportPdf(
  student: Student,
  reports: StudentSessionReport[],
  summary: StudentAttendanceSummary,
  evaluations: EvaluationAssessment[] = [],
): Promise<Buffer> {
  const sorted = [...reports].sort((a, b) => a.sessionDate.localeCompare(b.sessionDate));
  const sortedEvaluations = [...evaluations].sort((a, b) => a.assessmentDate.localeCompare(b.assessmentDate));
  const logoPath = path.join(process.cwd(), "public", "logo-konstanta-education.png");
  const hasLogo = fs.existsSync(logoPath);

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image has no alt prop */}
          {hasLogo && <Image src={logoPath} style={styles.logo} />}
          <Text style={styles.title}>Laporan Perkembangan Siswa</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nama Siswa</Text>
          <Text>: {student.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID Siswa</Text>
          <Text>: {student.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Program</Text>
          <Text>: {student.program}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Kelas</Text>
          <Text>: {student.className || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tanggal Cetak</Text>
          <Text>
            : {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Ringkasan Kehadiran</Text>
        <View style={styles.summaryBox}>
          <Text>
            Total Sesi: {summary.totalSessions}  |  Persentase Kehadiran: {summary.attendancePercentage}%
          </Text>
          <Text>
            Hadir: {summary.hadirCount}   Izin: {summary.izinCount}   Sakit: {summary.sakitCount}   Alpa:{" "}
            {summary.alpaCount}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Evaluasi</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Tanggal</Text>
            <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Asesmen</Text>
            <Text style={[styles.tableHeaderCell, { width: "20%" }]}>Mata Pelajaran</Text>
            <Text style={[styles.tableHeaderCell, { width: "12%" }]}>Nilai</Text>
            <Text style={[styles.tableHeaderCell, { width: "28%" }]}>Feedback</Text>
          </View>
          {sortedEvaluations.map((assessment) => {
            const result = assessment.results[0];
            const score =
              result?.score === undefined || result.score === null
                ? "-"
                : `${result.score}/${assessment.maxScore || 100}`;
            return (
              <View style={styles.tableRow} key={assessment.id}>
                <Text style={[styles.tableCell, { width: "15%" }]}>{assessment.assessmentDate}</Text>
                <Text style={[styles.tableCell, { width: "25%" }]}>
                  {assessment.title} ({assessment.assessmentType})
                </Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>{assessment.subject}</Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>{score}</Text>
                <Text style={[styles.tableCell, { width: "28%" }]}>{result?.qualitativeFeedback || "-"}</Text>
              </View>
            );
          })}
          {sortedEvaluations.length === 0 && (
            <Text style={styles.emptyRow}>Belum ada evaluasi yang dipublish.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Riwayat Sesi</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[0] }]}>Tanggal</Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[1] }]}>Mata Pelajaran</Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[2] }]}>Guru</Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[3] }]}>Kehadiran</Text>
            <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[4] }]}>Catatan Perkembangan</Text>
          </View>
          {sorted.map((r) => (
            <View style={styles.tableRow} key={r.id}>
              <Text style={[styles.tableCell, { width: COLUMN_WIDTHS[0] }]}>{r.sessionDate}</Text>
              <Text style={[styles.tableCell, { width: COLUMN_WIDTHS[1] }]}>{r.subject}</Text>
              <Text style={[styles.tableCell, { width: COLUMN_WIDTHS[2] }]}>{r.teacherName}</Text>
              <Text style={[styles.tableCell, { width: COLUMN_WIDTHS[3] }]}>{r.attendance}</Text>
              <Text style={[styles.tableCell, { width: COLUMN_WIDTHS[4] }]}>{r.progressNote || "-"}</Text>
            </View>
          ))}
          {sorted.length === 0 && (
            <Text style={styles.emptyRow}>
              Belum ada riwayat kehadiran/perkembangan untuk siswa ini.
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
