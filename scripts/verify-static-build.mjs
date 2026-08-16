import { readFile } from "node:fs/promises";

const origin = process.env.STATIC_TEST_ORIGIN ?? "http://127.0.0.1:4173";
const routes = ["/", "/heroines", "/diagnosis", "/diagnosis/gameover", "/diagnosis/result/ai", "/commission", "/about", "/about-production", "/works/ginpatsu", "/works/kouhai", "/works/bokukko", "/works/douki", "/works/haishinsha", "/works/ai", "/works/mizuki", "/works/koito", "/works/natsu", "/404"];
const manifest = JSON.parse(await readFile("dist/public/assets/asset-manifest.json", "utf8"));
const failures = [];

for (const route of routes) {
  const response = await fetch(`${origin}${route}`);
  const body = await response.text();
  if (!response.ok || !body.includes("<div id=\"root\">")) failures.push(`route ${route}: HTTP ${response.status}`);
}

for (const asset of manifest.assets) {
  const response = await fetch(`${origin}${asset.output}`);
  if (!response.ok) failures.push(`asset ${asset.output}: HTTP ${response.status}`);
}

const indexHtml = await readFile("dist/public/index.html", "utf8");
if (/manus-storage|manus\.space|__manus__|VITE_ANALYTICS_ENDPOINT/.test(indexHtml)) failures.push("index.html includes a Manus-specific runtime reference");
if (!indexHtml.includes('property="og:url" content="https://hatsukoi-lab.com/"')) failures.push("index.html: absolute og:url is missing");
if (!indexHtml.includes('property="og:image" content="https://hatsukoi-lab.com/assets/')) failures.push("index.html: absolute og:image is missing");

for (const slug of ["ginpatsu", "kouhai", "bokukko", "douki", "haishinsha", "ai", "mizuki", "koito", "natsu"]) {
  const document = await readFile(`dist/public/works/${slug}/index.html`, "utf8");
  if (!document.includes(`https://hatsukoi-lab.com/assets/ogp_${slug}.jpg`)) failures.push(`work OGP ${slug}: expected image is missing`);
  if (!document.includes(`https://hatsukoi-lab.com/works/${slug}`)) failures.push(`work OGP ${slug}: canonical URL is missing`);
  const response = await fetch(`${origin}/works/${slug}`);
  const body = await response.text();
  if (!response.ok || !body.includes(`https://hatsukoi-lab.com/assets/ogp_${slug}.jpg`)) failures.push(`work OGP ${slug}: static route does not serve the work HTML`);
}

const diagnosisPages = [
  { route: "gameover", image: "ogp_diagnosis_gameover.jpg" },
  ...["ginpatsu", "kouhai", "bokukko", "douki", "haishinsha", "ai", "mizuki", "koito", "natsu"].map((slug) => ({ route: `result/${slug}`, image: `ogp_${slug}.jpg` })),
];

for (const page of diagnosisPages) {
  const document = await readFile(`dist/public/diagnosis/${page.route}/index.html`, "utf8");
  const expectedUrl = `https://hatsukoi-lab.com/diagnosis/${page.route}`;
  if (!document.includes(expectedUrl)) failures.push(`diagnosis OGP ${page.route}: canonical URL is missing`);
  if (!document.includes(`https://hatsukoi-lab.com/assets/${page.image}`)) failures.push(`diagnosis OGP ${page.route}: expected image is missing`);
  const response = await fetch(`${origin}/diagnosis/${page.route}`);
  const body = await response.text();
  if (!response.ok || !body.includes(`https://hatsukoi-lab.com/assets/${page.image}`)) failures.push(`diagnosis OGP ${page.route}: static route does not serve the diagnosis HTML`);
}

const sitemap = await readFile("dist/public/sitemap.xml", "utf8");
if (!sitemap.includes("https://hatsukoi-lab.com/about")) failures.push("sitemap.xml: /about is missing");

const prerendered = [
  "index.html",
  "heroines/index.html",
  "diagnosis/index.html",
  "diagnosis/gameover/index.html",
  "commission/index.html",
  "about/index.html",
  ...["ginpatsu", "kouhai", "bokukko", "douki", "haishinsha", "ai", "mizuki", "koito", "natsu"].map((slug) => `works/${slug}/index.html`),
  ...["ginpatsu", "kouhai", "bokukko", "douki", "haishinsha", "ai", "mizuki", "koito", "natsu"].map((slug) => `diagnosis/result/${slug}/index.html`),
];
for (const file of prerendered) {
  const document = await readFile(`dist/public/${file}`, "utf8");
  if ((document.match(/<link rel="canonical"/g) ?? []).length !== 1) failures.push(`${file}: canonical must occur exactly once`);
  if ((document.match(/property="og:url"/g) ?? []).length !== 1) failures.push(`${file}: og:url must occur exactly once`);
  if ((document.match(/<h1 /g) ?? []).length !== 1) failures.push(`${file}: h1 must occur exactly once`);
}
const homepage = await readFile("dist/public/index.html", "utf8");
if ((homepage.match(/application\/ld\+json/g) ?? []).length !== 1 || !homepage.includes('"@type":"Organization"')) failures.push("index.html: Organization JSON-LD is missing or duplicated");
for (const slug of ["ginpatsu", "kouhai", "bokukko", "douki", "haishinsha", "ai", "mizuki", "koito", "natsu"]) {
  const document = await readFile(`dist/public/works/${slug}/index.html`, "utf8");
  if ((document.match(/application\/ld\+json/g) ?? []).length !== 1 || !document.includes('"@type":"BreadcrumbList"')) failures.push(`works/${slug}: BreadcrumbList JSON-LD is missing or duplicated`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Static verification passed: ${routes.length} routes and ${manifest.assets.length} exported assets responded without Manus runtime dependencies.`);
