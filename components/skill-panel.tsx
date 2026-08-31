"use client";

import Link from "next/link";
import { Skill, SKILL_LABELS, SKILLS } from "@/lib/types";
import { SkillEstimate, formatNCLCRange, readiness } from "@/lib/nclc";
import { Badge, Bar } from "./ui";

const CONF_LABEL = { low: "Confiance faible", medium: "Confiance moyenne", high: "Confiance élevée" } as const;

export function SkillBars({
  estimates,
  target,
  linked = false,
}: {
  estimates: Record<Skill, SkillEstimate>;
  target: number;
  linked?: boolean;
}) {
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
                {SKILL_LABELS[s].fr}
                {isWeakest && (
                  <span className="ml-2 rounded-full bg-warn-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warn">
                    l&apos;examen regarde celle-ci
                  </span>
                )}
              </span>
              <span className="shrink-0 font-display text-sm font-semibold tabular-nums">
                {formatNCLCRange(e)}
                <span className="ml-1.5 font-sans text-[10px] font-normal text-ink-3">{CONF_LABEL[e.confidence]}</span>
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
      <p className="text-[11px] text-ink-3">Estimation pédagogique (NCLC 4→10) — pas un résultat officiel.</p>
    </div>
  );
}

export function ReadinessMeter({ estimates, target }: { estimates: Record<Skill, SkillEstimate>; target: number }) {
  const { weakest, nclc } = readiness(estimates);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Préparation à l&apos;examen</h2>
        <Badge tone={nclc >= target ? "ok" : "warn"}>
          {nclc >= target ? `Profil ≥ NCLC ${target}` : `Limité à NCLC ~${nclc}`}
        </Badge>
      </div>
      <div className="mt-3 flex gap-1.5" role="img" aria-label={`Préparation limitée par ${SKILL_LABELS[weakest].fr}`}>
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
        Le NCLC officiel est <strong>le plus bas des quatre</strong>. Le segment le plus court —{" "}
        <strong>{SKILL_LABELS[weakest].fr.toLowerCase()}</strong> — décide de tout : c&apos;est lui qu&apos;on fait monter.
      </p>
    </div>
  );
}
