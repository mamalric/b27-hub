/* =====================================================================
   hub.js : le moteur du portail B27.

   Un portail public de visibilité : on entre, on voit les outils et les
   ressources du bureau d'études, on clique, c'est tout. Pas de compte,
   pas de portail de connexion, et il n'y en aura pas.

   La page est une démonstration autant qu'un annuaire : un champ
   d'écoulement animé en fond, calculé en local, la météo en données
   réelles, un calendrier en semaines ISO. Tout se construit à
   l'exécution depuis catalogue.js, seul fichier à faire vivre.

   Deux requêtes externes, toutes deux facultatives : la météo
   (Open-Meteo, sans clé ni compte) et la géolocalisation si le visiteur
   la demande. Sans réseau, la tuile météo disparaît et tout le reste
   fonctionne à l'identique, double-clic sur index.html compris.
   ===================================================================== */

/* ---------------------------------------------------------------------
   VERSION ET JOURNAL
   --------------------------------------------------------------------- */
const CHANGELOG = [
  { v: "v9", date: "2026-08-29", titre: "La météo en grand",
    texte: "Un clic sur la tuile météo ouvre le panneau détaillé : dix mesures du moment dont le point de rosée calculé par Magnus, les prochaines vingt-quatre heures, la semaine, le soleil et la qualité de l'air avec les pollens. Et chacun compose sa tuile : les mesures affichées par défaut se cochent dans le panneau, le choix reste dans le navigateur." },
  { v: "v8", date: "2026-08-29", titre: "Le fond vit avec le ciel",
    texte: "Le champ d'écoulement suit désormais la météo affichée : bruine et pluie en fines stries inclinées par le vent mesuré, neige en flocons qui oscillent, brouillard presque immobile, orage en turbulence — jamais en éclairs, le calme est la règle. La saison teinte la palette, hiver froid, été doré. Au défilement, tout s'ancre : la météo et le calendrier se replient en pastilles, le logo et le titre se posent dans une pilule centrale qui ramène en haut." },
  { v: "v7", date: "2026-08-29", titre: "Le portail",
    texte: "Refonte complète : tout est centré sous le logo, un champ d'écoulement animé calculé en local occupe le fond, la météo affiche des données réelles Open-Meteo, un calendrier donne les semaines ISO. Le catalogue se lit en deux rayons, nos outils et les ressources, et la métaphore des portes disparaît. Sombre par défaut. La pastille de signalement est conservée telle quelle." },
  { v: "v6", date: "2026-08-29", titre: "Bandeau photo, épuré",
    texte: "Bandeau d'accueil pleine largeur à photo de chantier teintée au vert B27. Retiré dès la v7 au profit du fond animé." },
  { v: "v5", date: "2026-08-29", titre: "Bandeau de charpente",
    texte: "Une charpente métallique dessinée en axonométrie dans le bandeau d'accueil. Retirée dès la v6." },
  { v: "v4", date: "2026-08-29", titre: "Tableau de bord",
    texte: "Barre latérale permanente, recherche en haut, cartes chiffrées, épingles et portes récentes en localStorage. L'essentiel a été retiré depuis, au fil de l'épuration." },
  { v: "v3", date: "2026-08-29", titre: "Navigation par dossiers",
    texte: "Dossiers carrés, sous-dossiers, fil d'Ariane, adresse qui suit la position. Remplacée en v7 par un portail à plat." },
  { v: "v2", date: "2026-08-29", titre: "Hall d'entrée, logo B27 et signalement",
    texte: "Le catalogue s'élargit au-delà des outils, et une pastille en bas à droite ouvre un formulaire de signalement avec capture d'écran et dictée vocale." },
  { v: "v1", date: "2026-08-29", titre: "Première mise en ligne",
    texte: "Cartes cliquables construites à partir du catalogue, thème clair et sombre, panneau À propos." }
];

/* ---------------------------------------------------------------------
   LOGO B27

   Le monogramme seul, sans la plaque blanche du fichier logo-b27.svg qui
   n'a de sens que pour une favicon. Le viewBox est calé au plus juste sur
   les tracés (35.52 x 38.95) pour que le logo occupe vraiment la taille
   demandée, sans marge morte.
   --------------------------------------------------------------------- */
const TRACES_LOGO =
    '<path d="M0.59 27.13 C0.80 25.41 1.18 23.39 3.48 22.15 C4.95 21.40 7.17 21.02 9.44 21.02 C11.38 21.02 18.64 21.19 18.64 26.49 C18.64 27.65 18.22 28.80 17.43 29.72 C16.04 31.25 13.92 31.92 9.56 33.32 C6.78 34.21 6.22 34.48 5.49 35.50 L18.20 35.50 L18.20 38.95 L0.00 38.95 C0.03 37.93 0.03 35.77 1.50 33.81 C3.04 31.79 5.54 30.90 6.99 30.39 C8.23 29.96 9.47 29.56 10.74 29.10 C11.97 28.67 13.42 28.16 13.42 26.57 C13.42 24.50 10.79 24.36 9.38 24.36 C7.85 24.36 6.72 24.71 6.05 25.57 C5.57 26.14 5.54 26.65 5.49 27.13 L0.59 27.13"/>'
  + '<path d="M0.61 0.00 L10.79 0.00 C16.42 0.00 18.55 2.40 18.55 4.87 C18.55 7.02 17.16 8.41 15.59 9.00 C17.16 9.48 19.22 10.84 19.22 13.34 C19.22 16.60 16.09 19.04 11.13 19.04 L0.61 19.04 L0.61 0.00 M10.21 7.51 C12.60 7.51 13.59 6.63 13.59 5.29 C13.59 3.90 12.30 3.18 10.36 3.18 L5.56 3.18 L5.56 7.51 L10.21 7.51 M5.56 15.86 L10.10 15.86 C12.82 15.86 14.06 14.93 14.06 13.20 C14.06 11.67 12.84 10.69 10.07 10.69 L5.56 10.69 L5.56 15.86"/>'
  + '<path d="M20.64 21.59H30.73V25.63H20.64Z"/>'
  + '<path d="M20.64 21.59 L35.52 21.59 L35.52 23.64 L26.84 38.85 L21.62 38.85 L29.61 25.63 L20.64 25.63 L20.64 21.59"/>';

function logoB27(hauteur) {
  const h = hauteur || 32;
  const l = Math.round(h * 35.52 / 38.95 * 100) / 100;   // rapport du viewBox
  return '<svg class="logo-b27" width="' + l + '" height="' + h + '"'
    + ' viewBox="0 0 35.52 38.95" fill="currentColor" role="img" aria-label="B27">'
    + TRACES_LOGO + "</svg>";
}

/* ---------------------------------------------------------------------
   ICÔNES

   Tracés Lucide inlinés, comme dans les autres outils B27. Ajouter une
   icône, c'est ajouter une ligne ici, puis citer son nom dans le champ
   "icone" d'une entrée du catalogue.
   --------------------------------------------------------------------- */
const TRACES_ICONES = {
  grille: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  gouttes: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  radiateur: '<path d="M11 8c2-3-2-3 0-6"/><path d="M15.5 8c2-3-2-3 0-6"/><path d="M6 10h.01"/><path d="M6 14h.01"/><path d="M10 16v-4"/><path d="M14 16v-4"/><path d="M18 16v-4"/><path d="M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3"/><path d="M5 20v2"/><path d="M19 20v2"/>',
  vent: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
  flocon: '<line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
  flamme: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  thermometre: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
  feuille: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  bouclier: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  nuage: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  eclair: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  immeuble: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
  bureau: '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  calculatrice: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
  livre: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  base_donnees: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  dossier: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  voiture: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  regle: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  recherche: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sortie: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  soleil: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  nuage_soleil: '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
  pluie: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>',
  neige: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/>',
  orage: '<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/>',
  brouillard: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/>',
  jauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  position: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  calendrier: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  chevron_g: '<path d="m15 18-6-6 6-6"/>',
  chevron_d: '<path d="m9 18 6-6-6-6"/>',
  lune: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  engrenage: '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
  fermer: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  actualiser: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  courrier: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  telephone: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  personne: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  horloge: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  valider: '<path d="M20 6 9 17l-5-5"/>',
  attention: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  etincelle: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'
};

// L'épaisseur de trait est réglable, et il faut s'en servir dès qu'on agrandit
// une icône : les tracés Lucide sont dessinés à 2 sur une grille de 24, un
// grand glyphe demande un trait proportionnellement plus fin pour garder la
// même densité apparente.
function ico(nom, taille, epaisseur) {
  const traces = TRACES_ICONES[nom] || TRACES_ICONES.info;
  return '<svg class="ico" width="' + (taille || 16) + '" height="' + (taille || 16) + '" viewBox="0 0 24 24"'
    + ' fill="none" stroke="currentColor" stroke-width="' + (epaisseur || 2) + '"'
    + ' stroke-linecap="round" stroke-linejoin="round"'
    + ' aria-hidden="true">' + traces + '</svg>';
}

function poserIcones(racine) {
  (racine || document).querySelectorAll("[data-ico]").forEach(el => {
    if (el.dataset.icoPose) return;
    const taille = +el.dataset.icoTaille || 16;
    el.insertAdjacentHTML("afterbegin", ico(el.dataset.ico, taille));
    el.dataset.icoPose = "1";
  });
}

/* ---------------------------------------------------------------------
   OUTILLAGE
   --------------------------------------------------------------------- */
const $ = id => document.getElementById(id);

