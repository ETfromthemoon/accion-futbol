"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { PROGRAMS, type Program } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";

function selectProgram(id: string) {
  window.dispatchEvent(new CustomEvent("select-program", { detail: id }));
}

function ProgramCard({ program, index }: { program: Program; index: number }) {
  return (
    <Reveal delay={(index % 3) * 0.1} className="h-full">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface/50"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={program.image}
            alt={`Programa ${program.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <p className="text-xs font-semibold text-primary">
              {program.tagline}
            </p>
            <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
              {program.name}
            </h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <dl className="flex flex-col gap-2.5 text-sm text-foreground/75">
            <div className="flex items-center gap-2.5">
              <Users className="size-4 shrink-0 text-primary" />
              <span>{program.ages}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0 text-primary" />
              <span>{program.schedule}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span>{program.court} · Club Oriente</span>
            </div>
          </dl>

          <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
            <div>
              <p className="font-display text-lg font-bold">{program.monthly}</p>
              <p className="text-xs text-muted">
                Inscripción {program.enrollment}
              </p>
            </div>
          </div>

          <a
            href="#inscripcion"
            onClick={() => selectProgram(program.id)}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-3 font-display text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Probar gratis este programa
            <ArrowRight className="size-4" />
          </a>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Programs() {
  return (
    <section id="programas" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="section-tag">Programas</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-balance">
            Un grupo para cada edad, cada horario y cada nivel.
          </h2>
          <p className="mt-5 text-lg text-foreground/75">
            Elige el tuyo y agenda una clase de prueba gratis. Sin compromiso:
            primero juegas, después decides.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program, i) => (
            <ProgramCard key={program.id} program={program} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
