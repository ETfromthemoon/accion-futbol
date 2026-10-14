// Lógica del flujo de reserva de clase de prueba: qué categoría corresponde a
// cada edad, próximas sesiones reales y enlaces de calendario. Sin React, para
// poder testearla (src/lib/booking.test.ts).
import { PROGRAMS, SEDES, type Program } from "@/lib/site";

export const TIME_ZONE = "America/Santiago";
const DAY_MS = 86_400_000;
const DAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] as const;
const DAYS_LONG = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"] as const;
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"] as const;
const MONTHS_LONG = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
] as const;

export type TrialSlot = {
  programId: string;
  date: string; // "YYYY-MM-DD" en Santiago
  weekday: number; // 0 = domingo
  start: string; // "HH:MM"
  end: string;
  ages?: readonly [number, number];
};

// Programas cuyo rango de edad incluye la edad dada, en el orden del sitio.
export function matchPrograms(age: number): Program[] {
  return PROGRAMS.filter((p) => age >= p.ageRange[0] && age <= p.ageRange[1]);
}

// Fecha de hoy (calendario) en Santiago, como "YYYY-MM-DD".
export function todayInSantiago(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function addDays(isoDate: string, days: number): { iso: string; weekday: number } {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d) + days * DAY_MS);
  return { iso: date.toISOString().slice(0, 10), weekday: date.getUTCDay() };
}

type NextSessionsOptions = { age?: number; from: Date; count?: number; horizonDays?: number };

// Próximas sesiones del programa desde mañana (la academia necesita un día para
// confirmar). Si se conoce la edad, solo el tramo que le corresponde.
export function nextSessions(
  program: Program,
  { age, from, count = 6, horizonDays = 35 }: NextSessionsOptions,
): TrialSlot[] {
  const today = todayInSantiago(from);
  const sessions = program.sessions.filter(
    (s) => age === undefined || !s.ages || (age >= s.ages[0] && age <= s.ages[1]),
  );
  const slots: TrialSlot[] = [];
  for (let offset = 1; offset <= horizonDays && slots.length < count; offset++) {
    const day = addDays(today, offset);
    for (const s of sessions) {
      if (!s.days.includes(day.weekday) || slots.length >= count) continue;
      slots.push({ programId: program.id, date: day.iso, weekday: day.weekday, start: s.start, end: s.end, ages: s.ages });
    }
  }
  return slots;
}

// "GMT-03:00" → -180 (minutos respecto de UTC).
function offsetMinutes(instant: Date): number {
  const name = new Intl.DateTimeFormat("en", { timeZone: TIME_ZONE, timeZoneName: "longOffset" })
    .formatToParts(instant)
    .find((p) => p.type === "timeZoneName")?.value;
  const match = name?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

// Hora local de Santiago → instante UTC (respeta el horario de verano de Chile).
export function santiagoToUtc(isoDate: string, time: string): Date {
  const naive = new Date(`${isoDate}T${time}:00Z`);
  // Dos pasadas: la primera estima el offset; la segunda lo corrige en el instante real.
  const first = new Date(naive.getTime() - offsetMinutes(naive) * 60_000);
  return new Date(naive.getTime() - offsetMinutes(first) * 60_000);
}

const compactUtc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
export const displayTime = (time: string) => time.replace(/^0/, "");

export function formatSlotShort(slot: TrialSlot) {
  const [, m, d] = slot.date.split("-").map(Number);
  return { day: DAYS_SHORT[slot.weekday], date: `${d} ${MONTHS[m - 1]}`, time: displayTime(slot.start) };
}

// "sábado 17 de octubre, 9:00 a 10:20"
export function formatSlotLong(slot: TrialSlot): string {
  const [, m, d] = slot.date.split("-").map(Number);
  return `${DAYS_LONG[slot.weekday]} ${d} de ${MONTHS_LONG[m - 1]}, ${displayTime(slot.start)} a ${displayTime(slot.end)}`;
}

function courtOf(program: Program) {
  return `${program.court} · ${SEDES[0].name}, ${SEDES[0].address}`;
}

function eventText(program: Program) {
  return {
    title: `Clase de prueba Acción Fútbol · ${program.name}`,
    details: `Clase de prueba gratis en ${program.name}. La academia te confirma por WhatsApp. Lleva ropa deportiva, zapatos de fútbol y agua.`,
    location: courtOf(program),
  };
}

export function googleCalendarUrl(slot: TrialSlot, program: Program): string {
  const { title, details, location } = eventText(program);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${compactUtc(santiagoToUtc(slot.date, slot.start))}/${compactUtc(santiagoToUtc(slot.date, slot.end))}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const icsEscape = (text: string) => text.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

// Archivo .ics (Apple Calendar, Outlook). Horas en UTC para no depender de VTIMEZONE.
export function icsContent(slot: TrialSlot, program: Program, now: Date): string {
  const { title, details, location } = eventText(program);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Accion Futbol//Clase de prueba//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${slot.programId}-${slot.date}-${slot.start.replace(":", "")}@accionfutbol.cl`,
    `DTSTAMP:${compactUtc(now)}`,
    `DTSTART:${compactUtc(santiagoToUtc(slot.date, slot.start))}`,
    `DTEND:${compactUtc(santiagoToUtc(slot.date, slot.end))}`,
    `SUMMARY:${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(details)}`,
    `LOCATION:${icsEscape(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export type BookingSummary = {
  name: string;
  forWhom: "self" | "child";
  age?: number; // desconocida cuando se llega desde la ficha de una categoría
  program: Program;
  slot: TrialSlot;
};

// Mensaje precargado de WhatsApp con todo lo que la academia necesita para confirmar.
export function bookingMessage({ name, forWhom, age, program, slot }: BookingSummary): string {
  const who =
    forWhom === "child"
      ? ` para mi hijo/a${age === undefined ? "" : ` de ${age} años`}`
      : age === undefined ? "" : ` (tengo ${age} años)`;
  return `Hola, soy ${name}. Quiero confirmar una clase de prueba en ${program.name}${who} el ${formatSlotLong(slot)}, ${program.court}.`;
}
