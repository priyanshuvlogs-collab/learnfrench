import { Skill } from "@/lib/types";

/**
 * Official IRCC score → NCLC correspondence tables, transcribed from
 * canada.ca. LAST VERIFIED against the spec supplied to this build —
 * canada.ca is the source of truth if these tables change.
 */
export const TABLES_LAST_VERIFIED = "2026-08-31";

export const CANADA_CA_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/standard-requirements/language-requirements/test-equivalency-charts.html";

export type Band = [number, number];
export type LevelBands = Partial<Record<number, Band>>;

export interface ExamTable {
  id: string;
  label: { fr: string; en: string };
  note: { fr: string; en: string };
  scale: string;
  skills: Record<Skill, LevelBands>;
}

/**
 * TEF Canada — "ancien score" bands used by IRCC Express Entry
 * instructions. TEF certificates may show BOTH a 0–699 column and an
 * "Équivalence ancien score" column; Express Entry asks for the
 * ancien-score correspondence below.
 */
export const TEF_ANCIEN: ExamTable = {
  id: "tef-ancien",
  label: {
    fr: "TEF Canada — Équivalence « ancien score » (Entrée express)",
    en: "TEF Canada — “Ancien score” equivalence (Express Entry)",
  },
  note: {
    fr: "Colonne « Équivalence ancien score » de votre attestation. C'est celle qu'IRCC demande pour Entrée express.",
    en: "The “Équivalence ancien score” column on your certificate. This is the one IRCC asks for in Express Entry.",
  },
  scale: "ancien barème",
  skills: {
    speaking: { 7: [310, 348], 8: [349, 370], 9: [371, 392] },
    listening: { 7: [249, 279], 8: [280, 297], 9: [298, 315] },
    reading: { 7: [207, 232], 8: [233, 247], 9: [248, 262] },
    writing: { 7: [310, 348], 8: [349, 370], 9: [371, 392] },
  },
};

/**
 * TEF Canada on the 0–699 scale — correspondence used on some IRCC
 * pages (e.g. PGWP) for tests taken after 10 December 2023. Shown as a
 * second tab so users whose PDF shows /699 are not confused.
 */
export const TEF_699: ExamTable = {
  id: "tef-699",
  label: {
    fr: "TEF Canada — Barème /699 (tests après le 10 décembre 2023)",
    en: "TEF Canada — /699 scale (tests after 10 December 2023)",
  },
  note: {
    fr: "Utilisé sur certaines pages IRCC (PTPD, etc.). Vérifiez quelle colonne votre programme demande.",
    en: "Used on some IRCC pages (PGWP, etc.). Check which column your program asks for.",
  },
  scale: "0–699",
  skills: {
    reading: { 10: [546, 699], 9: [503, 545], 8: [462, 502], 7: [434, 461], 6: [393, 433], 5: [352, 392], 4: [306, 351] },
    writing: { 10: [558, 699], 9: [512, 557], 8: [472, 511], 7: [428, 471], 6: [379, 427], 5: [330, 378], 4: [268, 329] },
    listening: { 10: [546, 699], 9: [503, 545], 8: [462, 502], 7: [434, 461], 6: [393, 433], 5: [352, 392], 4: [306, 351] },
    speaking: { 10: [556, 699], 9: [518, 555], 8: [494, 517], 7: [456, 493], 6: [422, 455], 5: [387, 421], 4: [328, 386] },
  },
};

/** TCF Canada — IRCC table (CE/CO on 331–699, EE/EO on 0–20). */
export const TCF: ExamTable = {
  id: "tcf",
  label: { fr: "TCF Canada — Tableau IRCC", en: "TCF Canada — IRCC table" },
  note: {
    fr: "Compréhensions notées sur 331–699, expressions sur 0–20.",
    en: "Comprehension scored on 331–699, production on 0–20.",
  },
  scale: "CE/CO : 331–699 · EE/EO : 0–20",
  skills: {
    reading: { 10: [549, 699], 9: [524, 548], 8: [499, 523], 7: [453, 498], 6: [406, 452], 5: [375, 405], 4: [342, 374] },
    writing: { 10: [16, 20], 9: [14, 15], 8: [12, 13], 7: [10, 11], 6: [7, 9], 5: [6, 6], 4: [4, 5] },
    listening: { 10: [549, 699], 9: [523, 548], 8: [503, 522], 7: [458, 502], 6: [398, 457], 5: [369, 397], 4: [331, 368] },
    speaking: { 10: [16, 20], 9: [14, 15], 8: [12, 13], 7: [10, 11], 6: [7, 9], 5: [6, 6], 4: [4, 5] },
  },
};

export const ALL_TABLES = [TEF_ANCIEN, TEF_699, TCF];
