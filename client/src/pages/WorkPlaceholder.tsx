/**
 * 初恋ラボの共通作品詳細ページ。slugでヒロインと作品データを結び、全年齢表示と販売導線を一つの便箋にまとめる。
 */
import { useEffect, useState, type CSSProperties } from "react";
import { Link, useRoute } from "wouter";
import { Share2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { otherEbookStoreLinks, storeLinks } from "@/data/externalLinks";
import { heroines } from "@/data/heroines";
import { works } from "@/data/works";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { buildWorkShareText, buildXIntentUrl } from "@/lib/share";

function StandingPortrait({ heroine }: { heroine: (typeof heroines)[number] }) {
  const bustImage = heroine.bustImage ?? heroine.standingImage;
  if (bustImage) {
    return <div className="work-heroine__portrait-frame work-heroine__portrait-frame--bust" style={{ "--bust-position": heroine.bustPosition ?? "50% 29%" } as CSSProperties}><img className="work-heroine__image work-heroine__image--bust" src={bustImage} alt={`${heroine.name}のバストアップ`} loading="eager" decoding="async" fetchPriority="high" /></div>;
  }

  return (
    <div className="work-heroine__placeholder" aria-label={`${heroine.name}の立ち絵は準備中`}>
      <img className="work-heroine__chibi" src={heroine.chibiImage} alt={`${heroine.name}のちびキャライラスト`} />
      <span className="work-heroine__folio">HEROINE / {String(heroine.id).padStart(2, "0")}</span>
    </div>
  );
}

export default function WorkPlaceholder() {
  const [, params] = useRoute("/works/:slug");
  const heroine = heroines.find((item) => item.slug === params?.slug);
  const work = works.find((item) => item.slug === params?.slug);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const samplePages: (string | null)[] = work?.sampleImages.length ? work.sampleImages : [null, null, null];
  const moveViewer = (direction: -1 | 1) => setViewerIndex((index) => index === null ? index : (index + direction + samplePages.length) % samplePages.length);

  useEffect(() => {
    if (viewerIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewerIndex(null);
      if (event.key === "ArrowLeft") moveViewer(-1);
      if (event.key === "ArrowRight") moveViewer(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewerIndex]);

  if (!heroine || !work) {
    return (
      <div className="page-shell placeholder-page">
        <SiteHeader />
        <main className="work-main">
          <section className="placeholder-note"><span className="placeholder-note__clip">初恋ラボ・研究メモ</span><h1>作品が見つかりません</h1><p>ヒロイン一覧から、もう一度えらんでみてね。</p><Link href="/heroines" className="button button--secondary">ヒロイン一覧にもどる</Link></section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const availableStores = work.stores.filter((store) => Boolean(store.url));
  const officialCatalogStore = work.stores.some((store) => store.label.includes("FANZA")) ? storeLinks.find((store) => store.id === "fanza") : undefined;
  const xtoonStore = storeLinks.find((store) => store.id === "xtoon");
  const isInProgress = work.status === "in-progress";
  const isR18 = work.rating === "r18";
  const hasSampleImages = work.sampleImages.length > 0;
  const productOrder = ["本編", "後日談CG集", "続編漫画"];
  const workShareText = buildWorkShareText({ quote: heroine.quote, heroineName: heroine.name, workTitle: work.title, slug: work.slug });
  const workXShareUrl = buildXIntentUrl(workShareText);
  const salesByProduct = availableStores.reduce<Record<string, typeof availableStores>>((groups, store) => {
    const [productName = "本編"] = store.label.split("｜");
    groups[productName] ??= [];
    groups[productName].push(store);
    return groups;
  }, {});
  const saleGroups = Object.entries(salesByProduct).sort(([left], [right]) => (productOrder.indexOf(left) === -1 ? 99 : productOrder.indexOf(left)) - (productOrder.indexOf(right) === -1 ? 99 : productOrder.indexOf(right)));

  return (
    <div className="page-shell work-page" style={{ "--work-color": heroine.color } as CSSProperties}>
      <SiteHeader />
      <main className="work-detail">
        <section className="work-heroine" aria-labelledby="heroine-name">
          <span className="work-section-label">初恋ラボ・観察ノート #{String(heroine.id).padStart(2, "0")}</span>
          <div className="work-heroine__layout">
            <StandingPortrait heroine={heroine} />
            <div className="work-heroine__copy">
              <p className="eyebrow">この作品のヒロイン</p>
              <h1 id="heroine-name">{heroine.name}</h1>
              <p className="work-heroine__quote">{heroine.quote}</p>
              <ul className="work-tags" aria-label={`${heroine.name}の作品属性`}>
                {heroine.tags.map((tag) => <li key={tag}>#{tag}</li>)}
              </ul>
              <dl className="work-profile" aria-label={`${heroine.name}のプロフィール`}><div><dt>身長</dt><dd>{heroine.height}cm</dd></div><div><dt>カップ</dt><dd>{heroine.cup}</dd></div></dl>
            </div>
          </div>
        </section>

        <section className="work-overview" aria-labelledby="work-title">
          <span className="work-section-label">作品メモ</span>
          <div className="work-title-row">
            <h2 id="work-title">{work.title}</h2>
            {isInProgress ? <span className="work-status-badge">制作中</span> : isR18 && <span className="r18-badge">R18</span>}
          </div>
          <p>{work.synopsis}</p>
        </section>

        {!isInProgress && <section className="sample-section" aria-labelledby="sample-title">
          <div className="section-heading">
            <div><p className="eyebrow">おすそわけ</p><h2 id="sample-title">サンプル</h2></div>
            <span>全年齢表示</span>
          </div>
          <p className="sample-section__hint">{hasSampleImages ? "タップで拡大。ビューア内では左右にスワイプしてページを送れます。" : "全年齢サンプルは掲載準備中です。公開後はここからページをめくれます。"}</p>
          <div className="sample-scroller">
            {samplePages.map((image, index) => image ? <button key={image} type="button" className="sample-card sample-card--trigger" onClick={() => setViewerIndex(index)} aria-label={`${work.title}のサンプル ${index + 1} を拡大して読む`}>
              <img src={image} alt={`${work.title}のサンプル ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" /><span className="sample-card__zoom" aria-hidden="true">拡大して読む ↗</span>
            </button> : <div key={`placeholder-${index}`} className={`sample-card sample-card--placeholder sample-card--placeholder-${index + 1}`} aria-label={`${work.title}の全年齢サンプルは準備中`}>
              <span className="sample-card__paper" aria-hidden="true"><i /><i /><i /></span><span className="sample-card__title">全年齢サンプル<br />準備中</span><small>sample {String(index + 1).padStart(2, "0")}</small>
            </div>)}
          </div>
        </section>}

        <section className="purchase-section" aria-labelledby="purchase-title">
          <span className="work-section-label">購入メモ</span>
          <h2 id="purchase-title">{isInProgress ? "ただいま制作中です" : "この作品をよむ"}</h2>
          {!isInProgress && isR18 && <p className="r18-notice">この作品は成人向けです。サンプル・続きは各ストア（18歳以上）でご覧ください</p>}
          {isInProgress ? <div className="production-notice"><strong>なっちゃんの新作漫画を制作しています</strong><span>公開時には、こちらと公式アカウントでお知らせします。</span></div> : availableStores.length > 0 ? (
            <div className="sale-product-list">
              {saleGroups.map(([productName, stores]) => <section key={productName} className="sale-product-card" aria-label={`${productName}の販売先`}>
                <div className="sale-product-card__heading"><span>{productName}</span><small>{stores.length}ストアで配信中</small></div>
                <div className="sale-product-card__stores">
                  {stores.map((store) => {
                    const [, storeName = store.label] = store.label.split("｜");
                    const storeMeta = storeLinks.find((link) => link.label === storeName);
                    return <a key={store.label} className="sale-store-button" style={{ "--store-tone": storeMeta?.tone ?? heroine.color } as CSSProperties} href={store.url} target="_blank" rel="noreferrer">
                      {storeMeta ? <img src={storeMeta.logo} alt="" /> : <span className="sale-store-button__wordmark">{storeName}</span>}
                      <span>{storeName}</span><i aria-hidden="true">↗</i>
                    </a>;
                  })}
                </div>
              </section>)}
              <section className="sale-product-card" aria-label="Amazonほか電子書籍ストアの販売先">
                <div className="sale-product-card__heading"><span>電子書籍ストア</span><small>作者・作品検索ページ</small></div>
                <div className="sale-product-card__stores">
                  {otherEbookStoreLinks.map((store) => <a key={store.id} className="sale-store-button" style={{ "--store-tone": store.tone } as CSSProperties} href={store.url} target="_blank" rel="noreferrer">
                    <span className="sale-store-button__wordmark">{store.label}</span><i aria-hidden="true">↗</i>
                  </a>)}
                </div>
              </section>
            </div>
          ) : <div className="store-pending"><p>作品ごとの販売ページは、ただいま整理中です。</p>{officialCatalogStore && <a className="purchase-button purchase-button--catalog" href={officialCatalogStore.url} target="_blank" rel="noreferrer">FANZAの初恋ラボ作品一覧をみる <span aria-hidden="true">↗</span></a>}<small>個別の販売URLが登録されると、ここから直接お読みいただけます。</small></div>}
          {xtoonStore && <a className="xtoon-short-cg" href={xtoonStore.url} target="_blank" rel="noreferrer"><img src={xtoonStore.logo} alt="xtoon" /><span><strong>xtoonで短編CG集を毎週配信中</strong><small>このヒロインの短編CG集をみる</small></span><i aria-hidden="true">↗</i></a>}
        </section>

        <div className="work-share" aria-label="この作品を共有">
          <p>この作品をシェアする</p>
          <a href={workXShareUrl} target="_blank" rel="noreferrer"><Share2 aria-hidden="true" />この作品をXで共有する</a>
        </div>
        <div className="work-back"><Link href="/heroines" className="button button--secondary">ほかのヒロインもみる<span aria-hidden="true">→</span></Link></div>
      </main>
      <Dialog open={viewerIndex !== null} onOpenChange={(open) => { if (!open) setViewerIndex(null); }}>
        {viewerIndex !== null && <DialogContent className="sample-viewer" showCloseButton={false}>
          <DialogTitle className="sample-viewer__title">{work.title}のサンプル {viewerIndex + 1}</DialogTitle>
          <div className="sample-viewer__top"><span>全年齢サンプル</span><span>{viewerIndex + 1} / {samplePages.length}</span><DialogClose className="sample-viewer__close" aria-label="サンプルビューアを閉じる">×</DialogClose></div>
          <div className="sample-viewer__canvas" onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)} onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientX; if (touchStartX === null || end === undefined) return; const delta = end - touchStartX; if (Math.abs(delta) > 42) moveViewer(delta < 0 ? 1 : -1); setTouchStartX(null); }}>
            {samplePages[viewerIndex] ? <img src={samplePages[viewerIndex] ?? ""} alt={`${work.title}のサンプル ${viewerIndex + 1}`} /> : <div className="sample-viewer__placeholder"><span>全年齢サンプル</span><strong>掲載準備中</strong><small>ここに漫画ページが入ります</small></div>}
          </div>
          <div className="sample-viewer__controls"><button type="button" onClick={() => moveViewer(-1)} aria-label="前のサンプルページ">← 前へ</button><div>{samplePages.map((_, index) => <span key={index} className={index === viewerIndex ? "is-current" : ""} />)}</div><button type="button" onClick={() => moveViewer(1)} aria-label="次のサンプルページ">次へ →</button></div>
          {(availableStores[0] || officialCatalogStore) && <a className="sample-viewer__store" href={(availableStores[0] ?? officialCatalogStore)?.url} target="_blank" rel="noreferrer">{availableStores.length > 0 ? "続きをストアで読む" : "FANZAの作品一覧をみる"} <span>↗</span></a>}
        </DialogContent>}
      </Dialog>
      <SiteFooter />
    </div>
  );
}
