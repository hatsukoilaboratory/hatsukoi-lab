import { contactEmail } from "./externalLinks";

/**
 * キャラクターデザイン依頼ページの編集用データ。
 * URLを設定するとCTAが外部リンクとして有効になり、空文字の間は準備中案内を表示する。
 */
export const commissionData = {
  sampleImages: [
    {
      name: "竹之下チハル",
      note: "女性向けキャラクターのチャット数1位を記録",
      src: "/assets/commission-takenoshita-chiharu_692f6a99.webp",
    },
    {
      name: "小鳥遊りな",
      note: "Renoas Chat 立ち絵デザイン",
      src: "/assets/commission-takanashi-rina_a2bdbe63.webp",
    },
  ],
  credentials: [
    {
      title: "Renoas Chatの立ち絵デザイン",
      description: "AIキャラクターとのチャットサービス「Renoas Chat」にて、キャラクターの立ち絵をデザインした実績があります。竹之下チハルは女性向けキャラクターのチャット数1位を記録しました。",
    },
  ],
  services: [
    { number: "01", title: "キャラクターデザイン", detail: "立ち絵・表情差分まで、キャラクターの魅力を一緒に考えます。", delivery: "目安：1〜2週間", fileFormat: "PNG（背景透過）／JPG" },
    { number: "02", title: "既存キャラのイラスト制作", detail: "すでにいる大切なキャラクターを、イメージに合わせて描きます。", delivery: "目安：1〜2週間", fileFormat: "PNG（背景透過）／JPG" },
    { number: "03", title: "ご相談ベースのカスタム対応", detail: "用途やご予算に合わせて、いっしょにできることをご提案します。", delivery: "内容によりご相談", fileFormat: "PNG／JPG ほか応相談" },
  ],
  pricing: {
    title: "キャラクターデザイン 1件 3,000円",
    description: "性格・年齢などの設定から、全身一枚絵をデザイン。リテイク（方向性の再調整）2回まで込み",
    notes: [
      "5件以上の同時ご依頼で 1件2,500円",
      "3回目以降のリテイクは +500円/回",
      "商用利用・二次利用はご相談ください",
    ],
    delivery: "納期の目安：1〜2週間",
    fileFormat: "納品形式：PNG（背景透過）／JPG",
    disclaimer: "掲載は目安です。内容により変動する場合があります",
  },
  mangaWorkExamples: [
    {
      number: "01",
      title: "漫画制作（ネームから）",
      price: "1ページ 10,000円",
      detail: "1ページ平均4コマを想定。キャラ設定と簡単なストーリーラインをもとに、ネームから制作します。",
      delivery: "10ページ程度：2〜4週間",
      fileFormat: "PNG／JPG または PDF（ページごと）",
    },
    {
      number: "02",
      title: "漫画作画のみ",
      price: "1ページ 7,000円",
      detail: "ネームをご用意いただき、作画のみを担当します。",
      delivery: "10ページ程度：1〜3週間",
      fileFormat: "PNG／JPG または PDF（ページごと）",
    },
    {
      number: "03",
      title: "キャラ設定・ストーリー作成",
      price: "50ページ 1本 150,000円",
      detail: "キャラ設定から、1本分のストーリーを制作します。",
      delivery: "50ページ想定：3〜5週間",
      fileFormat: "PDF またはテキスト形式",
    },
  ],
  mangaAchievements: [
    { source: "FANZA", title: "AI利用の成人向け同人 24時間ランキング", value: "10位獲得" },
    { source: "販売実績", title: "1,000部以上の売上作品", value: "2本" },
    { source: "Kindle Unlimited", title: "大人向けコミックランキング", value: "1位獲得" },
    { source: "xtoon", title: "ショートマンガ選手権・全年齢向け漫画部門", value: "xtoon内いいね数1位" },
  ],
  mangaFeatureAchievement: {
    source: "X連載実績",
    title: "100日後にチャラ男のキープちゃんを幸せにする話",
    description: "Xにて100日連続連載、250ページ超を制作",
    metrics: ["全話合計 350万IMP", "20,000いいね"],
  },
  steps: [
    { number: "①", title: "ご相談", detail: "内容・イメージをヒアリングします" },
    { number: "②", title: "ラフ確認", detail: "方向性をすり合わせます" },
    { number: "③", title: "納品", detail: "修正対応のうえお渡しします" },
  ],
  cta: {
    emailUrl: contactEmail.url,
    xInquiryUrl: "https://twitter.com/hatsukoi_lab",
  },
  scheduleDisclaimer: "納期は内容・点数・稼働状況により前後します。まずはお気軽にご相談ください。",
};
