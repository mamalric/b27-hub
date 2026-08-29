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

## La disposition

Un tableau de bord : barre latérale permanente à gauche, recherche en haut, contenu au centre.

**La barre latérale ne se replie pas sur écran large.** C'est ce qui distingue un hall d'une simple arborescence : toutes les catégories sont à un clic, depuis n'importe où, on n'a jamais à remonter pour changer de branche. Chaque entrée porte la couleur de sa catégorie, la même que sur sa tuile, et la catégorie courante est teintée de cette couleur plutôt que d'un vert générique.

Sous 960 px elle sort du flux et devient un tiroir, ouvert par le bouton de la barre du haut, refermé par le voile, par Échap, ou en suivant un lien. C'est la même barre, seule sa position change : rien à maintenir en double.

**La recherche est au centre de la barre du haut**, comme sur un tableau de bord : c'est le geste le plus rapide quand on sait déjà ce qu'on cherche. Sous 960 px elle passe sous le titre, où l'on peut encore lire ce qu'on tape.

## Ce qui vous appartient, sans compte

Le hub n'a pas de portail de connexion et n'en aura pas. La personnalisation ne passe donc par aucun compte : elle vit dans le navigateur de chacun, en `localStorage`. C'est personnel sans être identifiant, et cela ne quitte jamais le poste.

**Trois choses seulement sont retenues** : le thème, les portes épinglées, et les six dernières portes ouvertes. Les deux listes sont filtrées contre le catalogue à la lecture, sans quoi une porte retirée y laisserait un fantôme.

**L'épingle ne se montre qu'au survol de la carte, ou si elle est déjà posée.** Une rangée d'épingles grises sur toutes les cartes ferait un bruit permanent pour une action occasionnelle. Au clavier elle reste atteignable, et sur tactile elle est toujours visible faute de survol pour la révéler.

**La carte reste un lien pur.** L'épingle se pose par-dessus, en frère et non en enfant : un bouton à l'intérieur d'un lien serait du HTML invalide, et cliquer sur l'épingle suivrait le lien.

**Tant que rien n'est épinglé, une invite explique à quoi sert l'épingle**, plutôt que de laisser un vide sans raison. Elle disparaît à la première épingle.

**La salutation suit l'heure du poste.** Bonjour, bonsoir, bonne nuit : c'est la seule chose que le hub sait de vous, et il la lit sur l'horloge. Accueillant sans rien demander.

## Le bandeau de charpente

Le hall s'ouvre sur une charpente métallique en axonométrie, qui passe du construit au dessiné de gauche à droite : membrures épaisses et pleines à gauche, trait fin seul à droite, sur une trame de calque. Un ouvrage qui se lèverait depuis son plan.

**C'est un dessin original, pas une photo vectorisée.** La demande partait d'une image de charpente, vraisemblablement une photo de banque d'images : la tracer en aurait produit une oeuvre dérivée. Le dessin a donc été refait, dans le même esprit. Il y gagne aussi techniquement : neuf kilo-octets, net à toute taille, aucune requête, et il se recadre du grand écran au téléphone.

**La géométrie est calculée, pas tracée à l'oeil.** `src/charpente.py` produit le SVG : deux files de poteaux, poutres longitudinales et transversales, fermes à treillis, contreventement une travée sur trois. C'est la seule façon d'obtenir des membrures réellement parallèles et une trame régulière. Une charpente mal d'aplomb se voit immédiatement, surtout chez un BET. Pour la modifier : éditer le script, relancer `python src/charpente.py bandeau-charpente.svg`, recoller le résultat dans `index.html`.

**Axonométrie et non perspective**, volontairement : c'est le mode de représentation des plans d'exécution, et elle se répète proprement sur toute la largeur d'un bandeau.

**Le rapport du viewBox suit celui du bandeau**, autour de 5,5 pour 1. Avec un recadrage en `slice`, tout écart entre les deux se paie en rognage : un premier essai en 1200 x 280 coupait les poteaux à mi-hauteur, et la charpente n'était plus qu'un enchevêtrement de poutres sans appui visible.

