/**
 * French text utilities for the Labo drills: dictation diffing/scoring,
 * number-to-words for the numbers dictation, and conjugation checking.
 * Everything is heuristic and transparent — same philosophy as scoring.ts.
 */

/** Remove diacritics and normalize ligatures (œ → oe). */
export function stripAccents(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae");
}

/** Lowercase, unify apostrophes, drop punctuation, split into word tokens. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’ʼ]/g, "'")
    .replace(/[.,;:!?«»„“”"()\[\]…–—]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export type TokenStatus = "ok" | "accent" | "wrong" | "missing";

export interface DiffToken {
  expected: string;
  typed?: string;
  status: TokenStatus;
}

export interface DictationResult {
  tokens: DiffToken[];
  extras: string[]; // typed words with no counterpart
  correct: number; // exact matches
  accentSlips: number; // right word, wrong accents
  score: number; // 0-100
}

/**
 * Align expected vs typed tokens with edit-distance DP.
 * Substitution costs: 0 exact, 0.4 same word without accents, 1 different.
 * An exact word = 1 point, an accent slip = half — accents are half the
 * battle in a French dictation, but they shouldn't zero out a right word.
 */
export function scoreDictation(expected: string, typed: string): DictationResult {
  const exp = tokenize(expected);
  const got = tokenize(typed);
  const n = exp.length;
  const m = got.length;

  const cost = (a: string, b: string) => (a === b ? 0 : stripAccents(a) === stripAccents(b) ? 0.4 : 1);

  // dp[i][j] = min cost aligning exp[0..i) with got[0..j)
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= n; i++) dp[i][0] = i;
  for (let j = 1; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j - 1] + cost(exp[i - 1], got[j - 1]),
        dp[i - 1][j] + 1, // expected word missing
        dp[i][j - 1] + 1 // extra typed word
      );
    }
  }

  // Backtrack.
  const tokens: DiffToken[] = [];
  const extras: string[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + cost(exp[i - 1], got[j - 1])) {
      const c = cost(exp[i - 1], got[j - 1]);
      tokens.push({
        expected: exp[i - 1],
        typed: got[j - 1],
        status: c === 0 ? "ok" : c < 1 ? "accent" : "wrong",
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
      tokens.push({ expected: exp[i - 1], status: "missing" });
      i--;
    } else {
      extras.push(got[j - 1]);
      j--;
    }
  }
  tokens.reverse();
  extras.reverse();

  const correct = tokens.filter((t) => t.status === "ok").length;
  const accentSlips = tokens.filter((t) => t.status === "accent").length;
  const raw = n > 0 ? ((correct + accentSlips * 0.5) / n) * 100 : 0;
  // Extra invented words cost a little, floor at 0.
  const score = Math.max(0, Math.round(raw - extras.length * 3));
  return { tokens, extras, correct, accentSlips, score };
}

// ── Numbers → French words (for reliable TTS) ──────────────────────────

const UNITS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
const TENS = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante"];

function under100(n: number): string {
  if (n < 17) return UNITS[n];
  if (n < 20) return `dix-${UNITS[n - 10]}`;
  if (n < 70) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return TENS[t];
    if (u === 1) return `${TENS[t]} et un`;
    return `${TENS[t]}-${UNITS[u]}`;
  }
  if (n < 80) {
    // 70-79 : soixante-dix…
    if (n === 71) return "soixante et onze";
    return `soixante-${under100(n - 60)}`;
  }
  // 80-99 : quatre-vingt(s)…
  if (n === 80) return "quatre-vingts";
  return `quatre-vingt-${under100(n - 80)}`;
}

/** French words for 0–9999 — enough for prices, years and times. */
export function numberToFrench(n: number): string {
  if (n < 0 || n > 9999 || !Number.isInteger(n)) return String(n);
  if (n < 100) return under100(n);
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    const head = h === 1 ? "cent" : rest === 0 ? `${UNITS[h]} cents` : `${UNITS[h]} cent`;
    return rest === 0 ? head : `${head} ${under100(rest)}`;
  }
  const th = Math.floor(n / 1000);
  const rest = n % 1000;
  const head = th === 1 ? "mille" : `${UNITS[th]} mille`;
  return rest === 0 ? head : `${head} ${numberToFrench(rest)}`;
}

