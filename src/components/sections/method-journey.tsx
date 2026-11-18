"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { METHOD_STEPS } from "@/lib/site";

const intervalMs = 6500;

export function MethodJourney() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [touching, setTouching] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const reduceMotion = useReducedMotion();
  const step = METHOD_STEPS[active];

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.45 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || hovered || focusWithin || pausedByUser || touching || reduceMotion) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActive((index) => (index + 1) % METHOD_STEPS.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [inView, hovered, focusWithin, pausedByUser, touching, reduceMotion]);

  function goTo(index: number) {
    const next = (index + METHOD_STEPS.length) % METHOD_STEPS.length;
    setDirection(next < active && !(active === METHOD_STEPS.length - 1 && next === 0) ? -1 : 1);
    setActive(next);
    setAnnouncement(`Etapa ${next + 1} de ${METHOD_STEPS.length}: ${METHOD_STEPS[next].title}`);
  }

  return (
    <div className="method-playbook">
      <div className="method-playbook-heading">
        <h2 id="how-title" className="font-display font-black uppercase">Así se vive <span>el método.</span></h2>
        <p>Un recorrido que empieza contigo y crece en cada entrenamiento.</p>
      </div>

      <div ref={carouselRef} className="method-carousel mt-9 sm:mt-12" aria-roledescription="carrusel" aria-label="Etapas de nuestra metodología"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocusWithin(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false); }}
        onTouchStart={(event) => { setTouching(true); touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchEnd={(event) => {
          setTouching(false);
          if (!touchStart.current) return;
          const dx = event.changedTouches[0].clientX - touchStart.current.x;
          const dy = event.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.2) goTo(active + (dx < 0 ? 1 : -1));
          touchStart.current = null;
        }}
        onTouchCancel={() => { setTouching(false); touchStart.current = null; }}>
        <div className="method-carousel-viewport">
          <article className="method-slide" aria-roledescription="diapositiva" aria-label={`${active + 1} de ${METHOD_STEPS.length}`}>
            <div className="method-slide-image">
              {METHOD_STEPS.map((item, index) => (
                <div key={item.image} className={`method-slide-photo ${active === index ? "is-active" : ""}`} aria-hidden={active !== index}>
                  <Image src={item.image} alt={active === index ? item.imageAlt : ""} fill sizes="(max-width: 767px) 100vw, 55vw" className="object-cover" loading="eager" />
                </div>
              ))}
            </div>
            <div className="method-slide-copy">
              <span className="method-slide-count">{String(active + 1).padStart(2, "0")} <span>/ {String(METHOD_STEPS.length).padStart(2, "0")}</span></span>
              <div className="method-slide-text">
                <motion.div key={step.title} initial={reduceMotion ? false : { opacity: 0.75, x: direction * 12 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  <h3 className="font-display font-black uppercase">{step.title}</h3>
                  <p>{step.description}</p>
                </motion.div>
              </div>
              <div className="method-slide-controls">
                <div className="method-slide-progress" role="group" aria-label="Ir a una etapa">
                  {METHOD_STEPS.map((item, index) => (
                    <button key={item.title} type="button" onClick={() => goTo(index)} className={active === index ? "is-active" : ""}
                      aria-label={`Etapa ${index + 1}: ${item.title}`} aria-current={active === index ? "step" : undefined} />
                  ))}
                </div>
                <div className="method-slide-arrows">
                  {!reduceMotion && <button type="button" onClick={() => setPausedByUser((value) => !value)}
                    aria-label={pausedByUser ? "Permitir avance automático" : "Pausar avance automático"} aria-pressed={pausedByUser}>
                    {pausedByUser ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
                  </button>}
                  <button type="button" onClick={() => goTo(active - 1)} aria-label="Etapa anterior"><ArrowLeft aria-hidden="true" /></button>
                  <button type="button" onClick={() => goTo(active + 1)} aria-label="Etapa siguiente"><ArrowRight aria-hidden="true" /></button>
                </div>
              </div>
            </div>
          </article>
        </div>
        <span className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
      </div>
      <a href="#inscripcion" className="method-cta">Vive tu primera clase gratis <ArrowUpRight aria-hidden="true" /></a>
    </div>
  );
}
