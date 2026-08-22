# LearnFrench

A modern web app for learning everyday French vocabulary through interactive
flashcards and a multiple-choice quiz. Built with React, TypeScript and Vite.

## Features

- **Flashcards** grouped into categories (Greetings, Food & Drink, Numbers,
  Travel) with tap-to-flip French → English translations and example sentences.
- **Quiz** mode that generates a randomized multiple-choice test and scores your
  answers with instant feedback.

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:5173
```

## Available scripts

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the Vite dev server (port 5173).        |
| `npm run build`     | Type-check and build the production bundle.   |
| `npm run preview`   | Preview the production build (port 4173).     |
| `npm run lint`      | Run ESLint over the project.                  |
| `npm run typecheck` | Type-check without emitting output.           |
| `npm run test`      | Run the Vitest unit tests.                    |

## Project structure

```
src/
  components/   Flashcards and Quiz React components
  data/         French vocabulary grouped by category
  lib/          Quiz generation + scoring logic (unit tested)
  App.tsx       App shell with mode + category navigation
```
