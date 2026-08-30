/* =====================================================================
   catalogue.js : le seul fichier à modifier pour faire vivre le portail.
   =====================================================================

   Le portail se lit en deux rayons, nos outils et les ressources, tous deux
   en cartes. Les rayons se déroulent
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

   Deux champs facultatifs en plus : "en", qui porte la traduction anglaise
   du nom et du pitch, et "attente", qui marque une carte posée pour tenir
   la place d'un métier sans projet décidé. Une carte en attente s'affiche
   comme les autres mais ne se compte pas : ce n'est pas un outil.

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
    en: { nom: "DHW and Loop Calculator", pitch: "Domestic hot water storage demand and loop sizing, according to the use of the building." },
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
    en: { nom: "Finimetal Emitter Sizing", pitch: "Room-by-room selection of Finimetal radiators and towel rails, from the heat losses." },
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
    en: { nom: "Ventilation Duct Sizing", pitch: "Sections, velocities and pressure drops of air networks, run by run." },
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
    en: { nom: "Cold Water Sizing", pitch: "Diameters and pressure drops of the cold water network, from the fixtures served." },
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
    en: { nom: "Waste and Soil Water Sizing", pitch: "Stacks, collectors and primary venting for waste and soil water, from the connected fixtures." },
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
    en: { nom: "Rainwater Sizing", pitch: "Gutters, downpipes and collectors from the catchment area and the rainfall intensity." },
    url: "",
    categorie: "plomberie",
    statut: "a-venir",
    type: "outil",
    icone: "pluie",
    tags: ["EP", "descentes", "chéneaux", "DTU 60.11"],
    maj: "2026-08-29"
  },

  /* Les outils de la feuille de route, pas encore déployés : leurs fiches
     sont posées d'avance, statut a-venir, et il n'y aura que l'url et le
     statut à changer au moment de publier. Seuls figurent ici des noms
     donnés par la maison. Quatre fiches portaient des noms d'application
     que personne n'avait validés, déduits ou inventés au fil des
     sessions : elles sont devenues des cartes "À venir", plus bas. Le
     pitch de RefriSelect et de RTex Tool reste déduit du nom, à corriger
     si la déduction est fausse. */

  {
    id: "refriselect",
    nom: "RefriSelect",
    pitch: "Sélection et comparaison des fluides frigorifiques d'une installation de froid.",
    en: { nom: "RefriSelect", pitch: "Selection and comparison of the refrigerants of a cooling installation." },
    url: "",
    categorie: "climatisation",
    statut: "a-venir",
    type: "outil",
    icone: "flocon",
    tags: ["fluides frigorigènes", "froid", "F-Gas"],
    maj: "2026-08-30"
  },

  /* L'étiquette DPE. Le pitch et l'url restent à remplir : l'outil est
     nommé par la maison, ce qu'il fait exactement n'a pas été dit ici. */
  {
    id: "etiquette-dpe",
    nom: "Étiquette DPE",
    pitch: "Étiquette énergie et climat d'un bâtiment.",
    en: { nom: "EPC Label", pitch: "Energy and climate label of a building." },
    url: "",
    categorie: "thermique",
    statut: "a-venir",
    type: "outil",
    icone: "jauge",
    tags: ["DPE", "étiquette énergie", "classe"],
    maj: "2026-08-30"
  },

  {
    id: "desenfumage",
    nom: "Désenfumage",
    pitch: "Dimensionnement du désenfumage : amenées d'air et évacuations, selon l'IT 246.",
    en: { nom: "Smoke Extraction", pitch: "Smoke extraction sizing: air inlets and outlets, to the French IT 246 rules." },
    url: "",
    categorie: "securite",
    statut: "a-venir",
    type: "outil",
    icone: "vent",
    tags: ["désenfumage", "IT 246", "SSI"],
    maj: "2026-08-30"
  },

  {
    id: "a-venir-carbone",
    nom: "À venir",
    pitch: "Un outil de ce métier est en préparation. Sa fiche sera remplie quand il naîtra.",
    en: { nom: "Coming soon", pitch: "A tool for this trade is in preparation. Its card will be filled in when it exists." },
    url: "",
    categorie: "carbone",
    statut: "a-venir",
    attente: true,        // une carte qui tient la place, pas un outil : elle ne se compte pas
    type: "outil",
    icone: "horloge",
    tags: ["à venir", "en préparation"],
    maj: "2026-08-30"
  },

  {
    id: "rtex-tool",
    nom: "RTex Tool",
    pitch: "Application de la RT existant à une rénovation, élément par élément.",
    en: { nom: "RTex Tool", pitch: "Applying the existing-building thermal regulation to a renovation, element by element." },
    url: "",
    categorie: "thermique",
    statut: "a-venir",
    type: "outil",
    icone: "livre",
    tags: ["RT existant", "rénovation"],
    maj: "2026-08-30"
  },

  {
    id: "a-venir-utilitaire",
    nom: "À venir",
    pitch: "Un outil de ce métier est en préparation. Sa fiche sera remplie quand il naîtra.",
    en: { nom: "Coming soon", pitch: "A tool for this trade is in preparation. Its card will be filled in when it exists." },
    url: "",
    categorie: "utilitaire",
    statut: "a-venir",
    attente: true,        // une carte qui tient la place, pas un outil : elle ne se compte pas
    type: "outil",
    icone: "horloge",
    tags: ["à venir", "en préparation"],
    maj: "2026-08-30"
  },

  /* Chaque métier de la maison a au moins une carte, même sans projet
     encore décidé : c'est un choix d'affichage, le portail montre que le
     métier existe et que des outils y viendront.

     CES CARTES NE PORTENT AUCUN NOM D'OUTIL, et c'est la leçon d'une
     erreur. Elles ont d'abord été des prête-noms, des applications
     plausibles du métier inventées pour tenir la place : un portail public
     annonçait ainsi des outils que personne n'avait décidés, sous des noms
     que personne n'avait validés. Une carte qui attend se contente
     désormais de dire qu'elle attend. Remplacer l'une d'elles, c'est
     remplir son nom, son pitch, son icône et son url. */

  {
    id: "a-venir-vrd",
    nom: "À venir",
    pitch: "Un outil de ce métier est en préparation. Sa fiche sera remplie quand il naîtra.",
    en: { nom: "Coming soon", pitch: "A tool for this trade is in preparation. Its card will be filled in when it exists." },
    url: "",
    categorie: "vrd",
    statut: "a-venir",
    attente: true,        // une carte qui tient la place, pas un outil : elle ne se compte pas
    type: "outil",
    icone: "horloge",
    tags: ["à venir", "en préparation"],
    maj: "2026-08-30"
  },

  {
    id: "a-venir-electricite",
    nom: "À venir",
    pitch: "Un outil de ce métier est en préparation. Sa fiche sera remplie quand il naîtra.",
    en: { nom: "Coming soon", pitch: "A tool for this trade is in preparation. Its card will be filled in when it exists." },
    url: "",
    categorie: "electricite",
    statut: "a-venir",
    attente: true,        // une carte qui tient la place, pas un outil : elle ne se compte pas
    type: "outil",
    icone: "horloge",
    tags: ["à venir", "en préparation"],
    maj: "2026-08-30"
  },

  {
    id: "a-venir-paysage",
    nom: "À venir",
    pitch: "Un outil de ce métier est en préparation. Sa fiche sera remplie quand il naîtra.",
    en: { nom: "Coming soon", pitch: "A tool for this trade is in preparation. Its card will be filled in when it exists." },
    url: "",
    categorie: "paysage",
    statut: "a-venir",
    attente: true,        // une carte qui tient la place, pas un outil : elle ne se compte pas
    type: "outil",
    icone: "horloge",
    tags: ["à venir", "en préparation"],
    maj: "2026-08-30"
  },

  {
    id: "a-venir-structure",
    nom: "À venir",
    pitch: "Un outil de ce métier est en préparation. Sa fiche sera remplie quand il naîtra.",
    en: { nom: "Coming soon", pitch: "A tool for this trade is in preparation. Its card will be filled in when it exists." },
    url: "",
    categorie: "structure",
    statut: "a-venir",
    attente: true,        // une carte qui tient la place, pas un outil : elle ne se compte pas
    type: "outil",
    icone: "horloge",
    tags: ["à venir", "en préparation"],
    maj: "2026-08-30"
  },

  {
    id: "a-venir-bim",
    nom: "À venir",
    pitch: "Un outil de ce métier est en préparation. Sa fiche sera remplie quand il naîtra.",
    en: { nom: "Coming soon", pitch: "A tool for this trade is in preparation. Its card will be filled in when it exists." },
    url: "",
    categorie: "bim",
    statut: "a-venir",
    attente: true,        // une carte qui tient la place, pas un outil : elle ne se compte pas
    type: "outil",
    icone: "horloge",
    tags: ["à venir", "en préparation"],
    maj: "2026-08-30"
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
    id: "geoportail",
    nom: "Géoportail",
    pitch: "Les cartes de l'IGN : cadastre, photos aériennes, altimétrie, zonages.",
    url: "https://www.geoportail.gouv.fr",
    categorie: "ressources",
    sousCategorie: "donnees",
    statut: "en-ligne",
    type: "lien",
    icone: "position",
    tags: ["IGN", "cartes", "altimétrie", "zonages"],
    maj: "2026-08-30"
  },

  {
    id: "cadastre",
    nom: "Cadastre",
    pitch: "Le plan cadastral, parcelle par parcelle, sur fond de photo aérienne.",
    url: "https://cadastre.data.gouv.fr/map?style=ortho",
    categorie: "ressources",
    sousCategorie: "donnees",
    statut: "en-ligne",
    type: "lien",
    icone: "regle",
    tags: ["cadastre", "parcelles", "orthophoto"],
    maj: "2026-08-30"
  },

  {
    id: "bimobject",
    nom: "BIMobject",
    pitch: "Bibliothèque d'objets BIM des fabricants, à charger dans une maquette.",
    url: "https://www.bimobject.com",
    categorie: "ressources",
    sousCategorie: "donnees",
    statut: "en-ligne",
    type: "lien",
    icone: "grille",
    tags: ["BIM", "objets", "fabricants", "maquette"],
    maj: "2026-08-30"
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
  },

  {
    id: "acermi",
    nom: "ACERMI",
    pitch: "Les certificats des isolants : résistance thermique et caractéristiques certifiées.",
    url: "https://www.acermi.com",
    categorie: "ressources",
    sousCategorie: "technique",
    statut: "en-ligne",
    type: "lien",
    icone: "bouclier",
    tags: ["isolants", "certification", "lambda", "résistance"],
    maj: "2026-08-30"
  },

  {
    id: "batipedia",
    nom: "Batipedia",
    pitch: "Les DTU, normes et règles de l'art du bâtiment, en accès abonné.",
    url: "https://www.batipedia.com",
    categorie: "ressources",
    sousCategorie: "technique",
    statut: "en-ligne",
    type: "lien",
    icone: "livre",
    tags: ["DTU", "normes", "règles de l'art"],
    maj: "2026-08-30"
  },

  {
    id: "aicvf",
    nom: "AICVF",
    pitch: "L'association des ingénieurs en climatique, ventilation et froid.",
    url: "https://aicvf.org",
    categorie: "ressources",
    sousCategorie: "technique",
    statut: "en-ligne",
    type: "lien",
    icone: "ondes",
    tags: ["AICVF", "association", "CVC"],
    maj: "2026-08-30"
  },

  /* ---- Services et outils du quotidien -----------------------------
     Ce qu'on ouvre en travaillant, sans que ce soit une référence
     technique. ATTENTION : les trois services Zoho demandent un compte
     d'entreprise, ils ne s'ouvrent pas pour un visiteur extérieur. La
     charte veut qu'un portail public ne montre pas ce qui est réservé à
     l'interne, et B27 Mobility en était sorti pour cette raison. Ils sont
     ici parce qu'ils ont été demandés ; à déplacer ou à retirer si le
     portail doit rester entièrement ouvrable par un client. */

  {
    id: "zoho-projects",
    nom: "Zoho Projects",
    pitch: "Le suivi des projets et des tâches. Demande un compte d'entreprise.",
    url: "https://www.zoho.com/projects/",
    categorie: "ressources",
    sousCategorie: "services",
    statut: "en-ligne",
    type: "lien",
    icone: "calendrier",
    tags: ["Zoho", "projets", "tâches", "interne"],
    maj: "2026-08-30"
  },

  {
    id: "zoho-expense",
    nom: "Zoho Expense",
    pitch: "Les notes de frais et les déplacements. Demande un compte d'entreprise.",
    url: "https://www.zoho.com/expense/",
    categorie: "ressources",
    sousCategorie: "services",
    statut: "en-ligne",
    type: "lien",
    icone: "calculatrice",
    tags: ["Zoho", "notes de frais", "interne"],
    maj: "2026-08-30"
  },

  {
    id: "zoho-people",
    nom: "Zoho People",
    pitch: "Les congés, les absences et le dossier du personnel. Demande un compte d'entreprise.",
    url: "https://www.zoho.com/people/",
    categorie: "ressources",
    sousCategorie: "services",
    statut: "en-ligne",
    type: "lien",
    icone: "personne",
    tags: ["Zoho", "congés", "RH", "interne"],
    maj: "2026-08-30"
  },

  {
    id: "swisstransfer",
    nom: "SwissTransfer",
    pitch: "Envoi de fichiers lourds, jusqu'à 50 Go, sans compte.",
    url: "https://www.swisstransfer.com",
    categorie: "ressources",
    sousCategorie: "services",
    statut: "en-ligne",
    type: "lien",
    icone: "dossier",
    tags: ["fichiers", "transfert", "pièces jointes"],
    maj: "2026-08-30"
  },

  // Le site de l'entreprise. Il a d'abord été rangé dans "Nos outils", où il
  // se donnait pour un outil que nous fabriquons, puis en signature de pied
  // de page, puis retiré. Il revient là où il est juste : c'est un site
  // extérieur au portail, comme Légifrance ou l'ADEME, et les ressources
  // sont faites pour ça. Il ferme le rayon, et donc la page.
  {
    id: "site-b27",
    nom: "B27",
    pitch: "Le site de l'entreprise : métiers, agences, réalisations, actualités.",
    url: "https://www.b27.fr",
    categorie: "ressources",
    sousCategorie: "b27",
    statut: "en-ligne",
    type: "lien",
    icone: "immeuble",
    tags: ["B27", "entreprise", "agences", "réalisations"],
    maj: "2026-08-30"
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
  { cle: "chauffage",   nom: "Chauffage",                   court: "Chauffage",    icone: "flamme",      couleur: "#3e8fb8", metier: true, en: { nom: "Heating", court: "Heating" } },
  { cle: "climatisation", nom: "Climatisation et froid",    court: "Climatisation",icone: "flocon",      couleur: "#4a6fb0", metier: true, en: { nom: "Cooling and refrigeration", court: "Cooling" } },
  { cle: "ventilation", nom: "Ventilation",                 court: "Ventilation",  icone: "vent",        couleur: "#2f7f92", metier: true, en: { nom: "Ventilation", court: "Ventilation" } },
  { cle: "plomberie",   nom: "Plomberie et ECS",            court: "Plomberie",    icone: "gouttes",     couleur: "#1f7a6e", metier: true, en: { nom: "Plumbing and DHW", court: "Plumbing" } },
  { cle: "vrd",         nom: "VRD et assainissement",       court: "VRD",          icone: "reseau",      couleur: "#7a6249", metier: true, en: { nom: "Civils and drainage", court: "Civils" } },
  { cle: "thermique",   nom: "Thermique et réglementation", court: "Thermique",    icone: "thermometre", couleur: "#c4562f", metier: true, en: { nom: "Building physics and regulations", court: "Thermal" } },
  { cle: "securite",    nom: "Sécurité incendie",           court: "SSI",          icone: "bouclier",    couleur: "#c62828", metier: true, en: { nom: "Fire safety", court: "Fire" } },
  { cle: "electricite", nom: "Électricité",                 court: "Électricité",  icone: "eclair",      couleur: "#b17e00", metier: true, en: { nom: "Electrical", court: "Electrical" } },
  { cle: "carbone",     nom: "Carbone et environnement",    court: "Carbone",      icone: "nuage",       couleur: "#557a3a", metier: true, en: { nom: "Carbon and environment", court: "Carbon" } },
  { cle: "paysage",     nom: "Paysage et aménagement",      court: "Paysage",      icone: "feuille",     couleur: "#4e8a2f", metier: true, en: { nom: "Landscape and site", court: "Landscape" } },
  { cle: "structure",   nom: "Structure",                   court: "Structure",    icone: "immeuble",    couleur: "#5f6a74", metier: true, en: { nom: "Structure", court: "Structure" } },
  { cle: "bim",         nom: "BIM et maquette numérique",   court: "BIM",          icone: "grille",      couleur: "#9450a5", metier: true, en: { nom: "BIM and digital models", court: "BIM" } },
  { cle: "utilitaire",  nom: "Utilitaires",                 court: "Utilitaires",  icone: "calculatrice",couleur: "#6b6f76", metier: true, en: { nom: "General tools", court: "General" } },
  { cle: "ressources",  nom: "Ressources et référentiels",  court: "Ressources",   icone: "livre",       couleur: "#6b5ba6", en: { nom: "Resources and references", court: "Resources" } }
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
  { cle: "reglementation", categorie: "ressources", nom: "Réglementation", court: "Réglementation", icone: "livre", en: { nom: "Regulations", court: "Regulations" } },
  { cle: "donnees",        categorie: "ressources", nom: "Données et bases", court: "Données", icone: "base_donnees", en: { nom: "Data and databases", court: "Data" } },
  { cle: "technique",      categorie: "ressources", nom: "Documentation technique", court: "Documentation", icone: "regle", en: { nom: "Technical documentation", court: "Documentation" } },
  { cle: "services",       categorie: "ressources", nom: "Services et outils du quotidien", court: "Services", icone: "grille", en: { nom: "Everyday services and tools", court: "Services" } },
  { cle: "b27",            categorie: "ressources", nom: "Le bureau d'études",     court: "B27",           icone: "immeuble", en: { nom: "The practice", court: "B27" } }
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

  // La traduction du portail. Seul le portail se traduit : les fiches de
  // ressources gardent leur nom et leur description en français, puisqu'elles
  // mènent à des sites français.
  en: {
    titre: "B27 Tools",
    sousTitre: "The tools and resources portal of the engineering practice",
    accroche: "The tools and resources of the engineering practice, open to all. Nothing to install, no account."
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

  // La recherche n'apparaît qu'à partir de ce nombre d'entrées. En dessous
  // elle encombre plus qu'elle n'aide : le portail tient déjà tout entier
  // sous les yeux.
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
