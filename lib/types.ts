export type Exam = "TEF" | "TCF" | "UNDECIDED";
export type Skill = "listening" | "reading" | "writing" | "speaking";
export type TargetNCLC = 5 | 7 | 8 | 9;
export type UiLang = "fr" | "en";

export const SKILLS: Skill[] = ["listening", "reading", "writing", "speaking"];

export const SKILL_LABELS: Record<Skill, { fr: string; en: string; short: string }> = {
  listening: { fr: "Compréhension orale", en: "Listening", short: "CO" },
  reading: { fr: "Compréhension écrite", en: "Reading", short: "CE" },
  writing: { fr: "Expression écrite", en: "Writing", short: "EE" },
  speaking: { fr: "Expression orale", en: "Speaking", short: "EO" },
};

export interface Intention {
  time: string; // e.g. "Ce soir après le dîner"
  minutes: number;
  skill: Skill | "auto";
}

export interface Profile {
  name: string;
  email: string;
  exam: Exam;
  targetNCLC: TargetNCLC;
  examDate?: string; // ISO yyyy-mm-dd
  dailyMinutes: number; // 10 | 20 | 40
  motivation: string;
  uiLang: UiLang;
  createdAt: string;
  intention: Intention;
  notificationsOptIn: boolean;
}

export interface ScoredTask {
  date: string; // yyyy-mm-dd
  score: number; // 0-100 internal scale
}

export interface SkillState {
  placement?: number; // 0-100 from onboarding self-assessment or placement
  scores: ScoredTask[]; // rolling, most recent last, keep 12
  weakPatterns: string[];
}

export interface SessionRec {
  id: string;
  date: string; // yyyy-mm-dd local
  skill: Skill;
  minutes: number;
  type: string; // "drill" | "srs" | "writing" | "speaking" | "mock" | "rescue"
  score?: number; // 0-100
  items?: number;
  qualifying: boolean;
}

export interface StreakState {
  current: number;
  longest: number;
  lastQualifyingDate?: string; // yyyy-mm-dd
  freezesLeft: number;
  freezeResetMonth: string; // "yyyy-mm"
  frozenDates: string[];
}

export interface SrsCardState {
  interval: number; // days
  ease: number;
  due: string; // yyyy-mm-dd
  reps: number;
  lapses: number;
}

export interface RubricScores {
  task: number; // /5 task completion
  coherence: number;
  lexicon: number;
  grammar: number;
  register: number; // writing: register — speaking: fluency/pronunciation
}

export interface WritingSubmission {
  id: string;
  promptId: string;
  date: string;
  text: string;
  words: number;
  minutes: number;
  rubric: RubricScores;
  score: number; // 0-100
  estNCLC: number;
  flags: string[];
  feedback: string[];
  win: string;
  lexicalDensity?: number;
}

export interface SpeakingSubmission {
  id: string;
  promptId: string;
  date: string;
  transcript: string;
  seconds: number;
  rubric: RubricScores;
  score: number;
  estNCLC: number;
  feedback: string[];
  win: string;
}

export interface CoachMessage {
  role: "user" | "coach";
  text: string;
  action?: { label: string; href: string };
  ts: number;
}

export interface CoachMemoryBullet {
  date: string;
  text: string;
}

export interface MockResult {
  id: string;
  date: string;
  skill: Skill;
  exam: Exam;
  correct: number;
  total: number;
  seconds: number;
  answers: { itemId: string; picked: number; correct: boolean; seconds: number }[];
}
