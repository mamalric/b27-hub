# Charte graphique du portail

Ce document dit d'où viennent les choix visuels du portail et ce qu'il ne faut pas casser en le faisant évoluer. Le principe directeur a changé avec la refonte en portail : la page est une démonstration de maîtrise autant qu'un annuaire. Elle doit rester professionnelle, moderne, sérieuse, et donner envie — à un collègue, à un client, à n'importe qui à qui l'on transmet le lien.

## Le concept

Un portail public de visibilité, à la Thermexcel mais en version 2026 : on entre, on voit les outils et les ressources du bureau d'études, on clique, c'est tout. Pas de compte, pas de portail de connexion, et il n'y en aura pas. Tout est centré sous le logo : l'emblème, le titre, l'accroche, la recherche, puis les tuiles vivantes et les deux rayons.

## Sombre par défaut

C'est l'identité du portail, pas un réglage du poste : le fond sombre est ce qui donne leur relief au champ d'écoulement et au vert B27. Le thème clair reste à un clic, mémorisé par navigateur.

## Le vert, et où il a le droit de vivre

Le vert d'accent est le `#95C03D` du logo, exactement. Sur le fond sombre `#0a0d08`, il tient 9,2:1 : il peut porter du texte, servir d'aplat, souligner. Sur le fond clair, il ne tient rien du tout face à du texte petit : le thème clair a donc son propre vert d'encre, `#4e6b1c`, pour tout ce qui se lit, et réserve le `#95C03D` aux aplats qui portent une encre foncée. Tous les jetons de texte des deux thèmes tiennent 4,5:1, vérifié au calcul, le gris discret du thème clair ayant été assombri d'un cran pour cela.

## Le champ d'écoulement

Le fond de page est un champ de vecteurs animé : des particules qui suivent des lignes de flux, comme de l'air ou de l'eau en mouvement. C'est le métier d'un bureau d'études fluides, en fond de page, et c'est calculé en local — pas une image, pas une vidéo, pas une bibliothèque.

Le champ est une somme de sinus déphasés dans le temps, pas du vrai bruit de Perlin : à l'écran la différence ne se voit pas et le calcul tient en une ligne. Le vert clair y est volontairement rare, un trait sur sept environ.

Les traînées ont un délai d'expiration ferme, et c'est une leçon payée deux fois. La première version estompait par voile translucide : trop dense, elle virait à la paille, et surtout l'estompage est asymptotique — l'arrondi 8 bits fait qu'un pixel sombre n'atteint jamais tout à fait le fond, les traînées ne mouraient jamais et s'accumulaient en toile. Désormais le fond est repeint en entier à chaque image et chaque particule ne garde que ses cinquante-cinq dernières positions : l'expiration est garantie, pas approchée.

**Le fond vit avec le ciel et les saisons.** La mesure Open-Meteo qui remplit la tuile règle aussi le champ : bruine et pluie descendent en fines stries obliques, la neige dérive en flocons qui oscillent, le brouillard et le couvert font dériver de vrais cumulus construits — quatre à six lobes bombés aux bases alignées, un ventre plat ombré qui les assoit, figés à leur naissance pour que le nuage dérive d'un bloc sans bouillonner, le soleil étire des courants lents sous un halo doré fixe, et le vent mesuré incline et allonge les traînées. Les nappes et le halo sont les décors qui rendent chaque temps reconnaissable au premier regard : la vitesse et l'opacité seules, personne ne les voit, l'erreur a été faite et corrigée — plafonné à l'équivalent de 40 km/h, au-delà suivre la réalité rendrait le fond nerveux. La saison teinte la palette : hiver froid, printemps vert franc, été doré, automne ambré, et le fond lui-même glisse de quelques niveaux avec elle. Et elle teinte *vraiment* tout : le couvert et l'orage ne remplacent pas la palette de saison, ils la mélangent — désaturée vers le gris sous les nuages, tirée vers les verts profonds sous l'orage. Une première version la remplaçait, et un été entier de ciel gris n'aurait jamais montré le doré d'août.

