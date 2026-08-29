# Charte graphique du hub

Ce document dit d'où viennent les choix visuels du hub et ce qu'il ne faut pas casser en le faisant évoluer. Le principe directeur tient en une phrase : un collègue qui passe du hall à un outil ne doit pas avoir l'impression de changer de site.

## D'où vient la charte

Deux outils déjà publiés servent de référence, ce sont ceux que les collègues connaissent :

- [Calculette ECS et Bouclage](https://mamalric.github.io/calculette-ecs-bouclage/)
- [Dimensionnement émetteurs Finimetal](https://mamalric.github.io/S-lectionneur-de-radiateurs/)

Les deux partagent la même feuille : palette papier et encre, primaire olive, thème clair et sombre avec bouton de bascule, rouage en haut à droite ouvrant un panneau "À propos", icônes Lucide inlinées. Le hub reprend ces jetons à l'identique, sans les réinterpréter.

## Les deux verts

Ils ne font pas le même travail, et les confondre casserait soit la marque, soit la lisibilité.

`--marque` vaut `#95c03d`. C'est le vert exact du logo B27, relevé sur le fichier officiel. **Il ne sert qu'au logo**, dans l'en-tête et dans le bandeau d'accueil, plus un lavis très dilué en fond de bandeau.

`--primaire` vaut `#7da32f`, sa variante assombrie. Elle porte tout le reste : vignettes d'icône, filtres actifs, survols, pastilles. C'est le vert des deux outils de référence, et c'est lui qui fait la continuité visuelle.

Cette séparation n'est pas un caprice. Le vert de marque est trop clair pour porter du texte sur blanc. La feuille de style de B27 Mobility, faite pour les mêmes usages internes, tranche pareil : `--b27-green` pour la marque, `--b27-green-deep` pour ce qui doit rester lisible.

Le site vitrine B27 (projet `2026-08-05_Site B27`) suit une direction artistique différente, "COTE 27", avec son propre vert `#95BE4E`. Même famille, autre usage : la continuité recherchée ici est celle des outils entre eux, parce que c'est entre eux que le collègue navigue.

## Le logo

Le fichier `logo-b27.svg` porte le monogramme sur sa plaque blanche : c'est la forme qui sert de favicon.

Dans la page, `hub.js` dessine le monogramme seul, sans plaque, en `--marque`. Il se pose directement sur le fond et reste lisible en clair comme en sombre. Le viewBox est calé au plus juste sur les tracés, `0 0 35.52 38.95`, pour que le logo occupe vraiment la taille demandée sans marge morte. Demander une hauteur suffit, la largeur suit.

Ne pas enfermer le monogramme dans un carré vert : "B27" est déjà une marque, la plaque colorée ferait doublon et abîmerait le contraste.

## Jetons de couleur

Les mêmes valeurs qu'en tête de `hub.css`, redonnées ici pour référence. Toute couleur nouvelle doit passer par un jeton, jamais être écrite en dur dans une règle.

| Jeton | Clair | Sombre | Usage |
|---|---|---|---|
| `--fond` | `#eef0ed` | `#101211` | Fond de page |
| `--papier` | `#ffffff` | `#1a1d1b` | Cartes, en-tête, bandeau, panneau |
| `--papier-2` | `#f4f6f3` | `#232725` | Surfaces secondaires, pastilles de mot-clé |
| `--papier-3` | `#e8ebe6` | `#2c312e` | Pavés d'icône de section, survol des boutons |
| `--encre` | `#1e2220` | `#e9ebe8` | Texte principal |
| `--encre-2` | `#525754` | `#b2b7b3` | Pitch, texte secondaire |
| `--discret` | `#676e69` | `#929991` | Comptes, mots-clés, pied de page |
| `--ligne` | `#dde0dc` | `#343a36` | Bordures |
| `--marque` | `#95c03d` | `#95c03d` | **Le logo, et rien d'autre** |
| `--primaire` | `#7da32f` | `#a5cc52` | Vignettes, filtre actif, survol |
| `--primaire-fond` | `#eaf3d8` | `#2b3a17` | Fond de vignette, filtre actif |
| `--primaire-encre` | `#4c6a19` | `#c9e58f` | Texte sur fond primaire clair |

Le sombre n'est pas un simple inversement : les gris y sont légèrement teintés et la primaire est éclaircie, sinon l'olive vire au brun sur fond noir. Le vert de marque, lui, est déjà assez clair pour tenir sur fond sombre et garde sa valeur exacte.

## Les objets du hall

**Une porte de type `outil`** est ce que nous fabriquons, ou un site que nous assumons. Carte pleine : vignette, titre, pitch, mots-clés, pastille de statut. C'est la vedette, elle occupe la place qu'il faut.

**Une porte de type `lien`** est une ressource extérieure que nous ne maintenons pas. Carte compacte, sans mots-clés, dans une grille plus dense. Vingt liens ne doivent pas noyer deux outils : ils sont utiles, ils ne sont pas la raison d'être du hall.

**Une fiche d'annuaire** n'est pas une porte. On ne clique pas dessus pour aller ailleurs, on y prend une adresse ou un numéro. Elle ne se soulève donc pas au survol, et ce sont ses liens `mailto` et `tel` qui portent l'interaction. Elle vit sous un filet de séparation, après les portes.

## Règles à ne pas casser

**Le vert ne remplit pas les cartes.** Il vit dans le logo, la vignette d'icône, l'état actif d'un filtre et le survol. Une carte reste blanche ou papier sombre. Le jour où trente portes s'affichent, trente aplats verts seraient illisibles.

**Une carte cliquable est un lien, une carte inerte n'en est pas un.** `hub.js` produit un `<a>` pour les statuts `en-ligne` et `beta` pourvus d'une adresse, un `<div class="inerte">` sinon. Un lien qui ne mène nulle part serait annoncé comme un lien par un lecteur d'écran et prendrait le focus au clavier pour rien.

**Le statut normal ne porte pas de pastille.** Seuls `beta`, `a-venir`, `bureau` et `obsolete` en reçoivent une. Marquer "en ligne" sur chaque carte reviendrait à ne rien marquer.

**Les chiffres du bandeau sont calculés, jamais écrits.** Portes ouvertes, univers, portes en préparation : tout vient du catalogue à l'affichage. Un chiffre recopié à la main finit toujours par mentir.

**Aucune requête externe.** Pas de Google Fonts, pas de CDN, pas d'icône chargée à la volée. La pile de polices commence par Inter et retombe sur Segoe UI, présente sur les postes B27. Les icônes sont des tracés Lucide inlinés dans `TRACES_ICONES`. C'est ce qui permet d'ouvrir la page depuis le disque, et de ne rien envoyer à un tiers.

**Deux seuils font varier l'interface avec la taille du catalogue.** `REGLAGES.seuilFiltres` (6 par défaut) commande l'apparition de la barre de recherche et des filtres, `REGLAGES.seuilSections` (3) celle des titres de catégorie. En dessous, ces éléments occuperaient plus de place que le contenu qu'ils organisent. Au-dessus, ils apparaissent sans qu'il y ait rien à faire.

**La pastille de signalement a sa propre palette.** `signalement.js` ne lit pas les variables du hub : il redéfinit les mêmes valeurs chez lui. C'est délibéré, pour que le bouton ait exactement la même tête sur tous les outils B27, y compris ceux qui n'ont pas cette feuille. Il suit en revanche l'attribut `data-theme` de la page hôte pour son thème clair ou sombre.

## Ajouter une icône

Les tracés viennent de [Lucide](https://lucide.dev), grille 24, trait 2 px, extrémités et jointures arrondies. Copier le contenu du `<svg>` (les `<path>`, `<rect>`, `<circle>`) dans `TRACES_ICONES` de `hub.js`, sans la balise `<svg>` elle-même qui est reconstruite par la fonction `ico()`. Le nom de la clé se cite ensuite dans le champ `icone` d'une porte ou d'une catégorie. Une icône inconnue ne casse pas la page : elle retombe sur l'icône `info` et le contrôle du catalogue le signale.

## Impression

Le hall n'est pas fait pour être imprimé, mais s'il l'est, la feuille d'impression force le thème clair, retire le lavis du bandeau et fait suivre chaque carte de son adresse complète. Une carte cliquable sans son URL ne sert à rien sur papier.
