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
const FOND = { ctx: null, parts: [], t: 0, anime: null, L: 0, H: 0 };

function fondCouleurs() {
  const sombre = document.documentElement.dataset.theme !== "light";
  return sombre
    ? { fond: "#0a0d08", voile: "rgba(10,13,8,.06)",
        traits: ["rgba(149,192,61,", "rgba(95,127,31,", "rgba(201,232,138,"] }
    : { fond: "#f3f5f0", voile: "rgba(243,245,240,.07)",
        traits: ["rgba(95,127,31,", "rgba(85,122,58,", "rgba(149,192,61,"] };
}

function fondAngle(x, y, t) {
  return (Math.sin(x * 0.0016 + t * 0.0009)
        + Math.cos(y * 0.0021 - t * 0.0007)
        + Math.sin((x + y) * 0.0008 + t * 0.0004)) * Math.PI * 0.75;
}

function fondGraine(p, L, H) {
  p.x = Math.random() * L;
  p.y = Math.random() * H;
  p.vie = 100 + Math.random() * 220;
  p.v = 0.45 + Math.random() * 0.75;
  // Le vert clair reste rare : équiprobable, l'ensemble vire à la paille.
  const r = Math.random();
  p.c = r < 0.14 ? 2 : (r < 0.6 ? 0 : 1);
  p.a = 0.04 + Math.random() * 0.05;
  p.e = 0.6 + Math.random() * 0.7;
  return p;
}

function fondPas() {
  const { ctx, parts, L, H } = FOND;
  FOND.t += 0.5;
  const c = fondCouleurs();
  ctx.fillStyle = c.voile;
  ctx.fillRect(0, 0, L, H);
  for (const p of parts) {
    const a = fondAngle(p.x, p.y, FOND.t);
    const nx = p.x + Math.cos(a) * p.v;
    const ny = p.y + Math.sin(a) * p.v * 0.72;   // aplati : le flux file à l'horizontale
    ctx.strokeStyle = c.traits[p.c] + p.a + ")";
    ctx.lineWidth = p.e;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
    p.x = nx; p.y = ny; p.vie--;
    if (p.vie < 0 || nx < -9 || ny < -9 || nx > L + 9 || ny > H + 9) fondGraine(p, L, H);
  }
  FOND.anime = requestAnimationFrame(fondPas);
}

function fondTheme() {
  // Au changement de thème, tout repartir de zéro : les traînées de
  // l'ancien fond resteraient visibles en négatif sous le nouveau.
  if (!FOND.ctx) return;
  FOND.ctx.fillStyle = fondCouleurs().fond;
  FOND.ctx.fillRect(0, 0, FOND.L, FOND.H);
  if (FOND.statique) fondStatique();
}

// La version immobile : les mêmes lignes de flux, dessinées une fois. Le
// poste a demandé moins d'animations, pas moins de dessin.
function fondStatique() {
  const { ctx, L, H } = FOND;
  const c = fondCouleurs();
  for (let i = 0; i < 60; i++) {
    const p = fondGraine({}, L, H);
    ctx.strokeStyle = c.traits[p.c] + (p.a * 0.9) + ")";
    ctx.lineWidth = p.e;
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
    for (let k = 0; k < 160; k++) {
      const a = fondAngle(p.x, p.y, 0);
      p.x += Math.cos(a) * 1.4; p.y += Math.sin(a) * 1.0;
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
}

function initFond() {
  const cv = $("fond");
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d", { alpha: false });
  FOND.ctx = ctx;
  FOND.statique = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function taille() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    FOND.L = window.innerWidth; FOND.H = window.innerHeight;
    cv.width = FOND.L * dpr; cv.height = FOND.H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = fondCouleurs().fond;
    ctx.fillRect(0, 0, FOND.L, FOND.H);
    if (FOND.statique) fondStatique();
  }
  taille();
  window.addEventListener("resize", taille);

  if (FOND.statique) return;

  FOND.parts = Array.from({ length: 80 }, () => fondGraine({}, FOND.L, FOND.H));
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
    + "surface_pressure,weather_code,wind_speed_10m,wind_direction_10m"
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

function peindreMeteo(mesure, lieu, quand) {
  const t = tempsDe(mesure.weather_code);
  const heure = new Date(quand);
  const hhmm = String(heure.getHours()).padStart(2, "0") + ":" + String(heure.getMinutes()).padStart(2, "0");
  $("tuileMeteo").innerHTML =
      '<div class="tv-tete"><h3>Météo</h3><span class="espace"></span>'
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
    + '<dl class="meteo-mesures">'
    +   "<div><dt>Ressenti</dt><dd>" + ech(virgule(mesure.apparent_temperature)) + "&nbsp;°C</dd></div>"
    +   "<div><dt>Vent</dt><dd>" + Math.round(mesure.wind_speed_10m) + "&nbsp;km/h "
    +     ech(cardinal(mesure.wind_direction_10m)) + "</dd></div>"
    +   "<div><dt>Humidité</dt><dd>" + Math.round(mesure.relative_humidity_2m) + "&nbsp;%</dd></div>"
    +   "<div><dt>Pression</dt><dd>" + ech(virgule(mesure.surface_pressure)) + "&nbsp;hPa</dd></div>"
    + "</dl>"
    + '<p class="meteo-pied"><span>Relevé ' + hhmm + "</span>"
    +   '<a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">données Open-Meteo</a></p>';
  $("tuileMeteo").hidden = false;
  $("btnPosition").addEventListener("click", demanderPosition);
}

function chargerMeteo(force) {
  const r = reglagesMeteo();
  if (!r) return;
  const lieu = lieuCourant(r);

  if (!force) {
    try {
      const cache = JSON.parse(localStorage.getItem(CLE_METEO) || "null");
      if (cache && cache.mesure
          && Date.now() - cache.quand < FRAICHEUR_METEO
          && cache.lat === lieu.lat && cache.lon === lieu.lon) {
        peindreMeteo(cache.mesure, lieu, cache.quand);
        return;
      }
    } catch (e) { /* cache illisible : on redemande */ }
  }

  tirerMeteo(lieu).then(mesure => {
    const quand = Date.now();
    try {
      localStorage.setItem(CLE_METEO,
        JSON.stringify({ quand, lat: lieu.lat, lon: lieu.lon, mesure }));
    } catch (e) { /* stockage plein : le relevé vivra le temps de la visite */ }
    peindreMeteo(mesure, lieu, quand);
  }).catch(() => {
    // Sans réseau, derrière un proxy, service en panne : la tuile
    // n'apparaît pas, et le portail n'a pas l'air cassé pour autant.
  });
}

function demanderPosition() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(p => {
    const lieu = { nom: "Votre position",
                   lat: Math.round(p.coords.latitude * 1000) / 1000,
                   lon: Math.round(p.coords.longitude * 1000) / 1000 };
    try { localStorage.setItem(CLE_LIEU, JSON.stringify(lieu)); } catch (e) { /* non mémorisé */ }
    chargerMeteo(true);
  }, () => { /* refusée ou impossible : on reste sur le lieu du catalogue */ },
  { timeout: 8000 });
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

  let h = '<div class="tv-tete"><h3>Calendrier</h3><span class="espace"></span>'
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
  h += "</div>";

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
  initApropos();
  chargerMeteo();

  if (typeof Signalement !== "undefined" && typeof SIGNALEMENT !== "undefined" && SIGNALEMENT.actif) {
    Signalement.init(SIGNALEMENT);
  }
}

document.addEventListener("DOMContentLoaded", init);
