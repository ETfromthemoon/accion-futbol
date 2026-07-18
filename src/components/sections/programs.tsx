"use client";

import Image from "next/image";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { PROGRAMS, type Program } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { VideoBackdrop } from "@/components/ui/video-backdrop";

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
    <section className="relative flex min-h-[62vh] items-center overflow-hidden border-t border-border">
      {/* Fondo a sangre: video o foto real */}
      {program.video && program.poster ? (
        <VideoBackdrop
          src={program.video}
          poster={program.poster}
          alt={`Programa ${program.name}`}
        />
      ) : (
        <Image
          src={program.image}
          alt={`Programa ${program.name}`}
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Oscurecido general + gradiente hacia el lado del contenido */}
      <div className="absolute inset-0 bg-background/45" />
      <div
        className={cn(
          "absolute inset-0",
          reversed
            ? "bg-gradient-to-l from-background via-background/70 to-transparent"
            : "bg-gradient-to-r from-background via-background/70 to-transparent",
        )}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className={cn("max-w-md", reversed && "ml-auto")}>
          <Reveal>
            <p className="text-sm font-semibold text-primary">
              {program.tagline}
            </p>
            <h3 className="mt-2 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
              {program.name}
            </h3>

            <dl className="mt-6 flex flex-col gap-3 text-foreground/85">
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

            <div className="glass-panel mt-7 flex items-center justify-between rounded-2xl p-5">
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
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Probar gratis este programa
              <ArrowRight className="size-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Programs() {
  return (
    <section id="programas" className="relative">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
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

      {PROGRAMS.map((program, i) => (
        <ProgramBanner key={program.id} program={program} index={i} />
      ))}
    </section>
  );
}
