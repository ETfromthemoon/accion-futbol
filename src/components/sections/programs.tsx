"use client";

import Image from "next/image";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { PROGRAMS, type Program } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";

function selectProgram(id: string) {
  window.dispatchEvent(new CustomEvent("select-program", { detail: id }));
}

function ProgramBanner({
  program,
  index,
}: {
  program: Program;
  index: number;
}) {
  const reversed = index % 2 === 1;

  return (
    <div className="border-b border-border py-14 first:pt-0 last:border-b-0 sm:py-20">
      <div
        className={`mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 ${
          reversed ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal>
          <ParallaxImage
            src={program.image}
            alt={`Programa ${program.name}`}
            className="aspect-[16/10] rounded-[1.5rem] border border-border"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-sm font-semibold text-primary">
            {program.tagline}
          </p>
          <h3 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            {program.name}
          </h3>

          <dl className="mt-6 flex flex-col gap-3 text-foreground/75">
            <div className="flex items-center gap-3">
              <Users className="size-4 shrink-0 text-primary" />
              <span>{program.ages}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-primary" />
              <span>{program.schedule}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span>{program.court} · Club Oriente</span>
            </div>
          </dl>

          <div className="glass mt-7 flex items-center justify-between rounded-2xl p-5">
            <div>
              <p className="font-display text-xl font-bold">
                {program.monthly}
              </p>
              <p className="text-sm text-muted">
                Inscripción {program.enrollment}
              </p>
            </div>
          </div>

          <a
            href="#inscripcion"
            onClick={() => selectProgram(program.id)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3.5 font-display text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Probar gratis este programa
            <ArrowRight className="size-4" />
          </a>
        </Reveal>
      </div>
    </div>
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
      </div>

      <div className="mt-14">
        {PROGRAMS.map((program, i) => (
          <ProgramBanner key={program.id} program={program} index={i} />
        ))}
      </div>
    </section>
  );
}
