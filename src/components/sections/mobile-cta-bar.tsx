"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/site";

// Barra fija inferior solo en móvil: CTA principal + atajo a WhatsApp.
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
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
        >
          <div className="flex gap-2">
            <a
              href="#inscripcion"
              className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-display font-semibold text-primary-foreground"
            >
              Agenda tu clase gratis
            </a>
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribir por WhatsApp"
              className="flex size-[3.25rem] shrink-0 items-center justify-center rounded-full border border-border bg-white/5 text-foreground"
            >
              <MessageCircle aria-hidden="true" className="size-5" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
