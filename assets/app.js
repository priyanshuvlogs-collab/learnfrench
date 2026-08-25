/* ============ LearnFrench — TEF/TCF Canada CLB 5 ============ */
"use strict";

/* ---------------------------------------------------------------
 * Official IRCC conversion tables (source: canada.ca)
 * TEF Canada: tests taken after December 10, 2023
 * TCF Canada: current table
 * Each entry: [min, max] of the test score for that NCLC level.
 * ------------------------------------------------------------- */
const IRCC_TABLES = {
  tef: {
    label: "TEF Canada (after December 10, 2023)",
    scale: "0\u2013699",
    skills: {
      reading:   { 10: [546, 699], 9: [503, 545], 8: [462, 502], 7: [434, 461], 6: [393, 433], 5: [352, 392], 4: [306, 351] },
      writing:   { 10: [558, 699], 9: [512, 557], 8: [472, 511], 7: [428, 471], 6: [379, 427], 5: [330, 378], 4: [268, 329] },
      listening: { 10: [546, 699], 9: [503, 545], 8: [462, 502], 7: [434, 461], 6: [393, 433], 5: [352, 392], 4: [306, 351] },
      speaking:  { 10: [556, 699], 9: [518, 555], 8: [494, 517], 7: [456, 493], 6: [422, 455], 5: [387, 421], 4: [328, 386] }
    }
  },
  tcf: {
    label: "TCF Canada",
    scale: "Reading/Listening: 331\u2013699 · Writing/Speaking: 0\u201320",
    skills: {
      reading:   { 10: [549, 699], 9: [524, 548], 8: [499, 523], 7: [453, 498], 6: [406, 452], 5: [375, 405], 4: [342, 374] },
      writing:   { 10: [16, 20], 9: [14, 15], 8: [12, 13], 7: [10, 11], 6: [7, 9], 5: [6, 6], 4: [4, 5] },
      listening: { 10: [549, 699], 9: [523, 548], 8: [503, 522], 7: [458, 502], 6: [398, 457], 5: [369, 397], 4: [331, 368] },
      speaking:  { 10: [16, 20], 9: [14, 15], 8: [12, 13], 7: [10, 11], 6: [7, 9], 5: [6, 6], 4: [4, 5] }
    }
  }
};

/* ---------------------------------------------------------------
 * Exam updates feed. Newest entries are shown first automatically;
 * entries less than ~12 months old get a "NEW" badge. To publish
 * an update, add an object here — no other change needed.
 * ------------------------------------------------------------- */
const EXAM_UPDATES = [
  {
    date: "2023-12-11",
    exam: "TEF Canada",
    title: "New scoring scale in force",
    text: "Tests taken after December 10, 2023 use a new 0\u2013699 scale with skill-specific NCLC thresholds (CLB 5: writing 330, speaking 387, reading/listening 352). Older results keep the previous scale."
  },
  {
    date: "2023-04-01",
    exam: "TCF Canada",
    title: "Current test structure",
    text: "Four mandatory skills, 2 h 47 total: listening 39 MCQs / 35 min, reading 39 MCQs / 60 min, writing 3 tasks / 60 min, speaking 3 tasks / 12 min face-to-face. Progressive difficulty in the MCQ sections."
  },
  {
    date: "2019-10-01",
    exam: "TEF Canada",
    title: "Current test structure",
    text: "Four mandatory skills, about 2 h 55 total: listening 60 MCQs / 40 min, reading 50 MCQs / 60 min, writing 2 sections / 60 min, speaking 2 sections / 15 min face-to-face. All four skills must be taken in the same session."
  }
];

