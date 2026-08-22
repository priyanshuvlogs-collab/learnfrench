import { useMemo, useState } from "react";
import { allWords } from "../data/vocabulary";
import { buildQuiz, scoreLabel } from "../lib/quiz";

const QUESTION_COUNT = 6;

export default function Quiz() {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(
    () => buildQuiz(allWords(), QUESTION_COUNT),
    // Rebuild the quiz whenever the user restarts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  function choose(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === question.answer) {
      setScore((value) => value + 1);
    }
  }

  function next() {
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent((value) => value + 1);
    setSelected(null);
  }

  function restart() {
    setSeed((value) => value + 1);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <section className="panel" aria-label="Quiz results">
        <div className="panel-head">
          <h2>Résultats</h2>
        </div>
        <div className="results">
          <p className="results-score" data-testid="final-score">
            {score} / {questions.length}
          </p>
          <p className="results-label">{scoreLabel(score, questions.length)}</p>
          <button type="button" className="btn btn-primary" onClick={restart}>
            Play again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panel" aria-label="Quiz">
      <div className="panel-head">
        <h2>Quiz</h2>
        <span className="counter">
          Question {current + 1} / {questions.length} · Score {score}
        </span>
      </div>

      <p className="quiz-prompt">
        What does <strong>{question.word.french}</strong> mean?
      </p>

      <div className="options">
        {question.options.map((option) => {
          const isAnswer = option === question.answer;
          const isPicked = option === selected;
          const state = selected
            ? isAnswer
              ? "correct"
              : isPicked
                ? "wrong"
                : "dim"
            : "";
          return (
            <button
              key={option}
              type="button"
              className={`option ${state}`}
              onClick={() => choose(option)}
              disabled={Boolean(selected)}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="controls">
        <button
          type="button"
          className="btn btn-primary"
          onClick={next}
          disabled={!selected}
        >
          {current + 1 >= questions.length ? "See results" : "Next question"}
        </button>
      </div>
    </section>
  );
}
