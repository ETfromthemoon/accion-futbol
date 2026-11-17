import { describe, expect, it } from "vitest";
import { newsInputSchema, newsSlugSchema } from "./schema";

const valid = {
  slug: "torneo-de-verano", title: "Torneo de verano en la academia",
  summary: "Conoce las fechas y detalles del próximo encuentro en la cancha.",
  body: "Abrimos una nueva jornada para compartir fútbol con toda la comunidad.",
  coverImage: "/images/group-team.webp", coverAlt: "Jugadores reunidos en la cancha",
  status: "published",
};

describe("noticias", () => {
  it("acepta una publicación completa y rechaza enlaces no seguros", () => {
    expect(newsInputSchema.safeParse(valid).success).toBe(true);
    expect(newsInputSchema.safeParse({ ...valid, coverImage: "javascript:alert(1)" }).success).toBe(false);
    expect(newsInputSchema.safeParse({ ...valid, coverImage: "https://user:pass@example.com/a.jpg" }).success).toBe(false);
  });

  it("requiere texto alternativo cuando hay imagen y limita el identificador", () => {
    expect(newsInputSchema.safeParse({ ...valid, coverAlt: "" }).success).toBe(false);
    expect(newsSlugSchema.safeParse("../admin").success).toBe(false);
    expect(newsSlugSchema.safeParse("Torneo Nuevo").success).toBe(false);
  });
});
