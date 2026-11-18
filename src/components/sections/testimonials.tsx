"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site";

const scenes = [
  { src: "/images/group-adults.webp", alt: "Grupo de adultos reunido en una cancha de fútbol", label: "Adultos" },
  { src: "/images/kids-joy.webp", alt: "Niños celebrando durante un entrenamiento", label: "Kids" },
  { src: "/images/youth-huddle.webp", alt: "Jóvenes reunidos antes de entrenar", label: "Jóvenes" },
] as const;
const INTERVAL_MS = 11000;

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const canPlay = playing && !interacting && pageVisible && inView && !reduceMotion;

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);
  useEffect(() => {
    if (!canPlay) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % TESTIMONIALS.length), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [active, canPlay]);

  function select(index: number) {
    const next = (index + TESTIMONIALS.length) % TESTIMONIALS.length;
    setActive(next);
    setAnnouncement(`Testimonio ${next + 1} de ${TESTIMONIALS.length}: ${TESTIMONIALS[next].name}`);
  }

  const item = TESTIMONIALS[active];
  const scene = scenes[active];
  const transition = { duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return (
    <section ref={sectionRef} id="comunidad" aria-labelledby="community-title" className="community-section relative isolate overflow-hidden"
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
      <div className="community-orbit community-orbit-one" aria-hidden="true" />
      <div className="community-orbit community-orbit-two" aria-hidden="true" />
      <div className="community-inner relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="community-intro mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
          <div>
            <p className="section-tag community-eyebrow"><span className="community-live-dot" aria-hidden="true" /> VOCES DE LA CANCHA</p>
            <h2 id="community-title" className="community-title mt-5 font-display font-black uppercase">Volver a jugar.<br /><span>Volver a sentir.</span></h2>
          </div>
          <p className="community-intro-copy max-w-xs text-sm leading-relaxed sm:text-base">Distintos caminos, la misma cancha. Descubre lo que significa dar ese primer paso.</p>
        </div>

        <div className="community-stage grid overflow-hidden lg:grid-cols-[1.08fr_1fr]">
          <div className="community-visual relative min-h-[330px] overflow-hidden sm:min-h-[450px] lg:min-h-[560px]">
            <AnimatePresence initial={false}>
              <motion.div key={scene.src} className="absolute inset-0" initial={reduceMotion ? false : { opacity: 0, scale: 1.075 }}
                animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 1.025 }} transition={transition}>
                <Image src={scene.src} alt={scene.alt} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="community-image-shade absolute inset-0" aria-hidden="true" />
            <div className="community-image-top absolute inset-x-0 top-0 flex items-start justify-between p-6 sm:p-8">
              <span className="community-image-label">ACCIÓN FÚTBOL / {scene.label.toUpperCase()}</span>
              <span className="community-image-index font-display">0{active + 1} <span>/ 03</span></span>
            </div>
            <p className="community-photo-note absolute bottom-5 left-6 right-6 sm:bottom-7 sm:left-8">Imágenes de entrenamientos de la academia</p>
          </div>

          <div className="community-story flex min-h-[410px] flex-col justify-between px-7 pb-7 pt-9 sm:px-12 sm:pb-10 sm:pt-12 lg:px-14 lg:pb-12 lg:pt-14">
            <div className="community-story-top flex items-center justify-between gap-4">
              <span className="community-story-tag">HISTORIA 0{active + 1} / 03</span>
              <Quote className="community-quote-icon size-8 sm:size-10" strokeWidth={1.4} aria-hidden="true" />
            </div>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.figure key={active} className="community-featured-quote my-8"
                initial={reduceMotion ? false : { opacity: 0, y: 22, filter: "blur(7px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -16, filter: "blur(5px)" }} transition={transition}>
                <blockquote className="font-display font-semibold leading-[1.14] tracking-[-.035em]">“{item.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="community-avatar flex size-11 shrink-0 items-center justify-center rounded-full font-display text-base font-bold" aria-hidden="true">{item.name.charAt(0)}</span>
                  <span className="flex flex-col gap-0.5"><strong className="text-sm font-bold">{item.name}</strong><span className="community-role text-xs">{item.role}</span></span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            <div className="community-story-footer flex flex-wrap items-end justify-between gap-5 border-t pt-6">
              <a href="#inscripcion" className="community-cta inline-flex min-h-11 items-center gap-2 text-sm font-bold">Tu historia puede empezar aquí <ArrowUpRight className="size-4" aria-hidden="true" /></a>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => select(active - 1)} aria-label="Testimonio anterior" className="community-arrow flex size-11 items-center justify-center rounded-full"><ArrowLeft className="size-4" aria-hidden="true" /></button>
                <button type="button" onClick={() => select(active + 1)} aria-label="Testimonio siguiente" className="community-arrow flex size-11 items-center justify-center rounded-full"><ArrowRight className="size-4" aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="community-bottom mt-5 grid gap-3 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <button key={testimonial.name} type="button" onClick={() => select(index)}
              aria-label={`Mostrar testimonio de ${testimonial.name}, ${testimonial.role}`}
              aria-current={active === index ? "true" : undefined}
              className={`community-selector relative min-h-24 overflow-hidden px-5 py-4 text-left ${active === index ? "is-active" : ""}`}>
              <span className="community-selector-track absolute inset-x-0 top-0 h-[2px]" aria-hidden="true" />
              {active === index && canPlay && <span key={`${index}-progress`} className="community-selector-progress absolute left-0 top-0 h-[2px]" aria-hidden="true" />}
              <span className="flex items-center justify-between gap-4"><span className="community-selector-name font-display text-base font-bold">{testimonial.name}</span><span className="community-selector-number font-display text-xs">0{index + 1}</span></span>
              <span className="community-selector-role mt-1 block text-xs">{testimonial.role}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 text-xs">
          <p className="community-note">Historias de nuestra comunidad</p>
          {!reduceMotion && <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pausar cambio automático de testimonios" : "Reanudar cambio automático de testimonios"} className="community-play inline-flex min-h-11 items-center gap-2 px-3">{playing ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}{playing ? "Pausar" : "Reanudar"}</button>}
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
      </div>
    </section>
  );
}
