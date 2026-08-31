"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { Skill, SKILL_LABELS, SKILLS } from "@/lib/types";
import { estimateSkill, formatNCLCRange, readiness } from "@/lib/nclc";
import { L, useLang } from "@/lib/i18n";
import { Badge, Card } from "@/components/ui";
import { LISTENING_ITEMS } from "@/content/listening";
import { READING_ITEMS } from "@/content/reading";
import { WRITING_PROMPTS } from "@/content/writing-prompts";
import { SPEAKING_PROMPTS } from "@/content/speaking-prompts";

const NEXT_TASKS: Record<Skill, { fr: string; en: string }[]> = {
  listening: [
    { fr: "Une écoute, pas deux : prédire → écouter la fonction → éliminer", en: "One listen, not two: predict → listen for function → eliminate" },
    { fr: "Dictée mentale de nombres et d'horaires", en: "Mental dictation of numbers and times" },
    { fr: "Pièges d'options qui se ressemblent", en: "Similar-sounding option traps" },
  ],
  reading: [
    { fr: "La question d'abord, puis balayer le texte", en: "Question first, then scan the text" },
    { fr: "Fonction du paragraphe : exemple, contraste, cause", en: "Paragraph function: example, contrast, cause" },
    { fr: "Français administratif : logement, travail, santé", en: "Admin French: housing, work, health" },
  ],
  writing: [
    { fr: "Tâche A : consigne couverte à 100 %, registre juste", en: "Task A: 100% of the instructions covered, right register" },
    { fr: "Tâche B : thèse → 2 arguments + exemple → concession", en: "Task B: thesis → 2 arguments + example → concession" },
    { fr: "Réutiliser 3 gabarits de la banque de formules", en: "Reuse 3 templates from the phrase bank" },
  ],
  speaking: [
    { fr: "Structure forcée : opinion → raison → exemple → clôture", en: "Forced structure: opinion → reason → example → close" },
    { fr: "Remplisseurs français (alors, en fait…) au lieu de l'anglais", en: "French fillers (alors, en fait…) instead of English panic" },
    { fr: "Deuxième prise : « redites-le, en mieux »", en: "Second take: “say it again, better”" },
  ],
};

export default function SkillsPage() {
  const skills = useApp((s) => s.skills);
  const profile = useApp((s) => s.profile)!;
  const sessions = useApp((s) => s.sessions);
  const lang = useLang();
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
  const confLabel = {
    fr: { high: "élevée", medium: "moyenne", low: "faible" },
    en: { high: "high", medium: "medium", low: "low" },
  }[lang];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">{L(lang, "Compétences", "Skills")}</h1>
        <p className="mt-1 text-sm text-ink-2">
          {L(lang,
            "Quatre épreuves, quatre estimations séparées. IRCC ne fait pas de moyenne.",
            "Four exam sections, four separate estimates. IRCC does not average.")}
        </p>
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
                  <h2 className="font-display text-lg font-semibold">
                    {L(lang, SKILL_LABELS[s].fr, SKILL_LABELS[s].en)}
                    <span className="ml-2 text-xs font-normal text-ink-3">{SKILL_LABELS[s].short}</span>
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl font-semibold">{formatNCLCRange(e)}</span>
                    <Badge tone={e.confidence === "high" ? "ok" : e.confidence === "medium" ? "accent" : "ink"}>
                      {L(lang,
                        `Confiance ${confLabel[e.confidence]} · ${e.samples} tâche${e.samples > 1 ? "s" : ""} notée${e.samples > 1 ? "s" : ""}`,
                        `${confLabel[e.confidence]} confidence · ${e.samples} scored task${e.samples === 1 ? "" : "s"}`)}
                    </Badge>
                  </div>
                </div>
                {s === weakest && <Badge tone="warn">{L(lang, "Priorité", "Priority")}</Badge>}
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
                {NEXT_TASKS[s].map((t) => (
                  <li key={t.fr} className="flex gap-2"><span className="text-accent">→</span>{t[lang]}</li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-ink-3">
                  {L(lang,
                    `${counts[s]} éléments d'entraînement · ${done} session${done > 1 ? "s" : ""}`,
                    `${counts[s]} practice items · ${done} session${done === 1 ? "" : "s"}`)}
                </span>
                <Link href={href} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-2">
                  {L(lang, "S'entraîner", "Practise")}
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-semibold">{L(lang, "Grammaire de base", "Basic grammar")}</h2>
          <p className="mt-1 text-sm text-ink-2">
            {L(lang,
              "Être, avoir, aller, faire — tableaux et drills du carburant d'examen. Toujours réutilisé aussitôt en production.",
              "Être, avoir, aller, faire — tables and drills of the exam's fuel. Always reused immediately in production.")}
          </p>
          <Link href="/grammar" className="mt-3 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-2">
            {L(lang, "Ouvrir la grammaire", "Open grammar")}
          </Link>
        </Card>
        <Card>
          <h2 className="font-display text-lg font-semibold">{L(lang, "Ressources générales", "General resources")}</h2>
          <p className="mt-1 text-sm text-ink-2">
            {L(lang,
              "Chaînes YouTube, balados et sites gratuits par compétence, avec la méthode pour en faire de l'entraînement.",
              "Free YouTube channels, podcasts and sites per skill, with the method to turn them into training.")}
          </p>
          <Link href="/resources" className="mt-3 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-2">
            {L(lang, "Voir les ressources", "Browse resources")}
          </Link>
        </Card>
      </div>
      <p className="text-xs text-ink-3">
        {L(lang,
          `Cible : NCLC ${profile.targetNCLC} dans chacune des quatre compétences. Estimation pédagogique.`,
          `Target: NCLC ${profile.targetNCLC} in each of the four skills. Pedagogical estimate.`)}
      </p>
    </div>
  );
}
