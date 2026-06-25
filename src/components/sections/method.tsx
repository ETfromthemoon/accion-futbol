import { PILLARS } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";

export function Method() {
  return (
    <section id="metodo" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <ParallaxImage
            src="/images/action-strike.webp"
            alt="Jugador rematando el balón en pleno entrenamiento"
            className="aspect-[4/5] rounded-[1.5rem] border border-border"
          />
        </Reveal>

        <div>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              El método
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-balance">
              No es picarse un partido. Es entrenar como en un club.
            </h2>
            <p className="mt-5 text-lg text-foreground/75">
              Cada sesión tiene un plan: técnica, táctica y físico que avanzan
              contigo. Da igual si vienes del sillón o si jugaste toda la vida —
              te ubicamos en el grupo correcto y te hacemos mejorar.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-col gap-px">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.12}>
                <div className="border-t border-border py-6">
                  <h3 className="font-display text-xl font-bold">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-foreground/70">{pillar.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
