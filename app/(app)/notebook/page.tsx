"use client";

import { useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { isDue } from "@/lib/srs";
import { AccentBar } from "@/components/accent-bar";
import { Badge, Btn, Card, Kicker } from "@/components/ui";

export default function NotebookPage() {
  const vocab = useApp((s) => s.vocab);
  const srs = useApp((s) => s.srs);
  const addVocabEntry = useApp((s) => s.addVocabEntry);
  const removeVocabEntry = useApp((s) => s.removeVocabEntry);

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLTextAreaElement>(null);
  const [lastFocused, setLastFocused] = useState<"front" | "back">("front");

  const dueCount = vocab.filter((v) => isDue(srs[v.id])).length;
  const sorted = [...vocab].reverse(); // plus récents d'abord

  function add() {
    if (!front.trim() || !back.trim()) return;
    addVocabEntry(front, back);
    setFront("");
    setBack("");
    frontRef.current?.focus();
  }

  return (
    <div className="space-y-5">
      <header>
        <Kicker>Mon carnet</Kicker>
        <h1 className="mt-1 font-display text-2xl font-semibold">Vos mots, dans la machine à mémoire</h1>
        <p className="mt-1 text-sm text-ink-2">
          Un mot croisé dans un exercice, un courriel, une conversation ? Notez-le ici : il devient une
          carte de rappel espacé, mélangée aux 120 cartes du programme.
          {vocab.length > 0 && (
            <span className="text-ink-3">
              {" "}· {vocab.length} entrée{vocab.length > 1 ? "s" : ""}{dueCount > 0 && <>, {dueCount} due{dueCount > 1 ? "s" : ""} aujourd&apos;hui</>}
            </span>
          )}
        </p>
      </header>

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Ajouter une entrée</h2>
        <label className="block text-sm">
          <span className="font-semibold">Mot ou expression</span>
          <input
            ref={frontRef}
            value={front}
            onChange={(e) => setFront(e.target.value)}
            onFocus={() => setLastFocused("front")}
            placeholder="Ex. : « faire la navette »"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
            spellCheck={false}
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Sens, exemple, remarque</span>
          <textarea
            ref={backRef}
            value={back}
            onChange={(e) => setBack(e.target.value)}
            onFocus={() => setLastFocused("back")}
            rows={2}
            placeholder="Ex. : faire l'aller-retour domicile-travail — « Je fais la navette entre Laval et Montréal. »"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {lastFocused === "front" ? (
            <AccentBar targetRef={frontRef} onInsert={setFront} />
          ) : (
            <AccentBar targetRef={backRef} onInsert={setBack} />
          )}
          <Btn onClick={add} disabled={!front.trim() || !back.trim()}>Ajouter au carnet</Btn>
        </div>
      </Card>

      {vocab.length === 0 ? (
        <Card className="bg-paper text-center">
          <p className="text-sm text-ink-2">
            Le carnet est vide. Commencez par trois expressions que vous voulez utiliser dans votre
            prochaine lettre formelle — c&apos;est le meilleur retour sur investissement.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {sorted.map((v) => {
            const due = isDue(srs[v.id]);
            const state = srs[v.id];
            return (
              <Card key={v.id} className="!p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{v.front}</span>
                      {due ? <Badge tone="accent">à revoir</Badge> : <Badge tone="ink">revue le {state?.due}</Badge>}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{v.back}</p>
                    <p className="mt-1 text-[11px] text-ink-3">Ajouté le {v.addedAt}{state ? ` · ${state.reps} rappel${state.reps > 1 ? "s" : ""}` : ""}</p>
                  </div>
                  {confirmDelete === v.id ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button onClick={() => removeVocabEntry(v.id)} className="text-xs font-semibold text-warn hover:underline">Supprimer</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-xs text-ink-3 hover:underline">Annuler</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(v.id)}
                      className="shrink-0 text-xs text-ink-3 hover:text-warn"
                      aria-label={`Supprimer « ${v.front} »`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex justify-center">
        <Btn href="/review" variant="ghost">Lancer le rappel espacé →</Btn>
      </div>
    </div>
  );
}
