# learnfrench

Site d'entraînement ciblé pour atteindre le **NCLC 5 (CLB 5)** au **TEF Canada** et au **TCF Canada**, dans une optique d'immigration francophone au Canada.

## Pages

| Page | Fichier | Contenu |
| --- | --- | --- |
| Accueil | `index.html` | Présentation de la méthode et comparaison TEF / TCF |
| Entraînement | `entrainement.html` | Banque de sujets au format officiel (écrit + oral) avec chronomètre, compteur de mots et listes de vérification NCLC 5 |
| Auto-évaluation | `evaluation.html` | Notation sur les 5 dimensions officielles, score estimé converti en NCLC, verdict « NCLC 5 atteint / non atteint » et conseils ciblés |
| Tableaux IRCC | `tableaux.html` | Équivalences officielles score → NCLC (TEF post-décembre 2023 et TCF Canada), seuil NCLC 5 surligné |
| Stratégie | `conseils.html` | Structures gagnantes, formules prêtes à l'emploi, erreurs éliminatoires et plan de préparation |

## Lancer le site

Site 100 % statique, sans dépendance ni étape de build. Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Données officielles

Les tableaux de conversion score → NCLC proviennent des tableaux publiés par IRCC sur [canada.ca](https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/pilotes-rurale-franco/immigration-franco/admissibilite/evaluation-linguistique.html) :

- **TEF Canada** : barème applicable aux tests passés après le 10 décembre 2023 (NCLC 5 : écrit ≥ 330, oral ≥ 387, sur 699).
- **TCF Canada** : barème en vigueur (NCLC 5 : 6/20 en expression écrite et orale ; 375 en compréhension écrite, 369 en compréhension orale).

Les scores produits par l'outil d'auto-évaluation sont des **estimations pédagogiques**, volontairement strictes, et ne remplacent pas un résultat officiel.

## Avertissement

Site indépendant, sans affiliation avec IRCC, France Éducation international ou Le français des affaires. En cas de divergence, les pages officielles de canada.ca font foi.
