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
        <Kicker>My notebook</Kicker>
        <h1 className="mt-1 font-display text-2xl font-semibold">Your French words, in the memory machine</h1>
        <p className="mt-1 text-sm text-ink-2">
          A word from a drill, an email, a conversation? Add it here: it becomes a spaced-repetition
          card, mixed with the 120 programme cards. Keep the French on the front.
          {vocab.length > 0 && (
            <span className="text-ink-3">
              {" "}· {vocab.length} entr{vocab.length > 1 ? "ies" : "y"}{dueCount > 0 && <>, {dueCount} due today</>}
            </span>
          )}
        </p>
      </header>

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Add an entry</h2>
        <label className="block text-sm">
          <span className="font-semibold">French word or expression</span>
          <input
            ref={frontRef}
            value={front}
            onChange={(e) => setFront(e.target.value)}
            onFocus={() => setLastFocused("front")}
            placeholder='e.g. “faire la navette”'
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
            spellCheck={false}
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Meaning, example, note</span>
          <textarea
            ref={backRef}
            value={back}
            onChange={(e) => setBack(e.target.value)}
            onFocus={() => setLastFocused("back")}
            rows={2}
            placeholder="e.g. to commute — “Je fais la navette entre Laval et Montréal.”"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {lastFocused === "front" ? (
            <AccentBar targetRef={frontRef} onInsert={setFront} />
          ) : (
            <AccentBar targetRef={backRef} onInsert={setBack} />
          )}
          <Btn onClick={add} disabled={!front.trim() || !back.trim()}>Add to notebook</Btn>
        </div>
      </Card>

      {vocab.length === 0 ? (
        <Card className="bg-paper text-center">
          <p className="text-sm text-ink-2">
            The notebook is empty. Start with three expressions you want in your next formal letter —
            that is the best return on investment.
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
                      {due ? <Badge tone="accent">due</Badge> : <Badge tone="ink">next {state?.due}</Badge>}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{v.back}</p>
                    <p className="mt-1 text-[11px] text-ink-3">Added {v.addedAt}{state ? ` · ${state.reps} review${state.reps !== 1 ? "s" : ""}` : ""}</p>
                  </div>
                  {confirmDelete === v.id ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button onClick={() => removeVocabEntry(v.id)} className="text-xs font-semibold text-warn hover:underline">Delete</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-xs text-ink-3 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(v.id)}
                      className="shrink-0 text-xs text-ink-3 hover:text-warn"
                      aria-label={`Delete “${v.front}”`}
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
        <Btn href="/review" variant="ghost">Start spaced review →</Btn>
      </div>
    </div>
  );
}
