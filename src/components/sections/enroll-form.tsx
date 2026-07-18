"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { CONTACT, PROGRAM_OPTIONS } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

export function EnrollForm() {
  const [program, setProgram] = useState(PROGRAM_OPTIONS[0].value);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Preselección desde las tarjetas de programa.
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) setProgram(id);
    };
    window.addEventListener("select-program", handler);
    return () => window.removeEventListener("select-program", handler);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      program: String(data.get("program") ?? ""),
      participantAge: String(data.get("participantAge") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    };

    try {
      const res = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Error al enviar");
      }
      setStatus("success");
      form.reset();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "No pudimos enviar tu solicitud. Intenta de nuevo.",
      );
      setStatus("error");
    }
  }

  return (
    <section id="inscripcion" className="relative overflow-hidden py-24 sm:py-32">
      {/* Fondo cinematográfico */}
      <Image
        src="/images/adults-duel.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="section-tag">Clase de prueba gratis</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-balance">
            Déjanos tus datos y nos vemos en la cancha.
          </h2>
          <p className="mt-5 text-lg text-foreground/75">
            Te coordinamos día y hora por WhatsApp en menos de 24 horas. Sin
            costo y sin compromiso: vienes, entrenas y luego decides.
          </p>

          <ul className="mt-8 flex flex-col gap-3 text-foreground/80">
            {[
              "Una clase completa, gratis",
              "Te ubicamos en el grupo según tu edad y nivel",
              "Resolvemos todas tus dudas en cancha",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-panel relative rounded-[1.75rem] p-6 sm:p-8">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
              >
                <CheckCircle2 className="size-16 text-primary" />
                <h3 className="mt-5 font-display text-2xl font-extrabold">
                  ¡Listo! Recibimos tu solicitud.
                </h3>
                <p className="mt-3 max-w-sm text-foreground/75">
                  Te vamos a contactar muy pronto para coordinar tu clase de
                  prueba. Si quieres adelantar, escríbenos directo por WhatsApp.
                </p>
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display font-semibold text-primary-foreground transition-transform hover:scale-105"
                >
                  Escribir por WhatsApp
                  <ArrowRight className="size-4" />
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {/* Honeypot anti-bots (oculto a usuarios) */}
                <div aria-hidden className="absolute -left-[9999px]">
                  <label>
                    No llenar
                    <input name="company" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-foreground/80">
                      Nombre y apellido
                    </span>
                    <input
                      name="name"
                      required
                      minLength={2}
                      placeholder="Tu nombre"
                      className={FIELD}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-foreground/80">Teléfono</span>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="+56 9 ..."
                      className={FIELD}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-foreground/80">Correo</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="tucorreo@email.com"
                    className={FIELD}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-foreground/80">
                      Programa de interés
                    </span>
                    <select
                      name="program"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className={FIELD}
                    >
                      {PROGRAM_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-foreground/80">
                      Edad del participante
                    </span>
                    <input
                      name="participantAge"
                      placeholder="Ej: 32 / 8 años"
                      className={FIELD}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-foreground/80">
                    Mensaje (opcional)
                  </span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Cuéntanos tu experiencia o tus dudas"
                    className={`${FIELD} resize-none`}
                  />
                </label>

                {status === "error" && (
                  <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-display text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Agendar mi clase de prueba
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-muted">
                  Tus datos solo se usan para coordinar tu clase. Nada de spam.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