**Le texte est protégé par un voile dégradé.** Le fond suffirait presque, mais une membrure blanche qui passe derrière une lettre blanche fait tomber le contraste localement, et cela ne se voit qu'à l'usage. Le voile reprend le vert le plus foncé du bandeau, où le blanc tient 8,1:1, et s'efface avant la moitié pour ne pas éteindre le dessin. Le dégradé de fond va de `#5f7f1f` à `#3f5714`, les deux extrémités tenant au moins 4,6:1 avec le texte blanc.

**Sous 700 px, la charpente recule à l'état de texture.** Le bandeau y devient presque carré alors que le dessin est fait pour 5,5 pour 1 : le recadrage n'en montre plus qu'une tranche, qui ne se lit plus comme une charpente et se met à concurrencer le texte.

**Elle ne s'imprime pas.** Elle mangerait de l'encre pour un décor, et le bandeau garde son sens sans elle.

## Les cartes chiffrées

Quatre aplats colorés à l'arrivée, texte blanc, comme sur un tableau de bord. Chacune répond à une question qu'on se pose vraiment en arrivant : qu'est-ce qui marche, qu'est-ce que nous fabriquons nous-mêmes, qu'est-ce qui vient d'ailleurs, qu'est-ce qui arrive. Les chiffres sont calculés, jamais recopiés.

**Leurs teintes sont plus foncées que celles des tuiles, et ce n'est pas une inadvertance.** Une tuile ne porte qu'un glyphe : seuil de contraste 3:1. Une carte chiffrée porte du texte de petite taille : seuil 4,5:1. Le bleu et l'ocre ont donc été assombris, le `#2f6f8f` venant de la feuille de B27 Mobility où il est documenté à 5,54:1.

**Il n'y a pas de graphique**, et il n'y en aura pas. Un hub n'a aucune donnée à tracer : une courbe y serait de la décoration déguisée en information.

## La navigation par dossiers

Le hall se parcourt comme une armoire. Le premier niveau ne montre que des dossiers ; on en ouvre un, parfois un sous-dossier, et on arrive aux portes. Trois niveaux au maximum, et le troisième n'existe que là où le contenu le justifie.

**La position tient dans l'adresse** : `#/`, `#/ressources`, `#/ressources/technique`. Ce n'est pas un détail d'implémentation. C'est ce qui rend le bouton Précédent du navigateur fonctionnel, ce qui permet d'ouvrir un dossier dans un nouvel onglet, et ce qui permet d'envoyer à un collègue le lien d'un dossier précis plutôt que celui du hall. Une adresse inventée ou devenue caduque ramène au hall sans rien casser.

**Le bandeau d'accueil disparaît dès qu'on entre dans un dossier.** Il a dit ce qu'il avait à dire, et l'en-tête suffit ensuite à porter l'identité. La place revient au contenu.

### Le fil d'Ariane

**Il est affiché à tous les niveaux, hall compris.** Le masquer à la racine le rendait invisible sur le premier écran, donc introuvable : on ne découvrait son existence qu'après être entré quelque part, c'est-à-dire trop tard pour qu'il serve de repère.

**Le dernier maillon fait office de titre de niveau.** Le bandeau d'accueil ayant disparu dès qu'on entre dans un dossier, c'est lui qui dit où l'on se trouve : il porte donc l'icône du dossier, un cran de graisse de plus, et le compte de ce qu'il contient. Cinq dossiers, trois sous-dossiers, six portes, une fiche. Le fil ne dit pas seulement où l'on est, il dit aussi ce qu'on y trouve, avant même de regarder la grille.

**Les maillons parents sont des liens, le maillon courant n'en est pas un.** Un lien vers la page où l'on se trouve déjà n'apprend rien et trompe.

**Le bouton Retour double le fil, volontairement.** Le fil dit où l'on est, le bouton donne une cible large et toujours au même endroit, qui est ce qu'on cherche quand on veut juste remonter d'un cran. Au hall, il n'y a nulle part où remonter : il ne s'affiche pas.

