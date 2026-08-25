/* ============ LearnFrench — Mock tests (listening & reading) ============ */
"use strict";

/* ---------------------------------------------------------------
 * Mock test bank.
 * Listening audio is generated with the browser's French
 * text-to-speech (Web Speech API); each item can be played at
 * most twice, as on the real exams. Questions follow the official
 * MCQ format: 4 options (A\u2013D), one correct answer.
 * Difficulty is progressive, as in the real tests.
 * ------------------------------------------------------------- */
const MOCK_TESTS = [
  {
    id: "tef-co-1", exam: "tef", skill: "listening",
    title: "TEF Canada — Listening mini-mock #1",
    format: "Real exam: 60 questions / 40 min. This mini-mock: 8 questions, audio played max twice.",
    time: 10,
    items: [
      {
        audio: "Le train TGV numéro 8 5 4 2 à destination de Montréal partira à 14 h 35, voie 7. Attention : le train partira voie 7 et non voie 4 comme annoncé précédemment.",
        q: "De quelle voie le train va-t-il partir ?",
        options: ["Voie 4", "Voie 7", "Voie 14", "Voie 35"],
        answer: 1
      },
      {
        audio: "Bonjour, c'est le cabinet du docteur Lemoine. Nous vous appelons pour confirmer votre rendez-vous de jeudi à 9 heures. Si vous ne pouvez pas venir, merci de nous rappeler avant mercredi soir.",
        q: "Pourquoi le cabinet appelle-t-il ?",
        options: ["Pour annuler un rendez-vous", "Pour confirmer un rendez-vous", "Pour changer l'heure du rendez-vous", "Pour donner des résultats médicaux"],
        answer: 1
      },
      {
        audio: "Chers clients, votre magasin ferme ses portes dans quinze minutes. Merci de vous diriger vers les caisses. Nous vous rappelons que le magasin sera exceptionnellement fermé demain pour inventaire.",
        q: "Que se passera-t-il demain ?",
        options: ["Le magasin ouvrira plus tôt", "Il y aura des soldes", "Le magasin sera fermé", "Les caisses seront fermées"],
        answer: 2
      },
      {
        audio: "— Salut Karim, tu viens toujours au cinéma ce soir ? — Ah, désolé Julie, je ne peux pas finalement. Ma voiture est en panne et le garagiste ne peut pas la réparer avant vendredi. — Ce n'est pas grave, je peux passer te chercher ! — C'est vrai ? Super, merci !",
        q: "Pourquoi Karim ne pouvait-il pas aller au cinéma ?",
        options: ["Il est malade", "Il travaille ce soir", "Sa voiture est en panne", "Il n'aime pas le film"],
        answer: 2
      },
      {
        audio: "— Bonjour, je voudrais envoyer ce colis au Canada, s'il vous plaît. — Bien sûr. En envoi standard, c'est 28 euros, il arrive en dix jours. En express, c'est 45 euros et il arrive en trois jours. — Hmm, ce n'est pas urgent, je vais prendre le standard.",
        q: "Combien la cliente va-t-elle payer ?",
        options: ["10 euros", "28 euros", "45 euros", "73 euros"],
        answer: 1
      },
      {
        audio: "Météo France annonce pour demain une matinée ensoleillée sur l'ensemble de la région. En revanche, des orages violents sont attendus en fin d'après-midi. Il est conseillé d'éviter les déplacements après 17 heures.",
        q: "Quel temps fera-t-il demain matin ?",
        options: ["Il pleuvra", "Il y aura des orages", "Il fera beau", "Il y aura du vent"],
        answer: 2
      },
      {
        audio: "— Alors, ce nouveau travail ? — Franchement, l'équipe est très sympa et le salaire est correct. Mais je passe presque deux heures dans les transports chaque jour, c'est épuisant. Je me demande si je ne vais pas chercher quelque chose de plus près de chez moi.",
        q: "Quel est le problème principal de cette personne ?",
        options: ["Le salaire est trop bas", "Les collègues sont désagréables", "Le trajet est trop long", "Le travail est ennuyeux"],
        answer: 2
      },
      {
        audio: "Selon une étude publiée cette semaine, près de 40 % des Canadiens travaillent désormais à distance au moins deux jours par semaine. Les chercheurs soulignent que cette pratique améliore l'équilibre entre vie professionnelle et vie personnelle, mais qu'elle peut aussi réduire les échanges spontanés entre collègues.",
        q: "Quel inconvénient du travail à distance est mentionné ?",
        options: ["Il coûte cher aux entreprises", "Il réduit les échanges entre collègues", "Il diminue la productivité", "Il augmente le temps de travail"],
        answer: 1
      }
    ]
  },
  {
    id: "tcf-co-1", exam: "tcf", skill: "listening",
    title: "TCF Canada — Listening mini-mock #1",
    format: "Real exam: 39 questions / 35 min. This mini-mock: 8 questions, audio played max twice.",
    time: 10,
    items: [
      {
        audio: "— Excusez-moi, où se trouve la pharmacie la plus proche ? — C'est très simple : vous continuez tout droit et c'est juste après la banque, sur votre gauche.",
        q: "Où se trouve la pharmacie ?",
        options: ["Avant la banque, à droite", "Après la banque, à gauche", "En face de la banque", "Dans la banque"],
        answer: 1
      },
      {
        audio: "Bonjour, c'est Amélie. Je t'appelle parce que j'ai deux billets pour le concert de samedi et mon frère ne peut plus venir. Ça te dit de m'accompagner ? Rappelle-moi vite !",
        q: "Pourquoi Amélie appelle-t-elle ?",
        options: ["Pour annuler un concert", "Pour vendre deux billets", "Pour inviter quelqu'un au concert", "Pour demander un billet"],
        answer: 2
      },
      {
        audio: "Votre attention s'il vous plaît. En raison de travaux, la ligne 2 du métro est fermée entre les stations Papineau et Berri jusqu'à dimanche. Des autobus de remplacement sont disponibles à la sortie des stations.",
        q: "Que propose-t-on aux voyageurs ?",
        options: ["Un remboursement", "Des autobus de remplacement", "Un autre horaire de métro", "Un taxi gratuit"],
        answer: 1
      },
      {
        audio: "— Tu as trouvé un appartement à Québec ? — Oui, enfin ! Un trois-pièces dans le quartier Saint-Roch. Le loyer est un peu élevé, mais je suis à dix minutes à pied du bureau, alors j'économise sur le transport.",
        q: "Quel est l'avantage de cet appartement ?",
        options: ["Le loyer est bas", "Il est proche du travail", "Il est très grand", "Le quartier est calme"],
        answer: 1
      },
      {
        audio: "— Bonjour, je vous appelle au sujet de l'annonce pour le poste de serveur. Est-ce que le poste est toujours disponible ? — Oui, tout à fait. Vous avez de l'expérience ? — Oui, j'ai travaillé trois ans dans un restaurant à Ottawa. — Parfait, pouvez-vous passer demain vers 15 heures avec votre CV ?",
        q: "Que doit faire le candidat ?",
        options: ["Envoyer son CV par courriel", "Rappeler dans trois jours", "Venir demain avec son CV", "Commencer à travailler demain"],
        answer: 2
      },
      {
        audio: "Cette semaine, notre émission s'intéresse aux marchés de quartier. De plus en plus d'habitants préfèrent acheter leurs fruits et légumes directement aux producteurs locaux. C'est parfois un peu plus cher, mais les produits sont plus frais et cela soutient l'économie de la région.",
        q: "Pourquoi les habitants préfèrent-ils les marchés de quartier ?",
        options: ["Les prix sont plus bas", "Les produits sont plus frais", "C'est plus rapide", "Il y a plus de choix"],
        answer: 1
      },
      {
        audio: "— Vous avez aimé le spectacle ? — Honnêtement, la première partie était un peu longue, j'ai failli m'endormir. Mais la deuxième partie, quelle énergie ! Les danseurs étaient extraordinaires. Je ne regrette pas du tout ma soirée.",
        q: "Que pense cette personne du spectacle ?",
        options: ["Elle a tout adoré", "Elle s'est ennuyée du début à la fin", "Le début était long mais la suite excellente", "Les danseurs étaient décevants"],
        answer: 2
      },
      {
        audio: "D'après un rapport publié hier, le nombre d'étudiants étrangers qui choisissent les universités francophones du Canada a augmenté de 15 % en deux ans. Les auteurs du rapport expliquent cette hausse par la qualité des programmes, mais aussi par les possibilités d'immigration offertes après les études.",
        q: "Qu'est-ce qui explique cette augmentation, selon le rapport ?",
        options: ["Des frais de scolarité moins élevés", "La qualité des programmes et les possibilités d'immigration", "Des bourses plus nombreuses", "La proximité avec les États-Unis"],
        answer: 1
      }
    ]
  },
  {
    id: "tef-ce-1", exam: "tef", skill: "reading",
    title: "TEF Canada — Reading mini-mock #1",
    format: "Real exam: 50 questions / 60 min. This mini-mock: 8 questions.",
    time: 12,
    items: [
      {
        text: "AVIS AUX RÉSIDENTS — L'eau sera coupée dans tout l'immeuble mardi 12 mars de 9 h à 13 h pour des travaux de plomberie. Merci de prévoir vos réserves d'eau à l'avance. Le gestionnaire.",
        q: "Que doivent faire les résidents ?",
        options: ["Quitter l'immeuble mardi matin", "Préparer de l'eau à l'avance", "Appeler le plombier", "Payer les travaux de plomberie"],
        answer: 1
      },
      {
        text: "Vends vélo de ville, très bon état, acheté il y a un an. Freins neufs, panier avant, antivol inclus. Prix : 120 $ (négociable). Raison de la vente : déménagement à l'étranger. Contact : 514-555-0182 après 18 h.",
        q: "Pourquoi cette personne vend-elle son vélo ?",
        options: ["Le vélo est en mauvais état", "Elle part vivre à l'étranger", "Elle veut un vélo neuf", "Elle n'a plus de place chez elle"],
        answer: 1
      },
      {
        text: "Objet : Report de la réunion d'équipe — Bonjour à tous, la réunion prévue lundi 8 avril à 10 h est reportée au mercredi 10 avril à 14 h, salle B-204, car plusieurs collègues seront en formation lundi. Merci de confirmer votre présence avant vendredi. Cordialement, Nadia.",
        q: "Pourquoi la réunion est-elle reportée ?",
        options: ["La salle n'est pas disponible", "Nadia est en vacances", "Des collègues sont en formation lundi", "Le projet a pris du retard"],
        answer: 2
      },
      {
        text: "La bibliothèque municipale lance un service de livraison de livres à domicile pour les personnes de plus de 65 ans et les personnes à mobilité réduite. Le service est gratuit ; il suffit de réserver ses livres par téléphone ou sur le site Internet. Les livraisons ont lieu le mardi et le jeudi.",
        q: "À qui ce service est-il destiné ?",
        options: ["À tous les habitants de la ville", "Aux étudiants", "Aux personnes âgées et à mobilité réduite", "Aux enfants de moins de 12 ans"],
        answer: 2
      },
      {
        text: "Restaurant Le Jardin — Menu du midi (11 h 30 \u2013 14 h) : entrée + plat ou plat + dessert : 18 $ ; entrée + plat + dessert : 23 $. Café inclus. Le menu du midi n'est pas servi le week-end ni les jours fériés.",
        q: "Un client peut avoir le menu du midi...",
        options: ["le samedi à midi", "un jour férié", "le mercredi à 13 h", "le vendredi à 15 h"],
        answer: 2
      },
      {
        text: "Chère Madame Tremblay, nous avons bien reçu votre candidature pour le poste d'assistante administrative. Votre profil a retenu notre attention et nous souhaitons vous rencontrer. Nous vous proposons un entretien le jeudi 21 mai à 10 h 30 dans nos bureaux. Merci de nous confirmer votre disponibilité.",
        q: "Quel est le but de cette lettre ?",
        options: ["Refuser une candidature", "Proposer un entretien d'embauche", "Offrir un contrat de travail", "Demander des documents supplémentaires"],
        answer: 1
      },
      {
        text: "De plus en plus de villes canadiennes encouragent leurs habitants à composter leurs déchets alimentaires. À Montréal, la collecte des résidus alimentaires est maintenant offerte dans presque tous les quartiers. Selon la Ville, près de la moitié du contenu d'une poubelle moyenne pourrait être compostée au lieu d'être enfouie.",
        q: "Que dit la Ville de Montréal ?",
        options: ["Le compostage est obligatoire depuis cette année", "Environ 50 % des déchets d'une poubelle pourraient être compostés", "Tous les quartiers refusent la collecte", "Les habitants compostent déjà la moitié de leurs déchets"],
        answer: 1
      },
      {
        text: "Le télétravail transforme le marché immobilier. Libérés de l'obligation d'habiter près de leur bureau, de nombreux travailleurs quittent les grands centres pour s'installer en banlieue éloignée, où les maisons sont plus abordables. Résultat : les prix augmentent rapidement dans ces régions autrefois bon marché, ce qui inquiète les résidents de longue date.",
        q: "Quelle est la conséquence décrite dans ce texte ?",
        options: ["Les prix baissent dans les banlieues éloignées", "Les bureaux ferment dans les grands centres", "Les prix montent dans les régions autrefois abordables", "Les travailleurs refusent le télétravail"],
        answer: 2
      }
    ]
  },
  {
    id: "tcf-ce-1", exam: "tcf", skill: "reading",
    title: "TCF Canada — Reading mini-mock #1",
    format: "Real exam: 39 questions / 60 min. This mini-mock: 8 questions.",
    time: 12,
    items: [
      {
        text: "PISCINE MUNICIPALE — Horaires d'été (du 15 juin au 31 août) : lundi au vendredi 7 h \u2013 21 h ; samedi et dimanche 9 h \u2013 18 h. Bonnet de bain obligatoire.",
        q: "Le dimanche, la piscine ferme à...",
        options: ["21 h", "18 h", "9 h", "7 h"],
        answer: 1
      },
      {
        text: "Salut Fatima ! Merci encore pour la soirée de samedi, c'était vraiment réussi. J'ai oublié mon écharpe bleue chez toi, je crois qu'elle est sur le canapé. Est-ce que je peux passer la chercher demain après le travail, vers 18 h ? Bises, Léa.",
        q: "Pourquoi Léa écrit-elle ce message ?",
        options: ["Pour inviter Fatima à une soirée", "Pour récupérer un objet oublié", "Pour annuler une visite", "Pour offrir une écharpe à Fatima"],
        answer: 1
      },
      {
        text: "OFFRE D'EMPLOI — Café du Parc recherche un(e) barista à temps partiel (20 h/semaine). Horaires : matins et week-ends. Expérience souhaitée mais non obligatoire : formation offerte. Salaire : 17 $/h + pourboires. Envoyez votre CV à emploi@cafeduparc.ca.",
        q: "Que propose le café aux candidats sans expérience ?",
        options: ["Un salaire plus bas", "Une formation", "Un contrat plus court", "Des horaires de soir"],
        answer: 1
      },
      {
        text: "Bonjour, je m'appelle Diego, j'ai 29 ans et je viens d'arriver à Moncton. Je cherche un partenaire ou une partenaire pour pratiquer mon français deux soirs par semaine, dans un café ou en ligne. En échange, je peux vous aider en espagnol, ma langue maternelle. Niveau demandé : aucun, juste de la motivation !",
        q: "Que propose Diego en échange de l'aide en français ?",
        options: ["De l'argent", "Des cours d'anglais", "Des cours d'espagnol", "Un logement"],
        answer: 2
      },
      {
        text: "Chers locataires, à partir du 1er novembre, le stationnement de nuit (23 h \u2013 7 h) dans la rue sera interdit pour permettre le déneigement. Les résidents peuvent demander une vignette pour le stationnement souterrain au bureau du gestionnaire, au coût de 40 $ par mois.",
        q: "Pourquoi le stationnement de nuit sera-t-il interdit ?",
        options: ["Pour des travaux de construction", "Pour permettre le déneigement", "Pour installer des bornes électriques", "Pour réduire le bruit la nuit"],
        answer: 1
      },
      {
        text: "L'organisme Accueil Nouveaux Arrivants offre des ateliers gratuits de préparation à l'emploi : rédaction de CV à la canadienne, simulation d'entrevue et réseautage. Les ateliers ont lieu chaque mois. Inscription obligatoire, places limitées. Priorité aux personnes arrivées au Canada depuis moins de deux ans.",
        q: "Qui a la priorité pour ces ateliers ?",
        options: ["Les personnes sans emploi", "Les étudiants", "Les personnes arrivées depuis moins de deux ans", "Les personnes qui parlent déjà français"],
        answer: 2
      },
      {
        text: "Faut-il interdire les téléphones à l'école ? Pour les uns, le téléphone est une source constante de distraction qui nuit à la concentration et aux résultats. Pour les autres, c'est un outil pédagogique moderne qu'il faut apprendre à utiliser de façon responsable plutôt que d'interdire. Le débat divise parents et enseignants.",
        q: "Que pensent les personnes opposées à l'interdiction ?",
        options: ["Le téléphone améliore toujours les résultats", "Il faut apprendre à utiliser le téléphone de façon responsable", "Les parents doivent décider seuls", "Les téléphones doivent rester à la maison"],
        answer: 1
      },
      {
        text: "Une étude récente révèle que les Canadiens passent en moyenne six heures par jour devant un écran en dehors du travail. Les chercheurs recommandent de remplacer une partie de ce temps par des activités extérieures, dont les bienfaits sur le sommeil et l'humeur sont bien démontrés. Ils précisent toutefois que le problème n'est pas l'écran lui-même, mais le temps qu'on lui consacre au détriment d'autres activités.",
        q: "Selon les chercheurs, quel est le vrai problème ?",
        options: ["Les écrans eux-mêmes", "Le contenu regardé", "Le temps passé devant l'écran au détriment d'autres activités", "Le manque de sommeil des Canadiens"],
        answer: 2
      }
    ]
  }
];

