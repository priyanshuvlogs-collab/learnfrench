/* ============ LearnFrench — TEF/TCF Canada NCLC 5 ============ */
"use strict";

/* ---------------------------------------------------------------
 * Official IRCC conversion tables (source: canada.ca)
 * TEF Canada: tests taken after December 10, 2023
 * TCF Canada: current table
 * Each entry: [min, max] of the test score for that NCLC level.
 * ------------------------------------------------------------- */
const IRCC_TABLES = {
  tef: {
    label: "TEF Canada (après le 10 décembre 2023)",
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
    scale: "CE/CO : 331\u2013699 · EE/EO : 0\u201320",
    skills: {
      reading:   { 10: [549, 699], 9: [524, 548], 8: [499, 523], 7: [453, 498], 6: [406, 452], 5: [375, 405], 4: [342, 374] },
      writing:   { 10: [16, 20], 9: [14, 15], 8: [12, 13], 7: [10, 11], 6: [7, 9], 5: [6, 6], 4: [4, 5] },
      listening: { 10: [549, 699], 9: [523, 548], 8: [503, 522], 7: [458, 502], 6: [398, 457], 5: [369, 397], 4: [331, 368] },
      speaking:  { 10: [16, 20], 9: [14, 15], 8: [12, 13], 7: [10, 11], 6: [7, 9], 5: [6, 6], 4: [4, 5] }
    }
  }
};

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
 * Practice task bank (production écrite & orale)
 * ------------------------------------------------------------- */
