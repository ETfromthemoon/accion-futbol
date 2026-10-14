"use client";

import { ArrowRight, CalendarCheck, Loader2 } from "lucide-react";
import type { Program } from "@/lib/site";
import { formatSlotLong, type TrialSlot } from "@/lib/booking";
import type { ForWhom } from "./booking-steps";

export type ContactData = { name: string; phone: string; email: string; company: string };

type Props = {
  program: Program;
  slot: TrialSlot;
  forWhom: ForWhom;
  isSubmitting: boolean;
  error: string;
  onSubmit: (data: ContactData) => void;
};

const FIELD =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

// Paso 5 · Datos de contacto. Solo lo necesario para confirmar por WhatsApp.
export function StepDetails({ program, slot, forWhom, isSubmitting, error, onSubmit }: Props) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bk-details">
      <p className="bk-ticket">
        <CalendarCheck aria-hidden="true" />
        <span>
          <strong>{program.name}</strong> · {formatSlotLong(slot)} · {program.court}
        </span>
      </p>

      {/* Honeypot anti-bots (oculto a usuarios) */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          No llenar
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-foreground/80">
          {forWhom === "child" ? "Tu nombre (apoderado/a)" : "Nombre y apellido"}
        </span>
        <input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Tu nombre" className={FIELD} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-foreground/80">WhatsApp</span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          minLength={8}
          maxLength={20}
          placeholder="+56 9 ..."
          className={FIELD}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-foreground/80">
          Correo <span className="text-muted">(opcional)</span>
        </span>
        <input name="email" type="email" autoComplete="email" maxLength={120} placeholder="tucorreo@email.com" className={FIELD} />
      </label>

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="bk-primary">
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden="true" className="animate-spin" /> Reservando...
          </>
        ) : (
          <>
            Reservar mi clase gratis <ArrowRight aria-hidden="true" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-muted">Tus datos solo se usan para coordinar tu clase. Nada de spam.</p>
    </form>
  );
}
