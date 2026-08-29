/* =====================================================================
   outils.js : le seul fichier à modifier pour faire vivre le hub.
   =====================================================================

   Ajouter une porte au hall, c'est ajouter un objet dans le tableau PORTES
   ci-dessous. Aucun autre fichier n'est à toucher : ni index.html, ni
   hub.js, ni hub.css. Les sections, les compteurs, les filtres, l'annuaire
   et le panneau "À propos" se recalculent seuls à partir de ces données.

   Pourquoi un .js et non un .json : chargé par <script src>, ce fichier
   fonctionne aussi quand on ouvre index.html directement depuis le disque
   (double-clic). Un fetch() de JSON serait bloqué par le navigateur sur
   file:// et le hub s'afficherait vide hors ligne.

   ---------------------------------------------------------------------
   GABARIT D'UNE PORTE (copier-coller, puis remplir)

     {
       id: "slug-unique",          // identifiant court, minuscules et tirets
       nom: "Nom affiché",         // titre de la carte
       pitch: "Une phrase.",       // ce que c'est, 140 caractères maximum
       url: "https://...",         // page à ouvrir ; chaîne vide si pas encore en ligne
       categorie: "cvc",           // une clé de CATEGORIES, plus bas
       statut: "en-ligne",         // en-ligne | beta | a-venir | bureau | obsolete
       type: "outil",              // outil | lien  (voir plus bas)
       icone: "radiateur",         // une clé de TRACES_ICONES, dans hub.js
       tags: ["chauffage"],        // mots-clés, ils alimentent aussi la recherche
       maj: "2026-08-29"           // AAAA-MM-JJ, dernière mise à jour de la porte
     }

   ---------------------------------------------------------------------
   LES DEUX TYPES

     outil   ce que nous fabriquons : carte pleine, avec pitch et mots-clés.
             C'est la vedette du hall, elle occupe la place qu'il faut.
     lien    une ressource extérieure que nous ne maintenons pas : carte
             compacte, sans mots-clés. Vingt liens ne doivent pas noyer
             deux outils, d'où la carte plus petite.

   ---------------------------------------------------------------------
   LES CINQ STATUTS

     en-ligne   publié, la carte est cliquable
     beta       publié mais encore en rodage, carte cliquable et signalée
     a-venir    pas encore publié, carte grisée et non cliquable (url vide)
     bureau     application à installer, elle ne tourne pas dans un navigateur
     obsolete   conservé pour mémoire, carte estompée, à ne plus utiliser

   Après modification, vérifier que le fichier reste cohérent :
       python tests/verifier_outils.py
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
    categorie: "cvc",
    statut: "en-ligne",
    type: "outil",
    icone: "radiateur",
    tags: ["chauffage", "radiateurs", "EN 442", "Pléiades"],
    maj: "2026-08-28"
  },

  /* ---- B27 --------------------------------------------------------- */

  {
    id: "site-b27",
    nom: "Site B27",
    pitch: "Le site de l'entreprise : métiers, agences, réalisations, actualités.",
    url: "https://www.b27.fr",
    categorie: "b27",
    statut: "en-ligne",
    type: "outil",
    icone: "immeuble",
    tags: ["entreprise", "vitrine"],
    maj: "2026-08-29"
  },

  {
    id: "b27-mobility",
    nom: "B27 Mobility",
    pitch: "Réservation des voitures de société : disponibilités, créneaux, trajets.",
    url: "",
    categorie: "b27",
    statut: "a-venir",
    type: "outil",
    icone: "voiture",
    tags: ["voitures", "réservation", "flotte"],
    maj: "2026-08-26"
  },

  /* ---- Ressources et référentiels ----------------------------------
     Sites extérieurs, que nous ne maintenons pas. Type "lien" : carte
     compacte, pour qu'ils ne prennent pas le pas sur les outils. */

  {
    id: "base-inies",
    nom: "Base INIES",
    pitch: "Données environnementales et sanitaires de référence pour l'ACV.",
    url: "https://www.base-inies.fr",
    categorie: "ressources",
    statut: "en-ligne",
    type: "lien",
    icone: "feuille",
    tags: ["ACV", "RE2020", "FDES", "carbone"],
    maj: "2026-08-29"
  },

  {
    id: "re2020",
    nom: "RE2020",
    pitch: "La réglementation environnementale, sur le site du ministère.",
    url: "https://www.ecologie.gouv.fr/politiques-publiques/reglementation-environnementale-re2020",
    categorie: "ressources",
    statut: "en-ligne",
    type: "lien",
    icone: "thermometre",
    tags: ["RE2020", "réglementation", "thermique"],
    maj: "2026-08-29"
  },

  {
    id: "legifrance",
    nom: "Légifrance",
    pitch: "Textes réglementaires, arrêtés et codes en vigueur.",
    url: "https://www.legifrance.gouv.fr",
    categorie: "ressources",
    statut: "en-ligne",
    type: "lien",
    icone: "livre",
    tags: ["réglementation", "arrêtés", "code"],
    maj: "2026-08-29"
  },

  {
    id: "costic",
    nom: "COSTIC",
    pitch: "Guides et abaques du centre technique génie climatique et sanitaire.",
    url: "https://www.costic.com",
    categorie: "ressources",
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
    statut: "en-ligne",
    type: "lien",
    icone: "valider",
    tags: ["avis technique", "ATec", "DTA", "produits"],
    maj: "2026-08-29"
  },

  {
    id: "ademe",
    nom: "ADEME",
    pitch: "Études, aides et données de l'agence de la transition écologique.",
    url: "https://www.ademe.fr",
    categorie: "ressources",
    statut: "en-ligne",
    type: "lien",
    icone: "nuage",
    tags: ["énergie", "carbone", "aides"],
    maj: "2026-08-29"
  }

];

