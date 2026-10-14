"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Baby, Clock, MapPin, MessageCircle, Minus, Plus, User } from "lucide-react";
import { whatsappLink, type Program } from "@/lib/site";
import { displayTime, formatSlotShort, matchPrograms, nextSessions, type TrialSlot } from "@/lib/booking";

export type ForWhom = "self" | "child";

type HeadingProps = { kicker: string; title: string; headingRef: React.Ref<HTMLHeadingElement> };

export function StepHeading({ kicker, title, headingRef }: HeadingProps) {
  return (
    <div className="bk-heading">
      <p className="bk-kicker">{kicker}</p>
      <h3 ref={headingRef} tabIndex={-1}>{title}</h3>
    </div>
  );
}

// Paso 1 · ¿Para quién es la clase?
export function StepWho({ onPick }: { onPick: (who: ForWhom) => void }) {
  const options = [
    { id: "self" as const, icon: User, title: "Para mí", hint: "Adultos AM, PM y Femenino" },
    { id: "child" as const, icon: Baby, title: "Para mi hijo o hija", hint: "Kids (4 a 14) y Pro (13 a 18)" },
  ];
  return (
    <div className="bk-choices">
      {options.map(({ id, icon: Icon, title, hint }) => (
        <button key={id} type="button" className="bk-choice" onClick={() => onPick(id)}>
          <Icon aria-hidden="true" className="bk-choice-icon" />
          <span className="bk-choice-title">{title}</span>
          <span className="bk-choice-hint">{hint}</span>
          <ArrowRight aria-hidden="true" className="bk-choice-arrow" />
        </button>
      ))}
    </div>
  );
}

const MIN_AGE = 3;
const MAX_AGE = 80;

// Paso 2 · Edad. Sin programa para esa edad, ofrece orientación por WhatsApp.
export function StepAge({ forWhom, initialAge, onConfirm }: { forWhom: ForWhom; initialAge: number; onConfirm: (age: number) => void }) {
  const [age, setAge] = useState(initialAge);
  const clamp = (n: number) => Math.min(MAX_AGE, Math.max(MIN_AGE, Math.round(n)));
  const matches = matchPrograms(age);
  const label = forWhom === "child" ? "Edad de tu hijo o hija" : "Tu edad";

  return (
    <div className="bk-age">
      <div className="bk-stepper" role="group" aria-label={label}>
        <button type="button" aria-label="Restar un año" onClick={() => setAge((a) => clamp(a - 1))} disabled={age <= MIN_AGE}>
          <Minus aria-hidden="true" />
        </button>
        <label className="bk-age-value">
          <span className="sr-only">{label}</span>
          <input
            type="number"
            inputMode="numeric"
            min={MIN_AGE}
            max={MAX_AGE}
            value={age}
            onChange={(e) => setAge(clamp(Number(e.target.value) || MIN_AGE))}
          />
          <span aria-hidden="true">años</span>
        </label>
        <button type="button" aria-label="Sumar un año" onClick={() => setAge((a) => clamp(a + 1))} disabled={age >= MAX_AGE}>
          <Plus aria-hidden="true" />
        </button>
      </div>

      <p className="bk-age-hint" aria-live="polite">
        {matches.length > 0
          ? `${matches.length === 1 ? "Tenemos 1 categoría" : `Tenemos ${matches.length} categorías`} para ${age} años: ${matches.map((p) => p.name).join(", ")}.`
          : `Hoy no tenemos un grupo publicado para ${age} años. Escríbenos y te orientamos.`}
      </p>

      {matches.length > 0 ? (
        <button type="button" className="bk-primary" onClick={() => onConfirm(age)}>
          Ver mi categoría <ArrowRight aria-hidden="true" />
        </button>
      ) : (
        <a
          className="bk-primary"
          href={whatsappLink(`Hola, quiero saber si hay un grupo de Acción Fútbol para ${age} años.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle aria-hidden="true" /> Consultar por WhatsApp
        </a>
      )}
    </div>
  );
}

// Paso 3 · Categoría recomendada (o a elegir, si hay más de una para esa edad).
export function StepProgram({ age, onPick }: { age: number; onPick: (program: Program) => void }) {
  const matches = matchPrograms(age);
  return (
    <ul className="bk-programs">
      {matches.map((p) => {
        const slot = p.sessions.find((s) => !s.ages || (age >= s.ages[0] && age <= s.ages[1]));
        const time = slot ? `${displayTime(slot.start)} a ${displayTime(slot.end)}` : p.schedule;
        return (
          <li key={p.id}>
            <button type="button" className="bk-program" onClick={() => onPick(p)}>
              <span className="bk-program-art" aria-hidden="true">
                <Image src={`/images/categorias/char-${p.id}.webp`} alt="" fill sizes="96px" />
              </span>
              <span className="bk-program-body">
                <span className="bk-program-name">{p.name}</span>
                <span className="bk-program-meta"><Clock aria-hidden="true" />{p.schedule.split(" · ")[0]} · {time}</span>
                <span className="bk-program-meta"><MapPin aria-hidden="true" />{p.court} · {p.monthly}</span>
              </span>
              <ArrowRight aria-hidden="true" className="bk-choice-arrow" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Paso 4 · Día de la clase: próximas sesiones reales del programa.
export function StepDay({
  program,
  age,
  selected,
  onPick,
}: {
  program: Program;
  age?: number;
  selected: TrialSlot | null;
  onPick: (slot: TrialSlot) => void;
}) {
  // La fecha se toma al entrar al paso (en el navegador), no al compilar la página.
  const [now] = useState(() => new Date());
  const slots = nextSessions(program, { age, from: now, count: 6 });
  const isSelected = (s: TrialSlot) => selected?.date === s.date && selected.start === s.start;

  return (
    <div className="bk-days" role="group" aria-label={`Próximas clases de ${program.name}`}>
      {slots.map((s) => {
        const f = formatSlotShort(s);
        return (
          <button
            key={`${s.date}-${s.start}`}
            type="button"
            aria-pressed={isSelected(s)}
            className="bk-day"
            onClick={() => onPick(s)}
          >
            <span className="bk-day-name">{f.day}</span>
            <span className="bk-day-date">{f.date}</span>
            <span className="bk-day-time">{f.time}</span>
            {age === undefined && s.ages && <span className="bk-day-ages">{s.ages[0]} a {s.ages[1]} años</span>}
          </button>
        );
      })}
    </div>
  );
}
