/* =====================================================================
   hub.js : rendu du hall d'entrée à partir de catalogue.js.
   =====================================================================

   Ce fichier n'a pas besoin d'être modifié pour ajouter une porte. Tout ce
   qui varie est dans catalogue.js. Ce qui se trouve ici, ce sont le logo,
   les tracés d'icônes, la mécanique de thème, la construction du bandeau
   d'accueil, des cartes, de l'annuaire, du filtre et du panneau "À propos".

   Aucune dépendance, aucune requête réseau : le hub s'ouvre aussi bien
   depuis GitHub Pages que par un double-clic sur index.html.
   ===================================================================== */

/* ---------------------------------------------------------------------
   VERSION ET JOURNAL

   La version affichée dans le panneau "À propos" est déduite de cette liste,
   jamais recopiée ailleurs : une seule source, donc aucune divergence
   possible entre l'en-tête du panneau et le journal qu'il affiche.
   --------------------------------------------------------------------- */
const CHANGELOG = [
  { v: "v2", date: "2026-08-29", titre: "Hall d'entrée, logo B27 et signalement",
    texte: "Bandeau d'accueil portant le logo B27 et le compte des portes ouvertes. Le catalogue s'élargit au-delà des outils : site de l'entreprise, B27 Mobility à venir, six ressources métier en cartes compactes, et un annuaire de contacts. Une pastille en bas à droite ouvre un formulaire de signalement avec capture d'écran et dictée vocale." },
  { v: "v1", date: "2026-08-29", titre: "Première mise en ligne",
    texte: "Hub d'accueil des outils B27 : cartes cliquables construites à partir du catalogue, thème clair et sombre, panneau À propos. Deux outils référencés, la Calculette ECS et Bouclage et le Dimensionnement émetteurs Finimetal." }
];

/* ---------------------------------------------------------------------
   LOGO B27

   Le monogramme seul, sans la plaque blanche du fichier logo-b27.svg qui
   n'a de sens que pour une favicon. Sur la page, il se pose directement sur
   le fond et prend la couleur de marque, lisible en clair comme en sombre.
   Le viewBox est calé au plus juste sur les tracés (35.52 x 38.95) pour que
   le logo occupe vraiment la taille demandée, sans marge morte.
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
   externe, donc le hub reste affichable hors ligne et sur un poste sans
   accès sortant. Ajouter une icône, c'est ajouter une ligne ici, puis citer
   son nom dans le champ "icone" d'une porte ou d'une catégorie.
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
  porte: '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5.442 20.1a1 1 0 0 1-.442-.83V5.562a1 1 0 0 1 .58-.908l6-2.769a1 1 0 0 1 1.42.908z"/>'
};

function ico(nom, taille) {
  const traces = TRACES_ICONES[nom] || TRACES_ICONES.info;
  return '<svg class="ico" width="' + (taille || 16) + '" height="' + (taille || 16) + '" viewBox="0 0 24 24"'
    + ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
    + ' aria-hidden="true">' + traces + '</svg>';
}

// Tout élément portant data-ico reçoit l'icône correspondante en tête de son
// contenu. Évite de recopier des SVG entiers dans le HTML : un nom suffit.
function poserIcones(racine) {
  (racine || document).querySelectorAll("[data-ico]").forEach(el => {
    if (el.dataset.icoPose) return;              // ne pas doubler si rappelée
    const taille = +el.dataset.icoTaille || 16;
    el.insertAdjacentHTML("afterbegin", ico(el.dataset.ico, taille));
    el.dataset.icoPose = "1";
  });
}

/* ---------------------------------------------------------------------
   OUTILLAGE
   --------------------------------------------------------------------- */
const $ = id => document.getElementById(id);

// Les pitchs et les noms viennent d'un fichier écrit à la main : une
// esperluette ou un chevron y est possible sans mauvaise intention, mais
// casserait le HTML construit par chaînes. On échappe systématiquement.
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

function accorde(n, singulier, pluriel) {
  return n + " " + (n > 1 ? (pluriel || singulier + "s") : singulier);
}

// Un statut décrit à la fois ce qu'on affiche et si la carte mène quelque part.
const STATUTS = {
  "en-ligne": { libelle: "En ligne",   cliquable: true,  pastille: false },
  "beta":     { libelle: "Bêta",       cliquable: true,  pastille: true  },
  "a-venir":  { libelle: "À venir",    cliquable: false, pastille: true  },
  "bureau":   { libelle: "Bureau",     cliquable: false, pastille: true  },
  "obsolete": { libelle: "Obsolète",   cliquable: false, pastille: true  }
};

