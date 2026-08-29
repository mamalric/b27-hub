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
Version v3 en ligne sur GitHub Pages, publiée depuis `main`. La page est construite à l'exécution à partir de `catalogue.js`, seul fichier à faire vivre : ajouter une porte, c'est y ajouter une fiche, sans toucher au reste du code.

Le hall se parcourt comme une armoire. Le premier niveau montre cinq dossiers carrés, une icône au centre et le nom qui se révèle au survol ; on en ouvre un, parfois un sous-dossier, et on arrive aux portes. La position tient dans l'adresse (`#/ressources/technique`), ce qui rend le bouton Précédent du navigateur fonctionnel et permet d'envoyer le lien d'un dossier précis. Un fil d'Ariane et un bouton de retour ferment la boucle. La recherche, elle, traverse tous les niveaux d'un coup et rappelle pour chaque résultat le dossier d'où il vient.

Dix portes réparties en quatre catégories, dont trois sous-dossiers sous Ressources : la Calculette ECS et Bouclage et le Dimensionnement émetteurs Finimetal, le site b27.fr, B27 Mobility en "à venir", et six ressources métier (Légifrance, RE2020, INIES, ADEME, COSTIC, CSTB Évaluation) rendues en cartes compactes. L'annuaire occupe son propre dossier, avec une seule fiche pour l'instant. Cinq statuts sont prévus, les cartes non cliquables étant rendues en `div` et non en lien.

Une pastille en bas à droite ouvre un formulaire de signalement : capture de l'écran du problème, titre, description dictable à voix haute, envoi. Le widget `signalement.js` est autonome et se pose sur n'importe quel autre outil B27 en deux lignes. Il fonctionne en mode `mailto`, qui n'exige aucun compte ; deux autres modes d'envoi sont codés et prêts. La dictée n'est possible que sur Chrome et Edge, Opera et Brave n'implémentant pas la reconnaissance vocale ; le widget le dit et propose la saisie vocale de Windows (Win + H) comme sortie de secours.

Aucune requête externe, aucune donnée collectée, balise `noindex` et `robots.txt`.

## Prochaine étape
Trancher le mode d'envoi du signalement. Le mode `mailto` en place demande un `Ctrl+V` pour coller la capture, parce qu'aucun lien mail ne peut porter de pièce jointe. Les trois services de formulaire examinés (Formspree, Web3Forms, EmailJS) réservent les pièces jointes à leurs offres payantes, de 9 à 15 dollars par mois. La voie gratuite, complète et privée est un Worker Cloudflare en mode `endpoint`. Le détail est dans `docs/signalement.md`.

Ensuite : remplir l'annuaire, qui n'a qu'une fiche. Publier les outils web B27 encore non déployés (RefriSelect, Calculette résistance thermique, Calculette confort d'été, Désenfumage, Arbitrage carbone ACV, RTex Tool, Livre d'or REX) et ajouter leur fiche au fur et à mesure : les catégories Ventilation, Thermique, Sécurité incendie, Carbone et Électricité sont déjà déclarées et attendent leur première porte. Enfin, passer le lien à quelques collègues pour un premier retour avant diffusion large.

## Utilisation
En ligne : https://mamalric.github.io/b27-hub/ (GitHub Pages, publié depuis `main`). Hors ligne : ouvrir `index.html` dans un navigateur, la page est autonome et ne fait aucune requête externe, mais les portes qu'elle pointe demandent une connexion.

Pour ajouter une porte : modifier `catalogue.js`, copier une fiche existante et la remplir, le gabarit, les deux types de carte et les statuts sont documentés en tête du fichier. Lancer ensuite `python tests/verifier_catalogue.py` pour vérifier que le catalogue est cohérent (identifiants uniques, catégories, statuts et types connus, icônes déclarées, adresses présentes pour les statuts cliquables, fiches d'annuaire joignables, réglages du signalement cohérents), puis pousser sur `main`.

Les conventions visuelles sont dans `docs/charte.md`, le fonctionnement du signalement dans `docs/signalement.md`.
