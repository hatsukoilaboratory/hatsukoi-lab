/**
 * 初恋ラボの共通連絡先。恋色ノートの余白を保ち、丸型モノクロロゴを控えめな署名として添える。
 */
import { contactEmail, socialLinks } from "@/data/externalLinks";
import { Link } from "wouter";

const footerLogoUrl = "/assets/round_mono_18090b73.svg";

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="公式連絡先">
      <div className="site-footer__inner">
        <div className="site-footer__heading">
          <p className="site-footer__label">おたより・おしらせ</p>
          <span>連絡帳 #01</span>
        </div>
        <div className="contact-links">
          {socialLinks.map((link) => (
            <a key={link.id} className={`contact-link contact-link--${link.id}`} href={link.url} target="_blank" rel="noreferrer">
              <span className="contact-link__name">{link.label}</span>
              <span className="contact-link__handle">{link.handle}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
          <a className="contact-link contact-link--email" href={contactEmail.url}>
            <span className="contact-link__name">{contactEmail.label}</span>
            <span className="contact-link__handle">{contactEmail.address}</span>
            <span aria-hidden="true">✉</span>
          </a>
        </div>
        <p className="site-footer__note">初恋ラボの作品・おしらせは、公式アカウントからお届けします。</p>
        <div className="site-footer__links"><Link href="/about">初恋ラボについて</Link></div>
        <div className="site-footer__logo" aria-hidden="true"><img src={footerLogoUrl} alt="" /></div>
      </div>
    </footer>
  );
}
