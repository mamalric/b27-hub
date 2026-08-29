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

**Le fond vit avec le ciel et les saisons.** La mesure Open-Meteo qui remplit la tuile règle aussi le champ : bruine et pluie descendent en fines stries obliques, la neige dérive en flocons qui oscillent, le brouillard et le couvert font dériver de vrais cumulus construits — quatre à six lobes bombés aux bases alignées, un ventre plat ombré qui les assoit, figés à leur naissance pour que le nuage dérive d'un bloc sans bouillonner, le soleil étire des courants lents sous un halo doré fixe, et le vent mesuré incline et allonge les traînées. Les nappes et le halo sont les décors qui rendent chaque temps reconnaissable au premier regard : la vitesse et l'opacité seules, personne ne les voit, l'erreur a été faite et corrigée — plafonné à l'équivalent de 40 km/h, au-delà suivre la réalité rendrait le fond nerveux. La saison teinte la palette : hiver froid, printemps vert franc, été doré, automne ambré, et le fond lui-même glisse de quelques niveaux avec elle.

**Le thème clair compense, il ne duplique pas.** Le fond presque blanc mange le contraste : ce qui est juste sur fond sombre y devient imperceptible. Tout ce qui se dessine — traits, gouttes, flocons, nuages — y gagne donc opacité et épaisseur d'un facteur fixe, réglé une fois.

**L'orage se dit par la turbulence, jamais par la lumière.** Pas d'éclair, pas de flash, aucune variation brutale de luminosité : la règle « apaisant, jamais épileptique » domine tout le reste. Un changement de météo ne bascule rien d'un coup : chaque particule adopte la nouvelle ambiance à sa renaissance, le fond glisse d'un état à l'autre en quelques secondes.

**Rien ne disparaît d'un coup, pas même une particule.** Un trait dont la vie expire ne s'évapore pas sous le regard qui le suivait : il continue de voler pendant que sa queue se résorbe plus vite que la tête n'avance, se dissout en une demi-seconde comme une rafale qui s'éteint, puis renaît ailleurs en repartant d'un point. Un flocon naît et meurt en fondu. Le surplus d'un changement d'ambiance est prié de mourir de la même manière, jamais retiré d'un coup.

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

Deux rayons et une fiche, sans métaphore : **Nos outils** — fabriqués ici — en cartes, **Ressources** — sites de référence — en rangées compactes groupées par domaine, **Contact** en fiche. Le sous-titre grisé accolé au titre du rayon est la seule glose autorisée : les petits commentaires partout ont été retirés à la demande.

Les pastilles d'icône gardent les couleurs de lot B27 (CVC bleu, plomberie sarcelle, SSI rouge...) : un ingénieur y reconnaît le code couleur de ses plans. Toute couleur nouvelle doit tenir 3:1 sur trois fronts — glyphe blanc, fond clair, fond sombre — et le contrôle du catalogue vérifie les trois.

Au survol, une carte se soulève, sa bordure prend la couleur de sa catégorie, et un reflet suit la souris — peint en variables CSS par un unique écouteur délégué. Une entrée « à venir » est estompée et non cliquable.

## La recherche

Un seul champ, centré, qui filtre tout en direct : cartes, rangées, fiches. La touche `/` l'amène depuis n'importe où, Échap le vide — les conventions d'un outil qu'on utilise au clavier. Pendant une recherche, les tuiles vivantes s'effacent : on est venu chercher quelque chose, la météo attendra.

## Les panneaux et les barres

**Un panneau ne surgit pas, il se pose.** L'ouverture des modales — météo détaillée, À propos — est un glissement : le cadre monte de dix-huit pixels en s'opacifiant, le voile d'arrière-plan se floute progressivement, et le contenu suit en cascade, un souffle après le cadre. La fermeture est animée aussi, par `@starting-style` et `transition-behavior: allow-discrete` : un navigateur qui ignore ces règles ouvre d'un coup, comme avant, sans rien casser. `prefers-reduced-motion` coupe tout.

**Les barres de défilement appartiennent à l'interface, pas au système.** Pas de flèches, gouttière transparente, poucier fin au vert discret qui se révèle au survol. Chromium ignore `::-webkit-scrollbar` dès qu'on lui donne `scrollbar-color` : les deux mondes sont séparés — pseudo-éléments pour Chrome et Edge, propriétés standard pour Firefox. `scrollbar-gutter: stable` évite que la page saute quand un panneau verrouille le défilement.

**Un panneau ouvert possède la molette.** Le fond est verrouillé (`body:has(.modale[open])`), et une molette qui tourne hors du corps du panneau — sur le voile, sur l'en-tête — fait quand même défiler le panneau. La modale est une colonne : en-tête fixe, seul le corps défile, une seule barre, qui démarre sous l'en-tête.

**Les cases à cocher sont dessinées dans la charte** : plaque arrondie bordée, fond vert de marque au coché, coche sombre qui se déploie en un cinquième de seconde.

## Ce qui ne bouge pas

- La pastille de signalement, en bas à droite, avec sa propre palette : elle doit avoir la même tête sur tous les outils B27.
- Le panneau À propos derrière l'engrenage : chiffres du portail, journal des versions, anomalies éventuelles du catalogue.
- `catalogue.js` comme seul fichier à faire vivre, et le contrôle `python tests/verifier_catalogue.py` avant de publier.

## Requêtes externes

Deux, toutes deux facultatives : la météo Open-Meteo, et la géolocalisation si le visiteur clique « ma position ». Tout le reste est dans le dépôt. Sans réseau, le portail fonctionne à l'identique, double-clic sur `index.html` compris — la tuile météo en moins.
