"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, MessageCircle, Navigation, Users } from "lucide-react";
import { PROGRAMS, PRORATED_NOTE, whatsappLink, type Cancha, type Sede } from "@/lib/site";
import { VideoBackdrop } from "@/components/ui/video-backdrop";

const SWAP = { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as const;

type Props = {
  sede: Sede;
  canchaId: string;
  programId: string;
  highlightId: string | null;
  onHover: (id: string | null) => void;
  onSelectCancha: (id: string) => void;
  onSelectProgram: (id: string) => void;
  onBack: () => void;
  backRef?: React.Ref<HTMLButtonElement>;
};

// Ficha de la sede: canchas reales y las series (programas) que entrenan en cada una.
export function SedePanel({
  sede,
  canchaId,
  programId,
  highlightId,
  onHover,
  onSelectCancha,
  onSelectProgram,
  onBack,
  backRef,
}: Props) {
  const cancha = sede.canchas.find((c) => c.id === canchaId) ?? sede.canchas[0];
  const programs = PROGRAMS.filter((p) => cancha.programIds.includes(p.id));
  const program = programs.find((p) => p.id === programId) ?? programs[0];

  return (
    <div className="sede-panel">
      <button ref={backRef} type="button" onClick={onBack} className="sede-back">
        <ArrowLeft aria-hidden="true" className="size-4" /> Volver al mapa de Santiago
      </button>

      <h3 className="sede-title">{sede.name}</h3>
      <p className="sede-address">
        <MapPin aria-hidden="true" className="size-4" /> {sede.address}
        <a href={sede.mapsUrl} target="_blank" rel="noopener noreferrer" className="sede-directions">
          <Navigation aria-hidden="true" className="size-3.5" /> Cómo llegar
        </a>
      </p>

      <div className="sede-canchas" role="group" aria-label="Canchas de Acción Fútbol en la sede">
        {sede.canchas.map((c: Cancha) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={c.id === cancha.id}
            onClick={() => onSelectCancha(c.id)}
            onPointerEnter={() => onHover(c.id)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(c.id)}
            onBlur={() => onHover(null)}
            className={`sede-cancha ${c.id === cancha.id ? "is-selected" : ""} ${c.id === highlightId ? "is-hover" : ""}`}
          >
            <span className="sede-cancha-number">{c.label.replace("Cancha ", "")}</span>
            <span className="sede-cancha-programs">
              {PROGRAMS.filter((p) => c.programIds.includes(p.id)).map((p) => p.name).join(" · ")}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${cancha.id}-${program.id}`}
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
          transition={SWAP}
          className="sede-series"
          aria-live="polite"
        >
          <div className="sede-series-media">
            {program.video && program.poster ? (
              <VideoBackdrop src={program.video} poster={program.poster} alt={`Entrenamiento ${program.name}`} />
            ) : (
              <Image src={program.image} alt={`Entrenamiento ${program.name}`} fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" />
            )}
            <div className="sede-series-shade" />
            <p className="sede-series-tag">
              {cancha.label} · así se entrena
            </p>
          </div>

          {programs.length > 1 && (
            <div className="sede-series-switch" role="group" aria-label={`Series en ${cancha.label}`}>
              {programs.map((p) => (
                <button key={p.id} type="button" aria-pressed={p.id === program.id} onClick={() => onSelectProgram(p.id)}>
                  {p.name}
                </button>
              ))}
            </div>
          )}

          <div className="sede-series-body">
            <p className="sede-series-name">{program.name}</p>
            <ul>
              <li><Users aria-hidden="true" />{program.ages}</li>
              {(program.scheduleSlots ?? [program.schedule]).map((slot) => (
                <li key={slot}><Clock aria-hidden="true" />{slot}</li>
              ))}
            </ul>
            <ul className="sede-series-promises" aria-label="Lo que te proponemos">
              {program.promises.map((promise) => (
                <li key={promise}><Check aria-hidden="true" />{promise}</li>
              ))}
            </ul>
            {program.note && <p className="sede-series-note">{program.note}</p>}
            <p className="sede-series-price">
              <strong>{program.monthly}</strong>
              <span>Inscripción {program.enrollment}</span>
              <span>{PRORATED_NOTE}</span>
            </p>
            <a
              href="#inscripcion"
              className="sede-series-cta"
              onClick={() => window.dispatchEvent(new CustomEvent("select-program", { detail: program.id }))}
            >
              Probar gratis {program.name} <ArrowRight aria-hidden="true" className="size-4" />
            </a>
            <a
              href={whatsappLink(`Hola, quiero agendar una clase de prueba en ${program.name} en Acción Fútbol.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="sede-series-whatsapp"
            >
              <MessageCircle aria-hidden="true" className="size-4" /> Prefiero coordinar por WhatsApp
            </a>
          </div>
        </motion.div>
      </AnimatePresence>

      {cancha.approximate && (
        <p className="sede-note">
          OpenStreetMap no numera las canchas 16 y 17: en el plano marcamos su sector dentro del club.
        </p>
      )}
    </div>
  );
}
