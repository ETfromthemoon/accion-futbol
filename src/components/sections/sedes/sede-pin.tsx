"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Sede } from "@/lib/site";

type Props = {
  sede: Sede;
  left: number; // % del ancho del mapa
  top: number; // % del alto del mapa
  isVisible: boolean;
  onEnter: () => void;
  ref?: React.Ref<HTMLButtonElement>;
};

// Pin de sede: botón real (accesible) posicionado sobre el SVG del mapa.
export function SedePin({ sede, left, top, isVisible, onEnter, ref }: Props) {
  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onEnter}
      className="sede-pin group"
      style={{ left: `${left}%`, top: `${top}%` }}
      initial={{ opacity: 0, y: -24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: isVisible ? 1.9 : 0 }}
      aria-label={`Entrar a la sede ${sede.name}, ${sede.comuna}`}
    >
      <span className="sede-pin-rings" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="sede-pin-ring"
            animate={{ scale: [0.4, 2.6], opacity: [0.7, 0] }}
            transition={{ duration: 2.6, delay: i * 0.85, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </span>
      <span className="sede-pin-dot" aria-hidden="true" />
      <span className="sede-pin-card glass">
        <span className="sede-pin-name">{sede.name}</span>
        <span className="sede-pin-meta">
          {sede.comuna} · {sede.canchas.length} canchas
        </span>
        <span className="sede-pin-cta">
          Entrar <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </span>
      </span>
    </motion.button>
  );
}
