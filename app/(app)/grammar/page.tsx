"use client";

import { useMemo, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { GRAMMAR_ITEMS, GRAMMAR_TOPICS, PERSONS } from "@/content/grammar";
import { nowMs } from "@/lib/dates";
import { L, useLang } from "@/lib/i18n";
import { Badge, Btn, Card } from "@/components/ui";

export default function GrammarPage() {
  const lang = useLang();
  const recordSession = useApp((s) => s.recordSession);
  const addMemory = useApp((s) => s.addMemory);
  const [topicId, setTopicId] = useState(GRAMMAR_TOPICS[0].id);
  const [drilling, setDrilling] = useState(false);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const startRef = useRef(0);
  const recordedRef = useRef(false);

  const topic = GRAMMAR_TOPICS.find((t) => t.id === topicId)!;
  const items = useMemo(() => GRAMMAR_ITEMS.filter((i) => i.topicId === topicId), [topicId]);
  const item = items[idx];

  function startDrill() {
    setDrilling(true);
    setIdx(0);
    setPicked(null);
    setCorrect(0);
    setFinished(false);
    recordedRef.current = false;
    startRef.current = nowMs();
  }

  function next() {
    if (idx + 1 >= items.length) {
      if (!recordedRef.current) {
        recordedRef.current = true;
        const minutes = Math.max(1, Math.round((nowMs() - startRef.current) / 60000));
        // grammar is exam fuel for production — logged as writing minutes,
        // but it never feeds the NCLC skill estimate
        recordSession({ skill: "writing", minutes: Math.min(minutes, 15), type: "grammar", items: items.length });
        addMemory(`Grammaire ${topic.title.split("—")[0].trim()} : ${correct}/${items.length}.`);
      }
      setFinished(true);
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  }

  if (drilling && !finished && item) {
    return (
      <div className="mx-auto max-w-xl space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <button onClick={() => setDrilling(false)} className="text-xs text-ink-3 hover:text-accent">← {L(lang, "Grammaire", "Grammar")}</button>
            <h1 className="font-display text-xl font-semibold">{L(lang, topic.title, topic.titleEn)}</h1>
          </div>
          <span className="font-display text-sm text-ink-3">{idx + 1} / {items.length}</span>
        </header>

        <Card>
          <p className="text-base font-semibold leading-relaxed">{item.question}</p>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          {item.options.map((opt, i) => {
            let cls = "border-line bg-white hover:border-accent";
            if (picked !== null) {
              if (i === item.answer) cls = "border-ok bg-ok-soft";
              else if (i === picked) cls = "border-warn bg-warn-soft";
              else cls = "border-line bg-white opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => {
                  if (picked !== null) return;
                  setPicked(i);
                  if (i === item.answer) setCorrect((c) => c + 1);
                }}
                disabled={picked !== null}
                className={`rounded-lg border-2 px-4 py-3 text-center font-display text-base font-semibold transition-colors ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <Card className="border-accent/30">
            <p className="text-sm text-ink-2">🇫🇷 {item.why}</p>
            <p className="mt-1 text-sm italic text-ink-3">🇬🇧 {item.whyEn}</p>
            <Btn onClick={next} className="mt-3 w-full">
              {idx + 1 >= items.length ? L(lang, "Terminer", "Finish") : L(lang, "Suivant →", "Next →")}
            </Btn>
          </Card>
        )}
      </div>
    );
  }

  if (drilling && finished) {
    const pct = Math.round((correct / items.length) * 100);
    return (
      <div className="mx-auto max-w-md space-y-5 py-10 text-center">
        <Badge tone={pct >= 80 ? "ok" : "accent"}>{L(lang, "Drill terminé", "Drill complete")}</Badge>
        <h1 className="font-display text-3xl font-semibold">{correct} / {items.length}</h1>
        <p className="text-sm text-ink-2">
          {pct >= 80
            ? L(lang, "Solide. Réutilisez ces formes tout de suite : 40 mots écrits ou 2 phrases orales avec être et avoir.", "Solid. Reuse these forms right now: 40 written words or 2 spoken sentences with être and avoir.")
            : L(lang, "Les formes viennent avec la répétition — refaites ce drill demain, puis utilisez chaque forme ratée dans une phrase à vous.", "Forms come with repetition — redo this drill tomorrow, then use every missed form in a sentence of your own.")}
        </p>
        <div className="flex justify-center gap-3">
          <Btn href="/writing">{L(lang, "Réutiliser en écriture", "Reuse it in writing")}</Btn>
          <Btn onClick={() => setDrilling(false)} variant="ghost">{L(lang, "Autres verbes", "Other verbs")}</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">{L(lang, "Grammaire de base — être, avoir & Cie", "Basic grammar — être, avoir & co.")}</h1>
        <p className="mt-1 text-sm text-ink-2">
          {L(lang,
            "Pas d'arbre de 200 leçons : les verbes qui portent l'examen, en tableaux et en drills, toujours réutilisés aussitôt dans une production.",
            "No 200-lesson tree: the verbs that carry the exam, as tables and drills, always reused immediately in a production task.")}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {GRAMMAR_TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTopicId(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${t.id === topicId ? "bg-accent text-white" : "border border-line bg-white text-ink-2 hover:border-accent hover:text-accent"}`}
          >
            {L(lang, t.title.split("—")[0].trim(), t.titleEn.split("—")[0].trim())}
          </button>
        ))}
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold">{L(lang, topic.title, topic.titleEn)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{L(lang, topic.fr, topic.en)}</p>

        {topic.tables.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {topic.tables.map((tb) => (
              <div key={tb.tense} className="overflow-hidden rounded-lg border border-line">
                <div className="bg-paper-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-2">
                  {L(lang, tb.tense, tb.tenseEn)}
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {tb.forms.map((f, i) => (
                      <tr key={i} className="border-t border-line">
                        <td className="px-3 py-1.5 text-ink-3">{PERSONS[i]}</td>
                        <td className="font-display px-3 py-1.5 font-semibold">{f}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-ink-3">{items.length} {L(lang, "questions", "questions")}</span>
          <Btn onClick={startDrill}>{L(lang, "Lancer le drill", "Start the drill")}</Btn>
        </div>
      </Card>

      <p className="text-xs text-ink-3">
        {L(lang,
          "Le drill compte dans vos minutes du jour (carburant d'examen), mais ne modifie pas vos estimations NCLC — celles-ci viennent des tâches d'examen notées.",
          "The drill counts toward today's minutes (exam fuel), but never changes your NCLC estimates — those come from scored exam tasks.")}
      </p>
    </div>
  );
}
