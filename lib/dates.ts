/** Wall-clock ms — kept out of component scope for lint purity rules. */
export function nowMs(): number {
  return Date.now();
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function monthKey(d: Date = new Date()): string {
  return todayKey(d).slice(0, 7);
}

export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  return todayKey(date);
}

/** Whole days between two yyyy-mm-dd keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const [ya, ma, da] = a.split("-").map(Number);
  const [yb, mb, db] = b.split("-").map(Number);
  const t1 = new Date(ya, ma - 1, da).getTime();
  const t2 = new Date(yb, mb - 1, db).getTime();
  return Math.round((t2 - t1) / 86400000);
}

export function daysUntil(examDate: string | undefined): number | null {
  if (!examDate) return null;
  return daysBetween(todayKey(), examDate);
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(todayKey(), -i));
  return out;
}
