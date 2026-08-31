"use client";

import { useApp } from "@/lib/store";
import { milestones } from "@/lib/streak";
import { L, useLang } from "@/lib/i18n";
import { Badge, Btn, Card } from "@/components/ui";

export default function MocksPage() {
  const streak = useApp((s) => s.streak);
  const mocks = useApp((s) => s.mocks);
  const profile = useApp((s) => s.profile)!;
  const lang = useLang();
  const ms = milestones(streak);

  const options = [
    {
      title: L(lang, "Mini-blanc CO — écoute unique", "CO mini-mock — one listen"),
      desc: L(lang,
        "8 questions, 8 minutes. L'audio passe une fois : on entraîne la règle, pas l'exception.",
        "8 questions, 8 minutes. The audio plays once: we train the rule, not the exception."),
      href: "/mocks/run?skill=listening&n=8&min=8",
      locked: false,
    },
    {
      title: L(lang, "Mini-blanc CE — lecture chronométrée", "CE mini-mock — timed reading"),
      desc: L(lang, "8 questions, 12 minutes. La question d'abord, le texte ensuite.", "8 questions, 12 minutes. Question first, text second."),
      href: "/mocks/run?skill=reading&n=8&min=12",
      locked: false,
    },
    {
      title: L(lang, "Blanc de section CO — format long", "CO section mock — long format"),
      desc: L(lang,
        "20 questions, 20 minutes, sans pause. Se débloque après une chaîne de 7 jours.",
        "20 questions, 20 minutes, no pause. Unlocks after a 7-day streak."),
      href: "/mocks/run?skill=listening&n=20&min=20",
      locked: !ms.sectionMockUnlocked,
    },
    {
      title: L(lang, "Blanc de section CE — format long", "CE section mock — long format"),
      desc: L(lang, "20 questions, 30 minutes. Endurance et gestion du temps.", "20 questions, 30 minutes. Stamina and time management."),
      href: "/mocks/run?skill=reading&n=20&min=30",
      locked: !ms.sectionMockUnlocked,
    },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">{L(lang, "Examens blancs", "Mock exams")}</h1>
        <p className="mt-1 text-sm text-ink-2">
          {L(lang,
            "Chronos stricts, revue détaillée après coup. Le score d'un blanc est une donnée pour le prochain bloc — pas un verdict sur vous.",
            "Strict clocks, detailed review afterwards. A mock score is data for the next block — not a verdict on you.")}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((o) => (
          <Card key={o.title} className={o.locked ? "opacity-70" : ""}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{o.title}</h2>
              {o.locked && <Badge tone="ink">🔒 {L(lang, "chaîne 7 j", "7-day streak")}</Badge>}
            </div>
            <p className="mt-1.5 text-sm text-ink-2">{o.desc}</p>
            <Btn href={o.href} disabled={o.locked} className="mt-4">
              {o.locked ? L(lang, "Verrouillé", "Locked") : L(lang, "Commencer", "Start")}
            </Btn>
          </Card>
        ))}
      </div>

      <Card className="bg-paper">
        <h2 className="text-sm font-semibold">{L(lang, "Blancs complets 4 épreuves & mode examinateur", "Full 4-section mocks & examiner mode")}</h2>
        <p className="mt-1 text-sm text-ink-2">
          {L(lang,
            `Le blanc complet (les quatre épreuves le même jour, comme le vrai ${profile.exam === "UNDECIDED" ? "TEF/TCF" : profile.exam}) et le mode examinateur (notation stricte, chaîne de 21 jours) arrivent après la V1 — priorité aux blocs quotidiens qui font monter le score.`,
            `The full mock (all four sections same day, like the real ${profile.exam === "UNDECIDED" ? "TEF/TCF" : profile.exam}) and examiner mode (strict scoring, 21-day streak) come after V1 — priority goes to the daily blocks that raise the score.`)}
        </p>
      </Card>

      {mocks.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">{L(lang, "Historique", "History")}</h2>
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