function initExamUpdates() {
  const root = document.getElementById("exam-updates");
  if (!root) return;
  const now = Date.now();
  const items = [...EXAM_UPDATES].sort((a, b) => b.date.localeCompare(a.date));
  root.innerHTML = items.map(u => {
    const isNew = now - new Date(u.date).getTime() < 365 * 24 * 3600 * 1000;
    const d = new Date(u.date).toLocaleDateString("en-CA", { year: "numeric", month: "long" });
    return `
      <div class="card">
        <div class="task-meta" style="margin-bottom:10px">
          <span class="pill ${u.exam.includes("TEF") ? "pill-tef" : "pill-tcf"}">${u.exam}</span>
          <span class="pill pill-time">${d}</span>
          ${isNew ? '<span class="pill pill-ee">NEW</span>' : ""}
        </div>
        <h3>${u.title}</h3>
        <p>${u.text}</p>
      </div>`;
  }).join("");
}

function scoreToNCLC(exam, skill, score) {
  const table = IRCC_TABLES[exam].skills[skill];
  for (const level of [10, 9, 8, 7, 6, 5, 4]) {
    const [min, max] = table[level];
    if (score >= min && score <= max) return level;
  }
  const [min4] = table[4];
  return score > IRCC_TABLES[exam].skills[skill][10][1] ? 10 : (score < min4 ? 3 : 4);
}

/* ---------------------------------------------------------------
 * Practice task bank (writing & speaking)
 * Prompts (consignes) are kept in French, as on the real exam.
 * ------------------------------------------------------------- */
