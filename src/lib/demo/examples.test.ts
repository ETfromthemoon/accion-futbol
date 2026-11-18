import { describe, expect, it } from "vitest";
import { formDefinitionSchema, validateFormAnswers } from "@/lib/forms/schema";
import { newsInputSchema } from "@/lib/news/schema";
import { popupSchema } from "@/lib/popups/schema";
import { demoAnswers, demoForm, demoNews, demoPopup } from "./examples";

describe("muestras del sitio", () => {
  it("mantiene ejemplos válidos y una respuesta ficticia coherente", () => {
    expect(formDefinitionSchema.safeParse(demoForm).success).toBe(true);
    expect(validateFormAnswers({ ...demoForm, status: "published" }, demoAnswers).success).toBe(true);
    const { publishedAt: _publishedAt, createdAt: _createdAt, updatedAt: _updatedAt, ...news } = demoNews;
    void _publishedAt; void _createdAt; void _updatedAt;
    expect(newsInputSchema.safeParse(news).success).toBe(true);
    expect(popupSchema.safeParse(demoPopup).success).toBe(true);
  });
});
