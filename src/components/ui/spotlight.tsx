"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// Resplandor radial que sigue al cursor. Oculto hasta el primer movimiento.
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const xSpring = useSpring(x, { stiffness: 80, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 80, damping: 30 });
  const background = useTransform(
    [xSpring, ySpring],
    ([cx, cy]) =>
      `radial-gradient(500px circle at ${cx}px ${cy}px, oklch(0.82 0.21 150 / 0.16), transparent 60%)`,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
      if (!active) setActive(true);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y, active]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
      style={{ background, opacity: active ? 1 : 0 }}
    />
  );
}
