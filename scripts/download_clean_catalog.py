#!/usr/bin/env python3
"""
Re-descarga validada de fotos individuales para el catálogo.

Lee src/data/productos.ts (slug/nombre/casa), busca en DuckDuckGo Images una
foto de frasco único por producto, la filtra por dimensiones/proporción/lista
negra, prioriza dominios de perfumería, normaliza el fondo a blanco y la
guarda como public/productos/<slug>.webp.

Idempotente: si el archivo del slug ya existe, no lo toca ni lo vuelve a
descargar. Podés cortar la corrida en cualquier momento y volver a
ejecutarla: retoma donde quedó.

Uso:
  python scripts/download_clean_catalog.py            # corre todo el catálogo
  python scripts/download_clean_catalog.py --limit 10  # prueba con 10 productos
"""

from __future__ import annotations

import argparse
import hashlib
import random
import re
import sys
import time
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image

# Consola de Windows por defecto usa cp1252 y no puede imprimir ✓/✗.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except Exception:
        pass

try:
    from ddgs import DDGS
except ImportError:  # paquete viejo, por si el nuevo no está instalado
    from duckduckgo_search import DDGS  # type: ignore

RAIZ = Path(__file__).resolve().parent.parent
PRODUCTOS_TS = RAIZ / "src" / "data" / "productos.ts"
DIR_SALIDA = RAIZ / "public" / "productos"

MIN_LADO = 250
RATIO_MIN, RATIO_MAX = 0.45, 1.35
MAX_RESULTADOS_POR_QUERY = 12
MAX_CANDIDATOS_A_PROBAR = 10  # por producto, sumando ambas queries

# Palabras que, si aparecen en la URL de la imagen, la descartan directo:
# banners, sets, ilustraciones, blogs, noticias, cualquier cosa que no sea
# "el frasco solo".
LISTA_NEGRA = [
    "set", "cofre", "sample", "decant", "review", "blog", "map", "news",
    "watch", "reloj", "banner", "group", "collection", "placeholder",
    "stock", "vector", "illustration", "logo", "article", "ad",
    # Bancos de fotos de pago: más riesgo de derechos que la foto oficial
    # de la marca o de un revendedor real.
    "alamy", "dreamstime", "shutterstock", "gettyimages", "istockphoto",
    "123rf", "depositphotos", "pixelsquid", "adobestock", "stock.adobe",
]

# Dominios de perfumería reales: se prueban primero.
DOMINIOS_PRIORIDAD = [
    "fragrantica.com", "parfumo.net", "notino", "sephora", "douglas",
    "lattafa", "armaf", "feelunique", "escentual", "perfume", "fragrance",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
}


def parsear_productos() -> list[dict[str, str]]:
    """Extrae slug/nombre/casa de productos.ts (formato fijo del generador)."""
    texto = PRODUCTOS_TS.read_text(encoding="utf-8")
    bloques = re.split(r"\n  \{\n", texto)[1:]
    productos = []
    for bloque in bloques:
        m_slug = re.search(r'slug:\s*"([^"]+)"', bloque)
        m_nombre = re.search(r'nombre:\s*"([^"]+)"', bloque)
        m_casa = re.search(r'casa:\s*"([^"]+)"', bloque)
        if m_slug and m_nombre and m_casa:
            productos.append(
                {"slug": m_slug.group(1), "nombre": m_nombre.group(1), "casa": m_casa.group(1)}
            )
    return productos


def es_lista_negra(url: str) -> bool:
    url_l = url.lower()
    return any(palabra in url_l for palabra in LISTA_NEGRA)


def prioridad(url: str, casa: str) -> int:
    """Menor = se prueba antes. Dominio de marca > dominio de perfumería > resto."""
    url_l = url.lower()
    casa_l = re.sub(r"[^a-z0-9]", "", casa.lower())
    if casa_l and casa_l in url_l:
        return 0
    if any(d in url_l for d in DOMINIOS_PRIORIDAD):
        return 1
    return 2


