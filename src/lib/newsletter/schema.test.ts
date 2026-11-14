import { describe, expect, it } from "vitest";
import { newsletterSubscriptionSchema } from "./schema";

describe("newsletter subscription", () => {
  it("requires a valid email and explicit consent", () => {
    expect(newsletterSubscriptionSchema.safeParse({ email: "bad", consent: true }).success).toBe(false);
    expect(newsletterSubscriptionSchema.safeParse({ email: "a@example.com", consent: false }).success).toBe(false);
    expect(newsletterSubscriptionSchema.safeParse({ email: " A@EXAMPLE.COM ", consent: true }).data).toEqual({ email: "a@example.com", consent: true });
  });
});