function ech(txt) {
  return String(txt == null ? "" : txt)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Comparaison insensible à la casse et aux accents : chercher "electricite"
// doit trouver "Électricité", personne ne tape les accents dans un filtre.
function normaliser(txt) {
  return String(txt || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function dateFr(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return iso || "inconnue";
  const [a, m, j] = iso.split("-");
  return j + "/" + m + "/" + a;
}

// Décimale à la française : 18,4 et non 18.4.
function virgule(n, dec) {
  return Number(n).toFixed(dec == null ? 1 : dec).replace(".", ",");
}

const STATUTS = {
  "en-ligne": { libelle: "En ligne",  cliquable: true,  pastille: false },
  "beta":     { libelle: "Bêta",      cliquable: true,  pastille: true  },
  "a-venir":  { libelle: "Bientôt",   cliquable: false, pastille: true  },
  "bureau":   { libelle: "Au bureau", cliquable: false, pastille: true  },
  "obsolete": { libelle: "Obsolète",  cliquable: false, pastille: true  }
};

const TYPES = { outil: true, lien: true };

const COULEUR_REPLI = "#5f7f1f";

// Une couleur venue du catalogue finit dans un attribut style : on ne laisse
// passer que de l'hexadécimal.
function couleurSure(c) {
  return /^#[0-9a-fA-F]{3,8}$/.test(String(c || "")) ? c : COULEUR_REPLI;
}

function categorie(cle) { return CATEGORIES.find(c => c.cle === cle) || null; }
function sousCategorie(cle) {
  return (typeof SOUS_CATEGORIES === "undefined" ? [] : SOUS_CATEGORIES).find(s => s.cle === cle) || null;
}
function contacts() { return typeof CONTACTS === "undefined" ? [] : CONTACTS; }

/* ---------------------------------------------------------------------
   CONTRÔLE DU CATALOGUE
   --------------------------------------------------------------------- */
function controlerCatalogue() {
  const anomalies = [];
  const vus = new Set();
  const clesCategories = new Set(CATEGORIES.map(c => c.cle));
  const toutesSous = typeof SOUS_CATEGORIES === "undefined" ? [] : SOUS_CATEGORIES;
  const clesSous = new Set(toutesSous.map(s => s.cle));

  toutesSous.forEach((s, i) => {
    const ou = "sous-catégorie " + (i + 1) + " (" + (s.nom || s.cle || "sans nom") + ")";
    if (!clesCategories.has(s.categorie)) {
      anomalies.push(ou + ' : rattachée à la catégorie "' + s.categorie + "\" qui n'existe pas.");
    }
    if (s.icone && !TRACES_ICONES[s.icone]) {
      anomalies.push(ou + ' : icône "' + s.icone + "\" absente de TRACES_ICONES.");
    }
  });

  PORTES.forEach((o, i) => {
    const ou = "entrée " + (i + 1) + " (" + (o.nom || o.id || "sans nom") + ")";
    if (!o.id) anomalies.push(ou + " : champ id manquant.");
    else if (vus.has(o.id)) anomalies.push(ou + ' : id "' + o.id + '" déjà utilisé.');
    else vus.add(o.id);

    if (!o.nom) anomalies.push(ou + " : champ nom manquant.");
    if (!o.pitch) anomalies.push(ou + " : champ pitch manquant.");
    if (!clesCategories.has(o.categorie)) anomalies.push(ou + ' : catégorie "' + o.categorie + "\" inconnue de CATEGORIES.");
    if (o.sousCategorie) {
      if (!clesSous.has(o.sousCategorie)) {
        anomalies.push(ou + ' : sous-catégorie "' + o.sousCategorie + "\" inconnue de SOUS_CATEGORIES.");
      } else {
        const s = sousCategorie(o.sousCategorie);
        if (s && s.categorie !== o.categorie) {
          anomalies.push(ou + ' : sous-catégorie "' + o.sousCategorie + '" rattachée à "' + s.categorie
            + '" et non à "' + o.categorie + '".');
        }
      }
    }
    if (!STATUTS[o.statut]) anomalies.push(ou + ' : statut "' + o.statut + '" inconnu.');
    if (o.type && !TYPES[o.type]) anomalies.push(ou + ' : type "' + o.type + "\" inconnu, l'entrée sera rendue en type outil.");
    if (o.icone && !TRACES_ICONES[o.icone]) anomalies.push(ou + ' : icône "' + o.icone + "\" absente de TRACES_ICONES, remplacée par l'icône info.");
    if (STATUTS[o.statut] && STATUTS[o.statut].cliquable && !o.url) {
      anomalies.push(ou + " : statut cliquable mais url vide, la carte sera affichée non cliquable.");
    }
  });

  contacts().forEach((c, i) => {
    const ou = "contact " + (i + 1) + " (" + (c.nom || c.id || "sans nom") + ")";
    if (!c.nom) anomalies.push(ou + " : champ nom manquant.");
    if (!c.mail && !c.tel) anomalies.push(ou + " : ni mail ni téléphone, la fiche n'offrirait aucun moyen de joindre.");
  });

  if (anomalies.length) {
    console.warn("Portail B27 : " + anomalies.length + " anomalie(s) dans catalogue.js\n"
      + anomalies.map(a => "  - " + a).join("\n"));
  }
  return anomalies;
}

/* ---------------------------------------------------------------------
   THÈME

   Sombre par défaut : c'est l'identité du portail, pas un réglage du
   poste. La préférence enregistrée, elle, gagne toujours.
   --------------------------------------------------------------------- */
const CLE_THEME = "hub_b27_theme";

function appliquerTheme(t) {
  document.documentElement.dataset.theme = t;
  const btn = $("btnTheme");
  if (btn) btn.innerHTML = ico(t === "dark" ? "soleil" : "lune", 17);
  fondTheme();
}

function initTheme() {
  let memorise = null;
  try { memorise = localStorage.getItem(CLE_THEME); } catch (e) { /* stockage refusé */ }
  appliquerTheme(memorise === "light" || memorise === "dark" ? memorise : "dark");
  $("btnTheme").addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem(CLE_THEME, t); } catch (e) { /* tant pis, non mémorisé */ }
    appliquerTheme(t);
  });
}

/* ---------------------------------------------------------------------
   LE CHAMP D'ÉCOULEMENT

   Des particules qui suivent un champ de vecteurs, tracé par tracé, avec
   une traînée qui s'estompe : des lignes de flux, comme de l'air ou de
   l'eau en mouvement. C'est le métier du bureau d'études, en fond de
   page, et c'est calculé en local : pas une image, pas une vidéo, pas une
   bibliothèque.

   Le champ est une somme de sinus déphasés dans le temps : ce n'est pas
   du bruit de Perlin, mais à l'écran la différence ne se voit pas et le
   calcul tient en une ligne. Si le poste demande moins d'animations, le
   champ est dessiné une fois, immobile, et rien ne bouge.
   --------------------------------------------------------------------- */
const FOND = { ctx: null, parts: [], t: 0, anime: null, L: 0, H: 0, meteo: null, amb: null };

// Le délai maximal d'une traînée, en images : au-delà, le tracé expire et
// disparaît, sans exception. La première version estompait par voile
// translucide, et c'était une erreur : l'estompage est asymptotique, et
// l'arrondi 8 bits fait qu'un pixel sombre n'atteint jamais tout à fait le
// fond. Les traînées ne mouraient donc jamais, elles s'accumulaient en toile.
// Ici, le fond est repeint en entier à chaque image et chaque particule ne
// garde que ses dernières positions : l'expiration est ferme, pas approchée.
const DUREE_TRAINEE = 55;

/* Le fond vit avec le ciel et les saisons. La mesure Open-Meteo qui remplit
   la tuile règle aussi le champ : la pluie fait descendre de fines stries
   obliques, la neige des flocons qui oscillent, le brouillard fige presque
   tout, l'orage rend le champ turbulent, le vent mesuré incline et allonge
   les traînées. La saison teinte la palette : hiver froid, printemps vert
   franc, été doré, automne ambré.

   Une règle domine tout le reste : apaisant, jamais épileptique. Donc pas
   d'éclair, pas de flash, aucune variation brutale de luminosité — l'orage
   se dit par la turbulence et la profondeur des verts, pas par la lumière.
   Les vitesses sont plafonnées bas, et un changement de météo ne bascule
   rien d'un coup : chaque particule adopte la nouvelle ambiance à sa
   renaissance, le fond glisse d'un état à l'autre en quelques secondes. */

function saisonCourante() {
  const m = new Date().getMonth() + 1;
  if (m === 12 || m <= 2) return "hiver";
  if (m <= 5) return "printemps";
  if (m <= 8) return "ete";
  return "automne";
}

// Regroupe les codes temps de l'OMM en familles d'ambiance. Sans mesure
// (pas de réseau, tuile absente), le fond vit sur "calme" et la saison.
function groupeMeteo(code) {
  if (code == null || !isFinite(code)) return "calme";
  if (code === 0) return "soleil";
  if (code <= 2) return "calme";
  if (code === 3) return "couvert";
  if (code <= 48) return "brouillard";
  if (code <= 67 || (code >= 80 && code <= 82)) return "pluie";
  if (code <= 77 || code === 85 || code === 86) return "neige";
  return "orage";   // 95-99, grêle comprise
}

// Palettes de lignes par saison. Triplets "r,g,b" : l'alpha est ajouté au
// tracé. La troisième teinte est la claire, tirée rarement.
const PALETTES_SAISON = {
  sombre: {
    hiver:     ["108,156,128", "66,104,92",  "182,214,198"],
    printemps: ["149,192,61",  "95,127,31",  "201,232,138"],
    ete:       ["168,188,66",  "116,128,38", "224,214,132"],
    automne:   ["172,148,62",  "124,100,42", "216,188,118"]
  },
  clair: {
    hiver:     ["74,118,100",  "96,138,122", "120,160,146"],
    printemps: ["95,127,31",   "85,122,58",  "149,192,61"],
    ete:       ["116,128,38",  "134,142,58", "168,178,70"],
    automne:   ["124,100,42",  "144,120,58", "172,148,72"]
  }
};

// Teintes des précipitations, indépendantes de la saison : la neige est
// blanche en janvier comme en avril.
const PALETTES_PRECIP = {
  sombre: { pluie: "126,168,178", neige: "208,220,214", brouillard: "142,152,138", orage: "84,146,126" },
  clair:  { pluie: "88,128,138",  neige: "150,166,160", brouillard: "128,138,124", orage: "62,110,94"  }
};

// Le fond lui-même respire à peine avec la saison : un écart de quelques
// niveaux, en dessous de ce que l'oeil nomme, mais l'hiver est plus froid
// que l'été. Le thème garde la main sur la clarté générale.
const FONDS_SAISON = {
  sombre: { hiver: "#090c0d", printemps: "#0a0d08", ete: "#0b0d07", automne: "#0c0c07" },
  clair:  { hiver: "#f0f4f5", printemps: "#f3f5f0", ete: "#f5f5ec", automne: "#f5f3ec" }
};

// Sous le soleil, la pointe claire de la palette se dore, quelle que soit
// la saison : c'est elle que le halo fait chanter.
function sombre_ete_traits(cle, saison) {
  const base = PALETTES_SAISON[cle][saison].slice();
  base[2] = cle === "sombre" ? "230,212,128" : "160,140,60";
  return base;
}

