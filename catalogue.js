/* =====================================================================
   catalogue.js : le seul fichier à modifier pour faire vivre le portail.
   =====================================================================

   Le portail se lit en deux rayons, nos outils et les ressources, plus la
   fiche de contact et, en pied de page, la signature de l'éditeur (réglée
   dans REGLAGES.editeur, tout en bas). Les rayons se déroulent
   en groupes, un par métier pour les outils et un par domaine pour les
   ressources, et un sommaire fixé à droite de l'écran mène au groupe
   choisi. Ajouter quelque chose, c'est ajouter
   un objet dans un des tableaux ci-dessous. Aucun autre fichier n'est à toucher : ni
   index.html, ni hub.js, ni hub.css. Les rayons, les compteurs, la
   recherche et le panneau "À propos" se recalculent seuls.

   Le tableau principal s'appelle PORTES pour des raisons d'histoire, du
   temps où le portail se présentait comme un hall à dossiers ; à l'écran
   on parle d'outils et de ressources. Le renommer casserait plus de
   choses qu'il n'en clarifierait.

   Pourquoi un .js et non un .json : chargé par <script src>, ce fichier
   fonctionne aussi quand on ouvre index.html directement depuis le disque
   (double-clic). Un fetch() de JSON serait bloqué par le navigateur sur
   file:// et le hub s'afficherait vide hors ligne.

   ---------------------------------------------------------------------
   GABARIT D'UNE ENTRÉE (copier-coller, puis remplir)

     {
       id: "slug-unique",          // identifiant court, minuscules et tirets
       nom: "Nom affiché",         // titre de la carte
       pitch: "Une phrase.",       // ce que c'est, 140 caractères maximum
       url: "https://...",         // page à ouvrir ; chaîne vide si pas encore en ligne
       categorie: "chauffage",     // une clé de CATEGORIES, plus bas
       sousCategorie: "",          // facultatif : une clé de SOUS_CATEGORIES
       statut: "en-ligne",         // en-ligne | beta | a-venir | bureau | obsolete
       type: "outil",              // outil | lien  (voir plus bas)
       icone: "radiateur",         // une clé de TRACES_ICONES, dans hub.js
       tags: ["chauffage"],        // mots-clés, ils alimentent aussi la recherche
       maj: "2026-08-29"           // AAAA-MM-JJ, dernière mise à jour de la porte
     }

   Le champ sousCategorie est facultatif. Une catégorie dont aucune porte
   n'en déclare s'ouvre directement sur ses portes ; dès qu'au moins une en
   déclare une, la catégorie s'ouvre sur des sous-dossiers, et les portes
   sans sous-catégorie sont regroupées dans un dossier "Divers".

   ---------------------------------------------------------------------
   LES DEUX TYPES

     outil   ce que nous fabriquons : une carte dans le rayon "Nos outils".
     lien    une ressource extérieure que nous ne maintenons pas : une
             rangée compacte dans le rayon "Ressources".

   ---------------------------------------------------------------------
   LES CINQ STATUTS

     en-ligne   publié, la carte est cliquable
     beta       publié mais encore en rodage, carte cliquable et signalée
     a-venir    pas encore publié, carte grisée et non cliquable (url vide)
     bureau     application à installer, elle ne tourne pas dans un navigateur
     obsolete   conservé pour mémoire, carte estompée, à ne plus utiliser

   Après modification, vérifier que le fichier reste cohérent :
       python tests/verifier_catalogue.py
   ===================================================================== */

