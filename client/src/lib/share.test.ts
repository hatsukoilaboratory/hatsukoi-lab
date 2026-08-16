import { describe, expect, it } from "vitest";
import { buildDiagnosisResultShareText, buildGameOverShareText, buildWorkShareText, buildXIntentUrl } from "./share";

describe("X共有文", () => {
  it("作品ページ用の共有文に一言・タイトル・正規URL・ハッシュタグを含める", () => {
    expect(buildWorkShareText({ quote: "「好き」", heroineName: "銀髪幼馴染ちゃん", workTitle: "作品タイトル", slug: "ginpatsu" })).toBe("「好き」\n\n銀髪幼馴染ちゃん ／ 作品タイトル\nhttps://hatsukoi-lab.com/works/ginpatsu\n#初恋ラボ");
  });

  it("診断結果用の共有文にヒロイン名・一言・診断URLを含める", () => {
    expect(buildDiagnosisResultShareText({ heroineName: "アイちゃん", quote: "「アイを伝えるよ」", slug: "ai" })).toBe("童貞探偵の推理の結果、わたしの推しは「アイちゃん」でした。\n\n「アイを伝えるよ」\n\nhttps://hatsukoi-lab.com/diagnosis/result/ai\n#初恋ラボ #童貞探偵");
  });

  it("GAME OVERの全台詞を、各発話ごとの引用符と改行で省略せずに含める", () => {
    const text = buildGameOverShareText(["くそっ！そんな…", "先生！どうしたんスか？", "…該当するキャラや作品がない！", "そんな……", "このサークルの作品にはドSに振り回してくるヒロインはいないんだ…"], "dom_s");
    expect(text).toContain("「くそっ！そんな…」\n「先生！どうしたんスか？」\n「…該当するキャラや作品がない！」\n「そんな……」\n「このサークルの作品にはドSに振り回してくるヒロインはいないんだ…」");
    expect(text).toContain("https://hatsukoi-lab.com/diagnosis/gameover?case=dom_s\n#初恋ラボ #童貞探偵");
    expect(text.match(/「/g)).toHaveLength(5);
  });

  it("X intent URLはテキストだけをエンコードし、urlパラメータを重複させない", () => {
    const url = buildXIntentUrl("1行目\n2行目");
    expect(url).toBe("https://twitter.com/intent/tweet?text=1%E8%A1%8C%E7%9B%AE%0A2%E8%A1%8C%E7%9B%AE");
    expect(url).not.toContain("&url=");
  });
});
