"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { SKILL_LABELS } from "@/lib/types";
import { LISTENING_ITEMS, ListeningItem } from "@/content/listening";
import { READING_ITEMS, ReadingItem } from "@/content/reading";
import { Badge, Btn, Card } from "@/components/ui";
import { scoreToNCLC } from "@/lib/nclc";
import { nowMs } from "@/lib/dates";

const PER_SESSION = 6;

type AnyItem = ListeningItem | ReadingItem;

function isListening(i: AnyItem): i is ListeningItem {
  return "transcript" in i;
}

/** Rotate through the bank so consecutive sessions see fresh items. */
function pickItems(all: AnyItem[], offset: number): AnyItem[] {
  const start = (offset * PER_SESSION) % all.length;
  return Array.from({ length: PER_SESSION }, (_, i) => all[(start + i) % all.length]);
}

export default function DrillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = use(params);
  if (skill !== "listening" && skill !== "reading") notFound();
  return <Drill skill={skill as "listening" | "reading"} />;
}

function Drill({ skill }: { skill: "listening" | "reading" }) {
  const sessions = useApp((s) => s.sessions);
  const recordSession = useApp((s) => s.recordSession);
  const addSkillScore = useApp((s) => s.addSkillScore);
  const addWeakPattern = useApp((s) => s.addWeakPattern);
  const addMemory = useApp((s) => s.addMemory);

  const priorCount = useMemo(
    () => sessions.filter((s) => s.skill === skill && s.type === "drill").length,
    // freeze at mount so the set doesn't shift mid-session
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const items = useMemo(
    () => pickItems(skill === "listening" ? LISTENING_ITEMS : READING_ITEMS, priorCount),
    [skill, priorCount]
  );

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const startRef = useRef(nowMs());
  const recordedRef = useRef(false);

  const item = items[idx];
  const listening = isListening(item);

  const speak = useCallback(() => {
    if (played || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance((item as ListeningItem).transcript);
    u.lang = "fr-FR";
    u.rate = 0.95;
    const fr = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("fr"));
    if (fr) u.voice = fr;
    u.onend = () => setPlaying(false);
    setPlayed(true);
    setPlaying(true);
    window.speechSynthesis.speak(u);
  }, [item, played]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function answer(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === item.answer) setCorrectCount((c) => c + 1);
    else addWeakPattern(skill, listening ? (item as ListeningItem).kind : (item as ReadingItem).topic);
  }

  function next() {
    if (idx + 1 >= items.length) {
      if (!recordedRef.current) {
        recordedRef.current = true;
        const minutes = Math.max(1, Math.round((nowMs() - startRef.current) / 60000));
        const pct = Math.round((correctCount / items.length) * 100);
        recordSession({ skill, minutes: Math.min(minutes, 30), type: "drill", score: pct, items: items.length });
        addSkillScore(skill, pct);
        addMemory(`${SKILL_LABELS[skill].en}: ${correctCount}/${items.length} (${pct}%).`);
      }
      setFinished(true);
    } else {
      setIdx(idx + 1);
      setPicked(null);
      setPlayed(false);
      setPlaying(false);
    }
  }

  if (finished) {
    const pct = Math.round((correctCount / items.length) * 100);
    return (
      <div className="mx-auto max-w-lg space-y-5 py-8 text-center">
        <Badge tone={pct >= 70 ? "ok" : "accent"}>Session complete</Badge>
        <h1 className="font-display text-3xl font-semibold">{correctCount} / {items.length}</h1>
        <p className="text-sm text-ink-2">
          This session: ~NCLC {Math.floor(scoreToNCLC(pct))} in {SKILL_LABELS[skill].en.toLowerCase()} (pedagogical estimate).
        </p>
        <Card className="text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Today&apos;s win</div>
          <p className="mt-1 text-sm text-ink-2">
            {correctCount > 0
              ? `You beat the traps on ${correctCount} question${correctCount > 1 ? "s" : ""} — including ones where the option that repeats words from the text was false.`
              : "You held the single-listen rule from start to finish. That is the hardest exam skill to install."}
          </p>
          <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink-3">Next micro-goal</div>
          <p className="mt-1 text-sm text-ink-2">
            {pct >= 80 ? "Same drill, but jot the time or key figure while you listen." : "Before each audio: read the question and predict who is speaking and why."}
          </p>
        </Card>
        <div className="flex justify-center gap-3">
          <Btn href="/today">Back to Today</Btn>
          <Btn href="/review" variant="ghost">Spaced review (5 min)</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/skills" className="text-xs text-ink-3 hover:text-accent">← Skills</Link>
          <h1 className="font-display text-xl font-semibold">{SKILL_LABELS[skill].en}</h1>
        </div>
        <span className="font-display text-sm text-ink-3">{idx + 1} / {items.length}</span>
      </header>

      {listening ? (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge tone="ink">{(item as ListeningItem).kind}</Badge>
              <p className="mt-2 text-sm font-semibold">{item.question}</p>
              <p className="mt-1 text-xs text-ink-3">Predict: who is speaking, why? Then listen once — that is the rule. We train it.</p>
            </div>
            <button
              onClick={speak}
              disabled={played}
              className={`shrink-0 rounded-full px-5 py-5 font-semibold ${played ? "bg-paper-2 text-ink-3" : "bg-accent text-white hover:bg-accent-2"}`}
              aria-label={played ? "Audio already played" : "Play the audio (once)"}
            >
              {playing ? "…" : played ? "✓" : "▶"}
            </button>
          </div>
          {played && !playing && picked === null && (
            <p className="mt-3 text-xs text-ink-3">The audio will not replay. Eliminate, then commit an answer.</p>
          )}
        </Card>
      ) : (
        <Card>
          <Badge tone="ink">{(item as ReadingItem).topic}</Badge>
          <p className="mt-2 text-sm font-semibold">{item.question}</p>
          <p className="mt-3 whitespace-pre-line rounded-lg bg-paper p-4 text-sm leading-relaxed text-ink">{(item as ReadingItem).passage}</p>
        </Card>
      )}

      <div className="space-y-2">
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
              onClick={() => answer(i)}
              disabled={picked !== null || (listening && !played)}
              className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm transition-colors disabled:cursor-not-allowed ${cls} ${listening && !played && picked === null ? "opacity-50" : ""}`}
            >
              <span className="mr-2 font-display font-semibold text-ink-3">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <Card className="border-accent/30">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">
            {picked === item.answer ? "Correct — why the others fall" : "The trap, explained"}
          </div>
          <p className="mt-1 text-sm text-ink-2">{listening ? (item as ListeningItem).trap : (item as ReadingItem).explanation}</p>
          {listening && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-ink-3 hover:text-accent">Transcript (accessibility / review)</summary>
              <p className="mt-2 rounded-lg bg-paper p-3 text-sm leading-relaxed text-ink-2">{(item as ListeningItem).transcript}</p>
            </details>
          )}
          <Btn onClick={next} className="mt-4 w-full">
            {idx + 1 >= items.length ? "Finish the session" : "Next question →"}
          </Btn>
        </Card>
      )}
    </div>
  );
}
