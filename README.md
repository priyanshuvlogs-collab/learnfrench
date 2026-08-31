# Lumen Français

> Un coach IA qui vous amène au NCLC dont vous avez réellement besoin.

Application web de préparation au **TEF Canada** et au **TCF Canada** pour les candidats à
l'immigration francophone (Entrée express, PEQ, PTPD…). Ce n'est pas un clone de Duolingo :
c'est un **produit orienté résultat d'examen** — chaque leçon, chaque chaîne de jours et chaque
message du coach existe pour faire monter l'une des quatre compétences vers la cible NCLC/CLB.

## Principes produit

- **Le score officiel = la compétence la plus faible.** Quatre estimations NCLC séparées
  (CO, CE, EE, EO) avec niveau de confiance ; jamais de moyenne « 72 % » fictive.
- **Psychologie intégrée, pas décorative** : identité de candidat, intentions
  d'implémentation, session minimale viable de 5 minutes, gels de chaîne (2/mois,
  automatiques), protocole de reprise sans culpabilisation, victoire concrète en fin de
  session (règle du pic-fin), interleaving + répétition espacée (SM-2 léger), respiration en
  carré avant les blancs.
- **Vérité d'examen** : structures TEF/TCF réalistes, règle de l'écoute unique entraînée
  comme une compétence, tableaux officiels IRCC (« ancien score » TEF pour Entrée express +
  barème /699 post-décembre 2023 + TCF) avec date de dernière vérification et lien canada.ca.
- **Transparence** : tous les scores sont des **estimations pédagogiques**, jamais des
  résultats officiels. Site indépendant, sans affiliation avec IRCC, Le français des
  affaires ou France Éducation international. Aucun conseil en immigration.

## Interface bilingue (anglais principal)

L'interface est en **anglais par défaut** : on apprend le français en lisant les deux langues
côte à côte. Un commutateur EN/FR (barre latérale, réglages, onboarding) bascule toute
l'interface en français quand on est prêt. Le contenu d'apprentissage reste en français —
c'est l'entraînement — mais chaque élément a sa traduction anglaise, révélée au bon moment
pédagogique : transcriptions et textes **après** la réponse, consignes des ateliers en
vis-à-vis, glose anglaise sous chaque carte SRS. Camille, elle, coache en français à dessein
(et répond brièvement en anglais si on lui écrit en anglais).

## Fonctionnalités (V1 complète de bout en bout)

| Écran | Contenu |
| --- | --- |
| Accueil / Aujourd'hui | Anneau de minutes, chaîne + gels, bannière compétence faible, bloc du jour en 4 temps, secours 5 min |
| Onboarding (3 min) | Examen, cible NCLC, date, minutes/jour, auto-évaluation par compétence, intention d'implémentation |
| Coach Camille | Chat avec mémoire 14 jours, réponses ancrées dans l'état réel (chaîne, profil, examen), refus des garanties, redirection de la panique visa, une action par message |
| Compétences | Tableaux de bord CO/CE/EE/EO + joueur d'exercices (écoute unique en synthèse vocale, pièges expliqués) |
| Atelier d'écriture | Consigne/éditeur en vis-à-vis, chrono officiel, compteur de mots, collage désactivé, détection de saut de niveau suspect, grille en 5 dimensions, paragraphe modèle + 3 formules |
| Atelier oral | Chronos d'examen, enregistrement micro, transcription (reconnaissance vocale navigateur), notation 5 dimensions, « redites-le, en mieux » |
| Révision | 120 cartes SRS (connecteurs, structures, pièges, gabarits), protocole de secours 5 min |
| Examens blancs | Mini-blancs CO/CE + blancs de section (débloqués à 7 jours de chaîne), respiration en carré, revue question par question avec temps passé |
| Progrès | Heatmap 14 jours, trajectoires par compétence, calendrier de chaîne 28 jours, modèle honnête « distance à la cible », lettre hebdomadaire du coach |
| Tableaux officiels | 3 barèmes IRCC avec avertissement double-colonne TEF |

Contenu d'origine (`source: original practice`) : 40 items d'écoute, 40 de lecture,
25 sujets d'écriture (TEF A/B + TCF T1/T2/T3) avec modèles, 25 sujets d'oral, 120 cartes SRS.
Aucune annale officielle n'est reproduite.

