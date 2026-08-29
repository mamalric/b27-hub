#!/usr/bin/env python3
"""Génère le bandeau de charpente du hall, en SVG.

La géométrie est calculée et non dessinée à l'oeil : c'est la seule façon
d'obtenir des membrures réellement parallèles et des trames régulières, ce
qu'un tracé à main levée ne donne jamais. Une charpente mal d'aplomb se voit
immédiatement, surtout chez un BET.

Projection axonométrique : x file le long de la façade, y monte, z s'enfonce
vers le haut-droite. Pas de fuite perspective, volontairement : une
axonométrie est le mode de représentation des plans d'exécution, et elle se
répète proprement sur toute la largeur d'un bandeau.
"""

import math

# --- Cadre ----------------------------------------------------------------
# Le format suit celui du bandeau, pour que le cadrage ne rogne presque rien :
# une charpente dont on ne voit plus les poteaux ne dit plus rien.
# Le rapport du viewBox suit celui du bandeau, autour de 5,5 pour 1 : avec un
# recadrage en "slice", tout ecart entre les deux se paie en rognage. Un
# premier essai a 1200 x 280 coupait les poteaux a mi-hauteur, la charpente
# n'etait plus qu'un enchevetrement de poutres sans appui visible.
L, H = 1200, 216          # viewBox du bandeau
# Elle deborde legerement a gauche et a droite : on regarde un fragment
# d'ouvrage, pas la maquette entiere d'un hangar.
OX, OY = -40, 198         # origine, pied du premier poteau au premier plan
TRAVEE = 240              # entraxe des poteaux le long de la façade
HAUTEUR = 104             # hauteur sous poutre
DZX, DZY = 140, -46       # vecteur de profondeur, une file à l'autre
N_TRAVEES = 5
# Deux files et non trois : à cette taille, la troisième ne se lit plus comme
# de la profondeur, elle fait de l'encombrement.
N_FILES = 2
FERME = 26                # hauteur de la ferme au-dessus de la poutre


def P(x, y, z):
    """Projette un point de la charpente sur le plan du dessin."""
    return (OX + x * TRAVEE + z * DZX, OY - y * HAUTEUR + z * DZY)


def d(*points):
    """Chemin SVG passant par les points donnés."""
    return "M" + " L".join("%.1f %.1f" % p for p in points)


def membrures():
    """Toutes les barres de la charpente, en chemins SVG."""
    ch = []

    # Poteaux. Le premier plan porte les plus longs, la profondeur les
    # raccourcit optiquement : c'est la projection qui s'en charge.
    for z in range(N_FILES):
        for i in range(N_TRAVEES + 1):
            ch.append(d(P(i, 0, z), P(i, 1, z)))

    # Poutres longitudinales, en tête de poteaux et à mi-hauteur.
    for z in range(N_FILES):
        ch.append(d(P(0, 1, z), P(N_TRAVEES, 1, z)))
        ch.append(d(P(0, 0.52, z), P(N_TRAVEES, 0.52, z)))

    # Poutres transversales, d'une file à l'autre.
    for i in range(N_TRAVEES + 1):
        ch.append(d(P(i, 1, 0), P(i, 1, N_FILES - 1)))

    # Contreventement : une croix de Saint-André une travée sur trois, sur la
    # file avant seulement. Sur un vrai ouvrage on ne contrevente pas toutes
    # les travées, et ici la retenue sert aussi la lisibilité : croiser les
    # deux files transformerait la charpente en fourré.
    for i in range(N_TRAVEES):
        if i % 3 == 1:
            ch.append(d(P(i, 0, 0), P(i + 1, 1, 0)))
            ch.append(d(P(i + 1, 0, 0), P(i, 1, 0)))

    return ch


def fermes():
    """Fermes à treillis posées sur les poutres de tête."""
    ch = []
    haut = FERME / HAUTEUR          # hauteur de ferme, en unités de y

    for z in range(N_FILES):
        # Membrure supérieure, à deux pentes sur chaque travée double.
        sommets = []
        for i in range(N_TRAVEES + 1):
            monte = haut if i % 2 == 1 else haut * 0.35
            sommets.append(P(i, 1 + monte, z))
        ch.append(d(*sommets))

        # Treillis : montants et diagonales entre membrure basse et haute.
        for i in range(N_TRAVEES + 1):
            monte = haut if i % 2 == 1 else haut * 0.35
            ch.append(d(P(i, 1, z), P(i, 1 + monte, z)))
        # Une diagonale par travée, alternée : c'est le dessin d'un treillis
        # réel. Les croiser doublerait le nombre de traits pour rien.
        for i in range(N_TRAVEES):
            m0 = haut if i % 2 == 1 else haut * 0.35
            m1 = haut if (i + 1) % 2 == 1 else haut * 0.35
            if i % 2 == 0:
                ch.append(d(P(i, 1, z), P(i + 1, 1 + m1, z)))
            else:
                ch.append(d(P(i, 1 + m0, z), P(i + 1, 1, z)))

    # Pannes : elles filent d'une ferme à l'autre, en tête de montant.
    for i in range(N_TRAVEES + 1):
        monte = haut if i % 2 == 1 else haut * 0.35
        ch.append(d(P(i, 1 + monte, 0), P(i, 1 + monte, N_FILES - 1)))

    # Ligne de sol : sans elle la charpente flotte, et l'oeil ne sait plus
    # d'où elle part.
    ch.append(d(P(0, 0, 0), P(N_TRAVEES, 0, 0)))
    ch.append(d(P(0, 0, N_FILES - 1), P(N_TRAVEES, 0, N_FILES - 1)))
    return ch


