# Le bandeau d'accueil

Le hall s'ouvre sur un bandeau pleine largeur portant une photo de chantier tirée au sort, qui change d'une visite à l'autre. Elle est passée en noir et blanc, puis en sépia, puis ramenée au vert de B27.

Ce document dit d'où viennent les photos, comment brancher le fournisseur, et pourquoi le code est écrit comme il l'est.

## En deux mots

Sans clé d'accès, le bandeau garde un dégradé vert et n'émet **aucune requête**. C'est l'état livré, et c'est un état correct : le hub fonctionne à l'identique, hors ligne compris. La photo est un agrément, jamais une dépendance.

Avec une clé, le hub demande à Unsplash un lot de photos, le garde une semaine dans le navigateur, et en tire une au sort à chaque retour au hall.

## Obtenir la clé

C'est gratuit, ça prend deux minutes, et il faut un compte : **cette étape vous revient**, elle ne peut pas être faite à votre place.

1. Créer un compte sur [unsplash.com](https://unsplash.com/join).
2. Aller sur [unsplash.com/oauth/applications](https://unsplash.com/oauth/applications), cliquer **New Application**, accepter les conditions.
3. Nommer l'application, par exemple `Hub Outils B27`.
4. Copier la valeur **Access Key** (et non la Secret Key, qui ne sert pas ici).
5. La coller dans `catalogue.js`, dans `REGLAGES.bandeau.cle`.

C'est tout. Rien d'autre à changer.

### Cette clé peut rester dans le dépôt

Elle est publique par conception. Unsplash distingue l'*Access Key*, qui n'ouvre que des lectures et que la documentation destine explicitement au code d'un site, de la *Secret Key*, qui elle ne doit jamais sortir d'un serveur. Le hub n'utilise que la première. La mettre dans un dépôt public n'est ni un oubli ni un risque : c'est l'usage prévu, et c'est ce qui permet à un site statique sans serveur d'appeler l'API.

Si la clé venait à être révoquée ou le quota épuisé, la seule conséquence serait un bandeau vert.

## Le quota, et pourquoi le lot est mis en cache

Une application en mode démonstration a droit à **cinquante requêtes par heure**, tous visiteurs confondus. C'est le chiffre qui a dicté la forme du code.

Interroger l'API à chaque chargement de page épuiserait ce quota dès le premier midi : une dizaine de collègues qui ouvrent le hub trois ou quatre fois, et le bandeau est vert pour tout le monde jusqu'au soir. C'est exactement le genre de panne qui n'a l'air d'une panne pour personne et que personne ne signale.

Le hub demande donc **douze photos en une seule requête**, les garde une semaine dans le navigateur, et pioche dedans à chaque visite. Cela ramène la consommation à une requête par poste et par semaine, tout en gardant une image différente à chaque retour au hall. Avec cinquante requêtes par heure, il faudrait cinquante nouveaux postes dans la même heure pour saturer.

Les deux réglages sont dans `catalogue.js` : `parLot` (douze, plafonné à trente par l'API) et `joursDeCache` (sept).

## Le crédit est obligatoire

La licence Unsplash exige que le photographe et Unsplash soient nommés, avec un lien vers leur page. Ce n'est pas une politesse. Le hub affiche donc une pastille en bas à droite du bandeau, et **une photo dont le crédit ne peut pas être construit est écartée** : `retenirPhoto()` dans `hub.js` renvoie `null` si le nom de l'auteur ou le lien de son profil manque.

Les liens portent les paramètres `utm_source` et `utm_medium` demandés par les règles d'usage de l'API : c'est ce qui permet au photographe de savoir d'où vient son audience, et c'est la contrepartie de la gratuité.

## Choisir ce qui s'affiche

`REGLAGES.bandeau.recherches` est la liste des requêtes envoyées à Unsplash. Une seule ne suffit pas : Unsplash tire au sort dans les premiers résultats et non dans tout le fonds, si bien qu'une requête unique finit par ramener toujours les mêmes photos. Le hub change de recherche à chaque lot.

Les recherches sont en anglais parce que le fonds est indexé en anglais : `construction site` ramène des chantiers, `chantier` ramène surtout des vignobles.

## Le traitement des couleurs

Noir et blanc, puis sépia, puis vert B27. Tout tient dans une déclaration `filter` sur `.banniere-fond`, dans `hub.css` :

```
grayscale(1) brightness(.74) sepia(1) hue-rotate(38deg) saturate(2.6) brightness(.88)
```

Ces six étapes ne sont pas réglées à l'oeil. Les fonctions `grayscale()`, `sepia()`, `hue-rotate()` et `saturate()` sont des matrices définies au millième près par la spécification Filter Effects : le résultat se calcule. `src/bandeau_teinte.py` balaie les paramètres et retient ceux qui posent la photo sur le vert de marque.

```bash
python src/bandeau_teinte.py
```

Le script imprime la déclaration CSS, la rampe de gris qu'elle produit et le voile que le texte blanc exige. Pour changer la couleur de marque : modifier `VERT_B27` en tête du script, relancer, recopier les deux valeurs dans `hub.css`.

Trois choses méritent d'être connues avant d'y toucher.

**Le premier `brightness(.74)` n'est pas cosmétique.** Les lignes de la matrice sépia somment à 1,35 : `sepia(1)` pousse le canal rouge hors du domaine pour tout gris supérieur à 0,74, et l'écrêtage tord la teinte de toutes les hautes lumières. C'est un défaut du filtre lui-même, présent sur n'importe quelle photo. En comprimant la plage avant, la chaîne reste linéaire de bout en bout.

**La couleur de marque est visée dans les lumières, pas dans les demi-teintes.** `#95C03D` est un vert clair et saturé : le poser au milieu de la plage ne laisse aucune marge au-dessus, et tout ce qui est plus clair part en vert fluo puis en blanc. C'est du reste le principe du duotone — les ombres vont au vert sombre, les lumières à la couleur de marque — et c'est elle que l'oeil retient, parce qu'elle occupe les zones les plus lumineuses de l'image.

**Le résultat a été vérifié contre le navigateur**, et pas seulement calculé : en redessinant la rampe dans un canvas avec la même chaîne, l'écart entre le calcul et ce que produit réellement le moteur de rendu est de deux niveaux sur 255, soit du bruit d'arrondi.

La teinte se tient à 79,4 degrés et la saturation à 52 % du noir au blanc, exactement celles du `#95C03D` du logo. Le gris 0,85 d'une photo ressort en `#94be3c`, à deux niveaux du vert de marque.

## Le voile, et pourquoi il tient son plateau

Le texte blanc du bandeau doit tenir 4,5:1. Une photo peut porter un ciel blanc juste derrière la salutation : le cas défavorable n'est pas rare, il est probable, et le voile se dimensionne sur lui. Au pixel le plus clair que la chaîne puisse produire, `#aedf47`, il faut 51 % d'opacité.

Ces 51 % doivent tenir **partout où il y a du texte**, et pas seulement au bord gauche. Un premier réglage commençait à la bonne opacité mais faiblissait dès le tiers de la largeur : la mesure donnait 3,91:1 sous la fin du chapeau, sous le seuil, pour un défaut parfaitement invisible à l'oeil. Le voile garde donc son plateau jusqu'à la moitié du bandeau, où le texte s'arrête, et ne s'efface qu'ensuite.

Sous 1240 px de fenêtre, le chapeau déborde cette moitié : le voile couvre alors toute la largeur. La photo se voit moins, le texte reste lisible, et c'est dans cet ordre que ça se décide.

Sa couleur est prise sur la rampe de la photo elle-même, au gris 0,15 : voile et image partagent donc exactement la même teinte, et le voile ne se lit pas comme un rectangle rapporté.

## Ce qui se passe quand ça rate

Rien de visible, et c'est voulu. Pas de clé, pas de réseau, un proxy d'entreprise qui bloque `api.unsplash.com`, un quota épuisé, une clé révoquée : le dégradé vert reste, aucun message n'apparaît, rien ne clignote. Le hub n'a jamais l'air cassé parce qu'une photo décorative manque.

La requête est bornée à six secondes, pour qu'un proxy qui avale la demande sans répondre ne laisse pas la promesse pendante.

## Notes techniques

**Les URL d'images sont vérifiées avant usage.** `urlSure()` n'accepte que du `https` vers `images.unsplash.com` pour la photo et `unsplash.com` pour le profil de l'auteur. Une réponse détournée ne peut donc pas glisser un `javascript:` dans un lien de crédit ni un `data:` dans un fond.

**Le recadrage est demandé au serveur.** Les URL brutes d'Unsplash acceptent des paramètres : le hub demande directement une bande de 1920 par 560. Télécharger une image de quatre mille pixels de côté pour n'en montrer qu'un bandeau ferait payer au poste une place qu'il ne verra jamais. Le recadrage se fait par entropie plutôt qu'au centre, qui sur une photo de chantier est souvent du ciel.

**La photo n'est posée qu'une fois chargée.** Une image qui se remplit par bandes derrière une salutation déjà lisible se remarque bien plus que son absence.

**Le cache est dans `localStorage`**, sous la clé `hub_b27_bandeau`. Si le stockage est plein ou refusé par la configuration du poste, le lot vit le temps de la visite, ce qui suffit.