**Le thème clair compense, il ne duplique pas.** Le fond presque blanc mange le contraste : ce qui est juste sur fond sombre y devient imperceptible. Tout ce qui se dessine — traits, gouttes, flocons, nuages — y gagne donc opacité et épaisseur d'un facteur fixe, réglé une fois.

**L'orage se dit par la turbulence, jamais par la lumière.** Pas d'éclair, pas de flash, aucune variation brutale de luminosité : la règle « apaisant, jamais épileptique » domine tout le reste. Un changement de météo ne bascule rien d'un coup : chaque particule adopte la nouvelle ambiance à sa renaissance, le fond glisse d'un état à l'autre en quelques secondes.

**La mort n'existe qu'hors champ.** Un trait qu'on suit du regard ne meurt jamais à l'écran — ni sèchement, ni en se dissolvant : il vole tant qu'il est visible, et la dérive du vent, toujours positive, garantit qu'il finira par sortir du cadre. Sa traînée le suit dehors, et c'est une fois le dernier point sorti qu'il renaît ailleurs. Un flocon naît en fondu au milieu de l'écran mais n'y meurt jamais, il tombe dehors. Le surplus d'un changement d'ambiance est condamné, pas exécuté : il vole normalement jusqu'à sa sortie naturelle. Vérifié au chiffre : douze traits suivis six cents images, zéro renaissance visible.

Si le poste demande moins d'animations (`prefers-reduced-motion`), le champ est dessiné une fois, immobile, dans l'ambiance du moment : moins d'animations, pas moins de dessin. Un onglet caché suspend le tracé.

## L'emblème

Le monogramme B27 n'est pas redessiné : c'est la marque, elle appartient à l'entreprise. C'est sa mise en scène qui change : une plaque opaque aux coins arrondis — opaque volontairement, translucide les lignes de flux passaient à travers le logo — et une aura verte qui respire lentement derrière. Le titre du portail passe du blanc au vert en dégradé sur ses derniers caractères.

## Les tuiles vivantes

Deux tuiles qui font du portail autre chose qu'une liste de liens. Sur grand écran elles occupent le coin haut gauche en colonne, la météo puis le calendrier, et y restent ancrées au défilement — mais repliées en pastilles étroites, la température d'un côté, le numéro de semaine de l'autre : la colonne entière chevaucherait les rayons, la pastille ne chevauche rien. Cliquer une pastille ramène en haut, là où la tuile entière est lisible. Sous 1240 px, les tuiles reprennent leur place sous la recherche.

**La météo** affiche des données réelles, Open-Meteo, sans clé ni compte. Les mesures secondaires — pression au dixième d'hectopascal, ressenti au dixième de degré — sont là pour la précision qu'elles suggèrent, et ce sont pourtant de vraies mesures : le service les fournit à ce pas. Le lieu par défaut vient du catalogue ; « ma position » l'affine — et le géocodage inverse de l'API Adresse de l'État (sans clé) lui donne son vrai nom de ville, « Votre position » n'étant qu'un pis-aller hors de France. Un bouton actualise le relevé sans attendre le cache. Ce choix de lieu reste dans le navigateur du visiteur.

**Un clic sur la tuile ouvre la météo en grand** : les dix mesures du moment — dont le point de rosée, absent du service et calculé par la formule de Magnus, la donnée du fluidiste —, les prochaines vingt-quatre heures de trois en trois, la semaine, le lever et le coucher du soleil, la qualité de l'air à l'indice européen avec particules et pollens. Deux requêtes de plus, prévisions et air, sans clé, gardées vingt minutes ; l'air peut manquer sans que le reste en souffre.

