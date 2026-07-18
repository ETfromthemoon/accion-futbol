"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SplitText } from "@/components/ui/split-text";
import { Magnetic } from "@/components/ui/magnetic";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { VideoBackdrop } from "@/components/ui/video-backdrop";

export function Hero() {
  return (
    <section
      id="top"
      className="vignette relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Video de fondo cinematográfico (autoplay silencioso, loop) */}
      <VideoBackdrop
        src="/images/video-hero.mp4"
        poster="/images/poster-hero.webp"
        alt="Entrenamiento de Acción Fútbol en la cancha"
        priority
      />
      {/* Capas de oscurecimiento para legibilidad cinematográfica */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/45 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/45 to-transparent" />
      <Spotlight />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-20 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-background/40 px-4 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_oklch(0.7_0.19_47_/_0.6)]" />
          Academia de fútbol · Club Oriente, Las Condes
        </motion.p>

        <h1 className="font-display text-[clamp(2.75rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
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
          className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/55"
        >
          <span><strong className="font-semibold text-foreground/85">+350</strong> jugadores</span>
          <span className="text-foreground/25">/</span>
          <span><strong className="font-semibold text-foreground/85">6</strong> programas</span>
          <span className="text-foreground/25">/</span>
          <span>Entrenadores profesionales</span>
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
          <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">
            Scroll
          </span>
          <span className="h-7 w-px bg-gradient-to-b from-muted to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
