import { describe, expect, it } from "vitest";
import { popupIsVisible, popupSchema } from "./schema";

const base = {
  name: "Prueba", status: "published", template: "classic", path: "/", trigger: "delay",
  delaySeconds: 5, scrollPercent: 50, frequencyDays: 7, startsAt: "", endsAt: "",
  eyebrow: "Academia", title: "Clase de prueba", message: "Reserva tu cupo de prueba.",
  imageUrl: "", imageAlt: "", ctaLabel: "Reservar", ctaHref: "#inscripcion",
} as const;

describe("configuración de pop-ups", () => {
  it("muestra solo una publicación activa en su ruta", () => {
    const popup = popupSchema.parse(base);
    expect(popupIsVisible(popup, "/")).toBe(true);
    expect(popupIsVisible(popup, "/formularios/clase-de-prueba")).toBe(false);
    expect(popupIsVisible({ ...popup, status: "draft" }, "/")).toBe(false);
    expect(popupIsVisible({ ...popup, endsAt: "2020-01-01T00:00:00.000Z" }, "/")).toBe(false);
  });

  it("rechaza enlaces inseguros y una plantilla dividida sin imagen", () => {
    expect(popupSchema.safeParse({ ...base, ctaHref: "javascript:alert(1)" }).success).toBe(false);
    expect(popupSchema.safeParse({ ...base, template: "split" }).success).toBe(false);
    expect(popupSchema.safeParse({ ...base, template: "split", imageUrl: "/images/kids-joy.webp" }).success).toBe(true);
  });
});
