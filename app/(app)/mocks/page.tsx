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
      title: "Mini-blanc CO — écoute unique",
      desc: "8 questions, 8 minutes. L'audio passe une fois : on entraîne la règle, pas l'exception.",
      href: "/mocks/run?skill=listening&n=8&min=8",
      locked: false,
    },
    {
      title: "Mini-blanc CE — lecture chronométrée",
      desc: "8 questions, 12 minutes. La question d'abord, le texte ensuite.",
      href: "/mocks/run?skill=reading&n=8&min=12",
      locked: false,
    },
    {
      title: "Blanc de section CO — format long",
      desc: "20 questions, 20 minutes, sans pause. Se débloque après une chaîne de 7 jours.",
      href: "/mocks/run?skill=listening&n=20&min=20",
      locked: !ms.sectionMockUnlocked,
    },
    {
      title: "Blanc de section CE — format long",
      desc: "20 questions, 30 minutes. Endurance et gestion du temps.",
      href: "/mocks/run?skill=reading&n=20&min=30",
      locked: !ms.sectionMockUnlocked,
    },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">Examens blancs</h1>
        <p className="mt-1 text-sm text-ink-2">
          Chronos stricts, revue détaillée après coup. Le score d&apos;un blanc est une donnée pour le
          prochain bloc — pas un verdict sur vous.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((o) => (
          <Card key={o.title} className={o.locked ? "opacity-70" : ""}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{o.title}</h2>
              {o.locked && <Badge tone="ink">🔒 chaîne 7 j</Badge>}
            </div>
            <p className="mt-1.5 text-sm text-ink-2">{o.desc}</p>
            <Btn href={o.href} disabled={o.locked} className="mt-4">
              {o.locked ? "Verrouillé" : "Commencer"}
            </Btn>
          </Card>
        ))}
      </div>

      <Card className="bg-paper">
        <h2 className="text-sm font-semibold">Blancs complets 4 épreuves &amp; mode examinateur</h2>
        <p className="mt-1 text-sm text-ink-2">
          Le blanc complet (les quatre épreuves le même jour, comme le vrai {profile.exam === "UNDECIDED" ? "TEF/TCF" : profile.exam}) et le mode
          examinateur (notation stricte, chaîne de 21 jours) arrivent après la V1 — priorité aux
          blocs quotidiens qui font monter le score.
        </p>
      </Card>

      {mocks.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Historique</h2>
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
