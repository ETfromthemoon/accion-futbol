"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), consent: data.get("consent") === "on" }),
      });
      if (!response.ok) throw new Error("No disponible");
      form.reset();
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="newsletter-email" className="text-sm font-semibold">Correo electrónico</label>
      <input id="newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} className="rounded-xl border border-border bg-background px-4 py-3" />
      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-1" />
        Acepto recibir novedades de Acción Fútbol por correo.
      </label>
      <button type="submit" disabled={state === "loading"} className="rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
        {state === "loading" ? "Enviando…" : "Solicitar novedades"}
      </button>
      {state === "done" && <p role="status" className="text-sm">Recibimos tu solicitud. Queda pendiente de confirmación antes de enviarte correos.</p>}
      {state === "error" && <p role="alert" className="text-sm">No pudimos recibir tu solicitud. Inténtalo más tarde.</p>}
    </form>
  );
}
