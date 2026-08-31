import { Skill, SKILLS, SessionRec, Profile } from "./types";
import { SkillEstimate, readiness } from "./nclc";
import { daysUntil, todayKey, addDays } from "./dates";

export type Phase = "foundations" | "exam-tasks" | "final";

export function phase(profile: Profile): Phase {
  const d = daysUntil(profile.examDate);
  if (d === null || d > 56) return "foundations";
  if (d > 21) return "exam-tasks";
  return "final";
}

export const PHASE_MIX: Record<Phase, { fr: string; en: string }> = {
  foundations: {
    fr: "40 % fondations · 40 % compétence faible · 20 % format d'examen",
    en: "40% foundations · 40% weak skill · 20% exam format",
  },
  "exam-tasks": {
    fr: "70 % tâches d'examen · 30 % correction d'erreurs",
    en: "70% exam tasks · 30% error correction",
  },
  final: {
    fr: "Chronométrage officiel, sections complètes, sommeil. Pas de nouveaux continents grammaticaux.",
    en: "Official timing, full sections, sleep. No new grammar continents.",
  },
};

/**
 * Pick today's main skill. Interleaving rule: mostly the weakest skill,
 * but never more than 3 consecutive days on the same skill — unless the
 * exam is < 14 days away and only one skill is below target.
 */
export function pickTodaySkill(
  estimates: Record<Skill, SkillEstimate>,
  sessions: SessionRec[],
  profile: Profile
): Skill {
  const { weakest } = readiness(estimates);
  const d = daysUntil(profile.examDate);
  const belowTarget = SKILLS.filter((s) => estimates[s].nclc < profile.targetNCLC);
  if (d !== null && d <= 14 && belowTarget.length === 1) return belowTarget[0];

  // last 3 calendar days of main-drill skills
  const recent = new Set<string>();
  for (let i = 1; i <= 3; i++) recent.add(addDays(todayKey(), -i));
  const recentSkills = sessions
    .filter((s) => recent.has(s.date) && (s.type === "drill" || s.type === "writing" || s.type === "speaking"))
    .map((s) => s.skill);
  const streak3 = recentSkills.length >= 3 && recentSkills.slice(-3).every((s) => s === weakest);
  if (!streak3) return weakest;

  // interleave: next-weakest different skill
  const ordered = [...SKILLS].sort((a, b) => estimates[a].score - estimates[b].score);
  return ordered.find((s) => s !== weakest) ?? weakest;
}

export interface BlockSegment {
  id: "intention" | "drill" | "retrieval" | "produce";
  label: { fr: string; en: string };
  minutes: number;
  href: string;
}

/** The Today block: intention → main drill → SRS retrieval → produce. */
export function buildTodayBlock(skill: Skill, totalMinutes: number): BlockSegment[] {
  const scale = totalMinutes / 20;
  const drillHref =
    skill === "writing" ? "/writing" : skill === "speaking" ? "/speaking" : `/skills/${skill}`;
  return [
    {
      id: "intention",
      label: { fr: "Intention + rappel de la compétence faible", en: "Intention + weakest-skill reminder" },
      minutes: Math.max(1, Math.round(1 * scale)),
      href: "/today",
    },
    {
      id: "drill",
      label: { fr: "Entraînement principal", en: "Main drill" },
      minutes: Math.max(3, Math.round(11 * scale)),
      href: drillHref,
    },
    {
      id: "retrieval",
      label: { fr: "Rappel espacé (cartes)", en: "Spaced retrieval (cards)" },
      minutes: Math.max(2, Math.round(5 * scale)),
      href: "/review",
    },
    {
      id: "produce",
      label: { fr: "Produire : 2 phrases orales ou 40 mots écrits", en: "Produce: 2 spoken sentences or 40 written words" },
      minutes: Math.max(2, Math.round(3 * scale)),
      href: skill === "speaking" ? "/speaking" : "/writing",
    },
  ];
}
