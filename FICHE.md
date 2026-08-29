---
id: 2026-08-29-hub-d-accueil-outils-et-app    # AAAA-MM-JJ-slug, écrit une fois, jamais modifié (même si le dossier bouge)
nom: Hub d'accueil outils et app              # nom affiché
type: application                             # application | outil | documentation | travail | affaire
statut: actif                                 # idee | actif | pause | termine | abandonne
pitch: Page d'accueil unique vers les outils B27 : un seul lien à transmettre aux collègues.  # une phrase sur une seule ligne, 120 caractères maximum
cree: 2026-08-29                              # AAAA-MM-JJ
maj: 2026-08-29                               # AAAA-MM-JJ, mis à jour par Claude Code en fin de session
tags: [b27, web, hub, outils]                 # exemple : [cvc, reglementation]
stack: HTML + CSS + JS vanilla, sans framework ni build, publié sur GitHub Pages
lancer: ouvrir index.html, ou https://mamalric.github.io/b27-hub/
depot: https://github.com/mamalric/b27-hub    # URL du dépôt git, vide sinon
---

# Hub d'accueil outils et app

## Objectif
Donner un point d'entrée unique, en ligne, vers les outils et applications créés pour B27, de façon à ne communiquer qu'un seul lien aux collègues au lieu d'adresses dispersées. Le hub n'héberge aucun outil : il présente une carte par outil et redirige. La démarche est personnelle et autonome, menée en parallèle du remplacement du GRR conduit avec le service informatique de B27.

## État actuel
Version v1 en ligne sur GitHub Pages, publiée depuis `main`. La page est construite à l'exécution à partir de `outils.js`, seul fichier à faire vivre : ajouter un outil, c'est y ajouter une fiche, sans toucher au reste du code. Deux outils sont référencés, la Calculette ECS et Bouclage et le Dimensionnement émetteurs Finimetal, les deux seuls déjà publiés. Cinq statuts sont prévus (en ligne, bêta, à venir, application de bureau, obsolète), les cartes non cliquables étant rendues en `div` et non en lien. La barre de recherche et les filtres par catégorie n'apparaissent qu'au-delà de six outils, les titres de section au-delà de trois catégories peuplées : l'interface suit la taille du catalogue. La charte reprend celle des deux outils de référence, palette papier et encre à primaire olive, thème clair et sombre mémorisé, rouage ouvrant un panneau "À propos" dont les compteurs sont recalculés à l'ouverture. Aucune requête externe, aucune donnée collectée, balise `noindex` et `robots.txt`. Vérifié dans le navigateur en clair et en sombre, sur desktop et sur mobile, catalogue à deux outils puis à sept pour contrôler le comportement à la croissance.

## Prochaine étape
Publier les outils web B27 qui ne le sont pas encore (RefriSelect, Calculette résistance thermique, Calculette confort d'été, Désenfumage, Arbitrage carbone ACV, RTex Tool, Livre d'or REX) et ajouter leur fiche au hub au fur et à mesure. Passer le lien à quelques collègues pour recueillir un premier retour d'usage avant de le diffuser plus largement.

## Utilisation
En ligne : https://mamalric.github.io/b27-hub/ (GitHub Pages, publié depuis `main`). Hors ligne : ouvrir `index.html` dans un navigateur, la page est autonome et ne fait aucune requête externe, mais les outils qu'elle pointe demandent une connexion.

Pour ajouter un outil : modifier `outils.js`, copier une fiche existante et la remplir, le gabarit et les statuts sont documentés en tête du fichier. Lancer ensuite `python tests/verifier_outils.py` pour vérifier que le catalogue est cohérent (identifiants uniques, catégories et statuts connus, icônes déclarées, adresses présentes pour les statuts cliquables), puis pousser sur `main`. Les conventions visuelles sont dans `docs/charte.md`.
