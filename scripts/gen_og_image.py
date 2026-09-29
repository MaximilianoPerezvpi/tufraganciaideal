#!/usr/bin/env python3
"""
Genera public/og.jpg (1200x630) para las previews de WhatsApp/redes.
Paleta y tipografía aproximan la del sitio (Georgia en vez de Fraunces,
que no está instalada localmente como .ttf). Reemplaza el og.jpg viejo,
que todavía decía "Decants y recargas de perfumes" del negocio anterior.
"""

from PIL import Image, ImageDraw, ImageFont

ANCHO, ALTO = 1200, 630

NOCHE = (20, 16, 12)
CARBON = (29, 23, 18)
CHAMPAN = (217, 182, 121)
ORO_CLARO = (235, 211, 163)
MARFIL = (242, 234, 220)
ARENA = (163, 147, 124)
BORDE = (58, 47, 36)

FUENTE_DIR = r"C:\Windows\Fonts"


def fuente(nombre, tam):
    return ImageFont.truetype(f"{FUENTE_DIR}\\{nombre}", tam)


def resplandor(img, centro, radio, color, intensidad_max=90):
    """Círculo radial suave, simulando el blur de fondo del sitio."""
    capa = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(capa)
    pasos = 60
    for i in range(pasos, 0, -1):
        r = int(radio * i / pasos)
        alpha = int(intensidad_max * (1 - i / pasos) ** 2)
        draw.ellipse(
            [centro[0] - r, centro[1] - r, centro[0] + r, centro[1] + r],
            fill=(*color, alpha),
        )
    img.paste(Image.alpha_composite(img.convert("RGBA"), capa).convert("RGB"), (0, 0))


def main():
    img = Image.new("RGB", (ANCHO, ALTO), NOCHE)
    resplandor(img, (ANCHO - 260, 120), 420, CHAMPAN, intensidad_max=70)
    draw = ImageDraw.Draw(img)

    # Título
    f_titulo = fuente("georgiab.ttf", 74)
    f_ideal = fuente("georgiai.ttf", 74)
    f_tag = fuente("arial.ttf", 30)
    f_kicker = fuente("arialbd.ttf", 20)

    x = 90
    draw.text((x, 70), "TuFragancia", font=f_titulo, fill=MARFIL)
    draw.text((x, 160), "Ideal", font=f_ideal, fill=CHAMPAN)

    draw.line([(x, 262), (x + 480, 262)], fill=BORDE, width=2)

    draw.text(
        (x, 300),
        "Perfumes Árabes y de Diseñador",
        font=f_tag,
        fill=MARFIL,
    )
    draw.text(
        (x, 345),
        "100% originales sellados · Envíos a todo Uruguay",
        font=f_tag,
        fill=ARENA,
    )

    # Frasco simplificado a la derecha (mismo motivo que Frasco.tsx, en plano).
    fx, fy = 900, 140
    fw, fh = 170, 330
    draw.rounded_rectangle(
        [fx - 24, fy - 60, fx + 24, fy - 20], radius=6, outline=CHAMPAN, width=3
    )
    draw.rectangle([fx - 30, fy - 20, fx + 30, fy + 6], outline=CHAMPAN, width=3)
    draw.rounded_rectangle(
        [fx - fw / 2, fy + 6, fx + fw / 2, fy + fh],
        radius=18,
        outline=CHAMPAN,
        width=3,
    )
    draw.rounded_rectangle(
        [fx - fw / 2 + 12, fy + 30, fx + fw / 2 - 12, fy + fh - 14],
        radius=10,
        fill=(176, 127, 53),
    )

    img.save(r"C:\Users\maxip\Downloads\tufraganciaideal\tufraganciaideal\public\og.jpg", "JPEG", quality=90)
    print("public/og.jpg regenerado:", img.size)


if __name__ == "__main__":
    main()
