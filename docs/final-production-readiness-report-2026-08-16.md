# 初恋ラボ｜本番公開・最終検証レポート

**作成日:** 2026年8月16日  
**公開サイト:** [https://hatsukoi-lab.com/](https://hatsukoi-lab.com/)  
**Cloudflare Pages:** `hatsukoilab.pages.dev`  
**納品対象:** `dist/public` を含む最新ソース一式

## 結論

初恋ラボ公式サイトは、Manusの実行環境に依存しない静的ビルドとして完成しており、Cloudflare Pagesの独自ドメイン **hatsukoi-lab.com** で公開されています。トップ、作品をえらぶ、各作品ページ、診断、お仕事のご依頼、初恋ラボについての主要導線を確認しました。診断は質問、推理演出、通常結果、GAME OVER、再診断、X共有、端末のネイティブ共有まで通しで動作します。

## 本番ビルドと配置

| 項目 | 確定値 |
|---|---|
| ビルドコマンド | `SITE_URL=https://hatsukoi-lab.com pnpm build:web` |
| 静的出力 | `dist/public` |
| Cloudflare Pagesの出力ディレクトリ | `dist/public` |
| SPAフォールバック | `client/public/_redirects` の `/* /index.html 200` |
| 公開ドメイン | `https://hatsukoi-lab.com/` |
| 更新方法 | 新しい `dist/public` をCloudflare PagesへDirect Upload |

生成物にはHTML、CSS、JavaScript、WebP画像、OGP画像、favicon、robots.txt、sitemap.xml、SPAリダイレクトが含まれます。サイトの公開にサーバー処理、データベース、Manus認証、Manus Storageは必要ありません。

## Manus依存の監査

| 対象 | 最終状態 |
|---|---|
| `/manus-storage/` 参照 | 公開ビルドから除去 |
| Manus Storage Proxy | 静的アセット参照へ移行済み |
| Manus runtime plugin | 公開ビルドでは不使用 |
| debug collector | 公開HTML・公開アセットから除去 |
| Manus専用ドメイン | 公開導線・OGP・共有URLから除去 |
| 画像・サンプル・ロゴ | `/assets/` の静的ファイルとして同梱 |
| Express / serverコード | 内部互換用としてソースに残るが、Cloudflare Pagesの静的公開には不使用 |

高解像度原本は別保存し、公開用には用途別WebPを使用しています。公開用の小さなUIで原寸PNGを直接配信しない構成です。

## 最終検証結果

| 検証対象 | 結果 |
|---|---|
| PC相当表示 | 1280px幅でトップ、作品一覧、診断、About、依頼、作品ページを撮影・確認 |
| iOS相当表示 | 390px幅でトップ、作品一覧、診断、About、依頼、作品ページを確認 |
| Android相当表示 | 360px幅で同じ主要ページを確認 |
| 直アクセス | 公開ドメインの主要ルートと作品URLでHTTP 200を確認 |
| 深いURL | `/works/...`、`/diagnosis`、`/about`、`/commission`で直アクセス・リロードを確認 |
| 水平オーバーフロー | PC相当の実DOM検査でトップ・診断とも `scrollWidth === clientWidth` |
| 画像読み込み | トップ・診断の実DOM検査で未読込画像0件 |
| 作品サンプル | 横方向ビューア、スワイプ前提のレイアウト、拡大・ページ移動・閉じる導線を確認 |
| 診断 | 通常結果とGAME OVERをDOMセレクターで完走 |
| 共有 | 通常結果、GAME OVER、作品ページのX共有URLと共有文を確認 |
| アセット | 代表的なロゴ、キャラクターWebP、OGP、診断JSON、robots.txt、sitemap.xmlがHTTP 200 |

診断のボタン検証では、画面更新後に古いブラウザ要素番号を再利用するとXリンクを誤クリックする現象が検証側で起きました。DOMセレクターを使った実操作では質問遷移に問題はなく、サイトの質問ボタン不具合ではないと判断しています。

## 既知の注意点

Xはカード情報を一定期間キャッシュするため、OGP画像や本文を更新した直後に古いカードが表示される場合があります。更新後の確認・共有には、次のようにURL末尾へクエリを付けたURLを使用してください。

```text
https://hatsukoi-lab.com/works/ginpatsu?v=20260816
https://hatsukoi-lab.com/diagnosis/gameover?case=glasses&v=20260816
```

クエリはキャッシュ回避用であり、サイト内の診断結果や作品ページの表示内容を変更するものではありません。すでに確定している共有導線では、GAME OVERの台詞を1行ずつ個別の引用符と改行で保持しています。

## Cloudflare Pagesでの今後の更新方法

まずローカルでソースを更新し、必要に応じてテストを実行します。その後、本番ドメインを指定して静的ビルドを作成します。

```bash
pnpm install
pnpm test
SITE_URL=https://hatsukoi-lab.com pnpm build:web
```

次に、Cloudflare Pagesの対象プロジェクトで **Deployments** からDirect Uploadを選び、`dist/public` の中身をアップロードします。`dist`フォルダ自体ではなく、公開ディレクトリの中身を指定する点に注意してください。アップロード後、トップページ、更新したページ、更新したOGP URLを実機で確認します。

ソースのバックアップとしては、本納品ZIPを保管し、次回以降も同じプロジェクトルートからビルドしてください。画像を追加する場合は、公開用途の軽量WebPを用意し、データファイルの参照先と静的アセットマニフェストを更新します。

## 公開前に残っている作業

機能上の必須作業はありません。今後必要になるのは、作品やサンプルの追加、外部販売リンクの更新、OGP画像の差し替え、文章の更新などの通常運用です。更新時は必ず `pnpm test` と `pnpm build:web` を通し、生成された `dist/public` を公開してください。

## 参照

[1]: https://developers.cloudflare.com/pages/configuration/build-configuration/ "Cloudflare Pages — Build configuration"
[2]: https://developers.cloudflare.com/pages/configuration/redirects/ "Cloudflare Pages — Redirects"
[3]: https://developers.cloudflare.com/pages/configuration/serving-pages/ "Cloudflare Pages — Serving Pages"
