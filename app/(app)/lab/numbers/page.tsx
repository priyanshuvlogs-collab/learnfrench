"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { digitsOf, genNumberItem, NumberItem } from "@/lib/french";
import { nowMs } from "@/lib/dates";
import { Badge, Btn, Card } from "@/components/ui";

const PER_SESSION = 8;

export default function NumbersPage() {
  const recordSession = useApp((s) => s.recordSession);
  const addSkillScore = useApp((s) => s.addSkillScore);
  const addWeakPattern = useApp((s) => s.addWeakPattern);
  const addMemory = useApp((s) => s.addMemory);

  const items = useMemo<NumberItem[]>(() => Array.from({ length: PER_SESSION }, () => genNumberItem()), []);

  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [verdict, setVerdict] = useState<"ok" | "ko" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const startRef = useRef(nowMs());
  const recordedRef = useRef(false);

  const item = items[idx];

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function speak() {
    if (played || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(item.spoken);
    u.lang = "fr-FR";
    u.rate = 0.95;
    const fr = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("fr"));
    if (fr) u.voice = fr;
    const clear = () => {
      setPlaying(false);
      inputRef.current?.focus();
    };
    u.onend = clear;
    u.onerror = clear;
    setPlayed(true);
    setPlaying(true);
    window.speechSynthesis.speak(u);
    // certains environnements ne déclenchent jamais onend : déverrouiller quand même
    window.setTimeout(clear, 2000 + item.spoken.length * 130);
  }

  function check() {
    const ok = digitsOf(typed) === item.digits;
    setVerdict(ok ? "ok" : "ko");
    if (ok) setCorrectCount((c) => c + 1);
    else addWeakPattern("listening", `nombres à l'oreille (${item.kindLabel.toLowerCase()})`);
  }

  function next() {
    if (idx + 1 >= items.length) {
      if (!recordedRef.current) {
        recordedRef.current = true;
        const finalCorrect = correctCount;
        const pct = Math.round((finalCorrect / items.length) * 100);
        const minutes = Math.max(1, Math.round((nowMs() - startRef.current) / 60000));
        recordSession({ skill: "listening", minutes: Math.min(minutes, 15), type: "numbers", score: pct, items: items.length });
        addSkillScore("listening", pct);
        addMemory(`Nombres au vol : ${finalCorrect}/${items.length}.`);
      }
      setFinished(true);
    } else {
      setIdx(idx + 1);
      setTyped("");
      setPlayed(false);
      setVerdict(null);
    }
  }

  if (finished) {
    const pct = Math.round((correctCount / items.length) * 100);
    return (
      <div className="mx-auto max-w-lg space-y-5 py-8 text-center">
        <Badge tone={pct >= 70 ? "ok" : "accent"}>Session terminée</Badge>
        <h1 className="font-display text-3xl font-semibold">{correctCount} / {items.length}</h1>
        <p className="text-sm text-ink-2">
          Les chiffres dictés une seule fois ouvrent la section A de la compréhension orale — des points
          rapides quand l&apos;oreille est prête.
        </p>
        <Card className="text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Votre victoire du jour</div>
          <p className="mt-1 text-sm text-ink-2">
            {pct >= 75
              ? "Les soixante-dix et quatre-vingt ne vous ralentissent plus. Prochaine étape : la même précision dans un dialogue complet."
              : "Vous avez tenu l'écoute unique sur huit nombres d'affilée. Refaites une série demain : c'est un réflexe qui se construit en quelques jours."}
          </p>
        </Card>
        <div className="flex justify-center gap-3">
          <Btn onClick={() => window.location.reload()} variant="ghost">Nouvelle série</Btn>
          <Btn href="/lab">Retour au labo</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/lab" className="text-xs text-ink-3 hover:text-accent">← Labo</Link>
          <h1 className="font-display text-xl font-semibold">Nombres au vol</h1>
        </div>
        <span className="font-display text-sm text-ink-3">{idx + 1} / {items.length}</span>
      </header>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge tone="ink">{item.kindLabel}</Badge>
            <p className="mt-2 text-sm font-semibold">Écoutez — une seule fois — et notez en chiffres.</p>
            <p className="mt-1 text-xs text-ink-3">Format attendu : {item.hint}. Espaces et ponctuation libres, seuls les chiffres comptent.</p>
          </div>
          <button
            onClick={speak}
            disabled={played}
            className={`shrink-0 rounded-full px-5 py-5 font-semibold ${played ? "bg-paper-2 text-ink-3" : "bg-accent text-white hover:bg-accent-2"}`}
            aria-label={played ? "Audio déjà joué" : "Jouer l'audio (une seule fois)"}
          >
            {playing ? "…" : played ? "✓" : "▶"}
          </button>
        </div>
      </Card>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (verdict === null && played && typed.trim()) check();
        }}
        className="flex gap-2"
      >
        <input
          ref={inputRef}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={!played || verdict !== null}
          inputMode="decimal"
          placeholder={played ? item.hint : "Écoutez d'abord…"}
          className="flex-1 rounded-lg border border-line bg-white px-3 py-2.5 font-display text-lg tabular-nums disabled:bg-paper"
          autoComplete="off"
        />
        {verdict === null && (
          <Btn type="submit" disabled={!played || !typed.trim()}>Vérifier</Btn>
        )}
      </form>

      {verdict !== null && (
        <Card className={verdict === "ok" ? "border-ok/40" : "border-warn/40"}>
          <div className={`text-xs font-semibold uppercase tracking-wider ${verdict === "ok" ? "text-ok" : "text-warn"}`}>
            {verdict === "ok" ? "Exact" : "Pas tout à fait"}
          </div>
          <p className="mt-1 text-sm text-ink-2">
            La réponse était <strong className="font-display">{item.display}</strong>
            {verdict === "ko" && <> — vous avez noté « {typed.trim()} ».</>}
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold text-ink-3 hover:text-accent">Ce qui a été dit</summary>
            <p className="mt-1 rounded-lg bg-paper p-3 text-sm text-ink-2">{item.spoken}</p>
          </details>
          <Btn onClick={next} className="mt-4 w-full">
            {idx + 1 >= items.length ? "Terminer la série" : "Nombre suivant →"}
          </Btn>
        </Card>
      )}
    </div>
  );
}
