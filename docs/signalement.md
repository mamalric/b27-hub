# Le bouton de signalement

`signalement.js` pose une pastille en bas à droite de l'écran. Repliée, c'est un rond discret. Au survol, l'intitulé se déplie. Au clic, un panneau s'ouvre avec une capture de ce que l'utilisateur avait sous les yeux, un titre, une description qu'il peut dicter à voix haute, et un bouton d'envoi.

Le fichier est autonome : aucune dépendance, sa propre feuille de style, ses propres icônes. Il ne suppose rien de l'application qui l'accueille.

## L'ajouter à un autre outil B27

Copier `signalement.js` à côté du fichier HTML de l'outil, puis deux lignes avant `</body>` :

```html
<script src="signalement.js"></script>
<script>Signalement.init({
  application: "Calculette ECS et Bouclage",
  destinataire: "mamalric@b27.fr"
});</script>
```

C'est tout. Les autres réglages ont des valeurs par défaut qui conviennent.

Pour un outil livré en fichier HTML unique, comme la Calculette ECS ou le Sélectionneur de radiateurs, coller le contenu de `signalement.js` dans une balise `<script>` en fin de page revient au même : le widget ne lit aucun fichier extérieur.

## Les réglages

| Réglage | Défaut | Rôle |
|---|---|---|
| `application` | `"Application B27"` | Nom repris dans l'objet du message. La seule ligne à changer d'un outil à l'autre, avec le destinataire. |
| `destinataire` | vide | Adresse d'arrivée. Obligatoire en mode `mailto`. |
| `transport` | `"mailto"` | `mailto`, `formulaire` ou `endpoint`. Voir plus bas. |
| `endpoint` | vide | Adresse d'envoi, pour `formulaire` et `endpoint`. |
| `capture` | `true` | Proposer la capture d'écran. |
| `dictee` | `true` | Proposer la dictée vocale. |
| `largeurCaptureMax` | `1600` | La capture est réduite au-delà de cette largeur, en pixels. |
| `actif` | (lu par le hub) | Dans `catalogue.js`, `false` retire la pastille sans toucher au code. |

## Les trois modes d'envoi

### `mailto`, le mode par défaut

La messagerie s'ouvre avec un brouillon déjà rempli : destinataire, objet, description, et le contexte technique. La capture, elle, est copiée dans le presse-papiers : il reste à faire `Ctrl+V` dans le corps du mail avant d'envoyer.

Cette touche en plus n'est pas un raccourci de paresse, c'est une limite du navigateur : **un lien `mailto:` ne peut pas porter de pièce jointe.** Aucune page web ne peut créer un mail avec un fichier attaché, quel que soit le code écrit. Le presse-papiers est le contournement le plus court qui existe.

Avantages : gratuit, immédiat, rien à installer, rien qui transite par un tiers.

### `formulaire`, pour un envoi direct via un service

Le signalement part sans ouvrir de messagerie, par un service de formulaire (Formspree, Web3Forms, EmailJS). Il faut créer un compte chez l'un d'eux, récupérer l'adresse d'envoi et la mettre dans `endpoint`.

**Point vérifié le 29/08/2026, et qui change le calcul : sur ces trois services, les pièces jointes sont réservées aux offres payantes.**

