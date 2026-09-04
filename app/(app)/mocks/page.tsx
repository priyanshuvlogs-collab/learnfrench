"use client";

import { useApp } from "@/lib/store";
import { milestones } from "@/lib/streak";
import { Badge, Btn, Card } from "@/components/ui";

export default function MocksPage() {
  const streak = useApp((s) => s.streak);
  const mocks = useApp((s) => s.mocks);
  const profile = useApp((s) => s.profile)!;
  const ms = milestones(streak);

  const options = [
    {
      title: "Listening mini-mock — single listen",
      desc: "8 questions, 8 minutes. The audio plays once: we train the rule, not the exception.",
      href: "/mocks/run?skill=listening&n=8&min=8",
      locked: false,
    },
    {
      title: "Reading mini-mock — timed",
      desc: "8 questions, 12 minutes. The question first, then the text.",
      href: "/mocks/run?skill=reading&n=8&min=12",
      locked: false,
    },
    {
      title: "Listening section mock — long format",
      desc: "20 questions, 20 minutes, no pause. Unlocks after a 7-day streak.",
      href: "/mocks/run?skill=listening&n=20&min=20",
      locked: !ms.sectionMockUnlocked,
    },
    {
      title: "Reading section mock — long format",
      desc: "20 questions, 30 minutes. Endurance and time management.",
      href: "/mocks/run?skill=reading&n=20&min=30",
      locked: !ms.sectionMockUnlocked,
    },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">Mocks</h1>
        <p className="mt-1 text-sm text-ink-2">
          Strict timers, detailed review afterwards. Questions stay in French. A mock score is data
          for the next block — not a verdict on you.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((o) => (
          <Card key={o.title} className={o.locked ? "opacity-70" : ""}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{o.title}</h2>
              {o.locked && <Badge tone="ink">🔒 7-day streak</Badge>}
            </div>
            <p className="mt-1.5 text-sm text-ink-2">{o.desc}</p>
            <Btn href={o.href} disabled={o.locked} className="mt-4">
              {o.locked ? "Locked" : "Start"}
            </Btn>
          </Card>
        ))}
      </div>

      <Card className="bg-paper">
        <h2 className="text-sm font-semibold">Full 4-paper mocks &amp; examiner mode</h2>
        <p className="mt-1 text-sm text-ink-2">
          The full mock (all four papers the same day, like the real {profile.exam === "UNDECIDED" ? "TEF/TCF" : profile.exam}) and examiner
          mode (strict scoring, 21-day streak) come after V1 — priority is the daily blocks that raise the score.
        </p>
      </Card>

      {mocks.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">History</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {[...mocks].reverse().slice(0, 8).map((m) => (
              <li key={m.id} className="flex justify-between border-b border-line pb-1.5 text-ink-2 last:border-0">
                <span>{m.date} · {m.skill === "listening" ? "CO" : "CE"} · {m.total} questions</span>
                <span className="font-display font-semibold text-ink">{m.correct}/{m.total}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
