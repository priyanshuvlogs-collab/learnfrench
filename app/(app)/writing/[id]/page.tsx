"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WRITING_PROMPTS } from "@/content/writing-prompts";
import { useApp, historyLexicalDensity } from "@/lib/store";
import { countWords, scoreWriting, WritingResult } from "@/lib/scoring";
import { nowMs, todayKey } from "@/lib/dates";
import { L, useLang } from "@/lib/i18n";
import { EN } from "@/content/translations";
import { Badge, Btn, Card } from "@/components/ui";

const RUBRIC_LABELS: [keyof WritingResult["rubric"], { fr: string; en: string }][] = [
  ["task", { fr: "Respect de la consigne", en: "Task completion" }],
  ["coherence", { fr: "Cohérence / structure", en: "Coherence / structure" }],
  ["lexicon", { fr: "Étendue du vocabulaire", en: "Range of vocabulary" }],
  ["grammar", { fr: "Contrôle grammatical", en: "Grammatical control" }],
  ["register", { fr: "Registre", en: "Register" }],
];

export default function WritingLabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const prompt = WRITING_PROMPTS.find((p) => p.id === id);
  if (!prompt) notFound();
  return <Lab promptId={id} />;
}

function Lab({ promptId }: { promptId: string }) {
  const prompt = WRITING_PROMPTS.find((p) => p.id === promptId)!;
  const lang = useLang();
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
          <Badge tone={result.flags.includes("sudden-jump") ? "warn" : "ok"}>
            {L(lang, "Copie évaluée — grille d'examinateur", "Marked — examiner rubric")}
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-semibold">~NCLC {result.estNCLC}</h1>
          <p className="text-xs text-ink-3">{L(lang, "Estimation pédagogique — pas un résultat officiel.", "Pedagogical estimate — not an official result.")}</p>
        </header>

        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">{L(lang, "Les 5 dimensions", "The 5 dimensions")}</h2>
          <div className="mt-3 space-y-2.5">
            {RUBRIC_LABELS.map(([k, label]) => (
              <div key={k}>
                <div className="flex justify-between text-sm">
                  <span>{label[lang]}</span>
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
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">{L(lang, "À corriger en priorité", "Fix these first")}</h2>
            <ul className="mt-2 space-y-2 text-sm text-ink-2">
              {result.feedback.map((f, i) => (
                <li key={i} className="flex gap-2"><span className="text-warn">•</span>{f}</li>
              ))}
            </ul>
          </Card>
        )}

        <Card className="border-gold/30 bg-gold-soft/40">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">{L(lang, "Votre victoire", "Your win")}</div>
          <p className="mt-1 text-sm text-ink-2">{result.win}</p>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">
            {L(lang, `Paragraphe modèle (cible NCLC ${profile.targetNCLC})`, `Model paragraph (target NCLC ${profile.targetNCLC})`)}
          </h2>
          <p className="mt-2 whitespace-pre-line rounded-lg bg-paper p-4 text-sm leading-relaxed">{prompt.model}</p>
          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-3">{L(lang, "3 formules à réutiliser", "3 phrases to reuse")}</h3>
          <ul className="mt-1.5 space-y-1 text-sm text-accent">
            {prompt.frames.map((f) => (
              <li key={f}>« {f} »</li>
            ))}
          </ul>
        </Card>

        <div className="flex justify-center gap-3">
          {result.flags.includes("sudden-jump") ? (
            <Btn onClick={() => { setResult(null); setText(""); setSecondsLeft(prompt.minutes * 60); setStarted(false); startRef.current = null; }}>
              {L(lang, "Réécrire avec mes mots", "Rewrite in my own words")}
            </Btn>
          ) : (
            <Btn href="/writing">{L(lang, "Autre sujet", "Another prompt")}</Btn>
          )}
          <Btn href="/today" variant="ghost">{L(lang, "Retour à l'accueil", "Back to Today")}</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/writing" className="text-xs text-ink-3 hover:text-accent">← {L(lang, "Atelier d'écriture", "Writing lab")}</Link>
          <h1 className="font-display text-xl font-semibold">{prompt.title}</h1>
          <Badge tone={prompt.exam === "TEF" ? "accent" : "gold"}>{prompt.exam} · {prompt.task} · {prompt.minutes} min</Badge>
        </div>
        <div className={`rounded-lg border px-4 py-2 text-center ${secondsLeft < 300 && started ? "border-warn bg-warn-soft" : "border-line bg-white"}`}>
          <div className="font-display text-2xl font-semibold tabular-nums">{mm}:{ss}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-3">{L(lang, "chrono officiel", "official clock")}</div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Prompt pane — French first, English available */}
        <Card className="lg:sticky lg:top-4 lg:self-start">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">{L(lang, "Consigne", "Prompt (in French — that's the training)")}</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">🇫🇷 {prompt.prompt}</p>
          {EN[prompt.id] && (
            <details className="mt-2" open={lang === "en"}>
              <summary className="cursor-pointer text-xs font-semibold text-ink-3 hover:text-accent">
                {L(lang, "Traduction anglaise de la consigne", "English translation of the prompt")}
              </summary>
              <p className="mt-1.5 whitespace-pre-line text-sm italic leading-relaxed text-ink-2">🇬🇧 {EN[prompt.id]}</p>
            </details>
          )}
          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-3">{L(lang, "Liste de vérification", "Checklist (French — exam language)")}</h3>
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
            placeholder={L(lang,
              "Écrivez ici, en français — le chrono démarre à la première lettre. Le collage est désactivé : conditions d'examen.",
              "Write here, in French — the clock starts at your first letter. Pasting is disabled: exam conditions.")}
            className="h-80 w-full resize-y rounded-xl border border-line bg-white p-4 text-sm leading-relaxed focus:border-accent lg:h-[26rem]"
            aria-label={L(lang, "Zone de rédaction", "Writing area")}
          />
          <div className="flex items-center justify-between">
            <span className={`font-display text-sm font-semibold tabular-nums ${words >= prompt.minWords ? "text-ok" : "text-warn"}`}>
              {words} {L(lang, `mot${words > 1 ? "s" : ""}`, `word${words === 1 ? "" : "s"}`)}{" "}
              <span className="font-sans text-xs font-normal text-ink-3">/ {L(lang, "minimum officiel", "official minimum")} {prompt.minWords}</span>
            </span>
            <Btn onClick={submit} disabled={words < 20}>
              {L(lang, "Soumettre à la grille", "Submit to the rubric")}
            </Btn>
          </div>
          {words > 0 && words < prompt.minWords && (
            <p className="text-xs text-warn">
              {L(lang,
                `Sous le minimum officiel : la session ne comptera pour la chaîne qu'à partir de ${prompt.minWords} mots.`,
                `Below the official minimum: the session only counts toward the streak from ${prompt.minWords} words.`)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