const PORTES = [

  /* ---- Ce que nous fabriquons ------------------------------------- */

  {
    id: "calculette-ecs-bouclage",
    nom: "Calculette ECS et Bouclage",
    pitch: "Besoin de stockage d'eau chaude sanitaire et dimensionnement du bouclage, selon l'usage du bâtiment.",
    url: "https://mamalric.github.io/calculette-ecs-bouclage/",
    categorie: "plomberie",
    statut: "en-ligne",
    type: "outil",
    icone: "gouttes",
    tags: ["ECS", "bouclage", "COSTIC", "DTU 60.11"],
    maj: "2026-08-29"
  },

  {
    id: "selectionneur-radiateurs-finimetal",
    nom: "Dimensionnement émetteurs Finimetal",
    pitch: "Sélection des radiateurs et sèche-serviettes Finimetal pièce par pièce, à partir des déperditions.",
    url: "https://mamalric.github.io/S-lectionneur-de-radiateurs/",
    categorie: "chauffage",
    statut: "en-ligne",
    type: "outil",
    icone: "radiateur",
    tags: ["chauffage", "radiateurs", "EN 442", "Pléiades"],
    maj: "2026-08-28"
  },

  {
    id: "dimensionnement-gaine-ventilation",
    nom: "Dimensionnement Gaine de ventilation",
    pitch: "Sections, vitesses et pertes de charge des réseaux aérauliques, tronçon par tronçon.",
    url: "",
    categorie: "ventilation",
    statut: "a-venir",
    type: "outil",
    icone: "vent",
    tags: ["aéraulique", "gaines", "pertes de charge"],
    maj: "2026-08-29"
  },

  {
    id: "dimensionnement-eau-froide-sanitaire",
    nom: "Dimensionnement Eau froide sanitaire",
    pitch: "Diamètres et pertes de charge du réseau d'eau froide, à partir des appareils desservis.",
    url: "",
    categorie: "plomberie",
    statut: "a-venir",
    type: "outil",
    icone: "gouttes",
    tags: ["EFS", "diamètres", "DTU 60.11"],
    maj: "2026-08-29"
  },

  {
    id: "dimensionnement-eaux-usees-eaux-vannes",
    nom: "Dimensionnement Eaux usées et Eaux vannes",
    pitch: "Chutes, collecteurs et ventilation primaire des EU et EV, selon les appareils raccordés.",
    url: "",
    categorie: "plomberie",
    statut: "a-venir",
    type: "outil",
    icone: "ondes",
    tags: ["EU", "EV", "évacuation", "DTU 60.11"],
    maj: "2026-08-29"
  },

  {
    id: "dimensionnement-eaux-pluviales",
    nom: "Dimensionnement Eaux pluviales",
    pitch: "Chéneaux, descentes et collecteurs EP à partir de la surface et de l'intensité de pluie.",
    url: "",
    categorie: "plomberie",
    statut: "a-venir",
    type: "outil",
    icone: "pluie",
    tags: ["EP", "descentes", "chéneaux", "DTU 60.11"],
    maj: "2026-08-29"
  },

  /* ---- Ressources et référentiels ----------------------------------
     Sites extérieurs, que nous ne maintenons pas. Assez nombreux pour
     mériter des sous-dossiers : c'est la catégorie qui montre le mieux
     la navigation à trois niveaux. */

  {
    id: "legifrance",
    nom: "Légifrance",
    pitch: "Textes réglementaires, arrêtés et codes en vigueur.",
    url: "https://www.legifrance.gouv.fr",
    categorie: "ressources",
    sousCategorie: "reglementation",
    statut: "en-ligne",
    type: "lien",
    icone: "livre",
    tags: ["réglementation", "arrêtés", "code"],
    maj: "2026-08-29"
  },

  {
    id: "re2020",
    nom: "RE2020",
    pitch: "La réglementation environnementale, sur le site du ministère.",
    url: "https://www.ecologie.gouv.fr/politiques-publiques/reglementation-environnementale-re2020",
    categorie: "ressources",
    sousCategorie: "reglementation",
    statut: "en-ligne",
    type: "lien",
    icone: "thermometre",
    tags: ["RE2020", "réglementation", "thermique"],
    maj: "2026-08-29"
  },

  {
    id: "base-inies",
    nom: "Base INIES",
    pitch: "Données environnementales et sanitaires de référence pour l'ACV.",
    url: "https://www.base-inies.fr",
    categorie: "ressources",
    sousCategorie: "donnees",
    statut: "en-ligne",
    type: "lien",
    icone: "feuille",
    tags: ["ACV", "RE2020", "FDES", "carbone"],
    maj: "2026-08-29"
  },

  {
    id: "ademe",
    nom: "ADEME",
    pitch: "Études, aides et données de l'agence de la transition écologique.",
    url: "https://www.ademe.fr",
    categorie: "ressources",
    sousCategorie: "donnees",
    statut: "en-ligne",
    type: "lien",
    icone: "nuage",
    tags: ["énergie", "carbone", "aides"],
    maj: "2026-08-29"
  },

  {
    id: "costic",
    nom: "COSTIC",
    pitch: "Guides et abaques du centre technique génie climatique et sanitaire.",
    url: "https://www.costic.com",
    categorie: "ressources",
    sousCategorie: "technique",
    statut: "en-ligne",
    type: "lien",
    icone: "regle",
    tags: ["CVC", "ECS", "guides", "abaques"],
    maj: "2026-08-29"
  },

  {
    id: "cstb-evaluation",
    nom: "CSTB Évaluation",
    pitch: "Avis techniques et documents techniques d'application des produits.",
    url: "https://evaluation.cstb.fr",
    categorie: "ressources",
    sousCategorie: "technique",
    statut: "en-ligne",
    type: "lien",
    icone: "valider",
    tags: ["avis technique", "ATec", "DTA", "produits"],
    maj: "2026-08-29"
  }

];

