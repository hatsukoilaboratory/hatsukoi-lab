import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const heroPaperUrl = "/assets/hatsukoi-lab-hero-paper_472872bc.webp";
const heartStampUrl = "/assets/hatsukoi-lab-heart-stamp_89259afa.webp";

export default function AboutProduction() {
  return (
    <div className="page-shell about-production-page" style={{ backgroundImage: `url(${heroPaperUrl})` }}>
      <SiteHeader />
      <main className="about-production-main">
        <section className="about-production-note" aria-labelledby="about-title">
          <img className="about-production-stamp" src={heartStampUrl} alt="" />
          <p className="about-production-kicker">初恋ラボ・観察ノート</p>
          <h1 id="about-title">初恋ラボについて</h1>
          <div className="about-production-copy">
            <p>初恋ラボは、両想いの甘い恋愛を描く漫画サークルです。</p>
            <p>「初恋って、いちばん打算のない恋だ。」</p>
            <p>損得も駆け引きもなく、ただ好きだった。そういう恋を描きたくて作品を作っています。<br />幼馴染、後輩、同級生、隣の部屋の大学生。関係はさまざまですが、<br />どの作品も「ふたりがちゃんと両想いになるまで」と「なったあと」を描いています。</p>
            <p>作品はFANZA、DLsite、BOOTHなどで販売しているほか、xtoonで連載も行っています。<br />キャラクターデザインのご依頼も承っています。</p>
          </div>
        </section>

        <section className="about-production-note about-production-note--process" aria-labelledby="production-title">
          <p className="about-production-kicker">初恋ラボ・制作メモ</p>
          <h2 id="production-title">制作について</h2>
          <div className="about-production-copy">
            <p>初恋ラボの漫画は、AI画像生成を利用して制作しています。</p>
            <h3>使用しているツール</h3>
            <ul className="about-production-tools">
              <li>SeaArt(キャラクターイラストの生成)</li>
              <li>Magnific(画像の高解像度化・調整)</li>
              <li>Blender(背景の作画)</li>
              <li>CLIP STUDIO PAINT(漫画としての仕上げ)</li>
            </ul>
            <h3>制作の流れ</h3>
            <p>シナリオとネームを作り、コマ割りと構図を設計したうえで、必要な絵をキャラクターごとに生成しています。生成した素材はCLIP STUDIO PAINTに持ち込み、コマの配置、セリフ、効果線、トーン処理を行って漫画として組み上げます。</p>
            <p>背景はBlenderで3Dの空間を組み、線画として書き出したものを使用しています。</p>
            <p>キャラクターは作品ごとに専用のモデルを用意し、同じ人物が同じ人物として描かれるようにしています。</p>
            <h3>人の手で行っていること</h3>
            <p>物語の構成、シナリオ、セリフ、ネーム、コマ割り、構図の設計、キャラクターの設定、演出の設計。</p>
            <p>漫画としての面白さを決める部分は、すべて自分の手で作っています。</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