/* ---------------------------------------------------------------------
   ANNUAIRE

   Fiches de contact, rendues à part des cartes : ce ne sont pas des portes,
   on ne clique pas dessus pour aller ailleurs, on y prend une adresse ou un
   numéro. Tableau vide : la section entière disparaît.

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

   Une catégorie regroupe les cartes sous un même titre et alimente les
   filtres. L'ordre de ce tableau est l'ordre d'affichage des sections.
   Une catégorie sans aucune porte n'apparaît pas : elles peuvent donc être
   déclarées d'avance, elles restent invisibles jusqu'à la première porte
   qui s'y range.
   --------------------------------------------------------------------- */

const CATEGORIES = [
  { cle: "cvc",         nom: "Chauffage et climatisation",  icone: "radiateur" },
  { cle: "ventilation", nom: "Ventilation",                 icone: "vent" },
  { cle: "plomberie",   nom: "Plomberie et ECS",            icone: "gouttes" },
  { cle: "thermique",   nom: "Thermique et réglementation", icone: "thermometre" },
  { cle: "securite",    nom: "Sécurité incendie",           icone: "bouclier" },
  { cle: "carbone",     nom: "Carbone et environnement",    icone: "feuille" },
  { cle: "electricite", nom: "Électricité",                 icone: "eclair" },
  { cle: "b27",         nom: "B27",                         icone: "immeuble" },
  { cle: "ressources",  nom: "Ressources et référentiels",  icone: "livre" }
];

/* ---------------------------------------------------------------------
   RÉGLAGES DU HUB
   --------------------------------------------------------------------- */

const REGLAGES = {
  // Nom affiché dans l'en-tête et dans l'onglet du navigateur.
  titre: "Outils B27",
  sousTitre: "Le hall d'entrée des outils du bureau d'études",

  // Bandeau d'accueil. L'accroche est la grande phrase sous le logo, le
  // chapeau la ligne d'explication qui la suit. Chaîne vide : l'élément
  // disparaît, le bandeau se resserre.
  accroche: "Toutes les portes, au même endroit.",
  chapeau: "Chaque carte ouvre un outil ou un site dans un nouvel onglet. Ce que nous fabriquons fonctionne dans le navigateur : rien à installer, aucun compte à créer.",

  // Adresse affichée dans le pied de page et le panneau "À propos".
  // Chaîne vide : la ligne de contact disparaît.
  contact: "mamalric@b27.fr",

  // La barre de recherche et les filtres n'apparaissent qu'à partir de ce
  // nombre de portes. En dessous ils encombrent plus qu'ils n'aident : la
  // page tient déjà tout entière sous les yeux.
  seuilFiltres: 6,

  // Les titres de section par catégorie ne se forment qu'à partir de ce
  // nombre de catégories réellement peuplées. En dessous, une grille simple
  // se lit mieux qu'une suite de sections d'une carte chacune.
  seuilSections: 3
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
                  payantes. Sans offre payante, le texte part tout seul mais
                  la capture reste dans le presse-papiers, à coller à la main
                  dans la réponse.

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
  // Exemple Formspree : "https://formspree.io/f/xxxxxxxx"
  endpoint: "",

  // Nom de l'application, repris dans l'objet du message. Sur un autre
  // outil, c'est la seule ligne à changer avec le destinataire.
  application: "Hub Outils B27",

  // Proposer la capture d'écran. Le navigateur demandera toujours une
  // confirmation avant de capturer : aucune page ne peut filmer un écran
  // sans accord explicite, et c'est très bien ainsi.
  capture: true,

  // Proposer la dictée vocale. Ne fonctionne que sur Chrome et Edge ; le
  // bouton se cache tout seul ailleurs. À savoir : sur ces navigateurs, la
  // reconnaissance vocale n'est pas locale, la voix est envoyée au service
  // de transcription de l'éditeur du navigateur. Le panneau le dit à
  // l'utilisateur avant le premier enregistrement.
  dictee: true
};
