#!/usr/bin/env python3
"""Contrôle du catalogue du hub B27.

Le fichier catalogue.js se modifie à la main : une catégorie mal orthographiée,
un statut inventé, une icône qui n'existe pas ou deux fiches partageant le même
id sont les fautes les plus probables. Le hub sait déjà les signaler dans la
console du navigateur, mais il faut penser à l'ouvrir. Ce script fait le même
contrôle en version stricte, hors navigateur, avant de publier.

    python tests/verifier_catalogue.py

Code de sortie 0 si tout va bien, 1 s'il reste au moins une erreur. Les
avertissements n'empêchent pas la publication mais méritent un coup d'oeil.

Bibliothèque standard uniquement, aucune dépendance à installer.
"""

import datetime
import json
import pathlib
import re
import sys

# La console Windows est en cp1252 par défaut : sans cette ligne, les accents
# des messages sortent en caractères de remplacement.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, OSError):
    pass

RACINE = pathlib.Path(__file__).resolve().parent.parent
FICHIER_CATALOGUE = RACINE / "catalogue.js"
FICHIER_HUB = RACINE / "hub.js"

STATUTS_CONNUS = {"en-ligne", "beta", "a-venir", "bureau", "obsolete"}
STATUTS_CLIQUABLES = {"en-ligne", "beta"}
TYPES_CONNUS = {"outil", "lien"}
TRANSPORTS_CONNUS = {"mailto", "formulaire", "endpoint"}
LONGUEUR_PITCH_MAX = 140
CHAMPS_PORTE = {"id", "nom", "pitch", "url", "categorie", "statut", "type", "icone", "tags", "maj"}
# sousCategorie est facultatif : une porte sans sous-dossier reste valable.
CHAMPS_PORTE_FACULTATIFS = {"sousCategorie"}
CHAMPS_CONTACT = {"id", "nom", "role", "agence", "mail", "tel", "sujets"}

# Fonds contre lesquels une couleur de tuile doit tenir. Le glyphe est blanc,
# et la tuile est un aplat posé sur la page : une teinte trop claire efface le
# glyphe, une teinte trop foncée fait disparaître la tuile sur fond sombre.
# Les deux fonds sont ceux de hub.css, jetons --fond des deux thèmes.
GLYPHE = "#ffffff"
FOND_CLAIR = "#eef0ed"
FOND_SOMBRE = "#101211"
CONTRASTE_MINI = 3.0          # seuil WCAG des éléments graphiques


def _luminance(hexa: str) -> float:
    h = hexa.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    canaux = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    canaux = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in canaux]
    return 0.2126 * canaux[0] + 0.7152 * canaux[1] + 0.0722 * canaux[2]


def contraste(a: str, b: str) -> float:
    la, lb = _luminance(a), _luminance(b)
    haut, bas = max(la, lb), min(la, lb)
    return round((haut + 0.05) / (bas + 0.05), 2)


# --------------------------------------------------------------------------
# Lecture des littéraux JavaScript
#
# catalogue.js n'est pas du JSON : il porte des commentaires, des clés sans
# guillemets et des virgules finales. Plutôt que d'imposer un format moins
# commode à écrire à la main, on le convertit ici. Le retrait des commentaires
# se fait caractère par caractère et non par expression régulière, sinon le
# "//" de "https://" serait pris pour le début d'un commentaire et la moitié
# des adresses disparaîtrait silencieusement.
# --------------------------------------------------------------------------

def retirer_commentaires(source: str) -> str:
    sortie = []
    i, n = 0, len(source)
    while i < n:
        c = source[i]
        if c in "\"'":
            guillemet = c
            sortie.append(c)
            i += 1
            while i < n:
                sortie.append(source[i])
                if source[i] == "\\":
                    if i + 1 < n:
                        sortie.append(source[i + 1])
                        i += 2
                        continue
                elif source[i] == guillemet:
                    i += 1
                    break
                i += 1
            continue
        if c == "/" and i + 1 < n and source[i + 1] == "/":
            while i < n and source[i] != "\n":
                i += 1
            continue
        if c == "/" and i + 1 < n and source[i + 1] == "*":
            i += 2
            while i + 1 < n and not (source[i] == "*" and source[i + 1] == "/"):
                i += 1
            i += 2
            continue
        sortie.append(c)
        i += 1
    return "".join(sortie)


