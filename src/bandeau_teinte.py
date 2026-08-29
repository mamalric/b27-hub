"""Calcule et verifie la chaine de filtres CSS du bandeau d'accueil.

Le bandeau porte une photo de chantier tiree au sort. Elle doit passer en noir
et blanc, puis en sepia, puis prendre le vert de B27, #95c03d. Les fonctions
CSS grayscale(), sepia(), hue-rotate() et saturate() sont des matrices definies
au millieme pres par la specification Filter Effects : le resultat se calcule,
il n'a pas a se regler a l'oeil.

    python src/bandeau_teinte.py

Le script n'ecrit rien. Il imprime la declaration CSS a recopier dans hub.css,
la rampe de gris qu'elle produit, et le voile que le texte blanc exige pour
tenir son contraste. Pour changer la couleur de marque, modifier VERT_B27 et
relancer.
"""

import math

VERT_B27 = (0x95, 0xC0, 0x3D)   # vert de marque, celui du logo
CONTRASTE_MINI = 4.5            # petit texte blanc, seuil WCAG AA

# Le niveau de gris de la photo que l'on veut voir ressortir en #95c03d. Le
# vert de marque est clair et sature : le poser au milieu de la plage ne
# laisserait aucune marge au-dessus, et tout ce qui serait plus clair qu'un
# gris moyen partirait en vert fluo puis en blanc. On le vise donc haut, dans
# les lumieres. C'est du reste le principe du duotone : les ombres vont au vert
# sombre, les lumieres a la couleur de marque, et c'est elle que l'oeil retient
# parce qu'elle occupe les zones les plus lumineuses de l'image.
ENTREE_DE_REFERENCE = 0.85

# Niveaux ou l'on verifie que la chaine ne deforme rien. Avant ecretage la
# chaine est lineaire : les trois canaux gardent un rapport fixe, donc la
# teinte est rigoureusement constante du noir au blanc. Des qu'un canal bute
# sur 0 ou sur 1, ce rapport se rompt et la teinte derive. Verifier que la
# teinte reste constante sur ces niveaux revient donc a verifier qu'aucun canal
# ne sature, en haut comme en bas, et cela en un seul test au lieu de six.
NIVEAUX_DE_CONTROLE = (0.20, 0.45, 0.70, 0.92)
DERIVE_MAX = 1.0   # degres


# --------------------------------------------------------------- matrices --
# Chaque filtre est une matrice 3x3 appliquee au triplet sRGB non lineaire,
# suivie d'un ecretage : c'est ainsi que la chaine se comporte dans le
# navigateur, ou les fonctions raccourcies sont des primitives feColorMatrix
# enchainees.

LUMA = (0.2126, 0.7152, 0.0722)

M_GRIS = (LUMA, LUMA, LUMA)

M_SEPIA = ((0.393, 0.769, 0.189),
           (0.349, 0.686, 0.168),
           (0.272, 0.534, 0.131))

# La matrice sepia a des lignes qui somment a 1,351, 1,203 et 0,937 : au-dessus
# du gris 0,74 elle pousse le canal rouge hors du domaine, et l'ecretage tord
# la teinte de tout le haut de l'image. C'est un defaut du filtre lui-meme, pas
# du reglage : sepia(1) brule les hautes lumieres de n'importe quelle photo.
# Un assombrissement place avant y remedie, la plage rentre dans le domaine et
# la chaine reste lineaire de bout en bout. Le facteur est l'inverse de la plus
# grande somme de ligne.
COMPRESSION = round(1 / sum(M_SEPIA[0]), 2)


def m_saturation(s):
    return ((0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s),
            (0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s),
            (0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s))


def m_teinte(degres):
    c = math.cos(math.radians(degres))
    s = math.sin(math.radians(degres))
    return ((0.213 + c * 0.787 - s * 0.213,
             0.715 - c * 0.715 - s * 0.715,
             0.072 - c * 0.072 + s * 0.928),
            (0.213 - c * 0.213 + s * 0.143,
             0.715 + c * 0.285 + s * 0.140,
             0.072 - c * 0.072 - s * 0.283),
            (0.213 - c * 0.213 - s * 0.787,
             0.715 - c * 0.715 + s * 0.715,
             0.072 + c * 0.928 + s * 0.072))


