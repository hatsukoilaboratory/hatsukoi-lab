import { readFile } from "node:fs/promises";
import path from "node:path";

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function replaceMeta(document: string, selector: string, content: string) {
  return document.replace(new RegExp(`<meta ${selector} content="[^"]*"\\s*/?>`), `<meta ${selector} content="${escapeHtml(content)}" />`);
}

export function setCanonical(document: string, url: string) {
  const withoutCanonical = document.replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>/g, "");
  return withoutCanonical.replace("</head>", `    <link rel="canonical" href="${escapeHtml(url)}" />\n  </head>`);
}

export function setOgUrl(document: string, url: string) {
  return replaceMeta(document, 'property="og:url"', url);
}

export function stripGeneratedSeo(document: string) {
  return document
    .replace(/<h1 style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;">[\s\S]*?<\/h1>/g, "")
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
}

export function setPrerenderH1(document: string, text: string) {
  const heading = `<h1 style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;">${escapeHtml(text)}</h1>`;
  return document.replace('<div id="root"></div>', `<div id="root">${heading}</div>`);
}

export function appendJsonLd(document: string, data: unknown) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return document.replace("</head>", `    <script type="application/ld+json">${json}</script>\n  </head>`);
}

export async function resolveLogoUrl(outputDirectory: string, siteUrl: string) {
  const manifestPath = path.join(outputDirectory, "assets", "asset-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as { assets: Array<{ fileName: string; output: string }> };
  const logo = manifest.assets.find((asset) => /^round_full_512.*\.(png|webp)$/i.test(asset.fileName));
  if (!logo) throw new Error("Organizationロゴ(round_full_512)がアセットマニフェストにありません");
  return `${siteUrl}${logo.output}`;
}

export function organizationJsonLd(siteUrl: string, logoUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "初恋ラボ",
    url: `${siteUrl}/`,
    logo: logoUrl,
    description: "両想いの甘い恋愛を描くAI作画漫画サークル",
    sameAs: [
      "https://twitter.com/hatsukoi_lab",
      "https://www.pixiv.net/users/112582581",
      "https://hatsukoilab.booth.pm/",
    ],
  };
}

export function breadcrumbJsonLd(siteUrl: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "初恋ラボ", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "作品をえらぶ", item: `${siteUrl}/heroines` },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };
}