const TASKS = [
  {
    id: "tef-ee-a1", exam: "tef", skill: "writing",
    title: "TEF — Writing, Section A: continue a news story",
    time: 30, words: [80, 120],
    consigne:
      "Vous travaillez pour le journal local. Voici le début d'un article :\n\n« Hier soir, vers 22 h, les habitants de la rue Principale ont entendu un grand bruit. Quand ils sont sortis, ils ont découvert... »\n\nContinuez cet article en racontant la suite des événements (environ 80 à 120 mots). Utilisez le passé composé et l'imparfait.",
    checklist: [
      "I continued the story logically (no break with the given opening).",
      "I used both the passé composé AND the imparfait correctly.",
      "I respected the required length (80\u2013120 words).",
      "I used connectors: d'abord, ensuite, puis, finalement.",
      "I wrote in a journalistic style (3rd person, neutral tone)."
    ]
  },
  {
    id: "tef-ee-b1", exam: "tef", skill: "writing",
    title: "TEF — Writing, Section B: argumentative letter",
    time: 30, words: [180, 220],
    consigne:
      "Vous avez lu cette annonce dans le journal :\n\n« La mairie veut fermer la bibliothèque municipale pour construire un parking. »\n\nVous écrivez une lettre au maire pour donner votre opinion. Vous présentez 2 ou 3 arguments et vous proposez une solution (environ 200 mots).",
    checklist: [
      "I used the formal letter format (Monsieur le Maire, closing formula).",
      "I stated my opinion clearly at the start.",
      "I presented 2\u20133 distinct arguments with examples.",
      "I proposed a concrete solution.",
      "I used \u00ab vous \u00bb (formal address) throughout."
    ]
  },
  {
    id: "tef-eo-a1", exam: "tef", skill: "speaking",
    title: "TEF — Speaking, Section A: asking for information",
    time: 5, words: null,
    consigne:
      "Vous avez vu cette annonce :\n\n« Cours de natation pour adultes — piscine municipale. Inscriptions ouvertes. Tél. : 04 56 78 90 12 »\n\nVous téléphonez pour obtenir des renseignements. Posez environ 10 questions : horaires, prix, niveau, matériel, inscription, professeur, etc. (L'examinateur joue le rôle de l'employé.)",
    checklist: [
      "I greeted and explained why I was calling.",
      "I asked at least 8\u201310 varied questions (est-ce que, quel, combien, où, quand, comment).",
      "I used \u00ab vous \u00bb (formal address).",
      "I reacted to the answers (d'accord, très bien, parfait).",
      "I thanked the person and ended the call politely."
    ]
  },
  {
    id: "tef-eo-b1", exam: "tef", skill: "speaking",
    title: "TEF — Speaking, Section B: convincing someone",
    time: 10, words: null,
    consigne:
      "Vous avez vu cette annonce :\n\n« Week-end découverte à la montagne : randonnée, air pur et repas traditionnel. Prix spécial groupe ! »\n\nVous voulez convaincre un ami de participer à ce week-end avec vous. Présentez l'activité et donnez-lui des arguments pour le convaincre. Répondez à ses objections. (L'examinateur joue le rôle de l'ami.)",
    checklist: [
      "I presented the ad clearly (what, where, when, how much).",
      "I gave at least 3 arguments to convince my friend.",
      "I responded to objections (too expensive, no time, tired...).",
      "I used convincing expressions: tu devrais, je t'assure que, c'est l'occasion de...",
      "I spoke at a steady pace, without long pauses."
    ]
  },
  {
    id: "tcf-ee-t1", exam: "tcf", skill: "writing",
    title: "TCF — Writing, Task 1: short message",
    time: 10, words: [60, 120],
    consigne:
      "Vous venez de déménager dans une nouvelle ville. Vous écrivez un message à un ami pour lui décrire votre nouveau quartier et l'inviter à vous rendre visite (60 à 120 mots).",
    checklist: [
      "I addressed both parts: describing the neighbourhood AND inviting.",
      "I used the informal register (tu, casual greetings).",
      "I respected the length (60\u2013120 words).",
      "I gave concrete details (shops, transport, atmosphere).",
      "I ended with an appropriate formula (À bientôt, Bises...)."
    ]
  },
  {
    id: "tcf-ee-t2", exam: "tcf", skill: "writing",
    title: "TCF — Writing, Task 2: article / personal experience",
    time: 20, words: [120, 150],
    consigne:
      "Vous participez à un blog sur la vie quotidienne. Racontez une expérience récente où vous avez aidé quelqu'un (ou quelqu'un vous a aidé). Décrivez la situation, ce qui s'est passé et ce que vous avez ressenti (120 à 150 mots).",
    checklist: [
      "I narrated in the past (passé composé + imparfait).",
      "I structured it: situation → event → feeling/conclusion.",
      "I respected the length (120\u2013150 words).",
      "I used time connectors (un jour, ensuite, à la fin).",
      "I expressed a feeling (j'étais content(e), cela m'a touché(e))."
    ]
  },
  {
    id: "tcf-ee-t3", exam: "tcf", skill: "writing",
    title: "TCF — Writing, Task 3: compare and give your opinion",
    time: 30, words: [120, 180],
    consigne:
      "Document 1 : « Le télétravail améliore la qualité de vie : moins de transport, plus de temps pour la famille. »\nDocument 2 : « Le télétravail isole les employés et rend la collaboration plus difficile. »\n\nDégagez les idées principales des deux documents, puis donnez votre opinion personnelle sur le télétravail (120 à 180 mots).",
    checklist: [
      "I summarized BOTH documents (without copying them).",
      "I clearly separated the summary from my opinion.",
      "I gave my opinion with at least one argument and one example.",
      "I used: selon le premier document..., en revanche..., à mon avis...",
      "I respected the length (120\u2013180 words)."
    ]
  },
  {
    id: "tcf-eo-t1", exam: "tcf", skill: "speaking",
    title: "TCF — Speaking, Task 1: guided interview",
    time: 2, words: null,
    consigne:
      "L'examinateur vous pose des questions sur vous : votre travail, vos études, votre famille, vos loisirs, vos projets.\n\nExemples : « Parlez-moi de votre travail. » — « Qu'est-ce que vous aimez faire le week-end ? » — « Quels sont vos projets pour l'avenir ? »\n\nRépondez de façon développée (2\u20133 phrases par question), pas seulement par oui ou non.",
    checklist: [
      "I develop every answer (at least 2\u20133 sentences).",
      "I give concrete personal examples.",
      "I use the present, passé composé and futur proche correctly.",
      "I speak without long hesitations.",
      "I never answer with a single word."
    ]
  },
  {
    id: "tcf-eo-t2", exam: "tcf", skill: "speaking",
    title: "TCF — Speaking, Task 2: interaction (asking questions)",
    time: 6, words: null,
    consigne:
      "Situation : Vous voulez vous inscrire à un club de sport. Vous rencontrez le responsable du club. Posez-lui des questions pour obtenir toutes les informations nécessaires : activités, horaires, tarifs, équipement, essai gratuit...\n\n(2 minutes de préparation, puis 3 min 30 d'échange.)",
    checklist: [
      "I prepared my questions during the 2-minute preparation time.",
      "I asked varied, well-formed questions.",
      "I used \u00ab vous \u00bb (formal address).",
      "I reacted to each answer before asking the next question.",
      "I kept the exchange going for the full allotted time."
    ]
  },
  {
    id: "tcf-eo-t3", exam: "tcf", skill: "speaking",
    title: "TCF — Speaking, Task 3: point of view",
    time: 5, words: null,
    consigne:
      "« Certaines personnes pensent qu'il est préférable de vivre en ville, d'autres préfèrent la campagne. Et vous, qu'en pensez-vous ? »\n\nDonnez votre opinion et justifiez-la avec des arguments et des exemples. Parlez sans préparation pendant environ 4 minutes 30.",
    checklist: [
      "I stated my opinion clearly at the start.",
      "I gave 2\u20133 arguments with personal examples.",
      "I used connectors: d'abord, de plus, par exemple, en conclusion.",
      "I spoke long enough (aim for at least 3\u20134 minutes).",
      "I concluded by summarizing my point of view."
    ]
  }
];

