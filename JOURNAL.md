# Journal

<!-- Dernière entrée en haut. Une entrée par session de travail ou par décision. Date au format AAAA-MM-JJ. -->

## 2026-09-01, le flou est retire pour de bon, les tuiles deviennent pleines

**Verdict de l'utilisateur sur les deux essais de la veille : sans flou du tout, "c'est bien mieux, le flou n'apporte rien en fait".** La branche `experiment/sans-flou` est fusionnee, `experiment/flou-au-repos` abandonnee et supprimee. Plutot que de laisser une ligne `filter` commentee en travers du code, le retrait est fait pour de bon : la variable `--aimant-flou` disparait des deux points de rupture ou elle vivait, la regle `.aimant.flou` ne garde que son `pointer-events:none`, et les commentaires qui expliquaient encore le flou (dans `hub.css`, `hub.js` et `FICHE.md`) sont corriges pour dire ce qui est vrai maintenant : le lointain se lit par l'opacite et l'echelle seules, "six centiemes d'opacite" suffit a dire qu'une carte ne se lit pas, sans qu'un filtre y ajoute rien.

**Les tuiles meteo et calendrier passent de vitre a plein.** Elles empruntaient `--carte`, la couleur translucide des cartes d'outils, avec un `backdrop-filter:blur(12px)` : le fond anime se devinait derriere un chiffre qu'on est venu lire, ce que l'utilisateur a signale comme genant. Elles empruntent maintenant `--carte-pleine`, deja la couleur solide des menus et modales du portail, et le flou de fond, sans plus rien a flouter derriere une couleur opaque, est retire avec elle : un cout de rendu en moins, gratuit.

Verifie : fond calcule en `rgb()` sans canal alpha dans les deux themes, `backdrop-filter:none`, console vide, controle du catalogue au vert.

## 2026-09-01, essai : le lointain sans flou du tout (branche experiment/sans-flou)

Second essai demande, sur une seconde branche a comparer a la premiere plutot qu'a la remplacer : et si le flou du lointain disparaissait purement et simplement, plutot que de reposer a l'arret ? Une seule ligne neutralisee dans `hub.css`, le `filter:blur(...)` de la regle `.aimant.flou`, commentee et expliquee sur place. Rien d'autre ne bouge : l'opacite et l'echelle portees par `--f` continuent seules a dire l'eloignement, et le lointain reste non cliquable comme avant, cette regle n'ayant rien a voir avec le flou.

Verifie : filtre calcule a "none" sur les groupes hors foyer, `pointer-events:none` toujours present, opacite toujours degressive. Console vide, controle du catalogue au vert.

