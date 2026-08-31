/**
 * Speaking bank — 25 original practice prompts (source: original
 * practice). TEF: A (information gathering, ~5 min) and B (persuade,
 * ~10 min). TCF: T1 interview, T2 interaction (with prep), T3 point of
 * view (no prep). Timers mirror exam rhythm at practice scale.
 */
export interface SpeakingPrompt {
  id: string;
  exam: "TEF" | "TCF";
  task: "A" | "B" | "T1" | "T2" | "T3";
  title: string;
  prompt: string;
  prepSeconds: number;
  speakSeconds: number; // practice-scale target
  structure: string[]; // forced structure: opinion → reason → example → close
  source: "original practice";
}

const s = "original practice" as const;

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  // ── TEF A — obtenir des renseignements (poser des questions) ──
  { id: "eo-tef-a-01", exam: "TEF", task: "A", prepSeconds: 60, speakSeconds: 90, source: s,
    title: "Cours de natation pour adultes",
    prompt: "Annonce : « Cours de natation pour adultes — piscine municipale. Inscriptions ouvertes. » Vous téléphonez pour vous renseigner. Posez vos questions à voix haute, comme au téléphone : horaires, prix, niveaux, matériel, inscription.",
    structure: ["Saluer + dire pourquoi vous appelez", "8–10 questions variées (quel, combien, est-ce que…)", "Réagir (« très bien », « parfait »)", "Remercier et prendre congé"] },
  { id: "eo-tef-a-02", exam: "TEF", task: "A", prepSeconds: 60, speakSeconds: 90, source: s,
    title: "Colocation à visiter",
    prompt: "Annonce : « Chambre à louer dans grand 5 ½, quartier calme, libre immédiatement. » Vous appelez pour obtenir des renseignements avant de visiter : loyer et charges, colocataires, équipements, règles de vie, visite.",
    structure: ["Saluer + contexte", "Questions logement (loyer, charges, meublé ?)", "Questions vie commune (colocataires, animaux, invités)", "Fixer une visite + remercier"] },
  { id: "eo-tef-a-03", exam: "TEF", task: "A", prepSeconds: 60, speakSeconds: 90, source: s,
    title: "Emploi de fin de semaine",
    prompt: "Annonce : « Boulangerie cherche vendeur/vendeuse fin de semaine. » Vous téléphonez : tâches, horaires exacts, salaire, expérience demandée, comment postuler.",
    structure: ["Se présenter + objet de l'appel", "Questions sur le poste et l'horaire", "Questions salaire et conditions", "Demander la suite du processus"] },
  { id: "eo-tef-a-04", exam: "TEF", task: "A", prepSeconds: 60, speakSeconds: 90, source: s,
    title: "Garderie : place disponible",
    prompt: "Annonce : « Garderie familiale — 2 places disponibles en septembre. » Vous appelez pour votre enfant de 3 ans : horaires, tarifs et subventions, repas, activités, période d'adaptation.",
    structure: ["Saluer + âge de l'enfant", "Questions pratiques (heures, tarifs)", "Questions qualité (repas, activités, sieste)", "Demander une visite"] },
  { id: "eo-tef-a-05", exam: "TEF", task: "A", prepSeconds: 60, speakSeconds: 90, source: s,
    title: "Atelier de conversation française",
    prompt: "Annonce : « Ateliers de conversation gratuits à la bibliothèque, tous niveaux. » Vous appelez : jours et heures, niveau des groupes, inscription, nombre de participants, matériel à apporter.",
    structure: ["Saluer + votre niveau actuel", "Questions organisation", "Questions contenu", "Confirmer votre venue + remercier"] },
  { id: "eo-tef-a-06", exam: "TEF", task: "A", prepSeconds: 60, speakSeconds: 90, source: s,
    title: "Location d'un chalet",
    prompt: "Annonce : « Chalet au bord du lac à louer, 4 personnes, fin de semaine ou semaine. » Vous appelez pour organiser un séjour : disponibilités, prix, équipements, distance, animaux, caution.",
    structure: ["Saluer + dates envisagées", "Questions prix et conditions", "Questions équipement et accès", "Conclure (réfléchir / réserver)"] },
  { id: "eo-tef-a-07", exam: "TEF", task: "A", prepSeconds: 60, speakSeconds: 90, source: s,
    title: "Déménageurs à réserver",
    prompt: "Annonce : « Déménagement économique, camion et 2 déménageurs. » Vous appelez pour un déménagement le 1er juillet : tarif horaire, durée estimée, assurance, cartons, étages et meubles lourds.",
    structure: ["Contexte (date, taille du logement)", "Questions tarif et durée", "Questions assurance et matériel", "Demander un devis écrit"] },
  { id: "eo-tef-a-08", exam: "TEF", task: "A", prepSeconds: 60, speakSeconds: 90, source: s,
    title: "Cours de conduite",
    prompt: "Annonce : « École de conduite — forfait complet, moniteurs patients. » Vous appelez : contenu du forfait, prix total, horaires de soir, langue des cours, taux de réussite, délais.",
    structure: ["Saluer + votre situation (permis étranger ?)", "Questions forfait et prix", "Questions pratiques (soir, langue)", "Prendre rendez-vous d'essai"] },

  // ── TEF B — convaincre ──
  { id: "eo-tef-b-01", exam: "TEF", task: "B", prepSeconds: 90, speakSeconds: 120, source: s,
    title: "Convaincre un ami : week-end à la montagne",
    prompt: "Annonce : « Week-end découverte à la montagne : randonnée, air pur, repas traditionnel. Prix spécial groupe ! » Convainquez un ami fatigué et inquiet pour son budget de venir avec vous. Répondez à ses objections.",
    structure: ["Présenter l'offre (quoi, où, combien)", "3 arguments adaptés à l'ami", "Traiter 2 objections (cher, fatigué)", "Conclure avec une proposition concrète"] },
  { id: "eo-tef-b-02", exam: "TEF", task: "B", prepSeconds: 90, speakSeconds: 120, source: s,
    title: "Convaincre un collègue : covoiturage",
    prompt: "Vous proposez à un collègue qui prend sa voiture seul chaque jour de faire du covoiturage avec vous. Il craint de perdre sa liberté d'horaire. Convainquez-le : économies, trajet agréable, environnement — et proposez une solution pour les horaires.",
    structure: ["Annoncer la proposition", "Arguments chiffrés (essence, stationnement)", "Répondre à l'objection liberté", "Proposer un essai d'une semaine"] },
  { id: "eo-tef-b-03", exam: "TEF", task: "B", prepSeconds: 90, speakSeconds: 120, source: s,
    title: "Convaincre : cours de français en couple",
    prompt: "Votre partenaire hésite à s'inscrire au cours de français avec vous : « trop fatigué le soir, pas doué pour les langues ». Convainquez-le/la : avantages concrets, soutien mutuel, format adapté. Traitez ses deux objections.",
    structure: ["Rappeler l'objectif commun", "2–3 bénéfices concrets", "Objections : fatigue, confiance", "Plan précis (jours, durée, récompense)"] },
  { id: "eo-tef-b-04", exam: "TEF", task: "B", prepSeconds: 90, speakSeconds: 120, source: s,
    title: "Convaincre la propriétaire : adopter un chat",
    prompt: "Votre bail interdit les animaux « sauf accord écrit ». Convainquez votre propriétaire d'accepter un chat : propreté, calme, garanties que vous proposez (dépôt, assurance, essai).",
    structure: ["Demande claire et polie", "Arguments rassurants", "Garanties concrètes", "Remercier + proposer de formaliser par écrit"] },
  { id: "eo-tef-b-05", exam: "TEF", task: "B", prepSeconds: 90, speakSeconds: 120, source: s,
    title: "Convaincre un ami : vendre sa voiture en ville",
    prompt: "Votre ami habite au centre-ville, paie cher stationnement et assurance, et utilise sa voiture deux fois par mois. Convainquez-le de la vendre : calcul des coûts, alternatives (autopartage, location ponctuelle), objection « et les urgences ? ».",
    structure: ["Constat chiffré", "Alternatives crédibles", "Traiter l'objection urgence", "Conclusion : essai de 3 mois sans voiture"] },
  { id: "eo-tef-b-06", exam: "TEF", task: "B", prepSeconds: 90, speakSeconds: 120, source: s,
    title: "Convaincre le comité : fête des voisins",
    prompt: "Vous proposez au comité de votre immeuble d'organiser une fête des voisins dans la cour. Certains craignent le bruit et le désordre. Convainquez-les : liens de voisinage, sécurité, entraide — avec des règles claires (horaires, nettoyage).",
    structure: ["Présenter le projet simplement", "Bénéfices pour tous", "Répondre aux craintes avec des règles", "Appel à la décision"] },
  { id: "eo-tef-b-07", exam: "TEF", task: "B", prepSeconds: 90, speakSeconds: 120, source: s,
    title: "Convaincre sa gestionnaire : formation payée",
    prompt: "Vous demandez à votre gestionnaire de financer une formation professionnelle de 800 $. Elle doute du retour sur investissement. Convainquez-la : lien direct avec vos tâches, bénéfice pour l'équipe, engagement de votre part.",
    structure: ["Demande précise (formation, coût, dates)", "Lien avec les besoins du service", "Engagement (partage des acquis, rester 1 an)", "Proposer un compromis (50/50)"] },
  { id: "eo-tef-b-08", exam: "TEF", task: "B", prepSeconds: 90, speakSeconds: 120, source: s,
    title: "Convaincre un ami : colocation ensemble",
    prompt: "Les loyers explosent. Convainquez un ami de prendre un grand appartement en colocation avec vous plutôt que deux studios séparés. Il tient à son indépendance. Chiffres, organisation, règles de vie : rassurez-le.",
    structure: ["L'occasion (grand 5 ½ repéré)", "Arguments économiques précis", "Règles préservant l'indépendance", "Visite proposée cette semaine"] },
  { id: "eo-tef-b-09", exam: "TEF", task: "B", prepSeconds: 90, speakSeconds: 120, source: s,
    title: "Convaincre les parents d'élèves : bénévolat lecture",
    prompt: "Vous cherchez des bénévoles pour lire des histoires à l'école une heure par semaine. Les parents disent manquer de temps. Convainquez une assemblée de parents : impact sur les enfants, flexibilité, plaisir personnel.",
    structure: ["Accroche (pourquoi la lecture compte)", "Ce que ça demande vraiment (1 h, flexible)", "Témoignage/exemple", "Appel clair à s'inscrire"] },

  // ── TCF T1 — entretien dirigé (sans préparation) ──
  { id: "eo-tcf-t1-01", exam: "TCF", task: "T1", prepSeconds: 0, speakSeconds: 60, source: s,
    title: "Parler de soi : votre parcours",
    prompt: "Présentez-vous : d'où vous venez, ce que vous faites, pourquoi vous apprenez le français et ce que vous aimez faire le week-end. Parlez naturellement, sans préparation.",
    structure: ["Qui je suis", "Ce que je fais", "Pourquoi le français", "Un loisir"] },
  { id: "eo-tcf-t1-02", exam: "TCF", task: "T1", prepSeconds: 0, speakSeconds: 60, source: s,
    title: "Parler de soi : votre quotidien",
    prompt: "Décrivez une journée typique de votre semaine : matin, travail ou études, soirée. Qu'est-ce que vous aimeriez changer dans votre routine ?",
    structure: ["Le matin", "La journée", "Le soir", "Ce que je changerais"] },

  // ── TCF T2 — interaction (avec préparation) ──
  { id: "eo-tcf-t2-01", exam: "TCF", task: "T2", prepSeconds: 120, speakSeconds: 90, source: s,
    title: "Interaction : organiser une sortie avec un collègue",
    prompt: "Vous voulez organiser une sortie d'équipe. Posez des questions à votre collègue (jouez les deux moments : vos questions, puis vos propositions) : disponibilités, préférences, budget, puis proposez une activité précise.",
    structure: ["Questions disponibilités", "Questions préférences/budget", "Proposition structurée", "Confirmation"] },
  { id: "eo-tcf-t2-02", exam: "TCF", task: "T2", prepSeconds: 120, speakSeconds: 90, source: s,
    title: "Interaction : préparer un voyage",
    prompt: "Avec un ami, vous préparez trois jours à Québec. Posez vos questions (transport, logement, budget) puis faites vos suggestions de programme, en justifiant.",
    structure: ["Questions pratiques", "Suggestions jour par jour", "Justifier les choix", "Conclure sur un accord"] },
  { id: "eo-tcf-t2-03", exam: "TCF", task: "T2", prepSeconds: 120, speakSeconds: 90, source: s,
    title: "Interaction : nouveau colocataire",
    prompt: "Vous rencontrez un colocataire potentiel. Posez vos questions (habitudes, horaires, ménage, invités) puis présentez vos propres règles de vie, poliment mais clairement.",
    structure: ["Questions habitudes", "Questions organisation", "Vos règles à vous", "Prochaine étape"] },

  // ── TCF T3 — point de vue (sans préparation) ──
  { id: "eo-tcf-t3-01", exam: "TCF", task: "T3", prepSeconds: 0, speakSeconds: 120, source: s,
    title: "Point de vue : les réseaux sociaux",
    prompt: "« Les réseaux sociaux rapprochent-ils vraiment les gens ? » Donnez votre point de vue structuré : opinion, deux raisons, un exemple, une conclusion. Sans préparation, comme à l'examen.",
    structure: ["Opinion annoncée", "Raison 1", "Raison 2 + exemple", "Conclusion"] },
  { id: "eo-tcf-t3-02", exam: "TCF", task: "T3", prepSeconds: 0, speakSeconds: 120, source: s,
    title: "Point de vue : apprendre en ligne",
    prompt: "« Peut-on apprendre une langue uniquement avec des applications ? » Prenez position, développez deux arguments, donnez votre expérience personnelle et concluez.",
    structure: ["Opinion", "Argument pour/contre", "Expérience personnelle", "Conclusion nuancée"] },
  { id: "eo-tcf-t3-03", exam: "TCF", task: "T3", prepSeconds: 0, speakSeconds: 120, source: s,
    title: "Point de vue : travailler pour vivre ?",
    prompt: "« Il faut travailler pour vivre, et non vivre pour travailler. » Qu'en pensez-vous ? Opinion, raisons, exemple concret de votre entourage, conclusion.",
    structure: ["Position claire", "Raison principale", "Exemple concret", "Ouverture finale"] },
];
