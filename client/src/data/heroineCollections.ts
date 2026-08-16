import type { Heroine } from "./heroines";

export type Hotspot = { x: number; y: number; width: number; height: number };
export type CollectionEntry = {
  heroineSlug: Heroine["slug"];
  image?: string;
  imagePosition?: string;
  link?: string;
  hotspot?: Hotspot;
};

export type HeroineCollection = {
  year: number;
  order: number;
  note: string;
  title: string;
  status: string;
  display: "spotlight-group" | "cards";
  image?: string;
  imageAlt?: string;
  entries: CollectionEntry[];
};

export const heroineCollections: HeroineCollection[] = [
  {
    year: 2025,
    order: 1,
    note: "観察ノート #01",
    title: "第1期",
    status: "7作品のヒロインたち",
    display: "spotlight-group",
    image: "/assets/heroines-generation-one-group_b9ba1dcf.webp",
    imageAlt: "第1期ヒロイン7人がリビングに集まったイラスト",
    entries: [
      { heroineSlug: "ai", hotspot: { x: 23, y: 33, width: 13, height: 26 } },
      { heroineSlug: "ginpatsu", hotspot: { x: 42, y: 30, width: 11, height: 24 } },
      { heroineSlug: "mizuki", hotspot: { x: 65, y: 35, width: 10, height: 22 } },
      { heroineSlug: "douki", hotspot: { x: 83, y: 45, width: 14, height: 26 } },
      { heroineSlug: "kouhai", hotspot: { x: 33, y: 63, width: 16, height: 28 } },
      { heroineSlug: "bokukko", hotspot: { x: 54, y: 68, width: 15, height: 26 } },
      { heroineSlug: "haishinsha", hotspot: { x: 69, y: 72, width: 15, height: 26 } },
    ],
  },
  {
    year: 2026,
    order: 2,
    note: "観察ノート #02",
    title: "第2期",
    status: "現在進行中",
    display: "cards",
    entries: [
      { heroineSlug: "koito", image: "/assets/heroines-generation-two-pair-clean_c6b665f3.webp", imagePosition: "left center" },
      { heroineSlug: "natsu", image: "/assets/heroines-generation-two-pair-clean_c6b665f3.webp", imagePosition: "right center" },
    ],
  },
];

export const getCollectionByYear = (year: number) => heroineCollections.find((collection) => collection.year === year);
