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

   Un journal de versions est un résumé, pas un récit : deux ou trois
   phrases par version, ce qui a changé pour qui l'utilise. Le détail, les
   pourquoi et les leçons vont dans JOURNAL.md, qui est fait pour ça.
   --------------------------------------------------------------------- */
const CHANGELOG = [
  { v: "v12", date: "2026-08-30", titre: "Le portail parle anglais",
    texte: "Le cadre, nos outils, les métiers et les domaines se lisent en anglais, le choix se mémorisant comme le thème. Les fiches de ressources restent en français : elles mènent à des sites français." },

  { v: "v11", date: "2026-08-30", titre: "Le déroulé a un foyer",
    texte: "Le déroulé a un foyer : le métier regardé se tient en avant, les autres passent au lointain. Molette et flèches avancent d'un métier par cran, avec retour à l'oeil et à l'oreille. L'entrée occupe l'écran, le catalogue se centre, et le site de l'entreprise rejoint les ressources." },

  { v: "v10", date: "2026-08-30", titre: "Le sommaire, les métiers, la signature",
    texte: "Le catalogue se groupe par métier, et un sommaire fixé à droite donne la vue d'ensemble. Quatre outils de dimensionnement sont annoncés. Le site de l'entreprise quitte le rayon des outils, B27 Mobility quitte le portail." },
  { v: "v9", date: "2026-08-29", titre: "La météo en grand",
    texte: "Un clic sur la tuile météo ouvre le panneau détaillé : les mesures du moment, les prochaines heures, la semaine, le soleil et la qualité de l'air. Chacun y compose sa tuile, le choix restant dans le navigateur." },
  { v: "v8", date: "2026-08-29", titre: "Le fond vit avec le ciel",
    texte: "Le champ d'écoulement suit la météo affichée, pluie, neige, brouillard et orage, et la saison en teinte la palette. Au défilement tout s'ancre : les tuiles se replient en pastilles, l'emblème se pose en haut au centre." },

  { v: "v7", date: "2026-08-29", titre: "Le portail",
    texte: "Refonte complète : tout est centré sous le logo, un champ d'écoulement animé occupe le fond, la météo et le calendrier s'affichent en tuiles. Le catalogue se lit en deux rayons et la métaphore des portes disparaît. Sombre par défaut." },
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
  flocon: '<path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/>',
  flamme: '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',
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
  reseau: '<path d="m10.586 5.414-5.172 5.172"/><path d="m18.586 13.414-5.172 5.172"/><path d="M6 12h12"/><circle cx="12" cy="20" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="4" cy="12" r="2"/>',
  regle: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  recherche: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sortie: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  soleil: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  nuage_soleil: '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
  ondes: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
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
  son: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
  muet: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
  langue: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
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

  if (anomalies.length) {
    console.warn("Portail B27 : " + anomalies.length + " anomalie(s) dans catalogue.js\n"
      + anomalies.map(a => "  - " + a).join("\n"));
  }
  return anomalies;
}

/* ---------------------------------------------------------------------
   LE SON

   Un retour à l'oreille sur ce qu'on fait : un cran de molette, une flèche,
   un passage d'un rayon à l'autre, une butée en bout de course, une
   sélection. Tout est synthétisé à la volée par l'API Web Audio, comme le
   fond est calculé plutôt que dessiné : pas un fichier, pas une
   dépendance, et le portail continue de fonctionner depuis le disque.

   TRÈS COURT, TRÈS BAS, ET JAMAIS UN ACCORD DÉSAGRÉABLE. Chaque son est une
   sinusoïde de quelques centièmes de seconde, prise dans une gamme
   pentatonique où deux notes quelconques sonnent ensemble, adoucie par un
   passe-bas et enveloppée d'une attaque de quatre millisecondes et d'une
   extinction exponentielle : un créneau net claquerait. Le volume est celui
   d'un objet qu'on pose sur une table, pas d'une notification. Deux sons ne
   se collent jamais, un intervalle minimal les sépare.

   LE NAVIGATEUR INTERDIT TOUT SON AVANT UN GESTE D'ACTIVATION, et tous les
   gestes n'en sont pas. Un clic, une touche, un toucher déverrouillent le
   contexte audio ; la molette, non, elle ne compte pas comme activation.
   Un visiteur qui ne fait que dérouler n'entendait donc rien, le contexte
   restant suspendu quoi qu'on lui demande, et les notes programmées dans un
   temps qui n'avance pas se perdaient. Le déverrouillage est donc accroché
   aux gestes qui en ont le pouvoir, et une note demandée trop tôt n'est pas
   jetée : elle repart dès que le contexte s'ouvre.

   Le premier son entendu reste la conséquence d'une action, jamais du
   chargement. Un bouton du haut coupe tout, et le choix vit dans le
   navigateur comme le thème.
   --------------------------------------------------------------------- */
const CLE_SON = "hub_b27_son";
const SON = { ctx: null, actif: true, dernier: 0, reprise: false };

// Gamme pentatonique majeure, en hertz, plus un do grave pour la butée :
// deux notes quelconques sonnent ensemble, il n'y a pas d'accord à éviter.
const SON_NOTES = [261.63, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

// Une voix : des notes en [indice, retard, durée, volume]. Ce qui descend
// sonne plus grave que ce qui remonte, le geste s'entend dans la hauteur.
const SON_VOIX = {
  cranBas:  [[2, 0, 0.075, 0.030]],
  cranHaut: [[4, 0, 0.075, 0.030]],
  passage:  [[3, 0, 0.105, 0.032], [5, 0.06, 0.135, 0.026]],
  clic:     [[5, 0, 0.055, 0.034]],
  butee:    [[0, 0, 0.140, 0.028]]
};

function sonContexte() {
  if (SON.ctx) return SON.ctx;
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return null;
  try { SON.ctx = new C(); } catch (e) { return null; }   // audio refusé, tant pis
  return SON.ctx;
}

// Une note. Le passe-bas arrondit ce qui resterait de mordant dans la
// sinusoïde, et l'extinction exponentielle évite le clic de coupure.
function sonNote(freq, duree, volume, retard) {
  const ctx = SON.ctx;
  const t = ctx.currentTime + retard;
  const osc = ctx.createOscillator();
  const filtre = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t);
  filtre.type = "lowpass";
  filtre.frequency.setValueAtTime(2400, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  osc.connect(filtre); filtre.connect(gain); gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duree + 0.03);
}

function sonJouer(nom) {
  const voix = SON.actif && SON_VOIX[nom];
  if (!voix) return;
  const ctx = sonContexte();
  if (!ctx) return;
  /* Contexte encore verrouillé : programmer la note maintenant, dans un
     temps qui n'avance pas, reviendrait à la perdre. On pousse le contexte
     et on rejoue la note quand il s'ouvre, une seule reprise en attente à
     la fois. L'intervalle qui espace les sons n'est pas consommé pour
     autant : une note qui n'a pas sonné ne compte pas. */
  if (ctx.state !== "running") {
    if (!SON.reprise) {
      SON.reprise = true;
      ctx.resume().then(() => { SON.reprise = false; sonJouer(nom); })
                  .catch(() => { SON.reprise = false; });
    }
    return;
  }
  const maintenant = performance.now();
  if (maintenant - SON.dernier < 40) return;   // deux sons collés claquent
  SON.dernier = maintenant;
  voix.forEach(v => sonNote(SON_NOTES[v[0]], v[2], v[3], v[1]));
}

/* Le déverrouillage, accroché aux gestes qui comptent comme activation.
   Il reste posé plutôt que de se retirer au premier passage : un contexte
   peut être resuspendu par le système en cours de route, et la reprise ne
   coûte rien sur un contexte déjà ouvert. */
function sonDeverrouiller() {
  const ctx = sonContexte();
  if (ctx && ctx.state !== "running") ctx.resume().catch(() => {});
}

function sonEtat(actif) {
  SON.actif = !!actif;
  const b = $("btnSon");
  if (!b) return;
  const quoi = mot(SON.actif ? "Couper le son" : "Activer le son");
  b.innerHTML = ico(SON.actif ? "son" : "muet", 17);
  b.setAttribute("aria-label", quoi);
  b.setAttribute("title", quoi);
  b.setAttribute("aria-pressed", String(SON.actif));
}

function initSon() {
  // Les gestes qui ont le pouvoir de déverrouiller l'audio. La molette n'en
  // fait pas partie, c'est le navigateur qui en décide : sans un clic ou
  // une touche quelque part, un visiteur qui ne fait que dérouler resterait
  // dans le silence.
  ["pointerdown", "keydown", "touchstart"].forEach(t =>
    window.addEventListener(t, sonDeverrouiller, { capture: true, passive: true }));

  let memorise = null;
  try { memorise = localStorage.getItem(CLE_SON); } catch (e) { /* stockage refusé */ }
  sonEtat(memorise !== "off");
  $("btnSon").addEventListener("click", () => {
    sonEtat(!SON.actif);
    try { localStorage.setItem(CLE_SON, SON.actif ? "on" : "off"); } catch (e) { /* non mémorisé */ }
  });

  /* Le son de sélection est délégué au document : une carte, une bulle du
     sommaire, la pilule d'ancrage, un bouton du haut. En délégation, le
     bouton du son rend lui-même son état avant que le clic n'arrive ici,
     si bien qu'allumer le son se confirme d'un son et l'éteindre se tait. */
  document.addEventListener("click", ev => {
    if (!ev.target || !ev.target.closest) return;
    if (ev.target.closest("a.carte, .som-ligne[data-cible], .ancre, .bouton-icone, .rang")) {
      sonJouer("clic");
    }
  });
}

/* ---------------------------------------------------------------------
   LA LANGUE

   Le portail se traduit, pas les sites qu'il pointe. Le cadre, nos propres
   outils et la structure passent en anglais ; les fiches de ressources
   gardent leur nom et leur description en français, puisqu'elles mènent à
   des sites français et qu'une description traduite promettrait un contenu
   qui n'existe pas.

   DEUX SOURCES, ET C'EST VOULU. Le vocabulaire de l'interface vit ici,
   dans un dictionnaire dont la clé est la phrase française : le code
   continue de s'écrire en français, une chaîne sans traduction retombe
   d'elle-même sur l'original, et rien ne casse si l'on en oublie une. Le
   contenu du catalogue, lui, se traduit dans catalogue.js, sur chaque
   fiche, pour que ce fichier reste le seul à faire vivre.

   CHANGER DE LANGUE RECHARGE LA PAGE. Tout se construit à l'exécution,
   sommaire et écouteurs compris : reconstruire à chaud demanderait de
   défaire et refaire des liaisons que rien n'oblige à toucher. Le choix
   vit dans le navigateur comme le thème, et la page repart dans la bonne
   langue.
   --------------------------------------------------------------------- */
const CLE_LANGUE = "hub_b27_langue";
const LANGUE = { courante: "fr" };

