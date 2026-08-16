import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { works } from "../client/src/data/works";
import { heroines } from "../client/src/data/heroines";
import { appendJsonLd, breadcrumbJsonLd, escapeHtml, replaceMeta, setCanonical, setOgUrl, setPrerenderH1, stripGeneratedSeo } from "./seo-html.mts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const outputDirectory = path.join(projectRoot, "dist", "public");
const siteUrl = (process.env.SITE_URL ?? "https://hatsukoi-lab.com").replace(/\/+$/, "");
const baseHtml = stripGeneratedSeo(await readFile(path.join(outputDirectory, "index.html"), "utf8"));

for (const work of works) {
  const heroine = heroines.find((item) => item.slug === work.slug);
  if (!heroine) throw new Error(`OGP生成対象のヒロインが見つかりません: ${work.slug}`);

  const url = `${siteUrl}/works/${work.slug}`;
  const image = `${siteUrl}${work.ogpImage}`;
  const title = `${heroine.name}｜${work.title}｜初恋ラボ`;
  const description = work.synopsis;
  let document = baseHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  document = replaceMeta(document, 'name="description"', description);
  document = replaceMeta(document, 'property="og:title"', title);
  document = replaceMeta(document, 'property="og:description"', description);
  document = replaceMeta(document, 'property="og:url"', url);
  document = replaceMeta(document, 'property="og:image"', image);
  document = replaceMeta(document, 'property="og:image:alt"', `${heroine.name}の作品「${work.title}」`);
  document = replaceMeta(document, 'name="twitter:title"', title);
  document = replaceMeta(document, 'name="twitter:description"', description);
  document = replaceMeta(document, 'name="twitter:image"', image);
  document = replaceMeta(document, 'name="twitter:image:alt"', `${heroine.name}の作品「${work.title}」`);
  document = setCanonical(document, url);
  document = setOgUrl(document, url);
  document = setPrerenderH1(document, work.title);
  document = appendJsonLd(document, breadcrumbJsonLd(siteUrl, work.title));

  const routeDirectory = path.join(outputDirectory, "works", work.slug);
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, "index.html"), document, "utf8");
}

console.log(`Generated static OGP HTML for ${works.length} work pages.`);
