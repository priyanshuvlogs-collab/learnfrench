import { describe, expect, it } from "vitest";
import { buildQuiz, scoreLabel, shuffle } from "./quiz";
import type { Word } from "../data/vocabulary";

const pool: Word[] = [
  { french: "Un", english: "One", example: "" },
  { french: "Deux", english: "Two", example: "" },
  { french: "Trois", english: "Three", example: "" },
  { french: "Quatre", english: "Four", example: "" },
  { french: "Cinq", english: "Five", example: "" },
];

// Deterministic rng cycling through fixed values.
function seededRng(seed = 1) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

describe("buildQuiz", () => {
  it("produces the requested number of questions", () => {
    const quiz = buildQuiz(pool, 3, 4, seededRng());
    expect(quiz).toHaveLength(3);
  });

  it("includes the correct answer among the options", () => {
    const quiz = buildQuiz(pool, 5, 4, seededRng());
    for (const question of quiz) {
      expect(question.options).toContain(question.answer);
      expect(question.answer).toBe(question.word.english);
    }
  });

  it("does not exceed the requested option count", () => {
    const quiz = buildQuiz(pool, 5, 4, seededRng());
    for (const question of quiz) {
      expect(question.options.length).toBeLessThanOrEqual(4);
      expect(new Set(question.options).size).toBe(question.options.length);
    }
  });

  it("returns an empty quiz for an empty pool", () => {
    expect(buildQuiz([], 3)).toEqual([]);
  });
});

describe("shuffle", () => {
  it("preserves all elements", () => {
    const result = shuffle(pool, seededRng(42));
    expect(result).toHaveLength(pool.length);
    expect(new Set(result)).toEqual(new Set(pool));
  });
});

describe("scoreLabel", () => {
  it("celebrates a perfect score", () => {
    expect(scoreLabel(5, 5)).toContain("Perfect");
  });

  it("handles the empty case", () => {
    expect(scoreLabel(0, 0)).toBe("No questions yet");
  });
});