/* ---------------------------------------------------------------------
   ANNUAIRE

   Fiches de contact. Elles occupent leur propre dossier dans le hall : ce
   ne sont pas des portes, on ne clique pas dessus pour aller ailleurs, on
   y prend une adresse ou un numéro. Tableau vide : le dossier disparaît.

   Gabarit :
     { id: "slug", nom: "Prénom Nom", role: "Fonction", agence: "Dijon",
       mail: "prenom.nom@b27.fr", tel: "+33 3 80 00 00 00",
       sujets: ["ce sur quoi on peut le solliciter"] }

   Le téléphone s'écrit au format international (+33...) pour rester
   cliquable depuis un mobile. Les champs role, agence, tel et sujets sont
   facultatifs : ce qui manque n'est simplement pas affiché.
   --------------------------------------------------------------------- */

const CONTACTS = [
  {
    id: "marius-amalric",
    nom: "Marius Amalric",
    role: "Ingénieur BET fluides",
    agence: "",
    mail: "mamalric@b27.fr",
    tel: "",
    sujets: ["Les outils de ce hub", "Un bug", "Une idée d'outil"]
  }
];

/* ---------------------------------------------------------------------
   CATÉGORIES

   LES COULEURS VIENNENT DES CONVENTIONS DE LOT DE B27, relevées dans le
   projet du site (b27-site/src/styles/tokens.css) : CVC bleu, plomberie
   sarcelle, thermique terre cuite, SSI rouge, électricité ocre, paysage
   vert, BIM violet, structure gris. Ce ne sont donc pas des teintes
   décoratives : un ingénieur B27 y reconnaît le code couleur de ses plans.

   Quatre écarts, assumés et signalés. L'ocre de l'électricité est assombri
   de #c18900 à #b17e00, le premier ne tenant que 3,07:1 avec le glyphe
   blanc. Le rouge SSI est au contraire éclairci de #b01818 à #c62828 :
   l'original tenait très bien face au glyphe, mais tombait à 2,68:1 face au
   fond du thème sombre, où la tuile se distinguait mal de la page.

   Les deux derniers écarts viennent de la même cause : B27 ne connaît qu'un
   bleu CVC, là où le portail sépare trois métiers. Le bleu du lot, #3e8fb8,
   reste au chauffage ; un cyan #2f7f92 va à l'air en mouvement et un bleu
   froid #4a6fb0 à la production de froid. Trois teintes d'une même famille,
   distinctes au premier coup d'oeil : on voit qu'on est en CVC, et lequel
   des trois.

   Deux teintes ne viennent pas des conventions B27 et sont inventées ici,
   faute d'équivalent dans les lots : le brun de terre #7a6249 du VRD, pour
   les réseaux enterrés, et le gris neutre #6b6f76 des utilitaires, neutre
   précisément parce qu'un utilitaire n'est le lot de personne. Si B27 a
   déjà une couleur pour ces deux-là, elle prime : il n'y a qu'à la
   remplacer ici.

   ATTENTION, TROIS VALEURS SONT À VÉRIFIER. Le paysage, le BIM et la
   structure sont bien des lots B27, mais seule leur famille était notée
   ici, vert, violet et gris ; les valeurs exactes n'étaient pas relevées.
   Celles qui figurent ci-dessous (#4e8a2f, #9450a5, #5f6a74) ont été
   choisies dans la bonne famille, assez éloignées des teintes voisines
   pour rester distinctes, et elles passent le contrôle des trois fronts.
   Ce sont des approximations : remplacer par les valeurs de
   b27-site/src/styles/tokens.css dès qu'elles sont sous la main.

   TOUTE COULEUR NOUVELLE DOIT TENIR AU MOINS 3:1 SUR TROIS FRONTS : avec le
   glyphe blanc, avec le fond du thème clair, et avec celui du thème sombre.
   Une teinte trop claire efface le glyphe, une teinte trop foncée fait
   disparaître la tuile sur fond noir. Le contrôle du catalogue vérifie les
   trois et refuse de passer en dessous.

   Les métiers du portail. L'ordre de ce tableau est l'ordre d'affichage.
   Une catégorie sans aucune porte n'apparaît pas : elles peuvent donc être
   déclarées d'avance, elles restent invisibles jusqu'à la première porte
   qui s'y range.

   Le champ "court" est le nom écrit dans le sommaire, où le nom complet
   serait à l'étroit. Il est facultatif : sans lui, le sommaire reprend le
   nom complet. Quinze caractères sont un maximum confortable.

   Le champ "metier" décide de ce qui se montre vide. Une catégorie
   ordinaire n'apparaît que si une porte s'y range ; une catégorie marquée
   metier garde sa ligne au sommaire même sans aucun outil (estompée,
   pastille en pointillé, inerte), sans pour autant ouvrir de groupe vide
   dans la page. C'est ce qui permet de montrer les métiers de la maison
   avant d'avoir écrit leurs outils. La catégorie des ressources ne le
   porte pas : ce n'est pas un métier.
   --------------------------------------------------------------------- */

