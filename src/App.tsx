import { useState } from "react";
import Flashcards from "./components/Flashcards";
import Quiz from "./components/Quiz";
import { categories } from "./data/vocabulary";

type Mode = "flashcards" | "quiz";

export default function App() {
  const [mode, setMode] = useState<Mode>("flashcards");
  const [categoryId, setCategoryId] = useState(categories[0].id);

  const activeCategory =
    categories.find((category) => category.id === categoryId) ?? categories[0];

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-flag" aria-hidden="true">
            🇫🇷
          </span>
          <div>
            <h1>LearnFrench</h1>
            <p>Practise everyday French with flashcards and quizzes.</p>
          </div>
        </div>

        <nav className="tabs" aria-label="Study mode">
          <button
            type="button"
            className={`tab ${mode === "flashcards" ? "active" : ""}`}
            onClick={() => setMode("flashcards")}
          >
            Flashcards
          </button>
          <button
            type="button"
            className={`tab ${mode === "quiz" ? "active" : ""}`}
            onClick={() => setMode("quiz")}
          >
            Quiz
          </button>
        </nav>
      </header>

      <main className="app-main">
        {mode === "flashcards" && (
          <>
            <div className="category-bar" role="tablist" aria-label="Categories">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={category.id === categoryId}
                  className={`chip ${category.id === categoryId ? "active" : ""}`}
                  onClick={() => setCategoryId(category.id)}
                >
                  <span aria-hidden="true">{category.emoji}</span> {category.label}
                </button>
              ))}
            </div>
            <Flashcards category={activeCategory} />
          </>
        )}

        {mode === "quiz" && <Quiz />}
      </main>

      <footer className="app-footer">
        <span>{categories.reduce((sum, c) => sum + c.words.length, 0)} words · {categories.length} categories</span>
      </footer>
    </div>
  );
}
