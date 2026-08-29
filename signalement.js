/* =====================================================================
   signalement.js : la pastille "Signaler un problème", autonome.
   =====================================================================

   Un seul fichier, aucune dépendance, sa propre feuille de style injectée.
   Pour l'ajouter à n'importe quel outil B27, deux lignes avant </body> :

       <script src="signalement.js"></script>
       <script>Signalement.init({
         application: "Calculette ECS et Bouclage",
         destinataire: "mamalric@b27.fr"
       });</script>

   Le reste a des valeurs par défaut raisonnables. Le détail des réglages et
   des modes d'envoi est dans docs/signalement.md.

   Ce que fait la pastille : elle prend une capture de ce que l'utilisateur a
   sous les yeux, lui demande un titre et une description qu'il peut dicter à
   voix haute, et transmet le tout.

   Trois choix de conception qui méritent d'être dits :

   1. La capture est tentée dès l'ouverture, avant d'afficher le panneau. Un
      utilisateur qui signale un bug veut joindre l'écran du bug, pas l'écran
      du formulaire de signalement. La pastille se cache le temps de la prise
      pour ne pas se photographier elle-même.

   2. Le navigateur demandera toujours une confirmation avant de capturer.
      Aucune page web ne peut filmer un écran sans accord explicite, et c'est
      une bonne chose. Si l'utilisateur refuse, on ne le redemande plus de la
      visite : on ne harcèle pas quelqu'un qui vient signaler un problème.

   3. La dictée passe par la reconnaissance vocale du navigateur, qui n'est
      pas locale : sur Chrome et Edge, la voix part vers le service de
      transcription de l'éditeur. Le panneau le dit avant le premier
      enregistrement, parce que c'est la seule chose ici qui sorte du poste.
   ===================================================================== */