function calculerAmbiance() {
  const sombre = document.documentElement.dataset.theme !== "light";
  const cle = sombre ? "sombre" : "clair";
  const saison = saisonCourante();
  const groupe = groupeMeteo(FOND.meteo && FOND.meteo.code);
  // Le vent mesuré, ramené entre 0 et 1. 40 km/h et plus valent 1 : au-delà,
  // suivre la réalité rendrait le fond nerveux, ce qui est interdit ici.
  const vent = FOND.meteo ? Math.min(1, Math.max(0, FOND.meteo.vent / 40)) : 0.15;

  const a = {
    groupe: groupe,
    fond: FONDS_SAISON[cle][saison],
    traits: PALETTES_SAISON[cle][saison],
    precip: PALETTES_PRECIP[cle][groupe] || PALETTES_PRECIP[cle].pluie,
    genres: { ligne: 1, goutte: 0, flocon: 0 },
    nb: 90,             // particules au total
    vitesse: 1,         // facteur sur la vitesse des lignes
    turbulence: 1,      // facteur sur l'amplitude du champ
    alpha: 1,           // facteur sur l'opacité des traits
    biaisX: 0.1,        // dérive horizontale commune, poussée par le vent
    biaisY: 0,          // dérive verticale : négative, le flux monte
    trainee: DUREE_TRAINEE,
    // Les décors : de grandes nappes floues qui dérivent (nuages), un halo
    // fixe (soleil). C'est ce qui rend chaque temps reconnaissable au
    // premier regard : la vitesse et l'opacité seules, personne ne les
    // voit — c'est l'erreur qu'a corrigée cette version.
    nuages: 0, teinteNuage: "126,138,118", alphaNuage: 0.085,
    halo: false
  };

  if (groupe === "soleil") {
    // Courants thermiques lents, légèrement ascendants, et un halo doré
    // fixe en haut de page. Fixe : un halo qui bouge cesse d'être calme.
    a.vitesse = 0.85; a.trainee = 70; a.biaisY = -0.06; a.nb = 70;
    a.halo = true;
    a.traits = sombre_ete_traits(cle, saison);
  } else if (groupe === "couvert") {
    // Le ciel se voit : des nappes grises qui dérivent au-dessus d'un flux
    // ralenti, dans une palette assourdie.
    a.vitesse = 0.7; a.alpha = 0.8; a.nb = 65;
    a.nuages = 7;
    a.traits = cle === "sombre"
      ? ["118,132,112", "84,96,80", "150,162,140"]
      : ["96,108,90", "112,124,104", "130,142,120"];
  } else if (groupe === "brouillard") {
    // Presque immobile : traits courts et pâles, et des nappes très
    // larges, très diffuses, qui noient le bas de page.
    a.vitesse = 0.4; a.alpha = 0.5; a.trainee = 30; a.nb = 55;
    a.nuages = 9;
    a.teinteNuage = cle === "sombre" ? "140,150,136" : "150,158,146";
    a.alphaNuage = 0.075;
  } else if (groupe === "pluie") {
    a.genres = { ligne: 0.35, goutte: 0.65, flocon: 0 };
    a.nb = 115; a.vitesse = 0.85; a.alpha = 0.9;
    a.nuages = 4;
  } else if (groupe === "neige") {
    a.genres = { ligne: 0.3, goutte: 0, flocon: 0.7 };
    a.nb = 120; a.vitesse = 0.7;
  } else if (groupe === "orage") {
    // La turbulence et des nappes profondes disent l'orage, jamais la
    // lumière : pas d'éclair, pas de flash, c'est la règle. Sous 96 et 99,
    // la grêle mêle quelques flocons clairs.
    a.turbulence = 1.4; a.vitesse = 1.2; a.nb = 100;
    a.nuages = 6;
    a.teinteNuage = cle === "sombre" ? "70,104,92" : "80,104,94";
    a.alphaNuage = 0.09;
    a.traits = [a.precip, PALETTES_SAISON[cle][saison][1], PALETTES_SAISON[cle][saison][2]];
    const code = FOND.meteo && FOND.meteo.code;
    if (code === 96 || code === 99) a.genres = { ligne: 0.85, goutte: 0, flocon: 0.15 };
  }

  // Le thème clair mange le contraste : ce qui est juste sur fond sombre
  // devient imperceptible sur fond presque blanc. Tout ce qui se dessine
  // y gagne donc en opacité et en épaisseur — compensé, pas dupliqué.
  if (cle === "clair") { a.alpha *= 1.8; a.alphaNuage *= 1.5; a.epaisseur = 0.3; }
  else a.epaisseur = 0;
  // Le ventre des nuages : la teinte qui ombre leur base et leur donne du
  // volume. Sombre sur fond sombre, elle éteint le bas des lobes ; plus
  // soutenue sur fond clair, elle les assoit.
  a.teinteNuageBas = cle === "sombre" ? "14,20,12" : "96,106,92";
  a.alphaNuageBas = a.alphaNuage * (cle === "sombre" ? 1.2 : 1.0);

  // Le vent incline et allonge, pour tous les genres, dans la limite du
  // calme : au maximum, les lignes vont un tiers plus vite.
  a.biaisX += vent * 0.8;
  a.vitesse *= 1 + vent * 0.35;
  a.trainee = Math.min(85, Math.round(a.trainee * (1 + vent * 0.4)));
  return a;
}

// Recalcule l'ambiance : à l'arrivée d'une mesure météo, au changement de
// thème. Les particules vivantes finissent leur vie dans l'ancienne
// ambiance et renaissent dans la nouvelle : la transition est un glissement.
function fondAmbiance() {
  FOND.amb = calculerAmbiance();
  // Les nappes existantes survivent au changement d'ambiance, on ajuste
  // seulement leur nombre : le ciel glisse, il ne bascule pas.
  FOND.nuages = FOND.nuages || [];
  while (FOND.nuages.length < FOND.amb.nuages) FOND.nuages.push(graineNuage());
  FOND.nuages.length = FOND.amb.nuages;
  if (FOND.statique && FOND.ctx) {
    FOND.ctx.fillStyle = FOND.amb.fond;
    FOND.ctx.fillRect(0, 0, FOND.L, FOND.H);
    fondStatique();
  }
}

function fondAngle(x, y, t) {
  return (Math.sin(x * 0.0016 + t * 0.0009)
        + Math.cos(y * 0.0021 - t * 0.0007)
        + Math.sin((x + y) * 0.0008 + t * 0.0004)) * Math.PI * 0.75;
}

/* Un nuage n'est pas une tache : c'est une silhouette. Chaque nuage est
   construit à sa naissance — quatre à six lobes bombés dont les bases
   s'alignent, les gros au centre, les petits aux bords, comme un cumulus
   qui s'étale — puis un ventre plat, ombré, qui l'assoit et lui donne son
   volume. Les lobes sont figés une fois tirés : le nuage dérive d'un
   bloc, il ne bouillonne pas, la règle du calme vaut aussi pour lui. */
function graineNuage() {
  const base = 55 + Math.random() * 65;
  const n = 4 + Math.floor(Math.random() * 3);
  const lobes = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const r = base * (0.55 + 0.45 * Math.sin(Math.PI * t)) * (0.85 + Math.random() * 0.3);
    lobes.push({
      dx: (t - 0.5) * base * (2.1 + Math.random() * 0.4),
      dy: base * 0.32 - r,          // les bases s'alignent, le haut bombe
      r: r
    });
  }
  return {
    x: Math.random() * (FOND.L || 1200),
    y: (0.06 + Math.random() * 0.45) * (FOND.H || 700),
    base: base,
    largeur: base * 2.6,
    lobes: lobes,
    v: 0.06 + Math.random() * 0.1,
    k: 0.75 + Math.random() * 0.5   // pondère l'opacité, nuage par nuage
  };
}

function peindreNuages(ctx) {
  const amb = FOND.amb;
  for (const n of FOND.nuages) {
    n.x += n.v * (1 + amb.biaisX);
    if (n.x - n.largeur > FOND.L) n.x = -n.largeur;

    // Les lobes, chacun un dégradé doux : le bord reste vaporeux, la
    // silhouette d'ensemble, elle, se lit.
    for (const l of n.lobes) {
      const cx = n.x + l.dx, cy = n.y + l.dy;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, l.r);
      g.addColorStop(0, "rgba(" + amb.teinteNuage + "," + (amb.alphaNuage * n.k) + ")");
      g.addColorStop(0.65, "rgba(" + amb.teinteNuage + "," + (amb.alphaNuage * n.k * 0.55) + ")");
      g.addColorStop(1, "rgba(" + amb.teinteNuage + ",0)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - l.r, cy - l.r, l.r * 2, l.r * 2);
    }

    // Le ventre : une ombre plate et large sous les lobes. C'est elle qui
    // transforme un amas de ronds en nuage — la lumière vient d'en haut.
    const by = n.y + n.base * 0.3;
    ctx.save();
    ctx.translate(n.x, by);
    ctx.scale(1.25, 0.42);
    const o = ctx.createRadialGradient(0, 0, 0, 0, 0, n.base * 1.15);
    o.addColorStop(0, "rgba(" + amb.teinteNuageBas + "," + (amb.alphaNuageBas * n.k) + ")");
    o.addColorStop(1, "rgba(" + amb.teinteNuageBas + ",0)");
    ctx.fillStyle = o;
    ctx.fillRect(-n.base * 1.15, -n.base * 1.15, n.base * 2.3, n.base * 2.3);
    ctx.restore();
  }
}

// Le halo du soleil : un seul dégradé, fixe, en haut de page. Il ne bouge
// pas et ne respire pas — un halo qui pulse cesse d'être apaisant.
function peindreHalo(ctx) {
  const sombre = document.documentElement.dataset.theme !== "light";
  const teinte = sombre ? "222,202,116" : "214,192,96";
  const alpha = sombre ? 0.08 : 0.12;
  const cx = FOND.L * 0.72, cy = FOND.H * 0.12, r = Math.max(FOND.L, FOND.H) * 0.42;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, "rgba(" + teinte + "," + alpha + ")");
  g.addColorStop(1, "rgba(" + teinte + ",0)");
  ctx.fillStyle = g;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
}

