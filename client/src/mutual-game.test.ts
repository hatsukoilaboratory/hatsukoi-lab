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

  it("判定結果を操作直後に表示し、同じ回答の連続判定を拒否する", async () => {
    const html = await readFile(gamePath, "utf8");
    const actionIndex = html.indexOf('id="submit-button"');
    const verdictIndex = html.indexOf('id="narumi-response"');
    const characterIndex = html.indexOf('id="character-grid"');

    expect(actionIndex).toBeGreaterThan(-1);
    expect(verdictIndex).toBeGreaterThan(actionIndex);
    expect(characterIndex).toBeGreaterThan(verdictIndex);
    expect(html).toContain("lastSubmittedSignature");
    expect(html).toContain("function submissionSignature()");
    expect(html).toContain("state.lastSubmittedSignature===signature");
    expect(html).toContain("判定済み！");
    expect(html).toContain("response.scrollIntoView");
  });

  it("プレイ中のコレクション閲覧から推理状態を維持して戻れる", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("道庭探偵事務所</span>");
    expect(html).not.toContain("道庭探偵事務所　留守番中");
    expect(html).toContain("function openCollection(origin='title')");
    expect(html).toContain("openCollection('game')");
    expect(html).toContain("推理に戻る");
    expect(html).toContain("function returnFromCollection()");
    expect(html).toContain("setScreen('game')");
  });

  it("ヒントを見逃さず、クリア結果からもコレクションへ往復できる", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain("bounds.top<0||bounds.bottom>window.innerHeight");
    expect(html).toContain("response.scrollIntoView({behavior:'smooth',block:'nearest'})");
    expect(html).toContain("openCollection('clear')");
    expect(html).toContain("結果に戻る");
    expect(html).toContain("setScreen('clear')");
    expect(html).toContain('/assets/narumi_guide_c5705590.webp');
    expect(html).not.toContain('narumi_thinking_242d2aa2.webp');
  });

  it("恋愛嗜好捜査と同じ共通ヘッダーと研究ノート基盤を使う", async () => {
    const html = await readFile(gamePath, "utf8");

    expect(html).toContain('tube_full_1bee8d1e.svg');
    expect(html).toContain('aria-label="メインナビゲーション"');
    expect(html).toContain('トップ</a>');
    expect(html).toContain('作品をえらぶ</a>');
    expect(html).toContain('おたのしみ</a>');
    expect(html).toContain('お仕事のご依頼</a>');
    expect(html).toContain('M+PLUS+Rounded+1c');
    expect(html).toContain('game-shell--detective');
    expect(html).toContain('background-size:21px 21px');
  });
});
