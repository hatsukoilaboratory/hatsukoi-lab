/**
 * 初恋ラボの公式外部リンク。プロフィールページで公開されているURLを集約し、作品別URLが判明したら works 側で上書きする。
 * 連絡先をここへ集約し、フッター・依頼ページで共通利用する。
 */
export type StoreLink = {
  id: "fanza" | "xtoon" | "dlsite" | "booth";
  label: string;
  url: string;
  logo: string;
  tone: string;
};

export const storeLinks: StoreLink[] = [
  {
    id: "fanza",
    label: "FANZA",
    url: "https://al.fanza.co.jp/?lurl=https://www.dmm.co.jp/dc/doujin/-/list/=/article=maker/exclude_ai=0/id=222410/&af_id=hatsukoilab-002&ch=toolbar&ch_id=link",
    logo: "/assets/hatsukoi-lab-store-fanza_fdee40e4.png",
    tone: "#f4d3df",
  },
  {
    id: "xtoon",
    label: "xtoon",
    url: "https://xtoon.com/user/hatsukoilab",
    logo: "/assets/hatsukoi-lab-store-xtoon_db70dc42.jpg",
    tone: "#dbeaf0",
  },
  {
    id: "dlsite",
    label: "DLsite",
    url: "https://dlaf.jp/aix/dlaf/=/t/s/link/work/aid/hatsukoilab/id/RJ01493254.html",
    logo: "/assets/hatsukoi-lab-store-dlsite_0b7b6d6e.jpg",
    tone: "#e7e2f7",
  },
  {
    id: "booth",
    label: "BOOTH",
    url: "https://hatsukoilab.booth.pm/",
    logo: "/assets/hatsukoi-lab-store-booth_f7378119.png",
    tone: "#d8eff1",
  },
];

/** 作品ごとの個別URLが未確定でも案内できる、初恋ラボの共通電子書籍販売先。 */
export const otherEbookStoreLinks = [
  { id: "amazon", label: "Amazon", url: "https://www.amazon.co.jp/stores/author/B0FYGLKL3L", tone: "#f2e4cf" },
  { id: "cmoa", label: "コミックシーモア", url: "https://www.cmoa.jp/search/author/206008/?srsltid=AfmBOorsNDCKprFIyFfW9ptFH5caG0al4ngqe7pp7zN3TCpDmx68S9hU", tone: "#e4f0dc" },
  { id: "rakuten-books", label: "楽天ブックス", url: "https://books.rakuten.co.jp/search?adt=1&pname=%E5%88%9D%E6%81%8B%E3%83%A9%E3%83%9C&l-id=search-l-genre-0&srsltid=AfmBOopKQk5i9lc8D8qiJRNj6pKQKtf6x481M8p1QKNoJqOfAjotZZEL", tone: "#f8e1e8" },
] as const;

export const socialLinks = [
  { id: "x", label: "X", handle: "@hatsukoi_lab", url: "https://twitter.com/hatsukoi_lab" },
  { id: "pixiv", label: "pixiv", handle: "初恋ラボ", url: "https://www.pixiv.net/users/112582581" },
];

export const contactEmail = {
  label: "メール",
  address: "hatsukoi.laboratory@gmail.com",
  url: "mailto:hatsukoi.laboratory@gmail.com",
};
