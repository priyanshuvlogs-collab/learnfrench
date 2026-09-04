import { Profile, Skill, SKILL_LABELS, SessionRec, StreakState } from "./types";
import { SkillEstimate, formatNCLCRange, readiness } from "./nclc";
import { daysUntil } from "./dates";
import { phase, PHASE_MIX } from "./scheduler";

/**
 * Camille — the coach. Deterministic, state-aware reply engine that
 * mirrors the product's coaching contract: firm, specific, kind; every
 * message ends with exactly ONE action; never guarantees a score;
 * never gives immigration advice.
 */

export interface CoachContext {
  profile: Profile;
  estimates: Record<Skill, SkillEstimate>;
  streak: StreakState;
  minutesToday: number;
  sessions: SessionRec[];
  memory: string[];
}

export interface CoachReply {
  text: string;
  action: { label: string; href: string };
  memoryNote?: string;
}

const ENGLISH_WORDS = ["the", "and", "is", "are", "you", "what", "how", "can", "will", "my", "need", "want", "help", "please", "score", "when", "should", "have", "do", "don't", "study"];

function looksEnglish(text: string): boolean {
  const words = text.toLowerCase().replace(/[^a-z\s']/g, " ").split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  const hits = words.filter((w) => ENGLISH_WORDS.includes(w)).length;
  return hits / words.length > 0.2;
}

const CORRECTIONS: { pattern: RegExp; better: string; why: string }[] = [
  { pattern: /malgré que/i, better: "« bien que + subjonctif » or « malgré + noun »", why: "« malgré que » is marked wrong in exam writing." },
  { pattern: /je suis intéressé (à|de)/i, better: "« je m'intéresse à » or « je suis intéressé par »", why: "the correct preposition after « intéressé » is « par »." },
  { pattern: /beaucoup des/i, better: "« beaucoup de »", why: "after a quantity adverb, « de » stays invariable." },
  { pattern: /je veux que vous (faites|donnez|aidez)/i, better: "« je veux que vous fassiez / donniez / aidiez »", why: "« vouloir que » takes the subjunctive." },
  { pattern: /si j'aurais/i, better: "« si j'avais »", why: "after « si », never the conditional: « si j'avais, je ferais »." },
  { pattern: /je suis agree|je suis d'accord avec que/i, better: "« je suis d'accord avec cette idée »", why: "« d'accord avec + noun », without « que »." },
];

function weakestLine(ctx: CoachContext): { skill: Skill; label: string; href: string } {
  const { weakest } = readiness(ctx.estimates);
  const href =
    weakest === "writing" ? "/writing" : weakest === "speaking" ? "/speaking" : `/skills/${weakest}`;
  return { skill: weakest, label: SKILL_LABELS[weakest].en, href };
}

function profileLine(ctx: CoachContext): string {
  const e = ctx.estimates;
  return `${Math.floor(e.listening.nclc)} / ${Math.floor(e.reading.nclc)} / ${Math.floor(e.writing.nclc)} / ${Math.floor(e.speaking.nclc)} (CO/CE/EE/EO)`;
}

export function coachReply(input: string, ctx: CoachContext): CoachReply {
  const t = input.toLowerCase();
  const weak = weakestLine(ctx);
  const days = daysUntil(ctx.profile.examDate);
  const target = ctx.profile.targetNCLC;

  // 1. Guarantee requests → refuse, offer an honest plan
  if (/(garant|guarantee|promis|promet|assur[eé])/.test(t) && /(\d{1,2}\s*(jours|days|semaines|weeks)|clb|nclc)/.test(t)) {
    return {
      text:
        `I do not guarantee NCLC ${target} in 30 days — nobody honest does. What I can guarantee: a plan. ` +
        `To aim for NCLC ${target}, count on about 1 hour of targeted work a day: 40% on your weak skill (${weak.label}), ` +
        `the rest in timed exam format. In 30 days you will have real data on all four skills, not a promise. ` +
        `We start with what is capping your profile today.`,
      action: { label: `Work ${SKILL_LABELS[weak.skill].short} now`, href: weak.href },
      memoryNote: "Asked for a score guarantee — redirected to a plan.",
    };
  }

  // 2. Visa panic → empathy (2 lines), then back to the skill that moves points
  if (/(visa|ircc|immigration|refus|expir|panique|panic|peur|anxieu|anxious|stress|scared|inquiet)/.test(t)) {
    return {
      text:
        `I understand — the stake is real, and the fear is too. Breathe: you do not have to solve immigration tonight.\n\n` +
        `What is in your hands today is one number: your weakest skill, ${weak.label} ` +
        `(${formatNCLCRange(ctx.estimates[weak.skill])}). That is what sets your official level. Eight minutes on it now beat an hour of worry. ` +
        `For legal questions, see canada.ca or a regulated consultant — I raise the French.`,
      action: { label: "8 minutes on " + SKILL_LABELS[weak.skill].short, href: weak.href },
      memoryNote: "Visa anxiety — redirected to the weak skill.",
    };
  }

  // 3. English input → brief English answer + one French sentence to repeat
  if (looksEnglish(input)) {
    return {
      text:
        `Your official level is the LOWEST of your four skills, and right now that is ${weak.label} ` +
        `(${formatNCLCRange(ctx.estimates[weak.skill])}). That is where today's minutes go.\n\n` +
        `Now one French sentence — say it out loud:\n« Aujourd'hui, je travaille ${SKILL_LABELS[weak.skill].fr.toLowerCase()} pendant ${ctx.profile.dailyMinutes} minutes. »`,
      action: { label: "Start today's block", href: "/today" },
    };
  }

  // 4. Gentle French correction when a known error pattern appears
  for (const c of CORRECTIONS) {
    if (c.pattern.test(input)) {
      return {
        text:
          `Good — you are practising in French. One improvement:\n\n` +
          `Use ${c.better} — ${c.why}\n\n` +
          `Rewrite your sentence with that form, then we act: your profile is ${profileLine(ctx)} and ${weak.label} decides your official NCLC.`,
        action: { label: `A ${SKILL_LABELS[weak.skill].short} drill`, href: weak.href },
      };
    }
  }

  // 5. Plan requests
  if (/(plan|programme|semaine|organis|horaire|schedule)/.test(t)) {
    const ph = phase(ctx.profile);
    const mix = PHASE_MIX[ph].en;
    const dayLine =
      days === null
        ? "No exam date set — we build foundations."
        : days > 0
          ? `Exam in ${days} day${days > 1 ? "s" : ""}.`
          : "Your exam date is past — update it in Settings.";
    return {
      text:
        `${dayLine} Current mix: ${mix}.\n\n` +
        `For you: every day, ${ctx.profile.dailyMinutes} minutes, half of them on ${weak.label} ` +
        `while it stays under NCLC ${target}. Intention reminder: “${ctx.profile.intention.time}, ${ctx.profile.intention.minutes} minutes”. ` +
        `On hard days, the 5-minute rescue keeps the streak.`,
      action: { label: "See today's block", href: "/today" },
    };
  }

  // 6. Start / drill requests
  if (/(commenc|start|entraîn|exercice|drill|pratiqu|écout|lir|écrir|parl)/.test(t)) {
    let target_: { label: string; href: string } = { label: "Today's block", href: "/today" };
    if (/(écout|listen|oral(?!e))/.test(t)) target_ = { label: "Listening", href: "/skills/listening" };
    else if (/(lir|lecture|read)/.test(t)) target_ = { label: "Reading", href: "/skills/reading" };
    else if (/(écrir|writing|lettre|texte)/.test(t)) target_ = { label: "Writing studio", href: "/writing" };
    else if (/(parl|speak|prononc)/.test(t)) target_ = { label: "Speaking studio", href: "/speaking" };
    else target_ = { label: `Work ${SKILL_LABELS[weak.skill].short}`, href: weak.href };
    return {
      text: `Good. One instruction before you start: this is an exam block, not a game — timer visible, one listen for audio, a committed answer. Current estimate: ${profileLine(ctx)}. Let's go.`,
      action: target_,
    };
  }

  // 7. Default coaching status
  const streakLine =
    ctx.streak.current > 0
      ? `Streak: ${ctx.streak.current} day${ctx.streak.current !== 1 ? "s" : ""} (${ctx.streak.freezesLeft} freeze${ctx.streak.freezesLeft !== 1 ? "s" : ""} left).`
      : `Streak is at zero — no drama. The resume protocol is 8 minutes.`;
  const minutesLine =
    ctx.minutesToday >= ctx.profile.dailyMinutes
      ? `Your ${ctx.profile.dailyMinutes} minutes for today are done.`
      : `${ctx.minutesToday}/${ctx.profile.dailyMinutes} minutes done today.`;
  return {
    text:
      `You are preparing ${ctx.profile.exam === "UNDECIDED" ? "TEF or TCF Canada" : ctx.profile.exam + " Canada"} for NCLC ${target}` +
      (days !== null && days > 0 ? ` in ${days} day${days > 1 ? "s" : ""}` : "") +
      `. Estimated profile: ${profileLine(ctx)} — your official level will be the lowest of the four. ` +
      `${streakLine} ${minutesLine}\n\n` +
      `Priority remains ${weak.label} (${formatNCLCRange(ctx.estimates[weak.skill])}). One action, now:`,
    action: {
      label: ctx.minutesToday >= ctx.profile.dailyMinutes ? "Spaced review (5 min)" : `Work ${SKILL_LABELS[weak.skill].short}`,
      href: ctx.minutesToday >= ctx.profile.dailyMinutes ? "/review" : weak.href,
    },
  };
}

/** Weekly coach letter (~120 words) for the Progress page. */
export function weeklyLetter(ctx: CoachContext): string {
  const weak = weakestLine(ctx);
  const last7 = ctx.sessions.filter((s) => {
    const d = new Date(s.date).getTime();
    return Date.now() - d < 7 * 86400000;
  });
  const mins = last7.reduce((a, s) => a + s.minutes, 0);
  const bySkill = last7.reduce<Record<string, number>>((acc, s) => {
    acc[s.skill] = (acc[s.skill] ?? 0) + s.minutes;
    return acc;
  }, {});
  const most = Object.entries(bySkill).sort((a, b) => b[1] - a[1])[0];
  return (
    `This week: ${mins} minutes of real work across ${last7.length} session${last7.length !== 1 ? "s" : ""}. ` +
    (most ? `You mostly invested ${SKILL_LABELS[most[0] as Skill].en.toLowerCase()} (${most[1]} min). ` : "") +
    `Your estimated profile is ${profileLine(ctx)} — and ${weak.label} sets your official level. ` +
    `${ctx.streak.current > 0 ? `The streak holds at ${ctx.streak.current} day${ctx.streak.current !== 1 ? "s" : ""}.` : "The streak broke this week; the resume protocol is waiting, no lecture."} ` +
    `Next week: half the minutes on ${weak.label}, one scored production a day, and a rescue session on hard evenings. ` +
    `These are pedagogical estimates — the official exam remains the only judge. — Camille`
  );
}
