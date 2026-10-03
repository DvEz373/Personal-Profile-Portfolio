const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The moment the site was built. "present" entries end here. */
export const BUILD_DATE = new Date();

/** "2025-09" → Date (first of the month, UTC). "present" → build date. */
export function toDate(value: string): Date {
  if (value === "present") return BUILD_DATE;
  const [y, m] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1));
}

/** "2025-09" → "Sep 2025"; "present" → "Present". */
export function formatMonth(value: string): string {
  if (value === "present") return "Present";
  const [y, m] = value.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export function formatRange(start: string, end: string): string {
  return start === end ? formatMonth(start) : `${formatMonth(start)} – ${formatMonth(end)}`;
}

/** Inclusive length in months, the way CVs and LinkedIn count (Sep 2023 – Sep 2025 = 2 yr 1 mo). */
export function monthsBetween(start: string, end: string): number {
  const a = toDate(start);
  const b = toDate(end);
  return (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) + 1;
}

export function formatDuration(start: string, end: string): string {
  const total = monthsBetween(start, end);
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years ? `${years} yr` : "", months ? `${months} mo` : ""].filter(Boolean).join(" ") || "1 mo";
}

/** Fractional year, for placing bars on a time axis. */
export function yearFraction(value: string): number {
  const d = toDate(value);
  return d.getUTCFullYear() + d.getUTCMonth() / 12 + (value === "present" ? d.getUTCDate() / 365 : 0);
}

/** Sort key: newest end first, then newest start. */
export function byRecent<T extends { start: string; end: string }>(a: T, b: T): number {
  return yearFraction(b.end) - yearFraction(a.end) || yearFraction(b.start) - yearFraction(a.start);
}
