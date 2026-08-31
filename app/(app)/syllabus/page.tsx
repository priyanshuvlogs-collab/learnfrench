"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { phase, PHASE_MIX } from "@/lib/scheduler";
import { daysUntil } from "@/lib/dates";
import { L, useLang } from "@/lib/i18n";
import { Badge, Card } from "@/components/ui";

interface SyllabusItem {
  fr: string;
  en: string;
  href?: string;
}

interface SyllabusBlock {
  title: { fr: string; en: string };
  weeks: { fr: string; en: string };
  goal: { fr: string; en: string };
  items: SyllabusItem[];
}

const BLOCKS: SyllabusBlock[] = [
  {
    title: { fr: "Bloc 1 — Fondations", en: "Block 1 — Foundations" },
    weeks: { fr: "Semaines 1–2 (ou tant que l'examen est à 8+ semaines)", en: "Weeks 1–2 (or while the exam is 8+ weeks away)" },
    goal: { fr: "Installer l'habitude quotidienne et les verbes porteurs. Mix : 40 % fondations · 40 % compétence faible · 20 % format.", en: "Install the daily habit and the load-bearing verbs. Mix: 40% foundations · 40% weak skill · 20% exam format." },
    items: [
      { fr: "Grammaire : être & avoir (présent, imparfait, futur) + auxiliaire du passé composé", en: "Grammar: être & avoir (present, imperfect, future) + passé-composé auxiliary", href: "/grammar" },
      { fr: "CO : la règle de l'écoute unique — prédire → écouter la fonction → éliminer", en: "Listening: the one-listen rule — predict → listen for function → eliminate", href: "/skills/listening" },
      { fr: "CE : la question d'abord, puis balayer ; français administratif de base", en: "Reading: question first, then scan; basic admin French", href: "/skills/reading" },
      { fr: "EE : le paragraphe d'opinion en 4 temps (opinion → raison → exemple → bilan)", en: "Writing: the 4-beat opinion paragraph (opinion → reason → example → wrap-up)", href: "/writing" },
      { fr: "EO : se présenter 60 secondes sans préparation, tous les jours", en: "Speaking: 60-second unprepared self-introduction, daily", href: "/speaking" },
      { fr: "SRS : 10 cartes/jour — connecteurs et pièges de sons", en: "SRS: 10 cards/day — connectors and sound traps", href: "/review" },
      { fr: "Immersion : 10 min/jour de ressources (Easy French, RFI facile)", en: "Immersion: 10 min/day of resources (Easy French, RFI facile)", href: "/resources" },
    ],
  },
  {
    title: { fr: "Bloc 2 — Tâches d'examen", en: "Block 2 — Exam tasks" },
    weeks: { fr: "Semaines 3–6 (examen à 3–8 semaines)", en: "Weeks 3–6 (exam 3–8 weeks away)" },
    goal: { fr: "Le format devient réflexe. Mix : 70 % tâches d'examen · 30 % correction d'erreurs.", en: "The format becomes reflex. Mix: 70% exam tasks · 30% error correction." },
    items: [
      { fr: "EE : 2 productions notées/semaine au chrono officiel (TEF A/B ou TCF T1–T3)", en: "Writing: 2 scored productions/week on the official clock (TEF A/B or TCF T1–T3)", href: "/writing" },
      { fr: "EO : le blanc oral hebdomadaire dès la semaine 3 — puis « redites-le, en mieux »", en: "Speaking: the weekly speaking mock from week 3 — then “say it again, better”", href: "/speaking" },
      { fr: "CO/CE : mini-blancs chronométrés ; revue de chaque piège raté", en: "Listening/reading: timed mini-mocks; review every missed trap", href: "/mocks" },
      { fr: "Grammaire ciblée : subjonctif d'opinion (il faut que), pronoms y/en — réutilisés aussitôt", en: "Targeted grammar: opinion subjunctive (il faut que), y/en pronouns — reused immediately", href: "/review" },
      { fr: "Vos patrons d'erreurs : travaillez les sujets marqués « faibles » dans Compétences", en: "Your error patterns: work the topics flagged weak in Skills", href: "/skills" },
      { fr: "Chaîne : 7 jours → débloque les blancs de section longs", en: "Streak: 7 days unlocks the long section mocks", href: "/mocks" },
    ],
  },
  {
    title: { fr: "Bloc 3 — Dernière ligne droite", en: "Block 3 — Final stretch" },
    weeks: { fr: "Les 3 dernières semaines", en: "The last 3 weeks" },
    goal: { fr: "Chronométrage officiel, sections complètes, sommeil. Aucun nouveau continent grammatical.", en: "Official timing, full sections, sleep. No new grammar continents." },
    items: [
      { fr: "Blancs de section complets, aux heures de votre convocation si possible", en: "Full section mocks, at your exam-slot time of day if possible", href: "/mocks" },
      { fr: "EE/EO : uniquement des sujets déjà travaillés — viser la régularité, pas la nouveauté", en: "Writing/speaking: only prompts you've already worked — aim for consistency, not novelty", href: "/writing" },
      { fr: "SRS : gabarits d'examen uniquement (squelettes de lettre, amorces d'oral)", en: "SRS: exam templates only (letter skeletons, speaking openers)", href: "/review" },
      { fr: "Protocole anti-anxiété : respiration en carré avant chaque blanc — le score est une donnée, pas un verdict", en: "Anxiety protocol: box breathing before every mock — the score is data, not a verdict", href: "/mocks" },
      { fr: "Semaine J : sommeil > révision. Une session légère la veille, rien de nouveau.", en: "Exam week: sleep > cramming. One light session the day before, nothing new." },
    ],
  },
];

