import Image from "next/image";
import { PILLARS } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";

export function Method() {
  return (
    <section id="metodo" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="section-tag">Nuestro método</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-balance">
            No es picarse un partido. Es entrenar como en un club.
          </h2>
          <p className="mt-5 text-lg text-foreground/75">
            Cada sesión tiene un plan: técnica, táctica y físico que avanzan
            contigo. Da igual si vienes del sillón o si jugaste toda la vida: te
            ubicamos en el grupo correcto y te hacemos mejorar.
          </p>
        </Reveal>

        {/* Banda cinematográfica a lo ancho: la foto se muestra completa y nítida */}
        <Reveal delay={0.1}>
          <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] border border-border sm:aspect-[3/1]">
            <Image
              src="/images/keeper-save.webp"
              alt="Arquero de Acción Fútbol volando para atajar el balón"
              fill
              sizes="(max-width: 768px) 100vw, 1120px"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px sm:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.1}>
              <div className="h-full border-t border-border py-6 sm:pr-6">
                <h3 className="font-display text-xl font-bold">{pillar.title}</h3>
                <p className="mt-2 text-foreground/70">{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
