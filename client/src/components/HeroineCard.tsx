/**
 * 初恋ラボのヒロイン選択カード。縦長プレースホルダーは将来の立ち絵PNGにそのまま置き換えられる。
 */
import type { CSSProperties } from "react";
import { Link } from "wouter";
import type { Heroine } from "@/data/heroines";

export function HeroineCard({ heroine }: { heroine: Heroine }) {
  return (
    <article className="heroine-card" style={{ "--heroine-color": heroine.color } as CSSProperties}>
      <Link href={`/works/${heroine.slug}`} className="heroine-card__portrait" aria-label={`${heroine.name}の作品ページへ（準備中）`}>
        {heroine.bustImage ?? heroine.standingImage ? (
          <img src={heroine.bustImage ?? heroine.standingImage} alt={`${heroine.name}のバストアップ`} loading="lazy" decoding="async" />
        ) : (
          <div className="heroine-sheet" style={{ "--heroine-color": heroine.color } as CSSProperties}>
            <span className="heroine-sheet__line" />
            <span className={`heroine-sheet__motif heroine-sheet__motif--${heroine.motif}`} aria-hidden="true" />
            <span className={`standing-figure standing-figure--${heroine.motif}`} aria-hidden="true">
              <span className="standing-figure__hair" />
              <span className="standing-figure__face" />
              <span className="standing-figure__body" />
            </span>
            <span className="heroine-sheet__mark">♡</span>
            <span className="heroine-sheet__number">{String(heroine.id).padStart(2, "0")}</span>
            <span className="heroine-sheet__label">恋のしおり</span>
          </div>
        )}
      </Link>
      <div className="heroine-card__copy">
        <h2>{heroine.name}</h2>
        <p>{heroine.quote}</p>
        <ul className="heroine-tags" aria-label={`${heroine.name}の作品属性`}>
          {heroine.tags.map((tag) => <li key={tag}>#{tag}</li>)}
        </ul>
      </div>
    </article>
  );
}
