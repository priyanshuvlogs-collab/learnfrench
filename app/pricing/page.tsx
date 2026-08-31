import Link from "next/link";
import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Badge, Kicker } from "@/components/ui";

export const metadata = { title: "Tarifs — Lumen Français" };

export default function PricingPage() {
  return (
    <>
      <PublicNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-14">
        <Kicker>Freemium</Kicker>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Commencez gratuitement. Passez Premium quand l&apos;examen approche.
        </h1>
        <p className="mt-3 max-w-2xl text-ink-2">
          Une session TEF ou TCF coûte plusieurs centaines de dollars — et des semaines d&apos;attente
          en cas d&apos;échec. Le plan gratuit installe l&apos;habitude ; Premium enlève toutes les limites.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-semibold">Gratuit</h2>
            <div className="mt-2 font-display text-3xl font-semibold">0 $</div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>• Bloc quotidien complet + chaîne + gels + objectifs</li>
              <li>• Exercices CO / CE illimités (écoute unique)</li>
              <li>• Grammaire de base (être, avoir…) + 120 cartes SRS</li>
              <li>• 1 production écrite notée + 1 orale notée par jour</li>
              <li>• Mini-blancs chronométrés</li>
              <li>• Coach Camille (moteur local, connaît tout votre état)</li>
              <li>• Interface bilingue EN/FR + ressources + syllabus</li>
            </ul>
            <Link href="/signin" className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-2">
              Créer mon compte gratuit
            </Link>
          </div>
          <div className="relative rounded-xl border-2 border-gold bg-white p-6">
            <span className="absolute -top-3 left-6"><Badge tone="gold">Premium</Badge></span>
            <h2 className="font-semibold">Premium</h2>
            <div className="mt-2 font-display text-3xl font-semibold">Activé par l&apos;administrateur</div>
            <ul className="mt-4 space-y-2 text-sm text-ink-2">
              <li>• Tout le plan gratuit, sans aucune limite quotidienne</li>
              <li>• Productions écrites et orales notées <strong>illimitées</strong> — y compris « redites-le, en mieux » à volonté</li>
              <li>• Blancs de section longs (20 questions, chrono strict)</li>
              <li>• <strong>Coach IA (OpenAI)</strong> : réponses personnalisées à votre état exact</li>
              <li>• Priorité sur les nouvelles fonctions (blancs complets 4 épreuves, mode examinateur)</li>
            </ul>
            <p className="mt-6 text-sm text-ink-3">
              Version actuelle : Premium est accordé par l&apos;administrateur depuis son panneau (pas de
              paiement intégré). En production : Stripe + essai de 7 jours.
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm text-ink-3">
          La limite gratuite est pédagogique autant que commerciale : une production notée par jour, bien
          revue, bat dix productions bâclées. La régularité fait le NCLC.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
