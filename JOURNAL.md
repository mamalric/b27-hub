# Journal

<!-- Dernière entrée en haut. Une entrée par session de travail ou par décision. Date au format AAAA-MM-JJ. -->

## 2026-08-29, gouttiere supprimee, molette amortie, bouton langues

Le « bloc uni blanc/noir » des barres etait la gouttiere de la barre de page : une bande reservee ou le canvas anime ne peut pas passer, montrant le fond plat a cote du fond vivant. La barre de page est supprimee — molette, clavier et pilule d'ancrage suffisent — et seules les barres des panneaux restent, gouttiere transparente fondue dans la carte.

La molette hors du panneau etait saccadee : assigner scrollTop cran par cran court-circuite le lissage natif du navigateur. L'inertie est refaite a la main, une cible que la molette deplace et une position qui la rejoint en s'amortissant a 22 % par image.

Un bouton monde rejoint les reglages : menu des langues avec le francais actif et cinq emplacements poses — anglais, allemand, chinois, japonais, arabe — marques « bientot », inertes par choix jusqu'aux traductions.

## 2026-08-29, la mort douce des particules

L'utilisateur suivait un trait de vent du regard et le voyait « depop » : quand la vie d'une particule expirait, elle etait reensemencee ailleurs d'une image a l'autre, toute sa trainee disparaissait d'un coup. Meme chose a la sortie de l'ecran, et lors d'une baisse du nombre de particules ou le surplus etait retire par pop().

Desormais la mort est douce partout : un trait mourant continue de voler pendant que sa queue se resorbe plus vite que la tete n'avance — dissolution en vol sur une demi-seconde, verifiee au chiffre : 60 points, puis 52, 42, 32, 22, 12, 2, renaissance. Un flocon nait et meurt en fondu d'opacite. Le surplus d'ambiance est prie de mourir de la meme maniere puis retire du tableau une fois eteint.

## 2026-08-29, finitions du panneau : molette, barres, cases

Cinq retours d'usage, dont deux qui partageaient une cause : le dialogue entier defilait en plus de son corps, d'ou une barre montant jusqu'a l'en-tete et une seconde barre parasite. La modale est devenue une colonne — en-tete fixe, seul le corps defile, une seule barre, sous l'en-tete.

