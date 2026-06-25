"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Barra fija inferior solo en móvil: mantiene el CTA siempre a mano.
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.8;
      const form = document.getElementById("inscripcion");
      const formVisible = form
        ? form.getBoundingClientRect().top < window.innerHeight
        : false;
      setVisible(past && !formVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 p-3 backdrop-blur-xl md:hidden"
        >
          <a
            href="#inscripcion"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display font-semibold text-primary-foreground"
          >
            Agenda tu clase de prueba gratis
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
