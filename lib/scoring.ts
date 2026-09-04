import { RubricScores } from "./types";
import { scoreToNCLC } from "./nclc";

/**
 * Examiner-logic heuristic rubric. This is deliberately transparent and
 * labeled "pedagogical estimate" everywhere — it mirrors the five
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
    feedback.push(`Length: ${words} words — the official minimum is ${ctx.minWords}. A short answer caps the mark.`);
  if (coverage < 1 && ctx.bullets.length > 0)
    feedback.push(`Brief: ${covered.length}/${ctx.bullets.length} required points covered. Each missed point costs.`);

  // 2. Coherence — connectors + paragraphing
  const conn = countMatches(text, CONNECTORS);
  const paragraphs = text.split(/\n\s*\n|\n/).filter((p) => p.trim().length > 0).length;
  const coherence = clamp5(Math.min(conn.count, 5) * 0.7 + Math.min(paragraphs, 3) * 0.5);
  if (conn.count < 2)
    feedback.push("Coherence: use at least 3 connectors (d'abord, cependant, par conséquent…) to structure.");

  // 3. Lexical range — type/token + long words
  const ld = lexicalDensity(text);
  const lexicon = clamp5(ld * 7);
  if (ld < 0.45) feedback.push("Vocabulary: too much repetition. Vary verbs and nouns.");

  // 4. Grammar control — sentence variety + structures (heuristic)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 2);
  const avgLen = sentences.length ? words / sentences.length : 0;
  const subj = countMatches(text, SUBJUNCTIVE_TRIGGERS);
  const opinion = countMatches(text, OPINION_MARKERS);
  const grammar = clamp5(
    (avgLen >= 8 && avgLen <= 22 ? 2.5 : 1.2) + Math.min(subj.count, 2) * 0.8 + Math.min(opinion.count, 2) * 0.5
  );
  if (avgLen > 26) feedback.push("Grammar: sentences too long — cut them, one idea per sentence.");

  // 5. Register
  const formal = countMatches(text, FORMAL_MARKERS);
  let register: number;
  if (ctx.register === "formal") {
    register = clamp5(1 + Math.min(formal.count, 4) * 1.0);
    if (formal.count < 2)
      feedback.push("Register: formal letter → « Madame, Monsieur », vous-form, « Cordialement ».");
  } else if (ctx.register === "argument") {
    register = clamp5(1.5 + Math.min(opinion.count, 3) * 0.8 + Math.min(conn.count, 3) * 0.4);
    if (opinion.count < 1) feedback.push("Argument: announce your thesis (« À mon avis… ») at the start.");
  } else {
    register = clamp5(3 + (lower.includes(" tu ") || lower.startsWith("salut") ? 1.5 : 0) - Math.min(formal.count, 2) * 0.7);
  }

  // English leakage
  const leak = countMatches(lower, ENGLISH_LEAK);
  if (leak.count >= 2) {
    flags.push("english-leak");
    feedback.push("English words slipped into the text. On the exam that costs marks: stay in French.");
  }

  // Native-jump / paste detection
  if (
    ctx.historyLexicalDensity !== undefined &&
    ctx.historyLexicalDensity > 0 &&
    ld > ctx.historyLexicalDensity * 1.45 &&
    words > 60
  ) {
    flags.push("sudden-jump");
    feedback.push("This text is well above your usual level. If you translated or pasted, rewrite in your own words: the exam will not give you a tool.");
  }

  const rubric: RubricScores = { task, coherence, lexicon, grammar, register };
  const total = task + coherence + lexicon + grammar + register; // /25
  const score = Math.round((total / 25) * 100);
  const win =
    conn.found.length > 0
      ? `You used « ${conn.found[0]} » correctly — keep it for the argument task.`
      : words >= ctx.minWords
        ? `You reached ${words} words in the time — official length is in the bag.`
        : "You produced a complete text from start to finish — next time we aim for official length.";

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
  if (durationRatio < 0.7) feedback.push(`Duration: ${Math.round(seconds)} s of ${targetSeconds} s expected. Hold the time — silence scores nothing.`);

  const conn = countMatches(transcript, CONNECTORS);
  const opinion = countMatches(transcript, OPINION_MARKERS);
  const coherence = clamp5(1 + Math.min(conn.count, 4) * 0.7 + Math.min(opinion.count, 2) * 0.6);
  if (opinion.count === 0) feedback.push("Structure: opinion → reason → example → close. Announce the opinion first.");

  const ld = lexicalDensity(transcript);
  const lexicon = clamp5(ld * 7);

  const fillers = countMatches(transcript, FRENCH_FILLERS);
  const leak = countMatches(" " + transcript.toLowerCase() + " ", ENGLISH_LEAK);
  const grammar = clamp5(2 + Math.min(conn.count, 2) * 0.7 - leak.count * 0.8 + Math.min(opinion.count, 2) * 0.4);
  if (leak.count >= 1) feedback.push("English panic detected. Replace with French fillers: « alors », « en fait », « ce que je veux dire, c'est que… ».");

  // Fluency: words per minute (intelligibility target ~90–150 wpm), French fillers are fine
  let fluency: number;
  if (wpm >= 90 && wpm <= 160) fluency = 4.5;
  else if (wpm >= 65) fluency = 3.2;
  else if (wpm >= 40) fluency = 2.2;
  else fluency = 1;
  fluency = clamp5(fluency + Math.min(fillers.count, 2) * 0.25);
  if (wpm < 65 && seconds > 10) feedback.push(`Pace: ~${Math.round(wpm)} words/min. Aim for 90+ — drill the same answer a second time, faster.`);

  const rubric: RubricScores = { task, coherence, lexicon, grammar, register: fluency };
  const total = task + coherence + lexicon + grammar + fluency;
  const score = Math.round((total / 25) * 100);
  const win =
    fillers.found.length > 0
      ? `« ${fillers.found[0]} » used as a French filler — exactly the right reflex.`
      : conn.found.length > 0
        ? `You structured with « ${conn.found[0]} » — a connector the examiner hears.`
        : `${words} words in ${Math.round(seconds)} seconds. The material is there; we structure it on the next take.`;

  return { rubric, score, estNCLC: Math.floor(scoreToNCLC(score)), feedback: feedback.slice(0, 4), win };
}
