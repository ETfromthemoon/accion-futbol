"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/site";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-all duration-500 sm:px-5",
        scrolled ? "pt-2" : "pt-3",
      )}
    >
      <nav
        aria-label="Navegación principal"
        className={cn(
          "nav-glass mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl px-4 transition-all duration-500 sm:px-6",
          scrolled && "nav-glass-scrolled max-w-5xl",
        )}
      >
        <a
          href="#top"
          className="font-display text-lg font-extrabold tracking-tight"
        >
          ACCIÓN<span className="text-primary">FÚTBOL</span>
        </a>

        <div className="nav-links-glass hidden items-center gap-1 rounded-full p-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-glass-link rounded-full px-4 py-2 text-sm text-foreground/70 transition-all hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#inscripcion"
            className="nav-glass-cta hidden rounded-xl px-5 py-2.5 font-display text-sm font-semibold text-white transition-all hover:-translate-y-0.5 sm:inline-flex"
          >
            Clase de prueba gratis
          </a>
          <button
            type="button"
            ref={toggleRef}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-controls="menu-movil"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="nav-glass-button flex size-11 flex-col items-center justify-center gap-1.5 rounded-xl md:hidden"
          >
            <span
              className={cn(
                "h-0.5 w-5 bg-foreground transition-transform",
                open && "translate-y-2 rotate-45",
              )}
            />
            <span
              className={cn(
                "h-0.5 w-5 bg-foreground transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-0.5 w-5 bg-foreground transition-transform",
                open && "-translate-y-2 -rotate-45",
              )}
            />
          </button>
        </div>
      </nav>

      {open && (
        <div id="menu-movil" className="mobile-glass-menu mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base text-foreground/75 transition-colors hover:bg-white/10 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#inscripcion"
              onClick={() => setOpen(false)}
              className="nav-glass-cta mt-2 rounded-xl px-5 py-3 text-center font-display font-semibold text-white"
            >
              Clase de prueba gratis
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
