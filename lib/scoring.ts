import { RubricScores } from "./types";
import { scoreToNCLC } from "./nclc";

/**
 * Examiner-logic heuristic rubric. This is deliberately transparent and
 * labeled "estimation pédagogique" everywhere — it mirrors the five
 * dimensions examiners score, without pretending to be an official
 * grade. Structured fields only, never a free-form grade.
 */

export const CONNECTORS = [
  "cependant", "en revanche", "par conséquent", "néanmoins", "toutefois",
  "d'abord", "ensuite", "enfin", "de plus", "en effet", "ainsi", "donc",
  "pourtant", "par ailleurs", "d'une part", "d'autre part", "en conclusion",
  "malgré", "bien que", "tandis que", "puisque", "car", "grâce à", "à cause de",
  "par exemple", "notamment", "c'est-à-dire", "en résumé", "finalement", "puis",
];

const FORMAL_MARKERS = [
  "madame", "monsieur", "veuillez", "je vous prie", "cordialement",
  "salutations", "je me permets", "j'ai l'honneur", "dans l'attente",
  "respectueuses", "distinguées", "vous serait-il possible", "auriez-vous",
];

const OPINION_MARKERS = [
  "je pense que", "à mon avis", "selon moi", "je crois que", "il me semble",
  "je suis convaincu", "je suis convaincue", "il faut que", "il est important",
  "d'après moi", "je considère", "pour ma part", "en ce qui me concerne",
];

const SUBJUNCTIVE_TRIGGERS = ["il faut que", "bien que", "pour que", "avant que", "il est important que", "je souhaite que"];

const FRENCH_FILLERS = ["alors", "en fait", "ce que je veux dire", "disons que", "voyons", "eh bien", "bref", "du coup"];

const ENGLISH_LEAK = [" the ", " and ", " because ", " so ", " but ", " i think", " you know", " like ", " actually", " maybe "];

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countMatches(text: string, list: string[]): { count: number; found: string[] } {
  const t = " " + text.toLowerCase().replace(/[’]/g, "'") + " ";
  const found = list.filter((c) => t.includes(c.toLowerCase()));
  return { count: found.length, found };
}

function clamp5(n: number): number {
  return Math.max(0, Math.min(5, Math.round(n * 10) / 10));
}

export interface WritingContext {
  minWords: number;
  bullets: string[]; // key content points from the prompt
  register: "formal" | "informal" | "argument";
  historyLexicalDensity?: number; // rolling average, for native-jump detection
}

export interface WritingResult {
  rubric: RubricScores;
  score: number; // 0-100
  estNCLC: number;
  flags: string[];
  feedback: string[];
  win: string;
  lexicalDensity: number;
}

