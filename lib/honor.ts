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
  const mode = classMode || "OFFLINE";
  if (program === "Privat") {
    return mode === "ONLINE" ? 200000 : 225000;
  }
  if (program === "PM") {
    return mode === "ONLINE" ? 150000 : 180000;
  }
  if (program === "ELC") {
    return mode === "ONLINE" ? 175000 : 200000;
  }
  if (program === "TPS") {
    return mode === "ONLINE" ? 175000 : 200000;
  }
  if (program === "TKA") {
    return mode === "ONLINE" ? 175000 : 200000;
  }
  if (program === "OSN") {
    return mode === "ONLINE" ? 175000 : 200000;
  }
  // Default fallback for any other program
  return mode === "ONLINE" ? 175000 : 200000;
}
