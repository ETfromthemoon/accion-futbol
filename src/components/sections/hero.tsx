"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SplitText } from "@/components/ui/split-text";
import { VideoBackdrop } from "@/components/ui/video-backdrop";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useMediaQuery } from "@/components/ui/use-media-query";
import { METRICS, PROGRAMS } from "@/lib/site";

// Debe coincidir con la media query de la escena fija en hero.css.
const SCRUB_QUERY = "(min-width: 1024px) and (min-height: 680px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const WALL = [
  { src: "/images/poster-kids.webp", label: "Kids" },
  { src: "/images/poster-am.webp", label: "AM Adultos" },
  { src: "/images/poster-femenino.webp", label: "Femenino" },
  { src: "/images/poster-pm.webp", label: "PM Adultos" },
] as const;

const FACTS = METRICS.slice(0, 3).map((metric, index) =>
  index === 0 ? { ...metric, value: PROGRAMS.length } : metric,
);

export function Hero() {
  const scrubMode = useMediaQuery(SCRUB_QUERY);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 95, damping: 30, restDelta: 0.001 });
  const fan = useTransform(progress, [0.04, 0.72], [0, 1]);
  const filmScale = useTransform(progress, [0, 0.58, 1], [1, 1.055, 1.02]);
  const filmY = useTransform(progress, [0, 1], [0, -24]);
  const copyY = useTransform(progress, [0, 1], [0, -18]);
  const linesOpacity = useTransform(progress, [0, 0.5, 1], [0.4, 0.9, 0.65]);

  function seekTo(value: number) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.seeking) return;
    const target = Math.min(Math.max(value, 0), 1) * (video.duration - 0.05);
    if (Math.abs(video.currentTime - target) > 1 / 48) video.currentTime = target;
  }

  useMotionValueEvent(progress, "change", (value) => {
    if (scrubMode !== true) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => seekTo(value));
  });
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return (
    <section ref={sectionRef} id="top" className="hero" aria-label="Acción Fútbol, academia de fútbol en Las Condes">
      <div className="hero-stage">
        <motion.div className="hero-pitch" style={scrubMode ? { opacity: linesOpacity } : undefined} aria-hidden="true" />

        <motion.div className="hero-title" style={scrubMode ? { y: copyY } : undefined}>
          <p className="hero-kicker">Academia de fútbol · Club Oriente, Las Condes</p>
          <h1>
            <span><SplitText text="Despierta" /></span>{" "}
            <span className="hero-outline"><SplitText text="con" delay={0.15} /></span>{" "}
            <span className="text-primary"><SplitText text="pasión." delay={0.3} /></span>
          </h1>
          <p className="hero-title-note">Una cancha. Un equipo. Tu momento.</p>
        </motion.div>

        <div className="hero-arena">
          <span className="hero-arena-index" aria-hidden="true">01 / Entra a la cancha</span>
          {WALL.map((card, index) => (
            <WallCard key={card.label} {...card} index={index} fan={fan} animated={scrubMode === true} />
          ))}
          <motion.div className="hero-film" style={scrubMode ? { scale: filmScale, y: filmY } : undefined}>
            {scrubMode === null && (
              <Image src="/images/poster-hero.webp" alt="Entrenamiento de Acción Fútbol en Club Oriente" fill priority sizes="(min-width: 1024px) 380px, 250px" className="object-cover" />
            )}
            {scrubMode === true && (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src="/images/video-hero-scrub.mp4"
                poster="/images/poster-hero.webp"
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={() => seekTo(progress.get())}
                onSeeked={() => seekTo(progress.get())}
                aria-label="Entrenamiento de Acción Fútbol en Club Oriente"
              />
            )}
            {scrubMode === false && (
              <VideoBackdrop
                src="/images/video-hero-scrub.mp4"
                poster="/images/poster-hero.webp"
                alt="Entrenamiento de Acción Fútbol en Club Oriente"
                priority
              />
            )}
            <span className="hero-film-corner hero-film-corner--tl" aria-hidden="true" />
            <span className="hero-film-corner hero-film-corner--br" aria-hidden="true" />
          </motion.div>
          <span className="hero-arena-caption" aria-hidden="true">Acción Fútbol · Club Oriente</span>
        </div>

        <motion.div className="hero-panel" style={scrubMode ? { y: copyY } : undefined}>
          <p className="hero-panel-lead">Entrena como en un club, <span>a cualquier edad.</span></p>
          <ul className="hero-facts">
            {FACTS.map((fact) => (
              <li key={fact.label}>
                <strong>{fact.prefix}<NumberTicker value={fact.value} />{fact.suffix}</strong>
                <span>{fact.label}</span>
              </li>
            ))}
            <li><strong>Lun–Sáb</strong><span>horarios AM y PM</span></li>
          </ul>
          <div className="hero-actions">
            <a href="#inscripcion" className="hero-cta">
              <span><small>Tu primer entrenamiento</small>Clase de prueba gratis</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a href="#programas" className="hero-secondary">Ver categorías</a>
          </div>
        </motion.div>

        <p className="hero-hint" aria-hidden="true"><ArrowDown className="size-4" /> Desliza y entra a la cancha</p>
      </div>
    </section>
  );
}

function WallCard({
  src, label, index, fan, animated,
}: {
  src: string;
  label: string;
  index: number;
  fan: MotionValue<number>;
  animated: boolean;
}) {
  const side = index < 2 ? -1 : 1;
  const x = useTransform(fan, [0, 1], [0, side * (index === 0 || index === 3 ? 110 : 72)]);
  const y = useTransform(fan, [0, 1], [0, index % 2 === 0 ? -28 : 28]);
  const rotate = useTransform(fan, [0, 1], [0, side * (index === 0 || index === 3 ? 11 : 7)]);
  const opacity = useTransform(fan, [0, 1], [1, 0.4]);

  return (
    <motion.figure aria-hidden="true" className={`hero-card hero-card--${index + 1}`} style={animated ? { x, y, rotate, opacity } : undefined}>
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 140px, 100px" className="object-cover" />
      <figcaption>{label}</figcaption>
    </motion.figure>
  );
}
