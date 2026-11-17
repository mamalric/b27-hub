"""Régénère la table VACANCES de hub.js à partir du calendrier scolaire officiel.

Source : jeu de données "Le calendrier scolaire" du ministère de l'Éducation nationale,
data.education.gouv.fr (fr-en-calendrier-scolaire), Licence Ouverte Etalab.

Usage : python src/vacances_scolaires.py 2025-2026 2026-2027 2027-2028
Le bloc imprimé remplace celui qui suit "const VACANCES = [" dans hub.js.

Dans le jeu de données, start_date est minuit (heure de Paris) du premier jour sans cours
et end_date minuit du jour de reprise : les jours de vacances vont de start inclus à end
exclu. Quand start et end tombent le même jour (un pont d'un jour, le début des vacances
d'été d'une année dont la fin n'est pas encore publiée), c'est ce seul jour. Pour l'été,
on garde la date des élèves, pas celle des enseignants.
"""
import datetime as dt
import json
import sys
import urllib.parse
import urllib.request

API = "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records"


def jour_paris(iso):
    # Les dates sont minuit à Paris, soit 22 h ou 23 h UTC la veille : trois heures de
    # plus tombent toujours dans le bon jour, heure d'été ou non.
    t = dt.datetime.fromisoformat(iso)
    return (t + dt.timedelta(hours=3)).date()


def nom_lisible(description):
    # "Vacances d'Hiver" devient "Vacances d'hiver" ; Toussaint, Noël et l'Ascension gardent leur capitale.
    for mot in ("Hiver", "Printemps", "Été", "Vacances d'été"):
        description = description.replace(" " + mot, " " + mot.lower()).replace("'" + mot, "'" + mot.lower())
    return description.replace("Début des Vacances", "Début des vacances")


def main(annees):
    liste = ",".join("'" + a + "'" for a in annees)
    params = {
        "select": "description,start_date,end_date,zones,population",
        "where": "annee_scolaire in (" + liste + ") and zones in ('Zone A','Zone B','Zone C')",
        "group_by": "description,start_date,end_date,zones,population",
        "order_by": "start_date",
        "limit": "100",
    }
    with urllib.request.urlopen(API + "?" + urllib.parse.urlencode(params), timeout=30) as r:
        lignes = json.load(r)["results"]

    periodes = {}
    for l in lignes:
        if l["population"] == "Enseignants":
            continue
        debut, fin = jour_paris(l["start_date"]), jour_paris(l["end_date"])
        dernier = debut if fin <= debut else fin - dt.timedelta(days=1)
        cle = (debut.isoformat(), dernier.isoformat(), nom_lisible(l["description"]))
        periodes.setdefault(cle, set()).add(l["zones"][-1])

    sys.stdout.reconfigure(encoding="utf-8")
    for (debut, dernier, nom), zones in sorted(periodes.items()):
        print('  ["%s", "%s", "%s", "%s"],' % (debut, dernier, nom.replace('"', "'"), "".join(sorted(zones))))


if __name__ == "__main__":
    main(sys.argv[1:] or ["2025-2026", "2026-2027", "2027-2028"])
