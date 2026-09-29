#!/usr/bin/env python3
"""
Genera public/hero-bg.jpg: fondo atmosférico oscuro con destellos dorados
para el Hero. Es una imagen 100% generada acá (gradientes + ruido + blur),
no una foto bajada de internet -- misma decisión que con og.jpg, para no
tener ningún riesgo de derechos de autor sobre una imagen decorativa. El
frasco (Frasco.tsx, SVG propio) sigue siendo el protagonista en primer
plano; este fondo solo le da atmósfera y profundidad detrás.
"""

import random

from PIL import Image, ImageDraw, ImageFilter

ANCHO, ALTO = 2400, 1500

NOCHE = (20, 16, 12)
CARBON = (29, 23, 18)
CHAMPAN = (217, 182, 121)
ORO_CLARO = (235, 211, 163)
ORO_VIVO = (196, 155, 74)

random.seed(7)


def base_gradiente():
    """Vertical + diagonal: más claro/cálido arriba-derecha, negro profundo
    abajo-izquierda, para que el texto (que va a la izquierda) tenga
    máximo contraste."""
    img = Image.new("RGB", (ANCHO, ALTO))
    px = img.load()
    for y in range(ALTO):
        for x in range(0, ANCHO, 4):
            t = (x / ANCHO) * 0.55 + (1 - y / ALTO) * 0.45
            t = max(0.0, min(1.0, t))
            r = int(NOCHE[0] + (CARBON[0] - NOCHE[0]) * t)
            g = int(NOCHE[1] + (CARBON[1] - NOCHE[1]) * t)
            b = int(NOCHE[2] + (CARBON[2] - NOCHE[2]) * t)
            for dx in range(4):
                if x + dx < ANCHO:
                    px[x + dx, y] = (r, g, b)
    return img


def resplandor(capa, centro, radio, color, alpha_max):
    draw = ImageDraw.Draw(capa)
    pasos = 80
    for i in range(pasos, 0, -1):
        r = int(radio * i / pasos)
        alpha = int(alpha_max * (1 - i / pasos) ** 2.2)
        draw.ellipse(
            [centro[0] - r, centro[1] - r, centro[0] + r, centro[1] + r],
            fill=(*color, alpha),
        )


def ruido_fino(img, intensidad=6):
    """Grano sutil para que el gradiente no se vea plano/banded."""
    ruido = Image.effect_noise((ANCHO, ALTO), 24).convert("L")
    ruido_rgb = Image.merge("RGB", (ruido, ruido, ruido))
    return Image.blend(img, ruido_rgb, intensidad / 100)


def main():
    img = base_gradiente().convert("RGBA")

    # Halo dorado grande arriba a la derecha, donde después va a estar el
    # espacio "vacío" detrás del frasco.
    halo = Image.new("RGBA", img.size, (0, 0, 0, 0))
    resplandor(halo, (int(ANCHO * 0.82), int(ALTO * 0.22)), 620, ORO_CLARO, 60)
    resplandor(halo, (int(ANCHO * 0.68), int(ALTO * 0.55)), 480, CHAMPAN, 40)
    resplandor(halo, (int(ANCHO * 0.95), int(ALTO * 0.75)), 380, ORO_VIVO, 35)
    halo = halo.filter(ImageFilter.GaussianBlur(70))
    img = Image.alpha_composite(img, halo)

    # Un par de líneas de luz finas y diagonales, muy tenues, tipo destello
    # de vidrio -- evocan el "filo-oro" que ya usa el resto del sitio.
    lineas = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(lineas)
    for i in range(3):
        x0 = ANCHO * (0.55 + i * 0.14)
        ld.line(
            [(x0, -100), (x0 - 700, ALTO + 100)],
            fill=(*ORO_CLARO, 14 - i * 3),
            width=140,
        )
    lineas = lineas.filter(ImageFilter.GaussianBlur(60))
    img = Image.alpha_composite(img, lineas)

    img = img.convert("RGB")
    img = ruido_fino(img, intensidad=4)

    # Viñeta final para que los bordes (sobre todo abajo-izquierda, donde
    # va el texto) queden bien oscuros y con buen contraste.
    vineta = Image.new("L", img.size, 0)
    vd = ImageDraw.Draw(vineta)
    vd.ellipse(
        [-ANCHO * 0.3, -ALTO * 0.3, ANCHO * 1.05, ALTO * 1.15],
        fill=255,
    )
    vineta = vineta.filter(ImageFilter.GaussianBlur(220))
    negro = Image.new("RGB", img.size, (8, 6, 4))
    img = Image.composite(img, negro, vineta)

    ruta = r"C:\Users\maxip\Downloads\tufraganciaideal\tufraganciaideal\public\hero-bg.jpg"
    img.save(ruta, "JPEG", quality=92)
    print("public/hero-bg.jpg generado:", img.size)


if __name__ == "__main__":
    main()
