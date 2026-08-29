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
Version v6 en ligne sur GitHub Pages, publiée depuis `main`. La page est construite à l'exécution à partir de `catalogue.js`, seul fichier à faire vivre : ajouter une porte, c'est y ajouter une fiche, sans toucher au reste du code.

Le hall s'ouvre sur un bandeau pleine largeur portant une photo de chantier tirée au sort chez Unsplash, qui change d'une visite à l'autre. Elle passe en noir et blanc, puis en sépia, puis prend le vert de B27 : la chaîne de filtres est calculée par `src/bandeau_teinte.py` pour tenir la teinte du logo, 79,4 degrés et 52 % de saturation, du noir au blanc. Tant qu'aucune clé d'accès n'est renseignée, le bandeau garde son dégradé vert et n'émet aucune requête.

Disposition de tableau de bord : barre latérale permanente donnant accès à toutes les catégories depuis n'importe où, recherche au centre de la barre du haut, quatre cartes chiffrées à l'arrivée, salutation selon l'heure. Sous 960 px la barre latérale devient un tiroir.

Le hall est personnel sans le moindre compte, et il n'y en aura jamais : épingler une porte la remonte en tête des visites suivantes, les six dernières portes ouvertes s'y ajoutent d'elles-mêmes. Thème, épingles et récentes vivent en `localStorage`, dans le navigateur de chacun, et n'en sortent jamais.

En dessous, les dossiers restent des icônes d'application carrées, une couleur par catégorie prise sur les conventions de lot de B27, avec descente vers les sous-dossiers puis les portes. La position tient dans l'adresse (`#/ressources/technique`), donc le bouton Précédent fonctionne et le lien d'un dossier précis se transmet tel quel. La recherche traverse tous les niveaux et rappelle pour chaque résultat le dossier d'où il vient.

Dix portes en quatre catégories, dont trois sous-dossiers sous Ressources. Une pastille en bas à droite ouvre un formulaire de signalement avec capture d'écran et dictée vocale, la dictée n'étant possible que sur Chrome et Edge, avec la saisie vocale de Windows (Win + H) proposée en sortie de secours ailleurs.

Aucune donnée collectée, balise `noindex` et `robots.txt`. Une seule requête externe, facultative et décorative : la photo du bandeau. Sans elle, tout fonctionne à l'identique, hors ligne compris.

## Prochaine étape
Créer le compte Unsplash et coller la clé d'accès dans `REGLAGES.bandeau.cle` : c'est gratuit, cela prend deux minutes, et cela ne peut pas être fait à distance puisqu'il faut créer un compte. La marche à suivre est dans `docs/bandeau.md`. Sans cette clé le bandeau reste vert, ce qui est correct mais n'est pas ce qui était voulu.

Puis trancher le mode d'envoi du signalement. Le mode `mailto` en place demande un `Ctrl+V` pour coller la capture, parce qu'aucun lien mail ne peut porter de pièce jointe. Les trois services de formulaire examinés (Formspree, Web3Forms, EmailJS) réservent les pièces jointes à leurs offres payantes, de 9 à 15 dollars par mois. La voie gratuite, complète et privée est un Worker Cloudflare en mode `endpoint`. Le détail est dans `docs/signalement.md`.

Ensuite : remplir l'annuaire, qui n'a qu'une fiche. Publier les outils web B27 encore non déployés (RefriSelect, Calculette résistance thermique, Calculette confort d'été, Désenfumage, Arbitrage carbone ACV, RTex Tool, Livre d'or REX) et ajouter leur fiche au fur et à mesure : les catégories Ventilation, Thermique, Sécurité incendie, Carbone et Électricité sont déjà déclarées et attendent leur première porte. Enfin, passer le lien à quelques collègues pour un premier retour avant diffusion large.

## Utilisation
En ligne : https://mamalric.github.io/b27-hub/ (GitHub Pages, publié depuis `main`). Hors ligne : ouvrir `index.html` dans un navigateur, la page se construit entièrement en local, seule la photo du bandeau manque à l'appel. Les portes qu'elle pointe demandent en revanche une connexion.

Pour ajouter une porte : modifier `catalogue.js`, copier une fiche existante et la remplir, le gabarit, les deux types de carte et les statuts sont documentés en tête du fichier. Lancer ensuite `python tests/verifier_catalogue.py` pour vérifier que le catalogue est cohérent (identifiants uniques, catégories, statuts et types connus, icônes déclarées, adresses présentes pour les statuts cliquables, fiches d'annuaire joignables, réglages du signalement cohérents), puis pousser sur `main`.

Les conventions visuelles sont dans `docs/charte.md`, le fonctionnement du signalement dans `docs/signalement.md`.