export function lexicalDensity(text: string): number {
  const words = text.toLowerCase().replace(/[.,;:!?'’"()]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  const unique = new Set(words).size;
  const longShare = words.filter((w) => w.length >= 8).length / words.length;
  return (unique / words.length) * 0.6 + longShare * 0.4;
}

export function scoreWriting(text: string, ctx: WritingContext): WritingResult {
  const words = countWords(text);
  const lower = text.toLowerCase();
  const flags: string[] = [];
  const feedback: string[] = [];

  // 1. Task completion — length + bullet coverage
  const lengthRatio = Math.min(1, words / Math.max(1, ctx.minWords));
  const covered = ctx.bullets.filter((b) =>
    b.toLowerCase().split("|").some((kw) => lower.includes(kw.trim()))
  );
  const coverage = ctx.bullets.length > 0 ? covered.length / ctx.bullets.length : 1;
  const task = clamp5(lengthRatio * 2.5 + coverage * 2.5);
  if (words < ctx.minWords)
    feedback.push(`Longueur : ${words} mots — le minimum officiel est ${ctx.minWords}. Une réponse trop courte plafonne la note.`);
  if (coverage < 1 && ctx.bullets.length > 0)
    feedback.push(`Consigne : ${covered.length}/${ctx.bullets.length} points de la consigne traités. Chaque point oublié coûte cher.`);

  // 2. Coherence — connectors + paragraphing
  const conn = countMatches(text, CONNECTORS);
  const paragraphs = text.split(/\n\s*\n|\n/).filter((p) => p.trim().length > 0).length;
  const coherence = clamp5(Math.min(conn.count, 5) * 0.7 + Math.min(paragraphs, 3) * 0.5);
  if (conn.count < 2)
    feedback.push("Cohérence : utilisez au moins 3 connecteurs (d'abord, cependant, par conséquent…) pour structurer.");

  // 3. Lexical range — type/token + long words
  const ld = lexicalDensity(text);
  const lexicon = clamp5(ld * 7);
  if (ld < 0.45) feedback.push("Vocabulaire : trop de répétitions. Variez les verbes et les noms.");

  // 4. Grammar control — sentence variety + structures (heuristic)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 2);
  const avgLen = sentences.length ? words / sentences.length : 0;
  const subj = countMatches(text, SUBJUNCTIVE_TRIGGERS);
  const opinion = countMatches(text, OPINION_MARKERS);
  const grammar = clamp5(
    (avgLen >= 8 && avgLen <= 22 ? 2.5 : 1.2) + Math.min(subj.count, 2) * 0.8 + Math.min(opinion.count, 2) * 0.5
  );
  if (avgLen > 26) feedback.push("Grammaire : phrases trop longues — coupez-les, une idée par phrase.");

  // 5. Register
  const formal = countMatches(text, FORMAL_MARKERS);
  let register: number;
  if (ctx.register === "formal") {
    register = clamp5(1 + Math.min(formal.count, 4) * 1.0);
    if (formal.count < 2)
      feedback.push("Registre : lettre formelle → « Madame, Monsieur », vouvoiement, « Cordialement ».");
  } else if (ctx.register === "argument") {
    register = clamp5(1.5 + Math.min(opinion.count, 3) * 0.8 + Math.min(conn.count, 3) * 0.4);
    if (opinion.count < 1) feedback.push("Argumentation : annoncez votre thèse (« À mon avis… ») dès le début.");
  } else {
    register = clamp5(3 + (lower.includes(" tu ") || lower.startsWith("salut") ? 1.5 : 0) - Math.min(formal.count, 2) * 0.7);
  }

  // English leakage
  const leak = countMatches(lower, ENGLISH_LEAK);
  if (leak.count >= 2) {
    flags.push("english-leak");
    feedback.push("Des mots anglais se sont glissés dans le texte. À l'examen, cela coûte des points : restez en français.");
  }

  // Native-jump / paste detection
  if (
    ctx.historyLexicalDensity !== undefined &&
    ctx.historyLexicalDensity > 0 &&
    ld > ctx.historyLexicalDensity * 1.45 &&
    words > 60
  ) {
    flags.push("sudden-jump");
    feedback.push("Ce texte est très au-dessus de votre niveau habituel. Si vous avez traduit ou collé, réécrivez avec vos mots : l'examen ne vous laissera pas d'outil.");
  }

  const rubric: RubricScores = { task, coherence, lexicon, grammar, register };
  const total = task + coherence + lexicon + grammar + register; // /25
  const score = Math.round((total / 25) * 100);
  const win =
    conn.found.length > 0
      ? `Vous avez utilisé « ${conn.found[0]} » correctement — gardez-le pour la tâche argumentée.`
      : words >= ctx.minWords
        ? `Vous avez atteint ${words} mots dans le temps imparti — la longueur officielle est acquise.`
        : "Vous avez produit un texte complet du début à la fin — la prochaine fois, on vise la longueur officielle.";

  return { rubric, score, estNCLC: Math.floor(scoreToNCLC(score)), flags, feedback: feedback.slice(0, 4), win, lexicalDensity: ld };
}

export interface SpeakingResult {
  rubric: RubricScores;
  score: number;
  estNCLC: number;
  feedback: string[];
  win: string;
}

export function scoreSpeaking(transcript: string, seconds: number, targetSeconds: number): SpeakingResult {
  const words = countWords(transcript);
  const wpm = seconds > 0 ? (words / seconds) * 60 : 0;
  const feedback: string[] = [];

  const durationRatio = Math.min(1, seconds / Math.max(1, targetSeconds));
  const task = clamp5(durationRatio * 3 + Math.min(words / 60, 1) * 2);
  if (durationRatio < 0.7) feedback.push(`Durée : ${Math.round(seconds)} s sur ${targetSeconds} s attendues. Tenez le temps — le silence ne rapporte rien.`);

  const conn = countMatches(transcript, CONNECTORS);
  const opinion = countMatches(transcript, OPINION_MARKERS);
  const coherence = clamp5(1 + Math.min(conn.count, 4) * 0.7 + Math.min(opinion.count, 2) * 0.6);
  if (opinion.count === 0) feedback.push("Structure : opinion → raison → exemple → conclusion. Annoncez l'opinion en premier.");

  const ld = lexicalDensity(transcript);
  const lexicon = clamp5(ld * 7);

  const fillers = countMatches(transcript, FRENCH_FILLERS);
  const leak = countMatches(" " + transcript.toLowerCase() + " ", ENGLISH_LEAK);
  const grammar = clamp5(2 + Math.min(conn.count, 2) * 0.7 - leak.count * 0.8 + Math.min(opinion.count, 2) * 0.4);
  if (leak.count >= 1) feedback.push("Panique en anglais détectée. Remplacez par des remplisseurs français : « alors », « en fait », « ce que je veux dire, c'est que… ».");

  // Fluency: words per minute (intelligibility target ~90–150 wpm), French fillers are fine
  let fluency: number;
  if (wpm >= 90 && wpm <= 160) fluency = 4.5;
  else if (wpm >= 65) fluency = 3.2;
  else if (wpm >= 40) fluency = 2.2;
  else fluency = 1;
  fluency = clamp5(fluency + Math.min(fillers.count, 2) * 0.25);
  if (wpm < 65 && seconds > 10) feedback.push(`Débit : ~${Math.round(wpm)} mots/min. Visez 90+ — entraînez la même réponse une deuxième fois, plus vite.`);

  const rubric: RubricScores = { task, coherence, lexicon, grammar, register: fluency };
  const total = task + coherence + lexicon + grammar + fluency;
  const score = Math.round((total / 25) * 100);
  const win =
    fillers.found.length > 0
      ? `« ${fillers.found[0]} » utilisé comme remplisseur français — exactement le bon réflexe.`
      : conn.found.length > 0
        ? `Vous avez articulé avec « ${conn.found[0]} » — un connecteur que l'examinateur entend.`
        : `${words} mots produits en ${Math.round(seconds)} secondes. La matière est là ; on structure au prochain essai.`;

  return { rubric, score, estNCLC: Math.floor(scoreToNCLC(score)), feedback: feedback.slice(0, 4), win };
}
