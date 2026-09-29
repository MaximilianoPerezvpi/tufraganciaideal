import Image from "next/image";
import { ShieldCheck } from "lucide-react";

/**
 * Banner editorial a mitad de la home: primer plano del relieve YSL como
 * fondo, con overlay bien oscuro para que el sello de garantía se lea
 * como un certificado, no como una foto de producto más.
 */
export default function LuxuryBanner() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/luxury-banner.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="marco relative z-10 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white/5 px-4 py-2 text-micro tracking-[0.15em] text-champan backdrop-blur-md">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          100% ORIGINALES SELLADOS
        </span>

        <h2 className="mt-6 max-w-[24ch] font-display text-[length:var(--text-medio)] font-light leading-tight text-marfil">
          Garantía de origen en cada fragancia
        </h2>

        <p className="mt-5 max-w-[52ch] leading-relaxed text-arena">
          Trabajamos únicamente con distribuidores oficiales e importaciones
          directas. Cada caja llega con su celofán y código de lote
          verificado.
        </p>
      </div>
    </section>
  );
}
