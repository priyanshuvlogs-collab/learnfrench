import { SpeakingSubmission, WritingSubmission } from "./types";
import { todayKey } from "./dates";

/**
 * Freemium rules. FREE covers the complete daily loop (block, drills,
 * grammar, SRS, mini-mocks, one scored production of each kind per day).
 * PREMIUM unlocks unlimited scored productions, long section mocks and
 * the OpenAI coach. Premium is granted by the admin (no payments yet).
 */
export type Plan = "FREE" | "PREMIUM";

export const FREE_LIMITS = {
  writingPerDay: 1,
  speakingPerDay: 1,
};

export function writingUsedToday(subs: WritingSubmission[]): number {
  const t = todayKey();
  return subs.filter((s) => s.date === t).length;
}

export function speakingUsedToday(subs: SpeakingSubmission[]): number {
  const t = todayKey();
  return subs.filter((s) => s.date === t).length;
}

export function canSubmitWriting(plan: Plan, subs: WritingSubmission[]): boolean {
  return plan === "PREMIUM" || writingUsedToday(subs) < FREE_LIMITS.writingPerDay;
}

export function canSubmitSpeaking(plan: Plan, subs: SpeakingSubmission[]): boolean {
  return plan === "PREMIUM" || speakingUsedToday(subs) < FREE_LIMITS.speakingPerDay;
}
