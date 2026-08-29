# Journal

<!-- Dernière entrée en haut. Une entrée par session de travail ou par décision. Date au format AAAA-MM-JJ. -->

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
