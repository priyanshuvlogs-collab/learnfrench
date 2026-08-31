"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WRITING_PROMPTS } from "@/content/writing-prompts";
import { useApp, historyLexicalDensity } from "@/lib/store";
import { countWords, scoreWriting, WritingResult } from "@/lib/scoring";
import { nowMs, todayKey } from "@/lib/dates";
import { Badge, Btn, Card } from "@/components/ui";

const RUBRIC_LABELS: [keyof WritingResult["rubric"], string][] = [
  ["task", "Respect de la consigne"],
  ["coherence", "Cohérence / structure"],
  ["lexicon", "Étendue du vocabulaire"],
  ["grammar", "Contrôle grammatical"],
  ["register", "Registre"],
];

export default function WritingLabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const prompt = WRITING_PROMPTS.find((p) => p.id === id);
  if (!prompt) notFound();
  return <Lab promptId={id} />;
}

function Lab({ promptId }: { promptId: string }) {
  const prompt = WRITING_PROMPTS.find((p) => p.id === promptId)!;
  const addWriting = useApp((s) => s.addWriting);
  const recordSession = useApp((s) => s.recordSession);
  const addSkillScore = useApp((s) => s.addSkillScore);
  const addMemory = useApp((s) => s.addMemory);
  const writingSubs = useApp((s) => s.writingSubs);
  const profile = useApp((s) => s.profile)!;

  const [text, setText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(prompt.minutes * 60);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<WritingResult | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started || result) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [started, result]);

  const words = countWords(text);
  const histLd = useMemo(() => historyLexicalDensity(writingSubs), [writingSubs]);

  function submit() {
    const minutes = startRef.current ? Math.max(1, Math.round((nowMs() - startRef.current) / 60000)) : 1;
    const r = scoreWriting(text, {
      minWords: prompt.minWords,
      bullets: prompt.bullets,
      register: prompt.register,
      historyLexicalDensity: histLd,
    });
    setResult(r);
    addWriting({
      id: `${nowMs()}`,
      promptId: prompt.id,
      date: todayKey(),
      text,
      words,
      minutes,
      rubric: r.rubric,
      score: r.score,
      estNCLC: r.estNCLC,
      flags: r.flags,
      feedback: r.feedback,
      win: r.win,
      lexicalDensity: r.lexicalDensity,
    });
    // Qualifying only if the official minimum is reached
    recordSession({ skill: "writing", minutes: Math.min(minutes, prompt.minutes), type: "writing", score: r.score, items: 1, qualifying: words >= prompt.minWords });
    addSkillScore("writing", r.score);
    addMemory(`EE ${prompt.exam} ${prompt.task} : ${words} mots, ~NCLC ${r.estNCLC}.${r.flags.includes("sudden-jump") ? " (texte suspect — réécriture demandée)" : ""}`);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  if (result) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <header className="text-center">
          <Badge tone={result.flags.includes("sudden-jump") ? "warn" : "ok"}>Copie évaluée — grille d&apos;examinateur</Badge>
          <h1 className="mt-2 font-display text-3xl font-semibold">~NCLC {result.estNCLC}</h1>
          <p className="text-xs text-ink-3">Estimation pédagogique — pas un résultat officiel.</p>
        </header>

        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Les 5 dimensions</h2>
          <div className="mt-3 space-y-2.5">
            {RUBRIC_LABELS.map(([k, label]) => (
              <div key={k}>
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-display font-semibold">{result.rubric[k].toFixed(1)} / 5</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
                  <div className="bar-ease h-full rounded-full bg-accent" style={{ width: `${(result.rubric[k] / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {result.feedback.length > 0 && (
          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">À corriger en priorité</h2>
            <ul className="mt-2 space-y-2 text-sm text-ink-2">
              {result.feedback.map((f, i) => (
                <li key={i} className="flex gap-2"><span className="text-warn">•</span>{f}</li>
              ))}
            </ul>
          </Card>
        )}

        <Card className="border-gold/30 bg-gold-soft/40">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Votre victoire</div>
          <p className="mt-1 text-sm text-ink-2">{result.win}</p>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Paragraphe modèle (cible NCLC {profile.targetNCLC})</h2>
          <p className="mt-2 whitespace-pre-line rounded-lg bg-paper p-4 text-sm leading-relaxed">{prompt.model}</p>
          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-3">3 formules à réutiliser</h3>
          <ul className="mt-1.5 space-y-1 text-sm text-accent">
            {prompt.frames.map((f) => (
              <li key={f}>« {f} »</li>
            ))}
          </ul>
        </Card>

        <div className="flex justify-center gap-3">
          {result.flags.includes("sudden-jump") ? (
            <Btn onClick={() => { setResult(null); setText(""); setSecondsLeft(prompt.minutes * 60); setStarted(false); startRef.current = null; }}>
              Réécrire avec mes mots
            </Btn>
          ) : (
            <Btn href="/writing">Autre sujet</Btn>
          )}
          <Btn href="/today" variant="ghost">Retour à l&apos;accueil</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/writing" className="text-xs text-ink-3 hover:text-accent">← Atelier d&apos;écriture</Link>
          <h1 className="font-display text-xl font-semibold">{prompt.title}</h1>
          <Badge tone={prompt.exam === "TEF" ? "accent" : "gold"}>{prompt.exam} · {prompt.task} · {prompt.minutes} min</Badge>
        </div>
        <div className={`rounded-lg border px-4 py-2 text-center ${secondsLeft < 300 && started ? "border-warn bg-warn-soft" : "border-line bg-white"}`}>
          <div className="font-display text-2xl font-semibold tabular-nums">{mm}:{ss}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-3">chrono officiel</div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Prompt pane */}
        <Card className="lg:sticky lg:top-4 lg:self-start">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">Consigne</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{prompt.prompt}</p>
          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-3">Liste de vérification</h3>
          <ul className="mt-1.5 space-y-1 text-sm text-ink-2">
            {prompt.checklist.map((c) => (
              <li key={c} className="flex gap-2"><span className="text-accent">☐</span>{c}</li>
            ))}
          </ul>
        </Card>

        {/* Editor pane */}
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => {
              if (!started) {
                setStarted(true);
                startRef.current = nowMs();
              }
              setText(e.target.value);
            }}
            onPaste={(e) => {
              // exam conditions: no pasting
              e.preventDefault();
            }}
            placeholder="Écrivez ici — le chrono démarre à la première lettre. Le collage est désactivé : conditions d'examen."
            className="h-80 w-full resize-y rounded-xl border border-line bg-white p-4 text-sm leading-relaxed focus:border-accent lg:h-[26rem]"
            aria-label="Zone de rédaction"
          />
          <div className="flex items-center justify-between">
            <span className={`font-display text-sm font-semibold tabular-nums ${words >= prompt.minWords ? "text-ok" : "text-warn"}`}>
              {words} mot{words > 1 ? "s" : ""} <span className="font-sans text-xs font-normal text-ink-3">/ minimum officiel {prompt.minWords}</span>
            </span>
            <Btn onClick={submit} disabled={words < 20}>
              Soumettre à la grille
            </Btn>
          </div>
          {words > 0 && words < prompt.minWords && (
            <p className="text-xs text-warn">Sous le minimum officiel : la session ne comptera pour la chaîne qu&apos;à partir de {prompt.minWords} mots.</p>
          )}
        </div>
      </div>
    </div>
  );
}
