import { SessionRec } from "./types";
import { addDays, todayKey } from "./dates";

/** Weekly goals — rolling 7 days, honest and editable. */
export interface Goals {
  weeklySessions: number; // qualifying sessions per week
  weeklyWritingTasks: number; // writing submissions per week
  weeklySpeakingMinutes: number; // spoken minutes per week
}

export const DEFAULT_GOALS: Goals = {
  weeklySessions: 5,
  weeklyWritingTasks: 2,
  weeklySpeakingMinutes: 10,
};

export interface GoalProgress {
  sessions: number;
  writingTasks: number;
  speakingMinutes: number;
}

/** Progress over the rolling last 7 calendar days (inclusive of today). */
export function weeklyProgress(sessions: SessionRec[]): GoalProgress {
  const cutoff = addDays(todayKey(), -6);
  const recent = sessions.filter((s) => s.date >= cutoff);
  return {
    sessions: recent.filter((s) => s.qualifying).length,
    writingTasks: recent.filter((s) => s.type === "writing").length,
    speakingMinutes: recent.filter((s) => s.skill === "speaking" && (s.type === "speaking" || s.type === "drill")).reduce((a, s) => a + s.minutes, 0),
  };
}

/** Goals newly reached between two progress snapshots. */
export function goalsJustReached(before: GoalProgress, after: GoalProgress, goals: Goals): string[] {
  const reached: string[] = [];
  if (before.sessions < goals.weeklySessions && after.sessions >= goals.weeklySessions) reached.push("sessions");
  if (before.writingTasks < goals.weeklyWritingTasks && after.writingTasks >= goals.weeklyWritingTasks) reached.push("writing");
  if (before.speakingMinutes < goals.weeklySpeakingMinutes && after.speakingMinutes >= goals.weeklySpeakingMinutes) reached.push("speaking");
  return reached;
}