/* ---------------------------------------------------------------
 * Evaluation criteria (aligned with official scoring dimensions)
 * ------------------------------------------------------------- */
const CRITERIA = {
  writing: [
    { key: "task", label: "Task achievement", hint: "Topic addressed, length respected, every part of the prompt covered" },
    { key: "coherence", label: "Coherence and organization", hint: "Structure, paragraphs, logical connectors" },
    { key: "lexis", label: "Vocabulary (range and accuracy)", hint: "Words suited to the topic, few repetitions" },
    { key: "grammar", label: "Grammar (range and accuracy)", hint: "Conjugations, agreements, past tenses" },
    { key: "register", label: "Register and format", hint: "Correct tu/vous, letter/message/article format respected" }
  ],
  speaking: [
    { key: "task", label: "Task achievement", hint: "Task fully completed, role respected" },
    { key: "coherence", label: "Coherence and structure", hint: "Ideas linked logically, connectors used" },
    { key: "lexis", label: "Vocabulary (range and accuracy)", hint: "Words suited to the situation, few blocks" },
    { key: "grammar", label: "Grammar (range and accuracy)", hint: "Complete sentences, correct tenses" },
    { key: "fluency", label: "Fluency and pronunciation", hint: "Steady pace, liaisons, clarity, few hesitations" }
  ]
};

const CRITERIA_TIPS = {
  task: "Re-read the prompt and check every required part (who, what, length, format). An incomplete task caps the score, even with good French.",
  coherence: "Structure with simple, reliable connectors: d'abord, ensuite, de plus, par exemple, en conclusion. One paragraph = one idea.",
  lexis: "Learn 20\u201330 words per high-frequency topic (work, housing, services, leisure). Avoid repetition by preparing simple synonyms.",
  grammar: "Secure the present, passé composé/imparfait and futur proche. Systematically check subject-verb agreement and articles.",
  register: "Formal letter: \u00ab Monsieur/Madame \u00bb, vous, closing formula. Friendly message: \u00ab Salut \u00bb, tu, \u00ab À bientôt \u00bb.",
  fluency: "Practice with a timer: simple, fluent sentences beat complex sentences full of pauses."
};

/* ---------------------------------------------------------------
 * Score estimation
 * Self-rated criteria (0\u20135 each, total /25) are mapped onto the
 * official scale of the selected exam, then converted to NCLC
 * using the IRCC tables. Calibration is deliberately strict:
 * a uniform 3/5 ("correct but simple") lands in the middle of
 * the NCLC 5 band, not above it.
 * ------------------------------------------------------------- */
