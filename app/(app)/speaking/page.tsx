"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { SPEAKING_PROMPTS } from "@/content/speaking-prompts";
import { Badge, Card } from "@/components/ui";

const TASK_LABEL: Record<string, string> = {
  A: "TEF · A — obtenir des renseignements",
  B: "TEF · B — convaincre",
  T1: "TCF · T1 — entretien dirigé (sans préparation)",
  T2: "TCF · T2 — interaction (avec préparation)",
  T3: "TCF · T3 — point de vue (sans préparation)",
};

export default function SpeakingListPage() {
  const profile = useApp((s) => s.profile)!;
  const subs = useApp((s) => s.speakingSubs);
  const preferred = profile.exam === "UNDECIDED" ? null : profile.exam;
  const prompts = [...SPEAKING_PROMPTS].sort((a, b) =>
    preferred ? Number(b.exam === preferred) - Number(a.exam === preferred) : 0
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">Atelier d&apos;expression orale</h1>
        <p className="mt-1 text-sm text-ink-2">
          Chronos d&apos;examen à l&apos;écran. Enregistrez, obtenez la transcription et une note en 5
          dimensions — puis « redites-le, en mieux ». La structure est forcée : opinion → raison →
          exemple → clôture.
        </p>
      </header>
      <div className="space-y-3">
        {prompts.map((p) => {
          const done = subs.filter((s) => s.promptId === p.id);
          const best = done.length ? Math.max(...done.map((d) => d.estNCLC)) : null;
          return (
            <Link key={p.id} href={`/speaking/${p.id}`} className="block">
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
                  <span className="font-display text-sm text-ink-3">
                    {p.prepSeconds > 0 ? `${p.prepSeconds} s prép · ` : "sans prép · "}
                    {p.speakSeconds} s parole
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