function fondGraine(p, L, H) {
  const amb = FOND.amb;
  p.x = Math.random() * L;
  p.y = Math.random() * H;
  p.vie = 120 + Math.random() * 260;

  const r = Math.random();
  p.genre = r < amb.genres.flocon ? "flocon"
    : r < amb.genres.flocon + amb.genres.goutte ? "goutte" : "ligne";

  if (p.genre === "flocon") {
    // Un flocon descend lentement en oscillant. Il naît souvent en haut.
    p.y = Math.random() < 0.5 ? Math.random() * H : -Math.random() * 40;
    p.vy = (0.22 + Math.random() * 0.3) * amb.vitesse;
    p.ph = Math.random() * Math.PI * 2;
    p.sw = 0.3 + Math.random() * 0.7;
    p.r = 0.8 + Math.random() * 1.5;
    p.a = 0.16 + Math.random() * 0.18;
  } else if (p.genre === "goutte") {
    // Une strie de bruine, oblique, presque verticale, inclinée par le
    // vent. Lente : c'est du crachin apaisé, pas une averse.
    p.y = Math.random() < 0.5 ? Math.random() * H : -Math.random() * 60;
    p.dir = Math.PI * 0.56 + amb.biaisX * 0.22 + (Math.random() - 0.5) * 0.05;
    p.v = (0.9 + Math.random() * 0.6) * amb.vitesse;
    p.a = (0.08 + Math.random() * 0.07) * amb.alpha;
    p.e = 0.5 + Math.random() * 0.5 + (amb.epaisseur || 0);
    p.pts = [[p.x, p.y]];
    p.long = 10 + Math.round(Math.random() * 8);
  } else {
    p.v = (0.55 + Math.random() * 0.85) * amb.vitesse;
    // Le vert clair reste rare : équiprobable, l'ensemble vire à la paille.
    const q = Math.random();
    p.c = q < 0.14 ? 2 : (q < 0.6 ? 0 : 1);
    p.a = (0.1 + Math.random() * 0.1) * amb.alpha;
    p.e = 0.6 + Math.random() * 0.7 + (amb.epaisseur || 0);
    p.pts = [[p.x, p.y]];
  }
  return p;
}

// Trace une portion de traînée d'un seul trait. Deux passes par particule,
// la vieille moitié plus pâle : la traînée s'éteint vers sa queue sans payer
// un trait par segment.
function fondTracer(ctx, pts, de, jusque, couleur, a, e) {
  if (jusque - de < 1) return;
  ctx.strokeStyle = "rgba(" + couleur + "," + a + ")";
  ctx.lineWidth = e;
  ctx.beginPath();
  ctx.moveTo(pts[de][0], pts[de][1]);
  for (let i = de + 1; i <= jusque; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}

function fondPas() {
  const { ctx, parts, L, H } = FOND;
  const amb = FOND.amb;
  FOND.t += 0.5;
  ctx.fillStyle = amb.fond;
  ctx.fillRect(0, 0, L, H);   // effacement complet : rien ne survit au délai
  if (amb.halo) peindreHalo(ctx);
  if (FOND.nuages && FOND.nuages.length) peindreNuages(ctx);

  for (const p of parts) {
    if (p.genre === "flocon") {
      p.ph += 0.012;
      p.x += Math.sin(p.ph) * p.sw + amb.biaisX * 0.5;
      p.y += p.vy;
      ctx.fillStyle = "rgba(" + amb.precip + "," + p.a + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.genre === "goutte") {
      p.x += Math.cos(p.dir) * p.v;
      p.y += Math.sin(p.dir) * p.v;
      p.pts.push([p.x, p.y]);
      if (p.pts.length > p.long) p.pts.shift();
      fondTracer(ctx, p.pts, 0, p.pts.length - 1, amb.precip, p.a, p.e);
    } else {
      const a = fondAngle(p.x, p.y, FOND.t) * amb.turbulence;
      p.x += Math.cos(a) * p.v + amb.biaisX;
      p.y += Math.sin(a) * p.v * 0.72 + amb.biaisY;
      p.pts.push([p.x, p.y]);
      if (p.pts.length > amb.trainee) p.pts.shift();
      const mi = Math.floor(p.pts.length / 2);
      fondTracer(ctx, p.pts, 0, mi, amb.traits[p.c], p.a * 0.35, p.e);
      fondTracer(ctx, p.pts, mi, p.pts.length - 1, amb.traits[p.c], p.a, p.e);
    }
    p.vie--;
    if (p.vie < 0 || p.x < -12 || p.y < -70 || p.x > L + 12 || p.y > H + 12) {
      fondGraine(p, L, H);
    }
  }

  // Le nombre de particules suit l'ambiance en douceur : une de plus ou de
  // moins par image, jamais un peloton d'un coup.
  if (parts.length < amb.nb) parts.push(fondGraine({}, L, H));
  else if (parts.length > amb.nb) parts.pop();

  FOND.anime = requestAnimationFrame(fondPas);
}

function fondTheme() {
  // Au changement de thème, l'ambiance change de palette : recalcul, et la
  // version immobile se redessine tout de suite.
  if (!FOND.ctx) return;
  fondAmbiance();
  FOND.ctx.fillStyle = FOND.amb.fond;
  FOND.ctx.fillRect(0, 0, FOND.L, FOND.H);
}

// La version immobile : la même ambiance, dessinée une fois. Le poste a
// demandé moins d'animations, pas moins de dessin — la pluie y est des
// stries figées, la neige des flocons posés.
function fondStatique() {
  const { ctx, L, H } = FOND;
  const amb = FOND.amb;
  if (amb.halo) peindreHalo(ctx);
  if (FOND.nuages && FOND.nuages.length) peindreNuages(ctx);
  for (let i = 0; i < 60; i++) {
    const p = fondGraine({}, L, H);
    if (p.genre === "flocon") {
      ctx.fillStyle = "rgba(" + amb.precip + "," + p.a + ")";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    } else if (p.genre === "goutte") {
      ctx.strokeStyle = "rgba(" + amb.precip + "," + p.a + ")";
      ctx.lineWidth = p.e;
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(p.dir) * 14, p.y + Math.sin(p.dir) * 14);
      ctx.stroke();
    } else {
      ctx.strokeStyle = "rgba(" + amb.traits[p.c] + "," + (p.a * 0.5) + ")";
      ctx.lineWidth = p.e;
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      for (let k = 0; k < 160; k++) {
        const a = fondAngle(p.x, p.y, 0) * amb.turbulence;
        p.x += Math.cos(a) * 1.4; p.y += Math.sin(a) * 1.0;
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  }
}

function initFond() {
  const cv = $("fond");
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d", { alpha: false });
  FOND.ctx = ctx;
  FOND.statique = matchMedia("(prefers-reduced-motion: reduce)").matches;
  FOND.amb = calculerAmbiance();
  FOND.nuages = Array.from({ length: FOND.amb.nuages }, graineNuage);

  function taille() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    FOND.L = window.innerWidth; FOND.H = window.innerHeight;
    cv.width = FOND.L * dpr; cv.height = FOND.H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = FOND.amb.fond;
    ctx.fillRect(0, 0, FOND.L, FOND.H);
    if (FOND.statique) fondStatique();
  }
  taille();
  window.addEventListener("resize", taille);

  if (FOND.statique) return;

  FOND.parts = Array.from({ length: FOND.amb.nb }, () => fondGraine({}, FOND.L, FOND.H));
  FOND.anime = requestAnimationFrame(fondPas);

  // Un onglet caché n'a pas besoin de brûler la carte graphique.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { cancelAnimationFrame(FOND.anime); FOND.anime = null; }
    else if (!FOND.anime) FOND.anime = requestAnimationFrame(fondPas);
  });
}

/* ---------------------------------------------------------------------
   MÉTÉO

   Données réelles, Open-Meteo : un service public de données météo, sans
   clé et sans compte, qui autorise l'appel direct depuis un navigateur.
   Les mesures secondaires, pression au dixième d'hectopascal en tête,
   sont là pour la précision qu'elles suggèrent, et ce sont pourtant de
   vraies mesures : le service les fournit à ce pas.

   Le relevé est gardé vingt minutes en localStorage : la météo ne change
   pas entre deux allers-retours au portail, inutile de redemander. Sans
   réseau ou si le service ne répond pas, la tuile n'apparaît pas : rien
   ne clignote, rien ne s'excuse.
   --------------------------------------------------------------------- */
const CLE_METEO = "hub_b27_meteo";
const CLE_LIEU = "hub_b27_lieu";
const FRAICHEUR_METEO = 20 * 60 * 1000;   // ms

// Codes temps de l'OMM, tels qu'Open-Meteo les renvoie.
const TEMPS = [
  [0, 0,  "Ciel dégagé",        "soleil"],
  [1, 2,  "Peu nuageux",        "nuage_soleil"],
  [3, 3,  "Couvert",            "nuage"],
  [45, 48, "Brouillard",        "brouillard"],
  [51, 57, "Bruine",            "pluie"],
  [61, 67, "Pluie",             "pluie"],
  [71, 77, "Neige",             "neige"],
  [80, 82, "Averses",           "pluie"],
  [85, 86, "Averses de neige",  "neige"],
  [95, 99, "Orage",             "orage"]
];

function tempsDe(code) {
  const t = TEMPS.find(([a, b]) => code >= a && code <= b);
  return t ? { libelle: t[2], icone: t[3] } : { libelle: "Temps mêlé", icone: "nuage" };
}

function cardinal(deg) {
  return ["N", "NE", "E", "SE", "S", "SO", "O", "NO"][Math.round(deg / 45) % 8];
}

function reglagesMeteo() {
  const r = (typeof REGLAGES === "object" && REGLAGES.meteo) || null;
  return r && r.actif && isFinite(r.lat) && isFinite(r.lon) ? r : null;
}

// Le lieu : celui du catalogue, ou celui que le visiteur a choisi en
// cliquant sur « ma position ». Le choix reste dans ce navigateur.
function lieuCourant(r) {
  try {
    const l = JSON.parse(localStorage.getItem(CLE_LIEU) || "null");
    if (l && isFinite(l.lat) && isFinite(l.lon)) return l;
  } catch (e) { /* stockage illisible */ }
  return { nom: r.ville || "", lat: r.lat, lon: r.lon };
}

function tirerMeteo(lieu) {
  const url = "https://api.open-meteo.com/v1/forecast"
    + "?latitude=" + encodeURIComponent(lieu.lat)
    + "&longitude=" + encodeURIComponent(lieu.lon)
    + "&current=temperature_2m,apparent_temperature,relative_humidity_2m,"
    + "surface_pressure,pressure_msl,weather_code,wind_speed_10m,"
    + "wind_direction_10m,wind_gusts_10m,cloud_cover,precipitation,uv_index"
    + "&wind_speed_unit=kmh&timezone=auto";
  const options = {};
  if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
    options.signal = AbortSignal.timeout(6000);
  }
  return fetch(url, options)
    .then(rep => rep.ok ? rep.json() : Promise.reject(new Error("HTTP " + rep.status)))
    .then(d => {
      const c = d && d.current;
      if (!c || !isFinite(c.temperature_2m)) throw new Error("réponse sans mesure");
      return c;
    });
}

