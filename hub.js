/* =====================================================================
   hub.js : rendu du hall d'entrée à partir de catalogue.js.
   =====================================================================

   Ce fichier n'a pas besoin d'être modifié pour ajouter une porte. Tout ce
   qui varie est dans catalogue.js. Ce qui se trouve ici, ce sont le logo,
   les tracés d'icônes, la mécanique de thème, la navigation par dossiers,
   la recherche et le panneau "À propos".

   Le hall se parcourt comme une armoire : le premier niveau montre des
   dossiers, on en ouvre un, parfois un sous-dossier, et on arrive aux
   portes. La position est portée par l'adresse (#/ressources/technique),
   ce qui rend le bouton Précédent du navigateur fonctionnel et permet
   d'envoyer le lien d'un dossier précis à un collègue.

   Aucune dépendance, aucune requête réseau : le hub s'ouvre aussi bien
   depuis GitHub Pages que par un double-clic sur index.html.
   ===================================================================== */

/* ---------------------------------------------------------------------
   VERSION ET JOURNAL
   --------------------------------------------------------------------- */
const CHANGELOG = [
  { v: "v4", date: "2026-08-29", titre: "Tableau de bord, et ce qui vous appartient",
    texte: "Barre latérale permanente : toutes les catégories à un clic depuis n'importe où. Recherche en haut, quatre cartes chiffrées à l'arrivée, salutation selon l'heure. Surtout : le hall devient personnel sans le moindre compte. Épinglez une porte, elle remonte en tête à chacune de vos visites, et les dernières portes ouvertes s'y ajoutent. Tout vit dans votre navigateur et n'en sort jamais." },
  { v: "v3", date: "2026-08-29", titre: "Navigation par dossiers",
    texte: "Le hall s'ouvre sur des dossiers carrés, une icône au centre et le nom qui se révèle au survol. On ouvre un dossier, parfois un sous-dossier, et on arrive aux portes. Fil d'Ariane, adresse qui suit la position, bouton Précédent du navigateur fonctionnel. La recherche, elle, traverse tous les niveaux d'un coup." },
  { v: "v2", date: "2026-08-29", titre: "Hall d'entrée, logo B27 et signalement",
    texte: "Bandeau d'accueil portant le logo B27 et le compte des portes ouvertes. Le catalogue s'élargit au-delà des outils : site de l'entreprise, B27 Mobility à venir, six ressources métier, et un annuaire de contacts. Une pastille en bas à droite ouvre un formulaire de signalement avec capture d'écran et dictée vocale." },
  { v: "v1", date: "2026-08-29", titre: "Première mise en ligne",
    texte: "Hub d'accueil des outils B27 : cartes cliquables construites à partir du catalogue, thème clair et sombre, panneau À propos. Deux outils référencés, la Calculette ECS et Bouclage et le Dimensionnement émetteurs Finimetal." }
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

   Tracés Lucide inlinés, comme dans les autres outils B27 : aucune requête
   externe. Ajouter une icône, c'est ajouter une ligne ici, puis citer son
   nom dans le champ "icone" d'une porte, d'une catégorie ou d'une
   sous-catégorie.
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
  palette: '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>',
  ordinateur: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  recherche: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sortie: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  soleil: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  lune: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  engrenage: '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
  fermer: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  etiquette: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  courrier: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  telephone: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  personne: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  horloge: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  valider: '<path d="M20 6 9 17l-5-5"/>',
  attention: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  porte: '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5.442 20.1a1 1 0 0 1-.442-.83V5.562a1 1 0 0 1 .58-.908l6-2.769a1 1 0 0 1 1.42.908z"/>',
  maison: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  retour: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  epingle: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  etincelle: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'
};