/* ---------------------------------------------------------------
 * Raw result → estimated scaled score → NCLC.
 * Anchors (deliberately strict, like the production estimator):
 * 0% → scale floor, 45% → NCLC 5 threshold, 90% → NCLC 9
 * threshold, 100% → scale ceiling. Piecewise linear in between.
 * ------------------------------------------------------------- */
function mockScoreEstimate(exam, skill, correct, totalQuestions) {
  const table = IRCC_TABLES[exam].skills[skill];
  const floor = exam === "tcf" ? 331 : 0;
  const ceil = 699;
  const p = correct / totalQuestions;
  const t5 = table[5][0];
  const t9 = table[9][0];
  let score;
  if (p <= 0.45) {
    score = floor + (p / 0.45) * (t5 - floor);
  } else if (p <= 0.90) {
    score = t5 + ((p - 0.45) / 0.45) * (t9 - t5);
  } else {
    score = t9 + ((p - 0.90) / 0.10) * (ceil - t9);
  }
  score = Math.floor(score);
  const nclc = scoreToNCLC(exam, skill, score);
  return { score, nclc };
}

/* ---------------------------------------------------------------
 * Listening audio via the Web Speech API (French TTS).
 * ------------------------------------------------------------- */
function getFrenchVoice() {
  const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  return voices.find(v => v.lang === "fr-FR") ||
         voices.find(v => v.lang === "fr-CA") ||
         voices.find(v => v.lang && v.lang.startsWith("fr")) || null;
}