/* Les mesures que la tuile peut afficher. Chacun compose la sienne : le
   choix est enregistré dans le navigateur, comme le thème, et nulle part
   ailleurs. Le point de rosée n'est pas fourni par le service : il est
   calculé par la formule de Magnus depuis la température et l'humidité —
   c'est la donnée du fluidiste, celle de la condensation. */
const CLE_METEO_CHAMPS = "hub_b27_meteo_champs";
const CHAMPS_DEFAUT = ["ressenti", "vent", "humidite", "pression"];
const CHAMPS_MAX = 6;

function pointDeRosee(t, hr) {
  const a = 17.625, b = 243.04;
  const g = Math.log(hr / 100) + a * t / (b + t);
  return b * g / (a - g);
}

const METRIQUES = {
  ressenti:    { nom: "Ressenti",       val: m => virgule(m.apparent_temperature) + "\u00a0\u00b0C" },
  vent:        { nom: "Vent",           val: m => Math.round(m.wind_speed_10m) + "\u00a0km/h " + cardinal(m.wind_direction_10m) },
  rafales:     { nom: "Rafales",        val: m => Math.round(m.wind_gusts_10m) + "\u00a0km/h" },
  humidite:    { nom: "Humidit\u00e9",      val: m => Math.round(m.relative_humidity_2m) + "\u00a0%" },
  pression:    { nom: "Pression",       val: m => virgule(m.surface_pressure) + "\u00a0hPa" },
  pressionMer: { nom: "Pression mer",   val: m => virgule(m.pressure_msl) + "\u00a0hPa" },
  nebulosite:  { nom: "N\u00e9bulosit\u00e9",    val: m => Math.round(m.cloud_cover) + "\u00a0%" },
  precip:      { nom: "Pr\u00e9cipitations", val: m => virgule(m.precipitation) + "\u00a0mm" },
  rosee:       { nom: "Point de ros\u00e9e", val: m => virgule(pointDeRosee(m.temperature_2m, m.relative_humidity_2m)) + "\u00a0\u00b0C" },
  uv:          { nom: "Indice UV",      val: m => virgule(m.uv_index) }
};

function champsChoisis() {
  try {
    const c = JSON.parse(localStorage.getItem(CLE_METEO_CHAMPS) || "null");
    if (Array.isArray(c)) {
      const valides = c.filter(k => METRIQUES[k]);
      if (valides.length) return valides.slice(0, CHAMPS_MAX);
    }
  } catch (e) { /* choix illisible : les valeurs d'usine */ }
  return CHAMPS_DEFAUT;
}

// La dernière mesure reste sous la main : recomposer la tuile après un
// changement de réglage ne doit pas coûter une requête.
let MESURE_COURANTE = null, LIEU_COURANT = null, QUAND_COURANT = 0;

function html_mesuresTuile(mesure) {
  return champsChoisis().map(k => {
    let v;
    try { v = METRIQUES[k].val(mesure); } catch (e) { v = null; }
    return "<div><dt>" + ech(METRIQUES[k].nom) + "</dt><dd>"
      + (v == null || /NaN|undefined/.test(String(v)) ? "\u2014" : v) + "</dd></div>";
  }).join("");
}

function peindreMeteo(mesure, lieu, quand) {
  const t = tempsDe(mesure.weather_code);
  const heure = new Date(quand);
  const hhmm = String(heure.getHours()).padStart(2, "0") + ":" + String(heure.getMinutes()).padStart(2, "0");
  $("tuileMeteo").innerHTML =
      '<div class="tv-chip" aria-hidden="true">' + ico(t.icone, 18)
    +   "<b>" + Math.round(mesure.temperature_2m) + "°</b></div>"
    + '<div class="tv-plein">'
    + '<div class="tv-tete"><h3>Météo</h3><span class="espace"></span>'
    +   '<button type="button" class="btn-position" id="btnMeteoMaj" title="Actualiser le relevé" aria-label="Actualiser le relevé">'
    +     ico("actualiser", 12) + "</button>"
    +   '<button type="button" class="btn-position" id="btnPosition" title="Utiliser ma position">'
    +     ico("position", 12) + " ma position</button></div>"
    + '<div class="meteo-corps">'
    +   '<span class="meteo-icone">' + ico(t.icone, 46, 1.5) + "</span>"
    +   '<span class="meteo-temp">' + ech(virgule(mesure.temperature_2m)) + "<small>°C</small></span>"
    +   '<span class="meteo-quoi">'
    +     '<span class="meteo-libelle">' + ech(t.libelle) + "</span>"
    +     '<span class="meteo-lieu">' + ech(lieu.nom || "Position choisie") + "</span>"
    +   "</span>"
    + "</div>"
    + '<dl class="meteo-mesures">' + html_mesuresTuile(mesure) + "</dl>"
    + '<p class="meteo-pied"><span>Relevé ' + hhmm + "</span>"
    +   '<a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">données Open-Meteo</a></p>'
    + "</div>";
  MESURE_COURANTE = mesure; LIEU_COURANT = lieu; QUAND_COURANT = quand;
  $("tuileMeteo").hidden = false;
  $("btnPosition").addEventListener("click", demanderPosition);
  // Actualiser force le relevé, sans attendre l'expiration du cache.
  $("btnMeteoMaj").addEventListener("click", () => {
    $("btnMeteoMaj").classList.add("tourne");
    chargerMeteo(true);
  });
}

function chargerMeteo(force) {
  const r = reglagesMeteo();
  if (!r) return;
  const lieu = lieuCourant(r);

  if (!force) {
    try {
      const cache = JSON.parse(localStorage.getItem(CLE_METEO) || "null");
      if (cache && cache.mesure
          && cache.mesure.wind_gusts_10m != null   // relevé d'une version antérieure : à rejeter
          && Date.now() - cache.quand < FRAICHEUR_METEO
          && cache.lat === lieu.lat && cache.lon === lieu.lon) {
        peindreMeteo(cache.mesure, lieu, cache.quand);
        FOND.meteo = { code: cache.mesure.weather_code, vent: cache.mesure.wind_speed_10m };
        fondAmbiance();
        return;
      }
    } catch (e) { /* cache illisible : on redemande */ }
  }

  // Une position enregistrée avant que le géocodage n'existe est restée
  // sans nom : on la nomme à l'occasion.
  if (lieu.nom === "Votre position") nommerLieu(lieu);

  tirerMeteo(lieu).then(mesure => {
    const quand = Date.now();
    try {
      localStorage.setItem(CLE_METEO,
        JSON.stringify({ quand, lat: lieu.lat, lon: lieu.lon, mesure }));
    } catch (e) { /* stockage plein : le relevé vivra le temps de la visite */ }
    peindreMeteo(mesure, lieu, quand);
    FOND.meteo = { code: mesure.weather_code, vent: mesure.wind_speed_10m };
    fondAmbiance();
  }).catch(() => {
    // Sans réseau, derrière un proxy, service en panne : la tuile
    // n'apparaît pas, et le portail n'a pas l'air cassé pour autant.
  }).finally(() => {
    const b = $("btnMeteoMaj");
    if (b) b.classList.remove("tourne");
  });
}

/* La veille. La météo ne se chargeait qu'à l'ouverture de la page : un
   onglet laissé ouvert toute la journée affichait le relevé du matin,
   figé. Le portail est fait pour rester ouvert, donc il veille : toutes
   les dix minutes, et au retour sur l'onglet, chargerMeteo() repasse — le
   cache de vingt minutes fait qu'au plus une requête sur deux part
   réellement, le reste est gratuit. Au passage de minuit, le calendrier
   bascule sur le nouveau jour. Et si la première demande avait échoué,
   réseau coupé au chargement par exemple, la tuile apparaît dès qu'une
   veille aboutit : le portail se répare tout seul. */
const TIC_VEILLE = 10 * 60 * 1000;   // ms

function initVeille() {
  let jour = new Date().getDate();
  function tic() {
    chargerMeteo();
    const d = new Date().getDate();
    if (d !== jour) {
      jour = d;
      calDecalage = 0;   // au réveil un autre jour, on montre le mois courant
      peindreCalendrier();
    }
  }
  setInterval(tic, TIC_VEILLE);
  // Le retour sur l'onglet est le moment qui compte : c'est là qu'un
  // relevé de trois heures se verrait.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tic();
  });
}

// Donne son nom à une position : géocodage inverse par l'API Adresse de
// l'État (api-adresse.data.gouv.fr), sans clé ni compte. « Votre
// position » est un pis-aller, pas un nom de ville. Hors de France ou en
// cas d'échec, le pis-aller reste.
function nommerLieu(lieu) {
  const url = "https://api-adresse.data.gouv.fr/reverse/?lon=" + lieu.lon
    + "&lat=" + lieu.lat + "&limit=1";
  const options = {};
  if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
    options.signal = AbortSignal.timeout(6000);
  }
  return fetch(url, options)
    .then(rep => rep.ok ? rep.json() : Promise.reject(new Error("HTTP " + rep.status)))
    .then(d => {
      const ville = d && d.features && d.features[0] && d.features[0].properties
        && d.features[0].properties.city;
      if (ville) {
        lieu.nom = ville;
        try { localStorage.setItem(CLE_LIEU, JSON.stringify(lieu)); } catch (e) { /* tant pis */ }
        const el = document.querySelector(".meteo-lieu");
        if (el) el.textContent = ville;
      }
    })
    .catch(() => { /* le pis-aller reste, et c'est déjà juste */ });
}

function demanderPosition() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(p => {
    const lieu = { nom: "Votre position",
                   lat: Math.round(p.coords.latitude * 1000) / 1000,
                   lon: Math.round(p.coords.longitude * 1000) / 1000 };
    try { localStorage.setItem(CLE_LIEU, JSON.stringify(lieu)); } catch (e) { /* non mémorisé */ }
    chargerMeteo(true);
    nommerLieu(lieu);
  }, () => { /* refusée ou impossible : on reste sur le lieu du catalogue */ },
  { timeout: 8000 });
}

/* ---------------------------------------------------------------------
   MÉTÉO DÉTAILLÉE

   Un clic sur la tuile ouvre le panneau : le moment présent dans le
   détail, les prochaines vingt-quatre heures, la semaine, le soleil,
   la qualité de l'air — et le composeur, qui décide de ce que la tuile
   affiche. Deux requêtes de plus, prévisions et air, toutes deux
   Open-Meteo, sans clé, gardées vingt minutes. La qualité de l'air peut
   manquer sans que le reste en souffre : sa section disparaît, voilà
   tout.
   --------------------------------------------------------------------- */
