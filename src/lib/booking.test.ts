import { describe, expect, it } from "vitest";
import {
  bookingMessage,
  formatSlotLong,
  formatSlotShort,
  googleCalendarUrl,
  icsContent,
  matchPrograms,
  nextSessions,
  santiagoToUtc,
  todayInSantiago,
} from "./booking";
import { PROGRAMS } from "./site";

const program = (id: string) => {
  const p = PROGRAMS.find((x) => x.id === id);
  if (!p) throw new Error(id);
  return p;
};
// Miércoles 14 de octubre de 2026, 12:00 en Santiago.
const WEDNESDAY = new Date("2026-10-14T15:00:00Z");

describe("matchPrograms", () => {
  it("sends children to Kids", () => {
    expect(matchPrograms(6).map((p) => p.id)).toEqual(["kids"]);
  });

  it("offers Kids and Pro at 13 and 14 years", () => {
    expect(matchPrograms(13).map((p) => p.id)).toEqual(["kids", "pro-jovenes"]);
  });

  it("offers the three adult programs from 25 years", () => {
    expect(matchPrograms(30).map((p) => p.id)).toEqual(["am-adultos", "pm-adultos", "femenino"]);
  });

  it("returns nothing between 19 and 24 years and under 4", () => {
    expect(matchPrograms(21)).toEqual([]);
    expect(matchPrograms(3)).toEqual([]);
  });
});

describe("todayInSantiago", () => {
  it("uses the Santiago calendar date, not UTC", () => {
    // 01:00 UTC del 15 = 22:00 del 14 en Santiago.
    expect(todayInSantiago(new Date("2026-10-15T01:00:00Z"))).toBe("2026-10-14");
  });
});

describe("nextSessions", () => {
  it("starts tomorrow and follows the weekly days", () => {
    const dates = nextSessions(program("am-adultos"), { from: WEDNESDAY, count: 4 }).map((s) => s.date);
    expect(dates).toEqual(["2026-10-15", "2026-10-19", "2026-10-20", "2026-10-21"]);
  });

  it("picks the Kids slot that matches the age", () => {
    const young = nextSessions(program("kids"), { age: 6, from: WEDNESDAY, count: 2 });
    const older = nextSessions(program("kids"), { age: 11, from: WEDNESDAY, count: 2 });
    expect(young.map((s) => `${s.date} ${s.start}`)).toEqual(["2026-10-17 09:00", "2026-10-24 09:00"]);
    expect(older.map((s) => `${s.date} ${s.start}`)).toEqual(["2026-10-17 10:30", "2026-10-24 10:30"]);
  });

  it("lists both Kids slots when the age is unknown", () => {
    const slots = nextSessions(program("kids"), { from: WEDNESDAY, count: 2 });
    expect(slots.map((s) => s.start)).toEqual(["09:00", "10:30"]);
  });

  it("does not offer today's session", () => {
    const thursday = new Date("2026-10-15T09:00:00Z"); // 6:00 del jueves en Santiago
    expect(nextSessions(program("am-adultos"), { from: thursday, count: 1 })[0].date).toBe("2026-10-19");
  });
});

describe("santiagoToUtc", () => {
  it("applies summer time (UTC-3) in October", () => {
    expect(santiagoToUtc("2026-10-17", "09:00").toISOString()).toBe("2026-10-17T12:00:00.000Z");
  });

  it("applies winter time (UTC-4) in June", () => {
    expect(santiagoToUtc("2026-06-20", "09:00").toISOString()).toBe("2026-06-20T13:00:00.000Z");
  });
});

describe("formatting and calendar links", () => {
  const slot = nextSessions(program("kids"), { age: 6, from: WEDNESDAY, count: 1 })[0];

  it("formats the slot for chips and sentences", () => {
    expect(formatSlotShort(slot)).toEqual({ day: "Sáb", date: "17 oct", time: "9:00" });
    expect(formatSlotLong(slot)).toBe("sábado 17 de octubre, 9:00 a 10:20");
  });

  it("builds a Google Calendar link in UTC", () => {
    const url = new URL(googleCalendarUrl(slot, program("kids")));
    expect(url.searchParams.get("dates")).toBe("20261017T120000Z/20261017T132000Z");
    expect(url.searchParams.get("location")).toContain("Cancha 7");
  });

  it("builds a valid .ics event", () => {
    const ics = icsContent(slot, program("kids"), WEDNESDAY);
    expect(ics).toContain("DTSTART:20261017T120000Z\r\n");
    expect(ics).toContain("DTEND:20261017T132000Z\r\n");
    expect(ics).toContain("LOCATION:Cancha 7 · Club Oriente\\, Nueva Bilbao 9495\\, Las Condes");
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
  });

  it("writes the WhatsApp message with who, when and where", () => {
    expect(
      bookingMessage({ name: "Carolina", forWhom: "child", age: 6, program: program("kids"), slot }),
    ).toBe(
      "Hola, soy Carolina. Quiero confirmar una clase de prueba en Kids Niños/as para mi hijo/a de 6 años el sábado 17 de octubre, 9:00 a 10:20, Cancha 7.",
    );
  });

  it("omits the age when the visitor came from a category card", () => {
    const am = nextSessions(program("am-adultos"), { from: WEDNESDAY, count: 1 })[0];
    expect(bookingMessage({ name: "Rodrigo", forWhom: "self", program: program("am-adultos"), slot: am })).toBe(
      "Hola, soy Rodrigo. Quiero confirmar una clase de prueba en AM Adultos el jueves 15 de octubre, 6:30 a 7:45, Cancha 16.",
    );
  });
});
