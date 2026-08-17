import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("おたのしみ導線", () => {
  it("推し調査と両想いゲームをまとめる公開ページと共通ナビを維持する", async () => {
    const app = await readFile(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    const header = await readFile(resolve(process.cwd(), "client/src/components/SiteHeader.tsx"), "utf8");
    const page = await readFile(resolve(process.cwd(), "client/src/pages/Fun.tsx"), "utf8");

    expect(app).toContain('path={"/fun"}');
    expect(header).toContain('href="/fun"');
    expect(header).toContain("おたのしみ");
    expect(page).toContain('href: "/diagnosis"');
    expect(page).toContain('href: "/mutual"');
  });
});