const TASKS = [
  {
    id: "tef-ee-a1", exam: "tef", skill: "writing",
    title: "TEF — Expression écrite, Section A : fait divers",
    time: 30, words: [80, 120],
    consigne:
      "Vous travaillez pour le journal local. Voici le début d'un article :\n\n« Hier soir, vers 22 h, les habitants de la rue Principale ont entendu un grand bruit. Quand ils sont sortis, ils ont découvert... »\n\nContinuez cet article en racontant la suite des événements (environ 80 à 120 mots). Utilisez le passé composé et l'imparfait.",
    checklist: [
      "J'ai continué l'histoire de façon logique (pas de rupture avec le début).",
      "J'ai utilisé le passé composé ET l'imparfait correctement.",
      "J'ai respecté la longueur demandée (80\u2013120 mots).",
      "J'ai utilisé des connecteurs : d'abord, ensuite, puis, finalement.",
      "J'ai écrit au style journalistique (3e personne, ton neutre)."
    ]
  },
  {
    id: "tef-ee-b1", exam: "tef", skill: "writing",
    title: "TEF — Expression écrite, Section B : lettre argumentée",
    time: 30, words: [180, 220],
    consigne:
      "Vous avez lu cette annonce dans le journal :\n\n« La mairie veut fermer la bibliothèque municipale pour construire un parking. »\n\nVous écrivez une lettre au maire pour donner votre opinion. Vous présentez 2 ou 3 arguments et vous proposez une solution (environ 200 mots).",
    checklist: [
      "J'ai utilisé la forme de la lettre formelle (Monsieur le Maire, formule de politesse finale).",
      "J'ai donné clairement mon opinion dès le début.",
      "J'ai présenté 2\u20133 arguments distincts avec des exemples.",
      "J'ai proposé une solution concrète.",
      "J'ai utilisé le vouvoiement partout."
    ]
  },
  {
    id: "tef-eo-a1", exam: "tef", skill: "speaking",
    title: "TEF — Expression orale, Section A : obtenir des renseignements",
    time: 5, words: null,
    consigne:
      "Vous avez vu cette annonce :\n\n« Cours de natation pour adultes — piscine municipale. Inscriptions ouvertes. Tél. : 04 56 78 90 12 »\n\nVous téléphonez pour obtenir des renseignements. Posez environ 10 questions : horaires, prix, niveau, matériel, inscription, professeur, etc. (L'examinateur joue le rôle de l'employé.)",
    checklist: [
      "J'ai salué et expliqué pourquoi j'appelle.",
      "J'ai posé au moins 8\u201310 questions variées (est-ce que, quel, combien, où, quand, comment).",
      "J'ai utilisé le vouvoiement.",
      "J'ai réagi aux réponses (d'accord, très bien, parfait).",
      "J'ai remercié et pris congé poliment."
    ]
  },
  {
    id: "tef-eo-b1", exam: "tef", skill: "speaking",
    title: "TEF — Expression orale, Section B : convaincre",
    time: 10, words: null,
    consigne:
      "Vous avez vu cette annonce :\n\n« Week-end découverte à la montagne : randonnée, air pur et repas traditionnel. Prix spécial groupe ! »\n\nVous voulez convaincre un ami de participer à ce week-end avec vous. Présentez l'activité et donnez-lui des arguments pour le convaincre. Répondez à ses objections. (L'examinateur joue le rôle de l'ami.)",
    checklist: [
      "J'ai présenté l'annonce clairement (quoi, où, quand, combien).",
      "J'ai donné au moins 3 arguments pour convaincre.",
      "J'ai répondu aux objections (trop cher, pas le temps, fatigué...).",
      "J'ai utilisé des expressions pour convaincre : tu devrais, je t'assure que, c'est l'occasion de...",
      "J'ai parlé avec un débit régulier, sans longues pauses."
    ]
  },
  {
    id: "tcf-ee-t1", exam: "tcf", skill: "writing",
    title: "TCF — Expression écrite, Tâche 1 : message court",
    time: 10, words: [60, 120],
    consigne:
      "Vous venez de déménager dans une nouvelle ville. Vous écrivez un message à un ami pour lui décrire votre nouveau quartier et l'inviter à vous rendre visite (60 à 120 mots).",
    checklist: [
      "J'ai répondu aux deux parties : décrire le quartier ET inviter.",
      "J'ai utilisé le registre amical (tu, salutations informelles).",
      "J'ai respecté la longueur (60\u2013120 mots).",
      "J'ai donné des détails concrets (commerces, transports, ambiance).",
      "J'ai terminé par une formule adaptée (À bientôt, Bises...)."
    ]
  },
  {
    id: "tcf-ee-t2", exam: "tcf", skill: "writing",
    title: "TCF — Expression écrite, Tâche 2 : article / expérience",
    time: 20, words: [120, 150],
    consigne:
      "Vous participez à un blog sur la vie quotidienne. Racontez une expérience récente où vous avez aidé quelqu'un (ou quelqu'un vous a aidé). Décrivez la situation, ce qui s'est passé et ce que vous avez ressenti (120 à 150 mots).",
    checklist: [
      "J'ai raconté au passé (passé composé + imparfait).",
      "J'ai structuré : situation → événement → sentiment/conclusion.",
      "J'ai respecté la longueur (120\u2013150 mots).",
      "J'ai utilisé des connecteurs temporels (un jour, ensuite, à la fin).",
      "J'ai exprimé un sentiment (j'étais content(e), cela m'a touché(e))."
    ]
  },
  {
    id: "tcf-ee-t3", exam: "tcf", skill: "writing",
    title: "TCF — Expression écrite, Tâche 3 : comparer et donner son opinion",
    time: 30, words: [120, 180],
    consigne:
      "Document 1 : « Le télétravail améliore la qualité de vie : moins de transport, plus de temps pour la famille. »\nDocument 2 : « Le télétravail isole les employés et rend la collaboration plus difficile. »\n\nDégagez les idées principales des deux documents, puis donnez votre opinion personnelle sur le télétravail (120 à 180 mots).",
    checklist: [
      "J'ai résumé les DEUX documents (sans les recopier).",
      "J'ai clairement séparé le résumé et mon opinion.",
      "J'ai donné mon opinion avec au moins un argument et un exemple.",
      "J'ai utilisé : selon le premier document..., en revanche..., à mon avis...",
      "J'ai respecté la longueur (120\u2013180 mots)."
    ]
  },
  {
    id: "tcf-eo-t1", exam: "tcf", skill: "speaking",
    title: "TCF — Expression orale, Tâche 1 : entretien dirigé",
    time: 2, words: null,
    consigne:
      "L'examinateur vous pose des questions sur vous : votre travail, vos études, votre famille, vos loisirs, vos projets.\n\nExemples : « Parlez-moi de votre travail. » — « Qu'est-ce que vous aimez faire le week-end ? » — « Quels sont vos projets pour l'avenir ? »\n\nRépondez de façon développée (2\u20133 phrases par question), pas seulement par oui ou non.",
    checklist: [
      "Je développe chaque réponse (2\u20133 phrases minimum).",
      "Je donne des exemples personnels concrets.",
      "J'utilise le présent, le passé composé et le futur proche correctement.",
      "Je parle sans longues hésitations.",
      "Je ne réponds jamais par un seul mot."
    ]
  },
  {
    id: "tcf-eo-t2", exam: "tcf", skill: "speaking",
    title: "TCF — Expression orale, Tâche 2 : interaction (poser des questions)",
    time: 6, words: null,
    consigne:
      "Situation : Vous voulez vous inscrire à un club de sport. Vous rencontrez le responsable du club. Posez-lui des questions pour obtenir toutes les informations nécessaires : activités, horaires, tarifs, équipement, essai gratuit...\n\n(2 minutes de préparation, puis 3 min 30 d'échange.)",
    checklist: [
      "J'ai préparé mes questions pendant les 2 minutes de préparation.",
      "J'ai posé des questions variées et bien formées.",
      "J'ai utilisé le vouvoiement.",
      "J'ai réagi aux réponses avant de poser la question suivante.",
      "J'ai maintenu l'échange pendant tout le temps imparti."
    ]
  },
  {
    id: "tcf-eo-t3", exam: "tcf", skill: "speaking",
    title: "TCF — Expression orale, Tâche 3 : point de vue",
    time: 5, words: null,
    consigne:
      "« Certaines personnes pensent qu'il est préférable de vivre en ville, d'autres préfèrent la campagne. Et vous, qu'en pensez-vous ? »\n\nDonnez votre opinion et justifiez-la avec des arguments et des exemples. Parlez sans préparation pendant environ 4 minutes 30.",
    checklist: [
      "J'ai annoncé mon opinion clairement dès le début.",
      "J'ai donné 2\u20133 arguments avec des exemples personnels.",
      "J'ai utilisé des connecteurs : d'abord, de plus, par exemple, en conclusion.",
      "J'ai parlé assez longtemps (viser 3\u20134 minutes minimum).",
      "J'ai conclu en résumant mon point de vue."
    ]
  }
];

