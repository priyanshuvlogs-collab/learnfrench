"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { WRITING_PROMPTS } from "@/content/writing-prompts";
import { Badge, Card } from "@/components/ui";

const TASK_LABEL: Record<string, string> = {
  A: "TEF · Section A — message (80+ words, ~25 min)",
  B: "TEF · Section B — argument (200+ words, ~35 min)",
  T1: "TCF · Task 1 — message (60–120 words)",
  T2: "TCF · Task 2 — experience (120–150 words)",
  T3: "TCF · Task 3 — comparison / opinion (120–180 words)",
};

export default function WritingListPage() {
  const profile = useApp((s) => s.profile)!;
  const subs = useApp((s) => s.writingSubs);
  const preferred = profile.exam === "UNDECIDED" ? null : profile.exam;
  const prompts = [...WRITING_PROMPTS].sort((a, b) =>
    preferred ? Number(b.exam === preferred) - Number(a.exam === preferred) : 0
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">Writing studio</h1>
        <p className="mt-1 text-sm text-ink-2">
          Official timers and word minima. The brief is in French — you write in French. Scoring uses
          a 5-dimension examiner grid, never a vague impression. Paste-from-translation is blocked;
          the coach flags a sudden jump and asks you to rewrite in your own words.
        </p>
      </header>
      <div className="space-y-3">
        {prompts.map((p) => {
          const done = subs.filter((s) => s.promptId === p.id);
          const best = done.length ? Math.max(...done.map((d) => d.estNCLC)) : null;
          return (
            <Link key={p.id} href={`/writing/${p.id}`} className="block">
              <Card className="transition-colors hover:border-accent">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone={p.exam === "TEF" ? "accent" : "gold"}>{p.exam} {p.task}</Badge>
                      {best !== null && <Badge tone="ok">Best try: ~NCLC {best}</Badge>}
                    </div>
                    <h2 className="mt-1.5 font-semibold">{p.title}</h2>
                    <p className="text-xs text-ink-3">{TASK_LABEL[p.task]}</p>
                  </div>
                  <span className="font-display text-sm text-ink-3">{p.minWords}+ words · {p.minutes} min</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
