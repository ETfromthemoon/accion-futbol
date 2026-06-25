"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

// Tarjeta con inclinación 3D y brillo especular que siguen al puntero.
// Solo transform/opacity (compositor). En táctil no hay hover, así que queda
// plana de forma natural; motion respeta reduced-motion vía MotionConfig.
export function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const px = useMotionValue(50);
  const py = useMotionValue(50);

  const rotateX = useSpring(rx, { stiffness: 150, damping: 18, mass: 0.4 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 18, mass: 0.4 });
  const glareOpacity = useSpring(useMotionValue(0), {
    stiffness: 150,
    damping: 20,
  });
  const glare = useTransform(
    [px, py],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.16), transparent 55%)`,
  );

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    ry.set((nx - 0.5) * max * 2);
    rx.set((0.5 - ny) * max * 2);
    px.set(nx * 100);
    py.set(ny * 100);
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => glareOpacity.set(1)}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
        glareOpacity.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn("relative", className)}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ background: glare, opacity: glareOpacity }}
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
      />
    </motion.div>
  );
}