def appliquer(matrice, couleur):
    """Applique une matrice puis ecrete, comme le fait le navigateur."""
    return tuple(min(1.0, max(0.0, sum(m * v for m, v in zip(ligne, couleur))))
                 for ligne in matrice)


def chaine(couleur, angle, saturation, luminosite):
    """La chaine complete, dans l'ordre ou elle est ecrite en CSS."""
    c = appliquer(M_GRIS, couleur)
    c = tuple(min(1.0, max(0.0, v * COMPRESSION)) for v in c)
    c = appliquer(M_SEPIA, c)
    c = appliquer(m_teinte(angle), c)
    c = appliquer(m_saturation(saturation), c)
    return tuple(min(1.0, max(0.0, v * luminosite)) for v in c)


def css(angle, saturation, luminosite):
    return ("grayscale(1) brightness(%g) sepia(1) hue-rotate(%gdeg) "
            "saturate(%g) brightness(%g)"
            % (COMPRESSION, angle, saturation, luminosite))


# ------------------------------------------------------------- couleurs ----

def teinte_de(couleur):
    """Teinte en degres, convention TSL. None pour un gris."""
    r, v, b = couleur
    haut, bas = max(couleur), min(couleur)
    if haut == bas:
        return None
    d = haut - bas
    if haut == r:
        t = ((v - b) / d) % 6
    elif haut == v:
        t = (b - r) / d + 2
    else:
        t = (r - v) / d + 4
    return t * 60


def saturation_de(couleur):
    """Saturation TSL, entre 0 et 1."""
    haut, bas = max(couleur), min(couleur)
    lum = (haut + bas) / 2
    if haut == bas or lum in (0.0, 1.0):
        return 0.0
    return (haut - bas) / (1 - abs(2 * lum - 1))


def luminance(couleur):
    def canal(v):
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, v, b = (canal(x) for x in couleur)
    return 0.2126 * r + 0.7152 * v + 0.0722 * b


def contraste(a, b):
    la, lb = luminance(a), luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def hexa(couleur):
    return "#%02x%02x%02x" % tuple(round(v * 255) for v in couleur)


# ------------------------------------------------------------- recherche ---

def sans_deformation(angle, saturation, luminosite):
    """Vrai si la chaine ne deforme aucune couleur par ecretage."""
    teintes = []
    for g in NIVEAUX_DE_CONTROLE:
        sortie = chaine((g, g, g), angle, saturation, luminosite)
        if max(sortie) >= 1.0 or min(sortie) <= 0.0:
            return False
        t = teinte_de(sortie)
        if t is None:
            return False
        teintes.append(t)
    return max(teintes) - min(teintes) <= DERIVE_MAX


def chercher():
    """Balaie angle, saturation et luminosite pour poser les lumieres de la
    photo sur le vert de marque, sans la deformer.

    Le critere porte sur la couleur entiere, pas sur la seule teinte. Viser la
    teinte suffirait a tomber sur les 79,7 degres du vert B27 en restant un
    gris verdatre que personne ne reconnaitrait : il faut que le niveau de
    reference ressorte en #95c03d, pas seulement dans sa famille.

    Trois reglages pour trois grandeurs : hue-rotate() place la teinte,
    saturate() le chroma, brightness() la clarte. Le tout sous la contrainte de
    teinte constante. Sans elle le balayage trouve des reglages qui touchent la
    cible au pixel pres en ecrasant le bleu a zero partout ailleurs : la photo
    vire alors a l'olive dans les ombres et au fluo dans les lumieres, et la
    couleur juste ne se voit plus nulle part.
    """
    cible = tuple(v / 255 for v in VERT_B27)
    reference = (ENTREE_DE_REFERENCE,) * 3
    meilleur = None
    angle = 0.0
    while angle <= 120.0:
        saturation = 0.5
        while saturation <= 8.0:
            luminosite = 0.3
            while luminosite <= 2.0:
                if sans_deformation(angle, saturation, luminosite):
                    sortie = chaine(reference, angle, saturation, luminosite)
                    ecart = sum((a - b) ** 2 for a, b in zip(sortie, cible)) ** 0.5
                    note = (round(ecart, 4), angle)
                    if meilleur is None or note < meilleur[0]:
                        meilleur = (note, angle, saturation, luminosite, sortie)
                luminosite = round(luminosite + 0.02, 2)
            saturation = round(saturation + 0.1, 2)
        angle = round(angle + 1.0, 2)
    if meilleur is None:
        raise SystemExit("Aucun reglage ne tient la contrainte de teinte constante.")
    _, angle, saturation, luminosite, sortie = meilleur
    return cible, angle, saturation, luminosite, sortie