const TRADUCTIONS = {
  en: {
    /* ---- le cadre */
    "Revenir en haut de la page": "Back to top",
    "Changer de thème": "Switch theme",
    "Couper le son": "Mute",
    "Activer le son": "Unmute",
    "Langue": "Language",
    "À propos du portail": "About this portal",
    "Sommaire de la page": "Page contents",
    "Choix de la langue": "Language",
    "Météo et calendrier": "Weather and calendar",
    "Rechercher dans le portail": "Search the portal",
    "Rechercher un outil, une ressource…": "Search for a tool or a resource…",
    "Fermer": "Close",
    "bientôt": "soon",
    "Bientôt disponible": "Coming soon",

    /* ---- les rayons et le catalogue */
    "Nos outils": "Our tools",
    "fabriqués ici": "built here",
    "Ressources": "Resources",
    "sites de référence": "reference sites",
    "outil": "tool",
    "outils": "tools",
    "ressource": "resource",
    "ressources": "resources",
    "Aucun résultat pour": "No result for",
    "Divers": "Miscellaneous",

    /* ---- les statuts d'une fiche */
    "En ligne": "Online",
    "Bêta": "Beta",
    "Bientôt": "Soon",
    "Au bureau": "On site",
    "Obsolète": "Retired",

    /* ---- la tuile météo */
    "Météo": "Weather",
    "Calendrier": "Calendar",
    "ma position": "my location",
    "Actualiser le relevé": "Refresh reading",
    "Utiliser ma position": "Use my location",
    "Position choisie": "Chosen location",
    "Relevé": "Reading",
    "données Open-Meteo": "Open-Meteo data",
    "Météo à": "Weather in",
    "Météo détaillée": "Detailed weather",

    /* ---- le temps qu'il fait */
    "Ciel dégagé": "Clear sky",
    "Peu nuageux": "Partly cloudy",
    "Couvert": "Overcast",
    "Brouillard": "Fog",
    "Bruine": "Drizzle",
    "Pluie": "Rain",
    "Neige": "Snow",
    "Averses": "Showers",
    "Averses de neige": "Snow showers",
    "Orage": "Thunderstorm",
    "Temps mêlé": "Mixed weather",

    /* ---- les mesures */
    "Ressenti": "Feels like",
    "Vent": "Wind",
    "Rafales": "Gusts",
    "Humidité": "Humidity",
    "Pression": "Pressure",
    "Pression mer": "Sea pressure",
    "Nébulosité": "Cloud cover",
    "Précipitations": "Precipitation",
    "Point de rosée": "Dew point",
    "Indice UV": "UV index",

    /* ---- le panneau météo */
    "Prochaines 24 heures": "Next 24 hours",
    "La semaine": "The week",
    "Le soleil": "The sun",
    "Lever": "Sunrise",
    "Coucher": "Sunset",
    "Jour": "Daylight",
    "UV max": "Max UV",
    "Qualité de l’air": "Air quality",
    "Bon": "Good", "Correct": "Fair", "Dégradé": "Moderate",
    "Mauvais": "Poor", "Très mauvais": "Very poor", "Extrême": "Extreme",
    "Aulne": "Alder", "Bouleau": "Birch", "Graminées": "Grass",
    "Pollen": "Pollen", "vent": "wind", "auj.": "today",
    "dim.": "Sun", "lun.": "Mon", "mar.": "Tue", "mer.": "Wed",
    "jeu.": "Thu", "ven.": "Fri", "sam.": "Sat",
    "Composer la tuile": "Compose the tile",
    "Les mesures cochées sont celles que la tuile du portail affiche, jusqu’à 6. Ce choix reste dans ce navigateur.":
      "The ticked measurements are the ones the portal tile shows, up to 6. This choice stays in this browser.",
    "Modèle": "Model",
    "point à": "point at",
    "d’altitude": "elevation",
    "Auj.": "Today",

    /* ---- le calendrier */
    "Semaine": "Week",
    "janvier": "January", "février": "February", "mars": "March",
    "avril": "April", "mai": "May", "juin": "June",
    "juillet": "July", "août": "August", "septembre": "September",
    "octobre": "October", "novembre": "November", "décembre": "December",

    /* ---- le panneau À propos */
    "Le portail": "The portal",
    "Outils à venir": "Tools coming soon",
    "Métiers en attente": "Trades awaiting a tool",
    "Dernière mise à jour du catalogue": "Catalogue last updated",
    "Thème courant": "Current theme",
    "sombre": "dark",
    "clair": "light",
    "non renseignée": "not set",
    "Contacts": "Contacts",
    "Anomalies du catalogue": "Catalogue anomalies",
    "Journal des versions": "Version log",

    /* ---- le volet des nouveautés */
    "Derniers outils disponibles": "Latest available tools",
    "Voir dans le portail": "Show in the portal",
    "Voir les derniers outils disponibles": "See the latest available tools"
  }
};

/* Une phrase de l'interface. La clé est le français : sans traduction, on
   rend l'original, et le portail reste lisible plutôt que troué. */
function mot(fr) {
  const d = TRADUCTIONS[LANGUE.courante];
  return (d && d[fr]) || fr;
}

/* Un champ traduit d'une fiche du catalogue, d'une catégorie ou des
   réglages. Le français est le champ nominal, la traduction vit à côté
   dans un objet portant le code de langue : sans elle, on rend le
   français, ce qui est le cas voulu pour les ressources extérieures. */
function champ(o, nom) {
  if (!o) return "";
  const tr = o[LANGUE.courante];
  return (tr && tr[nom]) || o[nom] || "";
}

// La langue du navigateur, ou le français : le portail est écrit ici.
function langueDepart() {
  let m = null;
  try { m = localStorage.getItem(CLE_LANGUE); } catch (e) { /* stockage refusé */ }
  return TRADUCTIONS[m] ? m : "fr";
}

/* Changer de langue : on retient le choix et on recharge. Voir le
   commentaire du module pour le pourquoi de ce rechargement. */
function langueChoisir(cle) {
  if (cle === LANGUE.courante) return;
  try { localStorage.setItem(CLE_LANGUE, cle); } catch (e) { /* non mémorisé */ }
  location.reload();
}

/* Le texte des éléments statiques d'index.html. Chacun porte en data-t la
   phrase française d'origine, qui sert de clé : le HTML reste lisible tel
   quel, et la traduction ne fait que la remplacer. */
