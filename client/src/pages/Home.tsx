/**
 * 初恋ラボのトップ。選択ゲームのような柔らかな枠組みで、短い約束とちびキャラの小さな発見を置く。
 */
import { Link } from "wouter";
import { ChibiFloaters } from "@/components/ChibiFloaters";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const heroPaperUrl = "/assets/hatsukoi-lab-hero-paper_472872bc.webp";
const heartStampUrl = "/assets/hatsukoi-lab-heart-stamp_89259afa.webp";
const researchSealUrl = "/assets/round_mono_18090b73.svg";

export default function Home() {
  return (
    <div className="page-shell home-page" style={{ backgroundImage: `url(${heroPaperUrl})` }}>
      <SiteHeader />
      <main className="home-hero">
        <ChibiFloaters />
        <section className="hero-message" aria-labelledby="home-title">
          <div className="hero-message__panel">
            <img className="hero-message__research-mark" src={researchSealUrl} alt="" />
            <img className="hero-message__stamp" src={heartStampUrl} alt="" />
            <h1 id="home-title">初恋ラボ</h1>
            <p className="hero-message__tagline">初恋って、いちばん打算のない恋だ。</p>
            <div className="hero-message__actions">
              <Link href="/heroines" className="button button--primary">ヒロインから作品をえらぶ<span aria-hidden="true">→</span></Link>
              <Link href="/diagnosis" className="hero-message__detective"><span aria-hidden="true">⌕</span>童貞探偵に推しを推理してもらう</Link>
              <a href="/mutual" className="hero-message__detective"><span aria-hidden="true">♡</span>鳴海からの挑戦状に挑む</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
