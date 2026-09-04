"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { Badge, Card, Kicker } from "@/components/ui";

const DRILLS: {
  href: string;
  title: string;
  desc: string;
  skills: string;
  minutes: string;
  icon: string;
}[] = [
  {
    href: "/lab/dictation",
    title: "Dictée",
    desc: "Une phrase lue à voix haute, deux écoutes, et vous l'écrivez. La correction distingue les mots faux, les mots manquants et les simples fautes d'accent — avec le piège expliqué à chaque phrase.",
    skills: "CO + EE",
    minutes: "~6 min",
    icon: "✎",
  },
  {
    href: "/lab/numbers",
    title: "Nombres au vol",
    desc: "Prix, heures, années, numéros de téléphone — dictés une seule fois, comme à la section A de la compréhension orale. Vous notez les chiffres, l'oreille s'affûte.",
    skills: "CO",
    minutes: "~4 min",
    icon: "№",
  },
  {
    href: "/lab/conjugation",
    title: "Sprint de conjugaison",
    desc: "Les six temps qui rapportent des points : présent irrégulier, passé composé et ses accords, imparfait, futur, conditionnel de politesse, subjonctif. Vous tapez la forme, la règle suit.",
    skills: "EE + EO",
    minutes: "~5 min",
    icon: "⟐",
  },
];

export default function LabPage() {
  const sessions = useApp((s) => s.sessions);
  const labCount = sessions.filter((s) => ["dictation", "numbers", "conjugation"].includes(s.type)).length;

  return (
    <div className="space-y-5">
      <header>
        <Kicker>Labo</Kicker>
        <h1 className="mt-1 font-display text-2xl font-semibold">Les mécaniques, isolées</h1>
        <p className="mt-1 text-sm text-ink-2">
          Trois exercices courts qui travaillent les réflexes que les questionnaires ne touchent pas :
          l&apos;orthographe sous dictée, les chiffres à l&apos;oreille, la conjugaison sans filet.
          {labCount > 0 && <span className="text-ink-3"> · {labCount} session{labCount > 1 ? "s" : ""} au labo jusqu&apos;ici</span>}
        </p>
      </header>

      <div className="space-y-4">
        {DRILLS.map((d) => (
          <Link key={d.href} href={d.href} className="block">
            <Card className="transition-colors hover:border-accent">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="font-display text-lg text-accent">{d.icon}</span>
                    <h2 className="font-display text-lg font-semibold">{d.title}</h2>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{d.desc}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge tone="accent">{d.skills}</Badge>
                  <span className="text-xs text-ink-3">{d.minutes}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-paper">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Et votre carnet</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Les mots que vous croisez dans les exercices et que vous voulez garder vont dans{" "}
          <Link href="/notebook" className="font-semibold text-accent underline">Mon carnet</Link> — ils
          entrent automatiquement dans le rappel espacé, mélangés aux 120 cartes du programme.
        </p>
      </Card>
    </div>
  );
}
