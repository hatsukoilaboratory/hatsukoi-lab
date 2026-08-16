import { describe, expect, it } from "vitest";

describe("external debug verification mode", () => {
  it("can call the public site with the configured read-only mode", async () => {
    const mode = process.env.DEBUG_VERIFICATION_MODE;
    expect(mode).toBe("external-read-only");
    const response = await fetch("https://hatsukoi-lab.com/", {
      headers: { "x-debug-verification-mode": mode },
    });
    expect(response.ok).toBe(true);
  }, 15_000);
});
