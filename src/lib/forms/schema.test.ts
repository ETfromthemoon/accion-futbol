import { describe, expect, it } from "vitest";
import { formDefinitionSchema, validateFormAnswers } from "./schema";

const form = formDefinitionSchema.parse({
  slug: "prueba", title: "Inscripción", version: 1, status: "published",
  fields: [
    { id: "correo", label: "Correo", type: "email", required: true },
    { id: "grupo", label: "Grupo", type: "select", required: true, options: [{ value: "kids", label: "Kids" }] },
    { id: "acuerdo", label: "Acepto", type: "checkbox", required: true },
  ],
});

describe("formularios", () => {
  it("acepta y normaliza una respuesta válida", () => {
    expect(validateFormAnswers(form, { correo: "  a@example.com ", grupo: "kids", acuerdo: true })).toEqual({
      success: true, answers: { correo: "a@example.com", grupo: "kids", acuerdo: true },
    });
  });
  it("rechaza campos extra, opciones inválidas y consentimiento ausente", () => {
    expect(validateFormAnswers(form, { correo: "a@example.com", grupo: "otro", acuerdo: false, extra: "x" }).success).toBe(false);
  });
  it("no recibe respuestas para borradores", () => {
    expect(validateFormAnswers({ ...form, status: "draft" }, {}).success).toBe(false);
  });
  it("rechaza identificadores duplicados", () => {
    expect(formDefinitionSchema.safeParse({ ...form, fields: [form.fields[0], form.fields[0]] }).success).toBe(false);
  });
  it("admite una portada accesible y rechaza URL e imagen sin descripción", () => {
    expect(formDefinitionSchema.safeParse({ ...form, description: "Inscríbete", coverImage: "/images/kids-joy.webp", coverAlt: "Jugadores en la cancha" }).success).toBe(true);
    expect(formDefinitionSchema.safeParse({ ...form, coverImage: "/images/kids-joy.webp" }).success).toBe(false);
    expect(formDefinitionSchema.safeParse({ ...form, coverImage: "javascript:alert(1)", coverAlt: "Imagen" }).success).toBe(false);
  });
});
