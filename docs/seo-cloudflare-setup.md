# 初恋ラボ SEO運用・Cloudflare設定

## 実装済みのSEO対応

`pnpm build:web` は、トップ、ヒロイン一覧、診断、依頼、About、9作品、診断共有ページを静的HTMLとして生成します。生成された各ページには、そのページ自身を指す絶対URLの `rel="canonical"` と `og:url`、主題を表す `h1` を1件ずつ出力します。

トップページには、アセットマニフェストから解決した `round_full_512` ロゴを使用する `Organization` JSON-LDを1件、各作品ページには作品タイトルを現在地とする `BreadcrumbList` JSON-LDを1件出力します。`/about` は専用のtitle、description、canonical、OGPを持つprerenderページとして生成されます。

## Cloudflare Pagesの手動設定

`hatsukoilab.pages.dev` から `hatsukoi-lab.com` へのホスト名単位の301リダイレクトは、Pagesプロジェクトのコードだけで完全に保証する設定ではありません。Cloudflare Dashboardで、対象Pagesプロジェクトの独自ドメイン設定またはRedirect Rulesを開き、次のルールを作成してください。

| 項目 | 設定値 |
|---|---|
| 対象 | `hatsukoilab.pages.dev/*` |
| 転送先 | `https://hatsukoi-lab.com/$1` または同等のパス保持設定 |
| ステータス | `301 Permanent Redirect` |
| クエリ | 保持 |

設定後、`curl -I https://hatsukoilab.pages.dev/` と `curl -I https://hatsukoilab.pages.dev/works/ginpatsu` を実行し、`Location` が同じパスの `https://hatsukoi-lab.com/` に向くことを確認してください。Cloudflareの仕様やUI表示は変更される可能性があるため、画面上の「Redirect Rules」またはPagesのドメインリダイレクト機能を利用します。

## Google Search Console

サイト管理者側で [Google Search Console](https://search.google.com/search-console) に `hatsukoi-lab.com` を登録し、所有権確認後に `https://hatsukoi-lab.com/sitemap.xml` を送信してください。Search Consoleでは、ブランド名・作品名・「童貞探偵」などの固有名詞検索での表示状況と、各ページがインデックスされたかを確認できます。

## 更新手順

内容を更新した後は、プロジェクトルートで `pnpm test`、続いて `SITE_URL=https://hatsukoi-lab.com pnpm build:web`、最後に `pnpm verify:web` を実行します。Cloudflare PagesへDirect Uploadする場合は、生成された `dist/public` の中身をアップロードしてください。

## 注意事項

成人向け作品ページは、作品名による正確な検索導線を目的としています。一般語での上位表示を狙う大量の記事追加や、不正確なキーワード追加は行いません。canonical、JSON-LD、OGPは検索エンジンへの補助情報であり、検索順位やインデックスを保証するものではありません。
