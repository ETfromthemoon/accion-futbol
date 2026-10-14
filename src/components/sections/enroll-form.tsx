import Image from "next/image";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { BookingFlow } from "@/components/sections/booking/booking-flow";

const BENEFITS = [
  "Una clase completa, gratis y sin compromiso",
  "Eliges el día: te mostramos las próximas fechas reales",
  "Te ubicamos en el grupo según tu edad y nivel",
  "La agregas a tu calendario con un toque",
] as const;

export function EnrollForm() {
  return (
    <section id="inscripcion" className="booking-section relative overflow-hidden py-24 sm:py-32">
      {/* Fondo cinematográfico */}
      <Image
        src="/images/adults-duel.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="section-tag">Clase de prueba gratis</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-balance">
            Elige tu día y nos vemos en la cancha.
          </h2>
          <p className="mt-5 text-lg text-foreground/75">
            Cinco preguntas rápidas y sales con tu clase agendada. Sin costo y
            sin compromiso: vienes, entrenas y luego decides.
          </p>

          <ul className="mt-8 flex flex-col gap-3 text-foreground/80">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>

          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
          >
            <MessageCircle aria-hidden="true" className="size-4 text-primary" />
            ¿Prefieres WhatsApp? Escríbenos directo
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-panel relative rounded-[1.75rem] p-6 sm:p-8">
            <BookingFlow />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
