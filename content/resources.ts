import { Skill } from "@/lib/types";

/**
 * Curated free resources for daily immersion, organized by skill.
 * Links point to well-known, stable channels and sites (no scraped
 * content). Each entry carries a method note: HOW to use it as exam
 * training, not just passive watching.
 */
export interface Resource {
  id: string;
  skill: Skill | "grammar";
  kind: "youtube" | "podcast" | "site" | "tool";
  title: string;
  url: string;
  level: string; // e.g. "A2–B1"
  fr: string; // what it is + how to use (FR)
  en: string; // same in English
}

export const RESOURCES: Resource[] = [
  // ── Listening ──
  {
    id: "res-co-01", skill: "listening", kind: "youtube",
    title: "Easy French (YouTube)", url: "https://www.youtube.com/@EasyFrench", level: "A2–B2",
    fr: "Micro-trottoirs sous-titrés FR+EN — exactement le format « micro-trottoir » de l'examen. Méthode : 1re écoute sans sous-titres (règle de l'écoute unique), notez qui parle et pourquoi, puis revoyez avec sous-titres.",
    en: "Subtitled street interviews (FR+EN) — exactly the exam's micro-trottoir format. Method: first watch WITHOUT subtitles (one-listen rule), note who speaks and why, then rewatch with subtitles.",
  },
  {
    id: "res-co-02", skill: "listening", kind: "youtube",
    title: "InnerFrench (YouTube / podcast)", url: "https://www.youtube.com/@innerFrench", level: "B1–B2",
    fr: "Un français clair et naturel sur des sujets de société — le registre des questions d'opinion du TEF/TCF. Méthode : écoutez 5 minutes, résumez à voix haute en 3 phrases (opinion → raison → exemple).",
    en: "Clear, natural French on society topics — the register of TEF/TCF opinion questions. Method: listen 5 minutes, then summarize aloud in 3 sentences (opinion → reason → example).",
  },
  {
    id: "res-co-03", skill: "listening", kind: "podcast",
    title: "RFI — Journal en français facile", url: "https://francaisfacile.rfi.fr/fr/podcasts/journal-en-fran%C3%A7ais-facile/", level: "B1–B2",
    fr: "Le journal quotidien en français ralenti, avec transcription. Méthode : dictée de nombres — notez chaque chiffre, date et heure entendus, puis vérifiez sur la transcription.",
    en: "Daily news in slowed-down French, with transcript. Method: number dictation — write every number, date and time you hear, then check against the transcript.",
  },
  {
    id: "res-co-04", skill: "listening", kind: "site",
    title: "TV5Monde — Apprendre le français", url: "https://apprendre.tv5monde.com/fr", level: "A1–C1",
    fr: "Exercices d'écoute par niveau à partir de vraies émissions (7 jours sur la planète). Méthode : choisissez votre niveau NCLC approximatif et travaillez la série « info » — le format ressemble aux annonces et reportages de l'examen.",
    en: "Level-graded listening exercises built from real broadcasts. Method: pick your approximate level and do the news series — the format mirrors the exam's announcements and reports.",
  },
  {
    id: "res-co-05", skill: "listening", kind: "podcast",
    title: "Radio-Canada OHdio", url: "https://ici.radio-canada.ca/ohdio", level: "B2+",
    fr: "L'accent et le vocabulaire québécois — utile si votre centre d'examen et votre vie future sont au Canada. Méthode : 10 minutes par jour d'une émission d'actualité, sans pause.",
    en: "Québécois accent and vocabulary — useful since your exam centre and future life are in Canada. Method: 10 minutes a day of a news show, no pausing.",
  },
  // ── Reading ──
  {
    id: "res-ce-01", skill: "reading", kind: "site",
    title: "1jour1actu", url: "https://www.1jour1actu.com", level: "A2–B1",
    fr: "L'actualité expliquée simplement, articles courts. Méthode : lisez la question du titre, prédisez la réponse, puis balayez l'article pour vérifier — le réflexe « question d'abord » de l'examen.",
    en: "News explained simply, short articles. Method: read the headline question, predict the answer, then scan the article to verify — the exam's question-first reflex.",
  },
  {
    id: "res-ce-02", skill: "reading", kind: "site",
    title: "RFI Savoirs", url: "https://savoirs.rfi.fr/fr/apprendre-enseigner", level: "B1–B2",
    fr: "Dossiers de compréhension avec exercices auto-corrigés. Méthode : chronométrez-vous — 8 minutes par texte, comme la gestion du temps de l'épreuve CE.",
    en: "Comprehension packs with self-correcting exercises. Method: time yourself — 8 minutes per text, matching the CE section's time pressure.",
  },
  {
    id: "res-ce-03", skill: "reading", kind: "site",
    title: "Canada.ca en français (pages immigration)", url: "https://www.canada.ca/fr/services/immigration-citoyennete.html", level: "B1–B2",
    fr: "Le vrai français administratif canadien — logement, travail, santé, impôts. Méthode : une page par jour ; surlignez les tournures administratives (« sous réserve de », « le cas échéant »). C'est le lexique exact de l'épreuve CE.",
    en: "Real Canadian administrative French — housing, work, health, taxes. Method: one page a day; highlight admin phrasing. This is the exact lexicon of the CE section.",
  },
  // ── Writing ──
  {
    id: "res-ee-01", skill: "writing", kind: "site",
    title: "Bonjour de France — Production écrite", url: "https://www.bonjourdefrance.com", level: "A2–B2",
    fr: "Modèles de lettres formelles et exercices guidés. Méthode : copiez la structure, jamais les phrases — puis écrivez la vôtre dans l'atelier avec le chrono.",
    en: "Formal-letter models and guided exercises. Method: copy the structure, never the sentences — then write your own in the timed writing lab.",
  },
  {
    id: "res-ee-02", skill: "writing", kind: "tool",
    title: "Le Conjugueur (Le Figaro)", url: "https://leconjugueur.lefigaro.fr", level: "Tous",
    fr: "Toutes les conjugaisons, hors ligne aussi. Méthode : vérifiez APRÈS avoir écrit, jamais pendant — l'examen n'a pas d'outil.",
    en: "Every conjugation, works offline too. Method: check AFTER writing, never during — the exam gives you no tools.",
  },
  // ── Speaking ──
  {
    id: "res-eo-01", skill: "speaking", kind: "youtube",
    title: "Français avec Pierre (YouTube)", url: "https://www.youtube.com/@FrancaisavecPierre", level: "A2–B2",
    fr: "Prononciation et expressions expliquées lentement. Méthode : technique du « shadowing » — répétez par-dessus la vidéo, 2 minutes par jour, en imitant le rythme.",
    en: "Pronunciation and expressions explained slowly. Method: shadowing — speak over the video for 2 minutes a day, imitating the rhythm.",
  },
  {
    id: "res-eo-02", skill: "speaking", kind: "youtube",
    title: "French mornings with Elisa (YouTube)", url: "https://www.youtube.com/@Frenchmornings", level: "B1–B2",
    fr: "Français naturel sous-titré, débit réel. Méthode : choisissez 20 secondes, transcrivez, puis redites-les en vous enregistrant dans l'atelier oral — comparez.",
    en: "Natural subtitled French at real speed. Method: pick 20 seconds, transcribe it, then re-say it recording yourself in the speaking lab — compare.",
  },
  {
    id: "res-eo-03", skill: "speaking", kind: "site",
    title: "Forvo — prononciation", url: "https://forvo.com/languages/fr/", level: "Tous",
    fr: "Chaque mot prononcé par des natifs. Méthode : vérifiez les 5 mots que vous avez hésité à dire dans votre dernier enregistrement.",
    en: "Any word pronounced by natives. Method: check the 5 words you hesitated on in your last recording.",
  },
  // ── Grammar ──
  {
    id: "res-gr-01", skill: "grammar", kind: "site",
    title: "Lawless French", url: "https://www.lawlessfrench.com", level: "A1–C1",
    fr: "Explications grammaticales en anglais, claires et fiables — parfait en mode bilingue. Méthode : lisez la règle en anglais, puis faites le drill être/avoir ici même.",
    en: "Reliable grammar explanations in English — perfect for bilingual mode. Method: read the rule in English, then do the être/avoir drill right here.",
  },
  {
    id: "res-gr-02", skill: "grammar", kind: "youtube",
    title: "Learn French with Alexa (YouTube)", url: "https://www.youtube.com/@learnfrenchwithalexa", level: "A1–B1",
    fr: "Les bases (être, avoir, temps du passé) expliquées pas à pas. Méthode : une vidéo = un micro-exercice d'écriture avec le verbe travaillé, tout de suite.",
    en: "The basics (être, avoir, past tenses) step by step. Method: one video = one immediate writing micro-task using that verb.",
  },
];
