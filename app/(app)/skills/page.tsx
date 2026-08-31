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
    "Une écoute, pas deux : prédire → écouter la fonction → éliminer",
    "Dictée mentale de nombres et d'horaires",
    "Pièges d'options qui se ressemblent",
  ],
  reading: [
    "La question d'abord, puis balayer le texte",
    "Fonction du paragraphe : exemple, contraste, cause",
    "Français administratif : logement, travail, santé",
  ],
  writing: [
    "Tâche A : consigne couverte à 100 %, registre juste",
    "Tâche B : thèse → 2 arguments + exemple → concession",
    "Réutiliser 3 gabarits de la banque de formules",
  ],
  speaking: [
    "Structure forcée : opinion → raison → exemple → clôture",
    "Remplisseurs français (alors, en fait…) au lieu de l'anglais",
    "Deuxième prise : « redites-le, en mieux »",
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
        <h1 className="font-display text-2xl font-semibold">Compétences</h1>
        <p className="mt-1 text-sm text-ink-2">Quatre épreuves, quatre estimations séparées. IRCC ne fait pas de moyenne.</p>
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
                  <h2 className="font-display text-lg font-semibold">{SKILL_LABELS[s].fr}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl font-semibold">{formatNCLCRange(e)}</span>
                    <Badge tone={e.confidence === "high" ? "ok" : e.confidence === "medium" ? "accent" : "ink"}>
                      Confiance {e.confidence === "high" ? "élevée" : e.confidence === "medium" ? "moyenne" : "faible"} · {e.samples} tâche{e.samples > 1 ? "s" : ""} notée{e.samples > 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
                {s === weakest && <Badge tone="warn">Priorité</Badge>}
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
                {NEXT_TASKS[s].map((t) => (
                  <li key={t} className="flex gap-2"><span className="text-accent">→</span>{t}</li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-ink-3">{counts[s]} éléments d&apos;entraînement · {done} session{done > 1 ? "s" : ""} faite{done > 1 ? "s" : ""}</span>
                <Link href={href} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-2">
                  S&apos;entraîner
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-ink-3">Cible : NCLC {profile.targetNCLC} dans chacune des quatre compétences. Estimation pédagogique.</p>
    </div>
  );
}
