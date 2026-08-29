/* =====================================================================
   catalogue.js : le seul fichier à modifier pour faire vivre le hub.
   =====================================================================

   Le hall se parcourt comme une armoire : on ouvre un dossier, parfois un
   sous-dossier, et on tombe sur les portes. Ajouter quelque chose, c'est
   ajouter un objet dans un des tableaux ci-dessous. Aucun autre fichier
   n'est à toucher : ni index.html, ni hub.js, ni hub.css. Les dossiers,
   les compteurs, le fil d'Ariane, la recherche et le panneau "À propos"
   se recalculent seuls à partir de ces données.

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

     outil   ce que nous fabriquons : carte pleine, avec pitch et mots-clés.
     lien    une ressource extérieure que nous ne maintenons pas : carte
             compacte, sans mots-clés.

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

   Trois écarts, assumés et signalés. L'ocre de l'électricité est assombri de
   #c18900 à #b17e00, le premier ne tenant que 3,07:1 avec le glyphe blanc.
   Le rouge SSI est au contraire éclairci de #b01818 à #c62828 : l'original
   tenait très bien face au glyphe, mais tombait à 2,68:1 face au fond du
   thème sombre, où la tuile se distinguait mal de la page. La ventilation
   n'a pas de teinte propre chez B27, où elle appartient à la famille CVC :
   un cyan #2f7f92 la distingue du chauffage sans quitter la famille de l'air.

   TOUTE COULEUR NOUVELLE DOIT TENIR AU MOINS 3:1 SUR TROIS FRONTS : avec le
   glyphe blanc, avec le fond du thème clair, et avec celui du thème sombre.
   Une teinte trop claire efface le glyphe, une teinte trop foncée fait
   disparaître la tuile sur fond noir. Le contrôle du catalogue vérifie les
   trois et refuse de passer en dessous.

   Les dossiers du premier niveau. L'ordre de ce tableau est l'ordre
   d'affichage. Une catégorie sans aucune porte n'apparaît pas : elles
   peuvent donc être déclarées d'avance, elles restent invisibles jusqu'à
   la première porte qui s'y range.
   --------------------------------------------------------------------- */

const CATEGORIES = [
  { cle: "cvc",         nom: "Chauffage et climatisation",  icone: "radiateur",   couleur: "#3e8fb8" },
  { cle: "ventilation", nom: "Ventilation",                 icone: "vent",        couleur: "#2f7f92" },
  { cle: "plomberie",   nom: "Plomberie et ECS",            icone: "gouttes",     couleur: "#1f7a6e" },
  { cle: "thermique",   nom: "Thermique et réglementation", icone: "thermometre", couleur: "#c4562f" },
  { cle: "securite",    nom: "Sécurité incendie",           icone: "bouclier",    couleur: "#c62828" },
  { cle: "carbone",     nom: "Carbone et environnement",    icone: "feuille",     couleur: "#557a3a" },
  { cle: "electricite", nom: "Électricité",                 icone: "eclair",      couleur: "#b17e00" },
  { cle: "b27",         nom: "B27",                         icone: "immeuble",    couleur: "#5f7f1f" },
  { cle: "ressources",  nom: "Ressources et référentiels",  icone: "livre",       couleur: "#6b5ba6" }
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
  { cle: "reglementation", categorie: "ressources", nom: "Réglementation", icone: "livre" },
  { cle: "donnees",        categorie: "ressources", nom: "Données et bases", icone: "base_donnees" },
  { cle: "technique",      categorie: "ressources", nom: "Documentation technique", icone: "regle" }
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
  // disparaît. Le bandeau se resserre dès qu'on entre dans un dossier.
  accroche: "Toutes les portes, au même endroit.",
  chapeau: "Ouvrez un dossier pour trouver un outil, un site ou une ressource. Ce que nous fabriquons fonctionne dans le navigateur : rien à installer, aucun compte à créer.",

  // Adresse affichée dans le pied de page et le panneau "À propos".
  // Chaîne vide : la ligne de contact disparaît.
  contact: "mamalric@b27.fr",

  // Photo du bandeau d'accueil. Le hub tire au sort une image de chantier
  // chez Unsplash, la passe en noir et blanc puis en sépia puis au vert de
  // B27, et en change régulièrement, à la manière des fonds d'écran Windows.
  //
  // La clé d'accès Unsplash est publique par conception : elle n'ouvre que
  // des lectures et le fournisseur la destine explicitement au code d'un site.
  // Elle peut donc rester dans le dépôt. Tant qu'elle est vide, le bandeau
  // garde son dégradé vert et n'émet aucune requête : c'est un état de
  // fonctionnement normal, pas une panne. La marche à suivre pour en obtenir
  // une, en deux minutes et sans frais, est dans docs/bandeau.md.
  bandeau: {
    actif: true,
    cle: "",

    // Ce que l'on demande à Unsplash. Plusieurs recherches valent mieux
    // qu'une seule, qui finirait par ramener toujours les mêmes photos.
    recherches: [
      "construction site",
      "steel structure building",
      "architecture facade concrete",
      "building under construction crane",
      "industrial building interior"
    ],

    // Nombre de photos ramenées en une seule requête, puis tirées au sort à
    // chaque visite. Le quota d'un compte de démonstration est de cinquante
    // requêtes par heure, tous visiteurs confondus : interroger l'API à
    // chaque chargement de page l'épuiserait en un midi. Un lot gardé
    // plusieurs jours ramène cela à une requête par poste et par semaine,
    // et le tirage reste différent à chaque visite.
    parLot: 12,
    joursDeCache: 7
  },

  // La barre de recherche n'apparaît qu'à partir de ce nombre de portes.
  // En dessous elle encombre plus qu'elle n'aide : le hall tient déjà tout
  // entier sous les yeux.
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
