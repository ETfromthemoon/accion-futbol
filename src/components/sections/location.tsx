import { MapPin, Phone, Mail } from "lucide-react";
import { CONTACT } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";

export function Location() {
  return (
    <section id="sede" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            La sede
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-balance">
            Entrenamos en Club Oriente, Las Condes.
          </h2>
          <p className="mt-5 text-lg text-foreground/75">
            Canchas profesionales, fácil acceso y estacionamiento. Aquí
            entrenan todos nuestros programas, de lunes a sábado.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            <li className="flex items-center gap-3">
              <MapPin className="size-5 shrink-0 text-primary" />
              <span>Nueva Bilbao 9495, Las Condes — Club Oriente</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-5 shrink-0 text-primary" />
              <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-primary">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-5 shrink-0 text-primary" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-primary">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <ParallaxImage
            src="/images/balls-trio.webp"
            alt="Balones en la cancha de Club Oriente"
            className="aspect-[4/3] rounded-[1.5rem] border border-border"
          />
        </Reveal>
      </div>
    </section>
  );
}