## Lancer

```bash
npm install
npx prisma db push       # crée la base SQLite (prisma/dev.db)
node prisma/seed.mjs     # crée le compte admin
npm run dev              # http://localhost:3000
npm run build            # production
npm run lint
```

## Comptes, base de données & freemium

- **Base de données** : Prisma + SQLite (`prisma/dev.db`, zéro infrastructure). Pour la
  production, remplacez la datasource par Postgres sans toucher aux modèles. Tables : `User`
  (rôle STUDENT/ADMIN, plan FREE/PREMIUM, accès actif/désactivé) et `ProgressSnapshot`
  (chaîne, minutes, compétence faible, estimations — synchronisé depuis l'appareil de
  l'étudiant après chaque session).
- **Auth réelle** : inscription/connexion par courriel + mot de passe (bcrypt), sessions JWT
  en cookie httpOnly (`AUTH_SECRET` en prod). La progression d'apprentissage reste sur
  l'appareil ; le serveur ne garde que le compte et l'instantané de progression.
- **Panneau admin** (`/admin`, compte seedé : `admin@lumen.local` / `admin1234`, configurable
  via `ADMIN_EMAIL`/`ADMIN_PASSWORD`) : statistiques (inscrits, actifs, premium, actifs de la
  semaine), création de comptes étudiants, bascule Free ↔ Premium, activation/révocation
  d'accès, suppression, et vue de la progression de chaque étudiant.
- **Freemium** : Gratuit = boucle quotidienne complète (bloc, exercices CO/CE, grammaire,
  SRS, mini-blancs) + 1 production écrite et 1 orale notées par jour. Premium (accordé par
  l'admin) = productions illimitées, blancs de section longs, coach IA OpenAI. Les limites
  sont appliquées côté client ET côté serveur (le coach IA vérifie la session).

### Coach IA (OpenAI)

Camille répond via l'API OpenAI quand `OPENAI_API_KEY` est défini côté serveur (copiez
`.env.example` vers `.env.local`, ou ajoutez le secret dans Cursor Dashboard → Cloud Agents →
Secrets). La route `/api/coach` impose une sortie JSON structurée (`texte + une seule action`)
et injecte tout l'état du candidat (examen, cible, compétence faible, chaîne, minutes, date)
ainsi que le contrat comportemental de Camille (refus des garanties, gestion de la panique
visa, correction douce du français, jamais de score « officiel »). Modèle par défaut :
`gpt-4o-mini` (surchargeable via `OPENAI_MODEL`). **Sans clé, rien ne casse** : le moteur
local déterministe répond, et un badge dans le chat indique le mode actif.

## Architecture

- **Next.js (App Router) + TypeScript + Tailwind CSS 4** ; polices Inter + Fraunces (chiffres).
- **État** : Zustand + persistance `localStorage` — la démo fonctionne entièrement dans le
  navigateur, sans base de données ni clé d'API.
- `lib/` : moteur (NCLC, chaîne/gels, SM-2, planificateur par phase d'examen, notation
  heuristique en 5 dimensions, moteur du coach Camille). `content/` : banques d'exercices et
  tableaux IRCC. `components/` + `app/` : UI.
- **Notation** : heuristiques transparentes qui miment la logique d'examinateur (respect de la
  consigne, connecteurs, étendue lexicale, structures, registre/aisance) — champs structurés,
  jamais de note libre. En production, on brancherait un LLM à sortie JSON contrainte sur la
  même grille, et Whisper pour la transcription.
- **Audio** : synthèse vocale du navigateur (écoute unique) ; reconnaissance vocale du
  navigateur pour l'atelier oral, avec repli saisie manuelle.

### Chemin de production suggéré

Postgres + Prisma, auth par lien magique + Google, stockage objet pour l'audio, LLM en JSON
structuré pour la grille, Whisper pour la transcription, cron de réinitialisation des gels et
rappels courriel (1/jour max, sans culpabilisation).

## Avertissement

Les équivalences score → NCLC proviennent des tableaux publiés par IRCC ; en cas de
divergence, [canada.ca](https://www.canada.ca) fait foi. Les scores produits par
l'application sont des estimations pédagogiques volontairement prudentes et ne remplacent
aucun résultat officiel.