const ESTIMATION_ANCHORS = {
  // [score at total=15 (all 3s, mid-NCLC 5), score at total=25 (all 5s)]
  tcf: { writing: [6, 16], speaking: [6, 16] },
  tef: { writing: [354, 640], speaking: [404, 640] }
};

function estimateScore(exam, skill, values) {
  const total = values.reduce((a, b) => a + b, 0); // 0\u201325
  const [mid, top] = ESTIMATION_ANCHORS[exam][skill];
  const maxScore = exam === "tcf" ? 20 : 699;
  let score;
  if (total <= 15) {
    score = Math.floor((total / 15) * mid);
  } else {
    score = Math.floor(mid + ((total - 15) / 10) * (top - mid));
  }
  score = Math.max(0, Math.min(maxScore, score));
  // A largely off-task or incomplete answer caps the result below NCLC 5,
  // regardless of language quality (official raters do the same).
  const taskValue = values[0];
  if (taskValue <= 1) {
    const cap = exam === "tcf" ? 5 : (skill === "writing" ? 329 : 386);
    score = Math.min(score, cap);
  }
  const nclc = scoreToNCLC(exam, skill, score);
  return { total, score, nclc, capped: taskValue <= 1 };
}

/* ---------------------------------------------------------------
 * Shared helpers
 * ------------------------------------------------------------- */
function countWords(text) {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ---------------------------------------------------------------
 * Page: Practice (task bank)
 * ------------------------------------------------------------- */
function initPractice() {
  const list = document.getElementById("task-list");
  if (!list) return;

  const state = { exam: "all", skill: "all" };

  function render() {
    list.innerHTML = "";
    const tasks = TASKS.filter(t =>
      (state.exam === "all" || t.exam === state.exam) &&
      (state.skill === "all" || t.skill === state.skill)
    );
    if (!tasks.length) {
      list.innerHTML = '<p style="color:var(--muted)">No task matches this filter.</p>';
      return;
    }
    tasks.forEach(t => list.appendChild(buildTaskCard(t)));
  }

  function buildTaskCard(t) {
    const card = document.createElement("div");
    card.className = "card task-card";

    const examPill = t.exam === "tef" ? '<span class="pill pill-tef">TEF Canada</span>' : '<span class="pill pill-tcf">TCF Canada</span>';
    const skillPill = t.skill === "writing" ? '<span class="pill pill-ee">Writing</span>' : '<span class="pill pill-eo">Speaking</span>';
    const timePill = `<span class="pill pill-time">\u23F1 ${t.time} min</span>`;
    const wordsPill = t.words ? `<span class="pill pill-time">${t.words[0]}\u2013${t.words[1]} words</span>` : "";

    card.innerHTML = `
      <div class="task-head"><h3>${t.title}</h3></div>
      <div class="task-meta">${examPill}${skillPill}${timePill}${wordsPill}</div>
      <div class="task-consigne">${t.consigne}</div>
      <details class="checklist">
        <summary>CLB 5 self-check list</summary>
        <ul>${t.checklist.map(c => `<li>${c}</li>`).join("")}</ul>
      </details>
      <div class="task-tools">
        <span class="timer-display" data-timer>${formatTime(t.time * 60)}</span>
        <button class="btn-small" data-timer-btn>Start timer</button>
        <button class="btn-small" data-timer-reset>Reset</button>
      </div>
    `;

    if (t.skill === "writing") {
      const wrap = document.createElement("div");
      wrap.className = "task-writing";
      wrap.innerHTML = `
        <textarea placeholder="Write your answer here (in French)..." spellcheck="false"></textarea>
        <div class="task-tools">
          <span class="word-count" data-wc>0 words</span>
        </div>`;
      card.appendChild(wrap);
      const ta = wrap.querySelector("textarea");
      const wc = wrap.querySelector("[data-wc]");
      ta.addEventListener("input", () => {
        const n = countWords(ta.value);
        wc.textContent = n === 1 ? "1 word" : `${n} words`;
        wc.classList.remove("ok", "warn");
        if (t.words) {
          if (n >= t.words[0] && n <= t.words[1]) wc.classList.add("ok");
          else if (n > 0) wc.classList.add("warn");
        }
      });
    }

    // Countdown timer
    const display = card.querySelector("[data-timer]");
    const startBtn = card.querySelector("[data-timer-btn]");
    const resetBtn = card.querySelector("[data-timer-reset]");
    let remaining = t.time * 60;
    let interval = null;

    function update() {
      display.textContent = formatTime(remaining);
      display.classList.toggle("danger", remaining <= 60);
    }
    startBtn.addEventListener("click", () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
        startBtn.textContent = "Resume";
        return;
      }
      startBtn.textContent = "Pause";
      interval = setInterval(() => {
        remaining -= 1;
        update();
        if (remaining <= 0) {
          clearInterval(interval);
          interval = null;
          display.textContent = "Time's up!";
          startBtn.textContent = "Start timer";
        }
      }, 1000);
    });
    resetBtn.addEventListener("click", () => {
      if (interval) { clearInterval(interval); interval = null; }
      remaining = t.time * 60;
      startBtn.textContent = "Start timer";
      update();
    });

    return card;
  }

  document.querySelectorAll("[data-filter-exam]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.exam = btn.dataset.filterExam;
      document.querySelectorAll("[data-filter-exam]").forEach(b => b.classList.toggle("active", b === btn));
      render();
    });
  });
  document.querySelectorAll("[data-filter-skill]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.skill = btn.dataset.filterSkill;
      document.querySelectorAll("[data-filter-skill]").forEach(b => b.classList.toggle("active", b === btn));
      render();
    });
  });

  render();
}