function traduireStatiques() {
  if (LANGUE.courante === "fr") return;
  document.querySelectorAll("[data-t]").forEach(el => {
    const clefs = el.dataset.t.split("|");
    clefs.forEach(c => {
      const [ou, fr] = c.indexOf(":") > 0 ? [c.slice(0, c.indexOf(":")), c.slice(c.indexOf(":") + 1)] : ["texte", c];
      const v = mot(fr);
      if (v === fr) return;
      if (ou === "texte") {
        // On ne remplace que le premier noeud de texte : le reste du
        // contenu, icône ou sous-titre, a sa propre clé.
        const n = [...el.childNodes].find(x => x.nodeType === 3 && x.nodeValue.trim());
        if (n) n.nodeValue = n.nodeValue.replace(fr, v); else el.textContent = v;
      } else {
        el.setAttribute(ou, v);
      }
    });
  });
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
  appliquerTheme(memorise === "light" || memorise === "dark" ? memorise : "light");
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
const FOND = {
  cv: null, ctx: null, parts: [], t: 0, anime: null, L: 0, H: 0, dpr: 0, meteo: null, amb: null,
  allege: false, lentes: 0, dernierT: 0   // le poste allégé sur machine lente, voir fondAllegerSiLent
};

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

// Mélange deux teintes "r,g,b". C'est la clé de la promesse « la saison
// teinte tout » : une première version REMPLAÇAIT la palette de saison
// sous le couvert et l'orage — un été entier de ciel gris, et personne
// n'aurait jamais vu le doré d'août. Désormais le temps assourdit ou
// approfondit la saison, il ne l'efface pas.
function melerTeinte(de, vers, part) {
  const a = de.split(",").map(Number), b = vers.split(",").map(Number);
  return a.map((v, i) => Math.round(v + (b[i] - v) * part)).join(",");
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
    // La saison, désaturée par le ciel gris : l'été couvert reste un peu
    // chaud, l'hiver couvert un peu froid.
    const grisCouvert = cle === "sombre" ? "108,118,102" : "108,118,102";
    a.traits = a.traits.map(t => melerTeinte(t, grisCouvert, 0.55));
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
    // La saison, tirée vers les verts profonds de l'orage, sans disparaître.
    a.traits = a.traits.map(t => melerTeinte(t, cle === "sombre" ? "64,108,94" : "70,100,88", 0.5));
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
  // Une machine qui a montré qu'elle peinait garde un fond allégé même
  // après un changement de météo ou de thème : l'allégement ne se pose
  // qu'une fois, il ne se repose pas à chaque recalcul.
  if (FOND.allege) {
    FOND.amb.nb = Math.max(30, Math.round(FOND.amb.nb * FOND_ALLEGE_FACTEUR));
    FOND.amb.nuages = Math.max(3, Math.round(FOND.amb.nuages * FOND_ALLEGE_FACTEUR));
  }
  // Les nappes existantes survivent au changement d'ambiance, on ajuste
  // seulement leur nombre : le ciel glisse, il ne bascule pas.
  FOND.nuages = FOND.nuages || [];
  while (FOND.nuages.length < FOND.amb.nuages) FOND.nuages.push(graineNuage());
  FOND.nuages.length = FOND.amb.nuages;
  if (FOND.statique && FOND.ctx) { fondEffacer(); fondStatique(); }
}

/* Une machine modeste ne rattrape jamais un rythme qui lui échappe : sans
   garde-fou, elle saccade sans fin, un fond animé plein régime image après
   image. Le repère est le temps réel entre deux images, pas la puissance
   annoncée par le navigateur, puisque cores et mémoire ne disent rien du
   coût réel, qui dépend aussi de la fenêtre partagée, de l'onglet en
   arrière-plan, de l'économie d'énergie. Quatre-vingt-dix images d'affilée
   plus lentes que 33 ms, sous trente images par seconde, valent le geste :
   le fond s'allège une fois, par le même chemin qu'un changement de météo,
   et ne s'allège plus jamais une seconde fois, il ne repasse pas non plus
   au complet, sans quoi l'aller-retour ferait le va-et-vient qu'on cherche
   à éviter. Une pause d'onglet ne compte pas : la reprise recommence le
   compte à zéro dès la première image rapide. */
const FOND_ALLEGE_SEUIL_MS = 33;
const FOND_ALLEGE_IMAGES = 90;
const FOND_ALLEGE_FACTEUR = .6;

function fondAllegerSiLent(quand) {
  if (FOND.allege || typeof quand !== "number") return;
  if (FOND.dernierT) {
    FOND.lentes = quand - FOND.dernierT > FOND_ALLEGE_SEUIL_MS ? FOND.lentes + 1 : 0;
    if (FOND.lentes > FOND_ALLEGE_IMAGES) { FOND.allege = true; fondAmbiance(); }
  }
  FOND.dernierT = quand;
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
  p.condamne = false;
  p.retirer = false;

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

/* La mort n'existe qu'hors champ. Une version faisait expirer les
   particules au milieu de l'écran — d'abord sèchement, puis en se
   dissolvant en vol — et dans les deux cas le regard qui suivait un trait
   le perdait. Désormais un trait vit tant qu'il est visible : la dérive
   du vent, toujours positive, garantit que chacun finit par sortir du
   cadre, sa traînée le suit dehors, et c'est une fois le dernier point
   sorti qu'il renaît ailleurs. Le surplus d'un changement d'ambiance est
   condamné, pas exécuté : il vole normalement jusqu'à sa sortie
   naturelle, et n'est retiré que là. */
function fondHors(x, y, L, H) {
  return x < -24 || x > L + 24 || y < -90 || y > H + 24;
}

/* Le cadre se revérifie à chaque image. Les dimensions et la densité de
   pixels n'étaient relevées qu'une fois, au chargement et au
   redimensionnement, et la boucle leur faisait confiance pour toujours :
   il suffisait d'une mise en veille, d'un changement d'écran ou d'une
   perte du contexte graphique pour que la transformation du canvas
   retombe à un, que le dessin se replie sur une fraction de la page et
   n'en revienne plus avant rechargement. Le contrôle coûte trois lectures
   par image, la panne durait une pause déjeuner. Rendre false, c'est dire
   qu'il n'y a pas de surface : fenêtre réduite ou onglet ouvert en fond,
   le navigateur annonce une largeur nulle, et redimensionner le canvas à
   zéro le viderait pour rien. */
function fondCadrer() {
  const cv = FOND.cv, ctx = FOND.ctx;
  if (!cv || !ctx) return false;
  const L = window.innerWidth, H = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
  if (!L || !H) return false;
  if (L !== FOND.L || H !== FOND.H || dpr !== FOND.dpr) {
    FOND.L = L; FOND.H = H; FOND.dpr = dpr;
    cv.width = Math.round(L * dpr); cv.height = Math.round(H * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return true;
}

/* L'effacement porte sur la mémoire du canvas, en pixels physiques, et non
   sur la fenêtre. Calé sur FOND.L et FOND.H, il laissait hors de sa portée
   une bordure dès que le cadre dérivait, et les traînées s'y empilaient
   image après image jusqu'à former un tapis vert que plus rien ne
   reprenait. Ici, quelle que soit la transformation en cours, rien ne
   survit à une image. */
function fondEffacer() {
  const cv = FOND.cv, ctx = FOND.ctx;
  if (!cv || !ctx) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = FOND.amb.fond;
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.restore();
}

function fondPas(quand) {
  if (!fondCadrer()) { FOND.anime = requestAnimationFrame(fondPas); return; }
  fondAllegerSiLent(quand);
  const { ctx, parts, L, H } = FOND;
  const amb = FOND.amb;
  FOND.t += 0.5;
  fondEffacer();   // effacement complet : rien ne survit au délai
  if (amb.halo) peindreHalo(ctx);
  if (FOND.nuages && FOND.nuages.length) peindreNuages(ctx);

  if (parts.length < amb.nb) {
    parts.push(fondGraine({}, L, H));
  } else if (parts.length > amb.nb) {
    const surplus = parts.find(q => !q.condamne);
    if (surplus) surplus.condamne = true;
  }

  let retraits = false;
  for (const p of parts) {
    let sorti;
    if (p.genre === "flocon") {
      p.ph += 0.012;
      p.x += Math.sin(p.ph) * p.sw + amb.biaisX * 0.5;
      p.y += p.vy;
      // Le fondu de naissance seul : un flocon apparaît en douceur au
      // milieu de l'écran, mais il n'y meurt jamais — il tombe dehors.
      p.fondu = Math.min(1, (p.fondu || 0) + 0.03);
      ctx.fillStyle = "rgba(" + amb.precip + "," + (p.a * p.fondu) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      sorti = fondHors(p.x, p.y, L, H);
    } else if (p.genre === "goutte") {
      p.x += Math.cos(p.dir) * p.v;
      p.y += Math.sin(p.dir) * p.v;
      p.pts.push([p.x, p.y]);
      if (p.pts.length > p.long) p.pts.shift();
      fondTracer(ctx, p.pts, 0, p.pts.length - 1, amb.precip, p.a, p.e);
      // La tête sort la première, la queue la suit : la strie n'a fini de
      // vivre que quand son dernier point a quitté l'écran.
      sorti = fondHors(p.x, p.y, L, H) && fondHors(p.pts[0][0], p.pts[0][1], L, H);
    } else {
      const a = fondAngle(p.x, p.y, FOND.t) * amb.turbulence;
      p.x += Math.cos(a) * p.v + amb.biaisX;
      p.y += Math.sin(a) * p.v * 0.72 + amb.biaisY;
      p.pts.push([p.x, p.y]);
      if (p.pts.length > amb.trainee) p.pts.shift();
      const mi = Math.floor(p.pts.length / 2);
      fondTracer(ctx, p.pts, 0, mi, amb.traits[p.c], p.a * 0.35, p.e);
      fondTracer(ctx, p.pts, mi, p.pts.length - 1, amb.traits[p.c], p.a, p.e);
      sorti = fondHors(p.x, p.y, L, H) && fondHors(p.pts[0][0], p.pts[0][1], L, H);
    }

    if (sorti) {
      if (p.condamne || parts.length > amb.nb) { p.retirer = true; retraits = true; }
      else fondGraine(p, L, H);
    }
  }
  if (retraits) FOND.parts = parts.filter(p => !p.retirer);

  FOND.anime = requestAnimationFrame(fondPas);
}

function fondTheme() {
  // Au changement de thème, l'ambiance change de palette : recalcul, et la
  // version immobile se redessine tout de suite.
  if (!FOND.ctx) return;
  fondAmbiance();
  fondEffacer();
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
  FOND.cv = cv;
  FOND.ctx = ctx;
  FOND.statique = matchMedia("(prefers-reduced-motion: reduce)").matches;
  FOND.amb = calculerAmbiance();
  FOND.nuages = Array.from({ length: FOND.amb.nuages }, graineNuage);

  function taille() {
    if (!fondCadrer()) return;
    fondEffacer();
    if (FOND.statique) fondStatique();
  }
  taille();
  window.addEventListener("resize", taille);

  if (FOND.statique) return;

  // Sans surface au chargement (fenêtre réduite, onglet ouvert en fond), le
  // semis attend : la boucle repeuple ensuite une particule par image.
  FOND.parts = FOND.L ? Array.from({ length: FOND.amb.nb }, () => fondGraine({}, FOND.L, FOND.H)) : [];
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
  return t ? { libelle: mot(t[2]), icone: t[3] } : { libelle: mot("Temps mêlé"), icone: "nuage" };
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
    return "<div><dt>" + ech(mot(METRIQUES[k].nom)) + "</dt><dd>"
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
    + '<div class="tv-tete"><h3>' + ech(mot("Météo")) + '</h3><span class="espace"></span>'
    +   '<button type="button" class="btn-position" id="btnMeteoMaj" title="' + ech(mot("Actualiser le relevé"))
    +   '" aria-label="' + ech(mot("Actualiser le relevé")) + '">'
    +     ico("actualiser", 12) + "</button>"
    +   '<button type="button" class="btn-position" id="btnPosition" title="'
    +     ech(mot("Utiliser ma position")) + '">'
    +     ico("position", 12) + " " + ech(mot("ma position")) + "</button></div>"
    + '<div class="meteo-corps">'
    +   '<span class="meteo-icone">' + ico(t.icone, 46, 1.5) + "</span>"
    +   '<span class="meteo-temp">' + ech(virgule(mesure.temperature_2m)) + "<small>°C</small></span>"
    +   '<span class="meteo-quoi">'
    +     '<span class="meteo-libelle">' + ech(t.libelle) + "</span>"
    +     '<span class="meteo-lieu">' + ech(lieu.nom || mot("Position choisie")) + "</span>"
    +   "</span>"
    + "</div>"
    + '<dl class="meteo-mesures">' + html_mesuresTuile(mesure) + "</dl>"
    + '<p class="meteo-pied"><span>' + mot("Relevé") + " " + hhmm + "</span>"
    +   '<a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">' + ech(mot("données Open-Meteo")) + '</a></p>'
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
  if (v <= 20) return { t: mot("Bon"), c: "#7ab648" };
  if (v <= 40) return { t: mot("Correct"), c: "#a8c24a" };
  if (v <= 60) return { t: mot("D\u00e9grad\u00e9"), c: "#c9a227" };
  if (v <= 80) return { t: mot("Mauvais"), c: "#c4562f" };
  if (v <= 100) return { t: mot("Tr\u00e8s mauvais"), c: "#b0303f" };
  return { t: mot("Extr\u00eame"), c: "#8a2fb0" };
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
    + '<span class="md-sous">' + ech(LIEU_COURANT.nom || mot("Position choisie"))
    + " \u00b7 relev\u00e9 " + heureCourte(new Date(QUAND_COURANT - new Date().getTimezoneOffset() * 60000).toISOString()) + "</span></span>"
    + "</div>"
    + '<dl class="md-grille">'
    + Object.keys(METRIQUES).map(k => {
        let v; try { v = METRIQUES[k].val(m); } catch (e) { v = null; }
        return "<div><dt>" + ech(mot(METRIQUES[k].nom)) + "</dt><dd>"
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
    h += '<div class="stats-groupe"><h3 data-ico="horloge" data-ico-taille="13">' + ech(mot("Prochaines 24 heures")) + '</h3>'
      + '<div class="md-heures">' + hh + "</div></div>";
  }

  // ---- la semaine
  if (prev && prev.daily && prev.daily.time) {
    const D = prev.daily;
    const noms = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."].map(mot);
    h += '<div class="stats-groupe"><h3 data-ico="calendrier" data-ico-taille="13">' + ech(mot("La semaine")) + '</h3><div class="md-jours">'
      + D.time.map((jour, i) => {
          const w = tempsDe(D.weather_code[i]);
          const dj = new Date(jour + "T12:00");
          return '<div class="md-jour">'
            + '<span class="quand">' + (i === 0 ? mot("auj.") : noms[dj.getDay()] + " " + dj.getDate()) + "</span>"
            + ico(w.icone, 17)
            + '<span class="temps">' + ech(w.libelle) + "</span>"
            + '<span class="pluie">' + virgule(D.precipitation_sum[i]) + "\u00a0mm \u00b7 "
            + Math.round(D.precipitation_probability_max[i]) + "\u00a0% \u00b7 " + mot("vent") + " "
            + Math.round(D.wind_speed_10m_max[i]) + "</span>"
            + "<b>" + Math.round(D.temperature_2m_max[i]) + "\u00b0<small> / "
            + Math.round(D.temperature_2m_min[i]) + "\u00b0</small></b>"
            + "</div>";
        }).join("")
      + "</div></div>";

    // ---- le soleil du jour
    const dj = prev.daily;
    const duree = Math.round(dj.daylight_duration[0] / 60);
    h += '<div class="stats-groupe"><h3 data-ico="soleil" data-ico-taille="13">' + ech(mot("Le soleil")) + '</h3>'
      + '<dl class="md-grille">'
      + "<div><dt>" + mot("Lever") + "</dt><dd>" + heureCourte(dj.sunrise[0]) + "</dd></div>"
      + "<div><dt>" + mot("Coucher") + "</dt><dd>" + heureCourte(dj.sunset[0]) + "</dd></div>"
      + "<div><dt>Jour</dt><dd>" + Math.floor(duree / 60) + "\u00a0h\u00a0" + String(duree % 60).padStart(2, "0") + "</dd></div>"
      + "<div><dt>" + mot("UV max") + "</dt><dd>" + virgule(dj.uv_index_max[0]) + "</dd></div>"
      + "</dl></div>";
  }

  // ---- la qualité de l'air, si le service a répondu
  if (air && air.current && isFinite(air.current.european_aqi)) {
    const c = air.current;
    const q = libelleAqi(c.european_aqi);
    const pollen = [["Aulne", c.alder_pollen], ["Bouleau", c.birch_pollen], ["Gramin\u00e9es", c.grass_pollen]]
      .filter(x => isFinite(x[1]) && x[1] > 0);
    h += '<div class="stats-groupe"><h3 data-ico="feuille" data-ico-taille="13">' + ech(mot("Qualit\u00e9 de l\u2019air"))
      + ' <span class="aqi" style="--c:' + q.c + '"><i></i>' + ech(q.t) + " \u00b7 " + Math.round(c.european_aqi) + "</span></h3>"
      + '<dl class="md-grille">'
      + "<div><dt>PM2,5</dt><dd>" + virgule(c.pm2_5) + "\u00a0\u00b5g/m\u00b3</dd></div>"
      + "<div><dt>PM10</dt><dd>" + virgule(c.pm10) + "\u00a0\u00b5g/m\u00b3</dd></div>"
      + "<div><dt>NO\u2082</dt><dd>" + virgule(c.nitrogen_dioxide) + "\u00a0\u00b5g/m\u00b3</dd></div>"
      + "<div><dt>O\u2083</dt><dd>" + virgule(c.ozone) + "\u00a0\u00b5g/m\u00b3</dd></div>"
      + pollen.map(x => "<div><dt>" + mot("Pollen") + " " + mot(x[0]).toLowerCase() + "</dt><dd>" + Math.round(x[1]) + "\u00a0gr/m\u00b3</dd></div>").join("")
      + "</dl></div>";
  }

  // ---- le composeur de tuile
  const choisis = champsChoisis();
  h += '<div class="stats-groupe"><h3 data-ico="engrenage" data-ico-taille="13">' + ech(mot("Composer la tuile")) + '</h3>'
    + '<p class="note">Les mesures cochées sont celles que la tuile du portail affiche, jusqu\u2019\u00e0 '
    + CHAMPS_MAX + ". Ce choix reste dans ce navigateur.</p>"
    + '<div class="md-composer">'
    + Object.keys(METRIQUES).map(k =>
        '<label><input type="checkbox" data-champ="' + k + '"'
        + (choisis.indexOf(k) !== -1 ? " checked" : "") + "><span>"
        + ech(mot(METRIQUES[k].nom)) + "</span></label>").join("")
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
    + '<div class="tv-tete"><h3>' + ech(mot("Calendrier")) + '</h3><span class="espace"></span>'
    + '<span class="cal-semaine">' + mot("Semaine") + " " + semaineISO(auj) + "</span>"
    + '<span class="cal-nav">'
    +   '<button type="button" id="calPrec" aria-label="Mois précédent">' + ico("chevron_g", 13) + "</button>"
    +   '<button type="button" id="calSuiv" aria-label="Mois suivant">' + ico("chevron_d", 13) + "</button>"
    + "</span></div>"
    + '<div class="cal-mois">' + mot(MOIS[vue.getMonth()]) + " " + vue.getFullYear() + "</div>"
    + '<div class="cal-grille" role="grid" aria-label="Calendrier du mois">';

  h += '<span class="cal-ent" title="' + mot("Semaine") + '">S</span>';
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

   Deux rayons, en cartes tous les deux : nos outils, les ressources.
   Tout vient de catalogue.js. Le tableau s'y appelle PORTES pour des
   raisons historiques ; à l'écran, on parle d'outils et de ressources.
   --------------------------------------------------------------------- */
function estOutil(o) { return (o.type || "outil") === "outil"; }

/* Une porte disponible est une porte qui s'ouvre : un statut cliquable et
   une adresse. Le compteur d'accueil annonçait dix outils quand deux
   seulement s'ouvraient, les huit autres étant des fiches "Bientôt" sans
   adresse. La règle est celle des cartes en attente, poussée jusqu'au
   bout : une porte qu'on ne peut pas franchir ne se compte pas. */
function estDisponible(o) {
  const s = STATUTS[o.statut];
  return !!(s && s.cliquable && o.url);
}

function clesRecherche(o) {
  const cat = categorie(o.categorie);
  const sous = o.sousCategorie ? sousCategorie(o.sousCategorie) : null;
  return normaliser([champ(o, "nom"), champ(o, "pitch"), o.nom, o.pitch,
                     (o.tags || []).join(" "),
                     champ(cat, "nom"), champ(sous, "nom")].filter(Boolean).join(" "));
}

function html_badge(o) {
  const s = STATUTS[o.statut];
  if (!s || !s.pastille) return "";
  return '<span class="badge' + (o.statut === "beta" ? " beta" : "") + '">' + ech(mot(s.libelle)) + "</span>";
}

/* LA MEME CARTE POUR LES DEUX RAYONS. Les ressources ont d'abord vécu en
   rangées compactes pleine largeur, une forme à elles ; elles se lisent
   maintenant comme les outils, en cartes, et la page n'a plus qu'un objet.
   Rien ne les distinguait qui justifiât deux dessins : un nom, une phrase,
   une pastille à la couleur du domaine et un lien qui sort. Seule l'icône
   par défaut change, le livre pour une ressource et la grille pour un
   outil, et elle n'a de toute façon à servir que si le catalogue en oublie
   une. */
function html_carte(o, index) {
  const s = STATUTS[o.statut] || STATUTS["a-venir"];
  const cat = categorie(o.categorie);
  const c = couleurSure(cat && cat.couleur);
  const cliquable = estDisponible(o);
  const dedans =
      '<div class="carte-tete">'
    +   '<span class="carte-puce" style="--c:' + c + '">'
    +     ico(o.icone || (estOutil(o) ? "grille" : "livre"), 21) + "</span>"
    +   '<span class="carte-sortie">' + ico("sortie", 15) + "</span>"
    + "</div>"
    + '<span class="carte-nom">' + ech(champ(o, "nom")) + "</span>"
    + '<p class="carte-pitch">' + ech(champ(o, "pitch")) + "</p>"
    + html_badge(o);
  const attrs = ' class="carte apparait' + (cliquable ? "" : " attente") + '"'
    + ' data-porte="' + ech(o.id) + '"'
    + ' style="--c:' + c + ';--i:' + index + '" data-cherche="' + ech(clesRecherche(o)) + '"';
  return cliquable
    ? "<a" + attrs + ' href="' + ech(o.url) + '" target="_blank" rel="noopener noreferrer">' + dedans + "</a>"
    : "<div" + attrs + ">" + dedans + "</div>";
}

/* ---------------------------------------------------------------------
   LES RAYONS EN GROUPES, ET LE SOMMAIRE

   La page se déroule : c'est sa nature, et les détours essayés pour l'en
   empêcher (les dossiers de la v3, puis une ruche d'alvéoles hexagonales
   où l'on plongeait métier par métier) ont tous fini par être retirés,
   parce que cacher le catalogue derrière un clic coûte plus qu'il ne
   range. Les groupes s'alignent donc à plat, un par métier pour les
   outils, un par domaine pour les ressources, et c'est le sommaire fixé
   à droite de l'écran qui donne la vue d'ensemble : tous les métiers de
   la maison s'y lisent, ceux qui n'ont pas encore d'outil en attente, et
   un clic descend au groupe choisi.
   --------------------------------------------------------------------- */

/* Un groupe : un titre en capitales, une pastille à la couleur du métier,
   et ce qu'on veut dedans. La pastille n'est pas décorative, c'est le code
   couleur de lot B27 qui remonte du contenu jusqu'au titre : on lit le
   métier avant d'avoir lu son nom. L'identifiant est la cible du
   sommaire. */
function html_groupe(nom, couleur, dedans, id) {
  return '<div class="groupe aimant" id="' + ech(id) + '">'
    +   '<h3><span class="groupe-puce" style="--c:' + couleurSure(couleur) + '"></span>' + ech(nom) + "</h3>"
    +   dedans
    + "</div>";
}

// Les entrées du sommaire, remplies par construireRayons dans l'ordre de
// la page. Une entrée sans cible est un métier encore vide : elle se
// montre, estompée, mais ne mène nulle part.
const SOMMAIRE = [];

function construireSommaire() {
  const nav = $("sommaire");
  const entrees = SOMMAIRE.slice();
  if (!entrees.length) return;

  // Le fond du rail est une goutte : trois formes de la même couleur
  // pleine, fondues par le filtre #fonduSommaire. La bosse suit la bulle
  // visée, le badge porte son nom ; hub.css et initSommaire les animent.
  const goutte = '<div class="som-goo" aria-hidden="true">'
    + '<span class="som-rail"></span><span class="som-bosse"></span>'
    + '<span class="som-badge" id="somBadge"></span></div>';

  let blocPrecedent = entrees[0].bloc;
  nav.innerHTML = goutte + entrees.map(e => {
    const debut = e.bloc !== blocPrecedent ? " som-debut" : "";
    blocPrecedent = e.bloc;
    // Pas d'attribut title : il doublerait la bulle-étiquette d'une
    // infobulle native. Le nom vit dans la bulle, lue aussi au clavier.
    const dedans = '<span class="som-puce"></span>'
      + '<span class="som-nom">' + ech(e.cible ? e.nom : e.nom + " · " + mot("bientôt")) + "</span>";
    if (!e.cible) {
      return '<span class="som-ligne vide' + debut + '" style="--c:' + couleurSure(e.couleur) + '">'
        + dedans + "</span>";
    }
    return '<button type="button" class="som-ligne' + debut + '" style="--c:' + couleurSure(e.couleur) + '"'
      + ' data-cible="' + ech(e.cible) + '">' + dedans + "</button>";
  }).join("");
  nav.hidden = false;
}

/* ---------------------------------------------------------------------
   LE DÉFILEMENT, EN UN SEUL PASSAGE

   Trois écrans réagissent au défilement, le repère du sommaire, le
   magnétisme des groupes et la pilule d'ancrage, et posaient chacun son
   propre écouteur et sa propre image demandée au navigateur. Sur une
   même image de défilement, cela faisait donc jusqu'à trois écouteurs
   déclenchés et trois `requestAnimationFrame` distincts, chacun avec son
   propre indicateur "déjà prévu", pour un travail qui tient dans une
   seule image. Ici, une inscription commune : chaque script qui a besoin
   de savoir où l'on en est s'y ajoute au lieu de poser son propre
   mécanisme, et le geste de défilement ne coûte plus qu'un écouteur et
   une image, quel que soit le nombre d'écrans qui y répondent. */
const SUR_DEFILEMENT = [];
function surScrollInscrire(fn) { SUR_DEFILEMENT.push(fn); }
(function () {
  let prevu = false;
  function image() {
    prevu = false;
    for (const fn of SUR_DEFILEMENT) fn();
  }
  window.addEventListener("scroll", () => {
    if (!prevu) { prevu = true; requestAnimationFrame(image); }
  }, { passive: true });
})();

function initSommaire() {
  const nav = $("sommaire");
  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Le clic défile, l'adresse ne bouge pas : le portail n'a pas de
  // fragment, un lien copié mène toujours à la page entière.
  nav.addEventListener("click", ev => {
    const b = ev.target.closest("[data-cible]");
    if (!b) return;
    // Une bulle cliquée à la souris rend le focus : l'anneau vert et
    // l'étiquette du nom sont des repères de clavier, ils n'ont rien à
    // faire là quand on vient de désigner au doigt ce qu'on voulait voir.
    // ev.detail vaut zéro sur une activation au clavier, qui garde donc
    // ses repères, et au moins un sur un clic.
    if (ev.detail) b.blur();
    const cible = $(b.dataset.cible);
    if (!cible) return;
    // Le clic ne descend pas seulement au groupe, il le pose sous la ligne
    // de mire du magnétisme : ce qu'on a désigné arrive au foyer, en avant,
    // et le reste de la page s'estompe autour. C'est le même chemin que les
    // arrêts de la molette, donc exactement le même endroit à l'écran.
    const haut = aimantHaut(cible);
    const y = AIMANT.actif ? aimantOu(haut) : haut - 76;
    window.scrollTo({ top: y, behavior: reduit ? "auto" : "smooth" });
  });

  // Le repère marque le groupe où l'on se trouve. Quand le magnétisme du
  // déroulé est en place, c'est lui qui le désigne : les deux se
  // contrediraient au bord d'un groupe, et le sommaire doit marquer ce que
  // la page met en avant, pas un autre calcul. Sans magnétisme, quand le
  // poste demande moins d'animations, le repère se calcule seul : la
  // dernière cible passée au-dessus du tiers haut de l'écran.
  function marquer(cible) {
    nav.querySelectorAll(".som-ligne").forEach(b =>
      b.classList.toggle("actif", !!cible && b.dataset.cible === cible));
  }
  AIMANT.surFoyer = marquer;

  function reperer() {
    if (AIMANT.actif) return;
    const seuil = window.scrollY + innerHeight * 0.3;
    let courant = null;
    nav.querySelectorAll("[data-cible]").forEach(b => {
      const s = $(b.dataset.cible);
      if (s && !s.hidden && s.getBoundingClientRect().top + window.scrollY <= seuil) courant = b;
    });
    marquer(courant ? courant.dataset.cible : null);
  }
  surScrollInscrire(reperer);
  reperer();

  /* La vague magnétique. À l'approche du curseur, chaque bulle grossit
     selon sa distance verticale, en cloche de Gauss : la plus proche va
     jusqu'à deux fois et demie, ses voisines suivent en s'amortissant, et
     la colonne ne bouge pas puisque tout passe par un transform.

     La goutte suit la même cloche : la bosse du rail gonfle sur la bulle
     visée, et dès que le curseur est vraiment dessus, le badge se déplie
     avec son nom, fondu dans le rail par le filtre. L'écart type vaut
     environ une bulle et demie de pas : en dessous la vague est un
     à-coup, au-dessus toute la colonne gonfle d'un bloc. Sous
     prefers-reduced-motion, ni vague ni goutte : le CSS montre le nom en
     bulle simple au survol et tout reste immobile. */
  if (!reduit) {
    nav.classList.add("vague");
    const goutte = nav.querySelector(".som-goo");
    const badge = $("somBadge");
    const lignes = Array.prototype.slice.call(nav.querySelectorAll(".som-ligne"));
    let sourisY = null, vaguePrevue = false;
    function vague() {
      vaguePrevue = false;
      let proche = null, mini = Infinity, procheY = 0;
      lignes.forEach(b => {
        const r = b.getBoundingClientRect();
        const centre = r.top + r.height / 2;
        const d = sourisY === null ? Infinity : Math.abs(sourisY - centre);
        const g = sourisY === null ? 1 : 1 + 1.4 * Math.exp(-(d * d) / 900);
        b.style.setProperty("--g", g.toFixed(3));
        if (d < mini) { mini = d; proche = b; procheY = centre; }
      });
      const presence = sourisY === null ? 0 : Math.exp(-(mini * mini) / 900);
      if (proche && presence > 0.5) {
        badge.textContent = proche.querySelector(".som-nom").textContent;
      }
      if (proche) {
        goutte.style.setProperty("--by", (procheY - goutte.getBoundingClientRect().top) + "px");
      }
      goutte.style.setProperty("--b", (presence > 0.12 ? presence : 0).toFixed(3));
      goutte.style.setProperty("--e", presence > 0.5 ? "1" : "0");
    }
    nav.addEventListener("mousemove", ev => {
      sourisY = ev.clientY;
      if (!vaguePrevue) { vaguePrevue = true; requestAnimationFrame(vague); }
    });
    nav.addEventListener("mouseleave", () => { sourisY = null; requestAnimationFrame(vague); });
  }
}

/* ---------------------------------------------------------------------
   LE MAGNÉTISME DU DÉROULÉ

   La page se déroule, c'est sa nature, et le déroulé a maintenant un
   foyer : le groupe où l'on se trouve se tient en avant, un peu plus grand
   et à pleine encre, pendant que le reste recule et s'estompe en attendant
   son tour. On ne lit plus une liste, on lit ce qu'on regarde, et cliquer
   une bulle du sommaire amène vraiment son métier au foyer.

   C'est la vague magnétique du sommaire, la même cloche de Gauss, mais
   couchée le long de la page au lieu de la colonne des bulles. Le
   vocabulaire était déjà là, il n'a pas fallu en inventer un deuxième.
   hub.css tient les valeurs, hub.js ne pose qu'un nombre par groupe.

   LE FOYER SE CALCULE EN INDICE, PAS EN PIXELS. La ligne de mire, posée à
   un tiers de la hauteur d'écran, est projetée sur la suite des hauts de
   groupes : elle donne une position continue entre deux indices. La
   distance passe dans la cloche, chaque groupe reçoit son intensité en
   variable --f, et le CSS en fait une opacité, une échelle et une encre. En
   indice plutôt qu'en pixels, parce qu'un métier à une carte et un métier à
   six n'ont pas la même hauteur : mesurée en pixels, la vague serait large
   sur les grands groupes et sèche sur les petits, alors qu'elle doit valoir
   la même chose partout dans la page.

   DEUX DÉTAILS FONT LE MAGNÉTISME plutôt qu'un simple dégradé. La part
   fractionnaire de la position est tirée vers l'entier le plus proche : le
   foyer s'attarde sur un groupe puis bascule vite sur le suivant, comme une
   bille qui colle à un aimant avant de sauter au suivant. Et les intensités
   sont ramenées à leur maximum : il y a toujours exactement un groupe à
   pleine encre, jamais une page entière estompée.

   LES DEUX BOUTS DE LA PAGE DEMANDENT CHACUN LEUR SOIN. En haut, la mire
   tombe encore dans l'en-tête, au-dessus du premier groupe : elle se cale
   sur lui, il a le foyer d'entrée de jeu. En bas, le défilement bute avant
   de l'avoir amenée sur le dernier, qui resterait estompé sans plus rien à
   dérouler pour aller le chercher ; sur le dernier écran de défilement, la
   mire glisse donc vers le bas jusqu'à couvrir le bas du dernier groupe.
   Que le maximum ramène toujours un groupe à pleine encre ne suffisait pas,
   et l'erreur valait d'être payée : il garantit qu'un groupe est net, pas
   que celui-là puisse l'être.

   LA MOLETTE AVANCE D'UN GROUPE, ET D'UN SEUL. La page ne défile plus
   librement à la molette : elle va d'arrêt en arrêt, un par groupe, plus le
   haut de page et le pied. Tant que la molette n'a pas accumulé de quoi
   décrocher, rien ne bouge du tout ; le seuil franchi, la page glisse d'un
   cran et ignore la molette le temps du glissement. C'est franc et ça se
   jauge : deux ou trois crans par métier, jamais un de plus, jamais un
   retour en arrière.

   scroll-snap avait été essayé pour ça et retiré, la leçon vaut d'être
   gardée : le seuil d'un point d'accroche est à mi-chemin du suivant, si
   bien qu'un petit cran de molette se fait ramener en arrière, on se croit
   bloqué, et un coup un peu vif part loin puis atterrit sur le point le
   plus proche de l'endroit où il s'est arrêté, cinq métiers plus bas. Ni
   "proximity" ni "mandatory" ne savent avancer d'un cran et d'un seul.

   Le clavier avance de la même façon, d'un métier par touche : flèches,
   touches page, début et fin. Il défilait nativement de quelques dizaines
   de pixels, ce qui décalait la page sans jamais changer de métier.

   TOUT PASSE PAR TRANSFORM ET OPACITY : aucune hauteur, aucune marge ne
   change, la mise en page ne se déforme pas sous le défilement. Les
   positions se mesurent en offsetTop, jamais en getBoundingClientRect : un
   rectangle rendu est déjà grossi par la vague, la mesure nourrirait sa
   propre déformation. Et seuls les groupes dont l'intensité change vraiment
   sont réécrits, les autres, au loin, ne coûtent rien.
   --------------------------------------------------------------------- */
/* LA MIRE SE POSE SUR LE HAUT DU GROUPE, PAS SUR SON CENTRE, et c'est une
   correction payée à la règle posée sur l'écran. Centrer le groupe donnait
   un centre stable mais des cartes qui glissaient d'un cran à l'autre : un
   métier à une carte et un métier à quatre n'ont pas la même hauteur, et
   centrer la boîte fait bouger tout ce qu'elle contient. Le haut du groupe,
   lui, est un repère franc : le titre tombe toujours à la même ligne, la
   rangée de cartes commence toujours à la même, la hauteur du groupe
   n'ayant plus d'effet que sur ce qui dépasse en dessous.

   La valeur n'est pas libre : c'est là que les arrêts de la molette posent
   le haut d'un groupe, et la mire doit viser le même endroit, sans quoi la
   page s'arrêterait à un endroit et le foyer se poserait à un autre. Un
   tiers de la hauteur d'écran laisse au groupe courant la place de se
   déployer vers le bas et au précédent celle de s'estomper au-dessus. */
const AIMANT_MIRE = 0.34;    // la ligne de mire, en hauteur d'écran
const AIMANT_ECART = 0.45;   // l'écart type de la cloche, en groupes
const AIMANT_COLLE = 0.78;   // la force qui tire le foyer vers un groupe entier
const AIMANT_NET = 0.9;      // au-dessus, le groupe est au foyer et ne se floute pas
const AIMANT_CRAN = 100;     // molette à accumuler, en pixels, pour un cran
const AIMANT_CADENCE = 110;  // ms au minimum entre deux crans venus de la molette
const AIMANT_VISEE = 700;    // ms au bout desquelles l'arrêt visé n'a plus cours
const AIMANT_SUIVI = 0.22;   // part de l'écart rattrapée par image de glissement

const AIMANT = {
  unites: [],      // { el, ancre, cible, rayon, f }, dans l'ordre de la page
  arrets: [],      // les positions de défilement où la molette s'arrête
  bout: 0,         // la fin de la course de défilement, retenue à la mesure
  mireV: 0,        // la part d'écran au-dessus de la mire, retenue à la mesure
  rallonge: 0,     // la course ajoutée en pied pour que le dernier groupe s'y pose
  sens: 1,         // le sens du dernier défilement, pour le glissement de l'entête
  dernierY: 0,     // la position au passage précédent, qui donne ce sens
  vise: null,      // l'arrêt visé, qui peut être devant la position réelle
  viseQuand: 0,    // quand il a été posé, pour le laisser périmer
  anime: 0,        // l'image demandée pour le glissement en cours, 0 si repos
  actif: false,    // le poste accepte les animations et la page a des groupes
  foyer: null,     // la cible du groupe au foyer, pour le repère du sommaire
  surFoyer: null   // le rappel que le sommaire vient poser
};

// La position d'un élément dans la page, hors de toute déformation :
// getBoundingClientRect rendrait le rectangle déjà grossi par la vague.
function aimantHaut(el) {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
}

// La suite des groupes et leurs centres, mesurés une fois pour toutes
// jusqu'au prochain changement de mise en page. Un groupe caché, par la
// recherche ou par un rayon vide, ne compte pas.
function aimantMesurer() {
  AIMANT.unites = [];
  document.querySelectorAll(".aimant").forEach(el => {
    if (!el.offsetHeight) return;
    const rayon = el.closest(".rayon");
    // Le nom du rayon, sans son sous-titre : c'est lui qui se lit en entête.
    const h2 = rayon ? rayon.querySelector(":scope > h2") : null;
    const brut = h2 ? (h2.firstChild && h2.firstChild.nodeType === 3
                       ? h2.firstChild.nodeValue : h2.textContent) : "";
    const haut = aimantHaut(el);
    AIMANT.unites.push({
      el: el,
      ancre: haut,                       // le haut du groupe, ce que la mire vise
      cible: el.classList.contains("groupe") ? el.id : (rayon ? rayon.id : ""),
      rayon: (brut || "").trim(),
      f: null
    });
  });
  /* LA PAGE SE DONNE LA COURSE QU'IL LUI FAUT, et c'est une correction
     payée à la règle posée sur l'écran. Le dernier groupe doit pouvoir se
     poser sous la mire comme les autres, or la page s'arrête bien avant :
     ce qui le suit, la marge de pied, ne fait pas une hauteur d'écran. La première réponse avait été de faire glisser la mire
     vers le bas en fin de page, et c'était la mauvaise : le foyer arrivait
     bien sur le dernier groupe, mais la mire n'étant plus à la même hauteur
     d'écran, les derniers groupes se posaient de plus en plus bas, jusqu'à
     deux cent soixante pixels d'écart avec les premiers.

     La bonne réponse est de rallonger la page du strict nécessaire. La mire
     reste alors à hauteur fixe d'un bout à l'autre, tout groupe se pose au
     même endroit à l'écran, et le dernier arrêt tombe sur la fin de la
     course. La rallonge se pose en pied du corps, sous tout le reste : elle n'entre pas dans la mesure des groupes, qui la
     précèdent, et n'agite donc pas l'observateur de mise en page. */
  const V = innerHeight * AIMANT_MIRE;
  const dernier = AIMANT.unites[AIMANT.unites.length - 1];
  const posee = AIMANT.rallonge || 0;
  const naturelle = document.documentElement.scrollHeight - posee;
  const voulue = dernier && document.body.classList.contains("aimante")
    ? Math.max(0, Math.round(dernier.ancre + innerHeight - V - naturelle))
    : 0;
  if (voulue !== posee) {
    AIMANT.rallonge = voulue;
    document.body.style.paddingBottom = voulue ? voulue + "px" : "";
  }
  AIMANT.mireV = V;
  // La fin de la course, retenue ici : elle ne change qu'avec la mise en
  // page, et la lire à chaque trame coûterait un calcul de mise en page.
  AIMANT.bout = Math.max(0, document.documentElement.scrollHeight - innerHeight);

  /* Les arrêts de la molette : le haut de page, puis chaque groupe posé
     sous la mire. Le haut de page en est un à part entière, sinon le
     premier cran arracherait le visiteur à l'en-tête sans qu'il puisse y
     revenir à la molette. Le dernier groupe ferme la marche et il n'y a
     rien à ajouter derrière : la rallonge fait tomber son arrêt sur la fin
     de la course. Deux groupes qui butent sur la même position ne comptent
     que pour un arrêt, un cran devant toujours déplacer la page. */
  AIMANT.arrets = [0];
  AIMANT.unites.forEach(u => {
    const y = Math.round(aimantOu(u.ancre));
    if (y > AIMANT.arrets[AIMANT.arrets.length - 1] + 8) AIMANT.arrets.push(y);
  });
}

/* L'ARRÊT VISÉ, ET POURQUOI IL EXISTE. Un premier jet ignorait molette et
   clavier pendant le glissement, pour qu'une secousse un peu longue
   n'enchaîne pas des crans qu'on n'a pas voulus. Le remède était pire que
   le mal : on ne pouvait plus enchaîner du tout, et un technicien pressé
   qui martèle la flèche n'avançait que d'un métier par demi-seconde.

   Les crans se comptent donc depuis là où l'on va, pas depuis là où l'on
   est. Cinq pressions coup sur coup valent cinq métiers, le glissement se
   contentant de rattraper la cible qui a bougé sous lui. La visée périme
   au bout de sept dixièmes de seconde, de sorte qu'un défilement venu
   d'ailleurs, une tabulation ou un doigt sur l'écran, ne laisse pas de
   trace. */
function aimantVise() {
  if (AIMANT.vise !== null && performance.now() - AIMANT.viseQuand > AIMANT_VISEE) {
    AIMANT.vise = null;
  }
  return AIMANT.vise;
}

// D'où compter le prochain cran : l'arrêt visé s'il vaut encore, la
// position réelle sinon.
function aimantDepart() {
  const v = aimantVise();
  return v !== null ? v : aimantArret();
}

/* Aller à un arrêt donné. Un indice hors des bornes n'est pas refusé, il
   est ramené dedans : un geste ample doit finir sa course contre le bout
   plutôt que d'être annulé. C'est seulement quand on y est déjà que ça
   bute. */
function aimantAller(i) {
  const a = AIMANT.arrets;
  if (a.length < 2) return;
  const j = Math.max(0, Math.min(a.length - 1, i));
  const v = aimantVise();
  if (j === v || (v === null && Math.abs(a[j] - window.scrollY) < 2)) {
    if (i !== j) aimantButee(i < 0 ? -1 : 1);
    return;
  }
  AIMANT.vise = j;
  AIMANT.viseQuand = performance.now();
  sonJouer(a[j] > window.scrollY ? "cranBas" : "cranHaut");
  if (!AIMANT.anime) AIMANT.anime = requestAnimationFrame(aimantGlisser);
}

/* LE GLISSEMENT EST TENU ICI, ET NON PAR LE NAVIGATEUR. Un scrollTo en
   "smooth" relance son animation à chaque nouvelle cible : sur une volée de
   crans, la page repart en accélérant à chaque fois, ce qui se voit comme un
   sautillement, puis saute d'un bloc à la dernière cible quand la volée
   s'arrête. Ici la cible peut bouger sous le glissement sans rien casser :
   la position la rejoint d'un cinquième de l'écart par image, et une cible
   qui s'éloigne ne fait qu'allonger la course, sans à-coup ni redémarrage.

   C'est l'inertie de la molette des panneaux, au même coefficient : le
   portail n'a qu'une façon de glisser. */
function aimantGlisser() {
  const cible = AIMANT.arrets[AIMANT.vise];
  if (cible === undefined) { AIMANT.anime = 0; return; }
  const ecart = cible - window.scrollY;
  const pas = ecart * AIMANT_SUIVI;
  // Sous le pixel, l'amortissement n'avance plus : la position de
  // défilement est quantifiée et un pas de moins d'un pixel se perd à
  // l'arrondi, le glissement s'arrêtant alors deux pixels court. On pose
  // la cible d'un coup, les quatre derniers pixels ne se voient pas et
  // l'axe, lui, se mesure à la règle.
  if (Math.abs(pas) < 1) {
    AIMANT.anime = 0;
    window.scrollTo(0, cible);
    return;
  }
  window.scrollTo(0, window.scrollY + pas);
  AIMANT.anime = requestAnimationFrame(aimantGlisser);
}

/* La butée : le groupe au foyer se déporte de onze pixels dans le sens
   contraire au geste et revient, comme un tiroir qui bute. Le déplacement
   passe par la propriété translate, pas par transform : celui-ci porte déjà
   le grossissement du magnétisme, une animation le remplacerait et le
   groupe perdrait sa taille le temps du rebond. */
function aimantButee(sens) {
  sonJouer("butee");
  const u = AIMANT.unites.find(x => x.cible === AIMANT.foyer);
  if (!u) return;
  u.el.style.setProperty("--butee", (sens > 0 ? -11 : 11) + "px");
  u.el.classList.remove("bute");
  void u.el.offsetWidth;          // sans ce calcul forcé, l'animation ne rejoue pas
  u.el.classList.add("bute");
  clearTimeout(AIMANT.minuteurButee);
  AIMANT.minuteurButee = setTimeout(() => u.el.classList.remove("bute"), 340);
}

// L'arrêt où l'on se trouve : le plus proche de la position courante.
function aimantArret() {
  let i = 0, mini = Infinity;
  AIMANT.arrets.forEach((v, k) => {
    const d = Math.abs(v - window.scrollY);
    if (d < mini) { mini = d; i = k; }
  });
  return i;
}

// Un ou plusieurs crans, dans le sens du signe : la page glisse à l'arrêt
// qui se trouve autant de rangs plus loin.
function aimantCran(pas) {
  if (AIMANT.arrets.length < 2) return;
  aimantAller(aimantDepart() + pas);
}

/* LA MOLETTE A UNE CADENCE, ET C'EST TOUT CE QUI LA BORNE. Elle accumule,
   et une tranche de AIMANT_CRAN pixels vaut un cran : une pichenette en
   donne un tout de suite, et un coup vif en donne un tous les
   AIMANT_CADENCE, soit environ neuf par seconde tant qu'on tourne.

   La cadence a remplacé une borne par secousse, qui ne tenait pas la
   route : un coup vif n'envoie pas un événement mais une rafale, et deux
   crans par événement en faisaient dix ou quinze pour un seul geste, la
   page traversant dix métiers d'un bloc. Borner la rafale n'aurait pas
   suffi non plus, elle aurait fixé une distance maximale par geste au lieu
   de laisser aller loin qui tourne longtemps. Une cadence, elle, ne prend
   rien à personne : elle étale simplement ce qui arrive trop vite pour
   être vu.

   Le seuil franchi pendant l'attente n'est pas jeté, il reste armé : dès
   que la cadence rouvre, le cran part. Ce qui dépasse ce seuil est perdu,
   sans quoi une rafale se mettrait en réserve et repartirait toute seule.
   Changer de sens repart de zéro, on ne franchit pas un cran par
   accumulation de va-et-vient.

   Le zoom du navigateur (Ctrl + molette) et un panneau ouvert, qui a son
   propre moteur de molette, passent à travers sans être touchés. */
function initAimantMolette() {
  let cumul = 0, sensPrec = 0, quand = 0;
  window.addEventListener("wheel", ev => {
    if (!document.body.classList.contains("aimante")) return;
    if (ev.ctrlKey) return;
    if (document.querySelector(".modale[open]")) return;
    ev.preventDefault();
    const dy = ev.deltaMode === 1 ? ev.deltaY * 16
             : ev.deltaMode === 2 ? ev.deltaY * innerHeight
             : ev.deltaY;
    if (!dy) return;
    const sens = dy > 0 ? 1 : -1;
    if (sens !== sensPrec) { cumul = 0; sensPrec = sens; }
    cumul += dy;
    if (Math.abs(cumul) < AIMANT_CRAN) return;
    const t = performance.now();
    if (t - quand < AIMANT_CADENCE) { cumul = sens * AIMANT_CRAN; return; }
    quand = t;
    cumul = 0;
    aimantCran(sens);
  }, { passive: false });
}

/* LE CLAVIER AVANCE COMME LA MOLETTE, d'un métier par touche. Les flèches
   haut et bas, les touches page, début et fin : une pression, un cran. Il
   défilait nativement de quelques dizaines de pixels, ce qui décalait la
   page sans jamais changer de métier, un déplacement qui ne mène nulle
   part ; une touche est une intention discrète, elle mérite un cran entier
   et n'a rien à accumuler. Rien ne la retient non plus : marteler la flèche
   avance d'autant de métiers, la visée comptant les crans plus vite que le
   glissement ne les rattrape. Un technicien pressé doit pouvoir l'être.

   Rien n'est repris quand on écrit dans la recherche, quand un panneau est
   ouvert, ni quand une touche de commande accompagne la flèche : ces
   raccourcis appartiennent au navigateur. La tabulation n'est pas touchée
   non plus, elle garde son rôle et amène au foyer le groupe qu'elle
   atteint. */
function initAimantClavier() {
  const crans = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1 };
  document.addEventListener("keydown", ev => {
    if (!document.body.classList.contains("aimante")) return;
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    if (document.querySelector(".modale[open]")) return;
    const ou = document.activeElement;
    if (ou && /^(INPUT|TEXTAREA|SELECT)$/.test(ou.tagName)) return;
    if (ev.key === "Home" || ev.key === "End") {
      ev.preventDefault();
      aimantAller(ev.key === "Home" ? 0 : AIMANT.arrets.length - 1);
      return;
    }
    const sens = crans[ev.key];
    if (!sens) return;
    ev.preventDefault();
    aimantCran(sens);
  });
}

/* La ligne de mire, en position de page : la position de défilement plus
   la part d'écran qui la surplombe, et rien d'autre. Elle est à hauteur
   fixe d'un bout à l'autre de la page, et c'est cette fixité qui garantit
   qu'un groupe se pose toujours au même endroit à l'écran. La page se
   rallonge en pied plutôt que de la faire glisser. */
function aimantMire() {
  return window.scrollY + AIMANT.mireV;
}

/* Le chemin inverse : la position de défilement qui pose la mire sur un
   point donné de la page. C'est elle qui place les arrêts de la molette et
   la cible d'un clic au sommaire, pour que la page s'arrête exactement là
   où le groupe s'allume. */
function aimantOu(cible) {
  return Math.max(0, Math.min(AIMANT.bout, cible - AIMANT.mireV));
}

// La ligne de mire projetée sur la suite des ancres : un indice continu.
// Au-dessus du premier groupe ou sous le dernier elle se cale sur
// l'extrémité, sans quoi ni le premier ni le dernier n'aurait droit au
// foyer, l'un parce que la mire tombe encore dans l'en-tête, l'autre parce
// que le défilement bute avant de l'avoir atteint.
function aimantIndice(mire) {
  const u = AIMANT.unites;
  if (mire <= u[0].ancre) return 0;
  for (let i = 0; i < u.length - 1; i++) {
    if (mire <= u[i + 1].ancre) {
      const pas = u[i + 1].ancre - u[i].ancre;
      return pas > 0 ? i + (mire - u[i].ancre) / pas : i;
    }
  }
  return u.length - 1;
}

// L'aimantation : la part fractionnaire est tirée vers l'entier le plus
// proche par une sinusoïde. La fonction reste croissante, sa pente valant
// au minimum 1 - AIMANT_COLLE : le foyer ne recule jamais quand on descend,
// il ralentit sur un groupe puis passe vite au suivant.
function aimantColler(p) {
  const i = Math.floor(p), f = p - i;
  return i + f - AIMANT_COLLE * Math.sin(2 * Math.PI * f) / (2 * Math.PI);
}

/* Le nom du rayon en entête. Il ne change qu'au passage d'un rayon à
   l'autre, et le changement est un glissement : le sortant part dans le
   sens où l'on défile, l'entrant arrive du bord opposé. Le premier nom se
   pose sans animation, il n'a rien à remplacer. Le nom retenu en dataset
   est celui qui fait foi : deux passages coup sur coup se règlent sur le
   dernier, pas sur celui du milieu. */
function aimantEntete(nom) {
  const el = $("enteteRayon");
  if (!el || el.dataset.nom === nom) return;
  const premier = el.dataset.nom === undefined;
  el.dataset.nom = nom;
  if (premier) { el.textContent = nom; return; }
  sonJouer("passage");
  el.style.setProperty("--d", AIMANT.sens >= 0 ? "1" : "-1");
  el.classList.add("sort");
  clearTimeout(AIMANT.minuteur);
  AIMANT.minuteur = setTimeout(() => {
    el.textContent = el.dataset.nom;
    el.classList.add("entre");
    el.classList.remove("sort");
    void el.offsetWidth;     // sans ce calcul forcé, le retour ne s'anime pas
    el.classList.remove("entre");
  }, 220);
}

function aimantPeindre() {
  const u = AIMANT.unites;
  if (!u.length) return;
  const y = window.scrollY;
  if (y !== AIMANT.dernierY) { AIMANT.sens = y > AIMANT.dernierY ? 1 : -1; AIMANT.dernierY = y; }
  // Arrivé à l'arrêt visé, la visée n'a plus de raison d'être : le cran
  // suivant repart de la position réelle. Pas tant que le glissement court,
  // en revanche : il vise cette même valeur, la lui retirer le laisserait à
  // un ou deux pixels de l'axe, et cet axe se mesure à la règle.
  if (!AIMANT.anime && AIMANT.vise !== null
      && Math.abs(y - (AIMANT.arrets[AIMANT.vise] || 0)) < 2) {
    AIMANT.vise = null;
  }
  const p = aimantColler(aimantIndice(aimantMire()));
  const deux = 2 * AIMANT_ECART * AIMANT_ECART;
  let sommet = 0, gagnant = null;
  const poids = u.map((g, i) => {
    const w = Math.exp(-((i - p) * (i - p)) / deux);
    if (w > sommet) { sommet = w; gagnant = g; }
    return w;
  });
  u.forEach((g, i) => {
    // Ramenées au maximum : le groupe du foyer vaut exactement 1, donc une
    // opacité pleine, donc ses cartes gardent leur verre. Un groupe dont
    // l'intensité n'a pas bougé n'est pas réécrit.
    const f = (poids[i] / sommet).toFixed(3);
    if (f === g.f) return;
    g.f = f;
    g.el.style.setProperty("--f", f);
    // Le flou est une classe, pas un calcul continu : un filtre, même
    // blur(0), isole ce qu'il y a derrière l'élément, et le groupe au
    // foyer y perdrait le verre de ses cartes. Il n'en porte donc aucun.
    g.el.classList.toggle("flou", +f < AIMANT_NET);
  });
  const cible = gagnant ? gagnant.cible : null;
  if (cible !== AIMANT.foyer) {
    AIMANT.foyer = cible;
    if (AIMANT.surFoyer) AIMANT.surFoyer(cible);
  }
  aimantEntete(gagnant ? gagnant.rayon : "");
}

function initAimant() {
  // Un poste qui demande moins d'animations garde la page à plat : un effet
  // attaché au défilement est exactement ce que la préférence vise.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  aimantMesurer();
  if (AIMANT.unites.length < 2) return;   // un seul groupe n'a personne à estomper

  AIMANT.actif = true;
  document.body.classList.add("aimante");
  aimantMesurer();          // la rallonge de pied attend que la classe soit posée
  aimantPeindre();
  initAimantMolette();
  initAimantClavier();

  surScrollInscrire(aimantPeindre);

  /* Le clavier ne se perd pas dans le lointain. Les cartes hors foyer ne
     reçoivent plus le curseur, mais la tabulation les atteint toujours, et
     elle y serait aveugle : six centièmes d'opacité sous cinq pixels de
     flou. Dès qu'une carte prend le focus, son groupe vient au foyer, à
     l'arrêt même où la molette l'aurait posé. Un clic ne déclenche rien
     ici : la carte cliquée est forcément celle du groupe au foyer, donc
     déjà à sa place. */
  document.addEventListener("focusin", ev => {
    if (!document.body.classList.contains("aimante")) return;
    const el = ev.target.closest && ev.target.closest(".aimant");
    if (!el) return;
    const u = AIMANT.unites.find(x => x.el === el);
    if (!u) return;
    const y = aimantOu(u.ancre);
    if (Math.abs(y - window.scrollY) < 2) return;
    window.scrollTo({ top: y, behavior: "smooth" });
  });

  const remesurer = () => { aimantMesurer(); aimantPeindre(); };
  window.addEventListener("resize", remesurer);
  // La mise en page bouge aussi sans que la fenêtre change ni que la page
  // défile : la tuile météo qui arrive, une recherche qui vide des groupes,
  // une police qui finit de charger. La toute première notification est
  // celle de la pose de l'observateur, elle n'annonce rien de nouveau.
  if (window.ResizeObserver) {
    let pose = true;
    new ResizeObserver(() => {
      if (pose) { pose = false; return; }
      remesurer();
    }).observe(document.querySelector(".portail"));
  }
}

// Pendant une recherche, le magnétisme se retire : les résultats se lisent
// tous à la même encre, et un foyer désignerait des groupes à moitié vidés.
// C'est la raison qui efface déjà le sommaire.
function aimantRecherche(cherche) {
  if (!AIMANT.actif) return;
  document.body.classList.toggle("aimante", !cherche);
  if (!cherche) { aimantMesurer(); aimantPeindre(); }
}

function construireRayons() {
  const outils = PORTES.filter(estOutil);
  const liens = PORTES.filter(o => !estOutil(o));
  SOMMAIRE.length = 0;

  // Nos outils se groupent par métier, dans l'ordre de CATEGORIES : le lot
  // du bureau d'études, pas un rangement inventé pour l'occasion. Un métier
  // sans outil n'a pas de groupe dans la page, une section vide serait du
  // bruit, mais garde sa ligne au sommaire, estompée : c'est ainsi que le
  // portail montre les métiers de la maison avant d'avoir écrit leurs
  // outils.
  if (outils.length) {
    let i = 0;
    const groupes = CATEGORIES
      .map(cat => ({ cle: cat.cle, nom: champ(cat, "nom"), court: champ(cat, "court"), couleur: cat.couleur,
                     metier: cat.metier,
                     portes: outils.filter(o => o.categorie === cat.cle) }))
      .filter(g => g.portes.length || g.metier);

    // Un outil qui se réclame d'un métier non déclaré ne doit pas
    // disparaître en silence : le contrôle du catalogue le signale déjà, et
    // ici il atterrit dans un groupe de fin plutôt que nulle part.
    const orphelins = outils.filter(o => !categorie(o.categorie));
    if (orphelins.length) {
      groupes.push({ cle: "divers", nom: mot("Divers"), court: mot("Divers"), couleur: "", portes: orphelins });
    }

    $("groupesOutils").innerHTML = groupes.filter(g => g.portes.length).map(g =>
      html_groupe(g.nom, g.couleur,
        '<div class="grille-outils">' + g.portes.map(o => html_carte(o, i++)).join("") + "</div>",
        "groupe-" + g.cle)).join("");
    groupes.forEach(g => SOMMAIRE.push({
      nom: g.court || g.nom, couleur: g.couleur,
      cible: g.portes.length ? "groupe-" + g.cle : null, bloc: "outils"
    }));
    $("rayonOutils").hidden = false;
  }

  // Les ressources se groupent par sous-catégorie, dans l'ordre où elles
  // sont déclarées ; ce qui n'en a pas se groupe par catégorie. Une
  // sous-catégorie sans teinte propre hérite de celle de sa catégorie.
  if (liens.length) {
    const groupes = [];
    const toutesSous = typeof SOUS_CATEGORIES === "undefined" ? [] : SOUS_CATEGORIES;
    toutesSous.forEach(sc => {
      const dedans = liens.filter(o => o.sousCategorie === sc.cle);
      const parent = categorie(sc.categorie);
      if (dedans.length) {
        groupes.push({ cle: sc.cle, nom: champ(sc, "nom"), court: champ(sc, "court"),
                       couleur: sc.couleur || (parent && parent.couleur), portes: dedans });
      }
    });
    CATEGORIES.forEach(cat => {
      const dedans = liens.filter(o => o.categorie === cat.cle && !o.sousCategorie);
      if (dedans.length) {
        groupes.push({ cle: "cat-" + cat.cle, nom: champ(cat, "nom"), court: champ(cat, "court"),
                       couleur: cat.couleur, portes: dedans });
      }
    });

    let i = 0;
    $("groupesRessources").innerHTML = groupes.map(g =>
      html_groupe(g.nom, g.couleur,
        '<div class="grille-outils">' + g.portes.map(o => html_carte(o, i++)).join("") + "</div>",
        "groupe-r-" + g.cle)).join("");
    groupes.forEach(g => SOMMAIRE.push({
      nom: g.court || g.nom, couleur: g.couleur, cible: "groupe-r-" + g.cle, bloc: "ressources"
    }));
    $("rayonRessources").hidden = false;
  }

  // Le compteur annonce ce qui s'ouvre, rien d'autre. Il a d'abord compté
  // les dix-sept cartes du rayon, puis les dix qui portaient un nom : les
  // huit fiches "Bientôt" y restaient, sans adresse ni page derrière. Une
  // carte en attente et un outil annoncé se ressemblent pour qui compte,
  // ils promettent tous les deux. Le détail des uns et des autres se lit
  // dans le panneau À propos, à sa place.
  const reels = outils.filter(estDisponible);
  const ouverts = liens.filter(estDisponible);
  const morceaux = [];
  if (reels.length) morceaux.push(reels.length + " " + mot(reels.length > 1 ? "outils" : "outil"));
  if (ouverts.length) morceaux.push(ouverts.length + " " + mot(ouverts.length > 1 ? "ressources" : "ressource"));
  $("compte").textContent = morceaux.join("  ·  ");

  const accroche = champ(REGLAGES, "accroche");
  $("devise").textContent = accroche;
  $("devise").hidden = !accroche;
  document.title = champ(REGLAGES, "titre");
  $("titrePortail").textContent = champ(REGLAGES, "titre");
  $("embleme").innerHTML = logoB27(58);
  construireSommaire();
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

  // Pendant une recherche, le sommaire s'efface : ses repères pointeraient
  // des groupes à moitié vidés. Il revient dès que le champ se vide.
  document.body.classList.toggle("cherche", !!q);

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
  [["rayonOutils", "groupesOutils"],
   ["rayonRessources", "groupesRessources"]].forEach(([rayon, dedans]) => {
    const vide = !$(dedans).querySelector("[data-cherche]:not([hidden])");
    $(rayon).hidden = vide || !$(dedans).innerHTML;
  });

  $("tuilesVives").hidden = !!q;
  aimantRecherche(!!q);
  $("rienTrouve").hidden = !(q && visibles === 0);
  if (q && visibles === 0) {
    $("rienTrouve").textContent = mot("Aucun résultat pour") + " «\u00a0" + brut.trim() + "\u00a0».";
  }
}

function initRecherche() {
  if (PORTES.length < (REGLAGES.seuilFiltres || 0)) return;
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
   L'emblème vient se poser dans une pastille fixe en haut au centre, le
   titre restant en haut de page : sous la pastille se lit le nom du rayon,
   et deux textes l'un sur l'autre en auraient fait une étiquette. L'emblème
   du héros s'efface en s'éloignant, et les tuiles
   vivantes, ancrées, se replient en pastilles — la température d'un côté,
   le numéro de semaine de l'autre. Cliquer sur la pilule ou une pastille
   ramène en haut.

   Tout est en glissement : une classe sur body, des transitions CSS, et un
   effacement progressif calé sur la position de défilement. Rien ne
   clignote, rien ne saute — la règle du calme s'applique ici aussi.
   --------------------------------------------------------------------- */
const SEUIL_ANCRE = 260;   // px de défilement avant que la pilule se pose

function initAncre() {
  $("ancreLogo").innerHTML = logoB27(20);

  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const embleme = $("embleme");
  const titre = $("titrePortail");

  function surDefilement() {
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
  surScrollInscrire(surDefilement);
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
  const tous = PORTES.filter(estOutil);
  const outils = tous.filter(estDisponible).length;
  const bientot = tous.filter(o => !o.attente && !estDisponible(o)).length;
  const attente = tous.filter(o => o.attente).length;
  const liens = PORTES.filter(o => !estOutil(o) && estDisponible(o)).length;
  const majs = PORTES.map(o => o.maj).filter(Boolean).sort();
  const anomalies = controlerCatalogue();

  let h = '<div class="stats-groupe"><h3 data-ico="grille" data-ico-taille="13">' + ech(mot("Le portail")) + '</h3>'
    + '<dl class="stats-liste">'
    + ligneStat(mot("Nos outils"), outils)
    + (bientot ? ligneStat(mot("Outils à venir"), bientot) : "")
    + (attente ? ligneStat(mot("Métiers en attente"), attente) : "")
    + ligneStat(mot("Ressources"), liens)
    + ligneStat(mot("Dernière mise à jour du catalogue"), majs.length ? dateFr(majs[majs.length - 1]) : mot("non renseignée"))
    + ligneStat(mot("Thème courant"), mot(document.documentElement.dataset.theme === "dark" ? "sombre" : "clair"))
    + "</dl></div>";

  if (anomalies.length) {
    h += '<div class="stats-groupe"><h3 data-ico="attention" data-ico-taille="13">' + ech(mot("Anomalies du catalogue")) + '</h3>'
      + '<div class="note">' + anomalies.length + " anomalie(s) détectée(s) dans catalogue.js. "
      + "Le détail est dans la console du navigateur (touche F12).</div></div>";
  }

  h += '<div class="stats-groupe"><h3 data-ico="horloge" data-ico-taille="13">' + ech(mot("Journal des versions")) + '</h3>'
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

/* Panneau ouvert, la molette passe par un seul moteur, partout.

   Il n'y a pas de "focus" perdu : le navigateur livre la molette à ce qui
   se trouve sous le curseur. Sur le panneau, il défilait lui-même avec
   son propre lissage ; à côté, l'événement partait derrière et un second
   moteur maison prenait le relais. Deux moteurs, deux sensations — la
   différence était structurelle. Un événement synthétique ne pouvant pas
   déclencher le défilement natif, l'unification se fait dans l'autre
   sens : tant qu'un panneau est ouvert, TOUTE molette est interceptée et
   passe par la même inertie, souris dessus ou à côté. Un seul
   comportement, au pixel près. */
function initMolettePanneaux() {
  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let corps = null, cible = 0, anime = null;

  function pas() {
    anime = null;
    if (!corps) return;
    const ecart = cible - corps.scrollTop;
    if (Math.abs(ecart) < 0.6) { corps.scrollTop = cible; return; }
    corps.scrollTop += ecart * 0.22;
    anime = requestAnimationFrame(pas);
  }

  document.addEventListener("wheel", ev => {
    const dlg = document.querySelector(".modale[open]");
    if (!dlg) { corps = null; return; }
    const c = dlg.querySelector(".modale-corps");
    if (!c) return;
    ev.preventDefault();
    // deltaMode : 0 pixels, 1 lignes (Firefox), 2 pages.
    const delta = ev.deltaMode === 1 ? ev.deltaY * 33
      : ev.deltaMode === 2 ? ev.deltaY * c.clientHeight : ev.deltaY;
    if (corps !== c) { corps = c; cible = c.scrollTop; }
    cible = Math.max(0, Math.min(c.scrollHeight - c.clientHeight, cible + delta));
    if (reduit) { corps.scrollTop = cible; return; }   // moins d'animations : saut direct
    if (!anime) anime = requestAnimationFrame(pas);
  }, { passive: false });

  // Le corps peut aussi défiler par sa barre ou au clavier : la cible se
  // resynchronise dès que le mouvement ne vient pas du moteur.
  document.addEventListener("scroll", ev => {
    if (corps && ev.target === corps && !anime) cible = corps.scrollTop;
  }, true);
}


/* Le bouton monde et son menu. Seul le français vit pour l'instant : les
   autres langues sont des emplacements posés — visibles, désactivés,
   marqués « bientôt » — pour que la promesse d'un portail ouvert à tous
   se lise déjà dans l'interface. */
const LANGUES = [
  { cle: "fr", nom: "Français", active: true },
  { cle: "en", nom: "English", active: true },
  { cle: "de", nom: "Deutsch" },
  { cle: "zh", nom: "中文" },
  { cle: "ja", nom: "日本語" },
  { cle: "ar", nom: "العربية" }
];

function initLangues() {
  const menu = $("menuLangues");
  const btn = $("btnLangue");
  menu.innerHTML = LANGUES.map(l =>
      '<button type="button" role="menuitem"'
    +   (l.active ? "" : ' class="langue-off" title="' + ech(mot("Bientôt disponible")) + '"')
    +   ' data-langue="' + l.cle + '">'
    +   '<span class="coche">' + (l.cle === LANGUE.courante ? ico("valider", 14) : "") + "</span>"
    +   "<span>" + ech(l.nom) + "</span><span class=\"espace\"></span>"
    +   (l.active ? "" : '<span class="langue-badge">' + ech(mot("bientôt")) + "</span>")
    + "</button>").join("");

  function fermer() {
    menu.classList.remove("ouvert");
    btn.setAttribute("aria-expanded", "false");
  }
  btn.addEventListener("click", ev => {
    ev.stopPropagation();
    const ouvert = menu.classList.toggle("ouvert");
    btn.setAttribute("aria-expanded", String(ouvert));
  });
  menu.addEventListener("click", ev => {
    const b = ev.target.closest("[data-langue]");
    if (!b) return;
    // Les langues sans traduction ne font rien, et c'est voulu :
    // l'emplacement est posé, la mécanique attendra les traductions.
    if (b.dataset.langue !== "fr" && !TRADUCTIONS[b.dataset.langue]) return;
    fermer();
    langueChoisir(b.dataset.langue);
  });
  document.addEventListener("click", ev => {
    if (!menu.contains(ev.target) && ev.target !== btn) fermer();
  });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape") fermer();
  });
}

/* ---------------------------------------------------------------------
   LES NOUVEAUTÉS

   Un volet qui répond à une seule question : qu'est-ce qui est nouveau et
   que je peux ouvrir maintenant ? Il ne montre donc que des portes
   franchissables, triées de la plus récemment mise à jour à la plus
   ancienne, trois au plus. Une fiche "Bientôt" n'y entre pas : annoncer
   comme neuf ce qui n'existe pas encore serait refaire, dans un coin plus
   voyant, le défaut que le compteur d'accueil vient de perdre. Et sans
   rien à montrer, le bouton ne paraît pas du tout.
   --------------------------------------------------------------------- */
const NEUF_MAX = 3;
const NEUF_SURLIGNE = 10000;                    // dix secondes de surbrillance
const CLE_NEUFS_VUS = "hub_b27_neufs_vus";

/* Une nouveauté se repère par sa porte et par sa date : un outil remis à
   jour redevient neuf, ce qui est le propre d'un volet de nouveautés. Vue,
   elle sort de la liste et n'y revient pas, le navigateur s'en souvenant
   comme il se souvient du thème et de la langue. */
function neufCle(o) { return o.id + "@" + (o.maj || ""); }

function neufsVus() {
  try { return JSON.parse(localStorage.getItem(CLE_NEUFS_VUS) || "[]") || []; }
  catch (e) { return []; }                      // stockage refusé, tout reste neuf
}

function neufMarquerVu(o) {
  const vus = neufsVus();
  if (vus.includes(neufCle(o))) return;
  vus.push(neufCle(o));
  try { localStorage.setItem(CLE_NEUFS_VUS, JSON.stringify(vus)); } catch (e) { /* non mémorisé */ }
}

function outilsNeufs() {
  const vus = neufsVus();
  return PORTES.filter(o => estOutil(o) && estDisponible(o) && !vus.includes(neufCle(o)))
    .sort((a, b) => String(b.maj || "").localeCompare(String(a.maj || "")))
    .slice(0, NEUF_MAX);
}

/* La ligne porte l'icône de l'outil sur une plaque à la couleur de son
   métier, la même que sur sa carte : une pastille de couleur seule ne
   disait pas de quel outil il s'agissait. Le chevron pointe vers le bas
   parce que le clic descend dans la page, il ne sort pas du portail. */
function html_neuf(o) {
  const cat = categorie(o.categorie);
  const nom = champ(o, "nom");
  return '<button type="button" class="neuf-item" data-porte="' + ech(o.id) + '"'
    + ' title="' + ech(nom) + '" aria-label="' + ech(mot("Voir dans le portail") + " : " + nom) + '">'
    + '<span class="neuf-puce" style="--c:' + couleurSure(cat && cat.couleur) + '">'
    +   ico(o.icone || "grille", 18) + "</span>"
    + '<span class="neuf-texte">'
    +   '<span class="neuf-nom">' + ech(nom) + "</span>"
    +   '<span class="neuf-date">' + ech(o.maj ? dateFr(o.maj) : champ(cat, "nom")) + "</span>"
    + "</span>"
    + '<span class="neuf-vers">' + ico("chevron_d", 14) + "</span></button>";
}

let NEUF_MINUTEUR = null;

/* Le clic descend à la carte et la désigne. Le chemin est celui du
   sommaire, pas un défilement à part : le groupe se pose au foyer du
   magnétisme, à pleine encre, le reste de la page s'estompant autour. La
   carte prend ensuite un anneau à la couleur de son métier, dix secondes,
   le temps que l'oeil la trouve. L'anneau ne bat pas : la règle du calme
   vaut ici comme pour le halo du soleil. */
function allerALaPorte(id) {
  const carte = document.querySelector('.carte[data-porte="' + id + '"]');
  if (!carte) return;
  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const groupe = carte.closest(".aimant");
  if (groupe) {
    const haut = aimantHaut(groupe);
    window.scrollTo({ top: AIMANT.actif ? aimantOu(haut) : haut - 76,
                      behavior: reduit ? "auto" : "smooth" });
  } else {
    carte.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "center" });
  }
  if (NEUF_MINUTEUR) clearTimeout(NEUF_MINUTEUR);
  document.querySelectorAll(".carte.surligne").forEach(c => c.classList.remove("surligne"));
  carte.classList.add("surligne");
  NEUF_MINUTEUR = setTimeout(() => carte.classList.remove("surligne"), NEUF_SURLIGNE);
}

function initNeuf() {
  const btn = $("btnNeuf"), menu = $("menuNeuf");
  if (!btn || !menu) return;

  function fermer() {
    menu.classList.remove("ouvert");
    btn.setAttribute("aria-expanded", "false");
  }

  // Le volet se redessine après chaque nouveauté vue : le nombre suit, et
  // le bouton s'efface dès qu'il n'y a plus rien à annoncer.
  function peindre() {
    const neufs = outilsNeufs();
    if (!neufs.length) { fermer(); btn.hidden = true; return; }
    btn.hidden = false;
    $("btnNeufNombre").textContent = String(neufs.length);
    menu.innerHTML = '<p class="menu-neuf-titre">' + ech(mot("Derniers outils disponibles")) + "</p>"
      + neufs.map(html_neuf).join("");
  }
  peindre();

  btn.addEventListener("click", ev => {
    ev.stopPropagation();
    const ouvert = menu.classList.toggle("ouvert");
    btn.setAttribute("aria-expanded", String(ouvert));
  });

  menu.addEventListener("click", ev => {
    const b = ev.target.closest("[data-porte]");
    if (!b) return;
    const o = PORTES.find(p => p.id === b.dataset.porte);
    fermer();
    allerALaPorte(b.dataset.porte);
    if (o) { neufMarquerVu(o); peindre(); }
  });

  document.addEventListener("click", ev => {
    if (!menu.contains(ev.target) && !btn.contains(ev.target)) fermer();
  });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape") fermer();
  });
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
  // La langue avant tout le reste : elle décide de ce que les autres
  // constructions vont écrire.
  LANGUE.courante = langueDepart();
  document.documentElement.lang = LANGUE.courante;
  traduireStatiques();
  controlerCatalogue();
  construireRayons();
  peindreCalendrier();
  poserIcones();
  initTheme();
  initSon();
  initFond();
  initRecherche();
  initSommaire();
  initAimant();
  initReflets();
  initAncre();
  initApropos();
  initDetailMeteo();
  initMolettePanneaux();
  initLangues();
  initNeuf();
  chargerMeteo();
  initVeille();

  if (typeof Signalement !== "undefined" && typeof SIGNALEMENT !== "undefined" && SIGNALEMENT.actif) {
    Signalement.init(SIGNALEMENT);
  }
}

document.addEventListener("DOMContentLoaded", init);
