import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Kicker } from "@/components/ui";

export const metadata = { title: "Method — Lumen Français" };

const SECTIONS: { k: string; t: string; d: string }[] = [
  {
    k: "1 · Identity, not willpower",
    t: "You are a candidate, not a 'learner'",
    d: "From sign-up, the app addresses you as a candidate: “You are preparing TEF Canada for NCLC 7 before 12 December.” Daily tasks match that identity — a 20-minute exam block, not a game. Motivation fluctuates; identity holds.",
  },
  {
    k: "2 · Implementation intentions",
    t: "When [time] + [place], I do [one block]",
    d: "Every session starts from a pre-committed plan: “Tonight after dinner, 20 minutes of listening.” You edit it once; the coach reminds you in that frame. Research is clear: a situated intention roughly doubles follow-through versus “I’ll study more.”",
  },
  {
    k: "3 · Tiny opening habit",
    t: "Five focused minutes keep the streak",
    d: "The streak is earned by a 5-minute viable session — 10 frequent verbs or a speaking warm-up — never by a full mock. On tired evenings, the “protect the streak” protocol is one tap away.",
  },
  {
    k: "4 · Streaks without fear",
    t: "Two freezes a month, explained on day 1",
    d: "The streak counts calendar days with at least one qualifying session. Two freezes a month are used automatically if you miss one day after a 7+ streak. A broken streak shows a sober state and one button: Resume — 8 minutes on yesterday’s weakest skill, no lecture.",
  },
  {
    k: "5 · Progress that does not lie",
    t: "Never a fake “72% overall”",
    d: "Three layers always visible: today’s ring (minutes done / planned), four skill bars converted to estimated NCLC with confidence, and readiness = the minimum of the four. IRCC does not average; neither do we.",
  },
  {
    k: "6 · Concrete reward",
    t: "A precise win, not confetti",
    d: "After each session: one concrete gain (“you used cependant correctly in task B”) and the next micro-goal. Each week, a short coach letter on what changed.",
  },
  {
    k: "7 · Anti-anxiety protocol",
    t: "The exam is a nervous skill too",
    d: "Before every timed mock: 30 seconds of box breathing, and the reminder — “the audio plays once; that is the rule, we train it.” After: the score is data for the next block, not a verdict on you.",
  },
  {
    k: "8 · Interleaving + spaced retrieval",
    t: "No single-skill cramming",
    d: "The planner mixes skills — never 7 days of listening alone, unless the exam is under two weeks away and only one skill is below target. A light SM-2 system keeps connectors, exam templates, and sound traps alive.",
  },
  {
    k: "9 · Peak-end rule",
    t: "Finish on a success",
    d: "Every session closes on a short win: three sentences you can say, or a 20-second spoken clip better than last week’s. The brain remembers the ending; we take care of it.",
  },
];

export default function MethodPage() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">
        <header className="border-b border-line bg-white">
          <div className="mx-auto max-w-3xl px-5 py-14">
            <Kicker>Method &amp; psychology</Kicker>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Built for your nervous system, not for a hobby learner
            </h1>
            <p className="mt-4 text-ink-2">
              You work, you are tired, the stake is an immigration file. You study hard, then disappear for ten days.
              These nine mechanisms are built into the product — not blog posts.
            </p>
          </div>
        </header>
        <section className="mx-auto max-w-3xl space-y-6 px-5 py-12">
          {SECTIONS.map((s) => (
            <article key={s.k} className="rounded-xl border border-line bg-white p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-gold">{s.k}</div>
              <h2 className="mt-1 font-display text-xl font-semibold">{s.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.d}</p>
            </article>
          ))}
          <div className="rounded-xl bg-accent-soft p-6 text-sm leading-relaxed text-accent">
            And what we refuse to build: social leaderboards that humiliate, streak-shaming (“don’t lose your
            series!!”), fake promises of “CLB 7 guaranteed in 30 days”, and anything that looks like an official
            score when it is not one.
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