// ── Numbers-dictation generators ───────────────────────────────────────

export type NumberKind = "price" | "time" | "year" | "phone";

export interface NumberItem {
  kind: NumberKind;
  kindLabel: string;
  spoken: string; // fed to TTS
  display: string; // canonical human answer shown in feedback
  digits: string; // ground truth as digit string
  hint: string; // expected input format
}

/** Compare user input to the item by digits only — "14 h 30" ≡ "14:30". */
export function digitsOf(s: string): string {
  return s.replace(/\D/g, "");
}

function ri(rand: () => number, min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

export function genNumberItem(rand: () => number = Math.random): NumberItem {
  const kind: NumberKind = (["price", "time", "year", "phone"] as const)[ri(rand, 0, 3)];
  if (kind === "price") {
    const euros = ri(rand, 2, 199);
    const cents = [0, 25, 50, 75, 95][ri(rand, 0, 4)];
    const spoken =
      cents === 0
        ? `Ça coûte ${numberToFrench(euros)} dollars.`
        : `Ça coûte ${numberToFrench(euros)} dollars ${numberToFrench(cents)}.`;
    const display = cents === 0 ? `${euros} $` : `${euros},${String(cents).padStart(2, "0")} $`;
    const digits = cents === 0 ? String(euros) : `${euros}${String(cents).padStart(2, "0")}`;
    return { kind, kindLabel: "Prix", spoken, display, digits, hint: cents === 0 ? "Ex. : 45" : "Ex. : 45,50" };
  }
  if (kind === "time") {
    const h = ri(rand, 6, 23);
    const m = [0, 5, 10, 15, 20, 30, 40, 45, 50][ri(rand, 0, 8)];
    const spoken =
      m === 0
        ? `Le rendez-vous est à ${numberToFrench(h)} heures.`
        : `Le rendez-vous est à ${numberToFrench(h)} heures ${numberToFrench(m)}.`;
    const display = m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
    const digits = m === 0 ? String(h) : `${h}${String(m).padStart(2, "0")}`;
    return { kind, kindLabel: "Heure", spoken, display, digits, hint: m === 0 ? "Ex. : 9" : "Ex. : 9h30" };
  }
  if (kind === "year") {
    const y = ri(rand, 1860, 2032);
    return {
      kind,
      kindLabel: "Année",
      spoken: `C'est arrivé en ${numberToFrench(y)}.`,
      display: String(y),
      digits: String(y),
      hint: "Ex. : 1998",
    };
  }
  // phone — Canadian 10 digits, read in natural groups (3-3-2-2)
  const area = [514, 438, 613, 819, 450, 418][ri(rand, 0, 5)];
  const p1 = ri(rand, 200, 999);
  const p2 = ri(rand, 10, 99);
  const p3 = ri(rand, 10, 99);
  const spoken = `Notez le numéro : ${numberToFrench(area)}, ${numberToFrench(p1)}, ${numberToFrench(p2)}, ${numberToFrench(p3)}.`;
  const digits = `${area}${p1}${p2}${p3}`;
  const display = `${area} ${p1}-${p2}${p3}`;
  return { kind, kindLabel: "Téléphone", spoken, display, digits, hint: "Ex. : 514 555-1234" };
}

// ── Conjugation checking ───────────────────────────────────────────────

export type ConjVerdict = "ok" | "accent" | "wrong";

/** Exact = correct ; right letters wrong accents = half credit. */
export function checkConjugation(answer: string, typed: string, accept: string[] = []): ConjVerdict {
  const norm = (s: string) => s.toLowerCase().replace(/[’ʼ]/g, "'").replace(/\s+/g, " ").trim();
  const t = norm(typed);
  const goods = [answer, ...accept].map(norm);
  if (goods.includes(t)) return "ok";
  if (goods.some((g) => stripAccents(g) === stripAccents(t))) return "accent";
  return "wrong";
}
