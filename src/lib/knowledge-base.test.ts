import { describe, expect, it } from "vitest";
import { KNOWLEDGE_BASE, searchKnowledge } from "./knowledge-base";

describe("mini base de conocimiento", () => {
  it("encuentra respuestas por palabras, acentos y términos asociados", () => {
    expect(searchKnowledge("¿Cuánto cuesta?")[0]?.id).toBe("precios");
    expect(searchKnowledge("ubicación cancha")[0]?.id).toBe("sede");
    expect(searchKnowledge("horarios niños")[0]?.id).toBe("kids");
  });

  it("filtra por tema y no inventa respuesta para preguntas fuera de la base", () => {
    expect(searchKnowledge("horario", "Pagos")).toEqual([]);
    expect(searchKnowledge("¿Qué pasa si llueve?")).toEqual([]);
    expect(searchKnowledge("", "Sede").every((entry) => entry.topic === "Sede")).toBe(true);
  });

  it("mantiene identificadores únicos y respuestas publicables", () => {
    expect(new Set(KNOWLEDGE_BASE.map((entry) => entry.id)).size).toBe(KNOWLEDGE_BASE.length);
    expect(KNOWLEDGE_BASE.every((entry) => entry.question && entry.answer)).toBe(true);
  });
});