const CLE_METEO_DETAIL = "hub_b27_meteo_detail";

function tirerPrevisions(lieu) {
  const url = "https://api.open-meteo.com/v1/forecast"
    + "?latitude=" + encodeURIComponent(lieu.lat)
    + "&longitude=" + encodeURIComponent(lieu.lon)
    + "&hourly=temperature_2m,precipitation_probability,weather_code"
    + "&daily=weather_code,temperature_2m_max,temperature_2m_min,"
    + "precipitation_sum,precipitation_probability_max,wind_speed_10m_max,"
    + "wind_gusts_10m_max,sunrise,sunset,daylight_duration,uv_index_max"
    + "&forecast_days=7&wind_speed_unit=kmh&timezone=auto";
  const options = {};
  if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
    options.signal = AbortSignal.timeout(8000);
  }
  return fetch(url, options).then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)));
}

function tirerAir(lieu) {
  const url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    + "?latitude=" + encodeURIComponent(lieu.lat)
    + "&longitude=" + encodeURIComponent(lieu.lon)
    + "&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,"
    + "alder_pollen,birch_pollen,grass_pollen&timezone=auto";
  const options = {};
  if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
    options.signal = AbortSignal.timeout(8000);
  }
  return fetch(url, options).then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)));
}

// L'indice européen de qualité de l'air, par paliers officiels.
function libelleAqi(v) {
  if (v <= 20) return { t: "Bon", c: "#7ab648" };
  if (v <= 40) return { t: "Correct", c: "#a8c24a" };
  if (v <= 60) return { t: "D\u00e9grad\u00e9", c: "#c9a227" };
  if (v <= 80) return { t: "Mauvais", c: "#c4562f" };
  if (v <= 100) return { t: "Tr\u00e8s mauvais", c: "#b0303f" };
  return { t: "Extr\u00eame", c: "#8a2fb0" };
}

function heureCourte(iso) {
  return iso && iso.length >= 16 ? iso.slice(11, 16) : "\u2014";
}

function html_detailMeteo(d) {
  const m = MESURE_COURANTE, prev = d.prev, air = d.air;
  const t = tempsDe(m.weather_code);
  let h = "";

  // ---- le moment présent, toutes mesures dehors
  h += '<div class="md-actuel">'
    + '<span class="meteo-icone">' + ico(t.icone, 44, 1.5) + "</span>"
    + '<span class="md-temp">' + ech(virgule(m.temperature_2m)) + "<small>\u00b0C</small></span>"
    + '<span class="md-quoi"><span class="md-libelle">' + ech(t.libelle) + "</span>"
    + '<span class="md-sous">' + ech(LIEU_COURANT.nom || "Position choisie")
    + " \u00b7 relev\u00e9 " + heureCourte(new Date(QUAND_COURANT - new Date().getTimezoneOffset() * 60000).toISOString()) + "</span></span>"
    + "</div>"
    + '<dl class="md-grille">'
    + Object.keys(METRIQUES).map(k => {
        let v; try { v = METRIQUES[k].val(m); } catch (e) { v = null; }
        return "<div><dt>" + ech(METRIQUES[k].nom) + "</dt><dd>"
          + (v == null || /NaN|undefined/.test(String(v)) ? "\u2014" : v) + "</dd></div>";
      }).join("")
    + "</dl>";

  // ---- les prochaines vingt-quatre heures, de trois en trois
  if (prev && prev.hourly && prev.hourly.time) {
    const H = prev.hourly;
    const maintenant = new Date();
    let i0 = H.time.findIndex(x => new Date(x) >= maintenant);
    if (i0 < 0) i0 = 0;
    let hh = "";
    for (let i = i0; i < Math.min(i0 + 24, H.time.length); i += 3) {
      const w = tempsDe(H.weather_code[i]);
      hh += '<div class="md-heure"><span class="quand">' + heureCourte(H.time[i]) + "</span>"
        + ico(w.icone, 17)
        + "<b>" + Math.round(H.temperature_2m[i]) + "\u00b0</b>"
        + '<span class="pluie">' + (H.precipitation_probability ? Math.round(H.precipitation_probability[i]) + "\u00a0%" : "") + "</span></div>";
    }
    h += '<div class="stats-groupe"><h3 data-ico="horloge" data-ico-taille="13">Prochaines 24 heures</h3>'
      + '<div class="md-heures">' + hh + "</div></div>";
  }

  // ---- la semaine
  if (prev && prev.daily && prev.daily.time) {
    const D = prev.daily;
    const noms = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
    h += '<div class="stats-groupe"><h3 data-ico="calendrier" data-ico-taille="13">La semaine</h3><div class="md-jours">'
      + D.time.map((jour, i) => {
          const w = tempsDe(D.weather_code[i]);
          const dj = new Date(jour + "T12:00");
          return '<div class="md-jour">'
            + '<span class="quand">' + (i === 0 ? "auj." : noms[dj.getDay()] + " " + dj.getDate()) + "</span>"
            + ico(w.icone, 17)
            + '<span class="temps">' + ech(w.libelle) + "</span>"
            + '<span class="pluie">' + virgule(D.precipitation_sum[i]) + "\u00a0mm \u00b7 "
            + Math.round(D.precipitation_probability_max[i]) + "\u00a0% \u00b7 vent "
            + Math.round(D.wind_speed_10m_max[i]) + "</span>"
            + "<b>" + Math.round(D.temperature_2m_max[i]) + "\u00b0<small> / "
            + Math.round(D.temperature_2m_min[i]) + "\u00b0</small></b>"
            + "</div>";
        }).join("")
      + "</div></div>";

    // ---- le soleil du jour
    const dj = prev.daily;
    const duree = Math.round(dj.daylight_duration[0] / 60);
    h += '<div class="stats-groupe"><h3 data-ico="soleil" data-ico-taille="13">Le soleil</h3>'
      + '<dl class="md-grille">'
      + "<div><dt>Lever</dt><dd>" + heureCourte(dj.sunrise[0]) + "</dd></div>"
      + "<div><dt>Coucher</dt><dd>" + heureCourte(dj.sunset[0]) + "</dd></div>"
      + "<div><dt>Jour</dt><dd>" + Math.floor(duree / 60) + "\u00a0h\u00a0" + String(duree % 60).padStart(2, "0") + "</dd></div>"
      + "<div><dt>UV max</dt><dd>" + virgule(dj.uv_index_max[0]) + "</dd></div>"
      + "</dl></div>";
  }

  // ---- la qualité de l'air, si le service a répondu
  if (air && air.current && isFinite(air.current.european_aqi)) {
    const c = air.current;
    const q = libelleAqi(c.european_aqi);
    const pollen = [["Aulne", c.alder_pollen], ["Bouleau", c.birch_pollen], ["Gramin\u00e9es", c.grass_pollen]]
      .filter(x => isFinite(x[1]) && x[1] > 0);
    h += '<div class="stats-groupe"><h3 data-ico="feuille" data-ico-taille="13">Qualit\u00e9 de l\u2019air'
      + ' <span class="aqi" style="--c:' + q.c + '"><i></i>' + ech(q.t) + " \u00b7 " + Math.round(c.european_aqi) + "</span></h3>"
      + '<dl class="md-grille">'
      + "<div><dt>PM2,5</dt><dd>" + virgule(c.pm2_5) + "\u00a0\u00b5g/m\u00b3</dd></div>"
      + "<div><dt>PM10</dt><dd>" + virgule(c.pm10) + "\u00a0\u00b5g/m\u00b3</dd></div>"
      + "<div><dt>NO\u2082</dt><dd>" + virgule(c.nitrogen_dioxide) + "\u00a0\u00b5g/m\u00b3</dd></div>"
      + "<div><dt>O\u2083</dt><dd>" + virgule(c.ozone) + "\u00a0\u00b5g/m\u00b3</dd></div>"
      + pollen.map(x => "<div><dt>Pollen " + x[0].toLowerCase() + "</dt><dd>" + Math.round(x[1]) + "\u00a0gr/m\u00b3</dd></div>").join("")
      + "</dl></div>";
  }

  // ---- le composeur de tuile
  const choisis = champsChoisis();
  h += '<div class="stats-groupe"><h3 data-ico="engrenage" data-ico-taille="13">Composer la tuile</h3>'
    + '<p class="note">Les mesures cochées sont celles que la tuile du portail affiche, jusqu\u2019\u00e0 '
    + CHAMPS_MAX + ". Ce choix reste dans ce navigateur.</p>"
    + '<div class="md-composer">'
    + Object.keys(METRIQUES).map(k =>
        '<label><input type="checkbox" data-champ="' + k + '"'
        + (choisis.indexOf(k) !== -1 ? " checked" : "") + "><span>"
        + ech(METRIQUES[k].nom) + "</span></label>").join("")
    + "</div></div>";

  h += '<p class="md-note"><span>Mod\u00e8le best_match \u00b7 point \u00e0 '
    + (prev && isFinite(prev.elevation) ? Math.round(prev.elevation) + "\u00a0m d\u2019altitude" : "altitude inconnue")
    + "</span><a href=\"https://open-meteo.com/\" target=\"_blank\" rel=\"noopener noreferrer\">donn\u00e9es Open-Meteo</a></p>";
  return h;
}

function peindreDetailMeteo(d) {
  const corps = $("meteoDetail");
  corps.innerHTML = html_detailMeteo(d);
  poserIcones(corps);
  // Le composeur agit tout de suite : cocher recompose la tuile derrière
  // le panneau, sans requête, la mesure courante étant déjà là.
  corps.querySelectorAll("[data-champ]").forEach(c => {
    c.addEventListener("change", () => {
      let actifs = [...corps.querySelectorAll("[data-champ]:checked")].map(x => x.dataset.champ);
      if (actifs.length > CHAMPS_MAX) { c.checked = false; return; }
      if (!actifs.length) { c.checked = true; return; }   // une mesure au moins
      // L'ordre affiché est celui du registre, pas celui des clics : stable.
      actifs = Object.keys(METRIQUES).filter(k => actifs.indexOf(k) !== -1);
      try { localStorage.setItem(CLE_METEO_CHAMPS, JSON.stringify(actifs)); } catch (e) { /* tant pis */ }
      if (MESURE_COURANTE) peindreMeteo(MESURE_COURANTE, LIEU_COURANT, QUAND_COURANT);
    });
  });
}