const Signalement = (function () {
  "use strict";

  const REGLAGES_DEFAUT = {
    application: "Application B27",
    destinataire: "",
    transport: "mailto",         // mailto | formulaire | endpoint
    endpoint: "",
    capture: true,
    dictee: true,
    largeurCaptureMax: 1600      // la capture est réduite au-delà, en pixels
  };

  let cfg = null;
  let racine = null;
  let captureBlob = null;        // capture courante, ou null
  let captureUrl = null;         // URL d'aperçu à révoquer
  let captureRefusee = false;    // l'utilisateur a dit non : ne plus insister
  let reco = null;               // instance de reconnaissance vocale
  let dicteeActive = false;      // l'utilisateur a demandé la dictée
  let dicteeDemarre = false;     // le moteur a confirmé son démarrage
  let dicteeSocle = "";          // texte présent avant le début de la dictée
  let dicteeAcquis = "";         // segments déjà validés par la reconnaissance
  let dicteeAEntendu = false;    // au moins un résultat reçu depuis le début
  let dicteeRelances = 0;        // relances consécutives sans rien avoir reçu
  let dicteeDepuis = 0;          // horodatage du dernier démarrage
  let dicteeVeille = null;       // minuteur de surveillance du démarrage

  /* ------------------------------------------------------------------
     Icônes : mêmes tracés Lucide que le reste des outils B27, réinlinés
     ici pour que le fichier reste utilisable seul, sans hub.js.
     ------------------------------------------------------------------ */
  const ICO = {
    insecte: '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
    micro: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    arret: '<rect width="12" height="12" x="6" y="6" rx="2"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    envoi: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    corbeille: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    fermer: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    valider: '<path d="M20 6 9 17l-5-5"/>',
    attention: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
  };

  function ico(nom, taille) {
    return '<svg width="' + (taille || 16) + '" height="' + (taille || 16) + '" viewBox="0 0 24 24"'
      + ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
      + ' aria-hidden="true">' + (ICO[nom] || ICO.info) + "</svg>";
  }

  function ech(txt) {
    return String(txt == null ? "" : txt)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  const $ = sel => racine.querySelector(sel);

  /* ------------------------------------------------------------------
     Feuille de style

     Palette autonome, non héritée de l'hôte. C'est délibéré : la pastille
     doit avoir exactement la même tête sur tous les outils B27, y compris
     ceux qui n'ont pas la même feuille. Les valeurs sont celles de la
     charte, thème clair et sombre, avec deux déclencheurs : l'attribut
     data-theme posé par nos outils, et à défaut le réglage du système.
     ------------------------------------------------------------------ */
  const STYLE = `
#sg-racine{
  --sg-papier:#fff; --sg-papier-2:#f4f6f3; --sg-papier-3:#e8ebe6;
  --sg-encre:#1e2220; --sg-encre-2:#525754; --sg-discret:#676e69;
  --sg-ligne:#dde0dc; --sg-ligne-2:#ebeee9;
  --sg-vert:#7da32f; --sg-vert-fond:#eaf3d8; --sg-vert-bord:#c3daa0; --sg-vert-encre:#4c6a19;
  --sg-rouge:#bc3f38; --sg-rouge-fond:#fbeae8;
  --sg-ambre:#b87a15; --sg-ambre-fond:#fdf6e6; --sg-ambre-bord:#e2b45f;
  --sg-sur-vert:#fff;
  --sg-ombre:0 2px 6px rgba(30,34,32,.10), 0 12px 32px rgba(30,34,32,.14);
  --sg-vitesse:.18s;
  font-family:Inter,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
@media (prefers-color-scheme:dark){
  #sg-racine:not([data-sg-theme="light"]){
    --sg-papier:#1a1d1b; --sg-papier-2:#232725; --sg-papier-3:#2c312e;
    --sg-encre:#e9ebe8; --sg-encre-2:#b2b7b3; --sg-discret:#929991;
    --sg-ligne:#343a36; --sg-ligne-2:#272c29;
    --sg-vert:#a5cc52; --sg-vert-fond:#2b3a17; --sg-vert-bord:#4a6626; --sg-vert-encre:#c9e58f;
    --sg-rouge:#e5837c; --sg-rouge-fond:#3b2321;
    --sg-ambre:#e3ad63; --sg-ambre-fond:#332a14; --sg-ambre-bord:#8a6520;
    --sg-sur-vert:#12180a;
    --sg-ombre:0 2px 6px rgba(0,0,0,.4), 0 12px 32px rgba(0,0,0,.45);
  }
}
#sg-racine[data-sg-theme="dark"]{
  --sg-papier:#1a1d1b; --sg-papier-2:#232725; --sg-papier-3:#2c312e;
  --sg-encre:#e9ebe8; --sg-encre-2:#b2b7b3; --sg-discret:#929991;
  --sg-ligne:#343a36; --sg-ligne-2:#272c29;
  --sg-vert:#a5cc52; --sg-vert-fond:#2b3a17; --sg-vert-bord:#4a6626; --sg-vert-encre:#c9e58f;
  --sg-rouge:#e5837c; --sg-rouge-fond:#3b2321;
  --sg-ambre:#e3ad63; --sg-ambre-fond:#332a14; --sg-ambre-bord:#8a6520;
  --sg-sur-vert:#12180a;
  --sg-ombre:0 2px 6px rgba(0,0,0,.4), 0 12px 32px rgba(0,0,0,.45);
}
@media (prefers-reduced-motion:reduce){ #sg-racine{ --sg-vitesse:0s } }

#sg-racine *{box-sizing:border-box}

/* ---- pastille
   Repliée, c'est un rond discret dans le coin. Au survol ou au focus
   clavier, l'intitulé se déplie vers la gauche : on découvre à quoi elle
   sert sans qu'elle occupe la place d'un bouton en permanence. La largeur
   de l'intitulé est animée, pas sa présence, pour que le mouvement parte
   du rond et non du vide. */
.sg-pastille{
  position:fixed;right:18px;bottom:18px;z-index:2147483000;
  display:inline-flex;align-items:center;height:44px;padding:0 13px;
  border-radius:22px;border:1px solid var(--sg-ligne);
  background:var(--sg-papier);color:var(--sg-encre-2);
  box-shadow:var(--sg-ombre);cursor:pointer;
  font:inherit;font-size:13px;font-weight:600;
  transition:color var(--sg-vitesse),border-color var(--sg-vitesse),
             background-color var(--sg-vitesse),transform var(--sg-vitesse);
}
.sg-pastille:hover,.sg-pastille:focus-visible{
  color:var(--sg-vert-encre);border-color:var(--sg-vert-bord);background:var(--sg-vert-fond);
}
.sg-pastille:focus-visible{outline:2px solid var(--sg-vert);outline-offset:3px}
.sg-pastille:active{transform:scale(.96)}
.sg-pastille .sg-mot{
  max-width:0;overflow:hidden;white-space:nowrap;opacity:0;margin-left:0;
  transition:max-width var(--sg-vitesse) ease,opacity var(--sg-vitesse) ease,
             margin-left var(--sg-vitesse) ease;
}
.sg-pastille:hover .sg-mot,.sg-pastille:focus-visible .sg-mot{max-width:14rem;opacity:1;margin-left:9px}
@media print{ .sg-pastille{display:none} }

/* ---- panneau */
.sg-modale{
  border:none;padding:0;border-radius:12px;overflow:hidden;
  background:var(--sg-papier);color:var(--sg-encre);
  width:min(560px,94vw);max-height:90vh;
  box-shadow:0 8px 40px rgba(0,0,0,.32);
}
.sg-modale::backdrop{background:rgba(0,0,0,.5)}
.sg-tete{
  display:flex;align-items:center;gap:10px;padding:13px 18px;
  border-bottom:1px solid var(--sg-ligne);background:var(--sg-papier-2);
}
.sg-tete h2{margin:0;font-size:15px;font-weight:700;display:flex;align-items:center;gap:9px;color:var(--sg-encre)}
.sg-tete .sg-espace{flex:1}
.sg-corps{padding:16px 18px;overflow:auto;max-height:calc(90vh - 124px)}
.sg-pied{
  display:flex;align-items:center;gap:10px;padding:12px 18px;
  border-top:1px solid var(--sg-ligne);background:var(--sg-papier-2);
}
.sg-pied .sg-espace{flex:1}

.sg-champ{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.sg-champ label{font-size:12px;font-weight:600;color:var(--sg-encre-2)}
.sg-champ input,.sg-champ textarea{
  font:inherit;font-size:13.5px;color:var(--sg-encre);
  background:var(--sg-papier);border:1px solid var(--sg-ligne);border-radius:7px;
  padding:9px 11px;width:100%;
  transition:border-color var(--sg-vitesse),box-shadow var(--sg-vitesse);
}
.sg-champ textarea{resize:vertical;min-height:104px;line-height:1.5}
.sg-champ input::placeholder,.sg-champ textarea::placeholder{color:var(--sg-discret)}
.sg-champ input:focus,.sg-champ textarea:focus{
  outline:none;border-color:var(--sg-vert);box-shadow:0 0 0 3px rgba(125,163,47,.2);
}

/* ---- bouton */
.sg-btn{
  display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:13px;font-weight:600;
  border-radius:7px;padding:8px 14px;cursor:pointer;border:1px solid var(--sg-vert);
  background:var(--sg-vert);color:var(--sg-sur-vert);
  transition:filter var(--sg-vitesse),background-color var(--sg-vitesse),transform var(--sg-vitesse);
}
.sg-btn:hover{filter:brightness(1.06)}
.sg-btn:active{transform:scale(.97)}
.sg-btn[disabled]{opacity:.5;cursor:not-allowed;filter:none;transform:none}
.sg-btn.sg-sec{background:var(--sg-papier);color:var(--sg-encre-2);border-color:var(--sg-ligne)}
.sg-btn.sg-sec:hover{background:var(--sg-papier-3);filter:none}
.sg-rond{
  width:32px;height:32px;padding:0;border-radius:7px;justify-content:center;
  background:transparent;border:1px solid var(--sg-ligne);color:var(--sg-encre-2);
}
.sg-rond:hover{background:var(--sg-papier-3);filter:none}

/* ---- dictée
   Le bouton passe au rouge et bat pendant l'enregistrement : c'est le seul
   endroit de l'interface où quelque chose quitte le poste, il faut que ce
   soit visible sans avoir à y penser. */
.sg-dictee{display:flex;align-items:center;gap:9px;margin:-6px 0 14px}
.sg-dictee .sg-etat{font-size:12px;color:var(--sg-discret);line-height:1.4}
/* Un echec de dictee sort du gris : en petit texte discret, il passait
   inapercu et l'utilisateur concluait que le bouton ne marchait pas. */
.sg-dictee .sg-etat.sg-souci{
  background:var(--sg-ambre-fond);border:1px solid var(--sg-ambre-bord);
  border-radius:7px;padding:7px 10px;color:var(--sg-encre-2);
}
.sg-btn.sg-enregistre{
  background:var(--sg-rouge);border-color:var(--sg-rouge);color:#fff;
  animation:sg-battement 1.4s ease-in-out infinite;
}
@keyframes sg-battement{
  0%,100%{box-shadow:0 0 0 0 rgba(188,63,56,.45)}
  50%{box-shadow:0 0 0 7px rgba(188,63,56,0)}
}
@media (prefers-reduced-motion:reduce){ .sg-btn.sg-enregistre{animation:none} }
.sg-provisoire{color:var(--sg-discret);font-style:italic}

/* ---- capture */
.sg-capture{margin-bottom:14px}
.sg-capture .sg-titre-bloc{
  display:flex;align-items:center;gap:8px;margin-bottom:6px;
  font-size:12px;font-weight:600;color:var(--sg-encre-2);
}
.sg-capture .sg-espace{flex:1}
.sg-vignette-capture{
  display:block;width:100%;max-height:190px;object-fit:cover;object-position:top;
  border:1px solid var(--sg-ligne);border-radius:8px;background:var(--sg-papier-2);
}
.sg-sans-capture{
  border:1px dashed var(--sg-ligne);border-radius:8px;background:var(--sg-papier-2);
  padding:14px;font-size:12.5px;color:var(--sg-discret);line-height:1.5;
  display:flex;align-items:center;gap:12px;
}
.sg-sans-capture .sg-espace{flex:1}

/* ---- messages */
.sg-note{
  border-radius:7px;padding:10px 12px;font-size:12.5px;line-height:1.55;
  margin-bottom:14px;border:1px solid transparent;
}
.sg-note.sg-info{background:var(--sg-papier-2);border-color:var(--sg-ligne);color:var(--sg-encre-2)}
.sg-note.sg-avert{background:var(--sg-ambre-fond);border-color:var(--sg-ambre-bord);color:var(--sg-encre-2)}
.sg-note.sg-err{background:var(--sg-rouge-fond);border-color:var(--sg-rouge);color:var(--sg-encre-2)}
.sg-note.sg-ok{background:var(--sg-vert-fond);border-color:var(--sg-vert-bord);color:var(--sg-vert-encre)}
.sg-note b{display:block;margin-bottom:3px;color:var(--sg-encre)}
.sg-note.sg-ok b{color:var(--sg-vert-encre)}
.sg-note kbd{
  font-family:ui-monospace,"Cascadia Mono",Consolas,monospace;font-size:11.5px;
  background:var(--sg-papier);border:1px solid var(--sg-ligne);border-bottom-width:2px;
  border-radius:4px;padding:1px 5px;
}
.sg-contexte{font-size:11.5px;color:var(--sg-discret);line-height:1.6;margin:0}
`;

  /* ------------------------------------------------------------------
     Contexte technique

     Ce que le destinataire aura besoin de savoir et que l'utilisateur ne
     pensera jamais à écrire : où il était, avec quel navigateur, à quelle
     taille d'écran. Recueilli sans rien demander, et affiché dans le
     panneau pour qu'il n'y ait pas de collecte invisible.
     ------------------------------------------------------------------ */
  function navigateurCourt() {
    const ua = navigator.userAgent;
    // L'ordre compte, et il n'est pas anodin : tous les navigateurs fondés sur
    // Chromium terminent leur signature par "Safari/537.36", et Edge comme
    // Opera annoncent en plus "Chrome". Prendre le dernier jeton, ou le
    // premier venu, fait passer Edge pour Safari. On interroge donc du plus
    // spécifique au plus générique, et on s'arrête au premier qui répond.
    const pistes = [
      [/\bEdg(?:e|A|iOS)?\/(\d+)/, "Edge"],
      [/\bOPR\/(\d+)/, "Opera"],
      [/\bFirefox\/(\d+)/, "Firefox"],
      [/\bCriOS\/(\d+)/, "Chrome iOS"],
      [/\bChrome\/(\d+)/, "Chrome"],
      [/\bVersion\/(\d+)[^ ]* .*\bSafari\//, "Safari"]
    ];
    for (let i = 0; i < pistes.length; i++) {
      const m = ua.match(pistes[i][0]);
      if (m) return pistes[i][1] + " " + m[1];
    }
    return "navigateur inconnu";
  }

  function contexte() {
    const d = new Date();
    return {
      application: cfg.application,
      page: location.href,
      titrePage: document.title,
      navigateur: navigateurCourt(),
      plateforme: navigator.platform || "",
      ecran: window.innerWidth + " x " + window.innerHeight,
      theme: document.documentElement.dataset.theme || "non précisé",
      date: d.toLocaleString("fr-FR")
    };
  }

  function contexteTexte(c) {
    return [
      "Application : " + c.application,
      "Page : " + c.page,
      "Navigateur : " + c.navigateur + (c.plateforme ? " sur " + c.plateforme : ""),
      "Fenêtre : " + c.ecran + " pixels, thème " + c.theme,
      "Date : " + c.date
    ].join("\n");
  }

  /* ------------------------------------------------------------------
     Capture d'écran
     ------------------------------------------------------------------ */
  function captureSupportee() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  }

  function trame() {
    return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  }

  async function capturerEcran() {
    let flux = null;
    try {
      // preferCurrentTab : sur Chrome et Edge, le sélecteur propose d'emblée
      // l'onglet courant, ce qui réduit la prise à une confirmation. Ailleurs
      // l'option est ignorée sans dommage.
      flux = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: false,
        preferCurrentTab: true,
        selfBrowserSurface: "include",
        surfaceSwitching: "exclude"
      });

      const video = document.createElement("video");
      video.srcObject = flux;
      video.muted = true;
      await video.play();
      // Une trame d'attente : sans elle, la première image est parfois noire,
      // le flux n'ayant pas encore livré de contenu.
      await trame();

      const source = { l: video.videoWidth, h: video.videoHeight };
      if (!source.l || !source.h) throw new Error("flux vide");

      const ratio = Math.min(1, cfg.largeurCaptureMax / source.l);
      const cnv = document.createElement("canvas");
      cnv.width = Math.round(source.l * ratio);
      cnv.height = Math.round(source.h * ratio);
      cnv.getContext("2d").drawImage(video, 0, 0, cnv.width, cnv.height);

      video.pause();
      video.srcObject = null;

      return await new Promise(res => cnv.toBlob(res, "image/png"));
    } catch (e) {
      // NotAllowedError : l'utilisateur a fermé le sélecteur. Ce n'est pas une
      // panne, c'est une réponse ; on la retient pour ne pas la redemander.
      if (e && e.name === "NotAllowedError") captureRefusee = true;
      return null;
    } finally {
      if (flux) flux.getTracks().forEach(t => t.stop());
    }
  }

  // La pastille se retire de l'image le temps de la prise : elle n'a rien à
  // faire sur la capture d'un bug.
  async function capturerSansLaPastille() {
    const past = $(".sg-pastille");
    if (past) past.style.visibility = "hidden";
    await trame();
    const blob = await capturerEcran();
    if (past) past.style.visibility = "";
    return blob;
  }

  function poserCapture(blob) {
    if (captureUrl) { URL.revokeObjectURL(captureUrl); captureUrl = null; }
    captureBlob = blob || null;
    const bloc = $(".sg-capture");
    if (!bloc) return;

    if (!captureBlob) {
      const raison = !captureSupportee()
        ? "Votre navigateur ne sait pas capturer l'écran."
        : "Aucune capture jointe.";
      bloc.innerHTML =
          '<div class="sg-sans-capture"><span class="sg-espace">' + ech(raison)
        + " Une capture aide beaucoup à comprendre un problème.</span>"
        + (captureSupportee()
            ? '<button type="button" class="sg-btn sg-sec" data-sg="recapturer">'
              + ico("camera", 15) + "Capturer</button>"
            : "")
        + "</div>";
      return;
    }

    captureUrl = URL.createObjectURL(captureBlob);
    const ko = Math.round(captureBlob.size / 1024);
    bloc.innerHTML =
        '<div class="sg-titre-bloc">' + ico("camera", 14)
      +   "<span>Capture jointe</span>"
      +   '<span class="sg-espace"></span>'
      +   '<span style="font-weight:400;color:var(--sg-discret)">' + ko + " ko</span>"
      +   '<button type="button" class="sg-btn sg-rond" data-sg="recapturer" title="Reprendre la capture">'
      +     ico("camera", 15) + "</button>"
      +   '<button type="button" class="sg-btn sg-rond" data-sg="oter" title="Retirer la capture">'
      +     ico("corbeille", 15) + "</button>"
      + "</div>"
      + '<img class="sg-vignette-capture" alt="Aperçu de la capture jointe" src="' + captureUrl + '">';
  }

  /* ------------------------------------------------------------------
     Dictée vocale
     ------------------------------------------------------------------ */
  function MoteurDictee() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  // Tous les codes d'erreur prévus par la spécification, plus ceux que Chrome
  // et Edge émettent en pratique. Les laisser sans message était le défaut de
  // la première version : sur une erreur non traitée, l'état restait bloqué
  // sur "Écoute en cours" pendant que onend relançait le moteur en boucle,
  // sans que rien n'arrive jamais dans le champ.
  const ERREURS_DICTEE = {
    "not-allowed": "Le micro a été refusé. Cliquez sur l'icône de cadenas ou de caméra dans la barre d'adresse, autorisez le microphone, puis réessayez.",
    "service-not-allowed": "Le service de transcription a été refusé, par le navigateur ou par une stratégie d'entreprise. La dictée ne peut pas fonctionner ici.",
    "audio-capture": "Aucun micro n'a été trouvé. Vérifiez qu'un microphone est branché et sélectionné dans les réglages son de Windows.",
    "network": "La transcription n'a pas pu joindre son service. Elle passe par internet : un pare-feu ou un proxy peut la bloquer.",
    "language-not-supported": "Le français n'est pas pris en charge par la transcription de ce navigateur.",
    "bad-grammar": "La transcription a refusé sa configuration. Écrivez le texte à la main.",
    "aborted": null              // c'est nous qui avons arrêté : rien à dire
  };

  // Trace de mise au point, lisible dans la console (touche F12). La dictée
  // dépend du micro, du réseau et du navigateur : quand elle ne marche pas,
  // il faut pouvoir dire lequel des trois est en cause.
  function journalDictee(msg) {
    try { console.info("Signalement/dictée : " + msg); } catch (e) { /* sans console */ }
  }

  function majEtatDictee(txt, enCours, souci) {
    const b = $('[data-sg="dictee"]');
    const e = $(".sg-dictee .sg-etat");
    if (!b) return;
    b.classList.toggle("sg-enregistre", !!enCours);
    b.innerHTML = (enCours ? ico("arret", 15) + "Arrêter" : ico("micro", 15) + "Dicter");
    if (e) {
      e.innerHTML = txt;
      // Un échec de dictée doit se voir. En petit gris à côté du bouton, il
      // passait inaperçu et l'utilisateur concluait que le bouton ne marchait
      // pas, sans jamais lire pourquoi.
      e.classList.toggle("sg-souci", !!souci);
    }
  }

  function echecDictee(raison) {
    journalDictee("échec : " + raison);
    arreterDictee(true);
    majEtatDictee(ech(raison), false, true);
  }

  async function microRefuseDavance() {
    // L'API des permissions n'existe pas partout, et "microphone" n'y est pas
    // toujours connu : son absence n'est pas une réponse, on tente alors.
    try {
      if (!navigator.permissions || !navigator.permissions.query) return false;
      const p = await navigator.permissions.query({ name: "microphone" });
      return p.state === "denied";
    } catch (e) {
      return false;
    }
  }

  async function demarrerDictee() {
    const Moteur = MoteurDictee();
    if (!Moteur) { echecDictee("Ce navigateur n'a pas de moteur de dictée."); return; }

    // Ouvert par un double-clic sur le fichier, le hub n'est pas en https et
    // le micro sera refusé sans explication. Autant le dire tout de suite.
    if (!window.isSecureContext) {
      echecDictee("La dictée exige une page en https. Ouvrez le hub en ligne plutôt que le fichier local.");
      return;
    }
    if (await microRefuseDavance()) {
      echecDictee(ERREURS_DICTEE["not-allowed"]);
      return;
    }

    const zone = $("#sg-description");
    dicteeSocle = zone.value ? zone.value.replace(/\s*$/, "") + " " : "";
    dicteeAcquis = "";
    dicteeAEntendu = false;
    dicteeRelances = 0;
    dicteeDemarre = false;

    reco = new Moteur();
    reco.lang = "fr-FR";
    reco.continuous = true;
    reco.interimResults = true;    // le texte s'écrit pendant qu'on parle

    reco.onstart = () => {
      // C'est ici, et pas après l'appel à start(), que l'écoute commence
      // vraiment. Annoncer "Écoute en cours" plus tôt revenait à mentir quand
      // le moteur ne démarrait jamais.
      dicteeDemarre = true;
      clearTimeout(dicteeVeille);
      journalDictee("moteur démarré");
      majEtatDictee("Écoute en cours, parlez normalement. Le texte s'écrit au fur et à mesure.", true);
    };

    reco.onresult = ev => {
      dicteeAEntendu = true;
      dicteeRelances = 0;
      let provisoire = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const bout = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) dicteeAcquis += bout;
        else provisoire += bout;
      }
      zone.value = dicteeSocle + dicteeAcquis + provisoire;
      zone.scrollTop = zone.scrollHeight;
      majBoutonEnvoi();
    };

    reco.onerror = ev => {
      journalDictee("erreur " + ev.error);
      if (ev.error === "no-speech") {
        // Chrome coupe après quelques secondes de silence. Ce n'est pas une
        // panne : onend relancera, l'écoute se poursuit.
        majEtatDictee("Rien n'a été entendu pour l'instant. Parlez, l'écoute continue.", true);
        return;
      }
      if (!(ev.error in ERREURS_DICTEE)) {
        echecDictee("La dictée s'est interrompue (" + ev.error + ").");
        return;
      }
      const msg = ERREURS_DICTEE[ev.error];
      if (msg) echecDictee(msg);       // aborted vaut null : arrêt volontaire
    };

    // Chrome coupe l'écoute de lui-même après un silence, même en mode
    // continu : on relance. Mais si le moteur se termine aussitôt après avoir
    // démarré, sans avoir rien entendu, relancer sans fin ferait tourner la
    // page à vide en laissant croire qu'elle écoute. Au bout de trois fois,
    // on s'arrête et on le dit.
    reco.onend = () => {
      if (!dicteeActive) return;
      const aussitot = Date.now() - dicteeDepuis < 1200;
      journalDictee("moteur arrêté" + (aussitot ? " aussitôt" : "")
        + (dicteeAEntendu ? ", du texte a été reçu" : ", rien reçu"));
      if (aussitot && !dicteeAEntendu) {
        dicteeRelances++;
        if (dicteeRelances >= 3) {
          echecDictee("Le moteur de dictée s'arrête dès qu'il démarre. C'est en général un micro "
            + "indisponible, ou le service de transcription qui n'est pas joignable depuis ce réseau.");
          return;
        }
      } else {
        dicteeRelances = 0;
      }
      setTimeout(() => {
        if (!dicteeActive) return;
        try { dicteeDepuis = Date.now(); reco.start(); }
        catch (e) { echecDictee("La dictée n'a pas pu reprendre (" + (e.name || e) + ")."); }
      }, aussitot ? 400 : 0);
    };

    try {
      dicteeDepuis = Date.now();
      reco.start();
      dicteeActive = true;
      majEtatDictee("Démarrage de la dictée...", true);
      // Veille : si onstart n'arrive jamais, le bouton resterait sur "Arrêter"
      // sans que rien n'écoute. Au bout de six secondes, on tranche.
      clearTimeout(dicteeVeille);
      dicteeVeille = setTimeout(() => {
        if (dicteeActive && !dicteeDemarre) {
          echecDictee("Le moteur de dictée n'a pas démarré. Vérifiez l'autorisation du micro "
            + "dans la barre d'adresse.");
        }
      }, 6000);
    } catch (e) {
      echecDictee("La dictée n'a pas pu démarrer (" + (e.name || e) + ").");
    }
  }

  function arreterDictee(silencieux) {
    dicteeActive = false;
    dicteeDemarre = false;
    clearTimeout(dicteeVeille);
    if (reco) {
      // On coupe les rappels avant d'arrêter : sinon onend relancerait le
      // moteur que l'on vient d'éteindre, et onerror afficherait "aborted".
      reco.onend = null;
      reco.onerror = null;
      reco.onstart = null;
      try { reco.stop(); } catch (e) { /* déjà arrêtée */ }
      reco = null;
    }
    if (!silencieux) majEtatDictee(texteAvertissementDictee(), false);
  }

  function texteAvertissementDictee() {
    return "La dictée n'est pas traitée sur votre poste : votre voix est envoyée au service "
      + "de transcription de votre navigateur. Le texte reste modifiable après coup.";
  }

  /* ------------------------------------------------------------------
     Envoi
     ------------------------------------------------------------------ */

  function corpsMessage(titre, description, c) {
    return description.trim()
      + "\n\n-- \nSignalement envoyé depuis " + c.application + "\n"
      + contexteTexte(c);
  }

  async function copierCapture() {
    if (!captureBlob) return false;
    try {
      if (!navigator.clipboard || !window.ClipboardItem) return false;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": captureBlob })]);
      return true;
    } catch (e) {
      return false;
    }
  }

  function ouvrirBrouillon(titre, corps) {
    const sujet = "[Signalement] " + cfg.application + " - " + titre;
    // Les navigateurs et clients de messagerie tronquent les mailto trop
    // longs. On garde de la marge : le contexte technique compte déjà,
    // autant couper la description que perdre la fin du message.
    const LIMITE = 1800;
    let c = corps;
    if (c.length > LIMITE) c = c.slice(0, LIMITE) + "\n[...] message tronqué, il reste de la place dans le mail.";
    const url = "mailto:" + encodeURIComponent(cfg.destinataire)
      + "?subject=" + encodeURIComponent(sujet)
      + "&body=" + encodeURIComponent(c);
    location.href = url;
  }

  async function envoyerParFormulaire(titre, description, c) {
    const fd = new FormData();
    fd.append("subject", "[Signalement] " + cfg.application + " - " + titre);
    fd.append("titre", titre);
    fd.append("message", description);
    fd.append("application", c.application);
    fd.append("page", c.page);
    fd.append("navigateur", c.navigateur);
    fd.append("ecran", c.ecran);
    fd.append("date", c.date);
    if (cfg.destinataire) fd.append("_replyto", cfg.destinataire);
    // La capture n'arrivera que si l'offre du service accepte les pièces
    // jointes. Sur les offres gratuites de Formspree, Web3Forms et EmailJS,
    // elle sera ignorée : c'est pour cela qu'on la met aussi au presse-papiers.
    if (captureBlob) fd.append("capture", captureBlob, "capture.png");

    const rep = await fetch(cfg.endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
    if (!rep.ok) throw new Error("Le service a répondu " + rep.status);
    return true;
  }

  function blobEnDataUrl(blob) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    });
  }

  async function envoyerParEndpoint(titre, description, c) {
    const charge = { titre: titre, description: description, contexte: c, capture: null };
    if (captureBlob) charge.capture = await blobEnDataUrl(captureBlob);
    const rep = await fetch(cfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(charge)
    });
    if (!rep.ok) throw new Error("Le point de collecte a répondu " + rep.status);
    return true;
  }

  function message(classe, titre, texte) {
    const z = $(".sg-messages");
    if (!z) return;
    z.innerHTML = '<div class="sg-note ' + classe + '"><b>' + titre + "</b>" + texte + "</div>";
    z.scrollIntoView({ block: "nearest" });
  }

  async function envoyer() {
    const titre = $("#sg-titre").value.trim();
    const description = $("#sg-description").value.trim();
    if (!titre) { $("#sg-titre").focus(); return; }

    if (dicteeActive) arreterDictee();

    const btn = $('[data-sg="envoyer"]');
    btn.disabled = true;
    btn.innerHTML = ico("envoi", 15) + "Envoi...";

    const c = contexte();
    const corps = corpsMessage(titre, description, c);

    try {
      if (cfg.transport === "endpoint" && cfg.endpoint) {
        const avecCapture = !!captureBlob;
        await envoyerParEndpoint(titre, description, c);
        message("sg-ok", "Signalement envoyé",
          "Merci, le message est parti" + (avecCapture ? " avec la capture" : "") + ". Vous pouvez fermer.");

      } else if (cfg.transport === "formulaire" && cfg.endpoint) {
        await envoyerParFormulaire(titre, description, c);
        const copie = await copierCapture();
        message("sg-ok", "Signalement envoyé",
          captureBlob
            ? (copie
                ? "Merci, le message est parti. La capture est aussi dans votre presse-papiers, "
                  + "au cas où le service ne l'aurait pas acceptée."
                : "Merci, le message est parti.")
            : "Merci, le message est parti. Vous pouvez fermer.");

      } else {
        // Mode mailto : le brouillon s'ouvre déjà rempli, la capture attend
        // dans le presse-papiers. Un mail ne peut pas porter de pièce jointe
        // par simple lien, c'est une limite du navigateur, pas un oubli.
        const copie = await copierCapture();
        ouvrirBrouillon(titre, corps);
        if (captureBlob && copie) {
          message("sg-ok", "Brouillon ouvert",
            "Votre messagerie s'ouvre avec le texte déjà rempli. Placez le curseur dans le corps du mail, "
            + "faites <kbd>Ctrl</kbd> + <kbd>V</kbd> pour coller la capture, puis envoyez.");
        } else if (captureBlob) {
          message("sg-avert", "Brouillon ouvert, capture non copiée",
            "Le texte est rempli, mais votre navigateur n'a pas autorisé la copie de l'image. "
            + "Faites un clic droit sur l'aperçu ci-dessus, puis Copier l'image, et collez-la dans le mail.");
        } else {
          message("sg-ok", "Brouillon ouvert",
            "Votre messagerie s'ouvre avec le texte déjà rempli. Il ne reste qu'à envoyer.");
        }
      }
    } catch (e) {
      // Un envoi qui échoue ne doit pas faire perdre ce qui a été écrit :
      // on bascule sur le brouillon, qui lui ne dépend de personne.
      const copie = await copierCapture();
      ouvrirBrouillon(titre, corps);
      message("sg-avert", "Envoi direct impossible",
        ech(String(e.message || e)) + ". Votre messagerie a été ouverte avec le texte, "
        + (captureBlob && copie ? "et la capture est dans le presse-papiers (<kbd>Ctrl</kbd> + <kbd>V</kbd>)." : "")
        + " Rien n'est perdu.");
    } finally {
      btn.disabled = false;
      btn.innerHTML = ico("envoi", 15) + "Envoyer";
      majBoutonEnvoi();
    }
  }

  function majBoutonEnvoi() {
    const btn = $('[data-sg="envoyer"]');
    if (btn) btn.disabled = !$("#sg-titre").value.trim();
  }

  /* ------------------------------------------------------------------
     Panneau
     ------------------------------------------------------------------ */
  function construirePanneau() {
    const c = contexte();
    const avecDictee = cfg.dictee && !!MoteurDictee();

    // Ce texte est écrit avant qu'on sache si une capture sera jointe : il ne
    // promet donc rien sur le collage. Le message affiché après l'envoi, lui,
    // dit exactement ce qu'il reste à faire.
    const modeTexte = cfg.transport === "mailto"
      ? "À l'envoi, votre messagerie s'ouvrira avec un brouillon déjà rempli pour "
        + ech(cfg.destinataire) + "."
      : "Le signalement part directement, sans passer par votre messagerie.";

    return ''
      + '<dialog class="sg-modale" aria-labelledby="sg-titre-panneau">'
      +   '<div class="sg-tete">'
      +     '<h2 id="sg-titre-panneau">' + ico("insecte", 16) + "Signaler un problème</h2>"
      +     '<span class="sg-espace"></span>'
      +     '<button type="button" class="sg-btn sg-rond" data-sg="fermer" aria-label="Fermer">' + ico("fermer", 15) + "</button>"
      +   "</div>"
      +   '<div class="sg-corps">'
      +     '<div class="sg-messages"></div>'
      +     '<div class="sg-capture"></div>'
      +     '<div class="sg-champ">'
      +       '<label for="sg-titre">En deux mots, que se passe-t-il ?</label>'
      +       '<input type="text" id="sg-titre" maxlength="120" placeholder="Ex. : le bouton Imprimer ne fait rien">'
      +     "</div>"
      +     '<div class="sg-champ">'
      +       '<label for="sg-description">Qu\'est-ce qui ne va pas ?</label>'
      +       '<textarea id="sg-description" placeholder="Ce que vous faisiez, ce que vous attendiez, ce qui est arrivé. Ou dictez-le."></textarea>'
      +     "</div>"
      +     (avecDictee
          ? '<div class="sg-dictee">'
            +   '<button type="button" class="sg-btn sg-sec" data-sg="dictee">' + ico("micro", 15) + "Dicter</button>"
            +   '<span class="sg-etat">' + texteAvertissementDictee() + "</span>"
            + "</div>"
          : "")
      +     '<p class="sg-contexte">Joint automatiquement : ' + ech(c.titrePage) + ", "
      +       ech(c.navigateur) + ", fenêtre " + ech(c.ecran) + ", " + ech(c.date) + ".</p>"
      +   "</div>"
      +   '<div class="sg-pied">'
      +     '<span class="sg-contexte sg-espace">' + modeTexte + "</span>"
      +     '<button type="button" class="sg-btn" data-sg="envoyer" disabled>' + ico("envoi", 15) + "Envoyer</button>"
      +   "</div>"
      + "</dialog>";
  }

  async function ouvrir() {
    // Le thème du panneau suit celui de l'application hôte quand elle en
    // annonce un, sinon le réglage du système s'applique via la feuille.
    const t = document.documentElement.dataset.theme;
    if (t) racine.dataset.sgTheme = t;

    // La capture d'abord, panneau ensuite : ce qu'il faut photographier,
    // c'est l'écran du problème, pas celui du formulaire.
    let blob = null;
    if (cfg.capture && captureSupportee() && !captureRefusee) {
      blob = await capturerSansLaPastille();
    }

    racine.insertAdjacentHTML("beforeend", construirePanneau());
    const dlg = $(".sg-modale");
    poserCapture(blob);
    brancherPanneau(dlg);
    dlg.showModal();
    $("#sg-titre").focus();
  }

  function fermer(dlg) {
    if (dicteeActive) arreterDictee();
    if (captureUrl) { URL.revokeObjectURL(captureUrl); captureUrl = null; }
    captureBlob = null;
    dlg.close();
    dlg.remove();
  }

  function brancherPanneau(dlg) {
    dlg.addEventListener("click", async ev => {
      const cible = ev.target.closest("[data-sg]");
      if (!cible) {
        // Clic sur le fond : le rectangle du dialog est celui du panneau,
        // donc un clic hors de ce rectangle tombe forcément sur le fond.
        const r = dlg.getBoundingClientRect();
        const dedans = ev.clientX >= r.left && ev.clientX <= r.right
                    && ev.clientY >= r.top && ev.clientY <= r.bottom;
        if (!dedans) fermer(dlg);
        return;
      }
      const quoi = cible.dataset.sg;
      if (quoi === "fermer") fermer(dlg);
      else if (quoi === "envoyer") envoyer();
      else if (quoi === "oter") poserCapture(null);
      else if (quoi === "recapturer") {
        // Le panneau s'efface le temps de la prise, sinon c'est lui qu'on
        // photographie. Il revient juste après, capture posée.
        captureRefusee = false;
        dlg.style.visibility = "hidden";
        const blob = await capturerSansLaPastille();
        dlg.style.visibility = "";
        poserCapture(blob);
      } else if (quoi === "dictee") {
        if (dicteeActive) arreterDictee(); else demarrerDictee();
      }
    });

    dlg.addEventListener("cancel", ev => { ev.preventDefault(); fermer(dlg); });
    $("#sg-titre").addEventListener("input", majBoutonEnvoi);
    // Ctrl+Entrée depuis la description : le raccourci attendu d'un formulaire
    // qu'on remplit vite.
    $("#sg-description").addEventListener("keydown", ev => {
      if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); envoyer(); }
    });
  }

  /* ------------------------------------------------------------------
     Mise en place
     ------------------------------------------------------------------ */
  function init(reglages) {
    if (racine) return;                      // déjà installé
    cfg = Object.assign({}, REGLAGES_DEFAUT, reglages || {});

    if (cfg.transport !== "mailto" && !cfg.endpoint) {
      console.warn('Signalement : transport "' + cfg.transport + '" demandé sans endpoint, '
        + "retour au mode mailto.");
      cfg.transport = "mailto";
    }
    if (cfg.transport === "mailto" && !cfg.destinataire) {
      console.warn("Signalement : aucun destinataire, la pastille n'est pas posée.");
      return;
    }

    const style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);

    racine = document.createElement("div");
    racine.id = "sg-racine";
    racine.innerHTML =
        '<button type="button" class="sg-pastille" aria-label="Signaler un problème">'
      +   ico("insecte", 18)
      +   '<span class="sg-mot">Signaler un problème</span>'
      + "</button>";
    document.body.appendChild(racine);

    racine.querySelector(".sg-pastille").addEventListener("click", ouvrir);
  }

  /* ------------------------------------------------------------------
     Diagnostic

     La dictée dépend de trois choses hors de notre portée : le navigateur,
     l'autorisation du micro et l'accès au service de transcription. Quand
     elle ne marche pas, il faut pouvoir dire laquelle des trois manque
     plutôt que de deviner. Depuis la console (touche F12) :

         Signalement.diagnostic()

     Le résultat s'affiche et se copie tel quel.
     ------------------------------------------------------------------ */
  async function diagnostic() {
    const Moteur = MoteurDictee();
    let permission = "inconnue";
    try {
      if (navigator.permissions && navigator.permissions.query) {
        permission = (await navigator.permissions.query({ name: "microphone" })).state;
      } else {
        permission = "API des permissions absente";
      }
    } catch (e) {
      permission = "non interrogeable (" + (e.name || e) + ")";
    }

    let micros = "non énumérables";
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const l = await navigator.mediaDevices.enumerateDevices();
        const entrees = l.filter(d => d.kind === "audioinput");
        // Sans autorisation accordée, les libellés sont vides mais le nombre
        // reste juste : c'est ce qui nous intéresse ici.
        micros = entrees.length + " entrée(s) audio";
      }
    } catch (e) {
      micros = "erreur (" + (e.name || e) + ")";
    }

    const d = {
      page: location.href,
      contexteSecurise: window.isSecureContext,
      navigateur: navigateurCourt(),
      enLigne: navigator.onLine,
      langue: navigator.language,
      moteurDictee: Moteur ? (window.SpeechRecognition ? "SpeechRecognition" : "webkitSpeechRecognition") : "absent",
      autorisationMicro: permission,
      entreesAudio: micros,
      captureEcran: captureSupportee() ? "disponible" : "absente",
      pressePapiersImage: !!(navigator.clipboard && window.ClipboardItem) ? "disponible" : "absent",
      transport: cfg ? cfg.transport : "widget non initialisé",
      destinataire: cfg ? cfg.destinataire : ""
    };

    try {
      console.log("=== Diagnostic du signalement B27 ===");
      Object.keys(d).forEach(k => console.log("  " + k + " : " + d[k]));
      console.log("=== copiez ce bloc pour le transmettre ===");
    } catch (e) { /* sans console */ }
    return d;
  }

  return { init: init, diagnostic: diagnostic };
})();
