"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { L, useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";
import { Exam, Profile, Skill, SKILL_LABELS, SKILLS, TargetNCLC } from "@/lib/types";

const LEVELS = [
  { fr: "Débutant", en: "Beginner", hintFr: "A1 — phrases simples", hintEn: "A1 — simple sentences", value: 8 },
  { fr: "Élémentaire", en: "Elementary", hintFr: "A2 — situations quotidiennes", hintEn: "A2 — everyday situations", value: 22 },
  { fr: "Intermédiaire", en: "Intermediate", hintFr: "B1 — je me débrouille", hintEn: "B1 — I get by", value: 42 },
  { fr: "Intermédiaire +", en: "Intermediate +", hintFr: "B2 — à l'aise, avec fautes", hintEn: "B2 — comfortable, with mistakes", value: 62 },
  { fr: "Avancé", en: "Advanced", hintFr: "C1 — presque naturel", hintEn: "C1 — almost natural", value: 80 },
];

const MOTIVATIONS = [
  { fr: "Résidence permanente", en: "Permanent residence" },
  { fr: "Emploi", en: "Job / career" },
  { fr: "Études", en: "Studies" },
  { fr: "Conjoint(e) / famille", en: "Partner / family" },
  { fr: "Québec / PEQ", en: "Québec / PEQ" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const profile = useApp((s) => s.profile);
  const onboarded = useApp((s) => s.onboarded);
  const completeOnboarding = useApp((s) => s.completeOnboarding);
  const hydrated = useHydrated();
  const lang = useLang();
  const [step, setStep] = useState(0);
  const finishingRef = useRef(false);

  const [exam, setExam] = useState<Exam>("TEF");
  const [target, setTarget] = useState<TargetNCLC>(7);
  const [examDate, setExamDate] = useState("");
  const [minutes, setMinutes] = useState(20);
  const [motivation, setMotivation] = useState(MOTIVATIONS[0].fr);
  const [levels, setLevels] = useState<Record<Skill, number>>({ listening: 42, reading: 42, writing: 22, speaking: 22 });
  const [intentionTime, setIntentionTime] = useState("Ce soir après le dîner");

  useEffect(() => {
    if (!hydrated) return;
    if (!profile) router.replace("/signin");
    // don't override the push to the first session triggered by finish()
    else if (onboarded && !finishingRef.current) router.replace("/today");
  }, [hydrated, profile, onboarded, router]);

  const weakest = useMemo(
    () => SKILLS.reduce((min, s) => (levels[s] < levels[min] ? s : min), "listening" as Skill),
    [levels]
  );

  if (!hydrated || !profile || onboarded) return null;

  function finish() {
    finishingRef.current = true;
    const p = profile as Profile;
    const full: Profile = {
      ...p,
      exam,
      targetNCLC: target,
      examDate: examDate || undefined,
      dailyMinutes: minutes,
      motivation,
      intention: { time: intentionTime, minutes, skill: "auto" },
    };
    completeOnboarding(full, levels);
    const href = weakest === "writing" ? "/writing" : weakest === "speaking" ? "/speaking" : `/skills/${weakest}`;
    router.push(href);
  }

  const steps = 5;

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-ink-3">
          <span className="font-display font-semibold text-accent">Lumen Français</span>
          <div className="flex items-center gap-3">
            <span>{L(lang, `Étape ${step + 1} / ${steps} · ~3 minutes`, `Step ${step + 1} of ${steps} · ~3 minutes`)}</span>
            <LangToggle />
          </div>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
          <div className="bar-ease h-full rounded-full bg-accent" style={{ width: `${((step + 1) / steps) * 100}%` }} />
        </div>
      </div>

      <h1 className="font-display text-2xl font-semibold sm:text-3xl">{L(lang, "Quel score vous faut-il ?", "What score do you need?")}</h1>
      <p className="mt-2 text-sm text-ink-2">
        {lang === "fr" ? (
          <>IRCC regarde quatre compétences. Votre niveau officiel est <strong>le plus bas des quatre</strong>. C&apos;est lui qu&apos;on entraîne.</>
        ) : (
          <>IRCC looks at four skills. Your official level is <strong>the lowest one</strong>. We train that.</>
        )}
      </p>

      <div className="mt-8 space-y-6">
        {step === 0 && (
          <section>
            <h2 className="font-semibold">{L(lang, "1 · Votre examen", "1 · Your exam")}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {(["TEF", "TCF", "UNDECIDED"] as Exam[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setExam(e)}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${exam === e ? "border-accent bg-accent-soft" : "border-line bg-white hover:border-accent"}`}
                >
                  <div className="font-display text-lg font-semibold">{e === "UNDECIDED" ? L(lang, "Pas décidé", "Not decided") : e + " Canada"}</div>
                  <div className="mt-1 text-xs text-ink-2">
                    {e === "TEF"
                      ? L(lang, "EE : 2 tâches · EO : 2 tâches", "Writing: 2 tasks · Speaking: 2 tasks")
                      : e === "TCF"
                        ? L(lang, "EE : 3 tâches · EO : 3 tâches", "Writing: 3 tasks · Speaking: 3 tasks")
                        : L(lang, "On vous aidera à choisir", "We'll help you choose")}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <h2 className="font-semibold">{L(lang, "2 · Votre cible NCLC", "2 · Your NCLC target")}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {([5, 7, 8] as TargetNCLC[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setTarget(n)}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${target === n ? "border-accent bg-accent-soft" : "border-line bg-white hover:border-accent"}`}
                >
                  <div className="font-display text-2xl font-semibold">NCLC {n}</div>
                  <div className="mt-1 text-xs text-ink-2">
                    {n === 5
                      ? L(lang, "Plancher de certains programmes", "Floor for some programs")
                      : n === 7
                        ? L(lang, "Cible Entrée express / francophone", "Express Entry / French-category target")
                        : L(lang, "Marge de sécurité", "Safety margin")}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-3">
              {L(lang,
                "La cible s'applique aux quatre compétences séparément — vérifiez votre programme sur canada.ca.",
                "The target applies to each of the four skills separately — verify your program on canada.ca.")}
            </p>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-5">
            <div>
              <h2 className="font-semibold">{L(lang, "3 · Date d'examen (si réservée)", "3 · Exam date (if booked)")}</h2>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
              <p className="mt-1 text-xs text-ink-3">
                {L(lang,
                  "Optionnel — le plan s'adapte : fondations, tâches d'examen, puis dernière ligne droite.",
                  "Optional — the plan adapts: foundations, exam tasks, then the final stretch.")}
              </p>
            </div>
            <div>
              <h2 className="font-semibold">{L(lang, "Votre motivation", "Your motivation")}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {MOTIVATIONS.map((m) => (
                  <button
                    key={m.fr}
                    onClick={() => setMotivation(m.fr)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${motivation === m.fr ? "border-accent bg-accent-soft text-accent" : "border-line bg-white text-ink-2"}`}
                  >
                    {L(lang, m.fr, m.en)}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-5">
            <div>
              <h2 className="font-semibold">{L(lang, "4 · Minutes par jour", "4 · Minutes per day")}</h2>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {[10, 20, 40].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMinutes(m)}
                    className={`rounded-xl border-2 p-4 text-center ${minutes === m ? "border-accent bg-accent-soft" : "border-line bg-white hover:border-accent"}`}
                  >
                    <div className="font-display text-2xl font-semibold">{m}</div>
                    <div className="text-xs text-ink-2">{L(lang, "min / jour", "min / day")}</div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-3">
                {L(lang,
                  "La chaîne, elle, se garde dès 5 minutes concentrées. Ceci est votre plan, pas votre plancher.",
                  "The streak only needs 5 focused minutes. This is your plan, not your floor.")}
              </p>
            </div>
            <div>
              <h2 className="font-semibold">{L(lang, "Votre intention d'implémentation", "Your implementation intention")}</h2>
              <p className="mt-1 text-xs text-ink-2">
                {L(lang,
                  "Quand + où : le cadre dans lequel le coach vous rappellera la session.",
                  "When + where: the frame the coach will use to remind you of the session.")}
              </p>
              <input
                value={intentionTime}
                onChange={(e) => setIntentionTime(e.target.value)}
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
                placeholder={L(lang, "Ce soir après le dîner", "Tonight after dinner (write it in French!)")}
              />
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="font-semibold">{L(lang, "5 · Votre niveau actuel, compétence par compétence", "5 · Your current level, skill by skill")}</h2>
            <p className="mt-1 text-xs text-ink-2">
              {L(lang,
                "Auto-évaluation honnête (un placement de 12 min affinera ces estimations au fil des exercices notés).",
                "Honest self-assessment (scored drills will refine these estimates over time).")}
            </p>
            <div className="mt-4 space-y-4">
              {SKILLS.map((s) => (
                <div key={s}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-sm font-semibold">{L(lang, SKILL_LABELS[s].fr, SKILL_LABELS[s].en)}</span>
                    <span className="text-xs text-ink-3">{SKILL_LABELS[s].short}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {LEVELS.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => setLevels((prev) => ({ ...prev, [s]: l.value }))}
                        title={L(lang, l.hintFr, l.hintEn)}
                        className={`rounded-lg border px-1 py-2 text-[11px] font-semibold ${
                          levels[s] === l.value ? "border-accent bg-accent-soft text-accent" : "border-line bg-white text-ink-2 hover:border-accent"
                        }`}
                      >
                        {L(lang, l.fr, l.en)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-accent-soft p-4 text-sm text-accent">
              {lang === "fr" ? (
                <>
                  Compétence de départ estimée la plus faible : <strong>{SKILL_LABELS[weakest].fr}</strong>. Votre
                  première session (8 minutes) commencera là — puis retour à l&apos;accueil.
                </>
              ) : (
                <>
                  Weakest guessed starting skill: <strong>{SKILL_LABELS[weakest].en}</strong>. Your first
                  session (8 minutes) starts there — then back home.
                </>
              )}
            </div>
          </section>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-2 hover:text-accent ${step === 0 ? "invisible" : ""}`}
        >
          ← {L(lang, "Retour", "Back")}
        </button>
        {step < steps - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-2">
            {L(lang, "Continuer", "Continue")}
          </button>
        ) : (
          <button onClick={finish} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-2">
            {L(lang, "Commencer la première session →", "Start the first session →")}
          </button>
        )}
      </div>
    </main>
  );
}
