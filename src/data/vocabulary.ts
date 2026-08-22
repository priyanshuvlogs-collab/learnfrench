export interface Word {
  french: string;
  english: string;
  example: string;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  words: Word[];
}

export const categories: Category[] = [
  {
    id: "greetings",
    label: "Greetings",
    emoji: "\u{1F44B}",
    words: [
      { french: "Bonjour", english: "Hello / Good morning", example: "Bonjour, comment \u00e7a va ?" },
      { french: "Bonsoir", english: "Good evening", example: "Bonsoir, bienvenue !" },
      { french: "Salut", english: "Hi / Bye (informal)", example: "Salut, \u00e0 demain !" },
      { french: "Au revoir", english: "Goodbye", example: "Au revoir et merci." },
      { french: "Merci", english: "Thank you", example: "Merci beaucoup !" },
      { french: "S'il vous pla\u00eet", english: "Please (formal)", example: "Un caf\u00e9, s'il vous pla\u00eet." },
    ],
  },
  {
    id: "food",
    label: "Food & Drink",
    emoji: "\u{1F950}",
    words: [
      { french: "Le pain", english: "Bread", example: "J'ach\u00e8te le pain." },
      { french: "Le fromage", english: "Cheese", example: "J'aime le fromage." },
      { french: "L'eau", english: "Water", example: "Je bois de l'eau." },
      { french: "La pomme", english: "Apple", example: "La pomme est rouge." },
      { french: "Le caf\u00e9", english: "Coffee", example: "Un caf\u00e9, s'il vous pla\u00eet." },
      { french: "Le vin", english: "Wine", example: "Le vin est fran\u00e7ais." },
    ],
  },
  {
    id: "numbers",
    label: "Numbers",
    emoji: "\u{1F522}",
    words: [
      { french: "Un", english: "One", example: "J'ai un chat." },
      { french: "Deux", english: "Two", example: "Deux caf\u00e9s, s'il vous pla\u00eet." },
      { french: "Trois", english: "Three", example: "Il est trois heures." },
      { french: "Quatre", english: "Four", example: "Quatre saisons." },
      { french: "Cinq", english: "Five", example: "Cinq minutes." },
      { french: "Dix", english: "Ten", example: "Dix euros." },
    ],
  },
  {
    id: "travel",
    label: "Travel",
    emoji: "\u2708\uFE0F",
    words: [
      { french: "La gare", english: "Train station", example: "O\u00f9 est la gare ?" },
      { french: "L'a\u00e9roport", english: "Airport", example: "L'a\u00e9roport est loin." },
      { french: "L'h\u00f4tel", english: "Hotel", example: "L'h\u00f4tel est complet." },
      { french: "La rue", english: "Street", example: "La rue est calme." },
      { french: "Le billet", english: "Ticket", example: "Voici mon billet." },
      { french: "La valise", english: "Suitcase", example: "Ma valise est lourde." },
    ],
  },
];

export function allWords(): Word[] {
  return categories.flatMap((category) => category.words);
}
