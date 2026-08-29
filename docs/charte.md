# Charte graphique du hub

Ce document dit d'où viennent les choix visuels du hub et ce qu'il ne faut pas casser en le faisant évoluer. Le principe directeur tient en une phrase : un collègue qui passe du hub à un outil ne doit pas avoir l'impression de changer de site.

## D'où vient la charte

Deux outils déjà publiés servent de référence, ce sont ceux que les collègues connaissent :

- [Calculette ECS et Bouclage](https://mamalric.github.io/calculette-ecs-bouclage/)
- [Dimensionnement émetteurs Finimetal](https://mamalric.github.io/S-lectionneur-de-radiateurs/)

Les deux partagent la même feuille : palette papier et encre, primaire olive, thème clair et sombre avec bouton de bascule, rouage en haut à droite ouvrant un panneau "À propos", icônes Lucide inlinées. Le hub reprend ces jetons à l'identique, sans les réinterpréter.

Le site vitrine B27 (projet `2026-08-05_Site B27`) suit une direction artistique différente, "COTE 27", avec son propre vert de marque `#95BE4E` et sa variante lisible en texte `#5F7F2E`. L'olive `#7da32f` du hub est de la même famille : c'est la déclinaison "outils" du vert B27. La continuité visuelle recherchée ici est celle des outils, pas celle du site vitrine, parce que c'est entre les outils que le collègue navigue.

## Jetons de couleur

Les mêmes valeurs qu'en tête de `hub.css`, redonnées ici pour référence. Toute couleur nouvelle doit passer par un jeton, jamais être écrite en dur dans une règle.

| Jeton | Clair | Sombre | Usage |
|---|---|---|---|
| `--fond` | `#eef0ed` | `#101211` | Fond de page |
| `--papier` | `#ffffff` | `#1a1d1b` | Cartes, en-tête, panneau |
| `--papier-2` | `#f4f6f3` | `#232725` | Surfaces secondaires, pastilles de mot-clé |
| `--papier-3` | `#e8ebe6` | `#2c312e` | Survol des boutons discrets |
| `--encre` | `#1e2220` | `#e9ebe8` | Texte principal |
| `--encre-2` | `#525754` | `#b2b7b3` | Pitch, texte secondaire |
| `--discret` | `#676e69` | `#929991` | Titres de section, mots-clés, pied de page |
| `--ligne` | `#dde0dc` | `#343a36` | Bordures |
| `--primaire` | `#7da32f` | `#a5cc52` | Couleur de marque, logo, survol |
| `--primaire-fond` | `#eaf3d8` | `#2b3a17` | Vignette d'icône, filtre actif |
| `--primaire-encre` | `#4c6a19` | `#c9e58f` | Texte sur fond primaire clair |

Le sombre n'est pas un simple inversement : les gris y sont légèrement teintés et la primaire est éclaircie, sinon l'olive vire au brun sur fond noir.

## Règles à ne pas casser

**Le vert ne remplit pas les cartes.** Il vit dans le logo, la vignette d'icône, l'état actif d'un filtre et le survol. Une carte reste blanche ou papier sombre. Le jour où trente outils s'affichent, trente aplats verts seraient illisibles.

**Une carte cliquable est un lien, une carte inerte n'en est pas un.** `hub.js` produit un `<a>` pour les statuts `en-ligne` et `beta` pourvus d'une adresse, un `<div class="inerte">` sinon. Un lien qui ne mène nulle part serait annoncé comme un lien par un lecteur d'écran et prendrait le focus au clavier pour rien.

**Le statut normal ne porte pas de pastille.** Seuls `beta`, `a-venir`, `bureau` et `obsolete` en reçoivent une. Marquer "en ligne" sur chaque carte reviendrait à ne rien marquer.

**Aucune requête externe.** Pas de Google Fonts, pas de CDN, pas d'icône chargée à la volée. La pile de polices commence par Inter et retombe sur Segoe UI, présente sur les postes B27. Les icônes sont des tracés Lucide inlinés dans `TRACES_ICONES`. C'est ce qui permet d'ouvrir la page depuis le disque, et de ne rien envoyer à un tiers.

**Deux seuils font varier l'interface avec la taille du catalogue.** `REGLAGES.seuilFiltres` (6 par défaut) commande l'apparition de la barre de recherche et des filtres, `REGLAGES.seuilSections` (3) celle des titres de catégorie. En dessous, ces éléments occuperaient plus de place que le contenu qu'ils organisent. Au-dessus, ils apparaissent sans qu'il y ait rien à faire.

## Ajouter une icône

Les tracés viennent de [Lucide](https://lucide.dev), grille 24, trait 2 px, extrémités et jointures arrondies. Copier le contenu du `<svg>` (les `<path>`, `<rect>`, `<circle>`) dans `TRACES_ICONES` de `hub.js`, sans la balise `<svg>` elle-même qui est reconstruite par la fonction `ico()`. Le nom de la clé se cite ensuite dans le champ `icone` d'un outil ou d'une catégorie. Une icône inconnue ne casse pas la page : elle retombe sur l'icône `info` et le contrôle du catalogue le signale.

## Impression

Le hub n'est pas fait pour être imprimé, mais s'il l'est, la feuille d'impression force le thème clair et fait suivre chaque carte de son adresse complète. Une carte cliquable sans son URL ne sert à rien sur papier.