/* ---------------------------------------------------------------
 * Evaluation criteria (aligned with official scoring dimensions)
 * ------------------------------------------------------------- */
const CRITERIA = {
  writing: [
    { key: "task", label: "Respect de la consigne", hint: "Sujet traité, longueur, toutes les parties de la tâche" },
    { key: "coherence", label: "Cohérence et organisation", hint: "Structure, paragraphes, connecteurs logiques" },
    { key: "lexis", label: "Vocabulaire (étendue et précision)", hint: "Mots adaptés au sujet, peu de répétitions" },
    { key: "grammar", label: "Grammaire (variété et exactitude)", hint: "Conjugaisons, accords, temps du passé" },
    { key: "register", label: "Registre et format", hint: "Tu/vous adapté, format lettre/message/article respecté" }
  ],
  speaking: [
    { key: "task", label: "Respect de la consigne", hint: "Tâche accomplie entièrement, rôle respecté" },
    { key: "coherence", label: "Cohérence et structure", hint: "Idées enchaînées logiquement, connecteurs" },
    { key: "lexis", label: "Vocabulaire (étendue et précision)", hint: "Mots adaptés à la situation, peu de blocages" },
    { key: "grammar", label: "Grammaire (variété et exactitude)", hint: "Phrases complètes, temps corrects" },
    { key: "fluency", label: "Aisance et prononciation", hint: "Débit régulier, liaisons, clarté, peu d'hésitations" }
  ]
};

const CRITERIA_TIPS = {
  task: "Relisez la consigne et vérifiez chaque partie demandée (qui, quoi, longueur, format). Une tâche incomplète plafonne la note, même avec un bon français.",
  coherence: "Structurez avec des connecteurs simples et fiables : d'abord, ensuite, de plus, par exemple, en conclusion. Un paragraphe = une idée.",
  lexis: "Apprenez 20\u201330 mots par thème fréquent (travail, logement, services, loisirs). Évitez les répétitions en préparant des synonymes simples.",
  grammar: "Sécurisez le présent, le passé composé/imparfait et le futur proche. Vérifiez systématiquement les accords sujet-verbe et les articles.",
  register: "Lettre formelle : « Monsieur/Madame », vouvoiement, formule de politesse finale. Message amical : « Salut », tutoiement, « À bientôt ».",
  fluency: "Entraînez-vous avec un chronomètre : mieux vaut des phrases simples et fluides que des phrases complexes pleines de pauses."
};

/* ---------------------------------------------------------------
 * Score estimation
 * Self-rated criteria (0\u20135 each, total /25) are mapped onto the
 * official scale of the selected exam, then converted to NCLC
 * using the IRCC tables. Deliberately slightly strict.
 * ------------------------------------------------------------- */
