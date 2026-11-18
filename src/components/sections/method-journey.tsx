"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleDot, Crosshair, MoveUpRight, UsersRound } from "lucide-react";
import { METHOD_STEPS } from "@/lib/site";

const icons = [CircleDot, Crosshair, MoveUpRight, UsersRound];
const routes = [
  "M80 340 C180 270 160 170 275 210 S400 295 520 120",
  "M95 345 C190 375 205 180 305 240 S420 200 515 130",
  "M70 390 C145 330 210 370 285 250 S435 250 530 90",
  "M90 315 C170 200 225 235 300 180 S440 300 520 140",
];

export function MethodJourney() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = METHOD_STEPS[active];
  const next = (direction: number) => setActive((index) => (index + direction + METHOD_STEPS.length) % METHOD_STEPS.length);
  const transition = { duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return (
    <div className="method-playbook">
      <div className="method-playbook-heading flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="section-tag method-kicker">POR DENTRO DEL ENTRENAMIENTO</p>
          <h2 id="how-title" className="mt-5 max-w-3xl font-display font-black uppercase">Un método que <span>se vive</span> en la cancha.</h2>
        </div>
        <p className="method-lede max-w-xs text-sm leading-relaxed sm:text-base">Explora el recorrido: de encontrar tu grupo a volver cada semana con más juego y más equipo.</p>
      </div>

      <div className="method-board mt-10 grid overflow-hidden lg:grid-cols-[.82fr_1.18fr]">
        <div className="method-board-nav p-5 sm:p-8 lg:p-9">
          <div className="method-board-top flex items-center justify-between gap-3">
            <span>LA JUGADA COMPLETA</span><span>{String(active + 1).padStart(2, "0")} / 04</span>
          </div>
          <div className="method-track mt-7 space-y-2" role="group" aria-label="Fases de la metodología">
            {METHOD_STEPS.map((item, index) => {
              const Icon = icons[index];
              return (
                <button key={item.phase} type="button" onClick={() => setActive(index)} aria-pressed={active === index}
                  className={`method-step flex w-full items-center gap-4 p-4 text-left sm:p-5 ${active === index ? "is-active" : ""}`}>
                  <span className="method-step-icon flex size-11 shrink-0 items-center justify-center rounded-full"><Icon className="size-5" strokeWidth={1.6} aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1"><span className="method-step-phase block text-[.65rem] font-bold uppercase tracking-[.13em]">{item.phase}</span><span className="method-step-title mt-1 block font-display text-lg font-bold leading-tight">{item.title}</span></span>
                  <ArrowUpRight className="method-step-arrow size-4 shrink-0" aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <div className="method-board-hint mt-7 flex items-center gap-3 text-xs"><span className="method-hint-line" /> Elige una fase para seguir la jugada</div>
        </div>

        <div className="method-scene relative isolate min-h-[530px] overflow-hidden sm:min-h-[590px]">
          <AnimatePresence initial={false}>
            <motion.div key={step.image} className="absolute inset-0" initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 1.02 }} transition={transition}>
              <Image src={step.image} alt={step.imageAlt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
          <div className="method-scene-shade absolute inset-0" aria-hidden="true" />
          <div className="method-scene-grid absolute inset-0" aria-hidden="true" />
          <svg className="method-route absolute inset-0 size-full" viewBox="0 0 600 500" preserveAspectRatio="none" aria-hidden="true">
            <circle cx="80" cy="340" r="8" fill="#ff8cb9" />
            <motion.path key={active} d={routes[active]} fill="none" stroke="#ff9dc5" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 9"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 1.3, ease: "easeInOut" }} />
            <circle cx="520" cy="120" r="18" fill="none" stroke="#ff9dc5" strokeWidth="1.5" />
            <circle cx="520" cy="120" r="4" fill="#ff9dc5" />
          </svg>
          <div className="method-scene-top absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-6 sm:p-9">
            <span className="method-scene-chip">ACCIÓN FÚTBOL / PLAYBOOK</span><span className="method-scene-counter font-display">0{active + 1}<small> / 04</small></span>
          </div>
          <div className="method-scene-content absolute inset-x-0 bottom-0 px-6 pb-7 pt-20 sm:px-10 sm:pb-10">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div key={step.phase} initial={reduceMotion ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -15 }} transition={transition}>
                <span className="method-scene-cue">{step.cue} / {step.phase}</span>
                <h3 className="mt-3 max-w-lg font-display text-3xl font-black uppercase leading-[.98] tracking-[-.05em] sm:text-5xl">{step.title}</h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed sm:text-base">{step.description}</p>
                <p className="method-scene-detail mt-4 max-w-lg border-l-2 pl-4 text-xs leading-relaxed sm:text-sm">{step.detail}</p>
              </motion.div>
            </AnimatePresence>
            <div className="method-scene-footer mt-7 flex items-center justify-between border-t pt-5">
              <span className="text-[.65rem] font-bold uppercase tracking-[.15em]">SIGUE LA JUGADA</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => next(-1)} aria-label="Fase anterior" className="method-nav-arrow flex size-11 items-center justify-center rounded-full"><ArrowLeft className="size-4" aria-hidden="true" /></button>
                <button type="button" onClick={() => next(1)} aria-label="Fase siguiente" className="method-nav-arrow flex size-11 items-center justify-center rounded-full"><ArrowRight className="size-4" aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="method-playbook-bottom flex flex-wrap items-center justify-between gap-4 px-1 py-5 text-xs">
        <p>Técnica · Táctica · Preparación física · Comunidad</p>
        <a href="#inscripcion" className="inline-flex min-h-11 items-center gap-2 font-bold">Vive tu primera clase gratis <ArrowUpRight className="size-4" aria-hidden="true" /></a>
      </div>
    </div>
  );
}
