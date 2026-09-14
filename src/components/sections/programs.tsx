"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { PROGRAMS } from "@/lib/site";
import { VideoBackdrop } from "@/components/ui/video-backdrop";

export function Programs() {
  const [selected, setSelected] = useState(0);
  const program = PROGRAMS[selected];
  return (
    <section id="programas" className="program-experience">
      <div className="experience-heading"><p className="section-tag">02 / Encuentra tu equipo</p><h2>Tu fútbol.<br /><span>Tu momento.</span></h2><p>Hay una forma de jugar para cada etapa de tu vida. Elige tu categoría y ven a vivirla.</p></div>
      <div className="program-console">
        <div className="program-selector" role="group" aria-label="Elige tu categoría">
          {PROGRAMS.map((item, index) => (
            <button type="button" key={item.id} aria-pressed={selected === index} aria-controls="program-detail" onClick={() => setSelected(index)} className={`program-choice ${selected === index ? "is-selected" : ""}`}>
              <span className="choice-number">0{index + 1}</span><span className="choice-title">{item.name}<small>{item.tagline}</small></span><ArrowUpRight aria-hidden="true" />
            </button>
          ))}
          <p className="selector-note">Primero juegas.<br /><strong>Después decides.</strong></p>
        </div>
        <div className="program-scene" id="program-detail" aria-label={`Detalles de ${program.name}`}>
          <div className="program-media" key={program.id}>
            {program.video && program.poster ? <VideoBackdrop src={program.video} poster={program.poster} alt={`Programa ${program.name}`} /> : <Image src={program.image} alt={`Programa ${program.name}`} fill sizes="(min-width: 1024px) 65vw, 100vw" className="object-cover" />}
            <div className="program-media-shade" />
            <span className="scene-number" aria-hidden="true">0{selected + 1}</span>
            <div className="scene-title"><p>{program.tagline}</p><h3>{program.name}</h3></div>
          </div>
          <div className="program-specs" aria-live="polite" aria-atomic="true">
            <ul><li><Users />{program.ages}</li><li><Clock />{program.schedule}</li><li><MapPin />{program.court} · Club Oriente</li></ul>
            <div className="program-price"><strong>{program.monthly}</strong><span>Inscripción {program.enrollment}</span></div>
            <a href="#inscripcion" aria-label={`Probar gratis ${program.name}`} onClick={() => window.dispatchEvent(new CustomEvent("select-program", { detail: program.id }))}>Reservar mi clase gratis <ArrowRight /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
