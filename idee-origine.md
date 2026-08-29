# Hub d'accueil outils et app

## Idée

Créer un espèce de hub d'accueil pour les outils et les applications de b vingt sept qui seront disponibles en ligne en statique sur un repos. L'objectif sera de connecter tous mes autres outils déjà créés ou à créer sur ce hub afin de communiquer un seul lien à mes collègues et qui puissent avoir accès à tous mes outils. Cette démarche se positionne en parallèle de la démarche de création, de remplacement du GRR en cours d'application auprès de mon informaticiens chez B27. Voilà, l'interface devra être moderne, respecter la charte graphique de b vingt sept et des autres applications qui sont déjà créées, c'est-à-dire le dimensionnement de c s ainsi que le dimensionnement des radiateurs fini métal.

## Prompt

# Prompt pour Claude Code — Hub d'accueil des outils B27

## Contexte et conventions à respecter impérativement

Ce projet vit dans mon dossier DevCode, où chaque projet possède :
- une **FICHE.md** (id, nom, type, statut, pitch, tags, stack, commande pour lancer)
- un **JOURNAL.md** tenu à jour au fil des sessions

Tu dois créer et maintenir ces deux fichiers pour ce projet, comme pour tous mes autres projets.

Mes conventions de stack selon le type de projet :
- **Applications de bureau** → Python + PySide6 + QML
- **Petits outils** → une seule page HTML, sans framework
- **Sites web** → HTML, CSS et JavaScript, sans étape de build

Ce projet est un **site statique** destiné à être hébergé en ligne sur un dépôt (probablement GitHub Pages, à confirmer). Il doit donc suivre la convention "site" : HTML, CSS, JS vanilla, sans build.

**Avant de commencer à coder, pose-moi toutes les questions nécessaires** sur les points flous ou manquants ci-dessous plutôt que de faire des suppositions. Je préfère répondre à une liste de questions maintenant que découvrir un mauvais choix plus tard.

---

## 1. Objectif et utilisateurs

**Objectif** : créer un hub d'accueil unique, en ligne, qui centralise l'accès à tous mes outils et applications déjà créés ou à venir pour B27. Le but est de pouvoir communiquer **un seul lien** à mes collègues, qui donne accès à l'ensemble de mes outils, plutôt que de partager des liens dispersés.

Cette démarche est menée **en parallèle** du projet de remplacement du GRR actuellement en cours avec le service informatique de B27 — donc un projet personnel/autonome, pas une refonte officielle du SI.

**Utilisateurs** : mes collègues chez B27 (à préciser : quel service, combien de personnes, niveau technique attendu ?).

**Questions à me poser si besoin de précision :**
- Ce hub doit-il être accessible publiquement (lien direct) ou protégé par un mot de passe / accès restreint ?
- Doit-il fonctionner uniquement en interne (réseau B27) ou depuis n'importe où (télétravail, mobile) ?

---

## 2. Fonctionnalités essentielles

- Page d'accueil unique listant l'ensemble des outils/applications disponibles, sous forme de cartes ou tuiles cliquables
- Pour chaque outil : nom, courte description (pitch), lien direct vers l'outil
- Design **moderne**, respectant la charte graphique de B27 et celle déjà utilisée dans mes outils existants (dimensionnement de CTA/climatisation split, dimensionnement des radiateurs à fluide caloporteur/finition métal, etc. — à confirmer avec moi lesquels servent de référence visuelle)
- Responsive (utilisable sur ordinateur et mobile/tablette)

**Questions à me poser si besoin de précision :**
- Peux-tu me fournir (ou me demander) les liens vers 2-3 outils déjà en ligne pour extraire la charte graphique commune (couleurs, typographie, logo B27, style des boutons) ?
- As-tu une liste précise des outils à référencer dès le lancement (noms + liens) ou dois-je prévoir une structure facilement extensible sans liste figée pour l'instant ?
- Y a-t-il un logo B27 à intégrer, et sous quel format est-il disponible ?

---

## 3. Fonctionnalités secondaires (à envisager, non bloquantes)

- Barre de recherche ou filtre par catégorie/tag si le nombre d'outils grandit
- Regroupement des outils par catégorie (ex : CVC, outils métier, applications de bureau vs outils web)
- Petit indicateur de statut par outil (en service / en développement / obsolète), éventuellement synchronisé avec le champ "statut" des FICHE.md de mes projets
- Mode sombre / clair
- Page "à propos" ou mention de contact pour remonter des bugs/suggestions

---

## 4. Contraintes et données

- **Statique uniquement** : pas de backend, pas de base de données. Le contenu (liste des outils) peut être défini dans un fichier de données simple (JSON ou JS) facile à mettre à jour à la main.
- Hébergement prévu sur un dépôt Git, en statique (GitHub Pages ou équivalent — à confirmer)
- Le hub ne doit pas dupliquer la maintenance : idéalement, structurer les données des outils de façon à ce que l'ajout d'un nouvel outil soit trivial (une entrée à ajouter dans un fichier de config, pas de code à toucher)
- Aucune donnée personnelle ou sensible ne doit transiter par ce hub (c'est un simple point d'entrée/redirection)

**Questions à me poser si besoin de précision :**
- Le dépôt Git de ce hub existe-t-il déjà, ou dois-je t'aider à le créer et te donner les instructions de déploiement (ex. GitHub Pages) ?
- Les outils à référencer sont-ils tous déjà en ligne avec une URL stable, ou certains sont-ils encore en local ?

---

## 5. Stack proposée

- HTML + CSS + JavaScript vanilla, sans framework ni étape de build (conforme à ma convention "site")
- Données des outils dans un fichier séparé (ex. `outils.json` ou `outils.js`) pour faciliter les mises à jour futures sans toucher au code
- Pas de dépendances externes lourdes ; si une police ou une icône est nécessaire, privilégier des solutions auto-hébergées ou des CDN légers

---

## 6. Étapes de réalisation suggérées

1. **Clarification** : poser les questions manquantes listées ci-dessus (charte graphique, liste des outils, hébergement, niveau d'accès)
2. **Cadrage** : proposer une arborescence de fichiers simple et une maquette rapide (structure des cartes, palette de couleurs déduite des outils existants)
3. **Structure de données** : créer le fichier de configuration listant les outils (nom, pitch, lien, catégorie, statut)
4. **Intégration** : développer la page d'accueil (HTML/CSS/JS) à partir de cette structure de données
5. **Responsive et finitions** : vérifier l'affichage mobile/desktop, ajuster la charte graphique
6. **Documentation** : créer/mettre à jour `FICHE.md` et `JOURNAL.md` du projet
7. **Déploiement** : préparer le dépôt pour publication statique et fournir les instructions de mise en ligne

---

## 7. Critères de réussite

- Un seul lien permet d'accéder à tous les outils référencés, sans friction
- L'ajout d'un nouvel outil au hub se fait en modifiant uniquement le fichier de données, sans toucher au reste du code
- L'interface est cohérente visuellement avec mes autres outils B27 (même charte graphique perçue par un collègue habitué)
- Le site fonctionne correctement sur mobile et desktop
- `FICHE.md` et `JOURNAL.md` sont créés et à jour en fin de session, conformément à mes conventions DevCode

---

**Rappel final pour Claude Code** : si un élément listé ci-dessus comme "à confirmer" ou dans les "questions à me poser" n'est pas clair, pose-moi la question avant d'écrire du code. Je préfère une courte liste de questions précises à un développement basé sur des suppositions.