export default function SyllabusPage() {
  const profile = useApp((s) => s.profile)!;
  const lang = useLang();
  const ph = phase(profile);
  const days = daysUntil(profile.examDate);
  const activeIdx = ph === "foundations" ? 0 : ph === "exam-tasks" ? 1 : 2;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">{L(lang, "Syllabus", "Syllabus")}</h1>
        <p className="mt-1 text-sm text-ink-2">
          {L(lang,
            `Le parcours complet vers NCLC ${profile.targetNCLC}, en trois blocs. Votre phase actuelle est déterminée par votre date d'examen${days !== null && days > 0 ? ` (dans ${days} jours)` : " (non fixée — bloc 1)"} .`,
            `The full path to NCLC ${profile.targetNCLC}, in three blocks. Your current phase is set by your exam date${days !== null && days > 0 ? ` (${days} days away)` : " (not set — block 1)"}.`)}
        </p>
        <p className="mt-1 text-xs text-ink-3">{L(lang, "Répartition actuelle : ", "Current mix: ")}{PHASE_MIX[ph][lang]}</p>
      </header>

      {BLOCKS.map((b, i) => (
        <Card key={i} className={i === activeIdx ? "border-accent" : ""}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold">{b.title[lang]}</h2>
              <p className="text-xs text-ink-3">{b.weeks[lang]}</p>
            </div>
            {i === activeIdx && <Badge>{L(lang, "Votre phase actuelle", "Your current phase")}</Badge>}
          </div>
          <p className="mt-2 text-sm text-ink-2">{b.goal[lang]}</p>
          <ul className="mt-3 space-y-1.5">
            {b.items.map((it, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-ink-2">
                <span className="mt-0.5 text-accent">☐</span>
                {it.href ? (
                  <Link href={it.href} className="hover:text-accent hover:underline">{it[lang]}</Link>
                ) : (
                  <span>{it[lang]}</span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <p className="text-xs text-ink-3">
        {L(lang,
          "Le planificateur quotidien applique ce syllabus automatiquement (interleaving compris) — cette page sert de carte, pas de liste de corvées.",
          "The daily planner applies this syllabus automatically (interleaving included) — this page is the map, not a chore list.")}
      </p>
    </div>
  );
}
