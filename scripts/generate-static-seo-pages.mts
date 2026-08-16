import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { appendJsonLd, escapeHtml, organizationJsonLd, replaceMeta, resolveLogoUrl, setCanonical, setOgUrl, setPrerenderH1, stripGeneratedSeo } from "./seo-html.mts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const outputDirectory = path.join(projectRoot, "dist", "public");
const siteUrl = (process.env.SITE_URL ?? "https://hatsukoi-lab.com").replace(/\/+$/, "");
const baseHtml = stripGeneratedSeo(await readFile(path.join(outputDirectory, "index.html"), "utf8"));
const logoUrl = await resolveLogoUrl(outputDirectory, siteUrl);

const pages = [
  { route: "/", title: "初恋ラボ｜イチャラブ漫画サークル", description: "両想いの甘い恋愛を描く、AI作画漫画サークル「初恋ラボ」の公式サイト。", h1: "初恋ラボ", jsonLd: organizationJsonLd(siteUrl, logoUrl) },
  { route: "/heroines", title: "ヒロインから作品をえらぶ｜初恋ラボ", description: "初恋ラボのヒロインたちから、あなたの好きな作品をえらべます。", h1: "ヒロインから作品をえらぶ" },
  { route: "/diagnosis", title: "童貞探偵の恋愛嗜好捜査｜初恋ラボ", description: "道庭と鳴海が進行する、初恋ラボの恋愛嗜好診断。質問に答えてあなたに合うヒロインを探します。", h1: "童貞探偵の恋愛嗜好捜査" },
  { route: "/commission", title: "お仕事のご依頼｜初恋ラボ", description: "初恋ラボの漫画制作・キャラクターデザインのお仕事依頼について。", h1: "お仕事のご依頼" },
  { route: "/about", title: "初恋ラボについて｜イチャラブ漫画サークル", description: "初恋ラボの活動内容と、AI画像生成を利用した漫画の制作工程について。", h1: "初恋ラボについて" },
];

for (const page of pages) {
  const url = `${siteUrl}${page.route === "/" ? "/" : page.route}`;
  let document = baseHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  document = replaceMeta(document, 'name="description"', page.description);
  document = replaceMeta(document, 'property="og:title"', page.title);
  document = replaceMeta(document, 'property="og:description"', page.description);
  document = replaceMeta(document, 'property="og:url"', url);
  document = replaceMeta(document, 'name="twitter:title"', page.title);
  document = replaceMeta(document, 'name="twitter:description"', page.description);
  document = setCanonical(document, url);
  document = setOgUrl(document, url);
  document = setPrerenderH1(document, page.h1);
  if (page.jsonLd) document = appendJsonLd(document, page.jsonLd);
  const directory = path.join(outputDirectory, page.route === "/" ? "" : page.route.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), document, "utf8");
}
console.log(`Generated static SEO HTML for ${pages.length} core pages.`);
