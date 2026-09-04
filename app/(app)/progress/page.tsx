"use client";

import { useMemo } from "react";
import { useApp, minutesToday } from "@/lib/store";
import { Skill, SKILL_LABELS, SKILLS } from "@/lib/types";
import { estimateSkill, formatNCLCRange, readiness } from "@/lib/nclc";
import { lastNDays, todayKey } from "@/lib/dates";
import { weeklyLetter } from "@/lib/coach";
import { Badge, Card } from "@/components/ui";

function Spark({ values }: { values: number[] }) {
  if (values.length < 2) {
    return <span className="text-xs text-ink-3">Not enough data yet — {values.length} scored task{values.length === 1 ? "" : "s"}.</span>;
  }
  const w = 160, h = 36;
  const min = Math.min(...values), max = Math.max(...values);
  const range = Math.max(1, max - min);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`).join(" ");
  const up = values[values.length - 1] >= values[0];
  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden>
      <polyline points={pts} fill="none" stroke={up ? "var(--color-ok)" : "var(--color-warn)"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProgressPage() {
  const profile = useApp((s) => s.profile)!;
  const skills = useApp((s) => s.skills);
  const sessions = useApp((s) => s.sessions);
  const streak = useApp((s) => s.streak);
  const coachMemory = useApp((s) => s.coachMemory);

  const estimates = useMemo(
    () => Object.fromEntries(SKILLS.map((s) => [s, estimateSkill(skills[s])])) as Record<Skill, ReturnType<typeof estimateSkill>>,
    [skills]
  );
  const { weakest } = readiness(estimates);

  const days14 = lastNDays(14);
  const minutesByDay = useMemo(() => {
    const m: Record<string, number> = {};
    sessions.forEach((s) => (m[s.date] = (m[s.date] ?? 0) + s.minutes));
    return m;
  }, [sessions]);

  const days28 = lastNDays(28);
  const qualifyingDays = useMemo(() => new Set(sessions.filter((s) => s.qualifying).map((s) => s.date)), [sessions]);
  const frozenDays = useMemo(() => new Set(streak.frozenDates), [streak.frozenDates]);

  // Honest days-to-target: ~25–50 focused hours per NCLC level, per skill below target.
  const gaps = SKILLS.map((s) => Math.max(0, profile.targetNCLC - estimates[s].nclc));
  const totalGap = gaps.reduce((a, b) => a + b, 0);
  const hoursLow = Math.round(totalGap * 25);
  const hoursHigh = Math.round(totalGap * 50);
  const daysLow = Math.ceil((hoursLow * 60) / profile.dailyMinutes);
  const daysHigh = Math.ceil((hoursHigh * 60) / profile.dailyMinutes);

  const letter = useMemo(
    () =>
      weeklyLetter({
        profile,
        estimates,
        streak,
        minutesToday: minutesToday(sessions),
        sessions,
        memory: coachMemory.map((b) => b.text),
      }),
    [profile, estimates, streak, sessions, coachMemory]
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">Progress</h1>
        <p className="mt-1 text-sm text-ink-2">Three layers: the day, the skills, readiness. Never a single average.</p>
      </header>

      {/* 14-day heatmap */}
      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Last 14 days — real work minutes</h2>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {days14.map((d) => {
            const m = minutesByDay[d] ?? 0;
            const intensity = m === 0 ? "bg-paper-2" : m < 10 ? "bg-accent/25" : m < 20 ? "bg-accent/55" : "bg-accent";
            return (
              <div key={d} className="flex flex-col items-center gap-1">
                <div className={`h-9 w-full rounded-md ${intensity} ${d === todayKey() ? "ring-2 ring-gold" : ""}`} title={`${d} : ${m} min`} />
                <span className="text-[9px] text-ink-3">{d.slice(8)}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Skill trajectories */}
      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Trajectories by skill</h2>
        <div className="mt-3 space-y-4">
          {SKILLS.map((s) => (
            <div key={s} className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-semibold">
                  {SKILL_LABELS[s].en}
                  {s === weakest && <Badge tone="warn">Caps the profile</Badge>}
                </div>
                <div className="font-display text-lg font-semibold">{formatNCLCRange(estimates[s])}</div>
              </div>
              <Spark values={skills[s].scores.map((x) => x.score)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Streak calendar */}
      <Card>
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Streak calendar — 28 days</h2>
          <span className="text-xs text-ink-3">Best: <span className="font-display font-semibold text-ink">{streak.longest}</span> · Freezes left: {streak.freezesLeft}/2</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {days28.map((d) => {
            const q = qualifyingDays.has(d);
            const f = frozenDays.has(d);
            return (
              <div
                key={d}
                title={`${d}${q ? " — qualifying session" : f ? " — freeze used" : ""}`}
                className={`flex h-8 items-center justify-center rounded-md text-[9px] font-semibold ${
                  q ? "bg-ok-soft text-ok" : f ? "bg-gold-soft text-gold" : "bg-paper-2 text-ink-3"
                }`}
              >
                {q ? "✓" : f ? "❄" : d.slice(8)}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Days to target */}
      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Distance to target — honest model</h2>
        {totalGap <= 0 ? (
          <p className="mt-2 text-sm text-ink-2">
            All four estimates reach NCLC {profile.targetNCLC}. Now: lock it in with timed mocks — a profile is defended on exam day.
          </p>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            Estimated cumulative gap: <strong className="font-display">{totalGap.toFixed(1)} NCLC level(s)</strong>, concentrated on{" "}
            {SKILL_LABELS[weakest].en.toLowerCase()}. At {profile.dailyMinutes} min/day, count on{" "}
            <strong className="font-display">{daysLow}–{daysHigh} days</strong> of regular work ({hoursLow}–{hoursHigh} focused hours).
            That is a range, not a promise — consistency weighs more than the total.
          </p>
        )}
      </Card>

      {/* Weekly letter */}
      <Card className="border-gold/30">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">This week&apos;s letter — Camille</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-2">{letter}</p>
      </Card>
    </div>
  );
}
