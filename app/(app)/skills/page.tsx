"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { Skill, SKILL_LABELS, SKILLS } from "@/lib/types";
import { estimateSkill, formatNCLCRange, readiness } from "@/lib/nclc";
import { Badge, Card } from "@/components/ui";
import { LISTENING_ITEMS } from "@/content/listening";
import { READING_ITEMS } from "@/content/reading";
import { WRITING_PROMPTS } from "@/content/writing-prompts";
import { SPEAKING_PROMPTS } from "@/content/speaking-prompts";

const NEXT_TASKS: Record<Skill, string[]> = {
  listening: [
    "One listen, not two: predict → hear the function → eliminate",
    "Mental dictation of numbers and times",
    "Traps among look-alike options",
  ],
  reading: [
    "The question first, then scan the text",
    "Paragraph function: example, contrast, cause",
    "Administrative French: housing, work, health",
  ],
  writing: [
    "Task A: 100% of the brief, right register",
    "Task B: thesis → 2 arguments + example → concession",
    "Reuse 3 templates from the formula bank",
  ],
  speaking: [
    "Forced structure: opinion → reason → example → close",
    "French fillers (alors, en fait…) instead of English",
    "Second take: “say it again, better”",
  ],
};

export default function SkillsPage() {
  const skills = useApp((s) => s.skills);
  const profile = useApp((s) => s.profile)!;
  const sessions = useApp((s) => s.sessions);
  const estimates = useMemo(
    () => Object.fromEntries(SKILLS.map((s) => [s, estimateSkill(skills[s])])) as Record<Skill, ReturnType<typeof estimateSkill>>,
    [skills]
  );
  const { weakest } = readiness(estimates);
  const counts: Record<Skill, number> = {
    listening: LISTENING_ITEMS.length,
    reading: READING_ITEMS.length,
    writing: WRITING_PROMPTS.length,
    speaking: SPEAKING_PROMPTS.length,
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">Skills</h1>
        <p className="mt-1 text-sm text-ink-2">Four papers, four separate estimates. IRCC does not average.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {SKILLS.map((s) => {
          const e = estimates[s];
          const href = s === "writing" ? "/writing" : s === "speaking" ? "/speaking" : `/skills/${s}`;
          const done = sessions.filter((x) => x.skill === s).length;
          return (
            <Card key={s} className={s === weakest ? "border-warn/40" : ""}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-semibold">{SKILL_LABELS[s].en}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl font-semibold">{formatNCLCRange(e)}</span>
                    <Badge tone={e.confidence === "high" ? "ok" : e.confidence === "medium" ? "accent" : "ink"}>
                      {e.confidence === "high" ? "High" : e.confidence === "medium" ? "Medium" : "Low"} confidence · {e.samples} scored task{e.samples !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
                {s === weakest && <Badge tone="warn">Priority</Badge>}
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
                {NEXT_TASKS[s].map((t) => (
                  <li key={t} className="flex gap-2"><span className="text-accent">→</span>{t}</li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-ink-3">{counts[s]} practice items · {done} session{done !== 1 ? "s" : ""} done</span>
                <Link href={href} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-2">
                  Practise
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-ink-3">Target: NCLC {profile.targetNCLC} in each of the four skills. Pedagogical estimate.</p>
    </div>
  );
}
