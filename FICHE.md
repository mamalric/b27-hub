---
id: 2026-08-29-hub-d-accueil-outils-et-app    # AAAA-MM-JJ-slug, écrit une fois, jamais modifié (même si le dossier bouge)
nom: Hub d'accueil outils et app              # nom affiché
type: application                             # application | outil | documentation | travail | affaire
statut: actif                                 # idee | actif | pause | termine | abandonne
pitch: Portail public des outils et ressources B27 : un seul lien à transmettre.  # une phrase sur une seule ligne, 120 caractères maximum
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
Version v8 en ligne sur GitHub Pages, publiée depuis `main` : le portail dont le fond vit avec le ciel. Tout est centré sous le logo — emblème sur plaque de verre avec aura, titre en dégradé, accroche, recherche filtrante (raccourci `/`), compteurs. Un champ d'écoulement animé, calculé en local, occupe le fond de page et suit la météo affichée (stries de pluie inclinées par le vent mesuré, flocons, nappes nuageuses du couvert et du brouillard, halo doré du soleil, turbulence d'orage sans jamais d'éclair) ainsi que la saison, qui teinte la palette ; il s'immobilise si le poste demande moins d'animations. Au défilement, tuiles, logo et titre s'ancrent : pastilles compactes à gauche, pilule centrale qui ramène en haut. Sombre par défaut, thème clair mémorisé par navigateur.

Deux tuiles vivantes, en colonne dans le coin haut gauche sur grand écran et sous la recherche en dessous de 1240 px : la météo en données réelles Open-Meteo (sans clé ni compte, lieu par défaut Dijon, bouton « ma position », relevé en cache vingt minutes et reverifié toutes les dix minutes ainsi qu'au retour sur l'onglet, tuile absente sans réseau) et un calendrier en semaines ISO, semaines sur l'axe vertical, week-ends teintés, jour et semaine courants marqués, navigation de mois en mois.

Le catalogue se lit en deux rayons — Nos outils en cartes, Ressources en rangées groupées par domaine — plus la fiche de contact. La métaphore des portes et la navigation par dossiers ont disparu, ainsi que les épingles et les récents ; il n'y a plus d'adresse à fragment. Les couleurs de lot B27 restent sur les pastilles d'icônes, contrôlées sur trois fronts par le validateur.

La page est construite à l'exécution à partir de `catalogue.js`, seul fichier à faire vivre. La pastille de signalement, conservée telle quelle, ouvre un formulaire avec capture d'écran et dictée vocale (Chrome et Edge ; Win + H proposé ailleurs).

Aucune donnée collectée, balise `noindex` et `robots.txt`. Trois requêtes externes facultatives : la météo Open-Meteo, la géolocalisation si le visiteur la demande, et le géocodage inverse de l'API Adresse de l'État qui donne son nom à la ville.

## Prochaine étape
La v7 est validée par l'utilisateur (« beaucoup mieux, j'adore ») et retouchée dans la foulée : tuiles en coin haut gauche, emblème opaque, traînées à expiration ferme. Continuer d'itérer sur ses retours.

Trancher si le portail doit rester en `noindex` : il se veut désormais ouvert à tous, clients compris, et la balise comme `robots.txt` l'excluent des moteurs de recherche. C'est une décision d'entreprise, pas technique.

Puis trancher le mode d'envoi du signalement (voir `docs/signalement.md`), remplir l'annuaire qui n'a qu'une fiche, publier les outils web encore non déployés (RefriSelect, Calculette résistance thermique, Calculette confort d'été, Désenfumage, Arbitrage carbone ACV, RTex Tool, Livre d'or REX) et ajouter leur fiche au fur et à mesure.

## Utilisation
En ligne : https://mamalric.github.io/b27-hub/ (GitHub Pages, publié depuis `main`). Hors ligne : ouvrir `index.html` dans un navigateur, la page se construit entièrement en local, seule la photo du bandeau manque à l'appel. Les portes qu'elle pointe demandent en revanche une connexion.

Pour ajouter une porte : modifier `catalogue.js`, copier une fiche existante et la remplir, le gabarit, les deux types de carte et les statuts sont documentés en tête du fichier. Lancer ensuite `python tests/verifier_catalogue.py` pour vérifier que le catalogue est cohérent (identifiants uniques, catégories, statuts et types connus, icônes déclarées, adresses présentes pour les statuts cliquables, fiches d'annuaire joignables, réglages du signalement cohérents), puis pousser sur `main`.

Les conventions visuelles sont dans `docs/charte.md`, le fonctionnement du signalement dans `docs/signalement.md`.