Le conteneur du fil est en `flex-wrap: nowrap` et c'est le fil lui-même qui se replie à l'intérieur. Sans cela, sur un écran étroit, c'est le bloc entier qui passait à la ligne et laissait le bouton Retour seul sur la sienne.

**La recherche traverse tous les niveaux d'un coup.** C'est indispensable dans une navigation en profondeur : chercher "INIES" depuis le hall doit trouver, sans avoir à deviner dans quel dossier c'est rangé. Chaque résultat rappelle son dossier d'origine, sans quoi on trouve la porte mais on ne sait pas d'où elle vient.

## Le dossier, une icône d'application

Un carré plein coloré, glyphe blanc au centre, le nom posé dessous, hors de la tuile, et le compte en pastille sur le coin. C'est la grammaire d'un écran d'accueil, et elle est reprise telle quelle : **le carré coloré est le dossier**, il ne flotte pas dans une carte. Il n'y a donc aucun cadre autour de lui.

**Une couleur par catégorie, prise sur les conventions de lot de B27.** Les teintes ne sont pas décoratives : elles viennent du projet du site (`b27-site/src/styles/tokens.css`), où B27 code déjà ses lots en CAO. Un ingénieur B27 y reconnaît le code couleur de ses plans.

| Catégorie | Couleur | Origine |
|---|---|---|
| Chauffage et climatisation | `#3e8fb8` | lot CVC |
| Ventilation | `#2f7f92` | dérivée de la famille CVC |
| Plomberie et ECS | `#1f7a6e` | lot Plomberie |
| Thermique et réglementation | `#c4562f` | lot Thermique |
| Sécurité incendie | `#c62828` | lot SSI, éclairci |
| Carbone et environnement | `#557a3a` | lot Paysage |
| Électricité | `#b17e00` | lot Électricité, assombri |
| B27 | `#5f7f1f` | le vert de marque, profond |
| Ressources et référentiels | `#6b5ba6` | lot BIM |
| Qui contacter | `#6e6a63` | gris chaud neutre |

Trois écarts, assumés. L'ocre de l'électricité est assombri de `#c18900` à `#b17e00`, le premier ne tenant que 3,07:1 avec le glyphe blanc. Le rouge SSI est au contraire éclairci de `#b01818` à `#c62828` : l'original tenait très bien face au glyphe, mais tombait à 2,68:1 face au fond du thème sombre, où la tuile se confondait avec la page. La ventilation n'a pas de teinte propre chez B27, où elle appartient à la famille CVC ; un cyan la distingue du chauffage sans quitter la famille de l'air.

Le gris de la structure `#4a4a4a` avait d'abord été retenu pour l'annuaire, puis écarté à la mesure : 2,12:1 sur fond sombre, la tuile y disparaissait.

**Toute couleur nouvelle doit tenir au moins 3:1 sur trois fronts** : avec le glyphe blanc, avec le fond du thème clair, et avec celui du thème sombre. Une teinte trop claire efface le glyphe, une teinte trop foncée fait disparaître la tuile. `tests/verifier_catalogue.py` calcule les trois et refuse de passer en dessous. La palette actuelle tient partout, avec un minimum de 3,13:1.

**La couleur ne change pas avec le thème.** Une icône d'application garde sa couleur quel que soit le fond de l'écran d'accueil : c'est précisément pourquoi chaque teinte doit tenir contre les deux fonds à la fois. Le bas du dégradé n'est pas écrit à la main, il est calculé en `color-mix` à 82 pour cent de la teinte : une seule valeur à saisir par catégorie, et les deux extrémités restent cohérentes. Un aplat simple sert de repli aux navigateurs sans `color-mix`.

**Les sous-dossiers héritent de la couleur de leur catégorie.** En entrant dans Ressources, les trois sous-dossiers restent violets, et l'icône du fil d'Ariane aussi : on voit d'un coup d'oeil qu'on est toujours dans la même branche. Un champ `couleur` sur une sous-catégorie force malgré tout une teinte.

