"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { Exam, Profile, Skill, SKILL_LABELS, SKILLS, TargetNCLC } from "@/lib/types";

const LEVELS = [
  { label: "Débutant", hint: "A1 — phrases simples", value: 8 },
  { label: "Élémentaire", hint: "A2 — situations quotidiennes", value: 22 },
  { label: "Intermédiaire", hint: "B1 — je me débrouille", value: 42 },
  { label: "Intermédiaire +", hint: "B2 — à l'aise, avec fautes", value: 62 },
  { label: "Avancé", hint: "C1 — presque naturel", value: 80 },
];

const MOTIVATIONS = ["Résidence permanente", "Emploi", "Études", "Conjoint(e) / famille", "Québec / PEQ"];

export default function OnboardingPage() {
  const router = useRouter();
  const profile = useApp((s) => s.profile);
  const onboarded = useApp((s) => s.onboarded);
  const completeOnboarding = useApp((s) => s.completeOnboarding);
  const hydrated = useHydrated();
  const [step, setStep] = useState(0);

  const [exam, setExam] = useState<Exam>("TEF");
  const [target, setTarget] = useState<TargetNCLC>(7);
  const [examDate, setExamDate] = useState("");
  const [minutes, setMinutes] = useState(20);
  const [motivation, setMotivation] = useState(MOTIVATIONS[0]);
  const [levels, setLevels] = useState<Record<Skill, number>>({ listening: 42, reading: 42, writing: 22, speaking: 22 });
  const [intentionTime, setIntentionTime] = useState("Ce soir après le dîner");

  useEffect(() => {
    if (!hydrated) return;
    if (!profile) router.replace("/signin");
    else if (onboarded) router.replace("/today");
  }, [hydrated, profile, onboarded, router]);

  const weakest = useMemo(
    () => SKILLS.reduce((min, s) => (levels[s] < levels[min] ? s : min), "listening" as Skill),
    [levels]
  );

  if (!hydrated || !profile || onboarded) return null;

  function finish() {
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
          <span>Étape {step + 1} / {steps} · ~3 minutes</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
          <div className="bar-ease h-full rounded-full bg-accent" style={{ width: `${((step + 1) / steps) * 100}%` }} />
        </div>
      </div>

      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Quel score vous faut-il ?</h1>
      <p className="mt-2 text-sm text-ink-2">
        IRCC regarde quatre compétences. Votre niveau officiel est <strong>le plus bas des quatre</strong>. C&apos;est lui qu&apos;on entraîne.
      </p>

      <div className="mt-8 space-y-6">
        {step === 0 && (
          <section>
            <h2 className="font-semibold">1 · Votre examen</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {(["TEF", "TCF", "UNDECIDED"] as Exam[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setExam(e)}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${exam === e ? "border-accent bg-accent-soft" : "border-line bg-white hover:border-accent"}`}
                >
                  <div className="font-display text-lg font-semibold">{e === "UNDECIDED" ? "Pas décidé" : e + " Canada"}</div>
                  <div className="mt-1 text-xs text-ink-2">
                    {e === "TEF" ? "EE : 2 tâches · EO : 2 tâches" : e === "TCF" ? "EE : 3 tâches · EO : 3 tâches" : "On vous aidera à choisir"}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <h2 className="font-semibold">2 · Votre cible NCLC</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {([5, 7, 8] as TargetNCLC[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setTarget(n)}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${target === n ? "border-accent bg-accent-soft" : "border-line bg-white hover:border-accent"}`}
                >
                  <div className="font-display text-2xl font-semibold">NCLC {n}</div>
                  <div className="mt-1 text-xs text-ink-2">
                    {n === 5 ? "Plancher de certains programmes" : n === 7 ? "Cible Entrée express / francophone" : "Marge de sécurité"}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-3">La cible s&apos;applique aux quatre compétences séparément — vérifiez votre programme sur canada.ca.</p>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-5">
            <div>
              <h2 className="font-semibold">3 · Date d&apos;examen (si réservée)</h2>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
              />
              <p className="mt-1 text-xs text-ink-3">Optionnel — le plan s&apos;adapte : fondations, tâches d&apos;examen, puis dernière ligne droite.</p>
            </div>
            <div>
              <h2 className="font-semibold">Votre motivation</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {MOTIVATIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMotivation(m)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${motivation === m ? "border-accent bg-accent-soft text-accent" : "border-line bg-white text-ink-2"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-5">
            <div>
              <h2 className="font-semibold">4 · Minutes par jour</h2>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {[10, 20, 40].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMinutes(m)}
                    className={`rounded-xl border-2 p-4 text-center ${minutes === m ? "border-accent bg-accent-soft" : "border-line bg-white hover:border-accent"}`}
                  >
                    <div className="font-display text-2xl font-semibold">{m}</div>
                    <div className="text-xs text-ink-2">min / jour</div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-3">La chaîne, elle, se garde dès 5 minutes concentrées. Ceci est votre plan, pas votre plancher.</p>
            </div>
            <div>
              <h2 className="font-semibold">Votre intention d&apos;implémentation</h2>
              <p className="mt-1 text-xs text-ink-2">Quand + où : le cadre dans lequel le coach vous rappellera la session.</p>
              <input
                value={intentionTime}
                onChange={(e) => setIntentionTime(e.target.value)}
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
                placeholder="Ce soir après le dîner"
              />
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="font-semibold">5 · Votre niveau actuel, compétence par compétence</h2>
            <p className="mt-1 text-xs text-ink-2">
              Auto-évaluation honnête (un placement de 12 min affinera ces estimations au fil des exercices notés).
            </p>
            <div className="mt-4 space-y-4">
              {SKILLS.map((s) => (
                <div key={s}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-sm font-semibold">{SKILL_LABELS[s].fr}</span>
                    <span className="text-xs text-ink-3">{SKILL_LABELS[s].short}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {LEVELS.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => setLevels((prev) => ({ ...prev, [s]: l.value }))}
                        title={l.hint}
                        className={`rounded-lg border px-1 py-2 text-[11px] font-semibold ${
                          levels[s] === l.value ? "border-accent bg-accent-soft text-accent" : "border-line bg-white text-ink-2 hover:border-accent"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-accent-soft p-4 text-sm text-accent">
              Compétence de départ estimée la plus faible : <strong>{SKILL_LABELS[weakest].fr}</strong>. Votre
              première session (8 minutes) commencera là — puis retour à l&apos;accueil.
            </div>
          </section>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-2 hover:text-accent ${step === 0 ? "invisible" : ""}`}
        >
          ← Retour
        </button>
        {step < steps - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-2">
            Continuer
          </button>
        ) : (
          <button onClick={finish} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-2">
            Commencer la première session →
          </button>
        )}
      </div>
    </main>
  );
}
