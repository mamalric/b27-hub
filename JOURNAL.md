# Journal

<!-- Dernière entrée en haut. Une entrée par session de travail ou par décision. Date au format AAAA-MM-JJ. -->

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
