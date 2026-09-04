"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { SKILLS } from "@/lib/types";
import { estimateSkill, readiness } from "@/lib/nclc";
import { isDue } from "@/lib/srs";
import { nowMs } from "@/lib/dates";
import { SRS_CARDS, SrsCard } from "@/content/srs-cards";
import { Badge, Btn, Card } from "@/components/ui";

interface ReviewCard {
  id: string;
  type: SrsCard["type"] | "vocab";
  front: string;
  back: string;
}

const TYPE_LABEL = { connector: "Connecteur", verb: "Structure", trap: "Piège", template: "Gabarit", vocab: "Mon carnet" } as const;
const GRADES: { g: 0 | 1 | 2 | 3; label: string; tone: string }[] = [
  { g: 0, label: "Encore", tone: "border-warn text-warn" },
  { g: 1, label: "Difficile", tone: "border-line text-ink-2" },
  { g: 2, label: "Bien", tone: "border-accent text-accent" },
  { g: 3, label: "Facile", tone: "border-ok text-ok" },
];

export default function ReviewPage() {
  return (
    <Suspense fallback={null}>
      <Review />
    </Suspense>
  );
}

function Review() {
  const params = useSearchParams();
  const rescue = params.get("rescue") === "1";
  const srs = useApp((s) => s.srs);
  const skills = useApp((s) => s.skills);
  const vocab = useApp((s) => s.vocab);
  const reviewCard = useApp((s) => s.reviewCard);
  const recordSession = useApp((s) => s.recordSession);
  const addMemory = useApp((s) => s.addMemory);

  const allCards = useMemo<ReviewCard[]>(
    () => [
      ...SRS_CARDS,
      ...vocab.map((v) => ({ id: v.id, type: "vocab" as const, front: v.front, back: v.back })),
    ],
    [vocab]
  );

  const queue = useMemo(() => {
    const due = allCards.filter((c) => isDue(srs[c.id]));
    const rest = allCards.filter((c) => !isDue(srs[c.id]));
    const n = rescue ? 10 : 12;
    return [...due, ...rest].slice(0, n);
    // freeze queue at mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [again, setAgain] = useState(0);
  const startRef = useRef(nowMs());
  const recordedRef = useRef(false);

  const weakest = useMemo(() => {
    const est = Object.fromEntries(SKILLS.map((s) => [s, estimateSkill(skills[s])])) as Record<(typeof SKILLS)[number], ReturnType<typeof estimateSkill>>;
    return readiness(est).weakest;
  }, [skills]);

  const dueCount = useMemo(() => allCards.filter((c) => isDue(srs[c.id])).length, [allCards, srs]);

  function grade(g: 0 | 1 | 2 | 3) {
    reviewCard(queue[idx].id, g);
    if (g === 0) setAgain((a) => a + 1);
    if (idx + 1 >= queue.length) {
      if (!recordedRef.current) {
        recordedRef.current = true;
        const elapsedMin = Math.max(rescue ? 5 : 1, Math.round((nowMs() - startRef.current) / 60000));
        recordSession({
          skill: weakest,
          minutes: Math.min(elapsedMin, 15),
          type: rescue ? "rescue" : "srs",
          items: queue.length,
          // rescue protocol always protects the chain; a normal review
          // qualifies only via the standard rule (≥5 min, ≥5 items)
          qualifying: rescue ? true : undefined,
        });
        addMemory(rescue ? "Session de secours 5 min — chaîne protégée." : `Rappel espacé : ${queue.length} cartes.`);
      }
      setDone(true);
    } else {
      setIdx(idx + 1);
      setFlipped(false);
    }
  }

  if (queue.length === 0) {
    return (
      <div className="py-16 text-center text-ink-2">
        <p>Aucune carte pour le moment.</p>
        <Btn href="/today" className="mt-4">Retour</Btn>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md space-y-5 py-10 text-center">
        <Badge tone="ok">{rescue ? "Chaîne protégée" : "Rappel terminé"}</Badge>
        <h1 className="font-display text-3xl font-semibold">{queue.length} cartes</h1>
        <p className="text-sm text-ink-2">
          {again === 0
            ? "Tout est passé du premier coup — les intervalles s'allongent."
            : `${again} carte${again > 1 ? "s" : ""} à revoir bientôt : c'est exactement ainsi que la mémoire trie.`}
        </p>
        {rescue && (
          <p className="text-sm text-ink-2">
            5 minutes suffisaient ce soir. La chaîne continue ; demain, on reprend le bloc complet.
          </p>
        )}
        <div className="flex justify-center gap-3">
          <Btn href="/today">Retour à l&apos;accueil</Btn>
        </div>
      </div>
    );
  }

  const card = queue[idx];

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold">{rescue ? "Secours — 5 minutes, garder la chaîne" : "Rappel espacé"}</h1>
          <p className="text-xs text-ink-3">
            {dueCount} carte{dueCount > 1 ? "s" : ""} dues aujourd&apos;hui · SM-2 léger ·{" "}
            <Link href="/notebook" className="underline hover:text-accent">Mon carnet</Link>
          </p>
        </div>
        <span className="font-display text-sm text-ink-3">{idx + 1} / {queue.length}</span>
      </header>

      <button
        onClick={() => setFlipped(true)}
        className="block w-full rounded-xl border-2 border-line bg-white p-8 text-left transition-colors hover:border-accent"
        aria-label={flipped ? "Réponse affichée" : "Afficher la réponse"}
      >
        <Badge tone={card.type === "trap" ? "warn" : card.type === "template" ? "gold" : card.type === "vocab" ? "ok" : "accent"}>{TYPE_LABEL[card.type]}</Badge>
        <p className="mt-3 text-lg font-semibold leading-snug">{card.front}</p>
        {flipped ? (
          <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-2">{card.back}</p>
        ) : (
          <p className="mt-4 text-xs text-ink-3">Répondez dans votre tête, puis touchez pour vérifier.</p>
        )}
      </button>

      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {GRADES.map(({ g, label, tone }) => (
            <button
              key={g}
              onClick={() => grade(g)}
              className={`rounded-lg border-2 bg-white px-2 py-2.5 text-xs font-semibold ${tone} hover:bg-paper`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {rescue && (
        <Card className="bg-paper">
          <p className="text-xs leading-relaxed text-ink-3">
            Protocole de secours : 10 cartes, 5 minutes concentrées, et la journée est qualifiante. Jamais
            d&apos;examen blanc obligatoire pour sauver une chaîne — c&apos;est la règle.
          </p>
        </Card>
      )}
    </div>
  );
}
