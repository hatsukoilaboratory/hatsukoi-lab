/**
 * 初恋ラボの期別キャラクター選択画面。年次・表示方式・画像・人物配置は heroineCollections.ts に集約し、将来の追加をデータだけで受け止める。
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocation } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { heroineCollections, getCollectionByYear, type Hotspot } from "@/data/heroineCollections";
import { heroines, type Heroine } from "@/data/heroines";

const rosterPaperUrl = "/assets/hatsukoi-lab-roster-paper_70ee4e26.webp";
const tabUrl = "/assets/hatsukoi-lab-note-tab_ee01f895.webp";

export default function HeroineList() {
  const [, setLocation] = useLocation();
  const [activeHeroineSlug, setActiveHeroineSlug] = useState<string | null>(null);
  const [profileHeroine, setProfileHeroine] = useState<Heroine | null>(null);
  const profileDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayedHeroineSlug = profileHeroine?.slug ?? activeHeroineSlug;
  const activeSpotlight = heroineCollections.flatMap((collection) => collection.entries).find((entry) => entry.heroineSlug === displayedHeroineSlug)?.hotspot;
  const activeHeroine = displayedHeroineSlug ? heroines.find((heroine) => heroine.slug === displayedHeroineSlug) : null;
  const spotlightStyle = {
    "--ox": `${activeSpotlight?.x ?? 50}%`, "--oy": `${activeSpotlight?.y ?? 50}%`,
    "--sx": `${activeSpotlight?.x ?? 50}%`, "--sy": `${activeSpotlight?.y ?? 50}%`,
  } as CSSProperties;
  const preloadBustImage = (heroine: Heroine) => {
    const src = heroine.bustImage ?? heroine.standingImage ?? heroine.chibiImage;
    if (!src) return;
    const image = new Image();
    image.decoding = "async";
    image.src = src;
  };

  const openProfileAfterFocus = (heroine: Heroine, delay = 850) => {
    if (profileDelayRef.current) clearTimeout(profileDelayRef.current);
    setProfileHeroine(null);
    setActiveHeroineSlug(heroine.slug);
    profileDelayRef.current = setTimeout(() => { setProfileHeroine(heroine); profileDelayRef.current = null; }, delay);
  };

  useEffect(() => () => { if (profileDelayRef.current) clearTimeout(profileDelayRef.current); }, []);

  useEffect(() => {
    const requestedSlug = new URLSearchParams(window.location.search).get("profile");
    const requestedHeroine = requestedSlug ? heroines.find((heroine) => heroine.slug === requestedSlug) : null;
    if (!requestedHeroine) return;
    setActiveHeroineSlug(requestedHeroine.slug);
    setProfileHeroine(requestedHeroine);
  }, []);

  return <div className="page-shell heroine-page" style={{ backgroundImage: `url(${rosterPaperUrl})` }}>
    <SiteHeader />
    <main className="roster-main">
      <section className="roster-heading" aria-labelledby="roster-title">
        <img className="roster-heading__tab" src={tabUrl} alt="" /><span className="roster-heading__record">初恋ラボ／観察ノート #02</span>
        <p className="eyebrow">気になるあの子をえらぶ</p><h1 id="roster-title">ヒロインから<br />作品をえらぶ</h1><p className="roster-heading__lead">気になるあの子をタップしてね。</p>
      </section>
      {heroineCollections.map((collection) => {
        const collectionHeroines = collection.entries.map((entry) => ({ entry, heroine: heroines.find((heroine) => heroine.slug === entry.heroineSlug) })).filter((item): item is { entry: typeof collection.entries[number]; heroine: Heroine } => Boolean(item.heroine));
        const sectionId = `generation-${collection.year}-title`;
        return <section key={collection.year} className={`generation-section generation-section--${collection.display === "spotlight-group" ? "one" : "two"}`} aria-labelledby={sectionId}>
          <div className="generation-heading"><span>{collection.note}</span><div><h2 id={sectionId}>{collection.title} <small>（{collection.year}年組）</small></h2><p>{collection.status}</p></div></div>
          {collection.display === "spotlight-group" && collection.image ? <>
            <div className={`generation-one-spotlight-stage${activeSpotlight ? " is-spotlight-active" : ""}`} style={spotlightStyle} aria-label={`${collection.title}のヒロインを選ぶ`}>
              <div className="generation-one-spotlight-zoom"><img className="generation-one-base" src={collection.image} alt={collection.imageAlt ?? "ヒロイン集合イラスト"} /><img className="generation-one-spot" src={collection.image} alt="" aria-hidden="true" /></div>
              {collectionHeroines.map(({ heroine, entry }) => {
                const spot = entry.hotspot as Hotspot;
                const hotspotStyle: CSSProperties = { left: `${spot.x - spot.width / 2}%`, top: `${spot.y - spot.height / 2}%`, width: `${spot.width}%`, height: `${spot.height}%` };
                return <button key={heroine.id} type="button" className="generation-one-hot" style={hotspotStyle} onMouseEnter={() => { setActiveHeroineSlug(heroine.slug); preloadBustImage(heroine); }} onMouseLeave={() => setActiveHeroineSlug(null)} onFocus={() => { setActiveHeroineSlug(heroine.slug); preloadBustImage(heroine); }} onBlur={() => setActiveHeroineSlug(null)} onTouchStart={() => preloadBustImage(heroine)} onClick={() => openProfileAfterFocus(heroine)} aria-label={`${heroine.name}にフォーカスします。プロフィールは少し後に表示されます`} />;
              })}
              <p key={displayedHeroineSlug ?? "idle"} className="generation-one-spotlight-label" aria-live="polite">{activeHeroine?.name ?? ""}</p>
            </div><p className="generation-section__hint">気になるヒロインをタップしてね。</p>
          </> : <div className="generation-two-grid">
            {collectionHeroines.map(({ heroine, entry }) => <button key={heroine.id} type="button" className="generation-frame-card" style={{ "--heroine-color": heroine.color, "--pair-position": entry.imagePosition ?? "center", backgroundImage: heroine.listImage ? `url(${heroine.listImage})` : heroine.bustImage ? `url(${heroine.bustImage})` : entry.image ? `url(${entry.image})` : undefined } as CSSProperties} onPointerEnter={() => preloadBustImage(heroine)} onFocus={() => preloadBustImage(heroine)} onTouchStart={() => preloadBustImage(heroine)} onClick={() => openProfileAfterFocus(heroine, 0)} aria-label={`${heroine.name}のプロフィールをみる`}>
              <span className="generation-frame-card__file">FILE 0{heroine.id}</span><span className="generation-frame-card__seal" aria-hidden="true">♡</span>
              <div className="generation-frame-card__caption"><h3>{heroine.name}</h3><p>{heroine.quote}</p><ul>{heroine.tags.map((tag) => <li key={tag}>#{tag}</li>)}</ul></div>
            </button>)}
          </div>}
        </section>;
      })}
    </main>
    <Dialog open={Boolean(profileHeroine)} onOpenChange={(open) => { if (!open) setProfileHeroine(null); }}>
      {profileHeroine && <DialogContent className="heroine-profile-modal" showCloseButton={false}>
        <DialogClose className="heroine-profile-modal__close" aria-label="プロフィールを閉じる">×</DialogClose><div className="heroine-profile-modal__topline"><span>初恋ラボ／ヒロイン・プロフィール</span><b>FILE 0{profileHeroine.id}</b></div>
        <div className="heroine-profile-modal__body" style={{ "--profile-color": profileHeroine.color, "--bust-position": profileHeroine.bustPosition ?? "50% 29%" } as CSSProperties}><div className="heroine-profile-modal__portrait"><img src={profileHeroine.bustImage ?? profileHeroine.standingImage ?? profileHeroine.chibiImage} alt={`${profileHeroine.name}${profileHeroine.bustImage || profileHeroine.standingImage ? "のバストアップ" : "のちびキャライラスト"}`} loading="eager" decoding="async" /></div><div className="heroine-profile-modal__copy">
          <p className="heroine-profile-modal__record">第{getCollectionByYear(profileHeroine.generation)?.order ?? "?"}期ヒロイン</p><DialogTitle>{profileHeroine.name}</DialogTitle><DialogDescription className="heroine-profile-modal__quote">{profileHeroine.quote}</DialogDescription>
          <dl className="heroine-profile-modal__facts"><div><dt>身長</dt><dd>{profileHeroine.height} cm</dd></div><div><dt>カップ</dt><dd>{profileHeroine.cup}</dd></div></dl><ul className="heroine-profile-modal__tags">{profileHeroine.tags.map((tag) => <li key={tag}>#{tag}</li>)}</ul>
          <p className="heroine-profile-modal__next-hint">下のボタンから、作品ページへ進めます。</p><button type="button" className="button button--primary heroine-profile-modal__work-link" onClick={() => { setProfileHeroine(null); setActiveHeroineSlug(null); setLocation(`/works/${profileHeroine.slug}`); }}>作品ページへ進む <span>→</span></button>
        </div></div>
      </DialogContent>}
    </Dialog><SiteFooter />
  </div>;
}