def candidatos_para(producto: dict[str, str]) -> list[str]:
    casa, nombre = producto["casa"], producto["nombre"]
    queries = [
        f"{casa} {nombre} perfume bottle white background",
        f"{casa} {nombre} bottle fragrantica",
    ]
    urls: list[str] = []
    vistos: set[str] = set()
    for q in queries:
        for intento in range(2):
            try:
                resultados = DDGS().images(q, max_results=MAX_RESULTADOS_POR_QUERY)
                break
            except Exception as e:
                if intento == 0:
                    time.sleep(12)
                    continue
                print(f"    (búsqueda '{q}' falló: {e})")
                resultados = []
        for r in resultados:
            url = r.get("image")
            if not url or url in vistos:
                continue
            vistos.add(url)
            if es_lista_negra(url):
                continue
            urls.append(url)
        time.sleep(random.uniform(1.5, 3))

    urls.sort(key=lambda u: prioridad(u, casa))
    return urls[:MAX_CANDIDATOS_A_PROBAR]


def descargar_y_validar(url: str) -> tuple[Image.Image, str] | None:
    """Devuelve (imagen, hash_md5_del_contenido) o None si no pasa los filtros.

    El hash es del archivo tal cual se descargó (antes de normalizar el
    fondo), así detecta "misma foto de origen" incluso si dos productos
    reciben exactamente el mismo candidato.
    """
    try:
        resp = requests.get(url, headers=HEADERS, timeout=8)
        resp.raise_for_status()
        img = Image.open(BytesIO(resp.content))
        img.load()
    except Exception:
        return None

    ancho, alto = img.size
    if ancho < MIN_LADO or alto < MIN_LADO:
        return None
    ratio = ancho / alto
    if not (RATIO_MIN <= ratio <= RATIO_MAX):
        return None
    return img, hashlib.md5(resp.content).hexdigest()


def normalizar_y_guardar(img: Image.Image, destino: Path) -> None:
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        img = img.convert("RGBA")
        fondo = Image.new("RGB", img.size, (255, 255, 255))
        fondo.paste(img, mask=img.split()[-1])
        img = fondo
    else:
        img = img.convert("RGB")
    destino.parent.mkdir(parents=True, exist_ok=True)
    img.save(destino, "WEBP", quality=85)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=None)
    args = parser.parse_args()

    productos = parsear_productos()
    if args.limit:
        productos = productos[: args.limit]

    # Hashes de todo lo que ya está en disco: una foto usada para un producto
    # NUNCA se vuelve a asignar a otro, ni siquiera en corridas separadas.
    hashes_usados: set[str] = set()
    for archivo in DIR_SALIDA.glob("*.webp"):
        hashes_usados.add(hashlib.md5(archivo.read_bytes()).hexdigest())

    print(f"{len(productos)} productos a procesar.\n")

    descargados = omitidos = fallidos = repetidos = 0

    for i, p in enumerate(productos, 1):
        destino = DIR_SALIDA / f"{p['slug']}.webp"
        if destino.exists():
            omitidos += 1
            print(f"[{i}/{len(productos)}] {p['slug']}: ya existe, se omite.")
            continue

        print(f"[{i}/{len(productos)}] {p['slug']}: buscando...")
        candidatos = candidatos_para(p)

        encontrado = False
        for url in candidatos:
            resultado = descargar_y_validar(url)
            if resultado is None:
                continue
            img, hash_contenido = resultado
            if hash_contenido in hashes_usados:
                # Misma foto que ya le asignamos a OTRO producto: se descarta,
                # nunca se reutiliza.
                repetidos += 1
                continue
            normalizar_y_guardar(img, destino)
            hashes_usados.add(hash_contenido)
            print(f"    ✓ {url}")
            descargados += 1
            encontrado = True
            break

        if not encontrado:
            fallidos += 1
            print("    ✗ sin candidato válido.")

    print(
        f"\nListo. Descargadas: {descargados} · Ya existían: {omitidos} · "
        f"Candidatos repetidos descartados: {repetidos} · "
        f"Sin candidato válido: {fallidos}"
    )


if __name__ == "__main__":
    main()
