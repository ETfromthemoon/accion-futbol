"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  src: string;
  poster: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

// Video de fondo a sangre: autoplay silencioso en loop, playsInline.
// - Lazy: con preload="none" el video no se descarga hasta que entra en
//   viewport (ahí se llama play(), que dispara la carga). El poster se ve mientras.
// - prefers-reduced-motion: renderiza solo el poster (nunca descarga el video).
// - Fuera de pantalla se pausa para no gastar batería/CPU.
export function VideoBackdrop({
  src,
  poster,
  alt,
  priority = false,
  className = "",
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15, rootMargin: "150px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={priority}
      preload={priority ? "auto" : "none"}
      aria-label={alt}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
