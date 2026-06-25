"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

// Banda cinematográfica a sangre completa con parallax. Corta el ritmo de las
// secciones y da un respiro de pura imagen + una frase contundente.
export function StatementBreak() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      className="vignette relative flex min-h-[70vh] items-center overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0 h-[124%] -top-[12%]">
        <Image
          src="/images/boots.webp"
          alt="Botines de fútbol sobre la cancha, listos para entrenar"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl font-display text-[clamp(2.25rem,6vw,4.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]"
        >
          La cancha te está <span className="text-primary">esperando</span>.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.12, duration: 0.7 }}
          className="mt-5 max-w-md text-lg text-foreground/75"
        >
          Tu primera clase es gratis. Lo único que tienes que hacer es venir.
        </motion.p>
        <motion.a
          href="#inscripcion"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.22, duration: 0.7 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-display font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Agenda tu clase de prueba
          <ArrowRight className="size-4" />
        </motion.a>
      </div>
    </section>
  );
}
