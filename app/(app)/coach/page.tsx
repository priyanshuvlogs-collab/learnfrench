"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useApp, minutesToday } from "@/lib/store";
import { Skill, SKILLS } from "@/lib/types";
import { estimateSkill, readiness } from "@/lib/nclc";
import { coachReply, CoachContext, CoachReply } from "@/lib/coach";
import { daysUntil, nowMs } from "@/lib/dates";
import { L, useLang } from "@/lib/i18n";
import { Badge, Btn } from "@/components/ui";

const CHIPS = {
  fr: ["Mon plan de la semaine", "Je panique pour mon visa", "Par quoi je commence ce soir ?", "Garantis-moi CLB 7 en 30 jours"],
  en: ["My plan for the week", "I'm panicking about my visa", "What should I start with tonight?", "Guarantee me CLB 7 in 30 days"],
} as const;

export default function CoachPage() {
  const profile = useApp((s) => s.profile)!;
  const skills = useApp((s) => s.skills);
  const streak = useApp((s) => s.streak);
  const sessions = useApp((s) => s.sessions);
  const coachLog = useApp((s) => s.coachLog);
  const coachMemory = useApp((s) => s.coachMemory);
  const addCoachMessage = useApp((s) => s.addCoachMessage);
  const addMemory = useApp((s) => s.addMemory);
  const lang = useLang();
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [premium, setPremium] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const ctx: CoachContext = useMemo(
    () => ({
      profile,
      estimates: Object.fromEntries(SKILLS.map((s) => [s, estimateSkill(skills[s])])) as Record<Skill, ReturnType<typeof estimateSkill>>,
      streak,
      minutesToday: minutesToday(sessions),
      sessions,
      memory: coachMemory.map((b) => b.text),
    }),
    [profile, skills, streak, sessions, coachMemory]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [coachLog.length, thinking]);

  // which engine is live? (OpenAI when a key is configured, local rules otherwise)
  useEffect(() => {
    fetch("/api/coach")
      .then((r) => r.json())
      .then((d) => {
        setAiConfigured(Boolean(d.configured));
        setPremium(Boolean(d.premium));
      })
      .catch(() => setAiConfigured(false));
  }, []);

  // opening message stays deterministic: instant, costless, always on-spec
  useEffect(() => {
    if (coachLog.length === 0) {
      const r = coachReply("", ctx);
      addCoachMessage({ role: "coach", text: `Bonjour ${profile.name}. Je suis Camille, votre coach.\n\n${r.text}`, action: r.action, ts: nowMs() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Ask the OpenAI-backed API; return null to use the local fallback. */
  const askApi = useCallback(
    async (message: string): Promise<CoachReply | null> => {
      if (!premium) return null; // freemium: free plan uses the local engine
      try {
        const { weakest } = readiness(ctx.estimates);
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            lang,
            history: coachLog.slice(-10).map((m) => ({ role: m.role, text: m.text })),
            context: {
              name: profile.name,
              exam: profile.exam,
              targetNCLC: profile.targetNCLC,
              daysToExam: daysUntil(profile.examDate),
              dailyMinutes: profile.dailyMinutes,
              minutesToday: ctx.minutesToday,
              intention: profile.intention.time,
              streak: { current: streak.current, longest: streak.longest, freezesLeft: streak.freezesLeft },
              estimates: Object.fromEntries(
                SKILLS.map((s) => {
                  const e = ctx.estimates[s];
                  return [s, { nclc: e.nclc, low: e.low, high: e.high, confidence: e.confidence }];
                })
              ),
              weakest,
              memory: ctx.memory.slice(-12),
            },
          }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.ok || !data.text) return null;
        return { text: data.text, action: data.action, memoryNote: data.memoryNote };
      } catch {
        return null;
      }
    },
    [ctx, lang, coachLog, profile, streak, premium]
  );

  async function send(text: string) {
    const t = text.trim();
    if (!t || thinking) return;
    addCoachMessage({ role: "user", text: t, ts: nowMs() });
    setInput("");
    setThinking(true);
    const apiReply = await askApi(t);
    const r = apiReply ?? coachReply(t, ctx);
    if (r.memoryNote) addMemory(r.memoryNote);
    addCoachMessage({ role: "coach", text: r.text, action: r.action, ts: nowMs() });
    setThinking(false);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:h-[calc(100vh-7rem)]">
      <header className="pb-3">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-semibold">Camille</h1>
          {aiConfigured !== null && (
            <Badge tone={aiConfigured && premium ? "ok" : "ink"}>
              {aiConfigured && premium ? L(lang, "IA · OpenAI", "AI · OpenAI") : L(lang, "moteur local", "local engine")}
            </Badge>
          )}
        </div>
        <p className="text-xs text-ink-3">
          {L(lang,
            `Coach d'examen · connaît vos 14 derniers jours (${coachMemory.length} note${coachMemory.length > 1 ? "s" : ""}) · ne donne aucun conseil juridique`,
            `Exam coach · knows your last 14 days (${coachMemory.length} note${coachMemory.length === 1 ? "" : "s"}) · gives no legal advice`)}
        </p>
        {aiConfigured === false && (
          <p className="mt-0.5 text-xs text-ink-3">
            {L(lang,
              "Ajoutez OPENAI_API_KEY côté serveur pour activer les réponses IA — en attendant, le moteur local règles+état répond.",
              "Add OPENAI_API_KEY on the server to enable AI replies — meanwhile the local rules+state engine answers.")}
          </p>
        )}
        {aiConfigured === true && !premium && (
          <p className="mt-0.5 text-xs text-gold">
            {L(lang,
              "Le coach IA (OpenAI) est une fonction Premium — l'administrateur peut vous l'activer. Le moteur local, gratuit, connaît déjà tout votre état.",
              "The AI coach (OpenAI) is a Premium feature — the admin can enable it for you. The free local engine already knows your full state.")}
          </p>
        )}
        {lang === "en" && (
          <p className="mt-0.5 text-xs text-ink-3">
            Camille coaches in French on purpose — write to her in English and she&apos;ll answer briefly in English, then give you one French sentence to repeat.
          </p>
        )}
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-line bg-white p-4">
        {coachLog.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user" ? "bg-accent text-white" : "bg-paper text-ink"
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              {m.action && (
                <Link
                  href={m.action.href}
                  className="mt-3 inline-block rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-accent-2"
                >
                  {m.action.label} →
                </Link>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-paper px-4 py-3 text-sm text-ink-3">
              <span className="inline-flex gap-1" aria-label={L(lang, "Camille réfléchit", "Camille is thinking")}>
                <span className="animate-pulse">●</span>
                <span className="animate-pulse [animation-delay:150ms]">●</span>
                <span className="animate-pulse [animation-delay:300ms]">●</span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {CHIPS[lang].map((c) => (
          <button
            key={c}
            onClick={() => send(c)}
            disabled={thinking}
            className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink-2 hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {c}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-2 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={L(lang, "Écrivez à Camille — en français de préférence…", "Write to Camille — in French if you can, English works too…")}
          className="flex-1 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm focus:border-accent"
          aria-label={L(lang, "Message au coach", "Message to the coach")}
        />
        <Btn type="submit" onClick={() => send(input)} disabled={thinking}>
          {L(lang, "Envoyer", "Send")}
        </Btn>
      </form>
    </div>
  );
}
