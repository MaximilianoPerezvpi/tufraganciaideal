import { navegacion, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-borde bg-carbon">
      <div aria-hidden className="filo-oro h-px w-full" />
      <div className="marco flex flex-col gap-10 py-14 md:flex-row md:justify-between">
        <div className="max-w-[34ch]">
          <p className="font-display text-[1.4rem] text-marfil">
            TuFragancia<span className="italic text-champan">Ideal</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-arena">
            Perfumes originales sellados. {site.ciudad}, {site.pais}.
          </p>
        </div>

        <nav aria-label="Pie de página" className="flex flex-col gap-3 text-sm">
          {navegacion.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-arena transition-colors hover:text-marfil"
            >
              {item.etiqueta}
            </a>
          ))}
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-arena transition-colors hover:text-marfil"
          >
            @{site.instagram}
          </a>
        </nav>
      </div>

      <div className="marco border-t border-borde py-6">
        <p className="text-micro text-arena/70">
          © {new Date().getFullYear()} {site.nombre}. Vendemos frascos
          originales sellados; no somos distribuidores oficiales de las marcas
          mencionadas. Precios en pesos uruguayos, IVA incluido.
        </p>
      </div>
    </footer>
  );
}
