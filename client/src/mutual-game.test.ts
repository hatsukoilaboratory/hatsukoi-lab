import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const gamePath = resolve(process.cwd(), "client/public/mutual/index.html");
const heroinesPath = resolve(process.cwd(), "client/src/data/heroines.ts");

describe("両想いとすれ違い（仮）", () => {
  it("単一HTML内に編集可能なキャラ・事件・判定データを保持する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("助手・鳴海の");
    expect(html).toContain("const CHARACTER_MASTER");
    expect(html).toContain("const CASE_DATA");
    expect(html).toContain("const VERDICT_LINES");
    expect(html).toContain("answer:'random'");
    expect((html.match(/id:'char\d+'/g) ?? []).length).toBe(9);
    expect((html.match(/facePosition:/g) ?? []).length).toBe(9);
    expect(html).toContain("name:'三浦 夏'");
    expect(html).toContain("icon:'/assets/ai_611005db.webp'");
    expect(html).toContain("icon:'/assets/haishinsha_97c8bdd3.webp'");
    expect(html).toContain("image-avatar");
    expect(html).toContain("michiba_speaking_c6eed801.webp");
    expect(html).toContain("narumi_guide_c5705590.webp");
    expect(html).toContain('name="robots" content="noindex,follow"');
    expect(html).toContain('rel="canonical" href="https://hatsukoi-lab.com/mutual"');
  });

  it("候補を指定順に表示し、配信者ちゃんとアイちゃんのちびキャラを正しく対応付ける", async () => {
    const [html, heroines] = await Promise.all([
      readFile(gamePath, "utf8"),
      readFile(heroinesPath, "utf8"),
    ]);

    const expectedOrder = [
      "銀髪ちゃん",
      "後輩ちゃん",
      "ボクっ娘",
      "同期ちゃん",
      "配信者ちゃん",
      "アイちゃん",
      "水城さん",
      "小糸ちゃん",
      "三浦 夏",
    ];
    const positions = expectedOrder.map((name) => html.indexOf(`name:'${name}'`));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(heroines).toMatch(/slug: "haishinsha"[\s\S]*?chibiImage: "\/assets\/ai_611005db\.webp"/);
    expect(heroines).toMatch(/slug: "ai"[\s\S]*?chibiImage: "\/assets\/haishinsha_97c8bdd3\.webp"/);
  });

  it("イージー・ノーマル、証言、履歴、ローカル記録、X共有を実装する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("data-start=\"easy\"");
    expect(html).toContain("data-start=\"normal\"");
    expect(html).toContain("Math.floor(state.history.length/3)");
    expect(html).toContain("localStorage.getItem(bestKey())");
    expect(html).toContain("https://twitter.com/intent/tweet");
    expect(html).toContain('id="clear-button"');
    expect(html).toContain("function clearSlots()");
    expect(html).not.toContain("else { state.slots=Array(DIFFICULTY[state.mode].size).fill(null);");
  });
});