**Le rayon vaut 23 pour cent du côté**, proportion des icônes d'application des systèmes courants. Exprimé en pourcentage et non en pixels, il reste juste quelle que soit la taille de la tuile.

**Le glyphe occupe 54 pour cent de la tuile**, avec un trait de 1,4 au lieu de 2. Les tracés Lucide sont dessinés à 2 sur une grille de 24 : à 16 px cela donne 1,3 px à l'écran, ce qui est juste, mais à 75 px le trait d'origine serait épais et le blanc sur fond coloré supporte mal la surcharge. Règle générale : plus le glyphe est grand, plus son trait doit être proportionnellement fin pour garder la même densité apparente.

**Le compte est une pastille de notification**, sur le coin de la tuile. Fond papier et non rouge : ce n'est pas une alerte, c'est un inventaire.

### Le nom

**Il est visible par défaut, et le masquage n'intervient que sous `@media (hover: hover) and (pointer: fine)`.** L'ordre compte : sur tablette et sur téléphone, où le survol n'existe pas, des tuiles muettes seraient indéchiffrables, et c'est aussi le repli si la requête média n'est pas comprise. Le focus clavier révèle le nom au même titre que la souris. Le nom est toujours présent dans le code, même invisible, pour les lecteurs d'écran, et le `title` du lien porte le nom et le compte.

Le nom reste dans le flux même invisible : l'opacité ne change rien à la place occupée, la grille ne bouge donc pas au survol. C'est aussi ce qui rend le chevauchement impossible, quel que soit le nombre de lignes du nom.

Un dossier est un `<a href="#/...">` et non un `<div>` avec un écouteur de clic. On gagne ainsi le clavier, le clic du milieu, le menu contextuel et l'historique sans écrire une ligne de plus.

### Les micro-animations

Au survol, c'est **la tuile entière** qui se soulève de 4 px et grandit de 5 pour cent, son ombre s'approfondissant, pendant que le nom apparaît en montant de 4 px. Le geste est celui d'une icône que l'on vise, pas celui d'un contenu qui bouge à l'intérieur d'un cadre.

À l'apparition d'une grille, chaque élément entre avec un décalage de 26 ms sur le précédent : le regard suit la construction au lieu de recevoir tout d'un bloc. Le remplissage de l'animation est `backwards` et non `both`, détail qui compte : avec `both`, la valeur finale resterait appliquée après la fin et bloquerait le `transform` du survol.

Tout cela disparaît sous `prefers-reduced-motion`.

### Deux pièges rencontrés

Notés pour ne pas les refaire. Le premier, du temps où le nom était positionné en absolu dans une carte : un intitulé sur deux lignes chevauchait l'icône de 7 px, ce qui ne se voyait que sur les noms longs et n'est apparu qu'à la mesure. Le second : passer la tuile en `display: grid` avec `place-items: center` semblait équivalent à une colonne flex, mais dans une grille dont la colonne est dimensionnée par son contenu, un pourcentage de largeur n'a plus de référence stable ; l'icône tombait à 64 px au lieu de 103.

### À l'impression

La tuile garde son aplat vert, avec `print-color-adjust: exact`. Le glyphe étant blanc, une tuile sans fond le ferait disparaître.

## Les objets du hall

**Un dossier est carré, une porte est rectangulaire.** La forme dit la fonction : le carré contient, le rectangle mène ailleurs. Une porte a besoin de sa description, un dossier n'a besoin que de son nom.

**Une porte de type `outil`** est ce que nous fabriquons, ou un site que nous assumons. Carte pleine : vignette, titre, pitch, mots-clés, pastille de statut. C'est la vedette, elle occupe la place qu'il faut.

**Une porte de type `lien`** est une ressource extérieure que nous ne maintenons pas. Carte compacte, sans mots-clés, dans une grille plus dense. Vingt liens ne doivent pas noyer deux outils : ils sont utiles, ils ne sont pas la raison d'être du hall.

