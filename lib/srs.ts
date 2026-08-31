import { SrsCardState } from "./types";
import { addDays, todayKey } from "./dates";

/**
 * SM-2-lite spaced retrieval. Grades: 0 = again, 1 = hard, 2 = good,
 * 3 = easy. Intervals stay short and honest — this reviews connectors,
 * exam templates and sound traps, not a 10-year vocabulary plan.
 */
export function initialCardState(): SrsCardState {
  return { interval: 0, ease: 2.5, due: todayKey(), reps: 0, lapses: 0 };
}

export function review(s: SrsCardState, grade: 0 | 1 | 2 | 3): SrsCardState {
  let { interval, ease, reps, lapses } = s;
  if (grade === 0) {
    lapses += 1;
    reps = 0;
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    reps += 1;
    ease = Math.max(1.3, ease + (grade === 1 ? -0.15 : grade === 3 ? 0.1 : 0));
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = grade === 1 ? 2 : 3;
    else interval = Math.round(interval * (grade === 1 ? 1.2 : ease));
    interval = Math.min(interval, 60);
  }
  return { interval, ease, reps, lapses, due: addDays(todayKey(), Math.max(interval, grade === 0 ? 0 : 1)) };
}

export function isDue(s: SrsCardState | undefined): boolean {
  if (!s) return true; // new card
  return s.due <= todayKey();
}
