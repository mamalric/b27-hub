/* =====================================================================
   outils.js : le seul fichier à modifier pour faire vivre le hub.
   =====================================================================

   Ajouter un outil au hub, c'est ajouter un objet dans le tableau OUTILS
   ci-dessous. Aucun autre fichier n'est à toucher : ni index.html, ni
   hub.js, ni hub.css. Les sections, les compteurs, les filtres et le
   panneau "À propos" se recalculent seuls à partir de ces données.

   Pourquoi un .js et non un .json : chargé par <script src>, ce fichier
   fonctionne aussi quand on ouvre index.html directement depuis le disque
   (double-clic). Un fetch() de JSON serait bloqué par le navigateur sur
   file:// et le hub s'afficherait vide hors ligne.

   ---------------------------------------------------------------------
   GABARIT D'UNE FICHE OUTIL (copier-coller, puis remplir)

     {
       id: "slug-unique",          // identifiant court, minuscules et tirets
       nom: "Nom affiché",         // titre de la carte
       pitch: "Une phrase.",       // ce que fait l'outil, 140 caractères maximum
       url: "https://...",         // page à ouvrir ; chaîne vide si pas encore en ligne
       categorie: "cvc",           // une clé de CATEGORIES, plus bas
       statut: "en-ligne",         // en-ligne | beta | a-venir | bureau | obsolete
       icone: "radiateur",         // une clé de TRACES_ICONES, dans hub.js
       tags: ["chauffage"],        // mots-clés, ils alimentent aussi la recherche
       maj: "2026-08-29"           // AAAA-MM-JJ, date de dernière mise à jour de l'outil
     }

   ---------------------------------------------------------------------
   LES CINQ STATUTS

     en-ligne   l'outil est publié, la carte est cliquable
     beta       publié mais encore en rodage, carte cliquable et signalée
     a-venir    pas encore publié, carte grisée et non cliquable (url vide)
     bureau     application à installer, elle ne tourne pas dans un navigateur
     obsolete   conservé pour mémoire, carte estompée, à ne plus utiliser

   Après modification, vérifier que le fichier reste cohérent :
       python tests/verifier_outils.py
   ===================================================================== */

const OUTILS = [

  {
    id: "calculette-ecs-bouclage",
    nom: "Calculette ECS et Bouclage",
    pitch: "Besoin de stockage d'eau chaude sanitaire et dimensionnement du bouclage, selon l'usage du bâtiment.",
    url: "https://mamalric.github.io/calculette-ecs-bouclage/",
    categorie: "plomberie",
    statut: "en-ligne",
    icone: "gouttes",
    tags: ["ECS", "bouclage", "COSTIC", "DTU 60.11"],
    maj: "2026-08-29"
  },

  {
    id: "selectionneur-radiateurs-finimetal",
    nom: "Dimensionnement émetteurs Finimetal",
    pitch: "Sélection des radiateurs et sèche-serviettes Finimetal pièce par pièce, à partir des déperditions.",
    url: "https://mamalric.github.io/S-lectionneur-de-radiateurs/",
    categorie: "cvc",
    statut: "en-ligne",
    icone: "radiateur",
    tags: ["chauffage", "radiateurs", "EN 442", "Pléiades"],
    maj: "2026-08-28"
  }

];

/* ---------------------------------------------------------------------
   CATÉGORIES

   Une catégorie regroupe les cartes sous un même titre et alimente les
   filtres. L'ordre de ce tableau est l'ordre d'affichage des sections.
   Une catégorie sans aucun outil n'apparaît pas : elles peuvent donc être
   déclarées d'avance, elles restent invisibles jusqu'au premier outil qui
   s'y range.
   --------------------------------------------------------------------- */

const CATEGORIES = [
  { cle: "cvc",         nom: "Chauffage et climatisation",  icone: "radiateur" },
  { cle: "ventilation", nom: "Ventilation",                 icone: "vent" },
  { cle: "plomberie",   nom: "Plomberie et ECS",            icone: "gouttes" },
  { cle: "thermique",   nom: "Thermique et réglementation", icone: "thermometre" },
  { cle: "securite",    nom: "Sécurité incendie",           icone: "bouclier" },
  { cle: "carbone",     nom: "Carbone et environnement",    icone: "feuille" },
  { cle: "electricite", nom: "Électricité",                 icone: "eclair" },
  { cle: "agence",      nom: "Vie de l'agence",             icone: "immeuble" },
  { cle: "ressources",  nom: "Ressources et référentiels",  icone: "livre" }
];

/* ---------------------------------------------------------------------
   RÉGLAGES DU HUB
   --------------------------------------------------------------------- */

const REGLAGES = {
  // Nom affiché dans l'en-tête et dans l'onglet du navigateur.
  titre: "Outils B27",
  sousTitre: "Les outils du bureau d'études, réunis derrière un seul lien",

  // Phrase d'accueil, affichée au-dessus des cartes. Elle s'adresse au collègue
  // qui arrive par le lien sans savoir ce qu'il va trouver. Chaîne vide : elle
  // disparaît.
  chapeau: "Chaque carte ouvre un outil dans un nouvel onglet. Tout fonctionne dans le navigateur : rien à installer, aucun compte à créer.",

  // Adresse à qui signaler un bug ou demander un outil. Chaîne vide : la
  // ligne de contact disparaît du pied de page et du panneau "À propos".
  contact: "marius.amalric45@gmail.com",

  // La barre de recherche et les filtres par catégorie n'apparaissent qu'à
  // partir de ce nombre d'outils. En dessous ils encombrent plus qu'ils
  // n'aident : la page tient déjà tout entière sous les yeux.
  seuilFiltres: 6,

  // Les titres de section par catégorie ne se forment qu'à partir de ce
  // nombre de catégories réellement peuplées. En dessous, une grille simple
  // se lit mieux qu'une suite de sections d'une carte chacune.
  seuilSections: 3
};
