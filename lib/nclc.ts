import { Skill, SkillState } from "./types";

/**
 * Internal skill scale is 0–100. It maps linearly onto an estimated
 * NCLC 4–10 band. These are pedagogical estimates only ("estimation
 * pédagogique") and never presented as official results.
 */
export function scoreToNCLC(score: number): number {
  const n = 4 + (Math.max(0, Math.min(100, score)) / 100) * 6;
  return Math.round(n * 10) / 10;
}

export function nclcToScore(nclc: number): number {
  return Math.max(0, Math.min(100, ((nclc - 4) / 6) * 100));
}

export type Confidence = "low" | "medium" | "high";

export interface SkillEstimate {
  score: number; // 0-100 recency-weighted
  nclc: number; // point estimate (1 decimal)
  low: number; // integer band low
  high: number; // integer band high
  confidence: Confidence;
  samples: number;
}

/**
 * Recency-weighted average of placement + last 12 scored tasks.
 * Confidence grows with sample size; the displayed NCLC widens to a
 * range while confidence is low.
 */
export function estimateSkill(state: SkillState): SkillEstimate {
  const scores = state.scores.slice(-12);
  const samples = scores.length;
  let weighted = 0;
  let totalW = 0;
  if (state.placement !== undefined) {
    weighted += state.placement * 0.5;
    totalW += 0.5;
  }
  scores.forEach((s, i) => {
    const w = 1 + i * 0.25; // more recent → heavier
    weighted += s.score * w;
    totalW += w;
  });
  const score = totalW > 0 ? weighted / totalW : 20;
  const nclc = scoreToNCLC(score);
  const confidence: Confidence = samples >= 8 ? "high" : samples >= 3 ? "medium" : "low";
  const spread = confidence === "high" ? 0 : confidence === "medium" ? 0.5 : 1;
  const low = Math.max(4, Math.floor(nclc - spread));
  const high = Math.min(10, Math.ceil(nclc + spread));
  return { score, nclc, low, high, confidence, samples };
}

export function formatNCLCRange(e: SkillEstimate): string {
  if (e.confidence === "high") return `NCLC ${Math.floor(e.nclc)}`;
  if (e.low === e.high) return `NCLC ${e.low}`;
  return `NCLC ${e.low}–${e.high}`;
}

/** Readiness = the weakest skill. IRCC does not average. */
export function readiness(estimates: Record<Skill, SkillEstimate>): {
  weakest: Skill;
  nclc: number;
} {
  let weakest: Skill = "listening";
  let min = Infinity;
  (Object.keys(estimates) as Skill[]).forEach((s) => {
    if (estimates[s].score < min) {
      min = estimates[s].score;
      weakest = s;
    }
  });
  return { weakest, nclc: Math.floor(estimates[weakest].nclc) };
}
