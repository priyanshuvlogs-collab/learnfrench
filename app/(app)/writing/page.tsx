"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { WRITING_PROMPTS } from "@/content/writing-prompts";
import { Badge, Card } from "@/components/ui";

const TASK_LABEL: Record<string, string> = {
  A: "TEF · Section A — message (80+ mots, ~25 min)",
  B: "TEF · Section B — argumentation (200+ mots, ~35 min)",
  T1: "TCF · Tâche 1 — message (60–120 mots)",
  T2: "TCF · Tâche 2 — expérience (120–150 mots)",
  T3: "TCF · Tâche 3 — comparaison / opinion (120–180 mots)",
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
        <h1 className="font-display text-2xl font-semibold">Atelier d&apos;écriture</h1>
        <p className="mt-1 text-sm text-ink-2">
          Minuteries et minimums officiels. La note vient d&apos;une grille d&apos;examinateur en 5
          dimensions — jamais d&apos;impression vague. Interdit : le collage traduit ; le coach le
          détecte et demande une réécriture avec vos mots.
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
                      {best !== null && <Badge tone="ok">Meilleur essai : ~NCLC {best}</Badge>}
                    </div>
                    <h2 className="mt-1.5 font-semibold">{p.title}</h2>
                    <p className="text-xs text-ink-3">{TASK_LABEL[p.task]}</p>
                  </div>
                  <span className="font-display text-sm text-ink-3">{p.minWords}+ mots · {p.minutes} min</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
