/** 開発専用：同じ情報と画像を保った4つのデザイン方向を比較する。 */
import type { CSSProperties } from "react";
import { Link } from "wouter";
import { heroines } from "@/data/heroines";

const logoUrl = "/assets/tube_full_1bee8d1e.svg";
const variants = {
  a: { key: "a", label: "A", name: "余白を磨くノート", note: "現行の良さを最も静かに磨く" },
  b: { key: "b", label: "B", name: "やわらか選択ゲーム", note: "好きな子を選ぶ体験を少し強める" },
  c: { key: "c", label: "C", name: "少女漫画編集部", note: "単行本の扉ページのような文字のリズム" },
  d: { key: "d", label: "D", name: "恋愛ADVリフレーム", note: "会話と選択肢の読みやすさを現代的に取り込む" },
} as const;

export default function DesignLab() {
  const requested = new URLSearchParams(window.location.search).get("variant") as keyof typeof variants | null;
  const current = variants[requested ?? "a"] ?? variants.a;
  const featured = [heroines[0], heroines[1], heroines[7]];
  return <main className={`design-lab design-lab--${current.key}`}>
    <header className="design-lab__header"><div><p>開発専用／P2 デザイン選手権</p><h1>{current.label}：{current.name}</h1><span>{current.note}</span></div><img src={logoUrl} alt="初恋ラボ" /></header>
    <nav className="design-lab__tabs" aria-label="比較案">{Object.values(variants).map((variant) => <Link key={variant.key} href={`/dev/design-lab?variant=${variant.key}`} className={variant.key === current.key ? "is-active" : ""}>{variant.label}<small>{variant.name}</small></Link>)}</nav>
    <section className="design-lab__preview" aria-label={`${current.name}のトップ画面試作`}>
      <div className="design-lab__folio"><span>HATSUKOI LAB / 2026</span><span>LOVE NOTE #01</span></div>
      <div className="design-lab__hero"><p>初恋って、いちばん打算のない恋だ。</p><h2>ヒロインから<br />作品をえらぶ</h2><span>気になるあの子をタップしてね。</span><Link href="/heroines">ヒロインを見つける <b>→</b></Link></div>
      <div className="design-lab__featured">{featured.map((heroine, index) => <article key={heroine.slug} style={{ "--accent": heroine.color, "--delay": `${index * 70}ms` } as CSSProperties}><img src={heroine.chibiImage} alt="" /><div><small>FILE 0{heroine.id}</small><h3>{heroine.name}</h3><p>{heroine.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ")}</p></div></article>)}</div>
      <p className="design-lab__caption">画像・文章・導線は共通のまま、情報の置き方だけを比較しています。</p>
    </section>
  </main>;
}
