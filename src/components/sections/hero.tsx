"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SplitText } from "@/components/ui/split-text";
import { VideoBackdrop } from "@/components/ui/video-backdrop";

export function Hero() {
  return (
    <section id="top" className="campaign-hero">
      <div className="campaign-meta"><span>Academia de fútbol / Las Condes</span><span>Club Oriente · Santiago, Chile</span></div>
      <div className="campaign-stage">
        <div className="campaign-film">
          <VideoBackdrop src="/images/video-hero.mp4" poster="/images/poster-hero.webp" alt="Entrenamiento de Acción Fútbol en la cancha" priority />
          <div className="campaign-film-shade" />
          <span className="film-label">El juego empieza aquí.</span>
        </div>
        <div className="campaign-heading">
          <p className="campaign-eyebrow">Para quienes nunca dejaron de sentirlo.</p>
          <h1><span><SplitText text="Despierta" /></span><span className="campaign-outline"><SplitText text="con" delay={0.15} /></span><span className="text-primary"><SplitText text="pasión." delay={0.3} /></span></h1>
        </div>
        <div className="campaign-caption"><span className="campaign-cross" aria-hidden="true">+</span><p>Entrenamiento profesional.<br />La energía de un equipo.<br />Un lugar para ti.</p></div>
      </div>
      <div className="campaign-bottom">
        <a href="#programas" className="campaign-discover"><ArrowDown size={20} /><span>Adultos, niños, jóvenes y mujeres.<br /><strong>Encuentra tu lugar en la cancha.</strong></span></a>
        <a href="#inscripcion" aria-label="Agendar clase de prueba" className="campaign-cta"><span><small>Tu primer entrenamiento, gratis</small>Reserva tu clase de prueba</span><ArrowUpRight /></a>
      </div>
    </section>
  );
}
