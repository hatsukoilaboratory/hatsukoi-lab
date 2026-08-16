/** 開発専用：現行の便箋・ピンク路線から距離を取った3つのトップ案を比較する。 */
import type { CSSProperties } from "react";
import { Link } from "wouter";
import { heroines } from "@/data/heroines";

const logoUrl = "/assets/tube_full_1bee8d1e.svg";
const groupImage = "/assets/heroines-generation-one-group_b9ba1dcf.webp";
const variants = {
  e: { label: "E", title: "恋愛映画のオープニング", note: "静かなワイン色と、ひとつの場面から始まる恋。" },
  f: { label: "F", title: "インディー恋愛ZINE", note: "黒インクと朱赤で、作品を選ぶ熱をまっすぐに。" },
  g: { label: "G", title: "深夜のラブレター", note: "墨紺と琥珀の灯りで、誰にも言えない好きに寄り添う。" },
} as const;

export default function AlternateDesignLab() {
  const key = new URLSearchParams(window.location.search).get("variant") as keyof typeof variants | null;
  const current = variants[key ?? "e"] ?? variants.e;
  const featured = [heroines[0], heroines[5], heroines[7]];
  return <main className={`alt-lab alt-lab--${key ?? "e"}`}>
    <header className="alt-lab__meta"><div><p>開発専用／P2-2 別方向デザイン案</p><h1>{current.label}：{current.title}</h1><span>{current.note}</span></div></header>
    <nav className="alt-lab__tabs" aria-label="別方向の比較案">{Object.entries(variants).map(([variantKey, variant]) => <Link key={variantKey} href={`/dev/design-lab-alt?variant=${variantKey}`} className={variantKey === (key ?? "e") ? "is-active" : ""}>{variant.label}<small>{variant.title}</small></Link>)}</nav>
    <section className="alt-lab__stage"><div className="alt-lab__brand"><img src={logoUrl} alt="初恋ラボ" /><span>LOVE STORIES / 2026</span></div><div className="alt-lab__hero"><p>初恋って、いちばん打算のない恋だ。</p><h2>ヒロインから<br />作品をえらぶ</h2><span>気になるあの子を、見つけてね。</span><Link href="/heroines">ヒロインを見つける <b>→</b></Link></div><figure className="alt-lab__scene"><img src={groupImage} alt="第1期ヒロインの集合イラスト" /></figure><div className="alt-lab__files">{featured.map((heroine, index) => <article key={heroine.slug} style={{ "--order": index } as CSSProperties}><img src={heroine.chibiImage} alt="" /><div><small>FILE / 0{heroine.id}</small><h3>{heroine.name}</h3><p>{heroine.tags[0]}</p></div></article>)}</div></section>
    <p className="alt-lab__caption">コピー・ロゴ・選択導線は共通。色、構図、文字の語り口だけを変えています。</p>
  </main>;
}
