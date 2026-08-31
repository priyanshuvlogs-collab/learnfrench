import Link from "next/link";
import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Badge, Kicker } from "@/components/ui";

export const metadata = { title: "Tarifs — Lumen Français" };

export default function PricingPage() {
  return (
    <>
      <PublicNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-14">
        <Kicker>Tarifs</Kicker>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Moins cher qu&apos;une reprise d&apos;examen
        </h1>
        <p className="mt-3 max-w-2xl text-ink-2">
          Une session TEF ou TCF coûte plusieurs centaines de dollars — et des semaines d&apos;attente
          en cas d&apos;échec. Lumen existe pour que vous n&apos;y retourniez qu&apos;une fois.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-semibold">Découverte</h2>
            <div className="mt-2 font-display text-3xl font-semibold">0 $</div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>• Bloc quotidien + chaîne + gels</li>
              <li>• 4 barres de compétence &amp; préparation</li>
              <li>• Banques CO / CE d&apos;entraînement</li>
              <li>• Cartes de rappel espacé</li>
              <li>• Tableaux officiels IRCC</li>
            </ul>
            <Link href="/signin" className="mt-6 inline-block rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent">
              Commencer gratuitement
            </Link>
          </div>
          <div className="relative rounded-xl border-2 border-accent bg-white p-6">
            <span className="absolute -top-3 left-6"><Badge>Recommandé</Badge></span>
            <h2 className="font-semibold">Candidat</h2>
            <div className="mt-2 font-display text-3xl font-semibold">19 $ <span className="text-base font-normal text-ink-3">/ mois</span></div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>• Tout Découverte, plus :</li>
              <li>• Coach Camille illimité (grille d&apos;examinateur)</li>
              <li>• Atelier d&apos;écriture noté, minuteries TEF A/B et TCF</li>
              <li>• Atelier oral : enregistrement, transcription, 5 dimensions</li>
              <li>• Examens blancs de section</li>
            </ul>
            <Link href="/signin" className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-2">
              Essayer 7 jours
            </Link>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-semibold">Dernière ligne droite</h2>
            <div className="mt-2 font-display text-3xl font-semibold">49 $ <span className="text-base font-normal text-ink-3">/ mois</span></div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>• Tout Candidat, plus :</li>
              <li>• Examens blancs complets chronométrés</li>
              <li>• Mode examinateur (notation stricte)</li>
              <li>• Plan des 3 dernières semaines (chronométrage officiel, sommeil, zéro nouveau chapitre)</li>
            </ul>
            <Link href="/signin" className="mt-6 inline-block rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent">
              Choisir
            </Link>
          </div>
        </div>
        <p className="mt-8 text-sm text-ink-3">
          Démo : dans cette version, toutes les fonctionnalités sont ouvertes — aucun paiement n&apos;est demandé.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