def trame():
    """Trame de fond, comme le quadrillage d'un calque."""
    ch = []
    pas = 27
    for x in range(0, L + pas, pas):
        ch.append(d((x, 0), (x, H)))
    for y in range(0, H + pas, pas):
        ch.append(d((0, y), (L, y)))
    return ch


def noeuds():
    """Points d'assemblage, marqués comme sur un plan de montage."""
    pts = []
    for z in range(N_FILES):
        for i in range(N_TRAVEES + 1):
            pts.append(P(i, 1, z))
    return pts


def svg():
    barres = membrures() + fermes()
    trames = trame()
    assemblages = noeuds()

    def groupe(chemins, **attrs):
        a = " ".join('%s="%s"' % (k.replace("_", "-"), v) for k, v in attrs.items())
        return ("  <g " + a + ">\n"
                + "".join('    <path d="%s"/>\n' % c for c in chemins)
                + "  </g>\n")

    out = []
    out.append('<svg class="bandeau-charpente" viewBox="0 0 %d %d" '
               'preserveAspectRatio="xMidYMid slice" aria-hidden="true" '
               'xmlns="http://www.w3.org/2000/svg">\n' % (L, H))

    # Deux dégradés de masque, opposés : le plein s'efface vers la gauche pour
    # dégager le texte, la trame ne se montre qu'à droite, là où le dessin
    # bascule du construit au dessiné.
    out.append("""  <defs>
    <linearGradient id="bcPlein" x1="0" x2="1">
      <stop offset="0.24" stop-color="#000"/>
      <stop offset="0.52" stop-color="#fff"/>
      <stop offset="0.74" stop-color="#fff"/>
      <stop offset="0.96" stop-color="#000"/>
    </linearGradient>
    <linearGradient id="bcTrait" x1="0" x2="1">
      <stop offset="0.16" stop-color="#000"/>
      <stop offset="0.46" stop-color="#fff"/>
      <stop offset="1" stop-color="#fff"/>
    </linearGradient>
    <linearGradient id="bcTrame" x1="0" x2="1">
      <stop offset="0.45" stop-color="#000"/>
      <stop offset="0.85" stop-color="#fff"/>
      <stop offset="1" stop-color="#fff"/>
    </linearGradient>
    <mask id="bcMasquePlein"><rect width="%d" height="%d" fill="url(#bcPlein)"/></mask>
    <mask id="bcMasqueTrait"><rect width="%d" height="%d" fill="url(#bcTrait)"/></mask>
    <mask id="bcMasqueTrame"><rect width="%d" height="%d" fill="url(#bcTrame)"/></mask>
  </defs>
""" % (L, H, L, H, L, H))

    # La trame, tout au fond et seulement à droite.
    out.append(groupe(trames, fill="none", stroke="currentColor", stroke_width="0.6",
                      opacity="0.30", mask="url(#bcMasqueTrame)"))

    # Les membrures en épaisseur : c'est ce qui donne la moitié "construite".
    # Le même tracé sert deux fois, une fois épais et une fois fin, plutôt que
    # de calculer des profils extrudés qui n'apporteraient rien à cette taille.
    out.append(groupe(barres, fill="none", stroke="currentColor", stroke_width="13",
                      stroke_linecap="round", stroke_linejoin="round",
                      opacity="0.26", mask="url(#bcMasquePlein)"))

    # Le trait, sur toute la largeur : c'est lui qui reste seul à droite.
    out.append(groupe(barres, fill="none", stroke="currentColor", stroke_width="1.4",
                      stroke_linecap="round", stroke_linejoin="round",
                      opacity="0.55", mask="url(#bcMasqueTrait)"))

    # Les assemblages, derniers posés.
    out.append('  <g fill="currentColor" opacity="0.5" mask="url(#bcMasqueTrait)">\n')
    for x, y in assemblages:
        out.append('    <circle cx="%.1f" cy="%.1f" r="3.2"/>\n' % (x, y))
    out.append("  </g>\n")

    out.append("</svg>\n")
    return "".join(out)


if __name__ == "__main__":
    import io, sys, pathlib
    sortie = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path("bandeau.svg")
    contenu = svg()
    sortie.write_text(contenu, encoding="utf-8", newline="\n")
    print("%s ecrit, %d octets, %d barres"
          % (sortie, len(contenu.encode("utf-8")), len(membrures()) + len(fermes())))