function estimateScore(exam, skill, values) {
  const total = values.reduce((a, b) => a + b, 0); // 0\u201325
  const ratio = total / 25;
  let score;
  if (exam === "tcf") {
    // Map onto /20; strict rounding (floor).
    score = Math.floor(ratio * 20);
    score = Math.max(0, Math.min(20, score));
  } else {
    // Map onto 0\u2013699.
    score = Math.floor(ratio * 699);
    score = Math.max(0, Math.min(699, score));
  }
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
 * Page: Practice (banque de sujets)
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
      list.innerHTML = '<p style="color:var(--muted)">Aucune tâche ne correspond à ce filtre.</p>';
      return;
    }
    tasks.forEach(t => list.appendChild(buildTaskCard(t)));
  }

  function buildTaskCard(t) {
    const card = document.createElement("div");
    card.className = "card task-card";

    const examPill = t.exam === "tef" ? '<span class="pill pill-tef">TEF Canada</span>' : '<span class="pill pill-tcf">TCF Canada</span>';
    const skillPill = t.skill === "writing" ? '<span class="pill pill-ee">Expression écrite</span>' : '<span class="pill pill-eo">Expression orale</span>';
    const timePill = `<span class="pill pill-time">\u23F1 ${t.time} min</span>`;
    const wordsPill = t.words ? `<span class="pill pill-time">${t.words[0]}\u2013${t.words[1]} mots</span>` : "";

    card.innerHTML = `
      <div class="task-head"><h3>${t.title}</h3></div>
      <div class="task-meta">${examPill}${skillPill}${timePill}${wordsPill}</div>
      <div class="task-consigne">${t.consigne}</div>
      <details class="checklist">
        <summary>Liste de vérification NCLC 5</summary>
        <ul>${t.checklist.map(c => `<li>${c}</li>`).join("")}</ul>
      </details>
      <div class="task-tools">
        <span class="timer-display" data-timer>${formatTime(t.time * 60)}</span>
        <button class="btn-small" data-timer-btn>Démarrer le chrono</button>
        <button class="btn-small" data-timer-reset>Réinitialiser</button>
      </div>
    `;

    if (t.skill === "writing") {
      const wrap = document.createElement("div");
      wrap.className = "task-writing";
      wrap.innerHTML = `
        <textarea placeholder="Écrivez votre réponse ici..." spellcheck="false"></textarea>
        <div class="task-tools">
          <span class="word-count" data-wc>0 mot</span>
        </div>`;
      card.appendChild(wrap);
      const ta = wrap.querySelector("textarea");
      const wc = wrap.querySelector("[data-wc]");
      ta.addEventListener("input", () => {
        const n = countWords(ta.value);
        wc.textContent = n <= 1 ? `${n} mot` : `${n} mots`;
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
        startBtn.textContent = "Reprendre";
        return;
      }
      startBtn.textContent = "Pause";
      interval = setInterval(() => {
        remaining -= 1;
        update();
        if (remaining <= 0) {
          clearInterval(interval);
          interval = null;
          display.textContent = "Temps écoulé !";
          startBtn.textContent = "Démarrer le chrono";
        }
      }, 1000);
    });
    resetBtn.addEventListener("click", () => {
      if (interval) { clearInterval(interval); interval = null; }
      remaining = t.time * 60;
      startBtn.textContent = "Démarrer le chrono";
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
 * Page: Evaluation (auto-évaluation)
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
        <div class="scale-labels"><span>0 — très insuffisant</span><span>3 — NCLC 5 visé</span><span>5 — excellent</span></div>
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
    const skillLabel = state.skill === "writing" ? "Expression écrite" : "Expression orale";
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
      feedback += "<li><strong>Consigne non respectée :</strong> une réponse hors sujet ou très incomplète plafonne la note sous le NCLC 5, quelle que soit la qualité de la langue. C'est la priorité absolue.</li>";
    }
    if (weakest.length) {
      feedback += weakest.map(x => `<li><strong>${x.c.label} (${x.v}/5) :</strong> ${CRITERIA_TIPS[x.c.key]}</li>`).join("");
    }
    if (!feedback) {
      feedback = "<li>Aucun point faible majeur détecté. Consolidez en refaisant des tâches chronométrées et en variant les sujets.</li>";
    }

    resultBox.className = `result-box ${pass ? "pass" : "fail"}`;
    resultBox.innerHTML = `
      <div class="result-verdict">${pass ? "\u2713 Objectif NCLC 5 atteint" : "\u2717 NCLC 5 non atteint"}</div>
      <p style="font-size:0.9rem;color:var(--muted)">${examLabel} — ${skillLabel} · Estimation basée sur votre auto-évaluation (volontairement stricte).</p>
      <div class="result-details">
        <div class="result-stat"><div class="stat-label">Score estimé</div><div class="stat-value">${score}<span style="font-size:0.9rem;color:var(--muted)"> ${scaleLabel}</span></div></div>
        <div class="result-stat"><div class="stat-label">Niveau NCLC</div><div class="stat-value">NCLC ${nclc}</div></div>
        <div class="result-stat"><div class="stat-label">Seuil NCLC 5</div><div class="stat-value">${thresholdLabel(state.exam, state.skill)}</div></div>
      </div>
      <div class="result-feedback">
        <strong>${pass ? "Pour sécuriser (et dépasser) le niveau :" : "Priorités pour atteindre le NCLC 5 :"}</strong>
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
 * Page: Tables (tableaux de conversion)
 * ------------------------------------------------------------- */
function initTables() {
  const wrap = document.getElementById("tables-root");
  if (!wrap) return;

  const skillNames = {
    reading: "Compréhension de l'écrit",
    writing: "Expression écrite",
    listening: "Compréhension de l'oral",
    speaking: "Expression orale"
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
              <th>Niveau</th>
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
  initPractice();
  initEvaluation();
  initTables();
});
