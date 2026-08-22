import type { Word } from "../data/vocabulary";

export interface QuizQuestion {
  word: Word;
  options: string[];
  answer: string;
}

export interface RandomFn {
  (): number;
}

/**
 * Build a multiple-choice quiz. Each question asks for the English meaning of a
 * French word, mixing the correct answer with distractors drawn from the pool.
 * A seeded/injected `rng` keeps the output deterministic for tests.
 */
export function buildQuiz(
  pool: Word[],
  questionCount: number,
  optionCount = 4,
  rng: RandomFn = Math.random,
): QuizQuestion[] {
  if (pool.length === 0) return [];

  const shuffledPool = shuffle(pool, rng);
  const chosen = shuffledPool.slice(0, Math.min(questionCount, shuffledPool.length));

  return chosen.map((word) => {
    const distractors = shuffle(
      pool.filter((candidate) => candidate.english !== word.english),
      rng,
    )
      .slice(0, Math.max(0, optionCount - 1))
      .map((candidate) => candidate.english);

    const options = shuffle([word.english, ...distractors], rng);

    return { word, options, answer: word.english };
  });
}

export function shuffle<T>(items: T[], rng: RandomFn = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function scoreLabel(score: number, total: number): string {
  if (total === 0) return "No questions yet";
  const ratio = score / total;
  if (ratio === 1) return "Parfait ! Perfect score \u{1F1EB}\u{1F1F7}";
  if (ratio >= 0.7) return "Tr\u00e8s bien ! Great job";
  if (ratio >= 0.4) return "Pas mal ! Keep practising";
  return "Courage ! Try again";
}
