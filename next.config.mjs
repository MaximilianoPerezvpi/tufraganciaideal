/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Formatos modernos: Vercel sirve AVIF/WebP automaticamente segun el navegador.
    formats: ["image/avif", "image/webp"],
    // Breakpoints alineados a la grilla del catalogo (2 / 3 / 4 columnas).
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600],
    imageSizes: [96, 160, 240, 320, 420],
  },
};

export default nextConfig;
