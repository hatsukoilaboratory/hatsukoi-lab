import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Cloudflare Pages update guide", () => {
  it("documents the Direct Upload production update flow", () => {
    const guide = readFileSync(
      resolve(process.cwd(), "docs", "cloudflare-pages-update-guide.md"),
      "utf8",
    );

    expect(guide).toContain("Create a new deployment");
    expect(guide).toContain("Production");
    expect(guide).toContain("Save and Deploy");
    expect(guide).toContain("hatsukoi-lab.com");
  });
});
