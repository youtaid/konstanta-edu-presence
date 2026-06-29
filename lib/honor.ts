import type { ClassMode } from "./types";

// A KETetap session counts as "Sesi Wajib" (no extra honor) only when the
// teacher's work hours are configured AND the session's start time falls
// inside them. Otherwise it's "diluar jam kerja" and Admin must pick a
// FULL (100%) or HALF (50%) honor type.
export function isWithinWorkHours(
  startTime: string,
  workStartTime?: string,
  workEndTime?: string,
) {
  if (!workStartTime || !workEndTime) return false;
  return startTime >= workStartTime && startTime < workEndTime;
}

// Default honor for KangGuru (freelance) sessions, set by Admin's rules:
// PM = 180rb, ELC Offline = 200rb, ELC Online = 175rb, TPS Online = 175rb.
// Anything else falls back to a flat default that Admin can override.
export function getDefaultKangGuruHonor(program: string, classMode: ClassMode): number {
  if (program === "PM") return 180000;
  if (program === "ELC") return classMode === "OFFLINE" ? 200000 : 175000;
  if (program === "TPS" && classMode === "ONLINE") return 175000;
  return 150000;
}