// L'épaisseur de trait est réglable, et il faut s'en servir dès qu'on agrandit
// une icône. Les tracés Lucide sont dessinés à 2 sur une grille de 24 : à
// 16 px le trait fait 1,3 px à l'écran, mais à 110 px il en ferait 9, et
// l'icône vire au pictogramme épais. Un grand glyphe demande un trait
// proportionnellement plus fin pour garder la même densité apparente.
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
// NFD sépare la lettre de son accent, la plage U+0300 à U+036F retire les
// accents ainsi détachés.
function normaliser(txt) {
  return String(txt || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function dateFr(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return iso || "inconnue";
  const [a, m, j] = iso.split("-");
  return j + "/" + m + "/" + a;
}

const STATUTS = {
  "en-ligne": { libelle: "En ligne",   cliquable: true,  pastille: false },
  "beta":     { libelle: "Bêta",       cliquable: true,  pastille: true  },
  "a-venir":  { libelle: "À venir",    cliquable: false, pastille: true  },
  "bureau":   { libelle: "Bureau",     cliquable: false, pastille: true  },
  "obsolete": { libelle: "Obsolète",   cliquable: false, pastille: true  }
};

const TYPES = { outil: true, lien: true };

// Clé du dossier qui recueille les portes d'une catégorie à sous-dossiers
// qui n'ont pas déclaré de sous-catégorie. Sans lui, elles seraient
// invisibles : rangées dans une catégorie qui n'affiche que des dossiers,
// elles n'apparaîtraient dans aucun d'eux.
const DIVERS = "__divers";
const CLE_ANNUAIRE = "annuaire";

// Teinte du dossier de l'annuaire, et repli de toute catégorie qui n'en
// déclare pas. Un gris chaud, neutre : des personnes ne sont pas un lot, elles
// n'ont donc pas de couleur de lot. Le gris de la structure de B27, #4a4a4a,
// a été écarté après mesure : il ne tenait que 2,12:1 face au fond du thème
// sombre, la tuile s'y confondait avec la page.
const COULEUR_ANNUAIRE = "#6e6a63";
const COULEUR_REPLI = "#779c2b";

// La couleur part du fichier de données et finit dans un attribut style :
// on ne laisse passer qu'une notation hexadécimale, faute de quoi une faute
// de frappe dans catalogue.js pourrait injecter de la déclaration CSS.
function couleurSure(c) {
  return /^#[0-9a-fA-F]{3,8}$/.test(String(c || "")) ? c : COULEUR_REPLI;
}

/* ---------------------------------------------------------------------
   ARBORESCENCE
   --------------------------------------------------------------------- */

function estCliquable(o) {
  const st = STATUTS[o.statut];
  return !!(st && st.cliquable && o.url);
}

function categorie(cle) { return CATEGORIES.find(c => c.cle === cle) || null; }
function sousCategorie(cle) {
  return (typeof SOUS_CATEGORIES === "undefined" ? [] : SOUS_CATEGORIES).find(s => s.cle === cle) || null;
}
function contacts() { return typeof CONTACTS === "undefined" ? [] : CONTACTS; }

function portesDe(cle) { return PORTES.filter(o => o.categorie === cle); }

// Sous-dossiers réellement peuplés d'une catégorie, plus le dossier Divers
// si des portes de cette catégorie n'ont pas de sous-catégorie.
function sousDossiersDe(cle) {
  const dedans = portesDe(cle);
  const toutes = typeof SOUS_CATEGORIES === "undefined" ? [] : SOUS_CATEGORIES;
  // La couleur de la catégorie descend dans ses sous-dossiers, sauf si l'un
  // d'eux en déclare une. C'est ce qui fait qu'en entrant dans Ressources,
  // les trois sous-dossiers restent violets : on voit qu'on est toujours
  // dans la même branche.
  const parente = categorie(cle);
  const teinte = parente ? parente.couleur : null;
  const liste = toutes
    .filter(s => s.categorie === cle)
    .map(s => ({ ...s, couleur: s.couleur || teinte,
                 portes: dedans.filter(o => o.sousCategorie === s.cle) }))
    .filter(s => s.portes.length);
  if (!liste.length) return [];
  const clesConnues = new Set(liste.map(s => s.cle));
  const orphelines = dedans.filter(o => !o.sousCategorie || !clesConnues.has(o.sousCategorie));
  if (orphelines.length) {
    liste.push({ cle: DIVERS, categorie: cle, nom: "Divers", icone: "dossier",
                 couleur: teinte, portes: orphelines });
  }
  return liste;
}

function categoriesPeuplees() {
  return CATEGORIES
    .map(c => ({ ...c, portes: portesDe(c.cle) }))
    .filter(c => c.portes.length);
}

// Portes rangées dans une catégorie qui n'existe pas : elles seraient
// perdues sans ce filet, on les regroupe dans un dossier de fin de liste.
function categoriesOrphelines() {
  const connues = new Set(CATEGORIES.map(c => c.cle));
  const perdues = PORTES.filter(o => !connues.has(o.categorie));
  return perdues.length
    ? [{ cle: "__autres", nom: "Autres", icone: "dossier", portes: perdues }]
    : [];
}

// Les dossiers du premier niveau, annuaire compris.
function dossiersRacine() {
  const liste = categoriesPeuplees().concat(categoriesOrphelines());
  if (contacts().length) {
    liste.push({ cle: CLE_ANNUAIRE, nom: "Qui contacter", icone: "personne",
                 couleur: COULEUR_ANNUAIRE,
                 portes: [], compte: contacts().length, annuaire: true });
  }
  return liste;
}

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
    const ou = "porte " + (i + 1) + " (" + (o.nom || o.id || "sans nom") + ")";
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
            + '" et non à "' + o.categorie + "\", la porte n'apparaîtrait dans aucun dossier.");
        }
      }
    }
    if (!STATUTS[o.statut]) anomalies.push(ou + ' : statut "' + o.statut + '" inconnu.');
    if (o.type && !TYPES[o.type]) anomalies.push(ou + ' : type "' + o.type + "\" inconnu, la carte sera rendue en type outil.");
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
    console.warn("Hub B27 : " + anomalies.length + " anomalie(s) dans catalogue.js\n"
      + anomalies.map(a => "  - " + a).join("\n"));
  }
  return anomalies;
}

/* ---------------------------------------------------------------------
   CE QUI VOUS APPARTIENT

   Le hub n'a pas de portail de connexion et n'en aura pas. La
   personnalisation ne passe donc par aucun compte : elle vit dans le
   navigateur de chacun, en localStorage. C'est personnel sans être
   identifiant, et cela ne quitte jamais le poste.

   Deux listes seulement : ce que l'on épingle, et ce que l'on a ouvert
   récemment. Les deux sont filtrées contre le catalogue à la lecture, sans
   quoi une porte retirée y laisserait un fantôme.
   --------------------------------------------------------------------- */
const CLE_EPINGLES = "hub_b27_epingles";
const CLE_RECENTS = "hub_b27_recents";
const RECENTS_MAX = 6;

function lireListe(cle) {
  try {
    const v = JSON.parse(localStorage.getItem(cle) || "[]");
    return Array.isArray(v) ? v.filter(x => typeof x === "string") : [];
  } catch (e) { return []; }
}
function ecrireListe(cle, valeurs) {
  try { localStorage.setItem(cle, JSON.stringify(valeurs)); } catch (e) { /* mode privé */ }
}
function porteParId(id) { return PORTES.find(o => o.id === id) || null; }

function epingles() { return lireListe(CLE_EPINGLES).filter(porteParId); }
function estEpingle(id) { return epingles().indexOf(id) !== -1; }
function basculerEpingle(id) {
  const liste = epingles();
  const i = liste.indexOf(id);
  if (i === -1) liste.unshift(id); else liste.splice(i, 1);
  ecrireListe(CLE_EPINGLES, liste);
}

