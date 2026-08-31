"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CoachMemoryBullet,
  CoachMessage,
  MockResult,
  Profile,
  SessionRec,
  Skill,
  SkillState,
  SpeakingSubmission,
  SrsCardState,
  StreakState,
  WritingSubmission,
} from "./types";
import { initialStreak, reconcile, recordQualifyingDay } from "./streak";
import { review as srsReview } from "./srs";
import { addDays, todayKey } from "./dates";

function emptySkill(): SkillState {
  return { scores: [], weakPatterns: [] };
}

export interface AppState {
  profile: Profile | null;
  onboarded: boolean;
  skills: Record<Skill, SkillState>;
  sessions: SessionRec[];
  streak: StreakState;
  srs: Record<string, SrsCardState>;
  writingSubs: WritingSubmission[];
  speakingSubs: SpeakingSubmission[];
  coachLog: CoachMessage[];
  coachMemory: CoachMemoryBullet[];
  mocks: MockResult[];

  signIn: (name: string, email: string) => void;
  completeOnboarding: (profile: Profile, selfLevels: Record<Skill, number>) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  recordSession: (rec: Omit<SessionRec, "id" | "date" | "qualifying"> & { qualifying?: boolean }) => SessionRec;
  addSkillScore: (skill: Skill, score: number) => void;
  addWeakPattern: (skill: Skill, pattern: string) => void;
  reviewCard: (cardId: string, grade: 0 | 1 | 2 | 3) => void;
  addWriting: (sub: WritingSubmission) => void;
  addSpeaking: (sub: SpeakingSubmission) => void;
  addCoachMessage: (msg: CoachMessage) => void;
  addMemory: (text: string) => void;
  addMock: (m: MockResult) => void;
  reconcileStreak: () => void;
  resetAll: () => void;
}

let idCounter = 0;
function uid(): string {
  idCounter += 1;
  return `${Date.now().toString(36)}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

const QUALIFY_MIN_MINUTES = 5;
const QUALIFY_MIN_ITEMS = 5;

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      onboarded: false,
      skills: {
        listening: emptySkill(),
        reading: emptySkill(),
        writing: emptySkill(),
        speaking: emptySkill(),
      },
      sessions: [],
      streak: initialStreak(),
      srs: {},
      writingSubs: [],
      speakingSubs: [],
      coachLog: [],
      coachMemory: [],
      mocks: [],

      signIn: (name, email) =>
        set((st) => ({
          profile: st.profile
            ? { ...st.profile, name, email }
            : {
                name,
                email,
                exam: "UNDECIDED",
                targetNCLC: 7,
                dailyMinutes: 20,
                motivation: "",
                uiLang: "fr",
                createdAt: new Date().toISOString(),
                intention: { time: "Ce soir après le dîner", minutes: 20, skill: "auto" },
                notificationsOptIn: false,
              },
        })),

      completeOnboarding: (profile, selfLevels) =>
        set((st) => {
          const skills = { ...st.skills };
          (Object.keys(selfLevels) as Skill[]).forEach((s) => {
            skills[s] = { ...skills[s], placement: selfLevels[s] };
          });
          return { profile, onboarded: true, skills };
        }),

      updateProfile: (patch) =>
        set((st) => ({ profile: st.profile ? { ...st.profile, ...patch } : st.profile })),

      recordSession: (rec) => {
        const qualifying =
          rec.qualifying ??
          ((rec.minutes >= QUALIFY_MIN_MINUTES && (rec.items ?? 0) >= QUALIFY_MIN_ITEMS) ||
            rec.type === "writing" ||
            rec.type === "speaking");
        const full: SessionRec = { ...rec, id: uid(), date: todayKey(), qualifying };
        set((st) => {
          let streak: StreakState = reconcile(st.streak);
          if (qualifying) streak = recordQualifyingDay(streak);
          return { sessions: [...st.sessions, full], streak };
        });
        return full;
      },

      addSkillScore: (skill, score) =>
        set((st) => {
          const prev = st.skills[skill];
          const scores = [...prev.scores, { date: todayKey(), score }].slice(-12);
          return { skills: { ...st.skills, [skill]: { ...prev, scores } } };
        }),

      addWeakPattern: (skill, pattern) =>
        set((st) => {
          const prev = st.skills[skill];
          const weakPatterns = [...new Set([...prev.weakPatterns, pattern])].slice(-8);
          return { skills: { ...st.skills, [skill]: { ...prev, weakPatterns } } };
        }),

      reviewCard: (cardId, grade) =>
        set((st) => {
          const prev = st.srs[cardId] ?? { interval: 0, ease: 2.5, due: todayKey(), reps: 0, lapses: 0 };
          return { srs: { ...st.srs, [cardId]: srsReview(prev as SrsCardState, grade) } };
        }),

      addWriting: (sub) => set((st) => ({ writingSubs: [...st.writingSubs, sub] })),
      addSpeaking: (sub) => set((st) => ({ speakingSubs: [...st.speakingSubs, sub] })),

      addCoachMessage: (msg) =>
        set((st) => ({ coachLog: [...st.coachLog, msg].slice(-80) })),

      addMemory: (text) =>
        set((st) => {
          const cutoff = addDays(todayKey(), -14);
          const kept = st.coachMemory.filter((b) => b.date >= cutoff);
          return { coachMemory: [...kept, { date: todayKey(), text }].slice(-30) };
        }),

      addMock: (m) => set((st) => ({ mocks: [...st.mocks, m] })),

      reconcileStreak: () => set((st) => ({ streak: reconcile(st.streak) })),

      resetAll: () =>
        set({
          profile: null,
          onboarded: false,
          skills: { listening: emptySkill(), reading: emptySkill(), writing: emptySkill(), speaking: emptySkill() },
          sessions: [],
          streak: initialStreak(),
          srs: {},
          writingSubs: [],
          speakingSubs: [],
          coachLog: [],
          coachMemory: [],
          mocks: [],
        }),
    }),
    { name: "lumen-francais-v1" }
  )
);

/** Minutes of time-on-task recorded today. */
export function minutesToday(sessions: SessionRec[]): number {
  const t = todayKey();
  return sessions.filter((s) => s.date === t).reduce((acc, s) => acc + s.minutes, 0);
}

export function hasQualifyingToday(sessions: SessionRec[]): boolean {
  const t = todayKey();
  return sessions.some((s) => s.date === t && s.qualifying);
}

/** Rolling average lexical density of past writing, for paste detection. */
export function historyLexicalDensity(subs: WritingSubmission[]): number | undefined {
  const withLd = subs.filter((s) => s.lexicalDensity !== undefined).slice(-6);
  if (withLd.length < 2) return undefined;
  return withLd.reduce((a, b) => a + (b.lexicalDensity ?? 0), 0) / withLd.length;
}
