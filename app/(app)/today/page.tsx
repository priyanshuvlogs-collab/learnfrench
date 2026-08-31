"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp, minutesToday, hasQualifyingToday } from "@/lib/store";
import { Skill, SKILL_LABELS, SKILLS } from "@/lib/types";
import { estimateSkill, formatNCLCRange, readiness } from "@/lib/nclc";
import { buildTodayBlock, phase, PHASE_MIX, pickTodaySkill } from "@/lib/scheduler";
import { isBroken, milestones } from "@/lib/streak";
import { daysUntil, todayKey } from "@/lib/dates";
import { Badge, Btn, Card, Ring } from "@/components/ui";
import { ReadinessMeter, SkillBars } from "@/components/skill-panel";

export default function TodayPage() {
  const profile = useApp((s) => s.profile)!;
  const skills = useApp((s) => s.skills);
  const sessions = useApp((s) => s.sessions);
  const streak = useApp((s) => s.streak);

  const estimates = useMemo(
    () => Object.fromEntries(SKILLS.map((s) => [s, estimateSkill(skills[s])])) as Record<Skill, ReturnType<typeof estimateSkill>>,
    [skills]
  );
  const { weakest } = readiness(estimates);
  const todaySkill = useMemo(() => pickTodaySkill(estimates, sessions, profile), [estimates, sessions, profile]);
  const block = useMemo(() => buildTodayBlock(todaySkill, profile.dailyMinutes), [todaySkill, profile.dailyMinutes]);
  const mins = minutesToday(sessions);
  const qualified = hasQualifyingToday(sessions);
  const broken = isBroken(streak);
  const days = daysUntil(profile.examDate);
  const ms = milestones(streak);
  const ph = phase(profile);
  const drillHref = todaySkill === "writing" ? "/writing" : todaySkill === "speaking" ? "/speaking" : `/skills/${todaySkill}`;
  const done = mins >= profile.dailyMinutes;

  const e = estimates;
  const profileStr = `${Math.floor(e.listening.nclc)} / ${Math.floor(e.reading.nclc)} / ${Math.floor(e.writing.nclc)} / ${Math.floor(e.speaking.nclc)}`;

  return (
    <div className="space-y-5">
      {/* Identity header */}
      <header>
        <p className="text-sm text-ink-2">
          {profile.name}, vous préparez le{" "}
          <strong>{profile.exam === "UNDECIDED" ? "TEF ou TCF Canada" : `${profile.exam} Canada`}</strong> pour{" "}
          <strong>NCLC {profile.targetNCLC}</strong>
          {days !== null && days > 0 && (
            <>
              {" "}— examen dans <strong>{days} jour{days > 1 ? "s" : ""}</strong>
            </>
          )}
          .
        </p>
        <p className="mt-0.5 text-xs text-ink-3">
          Phase : {PHASE_MIX[ph].fr}
        </p>
      </header>

      {/* Weakest-skill banner */}
      <div className="rounded-xl border border-warn/25 bg-warn-soft p-4 text-sm leading-relaxed text-warn">
        Votre profil estimé est <strong className="font-display">{profileStr}</strong> (CO/CE/EE/EO). Le NCLC
        officiel est <strong>le plus bas des quatre</strong>. Aujourd&apos;hui, on fait monter{" "}
        <strong>{SKILL_LABELS[weakest].fr.toLowerCase()}</strong> ({formatNCLCRange(estimates[weakest])}).
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Today ring */}
        <Card className="flex flex-col items-center justify-center gap-3 text-center">
          <Ring value={mins} max={profile.dailyMinutes} label={`${mins} min`} sub={`sur ${profile.dailyMinutes} prévues`} />
          {done ? (
            <p className="text-sm text-ok">
              Bloc du jour terminé. Un rappel de plus ? Optionnel — la chaîne est déjà à l&apos;abri.
            </p>
          ) : (
            <p className="text-sm text-ink-2">
              « {profile.intention.time} », {profile.dailyMinutes} minutes. C&apos;est le plan que vous avez choisi.
            </p>
          )}
        </Card>

        {/* Streak */}
        <Card className="flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-3">Chaîne</div>
              <div className="font-display text-4xl font-semibold">{streak.current} <span className="text-lg text-ink-3">jour{streak.current > 1 ? "s" : ""}</span></div>
            </div>
            <div className="space-y-1 text-right text-xs text-ink-3">
              <div>Record : <span className="font-display font-semibold text-ink">{streak.longest}</span></div>
              <div>Gels : <span className="font-display font-semibold text-ink">{streak.freezesLeft}</span> / 2 ce mois</div>
            </div>
          </div>
          {broken ? (
            <div className="rounded-lg bg-paper-2 p-3">
              <p className="text-sm text-ink-2">La chaîne s&apos;est arrêtée. Aucun drame — le record de {streak.longest} jours reste à vous.</p>
              <Btn href={drillHref} className="mt-2 w-full">Reprendre — 8 minutes, sans leçon</Btn>
            </div>
          ) : qualified ? (
            <p className="text-sm text-ok">Session qualifiante faite aujourd&apos;hui — la chaîne continuera à minuit. ✓</p>
          ) : (
            <p className="text-sm text-ink-2">
              5 minutes concentrées suffisent pour aujourd&apos;hui. Les gels s&apos;utilisent seuls si vous manquez un jour après une chaîne de 7+.
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={ms.sectionMockUnlocked ? "gold" : "ink"}>{ms.sectionMockUnlocked ? "✓" : "7 j →"} Examen blanc de section</Badge>
            <Badge tone={ms.examinerModeUnlocked ? "gold" : "ink"}>{ms.examinerModeUnlocked ? "✓" : "21 j →"} Mode examinateur</Badge>
          </div>
        </Card>
      </div>

      {/* Primary CTA + block plan */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Le bloc du jour — {SKILL_LABELS[todaySkill].fr}</h2>
            <p className="text-sm text-ink-2">Un bloc d&apos;examen de {profile.dailyMinutes} minutes, en quatre temps.</p>
          </div>
          <div className="flex gap-2">
            <Btn href={drillHref}>Commencer le bloc</Btn>
            {!qualified && <Btn href="/review?rescue=1" variant="ghost">Secours 5 min</Btn>}
          </div>
        </div>
        <ol className="mt-5 space-y-2">
          {block.map((seg, i) => (
            <li key={seg.id}>
              <Link href={seg.href} className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-2.5 text-sm hover:border-accent">
                <span className="font-display w-6 text-center font-semibold text-ink-3">{i + 1}</span>
                <span className="flex-1">{seg.label.fr}</span>
                <span className="font-display text-xs text-ink-3">{seg.minutes} min</span>
              </Link>
            </li>
          ))}
        </ol>
      </Card>

      {/* Skill bars + readiness */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-2">Quatre compétences, quatre NCLC</h2>
          <SkillBars estimates={estimates} target={profile.targetNCLC} linked />
        </Card>
        <Card>
          <ReadinessMeter estimates={estimates} target={profile.targetNCLC} />
        </Card>
      </div>

      <p className="text-center text-xs text-ink-3">{todayKey()} · Estimations pédagogiques — l&apos;examen officiel reste le seul juge.</p>
    </div>
  );
}
