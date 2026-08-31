"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { L, useLang } from "@/lib/i18n";
import { SPEAKING_PROMPTS } from "@/content/speaking-prompts";
import { Badge, Card } from "@/components/ui";

const TASK_LABEL: Record<string, { fr: string; en: string }> = {
  A: { fr: "TEF · A — obtenir des renseignements", en: "TEF · A — information gathering" },
  B: { fr: "TEF · B — convaincre", en: "TEF · B — persuade" },
  T1: { fr: "TCF · T1 — entretien dirigé (sans préparation)", en: "TCF · T1 — guided interview (no prep)" },
  T2: { fr: "TCF · T2 — interaction (avec préparation)", en: "TCF · T2 — interaction (with prep)" },
  T3: { fr: "TCF · T3 — point de vue (sans préparation)", en: "TCF · T3 — point of view (no prep)" },
};

export default function SpeakingListPage() {
  const profile = useApp((s) => s.profile)!;
  const subs = useApp((s) => s.speakingSubs);
  const lang = useLang();
  const preferred = profile.exam === "UNDECIDED" ? null : profile.exam;
  const prompts = [...SPEAKING_PROMPTS].sort((a, b) =>
    preferred ? Number(b.exam === preferred) - Number(a.exam === preferred) : 0
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">{L(lang, "Atelier d'expression orale", "Speaking lab")}</h1>
        <p className="mt-1 text-sm text-ink-2">
          {L(lang,
            "Chronos d'examen à l'écran. Enregistrez, obtenez la transcription et une note en 5 dimensions — puis « redites-le, en mieux ». La structure est forcée : opinion → raison → exemple → clôture.",
            "Exam clocks on screen. Record, get a transcript and a 5-dimension score — then “say it again, better”. The structure is forced: opinion → reason → example → close.")}
        </p>
        <p className="mt-1 text-xs text-ink-3">
          {L(lang,
            "Vous parlez en français ; chaque consigne existe aussi en anglais.",
            "You speak in French; every prompt also has an English version.")}
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
                      {best !== null && <Badge tone="ok">{L(lang, "Meilleur essai :", "Best attempt:")} ~NCLC {best}</Badge>}
                    </div>
                    <h2 className="mt-1.5 font-semibold">{p.title}</h2>
                    <p className="text-xs text-ink-3">{TASK_LABEL[p.task][lang]}</p>
                  </div>
                  <span className="font-display text-sm text-ink-3">
                    {p.prepSeconds > 0
                      ? L(lang, `${p.prepSeconds} s prép · `, `${p.prepSeconds}s prep · `)
                      : L(lang, "sans prép · ", "no prep · ")}
                    {p.speakSeconds} s {L(lang, "parole", "speaking")}
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
