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
    title: "Dictation",
    desc: "A French sentence read aloud, two listens, and you write it. Correction separates wrong words, missing words, and accent slips — with the trap explained on every sentence.",
    skills: "CO + EE",
    minutes: "~6 min",
    icon: "✎",
  },
  {
    href: "/lab/numbers",
    title: "Numbers on the fly",
    desc: "Prices, times, years, phone numbers — dictated once in French, as in listening section A. You write the digits; the ear sharpens.",
    skills: "CO",
    minutes: "~4 min",
    icon: "№",
  },
  {
    href: "/lab/conjugation",
    title: "Conjugation sprint",
    desc: "The six tenses that score points: irregular present, passé composé and its agreements, imparfait, future, polite conditional, subjunctive. You type the French form; the rule follows.",
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
        <Kicker>Lab</Kicker>
        <h1 className="mt-1 font-display text-2xl font-semibold">The mechanics, isolated</h1>
        <p className="mt-1 text-sm text-ink-2">
          Three short drills that train reflexes questionnaires never touch: spelling under dictation,
          numbers by ear, conjugation without a net. The interface is English; the French you hear and type is the exam language.
          {labCount > 0 && <span className="text-ink-3"> · {labCount} lab session{labCount > 1 ? "s" : ""} so far</span>}
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
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">And your notebook</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Words you meet in the drills and want to keep go in{" "}
          <Link href="/notebook" className="font-semibold text-accent underline">My notebook</Link> — they
          automatically enter spaced repetition, mixed with the 120 programme cards.
        </p>
      </Card>
    </div>
  );
}
