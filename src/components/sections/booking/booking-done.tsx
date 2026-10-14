"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CalendarPlus, CheckCircle2, Download, RotateCcw } from "lucide-react";
import { whatsappLink, type Program } from "@/lib/site";
import {
  bookingMessage,
  formatSlotLong,
  googleCalendarUrl,
  icsContent,
  type BookingSummary,
  type TrialSlot,
} from "@/lib/booking";

type Props = {
  summary: BookingSummary;
  // false cuando el servidor no guardó el lead: la confirmación depende de WhatsApp.
  isStored: boolean;
  onRestart: () => void;
  headingRef?: React.Ref<HTMLHeadingElement>;
};

function icsHref(slot: TrialSlot, program: Program, now: Date) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent(slot, program, now))}`;
}

// Cierre: la clase con fecha, confirmación por WhatsApp y botones de calendario.
export function BookingDone({ summary, isStored, onRestart, headingRef }: Props) {
  const { program, slot } = summary;
  const [now] = useState(() => new Date());

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      role="status"
      className="bk-done"
    >
      <CheckCircle2 aria-hidden="true" className="bk-done-icon" />
      <h3 ref={headingRef} tabIndex={-1}>{isStored ? "¡Tu clase está solicitada!" : "Último paso: confírmala por WhatsApp."}</h3>

      <div className="bk-done-ticket">
        <p className="bk-kicker">Clase de prueba gratis</p>
        <p className="bk-done-program">{program.name}</p>
        <p>{formatSlotLong(slot)}</p>
        <p className="text-muted">{program.court} · Club Oriente, Nueva Bilbao 9495</p>
      </div>

      <p className="bk-done-text">
        {isStored
          ? "Te confirmamos el cupo por WhatsApp. Si quieres adelantar, escríbenos directo."
          : "Tu mensaje ya está escrito con el día y la hora. Envíalo y te confirmamos el cupo."}
      </p>

      <a href={whatsappLink(bookingMessage(summary))} target="_blank" rel="noopener noreferrer" className="bk-primary">
        {isStored ? "Escribir por WhatsApp" : "Confirmar por WhatsApp"} <ArrowRight aria-hidden="true" />
      </a>

      <div className="bk-calendar" role="group" aria-labelledby="bk-calendar-label">
        <p id="bk-calendar-label">Agregar a tu calendario</p>
        <a href={googleCalendarUrl(slot, program)} target="_blank" rel="noopener noreferrer">
          <CalendarPlus aria-hidden="true" /> Google
        </a>
        <a href={icsHref(slot, program, now)} download="clase-prueba-accion-futbol.ics">
          <Download aria-hidden="true" /> Apple · Outlook
        </a>
      </div>

      <button type="button" className="bk-link" onClick={onRestart}>
        <RotateCcw aria-hidden="true" /> Reservar otra clase
      </button>
    </motion.div>
  );
}