def extraire_litteral(source: str, nom: str):
    """Renvoie la valeur Python du littéral affecté à `nom` dans le source."""
    depart = re.search(r"\bconst\s+" + re.escape(nom) + r"\s*=\s*", source)
    if not depart:
        raise ValueError("déclaration '%s' introuvable dans catalogue.js" % nom)
    i = depart.end()
    ouvrant = source[i]
    fermant = {"[": "]", "{": "}"}.get(ouvrant)
    if not fermant:
        raise ValueError("'%s' n'est pas un tableau ni un objet" % nom)

    profondeur, debut = 0, i
    while i < len(source):
        c = source[i]
        if c in "\"'":
            guillemet = c
            i += 1
            while i < len(source):
                if source[i] == "\\":
                    i += 2
                    continue
                if source[i] == guillemet:
                    break
                i += 1
        elif c == ouvrant:
            profondeur += 1
        elif c == fermant:
            profondeur -= 1
            if profondeur == 0:
                brut = source[debut:i + 1]
                break
        i += 1
    else:
        raise ValueError("littéral '%s' non refermé" % nom)

    # Clés sans guillemets vers clés JSON, puis retrait des virgules finales
    # que JSON refuse.
    txt = re.sub(r"([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', brut)
    txt = re.sub(r",(\s*[\]}])", r"\1", txt)
    return json.loads(txt)


def cles_icones() -> set:
    """Noms d'icônes déclarés dans TRACES_ICONES, côté hub.js."""
    source = retirer_commentaires(FICHIER_HUB.read_text(encoding="utf-8"))
    bloc = re.search(r"const\s+TRACES_ICONES\s*=\s*\{(.*?)\n\};", source, re.S)
    if not bloc:
        return set()
    return set(re.findall(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:", bloc.group(1), re.M))


# --------------------------------------------------------------------------
# Contrôles
# --------------------------------------------------------------------------

def controler_couleur(ou: str, couleur):
    """Une couleur de tuile doit tenir sur trois fronts, ou elle ne va pas."""
    if not couleur:
        return []
    if not re.fullmatch(r"#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?", str(couleur)):
        return ["%s : couleur '%s' hors format (#rgb ou #rrggbb)." % (ou, couleur)]
    faits = []
    for fond, quoi in ((GLYPHE, "le glyphe blanc"),
                       (FOND_CLAIR, "le fond du thème clair"),
                       (FOND_SOMBRE, "le fond du thème sombre")):
        c = contraste(couleur, fond)
        if c < CONTRASTE_MINI:
            faits.append("%s : couleur %s à %.2f:1 avec %s, il faut au moins %.1f:1. "
                         "Trop claire, le glyphe s'efface ; trop foncée, la tuile "
                         "disparaît sur fond sombre."
                         % (ou, couleur, c, quoi, CONTRASTE_MINI))
    return faits


def controler():
    erreurs, avertissements = [], []

    source = retirer_commentaires(FICHIER_CATALOGUE.read_text(encoding="utf-8"))
    portes = extraire_litteral(source, "PORTES")
    contacts = extraire_litteral(source, "CONTACTS")
    categories = extraire_litteral(source, "CATEGORIES")
    sous_categories = extraire_litteral(source, "SOUS_CATEGORIES")
    reglages = extraire_litteral(source, "REGLAGES")
    signalement = extraire_litteral(source, "SIGNALEMENT")
    icones = cles_icones()

    # --- catégories
    cles_categories = []
    for i, c in enumerate(categories, 1):
        ou = "catégorie %d" % i
        for champ in ("cle", "nom", "icone"):
            if not c.get(champ):
                erreurs.append("%s : champ '%s' manquant." % (ou, champ))
        if c.get("cle") in cles_categories:
            erreurs.append("%s : clé '%s' déjà utilisée." % (ou, c["cle"]))
        cles_categories.append(c.get("cle"))
        if icones and c.get("icone") and c["icone"] not in icones:
            erreurs.append("%s : icône '%s' absente de TRACES_ICONES (hub.js)." % (ou, c["icone"]))
        erreurs.extend(controler_couleur(ou, c.get("couleur")))
        if not c.get("couleur"):
            avertissements.append("%s : pas de couleur, la tuile prendra le vert de repli."
                                  % ou)

    # --- sous-catégories
    cles_sous = []
    sous_par_cle = {}
    for i, sc in enumerate(sous_categories, 1):
        ou = "sous-catégorie %d (%s)" % (i, sc.get("nom") or sc.get("cle") or "sans nom")
        for champ in ("cle", "categorie", "nom", "icone"):
            if not sc.get(champ):
                erreurs.append("%s : champ '%s' manquant." % (ou, champ))
        if sc.get("cle") in cles_sous:
            erreurs.append("%s : clé '%s' déjà utilisée." % (ou, sc["cle"]))
        cles_sous.append(sc.get("cle"))
        sous_par_cle[sc.get("cle")] = sc
        if sc.get("categorie") not in cles_categories:
            erreurs.append("%s : rattachée à la catégorie '%s' qui n'existe pas."
                           % (ou, sc.get("categorie")))
        if icones and sc.get("icone") and sc["icone"] not in icones:
            erreurs.append("%s : icône '%s' absente de TRACES_ICONES (hub.js)." % (ou, sc["icone"]))
        # Une sous-catégorie sans couleur hérite de la sienne : rien à vérifier.
        if sc.get("couleur"):
            erreurs.extend(controler_couleur(ou, sc["couleur"]))

    # --- réglages
    for champ in ("titre", "sousTitre", "seuilFiltres"):
        if champ not in reglages:
            erreurs.append("REGLAGES : champ '%s' manquant." % champ)
    if not reglages.get("accroche"):
        avertissements.append("REGLAGES : pas d'accroche, le bandeau d'accueil sera nu.")
    if "contact" not in reglages:
        avertissements.append("REGLAGES : pas de champ 'contact', aucune adresse ne sera proposée.")

    # --- signalement
    if signalement.get("actif"):
        transport = signalement.get("transport")
        if transport not in TRANSPORTS_CONNUS:
            erreurs.append("SIGNALEMENT : transport '%s' inconnu (attendu : %s)."
                           % (transport, ", ".join(sorted(TRANSPORTS_CONNUS))))
        elif transport == "mailto":
            if not signalement.get("destinataire"):
                erreurs.append("SIGNALEMENT : mode mailto sans destinataire, la pastille ne sera pas posée.")
        elif not signalement.get("endpoint"):
            erreurs.append("SIGNALEMENT : mode '%s' sans endpoint, le widget retombera en mailto." % transport)
        if signalement.get("destinataire") and "@" not in signalement["destinataire"]:
            erreurs.append("SIGNALEMENT : destinataire '%s' sans arobase." % signalement["destinataire"])

    # --- portes
    ids = []
    aujourdhui = datetime.date.today()
    for i, o in enumerate(portes, 1):
        ou = "porte %d (%s)" % (i, o.get("nom") or o.get("id") or "sans nom")

        manquants = CHAMPS_PORTE - set(o)
        if manquants:
            erreurs.append("%s : champ(s) manquant(s) : %s." % (ou, ", ".join(sorted(manquants))))
        inconnus = set(o) - CHAMPS_PORTE - CHAMPS_PORTE_FACULTATIFS
        if inconnus:
            avertissements.append("%s : champ(s) ignoré(s) par le hub : %s." % (ou, ", ".join(sorted(inconnus))))

        ident = o.get("id", "")
        if ident in ids:
            erreurs.append("%s : id '%s' déjà utilisé par une autre fiche." % (ou, ident))
        elif ident and not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", ident):
            erreurs.append("%s : id '%s' hors format (minuscules, chiffres et tirets)." % (ou, ident))
        ids.append(ident)

        pitch = o.get("pitch") or ""
        if len(pitch) > LONGUEUR_PITCH_MAX:
            avertissements.append("%s : pitch de %d caractères, au-delà de %d il sera à l'étroit sur la carte."
                                  % (ou, len(pitch), LONGUEUR_PITCH_MAX))

        if o.get("categorie") not in cles_categories:
            erreurs.append("%s : catégorie '%s' absente de CATEGORIES." % (ou, o.get("categorie")))

        # Une sous-catégorie rattachée à une autre catégorie que celle de la
        # porte est le piège discret : la porte n'apparaîtrait dans aucun
        # dossier, sans que rien ne le signale à l'écran.
        sc = o.get("sousCategorie")
        if sc:
            if sc not in sous_par_cle:
                erreurs.append("%s : sous-catégorie '%s' absente de SOUS_CATEGORIES." % (ou, sc))
            elif sous_par_cle[sc].get("categorie") != o.get("categorie"):
                erreurs.append("%s : sous-catégorie '%s' rattachée à '%s' et non à '%s', "
                               "la porte n'apparaîtrait dans aucun dossier."
                               % (ou, sc, sous_par_cle[sc].get("categorie"), o.get("categorie")))

        statut = o.get("statut")
        if statut not in STATUTS_CONNUS:
            erreurs.append("%s : statut '%s' inconnu (attendu : %s)."
                           % (ou, statut, ", ".join(sorted(STATUTS_CONNUS))))

        if o.get("type") and o["type"] not in TYPES_CONNUS:
            erreurs.append("%s : type '%s' inconnu (attendu : %s)."
                           % (ou, o["type"], ", ".join(sorted(TYPES_CONNUS))))

        if icones and o.get("icone") and o["icone"] not in icones:
            erreurs.append("%s : icône '%s' absente de TRACES_ICONES (hub.js)." % (ou, o["icone"]))

        url = o.get("url") or ""
        if statut in STATUTS_CLIQUABLES:
            if not url:
                erreurs.append("%s : statut '%s' mais aucune url, la carte ne mènerait nulle part." % (ou, statut))
            elif not url.startswith(("https://", "http://")):
                erreurs.append("%s : url '%s' sans schéma http ou https." % (ou, url))
            elif url.startswith("http://"):
                avertissements.append("%s : url en http, préférer https." % ou)
        elif url:
            avertissements.append("%s : statut '%s' non cliquable, l'url renseignée ne sera pas utilisée." % (ou, statut))

        maj = o.get("maj") or ""
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", maj):
            erreurs.append("%s : date de mise à jour '%s' hors format AAAA-MM-JJ." % (ou, maj))
        else:
            try:
                if datetime.date.fromisoformat(maj) > aujourdhui:
                    avertissements.append("%s : date de mise à jour dans le futur (%s)." % (ou, maj))
            except ValueError:
                erreurs.append("%s : date de mise à jour '%s' inexistante au calendrier." % (ou, maj))

        tags = o.get("tags")
        if not isinstance(tags, list) or not all(isinstance(t, str) for t in tags):
            erreurs.append("%s : 'tags' doit être une liste de chaînes." % ou)
        elif len(tags) > 4:
            avertissements.append("%s : %d mots-clés, la carte n'en affiche que 4 (les autres restent "
                                  "cherchables)." % (ou, len(tags)))

    # --- annuaire
    ids_contacts = []
    for i, c in enumerate(contacts, 1):
        ou = "contact %d (%s)" % (i, c.get("nom") or c.get("id") or "sans nom")
        inconnus = set(c) - CHAMPS_CONTACT
        if inconnus:
            avertissements.append("%s : champ(s) ignoré(s) : %s." % (ou, ", ".join(sorted(inconnus))))
        if not c.get("nom"):
            erreurs.append("%s : champ 'nom' manquant." % ou)
        if c.get("id") in ids_contacts:
            erreurs.append("%s : id '%s' déjà utilisé." % (ou, c.get("id")))
        ids_contacts.append(c.get("id"))
        if not c.get("mail") and not c.get("tel"):
            erreurs.append("%s : ni mail ni téléphone, la fiche n'offre aucun moyen de joindre." % ou)
        if c.get("mail") and "@" not in c["mail"]:
            erreurs.append("%s : adresse '%s' sans arobase." % (ou, c["mail"]))
        if c.get("tel") and not re.fullmatch(r"\+?[\d\s.\-()]{6,}", c["tel"]):
            avertissements.append("%s : téléphone '%s' d'aspect inhabituel, il doit rester cliquable." % (ou, c["tel"]))

    return portes, contacts, categories, sous_categories, erreurs, avertissements


def main():
    try:
        portes, contacts, categories, sous_categories, erreurs, avertissements = controler()
    except Exception as exc:                      # noqa: BLE001
        print("Lecture impossible : %s" % exc)
        return 1

    peuplees = {o.get("categorie") for o in portes}
    ouvertes = [o for o in portes if o.get("statut") in STATUTS_CLIQUABLES and o.get("url")]
    liens = [o for o in portes if o.get("type") == "lien"]
    sous_utilisees = {o.get("sousCategorie") for o in portes if o.get("sousCategorie")}
    print("Catalogue : %d porte(s), %d ouverte(s), %d ressource(s) extérieure(s), "
          "%d catégorie(s) utilisée(s) sur %d déclarée(s), "
          "%d sous-dossier(s) utilisé(s) sur %d déclaré(s), %d fiche(s) d'annuaire."
          % (len(portes), len(ouvertes), len(liens), len(peuplees), len(categories),
             len(sous_utilisees), len(sous_categories), len(contacts)))

    for a in avertissements:
        print("  avertissement : %s" % a)
    for e in erreurs:
        print("  ERREUR : %s" % e)

    if erreurs:
        print("\n%d erreur(s) : corriger catalogue.js avant de publier." % len(erreurs))
        return 1
    print("\nCatalogue conforme%s." % (", %d avertissement(s)" % len(avertissements) if avertissements else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