function recents() { return lireListe(CLE_RECENTS).filter(porteParId).slice(0, RECENTS_MAX); }
function noterOuverture(id) {
  if (!porteParId(id)) return;
  const liste = lireListe(CLE_RECENTS).filter(x => x !== id);
  liste.unshift(id);
  ecrireListe(CLE_RECENTS, liste.slice(0, RECENTS_MAX * 2));
}

// Salutation selon l'heure. C'est la seule chose que le hub sait de vous, et
// il la lit sur l'horloge du poste : accueillant sans rien demander.
function salutation() {
  const h = new Date().getHours();
  if (h < 6) return "Bonne nuit";
  if (h < 18) return "Bonjour";
  return "Bonsoir";
}

/* ---------------------------------------------------------------------
   THÈME CLAIR ET SOMBRE
   --------------------------------------------------------------------- */
const CLE_THEME = "hub_b27_theme";

function appliquerTheme(t) {
  document.documentElement.dataset.theme = t;
  const b = $("btnTheme");
  b.innerHTML = ico(t === "dark" ? "soleil" : "lune", 16);
  b.title = t === "dark" ? "Passer en thème clair" : "Passer en thème sombre";
}
function themeMemorise() {
  try { return localStorage.getItem(CLE_THEME); } catch (e) { return null; }
}
function initTheme() {
  const systeme = () => matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  appliquerTheme(themeMemorise() || systeme());
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ev => {
    if (!themeMemorise()) appliquerTheme(ev.matches ? "dark" : "light");
  });
  $("btnTheme").addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem(CLE_THEME, t); } catch (e) { /* mode privé : tant pis */ }
    appliquerTheme(t);
  });
}

/* ---------------------------------------------------------------------
   NAVIGATION

   La position tient dans l'adresse : #/, #/ressources, #/ressources/technique.
   C'est ce qui rend le bouton Précédent du navigateur fonctionnel et permet
   d'envoyer à un collègue le lien d'un dossier précis, pas seulement celui
   du hall.
   --------------------------------------------------------------------- */

