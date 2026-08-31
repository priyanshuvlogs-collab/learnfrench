"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp, minutesToday, hasQualifyingToday } from "@/lib/store";
import { Skill, SKILL_LABELS, SKILLS } from "@/lib/types";
import { estimateSkill, formatNCLCRange, readiness } from "@/lib/nclc";
import { buildTodayBlock, phase, PHASE_MIX, pickTodaySkill } from "@/lib/scheduler";
import { isBroken, milestones } from "@/lib/streak";
import { daysUntil, todayKey } from "@/lib/dates";
import { L, useLang } from "@/lib/i18n";
import { Badge, Btn, Card, Ring } from "@/components/ui";
import { ReadinessMeter, SkillBars } from "@/components/skill-panel";

export default function TodayPage() {
  const profile = useApp((s) => s.profile)!;
  const skills = useApp((s) => s.skills);
  const sessions = useApp((s) => s.sessions);
  const streak = useApp((s) => s.streak);
  const lang = useLang();

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
  const examName = profile.exam === "UNDECIDED" ? L(lang, "TEF ou TCF Canada", "TEF or TCF Canada") : `${profile.exam} Canada`;
  const weakLabel = L(lang, SKILL_LABELS[weakest].fr.toLowerCase(), SKILL_LABELS[weakest].en.toLowerCase());

  return (
    <div className="space-y-5">
      {/* Identity header */}
      <header>
        <p className="text-sm text-ink-2">
          {lang === "fr" ? (
            <>
              {profile.name}, vous préparez le <strong>{examName}</strong> pour <strong>NCLC {profile.targetNCLC}</strong>
              {days !== null && days > 0 && <> — examen dans <strong>{days} jour{days > 1 ? "s" : ""}</strong></>}.
            </>
          ) : (
            <>
              {profile.name}, you are preparing <strong>{examName}</strong> for <strong>NCLC {profile.targetNCLC}</strong>
              {days !== null && days > 0 && <> — exam in <strong>{days} day{days > 1 ? "s" : ""}</strong></>}.
            </>
          )}
        </p>
        <p className="mt-0.5 text-xs text-ink-3">
          {L(lang, "Phase : ", "Phase: ")}{PHASE_MIX[ph][lang]}
        </p>
      </header>

      {/* Weakest-skill banner */}
      <div className="rounded-xl border border-warn/25 bg-warn-soft p-4 text-sm leading-relaxed text-warn">
        {lang === "fr" ? (
          <>
            Votre profil estimé est <strong className="font-display">{profileStr}</strong> (CO/CE/EE/EO). Le NCLC
            officiel est <strong>le plus bas des quatre</strong>. Aujourd&apos;hui, on fait monter{" "}
            <strong>{weakLabel}</strong> ({formatNCLCRange(estimates[weakest])}).
          </>
        ) : (
          <>
            Your estimated profile is <strong className="font-display">{profileStr}</strong> (CO/CE/EE/EO). Your official
            NCLC is <strong>the LOWEST of the four</strong>. Today we raise <strong>{weakLabel}</strong>{" "}
            ({formatNCLCRange(estimates[weakest])}).
          </>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Today ring */}
        <Card className="flex flex-col items-center justify-center gap-3 text-center">
          <Ring value={mins} max={profile.dailyMinutes} label={`${mins} min`} sub={L(lang, `sur ${profile.dailyMinutes} prévues`, `of ${profile.dailyMinutes} planned`)} />
          {done ? (
            <p className="text-sm text-ok">
              {L(lang,
                "Bloc du jour terminé. Un rappel de plus ? Optionnel — la chaîne est déjà à l'abri.",
                "Today's block is done. An optional encore won't change the streak — it's already safe.")}
            </p>
          ) : (
            <p className="text-sm text-ink-2">
              {L(lang,
                `« ${profile.intention.time} », ${profile.dailyMinutes} minutes. C'est le plan que vous avez choisi.`,
                `“${profile.intention.time}”, ${profile.dailyMinutes} minutes. That's the plan you committed to.`)}
            </p>
          )}
        </Card>

        {/* Streak */}
        <Card className="flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-3">{L(lang, "Chaîne", "Streak")}</div>
              <div className="font-display text-4xl font-semibold">
                {streak.current}{" "}
                <span className="text-lg text-ink-3">{L(lang, `jour${streak.current > 1 ? "s" : ""}`, `day${streak.current === 1 ? "" : "s"}`)}</span>
              </div>
            </div>
            <div className="space-y-1 text-right text-xs text-ink-3">
              <div>{L(lang, "Record :", "Longest:")} <span className="font-display font-semibold text-ink">{streak.longest}</span></div>
              <div>{L(lang, "Gels :", "Freezes:")} <span className="font-display font-semibold text-ink">{streak.freezesLeft}</span> / 2 {L(lang, "ce mois", "this month")}</div>
            </div>
          </div>
          {broken ? (
            <div className="rounded-lg bg-paper-2 p-3">
              <p className="text-sm text-ink-2">
                {L(lang,
                  `La chaîne s'est arrêtée. Aucun drame — le record de ${streak.longest} jours reste à vous.`,
                  `The chain stopped. No drama — your ${streak.longest}-day record is still yours.`)}
              </p>
              <Btn href={drillHref} className="mt-2 w-full">{L(lang, "Reprendre — 8 minutes, sans leçon", "Resume — 8 minutes, no lecture")}</Btn>
            </div>
          ) : qualified ? (
            <p className="text-sm text-ok">
              {L(lang,
                "Session qualifiante faite aujourd'hui — la chaîne continuera à minuit. ✓",
                "Qualifying session done today — the chain continues at midnight. ✓")}
            </p>
          ) : (
            <p className="text-sm text-ink-2">
              {L(lang,
                "5 minutes concentrées suffisent pour aujourd'hui. Les gels s'utilisent seuls si vous manquez un jour après une chaîne de 7+.",
                "5 focused minutes are enough for today. Freezes are used automatically if you miss one day after a 7+ streak.")}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={ms.sectionMockUnlocked ? "gold" : "ink"}>
              {ms.sectionMockUnlocked ? "✓" : L(lang, "7 j →", "7 d →")} {L(lang, "Examen blanc de section", "Section mock")}
            </Badge>
            <Badge tone={ms.examinerModeUnlocked ? "gold" : "ink"}>
              {ms.examinerModeUnlocked ? "✓" : L(lang, "21 j →", "21 d →")} {L(lang, "Mode examinateur", "Examiner mode")}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Primary CTA + block plan */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">
              {L(lang, "Le bloc du jour — ", "Today's block — ")}{L(lang, SKILL_LABELS[todaySkill].fr, SKILL_LABELS[todaySkill].en)}
            </h2>
            <p className="text-sm text-ink-2">
              {L(lang,
                `Un bloc d'examen de ${profile.dailyMinutes} minutes, en quatre temps.`,
                `A ${profile.dailyMinutes}-minute exam block, in four movements.`)}
            </p>
          </div>
          <div className="flex gap-2">
            <Btn href={drillHref}>{L(lang, "Commencer le bloc", "Start the block")}</Btn>
            {!qualified && <Btn href="/review?rescue=1" variant="ghost">{L(lang, "Secours 5 min", "5-min rescue")}</Btn>}
          </div>
        </div>
        <ol className="mt-5 space-y-2">
          {block.map((seg, i) => (
            <li key={seg.id}>
              <Link href={seg.href} className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-2.5 text-sm hover:border-accent">
                <span className="font-display w-6 text-center font-semibold text-ink-3">{i + 1}</span>
                <span className="flex-1">{seg.label[lang]}</span>
                <span className="font-display text-xs text-ink-3">{seg.minutes} min</span>
              </Link>
            </li>
          ))}
        </ol>
      </Card>

      {/* Skill bars + readiness */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-2">
            {L(lang, "Quatre compétences, quatre NCLC", "Four skills, four NCLC estimates")}
          </h2>
          <SkillBars estimates={estimates} target={profile.targetNCLC} linked />
        </Card>
        <Card>
          <ReadinessMeter estimates={estimates} target={profile.targetNCLC} />
        </Card>
      </div>

      <p className="text-center text-xs text-ink-3">
        {todayKey()} · {L(lang, "Estimations pédagogiques — l'examen officiel reste le seul juge.", "Pedagogical estimates — the official exam remains the only judge.")}
      </p>
    </div>
  );
}
