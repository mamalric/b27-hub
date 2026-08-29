# Outils B27

Le portail des outils et ressources du bureau d'études B27. Un seul lien à transmettre — à un collègue, à un client, à n'importe qui.

Tout est centré sous le logo : la recherche, une tuile météo en données réelles, un calendrier en semaines ISO, puis deux rayons, nos outils et les ressources, et la fiche de contact. Un champ d'écoulement animé, calculé en local, occupe le fond : des lignes de flux, comme l'air et l'eau qui sont le métier de la maison. Pas de compte, pas de portail de connexion.

En ligne : https://mamalric.github.io/b27-hub/

## Ajouter une entrée

Un seul fichier à modifier, [`catalogue.js`](catalogue.js). Copier une fiche existante, remplir le nom, le pitch, l'adresse, la catégorie et le statut, puis pousser sur `main`. La carte apparaît dans son rayon, les compteurs suivent d'eux-mêmes. Le gabarit, les deux types et les cinq statuts sont documentés en tête du fichier.

Avant de publier, vérifier que le catalogue est cohérent :

```bash
python tests/verifier_catalogue.py
```

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Ossature de la page, presque vide : tout est construit à l'exécution. |
| `catalogue.js` | Outils, ressources, contact, catégories, réglages. Le seul fichier à faire vivre. |
| `hub.js` | Logo, icônes, thème, champ d'écoulement, météo, calendrier, rayons, recherche, panneau À propos. |
| `hub.css` | La peau du portail : sombre par défaut, thème clair à un clic. |
| `signalement.js` | La pastille "Signaler un problème", autonome et réutilisable ailleurs. |
| `logo-b27.svg` | Le logo, qui sert aussi de favicon. |
| `tests/verifier_catalogue.py` | Contrôle du catalogue, bibliothèque standard uniquement. |
| `docs/charte.md` | Palette, logo, types de carte, conventions visuelles. |
| `docs/signalement.md` | Fonctionnement du signalement et modes d'envoi. |

HTML, CSS et JavaScript sans framework et sans étape de build. Tout est dans le dépôt, à une exception près : la météo, en données réelles Open-Meteo, sans clé et sans compte. Sans réseau la tuile disparaît et la page s'ouvre aussi bien par un double-clic sur `index.html`.

## Signaler un problème

Une pastille en bas à droite de chaque écran. Elle joint une capture de ce que l'utilisateur a sous les yeux, lui demande un titre et une description qu'il peut dicter à voix haute, et transmet le tout.

`signalement.js` est autonome : deux lignes suffisent à le poser sur n'importe quel autre outil B27. Voir [docs/signalement.md](docs/signalement.md) pour les modes d'envoi et leurs limites.

## Ce que le hub ne fait pas

Il ne stocke rien, ne demande aucun compte et ne suit personne. Il redirige, c'est tout. Seul le choix de thème clair ou sombre est retenu dans le navigateur du visiteur. La page porte une balise `noindex` et un `robots.txt` : elle se transmet par son lien, elle n'a pas vocation à remonter dans un moteur de recherche.

Une exception, et elle est signalée dans l'interface : la dictée vocale du signalement passe par le service de transcription du navigateur, la voix sort donc du poste. C'est la seule chose qui le fasse.
