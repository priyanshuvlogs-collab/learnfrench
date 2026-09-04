"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SPEAKING_PROMPTS } from "@/content/speaking-prompts";
import { useApp } from "@/lib/store";
import { scoreSpeaking, SpeakingResult } from "@/lib/scoring";
import { nowMs, todayKey } from "@/lib/dates";
import { Badge, Btn, Card } from "@/components/ui";

const RUBRIC_LABELS: [keyof SpeakingResult["rubric"], string][] = [
  ["task", "Task fulfilment"],
  ["coherence", "Coherence / structure"],
  ["lexicon", "Lexical range"],
  ["grammar", "Grammatical control"],
  ["register", "Fluency / intelligibility"],
];

type Stage = "brief" | "prep" | "record" | "transcript" | "result";

export default function SpeakingLabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const prompt = SPEAKING_PROMPTS.find((p) => p.id === id);
  if (!prompt) notFound();
  return <Lab promptId={id} />;
}

function Lab({ promptId }: { promptId: string }) {
  const prompt = SPEAKING_PROMPTS.find((p) => p.id === promptId)!;
  const addSpeaking = useApp((s) => s.addSpeaking);
  const recordSession = useApp((s) => s.recordSession);
  const addSkillScore = useApp((s) => s.addSkillScore);
  const addMemory = useApp((s) => s.addMemory);
  const prevBest = useApp((s) => s.speakingSubs.filter((x) => x.promptId === promptId));

  const [stage, setStage] = useState<Stage>("brief");
  const [prepLeft, setPrepLeft] = useState(prompt.prepSeconds);
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [srAvailable, setSrAvailable] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [micError, setMicError] = useState("");
  const [take, setTake] = useState(1);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recogRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const secondsRef = useRef(0);

  // prep countdown — the transition happens inside the timer callback
  useEffect(() => {
    if (stage !== "prep") return;
    const t = setTimeout(() => {
      if (prepLeft <= 1) setStage("record");
      setPrepLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearTimeout(t);
  }, [stage, prepLeft]);

  // recording timer
  useEffect(() => {
    if (stage !== "record" || !mediaRef.current) return;
    const t = setInterval(() => {
      setElapsed((s) => {
        secondsRef.current = s + 1;
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stage, audioUrl]);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    recogRef.current?.stop?.();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  async function startRecording() {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        setAudioUrl(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })));
      };
      rec.start();
      mediaRef.current = rec;

      // level meter
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        setLevel(data.reduce((a, b) => a + b, 0) / data.length / 255);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      // speech recognition (fr-FR) when available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        setSrAvailable(true);
        const recog = new SR();
        recog.lang = "fr-FR";
        recog.continuous = true;
        recog.interimResults = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recog.onresult = (e: any) => {
          let text = "";
          for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + " ";
          setTranscript(text.trim());
        };
        recog.start();
        recogRef.current = recog;
      }
      setElapsed(0);
      secondsRef.current = 0;
      setStage("record");
    } catch {
      setMicError("Microphone unavailable. Allow access, or continue — you can type what you said.");
      setStage("record");
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
    mediaRef.current = null;
    cleanup();
    setLevel(0);
    setStage("transcript");
  }

  function submit() {
    const seconds = Math.max(secondsRef.current, 1);
    const r = scoreSpeaking(transcript, seconds, prompt.speakSeconds);
    setResult(r);
    addSpeaking({
      id: `${nowMs()}`,
      promptId: prompt.id,
      date: todayKey(),
      transcript,
      seconds,
      rubric: r.rubric,
      score: r.score,
      estNCLC: r.estNCLC,
      feedback: r.feedback,
      win: r.win,
    });
    recordSession({
      skill: "speaking",
      minutes: Math.max(1, Math.round(seconds / 60) + (prompt.prepSeconds > 0 ? 1 : 0)),
      type: "speaking",
      score: r.score,
      items: 1,
      qualifying: seconds >= 30,
    });
    addSkillScore("speaking", r.score);
    addMemory(`Speaking ${prompt.exam} ${prompt.task}: ${seconds}s, ~NCLC ${r.estNCLC} (take ${take}).`);
    setStage("result");
  }

  function secondTake() {
    setTake((t) => t + 1);
    setResult(null);
    setTranscript("");
    setAudioUrl(null);
    setElapsed(0);
    setPrepLeft(0);
    setStage("brief");
  }

  const overTime = elapsed >= prompt.speakSeconds;
  const bestBefore = prevBest.length ? Math.max(...prevBest.map((s) => s.score)) : null;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header>
        <Link href="/speaking" className="text-xs text-ink-3 hover:text-accent">← Speaking studio</Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <h1 className="font-display text-xl font-semibold">{prompt.title}</h1>
          <Badge tone={prompt.exam === "TEF" ? "accent" : "gold"}>{prompt.exam} {prompt.task}</Badge>
        </div>
      </header>

      <Card>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">Brief (French)</h2>
        <p className="mt-2 text-sm leading-relaxed">{prompt.prompt}</p>
        <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-3">Expected structure</h3>
        <ol className="mt-1.5 space-y-1 text-sm text-ink-2">
          {prompt.structure.map((st, i) => (
            <li key={st}><span className="font-display font-semibold text-accent">{i + 1}.</span> {st}</li>
          ))}
        </ol>
      </Card>

      {stage === "brief" && (
        <div className="space-y-3 text-center">
          {take > 1 && (
            <p className="text-sm text-gold">Take {take} — “say it again, better”. Beat your last try.</p>
          )}
          <p className="text-sm text-ink-2">
            {prompt.prepSeconds > 0
              ? `${prompt.prepSeconds} seconds of prep, then ${prompt.speakSeconds} seconds of speech.`
              : `No prep, as in the exam: ${prompt.speakSeconds} seconds of speech.`}
          </p>
          <Btn onClick={() => (prompt.prepSeconds > 0 && take === 1 ? (setPrepLeft(prompt.prepSeconds), setStage("prep")) : startRecording())}>
            {prompt.prepSeconds > 0 && take === 1 ? "Start prep" : "Record"}
          </Btn>
        </div>
      )}

      {stage === "prep" && (
        <Card className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-3">Prep — jot 3 keywords, not sentences</div>
          <div className="font-display mt-2 text-5xl font-semibold tabular-nums">{prepLeft}</div>
          <Btn onClick={startRecording} variant="ghost" className="mt-4">Ready early → record</Btn>
        </Card>
      )}

      {stage === "record" && (
        <Card className="text-center">
          {micError ? (
            <>
              <p className="text-sm text-warn">{micError}</p>
              <Btn onClick={() => setStage("transcript")} className="mt-3">Continue without mic</Btn>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3">
                <span className={`h-3 w-3 rounded-full ${overTime ? "bg-warn" : "bg-ok"} animate-pulse`} aria-hidden />
                <span className="font-display text-4xl font-semibold tabular-nums">
                  {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
                </span>
                <span className="text-sm text-ink-3">/ {Math.floor(prompt.speakSeconds / 60)}:{String(prompt.speakSeconds % 60).padStart(2, "0")}</span>
              </div>
              {/* level meter */}
              <div className="mx-auto mt-4 flex h-10 max-w-xs items-end justify-center gap-1" aria-hidden>
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-accent transition-all duration-75"
                    style={{ height: `${Math.max(8, level * 100 * (0.6 + 0.4 * Math.sin(i * 1.7 + elapsed)))}%`, opacity: 0.4 + level }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-ink-3">
                {overTime ? "Time’s up — close cleanly (« En un mot… »)." : "Silence creeping in? « Alors… en fait… ce que je veux dire, c'est que… »"}
              </p>
              <Btn onClick={stopRecording} className="mt-4" disabled={elapsed < 3}>■ Stop recording</Btn>
            </>
          )}
        </Card>
      )}

      {stage === "transcript" && (
        <Card>
          <h2 className="text-sm font-semibold">Transcript</h2>
          {audioUrl && <audio controls src={audioUrl} className="mt-2 w-full" aria-label="Your recording" />}
          <p className="mt-2 text-xs text-ink-3">
            {srAvailable
              ? "Automatic transcript (browser) — correct it if needed; it is used for scoring."
              : "Speech recognition unavailable in this browser: replay and type faithfully what you said (in production: Whisper on the server)."}
          </p>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="mt-3 h-36 w-full rounded-lg border border-line bg-white p-3 text-sm"
            placeholder="What you said, word for word…"
          />
          <Btn onClick={submit} disabled={transcript.trim().split(/\s+/).length < 5} className="mt-3 w-full">
            Score on the 5 dimensions
          </Btn>
        </Card>
      )}

      {stage === "result" && result && (
        <div className="space-y-4">
          <header className="text-center">
            <Badge tone="ok">Take {take} scored</Badge>
            <h2 className="mt-2 font-display text-3xl font-semibold">~NCLC {result.estNCLC}</h2>
            {bestBefore !== null && take > 1 && (
              <p className="text-sm text-ink-2">
                {result.score > bestBefore ? "Better than the previous take — that is the exercise." : "Not above the previous one yet. A faster opening sentence, and it lands."}
              </p>
            )}
            <p className="text-xs text-ink-3">Pedagogical estimate.</p>
          </header>
          <Card>
            <div className="space-y-2.5">
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
              <ul className="space-y-2 text-sm text-ink-2">
                {result.feedback.map((f, i) => (
                  <li key={i} className="flex gap-2"><span className="text-warn">•</span>{f}</li>
                ))}
              </ul>
            </Card>
          )}
          <Card className="border-gold/30 bg-gold-soft/40">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold">Your win</div>
            <p className="mt-1 text-sm text-ink-2">{result.win}</p>
          </Card>
          <div className="flex justify-center gap-3">
            <Btn onClick={secondTake}>Say it again, better</Btn>
            <Btn href="/today" variant="ghost">Done</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
