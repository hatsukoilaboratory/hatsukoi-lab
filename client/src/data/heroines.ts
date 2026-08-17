export type Heroine = {
  id: number;
  slug: string;
  name: string;
  quote: string;
  color: string;
  motif: string;
  tags: string[];
  generation: 2025 | 2026;
  height: number;
  cup: string;
  /** トップの浮遊演出用の軽量・透過WebP。 */
  chibiImage: string;
  /** 原本の高解像度PNG。将来の拡大・別用途向けに保持する。 */
  standingImage?: string;
  /** 作品ページ・プロフィールモーダル・診断結果用のWeb配信バストアップ画像。 */
  bustImage?: string;
  /** 一覧カード用の軽量WebP。 */
  listImage?: string;
  /** 既存画面との互換用の見せ方指定。 */
  profilePresentation?: "full" | "bust";
  /** 作品ページ・プロフィールモーダル共通のバストアップ位置。 */
  bustPosition?: string;
};

/** PNG原本は standingImage に保持し、Web表示は用途別WebPを使用する。 */
export const heroines: Heroine[] = [
  { id: 1, slug: "ginpatsu", name: "銀髪幼馴染ちゃん", quote: "「……きみの隣が、いちばん落ち着くの」", color: "#B9C4D6", motif: "ginpatsu", tags: ["幼なじみ", "人見知り", "恋人3年目"], generation: 2025, height: 158, cup: "G", chibiImage: "/assets/ginpatsu_267dad0d.webp", standingImage: "/assets/ginpatsu_9840d87e.webp", bustImage: "/assets/ginpatsu_94888a8f.webp", listImage: "/assets/ginpatsu_37482487.webp", bustPosition: "50% 28%" },
  { id: 2, slug: "kouhai", name: "黒髪後輩ちゃん", quote: "「今度は、私が先輩を支える番です！」", color: "#F2A0A8", motif: "kouhai", tags: ["後輩", "マネージャー", "一途"], generation: 2025, height: 152, cup: "D", chibiImage: "/assets/kouhai_21719b9d.webp", standingImage: "/assets/kouhai_27710c81.webp", bustImage: "/assets/kouhai_8ae56c40.webp", listImage: "/assets/kouhai_99e7cb12.webp", bustPosition: "50% 27%" },
  { id: 3, slug: "bokukko", name: "ボクっ娘幼馴染ちゃん", quote: "「今のボクを、好きになってくれる？」", color: "#F5A581", motif: "bokukko", tags: ["ボクっ娘", "幼なじみ", "再会"], generation: 2025, height: 148, cup: "H", chibiImage: "/assets/bokukko_5e1d673c.webp", standingImage: "/assets/bokukko_06a09531.webp", bustImage: "/assets/bokukko_f33ea16a.webp", listImage: "/assets/bokukko_e1c2cff1.webp", bustPosition: "50% 28%" },
  { id: 4, slug: "douki", name: "大学同期ちゃん", quote: "「きみの前だと、ちゃんと素でいられるんだ」", color: "#D5A3B7", motif: "douki", tags: ["大学同期", "おとなり", "友達から"], generation: 2025, height: 158, cup: "F", chibiImage: "/assets/douki_32d551ce.webp", standingImage: "/assets/douki_065e9a8f.webp", bustImage: "/assets/douki_6eebdf20.webp", listImage: "/assets/douki_c582aac9.webp", bustPosition: "50% 29%" },
  { id: 5, slug: "haishinsha", name: "地味っ子配信者ちゃん", quote: "「ほんとのわたし、知っても……離れないでね」", color: "#B9A5D4", motif: "haishinsha", tags: ["VTuber", "クラスメイト", "ひみつ"], generation: 2025, height: 150, cup: "D", chibiImage: "/assets/ai_611005db.webp", standingImage: "/assets/haishinsha_0b310757.webp", bustImage: "/assets/haishinsha_e56ecc07.webp", listImage: "/assets/haishinsha_7b03b1ce.webp", bustPosition: "50% 26%" },
  { id: 6, slug: "ai", name: "アイちゃん", quote: "「あなたにアイを伝えにきたよ♪」", color: "#8CB7D0", motif: "ai", tags: ["アンドロイド", "同居", "近未来"], generation: 2025, height: 161, cup: "E", chibiImage: "/assets/haishinsha_97c8bdd3.webp", standingImage: "/assets/ai_b304d2a8.webp", bustImage: "/assets/ai_c82d8395.webp", listImage: "/assets/ai_3b85817c.webp", bustPosition: "50% 29%" },
  { id: 7, slug: "mizuki", name: "水城 友結", quote: "「……私も、大好き」", color: "#9FB4CC", motif: "mizuki", tags: ["美術", "クール", "同級生"], generation: 2025, height: 161, cup: "D", chibiImage: "/assets/mizuki_76484601.webp", standingImage: "/assets/mizuki_0b276bec.webp", bustImage: "/assets/mizuki_ace5b1e9.webp", listImage: "/assets/mizuki_a92b151a.webp", bustPosition: "50% 27%" },
  { id: 8, slug: "koito", name: "佐瀬 小糸", quote: "「篠原くんを選んで、よかったな……って」", color: "#F4A7BF", motif: "koito", tags: ["純愛", "照れ屋", "100日目"], generation: 2026, height: 155, cup: "C", chibiImage: "/assets/koito_877c0272.webp", standingImage: "/assets/koito_dd12bdaa.webp", bustImage: "/assets/koito_9199d405.webp", listImage: "/assets/koito_44a5c872.webp", profilePresentation: "bust", bustPosition: "50% 30%" },
  { id: 9, slug: "natsu", name: "三浦 夏", quote: "「アンタは、『私』だから選んでしょ？」", color: "#ECA9C8", motif: "natsu", tags: ["サバサバ", "友達以上", "本気の恋"], generation: 2026, height: 162, cup: "E", chibiImage: "/assets/natsu_6cb31210.webp", standingImage: "/assets/natsu_7104d26d.webp", bustImage: "/assets/natsu_095b7b16.webp", listImage: "/assets/natsu_f21ef3d6.webp", profilePresentation: "bust", bustPosition: "50% 29%" },
];
