"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Clock, MapPin, MessageCircle, Users, X } from "lucide-react";
import { PROGRAMS, whatsappLink, type Program } from "@/lib/site";

// Escena: cancha de fondo + 5 personajes en fila, ordenados por edad.
// Imágenes generadas con scripts/generate-category-art.mjs.
const ORDER = ["kids", "pro-jovenes", "femenino", "am-adultos", "pm-adultos"] as const;
const SQUAD: readonly Program[] = ORDER.map((id) => PROGRAMS.find((p) => p.id === id)).filter(
  (p): p is Program => Boolean(p),
);
const ART = "/images/categorias";
// Estatura relativa: una niña de 8 años no mide lo mismo que un adulto.
const HEIGHT: Record<string, number> = { kids: 0.72, "pro-jovenes": 0.95 };
const HIDE_DELAY_MS = 140; // margen para mover el mouse del personaje a su ficha
const EASE = [0.22, 1, 0.36, 1] as const;

export function Programs() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  // Con teclado (Enter/Espacio) el foco salta a la ficha, para llegar a su CTA.
  const focusInfoOnMount = useRef(false);
  const active = SQUAD.find((p) => p.id === activeId) ?? null;
  const activeIndex = active ? SQUAD.indexOf(active) : -1;

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  function show(id: string) {
    window.clearTimeout(hideTimer.current);
    setActiveId(id);
  }

  function scheduleHide() {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setActiveId(null), HIDE_DELAY_MS);
  }

  return (
    <section id="programas" className="program-experience">
      <div className="experience-heading">
        <p className="section-tag">02 / Encuentra tu equipo</p>
        <h2>Tu fútbol.<br /><span>Tu momento.</span></h2>
        <p>Cinco categorías, una cancha. Elige un jugador y entra a su mundo.</p>
      </div>

      <div
        className={`squad-stage ${active ? "is-focused" : ""}`}
        // En pantallas táctiles, tocar fuera de un jugador o de su ficha la cierra.
        onClick={(e) => {
          if (!(e.target as Element).closest(".squad-player, .squad-info")) setActiveId(null);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Escape" || !activeId) return;
          const id = activeId;
          setActiveId(null);
          buttons.current.get(id)?.focus();
        }}
      >
        <div className="squad-bg">
          <Image src={`${ART}/bg-base.webp`} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        {SQUAD.map((p) => (
          <motion.div
            key={p.id}
            className="squad-bg"
            initial={false}
            animate={{ opacity: p.id === activeId ? 1 : 0, scale: p.id === activeId ? 1 : 1.08 }}
            transition={{ duration: 0.8, ease: EASE }}
            aria-hidden="true"
          >
            <Image src={`${ART}/bg-${p.id}.webp`} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
        ))}
        <div className="squad-shade" aria-hidden="true" />

        <ul className="squad-row" aria-label="Categorías">
          {SQUAD.map((p, i) => {
            const state = !active ? "idle" : p.id === activeId ? "focus" : "away";
            return (
              <li key={p.id} className="squad-slot">
                <motion.button
                  ref={(el: HTMLButtonElement | null) => {
                    if (el) buttons.current.set(p.id, el);
                    else buttons.current.delete(p.id);
                  }}
                  type="button"
                  className={`squad-player is-${state}`}
                  aria-pressed={p.id === activeId}
                  aria-controls={p.id === activeId ? "squad-info" : undefined}
                  aria-label={`${p.name}, ${p.ages}`}
                  onPointerEnter={(e) => e.pointerType === "mouse" && show(p.id)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && scheduleHide()}
                  onClick={(e) => {
                    focusInfoOnMount.current = e.detail === 0; // detail 0 = activado por teclado
                    show(p.id);
                  }}
                  initial={false}
                  animate={state}
                  variants={{
                    idle: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
                    focus: { opacity: 1, y: -10, scale: 1.08, filter: "blur(0px)" },
                    away: { opacity: 0, y: 24, scale: 0.94, filter: "blur(10px)" },
                  }}
                  transition={{ duration: 0.55, ease: EASE, delay: state === "idle" ? i * 0.04 : 0 }}
                >
                  <span className="squad-floor" aria-hidden="true" />
                  <span className="squad-figure-box" style={{ "--h": HEIGHT[p.id] ?? 1 } as React.CSSProperties}>
                    <Image src={`${ART}/char-${p.id}.webp`} alt="" fill sizes="(min-width: 1024px) 28vw, 40vw" />
                  </span>
                  <span className="squad-name">
                    {p.name}
                    <small>{p.ages}</small>
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ul>

        <AnimatePresence mode="wait">
          {active && (
            <motion.aside
              key={active.id}
              id="squad-info"
              className={`squad-info ${activeIndex <= 2 ? "is-right" : "is-left"}`}
              style={{ "--slot": activeIndex } as React.CSSProperties}
              initial={{ opacity: 0, x: activeIndex <= 2 ? -24 : 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)", pointerEvents: "none", transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: EASE }}
              onPointerEnter={(e) => e.pointerType === "mouse" && show(active.id)}
              onPointerLeave={(e) => e.pointerType === "mouse" && scheduleHide()}
              aria-live="polite"
            >
              <button
                type="button"
                className="squad-info-close"
                aria-label={`Cerrar ficha de ${active.name}`}
                onClick={() => {
                  const id = active.id;
                  setActiveId(null);
                  buttons.current.get(id)?.focus({ preventScroll: true });
                }}
              >
                <X aria-hidden="true" />
              </button>
              <p className="squad-info-tag">0{activeIndex + 1} · {active.tagline}</p>
              <h3>{active.name}</h3>
              <ul>
                <li><Users aria-hidden="true" />{active.ages}</li>
                {(active.scheduleSlots ?? [active.schedule]).map((slot) => (
                  <li key={slot}><Clock aria-hidden="true" />{slot}</li>
                ))}
                <li><MapPin aria-hidden="true" />{active.court} · Club Oriente</li>
              </ul>
              <ul className="squad-info-promises" aria-label="Lo que te proponemos">
                {active.promises.map((promise) => (
                  <li key={promise}><Check aria-hidden="true" />{promise}</li>
                ))}
              </ul>
              {active.note && <p className="squad-info-note">{active.note}</p>}
              <p className="squad-info-price">
                <strong>{active.monthly}</strong>
                <span>Inscripción {active.enrollment}</span>
              </p>
              <a
                ref={(el) => {
                  if (el && focusInfoOnMount.current) {
                    focusInfoOnMount.current = false;
                    el.focus({ preventScroll: true });
                  }
                }}
                href="#inscripcion"
                onClick={() => window.dispatchEvent(new CustomEvent("select-program", { detail: active.id }))}
              >
                Reservar mi clase gratis <ArrowRight aria-hidden="true" />
              </a>
              <a
                className="squad-info-whatsapp"
                href={whatsappLink(`Hola, quiero agendar una clase de prueba en ${active.name} en Acción Fútbol.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" /> Prefiero WhatsApp
              </a>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
