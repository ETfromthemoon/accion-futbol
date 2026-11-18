import { describe, expect, it } from "vitest";
import { formDefinitionSchema, validateFormAnswers } from "@/lib/forms/schema";
import { newsInputSchema } from "@/lib/news/schema";
import { popupSchema } from "@/lib/popups/schema";
import { demoAnswers, demoForm, demoNews, demoNewsletter, demoPopup } from "./examples";

describe("muestras del sitio", () => {
  it("mantiene ejemplos válidos y una respuesta ficticia coherente", () => {
    expect(formDefinitionSchema.safeParse(demoForm).success).toBe(true);
    expect(validateFormAnswers({ ...demoForm, status: "published" }, demoAnswers).success).toBe(true);
    expect(new Set(demoForm.fields.map((field) => field.type))).toEqual(new Set(["text", "email", "tel", "select", "textarea", "checkbox"]));
    const { publishedAt: _publishedAt, createdAt: _createdAt, updatedAt: _updatedAt, ...news } = demoNews;
    void _publishedAt; void _createdAt; void _updatedAt;
    expect(newsInputSchema.safeParse({ ...news, status: "published" }).success).toBe(true);
    for (const template of ["classic", "split", "banner"] as const) {
      expect(popupSchema.safeParse({ ...demoPopup, status: "published", template }).success).toBe(true);
    }
    expect(demoNewsletter.featureHref).toMatch(/^\//);
    expect(demoNewsletter.storyHref).toMatch(/^\//);
  });
});
