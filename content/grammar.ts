/**
 * Basic grammar as exam fuel — être & avoir first (the two verbs that
 * carry the passé composé, descriptions, and half of every exam task),
 * plus aller and faire. Tables + drills; every drill answer explains why.
 * Source: original practice.
 */
export interface GrammarTopic {
  id: string;
  title: string;
  titleEn: string;
  fr: string;
  en: string;
  tables: { tense: string; tenseEn: string; forms: [string, string, string, string, string, string] }[];
}

export interface GrammarItem {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  answer: number;
  why: string; // FR
  whyEn: string;
}

const P = ["je / j'", "tu", "il · elle · on", "nous", "vous", "ils · elles"] as const;
export const PERSONS = P;

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: "etre",
    title: "Être — le verbe de l'identité",
    titleEn: "Être (to be) — the identity verb",
    fr: "Être décrit qui vous êtes et où vous en êtes : « Je suis candidat au TEF. » Il sert aussi d'auxiliaire au passé composé pour les verbes de déplacement et les pronominaux : « Elle est arrivée », « Je me suis inscrit ».",
    en: "Être describes who and where you are: “Je suis candidat au TEF.” It is also the passé-composé auxiliary for movement and reflexive verbs: “Elle est arrivée”, “Je me suis inscrit”.",
    tables: [
      { tense: "Présent", tenseEn: "Present", forms: ["suis", "es", "est", "sommes", "êtes", "sont"] },
      { tense: "Imparfait", tenseEn: "Imperfect", forms: ["étais", "étais", "était", "étions", "étiez", "étaient"] },
      { tense: "Futur simple", tenseEn: "Simple future", forms: ["serai", "seras", "sera", "serons", "serez", "seront"] },
      { tense: "Subjonctif présent", tenseEn: "Present subjunctive", forms: ["sois", "sois", "soit", "soyons", "soyez", "soient"] },
    ],
  },
  {
    id: "avoir",
    title: "Avoir — le verbe de la possession",
    titleEn: "Avoir (to have) — the possession verb",
    fr: "Avoir exprime la possession, l'âge et les sensations : « J'ai 32 ans », « J'ai besoin d'un NCLC 7 ». C'est l'auxiliaire du passé composé pour la grande majorité des verbes : « J'ai fini », « Nous avons décidé ».",
    en: "Avoir expresses possession, age and sensations: “J'ai 32 ans”, “J'ai besoin d'un NCLC 7”. It is the passé-composé auxiliary for most verbs: “J'ai fini”, “Nous avons décidé”.",
    tables: [
      { tense: "Présent", tenseEn: "Present", forms: ["ai", "as", "a", "avons", "avez", "ont"] },
      { tense: "Imparfait", tenseEn: "Imperfect", forms: ["avais", "avais", "avait", "avions", "aviez", "avaient"] },
      { tense: "Futur simple", tenseEn: "Simple future", forms: ["aurai", "auras", "aura", "aurons", "aurez", "auront"] },
      { tense: "Subjonctif présent", tenseEn: "Present subjunctive", forms: ["aie", "aies", "ait", "ayons", "ayez", "aient"] },
    ],
  },
  {
    id: "aller-faire",
    title: "Aller & faire — les indispensables",
    titleEn: "Aller (to go) & faire (to do/make) — the essentials",
    fr: "Aller donne le futur proche (« je vais étudier ») et faire couvre mille usages (« faire une demande », « il fait froid »). Deux irréguliers à connaître par cœur.",
    en: "Aller gives the near future (“je vais étudier”) and faire covers countless uses (“faire une demande”, “il fait froid”). Two irregulars to know cold.",
    tables: [
      { tense: "Aller — présent", tenseEn: "Aller — present", forms: ["vais", "vas", "va", "allons", "allez", "vont"] },
      { tense: "Faire — présent", tenseEn: "Faire — present", forms: ["fais", "fais", "fait", "faisons", "faites", "font"] },
    ],
  },
  {
    id: "auxiliaire",
    title: "Être ou avoir ? L'auxiliaire du passé composé",
    titleEn: "Être or avoir? Choosing the passé-composé auxiliary",
    fr: "Avoir pour presque tout. Être pour les verbes de déplacement/changement (aller, venir, arriver, partir, monter, descendre, naître, mourir, rester, tomber, entrer, sortir, retourner, devenir…) et tous les pronominaux (se lever, s'inscrire…). Avec être, le participe s'accorde avec le sujet.",
    en: "Avoir for almost everything. Être for movement/change verbs (aller, venir, arriver, partir, naître, mourir, rester, tomber…) and all reflexives (se lever, s'inscrire…). With être, the participle agrees with the subject.",
    tables: [],
  },
];

