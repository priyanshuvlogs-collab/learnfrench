"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { CONJUGATION_ITEMS, ConjugationItem } from "@/content/conjugation";
import { checkConjugation, ConjVerdict } from "@/lib/french";
import { nowMs } from "@/lib/dates";
import { AccentBar } from "@/components/accent-bar";
import { Badge, Btn, Card } from "@/components/ui";

const PER_SESSION = 10;

/** Un item de chaque temps d'abord, puis rotation dans la banque. */
function pickItems(offset: number): ConjugationItem[] {
  const start = (offset * PER_SESSION) % CONJUGATION_ITEMS.length;
  const rotated = Array.from(
    { length: CONJUGATION_ITEMS.length },
    (_, i) => CONJUGATION_ITEMS[(start + i) % CONJUGATION_ITEMS.length]
  );
  // échantillonner en alternant les temps pour l'interleaving
  const byTense = new Map<string, ConjugationItem[]>();
  rotated.forEach((it) => {
    const arr = byTense.get(it.tense) ?? [];
    arr.push(it);
    byTense.set(it.tense, arr);
  });
  const groups = [...byTense.values()];
  const out: ConjugationItem[] = [];
  let g = 0;
  while (out.length < PER_SESSION) {
    const grp = groups[g % groups.length];
    const nextItem = grp.shift();
    if (nextItem) out.push(nextItem);
    g++;
  }
  return out;
}

export default function ConjugationPage() {
  const sessions = useApp((s) => s.sessions);
  const recordSession = useApp((s) => s.recordSession);
  const addSkillScore = useApp((s) => s.addSkillScore);
  const addWeakPattern = useApp((s) => s.addWeakPattern);
  const addMemory = useApp((s) => s.addMemory);

  const priorCount = useMemo(
    () => sessions.filter((s) => s.type === "conjugation").length,
    // freeze at mount so the set doesn't shift mid-session
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const items = useMemo(() => pickItems(priorCount), [priorCount]);

  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [verdict, setVerdict] = useState<ConjVerdict | null>(null);
  const [points, setPoints] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const startRef = useRef(nowMs());
  const recordedRef = useRef(false);

  const item = items[idx];

  function check() {
    const v = checkConjugation(item.answer, typed, item.accept);
    setVerdict(v);
    setPoints((p) => p + (v === "ok" ? 1 : v === "accent" ? 0.5 : 0));
    if (v === "wrong") addWeakPattern("writing", `conjugaison : ${item.tense.toLowerCase()}`);
  }

  function next() {
    if (idx + 1 >= items.length) {
      if (!recordedRef.current) {
        recordedRef.current = true;
        const pct = Math.round((points / items.length) * 100);
        const minutes = Math.max(1, Math.round((nowMs() - startRef.current) / 60000));
        recordSession({ skill: "writing", minutes: Math.min(minutes, 20), type: "conjugation", score: pct, items: items.length });
        addSkillScore("writing", pct);
        addMemory(`Sprint de conjugaison : ${pct} %.`);
      }
      setFinished(true);
    } else {
      setIdx(idx + 1);
      setTyped("");
      setVerdict(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  if (finished) {
    const pct = Math.round((points / items.length) * 100);
    return (
      <div className="mx-auto max-w-lg space-y-5 py-8 text-center">
        <Badge tone={pct >= 70 ? "ok" : "accent"}>Sprint terminé</Badge>
        <h1 className="font-display text-3xl font-semibold">{pct} %</h1>
        <p className="text-sm text-ink-2">
          Forme exacte = 1 point, bon mot sans les accents = ½. La conjugaison sûre libère l&apos;attention
          pour les idées — à l&apos;écrit comme à l&apos;oral.
        </p>
        <Card className="text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Votre victoire du jour</div>
          <p className="mt-1 text-sm text-ink-2">
            {pct >= 80
              ? "Dix formes verbales sans filet, mélange de six temps — c'est le niveau d'automatisme qu'exige la lettre formelle."
              : "Chaque forme ratée est repartie avec sa règle. Dix items par jour suffisent : la conjugaison est une affaire de fréquence, pas de volume."}
          </p>
        </Card>
        <div className="flex justify-center gap-3">
          <Btn href="/lab">Retour au labo</Btn>
          <Btn href="/review" variant="ghost">Rappel espacé</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/lab" className="text-xs text-ink-3 hover:text-accent">← Labo</Link>
          <h1 className="font-display text-xl font-semibold">Sprint de conjugaison</h1>
        </div>
        <span className="font-display text-sm text-ink-3">{idx + 1} / {items.length}</span>
      </header>

      <Card>
        <Badge tone="ink">{item.tense}</Badge>
        <p className="mt-3 font-display text-xl">
          {item.subject}{item.subject.endsWith("'") ? "" : " "}
          <span className="inline-block min-w-24 border-b-2 border-dashed border-accent/50 text-center text-accent">
            {verdict !== null ? item.answer : "…"}
          </span>{" "}
          <span className="text-ink-3">({item.verb})</span>
        </p>
      </Card>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (verdict === null && typed.trim()) check();
        }}
        className="space-y-2"
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={verdict !== null}
            placeholder="Tapez la forme conjuguée…"
            className="flex-1 rounded-lg border border-line bg-white px-3 py-2.5 text-sm disabled:bg-paper"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            autoFocus
          />
          {verdict === null && <Btn type="submit" disabled={!typed.trim()}>Vérifier</Btn>}
        </div>
        {verdict === null && <AccentBar targetRef={inputRef} onInsert={setTyped} />}
      </form>

      {verdict !== null && (
        <Card className={verdict === "ok" ? "border-ok/40" : verdict === "accent" ? "border-gold/40" : "border-warn/40"}>
          <div
            className={`text-xs font-semibold uppercase tracking-wider ${
              verdict === "ok" ? "text-ok" : verdict === "accent" ? "text-gold" : "text-warn"
            }`}
          >
            {verdict === "ok" ? "Exact" : verdict === "accent" ? "Bon mot — accents à revoir (½ point)" : "Pas cette forme"}
          </div>
          <p className="mt-1 text-sm text-ink-2">
            {item.subject}{item.subject.endsWith("'") ? "" : " "}<strong>{item.answer}</strong>
            {verdict !== "ok" && <> — vous avez écrit « {typed.trim()} »</>}
          </p>
          <div className="mt-3 border-t border-line pt-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-3">La règle</div>
            <p className="mt-1 text-sm text-ink-2">{item.note}</p>
          </div>
          <Btn onClick={next} className="mt-4 w-full">
            {idx + 1 >= items.length ? "Terminer le sprint" : "Forme suivante →"}
          </Btn>
        </Card>
      )}
    </div>
  );
}
