"use client";

import Link from "next/link";
import { RESOURCES } from "@/content/resources";
import { SKILL_LABELS, Skill } from "@/lib/types";
import { L, useLang } from "@/lib/i18n";
import { Badge, Card } from "@/components/ui";

const GROUPS: { key: Skill | "grammar"; fr: string; en: string; href?: string; hrefLabel?: { fr: string; en: string } }[] = [
  { key: "listening", fr: SKILL_LABELS.listening.fr, en: SKILL_LABELS.listening.en, href: "/skills/listening", hrefLabel: { fr: "S'entraîner en une écoute", en: "Practise the one-listen drill" } },
  { key: "reading", fr: SKILL_LABELS.reading.fr, en: SKILL_LABELS.reading.en, href: "/skills/reading", hrefLabel: { fr: "Faire un exercice chronométré", en: "Do a timed drill" } },
  { key: "writing", fr: SKILL_LABELS.writing.fr, en: SKILL_LABELS.writing.en, href: "/writing", hrefLabel: { fr: "Ouvrir l'atelier d'écriture", en: "Open the writing lab" } },
  { key: "speaking", fr: SKILL_LABELS.speaking.fr, en: SKILL_LABELS.speaking.en, href: "/speaking", hrefLabel: { fr: "S'enregistrer maintenant", en: "Record yourself now" } },
  { key: "grammar", fr: "Grammaire de base", en: "Basic grammar", href: "/grammar", hrefLabel: { fr: "Drill être / avoir", en: "Être / avoir drill" } },
];

const KIND_LABEL = {
  youtube: { fr: "YouTube", en: "YouTube", tone: "warn" as const },
  podcast: { fr: "Balado", en: "Podcast", tone: "gold" as const },
  site: { fr: "Site", en: "Site", tone: "accent" as const },
  tool: { fr: "Outil", en: "Tool", tone: "ink" as const },
};

export default function ResourcesPage() {
  const lang = useLang();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">{L(lang, "Ressources générales", "General resources")}</h1>
        <p className="mt-1 text-sm text-ink-2">
          {L(lang,
            "Chaînes YouTube, balados et sites gratuits, triés par compétence — avec, pour chacun, LA méthode pour en faire de l'entraînement d'examen et pas du visionnage passif.",
            "Free YouTube channels, podcasts and sites, sorted by skill — each with THE method to turn it into exam training instead of passive watching.")}
        </p>
      </header>

      <div className="rounded-xl bg-accent-soft p-4 text-sm leading-relaxed text-accent">
        {L(lang,
          "Règle d'or pour les vidéos : 1re écoute SANS sous-titres (comme à l'examen, l'audio passe une fois), notez qui parle et pourquoi, répondez dans votre tête, PUIS revoyez avec sous-titres pour vérifier. 10 minutes ainsi valent une heure passive.",
          "Golden rule for videos: first watch WITHOUT subtitles (like the exam, audio plays once), note who is speaking and why, answer in your head, THEN rewatch with subtitles to verify. 10 minutes like this beat a passive hour.")}
      </div>

      {GROUPS.map((g) => {
        const items = RESOURCES.filter((r) => r.skill === g.key);
        if (items.length === 0) return null;
        return (
          <section key={g.key}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{L(lang, g.fr, g.en)}</h2>
              {g.href && (
                <Link href={g.href} className="text-xs font-semibold text-accent hover:underline">
                  {L(lang, g.hrefLabel!.fr, g.hrefLabel!.en)} →
                </Link>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((r) => (
                <Card key={r.id} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Badge tone={KIND_LABEL[r.kind].tone}>{L(lang, KIND_LABEL[r.kind].fr, KIND_LABEL[r.kind].en)}</Badge>
                    <Badge tone="ink">{r.level}</Badge>
                  </div>
                  <h3 className="mt-2 font-semibold">{r.title}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-2">{L(lang, r.fr, r.en)}</p>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-semibold text-accent hover:underline"
                  >
                    {L(lang, "Ouvrir", "Open")} ↗
                  </a>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-xs text-ink-3">
        {L(lang,
          "Ressources externes indépendantes — Lumen n'est affilié à aucune d'elles. L'immersion complète l'entraînement noté, elle ne le remplace pas.",
          "Independent external resources — Lumen is not affiliated with any of them. Immersion complements scored training; it does not replace it.")}
      </p>
    </div>
  );
}
