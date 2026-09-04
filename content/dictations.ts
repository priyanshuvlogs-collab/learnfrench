/**
 * Dictée bank — 24 original sentences (source: original practice).
 * Three levels aligned sur la cible NCLC ; chaque phrase embarque au
 * moins un piège classique de dictée (homophones, accords, accents).
 */
export interface DictationItem {
  id: string;
  level: "A" | "B" | "C"; // A ≈ NCLC 4-5, B ≈ 6-7, C ≈ 8-9
  text: string;
  trap: string; // le piège, expliqué après correction
  source: "original practice";
}

const s = "original practice" as const;
const d = (id: string, level: DictationItem["level"], text: string, trap: string): DictationItem => ({
  id,
  level,
  text,
  trap,
  source: s,
});

export const DICTATION_ITEMS: DictationItem[] = [
  // ── Niveau A ──
  d("di-001", "A", "Le magasin ferme à dix-huit heures tous les soirs.", "« à » (préposition) porte un accent ; « a » sans accent = le verbe avoir."),
  d("di-002", "A", "Elle a acheté des pommes et du pain au marché.", "« a acheté » : auxiliaire avoir sans accent + participe passé en -é."),
  d("di-003", "A", "Nous habitons près de la gare depuis deux ans.", "« près de » avec accent grave ; ne pas confondre avec « prêt » (= disposé à)."),
  d("di-004", "A", "Il fait très froid cet hiver au Canada.", "« cet » devant voyelle ou h muet (cet hiver) — jamais « cette hiver »."),
  d("di-005", "A", "Vous pouvez laisser un message après le signal sonore.", "« laisser » à l'infinitif après pouvoir — pas « laissé »."),
  d("di-006", "A", "Les enfants jouent dans le parc quand il fait beau.", "« jouent » : terminaison -ent muette de la 3e personne du pluriel."),
  d("di-007", "A", "J'ai rendez-vous chez le médecin mardi matin.", "« rendez-vous » s'écrit avec un trait d'union ; « médecin » sans « e » après le d."),
  d("di-008", "A", "Où se trouve la station de métro la plus proche ?", "« où » avec accent = le lieu ; « ou » sans accent = le choix."),

  // ── Niveau B ──
  d("di-101", "B", "Si vous êtes disponible, nous pourrions nous rencontrer jeudi prochain.", "« pourrions » : conditionnel avec deux r ; le si n'est jamais suivi du conditionnel."),
  d("di-102", "B", "Les documents que j'ai envoyés sont arrivés hier matin.", "« envoyés » s'accorde avec « que » (les documents), placé avant l'auxiliaire avoir."),
  d("di-103", "B", "Elle s'est inscrite au cours de français dès son arrivée.", "« s'est inscrite » : accord au féminin avec être ; « dès » porte un accent grave."),
  d("di-104", "B", "Il faut que vous remplissiez ce formulaire avant la fin du mois.", "« il faut que » entraîne le subjonctif : remplissiez, pas remplissez."),
  d("di-105", "B", "Malgré la pluie, la fête de quartier a eu lieu comme prévu.", "« malgré » se construit avec un nom, sans « que » ; « a eu lieu » sans accord."),
  d("di-106", "B", "Nous vous remercions de votre patience et de votre compréhension.", "« remercions de » — et « compréhension » garde son accent aigu."),
  d("di-107", "B", "Les loyers ont beaucoup augmenté dans les grandes villes canadiennes.", "« augmenté » avec avoir : pas d'accord ; « les grandes villes » : double accord au pluriel."),
  d("di-108", "B", "Quand elle est arrivée à Montréal, elle ne parlait pas un mot de français.", "« est arrivée » s'accorde avec elle ; « parlait » : imparfait de description."),

  // ── Niveau C ──
  d("di-201", "C", "Bien que le projet soit coûteux, la majorité des citoyens y sont favorables.", "« bien que » + subjonctif (soit) ; « y sont favorables » : accord avec citoyens."),
  d("di-202", "C", "Les mesures qu'ils avaient proposées ont finalement été adoptées à l'unanimité.", "Double accord : « proposées » (avec que = les mesures) et « adoptées » (voix passive)."),
  d("di-203", "C", "Quelles que soient vos raisons, vous devrez fournir une attestation officielle.", "« quelles que soient » en deux mots, accordé au féminin pluriel — jamais « quelque soit »."),
  d("di-204", "C", "S'il avait su, il aurait déposé sa demande beaucoup plus tôt.", "Irréel du passé : plus-que-parfait (avait su) + conditionnel passé (aurait déposé)."),
  d("di-205", "C", "La plupart des candidats sous-estiment le temps nécessaire à la préparation.", "« la plupart des » + verbe au pluriel ; « sous-estiment » avec trait d'union."),
  d("di-206", "C", "Après qu'ils se sont installés, ils se sont rapidement fait des amis.", "« après que » + indicatif ; « se sont fait » : pas d'accord devant un infinitif sous-entendu."),
  d("di-207", "C", "Veuillez trouver ci-joint les pièces justificatives demandées par votre service.", "« ci-joint » placé avant le nom reste invariable ; « veuillez » : impératif de politesse."),
  d("di-208", "C", "Quoi qu'il advienne, elle poursuivra ses démarches jusqu'à l'obtention du visa.", "« quoi qu'il advienne » en deux mots + subjonctif ; « jusqu'à » avec accent."),
];
