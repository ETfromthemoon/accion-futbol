"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SplitText } from "@/components/ui/split-text";
import { Magnetic } from "@/components/ui/magnetic";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Imagen de fondo: partido nocturno bajo reflectores */}
      <Image
        src="/images/hero-night.webp"
        alt="Partido de fútbol nocturno bajo los reflectores del estadio"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Capas de oscurecimiento para legibilidad cinematográfica */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/55 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      <Spotlight />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-20 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-muted backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          Academia de fútbol · Club Oriente, Las Condes
        </motion.p>

        <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[0.92] tracking-tight text-balance">
          <span className="block">
            <SplitText text="Despierta" delay={0.12} />
          </span>
          <span className="block text-primary">
            <SplitText text="con pasión." delay={0.12} startIndex={1} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-lg text-foreground/80 sm:text-xl"
        >
          Metodología profesional para adultos, niños, jóvenes y mujeres.
          Encuentra tu grupo por edad y nivel, ven a una clase de prueba gratis
          y vuelve a la cancha.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        >
          <Magnetic>
            <a href="#inscripcion" aria-label="Agendar clase de prueba">
              <ShimmerButton>
                Agenda tu clase de prueba
                <ArrowRight className="size-4" />
              </ShimmerButton>
            </a>
          </Magnetic>
          <a
            href="#programas"
            className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-display font-semibold text-foreground transition-colors hover:bg-surface"
          >
            Ver programas
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-8 font-mono text-xs uppercase tracking-widest text-muted"
        >
          +350 jugadores · 6 programas · Entrenadores profesionales
        </motion.p>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        className="absolute bottom-5 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-1.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Scroll
          </span>
          <span className="h-7 w-px bg-gradient-to-b from-muted to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
