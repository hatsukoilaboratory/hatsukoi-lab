import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("production build contract", () => {
  it("keeps the external static build and WebDev runtime entry together", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };

    expect(packageJson.scripts["build:web"]).toContain("vite build");
    expect(packageJson.scripts.build).toContain("pnpm build:web");
    expect(packageJson.scripts.build).toContain("esbuild server/index.ts");
    expect(packageJson.scripts.start).toContain("node dist/index.js");
  });
});