**Chacun compose sa tuile.** Dans le panneau, des cases décident des mesures que la petite tuile affiche, entre une et six, dans l'ordre stable du registre. Le choix vit dans le navigateur, comme le thème : le portail reste sans compte. La tuile veille : toutes les dix minutes et au retour sur l'onglet, le relevé est revérifié, le cache de vingt minutes décidant si une requête part réellement — un onglet ouvert depuis le matin ne montre jamais la météo du matin. Sans réseau, la tuile n'apparaît pas, rien ne clignote, et elle apparaît d'elle-même dès qu'une veille aboutit. À minuit, le calendrier bascule sur le nouveau jour.

**Le calendrier** met les semaines ISO sur l'axe vertical, les jours en tête, les week-ends teintés, le jour courant en aplat vert, la semaine courante surlignée. C'est la monnaie du bureau d'études : tout s'y planifie en numéro de semaine. Entièrement calculé en local.

## L'ancrage au défilement

L'entrée du portail ne disparaît pas quand on déroule : elle se transforme. L'emblème et le titre du héros s'effacent en reculant, proportionnellement au défilement, pendant qu'une pilule fixe portant le logo et le nom glisse en haut au centre — l'oeil lit une transformation, pas une disparition. La pilule ramène en haut d'un clic. Tout est en glissement, et `prefers-reduced-motion` coupe l'effacement progressif.

## Les rayons

Deux rayons et une fiche, sans métaphore : **Nos outils** (fabriqués ici) en cartes, **Ressources** (sites de référence) en rangées compactes, **Contact** en fiche.

**La page se déroule, et le sommaire donne la vue d'ensemble.** Se dérouler est la nature de cette page, et les détours essayés pour l'en empêcher, les dossiers de la v3 puis une ruche d'alvéoles hexagonales où l'on plongeait métier par métier, ont tous fini par être retirés : cacher le catalogue derrière un clic coûte plus qu'il ne range. Les groupes s'alignent donc à plat, un par métier pour les outils dans l'ordre de `CATEGORIES`, un par domaine pour les ressources, chaque titre portant une pastille à la couleur du lot : la couleur remonte du contenu jusqu'au titre, on lit le métier avant d'avoir lu son nom. Un métier sans outil n'ouvre pas de groupe, une section vide serait du bruit ; il vit au sommaire.

**Le sommaire est fixé à droite de l'écran.** Tous les métiers de la maison s'y lisent : ceux qui ont des outils mènent d'un clic à leur groupe, ceux qui n'en ont pas encore restent estompés, pastille en pointillé, et c'est ainsi que le portail montre l'étendue du bureau d'études avant d'en avoir écrit tous les outils. Suivent les domaines de ressources et le contact, séparés par un filet. Le repère suit le défilement et marque où l'on est. Sur écran moyen les noms se replient et il ne reste que les pastilles de couleur ; sous 1240 px le sommaire disparaît, le défilement suffit ; pendant une recherche il s'efface, ses repères pointeraient des groupes à moitié vidés. Le clic défile sans toucher à l'adresse : le portail n'a toujours pas de fragment.

De la ruche reste une leçon, notée pour ne pas la repayer : une forme étrangère à la page, l'hexagone quand tout le reste est rectangle arrondi, dénature la charte quelle que soit la qualité de son exécution. Toute nouveauté visuelle doit se construire avec le vocabulaire déjà présent, rectangles arrondis, pastilles, filets, verre.

## La signature, et ce qui n'entre pas dans le portail

Le site de l'entreprise n'est pas un de nos outils. Rangé dans "Nos outils, fabriqués ici", il en prenait la carte, la couleur de lot et le compteur : il se donnait pour un outil du bureau d'études. Il signe désormais la page en pied : un filet en travers de la largeur, le monogramme à gauche sur sa plaque, "le portail est édité par B27", le lien `b27.fr` à droite. Pas de fond de carte, et c'est ce qui le distingue au premier regard des rayons. C'est du mobilier de page, au même titre que l'en-tête, donc hors du filtre de recherche. Tout se règle dans `REGLAGES.editeur` ; sans url, la signature disparaît.