function cheminDepuisAdresse() {
  const h = (location.hash || "").replace(/^#\/?/, "");
  if (!h) return [];
  return h.split("/").filter(Boolean).map(m => {
    try { return decodeURIComponent(m); } catch (e) { return m; }
  });
}

function adresseDe(chemin) {
  return chemin.length ? "#/" + chemin.map(encodeURIComponent).join("/") : "#/";
}

// Un chemin qui ne correspond à rien (adresse tapée à la main, dossier
// vidé depuis) ramène au hall plutôt que d'afficher une page morte.
function cheminValide(chemin) {
  if (!chemin.length) return [];
  if (chemin[0] === CLE_ANNUAIRE) return contacts().length ? [CLE_ANNUAIRE] : [];
  const dossiers = dossiersRacine();
  const racine = dossiers.find(d => d.cle === chemin[0]);
  if (!racine) return [];
  if (chemin.length === 1) return [chemin[0]];
  const sous = sousDossiersDe(chemin[0]).find(s => s.cle === chemin[1]);
  return sous ? [chemin[0], sous.cle] : [chemin[0]];
}

/* ---------------------------------------------------------------------
   DOSSIERS

   Carré, l'icône au centre, le nom en dessous qui se révèle au survol.
   C'est un <a> et non un <div> avec un écouteur : on gagne le clavier, le
   clic du milieu, le menu contextuel et le bouton Précédent sans écrire
   une ligne de plus.

   Le nom reste toujours présent dans le code, même invisible, pour les
   lecteurs d'écran ; c'est la feuille de style qui le révèle au survol, et
   seulement là où le survol existe (voir hub.css).
   --------------------------------------------------------------------- */
function html_dossier(d, chemin, index) {
  const compte = d.annuaire ? d.compte : d.portes.length;
  const motCompte = d.annuaire
    ? (compte > 1 ? "fiches" : "fiche")
    : (compte > 1 ? "portes" : "porte");
  const recherche = normaliser(d.nom + " " + (d.portes || []).map(o => o.nom + " " + o.pitch).join(" "));
  return '<a class="dossier" href="' + adresseDe(chemin) + '"'
    + ' style="--i:' + index + ';--c:' + couleurSure(d.couleur) + '"'
    + ' data-recherche="' + ech(recherche) + '"'
    + ' title="' + ech(d.nom) + " : " + compte + " " + motCompte + '">'
    +   '<span class="glyphe">' + ico(d.icone, 110, 1.4) + "</span>"
    +   '<span class="nom">' + ech(d.nom) + "</span>"
    +   '<span class="compte" aria-hidden="true">' + compte + "</span>"
    + "</a>";
}

function html_grilleDossiers(dossiers, prefixe) {
  return '<div class="grille-dossiers">'
    + dossiers.map((d, i) => html_dossier(d, (prefixe || []).concat([d.cle]), i)).join("")
    + "</div>";
}

/* ---------------------------------------------------------------------
   PORTES
   --------------------------------------------------------------------- */
function html_carte(o, index) {
  const st = STATUTS[o.statut] || STATUTS["a-venir"];
  const type = TYPES[o.type] ? o.type : "outil";
  const cliquable = estCliquable(o);

  const classes = ["carte", "carte-" + type];
  if (!cliquable) classes.push("inerte");
  if (o.statut === "obsolete") classes.push("obsolete");

  const pastille = st.pastille
    ? '<span class="pastille ' + ech(o.statut) + '">' + ech(st.libelle) + "</span>"
    : "";
  const sortie = cliquable ? '<span class="sortie">' + ico("sortie", 15) + "</span>" : "";

  let interieur;
  if (type === "lien") {
    interieur =
        '<div class="tete">'
      +   '<span class="vignette">' + ico(o.icone, 17) + "</span>"
      +   "<h3>" + ech(o.nom) + "</h3>"
      +   sortie
      + "</div>"
      + '<p class="pitch">' + ech(o.pitch) + "</p>"
      + (pastille ? '<div class="bas">' + pastille + "</div>" : "");
  } else {
    const tags = (o.tags || []).slice(0, 4)
      .map(t => '<span class="tag">' + ech(t) + "</span>").join("");
    interieur =
        '<div class="tete">'
      +   '<span class="vignette">' + ico(o.icone, 19) + "</span>"
      +   "<h3>" + ech(o.nom) + "</h3>"
      +   sortie
      + "</div>"
      + '<p class="pitch">' + ech(o.pitch) + "</p>"
      + '<div class="bas"><div class="tags">' + tags + "</div>" + pastille + "</div>";
  }

  const attrs =
      ' class="' + classes.join(" ") + '"'
    + ' style="--i:' + (index || 0) + '"'
    + ' data-id="' + ech(o.id) + '"';

  if (!cliquable) {
    return "<div" + attrs + ' aria-disabled="true" title="' + ech(st.libelle)
      + " : cette porte n'est pas encore ouverte\">" + interieur + "</div>";
  }
  return "<a" + attrs + ' href="' + ech(o.url) + '" target="_blank" rel="noopener">' + interieur + "</a>";
}

// Une porte est enveloppée : la carte reste un lien pur, et le bouton
// d'épingle se pose par-dessus en frère et non en enfant. Un bouton à
// l'intérieur d'un lien serait du HTML invalide, et cliquer sur l'épingle
// suivrait le lien.
function html_porte(o, index) {
  const posee = estEpingle(o.id);
  return '<div class="porte" style="--i:' + index + '">'
    + html_carte(o, index)
    + '<button type="button" class="epingle' + (posee ? " posee" : "") + '"'
    +   ' data-epingler="' + ech(o.id) + '"'
    +   ' aria-pressed="' + (posee ? "true" : "false") + '"'
    +   ' title="' + (posee ? "Retirer des raccourcis" : "Ajouter à vos raccourcis") + '"'
    +   ' aria-label="' + (posee ? "Retirer " : "Épingler ") + ech(o.nom) + '">'
    +   ico("epingle", 14) + "</button>"
    + "</div>";
}

function html_grillePortes(portes) {
  const queDesLiens = portes.length && portes.every(o => o.type === "lien");
  return '<div class="grille' + (queDesLiens ? " grille-dense" : "") + '">'
    + portes.map((o, i) => html_porte(o, i)).join("")
    + "</div>";
}

/* ---------------------------------------------------------------------
   ANNUAIRE
   --------------------------------------------------------------------- */
function html_annuaire() {
  return '<div class="grille grille-dense">'
    + contacts().map((c, i) => {
        const sousTitre = [c.role, c.agence].filter(Boolean).join(" - ");
        const sujets = (c.sujets || []).length
          ? '<div class="tags">' + c.sujets.slice(0, 4).map(s => '<span class="tag">' + ech(s) + "</span>").join("") + "</div>"
          : "";
        const liens = [];
        if (c.mail) liens.push('<a href="mailto:' + ech(c.mail) + '">' + ico("courrier", 14) + ech(c.mail) + "</a>");
        if (c.tel) liens.push('<a href="tel:' + ech(c.tel.replace(/\s+/g, "")) + '">' + ico("telephone", 14) + ech(c.tel) + "</a>");
        return '<div class="fiche" style="--i:' + i + '">'
          + '<div class="tete"><span class="vignette">' + ico("personne", 17) + "</span>"
          +   "<div><h3>" + ech(c.nom) + "</h3>"
          +   (sousTitre ? '<p class="role">' + ech(sousTitre) + "</p>" : "")
          + "</div></div>"
          + sujets
          + (liens.length ? '<div class="joindre">' + liens.join("") + "</div>" : "")
          + "</div>";
      }).join("")
    + "</div>";
}

/* ---------------------------------------------------------------------
   FIL D'ARIANE
   --------------------------------------------------------------------- */
// Ce qu'un niveau contient, pour que le dernier maillon du fil puisse
// l'annoncer. Le fil ne dit pas seulement où l'on est, il dit aussi ce qu'on
// y trouve : c'est utile avant même de regarder la grille.
function contenuDuNiveau(chemin) {
  if (!chemin.length) {
    const n = dossiersRacine().length;
    return { icone: "maison", nom: "Hall", couleur: COULEUR_REPLI,
             compte: n, mot: n > 1 ? "dossiers" : "dossier" };
  }
  if (chemin[0] === CLE_ANNUAIRE) {
    const n = contacts().length;
    return { icone: "personne", nom: "Qui contacter", couleur: COULEUR_ANNUAIRE,
             compte: n, mot: n > 1 ? "fiches" : "fiche" };
  }
  const d = dossiersRacine().find(x => x.cle === chemin[0]) || { nom: chemin[0], icone: "dossier", portes: [] };
  if (chemin.length === 1) {
    const sous = sousDossiersDe(chemin[0]);
    if (sous.length) return { icone: d.icone, nom: d.nom, couleur: d.couleur,
      compte: sous.length, mot: sous.length > 1 ? "sous-dossiers" : "sous-dossier" };
    const n = d.portes.length;
    return { icone: d.icone, nom: d.nom, couleur: d.couleur,
             compte: n, mot: n > 1 ? "portes" : "porte" };
  }
  const s = sousDossiersDe(chemin[0]).find(x => x.cle === chemin[1])
    || { nom: chemin[1], icone: "dossier", portes: [] };
  const n = s.portes.length;
  return { icone: s.icone, nom: s.nom, couleur: s.couleur,
           compte: n, mot: n > 1 ? "portes" : "porte" };
}

// Le fil est affiché à tous les niveaux, hall compris. Le masquer à la racine
// le rendait invisible sur le premier écran, donc introuvable : on ne
// découvrait son existence qu'après être entré quelque part, c'est-à-dire
// trop tard pour qu'il serve de repère.
function html_filAriane(chemin) {
  const morceaux = [];
  const ici = contenuDuNiveau(chemin);
  // La teinte du niveau descend sur le fil, dont l'icone la reprend.
  const teinte = couleurSure(ici.couleur);

  // Les maillons parents sont des liens, le maillon courant n'en est pas un :
  // un lien vers la page où l'on se trouve déjà n'apprend rien et trompe.
  if (chemin.length) {
    morceaux.push('<a href="#/" class="fil-lien">' + ico("maison", 14) + "Hall</a>");
  }
  if (chemin.length > 1) {
    const d = dossiersRacine().find(x => x.cle === chemin[0]) || { nom: chemin[0] };
    morceaux.push('<a href="' + adresseDe([chemin[0]]) + '" class="fil-lien">' + ech(d.nom) + "</a>");
  }
  morceaux.push('<span class="fil-ici">' + ico(ici.icone, 15) + ech(ici.nom)
    + '<span class="fil-compte">' + ici.compte + " " + ech(ici.mot) + "</span></span>");

  // Le bouton Retour double le fil d'Ariane, volontairement : le fil dit où
  // l'on est, le bouton donne une cible large et toujours au même endroit,
  // qui est ce qu'on cherche quand on veut juste remonter d'un cran. Au hall,
  // il n'y a nulle part où remonter : il ne s'affiche pas.
  const retour = chemin.length
    ? '<a class="fil-retour" href="' + adresseDe(chemin.slice(0, -1)) + '"'
      + ' aria-label="Remonter d\'un niveau" title="Remonter d\'un niveau">' + ico("retour", 15) + "</a>"
    : "";

  return '<nav class="fil" aria-label="Fil d\'Ariane" style="--c:' + teinte + '">' + retour
    + '<span class="fil-suite">'
    +   morceaux.join('<span class="fil-sep" aria-hidden="true">' + ico("chevron", 12) + "</span>")
    + "</span></nav>";
}

/* ---------------------------------------------------------------------
   RENDU
   --------------------------------------------------------------------- */

// Toutes les portes, à plat, pour la recherche : elle traverse les niveaux.
// Chercher "INIES" depuis le hall doit trouver, sans avoir à deviner dans
// quel dossier c'est rangé.
function toutesLesPortesAvecChemin() {
  return PORTES.map(o => {
    const c = categorie(o.categorie);
    const s = o.sousCategorie ? sousCategorie(o.sousCategorie) : null;
    const ou = [c ? c.nom : o.categorie, s ? s.nom : ""].filter(Boolean).join(" > ");
    return {
      porte: o,
      ou: ou,
      recherche: normaliser([o.nom, o.pitch, (o.tags || []).join(" "), ou].join(" "))
    };
  });
}

let requete = "";

function rendre() {
  const chemin = cheminValide(cheminDepuisAdresse());
  const cible = $("contenu");
  const ici = contenuDuNiveau(chemin);

  // Le bloc d'accueil, salutation et raccourcis compris, n'appartient qu'au
  // hall : dès qu'on entre dans un dossier ou qu'une recherche est en cours,
  // la place revient à ce qu'on est venu chercher.
  const auHall = chemin.length === 0 && !requete;
  $("accueil").hidden = !auHall;
  // Les raccourcis sont reconstruits à chaque retour au hall, et non une
  // seule fois au chargement : une porte ouverte entre-temps doit apparaître
  // dans les récentes sans qu'il faille recharger la page.
  if (auHall) construireRaccourcis();
  document.body.classList.toggle("dedans", !auHall);
  majRailActif(requete ? [] : chemin);

  // Le titre de la barre du haut suit le niveau, et l'onglet du navigateur
  // aussi : un onglet parmi douze doit dire où il mène.
  const titre = requete ? "Recherche" : ici.nom;
  $("titrePage").textContent = titre;
  document.title = auHall ? REGLAGES.titre : titre + " - " + REGLAGES.titre;

  if (requete) { $("filAriane").innerHTML = ""; rendreRecherche(cible); return; }

  // Au hall, le fil se réduirait à un maillon sans lien : le bloc d'accueil
  // dit déjà où l'on est, et bien mieux que lui.
  $("filAriane").innerHTML = auHall ? "" : html_filAriane(chemin);

  if (!chemin.length) {
    const dossiers = dossiersRacine();
    cible.innerHTML = dossiers.length
      ? html_grilleDossiers(dossiers, [])
      : '<div class="vide"><b>Aucune porte pour le moment</b>'
        + "Le hall se remplit en ajoutant une fiche dans catalogue.js.</div>";
    return;
  }

  if (chemin[0] === CLE_ANNUAIRE) { cible.innerHTML = html_annuaire(); return; }

  if (chemin.length === 1) {
    const sous = sousDossiersDe(chemin[0]);
    if (sous.length) { cible.innerHTML = html_grilleDossiers(sous, [chemin[0]]); return; }
    const d = dossiersRacine().find(x => x.cle === chemin[0]);
    cible.innerHTML = html_grillePortes(d ? d.portes : []);
    return;
  }

  const s = sousDossiersDe(chemin[0]).find(x => x.cle === chemin[1]);
  cible.innerHTML = html_grillePortes(s ? s.portes : []);
}

function rendreRecherche(cible) {
  const q = normaliser(requete);
  const trouves = toutesLesPortesAvecChemin().filter(e => e.recherche.includes(q));

  $("filAriane").innerHTML = '<nav class="fil" aria-label="Fil d\'Ariane">'
    + '<a class="fil-retour" href="' + adresseDe(cheminValide(cheminDepuisAdresse())) + '"'
    + ' aria-label="Quitter la recherche" id="btnQuitterRecherche">' + ico("retour", 15) + "</a>"
    + '<span class="fil-suite"><span class="fil-ici">'
    + (trouves.length
        ? trouves.length + (trouves.length > 1 ? " portes trouvées" : " porte trouvée") + " dans tout le hall"
        : "Aucune porte ne correspond")
    + "</span></span></nav>";

  if (!trouves.length) {
    cible.innerHTML = '<div class="vide"><b>Aucune porte ne correspond</b>'
      + "Essayez un autre mot-clé, ou effacez la recherche pour revenir aux dossiers.</div>";
    return;
  }
  // En recherche, chaque résultat rappelle son dossier : sans cela, on ne
  // sait pas où il était rangé, et on ne peut pas y retourner.
  cible.innerHTML = '<div class="grille">'
    + trouves.map((e, i) =>
        '<div class="resultat" style="--i:' + i + '">'
      +   '<span class="resultat-ou">' + ico("dossier", 12) + ech(e.ou) + "</span>"
      +   html_carte(e.porte, i)
      + "</div>").join("")
    + "</div>";
}

/* ---------------------------------------------------------------------
   BANDEAU D'ACCUEIL
   --------------------------------------------------------------------- */
function construireAccueil() {
  const ouvertes = PORTES.filter(estCliquable).length;
  const maison = PORTES.filter(o => (o.type || "outil") === "outil").length;
  const liens = PORTES.length - maison;
  const preparation = PORTES.length - ouvertes;

  $("salut").textContent = salutation() + ".";
  $("chapeau").textContent = REGLAGES.chapeau || "";
  $("chapeau").hidden = !REGLAGES.chapeau;

  // Quatre chiffres, et chacun répond à une question qu'on se pose vraiment
  // en arrivant : qu'est-ce qui marche, qu'est-ce que nous fabriquons
  // nous-mêmes, qu'est-ce qui vient d'ailleurs, qu'est-ce qui arrive. Ils
  // sont calculés, jamais recopiés : ils ne peuvent pas mentir après l'ajout
  // d'une porte. Une case à zéro disparaît, sauf la première : annoncer
  // "0 en préparation" attirerait l'oeil sur un vide.
  const cases = [
    // Ces teintes ne sont pas celles des tuiles, et l'écart est voulu : une
    // tuile ne porte qu'un glyphe, seuil 3:1, tandis qu'une carte chiffrée
    // porte du texte de petite taille, seuil 4,5:1. Le bleu et l'ocre ont donc
    // été assombris, le #2f6f8f venant de la feuille de B27 Mobility où il est
    // documenté à 5,54:1.
    { n: ouvertes,    titre: "Portes ouvertes", detail: "prêtes à l'emploi",   c: "#5f7f1f", ico: "porte" },
    { n: maison,      titre: "Nos outils",      detail: "fabriqués ici",       c: "#2f6f8f", ico: "calculatrice" },
    { n: liens,       titre: "Ressources",      detail: "sites de référence",  c: "#6b5ba6", ico: "livre" },
    { n: preparation, titre: "En préparation",  detail: "bientôt disponibles", c: "#8a6200", ico: "horloge" }
  ].filter((x, i) => i === 0 || x.n > 0);

  $("chiffres").innerHTML = cases.map((x, i) =>
      '<div class="chiffre" style="--c:' + x.c + ';--i:' + i + '">'
    +   '<span class="chiffre-ico">' + ico(x.ico, 22, 1.7) + "</span>"
    +   '<span class="chiffre-n">' + x.n + "</span>"
    +   '<span class="chiffre-titre">' + ech(x.titre) + "</span>"
    +   '<span class="chiffre-detail">' + ech(x.detail) + "</span>"
    + "</div>").join("");

  construireRaccourcis();
}

/* ---------------------------------------------------------------------
   VOS RACCOURCIS

   La part personnelle du hall, sans compte ni identité : ce que vous avez
   épinglé, puis ce que vous avez ouvert récemment. Tout vient du navigateur
   et n'en sort jamais. Tant que rien n'est épinglé, un mot explique à quoi
   sert l'épingle, plutôt que de laisser un vide sans raison.
   --------------------------------------------------------------------- */
function construireRaccourcis() {
  const mesEpingles = epingles().map(porteParId);
  // Une porte épinglée n'a pas à réapparaître dans les récentes : elle est
  // déjà en haut, la répéter ferait du bruit.
  const mesRecents = recents().map(porteParId).filter(o => !estEpingle(o.id));
  let h = "";

  if (mesEpingles.length) {
    h += '<section class="bloc">'
      +  '<h2><span class="pave" style="--c:#b17e00">' + ico("epingle", 14) + "</span>Vos raccourcis"
      +    ' <span class="compte">' + mesEpingles.length + "</span></h2>"
      +  html_grillePortes(mesEpingles)
      + "</section>";
  } else {
    h += '<section class="bloc">'
      +  '<div class="invite">' + ico("epingle", 16)
      +    "<span><b>Faites-en votre hall.</b> L'épingle en haut d'une carte la remonte ici, "
      +    "en tête du hall, à chacune de vos visites. Aucun compte n'est demandé et rien "
      +    "n'est envoyé : l'épingle reste dans ce navigateur.</span></div>"
      + "</section>";
  }

  if (mesRecents.length) {
    h += '<section class="bloc">'
      +  '<h2><span class="pave" style="--c:#6e6a63">' + ico("horloge", 14) + "</span>Ouvert récemment"
      +    ' <span class="compte">' + mesRecents.length + "</span></h2>"
      +  html_grillePortes(mesRecents)
      + "</section>";
  }

  $("raccourcis").innerHTML = h;
  poserIcones($("raccourcis"));
}

/* ---------------------------------------------------------------------
   BARRE LATÉRALE

   Toutes les catégories à un clic, depuis n'importe où. C'est ce qui
   distingue un hall d'une simple arborescence : on n'a jamais à remonter
   pour changer de branche.
   --------------------------------------------------------------------- */
function construireRail() {
  $("railLogo").innerHTML = logoB27(24);
  $("railTitre").textContent = REGLAGES.titre;
  $("railSousTitre").textContent = REGLAGES.sousTitre;

  const dossiers = dossiersRacine();
  $("railNav").innerHTML =
      '<a class="rail-lien" href="#/" data-cle="">'
    +   '<span class="rail-puce" style="--c:' + COULEUR_REPLI + '">' + ico("maison", 16) + "</span>"
    +   "<span>Hall</span></a>"
    + '<p class="rail-titre">Les dossiers</p>'
    + dossiers.map(d =>
        '<a class="rail-lien" href="' + adresseDe([d.cle]) + '" data-cle="' + ech(d.cle) + '">'
      +   '<span class="rail-puce" style="--c:' + couleurSure(d.couleur) + '">' + ico(d.icone, 16) + "</span>"
      +   "<span>" + ech(d.nom) + "</span>"
      +   '<span class="rail-compte">' + (d.annuaire ? d.compte : d.portes.length) + "</span></a>").join("");

  $("railPied").innerHTML = REGLAGES.contact
    ? '<a class="rail-contact" href="mailto:' + ech(REGLAGES.contact) + '">'
      + ico("courrier", 14) + "<span>Un bug, une idée</span></a>"
    : "";
}

// Le lien de la catégorie courante est marqué, pour qu'on sache toujours où
// l'on se trouve sans avoir à relire le fil d'Ariane.
function majRailActif(chemin) {
  const cle = chemin.length ? chemin[0] : "";
  $("railNav").querySelectorAll(".rail-lien").forEach(a => {
    const actif = a.dataset.cle === cle;
    a.classList.toggle("actif", actif);
    if (actif) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

// Sur écran étroit la barre latérale devient un tiroir. Le voile qui
// l'accompagne sert autant à assombrir la page qu'à donner une grande cible
// pour refermer.
function ouvrirRail(ouvert) {
  document.body.classList.toggle("rail-ouvert", ouvert);
  $("railVoile").hidden = !ouvert;
  $("btnRail").setAttribute("aria-expanded", String(ouvert));
}

/* ---------------------------------------------------------------------
   RECHERCHE
   --------------------------------------------------------------------- */
function construireBarre() {
  if (PORTES.length < REGLAGES.seuilFiltres) return false;

  $("barre").innerHTML =
      '<div class="recherche" id="zoneRecherche">'
    +   ico("recherche", 15)
    +   '<input type="search" id="inpRecherche" placeholder="Rechercher dans tout le hall..." aria-label="Rechercher une porte">'
    +   '<button type="button" class="vider" id="btnVider" aria-label="Effacer la recherche"></button>'
    + "</div>";
  $("btnVider").innerHTML = ico("fermer", 13);

  $("inpRecherche").addEventListener("input", () => {
    requete = $("inpRecherche").value.trim();
    $("zoneRecherche").classList.toggle("remplie", requete.length > 0);
    rendre();
  });
  $("btnVider").addEventListener("click", () => {
    $("inpRecherche").value = "";
    requete = "";
    $("zoneRecherche").classList.remove("remplie");
    $("inpRecherche").focus();
    rendre();
  });
  return true;
}

/* ---------------------------------------------------------------------
   PANNEAU "À PROPOS"
   --------------------------------------------------------------------- */
function ligneStat(dt, dd) {
  return "<dt>" + ech(dt) + "</dt><dd>" + ech(dd) + "</dd>";
}

function remplirApropos() {
  const parStatut = {};
  PORTES.forEach(o => { parStatut[o.statut] = (parStatut[o.statut] || 0) + 1; });
  const majs = PORTES.map(o => o.maj).filter(Boolean).sort();
  const derniere = majs.length ? majs[majs.length - 1] : null;
  const anomalies = controlerCatalogue();
  const nosOutils = PORTES.filter(o => (o.type || "outil") === "outil").length;
  const nbSous = categoriesPeuplees().reduce((n, c) => n + sousDossiersDe(c.cle).length, 0);

  let h = "";

  h += '<div class="stats-groupe"><h3 data-ico="grille" data-ico-taille="13">Le hall</h3><dl class="stats-liste">'
     + ligneStat("Portes référencées", PORTES.length)
     + ligneStat("dont ressources extérieures", PORTES.length - nosOutils)
     + Object.keys(STATUTS).filter(s => parStatut[s]).map(s =>
         ligneStat("dont " + STATUTS[s].libelle.toLowerCase(), parStatut[s])).join("")
     + ligneStat("Dossiers au premier niveau", dossiersRacine().length)
     + ligneStat("Sous-dossiers", nbSous)
     + ligneStat("Fiches à l'annuaire", contacts().length)
     + ligneStat("Porte mise à jour le plus récemment", derniere ? dateFr(derniere) : "non renseigné")
     + ligneStat("Thème courant", document.documentElement.dataset.theme === "dark" ? "sombre" : "clair")
     + "</dl></div>";

  h += '<div class="stats-groupe"><h3 data-ico="porte" data-ico-taille="13">Ce que fait le hub</h3>'
     + '<dl class="stats-liste gauche">'
     + ligneStat("Rôle", "Point d'entrée unique vers les outils et les ressources du bureau d'études. Le hub n'héberge rien, il redirige.")
     + ligneStat("Navigation", "Par dossiers. La position est dans l'adresse, le bouton Précédent fonctionne, et le lien d'un dossier précis peut se transmettre tel quel.")
     + ligneStat("Données", "Aucune ne sort du poste. Aucun compte, aucun formulaire, aucun suivi.")
     + ligneStat("Ce qui est retenu", "Votre thème, vos épingles et vos six dernières portes ouvertes, dans ce navigateur seulement. Vider les données du site les efface.")
     + ligneStat("Vos épingles", epingles().length + " porte(s) épinglée(s), " + recents().length + " ouverture(s) récente(s)")
     + "</dl></div>";

  h += '<div class="stats-groupe"><h3 data-ico="etiquette" data-ico-taille="13">Ajouter une porte</h3>'
     + '<div class="note">Un seul fichier à modifier : <code>catalogue.js</code>. Copier une fiche existante, '
     + "remplir le nom, le pitch, l'adresse, la catégorie et le statut, puis enregistrer. Le dossier apparaît, "
     + "les compteurs suivent. Le contrôle <code>python tests/verifier_catalogue.py</code> dit si la fiche "
     + "est complète avant publication.</div></div>";

  if (anomalies.length) {
    h += '<div class="stats-groupe"><h3 data-ico="attention" data-ico-taille="13">Anomalies du catalogue</h3>'
       + '<div class="note">' + anomalies.length + " anomalie(s) détectée(s) dans catalogue.js. "
       + "Le détail est dans la console du navigateur (touche F12).</div></div>";
  }

  h += '<div class="stats-groupe"><h3 data-ico="horloge" data-ico-taille="13">Journal des versions</h3>'
     + '<ul class="changelog">'
     + CHANGELOG.map((c, i) =>
         '<li class="' + (i === 0 ? "actuelle" : "") + '">'
       +   '<span class="cl-ver">' + ech(c.v) + "</span>"
       +   '<span><span class="cl-titre">' + ech(c.titre) + "</span> "
       +     '<span class="cl-date">' + dateFr(c.date) + "</span></span>"
       +   '<span class="cl-txt">' + ech(c.texte) + "</span>"
       + "</li>").join("")
     + "</ul></div>";

  if (REGLAGES.contact) {
    h += '<div class="stats-groupe"><h3 data-ico="courrier" data-ico-taille="13">Un bug, une idée d\'outil</h3>'
       + '<div class="note">Le plus rapide est la pastille de signalement, en bas à droite de l\'écran : '
       + "elle joint une capture de ce que vous avez sous les yeux et permet de dicter le problème à voix haute. "
       + 'Sinon, par mail : <a href="mailto:' + ech(REGLAGES.contact) + '">' + ech(REGLAGES.contact) + "</a>.</div></div>";
  }

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
   DÉMARRAGE
   --------------------------------------------------------------------- */
function init() {
  controlerCatalogue();
  construireRail();
  construireAccueil();
  construireBarre();
  poserIcones();
  initTheme();
  initApropos();

  $("btnRail").innerHTML = ico("menu", 17);
  $("btnRail").addEventListener("click", () => ouvrirRail(!document.body.classList.contains("rail-ouvert")));
  $("railVoile").addEventListener("click", () => ouvrirRail(false));
  // Sur mobile, suivre un lien du tiroir doit le refermer : sans cela, la
  // page change derrière un tiroir resté ouvert.
  $("railNav").addEventListener("click", ev => {
    if (ev.target.closest(".rail-lien")) ouvrirRail(false);
  });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape" && document.body.classList.contains("rail-ouvert")) ouvrirRail(false);
  });

  const ouvertes = PORTES.filter(estCliquable).length;
  $("piedCompte").textContent = PORTES.length + " porte" + (PORTES.length > 1 ? "s" : "")
    + " référencée" + (PORTES.length > 1 ? "s" : "") + ", " + ouvertes + " ouverte" + (ouvertes > 1 ? "s" : "");

  if (REGLAGES.contact) {
    $("piedContact").innerHTML = 'Un bug, une idée d\'outil : la pastille en bas à droite, ou <a href="mailto:'
      + ech(REGLAGES.contact) + '">' + ech(REGLAGES.contact) + "</a>";
  }

  // Un seul écouteur pour toute la page plutôt qu'un par carte : les grilles
  // sont reconstruites à chaque navigation, des écouteurs posés sur les
  // cartes seraient à reposer à chaque fois.
  document.addEventListener("click", ev => {
    const bouton = ev.target.closest("[data-epingler]");
    if (bouton) {
      ev.preventDefault();
      basculerEpingle(bouton.dataset.epingler);
      rendre();                       // reconstruit les raccourcis au passage
      return;
    }
    // Ouvrir une porte la fait entrer dans les récentes. C'est noté au clic
    // et non au retour, puisqu'il n'y a pas de retour : la porte s'ouvre
    // dans un autre onglet.
    const carte = ev.target.closest("a.carte[data-id]");
    if (carte) noterOuverture(carte.dataset.id);
  });

  // Une recherche en cours doit être abandonnée si l'on navigue : sinon la
  // page afficherait des résultats sans rapport avec l'adresse.
  window.addEventListener("hashchange", () => {
    if (requete) {
      requete = "";
      const champ = $("inpRecherche");
      if (champ) { champ.value = ""; $("zoneRecherche").classList.remove("remplie"); }
    }
    rendre();
  });
  rendre();

  if (typeof Signalement !== "undefined" && typeof SIGNALEMENT !== "undefined" && SIGNALEMENT.actif) {
    Signalement.init(SIGNALEMENT);
  }
}

document.addEventListener("DOMContentLoaded", init);
