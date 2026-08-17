/**
 * 初恋ラボの共通ヘッダー。淡いピンクの紙面上で、フルカラーのチューブ型ロゴに十分な余白を与える。
 */
import { Link, useLocation } from "wouter";

const logoUrl = "/assets/tube_full_1bee8d1e.svg";

export function SiteHeader() {
  const [location] = useLocation();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="初恋ラボ トップページ">
          <span className="brand__logo-frame"><img src={logoUrl} className="brand__logo" alt="初恋ラボ" /></span>
        </Link>
        <nav className="site-nav" aria-label="メインナビゲーション">
          <Link href="/" className={`site-nav__link ${location === "/" ? "is-active" : ""}`}>
            トップ
          </Link>
          <Link href="/heroines" className={`site-nav__link ${location === "/heroines" ? "is-active" : ""}`}>
            作品をえらぶ
          </Link>
          <Link href="/fun" className={`site-nav__link ${location === "/fun" ? "is-active" : ""}`}>
            おたのしみ
          </Link>
          <Link href="/commission" className={`site-nav__link ${location === "/commission" ? "is-active" : ""}`}>
            お仕事のご依頼
          </Link>
        </nav>
      </div>
    </header>
  );
}
