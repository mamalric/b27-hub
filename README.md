# Outils B27

Le hall d'entrée des outils du bureau d'études B27. Un seul lien à transmettre.

Une barre latérale donne accès à toutes les catégories depuis n'importe où ; le hall s'ouvre sur des dossiers, on en ouvre un, parfois un sous-dossier, et on arrive aux outils, aux sites de l'entreprise, aux ressources métier ou à l'annuaire.

**Le hall est personnel sans le moindre compte.** Épinglez une porte, elle remonte en tête à chacune de vos visites ; les dernières portes ouvertes s'y ajoutent. Tout vit dans votre navigateur et n'en sort jamais.

En ligne : https://mamalric.github.io/b27-hub/

## Ajouter une porte

Un seul fichier à modifier, [`catalogue.js`](catalogue.js). Copier une fiche existante, remplir le nom, le pitch, l'adresse, la catégorie et le statut, puis pousser sur `main`. Le dossier apparaît, les compteurs suivent d'eux-mêmes. Le champ `sousCategorie` est facultatif : une catégorie sans sous-dossier peuplé s'ouvre directement sur ses portes. Le gabarit, les deux types de carte et les cinq statuts sont documentés en tête du fichier.

Avant de publier, vérifier que le catalogue est cohérent :

```bash
python tests/verifier_catalogue.py
```

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Ossature de la page, presque vide : tout est construit à l'exécution. |
| `catalogue.js` | Portes, annuaire, catégories, sous-catégories, réglages. Le seul fichier à faire vivre. |
| `hub.js` | Logo, icônes, thème, bandeau, navigation par dossiers, cartes, recherche, panneau À propos. |
| `hub.css` | Charte graphique reprise des outils B27 existants. |
| `signalement.js` | La pastille "Signaler un problème", autonome et réutilisable ailleurs. |
| `logo-b27.svg` | Le logo, qui sert aussi de favicon. |
| `bandeau-charpente.svg` | Le dessin du bandeau d'accueil, collé dans `index.html`. |
| `src/charpente.py` | Génère ce dessin. Géométrie calculée, pas tracée à l'oeil. |
| `tests/verifier_catalogue.py` | Contrôle du catalogue, bibliothèque standard uniquement. |
| `docs/charte.md` | Palette, logo, types de carte, conventions visuelles. |
| `docs/signalement.md` | Fonctionnement du signalement et modes d'envoi. |

HTML, CSS et JavaScript sans framework et sans étape de build. Aucune requête externe : la page s'ouvre aussi bien en ligne que par un double-clic sur `index.html`.

La position dans l'arborescence tient dans l'adresse (`#/ressources/technique`) : le bouton Précédent du navigateur fonctionne, et le lien d'un dossier précis se transmet tel quel.

## Signaler un problème

Une pastille en bas à droite de chaque écran. Elle joint une capture de ce que l'utilisateur a sous les yeux, lui demande un titre et une description qu'il peut dicter à voix haute, et transmet le tout.

`signalement.js` est autonome : deux lignes suffisent à le poser sur n'importe quel autre outil B27. Voir [docs/signalement.md](docs/signalement.md) pour les modes d'envoi et leurs limites.

## Ce que le hub ne fait pas

Il ne stocke rien, ne demande aucun compte et ne suit personne. Il redirige, c'est tout. Seul le choix de thème clair ou sombre est retenu dans le navigateur du visiteur. La page porte une balise `noindex` et un `robots.txt` : elle se transmet par son lien, elle n'a pas vocation à remonter dans un moteur de recherche.

Une exception, et elle est signalée dans l'interface : la dictée vocale du signalement passe par le service de transcription du navigateur, la voix sort donc du poste. C'est la seule chose qui le fasse.
