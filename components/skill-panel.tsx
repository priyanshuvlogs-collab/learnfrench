"use client";

import Link from "next/link";
import { Skill, SKILL_LABELS, SKILLS } from "@/lib/types";
import { SkillEstimate, formatNCLCRange, readiness } from "@/lib/nclc";
import { L, useLang } from "@/lib/i18n";
import { Badge, Bar } from "./ui";

const CONF_LABEL = {
  fr: { low: "Confiance faible", medium: "Confiance moyenne", high: "Confiance élevée" },
  en: { low: "Low confidence", medium: "Medium confidence", high: "High confidence" },
} as const;

export function SkillBars({
  estimates,
  target,
  linked = false,
}: {
  estimates: Record<Skill, SkillEstimate>;
  target: number;
  linked?: boolean;
}) {
  const lang = useLang();
  const { weakest } = readiness(estimates);
  return (
    <div className="space-y-4">
      {SKILLS.map((s) => {
        const e = estimates[s];
        const isWeakest = s === weakest;
        const row = (
          <div>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold">
                {L(lang, SKILL_LABELS[s].fr, SKILL_LABELS[s].en)}
                {isWeakest && (
                  <span className="ml-2 rounded-full bg-warn-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warn">
                    {L(lang, "l'examen regarde celle-ci", "the exam cares about this one")}
                  </span>
                )}
              </span>
              <span className="shrink-0 font-display text-sm font-semibold tabular-nums">
                {formatNCLCRange(e)}
                <span className="ml-1.5 font-sans text-[10px] font-normal text-ink-3">{CONF_LABEL[lang][e.confidence]}</span>
              </span>
            </div>
            <Bar value={e.score} tone={isWeakest ? "warn" : e.nclc >= target ? "ok" : "accent"} />
          </div>
        );
        return linked ? (
          <Link key={s} href={s === "writing" ? "/writing" : s === "speaking" ? "/speaking" : `/skills/${s}`} className="block rounded-lg p-1 -m-1 hover:bg-paper-2">
            {row}
          </Link>
        ) : (
          <div key={s}>{row}</div>
        );
      })}
      <p className="text-[11px] text-ink-3">
        {L(lang, "Estimation pédagogique (NCLC 4→10) — pas un résultat officiel.", "Pedagogical estimate (NCLC 4→10) — not an official result.")}
      </p>
    </div>
  );
}

export function ReadinessMeter({ estimates, target }: { estimates: Record<Skill, SkillEstimate>; target: number }) {
  const lang = useLang();
  const { weakest, nclc } = readiness(estimates);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">
          {L(lang, "Préparation à l'examen", "Exam readiness")}
        </h2>
        <Badge tone={nclc >= target ? "ok" : "warn"}>
          {nclc >= target
            ? L(lang, `Profil ≥ NCLC ${target}`, `Profile ≥ NCLC ${target}`)
            : L(lang, `Limité à NCLC ~${nclc}`, `Capped at NCLC ~${nclc}`)}
        </Badge>
      </div>
      <div className="mt-3 flex gap-1.5" role="img" aria-label={L(lang, `Préparation limitée par ${SKILL_LABELS[weakest].fr}`, `Readiness limited by ${SKILL_LABELS[weakest].en}`)}>
        {SKILLS.map((s) => {
          const e = estimates[s];
          const h = Math.max(10, Math.min(100, e.score));
          const isW = s === weakest;
          return (
            <div key={s} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-20 w-full items-end overflow-hidden rounded-md bg-paper-2">
                <div
                  className={`bar-ease w-full rounded-md ${isW ? "bg-warn" : "bg-accent"}`}
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className={`text-[10px] font-semibold ${isW ? "text-warn" : "text-ink-3"}`}>{SKILL_LABELS[s].short}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-ink-2">
        {lang === "fr" ? (
          <>
            Le NCLC officiel est <strong>le plus bas des quatre</strong>. Le segment le plus court —{" "}
            <strong>{SKILL_LABELS[weakest].fr.toLowerCase()}</strong> — décide de tout : c&apos;est lui qu&apos;on fait monter.
          </>
        ) : (
          <>
            Your official NCLC is <strong>the lowest of the four</strong>. The shortest segment —{" "}
            <strong>{SKILL_LABELS[weakest].en.toLowerCase()}</strong> — decides everything: that&apos;s the one we raise.
          </>
        )}
      </p>
    </div>
  );
}
