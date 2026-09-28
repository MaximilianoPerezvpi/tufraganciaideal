#!/usr/bin/env python3
"""
Detecta imágenes duplicadas en public/productos/ por hash MD5 de contenido.

No borra nada por sí solo: imprime los grupos de duplicados para que se
decida a mano cuál es el banner genérico y cuáles son fotos legítimas que
casualmente coinciden (poco probable, pero mejor confirmarlo antes de
borrar). Usalo con --borrar-menos-uno para efectivamente eliminar todas las
copias de un grupo salvo la primera (alfabética), una vez confirmado.
"""

import argparse
import hashlib
from collections import defaultdict
from pathlib import Path

DIR_PRODUCTOS = Path(__file__).resolve().parent.parent / "public" / "productos"
EXTENSIONES = {".webp", ".jpg", ".jpeg", ".png"}


def hash_md5(ruta: Path) -> str:
    h = hashlib.md5()
    with ruta.open("rb") as f:
        for bloque in iter(lambda: f.read(65536), b""):
            h.update(bloque)
    return h.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--borrar-menos-uno",
        action="store_true",
        help="Borra todas las copias de cada grupo duplicado salvo la primera (alfabética).",
    )
    parser.add_argument(
        "--borrar-todas",
        action="store_true",
        help="Borra TODAS las copias de cada grupo duplicado (para banners que no le pertenecen a ningún producto).",
    )
    args = parser.parse_args()

    archivos = sorted(
        p for p in DIR_PRODUCTOS.iterdir() if p.suffix.lower() in EXTENSIONES
    )

    por_hash: dict[str, list[Path]] = defaultdict(list)
    for archivo in archivos:
        por_hash[hash_md5(archivo)].append(archivo)

    grupos_duplicados = {h: ps for h, ps in por_hash.items() if len(ps) > 1}

    if not grupos_duplicados:
        print("No se encontraron imágenes duplicadas.")
        return

    print(f"{len(grupos_duplicados)} grupo(s) de imágenes idénticas:\n")
    total_archivos_duplicados = 0
    for h, ps in sorted(grupos_duplicados.items(), key=lambda kv: -len(kv[1])):
        print(f"  hash {h}  ({len(ps)} archivos, {ps[0].stat().st_size:,} bytes)")
        for p in ps:
            print(f"    - {p.name}")
        total_archivos_duplicados += len(ps)
        print()

    print(f"Total de archivos involucrados en duplicados: {total_archivos_duplicados}")

    if args.borrar_menos_uno or args.borrar_todas:
        borrados = 0
        for ps in grupos_duplicados.values():
            objetivo = ps if args.borrar_todas else ps[1:]
            for p in objetivo:
                p.unlink()
                borrados += 1
        print(f"\nBorrados {borrados} archivo(s).")


if __name__ == "__main__":
    main()