Et ce qui est réservé à l'interne n'entre pas dans le portail. Il est public et se transmet à des clients : un outil que seuls les salariés peuvent ouvrir, la réservation des voitures de société par exemple, y serait au mieux inutile, au pire une porte fermée au nez du visiteur. La règle vaut pour toute entrée future.

## La recherche

Un seul champ, centré, qui filtre tout en direct : cartes, rangées, fiches. La touche `/` l'amène depuis n'importe où, Échap le vide — les conventions d'un outil qu'on utilise au clavier. Pendant une recherche, les tuiles vivantes s'effacent : on est venu chercher quelque chose, la météo attendra.

## Les panneaux et les barres

**Un panneau ne surgit pas, il se pose.** L'ouverture des modales — météo détaillée, À propos — est un glissement : le cadre monte de dix-huit pixels en s'opacifiant, le voile d'arrière-plan se floute progressivement, et le contenu suit en cascade, un souffle après le cadre. La fermeture est animée aussi, par `@starting-style` et `transition-behavior: allow-discrete` : un navigateur qui ignore ces règles ouvre d'un coup, comme avant, sans rien casser. `prefers-reduced-motion` coupe tout.

**La page n'a pas de barre de défilement.** Sa gouttière réservée dessinait un bloc plein — noir en sombre, blanc en clair — à côté du canvas animé, qui ne peut pas passer dessous. Elle est supprimée : la molette, le clavier et la pilule d'ancrage suffisent à une page de cette profondeur. Les barres des panneaux restent : fines, sans flèches, gouttière transparente fondue dans la carte — pseudo-éléments pour Chrome et Edge, propriétés standard pour Firefox, Chromium ignorant `::-webkit-scrollbar` dès qu'on lui donne `scrollbar-color`.

**Un panneau ouvert possède la molette, par un seul moteur.** Le fond est verrouillé (`body:has(.modale[open])`), et toute molette — souris sur le panneau ou à côté — passe par la même inertie maison : une cible que la molette déplace, une position qui la rejoint en s'amortissant. L'histoire de ce choix : le navigateur livre la molette à ce qui est sous le curseur, donc le panneau défilait nativement dessus et par un second moteur à côté — deux sensations différentes, structurellement. Un événement synthétique ne pouvant pas déclencher le défilement natif, l'unification s'est faite dans l'autre sens : un moteur unique, partout, au pixel près. `prefers-reduced-motion` saute directement à la cible. La modale est une colonne : en-tête fixe, seul le corps défile, une seule barre, qui démarre sous l'en-tête.

**Les cases à cocher sont dessinées dans la charte** : plaque arrondie bordée, fond vert de marque au coché, coche sombre qui se déploie en un cinquième de seconde.

## Les langues

Un bouton monde à côté des réglages ouvre le menu des langues. Seul le français vit ; l'anglais, l'allemand, le chinois, le japonais et l'arabe sont des emplacements posés, visibles et marqués « bientôt » : la promesse d'un portail ouvert à tous se lit déjà dans l'interface, la mécanique de traduction attendra les traductions.

## Ce qui ne bouge pas

- La pastille de signalement, en bas à droite, avec sa propre palette : elle doit avoir la même tête sur tous les outils B27.
- Le panneau À propos derrière l'engrenage : chiffres du portail, journal des versions, anomalies éventuelles du catalogue.
- `catalogue.js` comme seul fichier à faire vivre, et le contrôle `python tests/verifier_catalogue.py` avant de publier.

## Requêtes externes

Deux, toutes deux facultatives : la météo Open-Meteo, et la géolocalisation si le visiteur clique « ma position ». Tout le reste est dans le dépôt. Sans réseau, le portail fonctionne à l'identique, double-clic sur `index.html` compris — la tuile météo en moins.