function ouvrirDetailMeteo() {
  if (!MESURE_COURANTE) return;
  const dlg = $("dlgMeteo");
  $("dlgMeteoTitre").innerHTML = ico("nuage", 15) + " M\u00e9t\u00e9o \u00e0 " + ech(LIEU_COURANT.nom || "votre position");
  dlg.showModal();

  const lieu = LIEU_COURANT;
  try {
    const cache = JSON.parse(localStorage.getItem(CLE_METEO_DETAIL) || "null");
    if (cache && Date.now() - cache.quand < FRAICHEUR_METEO
        && cache.lat === lieu.lat && cache.lon === lieu.lon) {
      peindreDetailMeteo(cache);
      return;
    }
  } catch (e) { /* cache illisible : on redemande */ }

  $("meteoDetail").innerHTML = '<p class="note">Interrogation du mod\u00e8le\u2026</p>';
  // L'air peut échouer seul : sa promesse est amortie, le panneau s'ouvre
  // avec ce qui a répondu.
  Promise.all([tirerPrevisions(lieu), tirerAir(lieu).catch(() => null)])
    .then(([prev, air]) => {
      const d = { quand: Date.now(), lat: lieu.lat, lon: lieu.lon, prev, air };
      try { localStorage.setItem(CLE_METEO_DETAIL, JSON.stringify(d)); } catch (e) { /* trop gros ou refusé */ }
      peindreDetailMeteo(d);
    })
    .catch(() => {
      $("meteoDetail").innerHTML = '<p class="note">Les pr\u00e9visions ne r\u00e9pondent pas. '
        + "R\u00e9seau coup\u00e9 ou service indisponible : r\u00e9essayez plus tard.</p>";
    });
}

function initDetailMeteo() {
  const dlg = $("dlgMeteo");
  $("btnMeteoFermer").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", ev => {
    const r = dlg.getBoundingClientRect();
    const dedans = ev.clientX >= r.left && ev.clientX <= r.right
      && ev.clientY >= r.top && ev.clientY <= r.bottom;
    if (!dedans) dlg.close();
  });
  // Le clic sur la tuile ouvre le panneau, sauf sur ses boutons et liens,
  // et sauf en pastille repliée, où le clic ramène en haut de page.
  $("tuileMeteo").addEventListener("click", ev => {
    if (ev.target.closest("button, a")) return;
    if (document.body.classList.contains("defile")) return;
    ouvrirDetailMeteo();
  });
  $("tuileMeteo").setAttribute("title", "D\u00e9tails et r\u00e9glages");
}

/* ---------------------------------------------------------------------
   CALENDRIER

   Les semaines ISO sur l'axe vertical, les jours en tête, les week-ends
   teintés : c'est la monnaie du bureau d'études, où tout se planifie en
   numéro de semaine. Entièrement calculé en local.
   --------------------------------------------------------------------- */
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin",
              "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

let calDecalage = 0;   // mois affichés en avant ou en arrière d'aujourd'hui

// Numéro de semaine ISO 8601 : la semaine 1 est celle qui contient le
// premier jeudi de l'année. Calculé en UTC pour ignorer l'heure d'été.
function semaineISO(d) {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const jour = x.getUTCDay() || 7;
  x.setUTCDate(x.getUTCDate() + 4 - jour);
  const debut = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
  return Math.ceil(((x - debut) / 86400000 + 1) / 7);
}

function peindreCalendrier() {
  const auj = new Date();
  const vue = new Date(auj.getFullYear(), auj.getMonth() + calDecalage, 1);

  // Premier lundi de la grille : le lundi de la semaine du 1er du mois.
  const premier = new Date(vue);
  premier.setDate(1 - ((vue.getDay() + 6) % 7));

  const semaineAuj = semaineISO(auj);

  let h = '<div class="tv-chip" aria-hidden="true"><span class="tv-chip-s">S</span><b>'
    + semaineISO(auj) + "</b></div>"
    + '<div class="tv-plein">'
    + '<div class="tv-tete"><h3>Calendrier</h3><span class="espace"></span>'
    + '<span class="cal-semaine">Semaine ' + semaineISO(auj) + "</span>"
    + '<span class="cal-nav">'
    +   '<button type="button" id="calPrec" aria-label="Mois précédent">' + ico("chevron_g", 13) + "</button>"
    +   '<button type="button" id="calSuiv" aria-label="Mois suivant">' + ico("chevron_d", 13) + "</button>"
    + "</span></div>"
    + '<div class="cal-mois">' + MOIS[vue.getMonth()] + " " + vue.getFullYear() + "</div>"
    + '<div class="cal-grille" role="grid" aria-label="Calendrier du mois">';

  h += '<span class="cal-ent" title="Semaine">S</span>';
  ["L", "M", "M", "J", "V", "S", "D"].forEach((j, i) =>
    h += '<span class="cal-ent' + (i >= 5 ? " cal-we" : "") + '">' + j + "</span>");

  const d = new Date(premier);
  for (let sem = 0; sem < 6; sem++) {
    // Un mois tient sur 4 à 6 lignes de semaine : on s'arrête dès que la
    // ligne entière appartient au mois suivant.
    if (sem >= 4 && d.getMonth() !== vue.getMonth()) break;
    const num = semaineISO(d);
    const active = calDecalage === 0 && num === semaineAuj;
    h += '<span class="cal-num' + (active ? " sem-act" : "") + '">' + num + "</span>";
    for (let j = 0; j < 7; j++) {
      const duMois = d.getMonth() === vue.getMonth();
      const estAuj = d.getFullYear() === auj.getFullYear()
        && d.getMonth() === auj.getMonth() && d.getDate() === auj.getDate();
      const cls = ["cal-jour"];
      if (j >= 5) cls.push("cal-we");
      if (!duMois) cls.push("cal-hors");
      if (active) cls.push("cal-lig-act");
      if (estAuj) cls.push("cal-auj");
      h += '<span class="' + cls.join(" ") + '">' + d.getDate() + "</span>";
      d.setDate(d.getDate() + 1);
    }
  }
  h += "</div></div>";

  $("tuileCalendrier").innerHTML = h;
  $("calPrec").addEventListener("click", () => { calDecalage--; peindreCalendrier(); });
  $("calSuiv").addEventListener("click", () => { calDecalage++; peindreCalendrier(); });
}

/* ---------------------------------------------------------------------
   LES RAYONS

   Deux rayons et une fiche : nos outils, les ressources, le contact.
   Tout vient de catalogue.js. Le tableau s'y appelle PORTES pour des
   raisons historiques ; à l'écran, on parle d'outils et de ressources.
   --------------------------------------------------------------------- */
function estOutil(o) { return (o.type || "outil") === "outil"; }

function clesRecherche(o) {
  const cat = categorie(o.categorie);
  const sous = o.sousCategorie ? sousCategorie(o.sousCategorie) : null;
  return normaliser([o.nom, o.pitch, (o.tags || []).join(" "),
                     cat && cat.nom, sous && sous.nom].filter(Boolean).join(" "));
}

function html_badge(o) {
  const s = STATUTS[o.statut];
  if (!s || !s.pastille) return "";
  return '<span class="badge' + (o.statut === "beta" ? " beta" : "") + '">' + ech(s.libelle) + "</span>";
}

function html_outil(o, index) {
  const s = STATUTS[o.statut] || STATUTS["a-venir"];
  const cat = categorie(o.categorie);
  const c = couleurSure(cat && cat.couleur);
  const cliquable = s.cliquable && o.url;
  const dedans =
      '<div class="carte-tete">'
    +   '<span class="carte-puce" style="--c:' + c + '">' + ico(o.icone || "grille", 21) + "</span>"
    +   '<span class="carte-sortie">' + ico("sortie", 15) + "</span>"
    + "</div>"
    + '<span class="carte-nom">' + ech(o.nom) + "</span>"
    + '<p class="carte-pitch">' + ech(o.pitch) + "</p>"
    + html_badge(o);
  const attrs = ' class="carte apparait' + (cliquable ? "" : " attente") + '"'
    + ' style="--c:' + c + ';--i:' + index + '" data-cherche="' + ech(clesRecherche(o)) + '"';
  return cliquable
    ? "<a" + attrs + ' href="' + ech(o.url) + '" target="_blank" rel="noopener noreferrer">' + dedans + "</a>"
    : "<div" + attrs + ">" + dedans + "</div>";
}

function html_ressource(o, index) {
  const cat = categorie(o.categorie);
  const c = couleurSure(cat && cat.couleur);
  return '<a class="rang apparait" style="--c:' + c + ';--i:' + index + '"'
    + ' data-cherche="' + ech(clesRecherche(o)) + '"'
    + ' href="' + ech(o.url) + '" target="_blank" rel="noopener noreferrer">'
    +   '<span class="rang-puce">' + ico(o.icone || "livre", 17) + "</span>"
    +   '<span class="rang-texte">'
    +     '<span class="rang-nom">' + ech(o.nom) + "</span>"
    +     '<span class="rang-pitch">' + ech(o.pitch) + "</span>"
    +   "</span>"
    +   '<span class="rang-sortie">' + ico("sortie", 15) + "</span>"
    + "</a>";
}