const CATEGORIES = [
  { cle: "chauffage",   nom: "Chauffage",                   court: "Chauffage",    icone: "flamme",      couleur: "#3e8fb8", metier: true },
  { cle: "climatisation", nom: "Climatisation et froid",    court: "Climatisation",icone: "flocon",      couleur: "#4a6fb0", metier: true },
  { cle: "ventilation", nom: "Ventilation",                 court: "Ventilation",  icone: "vent",        couleur: "#2f7f92", metier: true },
  { cle: "plomberie",   nom: "Plomberie et ECS",            court: "Plomberie",    icone: "gouttes",     couleur: "#1f7a6e", metier: true },
  { cle: "vrd",         nom: "VRD et assainissement",       court: "VRD",          icone: "reseau",      couleur: "#7a6249", metier: true },
  { cle: "thermique",   nom: "Thermique et réglementation", court: "Thermique",    icone: "thermometre", couleur: "#c4562f", metier: true },
  { cle: "securite",    nom: "Sécurité incendie",           court: "SSI",          icone: "bouclier",    couleur: "#c62828", metier: true },
  { cle: "electricite", nom: "Électricité",                 court: "Électricité",  icone: "eclair",      couleur: "#b17e00", metier: true },
  { cle: "carbone",     nom: "Carbone et environnement",    court: "Carbone",      icone: "nuage",       couleur: "#557a3a", metier: true },
  { cle: "paysage",     nom: "Paysage et aménagement",      court: "Paysage",      icone: "feuille",     couleur: "#4e8a2f", metier: true },
  { cle: "structure",   nom: "Structure",                   court: "Structure",    icone: "immeuble",    couleur: "#5f6a74", metier: true },
  { cle: "bim",         nom: "BIM et maquette numérique",   court: "BIM",          icone: "grille",      couleur: "#9450a5", metier: true },
  { cle: "utilitaire",  nom: "Utilitaires",                 court: "Utilitaires",  icone: "calculatrice",couleur: "#6b6f76", metier: true },
  { cle: "ressources",  nom: "Ressources et référentiels",  court: "Ressources",   icone: "livre",       couleur: "#6b5ba6" }
];

/* ---------------------------------------------------------------------
   SOUS-CATÉGORIES

   Les dossiers du deuxième niveau. Chacune appartient à une catégorie.
   Facultatif : une catégorie sans sous-catégorie peuplée s'ouvre
   directement sur ses portes.

   Elles n'ont pas de couleur : elles héritent de celle de leur catégorie.
   C'est ce qui fait qu'en descendant dans Ressources, les trois
   sous-dossiers restent violets, et que l'on voit d'un coup d'oeil qu'on
   est toujours dans la même branche. Un champ "couleur" peut malgré tout
   être ajouté sur une sous-catégorie pour forcer une teinte.
   --------------------------------------------------------------------- */

