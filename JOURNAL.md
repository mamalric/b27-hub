# Journal

<!-- Dernière entrée en haut. Une entrée par session de travail ou par décision. Date au format AAAA-MM-JJ. -->

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
