import { describe, expect, it } from "vitest";
import { checkPublicFormLimit } from "./abuse";

describe("public form submission limits", () => {
  it("caps accepted submissions per form and IP in a rolling window", () => {
    const ip = `abuse-test-${Date.now()}`;
    for (let attempt = 0; attempt < 10; attempt += 1) expect(checkPublicFormLimit("rate-test", ip).allowed).toBe(true);
    const limited = checkPublicFormLimit("rate-test", ip);
    expect(limited.allowed).toBe(false);
    expect(limited.retryAfter).toBeGreaterThan(0);
  });
});
