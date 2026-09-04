import Link from "next/link";
import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Badge, Kicker } from "@/components/ui";

export default function Landing() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">
        <header className="border-b border-line bg-white">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
            <Badge tone="ink">TEF Canada · TCF Canada · Francophone immigration</Badge>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              An English-language coach that trains you in <span className="text-accent">real French</span> — for the NCLC you actually need.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-ink-2">
              IRCC looks at four skills. Your official level is <strong>the lowest of the four</strong> — not an average.
              Every session, every streak day, every coach message exists to raise the skill that is holding you back.
            </p>
            <p className="mt-2 max-w-2xl text-sm text-ink-3">
              The interface is in English. Listening clips, dictations, conjugations, and exam prompts are in French — the language of the test.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signin"
                className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-2"
              >
                Get started — 3-minute setup
              </Link>
              <Link
                href="/method"
                className="rounded-lg border border-line bg-white px-6 py-3 font-semibold text-ink hover:border-accent hover:text-accent"
              >
                Read the method
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-5 py-14">
          <Kicker>The principle</Kicker>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            “Your official score is your weakest skill.”
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                t: "Prep is an identity",
                d: "From sign-up, you are not 'learning French for fun'. You are a TEF or TCF candidate with an NCLC target and a date. Every 20-minute block is an exam block.",
              },
              {
                t: "Four bars, never an average",
                d: "Listening, reading, writing, speaking: four separate NCLC estimates, each with a confidence level. The shortest bar is highlighted — that is what the exam looks at, and what we train today.",
              },
              {
                t: "Streaks without shame",
                d: "Five focused minutes keep the streak. Two freezes a month, used automatically. A broken streak shows one button: Resume. Never a red shame screen.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-line bg-white p-6">
                <h3 className="font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-line bg-white">
          <div className="mx-auto max-w-5xl px-5 py-14">
            <Kicker>Choose your exam</Kicker>
            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">TEF Canada or TCF Canada?</h2>
            <p className="mt-3 max-w-2xl text-ink-2">
              Both are accepted by IRCC. The choice is about <strong>format</strong> and{" "}
              <strong>test-centre dates</strong> — not a myth that one test is easier.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-line p-6">
                <h3 className="font-display text-xl font-semibold text-accent">TEF Canada</h3>
                <ul className="mt-4 space-y-2 text-sm text-ink-2">
                  <li>• Listening: ~40 min, ~40 MCQ, audio usually once</li>
                  <li>• Reading: 60 min, ~40 MCQ</li>
                  <li>• Writing: 60 min, 2 tasks — A: ~25 min, 80+ words · B: ~35 min, 200+ words</li>
                  <li>• Speaking: ~15 min, 2 tasks — information + argument</li>
                  <li>• All 4 papers the same day · typically valid 2 years</li>
                </ul>
                <p className="mt-4 text-sm text-ink-2">
                  <strong>Best fit:</strong> comfortable with a formal letter and a long development.
                </p>
              </div>
              <div className="rounded-xl border border-line p-6">
                <h3 className="font-display text-xl font-semibold text-accent">TCF Canada</h3>
                <ul className="mt-4 space-y-2 text-sm text-ink-2">
                  <li>• Listening: ~35 min, 39 MCQ, audio once</li>
                  <li>• Reading: 60 min, 39 MCQ</li>
                  <li>• Writing: 60 min, 3 short progressive tasks</li>
                  <li>• Speaking: ~12 min, 3 tasks</li>
                  <li>• All 4 papers together, not separable · typically valid 2 years</li>
                </ul>
                <p className="mt-4 text-sm text-ink-2">
                  <strong>Best fit:</strong> comfortable with short tasks that change quickly.
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-ink-3">
              Typical structures used in our drills — always check the official notice for your session.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-14">
          <Kicker>The targets that matter</Kicker>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">NCLC 5, 7, or 8–9: three different strategies</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-white p-6">
              <div className="font-display text-3xl font-semibold text-accent">NCLC 5</div>
              <p className="mt-2 text-sm text-ink-2">
                A common floor for some programmes and for second-official-language points. Goal: regularity and solid basics.
              </p>
            </div>
            <div className="rounded-xl border-2 border-accent bg-white p-6">
              <div className="font-display text-3xl font-semibold text-accent">NCLC 7 × 4</div>
              <p className="mt-2 text-sm text-ink-2">
                The serious Express Entry / francophone-category target: NCLC 7 <strong>in all four skills</strong>. One skill at 6, and the profile drops.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <div className="font-display text-3xl font-semibold text-gold">NCLC 8–9</div>
              <p className="mt-2 text-sm text-ink-2">
                The safety margin: aim above the threshold so one bad exam day does not decide your file.
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-xl bg-accent-soft p-6 text-sm leading-relaxed text-accent">
            <strong>Transparency:</strong> Lumen shows pedagogical estimates, never an “official TEF score”. The
            score → NCLC tables in the app come from IRCC, with a last-verified date and a direct link to canada.ca.
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