| Service | Offre gratuite | Pièces jointes |
|---|---|---|
| [Formspree](https://formspree.io) | 50 envois par mois | Non. À partir de 15 dollars par mois (offre Personal), 1 Go de stockage. |
| [Web3Forms](https://web3forms.com) | 250 envois par mois | Non. Offre Pro à partir de 12 dollars par mois en annuel, fichiers jusqu'à 5 Mo. |
| [EmailJS](https://www.emailjs.com) | 200 mails par mois, variables plafonnées à 50 ko | Non. Offre Personal à 9 dollars par mois, pièces jointes jusqu'à 500 ko. |

Une capture d'écran réduite à 1600 px pèse en général entre 200 ko et 1 Mo. La limite de 500 ko d'EmailJS est donc juste ; Web3Forms Pro et Formspree Personal passent confortablement.

En offre gratuite, le widget reste utilisable : le texte part tout seul, et la capture est mise dans le presse-papiers avec un message qui le dit. C'est un demi-automatisme, pas un envoi complet.

Autre point à peser : le contenu des signalements, captures d'écran d'outils internes comprises, transiterait par ce prestataire.

### `endpoint`, pour un point de collecte maison

Le signalement part vers une adresse à vous, capture comprise, en `POST` JSON :

```json
{
  "titre": "Le bouton Imprimer ne fait rien",
  "description": "Je clique sur Imprimer et il ne se passe rien.",
  "contexte": {
    "application": "Hub Outils B27",
    "page": "https://mamalric.github.io/b27-hub/",
    "titrePage": "Outils B27",
    "navigateur": "Chrome 148",
    "plateforme": "Win32",
    "ecran": "1920 x 1080",
    "theme": "light",
    "date": "29/08/2026 18:00:43"
  },
  "capture": "data:image/png;base64,iVBORw0KGgo..."
}
```

C'est le seul mode qui soit à la fois gratuit, complet et privé. Il demande en revanche de déployer le point de collecte. Un Worker Cloudflare convient : l'offre gratuite couvre largement le volume, R2 offre 10 Go de stockage, et Cloudflare sait envoyer un mail. Vous utilisez déjà Cloudflare Pages sur PicSous et Viticole du monde, l'outillage est donc en place.

Le widget attend une réponse HTTP en succès. En cas d'échec, il bascule tout seul sur le brouillon de mail : rien de ce qui a été écrit n'est perdu.

## Ce qui est joint sans qu'on le demande

Affiché dans le panneau, sous les champs, pour qu'il n'y ait pas de collecte invisible : nom de l'application, adresse de la page, titre de la page, navigateur et version, plateforme, taille de la fenêtre, thème, date et heure.

Rien d'autre. Aucun identifiant, aucun cookie, aucun historique.

## La capture d'écran

Elle est tentée dès l'ouverture du panneau, avant de l'afficher : ce qu'il faut photographier, c'est l'écran du problème, pas celui du formulaire. La pastille se retire de l'image le temps de la prise.

**Le navigateur demandera toujours une confirmation.** Aucune page ne peut filmer un écran sans accord explicite, et c'est une bonne chose. Sur Chrome et Edge, l'option `preferCurrentTab` fait proposer d'emblée l'onglet courant, ce qui réduit la prise à un clic sur Partager.

Si l'utilisateur refuse, on ne lui redemande plus de la visite. Un bouton Capturer reste disponible dans le panneau s'il change d'avis.

La capture est réduite à 1600 px de large et encodée en PNG. Elle peut être reprise ou retirée avant l'envoi.

## La dictée vocale

Le bouton Dicter écrit le texte au fur et à mesure de la parole, sans attendre la fin de la phrase. Sur Chrome, l'écoute s'arrête d'elle-même après un silence : le widget la relance tant que l'utilisateur n'a pas cliqué sur Arrêter.

**La transcription n'est pas locale.** Sur Chrome et Edge, la voix est envoyée au service de transcription de l'éditeur du navigateur. C'est la seule chose, dans tout ce dispositif, qui sorte du poste. Le panneau l'écrit à côté du bouton, avant le premier enregistrement.

Firefox n'implémente pas cette interface : le bouton ne s'affiche pas, le champ reste saisissable au clavier.

Si le microphone est refusé, le message indique comment l'autoriser depuis la barre d'adresse.

## Vérifié le 29/08/2026

Dans le navigateur, sur le hub :

- Pastille repliée à 46 px, dépliée à 182 px au survol et au focus clavier.
- Panneau en thème clair et en thème sombre, le widget suivant l'attribut `data-theme` de l'application hôte.
- Capture refusée par l'environnement : repli propre sur le message "Aucune capture jointe" et le bouton Capturer.
- Circuit complet de capture exercé contre un flux d'écran simulé : image réduite, PNG de 59 ko, aperçu, taille affichée, boutons reprendre et retirer.
- Envoi en mode `endpoint` vers un point de collecte local : titre, description, contexte complet et capture en data URL de 80 ko reçus et vérifiés.
- Microphone : confirmé qu'aucune demande n'est faite tant que l'utilisateur ne clique pas sur Dicter. Refus du micro géré, message explicite, bouton rendu à son état de repos.
- Composition du brouillon `mailto` contrôlée par relecture de l'URL : accents, esperluettes et chevrons intacts après encodage.

Deux choses n'ont pas pu être exercées dans cet environnement et restent à essayer sur un poste réel : la dictée qui aboutit, le microphone étant bloqué dans le navigateur d'essai, et l'ouverture effective du client de messagerie, volontairement non déclenchée pour ne pas faire surgir une fenêtre de brouillon sur le poste.
