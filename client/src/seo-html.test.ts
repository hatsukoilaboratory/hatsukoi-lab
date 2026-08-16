import { describe, expect, it } from "vitest";
import { appendJsonLd, breadcrumbJsonLd, setCanonical, setPrerenderH1, stripGeneratedSeo } from "../../scripts/seo-html.mts";

describe("SEO静的HTMLヘルパー", () => {
  it("canonicalを1件に置き換え、h1をrootへ追加する", () => {
    const input = '<head><link rel="canonical" href="https://example.com/old" /></head><body><div id="root"></div></body>';
    const output = setPrerenderH1(setCanonical(input, "https://hatsukoi-lab.com/about"), "初恋ラボについて");
    expect(output.match(/rel="canonical"/g)).toHaveLength(1);
    expect(output).toContain('href="https://hatsukoi-lab.com/about"');
    expect(output).toContain(">初恋ラボについて</h1>");
  });

  it("生成済み共通SEOを除去し、BreadcrumbListを安全に埋め込む", () => {
    const input = '<head><script type="application/ld+json">{"old":true}</script></head><body><h1 style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;">初恋ラボ</h1></body>';
    const clean = stripGeneratedSeo(input);
    const output = appendJsonLd(clean, breadcrumbJsonLd("https://hatsukoi-lab.com", "作品タイトル"));
    expect(output).not.toContain('"old":true');
    expect(output).toContain('"@type":"BreadcrumbList"');
    expect(output).toContain('"name":"作品タイトル"');
  });
});
