import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const cssPath = path.resolve(import.meta.dirname, "index.css");
const gamePath = path.resolve(import.meta.dirname, "../public/mutual/index.html");

describe("共通ナビゲーションのマイクロインタラクション", () => {
  it("共通サイトと挑戦状の両方にホバー・フォーカス・タップ演出がある", async () => {
    const [css, game] = await Promise.all([readFile(cssPath, "utf8"), readFile(gamePath, "utf8")]);

    expect(css).toContain(".site-nav__link::before");
    expect(css).toContain(".site-nav__link::after");
    expect(css).toContain(".site-nav__link:focus-visible");
    expect(css).toContain(".site-nav__link:hover { transform: translateY(-2px);");
    expect(css).toContain(".site-nav__link:active, .button:active { transform: scale(0.97);");
    expect(game).toContain(".site-nav__link::before");
    expect(game).toContain(".site-nav__link::after");
    expect(game).toContain(".site-nav__link:focus-visible");
  });
});
