import Link from "next/link";
import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Badge, Kicker } from "@/components/ui";

export const metadata = { title: "Pricing — Lumen Français" };

export default function PricingPage() {
  return (
    <>
      <PublicNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-14">
        <Kicker>Pricing</Kicker>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Cheaper than retaking the exam
        </h1>
        <p className="mt-3 max-w-2xl text-ink-2">
          A TEF or TCF sitting costs several hundred dollars — and weeks of waiting if you fail.
          Lumen exists so you only sit it once.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-semibold">Discovery</h2>
            <div className="mt-2 font-display text-3xl font-semibold">$0</div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>• Daily block + streak + freezes</li>
              <li>• 4 skill bars &amp; readiness</li>
              <li>• Listening / reading practice banks</li>
              <li>• Spaced-repetition cards</li>
              <li>• Official IRCC tables</li>
            </ul>
            <Link href="/signin" className="mt-6 inline-block rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent">
              Start free
            </Link>
          </div>
          <div className="relative rounded-xl border-2 border-accent bg-white p-6">
            <span className="absolute -top-3 left-6"><Badge>Recommended</Badge></span>
            <h2 className="font-semibold">Candidate</h2>
            <div className="mt-2 font-display text-3xl font-semibold">$19 <span className="text-base font-normal text-ink-3">/ month</span></div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>• Everything in Discovery, plus:</li>
              <li>• Unlimited coach Camille (examiner grid)</li>
              <li>• Graded writing studio, TEF A/B and TCF timers</li>
              <li>• Speaking studio: record, transcribe, 5 dimensions</li>
              <li>• Section mocks</li>
            </ul>
            <Link href="/signin" className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-2">
              Try 7 days
            </Link>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-semibold">Final stretch</h2>
            <div className="mt-2 font-display text-3xl font-semibold">$49 <span className="text-base font-normal text-ink-3">/ month</span></div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>• Everything in Candidate, plus:</li>
              <li>• Full timed mocks</li>
              <li>• Examiner mode (strict scoring)</li>
              <li>• Last-3-weeks plan (official timing, sleep, no new chapters)</li>
            </ul>
            <Link href="/signin" className="mt-6 inline-block rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent">
              Choose
            </Link>
          </div>
        </div>
        <p className="mt-8 text-sm text-ink-3">
          Demo: in this version every feature is open — no payment is requested.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
