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
    eyebrow: "鳴海の問題に挑む",
    title: "鳴海からの\n挑戦状",
    description: "先生が留守のあいだに事務所を訪れたのは誰？ 鳴海の判定を頼りに、ヒロインと来訪順を当てよう。",
    href: "/mutual",
    action: "挑戦する",
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
