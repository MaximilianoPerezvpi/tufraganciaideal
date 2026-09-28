import os
import re
import time
from io import BytesIO
import requests
from PIL import Image

PRODUCTOS_PATH = "src/data/productos.ts"
OUTPUT_DIR = "public/productos"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def parse_products(file_path):
    """Extrae slug, nombre y casa desde productos.ts"""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(
        r"slug:\s*['\"]([^'\"]+)['\"].*?nombre:\s*['\"]([^'\"]+)['\"].*?casa:\s*['\"]([^'\"]+)['\"]",
        re.DOTALL
    )
    products = []
    for match in pattern.finditer(content):
        slug, nombre, casa = match.groups()
        products.append({"slug": slug, "nombre": nombre, "casa": casa})
    return products

def get_bing_image_urls(query):
    """Obtiene las URLs directas de las imágenes usando Bing Images"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    encoded_query = requests.utils.quote(query)
    url = f"https://www.bing.com/images/search?q={encoded_query}&first=1"

    try:
        res = requests.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            # Extraer las URLs de las imágenes de alta resolución en los datos de Bing
            urls = re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', res.text)
            if not urls:
                urls = re.findall(r'"murl":"(https?://[^"]+)"', res.text)
            return urls
    except Exception as e:
        print(f"⚠️ Error buscando en Bing: {e}")
    return []

def download_product_image(product):
    slug = product["slug"]
    nombre = product["nombre"]
    casa = product["casa"]
    output_path = os.path.join(OUTPUT_DIR, f"{slug}.webp")

    if os.path.exists(output_path):
        print(f"⏩ [Omitido] {slug}.webp ya existe.")
        return True

    query = f"{casa} {nombre} perfume bottle frasco"
    print(f"🔍 Buscando: '{query}'...")

    urls = get_bing_image_urls(query)
    if not urls:
        print(f"⚠️ Sin resultados para {slug}")
        return False

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    # Probar las primeras 5 imágenes devueltas hasta que una funcione
    for img_url in urls[:5]:
        try:
            res = requests.get(img_url, headers=headers, timeout=8)
            if res.status_code == 200:
                img = Image.open(BytesIO(res.content))
                img = img.convert("RGBA")
                img.save(output_path, "WEBP", quality=85)
                print(f"✅ Guardado: {output_path}")
                return True
        except Exception:
            continue

    print(f"❌ No se pudo procesar la imagen para {slug}")
    return False

def main():
    products = parse_products(PRODUCTOS_PATH)
    print(f"📦 Se encontraron {len(products)} perfumes en el catálogo.\n")

    exitos = 0
    for idx, prod in enumerate(products, 1):
        print(f"[{idx}/{len(products)}]", end=" ")
        if download_product_image(prod):
            exitos += 1
        time.sleep(1.0)

    print(f"\n🎉 Proceso finalizado: {exitos}/{len(products)} imágenes guardadas en {OUTPUT_DIR}/")

if __name__ == "__main__":
    main()