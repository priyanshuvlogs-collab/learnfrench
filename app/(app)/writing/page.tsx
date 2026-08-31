"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { L, useLang } from "@/lib/i18n";
import { WRITING_PROMPTS } from "@/content/writing-prompts";
import { Badge, Card } from "@/components/ui";

const TASK_LABEL: Record<string, { fr: string; en: string }> = {
  A: { fr: "TEF · Section A — message (80+ mots, ~25 min)", en: "TEF · Section A — message (80+ words, ~25 min)" },
  B: { fr: "TEF · Section B — argumentation (200+ mots, ~35 min)", en: "TEF · Section B — argument (200+ words, ~35 min)" },
  T1: { fr: "TCF · Tâche 1 — message (60–120 mots)", en: "TCF · Task 1 — message (60–120 words)" },
  T2: { fr: "TCF · Tâche 2 — expérience (120–150 mots)", en: "TCF · Task 2 — experience (120–150 words)" },
  T3: { fr: "TCF · Tâche 3 — comparaison / opinion (120–180 mots)", en: "TCF · Task 3 — comparison / opinion (120–180 words)" },
};

export default function WritingListPage() {
  const profile = useApp((s) => s.profile)!;
  const subs = useApp((s) => s.writingSubs);
  const lang = useLang();
  const preferred = profile.exam === "UNDECIDED" ? null : profile.exam;
  const prompts = [...WRITING_PROMPTS].sort((a, b) =>
    preferred ? Number(b.exam === preferred) - Number(a.exam === preferred) : 0
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">{L(lang, "Atelier d'écriture", "Writing lab")}</h1>
        <p className="mt-1 text-sm text-ink-2">
          {L(lang,
            "Minuteries et minimums officiels. La note vient d'une grille d'examinateur en 5 dimensions — jamais d'impression vague. Interdit : le collage traduit ; le coach le détecte et demande une réécriture avec vos mots.",
            "Official timers and word minimums. Scoring comes from a 5-dimension examiner rubric — never a vague impression. Forbidden: pasting translations; the coach detects it and asks you to rewrite in your own words.")}
        </p>
        <p className="mt-1 text-xs text-ink-3">
          {L(lang,
            "Vous écrivez en français ; chaque consigne existe aussi en anglais pour être sûr de la mission.",
            "You write in French; every prompt also has an English version so you're sure of the mission.")}
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
                      {best !== null && <Badge tone="ok">{L(lang, "Meilleur essai :", "Best attempt:")} ~NCLC {best}</Badge>}
                    </div>
                    <h2 className="mt-1.5 font-semibold">{p.title}</h2>
                    <p className="text-xs text-ink-3">{TASK_LABEL[p.task][lang]}</p>
                  </div>
                  <span className="font-display text-sm text-ink-3">{p.minWords}+ {L(lang, "mots", "words")} · {p.minutes} min</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