function construireRayons() {
  const outils = PORTES.filter(estOutil);
  const liens = PORTES.filter(o => !estOutil(o));

  if (outils.length) {
    $("grilleOutils").innerHTML = outils.map(html_outil).join("");
    $("rayonOutils").hidden = false;
  }

  // Les ressources se groupent par sous-catégorie, dans l'ordre où elles
  // sont déclarées ; ce qui n'en a pas se groupe par catégorie.
  if (liens.length) {
    const groupes = [];
    const toutesSous = typeof SOUS_CATEGORIES === "undefined" ? [] : SOUS_CATEGORIES;
    toutesSous.forEach(s => {
      const dedans = liens.filter(o => o.sousCategorie === s.cle);
      if (dedans.length) groupes.push({ nom: s.nom, portes: dedans });
    });
    CATEGORIES.forEach(cat => {
      const dedans = liens.filter(o => o.categorie === cat.cle && !o.sousCategorie);
      if (dedans.length) groupes.push({ nom: cat.nom, portes: dedans });
    });
    let i = 0;
    $("groupesRessources").innerHTML = groupes.map(g =>
        '<div class="groupe">'
      +   "<h3>" + ech(g.nom) + "</h3>"
      +   '<div class="rangs">' + g.portes.map(o => html_ressource(o, i++)).join("") + "</div>"
      + "</div>").join("");
    $("rayonRessources").hidden = false;
  }

  if (contacts().length) {
    $("grilleContact").innerHTML = contacts().map((c, i) =>
        '<div class="fiche apparait" style="--i:' + i + '" data-cherche="'
      +   ech(normaliser([c.nom, c.role, c.mail].filter(Boolean).join(" "))) + '">'
      +   '<span class="fiche-puce">' + ico("personne", 20) + "</span>"
      +   '<span class="fiche-texte">'
      +     '<span class="fiche-nom">' + ech(c.nom) + "</span>"
      +     (c.role ? '<span class="fiche-role">' + ech(c.role) + "</span>" : "")
      +     (c.mail ? '<a class="fiche-mail" href="mailto:' + ech(c.mail) + '">' + ech(c.mail) + "</a>" : "")
      +   "</span>"
      + "</div>").join("");
    $("rayonContact").hidden = false;
  }

  const morceaux = [];
  if (outils.length) morceaux.push(outils.length + " outil" + (outils.length > 1 ? "s" : ""));
  if (liens.length) morceaux.push(liens.length + " ressource" + (liens.length > 1 ? "s" : ""));
  if (contacts().length) morceaux.push(contacts().length + " contact" + (contacts().length > 1 ? "s" : ""));
  $("compte").textContent = morceaux.join("  ·  ");

  $("devise").textContent = REGLAGES.accroche || "";
  $("devise").hidden = !REGLAGES.accroche;
  document.title = REGLAGES.titre;
  $("titrePortail").textContent = REGLAGES.titre;
  $("embleme").innerHTML = logoB27(58);
}

/* ---------------------------------------------------------------------
   RECHERCHE

   Un seul champ, qui filtre tout en direct : cartes, rangées, fiches.
   Pendant une recherche, les tuiles vivantes s'effacent : on est venu
   chercher quelque chose, la météo attendra.
   --------------------------------------------------------------------- */
function filtrer(brut) {
  const q = normaliser(brut.trim());
  let visibles = 0;

  document.querySelectorAll("[data-cherche]").forEach(el => {
    const garde = !q || el.dataset.cherche.indexOf(q) !== -1;
    el.hidden = !garde;
    if (garde) visibles++;
  });

  // Un groupe de ressources dont toutes les rangées sont cachées disparaît,
  // sinon il resterait des titres orphelins.
  document.querySelectorAll(".groupe").forEach(g => {
    g.hidden = !g.querySelector("[data-cherche]:not([hidden])");
  });
  [["rayonOutils", "grilleOutils"], ["rayonRessources", "groupesRessources"],
   ["rayonContact", "grilleContact"]].forEach(([rayon, dedans]) => {
    const vide = !$(dedans).querySelector("[data-cherche]:not([hidden])");
    $(rayon).hidden = vide || !$(dedans).innerHTML;
  });

  $("tuilesVives").hidden = !!q;
  $("rienTrouve").hidden = !(q && visibles === 0);
  if (q && visibles === 0) {
    $("rienTrouve").textContent = "Aucun résultat pour « " + brut.trim() + " ».";
  }
}

function initRecherche() {
  if (PORTES.length + contacts().length < (REGLAGES.seuilFiltres || 0)) return;
  const champ = $("champRecherche");
  $("quete").hidden = false;
  champ.addEventListener("input", () => filtrer(champ.value));

  // La touche / amène au champ depuis n'importe où, Échap le vide : les
  // conventions d'un outil qu'on utilise au clavier.
  document.addEventListener("keydown", ev => {
    if (ev.key === "/" && document.activeElement !== champ
        && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      ev.preventDefault();
      champ.focus();
    }
    if (ev.key === "Escape" && document.activeElement === champ && champ.value) {
      champ.value = "";
      filtrer("");
    }
  });
}

/* ---------------------------------------------------------------------
   LE REFLET DES CARTES

   Chaque carte reçoit la position de la souris en variables CSS ; le
   dégradé radial de ::after s'y accroche. Un seul écouteur délégué pour
   toute la page.
   --------------------------------------------------------------------- */
function initReflets() {
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  document.addEventListener("pointermove", ev => {
    const carte = ev.target.closest && ev.target.closest(".carte");
    if (!carte) return;
    const r = carte.getBoundingClientRect();
    carte.style.setProperty("--mx", Math.round(ev.clientX - r.left) + "px");
    carte.style.setProperty("--my", Math.round(ev.clientY - r.top) + "px");
  }, { passive: true });
}

/* ---------------------------------------------------------------------
   L'ANCRE

   Au défilement, l'entrée du portail ne disparaît pas : elle se transforme.
   Le logo et le titre viennent se poser dans une pilule fixe en haut au
   centre, l'emblème du héros s'efface en s'éloignant, et les tuiles
   vivantes, ancrées, se replient en pastilles — la température d'un côté,
   le numéro de semaine de l'autre. Cliquer sur la pilule ou une pastille
   ramène en haut.

   Tout est en glissement : une classe sur body, des transitions CSS, et un
   effacement progressif calé sur la position de défilement. Rien ne
   clignote, rien ne saute — la règle du calme s'applique ici aussi.
   --------------------------------------------------------------------- */
const SEUIL_ANCRE = 260;   // px de défilement avant que la pilule se pose

function initAncre() {
  $("ancreLogo").innerHTML = logoB27(17);
  $("ancreTitre").textContent = REGLAGES.titre;

  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const embleme = $("embleme");
  const titre = $("titrePortail");

  let prevu = false;
  function surDefilement() {
    prevu = false;
    const y = window.scrollY;
    document.body.classList.toggle("defile", y > SEUIL_ANCRE);
    if (reduit) return;
    // L'emblème et le titre s'effacent en reculant, proportionnellement au
    // défilement : ils partent pendant que la pilule arrive, et l'oeil lit
    // une transformation, pas une disparition.
    const p = Math.min(1, y / 300);
    const forme = "translateY(" + Math.round(p * 16) + "px) scale(" + (1 - p * 0.1).toFixed(3) + ")";
    embleme.style.opacity = titre.style.opacity = String(1 - p * 0.9);
    embleme.style.transform = titre.style.transform = forme;
  }
  window.addEventListener("scroll", () => {
    if (!prevu) { prevu = true; requestAnimationFrame(surDefilement); }
  }, { passive: true });
  surDefilement();

  const remonter = () => window.scrollTo({ top: 0, behavior: reduit ? "auto" : "smooth" });
  $("ancre").addEventListener("click", remonter);
  // Une pastille repliée ramène en haut, là où la tuile entière est lisible.
  $("tuilesVives").addEventListener("click", ev => {
    if (document.body.classList.contains("defile") && ev.target.closest(".tuile-vive")) remonter();
  });
}

/* ---------------------------------------------------------------------
   À PROPOS
   --------------------------------------------------------------------- */
function ligneStat(dt, dd) {
  return "<div><dt>" + ech(dt) + "</dt><dd>" + ech(String(dd)) + "</dd></div>";
}

function remplirApropos() {
  const outils = PORTES.filter(estOutil).length;
  const liens = PORTES.length - outils;
  const majs = PORTES.map(o => o.maj).filter(Boolean).sort();
  const anomalies = controlerCatalogue();

  let h = '<div class="stats-groupe"><h3 data-ico="grille" data-ico-taille="13">Le portail</h3>'
    + '<dl class="stats-liste">'
    + ligneStat("Nos outils", outils)
    + ligneStat("Ressources", liens)
    + ligneStat("Contacts", contacts().length)
    + ligneStat("Dernière mise à jour du catalogue", majs.length ? dateFr(majs[majs.length - 1]) : "non renseignée")
    + ligneStat("Thème courant", document.documentElement.dataset.theme === "dark" ? "sombre" : "clair")
    + "</dl></div>";

  if (anomalies.length) {
    h += '<div class="stats-groupe"><h3 data-ico="attention" data-ico-taille="13">Anomalies du catalogue</h3>'
      + '<div class="note">' + anomalies.length + " anomalie(s) détectée(s) dans catalogue.js. "
      + "Le détail est dans la console du navigateur (touche F12).</div></div>";
  }

  h += '<div class="stats-groupe"><h3 data-ico="horloge" data-ico-taille="13">Journal des versions</h3>'
    + '<ul class="changelog">'
    + CHANGELOG.map(c =>
        "<li>"
      +   '<span class="cl-ver">' + ech(c.v) + "</span>"
      +   '<span><span class="cl-titre">' + ech(c.titre) + "</span> "
      +     '<span class="cl-date">' + dateFr(c.date) + "</span></span>"
      +   '<span class="cl-txt">' + ech(c.texte) + "</span>"
      + "</li>").join("")
    + "</ul></div>";

  const corps = $("aproposCorps");
  corps.innerHTML = h;
  poserIcones(corps);
}

/* Panneau ouvert, la molette lui appartient : si elle tourne hors du
   corps du panneau — sur le voile, sur l'en-tête —, c'est quand même le
   panneau qui défile, jamais la page derrière, que le CSS a de toute
   façon verrouillée. */
function initMolettePanneaux() {
  document.addEventListener("wheel", ev => {
    const dlg = document.querySelector(".modale[open]");
    if (!dlg) return;
    const corps = dlg.querySelector(".modale-corps");
    if (!corps || corps.contains(ev.target)) return;
    corps.scrollTop += ev.deltaY;
    ev.preventDefault();
  }, { passive: false });
}

function initApropos() {
  const dlg = $("dlgApropos");
  $("btnApropos").addEventListener("click", () => { remplirApropos(); dlg.showModal(); });
  $("btnAproposFermer").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", ev => {
    const r = dlg.getBoundingClientRect();
    const dedans = ev.clientX >= r.left && ev.clientX <= r.right
      && ev.clientY >= r.top && ev.clientY <= r.bottom;
    if (!dedans) dlg.close();
  });
}

/* ---------------------------------------------------------------------
   DÉPART
   --------------------------------------------------------------------- */
function init() {
  controlerCatalogue();
  construireRayons();
  peindreCalendrier();
  poserIcones();
  initTheme();
  initFond();
  initRecherche();
  initReflets();
  initAncre();
  initApropos();
  initDetailMeteo();
  initMolettePanneaux();
  chargerMeteo();
  initVeille();

  if (typeof Signalement !== "undefined" && typeof SIGNALEMENT !== "undefined" && SIGNALEMENT.actif) {
    Signalement.init(SIGNALEMENT);
  }
}

document.addEventListener("DOMContentLoaded", init);
