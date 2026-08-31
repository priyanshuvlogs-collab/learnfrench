"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { LISTENING_ITEMS, ListeningItem } from "@/content/listening";
import { READING_ITEMS, ReadingItem } from "@/content/reading";
import { scoreToNCLC } from "@/lib/nclc";
import { nowMs, todayKey } from "@/lib/dates";
import { L, useLang } from "@/lib/i18n";
import { EN } from "@/content/translations";
import { Badge, Btn, Card } from "@/components/ui";

type Stage = "breathe" | "run" | "review";

export default function MockRunPage() {
  return (
    <Suspense fallback={null}>
      <MockRun />
    </Suspense>
  );
}

function MockRun() {
  const params = useSearchParams();
  const skill = (params.get("skill") === "reading" ? "reading" : "listening") as "listening" | "reading";
  const n = Math.min(Number(params.get("n") ?? 8) || 8, 20);
  const min = Number(params.get("min") ?? 10) || 10;

  const recordSession = useApp((s) => s.recordSession);
  const addSkillScore = useApp((s) => s.addSkillScore);
  const addMock = useApp((s) => s.addMock);
  const addMemory = useApp((s) => s.addMemory);
  const profile = useApp((s) => s.profile)!;

  const items = useMemo(() => {
    const bank = skill === "listening" ? [...LISTENING_ITEMS] : [...READING_ITEMS];
    // deterministic-ish shuffle by day so a retake differs across days
    const seed = todayKey().split("-").reduce((a, b) => a + Number(b), 0);
    return bank
      .map((it, i) => ({ it, k: (i * 31 + seed * 17) % bank.length }))
      .sort((a, b) => a.k - b.k)
      .slice(0, n)
      .map((x) => x.it);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lang = useLang();
  const [stage, setStage] = useState<Stage>("breathe");
  const [breatheLeft, setBreatheLeft] = useState(30);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<{ picked: number; seconds: number }[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(min * 60);
  const [played, setPlayed] = useState(false);
  const qStartRef = useRef(nowMs());
  const recordedRef = useRef(false);

  // breathing countdown
  useEffect(() => {
    if (stage !== "breathe" || breatheLeft <= 0) return;
    const t = setTimeout(() => setBreatheLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, breatheLeft]);

  const finish = useCallback(
    (finalAnswers: { picked: number; seconds: number }[]) => {
      if (recordedRef.current) return;
      recordedRef.current = true;
      const correct = finalAnswers.filter((a, i) => items[i] && a.picked === items[i].answer).length;
      const pct = Math.round((correct / items.length) * 100);
      const spent = Math.max(1, Math.round((min * 60 - secondsLeft) / 60));
      recordSession({ skill, minutes: Math.min(spent, min), type: "mock", score: pct, items: items.length });
      addSkillScore(skill, pct);
      addMock({
        id: `${nowMs()}`,
        date: todayKey(),
        skill,
        exam: profile.exam,
        correct,
        total: items.length,
        seconds: min * 60 - secondsLeft,
        answers: finalAnswers.map((a, i) => ({ itemId: items[i].id, picked: a.picked, correct: a.picked === items[i].answer, seconds: a.seconds })),
      });
      addMemory(`Blanc ${skill === "listening" ? "CO" : "CE"} : ${correct}/${items.length}.`);
      setStage("review");
    },
    [items, min, secondsLeft, skill, profile.exam, recordSession, addSkillScore, addMock, addMemory]
  );

  // global countdown
  useEffect(() => {
    if (stage !== "run") return;
    if (secondsLeft <= 0) {
      finish(answers);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, secondsLeft, answers, finish]);

  const item = items[idx];
  const listening = skill === "listening";

  const speak = useCallback(() => {
    if (played || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance((item as ListeningItem).transcript);
    u.lang = "fr-FR";
    u.rate = 0.95;
    setPlayed(true);
    window.speechSynthesis.speak(u);
  }, [item, played]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function pick(i: number) {
    const seconds = Math.round((nowMs() - qStartRef.current) / 1000);
    const next = [...answers, { picked: i, seconds }];
    setAnswers(next);
    if (idx + 1 >= items.length) {
      finish(next);
    } else {
      setIdx(idx + 1);
      setPlayed(false);
      qStartRef.current = nowMs();
    }
  }

  if (stage === "breathe") {
    const phase = Math.floor(((30 - breatheLeft) % 16) / 4); // 4-4-4-4 box
    const phaseLabel = lang === "fr"
      ? ["Inspirez", "Retenez", "Expirez", "Retenez"][phase]
      : ["Breathe in", "Hold", "Breathe out", "Hold"][phase];
    return (
      <div className="mx-auto max-w-md space-y-6 py-10 text-center">
        <Badge tone="accent">{L(lang, "Protocole d'avant-épreuve", "Pre-exam protocol")}</Badge>
        <h1 className="font-display text-2xl font-semibold">{L(lang, "30 secondes de respiration en carré", "30 seconds of box breathing")}</h1>
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl border-4 border-accent bg-accent-soft">
          <div className="text-center">
            <div className="font-display text-3xl font-semibold">{breatheLeft}</div>
            <div className="text-sm text-accent">{phaseLabel}</div>
          </div>
        </div>
        {listening && (
          <p className="text-sm font-semibold text-ink">
            {L(lang,
              "« L'audio passe une fois. C'est la règle. On entraîne cette règle. »",
              "“The audio plays once. That is the rule. We train that rule.”")}
          </p>
        )}
        <p className="text-sm text-ink-2">
          {L(lang,
            `Chrono strict : ${min} minutes pour ${items.length} questions. Une réponse engagée vaut mieux qu'une hésitation parfaite.`,
            `Strict clock: ${min} minutes for ${items.length} questions. A committed answer beats a perfect hesitation.`)}
        </p>
        <Btn onClick={() => { setStage("run"); qStartRef.current = nowMs(); }} disabled={breatheLeft > 0}>
          {breatheLeft > 0 ? L(lang, `Respirez… (${breatheLeft})`, `Breathe… (${breatheLeft})`) : L(lang, "Commencer l'épreuve", "Start the section")}
        </Btn>
      </div>
    );
  }

  if (stage === "review") {
    const correct = answers.filter((a, i) => items[i] && a.picked === items[i].answer).length;
    const pct = Math.round((correct / items.length) * 100);
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <header className="text-center">
          <Badge tone="accent">{L(lang, "Revue du blanc", "Mock review")}</Badge>
          <h1 className="mt-2 font-display text-3xl font-semibold">{correct} / {items.length}</h1>
          <p className="text-sm text-ink-2">
            {L(lang,
              `~NCLC ${Math.floor(scoreToNCLC(pct))} sur cette section (estimation pédagogique).`,
              `~NCLC ${Math.floor(scoreToNCLC(pct))} on this section (pedagogical estimate).`)}
          </p>
          <p className="mt-2 text-sm font-semibold text-accent">
            {L(lang, "Ceci est une donnée pour le prochain bloc — pas un verdict sur vous.", "This is data for the next block — not a verdict on you.")}
          </p>
        </header>
        <div className="space-y-3">
          {items.map((it, i) => {
            const a = answers[i];
            const ok = a && a.picked === it.answer;
            return (
              <Card key={it.id} className={ok ? "border-ok/30" : "border-warn/30"}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{i + 1}. {it.question}</p>
                  <span className="shrink-0 text-xs text-ink-3">{a ? `${a.seconds}s` : "—"}</span>
                </div>
                {"passage" in it && <p className="mt-2 rounded bg-paper p-3 text-xs leading-relaxed text-ink-2">🇫🇷 {(it as ReadingItem).passage}</p>}
                {"transcript" in it && <p className="mt-2 rounded bg-paper p-3 text-xs leading-relaxed text-ink-2">🎧 🇫🇷 {(it as ListeningItem).transcript}</p>}
                {EN[it.id] && <p className="mt-1.5 rounded bg-paper p-3 text-xs italic leading-relaxed text-ink-3">🇬🇧 {EN[it.id]}</p>}
                <div className="mt-2 space-y-1 text-sm">
                  <p className={ok ? "text-ok" : "text-warn"}>
                    {L(lang, "Votre réponse :", "Your answer:")} {a ? it.options[a.picked] : L(lang, "aucune", "none")} {ok ? "✓" : "✗"}
                  </p>
                  {!ok && <p className="text-ok">{L(lang, "Bonne réponse :", "Correct answer:")} {it.options[it.answer]}</p>}
                  <p className="text-xs text-ink-2">
                    <strong>{L(lang, "Pourquoi les autres tombent :", "Why others fall for it:")}</strong> {"trap" in it ? (it as ListeningItem).trap : (it as ReadingItem).explanation}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="flex justify-center gap-3 pb-6">
          <Btn href="/mocks">{L(lang, "Autres blancs", "More mocks")}</Btn>
          <Btn href="/today" variant="ghost">{L(lang, "Retour à l'accueil", "Back to Today")}</Btn>
        </div>
      </div>
    );
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header className="flex items-center justify-between">
        <span className="font-display text-sm text-ink-3">{L(lang, "Question", "Question")} {idx + 1} / {items.length}</span>
        <div className={`rounded-lg border px-3 py-1.5 font-display text-lg font-semibold tabular-nums ${secondsLeft < 60 ? "border-warn bg-warn-soft text-warn" : "border-line bg-white"}`}>
          {mm}:{ss}
        </div>
      </header>

      {listening ? (
        <Card>
          <p className="text-sm font-semibold">{item.question}</p>
          <button
            onClick={speak}
            disabled={played}
            className={`mt-3 rounded-lg px-5 py-2.5 text-sm font-semibold ${played ? "bg-paper-2 text-ink-3" : "bg-accent text-white hover:bg-accent-2"}`}
          >
            {played ? L(lang, "Audio joué — une seule écoute", "Audio played — one listen only") : L(lang, "▶ Jouer l'audio (une fois)", "▶ Play the audio (once)")}
          </button>
        </Card>
      ) : (
        <Card>
          <p className="text-sm font-semibold">{item.question}</p>
          <p className="mt-3 rounded-lg bg-paper p-4 text-sm leading-relaxed">{(item as ReadingItem).passage}</p>
        </Card>
      )}

      <div className="space-y-2">
        {item.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            disabled={listening && !played}
            className={`w-full rounded-lg border-2 border-line bg-white px-4 py-3 text-left text-sm hover:border-accent disabled:opacity-50 ${listening && !played ? "cursor-not-allowed" : ""}`}
          >
            <span className="mr-2 font-display font-semibold text-ink-3">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-ink-3">{L(lang, "Pas de retour en arrière — comme à l'examen.", "No going back — just like the exam.")}</p>
    </div>
  );
}
