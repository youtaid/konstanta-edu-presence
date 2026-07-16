export function formatStudentClassAndProgram(program: string, className: string | null | undefined): string {
  if (!className) return program;
  const parts = className.split("-");
  const grade = parts[0] || "";
  const section = parts[parts.length - 1] || "";
  
  let trackLabel = "";
  const lowerClass = className.toLowerCase();
  if (lowerClass.includes("ipa") || lowerClass.includes("saintek")) {
    trackLabel = " (Kesehatan)";
  } else if (lowerClass.includes("ips") || lowerClass.includes("soshum")) {
    trackLabel = " (Sosial)";
  }
  
  return `${grade} ${program} ${section}${trackLabel}`;
}
