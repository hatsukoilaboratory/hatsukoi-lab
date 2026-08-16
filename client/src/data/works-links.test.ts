import { describe, expect, it } from "vitest";
import { works } from "./works";

describe("作品別販売リンク", () => {
  it("FANZAを基準に本編のDLsite・BOOTH対応を固定する", () => {
    const expected: Record<string, { d: string; b: string }> = {
      ginpatsu: { d: "RJ01323373", b: "6476010" },
      kouhai: { d: "RJ01330432", b: "6522126" },
      bokukko: { d: "RJ01338817", b: "6569552" },
      douki: { d: "RJ01345776", b: "6620302" },
      haishinsha: { d: "RJ01363976", b: "6733303" },
      ai: { d: "RJ01447671", b: "7284886" },
      mizuki: { d: "RJ01493254", b: "7575184" },
      koito: { d: "RJ01633092", b: "8483665" },
    };

    for (const [slug, ids] of Object.entries(expected)) {
      const work = works.find((item) => item.slug === slug);
      expect(work, slug).toBeDefined();
      expect(work?.stores).toEqual(expect.arrayContaining([
        expect.objectContaining({ label: "本編｜DLsite", url: expect.stringContaining(ids.d) }),
        expect.objectContaining({ label: "本編｜BOOTH", url: expect.stringContaining(ids.b) }),
      ]));
    }
  });

  it("銀髪ちゃんの共通後日談CG集と続編を正しく固定する", () => {
    const ginpatsu = works.find((item) => item.slug === "ginpatsu");
    expect(ginpatsu?.stores).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "後日談CG集｜DLsite", url: expect.stringContaining("RJ01369601") }),
      expect.objectContaining({ label: "後日談CG集｜BOOTH", url: expect.stringContaining("6764185") }),
      expect.objectContaining({ label: "続編漫画｜DLsite", url: expect.stringContaining("RJ01380327") }),
      expect.objectContaining({ label: "続編漫画｜BOOTH", url: expect.stringContaining("6831880") }),
    ]));
  });
});
