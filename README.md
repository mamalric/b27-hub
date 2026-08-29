# Outils B27

Page d'accueil unique vers les outils et applications du bureau d'études B27. Un seul lien à transmettre, une carte par outil.

En ligne : https://mamalric.github.io/b27-hub/

## Ajouter un outil

Un seul fichier à modifier, [`outils.js`](outils.js). Copier une fiche existante, remplir le nom, le pitch, l'adresse, la catégorie et le statut, puis pousser sur `main`. La carte apparaît, les compteurs, les sections et les filtres suivent d'eux-mêmes. Le gabarit et les cinq statuts possibles sont documentés en tête du fichier.

Avant de publier, vérifier que le catalogue est cohérent :

```bash
python tests/verifier_outils.py
```

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Ossature de la page, presque vide : tout est construit à l'exécution. |
| `outils.js` | Le catalogue : outils, catégories, réglages. Le seul fichier à faire vivre. |
| `hub.js` | Icônes, thème, construction des cartes, recherche, panneau À propos. |
| `hub.css` | Charte graphique reprise des outils B27 existants. |
| `tests/verifier_outils.py` | Contrôle du catalogue, bibliothèque standard uniquement. |
| `docs/charte.md` | Palette, statuts, conventions visuelles. |

HTML, CSS et JavaScript sans framework et sans étape de build. Aucune requête externe : la page s'ouvre aussi bien en ligne que par un double-clic sur `index.html`.

## Ce que le hub ne fait pas

Il ne stocke rien, ne demande aucun compte et ne suit personne. Il redirige, c'est tout. Seul le choix de thème clair ou sombre est retenu dans le navigateur du visiteur. La page porte une balise `noindex` et un `robots.txt` : elle se transmet par son lien, elle n'a pas vocation à remonter dans un moteur de recherche.
