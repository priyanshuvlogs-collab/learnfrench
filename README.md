# Lumen Français

> An English-language coach that trains you in real French — for the NCLC you actually need.

A TEF Canada / TCF Canada prep web app for francophone-immigration candidates (Express Entry, PEQ, PNPs…). This is not a Duolingo clone: it is an **exam-result product**. Every lesson, streak day, and coach message exists to raise one of the four skills toward the NCLC/CLB target.

The **interface is in English**. Listening clips, dictations, conjugations, writing briefs, and speaking prompts are in **French** — the language of the test.

## Product principles

- **The official score = the weakest skill.** Four separate NCLC estimates (listening, reading, writing, speaking) with a confidence level; never a fake “72% overall”.
- **Psychology built in, not decorative**: candidate identity, implementation intentions, a 5-minute viable session, streak freezes (2/month, automatic), a no-shame resume protocol, a concrete win at the end of each session (peak-end rule), interleaving + spaced repetition (light SM-2), box breathing before mocks.
- **Exam truth**: realistic TEF/TCF structures, the single-listen rule trained as a skill, official IRCC tables (TEF “ancien score” for Express Entry + /699 scale post-December 2023 + TCF) with a last-verified date and a canada.ca link.
- **Transparency**: every score is a **pedagogical estimate**, never an official result. Independent site, not affiliated with IRCC, Le français des affaires, or France Éducation international. No immigration advice.

## Features (end-to-end V1)

| Screen | What it does |
| --- | --- |
| Home / Today | Minutes ring, streak + freezes, weakest-skill banner, 4-beat daily block, 5-min rescue |
| Onboarding (3 min) | Exam, NCLC target, date, minutes/day, self-level per skill, implementation intention |
| Coach Camille | Chat with 14-day memory, replies anchored in real state (streak, profile, exam), no score guarantees, visa-panic redirect, one action per message |
| Skills | Listening / reading / writing / speaking dashboards + drill player (single-listen TTS, traps explained) |
| Writing studio | Brief/editor side by side, official timer, word count, paste disabled, sudden-level-jump flag, 5-dimension grid, model paragraph + 3 formulas |
| Speaking studio | Exam timers, mic recording, transcript (browser speech recognition), 5-dimension score, “say it again, better” |
| Review | 120 SRS cards (connectors, structures, traps, frames) + personal notebook cards, 5-min rescue protocol |
| Lab | Dictation (2 listens, word-level correction that separates accent slips from wrong words), numbers on the fly (prices/times/years/phones dictated once, generated each session), conjugation sprint (6 exam tenses, ½ point if only accents are missing) |
| Notebook | Personal vocabulary; each entry becomes an SRS card mixed into the programme |
| Mocks | Mini listening/reading mocks + section mocks (unlocked at a 7-day streak), box breathing, question-by-question review with time spent |
| Progress | 14-day heatmap, skill trajectories, 28-day streak calendar, honest “distance to target” model, weekly coach letter |
| Official tables | 3 IRCC scales with the TEF dual-column warning |

Original practice content (`source: original practice`): 40 listening items, 40 reading items, 25 writing prompts (TEF A/B + TCF T1/T2/T3) with models, 25 speaking prompts, 120 SRS cards, 24 dictation sentences (3 levels), 48 conjugation items (6 tenses). No official past papers are reproduced.

Settings: export/import all data as JSON (the demo lives in `localStorage`).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production
npm run lint
```

## Architecture

- **Next.js (App Router) + TypeScript + Tailwind CSS 4**; Inter + Fraunces fonts.
- **State**: Zustand + `localStorage` persist — the demo runs entirely in the browser, with no database or API key.
- `lib/`: engine (NCLC, streak/freezes, SM-2, exam-phase planner, 5-dimension heuristic scoring, Camille the coach). `content/`: exercise banks and IRCC tables. `components/` + `app/`: UI.
- **Scoring**: transparent heuristics that mimic examiner logic (task, connectors, lexical range, structures, register/fluency) — structured fields only, never a free-form grade. In production, a constrained-JSON LLM would sit on the same grid, plus Whisper for transcription.
- **Audio**: browser text-to-speech (single listen); browser speech recognition in the speaking studio, with a typed fallback.

### Suggested production path

Postgres + Prisma, magic-link + Google auth, object storage for audio, constrained-JSON LLM for the grid, Whisper for transcription, a cron to reset freezes, and email reminders (1/day max, no shame).

## Disclaimer

Score → NCLC equivalences come from tables published by IRCC; if they diverge, [canada.ca](https://www.canada.ca) is authoritative. Scores produced by the app are deliberately conservative pedagogical estimates and do not replace any official result.
