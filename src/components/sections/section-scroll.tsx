"use client";

import { useEffect } from "react";

/* Un gesto de rueda avanza una escena. En escenas altas se conserva el scroll libre
   hasta alcanzar su borde; el tacto usa el snap nativo del navegador. */
export function SectionScroll() {
  useEffect(() => {
    let lockedUntil = 0;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section, .premium-footer"));

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaY) < 8 || event.defaultPrevented) return;
      const target = event.target as Element | null;
      if (target?.closest("[role='dialog'], [data-free-scroll]")) return;
      if (performance.now() < lockedUntil) { event.preventDefault(); return; }
      const direction = Math.sign(event.deltaY);
      const current = sections.reduce((index, section, i) =>
        section.getBoundingClientRect().top <= 24 ? i : index, 0);
      const bounds = sections[current]?.getBoundingClientRect();
      if (!bounds) return;

      const remaining = direction > 0 ? bounds.bottom - window.innerHeight : -bounds.top;
      if (bounds.height > window.innerHeight + 16 && remaining > 16) {
        const distance = Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
        if (distance <= remaining) return;
        event.preventDefault();
        lockedUntil = performance.now() + 650;
        window.scrollTo({ top: window.scrollY + direction * remaining, behavior: "smooth" });
        return;
      }

      const next = sections[current + direction];
      if (!next) return;
      event.preventDefault();
      lockedUntil = performance.now() + 850;
      next.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
  return null;
}