const SOUS_CATEGORIES = [
  { cle: "reglementation", categorie: "ressources", nom: "Réglementation", court: "Réglementation", icone: "livre" },
  { cle: "donnees",        categorie: "ressources", nom: "Données et bases", court: "Données", icone: "base_donnees" },
  { cle: "technique",      categorie: "ressources", nom: "Documentation technique", court: "Documentation", icone: "regle" }
];

/* ---------------------------------------------------------------------
   RÉGLAGES DU HUB
   --------------------------------------------------------------------- */

const REGLAGES = {
  // Nom affiché dans l'en-tête et dans l'onglet du navigateur.
  titre: "Outils B27",
  sousTitre: "Le portail des outils et ressources du bureau d'études",

  // L'accroche est la phrase sous le titre du portail. Chaîne vide : elle
  // disparaît.
  accroche: "Les outils et les ressources du bureau d'études, ouverts à tous. Rien à installer, aucun compte.",

  // L'éditeur du portail, en signature de pied de page. Le site de
  // l'entreprise n'est pas un outil que nous fabriquons : rangé avec eux, il
  // passait pour l'un d'eux. Il signe la page au lieu d'y prendre une carte.
  // url vide : la signature disparaît.
  editeur: {
    nom: "B27",
    pitch: "Le site de l'entreprise : métiers, agences, réalisations, actualités.",
    url: "https://www.b27.fr",
    lien: "b27.fr"
  },

  // Tuile météo du portail. Données réelles d'Open-Meteo (open-meteo.com),
  // sans clé et sans compte : c'est un service de données météo ouvert,
  // gratuit pour un usage non commercial, qui autorise l'appel direct depuis
  // un navigateur. Le lieu ci-dessous sert tant que le visiteur n'a pas
  // cliqué sur "ma position" ; ce choix reste alors dans son navigateur.
  // actif: false : la tuile disparaît et plus aucune requête n'est émise.
  meteo: {
    actif: true,
    ville: "Dijon",
    lat: 47.322,
    lon: 5.041
  },

  // La recherche n'apparaît qu'à partir de ce nombre d'entrées, contacts
  // compris. En dessous elle encombre plus qu'elle n'aide : le portail
  // tient déjà tout entier sous les yeux.
  seuilFiltres: 6
};

/* ---------------------------------------------------------------------
   BOUTON DE SIGNALEMENT

   La pastille en bas à droite de l'écran. Le détail du fonctionnement et
   la marche à suivre pour brancher un service d'envoi sont dans
   docs/signalement.md.

   transport, au choix :

     "mailto"     Aucun compte, aucun service tiers, gratuit, immédiat.
                  La capture est copiée dans le presse-papiers et le
                  brouillon de mail s'ouvre déjà rempli : il reste à faire
                  Ctrl+V pour coller la capture, puis Envoyer. C'est le
                  réglage par défaut, celui qui marche sans rien installer.

     "formulaire" Envoi direct, sans ouvrir de mail. Demande un service de
                  formulaire (Formspree, Web3Forms, EmailJS) et son adresse
                  d'envoi dans "endpoint". Attention : sur ces trois
                  services, les pièces jointes sont réservées aux offres
                  payantes.

     "endpoint"   Envoi direct vers votre propre point de collecte (un
                  Worker Cloudflare, par exemple), capture comprise. Rien ne
                  passe par un tiers. Demande de déployer ce point de
                  collecte, voir docs/signalement.md.
   --------------------------------------------------------------------- */

const SIGNALEMENT = {
  // false : la pastille n'apparaît pas du tout.
  actif: true,

  // Où arrivent les signalements. Sert d'adresse du brouillon en mode
  // "mailto", et de simple rappel dans les deux autres modes.
  destinataire: "mamalric@b27.fr",

  // "mailto" | "formulaire" | "endpoint"
  transport: "mailto",

  // Adresse d'envoi, pour "formulaire" et "endpoint". Ignorée en "mailto".
  endpoint: "",

  // Nom de l'application, repris dans l'objet du message.
  application: "Hub Outils B27",

  // Proposer la capture d'écran. Le navigateur demandera toujours une
  // confirmation avant de capturer.
  capture: true,

  // Proposer la dictée vocale. Chrome et Edge seulement ; ailleurs le
  // bouton est grisé avec la raison et la sortie de secours Win + H.
  dictee: true
};
