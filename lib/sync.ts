"use client";

import { SKILLS, Skill, SessionRec, SkillState, StreakState, Profile } from "./types";
import { estimateSkill, readiness } from "./nclc";
import { todayKey } from "./dates";

/**
 * Fire-and-forget snapshot sync so the admin dashboard sees student
 * progress. Never blocks or breaks the learning flow.
 */
export function syncProgress(input: {
  profile: Profile | null;
  skills: Record<Skill, SkillState>;
  sessions: SessionRec[];
  streak: StreakState;
}): void {
  if (typeof window === "undefined" || !input.profile) return;
  try {
    const estimates = Object.fromEntries(
      SKILLS.map((s) => [s, Math.round(estimateSkill(input.skills[s]).nclc * 10) / 10])
    ) as Record<Skill, number>;
    const est = Object.fromEntries(SKILLS.map((s) => [s, estimateSkill(input.skills[s])])) as Record<
      Skill,
      ReturnType<typeof estimateSkill>
    >;
    const { weakest } = readiness(est);
    void fetch("/api/progress/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        streakCurrent: input.streak.current,
        streakLongest: input.streak.longest,
        minutesTotal: input.sessions.reduce((a, s) => a + s.minutes, 0),
        sessionsCount: input.sessions.length,
        weakestSkill: weakest,
        exam: input.profile.exam,
        targetNCLC: input.profile.targetNCLC,
        estimates,
        lastActive: todayKey(),
      }),
    }).catch(() => {});
  } catch {
    // snapshot sync is best-effort
  }
}
