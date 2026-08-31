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
npm run dev      # http://localhost:3000
npm run build    # production
npm run lint
```

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
