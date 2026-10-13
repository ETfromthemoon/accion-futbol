"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
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

// Escritorio con mouse y sin "reducir movimiento": el video avanza con el scroll.
// Debe coincidir con la media query de .hero en hero.css.
const SCRUB_QUERY = "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

// Muro de videos verticales: una tarjeta por categoría; la central es el hero.
const WALL = [
  { src: "/images/poster-kids.webp", label: "Kids" },
  { src: "/images/poster-am.webp", label: "AM Adultos" },
  null,
  { src: "/images/poster-femenino.webp", label: "Femenino" },
  { src: "/images/poster-pm.webp", label: "PM Adultos" },
] as const;

// Las tres primeras métricas del sitio, condensadas en el hero.
const FACTS = METRICS.slice(0, 3).map((m, i) => (i === 0 ? { ...m, value: PROGRAMS.length } : m));

const SPRING = { stiffness: 90, damping: 28, restDelta: 0.0005 } as const;
const MIN_SEEK = 1 / 48; // no buscar por diferencias menores a medio cuadro
const PANEL_VISIBLE_AT = 0.6;

export function Hero() {
  // null mientras no se conoce el dispositivo: solo poster, sin descargar ningún video.
  const mode = useMediaQuery(SCRUB_QUERY);
  const isScrub = mode === true;
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, SPRING);

  // Escala para que la tarjeta central cubra toda la pantalla.
  const cover = useMotionValue(6);
  useEffect(() => {
    if (!isScrub) return;
    const stage = stageRef.current;
    const film = filmRef.current;
    if (!stage || !film) return;
    const measure = () =>
      cover.set(Math.max(stage.clientWidth / film.offsetWidth, stage.clientHeight / film.offsetHeight) * 1.02);
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [isScrub, cover]);

  const expand = useTransform(p, [0.08, 0.55], [0, 1]);
  // smoothstep: la expansión arranca y termina suave.
  const filmScale = useTransform(() => {
    const k = expand.get();
    return 1 + (cover.get() - 1) * k * k * (3 - 2 * k);
  });
  const titleOpacity = useTransform(p, [0.03, 0.2], [1, 0]);
  const titleY = useTransform(p, [0.03, 0.2], [0, -90]);
  const titleBlur = useTransform(p, [0.03, 0.2], ["blur(0px)", "blur(14px)"]);
  const hintOpacity = useTransform(p, [0, 0.05], [1, 0]);
  const shadeOpacity = useTransform(p, [0.42, 0.66], [0, 1]);
  const panelOpacity = useTransform(p, [0.55, 0.72], [0, 1]);
  const panelY = useTransform(p, [0.55, 0.72], [48, 0]);

  // Scrub: el tiempo del video sigue al scroll (suavizado por el spring).
  // Si llega un cambio mientras el video busca o aún no tiene metadata, se
  // vuelve a sincronizar en "seeked" / "loadedmetadata" con el valor actual.
  const frame = useRef(0);
  function seekTo(progress: number) {
    const video = videoRef.current;
    if (!video || !video.duration || video.seeking) return;
    const target = Math.min(Math.max(progress, 0), 1) * (video.duration - 0.05);
    if (Math.abs(video.currentTime - target) > MIN_SEEK) video.currentTime = target;
  }
  const resync = () => seekTo(p.get());
  useMotionValueEvent(p, "change", (value) => {
    if (!isScrub) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => seekTo(value));
  });
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // La ficha es invisible al inicio del scroll: fuera del orden de tabulación hasta que aparece.
  const [isPanelShown, setPanelShown] = useState(false);
  useMotionValueEvent(p, "change", (value) => setPanelShown(value >= PANEL_VISIBLE_AT));
  const isPanelInert = isScrub && !isPanelShown;

  return (
    <section ref={sectionRef} id="top" className="hero" aria-label="Acción Fútbol, academia de fútbol en Las Condes">
      <div ref={stageRef} className="hero-stage">
        <div className="hero-wall" aria-hidden="true">
          {WALL.map((card, i) =>
            card ? (
              <WallCard key={card.label} src={card.src} label={card.label} index={i} expand={expand} isScrub={isScrub} />
            ) : (
              <span key="center" className="hero-card is-center" />
            ),
          )}
        </div>

        <motion.div ref={filmRef} className="hero-film" style={isScrub ? { scale: filmScale } : undefined}>
          {mode === null && (
            <Image src="/images/poster-hero.webp" alt="" fill priority sizes="(min-width: 1024px) 16vw, 100vw" className="object-cover" />
          )}
          {mode === true && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src="/images/video-hero-scrub.mp4"
              poster="/images/poster-hero.webp"
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={resync}
              onSeeked={resync}
              aria-label="Entrenamiento de Acción Fútbol en Club Oriente"
            />
          )}
          {mode === false && (
            <VideoBackdrop
              src="/images/video-hero.mp4"
              poster="/images/poster-hero.webp"
              alt="Entrenamiento de Acción Fútbol en Club Oriente"
              priority
            />
          )}
        </motion.div>
        <motion.div className="hero-shade" style={isScrub ? { opacity: shadeOpacity } : undefined} aria-hidden="true" />

        <motion.div
          className="hero-title"
          style={isScrub ? { opacity: titleOpacity, y: titleY, filter: titleBlur } : undefined}
        >
          <p className="hero-kicker">Academia de fútbol · Club Oriente, Las Condes</p>
          <h1>
            <span><SplitText text="Despierta" /></span>{" "}
            <span className="hero-outline"><SplitText text="con" delay={0.15} /></span>{" "}
            <span className="text-primary"><SplitText text="pasión." delay={0.3} /></span>
          </h1>
        </motion.div>

        <motion.p className="hero-hint" style={isScrub ? { opacity: hintOpacity } : undefined} aria-hidden="true">
          <ArrowDown className="size-4" /> Desliza y entra a la cancha
        </motion.p>

        <motion.div
          className="hero-panel"
          style={isScrub ? { opacity: panelOpacity, y: panelY } : undefined}
          inert={isPanelInert}
          aria-hidden={isPanelInert}
        >
          <p className="hero-panel-lead">
            Entrena como en un club, <span>a cualquier edad.</span>
          </p>
          <ul className="hero-facts">
            {FACTS.map((fact) => (
              <li key={fact.label}>
                <strong>
                  {fact.prefix}
                  <NumberTicker value={fact.value} />
                  {fact.suffix}
                </strong>
                <span>{fact.label}</span>
              </li>
            ))}
            <li>
              <strong>Lun–Sáb</strong>
              <span>horarios AM y PM</span>
            </li>
          </ul>
          <div className="hero-actions">
            <a href="#inscripcion" className="hero-cta">
              <span><small>Tu primer entrenamiento</small>Clase de prueba gratis</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a href="#programas" className="hero-secondary">Ver categorías</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type WallCardProps = {
  src: string;
  label: string;
  index: number;
  expand: MotionValue<number>;
  isScrub: boolean;
};

// Tarjeta lateral: sale hacia su lado mientras la central se expande.
function WallCard({ src, label, index, expand, isScrub }: WallCardProps) {
  const side = index < 2 ? -1 : 1;
  const distance = index === 0 || index === 4 ? 70 : 48;
  const x = useTransform(expand, [0, 1], ["0vw", `${side * distance}vw`]);
  const opacity = useTransform(expand, [0, 0.75], [1, 0]);
  const rotate = useTransform(expand, [0, 1], [0, side * 6]);
  return (
    <motion.figure className="hero-card" style={isScrub ? { x, opacity, rotate } : undefined}>
      <Image src={src} alt="" fill sizes="16vw" className="object-cover" />
      <figcaption>{label}</figcaption>
    </motion.figure>
  );
}
