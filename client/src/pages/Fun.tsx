import { Link } from "wouter";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const funContents = [
  {
    eyebrow: "推しを調査する",
    title: "童貞探偵の\n恋愛嗜好捜査",
    description: "道庭と鳴海の質問に答えて、あなたに合う初恋ラボのヒロインを推理してもらおう。",
    href: "/diagnosis",
    action: "推しを調査する",
    className: "fun-card--diagnosis",
    mark: "⌕",
  },
  {
    eyebrow: "来訪順を推理する",
    title: "助手・鳴海の\n推理ゲーム（仮）",
    description: "道庭探偵事務所に届いた差し入れ。誰がどの順で来たのか、手がかりを頼りに解決しよう。",
    href: "/mutual",
    action: "事件を推理する",
    className: "fun-card--mutual",
    mark: "♡",
  },
];

export default function Fun() {
  return (
    <div className="page-shell fun-page">
      <SiteHeader />
      <main className="fun-main">
        <section className="fun-intro" aria-labelledby="fun-title">
          <p className="eyebrow">HATSUKOI LAB / FUN CONTENTS</p>
          <h1 id="fun-title">おたのしみ</h1>
          <p>ちょっとした推理と質問で、初恋ラボのヒロインたちに会いにいこう。</p>
        </section>
        <section className="fun-grid" aria-label="おたのしみコンテンツ">
          {funContents.map((content) => (
            <article className={`fun-card ${content.className}`} key={content.href}>
              <span className="fun-card__mark" aria-hidden="true">{content.mark}</span>
              <p className="fun-card__eyebrow">{content.eyebrow}</p>
              <h2>{content.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
              <p>{content.description}</p>
              {content.href === "/mutual" ? (
                <a className="fun-card__action" href={content.href}>{content.action}<span aria-hidden="true">→</span></a>
              ) : (
                <Link className="fun-card__action" href={content.href}>{content.action}<span aria-hidden="true">→</span></Link>
              )}
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
