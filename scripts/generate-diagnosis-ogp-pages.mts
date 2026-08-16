import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { works } from "../client/src/data/works";
import { heroines } from "../client/src/data/heroines";
import { escapeHtml, replaceMeta, setCanonical, setOgUrl, setPrerenderH1, stripGeneratedSeo } from "./seo-html.mts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const outputDirectory = path.join(projectRoot, "dist", "public");
const siteUrl = (process.env.SITE_URL ?? "https://hatsukoi-lab.com").replace(/\/+$/, "");
const baseHtml = stripGeneratedSeo(await readFile(path.join(outputDirectory, "index.html"), "utf8"));

async function writeDiagnosisPage(input: { route: string; title: string; description: string; image: string; alt: string; h1: string }) {
  const url = `${siteUrl}${input.route}`;
  let document = baseHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(input.title)}</title>`);
  document = replaceMeta(document, 'name="description"', input.description);
  document = replaceMeta(document, 'property="og:title"', input.title);
  document = replaceMeta(document, 'property="og:description"', input.description);
  document = replaceMeta(document, 'property="og:url"', url);
  document = replaceMeta(document, 'property="og:image"', `${siteUrl}${input.image}`);
  document = replaceMeta(document, 'property="og:image:alt"', input.alt);
  document = replaceMeta(document, 'name="twitter:title"', input.title);
  document = replaceMeta(document, 'name="twitter:description"', input.description);
  document = replaceMeta(document, 'name="twitter:image"', `${siteUrl}${input.image}`);
  document = replaceMeta(document, 'name="twitter:image:alt"', input.alt);
  document = setCanonical(document, url);
  document = setOgUrl(document, url);
  document = setPrerenderH1(document, input.h1);
  const routeDirectory = path.join(outputDirectory, input.route.replace(/^\//, ""));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, "index.html"), document, "utf8");
}

await writeDiagnosisPage({
  route: "/diagnosis/gameover",
  title: "童貞探偵の捜査は打ち切られた。｜初恋ラボ",
  description: "この恋の捜査対象は初恋ラボの管轄外です。童貞探偵の恋愛嗜好捜査。",
  image: "/assets/ogp_diagnosis_gameover.jpg",
  alt: "童貞探偵の恋愛嗜好捜査 GAME OVER",
  h1: "童貞探偵の捜査は打ち切られた。",
});
for (const work of works) {
  const heroine = heroines.find((item) => item.slug === work.slug);
  if (!heroine) throw new Error(`診断OGP対象のヒロインが見つかりません: ${work.slug}`);
  await writeDiagnosisPage({
    route: `/diagnosis/result/${work.slug}`,
    title: `あなたの推しは「${heroine.name}」でした。｜童貞探偵の恋愛嗜好捜査`,
    description: heroine.quote,
    image: work.ogpImage,
    alt: `${heroine.name}の診断結果`,
    h1: `あなたに合うのは${heroine.name}です`,
  });
}
console.log(`Generated static diagnosis OGP HTML for ${works.length + 1} share pages.`);