def opacite_du_voile(voile, fond, vise=CONTRASTE_MINI):
    """Opacite minimale d'un voile pour que le blanc tienne son contraste.

    Le voile se compose en sRGB sur un fond opaque : le resultat est la moyenne
    ponderee des deux. On cherche la plus petite ponderation qui fasse
    descendre la luminance sous le seuil.
    """
    a = 0.0
    while a <= 1.0:
        melange = tuple(a * v + (1 - a) * f for v, f in zip(voile, fond))
        if contraste(melange, (1.0, 1.0, 1.0)) >= vise:
            return a
        a = round(a + 0.01, 2)
    return None


def main():
    cible, angle, saturation, luminosite, sortie = chercher()

    print("Vert B27 vise     : %s, teinte %.1f deg, saturation %.0f %%"
          % (hexa(cible), teinte_de(cible), saturation_de(cible) * 100))
    print("Lumieres obtenues : %s, teinte %.1f deg, saturation %.0f %%"
          % (hexa(sortie), teinte_de(sortie), saturation_de(sortie) * 100))
    print("Ecart au vert de marque : %.0f/255 sur le canal le plus eloigne"
          % (max(abs(a - b) for a, b in zip(sortie, cible)) * 255))
    print()
    print("filter: %s;" % css(angle, saturation, luminosite))
    print()

    print("Plage de gris, du noir au blanc de la photo :")
    print("  entree  sortie    teinte  satur.  contraste avec le blanc")
    pire = None
    for i in range(0, 11):
        g = i / 10
        c = chaine((g, g, g), angle, saturation, luminosite)
        k = contraste(c, (1.0, 1.0, 1.0))
        t = teinte_de(c)
        repere = "  <- vert de marque" if abs(g - ENTREE_DE_REFERENCE) < 0.06 else ""
        print("  %5.2f   %s   %5.1f   %3.0f %%    %5.2f:1%s"
              % (g, hexa(c), t if t is not None else -1,
                 saturation_de(c) * 100, k, repere))
        if pire is None or k < pire[0]:
            pire = (k, g, c)

    print()
    print("Contraste le plus faible avec le texte blanc : %.2f:1 (gris %.2f, %s)"
          % (pire[0], pire[1], hexa(pire[2])))

    if pire[0] >= CONTRASTE_MINI:
        print("Le blanc tient partout, meme sans voile.")
        return

    # Une photo peut porter un ciel blanc juste derriere la salutation : le cas
    # defavorable n'est pas rare, il est probable. Le voile se dimensionne donc
    # sur lui, et non sur une photo moyenne. Sa couleur est prise sur la rampe
    # ci-dessus : voile et photo partagent alors exactement la meme teinte, et
    # le voile ne se lit pas comme un rectangle rapporte.
    voile = chaine((0.15,) * 3, angle, saturation, luminosite)
    a = opacite_du_voile(voile, pire[2])
    melange = tuple(a * v + (1 - a) * f for v, f in zip(voile, pire[2]))
    print()
    print("Voile sous le texte : %s a %.0f %% d'opacite" % (hexa(voile), a * 100))
    print("  (meme teinte que la photo, prise sur la rampe au gris 0,15)")
    print("  pire cas voile : %s, contraste %.2f:1"
          % (hexa(melange), contraste(melange, (1.0, 1.0, 1.0))))
    print()
    r, v, b = (round(x * 255) for x in voile)
    print("CSS correspondant :")
    print("  background:linear-gradient(100deg,")
    print("    rgba(%d,%d,%d,%.2f) 0%%, rgba(%d,%d,%d,%.2f) 46%%, rgba(%d,%d,%d,0) 74%%);"
          % (r, v, b, a, r, v, b, round(a * 0.62, 2), r, v, b))


if __name__ == "__main__":
    main()
