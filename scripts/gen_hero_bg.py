#!/usr/bin/env python3
"""
Genera public/hero-bg.jpg: fondo tipo "editorial de perfumería de alta
gama" (negro profundo, luz ámbar direccional, sombras elegantes) para el
Hero. Es 100% generado acá (gradientes + blur + grano), no una foto bajada
de internet: una foto real de un frasco de marca (YSL u otra) tiene
copyright de esa marca/fotógrafo, y usarla como portada de una tienda que
no es distribuidor oficial es un riesgo real. En vez de intentar dibujar
un frasco literal (que con formas simples termina viéndose como un ícono
plano, no como vidrio), esto apuesta todo a luz y sombra -- un solo haz de
luz ámbar entrando desde arriba a la derecha, como en un bodegón de
estudio -- que es lo que de verdad lee como "foto de perfumería premium"
sin representar ningún producto puntual.
"""

import random

from PIL import Image, ImageDraw, ImageFilter

ANCHO, ALTO = 2400, 1500

NOCHE = (10, 8, 6)
CARBON = (24, 18, 13)
AMBAR = (198, 138, 58)
AMBAR_CLARO = (232, 186, 112)
ORO_CLARO = (235, 211, 163)

random.seed(11)


def base_gradiente():
    """Negro casi puro a la izquierda (donde va el texto), apenas más
    cálido a la derecha."""
    img = Image.new("RGB", (ANCHO, ALTO))
    px = img.load()
    for y in range(ALTO):
        v = y / ALTO
        for x in range(0, ANCHO, 4):
            t = (x / ANCHO) ** 1.6
            r = int(NOCHE[0] + (CARBON[0] - NOCHE[0]) * t)
            g = int(NOCHE[1] + (CARBON[1] - NOCHE[1]) * t)
            b = int(NOCHE[2] + (CARBON[2] - NOCHE[2]) * t)
            sombra = 1 - 0.18 * abs(v - 0.5) * 2
            r, g, b = int(r * sombra), int(g * sombra), int(b * sombra)
            for dx in range(4):
                if x + dx < ANCHO:
                    px[x + dx, y] = (r, g, b)
    return img


def resplandor(capa, centro, radio_x, radio_y, color, alpha_max, potencia=2.2):
    draw = ImageDraw.Draw(capa)
    pasos = 90
    for i in range(pasos, 0, -1):
        rx = int(radio_x * i / pasos)
        ry = int(radio_y * i / pasos)
        alpha = int(alpha_max * (1 - i / pasos) ** potencia)
        draw.ellipse(
            [centro[0] - rx, centro[1] - ry, centro[0] + rx, centro[1] + ry],
            fill=(*color, alpha),
        )


def haz_de_luz(img):
    """Un rayo de luz ámbar, angosto arriba y abriéndose hacia abajo, como
    entrando por una claraboya -- el recurso clásico de bodegón de lujo."""
    capa = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(capa)

    puntos = [
        (ANCHO * 0.98, -80),
        (ANCHO * 1.08, -80),
        (ANCHO * 0.62, ALTO * 1.05),
        (ANCHO * 0.40, ALTO * 1.05),
    ]
    draw.polygon(puntos, fill=(*ORO_CLARO, 46))

    puntos2 = [
        (ANCHO * 1.02, -80),
        (ANCHO * 1.12, -80),
        (ANCHO * 0.78, ALTO * 1.05),
        (ANCHO * 0.66, ALTO * 1.05),
    ]
    draw.polygon(puntos2, fill=(*ORO_CLARO, 30))

    capa = capa.filter(ImageFilter.GaussianBlur(90))
    return Image.alpha_composite(img.convert("RGBA"), capa)


def particulas(img):
    """Motas de polvo suspendidas en el haz de luz, muy tenues."""
    capa = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(capa)
    for _ in range(90):
        x = random.randint(int(ANCHO * 0.45), ANCHO - 30)
        y = random.randint(30, ALTO - 30)
        r = random.uniform(1, 3.4)
        alpha = random.randint(16, 55)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(*ORO_CLARO, alpha))
    capa = capa.filter(ImageFilter.GaussianBlur(0.7))
    return Image.alpha_composite(img.convert("RGBA"), capa)


def ruido_fino(img, intensidad=4):
    ruido = Image.effect_noise((ANCHO, ALTO), 24).convert("L")
    ruido_rgb = Image.merge("RGB", (ruido, ruido, ruido))
    return Image.blend(img, ruido_rgb, intensidad / 100)


def main():
    img = base_gradiente().convert("RGBA")

    # Halos ámbar de fondo, concentrados a la derecha.
    halo = Image.new("RGBA", img.size, (0, 0, 0, 0))
    resplandor(halo, (int(ANCHO * 0.83), int(ALTO * 0.38)), 680, 780, AMBAR, 58)
    resplandor(halo, (int(ANCHO * 0.92), int(ALTO * 0.22)), 360, 420, AMBAR_CLARO, 42)
    halo = halo.filter(ImageFilter.GaussianBlur(110))
    img = Image.alpha_composite(img, halo)

    img = haz_de_luz(img)
    img = particulas(img)

    img = img.convert("RGB")
    img = ruido_fino(img, intensidad=4)

    # Viñeta: bien oscura arriba/abajo/izquierda, más abierta a la derecha
    # -- así el degradé CSS que va encima (from-black via-black/85 to-black/40)
    # tiene, del lado derecho, algo real que mostrar.
    vineta = Image.new("L", img.size, 0)
    vd = ImageDraw.Draw(vineta)
    vd.ellipse(
        [-ANCHO * 0.22, -ALTO * 0.35, ANCHO * 1.05, ALTO * 1.25],
        fill=255,
    )
    vineta = vineta.filter(ImageFilter.GaussianBlur(210))
    negro = Image.new("RGB", img.size, (5, 4, 3))
    img = Image.composite(img, negro, vineta)

    ruta = r"C:\Users\maxip\Downloads\tufraganciaideal\tufraganciaideal\public\hero-bg.jpg"
    img.save(ruta, "JPEG", quality=93)
    print("public/hero-bg.jpg regenerado:", img.size)


if __name__ == "__main__":
    main()
