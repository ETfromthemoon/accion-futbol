"use client";

import { ArrowUpRight } from "lucide-react";
import { SplitText } from "@/components/ui/split-text";
import { VideoBackdrop } from "@/components/ui/video-backdrop";
import { NumberTicker } from "@/components/ui/number-ticker";
import { METRICS, PROGRAMS } from "@/lib/site";

const FACTS = METRICS.slice(0, 3).map((metric, index) =>
  index === 0 ? { ...metric, value: PROGRAMS.length } : metric,
);

export function Hero() {
  return (
    <section id="top" className="hero" aria-label="Acción Fútbol, academia de fútbol en Las Condes">
      <div className="hero-stage">
        <div className="hero-film">
          <VideoBackdrop
            src="/images/video-hero.mp4"
            poster="/images/poster-hero.webp"
            alt="Entrenamiento de Acción Fútbol en Club Oriente"
            priority
          />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-title">
          <p className="hero-kicker">Academia de fútbol · Club Oriente, Las Condes</p>
          <h1>
            <span><SplitText text="Despierta" /></span>{" "}
            <span className="hero-outline"><SplitText text="con" delay={0.15} /></span>{" "}
            <span className="text-primary"><SplitText text="pasión." delay={0.3} /></span>
          </h1>
        </div>
        <div className="hero-panel">
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
        </div>
      </div>
    </section>
  );
}
