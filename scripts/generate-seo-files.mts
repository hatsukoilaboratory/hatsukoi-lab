import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDirectory = path.join(projectRoot, "client", "public");
const siteUrl = (process.env.SITE_URL ?? "https://hatsukoi-lab.com").replace(/\/+$/, "");
const routes = [
  "/",
  "/heroines",
  "/diagnosis",
  "/commission",
  "/about",
  "/works/ginpatsu",
  "/works/kouhai",
  "/works/bokukko",
  "/works/douki",
  "/works/haishinsha",
  "/works/ai",
  "/works/mizuki",
  "/works/koito",
  "/works/natsu",
];

await mkdir(publicDirectory, { recursive: true });
await writeFile(path.join(publicDirectory, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`, "utf8");
await writeFile(path.join(publicDirectory, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
console.log(`Generated robots.txt and sitemap.xml for ${siteUrl}`);
