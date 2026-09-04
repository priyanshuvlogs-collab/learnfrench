/**
 * Banque de conjugaison — 48 items originaux (source: original practice).
 * Six temps qui font la différence à l'examen : présent irrégulier,
 * passé composé (accords), imparfait, futur simple, conditionnel
 * (registre poli du TEF/TCF) et subjonctif présent.
 */
export interface ConjugationItem {
  id: string;
  tense: "Présent" | "Passé composé" | "Imparfait" | "Futur simple" | "Conditionnel" | "Subjonctif";
  subject: string; // affiché avant le champ : « nous », « elle », « il faut que je »…
  verb: string; // infinitif entre parenthèses
  answer: string;
  accept?: string[]; // variantes acceptées
  note: string; // le point de grammaire, expliqué après réponse
  source: "original practice";
}

const s = "original practice" as const;
const c = (
  id: string,
  tense: ConjugationItem["tense"],
  subject: string,
  verb: string,
  answer: string,
  note: string,
  accept?: string[]
): ConjugationItem => ({ id, tense, subject, verb, answer, note, accept, source: s });

export const CONJUGATION_ITEMS: ConjugationItem[] = [
  // ── Présent (irréguliers fréquents) ──
  c("cj-001", "Présent", "nous", "prendre", "prenons", "Prendre perd le d au pluriel : prenons, prenez, prennent."),
  c("cj-002", "Présent", "vous", "faire", "faites", "Faites — l'un des trois seuls verbes en -tes avec dites et êtes."),
  c("cj-003", "Présent", "ils", "aller", "vont", "Aller est totalement irrégulier : vais, vas, va, allons, allez, vont."),
  c("cj-004", "Présent", "je", "pouvoir", "peux", "Peux/peut : x à je et tu, t à il. « Je peut » est l'erreur la plus lue."),
  c("cj-005", "Présent", "nous", "commencer", "commençons", "Cédille devant o : commençons — pour garder le son [s]."),
  c("cj-006", "Présent", "vous", "envoyer", "envoyez", "Envoyer garde le y avec nous et vous : envoyons, envoyez."),
  c("cj-007", "Présent", "elles", "devoir", "doivent", "Doivent — radical doiv- au pluriel ; « elles devent » n'existe pas."),
  c("cj-008", "Présent", "on", "manger", "mange", "« On » se conjugue toujours au singulier, même s'il veut dire « nous »."),

  // ── Passé composé (choix de l'auxiliaire + accords) ──
  c("cj-101", "Passé composé", "elle", "aller", "est allée", "Aller se conjugue avec être : accord au féminin → allée."),
  c("cj-102", "Passé composé", "ils", "arriver", "sont arrivés", "Être + accord au pluriel : arrivés. Les verbes de mouvement prennent être."),
  c("cj-103", "Passé composé", "nous", "finir", "avons fini", "Avoir + participe sans accord (pas de COD avant) : avons fini."),
  c("cj-104", "Passé composé", "elle s'", "inscrire", "est inscrite", "Verbe pronominal → être ; accord avec le sujet : elle s'est inscrite."),
  c("cj-105", "Passé composé", "j'", "recevoir", "ai reçu", "Reçu avec cédille — participe irrégulier de recevoir."),
  c("cj-106", "Passé composé", "vous", "vivre", "avez vécu", "Vécu — participe irrégulier ; vivre se conjugue avec avoir."),
  c("cj-107", "Passé composé", "elles", "naître", "sont nées", "Naître prend être : accord féminin pluriel → nées."),
  c("cj-108", "Passé composé", "tu", "ouvrir", "as ouvert", "Ouvert — les verbes en -vrir/-frir font leur participe en -ert."),

  // ── Imparfait (récit et description — tâche A du TEF) ──
  c("cj-201", "Imparfait", "nous", "être", "étions", "Étions avec accent aigu — seul verbe dont l'imparfait vient de « ét- »."),
  c("cj-202", "Imparfait", "il", "faire", "faisait", "Faisait — se prononce [fəzɛ] mais s'écrit bien fai-."),
  c("cj-203", "Imparfait", "je", "avoir", "avais", "Avais : l'imparfait décrit le contexte ; le passé composé raconte l'événement."),
  c("cj-204", "Imparfait", "vous", "étudier", "étudiiez", "Deux i : étudi- + -iez. Pareil pour crier → criiez."),
  c("cj-205", "Imparfait", "elles", "vouloir", "voulaient", "Radical voul- + -aient (muet). Trois lettres muettes en fin de mot."),
  c("cj-206", "Imparfait", "on", "prendre", "prenait", "Imparfait bâti sur « nous prenons » → pren- + -ait."),
  c("cj-207", "Imparfait", "tu", "commencer", "commençais", "Cédille devant a : commençais."),
  c("cj-208", "Imparfait", "nous", "manger", "mangions", "Pas de e devant -ions : mangions (le e ne sert que devant a et o)."),

  // ── Futur simple (projets — très attendu à l'oral) ──
  c("cj-301", "Futur simple", "je", "être", "serai", "Serai (futur) ≠ serais (conditionnel) : une lettre, deux sens."),
  c("cj-302", "Futur simple", "nous", "avoir", "aurons", "Radical aur- : j'aurai, nous aurons."),
  c("cj-303", "Futur simple", "il", "pouvoir", "pourra", "Pourra — deux r, comme courir (courra) et mourir (mourra)."),
  c("cj-304", "Futur simple", "vous", "venir", "viendrez", "Radical viendr- : viendrai, viendrez. Pareil pour tenir → tiendr-."),
  c("cj-305", "Futur simple", "ils", "faire", "feront", "Radical fer- : je ferai, ils feront."),
  c("cj-306", "Futur simple", "elle", "envoyer", "enverra", "Enverra — radical irrégulier enverr-, deux r."),
  c("cj-307", "Futur simple", "tu", "aller", "iras", "Radical ir- : j'irai, tu iras. Rien à voir avec « aller »."),
  c("cj-308", "Futur simple", "on", "devoir", "devra", "Devra — le futur de devoir perd le -oi : devr-."),

  // ── Conditionnel (registre poli — lettres formelles) ──
  c("cj-401", "Conditionnel", "je", "vouloir", "voudrais", "« Je voudrais » : LA formule polie de l'examen. Radical voudr- + -ais."),
  c("cj-402", "Conditionnel", "nous", "souhaiter", "souhaiterions", "Souhaiterions — conditionnel de politesse pour une demande écrite."),
  c("cj-403", "Conditionnel", "vous", "pouvoir", "pourriez", "« Pourriez-vous… ? » : deux r, la question polie par excellence."),
  c("cj-404", "Conditionnel", "il", "être", "serait", "« Il serait souhaitable que… » — tournure impersonnelle du registre soutenu."),
  c("cj-405", "Conditionnel", "j'", "apprécier", "apprécierais", "« J'apprécierais que… » : verbe en -ier + -erais, deux fois le son [e]."),
  c("cj-406", "Conditionnel", "nous", "aimer", "aimerions", "« Nous aimerions » — pour proposer sans imposer."),
  c("cj-407", "Conditionnel", "tu", "devoir", "devrais", "« Tu devrais » : le conseil type ; devr- + -ais."),
  c("cj-408", "Conditionnel", "elles", "avoir", "auraient", "Auraient — aur- + -aient, terminaison muette."),

  // ── Subjonctif présent (après il faut que, bien que…) ──
  c("cj-501", "Subjonctif", "il faut que je", "être", "sois", "Être : que je sois, que tu sois, qu'il soit — très fréquent après « il faut que »."),
  c("cj-502", "Subjonctif", "il faut que vous", "avoir", "ayez", "Avoir : que vous ayez — ay- sans i."),
  c("cj-503", "Subjonctif", "bien qu'il", "faire", "fasse", "Faire → fasse. « Bien que » exige toujours le subjonctif."),
  c("cj-504", "Subjonctif", "il faut que nous", "aller", "allions", "Aller : que j'aille MAIS que nous allions — double radical."),
  c("cj-505", "Subjonctif", "avant que tu", "partir", "partes", "« Avant que » + subjonctif : partes. (« Après que » prend l'indicatif !)"),
  c("cj-506", "Subjonctif", "il faut qu'elle", "pouvoir", "puisse", "Pouvoir → puisse, radical puiss-."),
  c("cj-507", "Subjonctif", "pour que vous", "savoir", "sachiez", "Savoir → sach- : que vous sachiez."),
  c("cj-508", "Subjonctif", "il faut qu'ils", "prendre", "prennent", "Au subjonctif, prennent = présent de l'indicatif ; c'est nous/vous qui changent (prenions, preniez)."),
];