/* ---------------------------------------------------------------
 * Page: Self-assessment
 * ------------------------------------------------------------- */
function initEvaluation() {
  const panel = document.getElementById("eval-panel");
  if (!panel) return;

  const state = { exam: "tef", skill: "writing" };
  const criteriaWrap = document.getElementById("criteria");
  const resultBox = document.getElementById("eval-result");

  function renderCriteria() {
    const list = CRITERIA[state.skill];
    criteriaWrap.innerHTML = list.map((c, i) => `
      <div class="criterion">
        <div class="criterion-head">
          <label for="crit-${i}">${c.label}</label>
          <span class="crit-hint">${c.hint}</span>
          <span class="criterion-value" id="crit-val-${i}">3/5</span>
        </div>
        <input type="range" id="crit-${i}" data-key="${c.key}" min="0" max="5" step="1" value="3">
        <div class="scale-labels"><span>0 — very weak</span><span>3 — CLB 5 target</span><span>5 — excellent</span></div>
      </div>
    `).join("");
    criteriaWrap.querySelectorAll("input[type=range]").forEach((input, i) => {
      input.addEventListener("input", () => {
        document.getElementById(`crit-val-${i}`).textContent = `${input.value}/5`;
      });
    });
    resultBox.classList.add("hidden");
  }

  document.querySelectorAll("[data-eval-exam]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.exam = btn.dataset.evalExam;
      document.querySelectorAll("[data-eval-exam]").forEach(b => b.classList.toggle("active", b === btn));
      renderCriteria();
    });
  });
  document.querySelectorAll("[data-eval-skill]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.skill = btn.dataset.evalSkill;
      document.querySelectorAll("[data-eval-skill]").forEach(b => b.classList.toggle("active", b === btn));
      renderCriteria();
    });
  });

  document.getElementById("eval-submit").addEventListener("click", () => {
    const inputs = [...criteriaWrap.querySelectorAll("input[type=range]")];
    const values = inputs.map(i => parseInt(i.value, 10));
    const { score, nclc, capped } = estimateScore(state.exam, state.skill, values);
    const pass = nclc >= 5;

    const examLabel = state.exam === "tef" ? "TEF Canada" : "TCF Canada";
    const skillLabel = state.skill === "writing" ? "Writing" : "Speaking";
    const scaleLabel = state.exam === "tcf" ? "/20" : "/699";

    // Weakest criteria → targeted advice
    const list = CRITERIA[state.skill];
    const weakest = values
      .map((v, i) => ({ v, c: list[i] }))
      .filter(x => x.v <= 3)
      .sort((a, b) => a.v - b.v)
      .slice(0, 3);

    let feedback = "";
    if (capped) {
      feedback += "<li><strong>Task not achieved:</strong> an off-topic or very incomplete answer caps the score below CLB 5, whatever the language quality. This is the absolute priority.</li>";
    }
    if (weakest.length) {
      feedback += weakest.map(x => `<li><strong>${x.c.label} (${x.v}/5):</strong> ${CRITERIA_TIPS[x.c.key]}</li>`).join("");
    }
    if (!feedback) {
      feedback = "<li>No major weakness detected. Consolidate by repeating timed tasks and varying the topics.</li>";
    }

    resultBox.className = `result-box ${pass ? "pass" : "fail"}`;
    resultBox.innerHTML = `
      <div class="result-verdict">${pass ? "\u2713 CLB 5 target reached" : "\u2717 CLB 5 not reached"}</div>
      <p style="font-size:0.9rem;color:var(--muted)">${examLabel} — ${skillLabel} · Estimate based on your self-rating (deliberately strict).</p>
      <div class="result-details">
        <div class="result-stat"><div class="stat-label">Estimated score</div><div class="stat-value">${score}<span style="font-size:0.9rem;color:var(--muted)"> ${scaleLabel}</span></div></div>
        <div class="result-stat"><div class="stat-label">CLB / NCLC level</div><div class="stat-value">NCLC ${nclc}</div></div>
        <div class="result-stat"><div class="stat-label">CLB 5 threshold</div><div class="stat-value">${thresholdLabel(state.exam, state.skill)}</div></div>
      </div>
      <div class="result-feedback">
        <strong>${pass ? "To secure (and exceed) the level:" : "Priorities to reach CLB 5:"}</strong>
        <ul>${feedback}</ul>
      </div>
    `;
    resultBox.classList.remove("hidden");
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  function thresholdLabel(exam, skill) {
    const [min] = IRCC_TABLES[exam].skills[skill][5];
    return exam === "tcf" ? `${min} /20` : `${min} /699`;
  }

  renderCriteria();
}

/* ---------------------------------------------------------------
 * Page: IRCC conversion tables
 * ------------------------------------------------------------- */
function initTables() {
  const wrap = document.getElementById("tables-root");
  if (!wrap) return;

  const skillNames = {
    reading: "Reading",
    writing: "Writing",
    listening: "Listening",
    speaking: "Speaking"
  };

  function buildTable(examKey) {
    const exam = IRCC_TABLES[examKey];
    const rows = [10, 9, 8, 7, 6, 5, 4].map(level => {
      const cells = ["reading", "writing", "listening", "speaking"].map(s => {
        const [min, max] = exam.skills[s][level];
        return `<td>${min === max ? min : `${min}\u2013${max}`}</td>`;
      }).join("");
      return `<tr class="${level === 5 ? "target" : ""}"><td>NCLC ${level}</td>${cells}</tr>`;
    }).join("");

    return `
      <div class="table-wrap">
        <table class="score-table">
          <thead>
            <tr>
              <th>Level</th>
              <th>${skillNames.reading}</th>
              <th>${skillNames.writing}</th>
              <th>${skillNames.listening}</th>
              <th>${skillNames.speaking}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  document.getElementById("tef-table").innerHTML = buildTable("tef");
  document.getElementById("tcf-table").innerHTML = buildTable("tcf");
}

/* ---------------------------------------------------------------
 * Nav: highlight current page
 * ------------------------------------------------------------- */
function initNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initExamUpdates();
  initPractice();
  initEvaluation();
  initTables();
});
