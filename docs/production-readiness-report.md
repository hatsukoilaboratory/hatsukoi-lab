# 初恋ラボ｜本番公開準備レポート

## 結論

本プロジェクトは、**`dist/public`のみを通常の静的ホスティングへ配置できる構成**へ移行した。アプリ本体、画像、ロゴ、診断素材、サンプル、UI装飾はすべてビルド出力に同梱され、実行時にManus Storage、Manus runtime、storage proxy、debug collector、Manusドメインを参照しない。

## Manus依存の監査結果

| 対象 | 対応 | 状態 |
|---|---|---|
| `/manus-storage/` の115アセット | `client/public/assets/`へ静的ファイルとして取り込み、全参照を`/assets/`へ置換 | 削除済み |
| Manus Storage Proxy | Vite設定から削除 | 削除済み |
| Manus runtime plugin | Vite設定と依存関係から削除 | 削除済み |
| Manus debug collector | Vite設定、公開HTML、`client/public/__manus__/`から削除 | 削除済み |
| Manus環境専用分析スクリプト | 公開HTMLから削除 | 削除済み |
| Manusドメインの診断共有フォールバック | 相対パスへ変更 | 削除済み |
| Manusドメインのrobots/sitemap | ビルド時の`SITE_URL`から生成 | 削除済み |
| 静的assets移行後のデータ検証 | `/assets/`を正規の画像パスとして検証し、公開ビルドの失敗を解消 | 修正済み |

全身立ち絵については、公開用の9枚を同じピクセル寸法の高画質WebPへ置換した。1.2〜1.5MBのPNG原本は`/home/ubuntu/webdev-static-assets/hatsukoi-standing-originals/`へ退避して保持しており、公開ビルドには含めない。これにより`dist/public`内で1MiBを超えるファイルは0件となった。

`dist/public`を検索し、`/manus-storage/`、`manus.space`、`__manus__`、Manus runtime、Forge環境変数、分析プレースホルダーは**0件**であることを確認した。

## 静的ビルド

外部公開用の標準コマンドは次のとおりである。`SITE_URL`には、本番で使用するHTTPSの正規URLを末尾のスラッシュなしで指定する。

```bash
SITE_URL=https://www.example.com pnpm build:web
```

ビルド出力ディレクトリは**`dist/public`**である。`pnpm build:web`は、robots.txtとsitemap.xmlを生成し、静的アセットマニフェストを更新したうえでViteビルドを実行する。サーバー実行、Manus環境変数、バックエンドは不要である。

## 独立検証

`dist/public`のみを`node scripts/serve-static.mjs dist/public 4173`で配信し、アプリの開発サーバーを経由せずに検証した。

| 項目 | 結果 |
|---|---|
| 直アクセス・リロード対象 | `/`、`/heroines`、`/diagnosis`、`/commission`、9作品ページ、`/404`の14ルートすべて成功 |
| アセット | アセットマニフェストに記録された115ファイルすべて成功 |
| 代表画面の目視確認 | 作品ページと診断ページでロゴ、人物、サンプル、販売導線、診断素材を確認 |
| 静的SPAフォールバック | 成功。拡張子を持つ未知アセットは404、ルートURLは`index.html`へフォールバック |

再現用の検証コマンドは次のとおりである。

```bash
pnpm preview:web
STATIC_TEST_ORIGIN=http://127.0.0.1:4173 pnpm verify:web
```

## Cloudflare Pages設定

Cloudflare Pagesのプロジェクト作成時は、リポジトリのルートを対象に、以下を設定する。

| 項目 | 設定値 |
|---|---|
| Framework preset | None または React (Vite) |
| Build command | `pnpm build:web` |
| Build output directory | `dist/public` |
| Root directory | リポジトリのルート |
| Environment variable | `SITE_URL=https://実際の公開ドメイン` |
| Node.js | 22系を推奨 |

`client/public/_redirects`には`/* /index.html 200`を配置済みであり、SPAの深いURLを`index.html`へフォールバックする。Cloudflare Pagesは、トップレベルの`404.html`がないSPAをルートへフォールバックする既定動作も提供するため、本プロジェクトでは二重に直アクセス対策を行っている。[1] [2] [3]

## 残したものと理由

| 対象 | 理由 |
|---|---|
| React / Vite / Tailwind / Wouter / shadcn系依存 | 静的ビルドとブラウザUIに必要であり、Manus専用ではない。 |
| Google Fonts | M PLUS Rounded 1cを表示する一般的な外部フォント配信。外部静的ホストでもそのまま利用できる。 |
| `server/index.ts` と Express依存 | 今回の`build:web`・`dist/public`では未使用の互換用コード。外部静的ホストへは配置不要。将来サーバー機能を追加しない限り削除してもよい。 |

## 既知の問題と公開前の残作業

| 優先度 | 内容 | 対応 |
|---|---|---|
| 必須 | 実際の公開ドメインを決める | Cloudflare Pagesの環境変数`SITE_URL`へHTTPS URLを設定して再ビルドする。 |
| 必須 | ドメイン接続後の最終確認 | 正式ドメインでrobots.txt、sitemap.xml、X共有、OGP、全深いURLのリロードを確認する。 |
| 推奨 | OGPのSNS検証 | X等のカード検証ツールで、相対アセットURLを含むOGP表示を確認する。必要なら本番ドメインを含む絶対URLへ固定する。 |
| 推奨 | バンドル最適化 | 初回JavaScriptは約673KB（minify後）。公開自体は可能だが、将来は診断ページなどの遅延読み込みで初期転送量をさらに削減できる。 |
| 任意 | 互換用Expressコードの整理 | 純粋な静的ホスティングを継続するなら`server/`とExpress依存を後続の整理対象にできる。 |

## 追加した公開導線

作品ページには、個別のFANZA・DLsite・BOOTH導線に加えて、作者・作品検索ページとして**Amazon、コミックシーモア、楽天ブックス**への共通電子書籍ストア導線を追加した。GAME OVER画面の「童貞探偵事務所を読む」は、指定された公式X投稿へ接続している。

## 参照

[1]: https://developers.cloudflare.com/pages/configuration/build-configuration/ "Cloudflare Pages — Build configuration"
[2]: https://developers.cloudflare.com/pages/configuration/redirects/ "Cloudflare Pages — Redirects"
[3]: https://developers.cloudflare.com/pages/configuration/serving-pages/ "Cloudflare Pages — Serving Pages"
