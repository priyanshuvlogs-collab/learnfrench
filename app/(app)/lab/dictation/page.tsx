"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { DICTATION_ITEMS, DictationItem } from "@/content/dictations";
import { DictationResult, scoreDictation } from "@/lib/french";
import { nowMs } from "@/lib/dates";
import { AccentBar } from "@/components/accent-bar";
import { Badge, Btn, Card } from "@/components/ui";

const PER_SESSION = 5;
const MAX_PLAYS = 2;

const LEVEL_LABEL = { A: "Niveau A · NCLC 4-5", B: "Niveau B · NCLC 6-7", C: "Niveau C · NCLC 8-9" } as const;

function pickItems(level: "A" | "B" | "C", offset: number): DictationItem[] {
  const pool = DICTATION_ITEMS.filter((d) => d.level === level);
  const start = (offset * PER_SESSION) % pool.length;
  return Array.from({ length: Math.min(PER_SESSION, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
}

export default function DictationPage() {
  const profile = useApp((s) => s.profile);
  const defaultLevel: "A" | "B" | "C" = (profile?.targetNCLC ?? 7) <= 5 ? "A" : (profile?.targetNCLC ?? 7) >= 8 ? "C" : "B";
  const [level, setLevel] = useState<"A" | "B" | "C" | null>(null);

  if (level === null) {
    return (
      <div className="mx-auto max-w-lg space-y-5">
        <header>
          <Link href="/lab" className="text-xs text-ink-3 hover:text-accent">← Labo</Link>
          <h1 className="font-display text-2xl font-semibold">Dictée</h1>
          <p className="mt-1 text-sm text-ink-2">
            Cinq phrases. Deux écoutes chacune — la seconde, plus lente. Vous écrivez, la correction
            fait le tri entre vrai mot faux et simple accent oublié.
          </p>
        </header>
        <div className="space-y-2">
          {(["A", "B", "C"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-semibold transition-colors hover:border-accent ${
                l === defaultLevel ? "border-accent bg-accent-soft" : "border-line bg-white"
              }`}
            >
              {LEVEL_LABEL[l]}
              {l === defaultLevel && <span className="ml-2 text-xs font-normal text-accent">recommandé pour votre cible</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return <Dictation level={level} />;
}

function Dictation({ level }: { level: "A" | "B" | "C" }) {
  const sessions = useApp((s) => s.sessions);
  const recordSession = useApp((s) => s.recordSession);
  const addSkillScore = useApp((s) => s.addSkillScore);
  const addWeakPattern = useApp((s) => s.addWeakPattern);
  const addMemory = useApp((s) => s.addMemory);

  const priorCount = useMemo(
    () => sessions.filter((s) => s.type === "dictation").length,
    // freeze at mount so the set doesn't shift mid-session
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const items = useMemo(() => pickItems(level, priorCount), [level, priorCount]);

  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState<DictationResult | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const startRef = useRef(nowMs());
  const recordedRef = useRef(false);

  const item = items[idx];

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function speak() {
    if (playing || plays >= MAX_PLAYS || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(item.text);
    u.lang = "fr-FR";
    u.rate = plays === 0 ? 0.9 : 0.7; // seconde écoute plus lente, comme en dictée réelle
    const fr = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("fr"));
    if (fr) u.voice = fr;
    const clear = () => setPlaying(false);
    u.onend = clear;
    u.onerror = clear;
    setPlays((p) => p + 1);
    setPlaying(true);
    window.speechSynthesis.speak(u);
    // certains environnements ne déclenchent jamais onend : déverrouiller quand même
    window.setTimeout(clear, 2000 + item.text.length * 130);
  }

  function check() {
    const r = scoreDictation(item.text, typed);
    setResult(r);
    setScores((s) => [...s, r.score]);
    if (r.score < 70) addWeakPattern("listening", "dictée : orthographe sous dictée");
  }

  function next() {
    if (idx + 1 >= items.length) {
      if (!recordedRef.current) {
        recordedRef.current = true;
        const all = [...scores];
        const avg = Math.round(all.reduce((a, b) => a + b, 0) / all.length);
        const minutes = Math.max(1, Math.round((nowMs() - startRef.current) / 60000));
        recordSession({ skill: "listening", minutes: Math.min(minutes, 25), type: "dictation", score: avg, items: items.length });
        addSkillScore("listening", avg);
        addMemory(`Dictée niveau ${level} : ${avg} % sur ${items.length} phrases.`);
      }
      setFinished(true);
    } else {
      setIdx(idx + 1);
      setTyped("");
      setPlays(0);
      setResult(null);
    }
  }

  if (finished) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return (
      <div className="mx-auto max-w-lg space-y-5 py-8 text-center">
        <Badge tone={avg >= 70 ? "ok" : "accent"}>Dictée terminée</Badge>
        <h1 className="font-display text-3xl font-semibold">{avg} %</h1>
        <p className="text-sm text-ink-2">
          Moyenne sur {scores.length} phrases de niveau {level} — les accents comptent pour moitié, comme dans la vraie correction.
        </p>
        <Card className="text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Votre victoire du jour</div>
          <p className="mt-1 text-sm text-ink-2">
            {avg >= 70
              ? "Vous transcrivez de l'oral en orthographe juste — c'est exactement le pont CO → EE que l'examen ne teste jamais directement mais récompense partout."
              : "Chaque phrase vous a montré son piège. La dictée est l'exercice qui progresse le plus vite : refaites ce niveau dans deux jours."}
          </p>
        </Card>
        <div className="flex justify-center gap-3">
          <Btn href="/lab">Retour au labo</Btn>
          <Btn href="/today" variant="ghost">Accueil</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/lab" className="text-xs text-ink-3 hover:text-accent">← Labo</Link>
          <h1 className="font-display text-xl font-semibold">Dictée · {LEVEL_LABEL[level]}</h1>
        </div>
        <span className="font-display text-sm text-ink-3">{idx + 1} / {items.length}</span>
      </header>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Écoutez, puis écrivez la phrase exactement.</p>
            <p className="mt-1 text-xs text-ink-3">
              {plays === 0
                ? "Première écoute à vitesse normale ; la seconde sera plus lente."
                : plays < MAX_PLAYS
                  ? "Il vous reste une écoute, au ralenti."
                  : "Plus d'écoute — engagez votre version."}
            </p>
          </div>
          <button
            onClick={speak}
            disabled={plays >= MAX_PLAYS || playing || result !== null}
            className={`shrink-0 rounded-full px-5 py-5 font-semibold ${
              plays >= MAX_PLAYS || result !== null ? "bg-paper-2 text-ink-3" : "bg-accent text-white hover:bg-accent-2"
            }`}
            aria-label={plays >= MAX_PLAYS ? "Écoutes épuisées" : "Écouter la phrase"}
          >
            {playing ? "…" : plays >= MAX_PLAYS ? "✓" : "▶"}
          </button>
        </div>
      </Card>

      <div className="space-y-2">
        <textarea
          ref={areaRef}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={result !== null}
          rows={3}
          placeholder={plays === 0 ? "Écoutez d'abord…" : "Écrivez la phrase entendue, ponctuation comprise."}
          className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm leading-relaxed disabled:bg-paper"
          spellCheck={false}
          autoCorrect="off"
        />
        {result === null && <AccentBar targetRef={areaRef} onInsert={setTyped} />}
      </div>

      {result === null ? (
        <Btn onClick={check} disabled={plays === 0 || typed.trim().length === 0} className="w-full">
          Corriger ma phrase
        </Btn>
      ) : (
        <Card className="border-accent/30 space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Correction</span>
              <span className="font-display text-lg font-semibold">{result.score} %</span>
            </div>
            <p className="mt-2 text-sm leading-loose">
              {result.tokens.map((t, i) => (
                <span
                  key={i}
                  className={`mr-1 rounded px-0.5 ${
                    t.status === "ok"
                      ? "text-ink"
                      : t.status === "accent"
                        ? "bg-gold-soft text-gold"
                        : t.status === "wrong"
                          ? "bg-warn-soft text-warn line-through decoration-warn/50"
                          : "bg-warn-soft italic text-warn"
                  }`}
                  title={t.status === "accent" ? `Vous avez écrit « ${t.typed} »` : t.status === "wrong" ? `Vous avez écrit « ${t.typed} »` : t.status === "missing" ? "Mot manquant" : undefined}
                >
                  {t.expected}
                </span>
              ))}
            </p>
            <p className="mt-2 text-[11px] text-ink-3">
              {result.correct} mot{result.correct > 1 ? "s" : ""} juste{result.correct > 1 ? "s" : ""}
              {result.accentSlips > 0 && <> · {result.accentSlips} faute{result.accentSlips > 1 ? "s" : ""} d&apos;accent (½ point)</>}
              {result.extras.length > 0 && <> · {result.extras.length} mot{result.extras.length > 1 ? "s" : ""} en trop</>}
              {" "}· jaune = accent, barré = mot faux, italique = manquant
            </p>
          </div>
          <div className="border-t border-line pt-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-3">Le piège de cette phrase</div>
            <p className="mt-1 text-sm text-ink-2">{item.trap}</p>
          </div>
          <Btn onClick={next} className="w-full">
            {idx + 1 >= items.length ? "Terminer la dictée" : "Phrase suivante →"}
          </Btn>
        </Card>
      )}
    </div>
  );
}