La molette appartient desormais au panneau ouvert : le fond est verrouille par CSS et la molette hors du corps est redirigee vers lui. Les barres perdent leurs fleches et leur fond : pseudo-elements WebKit pour Chrome et Edge (Chromium ignore le style natif des qu'on lui donne scrollbar-color), proprietes standard pour Firefox. Les cases a cocher du composeur sont dessinees dans la charte, vert de marque au coche.

## 2026-08-29, des cumulus, pas des taches

Deux retours sur le fond en theme clair : le vent et les nuages n'y etaient pas tres perceptibles, et les nuages meritaient mieux que des taches brouillardeuses.

**Le theme clair compense desormais** : le fond presque blanc mange le contraste, tout ce qui se dessine y gagne 80 % d'opacite et un peu d'epaisseur, d'un facteur applique apres les reglages d'ambiance pour ne rien dupliquer.

**Les nuages deviennent des silhouettes construites** : quatre a six lobes bombes dont les bases s'alignent, les gros au centre comme un cumulus qui s'etale, et un ventre plat ombre qui les assoit — c'est lui qui transforme un amas de ronds en nuage, la lumiere venant d'en haut. Les lobes sont figes a la naissance du nuage : il derive d'un bloc, il ne bouillonne pas, la regle du calme vaut aussi pour lui. Verifie dans les deux themes.

## 2026-08-29, le rendu : panneaux qui se posent, barres immergees

Deux finitions demandees. L'ouverture du panneau meteo surgissait d'un coup : les modales se posent desormais — glissement de dix-huit pixels, voile qui se floute, contenu en cascade un souffle apres le cadre — et se referment de la meme maniere, par `@starting-style` et `allow-discrete`. Un navigateur qui ignore ces regles recentes abandonne la declaration entiere et ouvre d'un coup comme avant : la degradation est propre.

Les barres de defilement passent en version immergee : fines, gouttiere invisible, poucier au vert discret qui se revele au survol. Propriete standard `scrollbar-color`, posee a la racine, heritee partout.

## 2026-08-29, la meteo en grand (v9)

L'utilisateur envoie le catalogue complet des API Open-Meteo et rappelle son fil rouge, la precision : la tuile doit s'ouvrir sur tout ce qui est disponible pour sa position, et chacun doit pouvoir composer les mesures qu'elle affiche par defaut.

**Le panneau detaille**, d'un clic sur la tuile (sauf sur ses boutons, et sauf en pastille repliee ou le clic continue de ramener en haut) : les dix mesures du moment, les prochaines vingt-quatre heures de trois en trois avec probabilite de pluie, la semaine complete, le soleil (lever, coucher, duree du jour, UV max), la qualite de l'air a l'indice europeen avec PM2,5, PM10, NO2, O3 et les pollens d'aulne, de bouleau et de graminees. En pied, l'altitude du point de calcul et le modele. Deux requetes de plus, previsions et air, sans cle, cache vingt minutes ; l'air est amorti et peut manquer seul.

**Le point de rosee est calcule, pas fourni** : formule de Magnus depuis temperature et humidite. C'est la donnee du fluidiste — celle de la condensation — et le service ne la donne pas en mesure courante.

**Le composeur** : dix mesures au registre, des cases dans le panneau, entre une et six sur la tuile, ordre stable du registre. Choix enregistre en localStorage (`hub_b27_meteo_champs`), par navigateur, sans compte, comme le theme. Cocher recompose la tuile immediatement et sans requete, la mesure courante etant gardee sous la main.

La requete de la tuile s'est elargie (rafales, nebulosite, pressions, UV, precipitations) : un cache ecrit par une version anterieure est rejete faute de ces champs.

Verifie en apercu sur donnees reelles : Dijon, couvert 22,2 degres, rosee 13,0, rafales 28 km/h, AQI 24 correct ; composition testee de bout en bout, la tuile suit et le choix persiste.

## 2026-08-29, le ciel devient lisible

Retour de l'utilisateur, a Dijon sous un ciel couvert : le fond n'a pas change, toujours le meme vent leger qui fait des loopings. Il a raison, et le diagnostic est instructif : mes ambiances calme, couvert et soleil ne differaient que par la vitesse et l'opacite — techniquement actives, perceptivement identiques. Une differenciation que personne ne voit n'existe pas.

**Chaque temps recoit un decor reconnaissable au premier regard.** Couvert et brouillard : de grandes nappes floues, degrades radiaux tres doux qui derivent a peine au-dessus du flux. Orage : les memes nappes, plus profondes, sous un champ turbulent. Soleil : un halo dore fixe en haut de page — fixe, parce qu'un halo qui pulse cesse d'etre apaisant — et la pointe claire de la palette qui se dore. Les nappes survivent aux changements d'ambiance, seul leur nombre s'ajuste : le ciel glisse, il ne bascule pas.

**La ville retrouve son nom.** « Votre position » etait un pis-aller : le geocodage inverse de l'API Adresse de l'Etat (api-adresse.data.gouv.fr, sans cle ni compte) le remplace par le nom de la commune. Une position enregistree avant cette version se fait nommer au chargement suivant. Hors de France ou en cas d'echec, le pis-aller reste.

**Un bouton actualise le releve** sans attendre l'expiration du cache, avec une fleche qui tourne le temps de la reponse, succes ou echec.

Troisieme requete externe du portail, donc, toutes facultatives : Open-Meteo, la geolocalisation si demandee, et le geocodage qui la nomme.

## 2026-08-29, la meteo veille

Question de l'utilisateur : la meteo ne se met pas a jour automatiquement ? Non, et c'etait un manque : elle ne se chargeait qu'a l'ouverture de la page, un onglet laisse ouvert toute la journee affichait le releve du matin, fige.

Le portail veille desormais : toutes les dix minutes et au retour sur l'onglet, `chargerMeteo()` repasse. Le cache de vingt minutes decide si une requete part reellement, donc la veille coute au plus une requete par demi-heure. Au passage de minuit, le calendrier bascule sur le nouveau jour et revient au mois courant. Effet de bord bienvenu : si la premiere demande avait echoue, reseau coupe au chargement, la tuile apparait d'elle-meme des qu'une veille aboutit.

Verifie en aperçu avec un cache artificiellement perime : la relance re-tire et reecrit le cache. Le chemin du retour d'onglet n'est pas testable dans le panneau, qui se declare hidden en permanence, mais il tient en deux lignes.

## 2026-08-29, le fond vit avec le ciel (v8)

Idée de l'utilisateur : rendre le fond dynamique selon la météo affichée — orage, vent, soleil, nuageux, neige, grêle — et selon les saisons, avec une règle impérative : apaisant, relaxant, jamais épileptique ou stressant.

**La règle du calme est prise comme contrainte dure.** Pas d'éclair d'orage, pas de flash, aucune variation brutale de luminosité : l'orage se dit par la turbulence du champ et une palette plus profonde. Les vitesses sont plafonnées, le vent mesuré est écrêté à 40 km/h, et un changement de météo ne bascule rien d'un coup : chaque particule adopte la nouvelle ambiance à sa renaissance, la transition est un glissement de quelques secondes.

**Les ambiances** : soleil en courants lents ascendants, bruine et pluie en stries obliques inclinées par le vent réel, neige et grêle en flocons qui oscillent, brouillard presque figé, couvert assourdi. Les palettes suivent les saisons météorologiques — hiver froid, printemps vert B27 franc, été doré, automne ambré — et le fond lui-même glisse de quelques niveaux. Sans réseau, le fond vit sur « calme » et la saison seule.

**L'ancrage au défilement**, demandé dans la foulée : la météo et le calendrier restent ancrés mais se replient en pastilles de 64 px (température, numéro de semaine) pour ne pas chevaucher les rayons ; l'emblème et le titre s'effacent en reculant pendant qu'une pilule fixe portant logo et nom se pose en haut au centre. Pilule et pastilles ramènent en haut d'un clic.

Vérification en aperçu : le rAF du panneau étant gelé, les images ont été pompées à la main pour contrôler neige et bruine ; les positions et états ancrés ont été validés au DOM. Sur un navigateur réel, tout est animé normalement.

## 2026-08-29, v7 validee, trois retouches

« Beaucoup mieux, j'adore. » La direction portail est la bonne. Trois retouches dans la foulee.

**Les tuiles vivantes gagnent le coin haut gauche**, en colonne reduite, meteo puis calendrier — l'utilisateur a d'abord demande un coin chacune, puis les deux empilees a gauche. Sous 1240 px elles reviennent sous la recherche ; le seuil est calcule pour que la colonne de 288 px ne touche jamais la recherche centree de 620 px.

**L'embleme devient opaque** : la plaque translucide laissait passer les lignes de flux a travers le logo, et une marque ne se regarde pas en transparence.

**Les trainees du champ d'ecoulement expirent desormais fermement.** L'utilisateur a repere qu'elles n'avaient pas de delai maximal : l'estompage par voile translucide est asymptotique, et l'arrondi 8 bits laisse un residu permanent qui s'accumule en toile. Le moteur a ete reecrit — effacement complet a chaque image, memoire bornee de cinquante-cinq positions par particule — l'expiration est garantie mathematiquement, plus approchee.

## 2026-08-29, refonte en portail (v7)

Rien de ce qui précède ne convient à l'utilisateur : il se dit perdu, trouve le résultat plat, et pose enfin le concept qui manquait depuis le début. Un portail public de visibilité, à la Thermexcel mais en version 2026, ouvert à tous — collègues, clients, n'importe qui — sans portail de connexion. Une démonstration de maîtrise technologique, moderne et sérieuse sans faire geek. Consigne : tout balayer sauf la pastille de signalement.

**Ce qui a été gardé du balayage** : la pastille de signalement telle quelle, `catalogue.js` comme source de données (seul son habillage change, le tableau garde son nom PORTES pour l'histoire), les couleurs de lot B27 sur les pastilles, le validateur, les icônes, le logo.

**Le nouveau visage.** Tout centré sous le logo : emblème sur plaque de verre avec aura animée, titre en dégradé vers le vert, accroche, recherche (raccourci `/`, Échap), compteurs. Sombre par défaut — c'est l'identité du portail, le clair reste à un clic. En fond, un champ d'écoulement animé calculé en local : des lignes de flux, le métier des fluides en mouvement. Première version trop dense, virée à la paille ; l'équilibre tracé/estompage a été réglé en trois essais, et le vert clair rendu rare.

**Les tuiles vivantes**, demandées en cours de route. La météo en données réelles : Open-Meteo, le fournisseur sans clé et sans compte — la leçon Unsplash a servi. Pression au dixième d'hectopascal et ressenti au dixième de degré, la précision suggérée que demandait l'utilisateur, sauf que ce sont de vraies mesures. Lieu par défaut Dijon, bouton « ma position », cache vingt minutes, tuile absente sans réseau. Le calendrier : semaines ISO sur l'axe vertical — la monnaie du BET — week-ends teintés, jour courant en aplat vert, semaine courante surlignée, navigation de mois en mois, entièrement local.

**Les rayons.** Nos outils (fabriqués ici) en cartes avec reflet qui suit la souris et lueur de catégorie au survol ; Ressources en rangées compactes groupées par domaine ; Contact en fiche. La métaphore des portes disparaît de l'écran, avec les dossiers, le fil d'Ariane, les épingles et les récents. Le seul commentaire toléré est le sous-titre grisé du rayon, celui que l'utilisateur avait cité en exemple.

**Les couleurs sont vérifiées au calcul**, pas à l'oeil : tous les jetons de texte des deux thèmes tiennent 4,5:1 (le gris discret du thème clair a dû être assombri d'un cran), le vert de marque ne porte du texte que sur fond sombre, le thème clair a son vert d'encre #4e6b1c.

**Sur les photos du bandeau**, réponse due : elles nécessitaient une clé Unsplash, donc un compte que je ne peux pas créer à la place de l'utilisateur, et le bandeau vert n'était que l'état de repli — mauvais choix de l'avoir laissé comme visage de la page. Le fond animé règle le problème sans compte. `docs/bandeau.md` et `src/bandeau_teinte.py` sont supprimés, la doc réécrite (charte, README, FICHE).

Reste à faire regarder cette v7 et à itérer. Question posée à l'utilisateur : le portail se veut ouvert à tous, faut-il lever le `noindex` ?

## 2026-08-29, retrait de la barre laterale

Suite et fin de l'epuration : la barre laterale disparait. Avec elle partent le bouton hamburger, le voile du tiroir, les fonctions `construireRail`, `majRailActif` et `ouvrirRail`, leurs quatre ecouteurs, tout le bloc CSS correspondant, la variable `--rail` et l'icone `menu`.

**Une decision prise seule, a signaler.** Le logo B27 vivait dans cette barre : la supprimer telle quelle aurait fait disparaitre la marque de la page, ce qui contredit la demande initiale de la mettre en avant. Le logo et le nom sont donc remontes dans la barre du haut, ou ils tiennent lieu de retour au hall. C'est desormais le seul lien de navigation permanent.

**Ce que cela coute.** Changer de categorie depuis l'interieur d'un dossier demande maintenant de repasser par le hall, soit un clic de plus. Le fil d'Ariane et la marque le permettent tous les deux ; c'est la contrepartie assumee de la page epuree.

**Le titre du niveau ne s'affiche qu'en profondeur.** Au hall il touchait la marque et repetait la meme information : « Outils B27 » puis « Hall ».

**Le seuil du voile du bandeau a bouge.** Le bandeau occupe desormais toute la fenetre, les 250 px du rail lui revenant : le chapeau ne deborde plus la moitie du plateau qu'en dessous de 960 px de fenetre, contre 1210 auparavant. Seuil ramene de 1240 a 1024 px, puis verifie a 1040 px, le point le plus serre : le texte s'arrete a 42 % et le contraste tient a 4,88:1.

## 2026-08-29, epuration du panneau A propos

Suite de l'epuration. Retires du panneau ouvert par l'engrenage : le bloc « Un bug, une idee d'outil », le groupe « Ce que fait le hub » (role, navigation, donnees, ce qui est retenu, vos epingles) et le groupe « Ajouter une porte ». Restent les chiffres du hall, le journal des versions, et les anomalies du catalogue quand il y en a.

Le code mort part avec, comme la fois precedente : l'icone `etiquette`, que plus rien ne posait, la regle CSS `.stats-liste.gauche`, que plus rien ne produisait, et le champ `REGLAGES.contact`, que plus aucune ligne ne lisait. L'adresse de contact reste dans `SIGNALEMENT.destinataire`, ou elle sert reellement : le signalement continue d'arriver dans la boite. Le controle du catalogue perd son avertissement sur ce champ devenu inexistant.

## 2026-08-29, bandeau photo au vert B27

La charpente dessinée ne convient pas : approximative, pas dans la fibre de B27, et pas même la bonne couleur de verre. Elle est supprimée, script compris. À la place, une photo de chantier tirée au sort, à la manière des fonds d'écran Windows, ramenée au vert de la maison. L'utilisateur précise en cours de route la teinte voulue : `#95C03D`, celle du logo.

**Le fournisseur.** `source.unsplash.com`, l'URL sans clé que tout le monde utilisait, est arrêtée depuis 2024 : il n'existe plus d'endpoint aléatoire fiable sans compte. Unsplash reste le bon choix pour la profondeur en architecture et chantier, et sa clé d'accès est publique par conception, ce qui convient à un site statique sans serveur. Reste que créer le compte revient à l'utilisateur. Le code est donc écrit pour fonctionner sans clé : le bandeau garde son dégradé vert, n'émet aucune requête, et rien n'a l'air cassé. C'est la même logique que les trois transports du signalement.

**Le quota a dicté la forme du code.** Cinquante requêtes par heure en mode démonstration, tous visiteurs confondus : interroger l'API à chaque chargement l'épuiserait dès le premier midi, et le bandeau serait vert pour tout le monde jusqu'au soir sans que personne ne signale rien. Le hub demande donc douze photos en une requête, garde le lot une semaine, et pioche dedans à chaque visite. Une requête par poste et par semaine, et l'image change quand même à chaque retour au hall.

**La teinte est calculée, pas réglée à l'oeil.** Les fonctions de `filter` sont des matrices spécifiées au millième près : `src/bandeau_teinte.py` les applique et balaie angle, saturation et luminosité. Quatre tentatives avant la bonne. Viser la teinte seule donnait un gris verdâtre à 10 % de saturation, juste en teinte et méconnaissable. Viser la couleur entière au milieu de la plage la touchait au pixel près en brûlant tout le haut, parce que `#95C03D` est trop clair pour laisser de la marge au-dessus. Contraindre le haut sans contraindre le bas faisait écraser le bleu à zéro par `saturate(4)`, ombres olive et lumières fluo.

Le vrai coupable était `sepia(1)` lui-même : ses lignes de matrice somment à 1,35, donc il brûle le canal rouge de tout gris supérieur à 0,74. Un `brightness(.74)` placé **avant** le sépia y remédie, la chaîne redevient linéaire de bout en bout, et la teinte cesse de dériver. La couleur de marque est alors visée dans les lumières et non dans les demi-teintes, ce qui est du reste le principe du duotone. Résultat : teinte 79,4 degrés et saturation 52 % constantes du noir au blanc, celles du logo, et le gris 0,85 ressort à deux niveaux sur 255 du `#95C03D`.

**Vérifié contre le navigateur, pas seulement calculé.** La rampe redessinée dans un canvas avec la même chaîne s'écarte du calcul de deux niveaux sur 255 : du bruit d'arrondi. Le calcul décrit bien ce que fait le moteur de rendu.

**Un défaut invisible trouvé à la mesure.** Le voile sous le texte était dimensionné sur le pixel le plus clair, 51 % d'opacité pour tenir 4,5:1. Mais il faiblissait dès le tiers de la largeur, alors que le chapeau s'étend jusqu'aux 36 % : mesure faite en recomposant photo filtrée et voile dans un canvas, 3,91:1 sous la fin du chapeau, sous le seuil. Rien de visible à l'oeil. Le voile garde désormais son plateau jusqu'où le texte s'arrête, et couvre toute la largeur sous 1240 px, là où le chapeau déborde la moitié. Après correction : 5,75:1 sous le texte, 5,59:1 sous le crédit.

Cette mesure a elle-même demandé une correction : échantillonner le rectangle de `.salut` revenait à échantillonner toute la largeur du bandeau, puisque c'est un bloc, donc surtout du vide à droite. Il a fallu passer par les rectangles réels des glyphes.

**Le bandeau sort de la grille.** Il ne prenait pas toute la largeur parce qu'il vivait dans `.wrap`, borné à 1360 px. Il est remonté dans `.page`, seul élément du hub à aller d'un bord à l'autre ; le texte, lui, garde la largeur et le retrait du contenu.

**Le crédit est une obligation de licence**, pas une politesse : une photo dont le nom d'auteur ou le lien de profil manque est écartée plutôt qu'affichée sans crédit.

Prochaine étape côté utilisateur : créer le compte Unsplash et coller la clé. Tout le reste est en place et se contente de l'attendre.

## 2026-08-29, epuration

L'utilisateur ne trouve pas le resultat convaincant et commence par faire de la place. Retires : le lien de contact en pied de barre laterale, et tout le pied de page (compte des portes, phrase sur ce que le hub ne collecte pas, adresse de contact). Le code mort qui les alimentait est parti avec, dans les trois fichiers, plutot que de laisser des elements orphelins.

Le contact reste joignable par la pastille de signalement et par le panneau A propos : rien n'est devenu inatteignable. La marge basse que le pied assurait est reportee sur le contenu, et la navigation laterale respire en bas au lieu de finir collee au bord.

Iteration en cours, l'utilisateur dira la suite.

## 2026-08-29, bandeau de charpente

L'utilisateur envoie une image de charpente métallique, moitié photo moitié filaire, et demande de la vectoriser en simplifiant pour en faire un bandeau d'accueil. Il a raison sur le manque : il manquait quelque chose qui dise le métier.

**Deux points posés d'emblée.** Je n'ai que le rendu de l'image, pas le fichier, et c'est visiblement une photo de banque d'images : la tracer en aurait produit une oeuvre dérivée. J'ai donc dessiné une charpente originale dans le même esprit. C'est aussi meilleur techniquement : neuf kilo-octets contre plusieurs centaines pour une photo, net à toute taille, aucune requête.

**Géométrie calculée, pas tracée à l'oeil.** `src/charpente.py` produit le SVG : axonométrie, deux files de poteaux, poutres longitudinales et transversales, fermes à treillis, contreventement une travée sur trois. Une charpente mal d'aplomb se voit immédiatement, surtout chez un BET ; seul le calcul garantit des membrures parallèles et une trame régulière. Le script reste dans le dépôt, le dessin se régénère et se recolle.

**Trois essais avant le bon cadrage.** Le premier était un fourré : trois files de poteaux et des croix de Saint-André partout, illisible. Le deuxième, allégé, se lisait comme un petit hangar vu de loin. Le troisième, zoomé en fragment, coupait les poteaux à mi-hauteur : le rapport du viewBox, 1200 x 280, s'écartait trop de celui du bandeau, et le recadrage en `slice` mangeait la différence. Le rapport a été aligné sur celui du bandeau, autour de 5,5 pour 1, et là seulement la charpente s'est tenue debout.

**Contraste.** Le dégradé de fond va de `#5f7f1f` à `#3f5714`, les deux extrémités tenant au moins 4,6:1 avec le texte blanc, seuil du petit texte. Un voile dégradé a été ajouté entre le dessin et le texte : le fond suffisait presque, mais une membrure blanche passant derrière une lettre blanche fait tomber le contraste localement, et cela ne se voit qu'à l'usage.

**Sous 700 px**, la charpente recule à l'état de texture : le bandeau y devient presque carré alors que le dessin est fait pour 5,5 pour 1, et la tranche visible ne se lit plus comme une charpente, elle concurrence le texte. Elle ne s'imprime pas non plus.

**Vérifications.** Clair et sombre, écran large, écran moyen et mobile. Contrastes calculés avant d'écrire le style, pas constatés après. Console propre, aucun débordement horizontal.

## 2026-08-29, tableau de bord et personnalisation sans compte

L'utilisateur veut quelque chose de plus accueillant, capture d'un tableau de bord à l'appui (portail Jobie) : barre latérale, recherche en haut, cartes chiffrées colorées, carte de profil. Contrainte posée par lui : pas de portail de connexion, et il pense qu'il n'y en aura jamais.

**Le point qui débloque tout.** Ce qui rend ce genre de page accueillante, c'est qu'elle a l'air de vous appartenir, et cela semble exiger un compte. Ce n'est pas le cas : sans identité, la personnalisation peut vivre en `localStorage`. Épingler une porte, et retrouver ce qu'on a ouvert récemment, sont deux choses personnelles qui ne demandent aucune inscription et ne sortent pas du poste. C'est ce qui remplace la carte de profil de la référence.

**Disposition.** Barre latérale permanente, chaque catégorie portant sa couleur de lot, la catégorie courante teintée de cette même couleur. Sous 960 px elle sort du flux et devient un tiroir, ouvert par un bouton, refermé par le voile, par Échap ou en suivant un lien : c'est la même barre, seule sa position change. Recherche au centre de la barre du haut. Titre de page et titre d'onglet suivent le niveau, un onglet parmi douze devant dire où il mène.

**Quatre cartes chiffrées** à l'arrivée : portes ouvertes, nos outils, ressources, en préparation. Leurs teintes sont plus foncées que celles des tuiles, et c'est délibéré : une tuile ne porte qu'un glyphe, seuil 3:1, une carte chiffrée porte du texte de petite taille, seuil 4,5:1. Le bleu et l'ocre ont donc été assombris.

**Ce que je n'ai pas repris de la référence.** Le graphique. Un hub n'a aucune donnée à tracer, une courbe y serait de la décoration déguisée en information. La carte de profil non plus, remplacée par la salutation selon l'heure et les raccourcis.

**Détails de mise en oeuvre.** La carte reste un lien pur, l'épingle se pose par-dessus en frère : un bouton dans un lien serait invalide, et cliquer sur l'épingle suivrait le lien. L'épingle ne se montre qu'au survol ou si elle est posée, sauf sur tactile où elle reste visible. Les deux listes sont filtrées contre le catalogue à la lecture, faute de quoi une porte retirée y laisserait un fantôme. Un seul écouteur de clic pour toute la page plutôt qu'un par carte, les grilles étant reconstruites à chaque navigation.

**Un défaut trouvé à l'essai.** Les raccourcis n'étaient construits qu'au chargement : ouvrir une porte puis revenir au hall n'y ajoutait rien tant qu'on ne rechargeait pas la page. Ils sont désormais reconstruits à chaque retour au hall, et `rendre()` en est le seul responsable.

**Vérifications.** Parcours complet : entrer dans un dossier, épingler, revenir au hall, voir apparaître le bloc et disparaître l'invite. Ouverture de deux portes simulée sans ouvrir d'onglet, avec contrôle du contenu de `localStorage` puis de l'affichage. Clair et sombre, ordinateur et mobile. Tiroir mesuré ouvert et fermé. Aucun débordement horizontal, console propre.

## 2026-08-29, navigation par dossiers

Retour de l'utilisateur sur la présentation : il veut une navigation par dossiers, pas une liste à plat. Des cartes carrées avec une icône au centre, le nom en dessous qui n'apparaît qu'au survol, des micro-animations, et une descente par catégories puis sous-catégories jusqu'à l'élément final.

**La réserve posée d'emblée.** Le nom qui n'apparaît qu'au survol ne marche pas sur tablette ni sur téléphone, où le survol n'existe pas : les tuiles y resteraient anonymes. Implémenté comme demandé sur écran avec souris, sous `@media (hover: hover) and (pointer: fine)`, et le nom reste visible en permanence partout ailleurs. L'ordre des règles compte : le nom visible est l'état par défaut, le masquage n'est ajouté qu'à l'intérieur de la requête média, ce qui fait que le repli en cas de non-prise en charge est le bon. Le focus clavier révèle le nom au même titre que la souris.

**L'arborescence.** Nouveau tableau `SOUS_CATEGORIES` et champ `sousCategorie` facultatif sur les portes. Une catégorie sans sous-dossier peuplé s'ouvre directement sur ses portes : on ne traverse jamais un dossier qui n'aurait qu'un enfant à montrer. Les portes d'une catégorie à sous-dossiers qui n'en déclarent pas tombent dans un dossier "Divers", sans quoi elles seraient invisibles. Les six ressources ont été réparties en Réglementation, Données et bases, Documentation technique : c'est la branche qui montre les trois niveaux. L'annuaire devient un dossier du hall comme les autres, plutôt qu'une section en pied de page.

**La position est dans l'adresse.** `#/`, `#/ressources`, `#/ressources/technique`. Ce n'est pas cosmétique : c'est ce qui rend le bouton Précédent fonctionnel, permet d'ouvrir un dossier dans un nouvel onglet, et permet d'envoyer à un collègue le lien d'un dossier précis. Un dossier est un `<a href>` et non un `div` avec un écouteur : le clavier, le clic du milieu et le menu contextuel viennent gratuitement. Une adresse inventée ramène au hall sans rien casser.

**Un piège d'animation.** Les grilles entrent avec un décalage de 26 ms par élément. Le remplissage doit être `backwards` et non `both` : avec `both`, la valeur finale de l'animation reste appliquée après la fin et bloque le `transform` du survol, la carte ne se soulève plus jamais.

**Deux décisions de forme.** Le dossier est carré, la porte reste rectangulaire : la forme dit la fonction, le carré contient, le rectangle mène ailleurs. Et le bandeau d'accueil disparaît dès qu'on entre dans un dossier, l'en-tête suffisant alors à porter l'identité.

**La recherche traverse les niveaux.** Indispensable dans une navigation en profondeur : chercher "INIES" depuis n'importe où doit trouver, sans deviner le rangement. Chaque résultat rappelle son dossier d'origine. Les filtres par catégorie ont été retirés, les dossiers font désormais ce travail.

**Vérifications.** Descente hall puis dossier puis sous-dossier, retour par le bouton du navigateur à chaque cran, retour par le bouton du fil d'Ariane, adresse inventée ramenant au hall. Survol montrant le nom, le pavé d'icône se remplissant, la pastille de compte virant au vert. Recherche depuis un sous-dossier trouvant une porte rangée ailleurs, avec son chemin. Mobile : noms visibles en permanence, deux tuiles par rangée. Thème sombre. Console propre.

## 2026-08-29, la dictée sans le navigateur

L'utilisateur remonte un conseil trouvé sur Reddit : lancer Opera avec un `--user-agent` de Chrome pour débloquer le microphone. Vérification faite, cela ne s'applique pas ici, mais la question a mené à une bien meilleure réponse.

**Pourquoi le conseil ne s'applique pas.** Il vise des sites comme bing.com, qui cachent leur propre bouton micro quand ils ne reconnaissent pas Chrome dans le user-agent : la fonction existe côté navigateur, c'est le site qui refuse de la montrer, et mentir sur le user-agent suffit. Le problème d'Opera est d'une autre nature. La reconnaissance vocale de Chromium envoie l'audio au service de Google, authentifiée par une clé d'API compilée dans le binaire de Chrome. Opera ne l'embarque pas, et cette clé n'a aucun rapport avec le user-agent envoyé aux sites : changer la chaîne ne fabrique pas la clé manquante. Confirmé sur les listes Chromium et les tables de compatibilité.

**Un point rassurant au passage.** La détection du widget interroge l'objet `window.opr`, injecté par Opera lui-même, avant de regarder le user-agent. Elle reste donc juste même si le user-agent est truqué : le bouton reste grisé à bon droit, au lieu de faire une fausse promesse suivie de six secondes d'attente.

**La vraie sortie de secours.** Windows sait dicter dans n'importe quel champ de n'importe quelle application, navigateur compris, avec son propre moteur : le raccourci `Win + H`. Cela n'a rien à voir avec l'API du navigateur et fonctionne donc sur Opera, Brave et Firefox. Le widget le propose désormais de lui-même, sur Windows, dans deux situations : quand le navigateur n'implémente pas la transcription, et quand elle échoue pour une raison qui laisse le micro intact, service injoignable, refusé par une stratégie, ou langue non prise en charge. Pas quand aucun micro n'a été trouvé, puisque Windows n'irait pas plus loin non plus.

C'est une meilleure réponse que "changez de navigateur" : elle marche tout de suite, dans le champ d'à côté. Le raccourci est rendu en touches dans le message, ce qui a demandé de déplacer l'échappement HTML sur les seules parties dynamiques plutôt que sur le message assemblé.

**Vérifications.** Message d'Opera avec ses deux touches rendues et le bouton grisé. Panne réseau simulée : encadré ambre portant la même sortie de secours. Chrome inchangé, bouton actif et avertissement habituel sur la transcription non locale.

## 2026-08-29, la dictée sur Opera

L'utilisateur signale que la dictée marche sur Chrome mais pas sur Opera, capture d'écran à l'appui : micro autorisé, six entrées audio, et l'état bloqué sur "Démarrage de la dictée".

**La cause.** Opera n'implémente pas la reconnaissance vocale, alors qu'il est fondé sur Chromium. Confirmé sur les forums Opera et les tables de compatibilité : l'API n'est prise en charge sur aucune version. Le piège est que l'objet `webkitSpeechRecognition` existe bel et bien, donc la détection par simple présence du constructeur le croyait capable. `start()` réussit, puis plus aucun événement n'arrive, ni `onstart`, ni `onerror`, ni `onend`. Le correctif précédent finissait par trancher au bout de six secondes grâce à la veille, mais sans rien expliquer : c'est long, et l'utilisateur n'apprenait rien. Brave est dans le même cas, avec une erreur réseau systématique.

**Corrigé.** Un contrôle de support rendu à la construction du panneau, et non au clic. Opera et Brave sont nommés explicitement, puisque le constructeur ne les trahit pas. Sur ces navigateurs, le bouton Dicter est grisé d'emblée, accompagné de la raison et de la marche à suivre, dans un encadré neutre et non ambre : une fonction absente n'est pas une panne, et l'encadré ambre alarmerait sur quelque chose qui ne se réparera pas. Firefox reçoit le même traitement, avec le message correspondant. `Signalement.diagnostic()` rapporte désormais aussi `dicteeUtilisable`, avec la cause quand la réponse est non.

**Vérifications.** Les quatre cas exercés en simulant chaque navigateur : Opera et Brave donnent leur message propre, l'absence de moteur donne le message générique, et Chrome garde le bouton actif avec l'avertissement habituel sur la transcription non locale.

**À noter.** Le reste du signalement, capture d'écran comprise, fonctionne normalement sur Opera. Seule la dictée manque, et c'est désormais dit.

## 2026-08-29, correctif de la dictée

Retour de l'utilisateur : la dictée ne marche pas. Elle n'avait pas pu être exercée à la livraison, le microphone étant bloqué dans le navigateur d'essai. La relecture du code a montré que ce n'était pas seulement l'environnement.

**Le défaut principal.** `onerror` ne traitait que trois codes sur sept. Sur tout autre code, rien ne s'affichait, `dicteeActive` restait vrai, et `onend` relançait le moteur indéfiniment : le bouton restait sur "Arrêter" et l'état sur "Écoute en cours" pendant que la page tournait à vide. De l'extérieur, cela donne exactement "la dictée ne marche pas", sans le moindre indice.

**Corrigé.** Table complète des codes d'erreur, chacun avec son message en français et sa cause probable, plus un message générique pour un code inédit. `onstart` sert désormais de poignée de main : l'état n'annonce l'écoute qu'une fois le moteur réellement démarré, et une veille de six secondes tranche s'il ne démarre jamais. La relance après silence est conservée, mais plafonnée : trois arrêts immédiats sans le moindre résultat et on s'arrête en expliquant les deux causes probables, micro indisponible ou service injoignable. `arreterDictee` détache les rappels avant d'arrêter, sinon `onend` relançait le moteur qu'on venait d'éteindre et `onerror` affichait un "aborted" inquiétant. Contrôle préalable de l'autorisation micro et du contexte sécurisé, pour le cas fréquent du hub ouvert par double-clic sur le fichier, où le micro sera refusé sans explication.

**Rendu visible.** L'échec passait en petit gris à côté du bouton, là où personne ne le lit. Il s'affiche maintenant dans un encadré ambre.

**Diagnostic.** `Signalement.diagnostic()` en console rapporte la page, le contexte sécurisé, le navigateur, la présence du moteur, l'état de l'autorisation micro, le nombre d'entrées audio, la capture et le presse-papiers. La dictée trace aussi ses étapes en console, préfixées `Signalement/dictée :`. Sans cela, il n'y a aucun moyen de dire lequel des trois maillons manque.

**Vérifications.** Le micro restant bloqué ici, les chemins ont été exercés contre des moteurs simulés : dictée qui aboutit (provisoire puis définitif, ajout après un texte déjà saisi sans l'effacer), moteur qui s'arrête aussitôt (trois tentatives comptées puis arrêt), et cinq codes d'erreur dont un inédit, chacun produisant son message et rendant le bouton au repos. Le diagnostic rapporte bien `autorisationMicro: denied` dans l'environnement d'essai, ce qui est la cause réelle de l'échec observé ici.

**Reste à faire.** Essayer sur un poste B27 avec un vrai micro, et lancer `Signalement.diagnostic()` si cela ne marche toujours pas : le résultat dira si c'est le micro, le navigateur ou le réseau. Sur un poste d'entreprise, le service de transcription bloqué par un proxy est un candidat sérieux.

## 2026-08-29, deuxième session

Le hub v1 était juste, mais vide : deux cartes sur une page blanche, sans B27 nulle part. Retour de l'utilisateur : ce qu'il veut, c'est un hall d'entrée, avec toutes les portes, et un moyen simple de signaler un problème. Cette session livre les deux.

**Le logo.** L'utilisateur a fourni le SVG officiel, repris du Livre d'or REX. Le monogramme est en `#95c03d`. La feuille de B27 Mobility, retrouvée au passage, confirme ce vert de marque et distingue déjà une variante assombrie pour le texte. Le hub adopte la même séparation : `--marque` pour le logo et lui seul, `--primaire` (l'olive `#7da32f` des deux outils publiés) pour tout ce qui doit tenir un contraste. Dans la page, le monogramme est dessiné sans sa plaque blanche, viewBox calé au plus juste sur les tracés ; la plaque ne sert que pour la favicon.

**Le hall.** Bandeau d'accueil pleine largeur : logo en grand, accroche, chapeau, et trois chiffres calculés à l'affichage (portes ouvertes, univers, en préparation). Lavis vert très dilué en radial-gradient dans l'angle haut gauche, pour réchauffer le blanc sans virer au bandeau décoratif. Les titres de section deviennent de vrais titres, avec pavé d'icône et compte, au lieu des micro-étiquettes grises en capitales qui suffisaient à deux cartes.

**Le catalogue s'élargit.** `outils.js` devient `catalogue.js`, `OUTILS` devient `PORTES` : le fichier ne contient plus seulement des outils. Nouveau champ `type`, à deux valeurs qui comptent visuellement. `outil` garde la carte pleine ; `lien` reçoit une carte compacte dans une grille dense, parce que vingt ressources extérieures ne doivent pas noyer deux outils maison. Ajout du site b27.fr, de B27 Mobility en "à venir", et de six ressources métier dont les adresses ont été contrôlées une à une (Légifrance et ADEME renvoient 403 à curl par protection anti-robot, elles répondent normalement dans un navigateur). Nouveau tableau `CONTACTS` et section annuaire : une fiche n'est pas une porte, on n'y clique pas pour partir ailleurs, elle ne se soulève donc pas au survol et ce sont ses liens `mailto` et `tel` qui portent l'interaction. Le hall passe de 2 à 10 portes, ce qui fait apparaître d'elles-mêmes la recherche, les filtres et les sections.

**Le signalement.** `signalement.js`, autonome, sans dépendance, feuille de style et icônes embarquées : deux lignes suffisent à le poser sur n'importe quel outil B27, ce qui était la demande. Pastille repliée en bas à droite, dépliée au survol. Au clic, la capture est tentée avant l'affichage du panneau, car ce qu'il faut photographier c'est l'écran du problème et non celui du formulaire ; la pastille se retire de l'image le temps de la prise. Dictée vocale en direct, le texte s'écrit pendant la parole, avec relance automatique du moteur que Chrome coupe après un silence.

**Le point dur, et ce qu'il change.** L'utilisateur avait choisi un service tiers pour que l'envoi soit automatique, capture comprise. Vérification faite : Formspree, Web3Forms et EmailJS réservent tous les trois les pièces jointes à leurs offres payantes, de 9 à 15 dollars par mois. Le choix reposait donc sur une information fausse, la mienne. Plutôt que de trancher à sa place, le widget a été écrit avec trois transports interchangeables : `mailto` par défaut, qui marche aujourd'hui sans compte ni dépense, la capture passant par le presse-papiers puisque aucun lien mail ne peut porter de pièce jointe ; `formulaire` pour un service tiers ; `endpoint` pour un point de collecte maison, seule voie à la fois gratuite, complète et privée, un Worker Cloudflare convenant très bien. Changer de mode est une ligne dans `catalogue.js`.

**Vérifications.** Hall et panneau en clair et en sombre, desktop et mobile. Pastille mesurée repliée (46 px) et dépliée (182 px). Capture refusée : repli propre. Circuit complet de capture exercé contre un flux d'écran simulé par un canvas animé, ce qui a permis de valider la réduction, l'encodage PNG, l'aperçu et la taille affichée sans dialogue système. Envoi en mode `endpoint` vers un point de collecte local : titre, description, contexte complet et capture en data URL de 80 ko reçus et relus. Composition du brouillon `mailto` contrôlée par relecture de l'URL, accents et caractères spéciaux intacts. Confirmé qu'aucune demande de microphone n'est faite tant que l'utilisateur ne clique pas sur Dicter.

**Un défaut corrigé au passage.** La détection du navigateur annonçait "Safari" pour un Chromium : tous les navigateurs fondés sur Chromium terminent leur signature par `Safari/537.36`, et prendre le dernier jeton fait passer Edge pour Safari. Remplacé par un examen du plus spécifique au plus générique.

**Reste à faire.** Trancher le mode d'envoi. Essayer la dictée et l'ouverture du brouillon sur un poste réel, le microphone et le client de messagerie n'ayant pas pu être exercés ici. Remplir l'annuaire. Publier les outils web encore locaux et ajouter leur fiche.


## 2026-08-29

Première session de développement, à partir du prompt de `idee-origine.md`. Le hub v1 est écrit, vérifié et publié.

**Questions tranchées en début de session.** Nom du dépôt `b27-hub`, donc adresse https://mamalric.github.io/b27-hub/. Dépôt public : c'est la seule façon d'obtenir un lien en ligne sur un compte GitHub gratuit, et le hub ne contient que des noms d'outils et des adresses, aucune donnée sensible. Catalogue de lancement limité aux deux outils réellement publiés, la Calculette ECS et Bouclage et le Dimensionnement émetteurs Finimetal. Page non référencée, balise `noindex` et `robots.txt` : un site statique ne peut pas être réellement protégé par mot de passe, autant assumer un lien discret plutôt que faire croire à une protection.

**Charte graphique.** Les deux références visuelles du prompt sont la Calculette ECS et le Sélectionneur de radiateurs Finimetal. Leur feuille commune a été relue et reprise à l'identique : palette papier et encre à primaire olive `#7da32f`, rayons de 10 px, pile de polices Inter puis Segoe UI sans lien Google Fonts, thème clair et sombre avec bascule mémorisée, rouage en haut à droite ouvrant un panneau "À propos", icônes Lucide inlinées. Le vert de marque du site vitrine B27 (`#95BE4E`, projet `2026-08-05_Site B27`) est de la même famille : l'olive en est la déclinaison "outils". La continuité recherchée est celle des outils entre eux, puisque c'est entre eux que le collègue navigue. Le tout est consigné dans `docs/charte.md`.

**Architecture.** `index.html` ne porte que l'ossature, tout est construit à l'exécution depuis `outils.js`. Ce fichier est en `.js` et non en `.json` volontairement : chargé par `<script src>`, il fonctionne aussi quand la page est ouverte depuis le disque, là où un `fetch()` de JSON serait bloqué sur `file://` et laisserait le hub vide. Le site est à la racine du dépôt, GitHub Pages ne sachant servir que la racine ou `/docs`, et `docs/` reste la documentation par convention DevCode. Le dossier `src/` a été retiré, il n'aurait rien contenu.

**Décisions de conception.** Cinq statuts (en ligne, bêta, à venir, bureau, obsolète), dont deux seulement rendent la carte cliquable ; une carte inerte est un `div` et non un `a`, pour ne pas être annoncée comme un lien par un lecteur d'écran ni prendre le focus au clavier. Le statut normal ne porte pas de pastille, seules les exceptions en reçoivent une. La barre de recherche et les filtres n'apparaissent qu'à partir de six outils (`REGLAGES.seuilFiltres`), les titres de section qu'à partir de trois catégories peuplées (`REGLAGES.seuilSections`) : avec deux cartes, ces éléments prendraient plus de place que le catalogue. La recherche ignore les accents, personne ne les tape dans un filtre. La grille est en `auto-fill` et non `auto-fit`, sinon deux cartes s'étireraient chacune sur une demi-page.

**Garde-fous.** `hub.js` contrôle le catalogue au chargement et signale dans la console les catégories, statuts et icônes inconnus, les identifiants en double et les statuts cliquables sans adresse. `tests/verifier_outils.py` fait le même contrôle en version stricte hors navigateur, bibliothèque standard uniquement, avec un code de sortie exploitable. Il lit les littéraux JavaScript en retirant les commentaires caractère par caractère et non par expression régulière, sinon le `//` de `https://` serait pris pour un début de commentaire et les adresses disparaîtraient.

**Vérifications faites dans le navigateur.** Thème clair et sombre, desktop et mobile (375 px). Panneau "À propos" et ses compteurs. Catalogue porté temporairement à sept outils dans une copie hors dépôt, pour contrôler ce qui n'apparaît qu'à la croissance : barre de recherche, filtres avec leurs compteurs, titres de section, pastilles bêta, à venir, bureau et obsolète, cartes inertes en pointillés. Recherche sans accents ("desenfumage") trouvant bien "Désenfumage", et état vide quand rien ne correspond. Deux corrections à la suite de ces essais : la croix d'effacement native du champ `type="search"` faisait doublon avec la nôtre, elle est neutralisée ; sur mobile, le renvoi à la ligne du conteneur d'en-tête expédiait les deux boutons sur une troisième ligne, `flex-wrap: nowrap` sous 560 px laisse le bloc de titre rétrécir et garde les boutons à droite.

**Publication.** Dépôt `mamalric/b27-hub` créé en public, GitHub Pages servi depuis la racine de `main`.

**Reste à faire.** Publier les outils web B27 encore non déployés et ajouter leur fiche au fur et à mesure. Faire essayer le lien à quelques collègues avant diffusion large.

## 2026-08-29
- Création du projet à partir du modèle `application`, depuis le gestionnaire.
- Idée d'origine déplacée depuis dev/_ideas/ (fichier idee-origine.md).
