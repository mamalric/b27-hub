---
id: 2026-08-29-hub-d-accueil-outils-et-app    # AAAA-MM-JJ-slug, écrit une fois, jamais modifié (même si le dossier bouge)
nom: Hub d'accueil outils et app              # nom affiché
type: application                             # application | outil | documentation | travail | affaire
statut: actif                                 # idee | actif | pause | termine | abandonne
pitch: Hall d'entrée unique vers les outils B27 : un seul lien à transmettre aux collègues.  # une phrase sur une seule ligne, 120 caractères maximum
cree: 2026-08-29                              # AAAA-MM-JJ
maj: 2026-08-29                               # AAAA-MM-JJ, mis à jour par Claude Code en fin de session
tags: [b27, web, hub, outils]                 # exemple : [cvc, reglementation]
stack: HTML + CSS + JS vanilla, sans framework ni build, publié sur GitHub Pages
lancer: ouvrir index.html, ou https://mamalric.github.io/b27-hub/
depot: https://github.com/mamalric/b27-hub    # URL du dépôt git, vide sinon
---

# Hub d'accueil outils et app

## Objectif
Donner un point d'entrée unique, en ligne, vers les outils, les sites et les ressources utiles aux collègues de B27, de façon à ne communiquer qu'un seul lien au lieu d'adresses dispersées. Le hub n'héberge rien : il présente une carte par porte et redirige. La démarche est personnelle et autonome, menée en parallèle du remplacement du GRR conduit avec le service informatique de B27.

## État actuel
Version v2 en ligne sur GitHub Pages, publiée depuis `main`. La page est construite à l'exécution à partir de `catalogue.js`, seul fichier à faire vivre : ajouter une porte, c'est y ajouter une fiche, sans toucher au reste du code.

Le hall s'ouvre sur un bandeau portant le logo B27, une accroche et le compte calculé des portes ouvertes. Dix portes réparties en quatre catégories : la Calculette ECS et Bouclage et le Dimensionnement émetteurs Finimetal, le site b27.fr, B27 Mobility en "à venir", et six ressources métier (INIES, RE2020, Légifrance, COSTIC, CSTB Évaluation, ADEME) rendues en cartes compactes pour ne pas prendre le pas sur les outils. Un annuaire ferme la page, avec une seule fiche pour l'instant. Cinq statuts sont prévus, les cartes non cliquables étant rendues en `div` et non en lien. Recherche et filtres apparaissent au-delà de six portes, titres de section au-delà de trois catégories peuplées.

Une pastille en bas à droite ouvre un formulaire de signalement : capture de l'écran du problème, titre, description dictable à voix haute, envoi. Le widget `signalement.js` est autonome et se pose sur n'importe quel autre outil B27 en deux lignes. Il fonctionne aujourd'hui en mode `mailto`, qui n'exige aucun compte ; deux autres modes d'envoi sont codés et prêts, `formulaire` pour un service tiers et `endpoint` pour un point de collecte maison.

Aucune requête externe, aucune donnée collectée, balise `noindex` et `robots.txt`. Seule exception, signalée dans l'interface : la dictée vocale passe par le service de transcription du navigateur.

## Prochaine étape
Trancher le mode d'envoi du signalement. Le mode `mailto` en place demande un `Ctrl+V` pour coller la capture, parce qu'aucun lien mail ne peut porter de pièce jointe. Les trois services de formulaire examinés (Formspree, Web3Forms, EmailJS) réservent les pièces jointes à leurs offres payantes, de 9 à 15 dollars par mois. La voie gratuite, complète et privée est un Worker Cloudflare en mode `endpoint`, l'outillage étant déjà en place sur d'autres projets. Le détail est dans `docs/signalement.md`.

Ensuite : essayer la dictée et l'ouverture du brouillon sur un poste réel, ces deux points n'ayant pas pu être exercés dans le navigateur d'essai. Puis publier les outils web B27 encore non déployés (RefriSelect, Calculette résistance thermique, Calculette confort d'été, Désenfumage, Arbitrage carbone ACV, RTex Tool, Livre d'or REX) et ajouter leur fiche au fur et à mesure. Remplir l'annuaire, qui n'a qu'une fiche. Enfin, passer le lien à quelques collègues pour un premier retour avant diffusion large.

## Utilisation
En ligne : https://mamalric.github.io/b27-hub/ (GitHub Pages, publié depuis `main`). Hors ligne : ouvrir `index.html` dans un navigateur, la page est autonome et ne fait aucune requête externe, mais les portes qu'elle pointe demandent une connexion.

Pour ajouter une porte : modifier `catalogue.js`, copier une fiche existante et la remplir, le gabarit, les deux types de carte et les statuts sont documentés en tête du fichier. Lancer ensuite `python tests/verifier_catalogue.py` pour vérifier que le catalogue est cohérent (identifiants uniques, catégories, statuts et types connus, icônes déclarées, adresses présentes pour les statuts cliquables, fiches d'annuaire joignables, réglages du signalement cohérents), puis pousser sur `main`.

Les conventions visuelles sont dans `docs/charte.md`, le fonctionnement du signalement dans `docs/signalement.md`.
