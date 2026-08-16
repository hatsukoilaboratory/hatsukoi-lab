import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const assetDirectory = path.resolve(import.meta.dirname, "..", "client", "public", "assets");

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(absolute);
    return entry.name === "asset-manifest.json" ? [] : [absolute];
  }));
  return nested.flat();
}

const files = await collectFiles(assetDirectory);
const assets = await Promise.all(files.sort().map(async (file) => {
  const relative = path.relative(assetDirectory, file).split(path.sep).join("/");
  const metadata = await stat(file);
  return { fileName: relative, output: `/assets/${relative}`, bytes: metadata.size };
}));

await writeFile(path.join(assetDirectory, "asset-manifest.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), assets }, null, 2)}\n`, "utf8");
console.log(`Generated static asset manifest for ${assets.length} files.`);
