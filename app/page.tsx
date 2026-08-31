import Link from "next/link";
import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Badge, Kicker } from "@/components/ui";

export default function Landing() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">
        {/* Promise */}
        <header className="border-b border-line bg-white">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
            <Badge tone="ink">TEF Canada · TCF Canada · Immigration francophone</Badge>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Un coach IA qui vous amène au <span className="text-accent">NCLC</span> dont vous avez
              réellement besoin.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-ink-2">
              IRCC regarde quatre compétences. Votre niveau officiel est <strong>le plus bas des
              quatre</strong> — pas une moyenne. Chaque session, chaque chaîne de jours, chaque
              message du coach existe pour faire monter la compétence qui vous limite.
            </p>
            <p className="mt-2 max-w-2xl text-sm text-ink-3">
              An AI coach built for the exam outcome — not for streak vanity metrics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signin"
                className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-2"
              >
                Commencer — 3 minutes d&apos;installation
              </Link>
              <Link
                href="/method"
                className="rounded-lg border border-line bg-white px-6 py-3 font-semibold text-ink hover:border-accent hover:text-accent"
              >
                Lire la méthode
              </Link>
            </div>
          </div>
        </header>

        {/* Proof: the min() rule */}
        <section className="mx-auto max-w-5xl px-5 py-14">
          <Kicker>Le principe</Kicker>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            « Votre score officiel, c&apos;est votre compétence la plus faible. »
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                t: "Préparation = identité",
                d: "Dès l'inscription, vous n'êtes plus « en train d'apprendre le français ». Vous êtes candidat au TEF ou au TCF, avec une cible NCLC et une date. Chaque bloc de 20 minutes est un bloc d'examen.",
              },
              {
                t: "Quatre barres, jamais une moyenne",
                d: "CO, CE, EE, EO : quatre estimations NCLC séparées, avec un niveau de confiance. La barre la plus courte est surlignée — c'est elle que l'examen regarde, c'est elle qu'on entraîne aujourd'hui.",
              },
              {
                t: "Des chaînes sans culpabilité",
                d: "5 minutes concentrées suffisent à garder la chaîne. Deux gels par mois, utilisés automatiquement. Une chaîne cassée affiche un bouton : Reprendre. Jamais d'écran rouge de honte.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-line bg-white p-6">
                <h3 className="font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEF vs TCF chooser */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto max-w-5xl px-5 py-14">
            <Kicker>Choisir son examen</Kicker>
            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">TEF Canada ou TCF Canada ?</h2>
            <p className="mt-3 max-w-2xl text-ink-2">
              Les deux sont acceptés par IRCC. Le choix se joue sur le <strong>format</strong> et les{" "}
              <strong>dates de centre</strong> — pas sur un mythe de « test plus facile ».
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-line p-6">
                <h3 className="font-display text-xl font-semibold text-accent">TEF Canada</h3>
                <ul className="mt-4 space-y-2 text-sm text-ink-2">
                  <li>• CO : ~40 min, ~40 QCM, audio en général une seule fois</li>
                  <li>• CE : 60 min, ~40 QCM</li>
                  <li>• EE : 60 min, 2 tâches — A : ~25 min, 80+ mots · B : ~35 min, 200+ mots</li>
                  <li>• EO : ~15 min, 2 tâches — renseignements + argumentation</li>
                  <li>• Les 4 épreuves le même jour · validité généralement 2 ans</li>
                </ul>
                <p className="mt-4 text-sm text-ink-2">
                  <strong>Profil favorisé :</strong> à l&apos;aise avec la lettre formelle et le développement long.
                </p>
              </div>
              <div className="rounded-xl border border-line p-6">
                <h3 className="font-display text-xl font-semibold text-accent">TCF Canada</h3>
                <ul className="mt-4 space-y-2 text-sm text-ink-2">
                  <li>• CO : ~35 min, 39 QCM, audio une seule fois</li>
                  <li>• CE : 60 min, 39 QCM</li>
                  <li>• EE : 60 min, 3 tâches courtes et progressives</li>
                  <li>• EO : ~12 min, 3 tâches</li>
                  <li>• Les 4 épreuves ensemble, non séparables · validité généralement 2 ans</li>
                </ul>
                <p className="mt-4 text-sm text-ink-2">
                  <strong>Profil favorisé :</strong> à l&apos;aise avec des tâches courtes qui changent vite.
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-ink-3">
              Structures typiques implémentées dans nos entraînements — vérifiez toujours la convocation officielle de votre session.
            </p>
          </div>
        </section>

        {/* Targets */}
        <section className="mx-auto max-w-5xl px-5 py-14">
          <Kicker>Les cibles qui comptent</Kicker>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">NCLC 5, 7 ou 8–9 : trois stratégies différentes</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-white p-6">
              <div className="font-display text-3xl font-semibold text-accent">NCLC 5</div>
              <p className="mt-2 text-sm text-ink-2">
                Plancher fréquent pour certains programmes et pour les points de seconde langue officielle. Objectif : régularité et bases solides.
              </p>
            </div>
            <div className="rounded-xl border-2 border-accent bg-white p-6">
              <div className="font-display text-3xl font-semibold text-accent">NCLC 7 × 4</div>
              <p className="mt-2 text-sm text-ink-2">
                La cible sérieuse d&apos;Entrée express / catégorie francophone : NCLC 7 <strong>dans les quatre compétences</strong>. Une seule compétence à 6, et le profil retombe.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <div className="font-display text-3xl font-semibold text-gold">NCLC 8–9</div>
              <p className="mt-2 text-sm text-ink-2">
                La marge de sécurité : viser au-dessus du seuil pour ne pas jouer votre dossier sur une mauvaise journée d&apos;examen.
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-xl bg-accent-soft p-6 text-sm leading-relaxed text-accent">
            <strong>Transparence :</strong> Lumen affiche des estimations pédagogiques, jamais de « score officiel TEF ». Les
            tableaux de conversion score → NCLC affichés dans l&apos;app viennent d&apos;IRCC et portent une date de dernière
            vérification, avec un lien direct vers canada.ca.
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
