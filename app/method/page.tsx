import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Kicker } from "@/components/ui";

export const metadata = { title: "Méthode — Lumen Français" };

const SECTIONS: { k: string; t: string; d: string }[] = [
  {
    k: "1 · Identité, pas volonté",
    t: "Vous êtes candidat, pas « apprenant »",
    d: "Dès l'inscription, l'app vous adresse comme candidat : « Vous préparez le TEF Canada pour NCLC 7 avant le 12 décembre. » Les tâches quotidiennes sont cohérentes avec cette identité — un bloc d'examen de 20 minutes, pas un jeu. La motivation fluctue ; l'identité tient.",
  },
  {
    k: "2 · Intentions d'implémentation",
    t: "Quand [moment] + [lieu], je fais [un bloc]",
    d: "Chaque session part d'un plan pré-engagé : « Ce soir après le dîner, 20 minutes d'écoute. » Vous l'éditez une fois ; le coach vous le rappelle dans ce cadre. La recherche est claire : une intention située double la probabilité d'exécution par rapport à « je vais étudier plus ».",
  },
  {
    k: "3 · Habitude d'ouverture minuscule",
    t: "5 minutes concentrées suffisent à garder la chaîne",
    d: "La chaîne se mérite par une session minimale viable de 5 minutes — 10 verbes fréquents ou un échauffement de parole — jamais par un examen blanc complet. Les soirs de fatigue, le protocole « garder la chaîne » est à un bouton.",
  },
  {
    k: "4 · Chaînes sans peur",
    t: "Deux gels par mois, expliqués dès le jour 1",
    d: "La chaîne compte les jours calendaires avec au moins une session qualifiante. Deux gels par mois s'utilisent automatiquement si vous manquez un jour après une chaîne de 7+. Une chaîne cassée affiche un état sobre et un bouton : Reprendre — 8 minutes sur la compétence la plus faible d'hier, sans leçon de morale.",
  },
  {
    k: "5 · Un progrès qui ne ment pas",
    t: "Jamais de « 72 % global »",
    d: "Trois couches toujours visibles : l'anneau du jour (minutes faites / prévues), quatre barres de compétence converties en NCLC estimé avec niveau de confiance, et l'indicateur de préparation = le minimum des quatre. IRCC ne fait pas de moyenne ; nous non plus.",
  },
  {
    k: "6 · Récompense concrète",
    t: "Une victoire précise, pas des confettis",
    d: "Après chaque session : un gain concret (« vous avez utilisé “cependant” correctement dans la tâche B ») et le prochain micro-objectif. Chaque semaine, une courte lettre du coach sur ce qui a changé.",
  },
  {
    k: "7 · Protocole anti-anxiété",
    t: "L'examen est une compétence nerveuse aussi",
    d: "Avant tout examen blanc chronométré : 30 secondes de respiration en carré, et le rappel de la règle — « l'audio passe une fois ; c'est la règle, on l'entraîne ». Après : le score est une donnée pour le prochain bloc, pas un verdict sur vous.",
  },
  {
    k: "8 · Interleaving + rappel espacé",
    t: "Pas de gavage mono-compétence",
    d: "Le planificateur mélange les compétences — jamais 7 jours d'écoute seule, sauf à moins de deux semaines de l'examen avec une seule compétence sous la cible. Un système de répétition espacée (type SM-2) entretient connecteurs, gabarits d'examen et pièges sonores.",
  },
  {
    k: "9 · Règle du pic-fin",
    t: "Terminer sur une réussite",
    d: "Chaque session se clôt sur un succès court : trois phrases que vous savez dire, ou un extrait parlé de 20 secondes meilleur que celui de la semaine dernière. Le cerveau retient la fin ; on la soigne.",
  },
];

export default function MethodPage() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">
        <header className="border-b border-line bg-white">
          <div className="mx-auto max-w-3xl px-5 py-14">
            <Kicker>Méthode &amp; psychologie</Kicker>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Conçu pour votre système nerveux, pas pour un apprenant de loisir
            </h1>
            <p className="mt-4 text-ink-2">
              Vous travaillez, vous êtes fatigué, l&apos;enjeu est un dossier d&apos;immigration. Vous
              étudiez intensément puis disparaissez dix jours. Ces neuf mécanismes sont construits
              dans le produit — pas des articles de blog.
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
            Et ce que nous refusons de construire : classements sociaux qui humilient, culpabilisation
            de chaîne (« ne perdez pas votre série !! »), fausses promesses de « CLB 7 garanti en 30
            jours », et tout ce qui ressemble à un score officiel qui n&apos;en est pas un.
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
