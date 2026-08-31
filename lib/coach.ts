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
  { pattern: /malgré que/i, better: "« bien que + subjonctif » ou « malgré + nom »", why: "« malgré que » est considéré fautif à l'écrit d'examen." },
  { pattern: /je suis intéressé (à|de)/i, better: "« je m'intéresse à » ou « je suis intéressé par »", why: "la préposition correcte est « par » après « intéressé »." },
  { pattern: /beaucoup des/i, better: "« beaucoup de »", why: "après un adverbe de quantité, « de » reste invariable." },
  { pattern: /je veux que vous (faites|donnez|aidez)/i, better: "« je veux que vous fassiez / donniez / aidiez »", why: "« vouloir que » exige le subjonctif." },
  { pattern: /si j'aurais/i, better: "« si j'avais »", why: "après « si », jamais de conditionnel : « si j'avais, je ferais »." },
  { pattern: /je suis agree|je suis d'accord avec que/i, better: "« je suis d'accord avec cette idée »", why: "« d'accord avec + nom », sans « que »." },
];

function weakestLine(ctx: CoachContext): { skill: Skill; label: string; href: string } {
  const { weakest } = readiness(ctx.estimates);
  const href =
    weakest === "writing" ? "/writing" : weakest === "speaking" ? "/speaking" : `/skills/${weakest}`;
  return { skill: weakest, label: SKILL_LABELS[weakest].fr, href };
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
        `Je ne garantis pas un NCLC ${target} en 30 jours — personne d'honnête ne le fait. Ce que je peux garantir : un plan. ` +
        `Pour viser NCLC ${target}, comptez environ 1 h de travail ciblé par jour : 40 % sur votre compétence faible (${weak.label}), ` +
        `le reste en format d'examen chronométré. Dans 30 jours, vous aurez des données réelles sur vos quatre compétences, pas une promesse. ` +
        `On commence par ce qui limite votre profil aujourd'hui.`,
      action: { label: `Travailler ${SKILL_LABELS[weak.skill].short} maintenant`, href: weak.href },
      memoryNote: "A demandé une garantie de score — recadré vers un plan.",
    };
  }

  // 2. Visa panic → empathy (2 lines), then back to the skill that moves points
  if (/(visa|ircc|immigration|refus|expir|panique|panic|peur|anxieu|anxious|stress|scared|inquiet)/.test(t)) {
    return {
      text:
        `Je comprends — l'enjeu est réel et la peur aussi. Respirez : vous n'avez pas à résoudre l'immigration ce soir.\n\n` +
        `Ce qui dépend de vous aujourd'hui, c'est un seul chiffre : votre compétence la plus faible, ${weak.label} ` +
        `(${formatNCLCRange(ctx.estimates[weak.skill])}). C'est elle qui fixe votre niveau officiel. Huit minutes dessus maintenant valent mieux qu'une heure d'inquiétude. ` +
        `Pour les questions juridiques, voyez canada.ca ou un consultant réglementé — moi, je fais monter le français.`,
      action: { label: "8 minutes sur " + SKILL_LABELS[weak.skill].short, href: weak.href },
      memoryNote: "Moment d'anxiété visa — redirigé vers la compétence faible.",
    };
  }

  // 3. English input → brief English answer + one French sentence to repeat
  if (looksEnglish(input)) {
    return {
      text:
        `Quick answer in English: your official level is the LOWEST of your four skills, and right now that is ${weak.label} ` +
        `(${formatNCLCRange(ctx.estimates[weak.skill])}). That is where today's minutes go.\n\n` +
        `Maintenant, une phrase en français — répétez-la à voix haute :\n« Aujourd'hui, je travaille ${weak.label.toLowerCase()} pendant ${ctx.profile.dailyMinutes} minutes. »`,
      action: { label: "Commencer le bloc du jour", href: "/today" },
    };
  }

  // 4. Gentle French correction when a known error pattern appears
  for (const c of CORRECTIONS) {
    if (c.pattern.test(input)) {
      return {
        text:
          `Bien vu de pratiquer en français. Une amélioration :\n\n` +
          `Utilisez ${c.better} — ${c.why}\n\n` +
          `Réécrivez votre phrase avec cette forme, puis passons à l'action : votre profil est ${profileLine(ctx)} et c'est ${weak.label} qui décide de votre NCLC officiel.`,
        action: { label: `Un exercice ${SKILL_LABELS[weak.skill].short}`, href: weak.href },
      };
    }
  }

  // 5. Plan requests
  if (/(plan|programme|semaine|organis|horaire|schedule)/.test(t)) {
    const ph = phase(ctx.profile);
    const mix = PHASE_MIX[ph].fr;
    const dayLine =
      days === null
        ? "Sans date d'examen fixée, on construit les fondations."
        : days > 0
          ? `Examen dans ${days} jours.`
          : "Votre date d'examen est passée — mettez-la à jour dans les réglages.";
    return {
      text:
        `${dayLine} Répartition actuelle : ${mix}.\n\n` +
        `Concrètement pour vous : chaque jour, ${ctx.profile.dailyMinutes} minutes, dont la moitié sur ${weak.label} ` +
        `tant qu'elle reste sous NCLC ${target}. Rappel d'intention : « ${ctx.profile.intention.time}, ${ctx.profile.intention.minutes} minutes ». ` +
        `Les jours difficiles, la session de secours de 5 minutes garde la chaîne.`,
      action: { label: "Voir le bloc du jour", href: "/today" },
    };
  }

  // 6. Start / drill requests
  if (/(commenc|start|entraîn|exercice|drill|pratiqu|écout|lir|écrir|parl)/.test(t)) {
    let target_: { label: string; href: string } = { label: "Bloc du jour", href: "/today" };
    if (/(écout|listen|oral(?!e))/.test(t)) target_ = { label: "Compréhension orale", href: "/skills/listening" };
    else if (/(lir|lecture|read)/.test(t)) target_ = { label: "Compréhension écrite", href: "/skills/reading" };
    else if (/(écrir|writing|lettre|texte)/.test(t)) target_ = { label: "Atelier d'écriture", href: "/writing" };
    else if (/(parl|speak|prononc)/.test(t)) target_ = { label: "Atelier d'expression orale", href: "/speaking" };
    else target_ = { label: `Travailler ${SKILL_LABELS[weak.skill].short}`, href: weak.href };
    return {
      text: `Très bien. Une consigne avant de commencer : c'est un bloc d'examen, pas un jeu — chronomètre visible, une seule écoute pour l'audio, réponse engagée. Votre estimation actuelle : ${profileLine(ctx)}. Allons-y.`,
      action: target_,
    };
  }

  // 7. Default coaching status
  const streakLine =
    ctx.streak.current > 0
      ? `Chaîne : ${ctx.streak.current} jour${ctx.streak.current > 1 ? "s" : ""} (${ctx.streak.freezesLeft} gel${ctx.streak.freezesLeft > 1 ? "s" : ""} restant${ctx.streak.freezesLeft > 1 ? "s" : ""}).`
      : `La chaîne est à zéro — aucun drame. Le protocole de reprise fait 8 minutes.`;
  const minutesLine =
    ctx.minutesToday >= ctx.profile.dailyMinutes
      ? `Vos ${ctx.profile.dailyMinutes} minutes du jour sont faites.`
      : `${ctx.minutesToday}/${ctx.profile.dailyMinutes} minutes faites aujourd'hui.`;
  return {
    text:
      `Vous préparez le ${ctx.profile.exam === "UNDECIDED" ? "TEF ou TCF Canada" : ctx.profile.exam + " Canada"} pour NCLC ${target}` +
      (days !== null && days > 0 ? ` dans ${days} jours` : "") +
      `. Profil estimé : ${profileLine(ctx)} — votre niveau officiel sera le plus bas des quatre. ` +
      `${streakLine} ${minutesLine}\n\n` +
      `La priorité reste ${weak.label} (${formatNCLCRange(ctx.estimates[weak.skill])}). Une action, maintenant :`,
    action: {
      label: ctx.minutesToday >= ctx.profile.dailyMinutes ? "Rappel espacé (5 min)" : `Travailler ${SKILL_LABELS[weak.skill].short}`,
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
    `Cette semaine : ${mins} minutes de travail réel sur ${last7.length} session${last7.length > 1 ? "s" : ""}. ` +
    (most ? `Vous avez surtout investi ${SKILL_LABELS[most[0] as Skill].fr.toLowerCase()} (${most[1]} min). ` : "") +
    `Votre profil estimé est ${profileLine(ctx)} — et c'est ${weak.label} qui fixe votre niveau officiel. ` +
    `${ctx.streak.current > 0 ? `La chaîne tient à ${ctx.streak.current} jour${ctx.streak.current > 1 ? "s" : ""}.` : "La chaîne s'est cassée cette semaine ; le protocole de reprise vous attend, sans leçon de morale."} ` +
    `La semaine prochaine : la moitié des minutes sur ${weak.label}, une production notée par jour, et une session de secours les soirs difficiles. ` +
    `Ce sont des estimations pédagogiques — l'examen officiel reste le seul juge. — Camille`
  );
}