Deux essais vivent maintenant en parallele, aucun fusionne : `experiment/flou-au-repos`, sur la base des trois retouches du jour (le flou revient a l'arret), et `experiment/sans-flou`, sur la base d'avant ces retouches (le flou ne revient jamais). Le choix attend le jugement de l'utilisateur sur l'ecran reel.

## 2026-09-01, trois retouches contre les saccades

Retour signale : ralentissements et animations saccadees. Diagnostic pose avant de toucher au code, trois postes trouves. Trois retenus pour cette session, une quatrieme (retirer le flou pendant le defilement actif) ecartee par l'utilisateur, crainte d'une perte visuelle trop nette.

**Le flou du lointain, allege.** `--aimant-flou` passait de 5px a 3px : c'est le seul poste du magnetisme qui coute au processeur graphique, recalcule a chaque image de defilement sur jusqu'a dix-sept groupes a la fois, plus cher encore sur des cartes qui portent deja le verre du backdrop-filter. 3px etait deja eprouve plus bas dans le fichier, sur petit ecran : la meme valeur, generalisee, distingue tout autant le lointain sans peser autant.

**Les ecouteurs de defilement, fusionnes.** Trois ecrans reagissaient au defilement (le repere du sommaire, le magnetisme des groupes, la pilule d'ancrage), chacun avec son propre ecouteur et sa propre image demandee au navigateur : jusqu'a trois `requestAnimationFrame` par geste de molette pour un travail qui tient dans une seule image. Une inscription commune, `surScrollInscrire`, remplace les trois : chaque script s'y ajoute, un seul ecouteur et une seule image suffisent desormais, quel que soit le nombre d'ecrans qui repondent.

**Le fond animе s'allege sur machine lente, une fois, sans jamais revenir en arriere.** Le repere est le temps reel entre deux images, pas la puissance annoncee par le navigateur, qui ne dit rien du cout reel. Quatre-vingt-dix images d'affilee plus lentes que 33 ms (sous trente images par seconde) declenchent un allegement de quarante pour cent des particules et des nappes, par le meme chemin qu'un changement de meteo. Un hoquet isole ne declenche rien, une image rapide reinitialise le compte. Une fois allege, le fond le reste meme apres un changement de theme ou de meteo : l'aller-retour aurait fait le va-et-vient qu'on cherche justement a eviter.

Verifie : le defilement fusionne repond bien en un seul appel (pilule, magnetisme et sommaire se recalent ensemble) ; l'allegement se declenche apres quatre-vingt-onze images lentes simulees, jamais sur des hoquets isoles entrecoupes d'images rapides, survit a un changement de theme, et ne redevient jamais complet. Console vide, controle du catalogue au vert.

## 2026-09-01, le portail accueille en clair

Un nouveau visiteur arrivait en sombre, alors que la demande est desormais d'accueillir en clair. Deux endroits fixaient "dark" par defaut : le script anti-flash d'`index.html`, qui pose le theme avant le premier rendu pour eviter un eclair de l'un a l'autre, et `initTheme()` dans `hub.js`, qui prend le relais une fois le script charge. Les deux passent a "light" ; sans cette double correction, le script anti-flash aurait affiche le sombre une fraction de seconde avant que hub.js ne corrige, l'eclair inverse de celui qu'il est cense eviter. Le commentaire d'identite en tete de `hub.css` est reecrit dans le meme sens : le sombre reste l'habit fort du portail, celui ou le champ d'ecoulement prend son relief, mais ce n'est plus le premier contact. Le bouton lune/soleil et la memoire par navigateur ne changent pas : un visiteur qui choisit le sombre le retrouve a son retour, comme avant.

## 2026-09-01, RefriSelect ouvre ses portes

Premier des quatre outils "a-venir" a etre publie : RefriSelect repond desormais a https://refriselect.marius-amalric45.workers.dev/, verifie avant d'ecrire l'adresse dans le catalogue. Statut passe a en-ligne, la carte redevient cliquable et compte dans "Nos outils". Le pitch et les mots-cles, deja ecrits en aout, n'ont pas bouge : ils decrivaient deja ce que l'outil fait. Trois fiches "a-venir" restent en attente d'adresse : Desenfumage, RTex Tool, Etiquette DPE.

## 2026-08-31, les trois fiches Zoho mènent aux espaces de l'entreprise

Les trois liens Zoho menaient aux pages commerciales des produits sur `zoho.com`. Ils mènent désormais aux espaces européens où les collègues travaillent : `crmplus.zoho.eu` pour Projects, `expense.zoho.eu` pour Expense, `people.zoho.eu` pour People. Les dates des portes suivent.

Une question posée plutôt qu'une adresse devinée : Projects avait été donné, les deux autres non, et CRM Plus ne contient ni Expense ni People. Les appliquer par analogie aurait posé deux liens faux sur un portail public. Les pitchs ne bougent pas : ils disent déjà qu'un compte d'entreprise est nécessaire, ce qui reste la question ouverte sur ces trois fiches.

## 2026-08-31, le bouton NEW ne s'effaçait pas vraiment

Signalé aussitôt après la livraison précédente : le bouton restait affiché alors qu'il n'y avait plus rien de neuf. La mécanique était pourtant bonne, `btn.hidden` passait bien à vrai. C'est la feuille de style qui l'annulait : `.bouton-neuf` déclare `display:inline-flex`, et un display posé par la feuille de style l'emporte sur la règle `[hidden]{display:none}` du navigateur. Le bouton gardait ses soixante-dix-sept pixels, caché pour le code et visible pour l'oeil.

**Une ligne suffit**, `.bouton-neuf[hidden]{display:none}`, la même garde que les tuiles vives portaient déjà pour la même raison. Les autres éléments qui naissent `hidden` dans `index.html` ont été vérifiés : les rayons n'ont pas de display à eux, la recherche en a un mais son `hidden` est retiré au démarrage. Aucun autre cas.

Ma faute de vérification, et elle est instructive : j'avais contrôlé la propriété `hidden` en JavaScript, pas le `display` calculé. Lire l'état interne d'un élément ne dit rien de ce qui est à l'écran. Le contrôle porte désormais sur la largeur mesurée, qui passe de soixante-dix-sept pixels à zéro.

Vérifié après rechargement : bouton à `display:none`, largeur nulle, la barre du haut reprenant ses quatre boutons d'icône. Piège du cache retrouvé au passage, comme la dernière fois : le volet d'aperçu servait l'ancienne feuille de style, il a fallu un port neuf pour voir la correction.

## 2026-08-31, le volet des nouveautes conduit a la carte

Trois retouches demandees sur le volet pose ce matin, et elles le font changer de nature : il annoncait, il conduit maintenant.

**L'icone de l'outil remplace la pastille de couleur.** Une pastille ronde disait la couleur du metier, pas de quel outil il s'agissait. La ligne porte desormais la meme plaque que la carte, l'icone du catalogue sur le fond du lot, en trente pixels au lieu de quarante-deux.

**Le clic descend a la carte au lieu de sortir du portail.** La ligne est devenue un bouton, le chevron pointe vers le bas, et le chemin est celui du sommaire : le groupe se pose au foyer du magnetisme, a pleine encre, le reste de la page s'estompant autour. La carte prend alors un anneau a la couleur de son metier pendant dix secondes, le temps que l'oeil la trouve. L'anneau ne bat pas, la regle du calme vaut ici comme pour le halo du soleil, et il s'efface par la transition que la carte porte deja. Pour retrouver la carte, il a fallu lui donner un `data-porte` : elle n'etait identifiable par rien.

**Une nouveaute vue cesse d'etre neuve.** La cle memorisee est la porte et sa date, `id@maj`, ce qui laisse un outil remis a jour redevenir neuf : c'est le propre d'un volet de nouveautes. Le nombre suit, et le bouton s'efface entierement quand il n'y a plus rien a annoncer, ce qui vaut mieux qu'une pastille NEW qui crie dans le vide.

Verifie dans les deux themes : icones lisibles, cible calculee a 1232 pixels pour la calculette ECS et carte entierement visible a l'arrivee, anneau present a 0,5 et 8,5 secondes, parti a 10,7, memoire des vues qui survit au rechargement, bouton cache une fois les deux vus. Le defilement doux ne s'anime pas dans le volet d'apercu, le sommaire du portail s'y comporte pareil : c'est l'environnement, pas la page.

## 2026-08-31, deux outils, pas dix, et un volet pour les voir

Second signalement de la journée : "il est marqué 10 mais c'est faux". Vrai, et la correction d'hier n'était allée qu'à mi-chemin. Le compteur avait cessé de compter les sept cartes en attente, celles qui n'ont pas de nom, mais il comptait toujours les huit fiches "Bientôt" qui portent un nom, un pitch et aucune adresse. Sur les dix-sept cartes du rayon, deux seulement s'ouvrent : la Calculette ECS et Bouclage, et le Dimensionnement émetteurs Finimetal.

**Le compteur annonce désormais ce qui s'ouvre, rien d'autre.** Deux outils, dix-sept ressources. Une carte en attente et un outil annoncé se ressemblent pour qui compte : ils promettent tous les deux. La disponibilité devient une notion nommée dans le code, `estDisponible`, un statut cliquable et une adresse, et c'est la même qui décide qu'une carte est un lien ou un rectangle mort. Les ressources passent au même filtre, sans changer de total puisqu'elles sont toutes en ligne.

**Le détail se lit dans À propos**, à sa place : nos outils 2, outils à venir 8, métiers en attente 7, ressources 17. Rien n'est caché, la somme se refait à l'oeil, mais la page d'accueil ne promet plus.

**Un volet des nouveautés en haut à droite**, demandé dans la foulée. Une pastille "NEW" avec le nombre, à gauche des réglages, et un volet qui liste les derniers outils disponibles, du plus récemment mis à jour au plus ancien, trois au plus : une pastille à la couleur du métier, le nom, la date, une flèche de sortie. Il ne montre que des portes franchissables, pour la même raison que le compteur : annoncer comme neuf ce qui n'existe pas encore aurait refait, dans un coin plus voyant, le défaut qu'on venait de corriger. Sans rien à montrer, le bouton ne paraît pas du tout. Au-dessus de 1240 pixels, le volet s'écarte du rail du sommaire plutôt que de passer dessous, ses flèches étant justement de ce côté.

Vérifié dans les deux thèmes, dans les deux langues et en écran étroit : compteur à deux outils, volet qui s'ouvre et se ferme au clic, dehors et à Échap, noms traduits en anglais, panneau À propos à quatre lignes. Console vide, contrôle du catalogue au vert.

## 2026-08-31, le fond avait pris l'herbe

Défaut signalé au retour d'une pause déjeuner : une bordure d'herbe verte, épaisse, mangeait la droite et le bas de l'écran, le contenu tenait dans un rectangle propre en haut à gauche. Un rechargement suffisait à tout nettoyer, ce qui est précisément le problème : la panne s'installait toute seule et ne partait jamais d'elle-même.

**Le diagnostic tient dans une mesure.** La zone propre faisait exactement 80 pour cent de la fenêtre, soit un sur 1,25, la densité de pixels du poste. Le canvas garde une mémoire dimensionnée en pixels physiques et une transformation qui y convertit les pixels de la page ; les deux étaient posées une fois pour toutes, au chargement et au redimensionnement, et la boucle d'animation leur faisait confiance ensuite. Il suffit que la transformation retombe à un, ce qu'une mise en veille, un changement d'écran ou une perte du contexte graphique font sans prévenir, pour que le dessin se replie sur une fraction du canvas. Et surtout pour que l'effacement, un rectangle calé sur les dimensions mémorisées, ne couvre plus la bordure. Le fond n'ayant que ce rectangle pour s'effacer, tout ce qui s'y peignait restait : les traînées s'y sont empilées image après image, une heure durant, jusqu'à faire ce tapis. L'herbe n'était pas une texture, c'étaient les traits du champ d'écoulement accumulés.

**Reproduit avant de corriger.** En neutralisant l'effacement pendant 2400 images puis en remettant la transformation à un, le volet d'aperçu a rendu l'image du signalement, trait pour trait.

**La correction rend la boucle capable de se remettre d'aplomb seule.** Le cadre se revérifie à chaque image, trois lectures, et la transformation est réaffirmée qu'elle ait dérivé ou non ; l'effacement porte désormais sur toute la mémoire du canvas, en pixels physiques, quelle que soit la transformation en cours. Une dérive, quelle qu'en soit la cause, se répare en une image, seize millisecondes, au lieu de durer jusqu'au rechargement. Deux fonctions dans `hub.js`, `fondCadrer` et `fondEffacer`, et les trois autres endroits qui effaçaient le fond passent par la seconde.

**Un second défaut trouvé au passage, et mesuré en direct.** `window.innerWidth` vaut zéro quand la fenêtre est réduite ou l'onglet ouvert en fond. L'ancien code écrivait ce zéro tel quel dans les dimensions du canvas, soit un canvas de zéro par zéro qui ne dessinait plus rien tant qu'un redimensionnement ne venait pas le sauver. Une surface nulle est maintenant une image sautée, et le semis des particules attend d'avoir une page où naître.

Vérifié : chargement neuf, redimensionnement dans les deux sens, changement de thème, et la panne simulée sur 2400 images qui se répare à la première. Console vide, contrôle du catalogue au vert.

## 2026-08-30, la recherche trouvait sans qu'on la voie, et le compteur mentait

Deux défauts signalés coup sur coup, tous deux dus à des changements du jour.

**"Faire une recherche n'affiche rien."** La recherche fonctionnait pourtant : mesuré sur "plomb", quatre cartes trouvées et démasquées. Seulement l'entrée occupe l'écran entier depuis ce matin, et les résultats se rangeaient dessous, à 721 pixels du haut sur une fenêtre qui en fait 607. On voyait une page vide. L'entrée rend donc sa hauteur pendant une recherche : mesurée à 424 pixels, la première carte remonte à 538, sous les yeux. Ce qu'on cherche doit apparaître sous le champ, pas un écran plus bas.

**"Dix-sept outils, c'est faux, il n'y en a pas autant."** Vrai aussi : sept des dix-sept sont les cartes À venir posées ce matin pour tenir la place des métiers sans projet. Une carte qui attend n'est pas un outil. Elle porte maintenant un champ `attente` dans le catalogue, le compteur ne la compte plus, et le portail annonce dix outils. Le panneau À propos les compte à part, sous le nom de métiers en attente : c'est une information, pas une promesse.

Vérifié : compteur à dix outils et dix-sept ressources, recherche visible sans défiler, retour à l'entrée pleine hauteur quand le champ se vide, panneau À propos à dix outils et sept métiers en attente. Console vide, contrôle du catalogue au vert.

Leçon de test, et elle m'a coûté six essais : le volet d'aperçu garde un cache tenace sur les fichiers servis en local, et rechargeait une version d'il y a deux corrections. Vérifier une correction dans ce volet demande de servir sur un autre port, ce qui donne une origine neuve et un cache vide.

## 2026-08-30, le portail parle anglais

Le menu des langues portait cinq emplacements morts depuis la v7. L'anglais vit maintenant, et lui seul : une deuxième langue bien faite vaut mieux que cinq à moitié, et c'est la seule dont un client étranger a vraiment l'usage.

**Le portail se traduit, pas les sites qu'il pointe.** La consigne était nette et elle rend la chose tenable : le cadre, nos propres outils, les quatorze métiers et les cinq domaines passent en anglais ; les dix-sept fiches de ressources gardent leur nom et leur description en français, puisqu'elles mènent à des sites français et qu'une description traduite promettrait un contenu qui n'existe pas. Une trentaine de phrases de contenu au lieu de trois cents.

**Deux sources, et c'est voulu.** Le vocabulaire de l'interface vit dans hub.js, dans un dictionnaire dont la clé est la phrase française : le code continue de s'écrire en français, une chaîne sans traduction retombe d'elle-même sur l'original, et rien ne casse si l'on en oublie une. Le contenu du catalogue se traduit dans catalogue.js, sur chaque fiche, dans un objet en posé à côté du français, pour que ce fichier reste le seul à faire vivre. Le validateur a appris à accepter ce champ.

**Changer de langue recharge la page**, et c'est une économie plutôt qu'une paresse : tout se construit à l'exécution, sommaire et écouteurs compris, et reconstruire à chaud demanderait de défaire et refaire des liaisons que rien n'oblige à toucher. Le choix vit dans le navigateur comme le thème, posé sur la balise html avant le premier rendu.

Trois pièges rencontrés, tous du même genre. Le dictionnaire porte les phrases françaises comme clés : une première passe automatique a enveloppé ses propres clés d'appels à la fonction de traduction, et le fichier ne se lisait plus ; il a fallu scinder le fichier et ne toucher qu'à ce qui suit le dictionnaire. Beaucoup de phrases vivent au milieu d'une chaîne HTML plutôt qu'isolées, il faut alors fermer la chaîne et la rouvrir. Et en posant les marqueurs de traduction sur les titres de rayon, j'ai effacé leur texte français : vérifié dans les deux langues, cette fois.

Vérifié en anglais : titre, accroche, recherche, rayons, métiers, domaines, cartes de nos outils, compteurs, badges, entête, tuile météo avec ses mesures et son temps, calendrier avec ses mois et ses semaines, panneau détaillé, À propos, libellés d'accessibilité. Les fiches de ressources restent en français, comme voulu. Retour en français : rien n'a bougé. Console vide, contrôle du catalogue au vert.

## 2026-08-30, les prête-noms s'en vont, le catalogue s'étoffe

Reproche fondé, et il fallait le faire : le portail annonçait des applications sous des noms que personne n'avait validés. Cinq étaient des prête-noms que j'avais inventés pour tenir la place d'un métier vide, quatre venaient d'une feuille de route lue un peu vite. Un portail public n'annonce que ce que la maison a nommé.

**Neuf fiches perdent leur nom.** Sept deviennent des cartes "À venir", une par métier sans projet décidé : VRD, électricité, carbone, paysage, structure, BIM, utilitaires. Elles ne disent plus qu'une chose, qu'elles attendent, et remplacer l'une d'elles c'est remplir son nom, son pitch, son icône et son url. Les deux dernières, les calculettes de résistance thermique et de confort d'été, disparaissent sans remplaçante : le métier thermique porte désormais RTex Tool et l'étiquette DPE, il n'a plus besoin d'une carte d'attente.

**L'étiquette DPE entre dans le lot thermique**, en statut a-venir. Son pitch reste à écrire et son url à donner : l'outil est nommé par la maison, ce qu'il fait exactement n'a pas été dit, et je me garde de le deviner une fois de plus.

**Dix liens entrent dans les ressources**, en deux temps. Les données et bases accueillent BIMobject, le Géoportail de l'IGN et le cadastre d'Etalab ; la documentation technique, Batipedia, l'AICVF et l'ACERMI. Les quatre derniers ouvrent un sous-dossier, Services et outils du quotidien : ce qu'on ouvre en travaillant sans que ce soit une référence technique, les trois Zoho et SwissTransfer.

Les dix adresses ont été appelées une à une, et trois d'entre elles ont dit quelque chose. Batipedia redirige vers sa page de connexion, ce que son pitch annonce désormais. L'AICVF redirige vers son domaine sans www, adopté du coup. Et le lien du cadastre est celui qui a été donné, vue carte sur fond de photo aérienne, plutôt que la page d'accueil du service : c'est la vue qui sert.

**Une réserve, notée dans le catalogue et dans la fiche.** Zoho Projects, Expense et People demandent un compte d'entreprise et ne s'ouvrent pas pour un visiteur extérieur. La charte veut qu'un portail public ne montre pas ce qui est réservé à l'interne, et B27 Mobility en était sorti pour exactement cette raison. Ils sont là parce qu'ils ont été demandés, et leur pitch le dit ; il reste à trancher si le portail doit rester entièrement ouvrable par un client.

Le catalogue passe de vingt-cinq à trente-quatre portes, dont dix-sept ressources, et le compteur annonce dix-sept outils et dix-sept ressources. Contrôle du catalogue au vert, aucune anomalie relevée par le contrôle embarqué, console vide.

## 2026-08-30, le panneau météo prend de l'air

"Aère mieux cette fenêtre météo, accepte des espaces plus importants entre les éléments, élargis-la, rends-la plus agréable à naviguer."

Le panneau était serré parce qu'il avait grandi par ajouts successifs sans que sa largeur bouge : dix mesures, vingt-quatre heures, sept jours, le soleil, l'air et le composeur dans 680 pixels. On y lisait un tableau, pas un bulletin.

Il passe à 880 pixels de large et sa hauteur maximale de 78 à 86 % de l'écran, ce qui fait 861 pixels de haut au lieu de 720 : la moitié du contenu tient sous les yeux au lieu du tiers. Les cases de mesure passent de neuf à quatorze pixels de rembourrage et de sept à douze d'écart, les heures de quatre à dix, les jours de quatre à huit avec une ligne à treize pixels de rembourrage au lieu de huit. Les sections d'un panneau sont séparées de trente pixels au lieu de dix-huit, leur titre se détachant de quatorze au lieu de huit. Le composeur passe de deux à trois colonnes, la largeur le permettant.

Deux détails trouvés en vérifiant. Le bloc des mesures n'est pas une section et n'avait donc pas de marge de pied : il collait au titre suivant, il en a une maintenant. Et sous 720 px, la ligne d'un jour ne tenait plus ses cinq colonnes, mon élargissement des écarts ayant coûté vingt-deux pixels à une ligne qui n'en avait pas de reste : le détail pluie et vent, le moins essentiel des cinq, s'efface à cette largeur.

Vérifié à 1440 par 1032 : panneau de 854 sur 861, quatre colonnes de mesures à 195 pixels, huit heures qui remplissent la largeur sans défiler, sept jours au large, composeur à trois colonnes. À 375 px : une mesure par ligne, aucun débordement horizontal hormis la bande des heures, qui défile par construction. Console vide.

## 2026-08-30, la molette ne déverrouille pas le son

"Je n'ai plus de son avec la molette." Ce n'était pas une régression du carrousel mais une règle du navigateur que j'avais mal lue en écrivant le synthétiseur.

Le navigateur interdit tout son avant un geste d'activation, et tous les gestes n'en sont pas : un clic, une touche, un toucher comptent, la molette non. Un visiteur qui ne fait que dérouler laissait donc le contexte audio suspendu, et les notes programmées à son horloge, qui n'avance pas dans cet état, se perdaient sans bruit. Pire, chaque tentative consommait l'intervalle de quarante millisecondes qui espace les sons, si bien que la première note après déverrouillage pouvait être écartée à son tour.

Trois corrections. Le déverrouillage est accroché aux gestes qui en ont le pouvoir, posé en capture sur la fenêtre et laissé en place, un contexte pouvant être resuspendu par le système en cours de route. Une note demandée contexte fermé n'est plus programmée dans le vide : elle repart dès que le contexte s'ouvre, une seule reprise en attente à la fois. Et une note qui n'a pas sonné ne consomme plus l'intervalle.

Reste la limite, qui n'est pas de mon ressort : sur une page fraîche, tant que rien n'a été cliqué ni tapé, la molette reste muette. Un seul clic n'importe où suffit pour toute la visite.

Vérifié en simulant un contexte verrouillé : aucune note programmée, intervalle non consommé, reprise en attente ; à l'ouverture, la note part. Molette contexte ouvert, elle sonne. Un pointerdown appelle bien la reprise. Console vide.

## 2026-08-30, le sautillement du grand coup de molette

"Quand je fais un grand coup de molette, la tuile sautille plusieurs fois avant que je me retrouve instantanément dix tuiles plus loin." Deux fautes en une, et la description les décrit toutes les deux.

**Le sautillement venait du navigateur.** Un scrollTo en smooth relance son animation à chaque nouvelle cible : sur une volée de crans, la page repartait en accélérant à chaque fois, d’où les à-coups, puis sautait d’un bloc à la dernière cible quand la volée s’arrêtait. Le glissement est donc tenu par la page : la position rejoint la cible d’un cinquième de l’écart par image, exactement l’inertie de la molette des panneaux, au même coefficient. Le portail n’a plus qu’une façon de glisser, et une cible qui bouge en plein vol ne fait qu’allonger la course.

**Les dix tuiles venaient de la borne par secousse.** Elle ne tenait pas la route : un coup vif n’envoie pas un événement mais une rafale, et deux crans par événement en faisaient dix ou quinze pour un seul geste. Borner la rafale n’aurait pas suffi non plus, cela aurait fixé une distance maximale par geste au lieu de laisser aller loin qui tourne longtemps. Une cadence règle les deux : un cran toutes les cent dix millisecondes au plus, soit environ neuf par seconde tant qu’on tourne. Elle ne prend rien à personne, elle étale ce qui arrive trop vite pour être vu.

**Et le test a trouvé une troisième faute que je n’attendais pas** : le glissement s’arrêtait deux pixels court. La position de défilement est quantifiée, un pas amorti de moins d’un pixel se perd à l’arrondi, et l’amortissement n’avançait plus. Les quatre derniers pixels se posent maintenant d’un coup, ce qui ne se voit pas et rend l’axe exact, lui qui se mesure à la règle.

Vérifié : quinze événements de molette en rafale serrée ne donnent qu’un cran, les mêmes étalés à cent trente millisecondes en donnent un chacun, une pichenette isolée part tout de suite. La courbe de glissement mesurée image par image, 263 puis 205, 160, 125, 97, 76 pixels : monotone, amortie, sans redémarrage. Atterrissage à zéro pixel d’écart sur quatre distances, un, trois, sept et douze arrêts, en vingt-deux à vingt-huit images quelle que soit la distance. Axe des cartes toujours à 389 ou 390 pixels. Console vide.

Note de terrain : le glissement s’appuyant sur requestAnimationFrame, un onglet caché le suspend, et la page reprend sa course à son retour. C’est ce qui rend la vérification impossible dans le volet d’aperçu masqué, où la courbe a dû être déroulée à la main.

## 2026-08-30, la pastille rend sa place à la catégorie

"Garde uniquement le logo B27 dans la pastille, et mets mieux en valeur la catégorie."

Les deux demandes n'en font qu'une. La pastille d'ancrage portait le logo et le titre du portail, et le nom du rayon se lisait juste dessous en gris discret : deux textes empilés, dont l'un n'apprenait rien à qui est déjà sur la page. À cet endroit de l'écran, savoir où l'on se trouve vaut mieux que relire le nom du site.

Le titre sort donc de la pastille, qui devient un disque de quarante-deux pixels portant le seul emblème, un peu plus grand qu'avant puisqu'il y est seul. Et le nom du rayon prend la place et le poids qu'occupait le titre : quinze pixels au lieu de douze, graisse huit cents, deux virgule quatre d'espacement, à pleine encre au lieu du gris. Ce n'est plus le murmure d'un titre de groupe, c'est le repère principal du haut de page.

Vérifié à 1440 par 1032 : pastille de quarante-deux sur quarante-deux, sans texte, et catégorie à soixante-six pixels du haut, toutes deux centrées sur l'axe de la page. Console vide.

## 2026-08-30, l'entre-deux de la vitesse

"Il n'y a pas d'entre-deux dans tes modifs, tu peux pas faire ça ?" Remarque juste sur ma façon de corriger : au retour précédent j'étais passé du blocage complet, un métier par demi-seconde, à la liberté complète, quatre métiers pour un seul coup de molette. J'ai demandé lequel des réglages devait trouver son milieu plutôt que de deviner : c'est la vitesse du défilement.

La borne de volée passe de quatre à deux. Sans borne, un geste vif fait de la page un ascenseur et on ne sait plus où l'on est ; avec une borne trop basse, on retrouve le traînage. Deux, c'est ce qu'un coup franc doit rendre.

Et la distinction qui fait tout : **la borne tient la secousse, pas la cadence.** Marteler la molette reste sans limite, chaque coup valant son dû, et le clavier n'est pas touché. Ce n'est pas la vitesse qui était de trop, c'est le fait qu'un seul geste puisse traverser un quart du catalogue.

Vérifié, avant et après : coup ample de 420 pixels, quatre métiers puis deux ; secousse de 3000 pixels, quatre puis deux ; quatre coups de molette, quatre dans les deux cas ; dix coups, dix ; huit pressions de flèche, huit. Le demi-cran ne fait toujours rien, le reliquat ne repart toujours pas. Console vide.

## 2026-08-30, le carrousel rend la vitesse qu'on lui donne

"Je ne peux pas spammer les flèches du clavier, c'est décevant : les techniciens sont des gens pressés avec les outils numériques, si ça ne peut pas aller vite c'est frustrant. Et quand je donne de gros coups de molette, j'aimerais que ça suive."

La faute est à moi et elle est nette. Le repos de quatre cent vingt millisecondes, posé pour qu'une secousse un peu longue n'enchaîne pas des crans qu'on n'a pas voulus, mangeait tout ce qui arrivait pendant le glissement. Le remède était pire que le mal : on ne pouvait plus enchaîner du tout.

**Les crans se comptent maintenant depuis là où l'on va, pas depuis là où l'on est.** L'arrêt visé est retenu, le cran suivant part de lui, et le glissement se contente de rattraper une cible qui a bougé sous lui. Cinq pressions coup sur coup valent cinq métiers. La visée périme au bout de sept dixièmes de seconde et s'efface à l'arrivée, de sorte qu'un défilement venu d'ailleurs, une tabulation ou un doigt sur l'écran, ne laisse pas de trace.

**Et la molette rend toute sa secousse.** Elle accumule, chaque tranche de cent pixels vaut un cran, et une secousse en vaut donc plusieurs d'un seul coup. Le seuil descend de cent quatre-vingts à cent, un cran de molette ordinaire valant un métier là où il en fallait deux ou trois. La volée est bornée à quatre, pour qu'un événement de pavé tactile ne téléporte pas la page d'un bout à l'autre.

Un test a trouvé un défaut que je n'avais pas prévu : le reliquat d'une secousse énorme se mettait en réserve, et six pichenettes ultérieures traversaient la page entière. Ce qui dépasse la volée est désormais perdu.

Vérifié par événements synthétiques, dix-sept arrêts : demi-cran zéro métier, pichenette un, deux coups deux, gros coup de 420 pixels quatre, secousse de 3000 pixels quatre aussi, pichenette suivante un seul. Clavier : une pression un métier, cinq pressions cinq, douze pressions douze, cinq en avant puis trois en arrière deux. La butée rebondit toujours en bout de course. Console vide.

Leçon : une résistance qui protège d'un accident rare ne vaut pas d'empêcher le geste courant. La borne de volée protège du même accident sans rien coûter à qui va vite.

## 2026-08-30, le portail répond au geste, à l'oeil et à l'oreille

"Ajoute des retours visuels et audio quand on réalise une action, ça doit rester minimaliste, subtil et élégant à l'oreille."

**Cinq gestes ont un retour, et cinq seulement** : cran vers le bas, cran vers le haut, passage d'un rayon à l'autre, butée en bout de course, sélection. Au-delà, ce serait du bruit, et le mot de la demande était minimaliste.

**Rien n'est enregistré, tout est synthétisé.** L'API Web Audio construit chaque son à la volée, ce qui est la même règle que le fond calculé plutôt que dessiné : pas un fichier, pas une dépendance, et le portail continue de fonctionner depuis le disque. Chaque son est une sinusoïde de quelques centièmes de seconde, prise dans une gamme pentatonique où deux notes quelconques sonnent ensemble, donc sans accord à éviter, adoucie par un passe-bas à 2400 hertz et enveloppée d'une attaque de quatre millisecondes et d'une extinction exponentielle. Un créneau net claquerait, une coupure sèche ferait un clic. Le volume tourne autour de trois centièmes, celui d'un objet qu'on pose sur une table. Deux sons ne se collent jamais, quarante millisecondes les séparent au minimum. Ce qui descend sonne un ré, ce qui remonte un sol : le geste s'entend dans la hauteur.

**Le son est allumé par défaut, et c'est un choix à assumer.** Le navigateur interdit tout son avant un geste du visiteur, et c'est une bonne loi : le contexte audio n'est créé qu'au premier geste, jamais au chargement, si bien que le premier son entendu est toujours la conséquence d'une action. Un bouton du haut coupe tout, le choix vit dans le navigateur comme le thème, et le bouton se confirme lui-même : allumer le son fait un son, l'éteindre se tait, parce que le clic passe en délégation après que le bouton a changé d'état. Si l'usage montre que c'est de trop sur un portail qu'on ouvre en réunion, la valeur par défaut se retourne en une ligne.

**Trois retours à l'oeil répondent aux mêmes gestes.** La butée déporte le groupe au foyer de onze pixels dans le sens contraire au geste et le ramène : avant, la page ne bougeait pas et ne disait rien, on ne savait pas si le cran avait raté ou s'il n'y avait plus rien après. Le déport passe par la propriété translate et non par transform, qui porte déjà le grossissement du magnétisme : une animation sur transform le remplacerait, et le groupe perdrait sa taille le temps du rebond. La bulle du sommaire bat une fois quand le foyer arrive sur son groupe, l'oeil étant dans la page et non dans le sommaire. Et une carte enfoncée s'enfonce.

Vérifié en espionnant le synthétiseur : cran bas 587 hertz sur 75 millisecondes, cran haut 784, passage 659 puis 880 en intervalle montant, sélection 880, butée 262 sur 140 millisecondes. Deux appels collés ne jouent qu'une note. Le bouton coupé ne joue plus rien et son propre clic reste muet, rallumé il rejoue et le choix est en mémoire. À l'oeil : classe de butée posée avec son déport de onze pixels, animation en cours, grossissement du magnétisme intact pendant le rebond, classe nettoyée après. Console vide.

## 2026-08-30, le clavier prend les crans, et une souris invite à dérouler

**"J'aimerais que les flèches du clavier fassent passer d'un métier à l'autre, alors que là ça fait juste un mini décalage."** Elles défilaient nativement, quelques dizaines de pixels par pression : la page bougeait sans jamais changer de métier, et le magnétisme rattrapait ce décalage sans qu'il mène nulle part. Les flèches haut et bas, les touches page, début et fin passent donc par les mêmes arrêts que la molette. Une touche est une intention discrète : elle vaut un cran entier et n'a rien à accumuler, contrairement à la molette qui doit d'abord vaincre une résistance. La répétition de la touche est tenue par le même repos, soit un peu plus de deux métiers par seconde à touche enfoncée.

Le passage a permis de sortir deux fonctions du cran : aller à un arrêt donné, et trouver l'arrêt où l'on se trouve. La molette, le clavier et le clic au sommaire s'en servent tous les trois, et le repos qui empêche l'enchaînement involontaire est tenu à un seul endroit.

Vérifié par événements clavier : Bas quatre fois, quatre métiers d'affilée ; Haut deux fois, deux retours ; Fin sur le dernier groupe, Début en haut de page. Une flèche pressée dans le champ de recherche n'est pas reprise, le navigateur garde sa touche.

**"Ajoute une indication visuelle pour inciter à glisser la molette, sans écrire du texte."** Une souris dessinée en bas de l'écran d'entrée, sa molette qui descend lentement, deux secondes et demie par passage avec une pause entre deux. Pas un mot, et c'est le fond de la demande : "faites défiler" serait une consigne, la forme est une invitation. Elle emprunte le vocabulaire de la page, rectangle arrondi et pastille, comme tout le reste.

Elle s'efface au premier cran, ayant alors fait son travail, et pendant une recherche où elle n'aurait plus rien à promettre. Elle ne se montre qu'aux pointeurs fins : une souris dessinée sur un téléphone désignerait un objet que le visiteur n'a pas en main, et le geste de faire glisser du doigt n'a pas besoin qu'on l'apprenne. Un poste qui demande moins d'animations garde la souris, immobile, le dessin suffisant à dire la molette.

Vérifié : centrée sur l'axe de la page à vingt-six pixels du bas, opacité 0,5 en haut de page, 0 dès le premier cran comme pendant une recherche.

## 2026-08-30, le lointain devient inerte

"Je peux cliquer sur les tuiles qui sont en arrière-plan." Défaut réel, et de la pire espèce : ouvrir un outil qu'on n'a pas pu lire. Une carte à six centièmes d'opacité sous cinq pixels de flou ne se lit pas, la cliquer ne peut être qu'un accident.

Le remède tient dans la classe qui portait déjà le flou : hors foyer, le groupe ne reçoit plus le curseur. Rien de nouveau à décider, la frontière du net et du flou était déjà la bonne.

**Le clavier, lui, garde sa route**, et il fallait s'en occuper dans le même mouvement : la tabulation atteint toujours les cartes du lointain, et elle y serait aveugle. Une carte qui prend le focus amène donc son groupe au foyer, à l'arrêt même où la molette l'aurait posé. Un clic ne déclenche rien de ce mécanisme, la carte cliquée étant forcément celle du groupe au foyer, donc déjà à sa place.

Vérifié à un arrêt du milieu : la carte du groupe au foyer répond au point de contact, les quatre groupes voisins visibles ne répondent plus. Le focus clavier sur la carte la plus lointaine, celle de B27, vise 4376, qui est un arrêt du carrousel. Pendant une recherche, le magnétisme se retirant, tout redevient cliquable. Console vide.

## 2026-08-30, le site de l'entreprise trouve enfin sa place

"Repositionne le site B27 dans une tuile dans ressources." La demande précédente disait de le supprimer, celle-ci de le remettre ailleurs : c'était un déplacement en deux temps, et j'avais pris le premier pour une fin.

Il aura mis trois versions à trouver sa place, et le chemin se comprend. Dans "Nos outils, fabriqués ici", il prenait la carte, la couleur de lot et le compteur d'un outil que nous fabriquons, ce qu'il n'est pas. En signature de pied de page, il n'était plus un outil mais du mobilier, et le pied de page avec lui. Il est maintenant une carte des ressources, sous un nouveau sous-dossier "Le bureau d'études", en dernier groupe du rayon et donc de la page. C'est là qu'il est juste : les ressources sont des sites extérieurs au portail, Légifrance, l'ADEME, le CSTB, et le site de la maison en est un. Il hérite du violet des ressources comme les autres sous-dossiers.

Vérifié : vingt-cinq portes au catalogue dont sept ressources, dix-sept groupes et dix-huit arrêts, le dernier arrêt sur le groupe B27 avec l'entête "Ressources", la carte pointant sur b27.fr. Et l'axe tient : titres de 345 à 346 pixels, cartes de 389 à 390, la nouvelle carte comprise. Contrôle du catalogue au vert, console vide.

## 2026-08-30, la signature s'en va, et la bulle cliquée rend le focus

Deux demandes courtes.

**Le site de l'entreprise quitte le portail pour de bon.** Il avait déjà quitté le rayon des outils en v10, où il prenait une carte, une couleur de lot et une ligne du compteur en se donnant pour un outil de la maison ; il signait la page en pied depuis. Il est retiré tout à fait : le pied de page, la fonction qui le construisait, le bloc `REGLAGES.editeur` du catalogue, le contrôle du validateur et les règles de style partent ensemble, rien n'est laissé en sommeil. Conséquence à assumer, et elle est notée dans la charte : le portail ne nomme plus son éditeur et ne renvoie plus au site de l'entreprise. La pastille de signalement reste la seule voie pour écrire.

**Une bulle du sommaire cliquée à la souris rend le focus.** L'anneau vert et l'étiquette du nom restaient posés après le clic, alors que le nom vient d'être lu et que le groupe est déjà au foyer. Ce sont des repères de clavier, pas de souris : `ev.detail` vaut zéro sur une activation au clavier et au moins un sur un clic, ce qui suffit à distinguer les deux. Le clavier garde donc son anneau et son étiquette, la souris les perd.

## 2026-08-30, la règle sur l'écran, et deux fautes plutôt qu'une

"J'ai mis une règle sur mon écran : les cartes ne finissent pas sur le même axe horizontal d'un cran à l'autre, et c'est d'autant plus vrai sur la fin dans les ressources." Vérification chiffrée, position à l'écran de la première carte à chacun des dix-huit arrêts : de 327 à 588 pixels. Deux cent soixante et un pixels d'écart, et l'utilisateur les avait vus à l'oeil avant de les mesurer.

**Première faute, les arrêts centraient le groupe.** Un métier à une carte et un métier à quatre n'ont pas la même hauteur ; centrer la boîte donne un centre stable et fait bouger tout ce qu'elle contient. Les arrêts visent maintenant le haut du groupe, un repère franc : le titre tombe toujours à la même ligne, la rangée de cartes commence toujours à la même, et la hauteur du groupe n'a plus d'effet que sur ce qui dépasse en dessous. La mire remonte de la mi-hauteur au tiers de l'écran, puisqu'elle désigne désormais un haut et non un milieu, et l'indice continu se calcule sur les hauts.

**Seconde faute, et c'est celle qui expliquait la fin des ressources : la glissade.** La mire glissait vers le bas sur le dernier écran de défilement pour aller chercher le dernier groupe, que la course ne permettait plus d'atteindre. Le foyer arrivait bien, mais une mire qui se déplace déplace ce qu'elle vise : les cinq derniers groupes se posaient de plus en plus bas, 362, 421, 478, 535, 588. La correction précédente, celle qui remontait la mire pour placer les arrêts, avait rendu le foyer juste sans rien régler de la position à l'écran, et je ne l'avais pas vu parce que je vérifiais le foyer, pas l'axe.

La glissade est retirée. À sa place, la page se donne la course qu'il lui faut : une rallonge en pied du corps, calculée au strict nécessaire, cent huit pixels sur un écran de 900 et cent quatre-vingt-quinze sur un de 1032. La mire redevient une simple addition, la position de défilement plus la part d'écran qui la surplombe, et son chemin inverse une simple soustraction. Tout le calcul de droite affine disparaît avec, ainsi que l'arrêt de pied de page : la rallonge fait tomber l'arrêt du dernier groupe pile sur la fin de la course, signature visible.

Vérifié à 1440 par 900 : titres de 300 à 301 pixels, cartes de 344 à 345, à tous les arrêts, tous les groupes au foyer à 1,000. À 1440 par 1032 : titres 345 à 346, cartes 389 à 390, signature entièrement visible au dernier arrêt. Le pixel d'écart est l'arrondi.

Leçon, et elle vaut d'être écrite : vérifier que le bon groupe s'allume ne dit rien de l'endroit où il s'allume. Deux mesures, pas une.

## 2026-08-30, les titres de rayon montent en entête

"Ici je ne devrais pas voir Ressources apparaître." La capture est sans ambiguïté : le foyer est sur Utilitaires, tout l'écran est estompé et flou, et le titre "Ressources sites de référence" trône en pleine encre au milieu des fantômes. La cause est simple, et c'est une pièce oubliée : les titres de rayon ne sont pas des unités du magnétisme, ils n'ont donc jamais reçu d'intensité et ne se sont jamais estompés. Rien ne justifiait qu'un titre de rayon échappe au foyer.

La demande suivante donne la solution plutôt qu'un pansement : que ces titres se lisent en entête, avec une animation de déplacement au passage de l'un à l'autre. Ils quittent donc le fil de la page pour une ligne fixe sous la pilule d'ancrage, capitales espacées comme un titre de groupe, un cran plus haut. Le changement est un glissement : le sortant part dans le sens où l'on défile, l'entrant arrive du bord opposé, deux cent vingt millisecondes chacun. Le sens vient de la comparaison avec la position du passage précédent, et le nom retenu en dataset fait foi, de sorte que deux passages coup sur coup se règlent sur le dernier et non sur celui du milieu.

Les titres restent dans le document pour sa structure, simplement retirés à l'oeil, et reprennent leur place dès que le magnétisme se retire : pendant une recherche, où les résultats ont besoin de leurs deux en-têtes, et sur un poste qui demande moins d'animations, où l'entête ne s'affiche pas.

Vérifié aux dix-huit arrêts : l'entête dit "Nos outils" sur les treize groupes de métiers et bascule sur "Ressources" au premier groupe de ressources, le titre en page mesure un pixel sur un, l'entête est centré sur l'axe de la page à soixante pixels du haut. Leçon de test rappelée au passage : le volet d'aperçu masqué gèle les transitions CSS, une opacité lue à mi-course y vaut zéro ; il faut couper la transition pour lire l'état visé.

## 2026-08-30, les arrêts remontent la mire, et l'entrée prend l'écran

"Ça marche mais ça bug sur la fin avec les ressources." Mesuré avant de toucher quoi que ce soit, et le chiffre est sans appel : à l'arrêt qui devait poser Réglementation au foyer, Données et bases suivait à 0,830, deux groupes lisibles à la fois ; à l'arrêt suivant, Données tombait à 0,268 et c'est Documentation technique qui prenait le foyer. Autrement dit, un groupe de ressources n'avait plus d'arrêt à lui, jamais seul en pleine encre.

La cause était dans ma propre couture. La mire glisse en fin de page pour aller chercher le dernier groupe, mais les arrêts se calculaient en soustrayant bêtement une demi-hauteur d'écran au centre du groupe, sans tenir compte de cette glissade. Sur le dernier écran de défilement, là où vivent justement les trois groupes de ressources, les deux calculs divergeaient de cent soixante-sept pixels.

**La mire est une droite de la position de défilement**, `y + V` dans la course normale et `y * k + b` dans la glissade, et il suffisait de le dire une fois. Les deux coefficients sont retenus à la mesure, la mire les lit, et une fonction fait le chemin inverse : de la mire vers la position de défilement. Les arrêts de la molette et la cible d'un clic au sommaire passent tous les deux par elle. Vérifié à 1440 par 900 : les dix-huit arrêts posent chacun leur groupe à 1,000 avec le voisin à 0,085, les seize groupes ont chacun le leur, et le clic sur Données et bases vise 3785, qui est un arrêt au pixel près.

**Et l'entrée occupe maintenant l'écran entier**, demande de la même session : ne plus voir le titre "Nos outils" en haut de page, et avoir l'emblème, le titre et la recherche bien centrés. Elle se tient en son milieu, mesuré à 449 pixels pour un écran de 900, et le titre de rayon est passé à 944, sous la ligne de flottaison. Le haut de page devient ainsi un écran comme les autres du carrousel. À partir de 1240 px seulement : en dessous, les tuiles vivantes reprennent leur place sous la recherche et appartiennent à ce premier écran, qu'un en-tête pleine hauteur pousserait dehors.

## 2026-08-30, scroll-snap retiré, la molette passe à la main

"Ça ne va pas du tout, je n'arrive pas à jauger la molette. Des fois ça reste bloqué, des fois je saute cinq métiers d'un coup."

Le diagnostic est dans la mécanique de `scroll-snap` et il est sans appel. Le seuil d'un point d'accroche est à mi-chemin du suivant : un petit cran de molette se fait donc ramener en arrière, et on se croit bloqué. Un coup un peu vif, lui, part avec son inertie, s'arrête loin, et le navigateur l'accroche au point le plus proche de là où il s'est arrêté, cinq métiers plus bas. Les deux symptômes viennent de la même règle, et ni `proximity` ni `mandatory` n'en sortent : aucun des deux ne sait avancer d'un cran et d'un seul. Un défilement qu'on n'arrive pas à jauger est pire que pas de cran du tout. Retiré.

**hub.js tient la molette.** La page ne défile plus librement à la molette : elle va d'arrêt en arrêt, un par groupe, plus le haut de page et le pied. Tant que la molette n'a pas accumulé 180 pixels dans le même sens, rien ne bouge d'un pixel, et c'est la résistance qui se sent ; le seuil franchi, la page glisse d'un cran et ignore la molette pendant les 420 ms du glissement, sans quoi la fin d'un geste un peu long enchaînerait les crans. Changer de sens repart de zéro : on ne franchit pas un cran par accumulation de va-et-vient. Le zoom du navigateur (Ctrl + molette) et un panneau ouvert, qui a son propre moteur, passent à travers sans être touchés. Le clavier n'est pas repris : il reste le défilement libre, la sortie de secours, et le magnétisme le suit sans broncher.

Vérifié par événements de molette synthétiques, cent pixels par cran : molette 1, rien ; molette 2, un arrêt ; molette 3, rien ; molette 4, un arrêt et le foyer avance d'exactement un métier. Symétrique en remontant. Jamais deux arrêts d'un coup, jamais de retour en arrière. Le glissement doux ne s'exécute pas dans le volet d'aperçu, qui ne sait pas faire de `behavior: "smooth"` : la mécanique a été vérifiée en forçant le saut sec, ce qui ne change que l'animation.

**Et le foyer devient exclusif**, seconde demande de la même phrase : ne plus voir du tout, ou de très loin, les métiers voisins. Le fond descend de 0,20 à 0,06 d'opacité, le flou monte de 2 à 5 pixels, l'échelle au loin de 0,93 à 0,88, et la cloche se resserre encore, écart type de 0,62 à 0,45 groupe. Le métier voisin tombe à 0,085 d'intensité, soit 14 % d'opacité sous 4,6 pixels de flou ; le suivant a disparu. On ne lit qu'un métier à la fois. Vérifié à l'oeil : le groupe au foyer est net et seul lisible, ses voisins sont des fantômes.

## 2026-08-30, le dernier groupe sortait du champ, et le déroulé prend des crans

Deux retours d'affilée, et le second est le plus intéressant des deux.

**"Je ne peux pas descendre plus bas, la dernière ligne reste floue."** Diagnostic net : la ligne de mire est posée à mi-hauteur d'écran, et en fin de page le défilement bute avant de l'avoir amenée sur le dernier groupe. Elle plafonne environ deux cents pixels au-dessus de son centre, l'avant-dernier groupe garde donc le foyer et le dernier reste estompé quoi qu'on fasse, sans plus rien à dérouler pour aller le chercher. Je croyais ce cas couvert par la normalisation au maximum, notée telle quelle dans le commentaire du module : elle garantit qu'un groupe est net, pas que celui-là puisse l'être. L'erreur valait d'être payée, le commentaire dit maintenant la nuance.

Le remède est une mire qui glisse : sur le dernier écran de défilement, elle descend d'autant plus qu'il reste peu à dérouler, jusqu'à couvrir le bas du dernier groupe quand la page est au bout. Le glissement se répartit sur un écran entier, ou sur toute la course si elle est plus courte, si bien qu'en haut de page il ne joue pas. La fin de la course est retenue à la mesure plutôt que relue à chaque trame, comme les centres. Vérifié en bas de page : dernier groupe à 1,000, opacité pleine, aucun flou.

**"J'aimerais qu'il y ait des accroches, des crans."** Plusieurs crans de molette qui restent sur un métier, puis on passe au suivant, avec un côté aimanté qu'il faut forcer. C'est du `scroll-snap` natif, et il n'y avait aucune raison d'écrire un moteur de molette pour ça : un point d'accroche au centre de chaque groupe, `proximity` et non `mandatory`. La nuance fait tout. En `mandatory`, un seul cran saute au métier suivant, ce qui est un carrousel, pas une résistance ; en `proximity`, un cran se fait ramener sur le métier où l'on est et il en faut deux ou trois pour décrocher. C'est cette résistance qui se sent.

Mesuré, le pas d'un groupe valant 236 px : poussée de 40 px, retour à zéro ; 80 px, retour à zéro ; 120 px, on décroche et on atterrit exactement sur le groupe suivant. Le seuil est à mi-chemin, soit deux crans d'une molette ordinaire, trois d'une molette fine.

Deux conséquences réglées avec. **Le haut de page devient un cran lui aussi** (`scroll-snap-align: start` sur l'en-tête), sans quoi le premier tour de molette arracherait le visiteur à l'en-tête pour le coller au premier métier, et la pilule d'ancrage ne pourrait plus y revenir sans être aussitôt reprise. **Et la mire descend de 42 à 50 % de la hauteur d'écran**, parce que `scroll-snap-align: center` pose le centre du groupe au milieu de l'écran : les deux doivent viser le même point, sans quoi la page s'arrêterait à un endroit et le foyer se poserait à un autre. Ce n'est plus un réglage libre, et les deux fichiers se le disent en commentaire.

Vérifié : à la position d'accroche de trois groupes pris au hasard dans la page, le groupe visé est à 1,000 et tient le foyer, l'écart entre la position d'accroche et la cible du clic au sommaire est de zéro pixel, le haut de page reste à zéro avec le premier métier au foyer. Pendant une recherche, `scroll-snap-type` retombe à `none` avec le magnétisme et la page défile librement ; un poste qui demande moins d'animations ne reçoit ni l'un ni l'autre. Console vide.

## 2026-08-30, une seule carte pour les deux rayons, et le contact s'en va

Deux demandes en une : rendre les ressources dans le même style que les métiers, et supprimer la section contact.

**Les ressources passent en cartes.** Elles vivaient en rangées compactes pleine largeur, une forme à elles, héritée du temps où elles étaient un annuaire de liens plutôt qu'un rayon. Rien ne le justifiait : un nom, une phrase, une pastille à la couleur du domaine et un lien qui sort, c'est exactement ce que porte une carte d'outil. `html_ressource` disparaît, `html_outil` devient `html_carte` et sert les deux rayons, la seule différence restante étant l'icône par défaut, le livre pour une ressource et la grille pour un outil, qui de toute façon ne sert que si le catalogue en oublie une. Les six ressources ont toutes un statut en ligne et leur propre icône : elles ressortent cliquables et sans badge, comme avant. Tout le CSS des rangées part avec, `.rangs` et ses sept règles.

**Le contact quitte le portail.** La section, la grille, les fiches, le tableau `CONTACTS` du catalogue et son bloc de documentation, l'entrée du sommaire, le compteur, la ligne du panneau À propos, le contrôle d'annuaire du validateur et ses champs : tout est retiré plutôt que laissé en sommeil, `catalogue.js` étant le seul fichier à faire vivre et une donnée morte s'y verrait. Qui édite le portail se lit dans la signature en pied de page, et la pastille de signalement reste la voie pour écrire. Le seuil d'apparition de la recherche ne compte plus que les portes.

Vérifié : plus une seule `.rang` dans la page, six cartes de ressources, seize groupes au sommaire comme au magnétisme, un seul filet de séparation là où il y en avait deux, compteur à "18 outils · 6 ressources", signature en fin de page, contrôle du catalogue au vert sans sa ligne d'annuaire, console vide et pas de débordement.

## 2026-08-30, le catalogue rejoint l'axe du logo

Capture à l'appui : "peux-tu les centrer au milieu plutôt ?" Le magnétisme, en désignant un métier à la fois, avait rendu visible ce que la page traînait depuis toujours : un métier à une seule carte la collait à gauche, avec les trois quarts de la largeur en vide à sa droite.

La cause était la grille. `repeat(auto-fill, minmax(240px, 1fr))` réserve quatre colonnes quel que soit le nombre de cartes, et les colonnes vides occupent leur place. Premier essai, `auto-fit`, qui replie les colonnes vides : il centre bien la carte solitaire, mais il en coûte une au passage, quatre cartes ne tenant plus sur une rangée. La raison est dans la spécification : le nombre de répétitions se compte sur la fonction de dimensionnement maximale dès qu'elle est définie, donc sur le plafond de 250 px et non sur le minimum de 240, et il n'en rentre plus que trois. Mesuré à l'écran avant de comprendre pourquoi.

**Les cartes passent donc en flexbox**, `flex: 1 1 240px` plafonné à 250 px, `justify-content: center`. Une rangée pleine se partage la largeur exactement comme avant, une rangée courte se centre, et le plafond est ce qui empêche la carte solitaire de s'étirer sur toute la page au lieu de se centrer. C'est lui aussi qui garde la même largeur de carte d'un métier à l'autre. Même traitement pour la fiche de contact, seule de son espèce elle aussi.

**Et les titres suivent**, sans quoi le résultat se lirait comme un défaut : une étiquette à gauche au-dessus d'une carte au milieu. Titres de groupe et titres de rayon se centrent, ce qui donne enfin à la page l'axe unique que la charte annonçait depuis la refonte en portail, "tout est centré sous le logo". La boîte du titre de groupe se resserre déjà sur son texte pour le magnétisme ; elle se centre maintenant par ses marges, et le grossissement du foyer part de son centre au lieu de son bord gauche.

Vérifié à 1440 px : carte solitaire centrée au pixel sur l'axe de la page (590..850, milieu 720), son titre aussi (662..778), les quatre cartes de plomberie sur une seule rangée centrée (238..1202), fiche de contact centrée, titres de rayon centrés, rangées de ressources inchangées sur toute la largeur. À 900 px, trois cartes sur la première rangée et la quatrième centrée dessous. En fenêtre étroite la carte reprend toute la largeur, le plafond n'ayant plus de sens à une colonne. Aucun débordement horizontal de 375 à 1440 px, recherche et magnétisme intacts, console vide.

## 2026-08-30, le foyer, plus fort

"Peux-tu amplifier l'animation." Tous les curseurs montent d'un cran, et il en manquait un.

Le fond passe de 0,34 à 0,20 d'opacité, l'échelle au loin de 0,972 à 0,93, le titre de 9 à 16 % de grossissement, le halo de la pastille de 4 à 6 px. La cloche se resserre, écart type de 0,78 à 0,62 groupe, et l'aimantation se durcit, de 0,62 à 0,78 : le profil passe de 0,44 à 0,27 sur le voisin immédiat, le foyer s'attarde plus longtemps puis bascule plus vite. En fenêtre étroite tout cela reste d'un cran en dessous.

**L'échelle au foyer, elle, ne monte que de 1,028 à 1,040, et c'est un plafond, pas un choix de goût.** La moitié d'un groupe grossi doit tenir dans les 22 px de gouttière du portail, ce qui donne 1,042 au maximum ; au-delà, la page déborde à droite dès que la fenêtre fait juste la largeur du gabarit. Le contraste de taille se gagne donc de l'autre côté, sur ce qui s'éloigne, où rien n'interdit de rapetisser. Vérifié à 1124 px, la largeur la plus serrée : groupe au foyer de 23 à 1101, rien ne dépasse.

**Le flou manquait.** C'est lui qui dit vraiment l'arrière-plan, et l'utilisateur avait employé le mot dès la première demande, "comme fondu". Deux pixels au plus, un seul en fenêtre étroite. Il ne se pose pas en calcul continu mais par une classe posée par hub.js, et le groupe au foyer n'en porte aucun : un filtre, même `blur(0)`, isole ce qu'il y a derrière l'élément, et les cartes du groupe regardé y perdraient le verre de leur `backdrop-filter`. Hors foyer l'isolation ne se voit pas, l'opacité ayant déjà tout mangé. Effet de bord favorable : un groupe flouté rend son `backdrop-filter` inopérant, donc gratuit.

Vérifié à l'oeil dans les deux thèmes, profil 0,006 / 0,272 / 1,000 / 0,272 / 0,006 : le groupe au foyer est net et seul net, ses voisins sont flous et à moitié effacés, le reste a disparu. Pas de débordement de 375 à 1280 px, seize groupes sur dix-sept portent la classe de flou et le dix-septième est bien celui du foyer, console vide.

Le coût processeur graphique du flou n'a pas pu être mesuré : le volet d'aperçu gèle requestAnimationFrame dès qu'il se cache, et une boucle de mesure sur les trames n'y aboutit pas. C'est le seul poste qui coûte quelque chose, et `--aimant-flou: 0` l'éteint sans rien casser.

## 2026-08-30, le déroulé a un foyer

Demande de l'utilisateur : "une sorte de magnétisme grossissant au fur et à mesure qu'on descend la page", avec son exemple, cliquer Ventilation et voir Ventilation en plus gros, le reste grisonnant, comme fondu.

C'est la vague du sommaire, couchée. Rien de nouveau n'a été inventé : la même cloche de Gauss, le même grossissement par transform, la même variable posée par hub.js et traduite par hub.css. La leçon de la ruche s'applique donc telle quelle, et c'est ce qui a décidé de la forme.

**Le foyer se calcule en indice, pas en pixels.** Une ligne de mire à 42 % de la hauteur de l'écran est projetée sur la suite des centres de groupes, ce qui donne une position continue entre deux indices ; la distance passe dans la cloche d'écart type 0,78 groupe et chaque groupe reçoit son intensité en `--f`. En pixels, la vague aurait été large sur un métier à six cartes et sèche sur un métier à une carte. Deux détails font le magnétisme plutôt qu'un dégradé : la part fractionnaire est tirée vers l'entier le plus proche par une sinusoïde, le foyer s'attarde sur un groupe puis bascule vite ; et les intensités sont ramenées à leur maximum, ce qui garantit toujours exactement un groupe à pleine encre, en haut de page où la mire tombe encore dans l'en-tête comme en bas où le défilement bute avant d'avoir centré le dernier. Cette normalisation a un second effet, voulu : le groupe au foyer est à opacité exactement 1, donc sans contexte d'isolation, donc ses cartes gardent leur verre.

**Le clic du sommaire pose le groupe au foyer**, il ne le pose plus à 76 px du haut. Un groupe assez haut pour couvrir la mire garde son titre en haut de l'écran, un groupe court se centre sur la mire, sinon c'est son voisin qui prendrait le foyer. Et le repère du sommaire suit désormais ce foyer au lieu de se calculer une deuxième fois au tiers haut de l'écran : les deux se contredisaient au bord d'un groupe.

Mesures prises en offsetTop, jamais en getBoundingClientRect : un rectangle rendu est déjà grossi par la vague, la mesure aurait nourri sa propre déformation. Un `ResizeObserver` sur le portail remesure quand la tuile météo arrive ou qu'une recherche vide des groupes. Seuls les groupes dont l'intensité change sont réécrits, les autres ne coûtent rien.

Vérifié : profil 0,037 / 0,440 / 1,000 / 0,440 / 0,037 autour du groupe visé, à l'oeil dans les deux thèmes, titre visiblement plus gros et halo sur la pastille au foyer, cartes voisines fondues. Clic sur Ventilation, groupe centré au pixel sur la mire (haut 193, bas 410, mire 302), foyer et repère du sommaire sur Ventilation. Recherche en cours : classe retirée, opacité 1 et transform none partout. Contrôle du catalogue et syntaxe au vert.

Un débordement horizontal a été trouvé et corrigé au passage : le titre de groupe est un `flex` pleine largeur, et le grossir depuis son bord gauche le poussait de six pixels hors de la page en fenêtre étroite. La boîte se resserre maintenant sur son texte.

Leçon de test, encore une : le volet d'aperçu se détache après chaque `location.reload()`, `innerWidth` retombe à zéro et les captures virent au noir ; il faut le rouvrir. Et le défilement natif ne répond ni à la molette synthétique ni au `behavior: "smooth"`. La vérification à l'oeil s'est donc faite à défilement zéro, en masquant l'en-tête pour faire monter le catalogue et en figeant les intensités le temps de la capture, le `ResizeObserver` repeignant sinon aussitôt.

## 2026-08-30, chaque métier a sa carte, prête-nom compris

L'utilisateur veut un placeholder sur chaque métier, même sans app prévue. Cinq métiers étaient vides : VRD, électricité, paysage, structure, BIM.

Chacun reçoit donc une carte "bientôt" portant un PRÊTE-NOM, un outil plausible du métier inventé pour tenir la place et signalé comme tel en commentaire du catalogue : Rétention et débit de fuite (VRD), Bilan de puissance (électricité), Coefficient de biotope (paysage), Prédimensionnement structure, Contrôle de maquette (BIM). Rien n'oblige à les développer : ils se remplacent par les vrais projets quand ils naissent.

Conséquence : les quatorze groupes s'ouvrent dans la page, les dix-sept bulles du sommaire sont toutes cliquables, plus aucune en pointillé, et le compteur annonce dix-huit outils dont huit seulement en ligne. L'état pointillé du sommaire reste dans le code pour un métier futur déclaré sans carte. Vérifié : le groupe Paysage existe avec sa carte estompée badgée Bientôt, le contrôle du catalogue passe à vingt-quatre portes.

## 2026-08-30, la goutte gonfle pour de vrai

"Ce n'est pas suffisant, tu n'as pas respecté ce que je t'ai dit." Il avait raison, et la capture en gros plan l'a montré : sur sa maquette le rail lui-même se renfle largement autour de la bulle visée, avec des cols concaves marqués ; chez moi la bosse de 38 pixels dépassait d'à peine deux pixels un rail de 34, le rail restait droit et l'étiquette ne faisait que le toucher. L'effet était programmé mais invisible, et une vérification au chiffre ne remplace pas une vérification à l'oeil.

La bosse passe à 56 pixels et déborde de onze le flanc gauche du rail : le renflement se voit. L'étiquette chevauche la bosse de quinze pixels, ce qui fabrique le col organique. Le flou du filtre monte à 7,5 et son contraste suit, pour des cols plus ronds. Et l'ensemble devient élastique : la position de la bosse et de l'étiquette transitionne le long du rail, le bloc suit la souris avec un temps de retard au lieu de se téléporter, et tous les grossissements passent par une courbe à rebond qui dépasse légèrement la cible avant de s'y poser.

Vérifié en capture agrandie, dans les deux thèmes : le rail se gonfle, le nom sort du rail, les cols sont là. Méthode de vérification retenue pour la suite : grossir le volet par transform le temps d'une capture, en posant l'état AVANT d'appliquer le grossissement, les rectangles mesurés après coup étant faussés par l'échelle.

## 2026-08-30, le rail devient une goutte

L'utilisateur envoie une maquette : l'étiquette ne doit pas flotter à côté du rail, elle doit en sortir, le rail se déformant autour de la bulle visée. Et les bulles doivent grossir davantage.

Le fond du sommaire n'est plus une boîte mais une goutte : trois formes de la même couleur pleine, la pilule du rail, une bosse qui suit la bulle visée et l'étiquette du nom, fondues en une seule silhouette par un filtre SVG, flou de six puis contraste d'alpha. Deux formes assez proches fusionnent, et l'étiquette semble sortir du rail avec un col organique, comme sur la maquette. L'ombre est un drop-shadow posé après le filtre : elle épouse la silhouette fusionnée, pas les trois boîtes. Le fondu d'alpha ne pardonnant pas la translucidité, la goutte a sa couleur pleine à elle, un cran plus clair que la carte en thème sombre où le rail se confondait avec la page.

Le grossissement passe de 1,95 à 2,4 au pic, l'écart type resserré d'un tiers pour que la vague reste locale. Vérifié au chiffre : 2,40 sur la bulle visée, 1,78 sur sa voisine, 1,00 au loin, badge au bon nom sur un métier plein comme sur un vide. Les noms au repos disparaissent à toutes les largeurs, le badge de la goutte les remplace ; la bulle simple survit pour le clavier et pour prefers-reduced-motion, qui coupe vague et goutte.

Leçon de test, encore : le panneau d'aperçu masqué gèle aussi les transitions CSS, pas seulement requestAnimationFrame. Une mesure à mi-course n'est pas un bug de la page.

## 2026-08-30, le sommaire prend la vague, et la feuille de route entre au catalogue

Deux demandes de l'utilisateur sur le sommaire fraîchement posé.

**La vague magnétique.** Le sommaire devient une colonne de bulles rondes, sans nom visible au repos. À l'approche du curseur, chaque bulle grossit selon sa distance verticale, en cloche de Gauss d'écart type une bulle et demie : la plus proche double presque (1,95), ses voisines suivent en s'amortissant, et la colonne ne bouge pas puisque tout passe par un transform. La bulle visée déplie son nom dans une bulle-étiquette à sa gauche, "· bientôt" pour un métier vide : on lit ce qu'on va cliquer avant de cliquer. `prefers-reduced-motion` coupe la vague, le nom restant au survol simple. Vérifié au chiffre : profil 1,01 / 1,07 / 1,29 / 1,71 / 1,95 / 1,71 / 1,29 / 1,07 / 1,01 autour de la bulle visée, étiquette juste sur un métier plein comme sur un vide, remise à plat à la sortie.

Leçon de test au passage : le panneau d'aperçu masqué suspend requestAnimationFrame, et la vague ne peut donc pas être testée par événements synthétiques sans shunter temporairement rAF. Ce n'est pas un bug de la page, un onglet réel visible reçoit ses trames.

**Les sept outils de la feuille de route entrent au catalogue** en statut a-venir, cartes estompées "bientôt" : RefriSelect, Calculette résistance thermique, Calculette confort d'été, Désenfumage, Arbitrage carbone ACV, RTex Tool, Livre d'or REX. C'est l'interprétation retenue de "remets tous les placeholders" : la liste vivait dans la prochaine étape de la fiche, elle vit désormais dans le portail. Publier un outil n'est plus qu'une url et un statut à changer. Les pitchs et catégories de RefriSelect (climatisation), RTex Tool (thermique, lu comme RT existant) et du Livre d'or REX (utilitaires) sont déduits du nom et signalés à vérifier, en commentaire du catalogue comme dans la fiche.

Le portail compte dix-neuf portes, huit ouvertes, et neuf métiers sur quatorze ont au moins une carte. Restent vides et en pointillé au sommaire : VRD, électricité, paysage, structure, BIM.

## 2026-08-30, la page assume de se dérouler : la ruche cède la place au sommaire

Aucune des pistes ne convenait plus, et c'est l'utilisateur qui a mis le doigt sur la contradiction de fond : "l'application est faite pour se dérouler, et on essaie de réduire au maximum, c'est un peu bête". Il a conclu lui-même : revenir aux cartes, qui étaient très bien, et poser un sommaire, à droite.

La ruche est donc retirée du code, et la piste des icônes d'application abandonnée avec elle. Les rayons reviennent aux groupes de cartes par métier, titre en capitales et pastille à la couleur du lot, qui se déroulent à plat comme avant.

**Le sommaire, fixé à droite de l'écran.** Tous les métiers de la maison s'y lisent : les trois pourvus mènent d'un clic à leur groupe, les dix vides restent estompés avec une pastille en pointillé, l'idée des métiers visibles avant leurs outils survit donc à la ruche. Suivent les domaines de ressources et le contact, séparés par un filet. Le repère suit le défilement, le tiers haut de l'écran décidant du groupe courant. Le clic défile sans toucher à l'adresse, le portail restant sans fragment. Sur écran moyen les noms se replient en pastilles de couleur seules ; sous 1240 px le sommaire disparaît ; pendant une recherche il s'efface, ses repères pointeraient des groupes à moitié vidés.

La charte gagne la leçon payée par la ruche : une forme étrangère à la page dénature la charte quelle que soit son exécution, toute nouveauté doit se construire avec le vocabulaire déjà présent.

Vérifié à 1600 px de large : dix-sept lignes au sommaire dont dix estompées, clic qui descend au groupe et repère qui suit, recherche qui efface puis rend le sommaire, noms repliés en pastilles à 1300 px, sommaire absent à 1100 px, contrôle du catalogue et syntaxe au vert.

## 2026-08-30, la piste des icônes d'application

Les cinq présentations précédentes sont écartées d'un bloc, et l'utilisateur arrive avec son idée : de grandes icônes carrées à coins arrondis, la couleur du lot et le glyphe au centre, rien d'autre. Alignées les unes aux autres, elles réagissent au survol en grossissant un peu ; au clic on plonge dedans et les outils apparaissent sous la même forme d'icônes d'application. Aucun compteur, et les métiers vides en pointillé.

La page d'essais est refaite sur cette famille. Son idée d'abord, telle quelle, avec la plongée réellement implémentée : l'origine de l'agrandissement est calculée sur l'icône cliquée, sans quoi on plongerait dans le centre de la grille et non dans elle. Les trois métiers pourvus ouvrent sur leurs vrais outils, où le pointillé sert une seconde fois pour marquer ce qui est à venir.

Six variantes proposées à côté, toutes dans la même famille pour ne pas relancer le débat de forme : grille en colonnes strictes plutôt qu'en rangées centrées, plaques en dégradé pour la profondeur des vraies icônes d'application, aplat doux, verre et couleur avec les noms complets, une seule rangée de treize, et un dock à magnification des voisines.

Deux arbitrages restent à poser et n'ont pas été tranchés seul : une icône d'application n'a pas de place pour le pitch, cette phrase qui dit ce que fait chaque outil et que porte aujourd'hui chaque carte ; et le rayon des ressources, dont les six sites ont aussi leur pitch, doit décider s'il suit la même forme.

## 2026-08-30, le nid d'abeille dénature la charte : cinq présentations à comparer

L'utilisateur, honnêtement : depuis le nid d'abeille, la charte B27 est dénaturée. Il a raison, et le défaut se nomme précisément. **L'hexagone est la seule forme non rectangulaire de toute la page.** Cartes, tuiles vivantes, panneaux, pilule d'ancrage, champ de recherche, badges : tout le reste est un rectangle arrondi à 14 ou 20 pixels, ou un cercle. Le nid d'abeille a introduit un vocabulaire de forme qui n'existe nulle part ailleurs, et c'est ce décalage qui s'entend, pas la couleur ni la densité.

Une page de comparaison a donc été produite plutôt qu'un avis : cinq présentations du même sélecteur, avec les treize vrais métiers, leurs vraies couleurs de lot, leurs vraies icônes et le vrai nombre d'outils, extraits des fichiers du portail par script pour que rien ne soit recopié à la main. Les deux thèmes basculent, et cliquer une entrée montre l'état choisi et l'aperçu de ce qui se déplierait dessous.

Les cinq : le nid d'abeille actuel pour comparer, des tuiles reprenant le vocabulaire des cartes, des pastilles filtrantes, un index de lots à la manière d'une légende de plan, et un bandeau de lots en bande continue. La page vit dans le bac à sable de la session, pas dans le dépôt : c'est un outil de décision, pas un livrable.

Décision en attente. Rien du portail n'a été touché, hormis l'icône du chauffage.

**Le chauffage se dit désormais par la flamme**, tracé Lucide fourni par l'utilisateur : c'est la production de chaleur, pas l'émetteur, et le radiateur reste disponible pour les outils d'émission.

## 2026-08-30, la climatisation se sépare du chauffage, et le pavage révèle un défaut de parité

Trois demandes de l'utilisateur, dont la première a fait apparaître un bug que rien ne montrait jusque-là.

**La climatisation devient un métier à part.** La catégorie `cvc` couvrait chauffage et climatisation sous le seul nom de "Chauffage" : elle est scindée. Sa clé devient `chauffage`, ce qui valait mieux que de garder `cvc` pour un métier qui n'en couvre plus que le tiers, et le seul outil qui s'y rangeait a suivi. La famille CVC de B27 n'a qu'un bleu pour trois métiers : le bleu du lot, #3e8fb8, reste au chauffage, le cyan #2f7f92 va à l'air en mouvement, et un bleu froid #4a6fb0 rejoint la production de froid. Trois teintes d'une même famille, distinctes au premier coup d'oeil. L'écart est signalé en commentaire au même titre que les autres.

**La sécurité prend son nom de lot, SSI**, dans l'alvéole ; le nom complet reste "Sécurité incendie" pour les résultats de recherche, où l'abréviation seule serait sèche.

**Deux icônes fournies par l'utilisateur** rejoignent le registre : le tracé Lucide "waypoints" pour le VRD, des points reliés en étoile, ce que dessine un plan de réseaux enterrés bien mieux qu'une goutte de pluie ; et le vrai flocon Lucide à six branches ramifiées, qui remplace l'ancienne étoile à flèches et sert à la fois à la climatisation et à la neige de la météo.

**Le défaut de parité du pavage.** Au treizième métier, les rangées sont tombées à sept et six, et Climatisation chevauchait Électricité. La cause : une rangée incomplète était décalée d'un nombre entier de colonnes, ce qui semblait suffire, mais une colonne sur deux est haute et l'autre basse. Un décalage impair fait tomber une alvéole haute là où la grille en attend une basse. La rangée inverse désormais son propre zigzag quand son décalage est impair, ce qui remet chacune à sa place sans rien déplacer. Le défaut dormait depuis la mise en place du pavage : douze métiers tombaient à six et six, décalage nul, il ne pouvait pas se voir.

Vérifié : sept plus six collées sur grand écran, quatre rangées de trois et une seule alvéole en contretemps en 375 px, sans débordement ni chevauchement, coordonnées relevées sur la page.

## 2026-08-30, une carte en attente ne s'annonce plus disponible

L'utilisateur voit les placeholders arriver à pleine opacité pendant une seconde, comme s'ils étaient disponibles, avant de retomber en grisé.

La cause est une règle de cascade et non un réglage : une animation l'emporte sur une déclaration normale. L'entrée des cartes, `lever`, se terminait sur `opacity:1`, ce qui écrasait le `.62` de `.attente` pendant toute sa durée, délai d'échelonnement compris, soit jusqu'à sept cents millisecondes. La carte montait donc jusqu'à l'opacité d'un outil publié avant de redescendre d'un coup, exactement au moment où l'oeil se pose dessus.

L'entrée monte désormais jusqu'à l'opacité de repos de l'élément et non jusqu'à 1 : elle se termine sur `var(--opacite,1)`, et ce qui a un repos autre que 1 le déclare. Une seule carte à corriger aujourd'hui, mais la règle vaut pour toutes celles qui viendront.

Mesuré sur la page, vingt relevés à cinquante millisecondes d'intervalle : une carte en attente ne dépasse jamais 0,62 du début à la fin, une carte publiée atteint bien 1, et les rangées de ressources comme la fiche de contact sont inchangées.

## 2026-08-29, douze métiers, un hexagone adouci, un pavage sans jointure

Trois demandes dans le même échange, et la deuxième était une bonne question de l'utilisateur sur mon propre travail.

**Tous les métiers de B27, même vides.** Un champ `metier` sur les catégories décide de ce qui se montre sans rien contenir : l'alvéole reste, en trait pointillé, marquée "bientôt", bouton inerte que le navigateur refuse de lui-même. Douze métiers désormais, dont trois nouveaux relevés dans la liste des lots B27 que portait déjà le catalogue : paysage, structure, BIM. Leurs trois couleurs sont des approximations signalées comme telles en commentaire, seule leur famille étant notée, vert, gris et violet ; les valeurs exactes de `b27-site/src/styles/tokens.css` les remplaceront. Le carbone cède la feuille au paysage et prend le nuage, deux verts voisins ne devant pas porter le même glyphe.

**"Ça fait un peu geek, non ?"** Il avait raison, et c'est son propre brief qui le dit : moderne et sérieux, sans faire geek. Trois tics trahissaient, tous corrigés. Les pointes vives de l'hexagone, adoucies : chaque sommet est coupé à onze pixels et refermé par une quadratique dont le sommet est le point de contrôle, le tracé reste un hexagone mais ne pique plus. L'aplat saturé, descendu de quinze à dix pour cent au repos. Et le compteur en petites capitales espacées, passé en bas de casse. La forme reste, le clin d'oeil s'en va. L'aplat translucide et le `backdrop-filter` ont disparu au passage : la forme entière, remplissage compris, est maintenant dessinée en SVG, seule façon d'arrondir un angle que le `clip-path` en polygone laisse vif.

**"Pourquoi ne pas coller les nids d'abeille entre eux ?"** Parce que le repli automatique du navigateur centre chaque rangée pour elle-même : deux rangées de longueurs différentes tombaient décalées d'une demi-colonne et le pavage se défaisait. Mesuré sur la page, l'écart était de 92,5 pixels là où il aurait fallu un multiple de 111. Les rangées sont donc découpées à la main, équilibrées pour ne pas laisser une alvéole seule sous une rangée pleine, une rangée incomplète décalée d'un nombre entier de colonnes, et le tout recalculé au redimensionnement. Le pavage tient désormais à une seule mesure, `--alv`, dont la hauteur, le chevauchement et la descente découlent par la géométrie de l'hexagone régulier.

Vérifié : douze alvéoles en deux rangées de six collées sur grand écran, quatre rangées de trois en 375 px, sans débordement ; la plongée survit à la recherche et au redimensionnement ; les neuf alvéoles vides sont bien inertes ; rendu contrôlé dans les deux thèmes.

## 2026-08-29, la ruche : on ne déroule plus, on plonge

"On perd en visibilité avec tout ça." L'utilisateur voyait la page s'allonger à mesure que les groupes s'empilaient, et il a décrit ce qu'il voulait à la place : un sélecteur de thèmes en bulles ou en formes géométriques, avec une vue plongeante donnant accès à ce qu'il y a dessous.

Trois questions posées avant de toucher à la mise en page, parce que trois lectures différentes menaient à trois travaux différents. Ses réponses : hexagones en nid d'abeille, rien d'affiché avant d'avoir plongé, et un sélecteur propre à chaque rayon. La deuxième option lui a été signalée comme celle qui rapproche le plus le portail des dossiers rejetés en v7 ; il l'a choisie en connaissance de cause.

**La ruche.** Chaque rayon s'ouvre sur des alvéoles hexagonales translucides, une par métier pour les outils, une par domaine pour les ressources. Cliquer allume l'alvéole, met les autres en retrait et fait monter son contenu dessous ; un second clic referme. Une seule ouverte à la fois par ruche, les deux ruches indépendantes. La translucidité est la vue plongeante : le champ d'écoulement passe derrière, à peine voilé.

**Ce qui empêche le retour aux dossiers.** La ruche est un sélecteur, pas un niveau de navigation : même page, pas d'adresse à fragment, pas de fil d'Ariane. Les compteurs du bandeau annoncent dès l'arrivée ce que contient le portail. Et surtout, la recherche court-circuite tout : dès qu'on tape, les ruches s'effacent, tous les panneaux s'ouvrent et les résultats sortent à plat avec leur titre de groupe. Le champ vidé, la plongée où l'on était revient exactement comme on l'avait laissée.

**La géométrie n'est pas réglée au jugé.** Chevauchement d'un quart de largeur, une alvéole sur deux descendue d'une demi-hauteur : les deux nombres viennent de l'hexagone et font coïncider l'arête bas-droite d'une alvéole avec l'arête haut-gauche de la suivante, au pixel près. La découpe interdit bordure, ombre portée et contour de mise au point : le trait est un SVG posé dedans, l'ombre un drop-shadow, et la mise au point épaissit le trait.

Un champ `court` rejoint les catégories, le nom complet ne tenant pas dans un hexagone. La glose grisée du titre de rayon, seule légende autorisée par la charte, porte l'invitation tant que rien n'est ouvert.

Vérifié : ouverture, fermeture par second clic, indépendance des deux ruches, bascule en recherche et retour à l'état précédent, `aria-expanded` suivi, rendu dans les deux thèmes, et en 375 px où trois alvéoles tiennent encore de front sans débordement. Le retrait a dû être remonté en thème clair, où le fond presque blanc rendait les alvéoles éteintes illisibles.

Sur papier, la ruche disparaît et tous les panneaux sortent : il n'y a rien à déplier sur une feuille.

## 2026-08-29, les outils se rangent par métier

Quatre placeholders demandés par l'utilisateur, tous au statut `a-venir` donc estompés et non cliquables : dimensionnement de l'eau froide sanitaire, des eaux usées et eaux vannes, des eaux pluviales, et des gaines de ventilation.

Et le rayon "Nos outils" se lit maintenant par métier, comme le voulait l'utilisateur. Le groupement se fait sur la catégorie, qui est déjà le lot B27 avec sa couleur : rien de nouveau à saisir dans le catalogue, et un métier sans outil reste invisible, ce qui permet de déclarer d'avance ceux qui viendront. Le composant de groupe est désormais partagé par les deux rayons, et son titre porte une pastille à la couleur du lot : la couleur remonte du contenu jusqu'au titre.

Deux métiers de plus sont déclarés, vides pour l'instant : VRD et assainissement, Utilitaires. Leurs deux teintes sont inventées ici faute d'équivalent dans les lots B27, et le commentaire du catalogue le dit noir sur blanc pour que la vraie couleur maison, si elle existe, vienne les remplacer. Les deux passent le contrôle des 3:1 sur les trois fronts.

Une icône d'ondes rejoint le registre pour les évacuations, les gouttes étant déjà prises par l'eau sous pression.

Vérifié : la recherche traverse correctement les nouveaux groupes (un groupe vidé disparaît, un rayon vidé aussi, le message d'absence revient), rendu contrôlé en 375 px et en pleine largeur.

Reste ouvert : le compteur annonce "6 outils" alors que quatre ne sont pas encore publiés. Le distinguer, ou non, est un choix à faire.

## 2026-08-29, le site de l'entreprise n'est pas un de nos outils

Deux corrections de fond sur le catalogue, demandées par l'utilisateur. Le Site B27 était rangé dans "Nos outils, fabriqués ici" : il en prenait la carte, la couleur de lot et le compteur, et se donnait donc pour un outil du bureau d'études. Et B27 Mobility, la réservation des voitures de société, est un outil interne : le portail est public et se transmet à des clients, il n'y a pas sa place.

B27 Mobility est retiré. Le site de l'entreprise quitte le tableau des portes pour un réglage à lui, `REGLAGES.editeur`, rendu en **signature de pied de page** : un filet en travers de la largeur, le monogramme à gauche sur sa plaque, "le portail est édité par B27", le lien `b27.fr` à droite. Pas de fond de carte, c'est ce qui le distingue au premier regard d'une carte de rayon ; et comme c'est du mobilier de page, au même titre que l'en-tête, il reste hors du filtre de recherche. La catégorie `b27`, vidée de ses deux portes, disparaît de CATEGORIES.

Le compteur dit maintenant ce qu'il prétend dire : deux outils, et ce sont les deux que nous avons écrits. Le contrôle du catalogue vérifie l'url de l'éditeur au même titre que le reste. Vérifié dans les deux thèmes et en 375 px, où le lien passe en pleine largeur sous le texte ; à fond de page, la pastille de signalement ne recouvre pas le lien.

Règle posée dans `docs/charte.md` pour la suite : ce qui est réservé à l'interne n'entre pas dans le portail.

## 2026-08-29, l'ete se voit meme couvert

L'utilisateur, en aout : « je crois que nous sommes en ete et je n'ai pas vu de dore — est-ce bien dans l'app ? » Il etait dans le code, mais son ciel couvert le masquait totalement : les ambiances couvert et orage REMPLACAIENT la palette de saison par des teintes fixes. Ma phrase « la saison teinte tout » promettait plus que le code ne tenait.

Les ambiances melangent desormais au lieu de remplacer : le couvert desature la palette de saison vers le gris (55 %), l'orage la tire vers les verts profonds (50 %). L'ete couvert donne des olives chauds — 135,150,86, pointe 160,161,116 — la ou l'hiver couvert donnera des gris froids — 108,135,114. La saison transparait sous n'importe quel ciel, et le dore d'aout existe enfin ailleurs que sous le soleil.

## 2026-08-29, un seul moteur de molette

L'utilisateur sentait toujours une difference entre la molette sur le panneau et a cote, et a pose la bonne question : pourquoi une difference existe-t-elle, plutot que comment la regler ?

Parce que deux moteurs tournaient. Le navigateur livre la molette a ce qui est sous le curseur : sur le panneau il defilait nativement avec son propre lissage, a cote un moteur maison prenait le relais — la difference etait structurelle, pas un reglage. Et comme un evenement synthetique ne peut pas declencher le defilement natif, l'unification s'est faite dans l'autre sens : panneau ouvert, toute molette est interceptee et passe par la meme inertie, dessus comme a cote. Gestion des deltaMode lignes et pages de Firefox, resynchronisation de la cible quand le corps defile par sa barre ou au clavier, saut direct sous prefers-reduced-motion.

## 2026-08-29, la mort n'existe qu'hors champ

La dissolution en vol de la veille ne convenait pas : c'etait toujours une disparition sous les yeux, juste maquillee. L'utilisateur a tranche — la fin de vie doit se produire hors de l'ecran.

Le compte a rebours de vie disparait donc entierement. Un trait vit tant qu'il est visible ; la derive du vent, toujours superieure a 0,1 pixel par image vers la droite, garantit que chacun finit par sortir du cadre. Sa trainee le suit dehors, et le reensemencement n'a lieu qu'une fois le dernier point sorti. Les flocons gardent leur fondu de naissance mais ne meurent plus en fondu : ils tombent dehors. Le surplus d'un changement d'ambiance est condamne, pas execute : il vole normalement jusqu'a sa sortie naturelle et n'est retire que la.

Verification : douze traits suivis pendant six cents images, zero renaissance visible ; une particule condamnee et teleportee hors champ est retiree a l'image suivante.

L'icone du bouton langues passe au trace Lucide « languages » fourni par l'utilisateur, l'ideogramme et le A, plus parlant que le globe.

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
