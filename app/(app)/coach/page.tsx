"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useApp, minutesToday } from "@/lib/store";
import { Skill, SKILLS } from "@/lib/types";
import { estimateSkill } from "@/lib/nclc";
import { coachReply, CoachContext } from "@/lib/coach";
import { nowMs } from "@/lib/dates";
import { Btn } from "@/components/ui";

const CHIPS = ["My weekly plan", "I am panicking about my visa", "What do I start with tonight?", "Guarantee me CLB 7 in 30 days"];

export default function CoachPage() {
  const profile = useApp((s) => s.profile)!;
  const skills = useApp((s) => s.skills);
  const streak = useApp((s) => s.streak);
  const sessions = useApp((s) => s.sessions);
  const coachLog = useApp((s) => s.coachLog);
  const coachMemory = useApp((s) => s.coachMemory);
  const addCoachMessage = useApp((s) => s.addCoachMessage);
  const addMemory = useApp((s) => s.addMemory);
  const [input, setInput] = useState("");
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
  }, [coachLog.length]);

  // opening message
  useEffect(() => {
    if (coachLog.length === 0) {
      const r = coachReply("", ctx);
      addCoachMessage({ role: "coach", text: `Hello ${profile.name}. I am Camille, your coach.\n\n${r.text}`, action: r.action, ts: nowMs() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    addCoachMessage({ role: "user", text: t, ts: nowMs() });
    const r = coachReply(t, ctx);
    if (r.memoryNote) addMemory(r.memoryNote);
    // small delay for natural rhythm
    setTimeout(() => {
      addCoachMessage({ role: "coach", text: r.text, action: r.action, ts: nowMs() });
    }, 350);
    setInput("");
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:h-[calc(100vh-7rem)]">
      <header className="pb-3">
        <h1 className="font-display text-2xl font-semibold">Camille</h1>
        <p className="text-xs text-ink-3">
          Exam coach · knows your last 14 days ({coachMemory.length} note{coachMemory.length !== 1 ? "s" : ""}) · no legal advice
        </p>
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
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => send(c)}
            className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink-2 hover:border-accent hover:text-accent"
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
          placeholder="Write to Camille — English or French…"
          className="flex-1 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm focus:border-accent"
          aria-label="Message to the coach"
        />
        <Btn type="submit" onClick={() => send(input)}>Send</Btn>
      </form>
    </div>
  );
}