**Une fiche d'annuaire** n'est pas une porte. On ne clique pas dessus pour aller ailleurs, on y prend une adresse ou un numéro. Elle ne se soulève donc pas au survol, et ce sont ses liens `mailto` et `tel` qui portent l'interaction. L'annuaire occupe son propre dossier dans le hall, au même titre que les catégories.

## Règles à ne pas casser

**Le vert ne remplit pas les cartes de porte.** Sur une carte de porte, il vit dans la vignette d'icône et le survol ; la carte elle-même reste blanche ou papier sombre. Le jour où trente portes s'affichent, trente aplats verts seraient illisibles. Les tuiles de dossier font exception et l'assument : elles sont des icônes d'application, un objet différent, et elles ne cohabitent jamais avec des cartes de porte sur le même écran.

**Une carte cliquable est un lien, une carte inerte n'en est pas un.** `hub.js` produit un `<a>` pour les statuts `en-ligne` et `beta` pourvus d'une adresse, un `<div class="inerte">` sinon. Un lien qui ne mène nulle part serait annoncé comme un lien par un lecteur d'écran et prendrait le focus au clavier pour rien.

**Le statut normal ne porte pas de pastille.** Seuls `beta`, `a-venir`, `bureau` et `obsolete` en reçoivent une. Marquer "en ligne" sur chaque carte reviendrait à ne rien marquer.

**Les chiffres du bandeau sont calculés, jamais écrits.** Portes ouvertes, univers, portes en préparation : tout vient du catalogue à l'affichage. Un chiffre recopié à la main finit toujours par mentir.

**Aucune requête externe.** Pas de Google Fonts, pas de CDN, pas d'icône chargée à la volée. La pile de polices commence par Inter et retombe sur Segoe UI, présente sur les postes B27. Les icônes sont des tracés Lucide inlinés dans `TRACES_ICONES`. C'est ce qui permet d'ouvrir la page depuis le disque, et de ne rien envoyer à un tiers.

**La barre de recherche n'apparaît qu'au-delà de `REGLAGES.seuilFiltres` portes** (6 par défaut). En dessous elle occuperait plus de place que le contenu qu'elle filtre. Au-dessus, elle apparaît sans qu'il y ait rien à faire.

**Les sous-dossiers ne se forment que s'ils sont peuplés.** Une catégorie dont aucune porte ne déclare de sous-catégorie s'ouvre directement sur ses portes : on ne traverse jamais un dossier qui n'aurait qu'un seul enfant à montrer. Les portes d'une catégorie à sous-dossiers qui n'en déclarent pas sont regroupées dans un dossier "Divers", sans quoi elles seraient invisibles.

**La pastille de signalement a sa propre palette.** `signalement.js` ne lit pas les variables du hub : il redéfinit les mêmes valeurs chez lui. C'est délibéré, pour que le bouton ait exactement la même tête sur tous les outils B27, y compris ceux qui n'ont pas cette feuille. Il suit en revanche l'attribut `data-theme` de la page hôte pour son thème clair ou sombre.

## Ajouter une icône

Les tracés viennent de [Lucide](https://lucide.dev), grille 24, trait 2 px, extrémités et jointures arrondies. Copier le contenu du `<svg>` (les `<path>`, `<rect>`, `<circle>`) dans `TRACES_ICONES` de `hub.js`, sans la balise `<svg>` elle-même qui est reconstruite par la fonction `ico()`. Le nom de la clé se cite ensuite dans le champ `icone` d'une porte ou d'une catégorie. Une icône inconnue ne casse pas la page : elle retombe sur l'icône `info` et le contrôle du catalogue le signale.

## Impression

Le hall n'est pas fait pour être imprimé, mais s'il l'est, la feuille d'impression force le thème clair, retire le lavis du bandeau et fait suivre chaque carte de son adresse complète. Une carte cliquable sans son URL ne sert à rien sur papier.