const TYPES = { outil: true, lien: true };

/* ---------------------------------------------------------------------
   CONTRÔLE DU CATALOGUE

   catalogue.js se modifie à la main : une faute de frappe sur une catégorie
   ou un statut y est le mode de panne le plus probable. Plutôt que
   d'afficher une carte muette, on signale le problème dans la console et on
   retombe sur un comportement sûr. Le même contrôle existe en version
   stricte dans tests/verifier_catalogue.py, à lancer avant de publier.
   --------------------------------------------------------------------- */
function controlerCatalogue() {
  const anomalies = [];
  const vus = new Set();
  const clesCategories = new Set(CATEGORIES.map(c => c.cle));

  PORTES.forEach((o, i) => {
    const ou = "porte " + (i + 1) + " (" + (o.nom || o.id || "sans nom") + ")";
    if (!o.id) anomalies.push(ou + " : champ id manquant.");
    else if (vus.has(o.id)) anomalies.push(ou + ' : id "' + o.id + '" déjà utilisé.');
    else vus.add(o.id);

    if (!o.nom) anomalies.push(ou + " : champ nom manquant.");
    if (!o.pitch) anomalies.push(ou + " : champ pitch manquant.");
    if (!clesCategories.has(o.categorie)) anomalies.push(ou + ' : catégorie "' + o.categorie + "\" inconnue de CATEGORIES.");
    if (!STATUTS[o.statut]) anomalies.push(ou + ' : statut "' + o.statut + '" inconnu.');
    if (o.type && !TYPES[o.type]) anomalies.push(ou + ' : type "' + o.type + "\" inconnu, la carte sera rendue en type outil.");
    if (o.icone && !TRACES_ICONES[o.icone]) anomalies.push(ou + ' : icône "' + o.icone + "\" absente de TRACES_ICONES, remplacée par l'icône info.");
    if (STATUTS[o.statut] && STATUTS[o.statut].cliquable && !o.url) {
      anomalies.push(ou + " : statut cliquable mais url vide, la carte sera affichée non cliquable.");
    }
  });

  (typeof CONTACTS === "undefined" ? [] : CONTACTS).forEach((c, i) => {
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
   THÈME CLAIR ET SOMBRE
   Même mécanique que le Sélectionneur de radiateurs et la Calculette ECS :
   le choix explicite l'emporte et se mémorise, sinon le réglage du système
   fait foi et continue d'être suivi.
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
   BANDEAU D'ACCUEIL

   Le hall proprement dit : le logo B27 en grand, l'accroche, et le compte
   de ce qui attend derrière. Les chiffres sont calculés, jamais écrits :
   ils ne peuvent donc pas mentir après l'ajout d'une porte.
   --------------------------------------------------------------------- */
function construireHall() {
  const ouvertes = PORTES.filter(estCliquable).length;
  const cats = categoriesPeuplees().length;

  $("hallLogo").innerHTML = logoB27(58);
  $("hallAccroche").textContent = REGLAGES.accroche || "";
  $("hallAccroche").hidden = !REGLAGES.accroche;
  $("hallChapeau").textContent = REGLAGES.chapeau || "";
  $("hallChapeau").hidden = !REGLAGES.chapeau;

  // Les portes fermées ne sont annoncées que s'il y en a : afficher
  // "0 en préparation" attirerait l'oeil sur un vide.
  const enPreparation = PORTES.length - ouvertes;
  const chiffres = [
    { n: ouvertes, mot: ouvertes > 1 ? "portes ouvertes" : "porte ouverte", fort: true },
    { n: cats, mot: "univers" }
  ];
  if (enPreparation > 0) chiffres.push({ n: enPreparation, mot: "en préparation" });

  $("hallChiffres").innerHTML = chiffres.map(c =>
    '<li' + (c.fort ? ' class="fort"' : "") + "><b>" + c.n + "</b> "
    + ech(c.mot) + "</li>").join("");
}

/* ---------------------------------------------------------------------
   CARTES
   --------------------------------------------------------------------- */

function estCliquable(o) {
  const st = STATUTS[o.statut];
  return !!(st && st.cliquable && o.url);
}

function nomCategorie(cle) {
  const c = CATEGORIES.find(c => c.cle === cle);
  return c ? c.nom : cle;
}

// Une carte cliquable est un <a>, une carte inerte un <div> : un lien qui ne
// mène nulle part serait annoncé comme un lien par un lecteur d'écran et
// recevrait le focus au clavier pour rien.
function html_carte(o) {
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

  // Carte compacte pour les ressources extérieures : pas de mots-clés, le
  // pitch tient sur une ligne. Vingt liens ne doivent pas noyer deux outils.
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
    + ' data-id="' + ech(o.id) + '"'
    + ' data-categorie="' + ech(o.categorie) + '"'
    + ' data-recherche="' + ech(normaliser([o.nom, o.pitch, (o.tags || []).join(" "), nomCategorie(o.categorie)].join(" "))) + '"';

  if (!cliquable) {
    // aria-disabled plutôt que rien : la carte reste lue, mais annoncée
    // comme indisponible au lieu de passer pour un lien cassé.
    return "<div" + attrs + ' aria-disabled="true" title="' + ech(st.libelle)
      + " : cette porte n'est pas encore ouverte\">" + interieur + "</div>";
  }
  // rel="noopener" : la page ouverte ne doit pas pouvoir manipuler le hub.
  return "<a" + attrs + ' href="' + ech(o.url) + '" target="_blank" rel="noopener">' + interieur + "</a>";
}

// Catégories réellement peuplées, dans l'ordre déclaré. Les portes rangées
// dans une catégorie inconnue sont regroupées à la fin plutôt que perdues.
function categoriesPeuplees() {
  const liste = CATEGORIES
    .map(c => ({ ...c, portes: PORTES.filter(o => o.categorie === c.cle) }))
    .filter(c => c.portes.length);
  const clesConnues = new Set(CATEGORIES.map(c => c.cle));
  const orphelines = PORTES.filter(o => !clesConnues.has(o.categorie));
  if (orphelines.length) {
    liste.push({ cle: "__autres", nom: "Autres", icone: "dossier", portes: orphelines });
  }
  return liste;
}

function construireCatalogue() {
  const cats = categoriesPeuplees();
  const cible = $("catalogue");

  if (!PORTES.length) {
    cible.innerHTML = '<div class="vide"><b>Aucune porte pour le moment</b>'
      + "Le hall se remplit en ajoutant une fiche dans catalogue.js.</div>";
    return;
  }

  if (cats.length < REGLAGES.seuilSections) {
    // Trop peu de catégories pour que des titres apportent quelque chose :
    // une grille unique se lit mieux qu'une suite de sections d'une carte.
    cible.innerHTML = '<div class="section"><div class="grille">'
      + PORTES.map(html_carte).join("") + "</div></div>";
    return;
  }

  cible.innerHTML = cats.map(c => {
    // Une catégorie qui ne contient que des liens prend la grille dense.
    const queDesLiens = c.portes.every(o => o.type === "lien");
    return '<section class="section" data-categorie="' + ech(c.cle) + '">'
      + '<h2><span class="pave">' + ico(c.icone, 15) + "</span>" + ech(c.nom)
      +   ' <span class="compte">' + c.portes.length + "</span></h2>"
      + '<div class="grille' + (queDesLiens ? " grille-dense" : "") + '">'
      +   c.portes.map(html_carte).join("")
      + "</div></section>";
  }).join("");
}

/* ---------------------------------------------------------------------
   ANNUAIRE

   Une fiche de contact n'est pas une porte : on ne clique pas dessus pour
   aller ailleurs, on y prend une adresse ou un numéro. D'où un rendu à
   part, et des liens mailto et tel plutôt qu'une carte cliquable entière.
   --------------------------------------------------------------------- */
function construireAnnuaire() {
  const contacts = typeof CONTACTS === "undefined" ? [] : CONTACTS;
  const bloc = $("annuaire");
  if (!contacts.length) { bloc.hidden = true; return; }
  bloc.hidden = false;

  bloc.innerHTML =
      '<h2><span class="pave">' + ico("personne", 15) + "</span>Qui contacter"
    +   ' <span class="compte">' + contacts.length + "</span></h2>"
    + '<div class="grille grille-dense">'
    + contacts.map(c => {
        const sousTitre = [c.role, c.agence].filter(Boolean).join(" - ");
        const sujets = (c.sujets || []).length
          ? '<div class="tags">' + c.sujets.slice(0, 4).map(s => '<span class="tag">' + ech(s) + "</span>").join("") + "</div>"
          : "";
        const liens = [];
        if (c.mail) liens.push('<a href="mailto:' + ech(c.mail) + '">' + ico("courrier", 14) + ech(c.mail) + "</a>");
        if (c.tel) liens.push('<a href="tel:' + ech(c.tel.replace(/\s+/g, "")) + '">' + ico("telephone", 14) + ech(c.tel) + "</a>");
        return '<div class="fiche">'
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
   RECHERCHE ET FILTRES

   La barre n'est construite qu'au-delà de REGLAGES.seuilFiltres portes. En
   dessous, elle occuperait plus de place que le catalogue qu'elle filtre.
   --------------------------------------------------------------------- */
let filtreCategorie = "tous";

function construireBarre() {
  if (PORTES.length < REGLAGES.seuilFiltres) return false;

  const cats = categoriesPeuplees();
  $("barre").innerHTML =
      '<div class="recherche" id="zoneRecherche">'
    +   ico("recherche", 15)
    +   '<input type="search" id="inpRecherche" placeholder="Rechercher une porte, un mot-clé..." aria-label="Rechercher une porte">'
    +   '<button type="button" class="vider" id="btnVider" aria-label="Effacer la recherche"></button>'
    + "</div>"
    + '<div class="filtres" role="group" aria-label="Filtrer par catégorie">'
    +   '<button type="button" data-cat="tous" aria-pressed="true">Tous <span class="compte">' + PORTES.length + "</span></button>"
    +   cats.map(c => '<button type="button" data-cat="' + ech(c.cle) + '" aria-pressed="false">'
          + ech(c.nom) + ' <span class="compte">' + c.portes.length + "</span></button>").join("")
    + "</div>";

  $("btnVider").innerHTML = ico("fermer", 13);

  $("inpRecherche").addEventListener("input", appliquerFiltres);
  $("btnVider").addEventListener("click", () => {
    $("inpRecherche").value = "";
    $("inpRecherche").focus();
    appliquerFiltres();
  });
  $("barre").querySelectorAll(".filtres button").forEach(b => {
    b.addEventListener("click", () => {
      filtreCategorie = b.dataset.cat;
      $("barre").querySelectorAll(".filtres button").forEach(x =>
        x.setAttribute("aria-pressed", String(x === b)));
      appliquerFiltres();
    });
  });
  return true;
}

function appliquerFiltres() {
  const champ = $("inpRecherche");
  if (!champ) return;
  const q = normaliser(champ.value.trim());
  const filtre = q.length > 0 || filtreCategorie !== "tous";
  $("zoneRecherche").classList.toggle("remplie", champ.value.length > 0);

  let visibles = 0;
  document.querySelectorAll("#catalogue .carte").forEach(el => {
    const okCat = filtreCategorie === "tous" || el.dataset.categorie === filtreCategorie;
    const okTxt = !q || el.dataset.recherche.includes(q);
    const montre = okCat && okTxt;
    el.hidden = !montre;
    if (montre) visibles++;
  });

  // Une section dont toutes les cartes sont masquées disparaît avec son titre :
  // laisser un intitulé de catégorie au-dessus du vide donne l'air d'un bug.
  document.querySelectorAll("#catalogue .section").forEach(sec => {
    const dedans = sec.querySelectorAll(".carte:not([hidden])").length;
    sec.hidden = dedans === 0;
    const compte = sec.querySelector("h2 .compte");
    if (compte) compte.textContent = String(dedans);
  });

  // L'annuaire n'est pas filtré : il ne contient pas de portes. Mais dès
  // qu'un filtre est actif, l'afficher sous les résultats brouillerait la
  // lecture, on le met de côté le temps de la recherche.
  const annuaire = $("annuaire");
  const contacts = typeof CONTACTS === "undefined" ? [] : CONTACTS;
  if (contacts.length) annuaire.hidden = filtre;

  $("aucunResultat").hidden = visibles > 0;
  if (visibles === 0) {
    $("aucunResultat").innerHTML = "<b>Aucune porte ne correspond</b>"
      + "Essayez un autre mot-clé, ou revenez à la catégorie Tous.";
  }
}

/* ---------------------------------------------------------------------
   PANNEAU "À PROPOS"

   Les compteurs sont recalculés à chaque ouverture, jamais recopiés : ils
   ne peuvent donc pas mentir après l'ajout d'une porte dans catalogue.js.
   --------------------------------------------------------------------- */
function ligneStat(dt, dd) {
  return "<dt>" + ech(dt) + "</dt><dd>" + ech(dd) + "</dd>";
}

function remplirApropos() {
  const parStatut = {};
  PORTES.forEach(o => { parStatut[o.statut] = (parStatut[o.statut] || 0) + 1; });
  const majs = PORTES.map(o => o.maj).filter(Boolean).sort();
  const derniere = majs.length ? majs[majs.length - 1] : null;
  const cats = categoriesPeuplees();
  const contacts = typeof CONTACTS === "undefined" ? [] : CONTACTS;
  const anomalies = controlerCatalogue();
  const nosOutils = PORTES.filter(o => (o.type || "outil") === "outil").length;

  let h = "";

  h += '<div class="stats-groupe"><h3 data-ico="grille" data-ico-taille="13">Le hall</h3><dl class="stats-liste">'
     + ligneStat("Portes référencées", PORTES.length)
     + ligneStat("dont ressources extérieures", PORTES.length - nosOutils)
     + Object.keys(STATUTS).filter(s => parStatut[s]).map(s =>
         ligneStat("dont " + STATUTS[s].libelle.toLowerCase(), parStatut[s])).join("")
     + ligneStat("Catégories représentées", cats.length)
     + ligneStat("Fiches à l'annuaire", contacts.length)
     + ligneStat("Porte mise à jour le plus récemment", derniere ? dateFr(derniere) : "non renseigné")
     + ligneStat("Thème courant", document.documentElement.dataset.theme === "dark" ? "sombre" : "clair")
     + "</dl></div>";

  h += '<div class="stats-groupe"><h3 data-ico="porte" data-ico-taille="13">Ce que fait le hub</h3>'
     + '<dl class="stats-liste gauche">'
     + ligneStat("Rôle", "Point d'entrée unique vers les outils et les ressources du bureau d'études. Le hub n'héberge rien, il redirige.")
     + ligneStat("Données", "Aucune. Aucun compte, aucun formulaire, aucun suivi. Seul le choix de thème est retenu dans le navigateur.")
     + ligneStat("Hors ligne", "La page s'ouvre aussi depuis le disque, mais les portes qu'elle pointe demandent une connexion.")
     + "</dl></div>";

  h += '<div class="stats-groupe"><h3 data-ico="etiquette" data-ico-taille="13">Ajouter une porte</h3>'
     + '<div class="note">Un seul fichier à modifier : <code>catalogue.js</code>. Copier une fiche existante, '
     + "remplir le nom, le pitch, l'adresse, la catégorie et le statut, puis enregistrer. La carte apparaît, "
     + "les compteurs, les sections et les filtres suivent. Le contrôle "
     + "<code>python tests/verifier_catalogue.py</code> dit si la fiche est complète avant publication.</div></div>";

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
  // Clic sur le fond sombre : le rectangle du <dialog> est celui du panneau,
  // donc un clic en dehors de ce rectangle tombe forcément sur le fond.
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
  document.title = REGLAGES.titre;
  $("titreHub").textContent = REGLAGES.titre;
  $("sousTitreHub").textContent = REGLAGES.sousTitre;
  $("enteteLogo").innerHTML = logoB27(26);

  controlerCatalogue();
  construireHall();
  construireCatalogue();
  construireAnnuaire();
  const avecBarre = construireBarre();
  poserIcones();
  initTheme();
  initApropos();

  const ouvertes = PORTES.filter(estCliquable).length;
  $("piedCompte").textContent = accorde(PORTES.length, "porte référencée", "portes référencées")
    + ", " + ouvertes + " ouverte" + (ouvertes > 1 ? "s" : "");

  if (REGLAGES.contact) {
    $("piedContact").innerHTML = 'Un bug, une idée d\'outil : la pastille en bas à droite, ou <a href="mailto:'
      + ech(REGLAGES.contact) + '">' + ech(REGLAGES.contact) + "</a>";
  }

  // Pastille de signalement. Le widget est autonome et se branche sur les
  // réglages du catalogue ; s'il n'a pas été chargé, le hub fonctionne
  // exactement pareil, sans la pastille.
  if (typeof Signalement !== "undefined" && typeof SIGNALEMENT !== "undefined" && SIGNALEMENT.actif) {
    Signalement.init(SIGNALEMENT);
  }

  if (avecBarre) appliquerFiltres();
}

document.addEventListener("DOMContentLoaded", init);
