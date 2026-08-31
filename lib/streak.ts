import { StreakState } from "./types";
import { addDays, daysBetween, monthKey, todayKey } from "./dates";

export const FREEZES_PER_MONTH = 2;

export function initialStreak(): StreakState {
  return {
    current: 0,
    longest: 0,
    lastQualifyingDate: undefined,
    freezesLeft: FREEZES_PER_MONTH,
    freezeResetMonth: monthKey(),
    frozenDates: [],
  };
}

/** Monthly freeze token reset. */
export function withFreezeReset(s: StreakState): StreakState {
  const m = monthKey();
  if (s.freezeResetMonth === m) return s;
  return { ...s, freezesLeft: FREEZES_PER_MONTH, freezeResetMonth: m };
}

/**
 * Reconcile the streak against the calendar. Rules:
 * - gap of 0/1 days since last qualifying day → streak intact
 * - exactly one missed day, streak was ≥ 7, freeze available → auto-use
 *   a freeze, streak survives
 * - otherwise → streak resets to 0 (longest is kept)
 */
export function reconcile(s0: StreakState): StreakState {
  const s = withFreezeReset(s0);
  if (!s.lastQualifyingDate || s.current === 0) return s;
  const gap = daysBetween(s.lastQualifyingDate, todayKey());
  if (gap <= 1) return s;
  const missed = gap - 1;
  if (missed === 1 && s.current >= 7 && s.freezesLeft > 0) {
    const frozen = addDays(s.lastQualifyingDate, 1);
    return {
      ...s,
      freezesLeft: s.freezesLeft - 1,
      frozenDates: [...s.frozenDates, frozen],
      // treat the frozen day as covered so today still continues the chain
      lastQualifyingDate: frozen,
    };
  }
  return { ...s, current: 0 };
}

/** Called when a qualifying session is recorded today. */
export function recordQualifyingDay(s0: StreakState): StreakState {
  const s = reconcile(s0);
  const today = todayKey();
  if (s.lastQualifyingDate === today) return s; // already counted
  const continues =
    s.lastQualifyingDate !== undefined &&
    daysBetween(s.lastQualifyingDate, today) === 1 &&
    s.current > 0;
  const next = continues ? s.current + 1 : 1;
  return {
    ...s,
    current: next,
    longest: Math.max(s.longest, next),
    lastQualifyingDate: today,
  };
}

/** Milestones: 7 days unlocks a full section mock, 21 days unlocks examiner mode. */
export function milestones(s: StreakState) {
  return {
    sectionMockUnlocked: s.longest >= 7,
    examinerModeUnlocked: s.longest >= 21,
  };
}

/** True if the streak is visibly broken (had one, lost it). */
export function isBroken(s: StreakState): boolean {
  return s.current === 0 && s.longest > 0;
}
