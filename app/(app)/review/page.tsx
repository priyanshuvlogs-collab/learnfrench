"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { SKILLS } from "@/lib/types";
import { estimateSkill, readiness } from "@/lib/nclc";
import { isDue } from "@/lib/srs";
import { nowMs } from "@/lib/dates";
import { L, useLang } from "@/lib/i18n";
import { EN } from "@/content/translations";
import { SRS_CARDS } from "@/content/srs-cards";
import { Badge, Btn, Card } from "@/components/ui";

const TYPE_LABEL = {
  connector: { fr: "Connecteur", en: "Connector" },
  verb: { fr: "Structure", en: "Structure" },
  trap: { fr: "Piège", en: "Trap" },
  template: { fr: "Gabarit", en: "Template" },
} as const;
const GRADES: { g: 0 | 1 | 2 | 3; fr: string; en: string; tone: string }[] = [
  { g: 0, fr: "Encore", en: "Again", tone: "border-warn text-warn" },
  { g: 1, fr: "Difficile", en: "Hard", tone: "border-line text-ink-2" },
  { g: 2, fr: "Bien", en: "Good", tone: "border-accent text-accent" },
  { g: 3, fr: "Facile", en: "Easy", tone: "border-ok text-ok" },
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
  const lang = useLang();
  const reviewCard = useApp((s) => s.reviewCard);
  const recordSession = useApp((s) => s.recordSession);
  const addMemory = useApp((s) => s.addMemory);

  const queue = useMemo(() => {
    const due = SRS_CARDS.filter((c) => isDue(srs[c.id]));
    const rest = SRS_CARDS.filter((c) => !isDue(srs[c.id]));
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

  const dueCount = useMemo(() => SRS_CARDS.filter((c) => isDue(srs[c.id])).length, [srs]);

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
        <p>{L(lang, "Aucune carte pour le moment.", "No cards for now.")}</p>
        <Btn href="/today" className="mt-4">{L(lang, "Retour", "Back")}</Btn>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md space-y-5 py-10 text-center">
        <Badge tone="ok">{rescue ? L(lang, "Chaîne protégée", "Streak protected") : L(lang, "Rappel terminé", "Review complete")}</Badge>
        <h1 className="font-display text-3xl font-semibold">{queue.length} {L(lang, "cartes", "cards")}</h1>
        <p className="text-sm text-ink-2">
          {again === 0
            ? L(lang, "Tout est passé du premier coup — les intervalles s'allongent.", "Everything passed first try — the intervals stretch out.")
            : L(lang,
                `${again} carte${again > 1 ? "s" : ""} à revoir bientôt : c'est exactement ainsi que la mémoire trie.`,
                `${again} card${again > 1 ? "s" : ""} coming back soon: that is exactly how memory sorts.`)}
        </p>
        {rescue && (
          <p className="text-sm text-ink-2">
            {L(lang,
              "5 minutes suffisaient ce soir. La chaîne continue ; demain, on reprend le bloc complet.",
              "5 minutes were enough tonight. The chain continues; tomorrow, back to the full block.")}
          </p>
        )}
        <div className="flex justify-center gap-3">
          <Btn href="/today">{L(lang, "Retour à l'accueil", "Back to Today")}</Btn>
        </div>
      </div>
    );
  }

  const card = queue[idx];

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold">
            {rescue ? L(lang, "Secours — 5 minutes, garder la chaîne", "Rescue — 5 minutes, keep the chain") : L(lang, "Rappel espacé", "Spaced review")}
          </h1>
          <p className="text-xs text-ink-3">
            {L(lang, `${dueCount} carte${dueCount > 1 ? "s" : ""} dues aujourd'hui · SM-2 léger`, `${dueCount} card${dueCount === 1 ? "" : "s"} due today · SM-2 lite`)}
          </p>
        </div>
        <span className="font-display text-sm text-ink-3">{idx + 1} / {queue.length}</span>
      </header>

      <button
        onClick={() => setFlipped(true)}
        className="block w-full rounded-xl border-2 border-line bg-white p-8 text-left transition-colors hover:border-accent"
        aria-label={flipped ? L(lang, "Réponse affichée", "Answer shown") : L(lang, "Afficher la réponse", "Show the answer")}
      >
        <Badge tone={card.type === "trap" ? "warn" : card.type === "template" ? "gold" : "accent"}>{TYPE_LABEL[card.type][lang]}</Badge>
        <p className="mt-3 text-lg font-semibold leading-snug">{card.front}</p>
        {flipped ? (
          <div className="mt-4 space-y-2 border-t border-line pt-4">
            <p className="text-sm leading-relaxed text-ink-2">🇫🇷 {card.back}</p>
            {EN[card.id] && <p className="text-sm italic leading-relaxed text-ink-3">🇬🇧 {EN[card.id]}</p>}
          </div>
        ) : (
          <p className="mt-4 text-xs text-ink-3">{L(lang, "Répondez dans votre tête, puis touchez pour vérifier.", "Answer in your head, then tap to check.")}</p>
        )}
      </button>

      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {GRADES.map(({ g, fr, en, tone }) => (
            <button
              key={g}
              onClick={() => grade(g)}
              className={`rounded-lg border-2 bg-white px-2 py-2.5 text-xs font-semibold ${tone} hover:bg-paper`}
            >
              {L(lang, fr, en)}
            </button>
          ))}
        </div>
      )}

      {rescue && (
        <Card className="bg-paper">
          <p className="text-xs leading-relaxed text-ink-3">
            {L(lang,
              "Protocole de secours : 10 cartes, 5 minutes concentrées, et la journée est qualifiante. Jamais d'examen blanc obligatoire pour sauver une chaîne — c'est la règle.",
              "Rescue protocol: 10 cards, 5 focused minutes, and the day qualifies. Never a mandatory mock to save a streak — that's the rule.")}
          </p>
        </Card>
      )}
    </div>
  );
}
