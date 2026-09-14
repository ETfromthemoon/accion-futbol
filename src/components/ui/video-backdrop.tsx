"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useMotionPreference } from "@/components/ui/use-motion-preference";

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
  const reduced = useMotionPreference();
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    if (paused) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, paused]);

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
    <>
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
    <button
      type="button"
      aria-label={`${paused ? "Reproducir" : "Pausar"} video: ${alt}`}
      aria-pressed={paused}
      onClick={() => setPaused((value) => !value)}
      className={`video-toggle absolute right-5 z-20 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-black/50 px-4 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/80 sm:right-8 ${priority ? "bottom-24" : "bottom-6"}`}
    >
      {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
      <span>{paused ? "Reproducir" : "Pausar"}</span>
    </button>
    </>
  );
}
