# learnfrench

Targeted practice site for reaching **CLB 5 (NCLC 5)** on **TEF Canada** and **TCF Canada**, aimed at francophone immigration to Canada.

The site interface is in English; the exam task prompts and model formulas are in French, exactly as on the real exams.

## Pages

| Page | File | Content |
| --- | --- | --- |
| Home | `index.html` | Method overview and TEF vs TCF comparison |
| Practice | `practice.html` | Bank of official-format tasks (writing + speaking) with a timer, word counter, and CLB 5 self-check lists |
| Self-Assessment | `evaluation.html` | Rating on the 5 official scoring dimensions, estimated score converted to NCLC, "CLB 5 reached / not reached" verdict, and targeted advice |
| IRCC Tables | `tables.html` | Official score → NCLC equivalences (TEF post-December 2023 and TCF Canada), CLB 5 threshold highlighted |
| Strategy | `strategy.html` | Winning structures, ready-made French formulas, eliminatory mistakes, and a preparation plan |

## Running the site

100% static, no dependencies, no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Official data

The score → NCLC conversion tables come from the tables published by IRCC on [canada.ca](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-franco-pilots/franco-immigration/eligibility/language-test.html):

- **TEF Canada**: scale applicable to tests taken after December 10, 2023 (NCLC 5: writing ≥ 330, speaking ≥ 387, out of 699).
- **TCF Canada**: current scale (NCLC 5: 6/20 in writing and speaking; 375 in reading, 369 in listening).

Scores produced by the self-assessment tool are **educational estimates**, deliberately strict, and do not replace an official result.

## Disclaimer

Independent site, not affiliated with IRCC, France Éducation international, or Le français des affaires. In case of any discrepancy, the official canada.ca pages prevail.