function speakFrench(text, onEnd) {
  const u = new SpeechSynthesisUtterance(text);
  const voice = getFrenchVoice();
  if (voice) u.voice = voice;
  u.lang = (voice && voice.lang) || "fr-FR";
  u.rate = 0.95;
  u.onend = onEnd;
  u.onerror = onEnd;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* ---------------------------------------------------------------
 * Page: Mock tests
 * ------------------------------------------------------------- */
function initMockTests() {
  const root = document.getElementById("mock-list");
  if (!root) return;

  const ttsSupported = "speechSynthesis" in window;
  if (ttsSupported) {
    // Some browsers load voices asynchronously.
    speechSynthesis.getVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }
  }

  const state = { exam: "all", skill: "all" };

  function render() {
    speechSynthesis && speechSynthesis.cancel && speechSynthesis.cancel();
    root.innerHTML = "";
    const tests = MOCK_TESTS.filter(t =>
      (state.exam === "all" || t.exam === state.exam) &&
      (state.skill === "all" || t.skill === state.skill)
    );
    if (!tests.length) {
      root.innerHTML = '<p style="color:var(--muted)">No mock test matches this filter.</p>';
      return;
    }
    tests.forEach(t => root.appendChild(buildTest(t)));
  }

  function buildTest(t) {
    const card = document.createElement("div");
    card.className = "card task-card";

    const examPill = t.exam === "tef" ? '<span class="pill pill-tef">TEF Canada</span>' : '<span class="pill pill-tcf">TCF Canada</span>';
    const skillPill = t.skill === "listening" ? '<span class="pill pill-eo">Listening</span>' : '<span class="pill pill-ee">Reading</span>';

    card.innerHTML = `
      <div class="task-head"><h3>${t.title}</h3></div>
      <div class="task-meta">${examPill}${skillPill}<span class="pill pill-time">\u23F1 ${t.time} min</span><span class="pill pill-time">${t.items.length} questions</span></div>
      <p style="font-size:0.86rem;color:var(--muted);margin-top:10px">${t.format}</p>
      <div class="task-tools">
        <button class="btn btn-outline" data-start>Start this mock test</button>
      </div>
      <div data-body class="hidden" style="margin-top:18px"></div>
    `;

    const body = card.querySelector("[data-body]");
    const startBtn = card.querySelector("[data-start]");
    let timerInterval = null;

    startBtn.addEventListener("click", () => {
      startBtn.classList.add("hidden");
      body.classList.remove("hidden");
      renderQuestions();
    });

    function renderQuestions() {
      const isListening = t.skill === "listening";
      let html = `
        <div class="task-tools" style="margin-bottom:14px">
          <span class="timer-display" data-mock-timer>${t.time}:00</span>
          <span style="font-size:0.84rem;color:var(--muted)">Answer all ${t.items.length} questions, then submit.</span>
        </div>`;
      if (isListening && !ttsSupported) {
        html += `<div class="callout"><strong>Audio unavailable:</strong> your browser does not support speech synthesis. The transcripts are shown instead so you can still practice the questions.</div>`;
      }

      html += t.items.map((item, qi) => {
        let stimulus;
        if (isListening && ttsSupported) {
          stimulus = `
            <div class="task-tools" style="margin:0 0 8px">
              <button class="btn-small" data-play="${qi}">\u25B6 Play audio</button>
              <span style="font-size:0.8rem;color:var(--muted)" data-plays="${qi}">2 plays left</span>
            </div>`;
        } else {
          stimulus = `<div class="task-consigne">${isListening ? item.audio : item.text}</div>`;
        }
        const opts = item.options.map((opt, oi) => `
          <label style="display:block;padding:7px 12px;border:1.5px solid var(--border);border-radius:8px;margin-bottom:6px;cursor:pointer;font-size:0.92rem" data-opt="${qi}-${oi}">
            <input type="radio" name="${t.id}-q${qi}" value="${oi}" style="margin-right:8px;accent-color:var(--red)">
            <strong>${String.fromCharCode(65 + oi)}.</strong> ${opt}
          </label>`).join("");
        return `
          <div style="margin-bottom:22px" data-question="${qi}">
            <p style="font-weight:700;font-size:0.94rem;margin-bottom:8px">Question ${qi + 1}. <span style="font-weight:600">${item.q}</span></p>
            ${stimulus}
            ${opts}
            <div data-review="${qi}" class="hidden" style="font-size:0.88rem;margin-top:6px"></div>
          </div>`;
      }).join("");

      html += `
        <div class="task-tools">
          <button class="btn btn-primary" data-submit>Submit answers</button>
        </div>
        <div data-result class="result-box hidden" style="margin-top:18px"></div>`;

      body.innerHTML = html;

      // Timer
      const timerEl = body.querySelector("[data-mock-timer]");
      let remaining = t.time * 60;
      timerInterval = setInterval(() => {
        remaining -= 1;
        const m = Math.floor(remaining / 60), s = remaining % 60;
        timerEl.textContent = `${m}:${String(s).padStart(2, "0")}`;
        timerEl.classList.toggle("danger", remaining <= 60);
        if (remaining <= 0) {
          clearInterval(timerInterval);
          timerEl.textContent = "Time's up!";
          grade();
        }
      }, 1000);

      // Audio buttons: max 2 plays each, as on the real exam
      const playsLeft = {};
      body.querySelectorAll("[data-play]").forEach(btn => {
        const qi = parseInt(btn.dataset.play, 10);
        playsLeft[qi] = 2;
        btn.addEventListener("click", () => {
          if (playsLeft[qi] <= 0 || speechSynthesis.speaking) return;
          playsLeft[qi] -= 1;
          const counter = body.querySelector(`[data-plays="${qi}"]`);
          counter.textContent = playsLeft[qi] === 1 ? "1 play left" : "No plays left";
          btn.classList.add("recording");
          speakFrench(t.items[qi].audio, () => {
            btn.classList.remove("recording");
            if (playsLeft[qi] <= 0) btn.disabled = true;
          });
        });
      });

      body.querySelector("[data-submit]").addEventListener("click", grade);

      function grade() {
        clearInterval(timerInterval);
        speechSynthesis && speechSynthesis.cancel && speechSynthesis.cancel();
        let correct = 0;
        t.items.forEach((item, qi) => {
          const chosen = body.querySelector(`input[name="${t.id}-q${qi}"]:checked`);
          const chosenIdx = chosen ? parseInt(chosen.value, 10) : null;
          const ok = chosenIdx === item.answer;
          if (ok) correct += 1;
          const review = body.querySelector(`[data-review="${qi}"]`);
          const letter = String.fromCharCode(65 + item.answer);
          review.classList.remove("hidden");
          if (ok) {
            review.innerHTML = `<span style="color:var(--green);font-weight:700">\u2713 Correct</span>`;
          } else {
            review.innerHTML = `<span style="color:var(--red);font-weight:700">\u2717 ${chosenIdx === null ? "No answer" : "Incorrect"}</span> — correct answer: <strong>${letter}. ${item.options[item.answer]}</strong>` +
              (t.skill === "listening" ? `<details style="margin-top:4px"><summary style="cursor:pointer;color:var(--navy);font-weight:600">Show transcript</summary><div class="task-consigne" style="margin-top:6px">${item.audio}</div></details>` : "");
          }
          body.querySelectorAll(`input[name="${t.id}-q${qi}"]`).forEach(i => { i.disabled = true; });
        });

        const { score, nclc } = mockScoreEstimate(t.exam, t.skill, correct, t.items.length);
        const pass = nclc >= 5;
        const [t5min] = IRCC_TABLES[t.exam].skills[t.skill][5];
        const resultEl = body.querySelector("[data-result]");
        resultEl.className = `result-box ${pass ? "pass" : "fail"}`;
        resultEl.innerHTML = `
          <div class="result-verdict">${pass ? "\u2713 CLB 5 level reached" : "\u2717 Below CLB 5"}</div>
          <div class="result-details">
            <div class="result-stat"><div class="stat-label">Raw score</div><div class="stat-value">${correct}/${t.items.length}</div></div>
            <div class="result-stat"><div class="stat-label">Estimated score</div><div class="stat-value">${score}<span style="font-size:0.9rem;color:var(--muted)"> /699</span></div></div>
            <div class="result-stat"><div class="stat-label">CLB / NCLC level</div><div class="stat-value">NCLC ${nclc}</div></div>
            <div class="result-stat"><div class="stat-label">CLB 5 threshold</div><div class="stat-value">${t5min} /699</div></div>
          </div>
          <p style="font-size:0.86rem">Review the incorrect answers above${t.skill === "listening" ? " (transcripts available)" : ""}, then retake the test after a break. Aim for at least 6/8 twice in a row.</p>
          <div class="task-tools" style="margin-top:10px"><button class="btn-small" data-retake>Retake this test</button></div>
        `;
        resultEl.classList.remove("hidden");
        resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        resultEl.querySelector("[data-retake]").addEventListener("click", renderQuestions);
      }
    }

    return card;
  }

  document.querySelectorAll("[data-mock-exam]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.exam = btn.dataset.mockExam;
      document.querySelectorAll("[data-mock-exam]").forEach(b => b.classList.toggle("active", b === btn));
      render();
    });
  });
  document.querySelectorAll("[data-mock-skill]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.skill = btn.dataset.mockSkill;
      document.querySelectorAll("[data-mock-skill]").forEach(b => b.classList.toggle("active", b === btn));
      render();
    });
  });

  render();
}

document.addEventListener("DOMContentLoaded", initMockTests);
