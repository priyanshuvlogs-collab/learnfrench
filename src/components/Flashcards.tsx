import { useMemo, useState } from "react";
import type { Category } from "../data/vocabulary";

interface FlashcardsProps {
  category: Category;
}

export default function Flashcards({ category }: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const word = useMemo(() => category.words[index], [category, index]);
  const total = category.words.length;

  function go(delta: number) {
    setFlipped(false);
    setIndex((current) => (current + delta + total) % total);
  }

  return (
    <section className="panel" aria-label="Flashcards">
      <div className="panel-head">
        <h2>
          {category.emoji} {category.label}
        </h2>
        <span className="counter">
          Card {index + 1} / {total}
        </span>
      </div>

      <button
        type="button"
        className={`flashcard ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
      >
        <div className="flashcard-face flashcard-front">
          <span className="flashcard-hint">French</span>
          <strong>{word.french}</strong>
          <span className="flashcard-tap">Tap to reveal</span>
        </div>
        <div className="flashcard-face flashcard-back">
          <span className="flashcard-hint">English</span>
          <strong>{word.english}</strong>
          <em>{word.example}</em>
        </div>
      </button>

      <div className="controls">
        <button type="button" className="btn" onClick={() => go(-1)}>
          &larr; Previous
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setFlipped((value) => !value)}
        >
          Flip
        </button>
        <button type="button" className="btn" onClick={() => go(1)}>
          Next &rarr;
        </button>
      </div>
    </section>
  );
}
