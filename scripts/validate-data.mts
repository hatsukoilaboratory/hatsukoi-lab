import { heroineCollections } from "../client/src/data/heroineCollections";
import { heroines } from "../client/src/data/heroines";
import { works } from "../client/src/data/works";
import { otherEbookStoreLinks, socialLinks, storeLinks } from "../client/src/data/externalLinks";

const errors: string[] = [];
const online = process.argv.includes("--online");
const baseUrl = process.env.SITE_URL ?? "http://127.0.0.1:3000";
const imagePaths = new Set<string>();

const assert = (condition: unknown, message: string) => { if (!condition) errors.push(message); };
const unique = (values: string[], label: string) => values.forEach((value, index) => assert(values.indexOf(value) === index, `${label}が重複しています: ${value}`));
const validUrl = (url: string, label: string) => {
  if (!url) return;
  try { const parsed = new URL(url); assert(["http:", "https:"].includes(parsed.protocol), `${label}はhttp(s) URLではありません: ${url}`); } catch { errors.push(`${label}のURL形式が不正です: ${url}`); }
};
const addImage = (path: string | undefined, label: string) => {
  if (!path) return;
  assert(path.startsWith("/assets/"), `${label}は/assets/配下ではありません: ${path}`);
  imagePaths.add(path);
};

unique(heroines.map((heroine) => heroine.slug), "heroine.slug");
unique(works.map((work) => work.slug), "work.slug");
unique(heroineCollections.map((collection) => String(collection.year)), "collection.year");

const heroineBySlug = new Map(heroines.map((heroine) => [heroine.slug, heroine]));
const workBySlug = new Map(works.map((work) => [work.slug, work]));
const collectionEntries = heroineCollections.flatMap((collection) => collection.entries.map((entry) => ({ collection, entry })));
unique(collectionEntries.map(({ entry }) => entry.heroineSlug), "collection entry heroineSlug");

for (const heroine of heroines) {
  assert(Boolean(workBySlug.get(heroine.slug)), `作品データがないヒロインです: ${heroine.slug}`);
  assert(Number.isFinite(heroine.height) && heroine.height > 0, `身長が不正です: ${heroine.slug}`);
  assert(Boolean(heroine.cup?.trim()), `カップ情報がありません: ${heroine.slug}`);
  addImage(heroine.chibiImage, `${heroine.slug}のちびキャラ画像`);
  addImage(heroine.standingImage, `${heroine.slug}の立ち絵画像`);
  const membership = collectionEntries.find(({ entry }) => entry.heroineSlug === heroine.slug);
  assert(Boolean(membership), `年次コレクションに未登録のヒロインです: ${heroine.slug}`);
  if (membership) assert(membership.collection.year === heroine.generation, `generation値とコレクション年が一致しません: ${heroine.slug}`);
}

for (const work of works) {
  assert(Boolean(heroineBySlug.get(work.slug)), `対応ヒロインがない作品です: ${work.slug}`);
  assert(Boolean(work.title.trim()) && Boolean(work.synopsis.trim()), `タイトルまたはあらすじがありません: ${work.slug}`);
  assert(["all", "r18"].includes(work.rating), `ratingが不正です: ${work.slug}`);
  assert(`/works/${work.slug}`.startsWith("/works/"), `作品ルートが不正です: ${work.slug}`);
  work.sampleImages.forEach((path, index) => addImage(path, `${work.slug}のサンプル画像${index + 1}`));
  work.stores.forEach((store) => { assert(Boolean(store.label.trim()), `${work.slug}のストア表示名がありません`); validUrl(store.url, `${work.slug}の${store.label}`); });
}

for (const collection of heroineCollections) {
  assert(["spotlight-group", "cards"].includes(collection.display), `表示方式が不正です: ${collection.year}`);
  addImage(collection.image, `${collection.year}年コレクション画像`);
  assert(collection.entries.length > 0, `${collection.year}年コレクションに人物がありません`);
  for (const entry of collection.entries) {
    const heroine = heroineBySlug.get(entry.heroineSlug);
    assert(Boolean(heroine), `${collection.year}年コレクションに存在しないslugがあります: ${entry.heroineSlug}`);
    if (collection.display === "spotlight-group") assert(Boolean(entry.hotspot), `${entry.heroineSlug}にホットスポットがありません`);
    if (collection.display === "cards") assert(Boolean(entry.image || heroine?.standingImage), `${entry.heroineSlug}にカード画像がありません`);
    if (entry.hotspot) [entry.hotspot.x, entry.hotspot.y, entry.hotspot.width, entry.hotspot.height].forEach((value) => assert(value >= 0 && value <= 100, `${entry.heroineSlug}のホットスポット値が範囲外です`));
    addImage(entry.image, `${entry.heroineSlug}のコレクション画像`);
    if (entry.link) assert(entry.link === `/works/${entry.heroineSlug}`, `${entry.heroineSlug}のリンクが作品ルートと一致しません`);
  }
}

storeLinks.forEach((link) => { validUrl(link.url, `${link.label}の公式リンク`); addImage(link.logo, `${link.label}のロゴ`); });
otherEbookStoreLinks.forEach((link) => validUrl(link.url, `${link.label}の公式リンク`));
socialLinks.forEach((link) => validUrl(link.url, `${link.label}の公式リンク`));

if (online) {
  await Promise.all([...imagePaths].map(async (path) => {
    try { const response = await fetch(`${baseUrl}${path}`, { method: "HEAD" }); assert(response.ok, `画像パスへ到達できません: ${path} (${response.status})`); } catch { errors.push(`画像パスのオンライン検査に失敗しました: ${path}`); }
  }));
}

if (errors.length) { console.error("\n[データ整合性チェック: NG]"); errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
console.log(`[データ整合性チェック: OK] ${heroines.length}ヒロイン / ${works.length}作品 / ${heroineCollections.length}年次コレクション${online ? " / 画像オンライン検査済み" : ""}`);
