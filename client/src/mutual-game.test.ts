import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const gamePath = resolve(process.cwd(), "client/public/mutual/index.html");
const heroinesPath = resolve(process.cwd(), "client/src/data/heroines.ts");

describe("鳴海からの挑戦状", () => {
  it("単一HTML内に編集可能なキャラ・ヒント・接点データを保持する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("鳴海からの挑戦状");
    expect(html).toContain("先生の実力、見せるっス！");
    expect(html).toContain("const CHARACTER_MASTER");
    expect(html).toContain("const INTRO");
    expect((html.match(/id:'char\d+'/g) ?? []).length).toBe(9);
    expect((html.match(/facePosition:/g) ?? []).length).toBe(9);
    expect((html.match(/gift:null/g) ?? []).length).toBe(9);
    expect((html.match(/connection:'/g) ?? []).length).toBe(9);
    expect(html).toContain("name:'三浦 夏'");
    expect(html).toContain("icon:'/assets/ai_611005db.webp'");
    expect(html).toContain("icon:'/assets/haishinsha_97c8bdd3.webp'");
    expect(html).toContain("image-avatar");
    expect(html).toContain("michiba_speaking_c6eed801.webp");
    expect(html).toContain("narumi_guide_c5705590.webp");
    expect(html).toContain('name="robots" content="noindex,follow"');
    expect(html).toContain('rel="canonical" href="https://hatsukoi-lab.com/mutual"');
  });

  it("候補を指定順に表示し、配信者ちゃんとアイちゃんのちびキャラ対応を維持する", async () => {
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

  it("3人・4人モード、HIT/BLOW、任意ヒント、履歴、コレクション、X共有を実装する", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain('data-start="three"');
    expect(html).toContain('data-start="four"');
    expect(html).toContain("function placeCharacter");
    expect(html).toContain("function clearSlots()");
    expect(html).toContain("HIT ${verdict.hit}");
    expect(html).toContain("BLOW ${verdict.blow}");
    expect(html).toContain("鳴海の判定");
    expect(html).toContain("鳴海にヒントを聞く");
    expect(html).toContain("function showHint()");
    expect(html).toContain("state.hintCount>=3");
    expect(html).toContain("もう少し聞く");
    expect(html).toContain("もっと教えてもらう");
    expect(html).toContain("const FOUND_KEY");
    expect(html).toContain("function makeAnswer(size)");
    expect(html).toContain("function renderCollection()");
    expect(html).toContain("https://twitter.com/intent/tweet");
    expect(html).toContain("ノーヒント");
    expect(html).not.toContain("両想い");
    expect(html).not.toContain("すれ違い");
    expect(html).not.toContain("証言メモ");
    expect(html).not.toContain("trait:");
  });
});
