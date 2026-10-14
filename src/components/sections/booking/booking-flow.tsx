"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { PROGRAMS, type Program } from "@/lib/site";
import { matchPrograms, type BookingSummary, type TrialSlot } from "@/lib/booking";
import { StepAge, StepDay, StepHeading, StepProgram, StepWho, type ForWhom } from "./booking-steps";
import { StepDetails, type ContactData } from "./booking-details";
import { BookingDone } from "./booking-done";

type Step = "who" | "age" | "program" | "day" | "details" | "done";
const STEP_NUMBER: Record<Exclude<Step, "done">, number> = { who: 1, age: 2, program: 3, day: 4, details: 5 };
const TOTAL_STEPS = 5;
const DEFAULT_AGE: Record<ForWhom, number> = { self: 30, child: 8 };
const CHILD_PROGRAMS = new Set(["kids", "pro-jovenes"]);

// Reserva de clase de prueba en 5 pasos: para quién → edad → categoría → día → datos.
// Termina con la fecha real, confirmación por WhatsApp y botones de calendario.
export function BookingFlow() {
  const [history, setHistory] = useState<Step[]>(["who"]);
  const [direction, setDirection] = useState(1);
  const [forWhom, setForWhom] = useState<ForWhom>("self");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [program, setProgram] = useState<Program | null>(null);
  const [slot, setSlot] = useState<TrialSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ summary: BookingSummary; isStored: boolean } | null>(null);
  const hasNavigated = useRef(false);
  const reduceMotion = useReducedMotion();
  const step = history[history.length - 1];

  const go = (next: Step) => {
    hasNavigated.current = true;
    setDirection(1);
    setHistory((h) => [...h, next]);
  };
  const back = () => {
    hasNavigated.current = true;
    setDirection(-1);
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  };

  // Desde la ficha de una categoría ("Reservar mi clase gratis") se salta directo al día.
  useEffect(() => {
    const handler = (e: Event) => {
      const picked = PROGRAMS.find((p) => p.id === (e as CustomEvent<string>).detail);
      if (!picked) return;
      setProgram(picked);
      setForWhom(CHILD_PROGRAMS.has(picked.id) ? "child" : "self");
      setAge(undefined);
      setSlot(null);
      setResult(null);
      setError("");
      setDirection(1);
      setHistory(["who", "day"]);
    };
    window.addEventListener("select-program", handler);
    return () => window.removeEventListener("select-program", handler);
  }, []);

  // El foco sigue al paso nuevo (lectores de pantalla y teclado), sin mover el scroll.
  // Ref callback: el título nuevo se monta recién al terminar la animación de salida.
  const focusOnMount = useCallback((el: HTMLHeadingElement | null) => {
    if (el && hasNavigated.current) el.focus({ preventScroll: true });
  }, []);

  async function submit(contact: ContactData) {
    if (!program || !slot) return;
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          program: program.id,
          participantAge: age === undefined ? "" : String(age),
          forWhom,
          trialSlot: `${slot.date} ${slot.start}-${slot.end}`,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "No pudimos registrar tu solicitud. Intenta de nuevo.");
      setResult({ summary: { name: contact.name, forWhom, age, program, slot }, isStored: body.stored !== false });
      go("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No pudimos registrar tu solicitud. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function restart() {
    setProgram(null);
    setSlot(null);
    setAge(undefined);
    setResult(null);
    hasNavigated.current = true;
    setDirection(-1);
    setHistory(["who"]);
  }

  const matchCount = age === undefined ? 0 : matchPrograms(age).length;
  const titles: Record<Exclude<Step, "done">, string> = {
    who: "¿Para quién es la clase?",
    age: forWhom === "child" ? "¿Qué edad tiene?" : "¿Qué edad tienes?",
    program: matchCount === 1 ? "Esta es tu categoría." : "Elige tu categoría.",
    day: program ? `¿Qué día vienes a ${program.name}?` : "¿Qué día vienes?",
    details: "¿A quién le confirmamos?",
  };

  function renderStep() {
    switch (step) {
      case "who":
        return (
          <StepWho
            onPick={(who) => {
              setForWhom(who);
              go("age");
            }}
          />
        );
      case "age":
        return (
          <StepAge
            key={forWhom}
            forWhom={forWhom}
            initialAge={age ?? DEFAULT_AGE[forWhom]}
            onConfirm={(value) => {
              setAge(value);
              go("program");
            }}
          />
        );
      case "program":
        return age === undefined ? null : (
          <StepProgram
            age={age}
            onPick={(p) => {
              setProgram(p);
              setSlot(null);
              go("day");
            }}
          />
        );
      case "day":
        return program ? (
          <StepDay
            program={program}
            age={age}
            selected={slot}
            onPick={(s) => {
              setSlot(s);
              go("details");
            }}
          />
        ) : null;
      case "details":
        return program && slot ? (
          <StepDetails
            program={program}
            slot={slot}
            forWhom={forWhom}
            isSubmitting={isSubmitting}
            error={error}
            onSubmit={submit}
          />
        ) : null;
      case "done":
        return result ? <BookingDone summary={result.summary} isStored={result.isStored} onRestart={restart} headingRef={focusOnMount} /> : null;
    }
  }

  const offset = reduceMotion ? 0 : 36;

  return (
    <div className="bk-flow">
      {step !== "done" && (
        <div className="bk-top">
          {history.length > 1 ? (
            <button type="button" className="bk-back" onClick={back}>
              <ArrowLeft aria-hidden="true" /> Atrás
            </button>
          ) : (
            <span aria-hidden="true" />
          )}
          <div
            className="bk-progress"
            role="progressbar"
            aria-label="Avance de la reserva"
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-valuenow={STEP_NUMBER[step]}
          >
            <span style={{ width: `${(STEP_NUMBER[step] / TOTAL_STEPS) * 100}%` }} />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: direction * offset, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: direction * -offset, filter: "blur(6px)" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {step !== "done" && (
            <StepHeading
              kicker={`Paso ${STEP_NUMBER[step]} de ${TOTAL_STEPS}`}
              title={titles[step]}
              headingRef={focusOnMount}
            />
          )}
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
