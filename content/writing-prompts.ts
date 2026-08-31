/**
 * Writing bank — 25 original practice prompts (source: original
 * practice). TEF: Section A (~25 min, 80+ words) and Section B
 * (~35 min, 200+ words). TCF: 3 task types (T1 message 60–120,
 * T2 experience 120–150, T3 comparison/opinion 120–180).
 */
export interface WritingPrompt {
  id: string;
  exam: "TEF" | "TCF";
  task: "A" | "B" | "T1" | "T2" | "T3";
  title: string;
  prompt: string;
  minWords: number;
  minutes: number;
  register: "formal" | "informal" | "argument";
  checklist: string[];
  bullets: string[]; // keyword patterns "kw1|kw2" for coverage scoring
  frames: string[]; // 3 reusable phrases returned with feedback
  model: string; // model paragraph at target NCLC (estimation pédagogique)
  source: "original practice";
}

const s = "original practice" as const;

export const WRITING_PROMPTS: WritingPrompt[] = [
  // ── TEF Section A (message / short text, 80+ words, ~25 min) ──
  {
    id: "ee-tef-a-01", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "informal", source: s,
    title: "Invitation à une pendaison de crémaillère",
    prompt: "Vous venez d'emménager dans un nouvel appartement. Écrivez un message à vos amis pour les inviter à votre pendaison de crémaillère : précisez la date, l'adresse, ce qu'il faut apporter et comment venir (80 mots minimum).",
    checklist: ["Inviter clairement", "Donner la date et l'heure", "Donner l'adresse et l'accès", "Dire quoi apporter", "Ton amical"],
    bullets: ["invit|venez|joindre|fête", "samedi|dimanche|heure|h", "adresse|rue|appartement|chez moi", "apport|amenez|boisson|dessert"],
    frames: ["Je vous invite à…", "Ce serait un plaisir de vous voir…", "N'hésitez pas à me confirmer votre présence."],
    model: "Salut à tous ! Grande nouvelle : j'ai enfin emménagé dans mon nouvel appartement. Je vous invite samedi 14 juin à partir de 18 h pour pendre la crémaillère. J'habite au 45, rue des Érables, appartement 3 — le métro Laurier est à cinq minutes à pied. Apportez simplement une boisson ou un dessert, je m'occupe du reste. Confirmez-moi votre présence avant jeudi, que je prévoie assez de chaises ! À très vite, Nadia.",
  },
  {
    id: "ee-tef-a-02", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "formal", source: s,
    title: "Réclamation : commande non livrée",
    prompt: "Vous avez commandé un ordinateur en ligne il y a trois semaines ; il n'est jamais arrivé. Écrivez un courriel au service client : rappelez la commande, expliquez le problème, exprimez votre mécontentement poliment et demandez une solution (80 mots minimum).",
    checklist: ["Rappeler la commande (numéro, date)", "Exposer le problème", "Registre formel et vouvoiement", "Demander une solution précise", "Formule de politesse finale"],
    bullets: ["commande|numéro|acheté", "livr|arrivé|reçu|retard", "rembours|solution|échange|livrer", "cordialement|salutations|je vous prie"],
    frames: ["Je me permets de vous contacter au sujet de…", "Malgré mes relances, …", "Je vous prie d'agréer mes salutations distinguées."],
    model: "Madame, Monsieur, Je me permets de vous contacter au sujet de ma commande n° 58 214, passée le 2 mai sur votre site. Trois semaines plus tard, l'ordinateur n'est toujours pas livré, alors que le délai annoncé était de cinq jours. Cette situation me cause un réel préjudice, car j'en ai besoin pour travailler. Je vous demande donc soit une livraison sous 48 heures, soit le remboursement intégral. Dans l'attente de votre réponse, je vous prie d'agréer mes salutations distinguées.",
  },
  {
    id: "ee-tef-a-03", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "formal", source: s,
    title: "Excuses et report d'un rendez-vous",
    prompt: "Vous aviez rendez-vous avec votre conseillère bancaire jeudi, mais un imprévu professionnel vous en empêche. Écrivez-lui un courriel : excusez-vous, expliquez brièvement la raison, proposez deux nouvelles disponibilités (80 mots minimum).",
    checklist: ["S'excuser poliment", "Expliquer l'imprévu", "Proposer deux créneaux", "Vouvoiement", "Formule de clôture"],
    bullets: ["excuse|désolé|regret", "imprévu|réunion|travail|déplacement", "proposer|disponible|lundi|mardi|mercredi|vendredi", "cordialement|salutations"],
    frames: ["Je suis au regret de devoir reporter…", "Vous serait-il possible de…", "En vous remerciant de votre compréhension…"],
    model: "Madame Fortin, Je suis au regret de devoir reporter notre rendez-vous de jeudi 15 h : mon employeur m'envoie en déplacement à Ottawa toute la journée. Je vous prie de m'excuser pour ce contretemps. Vous serait-il possible de nous voir plutôt lundi prochain après 14 h, ou mercredi matin avant 11 h ? Je reste bien entendu flexible si un autre créneau vous convient mieux. En vous remerciant de votre compréhension, je vous adresse mes salutations distinguées. Karim Bensala",
  },
  {
    id: "ee-tef-a-04", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "formal", source: s,
    title: "Signalement d'un problème au propriétaire",
    prompt: "Depuis une semaine, le chauffage de votre appartement fonctionne mal et les températures baissent. Écrivez à votre propriétaire : décrivez le problème, rappelez ses obligations, demandez une réparation rapide et proposez des disponibilités pour la visite d'un technicien (80 mots minimum).",
    checklist: ["Décrire le problème précisément", "Demander la réparation", "Proposer des disponibilités", "Ton ferme mais poli", "Format lettre/courriel"],
    bullets: ["chauffage|température|froid|degrés", "répar|technicien|intervenir", "disponible|soir|semaine|matin", "monsieur|madame|cordialement"],
    frames: ["Je vous informe que…", "Je vous saurais gré de faire intervenir…", "Dans cette attente, …"],
    model: "Monsieur Girard, Je vous informe que le chauffage de l'appartement 8 fonctionne mal depuis le 12 janvier : la température ne dépasse pas 16 degrés le soir, malgré le thermostat au maximum. Avec les froids annoncés, la situation devient urgente. Je vous saurais gré de faire intervenir un technicien dans les meilleurs délais ; je suis disponible tous les soirs après 17 h 30 ainsi que le samedi matin. Dans cette attente, je vous prie de recevoir mes salutations distinguées. Amina Diallo",
  },
  {
    id: "ee-tef-a-05", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "informal", source: s,
    title: "Conseils à un ami qui arrive au Canada",
    prompt: "Un ami vient s'installer dans votre ville canadienne le mois prochain. Écrivez-lui un message avec trois conseils pratiques pour ses premières semaines (logement, transport, démarches) et proposez-lui votre aide (80 mots minimum).",
    checklist: ["Trois conseils concrets", "Ton chaleureux", "Proposer son aide", "Organisation claire", "Registre familier cohérent"],
    bullets: ["logement|appartement|bail|quartier", "transport|métro|bus|carte", "démarche|banque|assurance|numéro", "aide|aider|chercher|accueillir"],
    frames: ["À ta place, je commencerais par…", "Un conseil : …", "Compte sur moi pour…"],
    model: "Salut Yassine ! Trop content que tu arrives le mois prochain. Trois conseils pour bien démarrer. D'abord, le logement : vise un quartier près du métro et méfie-toi des annonces sans visite. Ensuite, prends ta carte de transport dès la première semaine, tu économiseras beaucoup. Enfin, ouvre vite un compte bancaire et demande ton numéro d'assurance sociale, tout le reste en dépend. Compte sur moi pour t'accompagner dans les démarches — et je viens te chercher à l'aéroport ! À très vite, Omar.",
  },
  {
    id: "ee-tef-a-06", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "formal", source: s,
    title: "Demande d'informations : cours du soir",
    prompt: "Vous souhaitez suivre un cours de français du soir dans un centre communautaire. Écrivez au centre pour demander des informations : horaires, niveaux offerts, tarifs, modalités d'inscription (80 mots minimum).",
    checklist: ["Se présenter et dire l'objectif", "Poser 3–4 questions précises", "Vouvoiement", "Structure claire", "Formule de politesse"],
    bullets: ["horaire|soir|heure", "niveau|débutant|intermédiaire|test", "tarif|prix|coût", "inscri|inscription|s'inscrire"],
    frames: ["Je souhaiterais obtenir des renseignements sur…", "Pourriez-vous m'indiquer…", "Je vous remercie par avance de votre réponse."],
    model: "Madame, Monsieur, Nouvellement installé dans le quartier, je souhaiterais obtenir des renseignements sur vos cours de français du soir. Pourriez-vous m'indiquer les horaires proposés en semaine, ainsi que les niveaux offerts ? Faut-il passer un test de classement avant l'inscription ? Je voudrais également connaître les tarifs de la session d'automne et savoir si l'inscription se fait en ligne ou sur place. Je vous remercie par avance de votre réponse et vous prie d'agréer mes salutations distinguées. Li Wei",
  },
  {
    id: "ee-tef-a-07", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "informal", source: s,
    title: "Raconter un imprévu de voyage",
    prompt: "Vous deviez rentrer hier d'un week-end à Toronto, mais votre autocar a été annulé. Racontez à une amie ce qui s'est passé, comment vous avez réagi et comment vous êtes finalement rentré (80 mots minimum). Utilisez le passé composé et l'imparfait.",
    checklist: ["Récit au passé (PC + imparfait)", "Chronologie claire", "Réaction personnelle", "Solution trouvée", "Ton naturel"],
    bullets: ["annulé|annulation|autocar|bus", "attendu|attendait|gare|billet", "finalement|train|covoiturage|rentré", "fatigué|soulagé|énervé|stress"],
    frames: ["Tu ne devineras jamais ce qui m'est arrivé…", "Sur le coup, …", "Finalement, tout s'est arrangé."],
    model: "Coucou Sarah ! Tu ne devineras jamais ce qui m'est arrivé hier. J'étais tranquillement à la gare de Toronto quand on a annoncé que mon autocar de 17 h était annulé — un problème mécanique. Sur le coup, j'étais paniquée : le suivant partait le lendemain matin. Heureusement, pendant que je cherchais un hôtel, une collègue m'a proposé un covoiturage. On a roulé sous la pluie, on a ri tout le trajet, et je suis rentrée à minuit, épuisée mais soulagée. Je te raconte le reste demain !",
  },
  {
    id: "ee-tef-a-08", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "formal", source: s,
    title: "Candidature spontanée courte",
    prompt: "Un café de votre quartier affiche « Personnel recherché ». Écrivez un court message de candidature au gérant : présentez-vous, décrivez votre expérience ou vos qualités, indiquez vos disponibilités et demandez un entretien (80 mots minimum).",
    checklist: ["Se présenter", "Valoriser 2–3 qualités ou expériences", "Donner ses disponibilités", "Demander un entretien", "Registre professionnel"],
    bullets: ["présent|appelle|nom", "expérience|travaillé|service|client", "disponib|soir|semaine|fin de semaine", "entretien|rencontre|rencontrer"],
    frames: ["Je me permets de vous proposer ma candidature…", "Mon expérience de … m'a appris à…", "Je me tiens à votre disposition pour un entretien."],
    model: "Monsieur, J'ai vu votre affiche « Personnel recherché » et je me permets de vous proposer ma candidature. Je m'appelle Rosa Mendoza et j'ai travaillé deux ans comme serveuse à Manille : service rapide, caisse, clientèle nombreuse. On me décrit comme ponctuelle, souriante et calme sous pression. Je suis disponible en semaine dès 15 h et toute la fin de semaine. Je me tiens à votre disposition pour un entretien au moment qui vous conviendra. Cordialement, Rosa Mendoza — 514 555 0182",
  },
  {
    id: "ee-tef-a-09", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "formal", source: s,
    title: "Objection à un changement d'horaire de garderie",
    prompt: "La garderie de votre enfant annonce qu'elle fermera désormais à 17 h au lieu de 18 h. Écrivez à la direction : expliquez les difficultés que cela crée pour vous, demandez le maintien de l'horaire actuel ou une solution de remplacement (80 mots minimum).",
    checklist: ["Exposer le problème concret", "Rester courtois", "Formuler une demande claire", "Proposer une ouverture (solution)", "Format courriel formel"],
    bullets: ["ferme|horaire|17|18", "travail|terminer|impossible|difficulté", "maintien|solution|garde|service", "madame|monsieur|cordialement"],
    frames: ["Cette décision me place dans une situation difficile car…", "Serait-il envisageable de…", "Je reste ouvert(e) à toute solution."],
    model: "Madame la Directrice, J'ai pris connaissance du nouvel horaire de fermeture à 17 h. Cette décision me place dans une situation très difficile : je termine mon travail à 17 h à Laval et ne peux matériellement pas arriver avant 17 h 45. Serait-il envisageable de maintenir la fermeture à 18 h, même deux jours par semaine, ou de proposer un service de garde prolongé payant ? Je reste ouverte à toute solution et vous remercie de l'attention portée à cette demande. Cordialement, Fatou Ndiaye",
  },
  {
    id: "ee-tef-a-10", exam: "TEF", task: "A", minWords: 80, minutes: 25, register: "informal", source: s,
    title: "Organiser une sortie de groupe",
    prompt: "Vous organisez une randonnée dimanche avec des collègues. Écrivez un message au groupe : proposez le lieu et l'heure de rendez-vous, décrivez le niveau de difficulté, indiquez quoi apporter et demandez une confirmation (80 mots minimum).",
    checklist: ["Lieu + heure de rendez-vous", "Difficulté et durée", "Liste de matériel", "Demande de confirmation", "Ton entraînant"],
    bullets: ["dimanche|rendez-vous|heure|h", "sentier|mont|difficulté|facile|km", "apport|eau|chaussures|lunch", "confirm|répond|dites-moi"],
    frames: ["Qui est partant pour… ?", "Prévoyez…", "Dites-moi avant … si vous venez."],
    model: "Salut l'équipe ! Qui est partant pour une randonnée dimanche au mont Saint-Bruno ? Rendez-vous à 9 h au stationnement principal — covoiturage possible depuis le bureau à 8 h 15. Le sentier fait 9 km, niveau facile à moyen : comptez trois heures avec les pauses. Prévoyez de bonnes chaussures, 1,5 litre d'eau, un lunch et une couche chaude pour le sommet. Dites-moi avant vendredi soir si vous venez, que j'organise les voitures. Ça va nous faire du bien ! Marc",
  },

  // ── TEF Section B (argument, 200+ words, ~35 min) ──
  {
    id: "ee-tef-b-01", exam: "TEF", task: "B", minWords: 200, minutes: 35, register: "argument", source: s,
    title: "Lettre au maire : sauver la bibliothèque",
    prompt: "La mairie veut fermer la bibliothèque municipale pour construire un stationnement. Écrivez une lettre au maire pour vous y opposer : annoncez votre position, développez deux arguments avec exemples, faites une concession, proposez une alternative et concluez (200 mots minimum).",
    checklist: ["Position claire dès l'ouverture", "Deux arguments + exemples", "Une concession (« certes… mais »)", "Une proposition alternative", "Conclusion + formule de politesse"],
    bullets: ["oppos|contre|désaccord|protest", "bibliothèque|culture|livre|étudiant", "stationnement|voiture|parking", "propos|alternative|solution|suggère"],
    frames: ["Je vous écris pour exprimer mon profond désaccord avec…", "Certes, …, mais…", "C'est pourquoi je vous demande de…"],
    model: "Monsieur le Maire, Je vous écris pour exprimer mon profond désaccord avec le projet de fermeture de la bibliothèque municipale. D'abord, la bibliothèque est le seul lieu d'étude gratuit du quartier : chaque soir, des dizaines d'élèves y font leurs devoirs, et des nouveaux arrivants y suivent des ateliers de français. Ensuite, un stationnement attirera davantage de voitures au centre, alors que la ville dit vouloir réduire la circulation. Certes, le manque de places est un problème réel pour les commerçants ; mais il existe une alternative : agrandir le stationnement souterrain de la place du Marché, sous-utilisé le soir. C'est pourquoi je vous demande de suspendre ce projet et d'organiser une consultation publique. Veuillez agréer, Monsieur le Maire, l'expression de ma considération distinguée.",
  },
  {
    id: "ee-tef-b-02", exam: "TEF", task: "B", minWords: 200, minutes: 35, register: "argument", source: s,
    title: "Courrier des lecteurs : le télétravail",
    prompt: "Un journal affirme que « le télétravail détruit l'esprit d'équipe ». Écrivez au courrier des lecteurs pour donner votre opinion, nuancée : thèse, deux arguments illustrés, concession, conclusion (200 mots minimum).",
    checklist: ["Thèse annoncée", "Deux arguments + exemples", "Concession", "Connecteurs variés", "Conclusion nette"],
    bullets: ["télétravail|distance|maison|bureau", "équipe|collègue|collaboration|lien", "avis|pense|convaincu|selon moi", "conclusion|en somme|pour conclure"],
    frames: ["Permettez-moi de nuancer cette affirmation.", "L'expérience montre au contraire que…", "En somme, le problème n'est pas…, mais…"],
    model: "Madame, Monsieur, Votre éditorial affirme que le télétravail détruit l'esprit d'équipe. Permettez-moi de nuancer cette affirmation. D'une part, l'esprit d'équipe ne dépend pas des murs : mon service, à distance trois jours par semaine, n'a jamais été aussi solidaire, car nous avons appris à documenter notre travail et à nous entraider par écrit. D'autre part, le télétravail élargit l'équipe elle-même : nous avons recruté une collègue en région, impossible autrement. Certes, les liens informels — la pause café, les conversations de couloir — s'affaiblissent, et il faut les recréer volontairement, par exemple avec une journée commune hebdomadaire. En somme, le problème n'est pas la distance, mais l'absence de méthode. Le télétravail ne détruit pas l'esprit d'équipe ; il révèle les équipes qui n'en avaient pas. Veuillez agréer mes salutations distinguées.",
  },
  {
    id: "ee-tef-b-03", exam: "TEF", task: "B", minWords: 200, minutes: 35, register: "argument", source: s,
    title: "Répondre à une annonce : semaine de 4 jours",
    prompt: "Votre entreprise consulte les employés sur le passage à la semaine de quatre jours (mêmes heures, réparties différemment). Écrivez à la direction pour défendre votre position : deux arguments développés, une objection anticipée et réfutée, une recommandation finale (200 mots minimum).",
    checklist: ["Position explicite", "Deux arguments développés", "Objection anticipée + réponse", "Recommandation concrète", "Registre professionnel"],
    bullets: ["quatre jours|4 jours|semaine", "productivité|concentration|fatigue|équilibre", "client|service|couverture|horaires", "recommand|propose|suggère|essai"],
    frames: ["Je soutiens cette proposition pour deux raisons.", "On objectera que… ; pourtant…", "Je recommande donc un essai de trois mois."],
    model: "Madame la Directrice, Je soutiens le passage à la semaine de quatre jours, pour deux raisons. Premièrement, la concentration : nos journées actuelles se diluent en réunions ; des journées plus longues mais moins nombreuses créeraient de vrais blocs de travail profond, comme l'ont constaté les entreprises pilotes au Royaume-Uni. Deuxièmement, l'équilibre : un jour de semaine libéré réduit les absences pour rendez-vous médicaux et démarches, aujourd'hui prises sur le temps de travail. On objectera que nos clients exigent une présence du lundi au vendredi ; pourtant, il suffit d'alterner les jours de repos par équipe pour maintenir la couverture — le service serait même renforcé aux heures de pointe. Je recommande donc un essai de trois mois, mesuré par nos indicateurs habituels, avant toute décision définitive. Veuillez recevoir mes salutations respectueuses.",
  },
  {
    id: "ee-tef-b-04", exam: "TEF", task: "B", minWords: 200, minutes: 35, register: "argument", source: s,
    title: "Forum : faut-il interdire les voitures au centre-ville ?",
    prompt: "Votre ville envisage d'interdire les voitures dans le centre historique. Rédigez une contribution argumentée au forum citoyen : position, deux arguments avec exemples, concession, proposition d'accompagnement (200 mots minimum).",
    checklist: ["Position dès l'introduction", "Arguments illustrés", "Concession honnête", "Mesure d'accompagnement", "Conclusion"],
    bullets: ["voiture|circulation|piéton|centre", "pollution|bruit|air|sécurité", "commerce|livraison|accès|résident", "propos|navette|stationnement|gratuit"],
    frames: ["Je suis favorable à cette mesure, à une condition.", "L'exemple de … le prouve : …", "Sans cet accompagnement, la mesure échouera."],
    model: "Je suis favorable à la piétonnisation du centre historique, à une condition que je préciserai. D'abord, l'argument sanitaire est décisif : nos rues étroites concentrent le bruit et les gaz d'échappement à hauteur d'enfant ; les capteurs de la rue Principale dépassent les seuils recommandés un jour sur trois. Ensuite, l'expérience des villes comparables le prouve : à Chambéry comme à Burlington, la fréquentation des commerces a augmenté après la piétonnisation, car un passant flâne, un conducteur passe. Certes, les résidents, les livreurs et les personnes à mobilité réduite doivent garder un accès : personne ne défend un centre muséifié. C'est pourquoi la mesure doit s'accompagner de navettes électriques gratuites, de stationnements de périphérie et de créneaux de livraison le matin. Sans cet accompagnement, la mesure échouera et discréditera l'idée même. Avec lui, nous rendrons le centre aux habitants.",
  },
  {
    id: "ee-tef-b-05", exam: "TEF", task: "B", minWords: 200, minutes: 35, register: "argument", source: s,
    title: "Lettre à la commission scolaire : le téléphone à l'école",
    prompt: "La commission scolaire propose d'interdire totalement les téléphones à l'école secondaire. Écrivez-lui votre avis argumenté : position nuancée, deux arguments, un contre-argument traité, une proposition concrète (200 mots minimum).",
    checklist: ["Position nuancée assumée", "Deux arguments", "Contre-argument traité", "Proposition concrète", "Registre formel"],
    bullets: ["téléphone|écran|portable", "concentration|apprentissage|classe|résultat", "urgence|parent|sécurité|contact", "propos|casier|règle|éducation"],
    frames: ["Mon avis est favorable, avec une réserve importante.", "Les études convergent : …", "Plutôt que d'interdire sans expliquer, je propose…"],
    model: "Madame, Monsieur, Mon avis sur l'interdiction des téléphones est favorable, avec une réserve importante. D'abord, les études convergent : la simple présence du téléphone sur le bureau réduit l'attention, même éteint. Les enseignants de votre propre réseau témoignent d'élèves qui vérifient leurs notifications trente fois par heure. Ensuite, l'interdiction protège les élèves les plus fragiles du cyberharcèlement pendant les heures de classe, seul moment où l'école peut réellement agir. J'entends l'objection des parents : pouvoir joindre son enfant en cas d'urgence est légitime. Mais le secrétariat a toujours rempli ce rôle, et des casiers sécurisés permettent de récupérer l'appareil à la sortie. Ma réserve est ailleurs : interdire sans éduquer déplace le problème au domicile. Je propose donc de coupler l'interdiction à un cours obligatoire d'hygiène numérique, animé chaque trimestre. Veuillez agréer mes salutations distinguées.",
  },
  {
    id: "ee-tef-b-06", exam: "TEF", task: "B", minWords: 200, minutes: 35, register: "argument", source: s,
    title: "Employeur : répondre à l'interdiction du vélo au bureau",
    prompt: "Votre employeur veut supprimer le local à vélos pour agrandir les archives. Écrivez une lettre collective au nom des employés cyclistes : désaccord courtois, deux arguments (santé/ponctualité, image de l'entreprise), concession et solution (200 mots minimum).",
    checklist: ["Écrire au nom d'un collectif", "Deux arguments distincts", "Concession", "Solution réaliste", "Ton professionnel"],
    bullets: ["vélo|cycliste|local", "santé|forme|ponctualité|retard", "image|environnement|engagement|valeurs", "solution|conteneur|sous-sol|propos"],
    frames: ["Au nom des … employés concernés, …", "Cette décision enverrait un signal contraire à…", "Nous proposons une solution simple : …"],
    model: "Madame la Directrice des ressources humaines, Au nom des vingt-trois employés qui viennent à vélo, nous souhaitons exprimer notre désaccord courtois avec la suppression du local à vélos. Premièrement, ce local soutient directement la performance : les cyclistes affichent moins de retards — aucun embouteillage ne les arrête — et les assureurs le confirment, moins d'absences maladie. Deuxièmement, l'entreprise communique fièrement sur son plan climat ; supprimer le seul équipement de mobilité durable enverrait un signal contraire à nos valeurs affichées, y compris auprès des candidats que nous recrutons. Nous comprenons, cela dit, le besoin réel d'espace pour les archives : personne ne le conteste. Nous proposons une solution simple : déplacer les supports à vélos dans la zone inutilisée du stationnement souterrain, moyennant un marquage au sol et deux caméras existantes. Le coût est minime, l'espace libéré identique. Nous restons disponibles pour en discuter. Salutations respectueuses, Le collectif vélo",
  },
  {
    id: "ee-tef-b-07", exam: "TEF", task: "B", minWords: 200, minutes: 35, register: "argument", source: s,
    title: "Magazine : apprendre une langue à l'âge adulte",
    prompt: "Un magazine prétend qu'« après 30 ans, il est trop tard pour bien apprendre une langue ». Répondez par un texte argumenté nourri de votre expérience : thèse contraire, deux arguments dont un exemple personnel, concession scientifique, conclusion encourageante (200 mots minimum).",
    checklist: ["Thèse contraire assumée", "Exemple personnel développé", "Concession", "Conclusion encourageante", "Connecteurs riches"],
    bullets: ["langue|apprendre|français|adulte", "expérience|moi-même|mon cas|témoign", "cerveau|mémoire|accent|enfant", "conclusion|preuve|possible|jamais trop tard"],
    frames: ["Cette affirmation mérite d'être contestée.", "J'en suis moi-même la preuve : …", "La vraie question n'est pas l'âge, mais…"],
    model: "« Après 30 ans, trop tard pour bien apprendre une langue » : cette affirmation mérite d'être contestée, et j'en suis moi-même la preuve. J'ai commencé le français à 34 ans, entre un emploi à temps plein et deux enfants ; trois ans plus tard, je travaille en français et j'écris ce texte. Premier argument : l'adulte dispose d'atouts que l'enfant n'a pas — il connaît déjà la grammaire d'une langue, sait organiser son temps et relie chaque mot nouveau à un besoin réel, ce qui ancre la mémoire. Deuxième argument : les outils actuels, répétition espacée et pratique orale quotidienne, compensent largement la baisse de plasticité. Certes, la science est claire sur un point : l'accent parfait appartient à l'enfance, et une partie de la prononciation restera marquée. Mais l'examen, l'employeur et le voisin ne demandent pas la perfection ; ils demandent la clarté. La vraie question n'est donc pas l'âge, mais la méthode et la régularité. À 30, 40 ou 50 ans, la porte est ouverte.",
  },
  {
    id: "ee-tef-b-08", exam: "TEF", task: "B", minWords: 200, minutes: 35, register: "argument", source: s,
    title: "Conseil municipal : caméras de surveillance au parc",
    prompt: "Après des actes de vandalisme, la ville veut installer des caméras dans le parc du quartier. Écrivez au conseil municipal votre position argumentée : deux arguments, prise en compte sérieuse de la position adverse, proposition d'évaluation (200 mots minimum).",
    checklist: ["Position claire", "Arguments équilibrés", "Position adverse traitée avec respect", "Clause d'évaluation", "Formules formelles"],
    bullets: ["caméra|surveillance|vidéo", "vandalisme|sécurité|dégrad|incivilité", "vie privée|liberté|données|dérive", "évalu|bilan|an|comité"],
    frames: ["Ma position est mesurée : oui, mais sous conditions.", "Les partisans du refus ont raison sur un point : …", "Je demande qu'un bilan public soit présenté après un an."],
    model: "Mesdames et Messieurs les conseillers, Ma position sur les caméras du parc Lafontaine est mesurée : oui, mais sous conditions strictes. D'une part, la situation actuelle pénalise d'abord les familles : jeux incendiés en juin, module fermé deux mois, et des parents qui évitent désormais le parc après 19 h. La dissuasion, imparfaite, existe : les dégradations ont chuté de moitié au parc Riverain équipé l'an dernier. D'autre part, le coût des réparations — 40 000 $ cette année — ampute le budget des activités jeunesse, premières victimes du vandalisme. Les opposants ont cependant raison sur un point essentiel : filmer un lieu de détente touche à la vie privée, et les dérives sont documentées ailleurs. C'est pourquoi je conditionne mon accord à trois garanties : zones filmées limitées aux équipements, effacement des images sous sept jours, et interdiction de toute reconnaissance faciale. Enfin, je demande qu'un bilan public soit présenté après un an ; si la dissuasion n'est pas démontrée, les caméras devront être retirées. Veuillez agréer l'expression de ma considération distinguée.",
  },

  // ── TCF (3 task types) ──
  {
    id: "ee-tcf-t1-01", exam: "TCF", task: "T1", minWords: 60, minutes: 12, register: "informal", source: s,
    title: "Message : décrire son nouveau quartier",
    prompt: "Vous venez de déménager. Écrivez un message à un ami : décrivez votre nouveau quartier (commerces, transports, ambiance) et invitez-le à venir vous voir (60 à 120 mots).",
    checklist: ["Décrire le quartier (2–3 détails)", "Inviter l'ami", "Registre amical", "Longueur 60–120 mots"],
    bullets: ["quartier|rue|coin", "commerce|café|marché|métro|parc", "invit|viens|passer|visite"],
    frames: ["Je me plais beaucoup ici parce que…", "Tu verrais le… !", "Viens quand tu veux, le canapé t'attend."],
    model: "Salut Thomas ! Ça y est, je suis installée dans Rosemont et je me plais déjà beaucoup ici. Le quartier est vivant sans être bruyant : un marché le samedi au coin de la rue, trois cafés où travailler, et le métro à sept minutes à pied. Le soir, tout le monde se retrouve au parc Molson — tu verrais l'ambiance ! Viens passer une fin de semaine quand tu veux, le canapé t'attend. Dis-moi tes disponibilités en mars. Bises, Elena",
  },
  {
    id: "ee-tcf-t1-02", exam: "TCF", task: "T1", minWords: 60, minutes: 12, register: "informal", source: s,
    title: "Message : annuler et reproposer",
    prompt: "Vous deviez aider un ami à déménager samedi, mais vous êtes malade. Écrivez-lui : excusez-vous, expliquez, proposez une autre forme d'aide (60 à 120 mots).",
    checklist: ["S'excuser", "Expliquer la raison", "Proposer une compensation", "Ton chaleureux"],
    bullets: ["désolé|excuse|pardon", "malade|fièvre|grippe|médecin", "propos|dimanche|cartons|aider autrement"],
    frames: ["Je suis vraiment désolé de te faire faux bond…", "Pour me rattraper, …", "Bon courage pour samedi !"],
    model: "Salut Malik, je suis vraiment désolé de te faire faux bond : je suis cloué au lit avec une bonne grippe et 39 de fièvre, le médecin m'interdit de porter quoi que ce soit samedi. Pour me rattraper, je te propose deux choses : je viens dimanche t'aider à déballer les cartons et monter les meubles, et je t'apporte un souper maison pour ta première soirée là-bas. Bon courage pour samedi, et envoie-moi la nouvelle adresse ! Amitiés, Pablo",
  },
  {
    id: "ee-tcf-t1-03", exam: "TCF", task: "T1", minWords: 60, minutes: 12, register: "informal", source: s,
    title: "Message : demander un service",
    prompt: "Vous partez une semaine en voyage. Écrivez à votre voisine pour lui demander d'arroser vos plantes et de relever votre courrier : donnez les consignes et proposez de lui rendre la pareille (60 à 120 mots).",
    checklist: ["Demander poliment le service", "Donner des consignes simples", "Proposer la réciprocité", "Remercier"],
    bullets: ["arros|plante|courrier|boîte", "semaine|voyage|absent|clé", "revanche|pareille|rendre|merci"],
    frames: ["Est-ce que je peux te demander un petit service ?", "Rien de compliqué : …", "À charge de revanche, évidemment !"],
    model: "Bonjour Claire ! Est-ce que je peux te demander un petit service ? Je pars à Vancouver du 3 au 10 mai. Pourrais-tu arroser mes plantes et relever mon courrier pendant la semaine ? Rien de compliqué : un verre d'eau pour les plantes du salon le mercredi, et le basilic de la cuisine tous les deux jours. Je te laisserais la clé mardi soir. À charge de revanche, évidemment — je garde ton chat cet été si tu veux ! Merci mille fois. Antoine",
  },
  {
    id: "ee-tcf-t2-01", exam: "TCF", task: "T2", minWords: 120, minutes: 20, register: "informal", source: s,
    title: "Récit d'expérience : un défi que vous avez relevé",
    prompt: "Pour le blogue de votre association, racontez une expérience où vous avez surmonté une difficulté (déménagement, nouvel emploi, apprentissage…). Décrivez la situation, vos actions, le résultat et ce que vous avez appris (120 à 150 mots).",
    checklist: ["Situation initiale claire", "Actions au passé composé/imparfait", "Résultat", "Leçon tirée"],
    bullets: ["défi|difficile|difficulté|peur", "j'ai décidé|j'ai commencé|j'ai appris", "résultat|réussi|aujourd'hui", "leçon|appris que|retenu"],
    frames: ["Au début, cela semblait impossible.", "Petit à petit, …", "Cette expérience m'a appris que…"],
    model: "Il y a deux ans, j'ai accepté un poste où toutes les réunions se déroulaient en français. Au début, cela semblait impossible : je comprenais une phrase sur trois et je n'osais pas parler. J'ai décidé d'attaquer le problème méthodiquement. Chaque matin, j'écoutais vingt minutes de radio en prenant des notes ; chaque réunion, je me forçais à poser au moins une question. Petit à petit, les mots isolés sont devenus des phrases, puis des idées. Six mois plus tard, j'ai animé ma première réunion seule — les mains moites, mais jusqu'au bout. Aujourd'hui, le français est ma langue de travail. Cette expérience m'a appris que le courage n'est pas l'absence de peur : c'est vingt minutes par jour, même fatiguée, même découragée.",
  },
  {
    id: "ee-tcf-t2-02", exam: "TCF", task: "T2", minWords: 120, minutes: 20, register: "informal", source: s,
    title: "Récit d'expérience : une rencontre marquante",
    prompt: "Racontez pour un journal local une rencontre qui a changé votre regard sur votre ville d'accueil : le contexte, la personne, ce qui s'est passé, ce que cela a changé pour vous (120 à 150 mots).",
    checklist: ["Contexte posé", "Portrait bref de la personne", "Événement raconté", "Changement expliqué"],
    bullets: ["rencontré|rencontre|connu", "ville|quartier|accueil|arrivée", "depuis|changé|grâce à", "il|elle m'a"],
    frames: ["Tout a commencé par un hasard : …", "Ce jour-là, …", "Depuis, je vois la ville autrement."],
    model: "Tout a commencé par un hasard : une tempête de neige, mon premier hiver, et moi, bloquée à l'arrêt de bus avec des sacs d'épicerie. Un monsieur d'environ soixante-dix ans, casquette des Canadiens vissée sur la tête, m'a proposé de m'abriter dans le café d'en face. Ce jour-là, Gilles m'a raconté cinquante ans de vie du quartier : l'usine fermée, la rivière nettoyée, les nouveaux arrivants de chaque décennie. Il m'a surtout posé des questions — d'où je venais, ce qui me manquait. Nous prenons maintenant un café chaque jeudi ; il corrige mon français, je lui montre la cuisine de mon pays. Depuis cette rencontre, je vois la ville autrement : non plus comme un décor étranger, mais comme une histoire dont je fais désormais partie.",
  },
  {
    id: "ee-tcf-t3-01", exam: "TCF", task: "T3", minWords: 120, minutes: 25, register: "argument", source: s,
    title: "Opinion : vivre en ville ou en région ?",
    prompt: "Un forum pose la question : « Pour une famille de nouveaux arrivants, vaut-il mieux s'installer dans une grande ville ou en région ? » Comparez les deux options puis donnez votre opinion justifiée (120 à 180 mots).",
    checklist: ["Comparer les deux options", "Prendre position", "Justifier avec 2 raisons", "Conclusion nette"],
    bullets: ["ville|métropole|Montréal", "région|petite ville|campagne", "d'un côté|de l'autre|tandis que", "à mon avis|selon moi|je pense"],
    frames: ["D'un côté…, de l'autre…", "Tout dépend de…, mais…", "Mon choix est fait : …"],
    model: "D'un côté, la grande ville offre aux nouveaux arrivants un filet de sécurité : communautés déjà installées, services d'accueil nombreux, marché de l'emploi profond. De l'autre, la région promet un logement deux fois moins cher, des listes d'attente plus courtes à la garderie et une intégration souvent plus rapide — quand on est peu nombreux, on se parle. Tout dépend donc du profil : sans réseau professionnel, la métropole rassure. Mais pour une famille, mon choix est fait : la région l'emporte. D'abord, le coût du logement décide de tout le reste ; économiser 800 dollars par mois, c'est du temps parental et des cours de français payés. Ensuite, l'immersion linguistique y est réelle : impossible de vivre uniquement dans sa langue d'origine, et les enfants deviennent francophones en une année scolaire. La ville éblouit, la région enracine — et une famille a d'abord besoin de racines.",
  },
  {
    id: "ee-tcf-t3-02", exam: "TCF", task: "T3", minWords: 120, minutes: 25, register: "argument", source: s,
    title: "Opinion : acheter neuf ou d'occasion ?",
    prompt: "Votre entourage se divise : certains n'achètent que du neuf, d'autres presque tout d'occasion. Présentez les deux points de vue, puis défendez le vôtre avec deux arguments et un exemple (120 à 180 mots).",
    checklist: ["Deux points de vue présentés", "Position personnelle", "Deux arguments + exemple", "Connecteurs de comparaison"],
    bullets: ["neuf|garantie|magasin", "occasion|seconde main|usagé", "économi|écolog|budget|déchet", "par exemple|exemple|mon"],
    frames: ["Les partisans du neuf invoquent…", "Pour ma part, …", "L'exemple le plus parlant : …"],
    model: "Les partisans du neuf invoquent la garantie, l'hygiène et le plaisir d'étrenner un objet impeccable ; ceux de l'occasion répondent budget, écologie et charme de l'objet qui a vécu. Pour ma part, je penche nettement pour la seconde main, avec deux exceptions que j'assume : la literie et la sécurité des enfants. Premier argument, l'économie : meubler notre appartement d'occasion nous a coûté 900 dollars au lieu des 4 000 estimés en magasin — la différence a financé nos cours de français. Deuxième argument, l'environnement : chaque meuble réutilisé, c'est de la production et du transport évités, au moment où les décharges débordent d'objets quasi neufs. L'exemple le plus parlant : notre table de cuisine, massive, achetée 60 dollars à une dame qui déménageait ; dix ans qu'elle sert, et elle survivra à toutes les tables en aggloméré. Acheter d'occasion, ce n'est pas se priver : c'est payer le juste prix des choses.",
  },
];