const g = (id: string, topicId: string, question: string, options: string[], answer: number, why: string, whyEn: string): GrammarItem =>
  ({ id, topicId, question, options, answer, why, whyEn });

export const GRAMMAR_ITEMS: GrammarItem[] = [
  // être — présent & temps
  g("gr-01", "etre", "Nous ___ prêts pour l'examen.", ["sommes", "êtes", "sont", "suis"], 0, "Nous → sommes.", "Nous → sommes."),
  g("gr-02", "etre", "Vous ___ inscrit au TEF ou au TCF ?", ["êtes", "es", "est", "sont"], 0, "Vous → êtes, toujours.", "Vous → êtes, always."),
  g("gr-03", "etre", "Elles ___ arrivées hier soir.", ["sont", "ont", "sommes", "est"], 0, "Verbe de déplacement (arriver) → être ; elles → sont + accord « arrivées ».", "Movement verb (arriver) → être; elles → sont, participle agrees."),
  g("gr-04", "etre", "Quand j'étais petit, je ___ timide.", ["étais", "suis", "serai", "étions"], 0, "Description dans le passé → imparfait : j'étais.", "Past description → imperfect: j'étais."),
  g("gr-05", "etre", "Demain, nous ___ à Montréal.", ["serons", "sommes", "étions", "serez"], 0, "« Demain » → futur simple : nous serons.", "“Demain” → simple future: nous serons."),
  g("gr-06", "etre", "Il faut que vous ___ à l'heure le jour de l'examen.", ["soyez", "êtes", "serez", "étiez"], 0, "« Il faut que » exige le subjonctif : que vous soyez.", "“Il faut que” requires the subjunctive: que vous soyez."),
  g("gr-07", "etre", "On ___ en retard à cause du métro.", ["est", "sont", "es", "êtes"], 0, "On se conjugue comme il/elle → est.", "On conjugates like il/elle → est."),
  g("gr-08", "etre", "Tu ___ sûr de ta réponse ?", ["es", "est", "êtes", "sois"], 0, "Tu → es (sans t).", "Tu → es (no t)."),

  // avoir — présent & temps
  g("gr-09", "avoir", "J'___ deux questions sur le bail.", ["ai", "as", "a", "aie"], 0, "Je → ai : j'ai.", "Je → ai: j'ai."),
  g("gr-10", "avoir", "Ils ___ rendez-vous à 14 h.", ["ont", "sont", "avons", "a"], 0, "Ils → ont. (« sont » = être !)", "Ils → ont. (“sont” is être!)"),
  g("gr-11", "avoir", "Nous ___ besoin d'une preuve d'adresse.", ["avons", "avez", "ont", "sommes"], 0, "Nous → avons ; « avoir besoin de » est une expression figée.", "Nous → avons; “avoir besoin de” is a fixed expression."),
  g("gr-12", "avoir", "Elle ___ 29 ans.", ["a", "est", "as", "ait"], 0, "L'âge se dit avec AVOIR en français : elle a 29 ans.", "Age uses AVOIR in French: elle a 29 ans."),
  g("gr-13", "avoir", "Avant, j'___ peur de parler au téléphone.", ["avais", "ai", "aurai", "aie"], 0, "« Avant » + habitude passée → imparfait : j'avais.", "“Avant” + past habit → imperfect: j'avais."),
  g("gr-14", "avoir", "Vous ___ la réponse la semaine prochaine.", ["aurez", "avez", "aviez", "ayez"], 0, "« La semaine prochaine » → futur : vous aurez.", "“Next week” → future: vous aurez."),
  g("gr-15", "avoir", "Bien que nous ___ peu de temps, nous pratiquons chaque jour.", ["ayons", "avons", "aurons", "avions"], 0, "« Bien que » + subjonctif : que nous ayons.", "“Bien que” + subjunctive: que nous ayons."),
  g("gr-16", "avoir", "Tu ___ raison, ce quartier est parfait.", ["as", "a", "es", "ais"], 0, "Tu → as ; « avoir raison » = to be right.", "Tu → as; “avoir raison” = to be right."),

  // aller & faire
  g("gr-17", "aller-faire", "Nous ___ visiter l'appartement samedi.", ["allons", "vont", "allez", "faisons"], 0, "Futur proche : aller (nous allons) + infinitif.", "Near future: aller (nous allons) + infinitive."),
  g("gr-18", "aller-faire", "Comment ___ -vous ?", ["allez", "avez", "êtes", "faites"], 0, "« Comment allez-vous ? » — la formule utilise ALLER.", "“Comment allez-vous?” uses ALLER."),
  g("gr-19", "aller-faire", "Ils ___ leurs devoirs chaque soir.", ["font", "vont", "faisent", "faites"], 0, "Ils → font. « Faisent » n'existe pas !", "Ils → font. “Faisent” does not exist!"),
  g("gr-20", "aller-faire", "Vous ___ une demande de permis ?", ["faites", "fais", "font", "allez"], 0, "Vous → faites ; « faire une demande » = to apply.", "Vous → faites; “faire une demande” = to apply."),
  g("gr-21", "aller-faire", "Il ___ froid à Québec en janvier.", ["fait", "est", "a", "va"], 0, "La météo se dit avec FAIRE : il fait froid.", "Weather uses FAIRE: il fait froid."),
  g("gr-22", "aller-faire", "Je ___ au centre d'examen en métro.", ["vais", "va", "vas", "fais"], 0, "Je → vais.", "Je → vais."),

  // auxiliaire être/avoir au passé composé
  g("gr-23", "auxiliaire", "Hier, j'___ fini la tâche B en 30 minutes.", ["ai", "suis", "avais", "étais"], 0, "Finir → auxiliaire AVOIR : j'ai fini.", "Finir → auxiliary AVOIR: j'ai fini."),
  g("gr-24", "auxiliaire", "Elle ___ partie avant la fin.", ["est", "a", "ai", "es"], 0, "Partir = déplacement → ÊTRE, et le participe s'accorde : partie.", "Partir = movement → ÊTRE, participle agrees: partie."),
  g("gr-25", "auxiliaire", "Nous ___ reçu la convocation ce matin.", ["avons", "sommes", "ont", "êtes"], 0, "Recevoir → AVOIR : nous avons reçu.", "Recevoir → AVOIR: nous avons reçu."),
  g("gr-26", "auxiliaire", "Ils ___ restés deux ans à Lyon.", ["sont", "ont", "sommes", "avaient"], 0, "Rester → ÊTRE (malgré l'absence de mouvement — piège classique !) : ils sont restés.", "Rester → ÊTRE (despite no movement — classic trap!): ils sont restés."),
  g("gr-27", "auxiliaire", "Je me ___ inscrite au TCF la semaine dernière.", ["suis", "ai", "es", "était"], 0, "Verbe pronominal (s'inscrire) → toujours ÊTRE : je me suis inscrite.", "Reflexive verb (s'inscrire) → always ÊTRE: je me suis inscrite."),
  g("gr-28", "auxiliaire", "Vous ___ passé l'examen où ?", ["avez", "êtes", "avons", "était"], 0, "« Passer un examen » (transitif) → AVOIR : vous avez passé.", "“Passer un examen” (transitive) → AVOIR: vous avez passé."),
  g("gr-29", "auxiliaire", "Elle ___ née à Casablanca.", ["est", "a", "avait", "es"], 0, "Naître → ÊTRE : elle est née.", "Naître → ÊTRE: elle est née."),
  g("gr-30", "auxiliaire", "Nous ___ montés au troisième étage.", ["sommes", "avons", "ont", "êtes"], 0, "Monter (sans complément d'objet) → ÊTRE : nous sommes montés.", "Monter (no direct object) → ÊTRE: nous sommes montés."),
  g("gr-31", "auxiliaire", "J'___ eu peur, mais tout ___ bien passé.", ["ai · s'est", "suis · s'est", "ai · s'a", "suis · a"], 0, "Avoir peur → AVOIR (j'ai eu) ; « se passer » est pronominal → ÊTRE (s'est bien passé).", "Avoir peur → AVOIR (j'ai eu); “se passer” is reflexive → ÊTRE (s'est bien passé)."),
  g("gr-32", "auxiliaire", "Les résultats ___ arrivés par courriel.", ["sont", "ont", "est", "avaient"], 0, "Arriver → ÊTRE, accord pluriel : sont arrivés.", "Arriver → ÊTRE, plural agreement: sont arrivés."),
];
