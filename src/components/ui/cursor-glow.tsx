"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// Resplandor de acento que sigue al cursor en desktop. Escribe transform directo
// al DOM en un loop rAF (lerp hacia el objetivo): cero re-renders por movimiento.
// Desactivado en táctil y en prefers-reduced-motion.
export function CursorGlow() {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      el.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [reduced]);

  if (reduced) return null;
  return <div ref={ref} className="cursor-glow" aria-hidden />;
}
