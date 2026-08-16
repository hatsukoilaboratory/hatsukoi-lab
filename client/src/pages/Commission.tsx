/**
 * 初恋ラボのキャラクターデザイン依頼ページ。研究ノートの温度を保ち、外部相談先へ穏やかに案内する。
 */
import { toast } from "sonner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { commissionData } from "@/data/commission";

const labSealUrl = "/assets/hatsukoi-lab-logo_aaa687fb.png";

type OutboundCtaProps = {
  href: string;
  className: string;
  children: React.ReactNode;
};

function OutboundCta({ href, className, children }: OutboundCtaProps) {
  if (href) {
    const opensNewTab = /^https?:\/\//.test(href);
    return <a className={className} href={href} target={opensNewTab ? "_blank" : undefined} rel={opensNewTab ? "noreferrer" : undefined}>{children}</a>;
  }
  return <button type="button" className={className} onClick={() => toast("お問い合わせ先は、ただいま準備中です。", { description: "URLを設定後に外部相談ページへ移動します。" })}>{children}</button>;
}

export default function Commission() {
  const { credentials, services, pricing, mangaWorkExamples, mangaAchievements, mangaFeatureAchievement, steps, sampleImages, cta, scheduleDisclaimer } = commissionData;

  return (
    <div className="page-shell commission-page">
      <SiteHeader />
      <main className="commission-main">
        <section className="commission-hero" aria-labelledby="commission-title">
          <span className="commission-record">初恋ラボ／お仕事ノート #01</span>
          <span className="commission-hero__stamp" aria-hidden="true">✦</span>
          <span className="commission-character-file" aria-hidden="true"><i /><i /><i /></span>
          <p className="eyebrow">WORK COMMISSION</p>
          <h1 id="commission-title">お仕事のご依頼<br />承ります</h1>
          <p>漫画制作・キャラクターデザインなど、<br />お仕事のご相談を承ります。</p>
          <span className="commission-hero__folio">相談ノート ／ CHARACTER FILE 01</span>
        </section>

        <section className="commission-section manga-achievement-section" aria-labelledby="manga-achievement-title">
          <div className="commission-heading"><span>漫画実績メモ</span><h2 id="manga-achievement-title">漫画制作の実績</h2><img className="commission-heading__seal" src={labSealUrl} alt="" /></div>
          <div className="manga-achievement-grid">
            {mangaAchievements.map((achievement, index) => <article key={`${achievement.source}-${achievement.title}`} className="manga-achievement"><span>{String(index + 1).padStart(2, "0")} / {achievement.source}</span><h3>{achievement.title}</h3><b>{achievement.value}</b></article>)}
            <article className="manga-achievement manga-achievement--feature"><span>05 / {mangaFeatureAchievement.source}</span><div><h3>{mangaFeatureAchievement.title}</h3><p>{mangaFeatureAchievement.description}</p></div><ul>{mangaFeatureAchievement.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul></article>
          </div>
        </section>

        <section className="commission-section manga-work-section" aria-labelledby="manga-work-title">
          <div className="commission-heading"><span>① ご依頼メモ</span><h2 id="manga-work-title">漫画制作のご依頼</h2></div>
          <p className="manga-work-section__lead">以下は、これまでにお受けした内容の参考です。ご依頼内容に合わせてご相談ください。</p>
          <div className="manga-work-cards">
            {mangaWorkExamples.map((work) => <article className="manga-work-card" key={work.number}><span>{work.number}</span><h3>{work.title}</h3><b>{work.price}</b><p>{work.detail}</p><div className="delivery-meta"><span>⌛ {work.delivery}</span><span>▣ {work.fileFormat}</span></div></article>)}
          </div>
          <p className="schedule-disclaimer">{scheduleDisclaimer}</p>
        </section>

        <div className="commission-character-group">
          <section className="commission-section commission-credentials" aria-labelledby="credential-title">
            <div className="commission-heading"><span>② お仕事メモ</span><h2 id="credential-title">キャラクターデザイン</h2><img className="commission-heading__seal" src={labSealUrl} alt="" /></div>
            <div className="credential-list">
              {credentials.map((credential, index) => <article key={credential.title} className="credential-note"><b>{String(index + 1).padStart(2, "0")}</b><div><h3>{credential.title}</h3><p>{credential.description}</p></div></article>)}
            </div>
            <div className="sample-scroller commission-sample-scroller" aria-label="実績サンプル">
            {sampleImages.length > 0 ? sampleImages.map((sample, index) => <figure key={sample.name} className="commission-sample-figure"><span className="commission-sample-figure__file">CHARACTER FILE {String(index + 1).padStart(2, "0")}</span><span className="commission-sample-figure__bookmark">立ち絵の栞</span><span className="commission-sample-figure__stamp" aria-hidden="true">♡</span><img src={sample.src} alt={`${sample.name}のキャラクターデザイン実績`} /><figcaption><b>{sample.name}</b><span>{sample.note}</span></figcaption></figure>) : [1, 2, 3].map((index) => <div key={index} className={`sample-card commission-sample-card commission-sample-card--${index}`} aria-label="実績サンプル準備中"><span className="commission-sample-card__sheet"><i /><i /><i /></span><strong>実績サンプル<br />準備中</strong><small>DESIGN NOTE {String(index).padStart(2, "0")}</small></div>)}
            </div>
          </section>

          <section className="commission-section" aria-labelledby="service-title">
            <div className="commission-heading"><span>お手伝いメモ</span><h2 id="service-title">お手伝いできること</h2></div>
            <div className="service-cards">
              {services.map((service) => <article key={service.number} className="service-card"><span>{service.number}</span><h3>{service.title}</h3><p>{service.detail}</p><div className="delivery-meta"><span>⌛ {service.delivery}</span><span>▣ {service.fileFormat}</span></div></article>)}
            </div>
          </section>

          <section className="commission-section commission-pricing" aria-labelledby="pricing-title">
            <div className="commission-heading"><span>ご予算メモ</span><h2 id="pricing-title">料金のめやす</h2><img className="commission-heading__seal" src={labSealUrl} alt="" /></div>
            <article className="price-note">
              <span className="price-note__clip">料金メモ</span>
              <h3>{pricing.title}</h3>
              <p>{pricing.description}</p>
              <ul>{pricing.notes.map((note) => <li key={note}>{note}</li>)}</ul>
              <div className="price-note__delivery"><span>⌛ {pricing.delivery}</span><span>▣ {pricing.fileFormat}</span></div>
            </article>
            <p className="price-disclaimer">{pricing.disclaimer}</p>
          </section>
        </div>

        <section className="commission-section" aria-labelledby="step-title">
          <div className="commission-heading"><span>ご依頼メモ</span><h2 id="step-title">ご依頼の流れ</h2></div>
          <ol className="flow-list">
            {steps.map((step) => <li key={step.number}><b>{step.number}</b><div><h3>{step.title}</h3><p>{step.detail}</p></div></li>)}
          </ol>
        </section>

        <section className="commission-cta" aria-labelledby="cta-title">
          <span className="commission-cta__tape" aria-hidden="true" />
          <p className="eyebrow">CONTACT NOTE</p>
          <h2 id="cta-title">まずは、お仕事のご相談を<br />お聞かせください。</h2>
          <div className="commission-cta__buttons">
            <OutboundCta href={cta.emailUrl} className="button button--primary commission-cta__primary">メールで問い合わせる<span aria-hidden="true">✉</span></OutboundCta>
            <OutboundCta href={cta.xInquiryUrl} className="button button--secondary commission-cta__secondary">Xで問い合わせる<span aria-hidden="true">↗</span></OutboundCta>
          </div>
          <p className="commission-cta__note">ご相談だけでも歓迎です</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
