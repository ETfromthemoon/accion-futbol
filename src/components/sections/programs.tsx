"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { PROGRAMS, type Program } from "@/lib/site";
import { VideoBackdrop } from "@/components/ui/video-backdrop";

// El riel recorre la vida futbolera: de los 4 años a los adultos.
const RAIL_ORDER = ["kids", "pro-jovenes", "femenino", "am-adultos", "pm-adultos"] as const;
const RAIL: readonly Program[] = RAIL_ORDER.map((id) => PROGRAMS.find((p) => p.id === id)).filter(
  (p): p is Program => Boolean(p),
);
const SNAP = { type: "spring", stiffness: 420, damping: 38 } as const;
const SCENE_EASE = [0.22, 1, 0.36, 1] as const;

export function Programs() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const railRef = useRef<HTMLDivElement>(null);
  const [railWidth, setRailWidth] = useState(0);
  const knobX = useMotionValue(0);
  const fill = useTransform(knobX, (x) => (railWidth ? x / railWidth : 0));
  const isDragging = useRef(false);
  const program = RAIL[active];
  const step = railWidth / (RAIL.length - 1);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setRailWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // El tirador viaja al punto activo (salvo mientras se arrastra).
  useEffect(() => {
    if (isDragging.current || !railWidth) return;
    const controls = animate(knobX, active * step, SNAP);
    return () => controls.stop();
  }, [active, step, railWidth, knobX]);

  function show(index: number) {
    const next = Math.max(0, Math.min(RAIL.length - 1, index));
    if (next === active) return;
    setDirection(next > active ? 1 : -1);
    setActive(next);
  }

  function handleKey(e: React.KeyboardEvent) {
    const keys: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: RAIL.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(RAIL.length - 1, keys[e.key]));
    show(next);
    document.getElementById(`rail-point-${RAIL[next].id}`)?.focus();
  }

  return (
    <section id="programas" className="program-experience">
      <div className="experience-heading">
        <p className="section-tag">02 / Encuentra tu equipo</p>
        <h2>Tu fútbol.<br /><span>Tu momento.</span></h2>
        <p>Recorre el riel: hay una categoría para cada etapa de tu vida. Pasa sobre un punto y descúbrela.</p>
      </div>

      <div className="category-stage" id="program-detail" aria-live="polite">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={program.id}
            className="category-media"
            custom={direction}
            variants={{
              enter: (d: number) => ({ clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.08 }),
              center: { clipPath: "inset(0 0 0 0%)", scale: 1 },
              exit: { opacity: 0.4, scale: 1.02 },
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.9, ease: SCENE_EASE }}
          >
            {program.video && program.poster ? (
              <VideoBackdrop src={program.video} poster={program.poster} alt={`Categoría ${program.name}`} />
            ) : (
              <Image src={program.image} alt={`Categoría ${program.name}`} fill sizes="100vw" className="object-cover" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="category-shade" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={program.id}
            className="category-copy"
            initial="hidden"
            animate="shown"
            exit="hidden"
            variants={{ shown: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
          >
            <motion.span
              className="category-number"
              aria-hidden="true"
              variants={{ hidden: { opacity: 0, y: 40 }, shown: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: SCENE_EASE }}
            >
              0{active + 1}
            </motion.span>
            <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="category-tagline">{program.tagline}</motion.p>
            <motion.h3
              variants={{ hidden: { opacity: 0, filter: "blur(14px)", y: 24 }, shown: { opacity: 1, filter: "blur(0px)", y: 0 } }}
              transition={{ duration: 0.7, ease: SCENE_EASE }}
            >
              {program.name}
            </motion.h3>
            <motion.ul variants={fadeUp} transition={{ duration: 0.5 }} className="category-specs">
              <li><Users aria-hidden="true" />{program.ages}</li>
              <li><Clock aria-hidden="true" />{program.schedule}</li>
              <li><MapPin aria-hidden="true" />{program.court} · Club Oriente</li>
            </motion.ul>
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="category-buy">
              <p><strong>{program.monthly}</strong><span>Inscripción {program.enrollment}</span></p>
              <a
                href="#inscripcion"
                aria-label={`Probar gratis ${program.name}`}
                onClick={() => window.dispatchEvent(new CustomEvent("select-program", { detail: program.id }))}
              >
                Reservar mi clase gratis <ArrowRight aria-hidden="true" />
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Riel de categorías: hover, foco, clic o arrastre del tirador. */}
        <div className="category-rail glass" onKeyDown={handleKey}>
          <div ref={railRef} className="category-track" role="tablist" aria-label="Categorías">
            <span className="category-line" aria-hidden="true" />
            <motion.span className="category-line is-fill" style={{ scaleX: fill }} aria-hidden="true" />
            <motion.span
              className="category-knob"
              aria-hidden="true"
              style={{ x: knobX }}
              drag="x"
              dragConstraints={{ left: 0, right: railWidth }}
              dragElastic={0}
              dragMomentum={false}
              onDragStart={() => { isDragging.current = true; }}
              onDrag={() => step && show(Math.round(knobX.get() / step))}
              onDragEnd={() => {
                isDragging.current = false;
                animate(knobX, active * step, SNAP);
              }}
            />
            {RAIL.map((p, i) => (
              <button
                key={p.id}
                id={`rail-point-${p.id}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="program-detail"
                tabIndex={i === active ? 0 : -1}
                className={`category-point ${i === active ? "is-active" : ""} ${i < active ? "is-past" : ""}`}
                style={{ left: `${(i / (RAIL.length - 1)) * 100}%` }}
                onPointerEnter={(e) => e.pointerType === "mouse" && show(i)}
                onFocus={() => show(i)}
                onClick={() => show(i)}
              >
                <span className="category-dot" aria-hidden="true" />
                <span className="category-label">
                  {p.name}
                  <small>{p.ages}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const fadeUp = { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } };
